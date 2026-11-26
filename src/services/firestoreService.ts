import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Timestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, getSeedAllowlistEntries } from '../firebase';

export type DepartmentStatus = 'recruiting' | 'seated' | 'active';
export type Gate1Status =
  | 'draft'
  | 'pending'
  | 'review'
  | 'passed'
  | 'approved'
  | 'rejected'
  | 'needs_revision';
export type Gate2Status = 'pending' | 'ratified' | 'rejected';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type PermitStatus = 'pending' | 'approved' | 'denied';
export type ConductCategory =
  | 'audit'
  | 'policy_violation'
  | 'watchdog_alert'
  | 'remediation'
  | 'permit_audit'
  | 'governance'
  | 'incident'
  | 'commendation';
export type ConductSeverity = 'info' | 'low' | 'medium' | 'high' | 'critical';
export type SkillScope = 'campus' | 'department' | 'local' | 'external' | 'restricted';
export type SkillStatus = 'draft' | 'active' | 'under_review' | 'deprecated' | 'revoked';
export type BridgeType =
  | 'comfyui'
  | 'agent_zero'
  | 'mcp'
  | 'ollama'
  | 'llm'
  | 'gpu_worker'
  | 'api'
  | 'custom';
export type BridgeStatus = 'online' | 'offline' | 'degraded' | 'standby' | 'maintenance';

export interface DepartmentRecord {
  id: string;
  repName: string;
  status: DepartmentStatus;
  notes: string;
  updatedAt?: Timestamp | null;
  updatedBy: string;
}

export interface GovernanceProposal {
  id: string;
  title: string;
  articleRef: string;
  summary: string;
  body: string;
  proposedByDept: string;
  gate1Status: Gate1Status;
  gate1Notes: string;
  gate2Status: Gate2Status;
  gate2DecidedAt?: Timestamp | null;
  gate2DecidedBy?: string;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
  createdBy: string;
  updatedBy: string;
}

export interface PermitRecord {
  id: string;
  title: string;
  departmentId: string;
  requestedBy: string;
  actionType: string;
  details: string;
  riskLevel: RiskLevel;
  status: PermitStatus;
  createdAt?: Timestamp | null;
  decisionNote: string;
  decidedBy: string;
  decidedAt?: Timestamp | null;
}

export interface ConductLogRecord {
  id: string;
  category: ConductCategory;
  severity: ConductSeverity;
  departmentId: string;
  actor: string;
  summary: string;
  remediationOrder: string;
  createdAt?: Timestamp | null;
}

export interface SkillRegistryRecord {
  id: string;
  name: string;
  scope: SkillScope;
  departmentId: string;
  description: string;
  status: SkillStatus;
  location: string;
  updatedAt?: Timestamp | null;
  updatedBy: string;
}

export interface AirBridgeRecord {
  id: string;
  name: string;
  host: string;
  type: BridgeType;
  status: BridgeStatus;
  hardware: string;
  notes: string;
  updatedAt?: Timestamp | null;
  updatedBy: string;
}

export interface AccessRoleRecord {
  email: string;
  role: 'university' | 'guest' | 'family';
  displayName: string;
  notes: string;
  updatedAt?: Timestamp | null;
  updatedBy: string;
}

export function formatTimestamp(ts?: Timestamp | null): string {
  if (!ts || typeof ts.toDate !== 'function') return 'Just now';
  return ts.toDate().toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

// ============================================================================
// REALTIME SUBSCRIPTIONS
// ============================================================================

export function subscribeDepartments(
  cb: (items: Record<string, DepartmentRecord>) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    collection(db, 'campus_departments'),
    (snap) => {
      const map: Record<string, DepartmentRecord> = {};
      snap.forEach((d) => {
        map[d.id] = { id: d.id, ...(d.data() as Omit<DepartmentRecord, 'id'>) };
      });
      cb(map);
    },
    (err) => onError?.(err)
  );
}

export function subscribeProposals(
  cb: (items: GovernanceProposal[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const q = query(collection(db, 'governance_proposals'), orderBy('createdAt', 'desc'), limit(50));
  return onSnapshot(
    q,
    (snap) => {
      cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GovernanceProposal, 'id'>) })));
    },
    (err) => onError?.(err)
  );
}

export function subscribePermits(
  cb: (items: PermitRecord[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const q = query(collection(db, 'permits'), orderBy('createdAt', 'desc'), limit(50));
  return onSnapshot(
    q,
    (snap) => {
      cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<PermitRecord, 'id'>) })));
    },
    (err) => onError?.(err)
  );
}

export function subscribeConductLogs(
  cb: (items: ConductLogRecord[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const q = query(collection(db, 'conduct_logs'), orderBy('createdAt', 'desc'), limit(60));
  return onSnapshot(
    q,
    (snap) => {
      cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ConductLogRecord, 'id'>) })));
    },
    (err) => onError?.(err)
  );
}

export function subscribeSkills(
  cb: (items: SkillRegistryRecord[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    collection(db, 'skills_registry'),
    (snap) => {
      const rows = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as Omit<SkillRegistryRecord, 'id'>) }))
        .sort((a, b) => a.name.localeCompare(b.name));
      cb(rows);
    },
    (err) => onError?.(err)
  );
}

export function subscribeAirBridges(
  cb: (items: AirBridgeRecord[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    collection(db, 'air_bridges'),
    (snap) => {
      const rows = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as Omit<AirBridgeRecord, 'id'>) }))
        .sort((a, b) => a.name.localeCompare(b.name));
      cb(rows);
    },
    (err) => onError?.(err)
  );
}

export function subscribeAccessRoles(
  cb: (items: AccessRoleRecord[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    collection(db, 'access_roles'),
    (snap) => {
      const rows = snap.docs
        .map((d) => ({ email: d.id, ...(d.data() as Omit<AccessRoleRecord, 'email'>) }))
        .sort((a, b) => a.email.localeCompare(b.email));
      cb(rows);
    },
    (err) => onError?.(err)
  );
}

// ============================================================================
// MUTATIONS (100% ALIGNED TO firestore.rules)
// ============================================================================

export async function saveDepartmentRecord(
  deptId: string,
  repName: string,
  status: DepartmentStatus,
  notes: string,
  actorEmail: string
): Promise<void> {
  const email = actorEmail.trim().toLowerCase();
  const cleanName = repName.trim();
  if (!cleanName) throw new Error('Representative name cannot be empty.');
  await setDoc(doc(db, 'campus_departments', deptId), {
    repName: cleanName.slice(0, 120),
    status,
    notes: notes.trim().slice(0, 2000),
    updatedAt: serverTimestamp(),
    updatedBy: email,
  });
  await appendConductLog({
    category: 'governance',
    severity: 'info',
    departmentId: deptId,
    actor: email,
    summary: `Updated Department Head for ${deptId}: ${cleanName} (${status}).`,
    remediationOrder: '',
  });
}

export async function createProposal(
  input: {
    title: string;
    articleRef: string;
    summary: string;
    body: string;
    proposedByDept: string;
  },
  actorEmail: string
): Promise<void> {
  const email = actorEmail.trim().toLowerCase();
  await addDoc(collection(db, 'governance_proposals'), {
    title: input.title.trim().slice(0, 200),
    articleRef: input.articleRef.trim().slice(0, 100),
    summary: input.summary.trim().slice(0, 500),
    body: input.body.trim().slice(0, 20000),
    proposedByDept: input.proposedByDept,
    gate1Status: 'pending' as Gate1Status,
    gate1Notes: 'Awaiting Antigravity Gate 1 technical audit.',
    gate2Status: 'pending' as Gate2Status,
    gate2DecidedAt: null,
    gate2DecidedBy: '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: email,
    updatedBy: email,
  });
  await appendConductLog({
    category: 'governance',
    severity: 'info',
    departmentId: input.proposedByDept,
    actor: email,
    summary: `Submitted governance proposal: "${input.title.trim()}" (${input.articleRef.trim() || 'New Article'}).`,
    remediationOrder: '',
  });
}

export async function decideProposalGate2(
  proposalId: string,
  proposalTitle: string,
  decision: 'ratified' | 'rejected',
  chancellorEmail: string
): Promise<void> {
  const email = chancellorEmail.trim().toLowerCase();
  await updateDoc(doc(db, 'governance_proposals', proposalId), {
    gate2Status: decision,
    gate2DecidedAt: serverTimestamp(),
    gate2DecidedBy: email,
    updatedAt: serverTimestamp(),
    updatedBy: email,
  });
  await appendConductLog({
    category: 'governance',
    severity: 'info',
    departmentId: 'town-hall',
    actor: email,
    summary: `Chancellor Gate 2 ${decision.toUpperCase()} proposal "${proposalTitle}".`,
    remediationOrder: '',
  });
}

export async function createPermitRequest(
  input: {
    title: string;
    departmentId: string;
    requestedBy: string;
    actionType: string;
    details: string;
    riskLevel: RiskLevel;
  },
  actorEmail: string
): Promise<void> {
  const email = actorEmail.trim().toLowerCase();
  await addDoc(collection(db, 'permits'), {
    title: input.title.trim().slice(0, 200),
    departmentId: input.departmentId,
    requestedBy: (input.requestedBy.trim() || email).slice(0, 120),
    actionType: input.actionType.trim().slice(0, 80),
    details: input.details.trim().slice(0, 8000),
    riskLevel: input.riskLevel,
    status: 'pending' as PermitStatus,
    createdAt: serverTimestamp(),
    decisionNote: '',
    decidedBy: '',
    decidedAt: null,
  });
  await appendConductLog({
    category: 'permit_audit',
    severity: input.riskLevel === 'critical' || input.riskLevel === 'high' ? 'medium' : 'info',
    departmentId: input.departmentId,
    actor: email,
    summary: `Filed ! Permit Request: "${input.title.trim()}" (${input.actionType}, risk: ${input.riskLevel}).`,
    remediationOrder: '',
  });
}

export async function decidePermit(
  permit: PermitRecord,
  decision: 'approved' | 'denied',
  decisionNote: string,
  chancellorEmail: string
): Promise<void> {
  const email = chancellorEmail.trim().toLowerCase();
  await updateDoc(doc(db, 'permits', permit.id), {
    status: decision,
    decisionNote: decisionNote.trim().slice(0, 2000),
    decidedBy: email,
    decidedAt: serverTimestamp(),
  });
  await appendConductLog({
    category: 'permit_audit',
    severity: decision === 'denied' ? 'low' : 'info',
    departmentId: permit.departmentId,
    actor: email,
    summary: `Chancellor ${decision.toUpperCase()} ! Permit "${permit.title}"${decisionNote.trim() ? ` — Note: ${decisionNote.trim()}` : ''}.`,
    remediationOrder: '',
  });
}

export async function appendConductLog(input: {
  category: ConductCategory;
  severity: ConductSeverity;
  departmentId: string;
  actor: string;
  summary: string;
  remediationOrder: string;
}): Promise<void> {
  await addDoc(collection(db, 'conduct_logs'), {
    category: input.category,
    severity: input.severity,
    departmentId: input.departmentId,
    actor: input.actor.trim().slice(0, 120),
    summary: input.summary.trim().slice(0, 4000),
    remediationOrder: input.remediationOrder.trim().slice(0, 4000),
    createdAt: serverTimestamp(),
  });
}

export async function saveSkillRecord(
  skillId: string,
  input: {
    name: string;
    scope: SkillScope;
    departmentId: string;
    description: string;
    status: SkillStatus;
    location: string;
  },
  actorEmail: string
): Promise<void> {
  const email = actorEmail.trim().toLowerCase();
  await setDoc(doc(db, 'skills_registry', skillId), {
    name: input.name.trim().slice(0, 120),
    scope: input.scope,
    departmentId: input.departmentId,
    description: input.description.trim().slice(0, 2000),
    status: input.status,
    location: input.location.trim().slice(0, 500),
    updatedAt: serverTimestamp(),
    updatedBy: email,
  });
}

export async function saveAirBridge(
  bridgeId: string,
  input: {
    name: string;
    host: string;
    type: BridgeType;
    status: BridgeStatus;
    hardware: string;
    notes: string;
  },
  actorEmail: string
): Promise<void> {
  const email = actorEmail.trim().toLowerCase();
  await setDoc(doc(db, 'air_bridges', bridgeId), {
    name: input.name.trim().slice(0, 120),
    host: input.host.trim().slice(0, 255),
    type: input.type,
    status: input.status,
    hardware: input.hardware.trim().slice(0, 300),
    notes: input.notes.trim().slice(0, 2000),
    updatedAt: serverTimestamp(),
    updatedBy: email,
  });
}

export async function upsertAccessRole(
  emailLower: string,
  role: 'university' | 'guest' | 'family',
  displayName: string,
  notes: string,
  chancellorEmail: string
): Promise<void> {
  const target = emailLower.trim().toLowerCase();
  const actor = chancellorEmail.trim().toLowerCase();
  await setDoc(doc(db, 'access_roles', target), {
    role,
    displayName: displayName.trim().slice(0, 100),
    notes: notes.trim().slice(0, 500),
    updatedAt: serverTimestamp(),
    updatedBy: actor,
  });
}

export async function removeAccessRole(emailLower: string): Promise<void> {
  await deleteDoc(doc(db, 'access_roles', emailLower.trim().toLowerCase()));
}

// ============================================================================
// ONE-TIME STARTER SEED (CALLED AUTOMATICALLY FOR CHANCELLOR WHEN EMPTY)
// ============================================================================

export async function ensureStarterGovernanceSeeded(chancellorEmail: string): Promise<void> {
  const email = chancellorEmail.trim().toLowerCase();

  // 1. Seed access_roles from local env if empty
  const rolesSnap = await getDocs(collection(db, 'access_roles'));
  if (rolesSnap.empty) {
    const entries = getSeedAllowlistEntries();
    for (const entry of entries) {
      await upsertAccessRole(entry.email, entry.role, entry.displayName, entry.notes, email);
    }
  }

  // 2. Seed AIR Bridges if empty
  const bridgesSnap = await getDocs(collection(db, 'air_bridges'));
  if (bridgesSnap.empty) {
    await saveAirBridge(
      'comfyui-rtx5090',
      {
        name: 'ComfyUI Studio (Ray’s PC)',
        host: 'http://192.168.1.128:8188',
        type: 'comfyui',
        status: 'online',
        hardware: 'NVIDIA GeForce RTX 5090 (32 GB VRAM) · Linux',
        notes: 'Connected via global skill comfyui-local. Preferred local image/sprite engine under Article V.',
      },
      email
    );
    await saveAirBridge(
      'agent-zero-lan',
      {
        name: 'Agent Zero / Oracle (Ray’s PC)',
        host: 'http://192.168.1.128:5080',
        type: 'agent_zero',
        status: 'online',
        hardware: 'Ray’s Linux PC · MCP over SSE v3.2.4',
        notes: 'Connected via global skill agent-zero-local. Supports send_message & persistent chats.',
      },
      email
    );
    await saveAirBridge(
      'grokbot-mcp',
      {
        name: 'GrokBot (Walled Robinhood MCP)',
        host: 'Pending LAN/Tailscale Endpoint',
        type: 'mcp',
        status: 'standby',
        hardware: 'Dedicated Walled MCP Agent Account',
        notes: 'Scoped trading exception under Article VIII. Only interacts on explicit Chancellor request.',
      },
      email
    );
  }

  // 3. Seed Skills Registry if empty
  const skillsSnap = await getDocs(collection(db, 'skills_registry'));
  if (skillsSnap.empty) {
    await saveSkillRecord(
      'bill-of-rights-guardrail',
      {
        name: 'Preliminary Bill of Rights (GEMINI.md)',
        scope: 'campus',
        departmentId: 'town-hall',
        description: 'Active workspace governance rule enforcing Articles I–X for all Cairnspire agents.',
        status: 'active',
        location: 'cairnspire-university/GEMINI.md',
      },
      email
    );
    await saveSkillRecord(
      'comfyui-local',
      {
        name: 'comfyui-local',
        scope: 'local',
        departmentId: 'air',
        description: 'Zero-dependency LAN bridge to Ray’s RTX 5090 ComfyUI server (status, models, txt2img, custom workflows).',
        status: 'active',
        location: '~/.gemini/config/skills/comfyui-local/SKILL.md',
      },
      email
    );
    await saveSkillRecord(
      'agent-zero-local',
      {
        name: 'agent-zero-local',
        scope: 'local',
        departmentId: 'air',
        description: 'Zero-dependency MCP-over-SSE bridge to Agent Zero / Oracle on Ray’s PC.',
        status: 'active',
        location: '~/.gemini/config/skills/agent-zero-local/SKILL.md',
      },
      email
    );
  }

  // 4. Seed initial Courthouse Cairn log if empty
  const logsSnap = await getDocs(query(collection(db, 'conduct_logs'), limit(1)));
  if (logsSnap.empty) {
    await appendConductLog({
      category: 'governance',
      severity: 'info',
      departmentId: 'town-hall',
      actor: email,
      summary:
        'Preliminary Bill of Rights (Stage 0) officially ratified by Chancellor Amarette after Gate 1 Antigravity audit. v2 Governance Halls & append-only Courthouse Ledger initialized.',
      remediationOrder: '',
    });
  }
}
