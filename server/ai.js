// server/ai.js — OpenAI integration for the Plot Twist game master.
// Every call has a timeout and a graceful fallback so the game never
// soft-locks, even with no API key or a failed request.
import OpenAI from 'openai';
import { getScenario, findScenarioByTruth } from './scenarios.js';

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
  if (!c) return fallbackRoleplay(suspect, question, truth);
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
    return text || fallbackRoleplay(suspect, question, truth);
  } catch {
    return fallbackRoleplay(suspect, question, truth);
  }
}

// ---------------------------------------------------------------------------
// Game master — meta questions & hint nudges, never spoils
// ---------------------------------------------------------------------------

export async function gameMaster(question, truth, stateSummary = '') {
  const c = getClient();
  if (!c) return fallbackGameMaster(question, truth, stateSummary);
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
    return text || fallbackGameMaster(question, truth, stateSummary);
  } catch {
    return fallbackGameMaster(question, truth, stateSummary);
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
  { name: "Theo Park", occupation: "sound technician", relation: "was working nearby that night",
    secret: "He has been bootlegging live recordings for months.", isCulprit: false,
    persona: "Jittery, technical, hides behind jargon.",
    tells: [
      ["where|night|doing", "At the board, patching cables. The cables will vouch for me."],
      ["steal|bootleg|record", "Okay, I record shows. For posterity! Victimless crime, excellent audio quality."],
    ] },
  { name: "Grace Liu", occupation: "food critic", relation: "happened to be there that night",
    secret: "She is the victim's estranged niece, and nobody knows.", isCulprit: false,
    persona: "Dry, observant, reviews people like restaurants.",
    tells: [
      ["niece|family|related", "Fine. Estranged niece. We had not spoken in years. That is not a motive, that is a family."],
      ["where|night", "At my table, taking notes. I review everything. Even murder, apparently. Two stars."],
    ] },
  { name: "Big Mike Russo", occupation: "bouncer", relation: "worked the door all night",
    secret: "He let someone in through the back for fifty bucks.", isCulprit: false,
    persona: "Mountainous, soft-spoken, gentle giant.",
    tells: [
      ["door|back|fifty", "I let one person in the back. Fifty bucks. I needed it. It was not the killer. Probably."],
      ["where|night", "On the door. All night. My feet can confirm. They are still angry about it."],
    ] },
  { name: "Nina Petrova", occupation: "coat-check attendant", relation: "saw everyone come and go",
    secret: "She pocketed a patron's lost diamond earring.", isCulprit: false,
    persona: "Sharp-eyed, fast-talking, misses nothing.",
    tells: [
      ["earring|diamond|pocketed", "It was on the floor! Finders keepers! I was going to turn it in. Eventually."],
      ["saw|come and go", "I see everyone. It is the job. Coats in, secrets out."],
    ] },
];

function fallbackScenario(vibe, n) {
  const sc = getScenario(vibe, n);
  const suspects = sc.suspects.map((s) => ({ ...s }));
  while (suspects.length < n) {
    suspects.push({ ...EXTRA_SUSPECTS[(suspects.length - 6) % EXTRA_SUSPECTS.length] });
  }
  return { ...sc, suspects: suspects.slice(0, n) };
}

function fallbackNarrate(beat, context = {}) {
  switch (beat) {
    case 'crime':
      return `Rain on the awning. A half-finished drink. ${context.victim || 'The victim'} lies still while the music plays on for people who haven't noticed yet. Somebody in this room did it — and somebody in this room is lying.`;
    case 'clue':
      return `The detective holds it up to the light. "${context.clue || 'A clue surfaces.'}" A small thing. Murders have hinged on smaller.`;
    case 'round':
      return `Round ${context.round || ''} of the investigation begins. The clock is ticking, and the lies are getting thinner.`;
    case 'reveal': {
      const sc = findScenarioByTruth(context.truth);
      if (sc && sc.reveal) return sc.reveal;
      return `The truth, at last: ${context.truth || 'the culprit is unmasked'}. The clues were there all along — you just had to look sideways at them.`;
    }
    default:
      return 'The night deepens. So does the mystery.';
  }
}

function fallbackRoleplay(suspect, question = '', truth = '') {
  const name = (suspect && suspect.name) || 'The suspect';
  const q = String(question).toLowerCase();
  const sc = findScenarioByTruth(truth);
  const full = sc ? sc.suspects.find((s) => s.name === name) : null;
  const tells = (full && full.tells) || (suspect && suspect.tells) || [];
  for (const pair of tells) {
    const keys = String(pair[0]).toLowerCase().split('|');
    if (keys.some((w) => w.trim() && q.includes(w.trim()))) return pair[1];
  }
  if (suspect && suspect.isCulprit) {
    return `${name} smiles thinly. "Interesting question. I'd look at what people DID that night, not what they say now. Actions leave marks; words don't."`;
  }
  return `${name} shrugs. "I've told you everything I know. Ask me about that night, the victim, or what I saw — I'll answer straight."`;
}

function fallbackGameMaster(question = '', truth = '', stateSummary = '') {
  const q = String(question).toLowerCase();
  const sc = findScenarioByTruth(truth);
  if (/who (did|killed)|culprit|murderer|is it\b/.test(q)) {
    return 'I can\'t name the killer — that\'s your job, detective. Ask who had the means, who had a reason, and whose story wobbles when you press the small details.';
  }
  if (sc) {
    const named = sc.suspects.find((s) => {
      const ln = s.name.toLowerCase();
      const last = ln.split(' ').pop().replace(/["']/g, '');
      return q.includes(ln) || (last.length > 3 && q.includes(last));
    });
    if (named) {
      return `${named.name} — ${named.occupation}, ${named.relation}. Press them on the details: where exactly they were, and what they'd lose if the truth came out. Liars rehearse the big story, never the small ones.`;
    }
    if (/clue|evidence|hint|stuck|help/.test(q)) {
      const clue = sc.clues[Math.floor(Math.random() * sc.clues.length)];
      return `Re-read this one slowly: "${clue}" Now ask who it points at — and who it conveniently lets off the hook.`;
    }
  }
  return 'Trust the clues, detective. Compare what people say against what was found — and watch who changes the subject.';
}

function fallbackPlea(suspect) {
  const name = (suspect && suspect.name) || 'The accused';
  return `"${name} looks every one of you in the eye. "I'm innocent — I swear it. Look at the clues, not at me. You've got one chance to get this right."`;
}
