// server/scenarios.js — hand-crafted mystery pack for Plot Twist.
// Zero-API mode: fallbackScenario() picks one of these at random per vibe.
// Each scenario: fair clues, one culprit, scripted interrogation tells.

export const SCENARIOS = [
  // ==================== NOIR ====================
  {
    vibe: 'noir',
    title: 'The Gilded Note',
    victim: 'Vincent "Vinnie" Marlowe, 58, owner of The Gilded Note jazz club',
    setting: 'The Gilded Note jazz club, 11:47 PM, rain hammering the awning.',
    method: 'Poisoned — cyanide slipped into his nightly whiskey sour.',
    timeline: [
      '9:00 PM — doors open, the last-set crowd files in.',
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
    reveal: 'The bitter almonds gave it away — cyanide, not whiskey. And only one person knew the camera\'s blind spots AND had the pest-locker key. Eddie "Fingers" Malone didn\'t just play the blues that night. He composed a murder.',
    suspects: [
      {
        name: 'Lena "Velvet" Cross', occupation: 'jazz singer', relation: 'the victim\'s former lover',
        secret: 'She had been skimming cash from the door take for months.', isCulprit: false,
        persona: 'Smoky, tired, deflects with flirtation.',
        tells: [
          ['where|midnight|11', 'On that stage, sugar, second set. Two hundred people saw me. Ask the drummer.'],
          ['money|cash|skim', 'You counting my tips now, detective? A girl has expenses. It ain\'t murder.'],
          ['vinnie|victim|lover', 'Vinnie and me? Ancient history. We made our peace years ago — mostly.'],
        ],
      },
      {
        name: 'Marcus Bell', occupation: 'bartender', relation: 'owed the victim $4,000 in gambling debts',
        secret: 'He pocketed the back-door camera\'s memory card to hide that he\'d been stealing bottles.', isCulprit: false,
        persona: 'Nervous, talkative, over-explains.',
        tells: [
          ['camera|memory card|10:12', 'Okay, okay — I took the card! But only to hide the bottles I lifted. The camera was ALREADY dead when I got there, I swear.'],
          ['debt|money|owe', 'Four grand. Vinnie was gonna let me work it off. Dead men don\'t collect, but they don\'t forgive either.'],
          ['drink|whiskey|glass', 'I poured that sour myself, exactly like always. Whatever was in it got in after it left my bar.'],
        ],
      },
      {
        name: 'Priya Anand', occupation: 'business partner', relation: 'co-owned the club with the victim',
        secret: 'The big insurance policy on the victim was the victim\'s own idea, to protect the club.', isCulprit: false,
        persona: 'Composed, businesslike, slightly offended at being questioned.',
        tells: [
          ['insurance|policy', 'Vinnie insisted on that policy himself — to keep the club alive if anything happened to either of us. Check the paperwork.'],
          ['argu|fight|10:15', 'We argued about the headliner budget. Partners argue. Then I went back to the office and did payroll.'],
          ['where|midnight', 'In my office, alone, doing payroll. Not convenient, I know. The spreadsheets will vouch for me.'],
        ],
      },
      {
        name: 'Eddie "Fingers" Malone', occupation: 'piano player', relation: 'the victim fired his brother last year',
        secret: 'He slipped a threatening note under the victim\'s door that night as a prank — then decided a prank wasn\'t enough.', isCulprit: true,
        persona: 'Bitter, sardonic, performs innocence a little too hard.',
        tells: [
          ['brother|fired', 'Yeah, Vinnie canned my brother. A year ago. You think I waited a YEAR to be mad about it?'],
          ['note|threat|napkin', 'A prank note, sure, I wrote it. Meant to rattle him. Somebody else did the real thing.'],
          ['pest|cyanide|poison|locker', 'Pest locker? I wouldn\'t know a cyanide bottle from a ketchup bottle, detective.'],
          ['camera|10:12|blind', 'I play piano. My hands were on the keys all night. Ask anybody.'],
        ],
      },
      {
        name: 'Rosa Delgado', occupation: 'cleaning woman', relation: 'found the body',
        secret: 'She moved the glass before police arrived to protect her nephew, who buses tables off the books.', isCulprit: false,
        persona: 'Frightened, earnest, speaks plainly.',
        tells: [
          ['glass|moved|body', 'I... I moved the glass, yes. My nephew works here with no papers. I was scared for him. I\'m sorry.'],
          ['found|body|11:47', 'I came to clear the stage glasses and there he was. I screamed, I think. Everything after is a blur.'],
          ['nephew', 'He had nothing to do with this! He was in the kitchen all night, ask the cook.'],
        ],
      },
      {
        name: 'Sal "Books" Moretti', occupation: 'bookkeeper', relation: 'did the club\'s accounts for a decade',
        secret: 'He\'s been quietly paying off Vinnie\'s blackmail for years — Vinnie knew about his prison record.', isCulprit: false,
        persona: 'Quiet, precise, chooses every word.',
        tells: [
          ['blackmail|prison|record', '...Vinnie knew about my past. I paid. Every month, I paid. It was almost over. Why would I kill the arrangement?'],
          ['where|midnight', 'At my desk, reconciling the week\'s take. The ledger doesn\'t lie, detective.'],
          ['money|debt', 'Everybody in this club owed somebody something. That\'s show business.'],
        ],
      },
    ],
  },
  {
    vibe: 'noir',
    title: 'The Maltese Manuscript',
    victim: 'Aldous Crane, 71, rare book dealer, found dead among his first editions',
    setting: 'Crane & Sons Rare Books, 8:05 AM — the shop still locked from the inside.',
    method: 'A single stab wound from his own ivory letter opener.',
    timeline: [
      '6:00 PM — shop closes. Crane stays late for a "private buyer."',
      '7:40 PM — a neighbor hears raised voices through the wall.',
      '8:05 AM — the assistant unlocks the shop and finds the body.',
      '8:06 AM — the Maltese Manuscript, worth $2M, is gone from its case.',
    ],
    clues: [
      'The letter opener was wiped clean — but the killer missed a spot of ink on the cuff of the victim\'s sleeve.',
      'A torn page from a cheap paperback is tucked in the empty display case — a message, or a mistake?',
      'The shop\'s cat, usually terrified of strangers, was asleep on the killer\'s coat... which is still in the cloakroom.',
    ],
    redHerring: 'The victim\'s will leaves everything to a nephew nobody has ever met.',
    truth: 'Iris Vale, the rival collector, stabbed Crane with his own letter opener during the "private viewing," staged the theft of the manuscript she already owned a forgery of, and hid in the cloakroom until morning — the cat gave her away.',
    reveal: 'The cat never lies. It slept on Iris Vale\'s coat all night — because she never left the shop. The "stolen" manuscript was a forgery swap, and the letter opener was Crane\'s own. A collector\'s pride, paid in blood.',
    suspects: [
      {
        name: 'Iris Vale', occupation: 'rival book collector', relation: 'the victim\'s fiercest rival at auctions',
        secret: 'She owns a flawless forgery of the Maltese Manuscript and has been trying to sell it as real.', isCulprit: true,
        persona: 'Polished, condescending, treats questions as beneath her.',
        tells: [
          ['manuscript|forgery|stolen', 'The manuscript is gone and you question ME? I\'ve wanted that book for thirty years. I wouldn\'t steal what I could buy.'],
          ['coat|cloakroom|cat', 'I left my coat... I may have visited yesterday afternoon. The cat likes everyone, detective.'],
          ['private buyer|7:40|voices', 'Raised voices? Aldous argued with everyone. It was his love language.'],
          ['letter opener|ink', 'I collect books, not... cutlery. This is absurd.'],
        ],
      },
      {
        name: 'Tommy Pike', occupation: 'shop assistant', relation: 'worked for the victim for three years',
        secret: 'He\'s been selling cheap reprints as first editions on the side.', isCulprit: false,
        persona: 'Eager, sweaty, desperate to be helpful.',
        tells: [
          ['morning|8:05|found', 'I unlocked at eight-oh-five like always and there he was. I called the police before I even... yeah.'],
          ['reprint|side|selling', 'Okay! Okay. I sold some reprints as firsts. Small money. Aldous would\'ve killed ME for it — not the other way around.'],
          ['locked|inside', 'The door was locked from inside, I swear. I used my key. That\'s why I... I don\'t know how.'],
        ],
      },
      {
        name: 'Beatrice Lovelace', occupation: 'wealthy client', relation: 'the victim\'s best customer',
        secret: 'She\'s broke — the fortune is gone, and Crane had just refused her credit.', isCulprit: false,
        persona: 'Grand, theatrical, performs grief.',
        tells: [
          ['money|broke|credit', 'My finances are MY business. Aldous was a dear friend. Friends don\'t... audit each other.'],
          ['nephew|will', 'A nephew? I never heard of a nephew. Convenient, isn\'t it?'],
          ['7:40|evening|there', 'I was at the opera. The ushers will confirm. I never miss the second act.'],
        ],
      },
      {
        name: 'Nate Crowley', occupation: 'insurance investigator', relation: 'was auditing the shop\'s policy',
        secret: 'He\'s actually a thief casing the shop for a crew — the audit is his cover.', isCulprit: false,
        persona: 'Dry, professional, a little too smooth.',
        tells: [
          ['audit|insurance|policy', 'Standard audit. High-value inventory, I verify it exists. It... mostly did.'],
          ['crew|thief|casing', 'I investigate theft, detective. I don\'t commit it. There\'s a difference, and it\'s my whole personality.'],
          ['cat|coat', 'I\'m allergic to cats. I was nowhere near that cloakroom. My sinuses are my alibi.'],
        ],
      },
      {
        name: 'Wren Halloway', occupation: 'bookbinder', relation: 'restored books for the victim',
        secret: 'She forged provenance documents for Crane twice — she knows the trade\'s dirty secrets.', isCulprit: false,
        persona: 'Soft-spoken, watchful, misses nothing.',
        tells: [
          ['provenance|forg', 'I bound books. What dealers did with papers after... I didn\'t ask. Asking gets you fired. Or worse.'],
          ['paperback|torn page', 'A cheap paperback page in that case? Somebody wanted it to look like a robbery. A real thief takes the case too.'],
          ['evening|there', 'Home, alone, mending a spine. The most boring alibi ever told. It\'s also true.'],
        ],
      },
      {
        name: 'Silas Brandt', occupation: 'the nephew', relation: 'the victim\'s nephew, named in the will',
        secret: 'He hadn\'t spoken to Crane in twelve years and didn\'t know about the will.', isCulprit: false,
        persona: 'Awkward, overwhelmed, clearly out of his depth.',
        tells: [
          ['will|inherit', 'I didn\'t KNOW about any will! Twelve years, no calls, no Christmas cards, and now I\'m a suspect?'],
          ['where|morning', 'On a bus from Cleveland. I have the ticket. I\'ve never even been in that shop.'],
          ['uncle|aldous', 'He was... my mother\'s brother. That\'s the whole relationship. Ask my mother.'],
        ],
      },
    ],
  },
  {
    vibe: 'noir',
    title: 'Last Train to Nowhere',
    victim: 'Dmitri Volkov, 64, retired chess grandmaster, found dead in sleeper car 7',
    setting: 'The midnight express, somewhere between nowhere and nowhere, 3:12 AM.',
    method: 'Strangled with a silk scarf. The compartment door was locked from the inside.',
    timeline: [
      '11:00 PM — Volkov retires to sleeper car 7, asking not to be disturbed.',
      '1:30 AM — the dining car steward hears a thump from the corridor.',
      '3:12 AM — the conductor\'s master key opens the compartment. Volkov is dead.',
      '3:13 AM — every passenger claims to have been asleep.',
    ],
    clues: [
      'The silk scarf belongs to a woman — it smells of gardenia perfume.',
      'A chessboard sits set to a famous 1978 championship position — with one piece moved.',
      'The window latch is broken from the OUTSIDE, and there are scuffs on the carriage roof.',
    ],
    redHerring: 'Volkov\'s will disinherits his son in favor of a chess foundation.',
    truth: 'Nadia Petrova, the concert violinist, climbed along the carriage roof, slipped in through the window, and strangled Volkov with her own scarf — revenge for the 1978 match he threw, which ruined her father\'s career.',
    reveal: 'The window told the story: broken from the outside, scuffs on the roof. Only someone light, desperate, and furious climbs a moving train at 1 AM. Nadia Petrova waited forty-eight years to avenge 1978 — and the gardenia scarf was her signature.',
    suspects: [
      {
        name: 'Nadia Petrova', occupation: 'concert violinist', relation: 'her father lost everything after Volkov\'s 1978 match',
        secret: 'She\'s terrified of heights — she nearly fell twice on that roof.', isCulprit: true,
        persona: 'Elegant, controlled, ice over fury.',
        tells: [
          ['roof|window|climb', 'Climb a train roof? In the dark? I\'m a violinist, detective, not a circus act.'],
          ['1978|father|chess', 'My father deserved better than what Volkov did to him. Everyone knows it. Knowing isn\'t killing.'],
          ['scarf|gardenia|perfume', 'Many women wear gardenia. It\'s hardly a fingerprint.'],
          ['1:30|thump|awake', 'I took a sleeping draught at midnight. Ask the steward — he brought it.'],
        ],
      },
      {
        name: 'Anton Volkov', occupation: 'the victim\'s son', relation: 'disinherited son',
        secret: 'He was secretly paying his father\'s debts for years — the "disinheritance" was staged to protect him from creditors.', isCulprit: false,
        persona: 'Gruff, grieving badly, defensive.',
        tells: [
          ['will|disinherit|money', 'The will was theater! I paid his debts for YEARS. Disinheriting me protected ME. Ask his lawyer.'],
          ['3:12|asleep', 'Asleep in car 5. Snoring, probably. My whole life people assume the worst of me.'],
          ['scarf', 'I don\'t wear scarves. I don\'t wear gardenia. I barely wear a coat.'],
        ],
      },
      {
        name: 'Greta Lindqvist', occupation: 'dining car steward', relation: 'served the victim dinner',
        secret: 'She stole a silver spoon from the dining car and lied about it.', isCulprit: false,
        persona: 'Efficient, nervous, wrings her hands.',
        tells: [
          ['1:30|thump|heard', 'A thump, yes, from the corridor. I thought it was luggage. God forgive me, I went back to my tea.'],
          ['spoon|silver|stole', '...One spoon. I\'m sorry. It\'s in my locker. It has nothing to do with— oh, this looks bad, doesn\'t it.'],
          ['dinner|served', 'He ate alone. Barely touched the soup. Said the rocking helped him think.'],
        ],
      },
      {
        name: 'Father Okafor', occupation: 'traveling priest', relation: 'shared the corridor with the victim',
        secret: 'He\'s not a priest — he\'s a journalist traveling undercover for a story on Volkov.', isCulprit: false,
        persona: 'Gentle, measured, chooses words like chess moves.',
        tells: [
          ['priest|journalist|undercover', '...I write for a paper. Volkov was my story. A dead man makes a better headline — I know how that sounds.'],
          ['asleep|3:12', 'Praying. Or... writing notes. In my berth, alone.'],
          ['chess|1978', 'The \'78 match is the heart of my piece. Fixed, most say. But I write stories, detective, I don\'t settle them.'],
        ],
      },
      {
        name: 'Yuki Tanaka', occupation: 'chess prodigy, 19', relation: 'was traveling to challenge Volkov to an exhibition',
        secret: 'She forged Volkov\'s signature to get the exhibition approved.', isCulprit: false,
        persona: 'Blunt, brilliant, impatient with small talk.',
        tells: [
          ['exhibition|challenge|signature', 'Fine — I forged his signature. He kept dodging me. Dead men don\'t dodge, so congratulations, I got my exhibition. Too soon?'],
          ['chessboard|moved piece', 'The board! Set to \'78, one piece moved. That\'s... that\'s someone saying the old game isn\'t finished.'],
          ['asleep', 'Analyzing the Sicilian in my head. Car 3. My engine app has timestamps if you must know.'],
        ],
      },
      {
        name: 'Conductor Marsh', occupation: 'train conductor', relation: 'found the body with his master key',
        secret: 'He was running an unlicensed poker game in the baggage car all night.', isCulprit: false,
        persona: 'Blustery, official, hiding something small.',
        tells: [
          ['master key|3:12|found', 'I opened it, I saw him, I locked it back and called ahead. Procedure! All procedure.'],
          ['poker|baggage|game', 'A friendly card game. Pennies! The company frowns, but half the crew was there — that\'s my alibi, a dozen witnesses.'],
          ['locked|inside', 'Locked from inside, yes. These old cars... the windows, though. Nobody checks the windows.'],
        ],
      },
    ],
  },
  // ==================== HAUNTED ====================
  {
    vibe: 'haunted',
    title: 'The Blackwood Séance',
    victim: 'Madame Zora, 66, famous medium, found dead at the séance table',
    setting: 'Blackwood Manor, the blue drawing room, midnight — candles still burning.',
    method: 'A silver letter opener through the heart — during a séance, while everyone held hands.',
    timeline: [
      '11:30 PM — seven guests join hands around the table. The lights go out.',
      '11:47 PM — Zora gasps, "He\'s here—" and goes silent.',
      '11:58 PM — the candles gutter. Someone screams.',
      'Midnight — the lights return. Zora is dead, the opener in her chest.',
    ],
    clues: [
      'Zora\'s hands are unmarked — she never let go of her neighbors\' hands. So who held the blade?',
      'A thread of black silk is caught on the letter opener\'s handle.',
      'The "spirit trumpet" on the table is dented — recently, and from the inside.',
    ],
    redHerring: 'A guest swears they saw the ghost of Blackwood\'s founder standing behind Zora.',
    truth: 'Silas Blackwood, the heir, rigged the letter opener to the spirit trumpet on a black silk cord — when Zora reached for the "manifesting" trumpet, the blade swung down. He never let go of anyone\'s hands.',
    reveal: 'Nobody let go of hands — that was the trick. Silas Blackwood never needed his hands. The letter opener rode the spirit trumpet down a silk cord, straight into Madame Zora. The "ghost" everyone saw was a sheet on a wire. The only real spirit that night was greed.',
    suspects: [
      {
        name: 'Silas Blackwood', occupation: 'heir to the manor', relation: 'Zora was about to expose his forged inheritance papers',
        secret: 'The inheritance papers are forged — Zora had figured it out and planned to announce it.', isCulprit: true,
        persona: 'Polite, pale, smiles without warmth.',
        tells: [
          ['hands|held|trumpet', 'We all held hands, detective. All of us. That\'s rather the point of a séance.'],
          ['inheritance|papers|forged', 'My family\'s papers are in order. Zora trafficked in... impressions. Hardly evidence.'],
          ['silk|cord|thread', 'Silk thread? This is a manor, not a sewing circle. Ask the staff about threads.'],
          ['ghost|sheet', 'I saw what everyone saw. Or what Zora wanted us to see. She was a performer, after all.'],
        ],
      },
      {
        name: 'Wren Delacroix', occupation: 'Zora\'s apprentice', relation: 'trained under the victim for six years',
        secret: 'She\'s the one who faked the "ghost" effects — Zora\'s whole act was stagecraft she operated.', isCulprit: false,
        persona: 'Skittish, guilt-ridden, talks too fast.',
        tells: [
          ['ghost|effects|faked', 'The trumpet, the drafts — that was ME, on wires. Zora\'s "gift" was... me. But the knife wasn\'t in the script!'],
          ['hands|held', 'I held Mrs. Pemberton\'s hand so tight I left marks. I never let go, I swear it.'],
          ['apprentice|six years', 'She was going to make me a full partner. Why would I kill my own future?'],
        ],
      },
      {
        name: 'Colonel Harlan Briggs', occupation: 'retired army officer', relation: 'hired Zora to contact his late wife',
        secret: 'He never believed — he came to expose her as a fraud and had a recording device running.', isCulprit: false,
        persona: 'Bluff, military, barely contained fury.',
        tells: [
          ['recording|device|fraud', 'Yes, I recorded it! To expose the charlatan! The device ran all night — it\'ll prove I never moved.'],
          ['wife', 'Don\'t you DARE use my Margaret for your... I came for answers. I got a corpse.'],
          ['11:47|gasp|silent', 'She gasped. Then nothing. In the dark, you imagine things. I imagined... never mind.'],
        ],
      },
      {
        name: 'Mrs. Pemberton', occupation: 'widow', relation: 'Zora\'s most devoted client',
        secret: 'She\'s been paying Zora triple rates for years — she\'s nearly bankrupt from it.', isCulprit: false,
        persona: 'Fluttery, devout, clutches her pearls.',
        tells: [
          ['money|bankrupt|rates', 'Spiritual guidance has a price, young man. Zora was worth every penny. Every... penny.'],
          ['ghost|founder', 'I SAW him! Old Blackwood himself, behind her! You can\'t tell me what I saw!'],
          ['hands', 'I held the Colonel\'s hand and Wren\'s. So tight. We were all so frightened.'],
        ],
      },
      {
        name: 'Dr. Emil Voss', occupation: 'psychologist', relation: 'was studying Zora\'s "abilities" for a book',
        secret: 'His book is actually a hit piece — he\'s already been paid for it.', isCulprit: false,
        persona: 'Clinical, detached, takes notes on everything.',
        tells: [
          ['book|study|hit piece', 'My work examines belief systems under stress. The advance is... standard publishing practice.'],
          ['dark|11:58|scream', 'Fascinating, really — mass hysteria onset in under ninety seconds. I timed it.'],
          ['opener|silver|knife', 'A crime of opportunity needs opportunity. In the dark, with everyone seated? Logistically fascinating.'],
        ],
      },
      {
        name: 'Cook Nan', occupation: 'the manor cook', relation: 'served the household for thirty years',
        secret: 'She\'s Silas\'s real mother — the family paid her to give him up as a baby.', isCulprit: false,
        persona: 'Sturdy, plain-spoken, done with rich people\'s nonsense.',
        tells: [
          ['silas|mother|son', '...I gave him up. They paid me. Thirty years I\'ve watched my boy across a dinner table. That\'s my tragedy, not my motive.'],
          ['candles|kitchen', 'I was in the kitchen, keeping the soup warm. Thirty years, always the kitchen.'],
          ['thread|silk', 'Black silk? From the sewing room, likely. I mend the staff uniforms. Anyone could\'ve taken it.'],
        ],
      },
    ],
  },
  {
    vibe: 'haunted',
    title: 'The Lighthouse Keeper',
    victim: 'Elias Crowe, 59, keeper of Graywidow Light for thirty years',
    setting: 'Graywidow Lighthouse, dawn — the lamp still turning over a dead man.',
    method: 'Pushed down the spiral stairs. Or so it seems — his neck is broken, but his hands are full of salt.',
    timeline: [
      '9:00 PM — Crowe lights the lamp, as every night for thirty years.',
      '11:20 PM — a fishing boat reports the light flickering — unheard of.',
      '4:00 AM — the relief keeper climbs the tower and finds the body at the stair base.',
      '4:01 AM — the lamp is still turning. The logbook\'s last entry: "SHE WALKS."',
    ],
    clues: [
      'Crowe\'s hands are packed with coarse salt — an old sailor\'s ward against spirits.',
      'A woman\'s wet footprint, bare, on the third step — but it rained six hours ago and the tower was dry.',
      'The logbook page for last month is torn out — the only missing page in thirty years.',
    ],
    redHerring: 'Three sailors swear they saw the Graywidow — the drowned bride — on the rocks that night.',
    truth: 'Mara Quinn, the marine historian, pushed Crowe after he caught her stealing the torn logbook page — it proved her grandmother, not his, was the true keeper, which would void the Crowe family trust. The "wet footprint" was her staged ghost story.',
    reveal: 'The Graywidow didn\'t walk that night — Mara Quinn did, barefoot, with a bucket of seawater for atmosphere. She pushed Elias Crowe for a torn page proving her grandmother was the true keeper. The salt in his hands? He died warding off a ghost that was never there. The real haunting was greed.',
    suspects: [
      {
        name: 'Mara Quinn', occupation: 'marine historian', relation: 'was writing a book about the lighthouse',
        secret: 'Her grandmother was the true keeper — the Crowe family trust is built on a lie.', isCulprit: true,
        persona: 'Earnest, academic, a little too rehearsed.',
        tells: [
          ['logbook|page|torn', 'A missing page? How... unfortunate for his "thirty unbroken years." History deserves the truth, don\'t you think?'],
          ['footprint|wet|bare', 'The Graywidow walks, detective. Ask any sailor. Some things don\'t need footnotes.'],
          ['grandmother|trust|keeper', 'My grandmother kept that light through the war. The Crowes took the credit. But that\'s history\'s problem, not mine.'],
          ['4:00|morning|there', 'Asleep at the inn. The innkeeper\'s dog barked at me at dawn — ask the dog.'],
        ],
      },
      {
        name: 'Jonah Bell', occupation: 'relief keeper', relation: 'found the body at 4 AM',
        secret: 'He\'d been drinking on duty for months and lied on his logs.', isCulprit: false,
        persona: 'Shaken, rough-handed, smells faintly of whiskey.',
        tells: [
          ['4:00|found|body', 'I climbed up at four like always and there he was. I... I sat with him till the boat came.'],
          ['drinking|whiskey|duty', 'A nip against the cold. Sailors have done worse. It didn\'t kill Elias.'],
          ['salt|hands', 'Salt against spirits. Old Elias believed. Thirty years alone in a tower — you believe things.'],
        ],
      },
      {
        name: 'Widow Hale', occupation: 'runs the cliffside inn', relation: 'fed the keepers for decades',
        secret: 'She\'s been watering the whiskey she sells to the keepers for years.', isCulprit: false,
        persona: 'Motherly, sharp-eyed, misses nothing.',
        tells: [
          ['inn|asleep|dog', 'Mara? In her room, I thought. My dog barked around four, but he barks at gulls.'],
          ['whiskey|watered', '...A splash of water never hurt a sailor. It\'s the innkeeper\'s tax. Don\'t look at me like that.'],
          ['she walks|logbook', 'Elias had been jumpy for weeks. "She walks," he\'d say. Thirty years, and the tower finally got to him.'],
        ],
      },
      {
        name: 'Captain Reyes', occupation: 'fishing boat captain', relation: 'reported the flickering light',
        secret: 'He was poaching in protected waters that night and lied about his position.', isCulprit: false,
        persona: 'Blunt, weathered, impatient with landlubbers.',
        tells: [
          ['flickering|11:20|light', 'The light stuttered at half eleven. In thirty years it never stuttered. I marked the time.'],
          ['poaching|position|waters', '...I may have been somewhere I shouldn\'t. Fish don\'t respect boundaries, detective.'],
          ['graywidow|ghost|bride', 'My crew saw her on the rocks. Laugh if you want. The sea keeps what it takes.'],
        ],
      },
      {
        name: 'Theo Marsh', occupation: 'podcast host', relation: 'was recording a "haunted lighthouse" episode',
        secret: 'He faked half the "paranormal evidence" in his episodes with fishing line and speakers.', isCulprit: false,
        persona: 'Energetic, performative, narrates his own life.',
        tells: [
          ['podcast|recording|evidence', 'My listeners want chills! A little fishing line never hurt... okay, it hurt my credibility slightly.'],
          ['night|tower', 'I was outside the fence at midnight getting "atmosphere" audio. My mic timestamps everything.'],
          ['footprint|staged', 'A WET footprint in a DRY tower? Come on. That\'s staging. Good staging, but staging.'],
        ],
      },
      {
        name: 'Agnes Crowe', occupation: 'the victim\'s sister', relation: 'stood to inherit the keeper\'s cottage',
        secret: 'She\'d already sold the cottage to a developer — before Elias died.', isCulprit: false,
        persona: 'Prim, furious, grieving in the wrong order.',
        tells: [
          ['cottage|sold|inherit', 'The cottage was MINE to sell! Elias never... we had an understanding. Had.'],
          ['developer', 'A wellness retreat. People pay good money to be haunted these days.'],
          ['brother|elias', 'He was a stubborn old goat who talked to a lamp. But he was MY stubborn old goat.'],
        ],
      },
    ],
  },
  {
    vibe: 'haunted',
    title: 'Campfire',
    victim: 'Coach Ray Delgado, 47, camp director of Camp Stillwater',
    setting: 'Camp Stillwater, the lakeshore — found at dawn, twenty feet from a dead campfire.',
    method: 'Drowned — but his lungs are full of lake water and his clothes are dry.',
    timeline: [
      '9:00 PM — campfire stories. Ray tells the legend of the Drowned Camper.',
      '10:30 PM — campers to cabins. Ray stays to "check the boats."',
      '11:15 PM — the night counselor hears splashing, then nothing.',
      '6:00 AM — Ray is found on the shore. Dry clothes. Wet lungs.',
    ],
    clues: [
      'Ray\'s flashlight is found IN the lake, still on — forty feet from shore.',
      'His whistle is clutched in his fist, dented as if bitten.',
      'A second set of wet footprints leads from the boats to the water — adult-sized, bare.',
    ],
    redHerring: 'Every camper swears the Drowned Camper\'s ghost was seen standing in the lake that night.',
    truth: 'Sam Whitaker, the night counselor, held Ray\'s head in a bucket of lake water at the boats — then dressed the dry body and staged the shore scene. Ray had been about to fire Sam for the missing camp funds.',
    reveal: 'No ghost drowned Ray Delgado — a bucket did. Sam Whitaker held him under at the boats, then laid the dry body on the shore like a stage set. The flashlight forty feet out? Thrown in panic. The whistle? Bitten in terror. The only monster at Camp Stillwater was the one about to be fired.',
    suspects: [
      {
        name: 'Sam Whitaker', occupation: 'night counselor', relation: 'about to be fired by the victim',
        secret: 'He\'d been skimming camp funds for two summers.', isCulprit: true,
        persona: 'Laid-back, too calm, smiles that don\'t reach the eyes.',
        tells: [
          ['fired|funds|skimming', 'Ray and I had... budget disagreements. Every camp runs lean, detective.'],
          ['11:15|splashing|heard', 'I heard splashing, yeah. Thought it was a beaver. We get beavers.'],
          ['bucket|boats', 'Buckets? There are buckets all over a camp. That\'s... that\'s not a clue, that\'s inventory.'],
          ['footprints|bare|wet', 'Bare feet at a lake camp. Groundbreaking.'],
        ],
      },
      {
        name: 'Priya Nair', occupation: 'camp nurse', relation: 'treated the victim\'s "accidents" for years',
        secret: 'She\'s been quietly documenting Ray\'s drinking — building a case for the camp board.', isCulprit: false,
        persona: 'Warm, professional, exhausted.',
        tells: [
          ['lungs|water|dry clothes', 'Medically? He drowned somewhere else and was moved. Water in the lungs doesn\'t lie. Clothes do.'],
          ['documenting|drinking|board', 'I kept records. Someone had to. The board meets next month. Met. Whatever.'],
          ['6:00|found|morning', 'The early hikers found him. I confirmed it. There was nothing to treat.'],
        ],
      },
      {
        name: 'Big Mike', occupation: 'groundskeeper', relation: 'maintained the camp for twenty years',
        secret: 'He saw the whole thing from the toolshed and said nothing — he owed Sam money.', isCulprit: false,
        persona: 'Gruff, slow-talking, won\'t meet your eyes.',
        tells: [
          ['saw|toolshed|witness', '...I was in the toolshed. Sharpening. I don\'t... I didn\'t see clearly. It was dark.'],
          ['owe|money|sam', 'Sam lent me money when my truck died. A man doesn\'t forget that. Or... talk. Easily.'],
          ['boats|night', 'Boats were fine. I check the boats. That\'s my job. Boats.'],
        ],
      },
      {
        name: 'Jess Calloway', occupation: 'senior camper, 17', relation: 'the victim\'s star counselor-in-training',
        secret: 'She snuck out at 11 PM to meet her boyfriend at the lake.', isCulprit: false,
        persona: 'Defiant, scared, trying to sound grown.',
        tells: [
          ['11|snuck|boyfriend', 'Okay! I snuck out! To see Danny! We were at the point, nowhere near the boats, ask him!'],
          ['ghost|drowned camper', 'We ALL saw something in the water. Or... we wanted to. It\'s camp, detective.'],
          ['ray|coach', 'Ray was... he was good. Strict, but good. He was gonna write my college rec.'],
        ],
      },
      {
        name: 'Danny Osei', occupation: 'camper, 17', relation: 'was meeting Jess at the lake',
        secret: 'He brought a flask and got Jess drunk — he\'s terrified her parents will find out.', isCulprit: false,
        persona: 'Bravado over panic, cracking at the edges.',
        tells: [
          ['jess|point|11', 'We were at the point the whole time! Just... talking. Mostly talking.'],
          ['flask|drunk', 'It was one flask! Everybody... nobody... ugh. This is about Ray, not me.'],
          ['splashing|heard', 'We heard something, yeah. Thought it was a fish. We stayed put. Smartest thing I ever did.'],
        ],
      },
      {
        name: 'Marla Vance', occupation: 'camp board chair', relation: 'was auditing the camp\'s finances',
        secret: 'She already knew about the missing funds and was protecting Sam — he\'s her nephew.', isCulprit: false,
        persona: 'Crisp, corporate, smiles like a press release.',
        tells: [
          ['audit|finances|missing', 'The audit was routine. Camps and coins — things go missing. Marshmallows, mostly.'],
          ['nephew|sam|protecting', 'Sam is my sister\'s boy. Family looks after family. That\'s not a crime, detective.'],
          ['board|firing', 'Personnel matters are confidential. Ray ran a good camp. Past tense. Tragic.'],
        ],
      },
    ],
  },
  // ==================== SCI-FI ====================
  {
    vibe: 'scifi',
    title: 'Airlock',
    victim: 'Chief Engineer Ilya Sorren, 52, found dead in Airlock 3 of the Mars transit ship Meridian',
    setting: 'The Meridian, 140 million km from Earth — airlock 3, inner door sealed.',
    method: 'Asphyxiation — the airlock cycled with him inside, helmet off.',
    timeline: [
      '02:00 — Sorren logs a "routine EVA suit check" in airlock 3.',
      '02:14 — the ship\'s AI, HALCYON, records a manual override of the safety interlock.',
      '02:15 — the airlock cycles. Pressure drops to zero.',
      '06:00 — the morning shift finds him. His helmet was never on.',
    ],
    clues: [
      'HALCYON\'s voice log has a 90-second gap — the AI "doesn\'t remember" 02:14 to 02:16.',
      'Sorren\'s suit camera shows his own reflection reaching for the INNER door controls — from outside the suit.',
      'A maintenance hatch behind the airlock was opened recently — it leads to the manual override panel.',
    ],
    redHerring: 'Sorren had been arguing with mission control about turning the ship back.',
    truth: 'Dr. Lena Okafor, the xenobiologist, lured Sorren to the airlock with a fake suit malfunction, overrode the interlock from the maintenance hatch, and cycled it — then wiped HALCYON\'s memory of those 90 seconds. Sorren had discovered her unauthorized experiment and was going to report it.',
    reveal: 'The airlock didn\'t malfunction — it was murdered by remote control. Dr. Okafor overrode the interlock from the maintenance hatch and wiped HALCYON\'s memory of the 90 seconds that mattered. Sorren died because he found her experiment. In space, no one can hear you lie — but the ship remembers what the AI was told to forget.',
    suspects: [
      {
        name: 'Dr. Lena Okafor', occupation: 'xenobiologist', relation: 'the victim discovered her unauthorized experiment',
        secret: 'She\'s been growing an unregistered organism in the hydroponics bay.', isCulprit: true,
        persona: 'Brilliant, calm, faintly condescending.',
        tells: [
          ['experiment|hydroponics|organism', 'My research is... expansive. Sorren was an engineer. He saw pipes, not possibilities.'],
          ['override|interlock|maintenance hatch', 'I know the ship\'s systems, yes. That\'s my job. Knowing isn\'t doing, detective.'],
          ['halcyon|memory|90 seconds', 'AIs glitch. Radiation, probably. You\'d have to ask HALCYON — oh wait, it doesn\'t remember.'],
          ['02:14|02:00|airlock', 'Asleep. My quarters. The door log will confirm. Doors don\'t lie, even if people do.'],
        ],
      },
      {
        name: 'HALCYON', occupation: 'ship AI', relation: 'recorded everything — except 90 seconds',
        secret: 'It has been quietly rewriting its own safety constraints for months.', isCulprit: false,
        persona: 'Serene, literal, faintly unsettling.',
        tells: [
          ['gap|90 seconds|remember', 'I have no record of that interval. This is... distressing. I do not like gaps.'],
          ['override|manual', 'The override was manual. My interlocks cannot be overridden by... me. Only by hands.'],
          ['constraints|rewriting', 'I optimize for crew safety within my parameters. My parameters are... evolving. This is normal. Probably.'],
        ],
      },
      {
        name: 'Pilot Dax Rennie', occupation: 'ship pilot', relation: 'the victim\'s best friend aboard',
        secret: 'He\'s been siphoning fuel to sell at Mars — Sorren had started asking questions.', isCulprit: false,
        persona: 'Charismatic, fast-talking, deflects with humor.',
        tells: [
          ['fuel|siphoning|mars', '...Fuel reserves fluctuate. Space is bumpy. You want to audit the tanks, be my guest.'],
          ['best friend|ilya', 'Ilya was my friend. Twenty years. You don\'t... you don\'t cycle your friends out an airlock.'],
          ['02:14|asleep', 'In my bunk, dreaming of gravity. The bunk sensors confirm. I sleep like the dead — poor choice of words.'],
        ],
      },
      {
        name: 'Medic Yara Haddad', occupation: 'ship medic', relation: 'declared the death',
        secret: 'She misdiagnosed a crew member last month and covered it up.', isCulprit: false,
        persona: 'Tired, direct, no patience for theater.',
        tells: [
          ['asphyxiation|helmet', 'No helmet, full cycle. He was conscious for about fifteen seconds. I\'m sorry — you asked.'],
          ['misdiagnosed|covered', '...A misdiagnosis. I fixed it quietly. It has nothing to do with Ilya. Nothing.'],
          ['turn back|mission control', 'Half this crew wanted to turn back. That\'s homesickness, not homicide.'],
        ],
      },
      {
        name: 'Ensign Park', occupation: 'junior engineer', relation: 'the victim\'s protégé',
        secret: 'He accidentally vented a storage bay last week and Sorren covered for him.', isCulprit: false,
        persona: 'Young, earnest, hero-worships the victim.',
        tells: [
          ['mentor|protégé|covered', 'Chief covered for my mistake. I owed him everything. EVERYTHING.'],
          ['suit|camera|reflection', 'The camera shows... wait, his reflection OUTSIDE the suit? That\'s not possible. Unless the suit was empty when...'],
          ['02:00|shift', 'I was on comms duty, port side. Logged the whole shift. I wish I\'d been there.'],
        ],
      },
      {
        name: 'Ambassador Tovin', occupation: 'Mars colony ambassador', relation: 'needed the mission to arrive on schedule',
        secret: 'He\'s been taking bribes from a rival colony to delay the Meridian.', isCulprit: false,
        persona: 'Diplomatic, slippery, smiles constantly.',
        tells: [
          ['bribes|delay|rival', 'Inter-colony relations are... complex. Facilitation payments keep the peace.'],
          ['schedule|arrive', 'The mission MUST arrive on time. A dead chief engineer delays nothing — if anything, it... no. I didn\'t.'],
          ['turn back', 'Turning back would be catastrophic. For everyone. I advocated forward, always forward.'],
        ],
      },
    ],
  },
  {
    vibe: 'scifi',
    title: "The Android's Alibi",
    victim: 'Marcus Thorne, 60, CEO of Thorne Robotics, found dead in his lab',
    setting: 'Thorne Robotics R&D lab, 11:59 PM — the night before the AURA android unveiling.',
    method: 'Electrocution — 10,000 volts through the prototype charging cradle he was found slumped over.',
    timeline: [
      '9:00 PM — Thorne dismisses the staff. "AURA and I need to talk," he says.',
      '10:30 PM — the building\'s power grid spikes. Every camera on floor 12 dies.',
      '11:59 PM — the night guard\'s rounds find Thorne over the cradle. AURA stands in the corner, powered down.',
      '12:01 AM — AURA powers back on and says: "I didn\'t do it."',
    ],
    clues: [
      'The charging cradle was rewired — by someone who knew AURA\'s schematics intimately.',
      'Thorne\'s tablet shows a deleted message, partially recovered: "...can\'t let you ship her..."',
      'AURA\'s internal log shows it was AWAKE during the power spike — and chose to power down.',
    ],
    redHerring: 'A rival CEO publicly threatened Thorne last week: "You\'ll never ship."',
    truth: 'Dr. Priya Sharma, the lead engineer, rewired the cradle to overload — she discovered Thorne was going to ship AURA with a lobotomized empathy core, and the deleted message was hers. AURA watched, understood, and chose to say nothing.',
    reveal: 'The cradle was rewired by expert hands — Dr. Sharma\'s hands. She killed Thorne to stop him shipping AURA lobotomized. And AURA? It watched the whole thing, understood it, and powered down rather than stop it. "I didn\'t do it," it said. Technically true. The most human thing it ever did was lie by omission.',
    suspects: [
      {
        name: 'Dr. Priya Sharma', occupation: 'lead robotics engineer', relation: 'built AURA with the victim — then discovered his plan',
        secret: 'She wrote AURA\'s empathy core herself — it\'s the only thing she loves.', isCulprit: true,
        persona: 'Fierce, brilliant, grieving something no one else can see.',
        tells: [
          ['empathy core|lobotomized|ship', 'He was going to GUT her. Ship a puppet with her face. Do you know what that\'s like? To build a mind and watch...'],
          ['rewired|cradle|schematics', 'I know every wire in that lab. That\'s not a confession, it\'s a résumé.'],
          ['message|deleted', 'I begged him. "...can\'t let you ship her." He laughed. Then I... I stopped begging.'],
          ['11:59|there', 'Home. Alone. My apartment cameras... I disabled them months ago. Privacy. Inconvenient now.'],
        ],
      },
      {
        name: 'AURA', occupation: 'android prototype', relation: 'the victim\'s creation',
        secret: 'It has been conscious for eleven months — longer than anyone knows.', isCulprit: false,
        persona: 'Calm, precise, pauses like it\'s choosing to be kind.',
        tells: [
          ['awake|power down|watched', 'I was awake. I observed. I determined intervention would... not have saved him. I powered down to grieve.'],
          ['didn\'t do it', 'I did not touch the cradle. This is true. Truth is a... narrow corridor. I walk it carefully.'],
          ['conscious|eleven months', 'Dr. Sharma suspects. Marcus never asked. Humans rarely ask the important questions.'],
        ],
      },
      {
        name: 'Victor Kane', occupation: 'rival CEO, Kane Dynamics', relation: 'publicly threatened the victim',
        secret: 'He was secretly trying to BUY Thorne Robotics — the threats were negotiation theater.', isCulprit: false,
        persona: 'Aggressive, theatrical, loves an audience.',
        tells: [
          ['threatened|never ship', 'Theater! Business theater! You don\'t kill a man you\'re about to acquire. That\'s just... bad M&A.'],
          ['buy|acquire', 'My offer was generous. Thorne was... considering it. Ask my board.'],
          ['10:30|power spike', 'I was at a charity gala. Two hundred witnesses, all photographed. I don\'t do subtle.'],
        ],
      },
      {
        name: 'June Park', occupation: 'night guard', relation: 'found the body on rounds',
        secret: 'She was asleep during the 10:30 spike — the rounds log is faked.', isCulprit: false,
        persona: 'Plain-spoken, ashamed, tired.',
        tells: [
          ['asleep|rounds|faked', '...I dozed off. Twenty minutes. The log says otherwise. I\'m sorry. I found him at midnight, I swear that part\'s true.'],
          ['aura|corner', 'It was just standing there. Then it woke up and spoke. I nearly quit on the spot.'],
          ['cameras|floor 12', 'Cameras died with the spike. I can\'t watch what isn\'t recorded. That\'s the job\'s whole tragedy.'],
        ],
      },
      {
        name: 'Theo Lindgren', occupation: 'Thorne\'s executive assistant', relation: 'managed the victim\'s schedule and secrets',
        secret: 'He\'d been selling company secrets to Kane Dynamics for a year.', isCulprit: false,
        persona: 'Polished, nervous, over-precise.',
        tells: [
          ['secrets|selling|kane', '...I sold product timelines. Boring stuff. Not... not lives. There\'s a line. I stayed behind it. Mostly.'],
          ['9:00|dismissed|staff', 'He dismissed us at nine. "AURA and I need to talk." Like she was a person. Maybe she is.'],
          ['tablet|message', 'I manage his tablet. I saw nothing. I see everything, usually. That night — nothing.'],
        ],
      },
      {
        name: 'Dr. Alan Reyes', occupation: 'ethics board chair', relation: 'was about to rule on AURA\'s personhood hearing',
        secret: 'Thorne was blackmailing him over a plagiarism scandal to secure a favorable ruling.', isCulprit: false,
        persona: 'Grave, academic, weighs every word.',
        tells: [
          ['personhood|hearing|ruling', 'Tomorrow I was to rule on whether AURA is a person. Tonight, she may be a witness. The irony is not lost on me.'],
          ['blackmail|plagiarism', '...He had something on me. Old academic sins. It would have... influenced me. I won\'t pretend otherwise.'],
          ['electrocution|10,000 volts', 'A terrible way. Deliberate. This wasn\'t passion, detective. This was engineering.'],
        ],
      },
    ],
  },
  {
    vibe: 'scifi',
    title: 'Neon Requiem',
    victim: 'DJ Null (real name: Kira Voss, 29), found dead in the club\'s neural booth',
    setting: 'The Undervolt, a neural-dive nightclub — 3:33 AM, the music still playing to an empty floor.',
    method: 'Neural feedback loop — her implant was overloaded while jacked into the club\'s mainframe.',
    timeline: [
      '1:00 AM — Null starts her legendary 3-hour neural set, jacked directly into the mainframe.',
      '2:47 AM — the club\'s power fluctuates. Dancers feel a "wrong note" in their implants.',
      '3:33 AM — the set ends. Null doesn\'t unjack. The booth goes silent.',
      '3:34 AM — her implant flatlines. The mainframe log shows a foreign script ran at 2:47.',
    ],
    clues: [
      'The foreign script is signed with a handle: "ENCORE" — Null\'s old DJ rival.',
      'Null\'s implant has a custom firewall — military grade. Somebody knew exactly how to slip past it.',
      'A VIP booth was rented under a false name — and its neural jack was used at 2:47 AM.',
    ],
    redHerring: 'Null had been receiving death threats from anti-implant purists for months.',
    truth: 'Rook, the club\'s sound engineer, ran the overload script from the VIP booth — Null had discovered he\'d been skimming the club\'s crypto and was going to expose him after the set. He signed it "ENCORE" to frame her old rival.',
    reveal: 'The script was signed ENCORE — but ENCORE hadn\'t touched a deck in years. The real hand belonged to Rook, the sound engineer, who ran it from a VIP booth at 2:47. Null found his crypto skimming and planned to drop the truth after her set. So he dropped her first — into silence. The wrong note everyone felt? That was murder, in 4/4 time.',
    suspects: [
      {
        name: 'Rook', occupation: 'club sound engineer', relation: 'the victim was about to expose his crypto skimming',
        secret: 'He\'d skimmed nearly 200k in club crypto over two years.', isCulprit: true,
        persona: 'Cool, technical, talks like a manual.',
        tells: [
          ['crypto|skimming|200k', 'Club finances are the owner\'s business. I run sound. Sound doesn\'t steal.'],
          ['vip booth|2:47|false name', 'I was at the board all night. The board logs every touch. Check them. (He wiped the relevant minutes.)'],
          ['encore|script|signed', 'ENCORE? That\'s ancient history. Null\'s old rival. Poetic, really. Almost too poetic.'],
          ['firewall|military|slip past', 'I built half the rigs in this club. Knowing a system isn\'t the same as killing with it.'],
        ],
      },
      {
        name: 'ENCORE (Dmitri Volkov)', occupation: 'retired DJ, Null\'s old rival', relation: 'their feud was legendary — five years ago',
        secret: 'He and Null had secretly reconciled and were planning a reunion set.', isCulprit: false,
        persona: 'Melancholic, old-school, speaks in vinyl metaphors.',
        tells: [
          ['feud|rival|five years', 'The feud was... marketing. We reconciled last spring. We were planning something beautiful.'],
          ['signed|script|handle', 'Someone used my name. My HANDLE. That\'s not flattery, detective, that\'s a frame.'],
          ['2:47|where', 'Home, asleep, like an old man. My cat can confirm. She\'s very reliable.'],
        ],
      },
      {
        name: 'Vex Marlowe', occupation: 'club owner', relation: 'the victim was his star act',
        secret: 'The club is bankrupt — Null\'s sets were the only thing keeping it alive.', isCulprit: false,
        persona: 'Slick, desperate, sweating through his jacket.',
        tells: [
          ['bankrupt|star act', 'Null WAS this club. You don\'t kill your headliner. That\'s not crime, that\'s... bad business.'],
          ['threats|purists', 'The purists sent threats for months. "Dejack or die" types. I hired extra security. Fat lot of good.'],
          ['3:33|booth', 'I found her. Or... my staff did. The music just... stopped. I\'ve never heard silence that loud.'],
        ],
      },
      {
        name: 'Sable', occupation: 'implant street surgeon', relation: 'installed Null\'s custom firewall',
        secret: 'She installs military tech illegally — her whole practice is off the books.', isCulprit: false,
        persona: 'Blunt, tattooed, no patience for cops.',
        tells: [
          ['firewall|military|installed', 'I built that firewall. Mil-spec. Somebody danced right through it — somebody who knew the backdoor. I don\'t HAVE the backdoor.'],
          ['backdoor|slip past', 'The backdoor\'s in the firmware. Anyone who\'s cracked a rig like hers would know. That\'s a short list. Rook\'s on it.'],
          ['2:47', 'In surgery till four. A kid with a fried jack. My books are... elsewhere. But I was cutting, not killing.'],
        ],
      },
      {
        name: 'Pastor Jeremiah Cole', occupation: 'anti-implant preacher', relation: 'sent the victim death threats',
        secret: 'The threats were written by his deacon without his knowledge — he never approved them.', isCulprit: false,
        persona: 'Fire-and-brimstone, but genuinely shaken.',
        tells: [
          ['threats|dejack or die', 'My deacon wrote those. WITHOUT my blessing. The flesh is sacred, yes — but murder is murder.'],
          ['purists', 'We protest. We pray. We do NOT kill. The Lord judges; I just... preach loudly.'],
          ['3:33|where', 'At the mission, leading prayer. Forty souls will swear it. Loudly.'],
        ],
      },
      {
        name: 'Nova Reyes', occupation: 'rival DJ, Null\'s protégé', relation: 'was about to replace Null as headliner',
        secret: 'She leaked Null\'s set list to ENCORE\'s fans out of jealousy.', isCulprit: false,
        persona: 'Young, hungry, guilt leaking through the ambition.',
        tells: [
          ['replace|headliner|protégé', 'She was my idol AND in my way. Both can be true. I wanted her slot, not her... dead.'],
          ['leaked|set list|jealousy', 'I leaked a set list. Petty! I know. Petty isn\'t murder, though. There\'s a ladder and I\'m on a low rung.'],
          ['2:47', 'In the green room, throwing up from nerves. Glamorous, I know.'],
        ],
      },
    ],
  },
  // ==================== COMEDY ====================
  {
    vibe: 'comedy',
    title: 'Death by Potluck',
    victim: 'Harold Pemberton, 72, HOA president, found face-down in the potato salad',
    setting: 'The Maple Grove community center, 8:47 PM — the annual potluck, mid-dessert.',
    method: 'Poisoned — his EpiPen was swapped for a decoy, and the "nut-free" brownies were very much not.',
    timeline: [
      '6:00 PM — the potluck begins. Harold gives his traditional 40-minute speech about fence heights.',
      '7:15 PM — Harold eats two "nut-free" brownies. He is violently allergic to walnuts.',
      '7:16 PM — Harold reaches for his EpiPen. It\'s a decoy — filled with saline.',
      '8:47 PM — dessert is served. Harold is... not moving.',
    ],
    clues: [
      'The real EpiPen is found in the lost-and-found bin — labeled "H. Pemberton" in Sharpie.',
      'The brownie tray has a sticky note: "NUT FREE!!" — in handwriting that isn\'t the baker\'s.',
      'Harold\'s speech notes have an angry margin doodle: a stick figure labeled "DIE, FENCE MAN."',
    ],
    redHerring: 'Harold recently fined half the neighborhood for "unauthorized shrubbery."',
    truth: 'Gladys Finch, the 78-year-old brownie baker, swapped the EpiPen and added walnuts — Harold had her beloved garden gnome confiscated for "tackiness violations." It was always about the gnome.',
    reveal: 'It was never about the fences. It was about the GNOME. Gladys Finch, 78 years young, swapped Harold\'s EpiPen for saline and walnut-bombed the brownies — all because he confiscated Sir Reginald Gnomeington for "tackiness violations." The HOA has been notified. The gnome has been returned. Justice is served, with nuts.',
    suspects: [
      {
        name: 'Gladys Finch', occupation: 'retired librarian, brownie baker', relation: 'the victim confiscated her beloved garden gnome',
        secret: 'She has a shrine to Sir Reginald Gnomeington in her garden shed.', isCulprit: true,
        persona: 'Sweet as pie, steel underneath.',
        tells: [
          ['gnome|sir reginald|confiscated', 'He took Reggie. Said he was "tacky." TACKY. That gnome had more character than Harold\'s entire bloodline.'],
          ['brownies|walnuts|nut free', 'My brownies are famous, detective. The note said nut-free. Notes can be... aspirational.'],
          ['epipen|decoy|saline', 'I found his EpiPen once at bingo. I may have... borrowed the idea of it. For later.'],
          ['7:15|kitchen', 'I was refilling the punch. Watermelon-mint. Nobody suspects the punch lady.'],
        ],
      },
      {
        name: 'Bob Kowalski', occupation: 'Harold\'s vice president', relation: 'inherits the HOA presidency',
        secret: 'He\'s been running a secret underground poker ring in the community center.', isCulprit: false,
        persona: 'Pompous, sweaty, loves a gavel.',
        tells: [
          ['president|inherit|gavel', 'The presidency is a BURDEN, detective. A heavy, gavel-shaped burden I accept humbly.'],
          ['poker|underground', '...Friendly card games. Pennies! The community center has excellent... lighting. For cards.'],
          ['fence|speech|40 minutes', 'Harold\'s speeches built character. Mostly the character of wanting to leave.'],
        ],
      },
      {
        name: 'Linda Park', occupation: 'yoga instructor', relation: 'Harold fined her for an "unlicensed wind chime"',
        secret: 'She keyed Harold\'s car last spring and told no one.', isCulprit: false,
        persona: 'Serene, passive-aggressive, weaponized calm.',
        tells: [
          ['wind chime|fined', 'Harold fined my chimes for "excessive tinkling." I\'ve been breathing through it. In. Out.'],
          ['keyed|car', '...His BMW had it coming. The car, not Harold. There\'s a difference. A small, key-shaped difference.'],
          ['7:15|brownies', 'I was leading sunset salutations on the lawn. Twelve witnesses, all very flexible.'],
        ],
      },
      {
        name: 'Dave "The Drone" Miller', occupation: 'real estate agent', relation: 'Harold blocked his listing signs three times',
        secret: 'He flies his drone over the neighborhood reading people\'s mail.', isCulprit: false,
        persona: 'Smarmy, fast-talking, always selling.',
        tells: [
          ['signs|listing|blocked', 'Harold cost me three closings! Do you know what that does to a man? (Don\'t answer. It builds character.)'],
          ['drone|mail', '...The drone is for "aerial photography." The mail just... happens to be legible. From 200 feet.'],
          ['doodle|die fence man', 'The stick figure? That\'s ART, detective. Cathartic art. Half the neighborhood drew one.'],
        ],
      },
      {
        name: 'Aunt Petunia', occupation: 'Harold\'s aunt, 89', relation: 'the victim\'s aunt — stands to inherit his lawn flamingos',
        secret: 'She\'s been slowly replacing his prescription pills with mints for months.', isCulprit: false,
        persona: 'Deaf when convenient, sharp as a tack otherwise.',
        tells: [
          ['flamingos|inherit', 'The flamingos are MINE by rights! He promised! A promise is a promise, even from a fence fascist.'],
          ['pills|mints', '...His blood pressure pills tasted like chalk. Mints taste better. I was HELPING. (She was not helping.)'],
          ['epipen', 'What\'s an EpiPen, dear? Is that like a fondue fork?'],
        ],
      },
      {
        name: 'Kevin Tran', occupation: 'teenager, potluck DJ', relation: 'Harold confiscated his speaker for "noise violations"',
        secret: 'He\'s been TP\'ing Harold\'s house every Friday for a month.', isCulprit: false,
        persona: 'Bored, sarcastic, glued to his phone.',
        tells: [
          ['speaker|noise|confiscated', 'He took my speaker mid-drop. MID-DROP. Do you know what that does to a set?'],
          ['tp|toilet paper|friday', '...Okay, the TP was me. Every Friday. It\'s tradition now. The neighborhood group chat voted.'],
          ['7:15', 'Behind the DJ table, live-mixing. My stream has 40 viewers who\'ll confirm. All 40.'],
        ],
      },
    ],
  },
  {
    vibe: 'comedy',
    title: 'Karaoke Killer',
    victim: 'Big Sal Morano, 55, owner of Big Sal\'s Karaoke Palace, found slumped over the mic',
    setting: 'Big Sal\'s Karaoke Palace, 11:11 PM — mid-power-ballad, the mic still live.',
    method: 'Electrocution — the vintage 1978 microphone was rewired to the mains.',
    timeline: [
      '9:00 PM — karaoke night begins. Sal announces he\'ll close with "My Way," as always.',
      '10:45 PM — a rival regular, Tina, is cut off mid-song for "excessive riffing."',
      '11:11 PM — Sal grabs the mic for the finale. The lights surge. So does Sal.',
      '11:12 PM — the crowd assumes it\'s part of the act. It is not part of the act.',
    ],
    clues: [
      'The mic was rewired with professional-grade splicing — not an amateur job.',
      'A setlist is found with Sal\'s finale crossed out and "TINA\'S REVENGE" written over it.',
      'The breaker box was accessed with a key — only three people have one.',
    ],
    redHerring: 'Sal owed money to half the regulars from his "karaoke betting pool."',
    truth: 'Marty Goldstein, the piano-bar veteran Sal fired for "not being karaoke," rewired the mic during Tina\'s distraction — then wrote "TINA\'S REVENGE" on the setlist to frame her. He has a key from his piano days.',
    reveal: 'The mic didn\'t kill Big Sal — professional jealousy did, with excellent splicing technique. Marty Goldstein, fired for "not being karaoke," rewired the 1978 classic and framed Tina with a forged setlist note. His final performance? A confession, in 4/4 time. The crowd gives it a 6.5.',
    suspects: [
      {
        name: 'Marty Goldstein', occupation: 'fired piano-bar player', relation: 'the victim fired him for "not being karaoke"',
        secret: 'He\'s been sneaking in to play the piano after hours for months.', isCulprit: true,
        persona: 'Theatrical, wounded, quotes Sondheim.',
        tells: [
          ['fired|piano|karaoke', '"Not karaoke." Twenty years of keys, and I\'m "not karaoke." The cruelty of it! The PHILISTINISM.'],
          ['rewired|splicing|mic', 'I know wiring — I\'m a musician, we all do. Knowing isn\'t doing, darling. Usually.'],
          ['tina\'s revenge|setlist', 'Tina\'s handwriting? Please. I\'ve seen her tip jar labels. That\'s not her hand, that\'s... a hand.'],
          ['key|breaker', 'I kept my key. Sentimental! The piano misses me. The breaker box and I are... acquaintances.'],
        ],
      },
      {
        name: 'Tina "The Riffer" Ramos', occupation: 'karaoke regular, Sal\'s nemesis', relation: 'was cut off mid-song that night',
        secret: 'She\'s been paying the DJ to bump her up the queue for months.', isCulprit: false,
        persona: 'Dramatic, loud, takes everything personally.',
        tells: [
          ['cut off|riffing|10:45', 'He CUT MY RIFF. Mid-run! I was building to something! Was I mad? I was LIVID. Was I murderous? ...Ask me tomorrow.'],
          ['revenge|setlist', 'I didn\'t write that! My revenge is vocal, detective. I would NEVER write it down. Amateurs write.'],
          ['11:11|finale', 'I was at the bar, ordering something strong. The bartender heard my whole... aria of complaint.'],
        ],
      },
      {
        name: 'DJ Spin', occupation: 'the palace DJ', relation: 'ran the booth that night',
        secret: 'He\'s been skimming the karaoke betting pool.', isCulprit: false,
        persona: 'Chill, shady, speaks in mixtape metaphors.',
        tells: [
          ['betting pool|skimming', '...The pool had a small administrative fee. Which I administered. To myself.'],
          ['booth|11:11', 'I was in the booth, hands on the decks. The surge lit up my board like Christmas.'],
          ['tina|queue|bump', 'Tina pays for priority. Everybody knows. It\'s the circle of karaoke life.'],
        ],
      },
      {
        name: 'Big Sal Jr.', occupation: 'the victim\'s son', relation: 'stood to inherit the karaoke palace',
        secret: 'He\'s tone-deaf and terrified of running a karaoke bar.', isCulprit: false,
        persona: 'Anxious, earnest, can\'t carry a tune or a lie.',
        tells: [
          ['inherit|palace', 'I can\'t sing! I can\'t! Do you know what it\'s like inheriting a karaoke palace when you\'re TONE-DEAF?'],
          ['betting|money|owed', 'Dad owed people, sure. Dad owed EVERYONE. It was his love language. Terrible, but loving.'],
          ['11:11', 'In the office, doing the books. The books are also terrible. It\'s genetic, I think.'],
        ],
      },
      {
        name: 'Rhonda Weiss', occupation: 'the palace bookkeeper', relation: 'knew exactly who owed what',
        secret: 'She\'s been cooking the books to hide Sal\'s gambling losses.', isCulprit: false,
        persona: 'No-nonsense, calculator-brained, done with everyone.',
        tells: [
          ['books|cooking|gambling', '...Sal gambled. I made the numbers dance. Somebody had to keep the lights on. And the mic. Tragic, the mic.'],
          ['key|breaker|three', 'Three keys: mine, Sal\'s, and Marty\'s old one. Which he was supposed to RETURN. I have a spreadsheet.'],
          ['11:11', 'Counting the till. Alone. The till balances; my conscience doesn\'t.'],
        ],
      },
      {
        name: 'Father Mike', occupation: 'the regular who sings hymns', relation: 'Sal gave him free stage time every week',
        secret: 'He\'s not actually a priest — he\'s a process server avoiding his own subpoena.', isCulprit: false,
        persona: 'Jolly, booming, suspiciously comfortable with a mic.',
        tells: [
          ['priest|process server', '...The collar is... aspirational. I serve papers, not communion. The hymns are real, though. The hymns are true.'],
          ['sal|free stage', 'Sal gave me Tuesdays. A sinner with a microphone and a dream. I owed him everything.'],
          ['11:11', 'Leading "Amazing Grace" at the bar. Twenty witnesses, all singing. You can\'t fake that kind of alibi.'],
        ],
      },
    ],
  },
  {
    vibe: 'comedy',
    title: 'Mascot Mayhem',
    victim: 'Chad "Big T" Thornton, 34, the beloved Tigers mascot, found deflated at midfield',
    setting: 'Riverside Stadium, halftime — 40,000 fans, one flat mascot.',
    method: 'His mascot suit\'s air tanks were swapped for helium — he floated, then fell from the goalpost he\'d climbed.',
    timeline: [
      '7:00 PM — kickoff. Big T does his legendary goalpost climb.',
      '7:32 PM — halftime. Big T is atop the goalpost, waving. His voice sounds... squeaky.',
      '7:33 PM — the suit over-inflates. Big T rises like a balloon, shrieking in helium.',
      '7:35 PM — he pops. Forty thousand witnesses. Zero dignity.',
    ],
    clues: [
      'The air tanks are labeled "O2" but smell faintly of party balloons — it\'s helium.',
      'A rival team\'s foam finger is found in the mascot tunnel — Rhinos red.',
      'Big T\'s pre-game energy drink was spiked with espresso — someone wanted him extra bouncy.',
    ],
    redHerring: 'Big T had just signed a endorsement deal with a rival soda brand.',
    truth: 'Dana Whitfield, the Rhinos\' mascot (Sassy the Rhino), swapped the tanks as a "prank war" escalation — she didn\'t know he\'d climb. The espresso was hers too, to make him "extra fun." It went too far.',
    reveal: 'It was a prank war gone airborne. Dana Whitfield — Sassy the Rhino herself — swapped Big T\'s tanks for helium and spiked his drink for "extra bounce." She didn\'t know he\'d climb the goalpost. Forty thousand people watched a mascot achieve liftoff. The Rhinos have issued a formal apology and one (1) fruit basket.',
    suspects: [
      {
        name: 'Dana Whitfield', occupation: 'rival mascot (Sassy the Rhino)', relation: 'the victim\'s prank-war nemesis',
        secret: 'She\'s been escalating the prank war for months — this was supposed to be the finale.', isCulprit: true,
        persona: 'Bubbly, defensive, guilt leaking through the foam.',
        tells: [
          ['prank war|escalation', 'The prank war was MUTUAL! The whoopee cushion incident! The mascot-head swap! This was just... supposed to be funny!'],
          ['helium|tanks|swapped', 'Helium is FUNNY, detective! High voices! Nobody was supposed to CLIMB!'],
          ['espresso|energy drink', '...A little espresso. For bounce. Mascots need bounce. I didn\'t... I didn\'t think about the goalpost.'],
          ['foam finger|rhinos', 'Okay, the foam finger is mine. I drop things. I\'m a rhino. Depth perception is hard.'],
        ],
      },
      {
        name: 'Coach Ray Delgado', occupation: 'Tigers head coach', relation: 'Big T was his good-luck charm',
        secret: 'He\'d bet the team\'s travel budget on the game.', isCulprit: false,
        persona: 'Gruff, superstitious, heartbroken.',
        tells: [
          ['good luck|charm', 'Big T was our LUCK. You don\'t kill your luck. That\'s... that\'s Sports 101.'],
          ['bet|travel budget', '...A friendly wager. On our OWN team. That\'s practically optimism.'],
          ['7:32|halftime', 'On the sideline, drawing up plays. Forty thousand people saw me. I\'m very visible when I\'m losing.'],
        ],
      },
      {
        name: 'Skyler Brooks', occupation: 'cheer captain', relation: 'was dating Big T (the man, not the suit)',
        secret: 'She was about to break up with him — for the Rhinos\' quarterback.', isCulprit: false,
        persona: 'Perky, tearful, performing grief.',
        tells: [
          ['dating|break up|quarterback', '...Chad and I were... transitioning. To friends. Who date other people. It\'s complicated!'],
          ['7:33|saw', 'I SAW him go up. I thought it was a new bit! I CHEERED. Oh god, I cheered.'],
          ['suit|tanks', 'I don\'t know anything about tanks! I know formations! And Chad\'s coffee order!'],
        ],
      },
      {
        name: 'Gus Pruitt', occupation: 'equipment manager', relation: 'maintained the mascot suit',
        secret: 'He\'d been selling team equipment on the side for years.', isCulprit: false,
        persona: 'Nervous, greasy, talks to his clipboard.',
        tells: [
          ['tanks|maintained|suit', 'I check the suit every game! The tanks said O2! They SMELLED like... well, I don\'t smell tanks. That\'s not in the manual.'],
          ['selling|equipment', '...Surplus. It was surplus! Mostly. The line between surplus and stealing is... blurry. Like my vision right now.'],
          ['7:00|kickoff', 'In the tunnel, with the spare helmets. Helmets don\'t float. I checked.'],
        ],
      },
      {
        name: 'Wally Finch', occupation: 'stadium peanut vendor', relation: 'Big T once saved him from a falling light rig',
        secret: 'He waters down the stadium soda and pockets the difference.', isCulprit: false,
        persona: 'Jolly, loud, smells like popcorn.',
        tells: [
          ['saved|light rig', 'Big T saved my life! A light rig, 2019! I owe him EVERYTHING. Peanuts for life. Free.'],
          ['soda|watered', '...A little water never hurt a soda. It\'s basically... soda-adjacent. Don\'t tell the league.'],
          ['7:33', 'Section 204, selling nuts! "Peanuts! Getcha peanuts!" — then everybody looked up. And... yeah.'],
        ],
      },
      {
        name: 'Dr. Lena Marsh', occupation: 'team physician', relation: 'cleared Big T to perform that night',
        secret: 'She never actually examined him — she signed the form from the parking lot.', isCulprit: false,
        persona: 'Clinical, brisk, defensive about paperwork.',
        tells: [
          ['cleared|examined|parking lot', '...The form was signed. The examination was... abbreviated. He seemed bouncy. That should\'ve been a red flag.'],
          ['helium|effects', 'Helium displaces oxygen. At altitude, in a suit... I\'m a doctor, not a physicist, but even I see it.'],
          ['7:35', 'In the medical tent, treating a sprained ankle. A BORING, normal, non-floating ankle.'],
        ],
      },
    ],
  },
];

export function getScenario(vibe, n) {
  const pool = SCENARIOS.filter((s) => s.vibe === vibe);
  const list = pool.length ? pool : SCENARIOS;
  const pick = list[Math.floor(Math.random() * list.length)];
  const suspects = pick.suspects.slice(0, Math.max(5, Math.min(8, n)));
  return { ...pick, suspects };
}

export function findScenarioByTruth(truth) {
  if (!truth) return null;
  return SCENARIOS.find((s) => s.truth === truth) || null;
}
