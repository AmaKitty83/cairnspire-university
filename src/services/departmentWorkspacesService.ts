import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import { auth, db } from '../firebase';

function cleanActor(actorEmail: string): string {
  return (actorEmail || auth.currentUser?.email || '').trim().toLowerCase();
}

// ============================================================================
// 1. GEOLOGY WORKSPACE (campus_workspaces/geology_data)
// ============================================================================
export interface GeologySpecimen {
  id: string;
  name: string;
  mineralGroup: string;
  locality: string;
  formation: string;
  notes: string;
}

export interface RoadtripStop {
  id: string;
  region: string;
  siteName: string;
  targetMinerals: string;
  accessNotes: string;
}

export interface LapidaryItem {
  id: string;
  piece: string;
  stage: 'Rough' | 'Slabbed' | 'Tumbling' | 'Cabochon' | 'Polished';
  notes: string;
}

export interface GeologyWorkspaceDoc {
  specimens: GeologySpecimen[];
  roadtripStops: RoadtripStop[];
  lapidaryQueue: LapidaryItem[];
  fieldNotes: string;
}

export const INITIAL_GEOLOGY_DOC: GeologyWorkspaceDoc = {
  specimens: [],
  roadtripStops: [
    {
      id: 'rt-1',
      region: 'Eastern Missouri / St. Louis Corridor',
      siteName: 'Editable Route Stop — Verify Public Land / State Park Rules First',
      targetMinerals: 'Druzy quartz, Missouri lace agate, fluorite/galena district geology notes',
      accessNotes: 'Template placeholder along St. Louis, MO corridor — add verified legal stops or roadcuts here.',
    },
    {
      id: 'rt-2',
      region: 'Central Kentucky / Tennessee Plateau Crossing',
      siteName: 'Editable Mid-Route Stop — Verify Access Before Visiting',
      targetMinerals: 'Geodes, Keokuk-style quartz/calcite nodules, Mississippian limestone fossils',
      accessNotes: 'Template placeholder for mid-route rockhounding stops between STL and NC.',
    },
    {
      id: 'rt-3',
      region: 'Western & Central North Carolina -> Lillington, NC',
      siteName: 'Editable NC Destination Corridor — Fee-Dig & Piedmont Geology Notes',
      targetMinerals: 'Emerald/hiddenite/corundum belt (Blue Ridge), quartz, Piedmont gravel bars',
      accessNotes: 'Template placeholder near destination — add verified fee-dig mines & NC Geological Survey maps.',
    },
  ],
  lapidaryQueue: [],
  fieldNotes: '',
};

export function subscribeGeologyWorkspace(
  cb: (data: GeologyWorkspaceDoc) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'campus_workspaces', 'geology_data'),
    (snap) => {
      if (!snap.exists()) return cb(INITIAL_GEOLOGY_DOC);
      const d = snap.data() as Partial<GeologyWorkspaceDoc>;
      cb({
        specimens: Array.isArray(d.specimens) ? d.specimens : [],
        roadtripStops:
          Array.isArray(d.roadtripStops) && d.roadtripStops.length
            ? d.roadtripStops
            : INITIAL_GEOLOGY_DOC.roadtripStops,
        lapidaryQueue: Array.isArray(d.lapidaryQueue) ? d.lapidaryQueue : [],
        fieldNotes: String(d.fieldNotes || ''),
      });
    },
    (err) => onError?.(err)
  );
}

export async function saveGeologyWorkspace(
  data: GeologyWorkspaceDoc,
  actorEmail: string
): Promise<void> {
  await setDoc(doc(db, 'campus_workspaces', 'geology_data'), {
    ...data,
    updatedAt: serverTimestamp(),
    updatedBy: cleanActor(actorEmail),
  });
}

// ============================================================================
// 2. STOCKS WORKSPACE (private_stocks/stocks_workspace)
// ============================================================================
export interface StockWatchItem {
  id: string;
  ticker: string;
  thesis: string;
  catalysts: string;
  status: 'Watching' | 'Researching' | 'MCP Approved' | 'Paused';
}

export interface StockNoteItem {
  id: string;
  title: string;
  date: string;
  body: string;
}

export interface McpHardRulesDraft {
  designatedAgent: string;
  maxOrderUsd: string;
  dailyLossCapUsd: string;
  allowedAssets: string;
  emergencyPauseEnabled: boolean;
  notes: string;
}

export interface StocksWorkspaceDoc {
  watchlist: StockWatchItem[];
  researchNotes: StockNoteItem[];
  mcpRulesDraft: McpHardRulesDraft;
}

export const INITIAL_STOCKS_DOC: StocksWorkspaceDoc = {
  watchlist: [],
  researchNotes: [],
  mcpRulesDraft: {
    designatedAgent: 'GrokBot (Walled Robinhood MCP Agent Account)',
    maxOrderUsd: '',
    dailyLossCapUsd: '',
    allowedAssets: 'Draft — equities/ETFs only per future Chancellor hard rules',
    emergencyPauseEnabled: true,
    notes:
      'Article VIII: All live trades are prohibited outside the single walled MCP agent account and must wait for explicit hard trading rules (Gate 1 + Gate 2) and Constitution ratification.',
  },
};

export function subscribeStocksWorkspace(
  cb: (data: StocksWorkspaceDoc) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'private_stocks', 'stocks_workspace'),
    (snap) => {
      if (!snap.exists()) return cb(INITIAL_STOCKS_DOC);
      const d = snap.data() as Partial<StocksWorkspaceDoc>;
      cb({
        watchlist: Array.isArray(d.watchlist) ? d.watchlist : [],
        researchNotes: Array.isArray(d.researchNotes) ? d.researchNotes : [],
        mcpRulesDraft: d.mcpRulesDraft
          ? { ...INITIAL_STOCKS_DOC.mcpRulesDraft, ...d.mcpRulesDraft }
          : INITIAL_STOCKS_DOC.mcpRulesDraft,
      });
    },
    (err) => onError?.(err)
  );
}

export async function saveStocksWorkspace(
  data: StocksWorkspaceDoc,
  actorEmail: string
): Promise<void> {
  await setDoc(doc(db, 'private_stocks', 'stocks_workspace'), {
    ...data,
    updatedAt: serverTimestamp(),
    updatedBy: cleanActor(actorEmail),
  });
}

// ============================================================================
// 3. FINANCE WORKSPACE (private_finance/finance_workspace)
// ============================================================================
export interface BudgetRow {
  id: string;
  category: string;
  scope: 'Household' | 'Bramblewood / Business' | 'Savings';
  monthlyTarget: string;
  notes: string;
}

export interface BillRow {
  id: string;
  name: string;
  amount: string;
  dueDay: string;
  autopay: boolean;
  category: string;
}

export interface SavingsGoalRow {
  id: string;
  goal: string;
  targetAmount: string;
  currentAmount: string;
  notes: string;
}

export interface FinanceWorkspaceDoc {
  budgets: BudgetRow[];
  bills: BillRow[];
  savingsGoals: SavingsGoalRow[];
}

export const INITIAL_FINANCE_DOC: FinanceWorkspaceDoc = {
  budgets: [],
  bills: [],
  savingsGoals: [],
};

export function subscribeFinanceWorkspace(
  cb: (data: FinanceWorkspaceDoc) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'private_finance', 'finance_workspace'),
    (snap) => {
      if (!snap.exists()) return cb(INITIAL_FINANCE_DOC);
      const d = snap.data() as Partial<FinanceWorkspaceDoc>;
      cb({
        budgets: Array.isArray(d.budgets) ? d.budgets : [],
        bills: Array.isArray(d.bills) ? d.bills : [],
        savingsGoals: Array.isArray(d.savingsGoals) ? d.savingsGoals : [],
      });
    },
    (err) => onError?.(err)
  );
}

export async function saveFinanceWorkspace(
  data: FinanceWorkspaceDoc,
  actorEmail: string
): Promise<void> {
  await setDoc(doc(db, 'private_finance', 'finance_workspace'), {
    ...data,
    updatedAt: serverTimestamp(),
    updatedBy: cleanActor(actorEmail),
  });
}

// ============================================================================
// 4. COMMUNICATIONS WORKSPACE (campus_workspaces/communications_data)
// ============================================================================
export interface CommDraftItem {
  id: string;
  recipient: string;
  subject: string;
  channel: 'Email' | 'Announcement' | 'School / Medical Prep' | 'Outreach';
  body: string;
  permitStatus: 'Draft Only (! Permit Needed)' | 'Permit Filed' | 'Approved / Sent';
}

export interface HandoffNoticeItem {
  id: string;
  fromDept: string;
  toDept: string;
  summary: string;
  date: string;
}

export interface CommunicationsWorkspaceDoc {
  drafts: CommDraftItem[];
  handoffs: HandoffNoticeItem[];
}

export const INITIAL_COMM_DOC: CommunicationsWorkspaceDoc = {
  drafts: [],
  handoffs: [],
};

export function subscribeCommunicationsWorkspace(
  cb: (data: CommunicationsWorkspaceDoc) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'campus_workspaces', 'communications_data'),
    (snap) => {
      if (!snap.exists()) return cb(INITIAL_COMM_DOC);
      const d = snap.data() as Partial<CommunicationsWorkspaceDoc>;
      cb({
        drafts: Array.isArray(d.drafts) ? d.drafts : [],
        handoffs: Array.isArray(d.handoffs) ? d.handoffs : [],
      });
    },
    (err) => onError?.(err)
  );
}

export async function saveCommunicationsWorkspace(
  data: CommunicationsWorkspaceDoc,
  actorEmail: string
): Promise<void> {
  await setDoc(doc(db, 'campus_workspaces', 'communications_data'), {
    ...data,
    updatedAt: serverTimestamp(),
    updatedBy: cleanActor(actorEmail),
  });
}

// ============================================================================
// 5. SOCIAL MEDIA WORKSPACE (campus_workspaces/social_media_data)
// ============================================================================
export interface SocialPersonaItem {
  id: string;
  name: string;
  platform: string;
  voiceTone: string;
  pillars: string;
  status: 'Draft Concept' | 'Awaiting Constitution' | 'Approved';
}

export interface ContentDraftItem {
  id: string;
  personaName: string;
  platform: string;
  caption: string;
  visualPrompt: string;
  status: 'Idea' | 'Draft Ready' | 'Permit Needed' | 'Posted';
}

export interface SocialMediaWorkspaceDoc {
  personas: SocialPersonaItem[];
  contentDrafts: ContentDraftItem[];
}

export const INITIAL_SOCIAL_DOC: SocialMediaWorkspaceDoc = {
  personas: [],
  contentDrafts: [],
};

export function subscribeSocialMediaWorkspace(
  cb: (data: SocialMediaWorkspaceDoc) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'campus_workspaces', 'social_media_data'),
    (snap) => {
      if (!snap.exists()) return cb(INITIAL_SOCIAL_DOC);
      const d = snap.data() as Partial<SocialMediaWorkspaceDoc>;
      cb({
        personas: Array.isArray(d.personas) ? d.personas : [],
        contentDrafts: Array.isArray(d.contentDrafts) ? d.contentDrafts : [],
      });
    },
    (err) => onError?.(err)
  );
}

export async function saveSocialMediaWorkspace(
  data: SocialMediaWorkspaceDoc,
  actorEmail: string
): Promise<void> {
  await setDoc(doc(db, 'campus_workspaces', 'social_media_data'), {
    ...data,
    updatedAt: serverTimestamp(),
    updatedBy: cleanActor(actorEmail),
  });
}

// ============================================================================
// 6. RESEARCH & DEVELOPMENT WORKSPACE (campus_workspaces/rd_data)
// ============================================================================
export interface RdPrototypeItem {
  id: string;
  name: string;
  targetDept: string;
  status: 'Sandbox Idea' | 'Prototyping' | 'Ready for Town Hall Review';
  notes: string;
}

export interface RdBenchmarkItem {
  id: string;
  modelName: string;
  hardware: string;
  notes: string;
}

export interface RdSkillIdeaItem {
  id: string;
  skillName: string;
  purpose: string;
  stage: 'Draft' | 'Testing' | 'Submitted to Skills Registry';
}

export interface RdWorkspaceDoc {
  prototypes: RdPrototypeItem[];
  benchmarks: RdBenchmarkItem[];
  skillIdeas: RdSkillIdeaItem[];
}

export const INITIAL_RD_DOC: RdWorkspaceDoc = {
  prototypes: [],
  benchmarks: [],
  skillIdeas: [],
};

export function subscribeRdWorkspace(
  cb: (data: RdWorkspaceDoc) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'campus_workspaces', 'rd_data'),
    (snap) => {
      if (!snap.exists()) return cb(INITIAL_RD_DOC);
      const d = snap.data() as Partial<RdWorkspaceDoc>;
      cb({
        prototypes: Array.isArray(d.prototypes) ? d.prototypes : [],
        benchmarks: Array.isArray(d.benchmarks) ? d.benchmarks : [],
        skillIdeas: Array.isArray(d.skillIdeas) ? d.skillIdeas : [],
      });
    },
    (err) => onError?.(err)
  );
}

export async function saveRdWorkspace(
  data: RdWorkspaceDoc,
  actorEmail: string
): Promise<void> {
  await setDoc(doc(db, 'campus_workspaces', 'rd_data'), {
    ...data,
    updatedAt: serverTimestamp(),
    updatedBy: cleanActor(actorEmail),
  });
}
