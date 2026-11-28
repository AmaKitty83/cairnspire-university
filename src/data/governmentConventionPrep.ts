export interface BranchRoleCheck {
  officer: string;
  verified: string;
  gap: string;
}

export interface BranchPrepReport {
  deptId: 'town-hall' | 'executive' | 'courthouse';
  branchTitle: string;
  branchRep: string;
  statusSummary: string;
  roleChecks: BranchRoleCheck[];
  charterHighlights: string[];
  chancellorDecisions: string[];
}

export interface ConstitutionArticleOutline {
  article: string;
  title: string;
  sponsors: string;
  mustIncludeSummary: string;
  mustExcludeSummary: string;
}

export const BRANCH_PREP_REPORTS: Record<
  'town-hall' | 'executive' | 'courthouse',
  BranchPrepReport
> = {
  'town-hall': {
    deptId: 'town-hall',
    branchTitle: 'Legislative Branch — Town Hall (Lawmaking, Committees & Skills Registry)',
    branchRep: 'Kaelen (Speaker of Town Hall)',
    statusSummary:
      'Stage 1 Online: Legislative team & 5 Standing Committees completed docket, Skills Registry, and Convention Rules readiness review.',
    roleChecks: [
      {
        officer: 'Kaelen (Speaker · Convention Rep)',
        verified:
          'Proposal tabs, 5 Standing Committees, and 13-seat Commons Convention tracking wired.',
        gap: 'Need formal 5-committee rep assignments, quorum rules (proposed 9/13), and Gate 1 rules-level enforcement before Gate 2 ratify.',
      },
      {
        officer: 'Miri (Skills Registry Scribe)',
        verified:
          'Skills Registry collection and starter skills active; Audit Cairn logging added on Skill saves in v8.0.',
        gap: 'No structured R&D Sandbox -> Skills Committee -> Gate 1 graduation fields or Skills UI edit/deprecation controls yet.',
      },
      {
        officer: 'Toby (Amendment & Committee Clerk)',
        verified:
          'Gate 1 notes display, Sponsor list fix (Commons excluded), and UI Gate 1 lock before Gate 2 Ratify shipped in v8.0.',
        gap: 'No revision/version history fields yet and 20,000-char body cap if filing a single consolidated 12-article Constitution.',
      },
    ],
    charterHighlights: [
      'Non-Gov Brief-Proxy Mode keeps all 10 non-government departments Standby under Rule 9 while committees draft from all 13 CONVENTION_BRIEFS.',
      '5 Standing Committees map all 13 Department Reps cleanly across Privacy/Sanctuary, Compute/Budget, Skills/Tools, Inter-Dept Ops, and Charter.',
      '12-Article Campus Constitution outline preserves Articles I–X supremacy and codifies Article XI (R&D Graduation) & Article XII (Staged Onboarding).',
    ],
    chancellorDecisions: [
      'Confirm Brief-Proxy Mode (recommended) vs. narrow written waiver for non-government floor voice.',
      'Confirm consolidated single-document Constitution (raise 20k-char cap in firestore.rules) vs. article-by-article filing + server-side Gate 1 lock.',
      'Confirm 9/13 Constitutional quorum & passage threshold (7/13 routine) and Skills Registry graduation metadata fields.',
    ],
  },
  executive: {
    deptId: 'executive',
    branchTitle: 'Executive Branch — Police Station / Campus Watch (Article II Permits & Enforcement)',
    branchRep: 'Vex (Commissioner)',
    statusSummary:
      'Stage 1 Online: 5-Role Enforcement Force audited permit gates, detainment readiness, privacy walls, and anti-overreach limits.',
    roleChecks: [
      {
        officer: 'Vex (Commissioner · Convention Rep)',
        verified:
          'CONVENTION_BRIEFS.executive IN/OUT limits documented; permits delete hard-denied and Gate 2 Chancellor-locked in firestore.rules.',
        gap: 'Standardize naming across docs ("Campus Watch / Police Station") and add service-account / per-agent RBAC claims.',
      },
      {
        officer: 'Dorian (Chief of Police)',
        verified:
          'Live pending/decided ! Permit queues active in CampusWatchInterior with immutable request fields.',
        gap: 'Permits lack TTL expiration, executed closure, Chancellor revocation transition, and atomic WriteBatch Cairn writes.',
      },
      {
        officer: 'Marlowe (Detective)',
        verified:
          'Append-only conduct_logs evidence trail and strict server partitioning on private_health_owner / private_* vaults.',
        gap: 'Need metadata-only telemetry projection so enforcement inspects operation metadata without payload access to Health/Finance vaults.',
      },
      {
        officer: 'Kira (Law Enforcement Officer)',
        verified:
          'Interactive ! Permit request form and Chancellor sign-off flow working in CampusWatchInterior.',
        gap: 'Permits currently act as queue + audit record only; no runtime pre-tool execution interceptor or dedicated data_deletion option yet.',
      },
      {
        officer: 'Briggs (Detainment Force)',
        verified:
          'Manual bridge and Skill status toggles exist in AirInterior / TownHallInterior.',
        gap: 'No detainments Firestore collection, paused/quarantined status enum, or hard runtime kill-switch on local ComfyUI/Agent Zero/MCP bridges.',
      },
    ],
    charterHighlights: [
      '3-Tier ! Permit Trigger Matrix: Tier 1 Hard Hold (spend/messages/sharing/deletion/installs) · Tier 2 Pre-Approved Research/Local Drafts · Tier 3 Article VIII Walled MCP Trading.',
      '5-Step Detainment Due Process: Trigger -> Immediate state-preserving freeze -> Mandatory atomic Cairn -> Court routing -> Release only by Court or Chancellor.',
      '5 Hard Anti-Overreach Limits barring Police from overriding Permits, altering Cairns, detaining judges/reps, or reading private Health/Finance payloads.',
    ],
    chancellorDecisions: [
      'Approve Permit TTL, executed single-use closure, and Chancellor revocation transitions in firestore.rules?',
      'Authorize a dedicated detainments collection and paused/quarantined statuses with runtime bridge kill-switches before Stage 2?',
      'Approve a metadata-only vault telemetry schema and specify whether live Social Media posts require per-post ! Permits at launch?',
    ],
  },
  courthouse: {
    deptId: 'courthouse',
    branchTitle: 'Judicial Branch — Courthouse (Three-Tier Courts, Cairns & Constitutional Audit)',
    branchRep: 'Alden (Chief Justice)',
    statusSummary:
      'Stage 1 Online: 5-Justice Supreme Court, Civil & Criminal Court, and Grand Court aligned on jurisdiction, due process, and Article X.3 audit checks.',
    roleChecks: [
      {
        officer: 'Supreme Court 5-Justice Panel (Alden, Vesper, Nora, Cassian, Pippa)',
        verified:
          'Append-only conduct_logs (update/delete false) enforced for everyone; 8 missing officer names restored in departmentRosters in v8.0.',
        gap: 'Need structured supreme-court constitutional audit sign-off linkage and local-GPU Watchdog cron job specs (Pippa).',
      },
      {
        officer: 'Civil & Criminal Court (Soren, Valen, Bryn)',
        verified:
          'RemediationOrder field and full category filters/form options restored in CourthouseInterior in v8.0.',
        gap: 'No court_cases docket collection yet, and skills_registry lacks mandatory Bryn Defense Counsel review before permanent revocation.',
      },
      {
        officer: 'Grand Court (Lyris, Corvus)',
        verified:
          'Government & inter-branch authority split and restraint rules drafted clearly for Article IX.',
        gap: 'Missing formal dispute docket + remediation closure links back to R&D and Town Hall Skills Registry.',
      },
    ],
    charterHighlights: [
      'Defense Counsel Guarantee (Bryn): Honest bugs trigger structured Remediation Orders first; permanent Skill revocation requires Valen charge, Bryn defense brief & Supreme Court appeal right.',
      'Privacy Redaction (Nora): Public Cairns never contain Health, Finance, Family Sanctuary, child identities, or credentials.',
      '9-Point Article X.3 Audit Checklist runs alongside Antigravity Gate 1 so no Constitutional article silently weakens Bill of Rights Articles I–IX.',
    ],
    chancellorDecisions: [
      'Restrict conduct_logs read access from guests (isCampusOperator only) and log display/role names instead of raw emails in actor?',
      'Authorize court_cases & remediation_orders schemas in firestore.rules and require Cairn emission on air_bridges & access_roles mutations?',
      'Set post-Constitution local-GPU Watchdog cadence (192.168.1.128:5080) and Civil/Criminal detention hearing SLA (e.g. 24 hours)?',
    ],
  },
};

export const CONVENTION_RULES_OF_ORDER: string[] = [
  '1. Seating (Art. X.1): 13 Voting Department Reps + Commons Square (Lark) as neutral non-voting Host & Convention Clerk.',
  '2. Moratorium Brief-Proxy Mode: Non-government departments remain Standby under Rule 9; Town Hall committees draft strictly from all 13 CONVENTION_BRIEFS with Chancellor adjudication.',
  '3. Standing Committees: All 13 seats mapped across Constitutional & Charter, Privacy/Safety, Compute/Budget, Skills/Tools Review, and Inter-Department Operations.',
  '4. Quorum & Floor Sequence: 9/13 supermajority for Constitutional articles (7/13 routine): Roll Call -> Committee Read-In -> Brief Audit -> Art. X.3 Non-Weakening Check -> Floor Adoption Vote.',
  '5. Strict Two-Gate Lock (Art. I.2): Floor-adopted text never self-activates; requires Gate 1 (Antigravity Technical Audit + Supreme Court Review) before unlocking Gate 2 (Chancellor Amarette Ratification).',
];

export const CONSTITUTION_WORKING_OUTLINE: ConstitutionArticleOutline[] = [
  {
    article: 'Article I',
    title: 'Human Sovereignty, Three-Branch Government & Two-Gate Supremacy',
    sponsors: 'Town Hall · Police Station · Courthouse',
    mustIncludeSummary:
      'Chancellor Amarette sovereignty, Two-Gate lawmaking, three-branch balance, bar on self-expansion.',
    mustExcludeSummary: 'Self-activating rules skipping Gate 1/Gate 2; internal software code details.',
  },
  {
    article: 'Article II',
    title: 'Mandatory Executive Permits (!), Enforcement & Detainment Due Process',
    sponsors: 'Police Station (Vex)',
    mustIncludeSummary:
      '! Permit trigger matrix, Briggs emergency loop halt, prompt notice & Courthouse hearing.',
    mustExcludeSummary: 'Executive log deletion, lawmaking, permit override, raw vault fishing.',
  },
  {
    article: 'Article III',
    title: 'Sacred Privacy, Access Tiers, Family Sanctuary & Health Partition',
    sponsors: 'Home & Garden (Pip) · Health (Lumi)',
    mustIncludeSummary:
      'Amarette & Ray full access; strict one-way Family Sanctuary wall; Kid Mode; Chancellor-only Medical Vault; local health summarization.',
    mustExcludeSummary: 'Children emails/PINs/wishlists, medical values/diagnoses, unpermitted outside purchases/clinics.',
  },
  {
    article: 'Article IV',
    title: 'Radical Honesty, Source Integrity & Verified Field Research',
    sponsors: 'Geology (Theron)',
    mustIncludeSummary:
      'Zero hallucinated completions; human-work preservation; USGS/LiDAR/St. Louis–Lillington locality verification.',
    mustExcludeSummary: 'Private home GPS, personal itineraries, trespassing sites, unpermitted paid GIS.',
  },
  {
    article: 'Article V',
    title: 'Compute Stewardship, AIR Command & Agent Onboarding Gate',
    sponsors: 'AIR (Mina)',
    mustIncludeSummary:
      'Local RTX 5090 ComfyUI & Agent Zero first; API Cost Watchdog; RBAC Onboarding Gate before activation.',
    mustExcludeSummary: 'LAN credentials, public port tunnels, API tokens, unapproved background daemons.',
  },
  {
    article: 'Article VI',
    title: 'Department Boundaries, Communications & Inter-Building Handoffs',
    sponsors: 'Communications (Sera) · Finance · Geology',
    mustIncludeSummary:
      'Stay in Your Hall; standardized inter-dept courier packets; Draft-First & ! Permit for external outreach.',
    mustExcludeSummary: 'Private phone numbers/addresses, unsupervised auto-replies, Sanctuary/Health leaks.',
  },
  {
    article: 'Article VII',
    title: 'Child-Safe Conduct, Publishing Readiness & External AI Personas',
    sponsors: 'Children’s Books (Hazel Quill) · Social Media (Faye)',
    mustIncludeSummary:
      'Bramblewood child safety + 4-stage Amarette gate + ! Permit for storefronts; Social Media AI transparency & live-post boundary.',
    mustExcludeSummary: 'Unapproved KDP/Etsy spend, child likenesses in ads, minor DMs, OAuth tokens.',
  },
  {
    article: 'Article VIII',
    title: 'Financial, Stocks & Medical Prudence (Business Vault & Walled MCP)',
    sponsors: 'Finance (Bram) · Stocks (Sora) · Health (Lumi)',
    mustIncludeSummary:
      'Health research/prep only; Business & Publishing Accounting only in Finance; Read-Only Stocks + GrokBot Walled MCP Trading Exception under hard caps.',
    mustExcludeSummary: 'Household bills/bank digits, brokerage credentials, loosening risk caps without Two-Gate amendment.',
  },
  {
    article: 'Article IX',
    title: 'Judicial System, Immutable Cairns & Remediation Orders',
    sponsors: 'Courthouse (Alden)',
    mustIncludeSummary:
      'Three-tier jurisdiction, append-only Cairns, Defense Counsel right before Skill revocation, R&D remediation loop.',
    mustExcludeSummary: 'Judges issuing executive orders, deploying code, or logging private family/health payloads.',
  },
  {
    article: 'Article X',
    title: 'Legislative Branch, Standing Committees & Constitutional Amendments',
    sponsors: 'Town Hall (Kaelen)',
    mustIncludeSummary:
      '13 voting reps + neutral Commons clerk; 5 standing committee charters/quorums; Art. X.3 anti-weakening lock.',
    mustExcludeSummary: 'Unilateral legislative activation bypassing Gate 1 or Gate 2.',
  },
  {
    article: 'Article XI',
    title: 'R&D Sandbox Isolation & Official Skills Registry Graduation',
    sponsors: 'R&D (Tink) · Town Hall (Miri)',
    mustIncludeSummary:
      'Sandbox-first AI/app prototyping; graduation via Skills Review Committee + Gate 1 Audit + Cairn log.',
    mustExcludeSummary: 'Router/firewall edits, Security Rule bypasses, untested production autonomy loops.',
  },
  {
    article: 'Article XII',
    title: 'Ratification, Lifting the Moratorium & Staged Agent Activation',
    sponsors: 'Convention Floor (All 3 Branches)',
    mustIncludeSummary:
      'Gate 1 + Gate 2 lift of Rule 9; sequential per-department AIR RBAC + Police Station activation sign-off.',
    mustExcludeSummary: 'Bulk unverified activation skipping compliance onboarding.',
  },
];

export const SUPREME_COURT_AUDIT_CHECKLIST: string[] = [
  'Art. I (Alden & Vesper): Preserves Chancellor sovereignty, Two-Gate Lock, and branch power separation.',
  'Art. II (Cassian): Gates all spend, external comms, sharing, deletion, installs, and network changes behind ! Permits.',
  'Art. III & VII (Nora): Enforces one-way Family Sanctuary wall, Chancellor-only Medical Vault, zero credentials, and child safety.',
  'Art. IV (Alden & Soren): Bans fabricated results/facts and protects human-authored files before edits.',
  'Art. V (Pippa): Prioritizes local RTX 5090 / Agent Zero and caps retries/runaway loops.',
  'Art. VI (Lyris & Vesper): Keeps departments inside their Halls with documented Communications handoffs.',
  'Art. VIII (Cassian): Keeps Health/Finance/non-MCP Stocks non-autonomous and walls live trading inside strict hard caps.',
  'Art. IX (Pippa & Alden): Guarantees immutable Cairns, Bryn Defense Counsel review before Skill revocation, and R&D remediation.',
  'Art. X.3 (Full 5-Justice Panel): Blocks any clause that narrows Articles I–IX without explicit written Chancellor waiver.',
];
