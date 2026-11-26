import { useState } from 'react';
import type { CampusRole } from '../../firebase';
import { BUILDINGS } from '../../data/campusData';
import {
  removeAccessRole,
  saveAirBridge,
  upsertAccessRole,
  type AccessRoleRecord,
  type AirBridgeRecord,
  type BridgeStatus,
  type BridgeType,
  type DepartmentRecord,
} from '../../services/firestoreService';

interface AirInteriorProps {
  role: CampusRole;
  userEmail: string;
  bridges: AirBridgeRecord[];
  departments: Record<string, DepartmentRecord>;
  accessRoles: AccessRoleRecord[];
}

const STATUS_STYLES: Record<BridgeStatus, string> = {
  online: 'bg-emerald-100 text-emerald-900 border-emerald-400',
  standby: 'bg-amber-100 text-amber-900 border-amber-300',
  degraded: 'bg-orange-100 text-orange-900 border-orange-300',
  maintenance: 'bg-sky-100 text-sky-900 border-sky-300',
  offline: 'bg-red-100 text-red-900 border-red-300',
};

export function AirInterior({
  role,
  userEmail,
  bridges,
  departments,
  accessRoles,
}: AirInteriorProps) {
  const [tab, setTab] = useState<'bridges' | 'roster' | 'access'>('bridges');
  const [bridgeName, setBridgeName] = useState('');
  const [bridgeHost, setBridgeHost] = useState('');
  const [bridgeType, setBridgeType] = useState<BridgeType>('mcp');
  const [bridgeStatus, setBridgeStatus] = useState<BridgeStatus>('standby');
  const [bridgeHardware, setBridgeHardware] = useState('');
  const [bridgeNotes, setBridgeNotes] = useState('');
  const [busy, setBusy] = useState(false);

  // Chancellor Access Control form
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'university' | 'guest' | 'family'>('guest');
  const [newDisplay, setNewDisplay] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const canWrite = role === 'chancellor' || role === 'university';
  const isChancellor = role === 'chancellor';

  async function handleSaveBridge(e: React.FormEvent) {
    e.preventDefault();
    if (!bridgeName.trim() || !bridgeHost.trim()) return;
    setBusy(true);
    try {
      const slug =
        bridgeName
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
          .slice(0, 60) || `bridge-${Date.now()}`;
      await saveAirBridge(
        slug,
        {
          name: bridgeName,
          host: bridgeHost,
          type: bridgeType,
          status: bridgeStatus,
          hardware: bridgeHardware,
          notes: bridgeNotes,
        },
        userEmail
      );
      setBridgeName('');
      setBridgeHost('');
      setBridgeHardware('');
      setBridgeNotes('');
    } finally {
      setBusy(false);
    }
  }

  async function handleCycleStatus(b: AirBridgeRecord, nextStatus: BridgeStatus) {
    setBusy(true);
    try {
      await saveAirBridge(
        b.id,
        {
          name: b.name,
          host: b.host,
          type: b.type,
          status: nextStatus,
          hardware: b.hardware,
          notes: b.notes,
        },
        userEmail
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleAddAccess(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setBusy(true);
    try {
      await upsertAccessRole(newEmail, newRole, newDisplay, newNotes, userEmail);
      setNewEmail('');
      setNewDisplay('');
      setNewNotes('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5 border-b border-[#cfa96e] pb-2">
        <button
          onClick={() => setTab('bridges')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
            tab === 'bridges'
              ? 'bg-[#362316] text-[#fbe8b5]'
              : 'bg-[#f4e4c1] hover:bg-[#ebd3a0] text-[#4a2b0f]'
          }`}
        >
          ⚡ Compute Bridges ({bridges.length})
        </button>
        <button
          onClick={() => setTab('roster')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
            tab === 'roster'
              ? 'bg-[#362316] text-[#fbe8b5]'
              : 'bg-[#f4e4c1] hover:bg-[#ebd3a0] text-[#4a2b0f]'
          }`}
        >
          🧭 Agent Roster
        </button>
        {isChancellor && (
          <button
            onClick={() => setTab('access')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              tab === 'access'
                ? 'bg-[#362316] text-[#fbe8b5]'
                : 'bg-[#f4e4c1] hover:bg-[#ebd3a0] text-[#4a2b0f]'
            }`}
          >
            🔐 Campus Access ({accessRoles.length})
          </button>
        )}
      </div>

      {tab === 'bridges' && (
        <div className="space-y-3">
          <div className="p-2.5 rounded-xl bg-[#fff8e7] border border-[#b08647] text-xs text-[#54371b]">
            <strong>Article V — Local-First Compute Stewardship:</strong> Prefer Ray’s local RTX
            5090 ComfyUI &amp; Agent Zero bridges over metered cloud credits whenever practical.
          </div>

          <div className="space-y-2">
            {bridges.map((b) => (
              <div
                key={b.id}
                className="p-3 rounded-xl bg-white/85 border border-[#b89259] text-xs space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <div className="font-bold text-sm text-[#331d0b]">{b.name}</div>
                    <div className="font-mono text-[11px] text-[#7c5021]">{b.host}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-[#efe0bc] text-[#4a2b0f] text-[10px] font-bold uppercase">
                      {b.type}
                    </span>
                    {canWrite ? (
                      <select
                        disabled={busy}
                        value={b.status}
                        onChange={(e) => void handleCycleStatus(b, e.target.value as BridgeStatus)}
                        className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase cursor-pointer ${STATUS_STYLES[b.status]}`}
                      >
                        <option value="online">online</option>
                        <option value="standby">standby</option>
                        <option value="degraded">degraded</option>
                        <option value="maintenance">maintenance</option>
                        <option value="offline">offline</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase ${STATUS_STYLES[b.status]}`}
                      >
                        {b.status}
                      </span>
                    )}
                  </div>
                </div>
                {b.hardware && <div className="text-[11px] font-medium text-[#4a2b0f]">{b.hardware}</div>}
                {b.notes && <p className="text-[#54371b]">{b.notes}</p>}
              </div>
            ))}
          </div>

          {canWrite && (
            <form
              onSubmit={(e) => void handleSaveBridge(e)}
              className="p-3 rounded-xl bg-[#f7ead0] border border-[#b08647] space-y-2 text-xs"
            >
              <div className="font-atlas font-bold text-sm text-[#3c230f]">
                Add Compute / Agent Bridge
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  required
                  value={bridgeName}
                  onChange={(e) => setBridgeName(e.target.value)}
                  placeholder="Bridge name"
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-[#b89259]"
                />
                <input
                  required
                  value={bridgeHost}
                  onChange={(e) => setBridgeHost(e.target.value)}
                  placeholder="Host / URL (e.g., http://192.168.1.128:11434)"
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-[#b89259]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  value={bridgeType}
                  onChange={(e) => setBridgeType(e.target.value as BridgeType)}
                  className="px-2 py-1.5 rounded-lg bg-white border border-[#b89259]"
                >
                  <option value="comfyui">ComfyUI</option>
                  <option value="agent_zero">Agent Zero</option>
                  <option value="mcp">MCP Server</option>
                  <option value="ollama">Ollama</option>
                  <option value="llm">Local LLM</option>
                  <option value="gpu_worker">GPU Worker</option>
                  <option value="api">API</option>
                  <option value="custom">Custom</option>
                </select>
                <select
                  value={bridgeStatus}
                  onChange={(e) => setBridgeStatus(e.target.value as BridgeStatus)}
                  className="px-2 py-1.5 rounded-lg bg-white border border-[#b89259]"
                >
                  <option value="online">Online</option>
                  <option value="standby">Standby</option>
                  <option value="offline">Offline</option>
                </select>
                <input
                  value={bridgeHardware}
                  onChange={(e) => setBridgeHardware(e.target.value)}
                  placeholder="Hardware / model info"
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-[#b89259]"
                />
              </div>
              <input
                value={bridgeNotes}
                onChange={(e) => setBridgeNotes(e.target.value)}
                placeholder="Routing notes & boundaries..."
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#b89259]"
              />
              <button
                type="submit"
                disabled={busy}
                className="px-3.5 py-1.5 rounded-lg bg-[#362316] hover:bg-[#4e3320] text-[#fbe8b5] font-semibold cursor-pointer disabled:opacity-50"
              >
                {busy ? 'Saving…' : 'Save Bridge'}
              </button>
            </form>
          )}
        </div>
      )}

      {tab === 'roster' && (
        <div className="space-y-1.5">
          {BUILDINGS.filter((b) => b.id !== 'commons').map((b) => {
            const rec = departments[b.id];
            return (
              <div
                key={b.id}
                className="p-2.5 rounded-lg bg-white/75 border border-[#c4a167] text-xs flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="font-bold text-[#331d0b]">{b.name}</div>
                  <div className="text-[11px] text-[#6b4b28] truncate">
                    {rec?.repName ? `${rec.repName} — ${b.headRole}` : `Unassigned (${b.headRole})`}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#efe0bc] text-[#4a2b0f] text-[10px] font-bold uppercase shrink-0">
                  {rec?.status || 'recruiting'}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'access' && isChancellor && (
        <div className="space-y-3 text-xs">
          <div className="p-2.5 rounded-xl bg-[#fff8e7] border border-[#b08647] text-[#54371b]">
            <strong>Chancellor-Only Access Ledger (Server-Enforced):</strong> Roles saved here are
            enforced directly by Firestore Security Rules — no code redeploy needed.
          </div>

          <div className="space-y-1.5">
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 flex items-center justify-between">
              <div>
                <div className="font-bold text-emerald-950">amarette83@gmail.com</div>
                <div className="text-[11px] text-emerald-800">Sole Chancellor · Bootstrap Rule</div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-950 text-[10px] font-bold uppercase">
                Chancellor
              </span>
            </div>

            {accessRoles.map((r) => (
              <div
                key={r.email}
                className="p-2.5 rounded-lg bg-white/85 border border-[#b89259] flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="font-bold text-[#331d0b] truncate">
                    {r.displayName || r.email}
                  </div>
                  <div className="text-[11px] text-[#7c5021] truncate">
                    {r.email} {r.notes ? `· ${r.notes}` : ''}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="px-2 py-0.5 rounded-full bg-[#efe0bc] text-[#4a2b0f] text-[10px] font-bold uppercase">
                    {r.role}
                  </span>
                  <button
                    disabled={busy}
                    onClick={() => void removeAccessRole(r.email)}
                    className="px-2 py-0.5 rounded bg-red-100 hover:bg-red-200 text-red-900 text-[10px] font-bold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => void handleAddAccess(e)}
            className="p-3 rounded-xl bg-[#f7ead0] border border-[#b08647] space-y-2"
          >
            <div className="font-atlas font-bold text-sm text-[#3c230f]">
              Grant / Update Campus Role
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                required
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Google email address"
                className="px-2.5 py-1.5 rounded-lg bg-white border border-[#b89259]"
              />
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as 'university' | 'guest' | 'family')}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-[#b89259]"
              >
                <option value="university">University Full Access (Read/Write)</option>
                <option value="guest">Campus Guest (Read-Only Tour)</option>
                <option value="family">Family (Home &amp; Garden Only)</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                value={newDisplay}
                onChange={(e) => setNewDisplay(e.target.value)}
                placeholder="Display name (e.g., Ray, Mom)"
                className="px-2.5 py-1.5 rounded-lg bg-white border border-[#b89259]"
              />
              <input
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Role notes"
                className="px-2.5 py-1.5 rounded-lg bg-white border border-[#b89259]"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="px-3.5 py-1.5 rounded-lg bg-[#362316] hover:bg-[#4e3320] text-[#fbe8b5] font-semibold cursor-pointer disabled:opacity-50"
            >
              {busy ? 'Saving…' : 'Save Access Role'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
