export interface BramblewoodBook {
  num: number;
  title: string;
  illustrations: number;
  artApproved: number;
  englishApproved: number;
  spanishApproved: number;
  comfyRedo: number;
  status: 'Not started' | 'Needs ComfyUI redo' | 'In review' | 'Approved' | 'Published';
  notes?: string;
}

export interface PrintableChecklist {
  pdfChecked: boolean;
  mockupReady: boolean;
  printedTest: boolean;
  permitApproved: boolean;
}

export interface PrintableProduct {
  id: string;
  num: string;
  title: string;
  price: string;
  pages: string;
  summary: string;
  versions: string;
  tags: string[];
  status: 'Draft' | 'Ready for Etsy' | 'Listed';
  listingTitle?: string;
  listingDescription?: string;
  checklist?: PrintableChecklist;
}

export interface BramblewoodCharacter {
  id: string;
  name: string;
  bookNum: number;
  role: string;
  theme: string;
  palette: string;
  outfitProps: string;
  consistencyRules: string;
  voiceNotes: string;
  referenceUrl: string;
}

export interface BramblewoodAgent {
  id: string;
  name: string;
  title: string;
  emoji: string;
  specialty: string;
  mandate: string;
  accent: string;
}

export type AgentTaskStatus = 'Queued' | 'In Progress' | 'Needs Approval' | 'Approved';

export interface BramblewoodAgentTask {
  id: string;
  agentId: string;
  title: string;
  bookNum?: number;
  spreadId?: string;
  printableId?: string;
  priority: 'High' | 'Normal' | 'Low';
  status: AgentTaskStatus;
  brief: string;
  deliverable: string;
  createdAt: string;
  updatedAt: string;
}

export const SPARROW_SPROCKET_BRAND = {
  shopName: 'Sparrow & Sprocket',
  tagline: 'Gentle routines for busy, brilliant brains — designed by a neurodivergent family of seven.',
  colors: [
    { name: 'Sage', hex: '#7FA98B' },
    { name: 'Deep Sage', hex: '#5E8C6A' },
    { name: 'Sky', hex: '#8DB8D8' },
    { name: 'Peach', hex: '#F4B183' },
    { name: 'Lilac', hex: '#C9A7D8' },
    { name: 'Cream', hex: '#FFF8EE' },
    { name: 'Ink', hex: '#33415C' },
  ],
  fonts: 'Fredoka (headings) · Atkinson Hyperlegible (body, dyslexia-friendly)',
};

export const INITIAL_BRAMBLEWOOD_BOOKS: BramblewoodBook[] = [
  { num: 1, title: "Milo's Zoom Brain", illustrations: 14, artApproved: 13, englishApproved: 0, spanishApproved: 0, comfyRedo: 1, status: 'In review' },
  { num: 2, title: "Juni's Quiet Shell", illustrations: 14, artApproved: 0, englishApproved: 0, spanishApproved: 0, comfyRedo: 14, status: 'Needs ComfyUI redo' },
  { num: 3, title: 'Rafi and the Wiggly Words', illustrations: 14, artApproved: 0, englishApproved: 0, spanishApproved: 0, comfyRedo: 14, status: 'Needs ComfyUI redo' },
  { num: 4, title: "Kai's Two-Speed Engine", illustrations: 14, artApproved: 0, englishApproved: 0, spanishApproved: 0, comfyRedo: 14, status: 'Needs ComfyUI redo' },
  { num: 5, title: 'Priya and the Sticky Thoughts', illustrations: 14, artApproved: 0, englishApproved: 0, spanishApproved: 0, comfyRedo: 14, status: 'Needs ComfyUI redo' },
  { num: 6, title: 'Rosie and Pip Feel Brave', illustrations: 14, artApproved: 0, englishApproved: 0, spanishApproved: 0, comfyRedo: 14, status: 'Needs ComfyUI redo' },
  { num: 7, title: "The Gray Cloud Over Teo's House", illustrations: 14, artApproved: 0, englishApproved: 0, spanishApproved: 0, comfyRedo: 14, status: 'Needs ComfyUI redo' },
  { num: 8, title: "Sam's Own Steps", illustrations: 14, artApproved: 0, englishApproved: 0, spanishApproved: 0, comfyRedo: 14, status: 'Needs ComfyUI redo' },
  { num: 9, title: 'The Big Bramblewood Feelings Fair', illustrations: 14, artApproved: 0, englishApproved: 0, spanishApproved: 0, comfyRedo: 14, status: 'Needs ComfyUI redo' },
];

const FOOTER_DISCLAIMER =
  "INSTANT DIGITAL DOWNLOAD. No physical item ships. US Letter (8.5×11) PDF. Print on cardstock and laminate for daily reuse. Licensed for personal or single-classroom use only. Please don't resell or share the files. Designed by a neurodivergent family of seven.";

export const INITIAL_PRINTABLES_CATALOG: PrintableProduct[] = [
  {
    id: 'p1-routine-cards',
    num: '01',
    title: 'Visual Routine Cards for Kids',
    price: '$5.50',
    pages: '7 pages',
    summary: '32 picture cards for morning & evening, 8 blank cards, To-Do/Done strips, and parent/PDA tips.',
    versions: 'US Letter PDF + Mockup ready',
    tags: [
      'visual schedule', 'routine cards', 'adhd routine chart', 'autism visual aid',
      'morning routine kids', 'bedtime routine chart', 'toddler routine', 'printable schedule',
      'picture schedule', 'velcro routine', 'kids checklist', 'neurodivergent kids', 'homeschool printable',
    ],
    status: 'Ready for Etsy',
    listingTitle: 'Visual Routine Cards for Kids | ADHD Autism Morning & Evening Routine Chart | Printable Visual Schedule | Velcro Picture Cards | Instant PDF',
    listingDescription: `Turn "I told you five times" into "point to what's next." You get 32 bright picture cards for morning and evening, 8 blank cards to fill in yourself, and To-Do/Done strip boards, so kids can see each step and move it to Done. The layouts stay uncluttered, the icons are high-contrast, and the text uses a dyslexia-friendly font. A short parent guide (including tips for PDA kids) is included. 7 pages.\n\n${FOOTER_DISCLAIMER}`,
    checklist: { pdfChecked: true, mockupReady: true, printedTest: false, permitApproved: false },
  },
  {
    id: 'p2-chore-charts',
    num: '02',
    title: 'Chore Charts by Age (Ages 3–13+)',
    price: '$5.00',
    pages: '8 pages',
    summary: 'Age-appropriate lists (3–5, 6–8, 9–12, 13+), 4 weekly picture charts, blank chart & 8-card reward menu.',
    versions: 'Digital Fillable PDF + Print-Friendly PDF',
    tags: [
      'chore chart', 'chores by age', 'kids chore list', 'adhd chore chart',
      'responsibility chart', 'teen chore chart', 'family chore system', 'reward chart',
      'printable chore chart', 'weekly chore chart', 'toddler chores', 'chore checklist', 'allowance chart',
    ],
    status: 'Ready for Etsy',
    listingTitle: 'Chore Chart by Age Printable | ADHD Friendly Kids Chore List Ages 3-5 6-8 9-12 Teens | Weekly Responsibility Chart | Reward Menu | PDF',
    listingDescription: `Age-appropriate chores without the overwhelm. Inside are chore idea lists for ages 3–5, 6–8, 9–12, and 13+, four picture charts for the week, a blank chart, and an 8-card reward menu. ADHD-friendly tips cover habit stacking, body doubling, and keeping each chart to 3–5 chores. 8 pages. TWO VERSIONS INCLUDED: Digital Fillable PDF + Print Friendly PDF.\n\n${FOOTER_DISCLAIMER}`,
    checklist: { pdfChecked: true, mockupReady: true, printedTest: false, permitApproved: false },
  },
  {
    id: 'p3-first-then',
    num: '03',
    title: 'First–Then & Now/Next Board Kit',
    price: '$3.99',
    pages: '6 pages',
    summary: 'First/Then board with 5-star token strip, Now/Next board, 24 picture cards, star tokens & how-to guide.',
    versions: 'Digital Fillable PDF + Print-Friendly PDF',
    tags: [
      'first then board', 'now next board', 'autism visual aid', 'token board',
      'visual support', 'aba therapy', 'speech therapy', 'picture cards',
      'transition cards', 'behavior chart', 'special education', 'toddler visuals', 'sped printable',
    ],
    status: 'Ready for Etsy',
    listingTitle: 'First Then Board Printable | Now Next Board | Autism Visual Support | Token Board | 24 Picture Cards | ABA Speech Therapy Tool | PDF',
    listingDescription: `A simple, predictable way to handle demands and transitions. The kit includes a First/Then board with a 5-star token strip, a Now/Next board, 24 activity picture cards, star tokens, and a clear how-to guide. It works at home, in the car, at the doctor, and in class. 6 pages. TWO VERSIONS INCLUDED: Digital Fillable PDF + Print Friendly PDF.\n\n${FOOTER_DISCLAIMER}`,
    checklist: { pdfChecked: true, mockupReady: true, printedTest: false, permitApproved: false },
  },
  {
    id: 'p4-calm-corner',
    num: '04',
    title: 'Calm-Down Corner Kit',
    price: '$7.50',
    pages: '7 pages',
    summary: 'Calm Corner sign, 12 feelings cards, 12 sensory coping cards, square breathing poster & "My Calm Plan" sheet.',
    versions: 'Digital Fillable PDF + Print-Friendly PDF',
    tags: [
      'calm down corner', 'calming corner', 'feelings chart', 'coping skills',
      'emotional regulation', 'calm down kit', 'sel printable', 'breathing exercise',
      'zones of feelings', 'autism sensory', 'adhd kids', 'feelings cards', 'classroom decor',
    ],
    status: 'Ready for Etsy',
    listingTitle: 'Calm Down Corner Kit Printable | Feelings Chart | Coping Skills Cards | Square Breathing Poster | Emotional Regulation for Kids ADHD Autism',
    listingDescription: `Make a calm corner your child actually wants to use. The kit has a Calm Corner sign, 12 feelings cards, 12 sensory-friendly coping cards (heavy work, headphones, a weighted blanket, and "I need a break"), a square breathing poster, a "My Calm Plan" worksheet, and a guide for grown-ups. 7 pages. This is a support tool, not therapy. TWO VERSIONS INCLUDED.\n\n${FOOTER_DISCLAIMER}`,
    checklist: { pdfChecked: true, mockupReady: true, printedTest: false, permitApproved: false },
  },
  {
    id: 'p5-family-planner',
    num: '05',
    title: 'Weekly Family & Meal Planner',
    price: '$3.50',
    pages: '6 pages',
    summary: 'Week-at-a-glance (who/where/drives), meal & snack planner, sorted grocery list, ADHD brain dump & top-3 box.',
    versions: 'Digital Fillable PDF + Print-Friendly PDF',
    tags: [
      'family planner', 'meal planner', 'grocery list', 'weekly planner',
      'command center', 'adhd planner', 'brain dump', 'menu planner',
      'mom planner', 'household planner', 'printable planner', 'executive function', 'family organizer',
    ],
    status: 'Ready for Etsy',
    listingTitle: 'Family Weekly Planner Printable | Meal Planner & Grocery List | ADHD Brain Dump Page | Family Command Center | Executive Function | PDF',
    listingDescription: `A command center for families that are running on empty. It includes a week-at-a-glance page (who, where, who drives), a weekly meal plan with a snacks column, a grocery list sorted by section, a brain-dump page with a top-3 priorities box, and a bank of easy dinners with theme nights. 6 pages. TWO VERSIONS INCLUDED.\n\n${FOOTER_DISCLAIMER}`,
    checklist: { pdfChecked: true, mockupReady: true, printedTest: false, permitApproved: false },
  },
  {
    id: 'p6-mirror-math',
    num: '06',
    title: 'Mirror Math Games (Digital Download)',
    price: '$4.00',
    pages: 'Offline HTML + PDF guide',
    summary: '5 calm modes: Little Adders, Mirror Easy/Harder (12×21 patterns), Step-by-Step area model & Factorials.',
    versions: 'Offline interactive ZIP + instruction PDF',
    tags: [
      'math game', 'kids math', 'homeschool math', 'multiplication game',
      'addition game', 'gifted kids', 'digital math game', 'mental math',
      'factorials', 'area model', 'offline game', 'math practice', '2e learner',
    ],
    status: 'Ready for Etsy',
    listingTitle: 'Math Game for Kids Digital Download | Offline Browser Game | Addition Multiplication Factorials | No Timer Calm Math | Gifted Homeschool Ages 4-10',
    listingDescription: `A calm, ad-free math game in one file that opens in any browser and works offline, with no account needed. It has 5 modes: Little Adders, Mirror Easy & Harder (12×21 patterns), Step-by-Step area model, and Factorials. No timers, no lives, sound off by default. Includes an instruction PDF in a ZIP download.\n\n${FOOTER_DISCLAIMER}`,
    checklist: { pdfChecked: true, mockupReady: true, printedTest: false, permitApproved: false },
  },
  {
    id: 'p7-shop-bundle',
    num: '★',
    title: 'Whole-Shop Bundle (Kits 1–6)',
    price: '$19.99',
    pages: '~30% bundle savings',
    summary: 'All 6 Sparrow & Sprocket printable kits + digital Mirror Math game packaged together.',
    versions: 'Complete bundle',
    tags: ['Bundle', 'Neurodivergent family kit', 'ADHD', 'Autism', 'Homeschool'],
    status: 'Ready for Etsy',
    listingTitle: 'Whole Shop Bundle | ADHD & Autism Friendly Family Printables | Routine Cards, Chore Charts, Calm Corner, First-Then, Planner & Mirror Math',
    listingDescription: `Save ~30% with all 6 Sparrow & Sprocket printable kits plus the offline Mirror Math Games ZIP bundled together for busy neurodivergent families.\n\n${FOOTER_DISCLAIMER}`,
    checklist: { pdfChecked: true, mockupReady: false, printedTest: false, permitApproved: false },
  },
  {
    id: 'bilingual-bramblewood',
    num: 'ES',
    title: 'Los Amigos de Bramblewood (Spanish & Bilingual Kits)',
    price: 'Catalog / ETSY',
    pages: 'Books + Posters + Coloring + Feelings Fair',
    summary: 'Bilingual Mega Bundle, Spanish Activity Workbooks, Classroom Posters (8.5×11 & 11×14), Tarjetas de Sentimientos & Coloring Books.',
    versions: 'Stored in Google Drive (Printables & Bramblewood zips)',
    tags: ['Bilingual', 'Spanish SEL', 'Feelings Fair'],
    status: 'Draft',
    listingTitle: 'Los Amigos de Bramblewood | Bilingual SEL Workbooks, Feelings Fair Posters & Coloring Kit',
    listingDescription: 'Spanish & bilingual companion kit aligned with all 9 Bramblewood Friends storybooks (requires Spanish approval & print test before listing).',
    checklist: { pdfChecked: false, mockupReady: false, printedTest: false, permitApproved: false },
  },
];

export const INITIAL_CHARACTER_BIBLE: BramblewoodCharacter[] = [
  {
    id: 'char-milo',
    name: 'Milo',
    bookNum: 1,
    role: 'Energetic Red Squirrel · Fast "Zoom Brain"',
    theme: 'ADHD / fast-moving attention, visual checklists ("pit crew"), externalizing steps',
    palette: 'Russet orange #D96B27, acorn tan #E9C796, sky blue #8DB8D8',
    outfitProps: 'Teal gardener apron, yellow dandelion button, small wooden checklist clip & red rocket lunchbox',
    consistencyRules: 'Bushy striped tail curls upward; tuft between ears; 5 clean fingers on paws; never merge lunchbox handle with paw.',
    voiceNotes: 'Enthusiastic, bouncy short thoughts ("ZOOM! A bird! A rocket!"); never shamed for speed — learns pit-crew anchors.',
    referenceUrl: '',
  },
  {
    id: 'char-juni',
    name: 'Juni',
    bookNum: 2,
    role: 'Gentle Pond Turtle · Sensory & Quiet-Need Friend',
    theme: 'Sensory overload, quiet regulation, pinecone sorting & safe decompression',
    palette: 'Sage moss #7FA98B, soft cream shell #EDE0C2, lavender scarf #C9A7D8',
    outfitProps: 'Woven moss scarf, tiny woven basket for smooth pinecones and river stones',
    consistencyRules: 'Smooth hexagonal shell markings in muted olive; calm half-smiling eyes; basket held neatly in front.',
    voiceNotes: 'Soft, observational, values calm rhythm and warning before loud transitions.',
    referenceUrl: '',
  },
  {
    id: 'char-rafi',
    name: 'Rafi',
    bookNum: 3,
    role: 'Observant Badger/Hedgehog · Dyslexia & Wiggly Words',
    theme: 'Seeing details others miss (6 legs on a beetle), audio books/headphones, multi-sensory reading',
    palette: 'Warm charcoal #4A5568, honey gold #F4B183, cream #FFF8EE',
    outfitProps: 'Cozy mustard cardigan, round wire spectacles, cushioned mint listening headphones',
    consistencyRules: 'Glasses always sit evenly on bridge; headphones have thick padded cups; magnifying glass in pocket.',
    voiceNotes: 'Curiously notices tiny nature details; learns "some brains learn through ears first" without shame.',
    referenceUrl: '',
  },
  {
    id: 'char-kai',
    name: 'Kai',
    bookNum: 4,
    role: 'Otter Inventor · Two-Speed Energy & Pacing',
    theme: 'Hyperfocus vs. low-battery crash, pacing energy bars, body awareness',
    palette: 'River teal #5E8C6A, warm driftwood #B88B58, apricot #F4B183',
    outfitProps: 'Canvas tool satchel, brass stopwatch (non-stressful toy prop), rolled blueprint tube',
    consistencyRules: 'Sleek river-otter whiskers, cream muzzle, leather strap sits cleanly across shoulder.',
    voiceNotes: 'Tinkering metaphors ("two gears", "pit stop for fuel"); validates resting before empty.',
    referenceUrl: '',
  },
  {
    id: 'char-priya',
    name: 'Priya',
    bookNum: 5,
    role: 'Thoughtful Fox · Sticky Thoughts & Anxiety Loops',
    theme: 'Rumination / intrusive "what-if" sticky thoughts, grounding & setting worries on a bench',
    palette: 'Cinnamon coral #D97A54, lilac #C9A7D8, ivory #FFF8EE',
    outfitProps: 'Knit plum sweater, small origami paper boats, woven friendship bracelet',
    consistencyRules: 'White-tipped fox tail, expressive ears tilted gently (not fearful), cozy plum sweater stitches.',
    voiceNotes: 'Gentle inner monologue; learns thoughts are leaves floating past, not commands.',
    referenceUrl: '',
  },
  {
    id: 'char-rosie-pip',
    name: 'Rosie & Pip',
    bookNum: 6,
    role: 'Sibling Bunnies · Social Shyness & Brave First Steps',
    theme: 'Selective mutism / slow warm-up, parallel play, whispering buddy system',
    palette: 'Soft peach #F4B183, rose blush #F2B5C4, meadow sage #7FA98B',
    outfitProps: 'Rosie wears a daisy hairclip & yellow boots; tiny Pip carries a plush acorn friend',
    consistencyRules: 'Keep Rosie taller by 1 head than Pip; floppy left ear on Pip; matching pastel rain boots.',
    voiceNotes: 'Quiet solidarity ("We can just watch for two minutes first").',
    referenceUrl: '',
  },
  {
    id: 'char-teo',
    name: 'Teo',
    bookNum: 7,
    role: 'Young Bear · Heavy Sadness & "Gray Cloud" Days',
    theme: 'Grief, depressed mood, sitting beside a friend without forcing fake cheerfulness',
    palette: 'Misty slate #64748B, buttercup yellow #F6D365, chestnut brown #8A5A3B',
    outfitProps: 'Oversized raincoat with hood down, paper lantern, soft wool scarf',
    consistencyRules: 'Soft rounded cub ears, gentle posture, subtle semi-translucent watercolor raincloud motif.',
    voiceNotes: 'Honest, validating ("You do not have to chase the cloud away alone").',
    referenceUrl: '',
  },
  {
    id: 'char-sam',
    name: 'Sam',
    bookNum: 8,
    role: 'Fawn · Demand Avoidance, Autonomy & Own Steps',
    theme: 'PDA / autonomy-supportive choices, doing things "Sam’s own way" on their own rhythm',
    palette: 'Warm fawn #C99A6B, sky blue #8DB8D8, cream spots #FFF8EE',
    outfitProps: 'Blue checkered kerchief, small flat flat-stone stepping tiles',
    consistencyRules: 'Back spots symmetrical and soft cream; dainty hooves clean; calm relaxed shoulders.',
    voiceNotes: 'Clear, direct, prefers two collaborative invitations rather than commands.',
    referenceUrl: '',
  },
  {
    id: 'char-ms-hazel',
    name: 'Ms. Hazel',
    bookNum: 9,
    role: 'Kind Owl Mentor · Bramblewood Commons Guide',
    theme: 'Safe trusted adult who models co-regulation, patience, and practical accommodations',
    palette: 'Deep forest sage #5E8C6A, warm umber #7A5838, parchment #FFF8EE',
    outfitProps: 'Sage botanical apron with seed packets in pockets, round brass glasses, garden hat',
    consistencyRules: 'Always depicted kneeling or eye-level when comforting a child; warm soft plumage, never intimidating.',
    voiceNotes: 'Calm, grounding, curious questions ("What would help your body feel steadier right now?").',
    referenceUrl: '',
  },
];

export const BRAMBLEWOOD_AGENTS: BramblewoodAgent[] = [
  {
    id: 'managing-editor',
    name: 'Hazel Quill',
    title: 'Managing Editor & Readiness Director',
    emoji: '🦉',
    specialty: 'Series Readiness, Book Sequencing & Final Release Gates',
    mandate: 'Coordinates all 9 books, flags bottlenecks across Art / EN / ES, and prepares Executive ! Permits before external launch.',
    accent: '#9d174d',
  },
  {
    id: 'story-editor',
    name: 'Clover Pen',
    title: 'Story & Neurodivergent-Affirming Copy Editor',
    emoji: '✍️',
    specialty: 'English Manuscript Polish & Dyslexia-Friendly Pacing',
    mandate: 'Reviews read-aloud cadence, honors neurodivergent lived experience without preaching, and keeps text warm & concise.',
    accent: '#2d6a4f',
  },
  {
    id: 'spanish-editor',
    name: 'Marisol Alba',
    title: 'Bilingual & Spanish Localization Editor',
    emoji: '🌎',
    specialty: 'Natural LatAm Spanish Prose & Cultural Fidelity',
    mandate: 'Translates English spreads into natural, warm, kid-authentic Spanish matching rhythm, emotions, and bilingual kits.',
    accent: '#1d4ed8',
  },
  {
    id: 'art-director',
    name: 'Rowan Brush',
    title: 'Art Director & ComfyUI Prompt Engineer',
    emoji: '🎨',
    specialty: 'Character Bible Consistency & RTX 5090 ComfyUI Redos',
    mandate: 'Crafts child-safe watercolor prompts, audits hands/props/anatomy, and queues ComfyUI redos on Ray’s local RTX 5090 (Article V).',
    accent: '#b45309',
  },
  {
    id: 'safety-qa',
    name: 'Oakhaven Inspector',
    title: 'Article VII Child-Safety & Print-QA Auditor',
    emoji: '🛡️',
    specialty: 'Gutter Bleed, Font Legibility & Strict Child-Safe QA',
    mandate: 'Verifies Atkinson Hyperlegible sizing, 300-DPI bleed margins, zero adult themes, and clean print-test readiness.',
    accent: '#6d28d9',
  },
  {
    id: 'storefront-strategist',
    name: 'Pippa Sprocket',
    title: 'Sparrow & Sprocket Launch Strategist',
    emoji: '🛍️',
    specialty: 'Etsy / KDP SEO, Pricing & Bundle Packaging',
    mandate: 'Maintains Etsy 13-tag SEO, fees/profit math, mockups, and drafts — never creates accounts or publishes without ! Permit.',
    accent: '#0f766e',
  },
];

export const INITIAL_AGENT_TASKS: BramblewoodAgentTask[] = [
  {
    id: 'task-b1-en-proof',
    agentId: 'story-editor',
    title: 'Final English approval pass on Book 1 (Milo’s Zoom Brain)',
    bookNum: 1,
    priority: 'High',
    status: 'Needs Approval',
    brief: 'Art for spreads s01–s12 + Cover was approved Nov 19! Run final read-aloud cadence & dyslexia-friendly line break check across all 12 spreads of Book 1 so English Approved boxes can be checked.',
    deliverable: 'All 12 English spreads reviewed; confirm s08 fidget-spinner reference aligns with final art.',
    createdAt: '2026-11-26',
    updatedAt: '2026-11-26',
  },
  {
    id: 'task-b1-p28-art',
    agentId: 'art-director',
    title: 'ComfyUI redo for Book 1 Page 28 (Feelings Fair friends page)',
    bookNum: 1,
    spreadId: 'b1-page-28-feelings-fair-friends-page',
    priority: 'High',
    status: 'Queued',
    brief: 'Page 28 is the ONLY remaining art redo needed for Book 1! Assemble warm watercolor group illustration introducing Milo, Juni, Rafi, Kai, Priya, Rosie & Pip, Teo, Sam, and Ms. Hazel together at Bramblewood Commons.',
    deliverable: 'ComfyUI workflow prompt + 1 approved wide spread image on Ray’s RTX 5090.',
    createdAt: '2026-11-26',
    updatedAt: '2026-11-26',
  },
  {
    id: 'task-b1-spanish',
    agentId: 'spanish-editor',
    title: 'Localize Book 1 (Milo’s Zoom Brain) into warm Spanish prose',
    bookNum: 1,
    priority: 'High',
    status: 'In Progress',
    brief: 'Translate s01–s12 + Cover + Activity Pack into natural, expressive Spanish matching playful rhythms ("¡ZOOM!", pit crew = "equipo de boxes").',
    deliverable: 'Complete Spanish spread strings saved in Spreads Workbench for Amarette review.',
    createdAt: '2026-11-26',
    updatedAt: '2026-11-26',
  },
  {
    id: 'task-b2-juni-art',
    agentId: 'art-director',
    title: 'Queue ComfyUI redo batch for Book 2 (Juni’s Quiet Shell, s01–s12)',
    bookNum: 2,
    priority: 'Normal',
    status: 'Queued',
    brief: 'Next book in pipeline! Prepare 14 consistent Juni the Pond Turtle scene prompts following the Character Bible (sage moss scarf, smooth shell pattern, calm sensory lighting).',
    deliverable: '14 prompt specs ready for local RTX 5090 ComfyUI generation.',
    createdAt: '2026-11-26',
    updatedAt: '2026-11-26',
  },
  {
    id: 'task-ss-print-test',
    agentId: 'safety-qa',
    title: 'Physical print test check across Printables Kits #1–#6',
    printableId: 'p1-routine-cards',
    priority: 'High',
    status: 'Needs Approval',
    brief: 'All 6 individual Sparrow & Sprocket printable kits have PDFs & mockups marked ready. Print 1 copy of each US Letter PDF to confirm margins, Atkinson Hyperlegible contrast, and laminate trim lines.',
    deliverable: 'Check off Printed Test Copy across Kits 1–6 before requesting Etsy ! Permit.',
    createdAt: '2026-11-26',
    updatedAt: '2026-11-26',
  },
  {
    id: 'task-ss-etsy-permit',
    agentId: 'storefront-strategist',
    title: 'Prepare Whole-Shop Bundle mockup & USPTO check before Etsy ! Permit',
    printableId: 'p7-shop-bundle',
    priority: 'Normal',
    status: 'Queued',
    brief: 'Run free USPTO search for "Sparrow & Sprocket", assemble bundle cover preview ($19.99), and compile final $1.40 listing fee breakdown for Chancellor ! Permit sign-off.',
    deliverable: 'Pre-launch bundle mockup + USPTO check confirmed clear.',
    createdAt: '2026-11-26',
    updatedAt: '2026-11-26',
  },
];

export const DRIVE_BOOK_RESOURCES = [
  {
    label: 'The Bramblewood Friends (Storybooks Folder)',
    url: 'https://drive.google.com/drive/folders/1w8uC_46l6jApqMwpYrnRxGIdrX2nxo-H',
  },
  {
    label: 'Bramblewood Friends: Book Approval Tracker',
    url: 'https://docs.google.com/spreadsheets/d/186NIe3QarbCq4HPstQ6UDc1JCG6B39vnuPqjE9qQsKs/edit',
  },
  {
    label: 'Printables Folder (Sparrow & Sprocket)',
    url: 'https://drive.google.com/drive/folders/1FmsE2r_S379kJkQYRdekYyk5r3mW0sEm',
  },
];
