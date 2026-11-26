// Auto-extracted non-sensitive educational curriculum & puzzles for Cairnspire Home & Garden (v3b)

export interface WotdItem {
  word: string;
  pron: string;
  pos: string;
  origin: string;
  def: string;
  example: string;
}

export interface CrosswordPuzzle {
  id: string;
  title: string;
  size: number;
  grid: string[];
  across: Array<[number, string]>;
  down: Array<[number, string]>;
}

export interface LogicPuzzleItem {
  id: string;
  title: string;
  puzzle: string;
  hint: string;
  answer: string;
}

export interface SpanishWordItem {
  es: string;
  en: string;
  ex: string;
  exEn: string;
}

export interface CodingTipItem {
  title: string;
  tip: string;
  code: string;
}

export const WOTD_LIST: WotdItem[] = [
  {
    "word": "sesquipedalian",
    "pron": "ses-kwih-puh-DAY-lee-un",
    "pos": "adjective",
    "origin": "Latin sesquipedalis, \"a foot and a half long\" (sesqui- \"one and a half\" + pes, ped- \"foot\"), from Horace's phrase about overlong words.",
    "def": "Given to using long words; (of a word) having many syllables.",
    "example": "The professor's sesquipedalian lecture sent half the class to the dictionary."
  },
  {
    "word": "perspicacious",
    "pron": "pur-spih-KAY-shus",
    "pos": "adjective",
    "origin": "Latin perspicax, perspicac- \"sharp-sighted,\" from perspicere \"to see through.\"",
    "def": "Having keen insight and understanding; mentally sharp.",
    "example": "A perspicacious reader noticed the clue in chapter one."
  },
  {
    "word": "obstreperous",
    "pron": "ub-STREP-er-us",
    "pos": "adjective",
    "origin": "Latin obstreperus \"clamorous,\" from obstrepere \"to make a noise against\" (ob- + strepere \"to make a noise\").",
    "def": "Noisy and difficult to control.",
    "example": "The obstreperous crowd drowned out the announcer."
  },
  {
    "word": "magnanimous",
    "pron": "mag-NAN-ih-mus",
    "pos": "adjective",
    "origin": "Latin magnanimus, from magnus \"great\" + animus \"soul, mind.\"",
    "def": "Generous and forgiving, especially toward a rival or someone less powerful.",
    "example": "She was magnanimous in victory and thanked the other team."
  },
  {
    "word": "ubiquitous",
    "pron": "yoo-BIK-wih-tus",
    "pos": "adjective",
    "origin": "Latin ubique \"everywhere\" (from ubi \"where\").",
    "def": "Present, appearing, or found everywhere.",
    "example": "Smartphones have become ubiquitous in classrooms."
  },
  {
    "word": "quintessential",
    "pron": "kwin-tuh-SEN-shul",
    "pos": "adjective",
    "origin": "From quintessence: Medieval Latin quinta essentia \"fifth essence,\" the element beyond earth, air, fire, and water.",
    "def": "Representing the most perfect or typical example of something.",
    "example": "Apple pie is the quintessential fall dessert."
  },
  {
    "word": "loquacious",
    "pron": "loh-KWAY-shus",
    "pos": "adjective",
    "origin": "Latin loquax, loquac- \"talkative,\" from loqui \"to speak.\"",
    "def": "Tending to talk a great deal.",
    "example": "The loquacious tour guide had a story for every building."
  },
  {
    "word": "ephemeral",
    "pron": "ih-FEM-er-ul",
    "pos": "adjective",
    "origin": "Greek ephemeros \"lasting only a day,\" from epi \"on\" + hemera \"day.\"",
    "def": "Lasting for a very short time.",
    "example": "The ephemeral rainbow vanished before anyone found a camera."
  },
  {
    "word": "serendipity",
    "pron": "sair-un-DIP-ih-tee",
    "pos": "noun",
    "origin": "Coined in 1754 by Horace Walpole from the Persian fairy tale \"The Three Princes of Serendip\" (Serendip, an old name for Sri Lanka).",
    "def": "The occurrence of happy discoveries by chance.",
    "example": "Finding the rare book at a yard sale was pure serendipity."
  },
  {
    "word": "cacophony",
    "pron": "kuh-KOF-uh-nee",
    "pos": "noun",
    "origin": "Greek kakophonia, from kakos \"bad\" + phone \"sound.\"",
    "def": "A harsh, jarring mixture of sounds.",
    "example": "A cacophony of car horns filled the street."
  },
  {
    "word": "idiosyncrasy",
    "pron": "id-ee-oh-SING-kruh-see",
    "pos": "noun",
    "origin": "Greek idiosynkrasia \"a peculiar temperament,\" from idios \"one's own\" + synkrasis \"mixture.\"",
    "def": "A mode of behavior or way of thought peculiar to an individual.",
    "example": "Humming while he thinks is one of his idiosyncrasies."
  },
  {
    "word": "juxtaposition",
    "pron": "juk-stuh-puh-ZISH-un",
    "pos": "noun",
    "origin": "French, from Latin juxta \"next to\" + positio \"placing.\"",
    "def": "The act of placing two things close together, especially for contrast.",
    "example": "The juxtaposition of old barns and new solar panels was striking."
  },
  {
    "word": "onomatopoeia",
    "pron": "on-uh-mat-uh-PEE-uh",
    "pos": "noun",
    "origin": "Greek onomatopoiia \"the making of words,\" from onoma \"name\" + poiein \"to make.\"",
    "def": "The formation of a word from a sound associated with what is named.",
    "example": "Buzz and \"sizzle\" are examples of onomatopoeia."
  },
  {
    "word": "pusillanimous",
    "pron": "pyoo-suh-LAN-ih-mus",
    "pos": "adjective",
    "origin": "Late Latin pusillanimis, from pusillus \"very small\" + animus \"spirit, mind.\"",
    "def": "Showing a lack of courage or determination; timid.",
    "example": "The pusillanimous knight hid behind the castle wall."
  },
  {
    "word": "obsequious",
    "pron": "ub-SEE-kwee-us",
    "pos": "adjective",
    "origin": "Latin obsequiosus, from obsequium \"compliance,\" from obsequi \"to comply with\" (ob- + sequi \"to follow\").",
    "def": "Excessively eager to please or obey.",
    "example": "The obsequious waiter refilled our glasses every thirty seconds."
  },
  {
    "word": "equanimity",
    "pron": "ee-kwuh-NIM-ih-tee",
    "pos": "noun",
    "origin": "Latin aequanimitas, from aequus \"even, equal\" + animus \"mind.\"",
    "def": "Mental calmness and composure, especially in a difficult situation.",
    "example": "She accepted the bad news with equanimity."
  },
  {
    "word": "recalcitrant",
    "pron": "rih-KAL-sih-trunt",
    "pos": "adjective",
    "origin": "Latin recalcitrare \"to kick back\" (re- \"back\" + calx, calc- \"heel\").",
    "def": "Having an obstinately uncooperative attitude toward authority.",
    "example": "The recalcitrant mule refused to cross the bridge."
  },
  {
    "word": "garrulous",
    "pron": "GAIR-uh-lus",
    "pos": "adjective",
    "origin": "Latin garrulus, from garrire \"to chatter.\"",
    "def": "Excessively talkative, especially on trivial matters.",
    "example": "The garrulous neighbor kept us on the porch for an hour."
  },
  {
    "word": "vicissitude",
    "pron": "vih-SIS-ih-tood",
    "pos": "noun",
    "origin": "Latin vicissitudo, from vicissim \"in turn.\"",
    "def": "A change of circumstances, typically one that is unwelcome or unpleasant.",
    "example": "The family weathered the vicissitudes of farm life."
  },
  {
    "word": "ineffable",
    "pron": "in-EF-uh-bul",
    "pos": "adjective",
    "origin": "Latin ineffabilis, from in- \"not\" + effabilis \"utterable\" (effari \"to utter\").",
    "def": "Too great or extreme to be expressed in words.",
    "example": "The view from the summit filled him with ineffable joy."
  },
  {
    "word": "mellifluous",
    "pron": "muh-LIF-loo-us",
    "pos": "adjective",
    "origin": "Late Latin mellifluus, from mel, mell- \"honey\" + fluere \"to flow.\"",
    "def": "(Of a voice or words) sweet or musical; pleasant to hear.",
    "example": "The narrator's mellifluous voice made the audiobook a pleasure."
  },
  {
    "word": "anachronism",
    "pron": "uh-NAK-ruh-niz-um",
    "pos": "noun",
    "origin": "Greek anachronismos, from ana- \"backward\" + chronos \"time.\"",
    "def": "A thing belonging to a period other than the one in which it appears.",
    "example": "A wristwatch on a Roman soldier would be an anachronism."
  },
  {
    "word": "antediluvian",
    "pron": "an-tee-dih-LOO-vee-un",
    "pos": "adjective",
    "origin": "Latin ante \"before\" + diluvium \"flood,\" referring to the biblical Flood.",
    "def": "Ridiculously old-fashioned; or, belonging to the time before the biblical Flood.",
    "example": "His antediluvian flip phone barely sends texts."
  },
  {
    "word": "pernicious",
    "pron": "per-NISH-us",
    "pos": "adjective",
    "origin": "Latin perniciosus \"destructive,\" from pernicies \"ruin\" (per- + nex, nec- \"death\").",
    "def": "Having a harmful effect, especially in a gradual or subtle way.",
    "example": "Misinformation can have a pernicious influence on public debate."
  },
  {
    "word": "superfluous",
    "pron": "soo-PUR-floo-us",
    "pos": "adjective",
    "origin": "Latin superfluus, from super \"over\" + fluere \"to flow.\"",
    "def": "Unnecessary, especially through being more than enough.",
    "example": "Cut the superfluous words from your essay."
  },
  {
    "word": "circumlocution",
    "pron": "sur-kum-loh-KYOO-shun",
    "pos": "noun",
    "origin": "Latin circumlocutio, from circum \"around\" + locutio \"speaking.\"",
    "def": "The use of many words where fewer would do, especially to be vague or evasive.",
    "example": "After ten minutes of circumlocution, he finally admitted he forgot."
  },
  {
    "word": "indefatigable",
    "pron": "in-dih-FAT-ih-guh-bul",
    "pos": "adjective",
    "origin": "Latin indefatigabilis, from in- \"not\" + defatigare \"to wear out.\"",
    "def": "Persisting tirelessly.",
    "example": "The indefatigable volunteers worked through the night."
  },
  {
    "word": "perfunctory",
    "pron": "per-FUNK-tuh-ree",
    "pos": "adjective",
    "origin": "Late Latin perfunctorius \"careless,\" from perfungi \"to discharge, get through with.\"",
    "def": "Carried out with minimum effort or reflection.",
    "example": "He gave the dishes a perfunctory rinse."
  },
  {
    "word": "munificent",
    "pron": "myoo-NIF-ih-sunt",
    "pos": "adjective",
    "origin": "From munificence, Latin munificentia, from munificus \"generous\" (munus \"gift\" + -ficus \"making\").",
    "def": "Larger or more generous than is usual or necessary.",
    "example": "A munificent donor paid for the new library."
  },
  {
    "word": "lugubrious",
    "pron": "luh-GOO-bree-us",
    "pos": "adjective",
    "origin": "Latin lugubris \"mournful,\" from lugere \"to mourn.\"",
    "def": "Looking or sounding sad and dismal.",
    "example": "The basset hound gave us a lugubrious stare."
  },
  {
    "word": "grandiloquent",
    "pron": "gran-DIL-uh-kwunt",
    "pos": "adjective",
    "origin": "Latin grandiloquus, from grandis \"great\" + loqui \"to speak.\"",
    "def": "Pompous or extravagant in language, style, or manner.",
    "example": "The villain gave a grandiloquent speech before fleeing."
  },
  {
    "word": "inscrutable",
    "pron": "in-SKROO-tuh-bul",
    "pos": "adjective",
    "origin": "Late Latin inscrutabilis, from in- \"not\" + scrutari \"to search, examine.\"",
    "def": "Impossible to understand or interpret.",
    "example": "The cat's expression was completely inscrutable."
  },
  {
    "word": "ameliorate",
    "pron": "uh-MEEL-yuh-rayt",
    "pos": "verb",
    "origin": "Alteration of meliorate (Latin meliorare \"to improve,\" from melior \"better\"), influenced by French améliorer.",
    "def": "To make something bad or unsatisfactory better.",
    "example": "New bike lanes helped ameliorate traffic downtown."
  },
  {
    "word": "obfuscate",
    "pron": "OB-fuh-skayt",
    "pos": "verb",
    "origin": "Late Latin obfuscare \"to darken,\" from ob- + fuscus \"dark.\"",
    "def": "To make obscure, unclear, or unintelligible.",
    "example": "The fine print seemed designed to obfuscate the real cost."
  },
  {
    "word": "prestidigitation",
    "pron": "pres-tih-dij-ih-TAY-shun",
    "pos": "noun",
    "origin": "French prestidigitateur, from preste \"nimble\" + Latin digitus \"finger.\"",
    "def": "Magic tricks performed as entertainment; sleight of hand.",
    "example": "The magician's prestidigitation left the kids speechless."
  },
  {
    "word": "verisimilitude",
    "pron": "vair-ih-sih-MIL-ih-tood",
    "pos": "noun",
    "origin": "Latin verisimilitudo, from verisimilis \"probable,\" from veri \"of truth\" + similis \"like.\"",
    "def": "The appearance of being true or real.",
    "example": "The film's costumes added verisimilitude to the historical story."
  },
  {
    "word": "sycophant",
    "pron": "SIK-uh-funt",
    "pos": "noun",
    "origin": "Greek sykophantes \"slanderer, informer,\" from sykon \"fig\" + phainein \"to show\"; the original sense is uncertain.",
    "def": "A person who acts obsequiously toward someone important to gain advantage.",
    "example": "The king was surrounded by sycophants who never disagreed."
  },
  {
    "word": "quixotic",
    "pron": "kwik-SOT-ik",
    "pos": "adjective",
    "origin": "From Don Quixote, the idealistic hero of Cervantes's 1605 novel.",
    "def": "Exceedingly idealistic; unrealistic and impractical.",
    "example": "His quixotic plan was to read every book in the library."
  },
  {
    "word": "mendacious",
    "pron": "men-DAY-shus",
    "pos": "adjective",
    "origin": "Latin mendax, mendac- \"lying.\"",
    "def": "Not telling the truth; lying.",
    "example": "The mendacious ad promised results no product could deliver."
  },
  {
    "word": "alacrity",
    "pron": "uh-LAK-rih-tee",
    "pos": "noun",
    "origin": "Latin alacritas, from alacer \"brisk, lively.\"",
    "def": "Brisk and cheerful readiness.",
    "example": "She accepted the invitation with alacrity."
  },
  {
    "word": "ebullient",
    "pron": "ih-BUL-yunt",
    "pos": "adjective",
    "origin": "Latin ebullire \"to boil up,\" from e- \"out\" + bullire \"to boil.\"",
    "def": "Cheerful and full of energy.",
    "example": "The ebullient coach high-fived every player."
  },
  {
    "word": "inexorable",
    "pron": "in-EK-ser-uh-bul",
    "pos": "adjective",
    "origin": "Latin inexorabilis, from in- \"not\" + exorabilis \"able to be moved by entreaty\" (exorare).",
    "def": "Impossible to stop or prevent.",
    "example": "The inexorable tide crept up the beach."
  },
  {
    "word": "truculent",
    "pron": "TRUK-yuh-lunt",
    "pos": "adjective",
    "origin": "Latin truculentus, from trux, truc- \"fierce.\"",
    "def": "Eager or quick to argue or fight; aggressively defiant.",
    "example": "The truculent goose chased everyone out of the yard."
  },
  {
    "word": "fastidious",
    "pron": "fa-STID-ee-us",
    "pos": "adjective",
    "origin": "Latin fastidiosus, from fastidium \"loathing.\"",
    "def": "Very attentive to accuracy and detail; hard to please.",
    "example": "The fastidious baker weighed every ingredient to the gram."
  },
  {
    "word": "intransigent",
    "pron": "in-TRAN-sih-junt",
    "pos": "adjective",
    "origin": "Spanish intransigente, from Latin in- \"not\" + transigere \"to come to an agreement.\"",
    "def": "Unwilling or refusing to change one's views or to agree.",
    "example": "Both sides remained intransigent, so the talks stalled."
  },
  {
    "word": "recondite",
    "pron": "REK-un-dyte",
    "pos": "adjective",
    "origin": "Latin reconditus \"hidden,\" past participle of recondere \"to put away.\"",
    "def": "(Of a subject or knowledge) little known; obscure.",
    "example": "He loves recondite trivia about medieval clocks."
  },
  {
    "word": "pulchritude",
    "pron": "PUL-krih-tood",
    "pos": "noun",
    "origin": "Latin pulchritudo, from pulcher \"beautiful.\"",
    "def": "Beauty.",
    "example": "Poets have long praised the pulchritude of mountain lakes."
  },
  {
    "word": "efflorescence",
    "pron": "ef-luh-RES-unss",
    "pos": "noun",
    "origin": "Latin efflorescere \"to blossom,\" from ex- \"out\" + florescere \"to begin to bloom.\"",
    "def": "The state or a period of flowering; a burst of development. In chemistry, a powdery salt deposit on a surface.",
    "example": "The Renaissance was an efflorescence of art and science."
  },
  {
    "word": "apocryphal",
    "pron": "uh-POK-ruh-ful",
    "pos": "adjective",
    "origin": "From Apocrypha, Greek apokryphos \"hidden,\" from apokryptein \"to hide away.\"",
    "def": "(Of a story) of doubtful authenticity, although widely circulated as true.",
    "example": "The tale of the cherry tree is probably apocryphal."
  },
  {
    "word": "peregrination",
    "pron": "pair-uh-gruh-NAY-shun",
    "pos": "noun",
    "origin": "Latin peregrinatio, from peregrinari \"to travel abroad,\" from peregrinus \"foreign.\"",
    "def": "A journey, especially a long or meandering one.",
    "example": "Their peregrinations took them through twelve countries."
  },
  {
    "word": "hegemony",
    "pron": "hih-JEM-uh-nee",
    "pos": "noun",
    "origin": "Greek hegemonia \"leadership,\" from hegemon \"leader.\"",
    "def": "Leadership or dominance, especially by one country or social group over others.",
    "example": "The empire's hegemony lasted for centuries."
  },
  {
    "word": "zeitgeist",
    "pron": "TSYTE-gyste",
    "pos": "noun",
    "origin": "German, from Zeit \"time\" + Geist \"spirit.\"",
    "def": "The defining spirit or mood of a particular period of history.",
    "example": "The novel captured the zeitgeist of the 1920s."
  },
  {
    "word": "schadenfreude",
    "pron": "SHAH-dun-froy-duh",
    "pos": "noun",
    "origin": "German, from Schaden \"harm\" + Freude \"joy.\"",
    "def": "Pleasure derived from another person's misfortune.",
    "example": "He felt a twinge of schadenfreude when the bully slipped in the mud."
  },
  {
    "word": "procrastination",
    "pron": "proh-kras-tih-NAY-shun",
    "pos": "noun",
    "origin": "Latin procrastinare, from pro- \"forward\" + crastinus \"of tomorrow\" (cras \"tomorrow\").",
    "def": "The action of delaying or postponing something.",
    "example": "Procrastination turned a one-hour project into a midnight scramble."
  },
  {
    "word": "antidisestablishmentarianism",
    "pron": "an-tee-dis-ih-stab-lish-mun-TAIR-ee-un-iz-um",
    "pos": "noun",
    "origin": "From 19th-century British politics: opposition to the disestablishment (removal of state support) of the Church of England.",
    "def": "Opposition to withdrawing state support from an established church, especially the Church of England.",
    "example": "Antidisestablishmentarianism is famous mostly for being a very long word."
  },
  {
    "word": "defenestration",
    "pron": "dee-fen-uh-STRAY-shun",
    "pos": "noun",
    "origin": "Latin de- \"down from\" + fenestra \"window\"; famous from the Defenestrations of Prague (1419, 1618).",
    "def": "The action of throwing someone or something out of a window.",
    "example": "The 1618 defenestration of Prague helped spark the Thirty Years' War."
  },
  {
    "word": "paraphernalia",
    "pron": "pair-uh-fer-NAYL-yuh",
    "pos": "noun",
    "origin": "Medieval Latin, from Greek parapherna \"property apart from a dowry\" (para \"beside\" + pherne \"dowry\").",
    "def": "Miscellaneous articles, especially the equipment needed for an activity.",
    "example": "His desk was covered in robotics paraphernalia."
  },
  {
    "word": "magniloquent",
    "pron": "mag-NIL-uh-kwunt",
    "pos": "adjective",
    "origin": "Latin magniloquus, from magnus \"great\" + loqui \"to speak.\"",
    "def": "Using high-flown or bombastic language.",
    "example": "The magniloquent mayor described the new sidewalk as a triumph of civilization."
  },
  {
    "word": "unequivocal",
    "pron": "un-ih-KWIV-uh-kul",
    "pos": "adjective",
    "origin": "un- \"not\" + equivocal, from Late Latin aequivocus \"of identical sound,\" from aequus \"equal\" + vox, voc- \"voice.\"",
    "def": "Leaving no doubt; unambiguous.",
    "example": "Her answer was an unequivocal yes."
  },
  {
    "word": "incontrovertible",
    "pron": "in-kon-truh-VUR-tuh-bul",
    "pos": "adjective",
    "origin": "in- \"not\" + controvertible, from Latin controversus \"turned against, disputed.\"",
    "def": "Not able to be denied or disputed.",
    "example": "The video was incontrovertible proof that the dog ate the cake."
  },
  {
    "word": "perspicuous",
    "pron": "per-SPIK-yoo-us",
    "pos": "adjective",
    "origin": "Latin perspicuus \"transparent, clear,\" from perspicere \"to see through.\"",
    "def": "(Of a statement or account) clearly expressed and easily understood.",
    "example": "Her perspicuous explanation finally made calculus click."
  },
  {
    "word": "abstemious",
    "pron": "ab-STEE-mee-us",
    "pos": "adjective",
    "origin": "Latin abstemius, from abs- \"from\" + a root related to temetum \"strong drink.\"",
    "def": "Not self-indulgent, especially when eating and drinking.",
    "example": "The abstemious hiker carried only water and a handful of nuts."
  }
];

export const CROSSWORDS_LIST: CrosswordPuzzle[] = [
  {
    "id": "P01",
    "title": "Mini 1",
    "size": 7,
    "grid": [
      "BAT#SOY",
      "ODE#HUE",
      "WONDERS",
      "##AIR##",
      "SENDING",
      "ART#FIN",
      "WAS#FLU"
    ],
    "across": [
      [
        1,
        "Nocturnal echolocator"
      ],
      [
        4,
        "Sauce for sushi"
      ],
      [
        7,
        "Keats's poem \"___ on a Grecian Urn\""
      ],
      [
        8,
        "Shade"
      ],
      [
        9,
        "Seven ___ of the World"
      ],
      [
        11,
        "What you breathe, or a simple tune"
      ],
      [
        12,
        "Hitting \"Send\" on, or shipping"
      ],
      [
        16,
        "What a museum curates"
      ],
      [
        17,
        "Shark's dorsal feature"
      ],
      [
        18,
        "Existed"
      ],
      [
        19,
        "Seasonal virus"
      ]
    ],
    "down": [
      [
        1,
        "Archer's tool, or a bit of gift wrap"
      ],
      [
        2,
        "\"Much ___ About Nothing\""
      ],
      [
        3,
        "Renters"
      ],
      [
        4,
        "County lawman with a badge"
      ],
      [
        5,
        "Belonging to us"
      ],
      [
        6,
        "Affirmative"
      ],
      [
        10,
        "Accomplished"
      ],
      [
        12,
        "Carpenter's cutter"
      ],
      [
        13,
        "Historical period"
      ],
      [
        14,
        "Zero, in a soccer score"
      ],
      [
        15,
        "Wildebeest"
      ]
    ]
  },
  {
    "id": "P02",
    "title": "Mini 2",
    "size": 7,
    "grid": [
      "GUT#SKI",
      "ASH#PIT",
      "PERSONS",
      "##EAT##",
      "TRACTOR",
      "RUT#ERA",
      "YES#DEW"
    ],
    "across": [
      [
        1,
        "Instinct, as in a ___ feeling"
      ],
      [
        4,
        "Slope glider"
      ],
      [
        7,
        "Volcanic fallout"
      ],
      [
        8,
        "Peach center"
      ],
      [
        9,
        "People, in legal language"
      ],
      [
        11,
        "Have a meal"
      ],
      [
        12,
        "Farm vehicle"
      ],
      [
        16,
        "Routine that's hard to escape"
      ],
      [
        17,
        "Historical period"
      ],
      [
        18,
        "Affirmative"
      ],
      [
        19,
        "Morning droplets on the grass"
      ]
    ],
    "down": [
      [
        1,
        "Space between teeth, or a clothing chain"
      ],
      [
        2,
        "Utilize"
      ],
      [
        3,
        "Dangers"
      ],
      [
        4,
        "Seen, or like a Dalmatian"
      ],
      [
        5,
        "Relatives"
      ],
      [
        6,
        "Possessive that has no apostrophe"
      ],
      [
        10,
        "Fluid-filled pouch, in biology"
      ],
      [
        12,
        "Attempt"
      ],
      [
        13,
        "Regret"
      ],
      [
        14,
        "Mined material"
      ],
      [
        15,
        "Uncooked, like sushi"
      ]
    ]
  },
  {
    "id": "P03",
    "title": "Mini 3",
    "size": 7,
    "grid": [
      "WEE#COB",
      "ARM#OWE",
      "REBOUND",
      "##RAN##",
      "STARTED",
      "ARC#RYE",
      "DYE#YEW"
    ],
    "across": [
      [
        1,
        "Tiny, in Scotland"
      ],
      [
        4,
        "Corn core"
      ],
      [
        7,
        "Limb with a bicep"
      ],
      [
        8,
        "Be in debt"
      ],
      [
        9,
        "Basketball stat after a missed shot"
      ],
      [
        11,
        "Campaigned for office"
      ],
      [
        12,
        "Began"
      ],
      [
        16,
        "Story ___ (a narrative's overall shape)"
      ],
      [
        17,
        "Bread grain, or \"The Catcher in the ___\""
      ],
      [
        18,
        "Hair color product"
      ],
      [
        19,
        "Evergreen shrub"
      ]
    ],
    "down": [
      [
        1,
        "\"___ and Peace\" (Tolstoy)"
      ],
      [
        2,
        "Before, poetically"
      ],
      [
        3,
        "Hug, or accept wholeheartedly"
      ],
      [
        4,
        "Nation, or a music genre"
      ],
      [
        5,
        "Possess"
      ],
      [
        6,
        "Garden plot, or where you sleep"
      ],
      [
        10,
        "Rowing blade"
      ],
      [
        12,
        "Blue"
      ],
      [
        13,
        "Attempt"
      ],
      [
        14,
        "Hurricane's calm center"
      ],
      [
        15,
        "Morning droplets on the grass"
      ]
    ]
  },
  {
    "id": "P04",
    "title": "Mini 4",
    "size": 7,
    "grid": [
      "HAD#NUT",
      "OWE#ERA",
      "WETLAND",
      "##AIR##",
      "RAIDERS",
      "ALL#SUE",
      "YES#TEA"
    ],
    "across": [
      [
        1,
        "Possessed"
      ],
      [
        4,
        "Acorn, e.g."
      ],
      [
        7,
        "Be in debt"
      ],
      [
        8,
        "Historical period"
      ],
      [
        9,
        "Marsh or swamp"
      ],
      [
        11,
        "What you breathe, or a simple tune"
      ],
      [
        12,
        "Indiana Jones film word before \"of the Lost Ark\""
      ],
      [
        16,
        "Every single one"
      ],
      [
        17,
        "Take to court"
      ],
      [
        18,
        "Affirmative"
      ],
      [
        19,
        "Gossip, in slang (\"Spill the ___\")"
      ]
    ],
    "down": [
      [
        1,
        "\"___ do you know?\""
      ],
      [
        2,
        "Feeling at the Grand Canyon's rim"
      ],
      [
        3,
        "Where the devil is, according to the saying"
      ],
      [
        4,
        "Closest"
      ],
      [
        5,
        "Large vase"
      ],
      [
        6,
        "Little bit"
      ],
      [
        10,
        "Jar top"
      ],
      [
        12,
        "Beam of light, or a flat ocean fish"
      ],
      [
        13,
        "Pub pour"
      ],
      [
        14,
        "Regret"
      ],
      [
        15,
        "Mediterranean or Caribbean"
      ]
    ]
  },
  {
    "id": "P05",
    "title": "Mini 5",
    "size": 7,
    "grid": [
      "VAN#MOW",
      "IRE#AWE",
      "EMERGED",
      "##DEN##",
      "EVIDENT",
      "GIN#TIE",
      "GAG#SPA"
    ],
    "across": [
      [
        1,
        "Minibus"
      ],
      [
        4,
        "Cut, as a lawn"
      ],
      [
        7,
        "Anger"
      ],
      [
        8,
        "Feeling at the Grand Canyon's rim"
      ],
      [
        9,
        "Came out into view"
      ],
      [
        11,
        "Lion's lair"
      ],
      [
        12,
        "Plain to see"
      ],
      [
        16,
        "Card game with rummy"
      ],
      [
        17,
        "Draw, in a game"
      ],
      [
        18,
        "Running joke"
      ],
      [
        19,
        "Place for a massage"
      ]
    ],
    "down": [
      [
        1,
        "Compete"
      ],
      [
        2,
        "Limb with a bicep"
      ],
      [
        3,
        "Requiring"
      ],
      [
        4,
        "Fridge decorations that stick"
      ],
      [
        5,
        "Be in debt"
      ],
      [
        6,
        "Marry"
      ],
      [
        10,
        "Mars color"
      ],
      [
        12,
        "Omelet starter"
      ],
      [
        13,
        "By way of"
      ],
      [
        14,
        "Small bite"
      ],
      [
        15,
        "Gossip, in slang (\"Spill the ___\")"
      ]
    ]
  },
  {
    "id": "P06",
    "title": "Mini 6",
    "size": 7,
    "grid": [
      "RED#DAY",
      "OAR#ICE",
      "DRESSES",
      "##SAC##",
      "DISPUTE",
      "ONE#SOW",
      "END#SEE"
    ],
    "across": [
      [
        1,
        "Mars color"
      ],
      [
        4,
        "24 hours"
      ],
      [
        7,
        "Rowing blade"
      ],
      [
        8,
        "Rink surface"
      ],
      [
        9,
        "Prom purchases, often"
      ],
      [
        11,
        "Fluid-filled pouch, in biology"
      ],
      [
        12,
        "Disagreement"
      ],
      [
        16,
        "Single digit before two"
      ],
      [
        17,
        "Plant seeds"
      ],
      [
        18,
        "Finale"
      ],
      [
        19,
        "Understand, or look at"
      ]
    ],
    "down": [
      [
        1,
        "Fishing pole"
      ],
      [
        2,
        "Corn cob unit, or a part of the head you listen with"
      ],
      [
        3,
        "Got ready, wardrobe-wise"
      ],
      [
        4,
        "Talk over"
      ],
      [
        5,
        "Serve no one can return"
      ],
      [
        6,
        "Affirmative"
      ],
      [
        10,
        "Tree fluid used for syrup"
      ],
      [
        12,
        "Female deer, in a famous song"
      ],
      [
        13,
        "Roadside lodging"
      ],
      [
        14,
        "Big ___"
      ],
      [
        15,
        "Female sheep"
      ]
    ]
  },
  {
    "id": "P07",
    "title": "Mini 7",
    "size": 7,
    "grid": [
      "BAD#PIG",
      "ORE#ROE",
      "AMBIENT",
      "##ANT##",
      "WITNESS",
      "ACE#NET",
      "YES#DAY"
    ],
    "across": [
      [
        1,
        "Michael Jackson album that was, in fact, quite good"
      ],
      [
        4,
        "Wilbur in \"Charlotte's Web\""
      ],
      [
        7,
        "Mined material"
      ],
      [
        8,
        "Fish eggs"
      ],
      [
        9,
        "Like Brian Eno's background music genre"
      ],
      [
        11,
        "Colony member that can carry many times its weight"
      ],
      [
        12,
        "Testifier in a courtroom"
      ],
      [
        16,
        "Serve no one can return"
      ],
      [
        17,
        "Tennis court divider"
      ],
      [
        18,
        "Affirmative"
      ],
      [
        19,
        "24 hours"
      ]
    ],
    "down": [
      [
        1,
        "Feathery scarf, or a constrictor"
      ],
      [
        2,
        "Limb with a bicep"
      ],
      [
        3,
        "Formal arguments with moderators"
      ],
      [
        4,
        "Make-believe"
      ],
      [
        5,
        "Charged particle"
      ],
      [
        6,
        "Understand, as a joke"
      ],
      [
        10,
        "Roadside lodging"
      ],
      [
        12,
        "Path"
      ],
      [
        13,
        "Rink surface"
      ],
      [
        14,
        "Mediterranean or Caribbean"
      ],
      [
        15,
        "Pig pen"
      ]
    ]
  },
  {
    "id": "P08",
    "title": "Mini 8",
    "size": 7,
    "grid": [
      "PIE#RIB",
      "ERA#EMU",
      "PERHAPS",
      "##NIL##",
      "INITIAL",
      "CAN#TWO",
      "EGG#YET"
    ],
    "across": [
      [
        1,
        "Pi Day dessert"
      ],
      [
        4,
        "Tease, or a barbecue order"
      ],
      [
        7,
        "Historical period"
      ],
      [
        8,
        "Flightless Australian bird"
      ],
      [
        9,
        "Maybe"
      ],
      [
        11,
        "Zero, in a soccer score"
      ],
      [
        12,
        "First, or a monogram letter"
      ],
      [
        16,
        "Is able to"
      ],
      [
        17,
        "Pair"
      ],
      [
        18,
        "Omelet starter"
      ],
      [
        19,
        "Still, or so far"
      ]
    ],
    "down": [
      [
        1,
        "Energy, as at a rally"
      ],
      [
        2,
        "Anger"
      ],
      [
        3,
        "Making, as a paycheck"
      ],
      [
        4,
        "Kind of TV show with no script, supposedly"
      ],
      [
        5,
        "Mischievous sprite"
      ],
      [
        6,
        "Yellow school vehicle"
      ],
      [
        10,
        "Chart-topper"
      ],
      [
        12,
        "Rink surface"
      ],
      [
        13,
        "Pester"
      ],
      [
        14,
        "Feeling at the Grand Canyon's rim"
      ],
      [
        15,
        "Parking area"
      ]
    ]
  },
  {
    "id": "P09",
    "title": "Mini 9",
    "size": 7,
    "grid": [
      "EMU#HAS",
      "WIN#EGO",
      "EDITION",
      "##FIG##",
      "PROPHET",
      "EAR#TAR",
      "GYM#STY"
    ],
    "across": [
      [
        1,
        "Flightless Australian bird"
      ],
      [
        4,
        "Possesses"
      ],
      [
        7,
        "Victory"
      ],
      [
        8,
        "Freud's balancer between the id and the conscience"
      ],
      [
        9,
        "Hardcover or paperback version, say"
      ],
      [
        11,
        "Newton fruit"
      ],
      [
        12,
        "One who predicts the future"
      ],
      [
        16,
        "Corn cob unit, or a part of the head you listen with"
      ],
      [
        17,
        "Road goo"
      ],
      [
        18,
        "Workout spot"
      ],
      [
        19,
        "Pig pen"
      ]
    ],
    "down": [
      [
        1,
        "Female sheep"
      ],
      [
        2,
        "Gen Z slang for \"mediocre\""
      ],
      [
        3,
        "School dress code outfit"
      ],
      [
        4,
        "Wuthering ___ (Brontë novel)"
      ],
      [
        5,
        "\"A long time ___ in a galaxy far, far away...\""
      ],
      [
        6,
        "Male child"
      ],
      [
        10,
        "Gratuity"
      ],
      [
        12,
        "Coat hook"
      ],
      [
        13,
        "Beam of light, or a flat ocean fish"
      ],
      [
        14,
        "Have a meal"
      ],
      [
        15,
        "Attempt"
      ]
    ]
  },
  {
    "id": "P10",
    "title": "Mini 10",
    "size": 7,
    "grid": [
      "LOG#EBB",
      "AWE#DUE",
      "DENTIST",
      "##EAT##",
      "FORGIVE",
      "ERA#NIL",
      "EEL#GEM"
    ],
    "across": [
      [
        1,
        "Captain's record, or a fireplace item"
      ],
      [
        4,
        "Recede, as a tide"
      ],
      [
        7,
        "Feeling at the Grand Canyon's rim"
      ],
      [
        8,
        "Owed, like homework"
      ],
      [
        9,
        "Professional who might say \"Open wide\""
      ],
      [
        11,
        "Have a meal"
      ],
      [
        12,
        "Let go of a grudge"
      ],
      [
        16,
        "Historical period"
      ],
      [
        17,
        "Zero, in a soccer score"
      ],
      [
        18,
        "Slippery swimmer"
      ],
      [
        19,
        "Jewel, or a hidden treasure of a place"
      ]
    ],
    "down": [
      [
        1,
        "Young fellow"
      ],
      [
        2,
        "Be in debt"
      ],
      [
        3,
        "Not specific, or a four-star rank"
      ],
      [
        4,
        "Revising a draft"
      ],
      [
        5,
        "Yellow school vehicle"
      ],
      [
        6,
        "\"You ___!\" (\"Absolutely!\")"
      ],
      [
        10,
        "Playground game, or a price label"
      ],
      [
        12,
        "Charge for service"
      ],
      [
        13,
        "Mined material"
      ],
      [
        14,
        "Compete"
      ],
      [
        15,
        "Shade tree with a famous street in horror films"
      ]
    ]
  },
  {
    "id": "P11",
    "title": "Mini 11",
    "size": 7,
    "grid": [
      "SUN#DOT",
      "ERA#IRE",
      "ANTIGEN",
      "##INN##",
      "COOKIES",
      "OWN#TWO",
      "YES#YEW"
    ],
    "across": [
      [
        1,
        "Center of our solar system"
      ],
      [
        4,
        "Period, in a URL"
      ],
      [
        7,
        "Historical period"
      ],
      [
        8,
        "Anger"
      ],
      [
        9,
        "Substance that triggers an immune response"
      ],
      [
        11,
        "Roadside lodging"
      ],
      [
        12,
        "Browser trackers, or oven treats"
      ],
      [
        16,
        "Possess"
      ],
      [
        17,
        "Pair"
      ],
      [
        18,
        "Affirmative"
      ],
      [
        19,
        "Evergreen shrub"
      ]
    ],
    "down": [
      [
        1,
        "Mediterranean or Caribbean"
      ],
      [
        2,
        "Large vase"
      ],
      [
        3,
        "UN members"
      ],
      [
        4,
        "Self-respect"
      ],
      [
        5,
        "Mined material"
      ],
      [
        6,
        "Perfect score, in gymnastics"
      ],
      [
        10,
        "Squid's defense"
      ],
      [
        12,
        "Playfully reluctant"
      ],
      [
        13,
        "Be in debt"
      ],
      [
        14,
        "Female sheep"
      ],
      [
        15,
        "Plant seeds"
      ]
    ]
  },
  {
    "id": "P12",
    "title": "Mini 12",
    "size": 7,
    "grid": [
      "VIA#POT",
      "ORB#RUE",
      "WESTERN",
      "##EAT##",
      "LENDERS",
      "ARC#EYE",
      "BEE#NET"
    ],
    "across": [
      [
        1,
        "By way of"
      ],
      [
        4,
        "Stew vessel"
      ],
      [
        7,
        "Sphere"
      ],
      [
        8,
        "Regret"
      ],
      [
        9,
        "Cowboy movie"
      ],
      [
        11,
        "Have a meal"
      ],
      [
        12,
        "Banks, to borrowers"
      ],
      [
        16,
        "Story ___ (a narrative's overall shape)"
      ],
      [
        17,
        "Hurricane's calm center"
      ],
      [
        18,
        "Spelling competition"
      ],
      [
        19,
        "Tennis court divider"
      ]
    ],
    "down": [
      [
        1,
        "Solemn promise"
      ],
      [
        2,
        "Anger"
      ],
      [
        3,
        "What makes the heart grow fonder, per the proverb"
      ],
      [
        4,
        "Kid of about 11 or 12"
      ],
      [
        5,
        "Belonging to us"
      ],
      [
        6,
        "Perfect score, in gymnastics"
      ],
      [
        10,
        "Little bit"
      ],
      [
        12,
        "Science class room, or a friendly dog breed"
      ],
      [
        13,
        "Before, poetically"
      ],
      [
        14,
        "Bread grain, or \"The Catcher in the ___\""
      ],
      [
        15,
        "Tennis unit, or a math collection"
      ]
    ]
  },
  {
    "id": "P13",
    "title": "Mini 13",
    "size": 7,
    "grid": [
      "OIL#EBB",
      "ACE#PIE",
      "FENCING",
      "##GAS##",
      "BUTTONS",
      "ASH#DOE",
      "YES#EWE"
    ],
    "across": [
      [
        1,
        "Olive or canola"
      ],
      [
        4,
        "Recede, as a tide"
      ],
      [
        7,
        "Serve no one can return"
      ],
      [
        8,
        "Pi Day dessert"
      ],
      [
        9,
        "Sport with foils and épées"
      ],
      [
        11,
        "Fuel, or a state of matter"
      ],
      [
        12,
        "Shirt fasteners, or controller parts"
      ],
      [
        16,
        "Volcanic fallout"
      ],
      [
        17,
        "Female deer, in a famous song"
      ],
      [
        18,
        "Affirmative"
      ],
      [
        19,
        "Female sheep"
      ]
    ],
    "down": [
      [
        1,
        "Clumsy lout"
      ],
      [
        2,
        "Rink surface"
      ],
      [
        3,
        "Pool distances for swimmers"
      ],
      [
        4,
        "Netflix installment"
      ],
      [
        5,
        "Recycling container"
      ],
      [
        6,
        "Plead"
      ],
      [
        10,
        "Schrödinger's subject"
      ],
      [
        12,
        "Body of water partly enclosed by land"
      ],
      [
        13,
        "Utilize"
      ],
      [
        14,
        "\"___ or never\""
      ],
      [
        15,
        "Understand, or look at"
      ]
    ]
  },
  {
    "id": "P14",
    "title": "Mini 14",
    "size": 7,
    "grid": [
      "AMP#RIB",
      "TIE#ERE",
      "EXPOSED",
      "##TWO##",
      "SHIELDS",
      "POD#VIA",
      "AGE#END"
    ],
    "across": [
      [
        1,
        "Guitarist's speaker box, for short"
      ],
      [
        4,
        "Tease, or a barbecue order"
      ],
      [
        7,
        "Draw, in a game"
      ],
      [
        8,
        "Before, poetically"
      ],
      [
        9,
        "Left uncovered, or revealed as a fraud"
      ],
      [
        11,
        "Pair"
      ],
      [
        12,
        "Captain America's gear (pl.)"
      ],
      [
        16,
        "Pea holder"
      ],
      [
        17,
        "By way of"
      ],
      [
        18,
        "Bronze or Iron follower?"
      ],
      [
        19,
        "Finale"
      ]
    ],
    "down": [
      [
        1,
        "Polished off"
      ],
      [
        2,
        "Playlist, or what you do to batter"
      ],
      [
        3,
        "Short chain of amino acids"
      ],
      [
        4,
        "Determination, or to settle a conflict"
      ],
      [
        5,
        "Anger"
      ],
      [
        6,
        "Garden plot, or where you sleep"
      ],
      [
        10,
        "Be in debt"
      ],
      [
        12,
        "Place for a massage"
      ],
      [
        13,
        "Take more than your share of"
      ],
      [
        14,
        "Loud, confused noise"
      ],
      [
        15,
        "Blue"
      ]
    ]
  },
  {
    "id": "P15",
    "title": "Mini 15",
    "size": 7,
    "grid": [
      "NOD#OAK",
      "ERE#USE",
      "WEALTHY",
      "##LAP##",
      "TRIBUNE",
      "ION#TAR",
      "PEG#SPA"
    ],
    "across": [
      [
        1,
        "Silent \"yes\""
      ],
      [
        4,
        "Tree from an acorn"
      ],
      [
        7,
        "Before, poetically"
      ],
      [
        8,
        "Utilize"
      ],
      [
        9,
        "Rolling in money"
      ],
      [
        11,
        "One trip around the track"
      ],
      [
        12,
        "Roman official, or a Chicago newspaper"
      ],
      [
        16,
        "Charged particle"
      ],
      [
        17,
        "Road goo"
      ],
      [
        18,
        "Coat hook"
      ],
      [
        19,
        "Place for a massage"
      ]
    ],
    "down": [
      [
        1,
        "Fresh out of the box"
      ],
      [
        2,
        "Mined material"
      ],
      [
        3,
        "Handling, as with a problem, or passing out cards"
      ],
      [
        4,
        "What a function returns"
      ],
      [
        5,
        "Volcanic fallout"
      ],
      [
        6,
        "Answer sheet, or a piano part"
      ],
      [
        10,
        "Science class room, or a friendly dog breed"
      ],
      [
        12,
        "Gratuity"
      ],
      [
        13,
        "Fish eggs"
      ],
      [
        14,
        "Short rest"
      ],
      [
        15,
        "Historical period"
      ]
    ]
  },
  {
    "id": "P16",
    "title": "Mini 16",
    "size": 7,
    "grid": [
      "YAP#NAP",
      "ILL#ERA",
      "PLANTED",
      "##YEW##",
      "EDITORS",
      "BUN#ROT",
      "BEG#KEY"
    ],
    "across": [
      [
        1,
        "Small dog's bark"
      ],
      [
        4,
        "Short rest"
      ],
      [
        7,
        "Under the weather"
      ],
      [
        8,
        "Historical period"
      ],
      [
        9,
        "Put in the ground"
      ],
      [
        11,
        "Evergreen shrub"
      ],
      [
        12,
        "Newsroom workers with red pens"
      ],
      [
        16,
        "Burger holder"
      ],
      [
        17,
        "Decay"
      ],
      [
        18,
        "Plead"
      ],
      [
        19,
        "Answer sheet, or a piano part"
      ]
    ],
    "down": [
      [
        1,
        "Puppy's sound"
      ],
      [
        2,
        "Every single one"
      ],
      [
        3,
        "Performing, or gaming"
      ],
      [
        4,
        "Wi-Fi setup, or contacts you can tap for jobs"
      ],
      [
        5,
        "\"To be or not to be\" form for \"you\" and \"they\""
      ],
      [
        6,
        "Notebook, or an apartment in slang"
      ],
      [
        10,
        "Tennis court divider"
      ],
      [
        12,
        "Recede, as a tide"
      ],
      [
        13,
        "Owed, like homework"
      ],
      [
        14,
        "Fish eggs"
      ],
      [
        15,
        "Pig pen"
      ]
    ]
  }
];

export const LOGIC_PUZZLES_LIST: LogicPuzzleItem[] = [
  {
    "id": "L01",
    "title": "Knights and knaves",
    "puzzle": "On an island, knights always tell the truth and knaves always lie. A says: \"We are both knaves.\" What are A and B?",
    "hint": "If A were a knight, the statement would be true, which makes A a knave. That's impossible.",
    "answer": "A is a knave and B is a knight. A must be lying, so \"both knaves\" is false. A is a knave, so B can't also be one."
  },
  {
    "id": "L02",
    "title": "Wolf, goat, cabbage",
    "puzzle": "A farmer must ferry a wolf, a goat and a cabbage across a river. The boat holds him plus one item. Left alone, the wolf eats the goat, and the goat eats the cabbage. How does he do it?",
    "hint": "The goat is the problem item. It may have to ride more than once.",
    "answer": "Take the goat over. Come back. Take the wolf over and bring the goat back. Take the cabbage over. Come back. Take the goat over. That's 7 crossings."
  },
  {
    "id": "L03",
    "title": "Three switches",
    "puzzle": "Three switches outside a closed room control one bulb inside. You may enter the room once. How do you find which switch works the bulb?",
    "hint": "A bulb gives you more than light.",
    "answer": "Turn switch 1 on for a few minutes, then off. Turn switch 2 on and go in. If the bulb is lit, it's switch 2. If it's off but warm, it's switch 1. If it's off and cold, it's switch 3."
  },
  {
    "id": "L04",
    "title": "Nine balls",
    "puzzle": "Nine identical-looking balls. One is slightly heavier. With a balance scale, find it in two weighings.",
    "hint": "Split into three groups.",
    "answer": "Weigh 3 against 3. If they balance, the heavy ball is in the other 3; otherwise it's on the heavier side. From that group of 3, weigh 1 against 1. The heavier one is it; if they balance, it's the third ball."
  },
  {
    "id": "L05",
    "title": "Two jugs",
    "puzzle": "You have a 3-litre jug and a 5-litre jug and unlimited water. Measure exactly 4 litres.",
    "hint": "Try leaving 2 litres in the small jug.",
    "answer": "Fill the 5 and pour it into the 3, leaving 2 in the 5. Empty the 3 and pour the 2 into it. Fill the 5 again and top up the 3, which takes 1. Now the 5 holds exactly 4."
  },
  {
    "id": "L06",
    "title": "Three doors",
    "puzzle": "A prize is behind one of three doors. You pick door 1. The host knows where the prize is, opens door 3 to show it's empty, and offers a switch to door 2. Should you switch?",
    "hint": "Your first pick was right 1 time in 3.",
    "answer": "Switch. Staying wins 1/3 of the time. Switching wins 2/3, because the host's choice moves the other 2/3 onto the remaining door."
  },
  {
    "id": "L07",
    "title": "Bridge at night",
    "puzzle": "Four people must cross a bridge at night with one flashlight. At most two can cross at once, and a pair walks at the slower speed. Their times are 1, 2, 5 and 10 minutes. Can they all cross in 17 minutes?",
    "hint": "Send the two slowest together.",
    "answer": "Yes. 1 and 2 cross (2 min). 1 returns (3). 5 and 10 cross (13). 2 returns (15). 1 and 2 cross (17)."
  },
  {
    "id": "L08",
    "title": "Bat and ball",
    "puzzle": "A bat and a ball cost $1.10 together. The bat costs $1.00 more than the ball. How much is the ball?",
    "hint": "It isn't 10 cents. Check: then the bat is $1.10.",
    "answer": "5 cents. Ball x + bat (x + 1.00) = 1.10, so 2x = 0.10."
  },
  {
    "id": "L09",
    "title": "100 lockers",
    "puzzle": "100 closed lockers. Student 1 opens every locker. Student 2 toggles every 2nd locker, student 3 every 3rd, and so on up to student 100. How many lockers end up open?",
    "hint": "A locker is toggled once for each of its factors.",
    "answer": "10. Only perfect squares (1, 4, 9 … 100) have an odd number of factors, so only they end open."
  },
  {
    "id": "L10",
    "title": "Look and say",
    "puzzle": "What comes next: 1, 11, 21, 1211, 111221, ?",
    "hint": "Read each term out loud.",
    "answer": "312211. Read 111221 aloud: \"three 1s, two 2s, one 1\"."
  },
  {
    "id": "L11",
    "title": "Clock angle",
    "puzzle": "What is the smaller angle between the hour and minute hands at 3:15?",
    "hint": "The hour hand moves too, 0.5° per minute.",
    "answer": "7.5°. The minute hand is at 90°. The hour hand is at 90 + 15 × 0.5 = 97.5°."
  },
  {
    "id": "L12",
    "title": "Two guards",
    "puzzle": "Two doors, one to freedom. One guard always lies and one always tells the truth, but you don't know which is which. Ask one guard one question to find the way out.",
    "hint": "Make both guards' answers point the same way.",
    "answer": "Ask either guard: \"Which door would the other guard say leads to freedom?\" Then take the other door. Either way, the answer includes exactly one lie."
  },
  {
    "id": "L13",
    "title": "Eight balls",
    "puzzle": "Eight balls. One is heavier. Find it with only two weighings.",
    "hint": "The groups don't have to be equal.",
    "answer": "Weigh 3 against 3. If they balance, weigh the remaining 2 against each other. If they don't, take the heavier 3 and weigh 1 against 1. If those balance, it's the third ball."
  },
  {
    "id": "L14",
    "title": "Handshakes",
    "puzzle": "At a party of 10 people, everyone shakes hands with everyone else exactly once. How many handshakes?",
    "hint": "Count pairs.",
    "answer": "45. That's 10 × 9 ÷ 2, the number of pairs."
  },
  {
    "id": "L15",
    "title": "Wrong labels",
    "puzzle": "Three boxes are labelled Apples, Oranges and Mixed. Every label is wrong. You may take one fruit from one box without looking inside. How do you relabel all three?",
    "hint": "Which box can't be what it says AND can't hide a mix?",
    "answer": "Take a fruit from the box labelled Mixed, which must hold only one kind. Say it's an apple: that box is Apples. The box labelled Oranges can't be oranges, and Apples is taken, so it's Mixed. The last box is Oranges."
  },
  {
    "id": "L16",
    "title": "Snail in a well",
    "puzzle": "A snail is at the bottom of a 30-foot well. Each day it climbs 3 feet, and each night it slips back 2. On which day does it reach the top?",
    "hint": "On the last day, it doesn't slip.",
    "answer": "Day 28. After 27 days it's at 27 feet. On day 28 it climbs to 30 and is out."
  },
  {
    "id": "L17",
    "title": "Three houses",
    "puzzle": "Three friends (Ana, Ben, Cy) each have one pet (cat, dog, fish) and one favourite game (chess, Go, Uno). Clues: 1. Ana doesn't have the dog. 2. The fish owner plays Go. 3. Ben plays chess. 4. Cy doesn't play Uno. Who owns the fish?",
    "hint": "Start with the games. Clue 3 and clue 4 settle them.",
    "answer": "Cy owns the fish. Ben plays chess, and Cy doesn't play Uno, so Cy plays Go and Ana plays Uno. The fish owner plays Go, so that's Cy. Ana doesn't have the dog, so Ana has the cat and Ben has the dog."
  }
];

export const SPANISH_WORDS_LIST: SpanishWordItem[] = [
  {
    "es": "el perro",
    "en": "the dog",
    "ex": "El perro duerme en el sofá.",
    "exEn": "The dog sleeps on the sofa."
  },
  {
    "es": "el gato",
    "en": "the cat",
    "ex": "Tenemos tres gatos.",
    "exEn": "We have three cats."
  },
  {
    "es": "la casa",
    "en": "the house",
    "ex": "Mi casa es amarilla.",
    "exEn": "My house is yellow."
  },
  {
    "es": "la escuela",
    "en": "the school",
    "ex": "Voy a la escuela el lunes.",
    "exEn": "I go to school on Monday."
  },
  {
    "es": "el libro",
    "en": "the book",
    "ex": "Este libro es muy bueno.",
    "exEn": "This book is very good."
  },
  {
    "es": "la tarea",
    "en": "the homework",
    "ex": "Termino la tarea esta noche.",
    "exEn": "I finish the homework tonight."
  },
  {
    "es": "el agua",
    "en": "the water",
    "ex": "Necesito un vaso de agua.",
    "exEn": "I need a glass of water."
  },
  {
    "es": "la comida",
    "en": "the food / the meal",
    "ex": "La comida está lista.",
    "exEn": "The food is ready."
  },
  {
    "es": "el desayuno",
    "en": "breakfast",
    "ex": "El desayuno es a las siete.",
    "exEn": "Breakfast is at seven."
  },
  {
    "es": "la cena",
    "en": "dinner",
    "ex": "¿Qué hay para la cena?",
    "exEn": "What's for dinner?"
  },
  {
    "es": "el juego",
    "en": "the game",
    "ex": "Es mi juego favorito.",
    "exEn": "It's my favorite game."
  },
  {
    "es": "la música",
    "en": "music",
    "ex": "Escucho música por la noche.",
    "exEn": "I listen to music at night."
  },
  {
    "es": "la ciudad",
    "en": "the city",
    "ex": "La ciudad es grande.",
    "exEn": "The city is big."
  },
  {
    "es": "el campo",
    "en": "the countryside / the field",
    "ex": "Vivimos cerca del campo.",
    "exEn": "We live near the countryside."
  },
  {
    "es": "la pregunta",
    "en": "the question",
    "ex": "Tengo una pregunta.",
    "exEn": "I have a question."
  },
  {
    "es": "la respuesta",
    "en": "the answer",
    "ex": "La respuesta es correcta.",
    "exEn": "The answer is correct."
  },
  {
    "es": "el tiempo",
    "en": "time / weather",
    "ex": "Hace buen tiempo hoy.",
    "exEn": "The weather is nice today."
  },
  {
    "es": "la semana",
    "en": "the week",
    "ex": "Tengo un examen esta semana.",
    "exEn": "I have a test this week."
  },
  {
    "es": "mañana",
    "en": "tomorrow / morning",
    "ex": "Nos vemos mañana.",
    "exEn": "See you tomorrow."
  },
  {
    "es": "hoy",
    "en": "today",
    "ex": "Hoy es miércoles.",
    "exEn": "Today is Wednesday."
  },
  {
    "es": "ayer",
    "en": "yesterday",
    "ex": "Ayer llovió mucho.",
    "exEn": "It rained a lot yesterday."
  },
  {
    "es": "siempre",
    "en": "always",
    "ex": "Siempre reviso mi trabajo.",
    "exEn": "I always check my work."
  },
  {
    "es": "nunca",
    "en": "never",
    "ex": "Nunca es tarde para aprender.",
    "exEn": "It's never too late to learn."
  },
  {
    "es": "también",
    "en": "also / too",
    "ex": "Yo también quiero jugar.",
    "exEn": "I want to play too."
  },
  {
    "es": "pero",
    "en": "but",
    "ex": "Es difícil, pero me gusta.",
    "exEn": "It's hard, but I like it."
  },
  {
    "es": "porque",
    "en": "because",
    "ex": "Estudio porque quiero aprender.",
    "exEn": "I study because I want to learn."
  },
  {
    "es": "hablar",
    "en": "to speak",
    "ex": "Quiero hablar español mejor.",
    "exEn": "I want to speak Spanish better."
  },
  {
    "es": "escribir",
    "en": "to write",
    "ex": "Voy a escribir un correo.",
    "exEn": "I'm going to write an email."
  },
  {
    "es": "leer",
    "en": "to read",
    "ex": "Me gusta leer libros de fantasía.",
    "exEn": "I like to read fantasy books."
  },
  {
    "es": "aprender",
    "en": "to learn",
    "ex": "Aprendo algo nuevo cada día.",
    "exEn": "I learn something new every day."
  },
  {
    "es": "entender",
    "en": "to understand",
    "ex": "No entiendo la pregunta.",
    "exEn": "I don't understand the question."
  },
  {
    "es": "pensar",
    "en": "to think",
    "ex": "Pienso que es una buena idea.",
    "exEn": "I think it's a good idea."
  },
  {
    "es": "jugar",
    "en": "to play (a game)",
    "ex": "Vamos a jugar esta noche.",
    "exEn": "Let's play tonight."
  },
  {
    "es": "comer",
    "en": "to eat",
    "ex": "Comemos a las seis.",
    "exEn": "We eat at six."
  },
  {
    "es": "beber",
    "en": "to drink",
    "ex": "Bebo agua después de correr.",
    "exEn": "I drink water after running."
  },
  {
    "es": "dormir",
    "en": "to sleep",
    "ex": "Necesito dormir más.",
    "exEn": "I need to sleep more."
  },
  {
    "es": "caminar",
    "en": "to walk",
    "ex": "Me gusta caminar con música.",
    "exEn": "I like to walk with music."
  },
  {
    "es": "correr",
    "en": "to run",
    "ex": "El perro corre en el patio.",
    "exEn": "The dog runs in the yard."
  },
  {
    "es": "ayudar",
    "en": "to help",
    "ex": "¿Puedo ayudar con la cena?",
    "exEn": "Can I help with dinner?"
  },
  {
    "es": "buscar",
    "en": "to look for",
    "ex": "Busco mis llaves.",
    "exEn": "I'm looking for my keys."
  },
  {
    "es": "encontrar",
    "en": "to find",
    "ex": "No puedo encontrar mi teléfono.",
    "exEn": "I can't find my phone."
  },
  {
    "es": "empezar",
    "en": "to begin",
    "ex": "La clase empieza a las diez.",
    "exEn": "Class begins at ten."
  },
  {
    "es": "terminar",
    "en": "to finish",
    "ex": "Terminé el proyecto.",
    "exEn": "I finished the project."
  },
  {
    "es": "necesitar",
    "en": "to need",
    "ex": "Necesito más tiempo.",
    "exEn": "I need more time."
  },
  {
    "es": "poder",
    "en": "to be able to / can",
    "ex": "¿Puedes repetirlo, por favor?",
    "exEn": "Can you repeat it, please?"
  },
  {
    "es": "querer",
    "en": "to want",
    "ex": "Quiero sacar una A.",
    "exEn": "I want to get an A."
  },
  {
    "es": "saber",
    "en": "to know (facts)",
    "ex": "No sé la respuesta.",
    "exEn": "I don't know the answer."
  },
  {
    "es": "conocer",
    "en": "to know (people, places)",
    "ex": "Conozco a su hermano.",
    "exEn": "I know his brother."
  },
  {
    "es": "el amigo",
    "en": "the friend",
    "ex": "Mi amigo vive cerca.",
    "exEn": "My friend lives nearby."
  },
  {
    "es": "la familia",
    "en": "the family",
    "ex": "Mi familia es grande.",
    "exEn": "My family is big."
  },
  {
    "es": "el hermano",
    "en": "the brother",
    "ex": "Mi hermano juega videojuegos.",
    "exEn": "My brother plays video games."
  },
  {
    "es": "la computadora",
    "en": "the computer",
    "ex": "Uso la computadora para programar.",
    "exEn": "I use the computer to program."
  },
  {
    "es": "el teclado",
    "en": "the keyboard",
    "ex": "El teclado hace mucho ruido.",
    "exEn": "The keyboard is very noisy."
  },
  {
    "es": "la pantalla",
    "en": "the screen",
    "ex": "La pantalla es muy brillante.",
    "exEn": "The screen is very bright."
  },
  {
    "es": "rápido",
    "en": "fast",
    "ex": "El tren es rápido.",
    "exEn": "The train is fast."
  },
  {
    "es": "lento",
    "en": "slow",
    "ex": "El internet está lento hoy.",
    "exEn": "The internet is slow today."
  },
  {
    "es": "fácil",
    "en": "easy",
    "ex": "Este problema es fácil.",
    "exEn": "This problem is easy."
  },
  {
    "es": "difícil",
    "en": "difficult",
    "ex": "El examen fue difícil.",
    "exEn": "The test was difficult."
  },
  {
    "es": "cansado",
    "en": "tired",
    "ex": "Estoy cansado después de clase.",
    "exEn": "I'm tired after class."
  },
  {
    "es": "listo",
    "en": "ready / smart",
    "ex": "¿Estás listo?",
    "exEn": "Are you ready?"
  }
];

export const CODING_TIPS_LIST: CodingTipItem[] = [
  {
    "title": "Print something",
    "tip": "print() shows text on the screen. It's the first step for checking what your code is doing.",
    "code": "print(\"Hello!\")"
  },
  {
    "title": "Variables are labels",
    "tip": "A variable is a name that points to a value, so you can reuse it.",
    "code": "score = 10\nprint(score)"
  },
  {
    "title": "Strings use quotes",
    "tip": "Text goes in quotes. Single or double both work in Python.",
    "code": "name = 'Chase'"
  },
  {
    "title": "Add strings with f-strings",
    "tip": "Put f before the quotes and {} around a variable to drop it into text.",
    "code": "print(f\"Hi {name}!\")"
  },
  {
    "title": "Numbers do math",
    "tip": "Python works like a calculator: + - * / and ** for powers.",
    "code": "print(2 ** 10)  # 1024"
  },
  {
    "title": "// and %",
    "tip": "// divides and drops the remainder. % gives only the remainder.",
    "code": "print(17 // 5, 17 % 5)  # 3 2"
  },
  {
    "title": "input() asks a question",
    "tip": "input() waits for the user to type. It always gives back a string.",
    "code": "age = input(\"Age? \")"
  },
  {
    "title": "Convert types",
    "tip": "Use int() or float() to turn typed text into a number.",
    "code": "age = int(input(\"Age? \"))"
  },
  {
    "title": "if makes choices",
    "tip": "Run code only when a condition is True. Don't forget the colon and the indent.",
    "code": "if age >= 13:\n    print(\"Teen\")"
  },
  {
    "title": "elif and else",
    "tip": "Add more branches with elif. else catches everything left over.",
    "code": "if x > 0: print(\"+\")\nelif x < 0: print(\"-\")\nelse: print(0)"
  },
  {
    "title": "== vs =",
    "tip": "= stores a value. == compares two values.",
    "code": "x = 5\nprint(x == 5)  # True"
  },
  {
    "title": "Indentation matters",
    "tip": "Python uses indentation (4 spaces) to group code into blocks.",
    "code": "for i in range(3):\n    print(i)"
  },
  {
    "title": "for loops repeat",
    "tip": "A for loop runs once for each item in a sequence.",
    "code": "for c in \"abc\":\n    print(c)"
  },
  {
    "title": "range()",
    "tip": "range(n) counts 0 to n-1. range(a, b) counts a to b-1.",
    "code": "for i in range(1, 4):\n    print(i)  # 1 2 3"
  },
  {
    "title": "while loops",
    "tip": "while repeats as long as its condition is True. Make sure the condition changes, or it never stops.",
    "code": "n = 3\nwhile n > 0:\n    n -= 1"
  },
  {
    "title": "break and continue",
    "tip": "break leaves a loop early. continue skips to the next round.",
    "code": "for i in range(10):\n    if i == 3: break"
  },
  {
    "title": "Lists hold many things",
    "tip": "A list keeps items in order, inside square brackets.",
    "code": "games = [\"BTD6\", \"Geometry Dash\"]"
  },
  {
    "title": "Indexing starts at 0",
    "tip": "The first item is [0]. Negative numbers count from the end.",
    "code": "print(games[0], games[-1])"
  },
  {
    "title": "append()",
    "tip": "Add an item to the end of a list.",
    "code": "games.append(\"Bug Fables\")"
  },
  {
    "title": "len()",
    "tip": "len() tells you how many items (or characters) there are.",
    "code": "print(len(games))"
  },
  {
    "title": "Slicing",
    "tip": "list[a:b] takes items a through b-1. It works on strings too.",
    "code": "print(\"coding\"[0:3])  # cod"
  },
  {
    "title": "in checks membership",
    "tip": "Use in to ask whether something is inside a list or string.",
    "code": "print(\"BTD6\" in games)"
  },
  {
    "title": "Dictionaries",
    "tip": "A dict maps keys to values, like a mini phone book.",
    "code": "hp = {\"slime\": 5, \"boss\": 50}\nprint(hp[\"boss\"])"
  },
  {
    "title": "Loop over a dict",
    "tip": "Use .items() to get each key and value together.",
    "code": "for k, v in hp.items():\n    print(k, v)"
  },
  {
    "title": "Functions",
    "tip": "def makes a reusable block of code. Call it by name.",
    "code": "def greet():\n    print(\"Hi\")\ngreet()"
  },
  {
    "title": "Parameters",
    "tip": "Functions can take inputs called parameters.",
    "code": "def double(n):\n    return n * 2"
  },
  {
    "title": "return",
    "tip": "return hands a value back to whoever called the function.",
    "code": "x = double(4)  # 8"
  },
  {
    "title": "Comments",
    "tip": "Anything after # is ignored by Python. Use it to leave notes for yourself.",
    "code": "# this explains the next line"
  },
  {
    "title": "Read the error",
    "tip": "Error messages tell you the line number and the type of problem. Start at the last line.",
    "code": "NameError: name 'scroe' is not defined"
  },
  {
    "title": "Typos are bugs",
    "tip": "A misspelled variable name counts as a new name. That's often a NameError.",
    "code": "score = 1\nprint(scroe)  # error"
  },
  {
    "title": "Debug with print",
    "tip": "Print values partway through to see where things go wrong.",
    "code": "print(\"x is\", x)"
  },
  {
    "title": "Booleans",
    "tip": "True and False are values too. Combine them with and, or, not.",
    "code": "print(True and not False)"
  },
  {
    "title": "random",
    "tip": "import random to make games unpredictable.",
    "code": "import random\nprint(random.randint(1, 6))"
  },
  {
    "title": "import modules",
    "tip": "import brings in extra tools that come with Python.",
    "code": "import math\nprint(math.sqrt(144))"
  },
  {
    "title": "String methods",
    "tip": "Strings have built-in helpers like .upper(), .lower() and .strip().",
    "code": "print(\"  hi \".strip().upper())"
  },
  {
    "title": "split() and join()",
    "tip": "split breaks text into a list. join glues a list back into text.",
    "code": "words = \"a b c\".split()\nprint(\"-\".join(words))"
  },
  {
    "title": "Tuples",
    "tip": "Tuples are like lists, but they can't be changed. Use them for fixed pairs.",
    "code": "pos = (3, 4)"
  },
  {
    "title": "Unpacking",
    "tip": "Assign several variables at once from a tuple or list.",
    "code": "x, y = pos"
  },
  {
    "title": "Swap in one line",
    "tip": "Python can swap two values without a temporary variable.",
    "code": "a, b = b, a"
  },
  {
    "title": "List comprehension",
    "tip": "Build a list in one line from a loop.",
    "code": "squares = [n * n for n in range(5)]"
  },
  {
    "title": "sum, min, max",
    "tip": "Built-in helpers for lists of numbers.",
    "code": "print(sum([1, 2, 3]), max([4, 9]))"
  },
  {
    "title": "sorted()",
    "tip": "sorted() returns a new sorted list. .sort() sorts the list in place.",
    "code": "print(sorted([3, 1, 2]))"
  },
  {
    "title": "enumerate()",
    "tip": "Get the position and the item together while looping.",
    "code": "for i, g in enumerate(games):\n    print(i, g)"
  },
  {
    "title": "Default values",
    "tip": "Parameters can have defaults, so they're optional.",
    "code": "def hello(name=\"friend\"):\n    print(\"Hi\", name)"
  },
  {
    "title": "Scope",
    "tip": "Variables made inside a function stay inside it.",
    "code": "def f():\n    temp = 1  # only exists in f"
  },
  {
    "title": "None",
    "tip": "None means \"no value\". A function without return gives back None.",
    "code": "print(print(\"hi\"))  # hi, then None"
  },
  {
    "title": "try / except",
    "tip": "Catch an error so the program doesn't crash.",
    "code": "try:\n    n = int(\"abc\")\nexcept ValueError:\n    print(\"Not a number\")"
  },
  {
    "title": "Files",
    "tip": "with open() reads or writes a file and closes it for you.",
    "code": "with open(\"notes.txt\") as f:\n    print(f.read())"
  },
  {
    "title": "Small steps",
    "tip": "Write a few lines, run them, then add more. Smaller steps make bugs easier to find.",
    "code": "# run often!"
  },
  {
    "title": "Name things well",
    "tip": "Clear names (lives_left, not x) make code easier to read later.",
    "code": "lives_left = 3"
  },
  {
    "title": "Constants",
    "tip": "By convention, ALL_CAPS names are values you don't plan to change.",
    "code": "MAX_SPEED = 10"
  },
  {
    "title": "Classes (peek)",
    "tip": "A class is a blueprint that bundles data and functions together.",
    "code": "class Dog:\n    def bark(self):\n        print(\"Woof\")"
  },
  {
    "title": "Objects",
    "tip": "Make an object from a class, then use its methods with a dot.",
    "code": "d = Dog()\nd.bark()"
  },
  {
    "title": "Rubber duck",
    "tip": "Explaining your code out loud, line by line, often shows you the bug.",
    "code": "# explain it to the duck 🦆"
  },
  {
    "title": "Pseudocode first",
    "tip": "Write the steps in plain English before writing code.",
    "code": "# 1. ask a number 2. check it 3. print result"
  },
  {
    "title": "Try Scratch → Python",
    "tip": "Ideas you build in Scratch (loops, ifs, variables) carry straight over to Python.",
    "code": "# repeat 10 → for i in range(10):"
  },
  {
    "title": "Turtle graphics",
    "tip": "Python's turtle module draws shapes. It's a fun way to practice loops.",
    "code": "import turtle\nfor _ in range(4):\n    turtle.forward(100); turtle.left(90)"
  },
  {
    "title": "Mini project: dice",
    "tip": "A dice roller uses random, input and a loop.",
    "code": "while input(\"Roll? \") != \"q\":\n    print(random.randint(1, 6))"
  },
  {
    "title": "Mini project: guess",
    "tip": "A number-guessing game uses while, if/elif and comparisons.",
    "code": "# secret = random.randint(1, 100)"
  },
  {
    "title": "Free places to try",
    "tip": "Run Python in your browser at python.org/shell or on replit.com. Nothing to install.",
    "code": "# python.org/shell"
  }
];

export const LITTLE_KID_SCHOOL = {
  Liam: {
    panels: 3,
    starter: ['play', 'jump', 'fish', 'frog', 'ship', 'cake'],
    pics: [
      ['frog', '🐸'], ['snake', '🐍'], ['train', '🚂'], ['cloud', '☁️'],
      ['shark', '🦈'], ['crown', '👑'], ['house', '🏠'], ['plant', '🌱'],
      ['bread', '🍞'], ['clock', '⏰'], ['truck', '🚚'], ['ghost', '👻'],
      ['horse', '🐴'], ['spoon', '🥄'], ['robot', '🤖'], ['dragon', '🐉'],
      ['pizza', '🍕'], ['rocket', '🚀'], ['snail', '🐌'], ['brush', '🖌️'],
    ] as Array<[string, string]>,
    sight: [
      'always', 'around', 'because', 'been', 'before', 'best', 'both', 'buy', 'call', 'cold',
      'does', 'fast', 'first', 'five', 'found', 'gave', 'goes', 'green', 'made', 'many',
      'off', 'pull', 'read', 'right', 'sing', 'sleep', 'tell', 'their', 'these', 'those',
      'upon', 'very', 'wash', 'which', 'why', 'wish', 'work', 'would', 'write', 'your',
    ],
    lines: [
      'ROAR!', 'Where is my snack?', 'I am the boss of this castle!', 'Oops!',
      'Pizza time!', "Let's go!", 'Uh oh...', 'Ha ha ha!', 'I can fly!', 'Watch this!', 'The End.',
    ],
    links: [
      { icon: '🔤', name: 'Spelling Training', url: 'https://www.spellingtraining.com', note: 'Type weekly words; reads aloud' },
      { icon: '🕹️', name: 'Home Spelling Words', url: 'https://www.homespellingwords.com', note: 'Weekly words as arcade games' },
      { icon: '🦄', name: 'Night Zookeeper', url: 'https://www.nightzookeeper.com', note: 'Invent animals, write stories' },
      { icon: '🌳', name: 'Imagine Forest', url: 'https://www.imagineforest.com', note: 'Free story maker' },
      { icon: '💬', name: 'MakeBeliefsComix', url: 'https://makebeliefscomix.com', note: 'Free comic maker' },
      { icon: '📺', name: 'Storyline Online', url: 'https://storylineonline.net', note: 'Stories read aloud on video' },
    ],
  },
  Oliver: {
    panels: 2,
    starter: ['cat', 'dog', 'sun', 'hat', 'pig', 'bus'],
    pics: [] as Array<[string, string]>,
    sight: [
      'a', 'and', 'big', 'blue', 'can', 'come', 'down', 'find', 'for', 'funny',
      'go', 'help', 'here', 'I', 'in', 'is', 'it', 'jump', 'little', 'look',
      'make', 'me', 'my', 'not', 'one', 'play', 'red', 'run', 'said', 'see',
      'the', 'three', 'to', 'two', 'up', 'we', 'where', 'yellow', 'you',
    ],
    lines: ['Hi!', 'Yum!', 'Oops!', 'Wow!', "Let's play!", 'Bye!', 'I love you!', 'Boo!', 'Hooray!'],
    links: [
      { icon: '📺', name: 'Storyline Online', url: 'https://storylineonline.net', note: 'Stories read aloud on video' },
      { icon: '📚', name: 'Harnett County Library eBooks', url: 'https://harnett.libguides.com/booksandmore/ebooks', note: 'Read-alongs and audiobooks' },
    ],
  },
};

export interface ScienceUnitDef {
  id: string;
  title: string;
  gabeTitle: string;
  icon: string;
  file: string;
}

export const SCIENCE_UNITS: ScienceUnitDef[] = [
  { id: 'SCI-U1-weighing-of-conditions', title: 'Unit 1: The Weighing of Conditions', gabeTitle: 'Unit 1: The Weighing of Conditions', icon: '⚖️', file: '/quests/ScienceUnit1.html' },
  { id: 'SCI-U2-trial-log', title: 'Unit 2: The Trial Log', gabeTitle: 'Unit 2: The Trial Log', icon: '📒', file: '/quests/ScienceUnit2.html' },
  { id: 'SCI-U3-given-formulas', title: "Unit 3: Orrin's Given Formulas", gabeTitle: "Unit 3: Orrin's Given Formulas", icon: '📜', file: '/quests/ScienceUnit3.html' },
  { id: 'SCI-U4-inherited-marks', title: 'Unit 4: Inherited Marks', gabeTitle: 'Unit 4: Inherited Marks', icon: '🟫', file: '/quests/ScienceUnit4.html' },
  { id: 'SCI-U5-review-chambers', title: 'Unit 5: Three Review Chambers', gabeTitle: 'Unit 5: Three Review Chambers', icon: '🗝️', file: '/quests/ScienceUnit5.html' },
  { id: 'SCI-MIXED-science-check', title: "Mixed Science Check (Gabe sees: The Season's Last Reports)", gabeTitle: "The Season's Last Reports", icon: '✉️', file: '/quests/ScienceMixed.html' },
];
