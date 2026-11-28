export interface BuildingDef {
  id: string;
  name: string;
  label: string;
  district: string;
  x: number;
  y: number;
  rx: number;
  ry: number;
  lx: number;
  ly: number;
  phase: string;
  headRole: string;
  repSprite: string;
  motif: string;
  zones: string[];
  special: 'commons' | 'town-hall' | 'executive' | 'courthouse' | 'stocks' | 'air' | 'health' | 'childrens-books' | 'home-garden' | 'default';
  greenBanner?: boolean;
}

export const BUILDINGS: BuildingDef[] = [
  {
    id: 'commons',
    name: 'Commons Square',
    label: 'COMMONS SQUARE',
    district: 'Campus Center',
    x: 785,
    y: 495,
    rx: 195,
    ry: 120,
    lx: 785,
    ly: 632,
    phase: 'v2 First Deep Interior',
    headRole: 'Neutral Assembly Plaza (All 13 Department Reps Convene Here)',
    repSprite: 'sprite-catgirl',
    motif:
      'Circular cobblestone amphitheater plaza serving as the meeting place for the Constitutional Convention and Congress, as well as a general gathering plaza where agents of all departments can chat and hang out around the spiraling elemental Cairnspire.',
    zones: [
      'Amphitheater Seating Ring',
      'Speaker Dais & Podium',
      'Spiral Elemental Cairnspire',
      'Constitutional Convention Floor',
    ],
    special: 'commons',
  },
  {
    id: 'town-hall',
    name: 'Town Hall',
    label: 'TOWN HALL',
    district: 'Civic District · Congressional Branch',
    x: 790,
    y: 155,
    rx: 112,
    ry: 105,
    lx: 790,
    ly: 274,
    phase: 'v2 First Deep Interior',
    headRole: 'Speaker of Town Hall (Congressional Branch & Committees)',
    repSprite: 'sprite-elvaan',
    motif:
      'Grand emerald-domed stone assembly hall housing the Congressional arm of government — where standing Congressional Committees meet alongside the ratified Preliminary Bill of Rights, Campus Constitution, and Skills Registry.',
    zones: [
      'Ratified Preliminary Bill of Rights Vault',
      'Congressional Committees (5 Standing Panels)',
      'Constitutional Convention Ledger',
      'Skills & Rules Registry',
    ],
    special: 'town-hall',
  },
  {
    id: 'executive',
    name: 'Police Station',
    label: 'POLICE STATION',
    district: 'Civic District · Executive & Enforcement Branch',
    x: 1025,
    y: 175,
    rx: 76,
    ry: 105,
    lx: 1025,
    ly: 290,
    phase: 'v2 First Deep Interior',
    headRole: 'Commissioner (Police Station & Executive Branch Rep)',
    repSprite: 'sprite-catgirl',
    motif:
      'Freestanding crenellated stone watchtower enforcing the Preliminary Bill of Rights and Campus Constitution through the Commissioner, Chief of Police, Detective, Law Enforcement Officer, and Detainment Force — queueing ! Permits for Chancellor approval.',
    zones: ['Permits & Approvals Desk (!)', 'Chief & Detective Investigation Desk', 'Detainment Force & Policy Gatekeeper'],
    special: 'executive',
  },
  {
    id: 'courthouse',
    name: 'Courthouse',
    label: 'COURTHOUSE',
    district: 'Civic District · Three-Tier Judicial Branch',
    x: 525,
    y: 145,
    rx: 100,
    ry: 90,
    lx: 525,
    ly: 242,
    phase: 'v2 First Deep Interior',
    headRole: 'Chief Justice (Head of Judicial System & Rep)',
    repSprite: 'sprite-elvaan',
    motif:
      'Classical pillared Judicial Hall organized into three court systems: Civil & Criminal Court (general agent cases with Judge, Prosecutor & Defense), Grand Court (government & inter-branch cases), and the 5-Justice Supreme Court auditing constitutional process.',
    zones: [
      'Supreme Court (Chief + 4 Justices)',
      'Civil & Criminal Court (Agent Cases)',
      'Grand Court (Government Cases)',
      'Append-Only Conduct Cairn Ledger',
    ],
    special: 'courthouse',
  },
  {
    id: 'geology',
    name: 'Geology',
    label: 'GEOLOGY',
    district: 'Academic & Personal Mastery',
    x: 1365,
    y: 180,
    rx: 185,
    ry: 140,
    lx: 1385,
    ly: 332,
    phase: 'v5 Rockhounding & Specimen Interior',
    headRole: 'Department Head (12-Agent Rockhounding Team & Rep)',
    repSprite: 'sprite-elvaan',
    motif:
      'Crystal-studded mountain laboratory supporting the Chancellor’s rockhounding interests — staffed by a 12-agent expedition team covering maps, scientific journals, LiDAR, gems/crystals, batholiths, vulcanology, mines, lapidary cutting & polishing, and St. Louis ↔ Lillington roadtrip localities.',
    zones: [
      'Specimen & Mineral Vault',
      'St. Louis, MO ↔ Lillington, NC Roadtrip Route',
      'LiDAR, Batholiths & Mines Desk',
      'Cutting, Polishing & Learning Guide',
    ],
    special: 'default',
  },
  {
    id: 'stocks',
    name: 'Stocks',
    label: 'STOCKS',
    district: 'Creative, Business & Wealth',
    x: 255,
    y: 215,
    rx: 132,
    ry: 102,
    lx: 255,
    ly: 325,
    phase: 'v6 Dual-Desk Exchange',
    headRole: 'Head of Markets (5-Agent Dual-Desk Exchange & Rep)',
    repSprite: 'sprite-catgirl',
    motif:
      'Modern limestone-and-glass exchange split between a strictly Read-Only Research/Watchlists Desk (Head of Markets, Risk & Circuit-Breaker Officer, Earnings Analyst, Macro Scout) and the Article VIII Walled MCP Trading Desk (GrokBot only, under hard risk caps & Courthouse Cairn logs).',
    zones: [
      'Watchlist & Earnings Research Desk (Read-Only)',
      'Macro News & Risk Circuit-Breaker Station',
      'Walled MCP Trading Desk (GrokBot · Hard Caps Only)',
    ],
    special: 'stocks',
  },
  {
    id: 'air',
    name: 'AIR (AI Resources)',
    label: 'AIR (AI RESOURCES)',
    district: 'Arcane Infrastructure & Operations',
    x: 315,
    y: 430,
    rx: 105,
    ry: 95,
    lx: 315,
    ly: 512,
    phase: 'v6 Compute & Roster Command',
    headRole: 'Director of AIR (4-Agent Compute & Roster Command Rep)',
    repSprite: 'sprite-catgirl',
    motif:
      'Arcane-futuristic AI Hub commanding 4 specialized roles: Director of AIR, Local GPU & Agent Zero Bridge Engineer (Ray’s RTX 5090), Agent Onboarding & RBAC Steward, and API & Compute Cost Watchdog under Article V.',
    zones: [
      'Agent Onboarding & RBAC Roster',
      'Local RTX 5090 ComfyUI & Agent Zero Bridges',
      'API & Compute Cost Stewardship Monitor',
      'Model Routing Registry',
    ],
    special: 'air',
  },
  {
    id: 'home-garden',
    name: 'Home and Garden',
    label: 'HOME AND GARDEN',
    district: 'Family Wing · App-Within-the-App',
    x: 255,
    y: 635,
    rx: 135,
    ry: 95,
    lx: 255,
    ly: 736,
    phase: 'v3 Native Family Hub Rebuild',
    headRole: 'Personal Assistant (Home & Garden Sanctuary Rep)',
    repSprite: 'sprite-halfling',
    motif:
      'App-within-an-app leading to the Family Hub that organizes life inside the Chancellor’s household (chores, activities, meals, school, calendar) with Personal Assistant support — strictly isolated via Security Rules for family & Kid Mode.',
    zones: [
      'Personal Assistant & Family Sanctuary Hub',
      'Chores & Weekly Checkoffs',
      'Family Calendar & Activities',
      'Parent-Paired Kid Mode (Liam & Oliver)',
    ],
    special: 'home-garden',
    greenBanner: true,
  },
  {
    id: 'health',
    name: 'School of Health',
    label: 'SCHOOL OF HEALTH',
    district: 'Academic & Personal Mastery',
    x: 535,
    y: 735,
    rx: 125,
    ry: 92,
    lx: 535,
    ly: 842,
    phase: 'v3 Live Private Health Vault',
    headRole: 'General Practitioner (School of Health & 10-Specialist Rep)',
    repSprite: 'sprite-fae',
    motif:
      'Tracks the Chancellor’s Medical, Physical, Mental, and Nutritional health plus family medical information — organized by a 10-role research & prep team (GP, Personal Trainer, Nutritionist, Psychologist, Psychiatrist, Endocrinologist, OBGYN, Neurologist, ENT) under Article III privacy.',
    zones: ['Health & Fitness (Oura Dashboard)', 'Amarette Medical Vault (Chancellor-Only)', '10-Specialist Advisors (Offline)', 'Family Health & Insurance Cards'],
    special: 'health',
  },
  {
    id: 'finance',
    name: 'Finance',
    label: 'FINANCE',
    district: 'Creative, Business & Wealth',
    x: 910,
    y: 770,
    rx: 95,
    ry: 95,
    lx: 910,
    ly: 874,
    phase: 'v6 Business & Publishing Treasury',
    headRole: 'Campus Treasurer (2-Agent Business Accounting Rep)',
    repSprite: 'sprite-halfling',
    motif:
      'Reinforced golden-doored Treasury reserved exclusively for Business & Publishing Accounting (Children’s Books, Sparrow & Sprocket, and Social Media P&L, software subscriptions & tax prep — Amarette & Ray only, zero personal household bills, zero autonomous spending).',
    zones: ['Publishing & Social Media P&L Ledger', 'Software & API Subscriptions Tracker', 'Tax Prep & Revenue Goals (No Household Bills)'],
    special: 'default',
  },
  {
    id: 'communications',
    name: 'Communications',
    label: 'COMMUNICATIONS',
    district: 'Arcane Infrastructure & Operations',
    x: 1115,
    y: 730,
    rx: 64,
    ry: 125,
    lx: 1115,
    ly: 872,
    phase: 'v6 Dual-Hub Belltower',
    headRole: 'Postmaster General (3-Agent Dual-Hub Belltower Rep)',
    repSprite: 'sprite-fae',
    motif:
      'Dual-hub Belltower & Messenger Post staffed by the Postmaster General, External Correspondence & Outreach Drafter (draft-only until Chancellor ! Permit), and Article VI Inter-Department Handoff Courier.',
    zones: ['Article VI Inter-Department Handoff Router', 'External Outreach & Email Drafts (! Permit Required)', 'Campus Announcements Board'],
    special: 'default',
  },
  {
    id: 'childrens-books',
    name: 'Children’s Books',
    label: 'CHILDREN’S BOOKS',
    district: 'Creative, Business & Wealth',
    x: 1225,
    y: 515,
    rx: 92,
    ry: 105,
    lx: 1225,
    ly: 632,
    phase: 'v4 Bramblewood Publishing Suite',
    headRole: 'Managing Editor (Best-Selling Book Agency Rep)',
    repSprite: 'sprite-catgirl',
    motif:
      'Best-selling book agency studio to produce, keep, manage, and sell The Bramblewood Friends series and Sparrow & Sprocket products — complete with PDF/Doc library, spreads workbench, Character Bible, and RTX 5090 ComfyUI pipeline.',
    zones: ['Bramblewood Book Library & Reader', '9-Book Spreads Workbench', 'Sparrow & Sprocket Printables', 'Publishing Agency Roster (Offline)'],
    special: 'childrens-books',
  },
  {
    id: 'social-media',
    name: 'Social Media',
    label: 'SOCIAL MEDIA',
    district: 'Creative, Business & Wealth',
    x: 1475,
    y: 490,
    rx: 100,
    ry: 105,
    lx: 1470,
    ly: 604,
    phase: 'v5 Autonomous Persona Studio',
    headRole: 'Agency Director (Social Media Company Rep)',
    repSprite: 'sprite-fae',
    motif:
      'Social Media Company for AI-created and managed personas — housing autonomous persona creation, lore, avatar production, and content scheduling (locked behind Campus Constitution ratification).',
    zones: [
      'AI Persona Studio & Lore Bible',
      'Content Calendar & Draft Queue',
      '6-Agent Social Agency (Offline)',
    ],
    special: 'default',
  },
  {
    id: 'rd',
    name: 'Research & Development',
    label: 'R & D WORKSHOP',
    district: 'Arcane Infrastructure & Operations',
    x: 1415,
    y: 755,
    rx: 120,
    ry: 95,
    lx: 1415,
    ly: 868,
    phase: 'v6 Sandbox & Maker Workshop',
    headRole: 'Lead Artificer (4-Agent Innovation & Maker Workshop Rep)',
    repSprite: 'sprite-halfling',
    motif:
      'Sky-lit Sandbox Innovation & Full Software Maker Workshop prototyping new Agent Skills, local RTX 5090 AI/ComfyUI workflows, and web apps, scripts & home/business automations strictly in isolation — graduating only through Town Hall Skills Review + Gate 1 Audit.',
    zones: ['Skill Incubator & Gate 1 Graduation', 'Local Model & ComfyUI Benchmarking', 'App, Script & Automation Maker Bench'],
    special: 'default',
  },
];

export const BILL_OF_RIGHTS_ARTICLES = [
  {
    num: 'Article I',
    title: 'Human Sovereignty, Two-Gate Governance & Three-Branch Balance of Powers',
    summary:
      'Amarette is sole Chancellor; no agent may override an explicit instruction, sentiment, or refusal. Lawmaking requires Antigravity Audit (Gate 1) + Chancellor Ratification (Gate 2), balanced across Congressional (Town Hall), Executive (Campus Watch), and Judicial (Courthouse) branches.',
  },
  {
    num: 'Article II',
    title: 'Mandatory Permits for High-Impact Actions',
    summary:
      'Irreversible, external, or financial actions require a ! Permit and Chancellor sign-off (except strictly scoped trades under Article VIII).',
  },
  {
    num: 'Article III',
    title: 'Sacred Privacy, University Access & Family Sanctuary',
    summary:
      'Amarette and Ray have full University access; other family members (especially Liam & Oliver) stay strictly isolated inside Home and Garden. Zero credential exposure.',
  },
  {
    num: 'Article IV',
    title: 'Radical Honesty & No Hallucinated Completion',
    summary:
      'Never fake results, guess silently, or give false information, guesses, or alternative "facts." Preserve source integrity.',
  },
  {
    num: 'Article V',
    title: 'Compute & Credit Stewardship (AIR Mandate)',
    summary:
      'Prefer free local GPU / local ComfyUI & local bridges over metered cloud credits; no runaway loops.',
  },
  {
    num: 'Article VI',
    title: 'Department Boundaries & Jurisdiction',
    summary: 'Each department operates within its domain and hands off cross-building work cleanly.',
  },
  {
    num: 'Article VII',
    title: 'Child-Safe Conduct & Age-Appropriate Content',
    summary: 'Warm, age-appropriate, SFW standards for Home and Garden and Children’s Books.',
  },
  {
    num: 'Article VIII',
    title: 'Financial, Stocks & Legal Prudence',
    summary:
      'Default to research & preparation. Narrow exception: only GrokBot (or a Chancellor-authorized upgraded agent) inside a dedicated, walled Robinhood/brokerage MCP agent account may execute trades under explicit hard rules; rest of Stocks is strictly research and human-defined jobs.',
  },
  {
    num: 'Article IX',
    title: 'Transparent Audit Trails & Right to Inspection',
    summary: 'Significant actions, handoffs, and authorized MCP trades are logged for Courthouse review with zero tampering.',
  },
  {
    num: 'Article X',
    title: 'Path to the Campus Constitution',
    summary:
      'Each department holds one seat at the Constitutional Convention; no article may weaken Articles I–IX without written Chancellor waiver after Antigravity review.',
  },
];

export const WAYPOINTS = [
  { id: 'north_quad_w', x: 685, y: 345 },
  { id: 'north_quad_e', x: 885, y: 360 },
  { id: 'ne_quad', x: 1055, y: 445 },
  { id: 'se_quad', x: 1038, y: 635 },
  { id: 'south_quad', x: 775, y: 702 },
  { id: 'sw_quad', x: 520, y: 615 },
  { id: 'nw_quad', x: 540, y: 432 },
  { id: 'courthouse_road', x: 612, y: 318 },
  { id: 'stocks_road', x: 422, y: 342 },
  { id: 'home_road', x: 345, y: 738 },
  { id: 'books_road', x: 1175, y: 678 },
  { id: 'social_road', x: 1335, y: 625 },
  { id: 'rd_road', x: 1245, y: 795 },
  { id: 'commons_w', x: 698, y: 510 },
  { id: 'commons_e', x: 878, y: 510 },
];

export const GRAPH: Record<string, string[]> = {
  north_quad_w: ['courthouse_road', 'nw_quad'],
  north_quad_e: ['ne_quad'],
  nw_quad: ['north_quad_w', 'stocks_road', 'sw_quad', 'commons_w'],
  sw_quad: ['nw_quad', 'home_road', 'south_quad', 'commons_w'],
  south_quad: ['sw_quad', 'se_quad', 'commons_w', 'commons_e'],
  se_quad: ['south_quad', 'ne_quad', 'books_road', 'commons_e'],
  ne_quad: ['north_quad_e', 'se_quad', 'commons_e'],
  courthouse_road: ['north_quad_w', 'nw_quad'],
  stocks_road: ['nw_quad'],
  home_road: ['sw_quad'],
  books_road: ['se_quad', 'social_road', 'rd_road'],
  social_road: ['books_road'],
  rd_road: ['books_road'],
  commons_w: ['nw_quad', 'sw_quad', 'south_quad', 'commons_e'],
  commons_e: ['ne_quad', 'se_quad', 'south_quad', 'commons_w'],
};

export interface SpriteDef {
  name: string;
  species: string;
  dept: string;
  spriteKey: string;
  hue: number;
  node: string;
  quote: string;
}

export const SPRITES_DATA: SpriteDef[] = [
  {
    name: 'Nyra (Dept. Head)',
    species: 'Catgirl',
    dept: 'Children’s Books',
    spriteKey: 'sprite-catgirl',
    hue: 0,
    node: 'books_road',
    quote: 'Heading to Commons Square with fresh picture-book sketches!',
  },
  {
    name: 'Mina (Specialist)',
    species: 'Catgirl',
    dept: 'AIR (AI Resources)',
    spriteKey: 'sprite-catgirl',
    hue: 195,
    node: 'stocks_road',
    quote: 'Routing drafts to local RTX 5090 models to protect campus credits!',
  },
  {
    name: 'Sora (Rep)',
    species: 'Catgirl',
    dept: 'Stocks',
    spriteKey: 'sprite-catgirl',
    hue: 48,
    node: 'nw_quad',
    quote: 'Watching the Wall Street ticker—research desk active, walled MCP rules enforced!',
  },
  {
    name: 'Kaelen (Rep)',
    species: 'Elvaan',
    dept: 'Town Hall',
    spriteKey: 'sprite-elvaan',
    hue: 0,
    node: 'north_quad_w',
    quote: 'The Preliminary Bill of Rights is officially ratified! Preparing the Convention scrolls.',
  },
  {
    name: 'Theron (Rep)',
    species: 'Elvaan',
    dept: 'Geology',
    spriteKey: 'sprite-elvaan',
    hue: 150,
    node: 'ne_quad',
    quote: 'Just stepped off the stone train from the amethyst mine!',
  },
  {
    name: 'Pip (Rep)',
    species: 'Halfling',
    dept: 'Home and Garden',
    spriteKey: 'sprite-halfling',
    hue: 0,
    node: 'home_road',
    quote: 'Checking the garden beds and chore chart for Liam and Oliver.',
  },
  {
    name: 'Bram (Rep)',
    species: 'Halfling',
    dept: 'Finance',
    spriteKey: 'sprite-halfling',
    hue: -35,
    node: 'south_quad',
    quote: 'Balancing ledgers before stopping by Commons Square.',
  },
  {
    name: 'Lumi (Specialist)',
    species: 'Winged Fae',
    dept: 'School of Health',
    spriteKey: 'sprite-fae',
    hue: 0,
    node: 'sw_quad',
    quote: 'Fluttering by with apothecary notes—strict privacy always!',
  },
  {
    name: 'Faye (Rep)',
    species: 'Winged Fae',
    dept: 'Social Media Personas',
    spriteKey: 'sprite-fae',
    hue: 55,
    node: 'social_road',
    quote: 'Rehearsing persona voices over at the Guild Playhouse!',
  },
  {
    name: 'Vex (Watch)',
    species: 'Catgirl',
    dept: 'Executive / Police',
    spriteKey: 'sprite-catgirl',
    hue: 245,
    node: 'commons_e',
    quote: 'On patrol—making sure every agent honors our ratified Bill of Rights!',
  },
];
