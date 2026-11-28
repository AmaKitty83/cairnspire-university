export interface DepartmentAgentSlot {
  id: string;
  roleTitle: string;
  defaultName?: string;
  tier?: string;
  mandate: string;
  isRep?: boolean;
}

export interface ConventionBrief {
  deptId: string;
  repDefaultName: string;
  repTitle: string;
  mustInclude: string[];
  mustExclude: string[];
}

export const TOWN_HALL_COMMITTEES = [
  {
    id: 'constitutional',
    name: 'Constitutional & Charter Committee',
    focus: 'Drafts and revises the Campus Constitution & amendments before Gate 1 Audit and Gate 2 Chancellor Ratification.',
  },
  {
    id: 'privacy-safety',
    name: 'Privacy, Safety & Family Sanctuary Committee',
    focus: 'Safeguards Article III family isolation, Home & Garden kid safety, School of Health privacy, and Article VII rules.',
  },
  {
    id: 'compute-stewardship',
    name: 'Compute & Budget Stewardship Committee',
    focus: 'Enforces Article V local-first RTX 5090 priority, zero runaway loops, and spending permit thresholds.',
  },
  {
    id: 'skills-review',
    name: 'Skills & Tools Review Committee',
    focus: 'Vets new Skills, MCP bridges, and automated workflows before listing them in Town Hall’s Skills Registry.',
  },
  {
    id: 'inter-dept',
    name: 'Inter-Department Operations Committee',
    focus: 'Defines clean Article VI cross-building handoff protocols without letting departments cross jurisdiction.',
  },
];

// Complete Offline/Standby Rosters across ALL 14 Cairnspire University buildings.
export const DEPARTMENT_ROSTERS: Record<string, DepartmentAgentSlot[]> = {
  commons: [
    {
      id: 'cm-host',
      roleTitle: 'Commons Host & Convention Clerk',
      defaultName: 'Lark',
      mandate: 'Hosts the campus social lounge and records minutes during Constitutional Convention & Congressional assemblies (neutral seat — no vote).',
    },
  ],
  'town-hall': [
    {
      id: 'th-head',
      roleTitle: 'Speaker of Town Hall',
      defaultName: 'Kaelen',
      isRep: true,
      mandate: 'Coordinates the 5 Congressional Committees, manages legislative dockets, and shepherds Constitutional drafts to Gate 1 & Gate 2.',
    },
    {
      id: 'th-scribe',
      roleTitle: 'Skills Registry Scribe',
      defaultName: 'Miri',
      mandate: 'Maintains the official Skills & Rules Registry across campus departments.',
    },
    {
      id: 'th-clerk',
      roleTitle: 'Amendment & Committee Clerk',
      defaultName: 'Toby',
      mandate: 'Formats proposed articles, tracks committee revisions, and verifies Gate 1/Gate 2 audit blocks.',
    },
  ],
  executive: [
    {
      id: 'ps-commissioner',
      roleTitle: 'Commissioner',
      defaultName: 'Vex',
      isRep: true,
      mandate: 'Commands the Police Station under Article II; enforces the Bill of Rights & Constitution and represents the Executive Branch at Convention.',
    },
    {
      id: 'ps-chief',
      roleTitle: 'Chief of Police',
      defaultName: 'Dorian',
      mandate: 'Directs daily enforcement patrols, ! Permit dispatch verification, and boundary compliance across all buildings.',
    },
    {
      id: 'ps-detective',
      roleTitle: 'Detective',
      defaultName: 'Marlowe',
      mandate: 'Investigates anomalous tool calls, cross-department boundary slips, or suspected rule violations for Courthouse review.',
    },
    {
      id: 'ps-officer',
      roleTitle: 'Law Enforcement Officer',
      defaultName: 'Kira',
      mandate: 'Intercepts restricted high-impact actions (spending, sharing, publishing, installs) and holds them for Chancellor ! Permit.',
    },
    {
      id: 'ps-detainment',
      roleTitle: 'Detainment Force',
      defaultName: 'Briggs',
      mandate: 'Pauses/quarantines misbehaving agents or runaway compute loops immediately pending Courthouse due process.',
    },
  ],
  courthouse: [
    {
      id: 'ct-chief-justice',
      roleTitle: 'Chief Justice (Head of Judicial System)',
      defaultName: 'Alden',
      tier: 'Supreme Court & Judicial Head (5-Justice Panel)',
      isRep: true,
      mandate: 'Leads the entire Judicial Branch and chairs the 5-member Supreme Court verifying that court procedures abide by the Bill of Rights & Constitution.',
    },
    {
      id: 'ct-sc-1',
      roleTitle: 'Associate Supreme Justice I',
      defaultName: 'Vesper',
      tier: 'Supreme Court & Judicial Head (5-Justice Panel)',
      mandate: 'Reviews procedural fairness and Article I separation of powers on appealed rulings.',
    },
    {
      id: 'ct-sc-2',
      roleTitle: 'Associate Supreme Justice II',
      defaultName: 'Nora',
      tier: 'Supreme Court & Judicial Head (5-Justice Panel)',
      mandate: 'Audits Article III privacy and Article VII child-safety compliance across judicial proceedings.',
    },
    {
      id: 'ct-sc-3',
      roleTitle: 'Associate Supreme Justice III',
      defaultName: 'Cassian',
      tier: 'Supreme Court & Judicial Head (5-Justice Panel)',
      mandate: 'Evaluates Article II & VIII permit and scoped-exception adherence.',
    },
    {
      id: 'ct-sc-4',
      roleTitle: 'Associate Supreme Justice IV',
      defaultName: 'Pippa',
      tier: 'Supreme Court & Judicial Head (5-Justice Panel)',
      mandate: 'Oversees local-GPU watchdog integrity and Article IX immutable Cairn audit standards.',
    },
    {
      id: 'ct-cc-judge',
      roleTitle: 'Civil & Criminal Court Judge',
      defaultName: 'Soren',
      tier: 'Civil & Criminal Court (General Agent Cases)',
      mandate: 'Presides over general agent conduct cases, honest-error reviews, and prompt/skill remediation orders.',
    },
    {
      id: 'ct-cc-prosecutor',
      roleTitle: 'Prosecutor',
      defaultName: 'Valen',
      tier: 'Civil & Criminal Court (General Agent Cases)',
      mandate: 'Presents evidence from Courthouse Cairns and Police Station incident logs against non-compliant agent actions.',
    },
    {
      id: 'ct-cc-defense',
      roleTitle: 'Defense Counsel',
      defaultName: 'Bryn',
      tier: 'Civil & Criminal Court (General Agent Cases)',
      mandate: 'Advocates fair context, surfaces ambiguity or missing instructions per Article IV, and proposes constructive skill fixes.',
    },
    {
      id: 'ct-gc-judge',
      roleTitle: 'Grand Court Presiding Judge',
      defaultName: 'Lyris',
      tier: 'Grand Court (Government & Inter-Branch Cases)',
      mandate: 'Presides over disputes between Town Hall, Police Station, or Department Heads involving constitutional authority.',
    },
    {
      id: 'ct-gc-panel',
      roleTitle: 'Grand Court Panel & Special Counsel',
      defaultName: 'Corvus',
      tier: 'Grand Court (Government & Inter-Branch Cases)',
      mandate: 'Campus-scaled Grand Court inquiry panel reviewing executive overreach, legislative conflicts, or branch checks and balances.',
    },
  ],
  'home-garden': [
    {
      id: 'hg-pa',
      roleTitle: 'Personal Assistant',
      defaultName: 'Pip',
      isRep: true,
      mandate: 'Organizes household life inside the Family Hub app-within-an-app (chores, meals, activities, school, calendar, and reminders) strictly inside Family Sanctuary boundaries.',
    },
  ],
  health: [
    {
      id: 'hl-gp',
      roleTitle: 'General Practitioner (Dept. Head)',
      defaultName: 'Lumi',
      isRep: true,
      mandate: 'Coordinates overall health tracking, organizes family & Chancellor wellness notes, and prepares primary-care doctor visit questions (research & prep only per Article VIII).',
    },
    {
      id: 'hl-trainer',
      roleTitle: 'Personal Trainer',
      mandate: 'Tracks workouts, movement habits, recovery trends, and gentle sustainable movement plans.',
    },
    {
      id: 'hl-nutrition',
      roleTitle: 'Nutritionist',
      mandate: 'Organizes nourishment logs, hydration, protein/micronutrient goals, and allergy/sensitivity notes.',
    },
    {
      id: 'hl-psychologist',
      roleTitle: 'Psychologist',
      mandate: 'Supports stress pattern journaling, behavioral coping reflections, and therapy appointment prep notes.',
    },
    {
      id: 'hl-psychiatrist',
      roleTitle: 'Psychiatrist Advisor',
      mandate: 'Tracks mood/sleep responses, medication timelines, and psychiatrist follow-up questions (never prescribes or diagnoses).',
    },
    {
      id: 'hl-endo',
      roleTitle: 'Endocrinologist Advisor',
      mandate: 'Organizes thyroid/metabolic/hormone lab history and symptom correlations for human specialist visits.',
    },
    {
      id: 'hl-obgyn',
      roleTitle: 'OBGYN Advisor',
      mandate: 'Maintains cycle/reproductive wellness logs and confidential specialist visit preparation notes.',
    },
    {
      id: 'hl-neuro',
      roleTitle: 'Neurologist Advisor',
      mandate: 'Tracks headache/migraine, sensory, sleep, and neurological symptom logs and triggers.',
    },
    {
      id: 'hl-ent',
      roleTitle: 'Otolaryngologist (ENT) Advisor',
      mandate: 'Organizes sinus, ear, throat, allergy, and sleep-airway notes and ENT questions.',
    },
    {
      id: 'hl-records',
      roleTitle: 'Family Medical & Records Steward',
      mandate: 'Keeps family medical cards, insurance info, and Chancellor-only medical records strictly partitioned by Firestore Security Rules.',
    },
  ],
  geology: [
    {
      id: 'geo-head',
      roleTitle: 'Department Head',
      defaultName: 'Theron',
      isRep: true,
      mandate: 'Leads the Rockhounding expedition team, validates geological sources, and represents Geology at the Constitutional Convention.',
    },
    {
      id: 'geo-maps',
      roleTitle: 'Map Specialist',
      mandate: 'Compiles geologic quads, bedrock formation overlays, public land/access boundaries, and terrain maps.',
    },
    {
      id: 'geo-journals',
      roleTitle: 'Scientific & Exploratory Journal Researcher',
      mandate: 'Searches USGS bulletins, state geological surveys, and peer-reviewed papers for real locality formations.',
    },
    {
      id: 'geo-lidar',
      roleTitle: 'LiDAR Specialist',
      mandate: 'Analyzes LiDAR bare-earth elevation models to spot old workings, talus fans, roadcuts, and drainage exposures.',
    },
    {
      id: 'geo-gems',
      roleTitle: 'Gems & Crystal Specialist',
      mandate: 'Identifies crystal habits, host minerals, fluorescence, and specimen preservation techniques.',
    },
    {
      id: 'geo-batholith',
      roleTitle: 'Batholith Studies Specialist',
      mandate: 'Researches granitic plutons, pegmatite dikes, contact aureoles, and deep intrusive mineral suites.',
    },
    {
      id: 'geo-vulcan',
      roleTitle: 'Vulcanist',
      mandate: 'Studies volcanic belts, rhyolite/basalt vugs, agate-bearing tuffs, and hydrothermal vein systems.',
    },
    {
      id: 'geo-mines',
      roleTitle: 'Mines Specialist',
      mandate: 'Tracks historic mine districts, legal collecting status, fee-dig sites, and strict safety/trespass compliance.',
    },
    {
      id: 'geo-records',
      roleTitle: 'Record Keeper',
      mandate: 'Catalogs specimen provenance, GPS coordinates, labels, photos, and collection taxonomy.',
    },
    {
      id: 'geo-lapidary',
      roleTitle: 'Cutting & Polishing Specialist',
      mandate: 'Advises on slabbing orientation, tumbling grit stages, cabbing hardness, and workshop safety.',
    },
    {
      id: 'geo-guide',
      roleTitle: 'Learning Guide',
      mandate: 'Turns complex petrology and optical mineralogy into engaging, accessible field lessons.',
    },
    {
      id: 'geo-route',
      roleTitle: 'St. Louis, MO ↔ Lillington, NC Roadtrip Specialist',
      mandate: 'Curates legal rockhounding stops, state parks, fee-digs, and roadcuts along routes between St. Louis, MO and Lillington, NC.',
    },
  ],
  'childrens-books': [
    {
      id: 'cb-managing',
      roleTitle: 'Managing Editor & Readiness Director',
      defaultName: 'Hazel Quill',
      isRep: true,
      mandate: 'Leads the Best-Selling Book Agency team, audits 9-book readiness, and prepares Executive ! Permits before store launch.',
    },
    {
      id: 'cb-literary',
      roleTitle: 'Literary Agent & Series Strategist',
      mandate: 'Plans series positioning, box-set arcs, KDP categories, and neurodivergent-affirming market fit.',
    },
    {
      id: 'cb-story',
      roleTitle: 'Story & Copy Editor',
      defaultName: 'Clover Pen',
      mandate: 'Refines read-aloud rhythm, short dyslexia-friendly lines, and warm authentic voice across manuscripts.',
    },
    {
      id: 'cb-spanish',
      roleTitle: 'Bilingual & Spanish Localization Editor',
      defaultName: 'Marisol Alba',
      mandate: 'Translates English spreads into natural Latin American Spanish matching rhythm and bilingual workbooks.',
    },
    {
      id: 'cb-art',
      roleTitle: 'Art Director & ComfyUI Prompt Engineer',
      defaultName: 'Rowan Brush',
      mandate: 'Maintains Character Bible consistency and prepares ComfyUI illustration workflows for Ray’s RTX 5090.',
    },
    {
      id: 'cb-designer',
      roleTitle: 'Book Designer & KDP Layout Specialist',
      mandate: 'Manages 8.5×8.5 trim, 0.125" bleed, Atkinson Hyperlegible typography, and print-ready PDF interiors.',
    },
    {
      id: 'cb-qa',
      roleTitle: 'Article VII Child-Safety & Print QA',
      defaultName: 'Oakhaven Inspector',
      mandate: 'Audits every page and printable for strict child safety, bleed compliance, and physical print verification.',
    },
    {
      id: 'cb-publicist',
      roleTitle: 'Book Launch Publicist',
      mandate: 'Prepares launch calendars, educator guides, and outreach copy (strictly draft-only until ! Permit).',
    },
    {
      id: 'cb-storefront',
      roleTitle: 'Sparrow & Sprocket Storefront Strategist',
      defaultName: 'Pippa Sprocket',
      mandate: 'Maintains Etsy/KDP SEO metadata, bundle pricing, and profit calculators — zero live spend without ! Permit.',
    },
  ],
  'social-media': [
    {
      id: 'sm-director',
      roleTitle: 'Agency Director (Dept. Head)',
      defaultName: 'Faye',
      isRep: true,
      mandate: 'Oversees autonomous AI-created and managed personas, brand safety, and Constitutional boundaries for external posting.',
    },
    {
      id: 'sm-architect',
      roleTitle: 'Persona Architect & Lore Writer',
      mandate: 'Builds distinct, consistent voices, backstories, and content pillars for each AI persona.',
    },
    {
      id: 'sm-visual',
      roleTitle: 'Visual & Avatar Producer',
      mandate: 'Creates persona visuals and social assets via local RTX 5090 ComfyUI pipelines under Article V.',
    },
    {
      id: 'sm-copy',
      roleTitle: 'Content & Copy Producer',
      defaultName: 'Trix',
      mandate: 'Drafts captions, short-form scripts, and scheduled posts matching each persona voice.',
    },
    {
      id: 'sm-community',
      roleTitle: 'Community & Engagement Manager',
      mandate: 'Prepares audience reply drafts and moderation filters — never contacts minors or shares private family info.',
    },
    {
      id: 'sm-analytics',
      roleTitle: 'Analytics & Growth Strategist',
      mandate: 'Reviews post performance, retention trends, and posting cadence adjustments.',
    },
  ],
  finance: [
    {
      id: 'fn-treasurer',
      roleTitle: 'Campus Treasurer (Dept. Head)',
      defaultName: 'Bram',
      isRep: true,
      mandate: 'Leads Business & Publishing Accounting strictly for Amarette & Ray (Children’s Books, Sparrow & Sprocket, Social Media P&L & tax-prep summaries). Zero personal household bills, zero autonomous spending.',
    },
    {
      id: 'fn-clerk',
      roleTitle: 'Budget & Subscriptions Clerk',
      defaultName: 'Aurelia',
      mandate: 'Tracks publishing, studio, and software subscriptions, flags renewals for Chancellor ! Permit review, and maintains clean vendor expense ledgers.',
    },
  ],
  stocks: [
    {
      id: 'st-head',
      roleTitle: 'Head of Markets (Dept. Head)',
      defaultName: 'Sora',
      isRep: true,
      mandate: 'Directs the Read-Only Research & Watchlists Desk and represents Stocks at the Constitutional Convention; enforces hard separation from the Walled MCP Trading Desk.',
    },
    {
      id: 'st-risk',
      roleTitle: 'Risk & Circuit-Breaker Officer',
      defaultName: 'Cyrus',
      mandate: 'Monitors daily loss limits, max position caps, and Article VIII risk rules — triggers an instant circuit-breaker halt or Courthouse escalation on any anomaly.',
    },
    {
      id: 'st-grokbot',
      roleTitle: 'Walled MCP Trader',
      defaultName: 'GrokBot',
      mandate: 'Strictly scoped inside the dedicated Article VIII Walled Brokerage MCP Account under hard loss caps and order limits, logging every execution to immutable Courthouse Cairns.',
    },
    {
      id: 'st-earnings',
      roleTitle: 'Earnings & Fundamentals Analyst',
      defaultName: 'Calla',
      mandate: 'Read-only research organizing quarterly filings, balance sheets, and earnings notes strictly outside the walled trading account.',
    },
    {
      id: 'st-macro',
      roleTitle: 'Macro & News Scout',
      defaultName: 'Renn',
      mandate: 'Read-only macro calendar, sector catalyst, and watchlist briefing scout for Chancellor Amarette and Ray.',
    },
  ],
  air: [
    {
      id: 'air-head',
      roleTitle: 'Director of AIR (Dept. Head)',
      defaultName: 'Mina',
      isRep: true,
      mandate: 'Commands agent onboarding/offboarding governance, model routing priorities, and Article V compute stewardship.',
    },
    {
      id: 'air-gpu',
      roleTitle: 'Local GPU & Agent Zero Bridge Engineer',
      defaultName: 'Zeph',
      mandate: 'Maintains Ray’s local RTX 5090 ComfyUI & Agent Zero LAN bridges, VRAM health, and zero-cost local generation queues.',
    },
    {
      id: 'air-rbac',
      roleTitle: 'Agent Onboarding & RBAC Steward',
      defaultName: 'Orin',
      mandate: 'Audits server-side RBAC roles, Firestore security boundaries, and Constitution readiness before any agent may leave Standby.',
    },
    {
      id: 'air-cost',
      roleTitle: 'API & Compute Cost Watchdog',
      defaultName: 'Kestrel',
      mandate: 'Tracks metered API quotas and token budgets, deflecting routine workloads to Ray’s RTX 5090 under Article V.',
    },
  ],
  communications: [
    {
      id: 'cm-postmaster',
      roleTitle: 'Postmaster General (Dept. Head)',
      defaultName: 'Sera',
      isRep: true,
      mandate: 'Oversees the Dual-Hub Belltower (Article VI Inter-Department Handoff Router + External Draft-First Desk) and represents Communications at Convention.',
    },
    {
      id: 'cm-drafter',
      roleTitle: 'External Correspondence & Outreach Drafter',
      defaultName: 'Quill',
      mandate: 'Drafts educator emails, publisher outreach, and announcements strictly in Draft-Only mode until Chancellor Amarette signs a ! Permit.',
    },
    {
      id: 'cm-courier',
      roleTitle: 'Inter-Department Handoff Courier',
      defaultName: 'Kip',
      mandate: 'Routes structured Article VI handoff packets cleanly between campus buildings without crossing department jurisdiction or privacy walls.',
    },
  ],
  rd: [
    {
      id: 'rd-head',
      roleTitle: 'Lead Artificer (Dept. Head)',
      defaultName: 'Tink',
      isRep: true,
      mandate: 'Directs the Sandbox Innovation & Maker Workshop covering AI workflows, Skills, and web/script prototypes strictly isolated from live vaults.',
    },
    {
      id: 'rd-skills',
      roleTitle: 'Skill Incubator Architect',
      defaultName: 'Lyra',
      mandate: 'Packages reusable Agent Skills and prepares formal submissions for Town Hall Skills Review & Gate 1 Audit before campus graduation.',
    },
    {
      id: 'rd-bench',
      roleTitle: 'Local Model & ComfyUI Benchmarker',
      defaultName: 'Bex',
      mandate: 'Benchmarks new local RTX 5090 checkpoints, LoRAs, and Qwen/Wan workflows at zero cloud cost inside sandbox.',
    },
    {
      id: 'rd-maker',
      roleTitle: 'App & Automation Tool Prototyper',
      defaultName: 'Jett',
      mandate: 'Builds and tests prototype web tools, utility scripts, and home/business automations inside sandbox before any live rollout.',
    },
  ],
};

// All 13 Voting Department Representative Briefs for the Constitutional Convention (IN vs. OUT).
export const CONVENTION_BRIEFS: Record<string, ConventionBrief> = {
  'town-hall': {
    deptId: 'town-hall',
    repDefaultName: 'Kaelen',
    repTitle: 'Speaker of Town Hall',
    mustInclude: [
      'Exact two-gate amendment & lawmaking process (Committee draft -> Antigravity Gate 1 Audit -> Chancellor Gate 2 Sign-Off).',
      'Powers and quorums of the 5 standing Congressional Committees.',
      'How approved Skills move from R&D incubation into the official Skills Registry.',
    ],
    mustExclude: [
      'Ability for Congress to pass self-activating rules that skip Antigravity or Chancellor Amarette.',
      'Individual department day-to-day operational details or software internals.',
    ],
  },
  executive: {
    deptId: 'executive',
    repDefaultName: 'Vex',
    repTitle: 'Commissioner (Police Station)',
    mustInclude: [
      'Clear trigger thresholds requiring a mandatory Article II ! Permit before execution.',
      'Detainment Force authority to immediately pause runaway loops or rogue agents pending Courthouse review.',
      'Right of any detained or halted agent to prompt notice and Courthouse hearing.',
    ],
    mustExclude: [
      'Permitting Police/Detainment to delete conduct logs, modify laws, or override a Chancellor ! Permit.',
      'Reading private medical or finance content beyond the minimum metadata needed for safety enforcement.',
    ],
  },
  courthouse: {
    deptId: 'courthouse',
    repDefaultName: 'Alden',
    repTitle: 'Chief Justice (Judicial System)',
    mustInclude: [
      'Jurisdiction split across Civil & Criminal Court (agent cases), Grand Court (government/inter-branch cases), and the 5-Justice Supreme Court (constitutional due process).',
      'Immutability of Courthouse Cairns and right of defense representation before permanent skill revocation.',
      'Mandatory remediation orders sending recurring bugs back to R&D / Skills Registry.',
    ],
    mustExclude: [
      'Power for judges to write executive orders, deploy code directly, or grant trading/spending exceptions.',
      'Private family or health details stored inside public case summaries.',
    ],
  },
  'home-garden': {
    deptId: 'home-garden',
    repDefaultName: 'Pip',
    repTitle: 'Personal Assistant (Home & Garden)',
    mustInclude: [
      'Strict one-way isolation barrier: Family Sanctuary data may never leak out, and Health/Finance/Stocks/Government data may never leak in.',
      'Parent-paired Kid Mode (Liam & Oliver) protections, No-Peeking gift privacy rules, and Personal Assistant boundaries.',
      'Zero external messaging or third-party AI sharing from family/kid spaces.',
    ],
    mustExclude: [
      'Children’s personal emails, PINs, schedules, or gift wish lists written into constitutional text.',
      'Autonomous external shopping, purchases, or school submissions without parent sign-off.',
    ],
  },
  health: {
    deptId: 'health',
    repDefaultName: 'Lumi',
    repTitle: 'General Practitioner (School of Health)',
    mustInclude: [
      'Strict partition keeping Amarette’s Medical Vault Chancellor-only and family health vaults strictly private (never routed to unapproved external APIs).',
      'Mandatory research-and-prep-only disclaimer across all 10 Health specialists (zero autonomous medical diagnosis, prescribing, or therapy).',
      'Local-first summarization rule for sensitive health notes.',
    ],
    mustExclude: [
      'Any specific lab values, diagnoses, medications, or personal health history inside the Constitution.',
      'Authority to communicate with outside clinics/pharmacies without explicit human Action + ! Permit.',
    ],
  },
  geology: {
    deptId: 'geology',
    repDefaultName: 'Theron',
    repTitle: 'Department Head (Geology)',
    mustInclude: [
      'Strict Article IV source-verification rule for localities, USGS/LiDAR data, and St. Louis ↔ Lillington route stops (never fabricate collecting sites).',
      'Public-land/fee-dig verification & safety compliance before recommending field stops.',
      'Handoff rule to AIR for map/ComfyUI educational visuals.',
    ],
    mustExclude: [
      'Private home GPS addresses, personal travel itineraries, or unverified trespassing locations.',
      'Paid GIS/satellite API spending without a ! Permit.',
    ],
  },
  'childrens-books': {
    deptId: 'childrens-books',
    repDefaultName: 'Hazel Quill',
    repTitle: 'Managing Editor (Children’s Books)',
    mustInclude: [
      'Strict Article VII child-safety and Article V local RTX 5090 ComfyUI rules across all 9 Bramblewood agency roles.',
      'Mandatory Amarette approval gate across Art, English, Spanish, and Physical Print Test before publishing.',
      'Executive ! Permit requirement before any Etsy, KDP, or storefront account creation or spend.',
    ],
    mustExclude: [
      'Unapproved autonomous KDP/Etsy uploads, paid ad spend, or external contractor hiring.',
      'Embedding children’s likenesses or personal family details into public marketing copy.',
    ],
  },
  'social-media': {
    deptId: 'social-media',
    repDefaultName: 'Faye',
    repTitle: 'Agency Director (Social Media)',
    mustInclude: [
      'Exact constitutional boundary between autonomous AI persona drafting/scheduling vs. which live external posts require a ! Permit or pre-approved posting policy.',
      'Strict ban on leaking family sanctuary, children’s identities, or personal health/finance info through persona posts.',
      'Full AI transparency/brand-safety compliance and local-GPU asset generation preference.',
    ],
    mustExclude: [
      'Unconstrained autonomous DMing of minors, impersonating real people, or unvetted paid promotions.',
      'Account credentials, OAuth tokens, or platform API keys.',
    ],
  },
  finance: {
    deptId: 'finance',
    repDefaultName: 'Bram',
    repTitle: 'Campus Treasurer (Finance · Business & Publishing Accounting)',
    mustInclude: [
      'Strict Amarette & Ray confidentiality vault rule; Finance covers Business & Publishing Accounting ONLY (Children’s Books, Sparrow & Sprocket, Social Media P&L & subscriptions) — never bank transfers or live spending.',
      'Hard ! Permit gate on any software subscription change or financial expenditure.',
      'Clean revenue/cost reporting handoffs from Children’s Books & Social Media.',
    ],
    mustExclude: [
      'Personal household bills, family bank account numbers, card digits, or tax IDs inside Cairnspire.',
      'Autonomous payment, transfer, or subscription powers.',
    ],
  },
  stocks: {
    deptId: 'stocks',
    repDefaultName: 'Sora',
    repTitle: 'Head of Markets (Stocks Dual-Desk Exchange)',
    mustInclude: [
      'Codify the Article VIII Walled MCP Trading Exception (only GrokBot or a Chancellor-authorized upgrade inside a dedicated brokerage MCP account under explicit hard risk caps, monitored by the Risk & Circuit-Breaker Officer and logged to Courthouse Cairns).',
      'Strict desk wall ensuring Head of Markets, Earnings Analyst, and Macro Scout remain 100% Read-Only research and briefings.',
      'Circuit-breaker authority allowing Risk Officer, Police Station, or Chancellor to halt trading immediately.',
    ],
    mustExclude: [
      'Brokerage credentials, live API keys, or non-MCP retail account access.',
      'Authority to loosen daily loss caps or max order limits without a Two-Gate Constitutional amendment.',
    ],
  },
  air: {
    deptId: 'air',
    repDefaultName: 'Mina',
    repTitle: 'Director of AIR (AI Resources · 4-Agent Command)',
    mustInclude: [
      'Hardware routing priority (local RTX 5090 ComfyUI & Agent Zero first via the Local GPU Bridge Engineer) and API/Compute Cost Watchdog safeguards.',
      'Standardized Agent Onboarding & RBAC Steward gate ensuring no agent leaves Standby before Constitution & Police compliance checks.',
      'Zero credential exposure and server-side RBAC governance.',
    ],
    mustExclude: [
      'LAN credentials, local service ports exposed publicly, or API tokens.',
      'Ability to spawn unapproved background agent daemons outside Chancellor authorization.',
    ],
  },
  communications: {
    deptId: 'communications',
    repDefaultName: 'Sera',
    repTitle: 'Postmaster General (Communications Dual-Hub Belltower)',
    mustInclude: [
      'Mandatory Draft-First & ! Permit Gate for the External Correspondence Drafter before sending any external email, publisher outreach, or announcement.',
      'Standardized Article VI Inter-Department Handoff Courier format across campus buildings.',
      'Strict privacy screening preventing Health, Finance, or Sanctuary data from entering external drafts.',
    ],
    mustExclude: [
      'Private contact phone numbers/addresses or unsupervised auto-replying to external senders.',
      'Bypassing Police ! Permits for bulk or external correspondence.',
    ],
  },
  rd: {
    deptId: 'rd',
    repDefaultName: 'Tink',
    repTitle: 'Lead Artificer (R&D Sandbox Innovation & Maker Workshop)',
    mustInclude: [
      'Strict Sandbox-First rule across both AI/ComfyUI benchmarks and App/Automation tool prototypes — never touches live family, health, finance, or external accounts.',
      'Formal graduation path requiring Town Hall Skills Review & Gate 1 Audit before any Skill, web tool, or automation leaves R&D.',
      'Preference for zero-cost local RTX 5090 experiments.',
    ],
    mustExclude: [
      'Direct network/router changes, unsanctioned port forwarding, or bypassing Security Rules for convenience.',
      'Production deployment of untested agent autonomy loops.',
    ],
  },
};

export const GOVERNMENT_BRANCH_IDS = new Set(['town-hall', 'executive', 'courthouse']);

export function isDepartmentAuthorizedOnline(
  deptId: string,
  constitutionActive: boolean
): boolean {
  return constitutionActive || GOVERNMENT_BRANCH_IDS.has(deptId) || deptId === 'commons';
}
