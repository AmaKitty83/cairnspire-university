# Cairnspire University — Stage 1 Government Activation & Constitutional Convention Prep Dossier

> **Stage:** `STAGE 1 ACTIVE (GOVERNMENT CONVENTION PREP)` · Authorized by **Chancellor Amarette** on **2026-11-27**  
> **Online Branches (18 Agents):** **Town Hall** (Legislative · 3), **Police Station / Campus Watch** (Executive · 5), **Courthouse** (Judicial · 10)  
> **Remaining Standby (11 Buildings):** Commons Square *(neutral host/assembly plaza)* plus all 10 non-government departments remain **Paused · Pending Constitution** under `GEMINI.md` Rule 9.  
> **Integrity Pledge (Article IV & III):** Every finding, code reference, gap, and rule below is verified strictly against the live Cairnspire University codebase (`governance/preliminary_bill_of_rights.md`, `GEMINI.md`, `src/data/departmentRosters.ts`, `src/services/firestoreService.ts`, `firestore.rules`, and interior views). Zero fabrication; zero private personal emails, PINs, or family data.

---

## 1. Legislative Branch — Town Hall (`Kaelen`, `Miri`, `Toby` + 5 Congressional Committees)

### A. Role-by-Role Job Review & Verified Gaps
- **Kaelen (`th-head`, Speaker of Town Hall · Convention Rep):** Coordinates the 5 Congressional Committees, manages legislative dockets, and shepherds Constitutional drafts to Gate 1 & Gate 2. Wired via `TownHallInterior.tsx` (`proposals` & `committees`), `CommonsSquareInterior.tsx`, `governance_proposals`, and `isCampusConstitutionRatified()`.
- **Miri (`th-scribe`, Skills Registry Scribe):** Maintains the official Skills & Rules Registry (`skills_registry` collection and starter seed).
- **Toby (`th-clerk`, Amendment & Committee Clerk):** Formats proposed articles, tracks committee revisions, and verifies Gate 1/Gate 2 audit blocks (`createProposal()`, `decideProposalGate2()`).
- **5 Standing Committees (`TOWN_HALL_COMMITTEES`):** Constitutional & Charter, Privacy/Safety/Family Sanctuary, Compute & Budget Stewardship, Skills & Tools Review, and Inter-Department Operations. *(Currently static definitions in `departmentRosters.ts` without Firestore committee assignments or quorum metadata.)*
- **Operational Gaps Surfaced:**
  1. Gate 1 audit fields (`gate1Status`, `gate1Notes`) had no visible UI display on cards, and `✓ Ratify (Gate 2)` was clickable even when `gate1Status` was still `'pending'` *(UI guard fixed in v8.0; Firestore rules hardening queued for Chancellor decision)*.
  2. Sponsor selector previously included neutral `commons` *(filtered out in v8.0)*.
  3. `saveSkillRecord()` omitted Courthouse Cairn logging *(closed in v8.0)*.
  4. Deferred schema choices: 20,000-character body ceiling if filing a single consolidated Constitution, R&D Skill graduation pipeline fields (`rdOriginRef`, `reviewedByCommittee`), and Skills UI edit/deprecation controls.

### B. Proposed Constitutional Convention Rules of Order
1. **Seating & Neutral Host (Article X.1):** **13 Voting Department Seats** (*Town Hall, Executive/Police, Courthouse, Home & Garden, Health, Geology, Children’s Books, Social Media, Finance, Stocks, AIR, Communications, R&D*); **Commons Square** (*Lark*) serves strictly as neutral host and Convention Clerk (minutes, roll call, vote tallies — no vote).
2. **Moratorium-Compliant Non-Government Participation (*Brief-Proxy Mode*):** While non-government departments stay Offline/Standby per Rule 9, Town Hall’s 5 committees draft directly from the **13 ratified `CONVENTION_BRIEFS`** (`mustInclude` / `mustExclude`), with Chancellor Amarette adjudicating open policy trade-offs.
3. **Recommended 5-Committee Seat Assignment:**
   - **Constitutional & Charter:** *Kaelen* (Chair), *Vex*, *Alden*
   - **Privacy, Safety & Family Sanctuary:** *Pip*, *Lumi*, *Hazel Quill*, *Alden*
   - **Compute & Budget Stewardship:** *Mina*, *Bram*, *Sora*, *Tink*
   - **Skills & Tools Review:** *Tink*, *Mina*, *Kaelen / Miri*, *Alden*
   - **Inter-Department Operations:** *Sera*, *Theron*, *Faye*, *Vex*
4. **Quorum & Debate Sequence:** **9 of 13** supermajority for Constitutional articles (**7 of 13** for routine bills): *(1) Roll Call → (2) Committee Article Read-In → (3) Structured Brief Check → (4) Article X.3 Non-Weakening Check → (5) Floor Adoption Vote (advisory to Two-Gate lawmaking)*.
5. **Strict Two-Gate Enactment (Article I.2):** Committee Draft → **Gate 1 (Antigravity Audit + 5-Justice Supreme Court Review)** → **Gate 2 (Chancellor Amarette Ratification)** → Courthouse Cairn log.

### C. Working Outline — Full Campus Constitution (Articles I–XII)
| Article | Title | Core Constitutional Coverage (`mustInclude` / `mustExclude`) |
|---|---|---|
| **I** | Human Sovereignty, Three-Branch Government & Two-Gate Supremacy | Amarette sole Chancellor; Two-Gate Lock; Town Hall / Police Station / Courthouse checks; zero self-expansion or self-activating bills. |
| **II** | Mandatory Executive Permits (`!`), Enforcement & Detainment Due Process | Hard `!` Permit thresholds; Briggs emergency quarantine/halt for runaway loops; prompt notice & Courthouse hearing; no log tampering or vault fishing. |
| **III** | Sacred Privacy, Access Tiers, Family Sanctuary & Health Partition | Amarette & Ray University-wide access; strict one-way Home & Garden Sanctuary isolation; Kid Mode (Liam & Oliver) & No-Peeking privacy; Chancellor-only Medical Vault; zero credentials/PHI in text. |
| **IV** | Radical Honesty, Source Integrity & Verified Field Research | Zero hallucinated completions/facts; human work backup preservation; USGS/LiDAR/St. Louis ↔ Lillington verification; zero private home GPS or unpermitted paid GIS. |
| **V** | Compute Stewardship, AIR Command & Agent Onboarding Gate | RTX 5090 ComfyUI & Agent Zero LAN first; Cost Watchdog caps; RBAC Onboarding Gate before leaving Standby; zero LAN tokens or unapproved daemons. |
| **VI** | Department Boundaries, Communications & Inter-Building Handoffs | Stay in Your Hall; Communications Inter-Dept Handoff packet format (Bramblewood/Social Media → Finance P&L; departments → AIR visuals); Draft-First + `!` Permit for external mail/outreach. |
| **VII** | Child-Safe Conduct, Publishing Readiness & External AI Persona Standards | Bramblewood Article VII child safety + 4-stage Amarette gate + `!` Permit for KDP/Etsy/spend; Social Media AI persona disclosure, local-GPU visuals, clear boundary on live external posts; zero minor DMs or family details. |
| **VIII** | Financial, Stocks & Medical Prudence (Business Vault & Walled MCP Desk) | Health research/prep only; Finance strictly Business & Publishing Accounting (no household bills/transfers); Stocks Research Desk 100% Read-Only + single **Walled MCP Trading Exception** (GrokBot / authorized upgrade) under ratified hard risk caps + Circuit Breaker. |
| **IX** | Judicial System, Immutable Cairns & Remediation Orders | Civil & Criminal Court (agent cases), Grand Court (inter-branch/government cases), 5-Justice Supreme Court; Defense Counsel before permanent revocation; Courthouse → R&D → Skills Registry remediation loop; zero judge-written executive orders or code deploys. |
| **X** | Legislative Branch, Standing Committees & Constitutional Amendments | 13 voting reps + neutral Commons Clerk; 5 standing committee charters & quorums; Two-Gate amendment flow; Article X.3 supremacy floor protecting Articles I–IX. |
| **XI** | R&D Sandbox Isolation & Official Skills Registry Graduation | Sandbox-first experimentation; graduation pipeline (`R&D Sandbox → Skills Review Committee → Gate 1 Audit → Skills Registry Active`); zero direct router/Security Rules changes. |
| **XII** | Ratification, Lifting the Moratorium & Staged Agent Activation | Formal Gate 1 + Gate 2 lift of Rule 9; staged per-department AIR RBAC + Police compliance onboarding; no bulk auto-activation without verification. |

---

## 2. Executive Branch — Police Station / Campus Watch (`Vex`, `Dorian`, `Marlowe`, `Kira`, `Briggs`)

### A. Role-by-Role Job Review & Verified Enforcement Gaps
- **Vex (`ps-commissioner`, Convention Rep):** Commands Police Station under Article II; represents Executive Branch at Convention.
- **Dorian (`ps-chief`, Chief of Police):** Directs patrols, `!` Permit dispatch verification, and cross-building compliance (`CampusWatchInterior.tsx`, `permits` collection).
- **Marlowe (`ps-detective`, Detective):** Investigates anomalous tool calls, cross-department boundary slips, and compiles immutable Cairn evidence (`conduct_logs` `update/delete: if false`).
- **Kira (`ps-officer`, Law Enforcement Officer):** Intercepts restricted high-impact actions and queues `!` Permits for Chancellor sign-off.
- **Briggs (`ps-detainment`, Detainment Force):** Executes immediate pause/quarantine on runaway compute loops or rogue agents pending Courthouse due process.
- **Concrete Enforcement Gaps Surfaced (For Chancellor Decisions Before Stage 2):**
  1. `permits.status` allows only a single `pending → approved|denied` transition — zero permit TTL expiration, single-use `'executed'` state, or Chancellor `'revoked'` kill switch in `firestore.rules`.
  2. No dedicated `detainments` / `quarantines` Firestore collection or `'paused'`/`'quarantined'` status on `campus_departments` and `air_bridges`, and no runtime execution gate blocking a bridge/tool without an active permit.
  3. Sensitivity-metadata boundary (`mustExclude` reading raw Health/Finance payloads) is policy-only until a metadata-only telemetry projection separates operational alerts from private vault contents.
  4. `createPermitRequest` and `decidePermit` write permit + Cairn in two separate calls rather than an atomic batch.
  5. Unified naming check: Bill of Rights refers to **Campus Watch / Executive Hall**, while rosters/UI use **Police Station**. *(Missing `defaultName` fields for Marlowe, Kira, Briggs resolved in v8.0.)*

### B. Proposed `!` Permit Trigger Matrix & Detainment Protocol
- **Tier 1 — Mandatory `!` Permit (Hard Hold by Kira):** Financial spend/subscriptions/KDP/Etsy creation; external emails/DMs/live social posts; public sharing/permissions/role edits/permanent data deletion (`data_deletion`); host software installs/exposed ports/network changes.
- **Tier 2 — Pre-Approved Read-Only & Internal Drafting (No `!` Permit):** Public research, USGS/LiDAR/market analysis, internal staging drafts, local RTX 5090 ComfyUI renders, and in-hall preparation strictly respecting Articles III–VIII.
- **Tier 3 — Article VIII Walled MCP Trading Exception:** Confined strictly to `GrokBot` (or Chancellor-authorized upgrade) inside its dedicated walled brokerage MCP account under a Gate 1 + Gate 2 Stocks Charter specifying hard caps (max order size, daily loss cap, allowed assets, instant halt).
- **Briggs 5-Step Detainment Protocol:** *(1) Trigger check (Moratorium breach, Permit bypass, runaway loop, Privacy/Safety risk, Cap breach, Log tampering) → (2) Immediate freeze preserving full state/logs → (3) Mandatory atomic Courthouse Cairn notice (`category: 'incident' | 'policy_violation'`) → (4) Route agent cases to Civil & Criminal Court or branch disputes to Grand Court → (5) Release ONLY by Courthouse ruling or explicit Chancellor override.*

### C. Five Hard Inter-Branch Anti-Overreach Limits
1. Executive cannot approve, deny, veto, or override Chancellor `!` Permits or lift/block Chancellor release orders.
2. Executive cannot write/veto Town Hall legislation or detain voting reps to halt Convention sessions (branch disputes go to Grand Court).
3. Executive cannot alter/delete `conduct_logs`, adjudicate guilt, revoke Skills permanently, or detain sitting judges.
4. Executive cannot read raw contents of `private_health_owner`, `private_health`, `private_finance`, `private_stocks`, or `home_and_garden_parents` — enforcement operates strictly on minimum safety metadata.
5. Executive cannot self-expand permissions, modify `firestore.rules`, or exempt its own high-impact actions from `!` Permits.

---

## 3. Judicial Branch — Courthouse (`Alden` + 10 Judicial Officers Across 3 Courts)

### A. Three-Tier Bench Review & Audited Code Gaps
- **Supreme Court 5-Justice Panel:** **Alden** (`ct-chief-justice`, Rep), **Vesper** (`ct-sc-1`, Art. I powers), **Nora** (`ct-sc-2`, Art. III/VII privacy & safety), **Cassian** (`ct-sc-3`, Art. II/VIII permits & Stocks scope), **Pippa** (`ct-sc-4`, Art. V/IX Cairns & local-GPU watchdogs).
- **Civil & Criminal Court:** **Soren** (`ct-cc-judge`), **Valen** (`ct-cc-prosecutor`), **Bryn** (`ct-cc-defense`). Handles individual agent/Skill cases, honest-error reviews, detention hearings, and remediation orders.
- **Grand Court:** **Lyris** (`ct-gc-judge`), **Corvus** (`ct-gc-panel`). Handles government & inter-branch authority disputes.
- **Audited Code Gaps Surfaced:**
  1. Missing `court_cases` / `remediation_orders` collections for structured hearings, appeals, and R&D remediation closure tracking; `skills_registry` allows direct `'revoked'` writes without a Courthouse case/Defense Counsel record.
  2. `saveAirBridge`, `upsertAccessRole`, and `removeAccessRole` in `firestoreService.ts` do not emit `conduct_logs` Cairns yet.
  3. `conduct_logs` allows `guest` readers (`firestore.rules:543`) and stores raw operator emails in `actor`, risking unnecessary metadata visibility.
  4. `subscribeConductLogs` truncates at `limit(60)` with no archive pagination; local-GPU Watchdog cron/job specs are not yet registered.
  5. *(Resolved in v8.0: all 8 missing Courthouse `defaultName` values added in `departmentRosters.ts`; `policy_violation`, `incident`, and `commendation` restored in `CourthouseInterior.tsx` filters/forms; `saveSkillRecord()` now emits an audit Cairn.)*

### B. Due Process, Watchdog & Privacy Standards
- **Right of Defense Counsel (`Bryn`):** Permanent Skill revocation requires formal Valen Cairn charges, Bryn context/ambiguity review, remediation-first presumption for honest bugs, and appeal right to the 5-Justice Supreme Court (while preserving instant Chancellor override).
- **Local-GPU Watchdog (`Pippa`):** Routine sweeps, permit-to-execution checks, and Article VIII trade verifications run on Ray’s local RTX 5090 / Agent Zero bridge (`192.168.1.128:5080`) in observe-and-refer mode only.
- **Privacy Redaction (`Nora`):** Public Cairns & case summaries record only IDs, department, violated Article, severity, timestamps, and abstract remediation steps — never Health, Finance, Family Sanctuary, child identities, or PINs/tokens.

### C. 9-Point Supreme Court Pre-Convention Constitutional Audit Checklist (Article X.3)
1. **Art. I Sovereignty & Two-Gate Lock** *(Alden & Vesper)*
2. **Art. II Mandatory `!` Permit Coverage** *(Cassian)*
3. **Art. III & VII Sanctuary, Medical Partition & Child Safety** *(Nora)*
4. **Art. IV Radical Honesty & Backup Preservation** *(Alden & Soren)*
5. **Art. V Local-First GPU & Retry/Loop Bounds** *(Pippa)*
6. **Art. VI Hall Boundaries & Handoff Discipline** *(Lyris & Vesper)*
7. **Art. VIII Health Prep-Only, Business Accounting & Walled MCP Trading** *(Cassian)*
8. **Art. IX Immutable Cairns, Defense Right & Remediation Loop** *(Pippa & Alden)*
9. **Art. X.3 Non-Weakening Supremacy Check** *(Full 5-Justice Panel Hold if Articles I–IX are narrowed without written Chancellor waiver)*

---

## 4. Consolidated Chancellor Decisions Needed Before Gaveling Open

1. **Non-Government Representation Mode During Rule 9 Moratorium:**  
   - **Recommended:** *Brief-Proxy Mode* (the 10 non-government departments stay Offline/Standby; Government committees draft from all 13 `CONVENTION_BRIEFS` with Chancellor adjudication on open trade-offs).  
   - *Alternative:* Explicit written Chancellor waiver allowing single-turn, read-only, zero-tool floor participation for non-government reps.
2. **Constitution Filing Format & Gate 1 Rules Enforcement:**  
   - File the Constitution as **one consolidated 12-article charter** (raising the 20k-char cap in `firestore.rules`) or **article-by-article**? Confirm adding a server-side `firestore.rules` lock requiring `gate1Status in ['passed', 'approved']` before Gate 2 Ratification.
3. **Permit Lifecycle Rules (`permits` Schema):**  
   - Add mandatory expiration windows (TTL), `'executed'` single-use closure, and Chancellor `'revoked'` transition in `firestore.rules`?
4. **Detainment & Court Docket Collections (`detainments`, `court_cases`, `remediation_orders`):**  
   - Authorize adding server-enforced Firestore schemas for Briggs' emergency quarantines, Courthouse three-tier dockets (including Bryn defense-brief requirement prior to permanent Skill revocation), and atomic Batch Cairn writes — plus logging Cairn entries for `air_bridges` and `access_roles` updates?
5. **Cairn Guest Visibility & Watchdog SLA (`conduct_logs`):**  
   - Restrict `conduct_logs` reads from `isCampusReader()` to `isCampusOperator()` (replacing raw email `actor` strings with display names/role IDs), and confirm post-Constitution local-GPU Watchdog sweep cadence + Detention review SLA (e.g., 24h)?
6. **Social Media Posting Rule & Stocks Risk Caps Location:**  
   - Require a `!` Permit per external Social Media post at launch (vs. pre-approved campaign policy later)? Keep numeric Stocks MCP caps in a separate Two-Gate **Stocks Charter** referenced by Article VIII or embed directly in Article VIII? Also confirm standardizing **Campus Watch / Police Station** across docs & UI.
