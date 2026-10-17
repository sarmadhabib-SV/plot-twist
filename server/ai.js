// server/ai.js — OpenAI integration for the Plot Twist game master.
// Every call has a timeout and a graceful fallback so the game never
// soft-locks, even with no API key or a failed request.
import OpenAI from 'openai';

const MODEL = 'gpt-4o-mini';
const TIMEOUT_MS = 25000;

let client = null;
function getClient() {
  if (client) return client;
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  client = new OpenAI({ apiKey: key, timeout: TIMEOUT_MS, maxRetries: 1 });
  return client;
}

async function withTimeout(promise, ms = TIMEOUT_MS) {
  let t;
  const timeout = new Promise((_, rej) => {
    t = setTimeout(() => rej(new Error('AI timeout')), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(t);
  }
}

const VIBE_NAMES = {
  noir: 'Classic Noir',
  haunted: 'Haunted',
  scifi: 'Sci-Fi',
  comedy: 'Comedy',
};

// ---------------------------------------------------------------------------
// Scenario generation (STRICT JSON)
// ---------------------------------------------------------------------------

const SCENARIO_SCHEMA_HINT = `Return STRICT JSON only, no markdown fences, matching this shape:
{
  "victim": "name, age, one-line description",
  "setting": "where and when the crime happened, one vivid sentence",
  "method": "how the victim died, one sentence",
  "timeline": ["4 to 6 short timeline beats, e.g. '9:00 PM — doors open'"],
  "clues": ["exactly 3 concrete clues players can find"],
  "redHerring": "one misleading-but-innocent detail",
  "truth": "2-3 sentence spoiler: who did it, how, and why. NEVER shown to players until the reveal.",
  "suspects": [
    {"name": "full name", "occupation": "job", "relation": "relationship to victim",
     "secret": "a juicy personal secret (1-2 sentences). Innocent suspects' secrets must NOT implicate them in the murder.",
     "isCulprit": false}
  ]
}`;

export async function generateScenario(vibe = 'noir', count = 5) {
  const vibeName = VIBE_NAMES[vibe] || VIBE_NAMES.noir;
  const n = Math.max(5, Math.min(8, count));
  const c = getClient();
  if (!c) return fallbackScenario(vibe, n);

  const system =
    'You are a brilliant game master writing a murder mystery party game. ' +
    'Be original, vivid, and fair: the clues must genuinely point at the culprit ' +
    'without naming them. Keep every string short (mobile screens). ' +
    SCENARIO_SCHEMA_HINT;
  const user =
    `Write a ${vibeName} murder mystery with EXACTLY ${n} suspects and EXACTLY ONE culprit ` +
    `(one suspect object with "isCulprit": true, the rest false). ` +
    `Give suspects memorable names and varied occupations. The victim must not be one of the suspects.`;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const resp = await withTimeout(
        c.chat.completions.create({
          model: MODEL,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.9,
          max_tokens: 2200,
        })
      );
      const raw = resp.choices?.[0]?.message?.content || '';
      const parsed = JSON.parse(raw);
      const fixed = normalizeScenario(parsed, n);
      if (fixed) return fixed;
    } catch {
      // fall through to retry / fallback
    }
  }
  return fallbackScenario(vibe, n);
}

// Coerce model output into a valid scenario; return null if unfixable.
function normalizeScenario(s, n) {
  try {
    if (!s || typeof s !== 'object') return null;
    if (!Array.isArray(s.suspects) || s.suspects.length === 0) return null;
    const suspects = s.suspects.slice(0, n).map((p) => ({
      name: String(p.name || 'Unknown').slice(0, 40),
      occupation: String(p.occupation || ' drifter').slice(0, 40),
      relation: String(p.relation || 'knew the victim').slice(0, 80),
      secret: String(p.secret || 'Keeps to themselves.').slice(0, 220),
      isCulprit: !!p.isCulprit,
    }));
    // Exactly one culprit: keep the first flagged, fix the rest.
    let seen = false;
    for (const p of suspects) {
      if (p.isCulprit && !seen) seen = true;
      else p.isCulprit = false;
    }
    if (!seen) suspects[suspects.length - 1].isCulprit = true;
    while (suspects.length < n) {
      suspects.push({ ...EXTRA_SUSPECTS[(suspects.length - 5) % EXTRA_SUSPECTS.length] });
    }
    return {
      victim: String(s.victim || 'a prominent local figure').slice(0, 120),
      setting: String(s.setting || 'a rain-soaked night in the city').slice(0, 160),
      method: String(s.method || 'found dead under strange circumstances').slice(0, 160),
      timeline: Array.isArray(s.timeline) ? s.timeline.map((t) => String(t).slice(0, 120)).slice(0, 6) : [],
      clues: [0, 1, 2].map((i) => String((s.clues || [])[i] || `Clue ${i + 1}: something was left behind.`).slice(0, 200)),
      redHerring: String(s.redHerring || 'Someone had a motive but an alibi.').slice(0, 200),
      truth: String(s.truth || 'The culprit acted alone.').slice(0, 400),
      suspects,
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Narration (<=60 words, dramatic)
// ---------------------------------------------------------------------------

export async function narrate(beat, context = {}) {
  const c = getClient();
  if (!c) return fallbackNarrate(beat, context);
  const vibeName = VIBE_NAMES[context.vibe] || VIBE_NAMES.noir;
  const prompts = {
    crime:
      `Narrate the discovery of the crime in a ${vibeName} murder mystery, max 60 words, ` +
      `dramatic and cinematic. Facts: victim: ${context.victim}. Setting: ${context.setting}. ` +
      `Method: ${context.method}. End on a hook.`,
    clue:
      `A detective finds this clue in a ${vibeName} murder mystery: "${context.clue}". ` +
      `Narrate its discovery in max 60 words, dripping with drama. Do not name the culprit.`,
    round:
      `Brief ${vibeName} transition line (one sentence) as investigation round ${context.round} of 3 begins.`,
    reveal:
      `Deliver the dramatic final reveal of a ${vibeName} murder mystery, max 60 words. ` +
      `The truth: ${context.truth}. Name the culprit and how the clues pointed at them.`,
  };
  try {
    const resp = await withTimeout(
      c.chat.completions.create({
        model: MODEL,
        messages: [
          { role: 'system', content: 'You are a noir narrator. Short, punchy, dramatic. Never exceed 60 words.' },
          { role: 'user', content: prompts[beat] || prompts.round },
        ],
        temperature: 0.85,
        max_tokens: 160,
      })
    );
    const text = (resp.choices?.[0]?.message?.content || '').trim();
    return text || fallbackNarrate(beat, context);
  } catch {
    return fallbackNarrate(beat, context);
  }
}

// ---------------------------------------------------------------------------
// Roleplay — in-character answers for AI filler suspects
// ---------------------------------------------------------------------------

export async function roleplay(suspect, question, truth) {
  const c = getClient();
  if (!c) return fallbackRoleplay(suspect);
  const culpritNote = suspect.isCulprit
    ? 'You ARE the murderer. Be evasive but fair: never confess outright, deflect gently, ' +
      'cast mild doubt elsewhere, but do not invent lies about verifiable facts that would break the game.'
    : 'You are innocent. Answer truthfully in character. Guard your secret unless pressed hard.';
  try {
    const resp = await withTimeout(
      c.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content:
              `You are ${suspect.name}, a ${suspect.occupation} in a murder mystery party game. ` +
              `Your relationship to the victim: ${suspect.relation}. ` +
              `Your private secret: ${suspect.secret}. ${culpritNote} ` +
              `Stay in character, first person, max 60 words. Never break character or mention you are an AI.`,
          },
          { role: 'user', content: `A detective asks you: "${question}"\n(The hidden truth of the case: ${truth})` },
        ],
        temperature: 0.85,
        max_tokens: 160,
      })
    );
    const text = (resp.choices?.[0]?.message?.content || '').trim();
    return text || fallbackRoleplay(suspect);
  } catch {
    return fallbackRoleplay(suspect);
  }
}

// ---------------------------------------------------------------------------
// Game master — meta questions & hint nudges, never spoils
// ---------------------------------------------------------------------------

export async function gameMaster(question, truth, stateSummary = '') {
  const c = getClient();
  if (!c) return fallbackGameMaster();
  try {
    const resp = await withTimeout(
      c.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content:
              'You are the game master of a murder mystery party game. Answer rules questions, ' +
              'clarify confusion, and nudge stuck players toward useful lines of inquiry. ' +
              'ABSOLUTE RULES: never name the culprit, never reveal anyone\'s secret, ' +
              'never confirm or deny a specific accusation. Max 60 words. Stay in a wry noir voice.',
          },
          {
            role: 'user',
            content:
              `Game state: ${stateSummary}\n(Hidden truth, for your eyes only: ${truth})\n\nPlayer asks: "${question}"`,
          },
        ],
        temperature: 0.7,
        max_tokens: 160,
      })
    );
    const text = (resp.choices?.[0]?.message?.content || '').trim();
    return text || fallbackGameMaster();
  } catch {
    return fallbackGameMaster();
  }
}

// ---------------------------------------------------------------------------
// Final plea — the accused speaks before the reveal
// ---------------------------------------------------------------------------

export async function plea(suspect, truth) {
  const c = getClient();
  if (!c) return fallbackPlea(suspect);
  try {
    const resp = await withTimeout(
      c.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content:
              `You are ${suspect.name}, a ${suspect.occupation} accused of murder in front of everyone. ` +
              `Deliver a dramatic 30-second final plea proclaiming your innocence, in character, first person, ` +
              `max 60 words. ${suspect.isCulprit ? 'You are secretly guilty: sound sincere, deflect, survive the vote.' : 'You are innocent: be heartfelt and a little outraged.'} ` +
              `Never break character. (Hidden truth: ${truth})`,
          },
          { role: 'user', content: 'Give your final plea.' },
        ],
        temperature: 0.9,
        max_tokens: 160,
      })
    );
    const text = (resp.choices?.[0]?.message?.content || '').trim();
    return text || fallbackPlea(suspect);
  } catch {
    return fallbackPlea(suspect);
  }
}

// ---------------------------------------------------------------------------
// Fallbacks — the game is fully playable with no API key
// ---------------------------------------------------------------------------

const EXTRA_SUSPECTS = [
  { name: 'Theo Park', occupation: 'sound technician', relation: 'ran the club PA that night', secret: 'He has been bootlegging live recordings of the club sets.', isCulprit: false },
  { name: 'Grace Liu', occupation: 'food critic', relation: 'reviewing the club that night', secret: 'She is the victim\'s estranged niece, and nobody knows.', isCulprit: false },
  { name: 'Big Mike Russo', occupation: 'bouncer', relation: 'worked the door all night', secret: 'He let someone in through the back for fifty bucks.', isCulprit: false },
  { name: 'Nina Petrova', occupation: 'coat-check attendant', relation: 'saw everyone come and go', secret: 'She pocketed a patron\'s lost diamond earring.', isCulprit: false },
];

function fallbackScenario(vibe, n) {
  const vibeName = VIBE_NAMES[vibe] || VIBE_NAMES.noir;
  const suspects = [
    { name: 'Lena "Velvet" Cross', occupation: 'jazz singer', relation: 'the victim\'s former lover', secret: 'She had been skimming cash from the door take for months.', isCulprit: false },
    { name: 'Marcus Bell', occupation: 'bartender', relation: 'owed the victim $4,000 in gambling debts', secret: 'He pocketed the back-door camera\'s memory card to hide that he\'d been stealing bottles.', isCulprit: false },
    { name: 'Priya Anand', occupation: 'business partner', relation: 'co-owned the club with the victim', secret: 'The big insurance policy on the victim was the victim\'s own idea, to protect the club.', isCulprit: false },
    { name: 'Eddie "Fingers" Malone', occupation: 'piano player', relation: 'the victim fired his brother last year', secret: 'He slipped a threatening note under the victim\'s door that night as a prank — then decided a prank wasn\'t enough.', isCulprit: true },
    { name: 'Rosa Delgado', occupation: 'cleaning woman', relation: 'found the body', secret: 'She moved the glass before police arrived to protect her nephew, who buses tables off the books.', isCulprit: false },
  ];
  while (suspects.length < n) {
    suspects.push({ ...EXTRA_SUSPECTS[(suspects.length - 5) % EXTRA_SUSPECTS.length] });
  }
  return {
    victim: 'Vincent "Vinnie" Marlowe, 58, owner of The Gilded Note jazz club',
    setting: `The Gilded Note jazz club, 11:47 PM, rain hammering the awning — a ${vibeName} kind of night.`,
    method: 'Poisoned — cyanide slipped into his nightly whiskey sour.',
    timeline: [
      '9:00 PM — doors open, the last set crowd files in.',
      '10:12 PM — the back-door camera dies. Someone knew the blind spots.',
      '10:15 PM — muffled arguing from backstage. Then silence.',
      '11:30 PM — Vinnie drinks the whiskey sour brought up from the bar.',
      '11:47 PM — mid-song, Vinnie clutches his throat and collapses.',
    ],
    clues: [
      'The highball glass smells faintly of bitter almonds — but the bar\'s well whiskey doesn\'t.',
      'A torn cocktail napkin clutched in the victim\'s fist reads "...meet me at midni—" in hurried ink.',
      'The back-door camera died at 10:12 PM — and its memory card is missing entirely.',
    ],
    redHerring: 'The business partner took out a large life insurance policy on the victim last month.',
    truth: 'Eddie "Fingers" Malone slipped cyanide from the pest-control locker into Vinnie\'s whiskey sour during the 10:12 camera blackout, settling the score for his fired brother.',
    suspects: suspects.slice(0, n),
  };
}

function fallbackNarrate(beat, context = {}) {
  switch (beat) {
    case 'crime':
      return `Rain on the awning. A half-finished drink. ${context.victim || 'The victim'} lies still while the music plays on for people who haven't noticed yet. Somebody in this room did it — and somebody in this room is lying.`;
    case 'clue':
      return `The detective holds it up to the light. "${context.clue || 'A clue surfaces.'}" A small thing. Murders have hinged on smaller.`;
    case 'round':
      return `Round ${context.round || ''} of the investigation begins. The clock is ticking, and the lies are getting thinner.`;
    case 'reveal':
      return `The truth, at last: ${context.truth || 'the culprit is unmasked'}. The clues were there all along — you just had to look sideways at them.`;
    default:
      return 'The night deepens. So does the mystery.';
  }
}

function fallbackRoleplay(suspect) {
  const name = suspect?.name || 'The suspect';
  return `${name} shifts uncomfortably. "I've told the detective everything I know. Ask me something specific — about that night, about the victim — and I'll answer straight."`;
}

function fallbackGameMaster() {
  return 'Trust the clues, detective. Compare what people say against what was found — and watch who changes the subject.';
}

function fallbackPlea(suspect) {
  const name = suspect?.name || 'The accused';
  return `"${name} looks every one of you in the eye. "I'm innocent — I swear it. Look at the clues, not at me. You've got one chance to get this right."`;
}
