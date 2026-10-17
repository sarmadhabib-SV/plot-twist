// server/index.js — Plot Twist game server.
// Serves the static client and runs the Socket.IO game state machine.
// Run: npm install && npm start   (optional: server/.env with OPENAI_API_KEY)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import * as ai from './ai.js';
import * as game from './game.js';

dotenv.config({ path: new URL('./.env', import.meta.url) });

const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_DIR = path.join(__dirname, '..', 'client');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// ---------------------------------------------------------------------------
// Static file server
// ---------------------------------------------------------------------------
function serveStatic(req, res) {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.normalize(path.join(CLIENT_DIR, urlPath));
  if (!filePath.startsWith(CLIENT_DIR)) {
    res.writeHead(403); res.end('forbidden'); return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  });
}

const httpServer = http.createServer((req, res) => {
  if (req.method === 'GET') return serveStatic(req, res);
  res.writeHead(405); res.end('method not allowed');
});

const io = new Server(httpServer, { cors: { origin: '*' } });

// ---------------------------------------------------------------------------
// Room registry
// ---------------------------------------------------------------------------
const rooms = new Map(); // code -> room
const socketMap = new Map(); // socketId -> { code, playerId }

const CODE_LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // no I/O (confusable)
function genCode() {
  let code;
  do {
    code = Array.from({ length: 4 }, () => CODE_LETTERS[Math.floor(Math.random() * CODE_LETTERS.length)]).join('');
  } while (rooms.has(code));
  return code;
}

function emitState(room) {
  const base = game.publicState(room);
  for (const p of room.players) {
    if (!p.socketId) continue;
    const sock = io.sockets.sockets.get(p.socketId);
    if (!sock) continue;
    sock.emit('roomState', { ...base, myVote: room.votes[p.id] || null, you: p.id });
  }
}

function clearTimer(room) {
  if (room.timer) {
    clearTimeout(room.timer.id);
    room.timer = null;
  }
}

function startTimer(room, seconds, label, onEnd) {
  clearTimer(room);
  const endsAt = Date.now() + seconds * 1000;
  const id = setTimeout(() => {
    room.timer = null;
    io.to(room.code).emit('timerEnded');
    onEnd();
  }, seconds * 1000);
  room.timer = { id, endsAt, label };
  io.to(room.code).emit('timerStarted', { endsAt, label, seconds });
}

function getRoom(code) {
  return rooms.get(String(code || '').toUpperCase()) || null;
}

function isHost(room, playerId) {
  return room.hostId === playerId;
}

function hostOf(room) {
  return game.getPlayer(room, room.hostId);
}

function ensureHost(room) {
  const h = hostOf(room);
  if (h && h.connected) return;
  const next = room.players.find((p) => p.connected) || room.players[0];
  if (next) {
    for (const p of room.players) p.isHost = false;
    next.isHost = true;
    room.hostId = next.id;
  }
}

// ---------------------------------------------------------------------------
// Game flow
// ---------------------------------------------------------------------------

async function startGame(room) {
  room.phase = 'generating';
  room.vibe = room.vibe || 'noir';
  emitState(room);
  try {
    const count = Math.max(5, room.players.length);
    const scenario = await ai.generateScenario(room.vibe, count);
    game.setupGame(room, scenario);
    const narration = await ai.narrate('crime', {
      vibe: room.vibe,
      victim: scenario.victim,
      setting: scenario.setting,
      method: scenario.method,
    });
    room.phase = 'crime';
    room.crimeNarration = narration;
    room.lastActive = Date.now();
    emitState(room);
    // private cards
    for (const p of room.players) {
      if (!p.socketId) continue;
      const sock = io.sockets.sockets.get(p.socketId);
      if (sock) sock.emit('yourCard', game.playerCard(room, p.id));
    }
  } catch (err) {
    console.error('startGame failed:', err);
    room.phase = 'lobby';
    emitState(room);
    io.to(room.code).emit('errorMsg', { message: 'Could not start the game. Please try again.' });
  }
}

function advanceFromCrime(room) {
  // deal is done in startGame; this just moves to the card screen (already dealt)
  room.phase = 'characters';
  emitState(room);
}

async function beginInvestigation(room) {
  room.phase = 'investigation';
  emitState(room);
  await startClueRound(room, 1);
}

async function startClueRound(room, n) {
  room.clueRound = n;
  const clue = room.scenario.clues[n - 1];
  let text;
  try {
    text = await ai.narrate('clue', { vibe: room.vibe, clue });
  } catch {
    text = clue;
  }
  room.revealedClues.push({ round: n, text });
  room.lastActive = Date.now();
  emitState(room);
  startTimer(room, 90, `Round ${n} discussion`, () => endClueRound(room));
}

function endClueRound(room) {
  if (room.phase !== 'investigation') return;
  if (room.clueRound < 3) {
    startClueRound(room, room.clueRound + 1).catch((e) => console.error(e));
  } else {
    clearTimer(room);
    room.phase = 'interrogation';
    room.lastActive = Date.now();
    emitState(room);
  }
}

function beginVote(room) {
  clearTimer(room);
  room.phase = 'vote';
  room.votes = {};
  room.lastActive = Date.now();
  emitState(room);
}

function maybeFinishVoting(room) {
  if (room.phase !== 'vote') return;
  if (game.connectedHumans(room).length === 0) return;
  const cast = Object.keys(room.votes).filter((pid) => {
    const v = game.getPlayer(room, pid);
    return v && v.connected;
  }).length;
  if (cast >= game.votesNeeded(room)) finishVoting(room);
}

async function finishVoting(room) {
  if (room.phase !== 'vote') return;
  clearTimer(room);
  const result = game.tallyVotes(room);
  room.result = result;
  room.phase = 'plea';
  emitState(room);

  const accusedName = result.top; // may be null on zero votes
  const truth = room.scenario.truth;
  let pleaText = null;
  let pleaBy = accusedName || 'The accused';

  if (accusedName) {
    const t = game.suspectTruth(room, accusedName);
    if (t && !t.isAI && t.player && t.player.connected && t.player.socketId) {
      // Human plea: ask them, 30s timer, host can skip.
      const sock = io.sockets.sockets.get(t.player.socketId);
      if (sock) {
        sock.emit('pleaRequested', { suspectName: accusedName });
        startTimer(room, 30, 'Final plea', async () => {
          await deliverPlea(room, pleaBy, fallbackPleaText(pleaBy));
        });
        return;
      }
    }
    if (t) {
      try {
        pleaText = await ai.plea(
          { name: t.name, occupation: t.occupation, isCulprit: t.isCulprit },
          truth
        );
      } catch { /* fallback below */ }
    }
  }
  await deliverPlea(room, pleaBy, pleaText || fallbackPleaText(pleaBy));
}

function fallbackPleaText(name) {
  return `"${name} looks every one of you in the eye. "I'm innocent — I swear it. Look at the clues, not at me. You've got one chance to get this right."`;
}

async function deliverPlea(room, by, text) {
  if (room.phase !== 'plea') return;
  clearTimer(room);
  room.plea = { by, text };
  room.lastActive = Date.now();
  emitState(room);
  // beat, then the reveal
  setTimeout(() => doReveal(room), 7000);
}

async function doReveal(room) {
  if (room.phase === 'reveal') return;
  room.phase = 'revealing';
  emitState(room);
  const truth = room.scenario.truth;
  let narration;
  try {
    narration = await ai.narrate('reveal', { vibe: room.vibe, truth });
  } catch {
    narration = truth;
  }
  const culprit = game.culpritName(room);
  const caught = room.result ? room.result.culpritCaught : false;
  const winners = room.players
    .filter((p) => (caught ? !p.isCulprit : p.isCulprit))
    .map((p) => p.name);
  room.reveal = {
    narration,
    culprit,
    story: truth,
    victim: room.scenario.victim,
    caught,
    tied: room.result ? room.result.tied : false,
    winners,
    playerResults: room.players.map((p) => ({
      name: p.name,
      suspectName: p.suspectName,
      isCulprit: p.isCulprit,
      won: caught ? !p.isCulprit : p.isCulprit,
    })),
    secrets: game.allSuspects(room).map((s) => {
      const t = game.suspectTruth(room, s.name);
      return { name: s.name, secret: t ? t.secret : '' };
    }),
    votes: room.result ? room.result.counts : {},
  };
  room.phase = 'reveal';
  room.lastActive = Date.now();
  emitState(room);
}

// ---------------------------------------------------------------------------
// Socket handlers
// ---------------------------------------------------------------------------
io.on('connection', (socket) => {
  const ctx = () => socketMap.get(socket.id) || {};
  const myRoom = () => {
    const c = ctx();
    const room = c.code ? rooms.get(c.code) : null;
    const player = room ? game.getPlayer(room, c.playerId) : null;
    return { room, player };
  };

  socket.on('createRoom', ({ name } = {}) => {
    const clean = String(name || '').trim().slice(0, 24) || 'Detective';
    const code = genCode();
    const player = game.createPlayer(randomUUID(), clean);
    player.socketId = socket.id;
    const room = game.createRoom(code, player);
    rooms.set(code, room);
    socketMap.set(socket.id, { code, playerId: player.id });
    socket.join(code);
    socket.emit('roomCreated', { code, playerId: player.id });
    emitState(room);
  });

  socket.on('joinRoom', ({ code, name } = {}) => {
    const room = getRoom(code);
    if (!room) return socket.emit('joinError', { message: 'No room with that code. Check the letters and try again.' });
    if (room.phase !== 'lobby') return socket.emit('joinError', { message: 'That game already started. Ask the host for the next one.' });
    if (room.players.length >= 8) return socket.emit('joinError', { message: 'That room is full (8 players max).' });
    const clean = String(name || '').trim().slice(0, 24) || 'Detective';
    const player = game.createPlayer(randomUUID(), clean);
    player.socketId = socket.id;
    game.addPlayer(room, player);
    socketMap.set(socket.id, { code: room.code, playerId: player.id });
    socket.join(room.code);
    socket.emit('joined', { playerId: player.id });
    emitState(room);
  });

  socket.on('rejoin', ({ code, playerId } = {}) => {
    const room = getRoom(code);
    const player = room ? game.getPlayer(room, playerId) : null;
    if (!room || !player) return socket.emit('rejoinError', {});
    player.socketId = socket.id;
    player.connected = true;
    ensureHost(room);
    socketMap.set(socket.id, { code: room.code, playerId: player.id });
    socket.join(room.code);
    socket.emit('rejoined', { playerId: player.id });
    socket.emit('yourCard', game.playerCard(room, player.id));
    emitState(room);
    maybeFinishVoting(room);
  });

  socket.on('setVibe', ({ vibe } = {}) => {
    const { room, player } = myRoom();
    if (!room || !player || !isHost(room, player.id) || room.phase !== 'lobby') return;
    if (['noir', 'haunted', 'scifi', 'comedy'].includes(vibe)) {
      room.vibe = vibe;
      emitState(room);
    }
  });

  socket.on('startGame', () => {
    const { room, player } = myRoom();
    if (!room || !player || !isHost(room, player.id) || room.phase !== 'lobby') return;
    if (room.players.length < 2) {
      return socket.emit('errorMsg', { message: 'Need at least 2 players to start.' });
    }
    startGame(room).catch((e) => console.error(e));
  });

  // Host advances: crime → characters → investigation → interrogation → vote
  socket.on('advancePhase', () => {
    const { room, player } = myRoom();
    if (!room || !player || !isHost(room, player.id)) return;
    room.lastActive = Date.now();
    if (room.phase === 'crime') advanceFromCrime(room);
    else if (room.phase === 'characters') beginInvestigation(room).catch((e) => console.error(e));
    else if (room.phase === 'interrogation') beginVote(room);
    // investigation rounds, vote tally, and plea auto-advance; nothing to do otherwise
  });

  socket.on('skipTimer', () => {
    const { room, player } = myRoom();
    if (!room || !player || !isHost(room, player.id)) return;
    if (room.timer) {
      const t = room.timer;
      clearTimer(room);
      io.to(room.code).emit('timerEnded');
      // replicate the natural end-of-timer behavior
      if (room.phase === 'investigation') endClueRound(room);
      else if (room.phase === 'plea' && room.plea === null) {
        // plea timer skipped before human answered: use fallback plea
        const accused = room.result && room.result.top;
        deliverPlea(room, accused || 'The accused', fallbackPleaText(accused || 'The accused')).catch((e) => console.error(e));
      }
    }
  });

  socket.on('chat', ({ text } = {}) => {
    const { room, player } = myRoom();
    if (!room || !player) return;
    const clean = String(text || '').trim().slice(0, 300);
    if (!clean) return;
    room.chat.push({ from: player.name, text: clean, ts: Date.now() });
    room.lastActive = Date.now();
    emitState(room);
  });

  socket.on('askSuspect', async ({ suspectName, question } = {}) => {
    const { room, player } = myRoom();
    if (!room || !player || room.phase !== 'interrogation') return;
    const q = String(question || '').trim().slice(0, 300);
    if (!q || !suspectName) return;
    const target = game.suspectTruth(room, suspectName);
    if (!target) return socket.emit('errorMsg', { message: 'Unknown suspect.' });

    room.interrogation.push({ kind: 'q', suspectName, by: player.name, text: q, ts: Date.now() });
    emitState(room);

    if (!target.isAI && target.player && target.player.connected && target.player.socketId) {
      const sock = io.sockets.sockets.get(target.player.socketId);
      if (sock) {
        sock.emit('questionForYou', { from: player.name, question: q, suspectName });
        return;
      }
    }
    if (!target.isAI) {
      room.interrogation.push({ kind: 'sys', text: `${suspectName} is away from the table.`, ts: Date.now() });
      emitState(room);
      return;
    }
    // AI filler suspect answers in character
    try {
      const answer = await ai.roleplay(
        { name: target.name, occupation: target.occupation, relation: target.relation, secret: target.secret, isCulprit: target.isCulprit },
        q,
        room.scenario.truth
      );
      if (room.phase === 'interrogation') {
        room.interrogation.push({ kind: 'a', suspectName, by: `${suspectName} (AI)`, text: answer, ts: Date.now() });
        emitState(room);
      }
    } catch (e) {
      console.error('roleplay failed', e);
    }
  });

  socket.on('answerQuestion', ({ text } = {}) => {
    const { room, player } = myRoom();
    if (!room || !player || !player.suspectName) return;
    const clean = String(text || '').trim().slice(0, 500);
    if (!clean) return;
    room.interrogation.push({ kind: 'a', suspectName: player.suspectName, by: player.name, text: clean, ts: Date.now() });
    room.lastActive = Date.now();
    emitState(room);
  });

  socket.on('askGM', async ({ question } = {}) => {
    const { room, player } = myRoom();
    if (!room || !player || room.phase !== 'interrogation') return;
    const q = String(question || '').trim().slice(0, 300);
    if (!q) return;
    room.interrogation.push({ kind: 'q', suspectName: 'Game Master', by: player.name, text: q, ts: Date.now() });
    emitState(room);
    try {
      const answer = await ai.gameMaster(q, room.scenario.truth, `phase: interrogation, suspects: ${game.allSuspects(room).map((s) => s.name).join(', ')}`);
      if (room.phase === 'interrogation') {
        room.interrogation.push({ kind: 'gm', suspectName: 'Game Master', by: 'Game Master', text: answer, ts: Date.now() });
        emitState(room);
      }
    } catch (e) {
      console.error('gameMaster failed', e);
    }
  });

  socket.on('vote', ({ suspectName } = {}) => {
    const { room, player } = myRoom();
    if (!room || !player || room.phase !== 'vote') return;
    if (!game.suspectTruth(room, suspectName)) return socket.emit('errorMsg', { message: 'Unknown suspect.' });
    game.recordVote(room, player.id, suspectName);
    emitState(room);
    maybeFinishVoting(room);
  });

  socket.on('submitPlea', ({ text } = {}) => {
    const { room, player } = myRoom();
    if (!room || !player || room.phase !== 'plea') return;
    const accused = room.result && room.result.top;
    if (!accused || player.suspectName !== accused) return; // only the accused speaks
    const clean = String(text || '').trim().slice(0, 500) || fallbackPleaText(accused);
    deliverPlea(room, accused, clean).catch((e) => console.error(e));
  });

  socket.on('rematch', () => {
    const { room, player } = myRoom();
    if (!room || !player || !isHost(room, player.id)) return;
    clearTimer(room);
    game.resetForRematch(room);
    ensureHost(room);
    emitState(room);
    for (const p of room.players) {
      if (!p.socketId) continue;
      const sock = io.sockets.sockets.get(p.socketId);
      if (sock) sock.emit('yourCard', null);
    }
  });

  socket.on('disconnect', () => {
    const { room, player } = myRoom();
    socketMap.delete(socket.id);
    if (!room || !player) return;
    player.connected = false;
    player.socketId = null;
    room.lastActive = Date.now();
    ensureHost(room);
    // If we were waiting on this player's vote or plea, move on.
    maybeFinishVoting(room);
    if (room.phase === 'plea' && room.plea === null && room.result && room.result.top) {
      const accused = game.suspectTruth(room, room.result.top);
      if (accused && !accused.isAI && accused.player && accused.player.id === player.id) {
        clearTimer(room);
        ai.plea({ name: accused.name, occupation: accused.occupation, isCulprit: accused.isCulprit }, room.scenario.truth)
          .then((text) => deliverPlea(room, accused.name, text))
          .catch(() => deliverPlea(room, accused.name, fallbackPleaText(accused.name)));
      }
    }
    emitState(room);
  });
});

// Sweep dead rooms every 10 minutes.
setInterval(() => {
  const now = Date.now();
  for (const [code, room] of rooms) {
    const anyone = room.players.some((p) => p.connected);
    if (!anyone && now - room.lastActive > 30 * 60 * 1000) {
      clearTimer(room);
      rooms.delete(code);
    }
  }
}, 10 * 60 * 1000);

httpServer.listen(PORT, () => {
  console.log(`Plot Twist running at http://localhost:${PORT}`);
  if (!process.env.OPENAI_API_KEY) {
    console.log('(no OPENAI_API_KEY set — backup mystery will be used)');
  }
});
