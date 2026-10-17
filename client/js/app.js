// client/js/app.js — Plot Twist single-page client.
const socket = io();

const S = {
  code: null,
  playerId: null,
  name: null,
  state: null,
  card: null,
  timerInt: null,
};

const $ = (id) => document.getElementById(id);
const esc = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function show(id) {
  document.querySelectorAll('.screen').forEach((el) => el.classList.remove('active'));
  $(id).classList.add('active');
  window.scrollTo(0, 0);
}

let toastT = null;
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.add('hidden'), 3200);
}

function saveSession() {
  sessionStorage.setItem('plot-twist', JSON.stringify({ code: S.code, playerId: S.playerId, name: S.name }));
}
function loadSession() {
  try {
    return JSON.parse(sessionStorage.getItem('plot-twist') || 'null');
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Timer
// ---------------------------------------------------------------------------
function startTimer(endsAt, label, fillId, textId) {
  stopTimer();
  const fill = $(fillId);
  const text = $(textId);
  const total = endsAt - Date.now();
  const tick = () => {
    const left = Math.max(0, endsAt - Date.now());
    const pct = total > 0 ? (left / total) * 100 : 0;
    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = left > 0 ? `${label} — ${Math.ceil(left / 1000)}s left` : `${label} — time!`;
    if (left <= 0) stopTimer();
  };
  tick();
  S.timerInt = setInterval(tick, 500);
}
function stopTimer() {
  if (S.timerInt) clearInterval(S.timerInt);
  S.timerInt = null;
}

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------
let modalCb = null;
function openModal(title, body, placeholder, cb) {
  $('modal-title').textContent = title;
  $('modal-body').textContent = body;
  const input = $('modal-input');
  input.value = '';
  input.placeholder = placeholder || '';
  modalCb = cb;
  $('modal').classList.remove('hidden');
  setTimeout(() => input.focus(), 100);
}
function closeModal() {
  $('modal').classList.add('hidden');
  modalCb = null;
}
$('modal-send').addEventListener('click', () => {
  const v = $('modal-input').value.trim();
  if (modalCb) modalCb(v);
  closeModal();
});

// ---------------------------------------------------------------------------
// Landing
// ---------------------------------------------------------------------------
$('btn-create').addEventListener('click', () => {
  const name = $('name-input').value.trim() || 'Detective';
  S.name = name;
  socket.emit('createRoom', { name });
});
$('btn-join').addEventListener('click', () => {
  const name = $('name-input').value.trim() || 'Detective';
  const code = $('code-input').value.trim().toUpperCase();
  if (code.length !== 4) return landingError('Enter the 4-letter room code.');
  S.name = name;
  socket.emit('joinRoom', { code, name });
});
function landingError(msg) {
  const e = $('landing-error');
  e.textContent = msg;
  e.classList.remove('hidden');
}

// Rejoin banner
(function () {
  const sess = loadSession();
  if (sess && sess.code && sess.playerId) {
    const e = $('landing-error');
    e.innerHTML = '';
    const btn = document.createElement('button');
    btn.className = 'btn btn-ghost';
    btn.style.marginTop = '12px';
    btn.textContent = `Rejoin room ${esc(sess.code)} as ${esc(sess.name || 'Detective')}`;
    btn.addEventListener('click', () => {
      S.code = sess.code; S.playerId = sess.playerId; S.name = sess.name;
      socket.emit('rejoin', { code: sess.code, playerId: sess.playerId });
    });
    e.appendChild(btn);
    e.classList.remove('hidden');
  }
})();

// ---------------------------------------------------------------------------
// Lobby
// ---------------------------------------------------------------------------
document.querySelectorAll('#vibe-picker .btn-vibe').forEach((b) => {
  b.addEventListener('click', () => socket.emit('setVibe', { vibe: b.dataset.vibe }));
});
$('btn-start').addEventListener('click', () => {
  $('btn-start').disabled = true;
  socket.emit('startGame');
});

// Phase advancement (host)
$('btn-to-characters').addEventListener('click', () => socket.emit('advancePhase'));
$('btn-to-investigation').addEventListener('click', () => socket.emit('advancePhase'));
$('btn-to-vote').addEventListener('click', () => socket.emit('advancePhase'));
$('btn-skip-timer').addEventListener('click', () => socket.emit('skipTimer'));
$('btn-skip-plea').addEventListener('click', () => socket.emit('skipTimer'));
$('btn-rematch').addEventListener('click', () => socket.emit('rematch'));

// Chat
function sendChat() {
  const v = $('chat-input').value.trim();
  if (!v) return;
  socket.emit('chat', { text: v });
  $('chat-input').value = '';
}
$('btn-chat').addEventListener('click', sendChat);
$('chat-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChat(); });

// Interrogation
function sendAsk() {
  const suspectName = $('suspect-select').value;
  const q = $('ask-input').value.trim();
  if (!suspectName || !q) return;
  socket.emit('askSuspect', { suspectName, question: q });
  $('ask-input').value = '';
}
$('btn-ask').addEventListener('click', sendAsk);
$('ask-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') sendAsk(); });
function sendGM() {
  const q = $('gm-input').value.trim();
  if (!q) return;
  socket.emit('askGM', { question: q });
  $('gm-input').value = '';
}
$('btn-gm').addEventListener('click', sendGM);
$('gm-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') sendGM(); });

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------
function isHost() {
  return S.state && S.state.hostId === S.playerId;
}

function renderHostOnly() {
  const host = isHost();
  document.querySelectorAll('.host-only').forEach((el) => el.classList.toggle('hidden', !host));
  document.querySelectorAll('.host-hidden-note').forEach((el) => el.classList.toggle('hidden', host));
  const badge = $('room-badge');
  if (S.code) { badge.textContent = S.code; badge.classList.remove('hidden'); }
}

function render(state) {
  S.state = state;
  renderHostOnly();
  switch (state.phase) {
    case 'lobby': renderLobby(state); break;
    case 'generating': show('screen-generating'); break;
    case 'crime': renderCrime(state); break;
    case 'characters': renderCharacters(state); break;
    case 'investigation': renderInvestigation(state); break;
    case 'interrogation': renderInterrogation(state); break;
    case 'vote': renderVote(state); break;
    case 'plea': renderPlea(state); break;
    case 'revealing': show('screen-revealing'); break;
    case 'reveal': renderReveal(state); break;
    default: show('screen-landing');
  }
}

function renderLobby(state) {
  show('screen-lobby');
  $('lobby-code').textContent = state.code;
  $('lobby-count').textContent = `(${state.players.length}/8)`;
  $('lobby-players').innerHTML = state.players.map((p) => `
    <li><span>${esc(p.name)} ${p.isHost ? '<span class="host-star">★ host</span>' : ''}</span>
    ${p.connected ? '' : '<span class="away">away</span>'}</li>`).join('');
  document.querySelectorAll('#vibe-picker .btn-vibe').forEach((b) => {
    b.classList.toggle('selected', b.dataset.vibe === state.vibe);
  });
  $('host-controls').classList.toggle('hidden', !isHost());
  $('lobby-waiting').classList.toggle('hidden', isHost());
  const btn = $('btn-start');
  btn.disabled = state.players.length < 2;
  btn.textContent = state.players.length < 2 ? 'Need 2+ players' : 'Start the mystery';
  $('lobby-error').classList.add('hidden');
}

function renderCrime(state) {
  show('screen-crime');
  $('crime-text').textContent = state.crimeNarration || 'The crime…';
  const f = state.crimeFacts;
  $('crime-facts').innerHTML = f ? `
    <div><strong>Victim:</strong> ${esc(f.victim)}</div>
    <div><strong>Scene:</strong> ${esc(f.setting)}</div>
    <div><strong>Cause:</strong> ${esc(f.method)}</div>
    ${f.timeline && f.timeline.length ? `<div style="margin-top:8px"><strong>Timeline:</strong><br>${f.timeline.map((t) => esc(t)).join('<br>')}</div>` : ''}` : '';
}

function renderCharacters(state) {
  show('screen-characters');
  const c = S.card;
  $('my-card').innerHTML = c ? `
    <h3>${esc(c.name)}</h3>
    <p class="occ">${esc(c.occupation)} — ${esc(c.relation)}</p>
    <p class="secret-label">Your secret — tell no one</p>
    <p>${esc(c.secret)}</p>
    ${c.isCulprit
      ? '<div class="culprit-stamp">YOU ARE THE KILLER</div><p class="dim">Lie well. Deflect. Survive the vote.</p>'
      : '<div class="innocent-stamp">INNOCENT</div><p class="dim">Find the killer. Trust no one fully.</p>'}` :
    '<p class="dim">Waiting for your card…</p>';
  $('roster').innerHTML = state.suspects.map((s) => `
    <li><span class="s-name">${esc(s.name)}</span>${s.isAI ? '<span class="ai-tag">AI</span>' : ''}
    <br><span class="s-meta">${esc(s.occupation)} — ${esc(s.relation)}${s.playedBy ? ` · played by ${esc(s.playedBy)}` : ''}</span></li>`).join('');
}

function renderInvestigation(state) {
  show('screen-investigation');
  $('clue-round').textContent = state.clueRound;
  $('clues').innerHTML = state.revealedClues.map((c) => `
    <div class="clue-card"><div class="clue-num">Clue ${c.round}</div>${esc(c.text)}</div>`).join('');
  renderChat();
}

function renderChat() {
  const log = $('chat-log');
  const state = S.state;
  log.innerHTML = state.chat.map((m) => `
    <div class="chat-msg"><span class="who">${esc(m.from)}</span><br>${esc(m.text)}</div>`).join('');
  log.scrollTop = log.scrollHeight;
}

function renderInterrogation(state) {
  show('screen-interrogation');
  const feed = $('interrogation-feed');
  feed.innerHTML = state.interrogation.map((m) => {
    if (m.kind === 'q') return `<div class="chat-msg q"><span class="who">${esc(m.by)} → ${esc(m.suspectName)}</span><br>${esc(m.text)}</div>`;
    if (m.kind === 'gm') return `<div class="chat-msg gm"><span class="who">🎩 Game Master</span><br>${esc(m.text)}</div>`;
    if (m.kind === 'sys') return `<div class="chat-msg sys">${esc(m.text)}</div>`;
    return `<div class="chat-msg"><span class="who">${esc(m.suspectName)}</span><br>${esc(m.text)}</div>`;
  }).join('');
  feed.scrollTop = feed.scrollHeight;
  const sel = $('suspect-select');
  const cur = sel.value;
  sel.innerHTML = state.suspects.map((s) => `<option value="${esc(s.name)}">${esc(s.name)}${s.isAI ? ' (AI)' : ''}</option>`).join('');
  if ([...sel.options].some((o) => o.value === cur)) sel.value = cur;
}

function renderVote(state) {
  show('screen-vote');
  const myVote = state.myVote;
  const grid = $('vote-buttons');
  grid.innerHTML = state.suspects.map((s) => {
    const n = (state.votes[s.name] || 0);
    return `<button class="btn ${myVote === s.name ? 'picked' : ''}" data-suspect="${esc(s.name)}" ${myVote ? 'disabled' : ''}>
      🔪 ${esc(s.name)}<span class="v-occ">${esc(s.occupation)}${s.isAI ? ' · AI' : ''}</span></button>`;
  }).join('');
  grid.querySelectorAll('button[data-suspect]').forEach((b) => {
    b.addEventListener('click', () => socket.emit('vote', { suspectName: b.dataset.suspect }));
  });
  $('vote-status').textContent = myVote
    ? `Vote locked: ${myVote}. Waiting for others… (${state.votesCast}/${state.votesNeeded})`
    : `Tap a suspect to accuse. (${state.votesCast}/${state.votesNeeded} votes in)`;
  $('vote-tally').innerHTML = Object.entries(state.votes).map(([n, c]) => `
    <div class="tally-row"><span>${esc(n)}</span><span class="count">${c} vote${c === 1 ? '' : 's'}</span></div>`).join('');
}

function renderPlea(state) {
  show('screen-plea');
  const accused = (state.result && state.result.top) || 'The accused';
  $('plea-accused').textContent = accused;
  if (state.plea) {
    $('plea-text').textContent = state.plea.text;
    $('plea-text').classList.remove('hidden');
    $('plea-waiting').classList.add('hidden');
  } else {
    $('plea-text').classList.add('hidden');
    $('plea-waiting').classList.remove('hidden');
  }
}

function renderReveal(state) {
  show('screen-reveal');
  const r = state.reveal;
  if (!r) return;
  $('reveal-narration').textContent = r.narration;
  const v = $('reveal-verdict');
  v.className = 'verdict ' + (r.caught ? 'town' : 'culprit');
  v.innerHTML = r.caught
    ? `🔪 CAUGHT!<br><strong>${esc(r.culprit)}</strong> did it.<br>The town wins: ${r.winners.map(esc).join(', ') || '—'}`
    : `🩸 THE KILLER WALKS FREE<br><strong>${esc(r.culprit)}</strong> fooled you all.<br>${r.tied ? 'The vote was tied — ties let the killer survive.' : ''}<br>Culprit wins.`;
  $('reveal-story').textContent = r.story;
  $('reveal-secrets').innerHTML = r.secrets.map((s) => `
    <li><span class="s-name">${esc(s.name)}</span> — ${esc(s.secret)}</li>`).join('');
  $('reveal-votes').innerHTML = Object.entries(r.votes).map(([n, c]) => `
    <div class="tally-row"><span>${esc(n)}</span><span class="count">${c} vote${c === 1 ? '' : 's'}</span></div>`).join('')
    || '<p class="dim">No votes were cast.</p>';
}

// ---------------------------------------------------------------------------
// Socket events
// ---------------------------------------------------------------------------
socket.on('connect', () => {
  // auto-rejoin if we have a session and aren't in a room yet
  const sess = loadSession();
  if (sess && sess.code && sess.playerId && !S.code) {
    S.code = sess.code; S.playerId = sess.playerId; S.name = sess.name;
    socket.emit('rejoin', { code: sess.code, playerId: sess.playerId });
  }
});

socket.on('roomCreated', ({ code, playerId }) => {
  S.code = code; S.playerId = playerId;
  saveSession();
});

socket.on('joined', ({ playerId }) => {
  S.playerId = playerId;
  saveSession();
  $('landing-error').classList.add('hidden');
});

socket.on('rejoined', ({ playerId }) => {
  S.playerId = playerId;
  saveSession();
  toast('Reconnected.');
});
socket.on('rejoinError', () => sessionStorage.removeItem('plot-twist'));

socket.on('joinError', ({ message }) => landingError(message));

socket.on('roomState', (state) => render(state));

socket.on('yourCard', (card) => {
  S.card = card;
  if (S.state && S.state.phase === 'characters') renderCharacters(S.state);
});

socket.on('questionForYou', ({ from, question, suspectName }) => {
  openModal(
    `Question for ${suspectName}`,
    `${from} asks: "${question}" — answer in character.`,
    'Answer as your suspect…',
    (text) => { if (text) socket.emit('answerQuestion', { text }); }
  );
});

socket.on('pleaRequested', ({ suspectName }) => {
  openModal(
    'You stand accused!',
    'The table has voted. Give your 30-second final plea — proclaim your innocence!',
    'Your final plea…',
    (text) => socket.emit('submitPlea', { text })
  );
});

socket.on('timerStarted', ({ endsAt, label }) => {
  const pleaMode = S.state && S.state.phase === 'plea';
  startTimer(endsAt, label || 'Discuss', pleaMode ? 'plea-timer-fill' : 'timer-fill', pleaMode ? 'plea-timer-text' : 'timer-text');
});
socket.on('timerEnded', () => stopTimer());

socket.on('errorMsg', ({ message }) => toast(message));

socket.on('disconnect', () => toast('Connection lost — reconnecting…'));
