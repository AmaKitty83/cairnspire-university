import { useState } from 'react';
import type { CampusRole } from '../../firebase';
import { BUILDINGS } from '../../data/campusData';
import { TOWN_HALL_COMMITTEES } from '../../data/departmentRosters';
import {
  BRANCH_PREP_REPORTS,
  CONSTITUTION_WORKING_OUTLINE,
  CONVENTION_RULES_OF_ORDER,
} from '../../data/governmentConventionPrep';
import {
  createProposal,
  decideProposalGate2,
  formatTimestamp,
  isCampusConstitutionRatified,
  saveSkillRecord,
  type GovernanceProposal,
  type SkillRegistryRecord,
  type SkillScope,
  type SkillStatus,
} from '../../services/firestoreService';
import { BillOfRightsReader } from '../BillOfRightsReader';
import { BranchPrepPanel } from './BranchPrepPanel';
import { OfflineRosterPanel } from './OfflineRosterPanel';

interface TownHallInteriorProps {
  role: CampusRole;
  userEmail: string;
  proposals: GovernanceProposal[];
  skills: SkillRegistryRecord[];
}

export function TownHallInterior({
  role,
  userEmail,
  proposals,
  skills,
}: TownHallInteriorProps) {
  const [tab, setTab] = useState<'convention' | 'charter' | 'committees' | 'proposals' | 'skills'>('convention');
  const [showFullCharter, setShowFullCharter] = useState(false);

  // Proposal form state
  const [propTitle, setPropTitle] = useState('');
  const [propArticle, setPropArticle] = useState('');
  const [propDept, setPropDept] = useState('town-hall');
  const [propSummary, setPropSummary] = useState('');
  const [propBody, setPropBody] = useState('');
  const [propBusy, setPropBusy] = useState(false);
  const [propMsg, setPropMsg] = useState<string | null>(null);

  // Skill form state
  const [skillName, setSkillName] = useState('');
  const [skillScope, setSkillScope] = useState<SkillScope>('campus');
  const [skillDept, setSkillDept] = useState('town-hall');
  const [skillStatus, setSkillStatus] = useState<SkillStatus>('active');
  const [skillLocation, setSkillLocation] = useState('');
  const [skillDesc, setSkillDesc] = useState('');
  const [skillBusy, setSkillBusy] = useState(false);

  const canWrite = role === 'chancellor' || role === 'university';
  const isChancellor = role === 'chancellor';
  const constitutionActive = isCampusConstitutionRatified(proposals);

  async function handleCreateProposal(e: React.FormEvent) {
    e.preventDefault();
    if (!propTitle.trim() || !propSummary.trim() || !propBody.trim()) return;
    setPropBusy(true);
    setPropMsg(null);
    try {
      await createProposal(
        {
          title: propTitle,
          articleRef: propArticle,
          summary: propSummary,
          body: propBody,
          proposedByDept: propDept,
        },
        userEmail
      );
      setPropTitle('');
      setPropArticle('');
      setPropSummary('');
      setPropBody('');
      setPropMsg('Proposal submitted for Gate 1 Audit & Gate 2 Chancellor Ratification.');
    } catch (err: unknown) {
      setPropMsg(err instanceof Error ? err.message : 'Failed to submit proposal.');
    } finally {
      setPropBusy(false);
    }
  }

  async function handleGate2(p: GovernanceProposal, decision: 'ratified' | 'rejected') {
    setPropBusy(true);
    setPropMsg(null);
    try {
      await decideProposalGate2(p.id, p.title, decision, userEmail);
    } catch (err: unknown) {
      setPropMsg(err instanceof Error ? err.message : 'Could not update Gate 2 status.');
    } finally {
      setPropBusy(false);
    }
  }

  async function handleAddSkill(e: React.FormEvent) {
    e.preventDefault();
    if (!skillName.trim() || !skillDesc.trim()) return;
    setSkillBusy(true);
    try {
      const slug = skillName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 60) || `skill-${Date.now()}`;
      await saveSkillRecord(
        slug,
        {
          name: skillName,
          scope: skillScope,
          departmentId: skillDept,
          description: skillDesc,
          status: skillStatus,
          location: skillLocation,
        },
        userEmail
      );
      setSkillName('');
      setSkillDesc('');
      setSkillLocation('');
    } finally {
      setSkillBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      {/* Sub-navigation tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-[#cfa96e] pb-2">
        {(
          [
            ['convention', '🏛️ Convention Prep'],
            ['charter', '📜 Bill of Rights'],
            ['committees', `🏛️ Committees (${TOWN_HALL_COMMITTEES.length})`],
            ['proposals', `⚖️ Constitution & Amendments (${proposals.length})`],
            ['skills', `📚 Skills Registry (${skills.length})`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              tab === id
                ? 'bg-[#362316] text-[#fbe8b5] shadow-sm'
                : 'bg-[#f4e4c1] hover:bg-[#ebd3a0] text-[#4a2b0f]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'convention' && (
        <div className="space-y-3 text-xs">
          <BranchPrepPanel
            report={BRANCH_PREP_REPORTS['town-hall']}
            extraTitle="⚖️ Proposed Constitutional Convention Rules of Order"
            extraItems={CONVENTION_RULES_OF_ORDER}
          />

          <div className="p-3 rounded-xl bg-[#fff8e7] border border-[#b08647] space-y-2">
            <div className="font-atlas font-bold text-sm text-[#3c230f]">
              📜 Working Outline — Full Campus Constitution (Articles I–XII)
            </div>
            <div className="space-y-1.5">
              {CONSTITUTION_WORKING_OUTLINE.map((art) => (
                <div
                  key={art.article}
                  className="p-2.5 rounded-lg bg-white/90 border border-[#cfa96e] space-y-1"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-bold text-[#2e1e0f]">
                      {art.article} — {art.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#efe0bc] text-[#4a2b0f] text-[10px] font-semibold">
                      {art.sponsors}
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-900">
                    <strong>✅ IN:</strong> {art.mustIncludeSummary}
                  </div>
                  <div className="text-[11px] text-red-900">
                    <strong>🚫 OUT:</strong> {art.mustExcludeSummary}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'charter' && (
        <div className="p-3 rounded-xl bg-[#fff8e7] border border-[#b08647] space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="font-atlas font-bold text-sm text-[#4a2b0f]">
              Preliminary Bill of Rights — Stage 0
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-400 text-emerald-900 text-[11px] font-bold">
              RATIFIED · 2026-11-25
            </span>
          </div>
          <p className="text-xs text-[#54371b]">
            Gate 1 (Antigravity Audit): <span className="font-bold text-emerald-700">Passed</span> ·
            Gate 2 (Chancellor Amarette):{' '}
            <span className="font-bold text-emerald-700">Ratified &amp; Active</span>
          </p>
          <div>
            <span
              className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                constitutionActive
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                  : 'bg-emerald-950 border-emerald-400 text-emerald-100'
              }`}
            >
              {constitutionActive
                ? '✅ Campus Constitution Ratified · Agents Authorized'
                : '🟢 Stage 1: 3 Government Branches Online (18 Agents) · Non-Government Depts Standby'}
            </span>
          </div>
          <button
            onClick={() => setShowFullCharter((s) => !s)}
            className="px-3 py-1.5 rounded-lg bg-[#6b4423] hover:bg-[#7e512a] text-[#fbe8b5] text-xs font-semibold cursor-pointer"
          >
            {showFullCharter
              ? 'Hide Full Ratified Bill of Rights ▲'
              : 'Read Full Ratified Bill of Rights (All 10 Articles & Subpoints) ▼'}
          </button>
          {showFullCharter && <BillOfRightsReader />}
        </div>
      )}

      {tab === 'committees' && (
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-[#fff8e7] border border-[#b08647] space-y-2">
            <div className="font-atlas font-bold text-sm text-[#4a2b0f]">
              🏛️ Congressional Committees (Town Hall Legislative Arm)
            </div>
            <p className="text-[#54371b]">
              Standing committees meet inside Town Hall to draft, review, and refine policies across
              all 13 departments before presenting bills to Congress and submitting them for Two-Gate
              Lawmaking.
            </p>
            <div className="space-y-1.5">
              {TOWN_HALL_COMMITTEES.map((c) => (
                <div
                  key={c.id}
                  className="p-2.5 rounded-lg bg-white/85 border border-[#cfa96e] space-y-0.5"
                >
                  <div className="font-bold text-[#331d0b]">{c.name}</div>
                  <div className="text-[11px] text-[#54371b]">{c.focus}</div>
                </div>
              ))}
            </div>
          </div>
          <OfflineRosterPanel
            deptId="town-hall"
            heading="📜 Town Hall Legislative Staff (Online · Convention Prep)"
            isOnline={true}
          />
        </div>
      )}

      {tab === 'proposals' && (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-[#fff8e7] border border-[#b08647] space-y-2 text-xs text-[#54371b]">
            <div>
              <strong>Two-Gate Lawmaking (Article I.2):</strong> Every Campus Constitution article
              and amendment requires <strong>Gate 1 (Antigravity Audit)</strong> followed by{' '}
              <strong>Gate 2 (Chancellor Amarette Ratification)</strong>.
            </div>
            <div>
              <span
                className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                  constitutionActive
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                    : 'bg-emerald-950 border-emerald-400 text-emerald-100'
                }`}
              >
                {constitutionActive
                  ? '✅ Campus Constitution Ratified · Agents Authorized'
                  : '🟢 Stage 1: 3 Government Branches Online (18 Agents) · Non-Government Depts Standby'}
              </span>
            </div>
          </div>

          {propMsg && (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-xs text-emerald-900">
              {propMsg}
            </div>
          )}

          {proposals.length === 0 ? (
            <div className="p-4 rounded-xl bg-white/60 border border-[#c9a86a] text-xs text-[#6b4b28] text-center">
              No Constitutional Convention proposals filed yet.
              {canWrite ? ' Draft the first proposal below!' : ''}
            </div>
          ) : (
            <div className="space-y-2.5">
              {proposals.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-white/80 border border-[#b89259] space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <div className="font-atlas font-bold text-sm text-[#331d0b]">{p.title}</div>
                      <div className="text-[11px] text-[#7c5021]">
                        {p.articleRef ? `${p.articleRef} · ` : ''}Proposed by{' '}
                        <strong>{p.proposedByDept}</strong> · {formatTimestamp(p.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-[#efe0bc] text-[#4a2b0f] text-[10px] font-bold uppercase">
                        Gate 1: {p.gate1Status}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          p.gate2Status === 'ratified'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-400'
                            : p.gate2Status === 'rejected'
                              ? 'bg-red-100 text-red-900 border border-red-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        Gate 2: {p.gate2Status}
                      </span>
                    </div>
                  </div>
                  <p className="font-medium text-[#3b2410]">{p.summary}</p>
                  <p className="text-[#54371b] whitespace-pre-wrap leading-relaxed bg-[#fbf5e6] p-2.5 rounded-lg border border-[#dfC697]">
                    {p.body}
                  </p>
                  {p.gate1Notes && (
                    <div className="text-[11px] text-[#6b4b28] bg-[#f7ead0]/70 px-2.5 py-1.5 rounded-lg border border-[#d6b880]">
                      <strong>Gate 1 Audit Note:</strong> {p.gate1Notes}
                    </div>
                  )}
                  {isChancellor && p.gate2Status === 'pending' && (() => {
                    const gate1Ready = p.gate1Status === 'passed' || p.gate1Status === 'approved';
                    return (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          disabled={propBusy || !gate1Ready}
                          onClick={() => void handleGate2(p, 'ratified')}
                          title={
                            gate1Ready
                              ? 'Sign and ratify into Campus Governance'
                              : 'Gate 1 Antigravity Audit must pass before Gate 2 Ratification'
                          }
                          className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                        >
                          ✓ Ratify (Gate 2)
                        </button>
                        <button
                          disabled={propBusy}
                          onClick={() => void handleGate2(p, 'rejected')}
                          className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                        >
                          ✕ Reject
                        </button>
                        {!gate1Ready && (
                          <span className="text-[11px] text-amber-900 font-medium">
                            Gate 1 Antigravity Audit must pass before Gate 2 Ratification.
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ))}
            </div>
          )}

          {canWrite && (
            <form
              onSubmit={(e) => void handleCreateProposal(e)}
              className="p-3 rounded-xl bg-[#f7ead0] border border-[#b08647] space-y-2.5 text-xs"
            >
              <div className="font-atlas font-bold text-sm text-[#3c230f]">
                Draft New Constitution Article / Amendment
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  required
                  value={propTitle}
                  onChange={(e) => setPropTitle(e.target.value)}
                  placeholder="Proposal title (e.g., Campus Guest Read-Only Charter)"
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-[#b89259]"
                />
                <input
                  value={propArticle}
                  onChange={(e) => setPropArticle(e.target.value)}
                  placeholder="Reference (e.g., Article III.1 Amendment)"
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-[#b89259]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select
                  value={propDept}
                  onChange={(e) => setPropDept(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-[#b89259]"
                >
                  {BUILDINGS.filter((b) => b.id !== 'commons').map((b) => (
                    <option key={b.id} value={b.id}>
                      Sponsor: {b.name}
                    </option>
                  ))}
                </select>
                <input
                  required
                  value={propSummary}
                  onChange={(e) => setPropSummary(e.target.value)}
                  placeholder="One-line summary"
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-[#b89259]"
                />
              </div>
              <textarea
                required
                rows={3}
                value={propBody}
                onChange={(e) => setPropBody(e.target.value)}
                placeholder="Full proposed wording..."
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#b89259]"
              />
              <button
                type="submit"
                disabled={propBusy}
                className="px-3.5 py-1.5 rounded-lg bg-[#362316] hover:bg-[#4e3320] text-[#fbe8b5] font-semibold cursor-pointer disabled:opacity-50"
              >
                {propBusy ? 'Submitting…' : 'Submit Proposal to Town Hall'}
              </button>
            </form>
          )}
        </div>
      )}

      {tab === 'skills' && (
        <div className="space-y-3">
          <div className="space-y-2">
            {skills.map((s) => (
              <div
                key={s.id}
                className="p-3 rounded-xl bg-white/80 border border-[#b89259] text-xs space-y-1"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-bold text-[#331d0b]">{s.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-[#efe0bc] text-[#4a2b0f] text-[10px] font-bold uppercase">
                      {s.scope}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase">
                      {s.status}
                    </span>
                  </div>
                </div>
                <p className="text-[#4a2f17]">{s.description}</p>
                {s.location && (
                  <div className="font-mono text-[11px] text-[#7c5021] truncate">{s.location}</div>
                )}
              </div>
            ))}
          </div>

          {canWrite && (
            <form
              onSubmit={(e) => void handleAddSkill(e)}
              className="p-3 rounded-xl bg-[#f7ead0] border border-[#b08647] space-y-2 text-xs"
            >
              <div className="font-atlas font-bold text-sm text-[#3c230f]">
                Register Skill or Rule
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  required
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="Skill name"
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-[#b89259]"
                />
                <input
                  value={skillLocation}
                  onChange={(e) => setSkillLocation(e.target.value)}
                  placeholder="Path or repo location"
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-[#b89259]"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={skillScope}
                  onChange={(e) => setSkillScope(e.target.value as SkillScope)}
                  className="px-2 py-1.5 rounded-lg bg-white border border-[#b89259]"
                >
                  <option value="campus">Campus</option>
                  <option value="department">Department</option>
                  <option value="local">Local</option>
                  <option value="external">External</option>
                  <option value="restricted">Restricted</option>
                </select>
                <select
                  value={skillDept}
                  onChange={(e) => setSkillDept(e.target.value)}
                  className="px-2 py-1.5 rounded-lg bg-white border border-[#b89259]"
                >
                  {BUILDINGS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
                <select
                  value={skillStatus}
                  onChange={(e) => setSkillStatus(e.target.value as SkillStatus)}
                  className="px-2 py-1.5 rounded-lg bg-white border border-[#b89259]"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="under_review">Under Review</option>
                </select>
              </div>
              <textarea
                required
                rows={2}
                value={skillDesc}
                onChange={(e) => setSkillDesc(e.target.value)}
                placeholder="What does this skill govern or enable?"
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#b89259]"
              />
              <button
                type="submit"
                disabled={skillBusy}
                className="px-3.5 py-1.5 rounded-lg bg-[#362316] hover:bg-[#4e3320] text-[#fbe8b5] font-semibold cursor-pointer disabled:opacity-50"
              >
                {skillBusy ? 'Saving…' : 'Register Skill'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
