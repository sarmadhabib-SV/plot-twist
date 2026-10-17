// server/game.js — pure game logic: rooms, suspect assignment, voting, results.
// No I/O here; the state machine wiring lives in server/index.js.

export function createPlayer(id, name) {
  return {
    id,
    name: String(name || 'Detective').slice(0, 24),
    socketId: null,
    connected: true,
    isHost: false,
    // assigned at deal time:
    suspectName: null,
    occupation: null,
    relation: null,
    secret: null,
    isCulprit: false,
  };
}

export function createRoom(code, hostPlayer) {
  hostPlayer.isHost = true;
  return {
    code,
    phase: 'lobby', // lobby → generating → crime → characters → investigation → interrogation → vote → plea → reveal
    vibe: 'noir',
    hostId: hostPlayer.id,
    players: [hostPlayer],
    scenario: null,
    aiSuspects: [], // filler personas: {name, occupation, relation, secret, isCulprit}
    clueRound: 0,
    revealedClues: [], // {round, text}
    chat: [], // {from, text, ts}
    interrogation: [], // {kind:'q'|'a'|'gm'|'sys', suspectName, by, text, ts}
    votes: {}, // playerId -> suspectName
    plea: null, // {by, text}
    result: null,
    reveal: null,
    timer: null, // {id, endsAt, label} — managed by index.js
    createdAt: Date.now(),
    lastActive: Date.now(),
  };
}

export function addPlayer(room, player) {
  // keep display names unique-ish
  const base = player.name;
  let n = 2;
  while (room.players.some((p) => p.name === player.name)) {
    player.name = `${base} ${n++}`;
  }
  room.players.push(player);
  room.lastActive = Date.now();
  return player;
}

export function getPlayer(room, playerId) {
  return room.players.find((p) => p.id === playerId) || null;
}

export function connectedHumans(room) {
  return room.players.filter((p) => p.connected);
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

// Deal suspect personas: humans get the first H shuffled personas (with full
// secret cards); the rest become AI filler suspects. Exactly one culprit total.
export function setupGame(room, scenario) {
  const humans = room.players; // everyone present at deal gets a card
  const n = Math.max(5, humans.length);
  let suspects = (scenario.suspects || []).slice(0, n).map((s) => ({ ...s }));

  // Pad with innocent extras if the AI returned too few.
  const extras = [
    { name: 'Theo Park', occupation: 'sound technician', relation: 'worked the venue that night', secret: 'Bootlegs live recordings of every show.', isCulprit: false },
    { name: 'Grace Liu', occupation: 'food critic', relation: 'was reviewing the venue', secret: 'Secretly related to the victim.', isCulprit: false },
    { name: 'Big Mike Russo', occupation: 'bouncer', relation: 'worked the door', secret: 'Took a bribe to let someone in the back.', isCulprit: false },
    { name: 'Nina Petrova', occupation: 'coat-check attendant', relation: 'saw everyone arrive', secret: 'Pocketed a lost diamond earring.', isCulprit: false },
  ];
  let ei = 0;
  while (suspects.length < n) {
    suspects.push({ ...extras[ei++ % extras.length], name: `${extras[(ei - 1) % extras.length].name}` });
  }
  // Guarantee exactly one culprit, then shuffle.
  let culprits = suspects.filter((s) => s.isCulprit);
  if (culprits.length === 0) suspects[suspects.length - 1].isCulprit = true;
  if (culprits.length > 1) culprits.slice(1).forEach((s) => { s.isCulprit = false; });
  suspects = shuffle(suspects);

  humans.forEach((p, i) => {
    const s = suspects[i];
    p.suspectName = s.name;
    p.occupation = s.occupation;
    p.relation = s.relation;
    p.secret = s.secret;
    p.isCulprit = !!s.isCulprit;
  });
  room.aiSuspects = suspects.slice(humans.length).map((s) => ({ ...s }));
  room.scenario = scenario;
}

// Every suspect in play (humans + AI fillers), public info only.
export function allSuspects(room) {
  const humans = room.players
    .filter((p) => p.suspectName)
    .map((p) => ({
      name: p.suspectName,
      occupation: p.occupation,
      relation: p.relation,
      isAI: false,
      playedBy: p.name,
      connected: p.connected,
    }));
  const ai = (room.aiSuspects || []).map((s) => ({
    name: s.name,
    occupation: s.occupation,
    relation: s.relation,
    isAI: true,
    playedBy: null,
    connected: true,
  }));
  return [...humans, ...ai];
}

// Secret-bearing suspect object for AI roleplay/plea (server-side only).
export function suspectTruth(room, suspectName) {
  const hp = room.players.find((p) => p.suspectName === suspectName);
  if (hp) {
    return { name: hp.suspectName, occupation: hp.occupation, relation: hp.relation, secret: hp.secret, isCulprit: hp.isCulprit, isAI: false, player: hp };
  }
  const ai = (room.aiSuspects || []).find((s) => s.name === suspectName);
  if (ai) return { ...ai, isAI: true, player: null };
  return null;
}

export function culpritName(room) {
  const hp = room.players.find((p) => p.isCulprit && p.suspectName);
  if (hp) return hp.suspectName;
  const ai = (room.aiSuspects || []).find((s) => s.isCulprit);
  return ai ? ai.name : null;
}

export function recordVote(room, playerId, suspectName) {
  room.votes[playerId] = suspectName;
  room.lastActive = Date.now();
}

export function votesNeeded(room) {
  return connectedHumans(room).length;
}

// Majority wins; ties (or no votes) mean the culprit survives.
export function tallyVotes(room) {
  const counts = {};
  for (const pid of Object.keys(room.votes)) {
    const voter = getPlayer(room, pid);
    if (!voter || !voter.connected) continue; // away players' votes don't count
    const name = room.votes[pid];
    counts[name] = (counts[name] || 0) + 1;
  }
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const culprit = culpritName(room);
  if (entries.length === 0) {
    return { counts, top: null, topVotes: 0, tied: true, culprit, culpritCaught: false };
  }
  const topVotes = entries[0][1];
  const tied = entries.filter((e) => e[1] === topVotes).length > 1;
  const top = entries[0][0];
  return { counts, top, topVotes, tied, culprit, culpritCaught: !tied && top === culprit };
}

export function resetForRematch(room) {
  room.phase = 'lobby';
  room.scenario = null;
  room.aiSuspects = [];
  room.clueRound = 0;
  room.revealedClues = [];
  room.chat = [];
  room.interrogation = [];
  room.votes = {};
  room.plea = null;
  room.result = null;
  room.reveal = null;
  room.vibe = 'noir';
  for (const p of room.players) {
    p.suspectName = null;
    p.occupation = null;
    p.relation = null;
    p.secret = null;
    p.isCulprit = false;
  }
  room.lastActive = Date.now();
}

// Public snapshot — NEVER includes secrets or isCulprit flags.
export function publicState(room) {
  return {
    code: room.code,
    phase: room.phase,
    vibe: room.vibe,
    hostId: room.hostId,
    players: room.players.map((p) => ({
      id: p.id,
      name: p.name,
      connected: p.connected,
      isHost: p.isHost,
      hasCard: !!p.suspectName,
    })),
    suspects: room.scenario ? allSuspects(room) : [],
    clueRound: room.clueRound,
    revealedClues: room.revealedClues,
    chat: room.chat.slice(-100),
    interrogation: room.interrogation.slice(-100),
    votes: voteCounts(room),
    votesCast: Object.keys(room.votes).filter((pid) => {
      const v = getPlayer(room, pid);
      return v && v.connected;
    }).length,
    votesNeeded: votesNeeded(room),
    myVote: undefined, // filled per-socket in index.js
    plea: room.plea,
    crimeNarration: room.crimeNarration || null,
    crimeFacts: room.scenario
      ? {
          victim: room.scenario.victim,
          setting: room.scenario.setting,
          method: room.scenario.method,
          timeline: room.scenario.timeline || [],
        }
      : null,
    result: room.result
      ? { top: room.result.top, topVotes: room.result.topVotes, tied: room.result.tied, culpritCaught: room.result.culpritCaught }
      : null,
    reveal: room.reveal,
  };
}

function voteCounts(room) {
  const counts = {};
  for (const pid of Object.keys(room.votes)) {
    const voter = getPlayer(room, pid);
    if (!voter || !voter.connected) continue;
    counts[room.votes[pid]] = (counts[room.votes[pid]] || 0) + 1;
  }
  return counts;
}

// Private card for one player.
export function playerCard(room, playerId) {
  const p = getPlayer(room, playerId);
  if (!p || !p.suspectName) return null;
  return {
    name: p.suspectName,
    occupation: p.occupation,
    relation: p.relation,
    secret: p.secret,
    isCulprit: p.isCulprit,
  };
}
