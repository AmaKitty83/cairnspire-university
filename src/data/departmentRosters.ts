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

// Detailed Offline/Standby Rosters ONLY for the 9 buildings Amarette worked on.
// Finance, Stocks, AIR, Communications, and R&D rosters remain intentionally blank until Amarette defines them.
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
      mandate: 'Investigates anomalous tool calls, cross-department boundary slips, or suspected rule violations for Courthouse review.',
    },
    {
      id: 'ps-officer',
      roleTitle: 'Law Enforcement Officer',
      mandate: 'Intercepts restricted high-impact actions (spending, sharing, publishing, installs) and holds them for Chancellor ! Permit.',
    },
    {
      id: 'ps-detainment',
      roleTitle: 'Detainment Force',
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
      tier: 'Supreme Court & Judicial Head (5-Justice Panel)',
      mandate: 'Reviews procedural fairness and Article I separation of powers on appealed rulings.',
    },
    {
      id: 'ct-sc-2',
      roleTitle: 'Associate Supreme Justice II',
      tier: 'Supreme Court & Judicial Head (5-Justice Panel)',
      mandate: 'Audits Article III privacy and Article VII child-safety compliance across judicial proceedings.',
    },
    {
      id: 'ct-sc-3',
      roleTitle: 'Associate Supreme Justice III',
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
      tier: 'Civil & Criminal Court (General Agent Cases)',
      mandate: 'Presides over general agent conduct cases, honest-error reviews, and prompt/skill remediation orders.',
    },
    {
      id: 'ct-cc-prosecutor',
      roleTitle: 'Prosecutor',
      tier: 'Civil & Criminal Court (General Agent Cases)',
      mandate: 'Presents evidence from Courthouse Cairns and Police Station incident logs against non-compliant agent actions.',
    },
    {
      id: 'ct-cc-defense',
      roleTitle: 'Defense Counsel',
      tier: 'Civil & Criminal Court (General Agent Cases)',
      mandate: 'Advocates fair context, surfaces ambiguity or missing instructions per Article IV, and proposes constructive skill fixes.',
    },
    {
      id: 'ct-gc-judge',
      roleTitle: 'Grand Court Presiding Judge',
      tier: 'Grand Court (Government & Inter-Branch Cases)',
      mandate: 'Presides over disputes between Town Hall, Police Station, or Department Heads involving constitutional authority.',
    },
    {
      id: 'ct-gc-panel',
      roleTitle: 'Grand Court Panel & Special Counsel',
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
    repDefaultName: 'Treasury Rep',
    repTitle: 'Finance Department Representative',
    mustInclude: [
      'Strict Amarette & Ray confidentiality vault rule; Finance agents prepare budgets/forecasts but never execute bank transfers or subscriptions.',
      'Hard ! Permit gate on any financial expenditure or recurring billing change.',
      'Clean accounting handoffs from Children’s Books & Social Media revenue tracking.',
    ],
    mustExclude: [
      'Bank account numbers, card digits, exact balances, or tax IDs.',
      'Autonomous payment, transfer, or subscription powers.',
    ],
  },
  stocks: {
    deptId: 'stocks',
    repDefaultName: 'Markets Rep',
    repTitle: 'Stocks Department Representative',
    mustInclude: [
      'Codify the Article VIII Walled MCP Trading Exception (only GrokBot or a Chancellor-authorized upgraded agent inside a dedicated brokerage MCP account under explicit hard risk rules, with Courthouse Cairn logging).',
      'Strict separation ensuring all non-exception Stocks agents remain research-and-briefing only.',
      'Circuit-breaker authority allowing Police Station / Chancellor to halt trading immediately.',
    ],
    mustExclude: [
      'Brokerage credentials, live API keys, or non-MCP retail account access.',
      'Authority to loosen daily loss caps or max order limits without a Two-Gate Constitutional amendment.',
    ],
  },
  air: {
    deptId: 'air',
    repDefaultName: 'AIR Rep',
    repTitle: 'AIR (AI Resources) Representative',
    mustInclude: [
      'Hardware routing priority (local RTX 5090 ComfyUI & Agent Zero first) and VRAM health/rate-limit safeguards.',
      'Standardized agent onboarding/offboarding gate ensuring no agent comes online before Constitution & Police compliance checks.',
      'Zero credential exposure and server-side RBAC governance.',
    ],
    mustExclude: [
      'LAN credentials, local service ports exposed publicly, or API tokens.',
      'Ability to spawn unapproved background agent daemons outside Chancellor authorization.',
    ],
  },
  communications: {
    deptId: 'communications',
    repDefaultName: 'Communications Rep',
    repTitle: 'Communications Department Representative',
    mustInclude: [
      'Mandatory Draft-First & ! Permit Gate before sending any external email, SMS, or announcement.',
      'Standardized Article VI inter-department handoff message format.',
      'Strict privacy screening preventing Health, Finance, or Sanctuary data from entering external drafts.',
    ],
    mustExclude: [
      'Private contact phone numbers/addresses or unsupervised auto-replying to external senders.',
      'Bypassing Police ! Permits for bulk or external correspondence.',
    ],
  },
  rd: {
    deptId: 'rd',
    repDefaultName: 'R&D Rep',
    repTitle: 'Research & Development Representative',
    mustInclude: [
      'Sandbox-first rule: experimental prototypes and local model benchmarks never touch live family/health/finance vaults or external accounts.',
      'Pathway requiring Town Hall Skills Review & Gate 1 Audit before graduating a prototype Skill to production.',
      'Preference for zero-cost local GPU experiments.',
    ],
    mustExclude: [
      'Direct network/router changes, unsanctioned port forwarding, or bypassing Security Rules for convenience.',
      'Production deployment of untested agent autonomy loops.',
    ],
  },
};
