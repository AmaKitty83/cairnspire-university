import { useEffect, useState } from 'react';
import { BUILDINGS } from '../../data/campusData';
import type { CampusRole } from '../../firebase';
import {
  INITIAL_COMM_DOC,
  saveCommunicationsWorkspace,
  subscribeCommunicationsWorkspace,
  type CommDraftItem,
  type CommunicationsWorkspaceDoc,
  type HandoffNoticeItem,
} from '../../services/departmentWorkspacesService';

interface CommunicationsInteriorProps {
  role: CampusRole;
  userEmail: string;
}

export function CommunicationsInterior({ role, userEmail }: CommunicationsInteriorProps) {
  const canEdit = role === 'chancellor' || role === 'university';
  const [tab, setTab] = useState<'drafts' | 'handoffs'>('drafts');
  const [data, setData] = useState<CommunicationsWorkspaceDoc>(INITIAL_COMM_DOC);
  const [syncErr, setSyncErr] = useState<string | null>(null);

  const [rec, setRec] = useState('');
  const [subj, setSubj] = useState('');
  const [chan, setChan] = useState<CommDraftItem['channel']>('Email');
  const [body, setBody] = useState('');

  const [fromD, setFromD] = useState('town-hall');
  const [toD, setToD] = useState('childrens-books');
  const [hSum, setHSum] = useState('');

  useEffect(() => {
    return subscribeCommunicationsWorkspace(setData, (e) => setSyncErr(e.message));
  }, []);

  async function saveNext(next: CommunicationsWorkspaceDoc) {
    if (!canEdit) return;
    setData(next);
    await saveCommunicationsWorkspace(next, userEmail);
  }

  return (
    <div className="space-y-3 text-xs">
      <div className="p-3 rounded-xl bg-[#fff8e7] border border-[#b08647] flex flex-wrap items-center justify-between gap-2">
        <div className="text-[#54371b]">
          <strong>Communications &amp; Draft Mailroom:</strong> Prepare messages &amp; cross-department
          handoffs. Under <strong>Article II</strong>, all external emails/messages stay Draft-Only until
          an approved Chancellor <code>! Permit</code>.
        </div>
        <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-amber-400 text-amber-200 text-[10px] font-bold">
          ⏸️ Roster Pending Your Definitions
        </span>
      </div>

      {syncErr && <div className="p-2 rounded bg-red-100 text-red-900">{syncErr}</div>}

      <div className="flex flex-wrap gap-1.5 border-b border-[#cfa96e] pb-2">
        <button
          onClick={() => setTab('drafts')}
          className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
            tab === 'drafts' ? 'bg-[#362316] text-[#fbe8b5]' : 'bg-[#f4e4c1] text-[#4a2b0f]'
          }`}
        >
          ✉️ External Drafts ({data.drafts.length})
        </button>
        <button
          onClick={() => setTab('handoffs')}
          className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
            tab === 'handoffs' ? 'bg-[#362316] text-[#fbe8b5]' : 'bg-[#f4e4c1] text-[#4a2b0f]'
          }`}
        >
          📣 Article VI Inter-Dept Handoffs ({data.handoffs.length})
        </button>
      </div>

      {tab === 'drafts' && (
        <div className="space-y-2.5">
          {canEdit && (
            <div className="p-3 rounded-xl bg-[#f7ead0] border border-[#b08647] space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  value={rec}
                  onChange={(e) => setRec(e.target.value)}
                  placeholder="Recipient / audience"
                  className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
                />
                <input
                  value={subj}
                  onChange={(e) => setSubj(e.target.value)}
                  placeholder="Subject / topic"
                  className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
                />
                <select
                  value={chan}
                  onChange={(e) => setChan(e.target.value as CommDraftItem['channel'])}
                  className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
                >
                  <option>Email</option>
                  <option>Announcement</option>
                  <option>School / Medical Prep</option>
                  <option>Outreach</option>
                </select>
              </div>
              <textarea
                rows={2}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Message draft..."
                className="w-full px-2 py-1.5 rounded bg-white border border-[#b89259]"
              />
              <button
                onClick={async () => {
                  if (!subj.trim() && !body.trim()) return;
                  const row: CommDraftItem = {
                    id: `cm_${Date.now().toString(36)}`,
                    recipient: rec.trim(),
                    subject: subj.trim() || 'Untitled Draft',
                    channel: chan,
                    body: body.trim(),
                    permitStatus: 'Draft Only (! Permit Needed)',
                  };
                  await saveNext({ ...data, drafts: [row, ...data.drafts] });
                  setRec('');
                  setSubj('');
                  setBody('');
                }}
                className="px-3 py-1.5 rounded bg-[#362316] text-[#fbe8b5] font-bold cursor-pointer"
              >
                Save Draft (! Permit Required Before Sending)
              </button>
            </div>
          )}
          {data.drafts.map((d) => (
            <div key={d.id} className="p-2.5 rounded-xl bg-white/85 border border-[#b89259] space-y-1">
              <div className="flex flex-wrap justify-between gap-2">
                <span className="font-bold text-[#331d0b]">
                  [{d.channel}] {d.subject} {d.recipient ? `→ ${d.recipient}` : ''}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                  {d.permitStatus}
                </span>
              </div>
              <p className="text-[#4a2f17] whitespace-pre-wrap">{d.body}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'handoffs' && (
        <div className="space-y-2.5">
          {canEdit && (
            <div className="p-3 rounded-xl bg-[#f7ead0] border border-[#b08647] space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select
                  value={fromD}
                  onChange={(e) => setFromD(e.target.value)}
                  className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
                >
                  {BUILDINGS.map((b) => (
                    <option key={b.id} value={b.id}>
                      From: {b.name}
                    </option>
                  ))}
                </select>
                <select
                  value={toD}
                  onChange={(e) => setToD(e.target.value)}
                  className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
                >
                  {BUILDINGS.map((b) => (
                    <option key={b.id} value={b.id}>
                      To: {b.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <input
                  value={hSum}
                  onChange={(e) => setHSum(e.target.value)}
                  placeholder="Article VI handoff note..."
                  className="flex-1 px-2 py-1.5 rounded bg-white border border-[#b89259]"
                />
                <button
                  onClick={async () => {
                    if (!hSum.trim()) return;
                    const row: HandoffNoticeItem = {
                      id: `ho_${Date.now().toString(36)}`,
                      fromDept: fromD,
                      toDept: toD,
                      summary: hSum.trim(),
                      date: new Date().toISOString().slice(0, 10),
                    };
                    await saveNext({ ...data, handoffs: [row, ...data.handoffs] });
                    setHSum('');
                  }}
                  className="px-3 py-1.5 rounded bg-[#362316] text-[#fbe8b5] font-bold cursor-pointer"
                >
                  Log Handoff
                </button>
              </div>
            </div>
          )}
          {data.handoffs.map((h) => (
            <div key={h.id} className="p-2.5 rounded-xl bg-white/85 border border-[#b89259]">
              <div className="text-[10px] font-bold text-[#7c5021]">
                {h.fromDept} → {h.toDept} · {h.date}
              </div>
              <div className="text-[#331d0b]">{h.summary}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
