# PLOT TWIST — Game Design Document

An AI game-mastered murder mystery party game for the Handshake x OpenAI
"Create a Multiplayer Game" challenge ($1,000 prize, deadline Oct 31, 2026).

## The pitch
2–8 players join a room from their phones via a 4-letter code. An AI game
master generates a brand-new murder mystery every game, deals secret character
cards, narrates clues with drama, roleplays extra suspects when the table is
short-handed, and reveals the truth at the end. No two games are ever alike.

## Why it wins
- **Execution**: instant join, no signup, works on phone + laptop, real-time.
- **Creativity**: the AI is the game master — infinite fresh mysteries, and it
  fills empty seats as suspects with full personalities.
- **Usefulness/value**: endlessly replayable party game; playable with just
  2 humans (judges can actually play it).
- **Polish**: noir-detective aesthetic, cinematic narration, dramatic reveal.

## Players & roles
- 2–8 humans per room. Total suspect count = max(5, human count).
- If humans < 5, the AI plays filler suspects (with names, personalities,
  secrets — fully interrogatable in character).
- One suspect is secretly the culprit (can be human or AI). Everyone else is
  innocent but each has a personal secret (red herrings + flavor).

## Game flow (host advances phases; discussion has a 90s skippable timer)
1. **Lobby** — host creates room, 4-letter code shown big. Players join with
   a name. Host picks vibe (Classic Noir / Haunted / Sci-Fi / Comedy) and
   starts when 2+ players are in.
2. **The Crime** — AI generates the full scenario (victim, setting, method,
   timeline, 3 clues, one red herring) and narrates it cinematically.
3. **Character cards** — each player (human) receives a secret card: name,
   occupation, relationship to victim, personal secret, and whether they are
   the culprit. AI filler suspects are introduced with public personas only.
4. **Investigation** (3 rounds) — AI reveals one clue per round with
   narration, then open discussion in room chat.
5. **Interrogation** — players question any suspect. Humans answer for
   themselves; the AI answers in character for its filler suspects AND as
   the game master (it knows the truth and drops hints without spoiling).
6. **Accusation & vote** — each player votes. The accused gets a 30-second
   final plea (fun!). Majority rules; ties = culprit survives.
7. **The Reveal** — AI narrates the true story dramatically: who did it, how,
   and how the clues pointed there. Winners announced (town wins if culprit
   caught, culprit wins otherwise). Rematch button.

## AI integration (OpenAI, gpt-4o-mini for speed/cost)
- `generateScenario(vibe, playerCount)` → structured JSON: victim, setting,
  method, timeline, clues[3], redHerring, characters[] (name, occupation,
  relation, secret, isCulprit for one).
- `narrate(event, context)` → short dramatic narration for clue reveals,
  round transitions, and the final reveal.
- `roleplay(suspect, question, scenarioTruth)` → in-character answers for
  AI filler suspects; evasive-but-fair for the culprit.
- `gameMaster(question, scenarioTruth, gameState)` → answers rules/meta
  questions and gives hint nudges without revealing the culprit.
- All AI output must be fast (<6s) and short (mobile screens). Fallback:
  zero-API mode draws from a hand-crafted 12-scenario pack
  (`server/scenarios.js`, 3 per vibe) with scripted in-character
  interrogation answers, spoiler-free game-master hints, and full reveal
  narrations — the game is fully playable with no API key at all.

## Tech
- **Server**: Node.js + Socket.IO (rooms, events, timers). Serves the client.
- **Client**: single-page app, vanilla JS, mobile-first, noir aesthetic.
  No login, no signup — name + room code only.
- **Deploy**: one unit (server serves static client). Target: Render free
  tier (WebSocket-friendly). Cold starts acceptable.
- **Cost**: $0 in zero-API mode. With OpenAI credits, ~$0.02–0.05 of
  API usage per game for infinite AI-generated mysteries.

## Anti-frustration rules
- Game must be joinable and playable in under 60 seconds from landing.
- Every AI response has a timeout + graceful fallback (game never soft-locks).
- Host can skip any timer. Disconnects: player marked away, game continues.
- No text walls: narration capped at ~60 words per beat.
