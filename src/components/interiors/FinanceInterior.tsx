import { useEffect, useState } from 'react';
import type { CampusRole } from '../../firebase';
import {
  INITIAL_FINANCE_DOC,
  saveFinanceWorkspace,
  subscribeFinanceWorkspace,
  type BillRow,
  type BudgetRow,
  type FinanceWorkspaceDoc,
  type SavingsGoalRow,
} from '../../services/departmentWorkspacesService';

interface FinanceInteriorProps {
  role: CampusRole;
  userEmail: string;
}

export function FinanceInterior({ role, userEmail }: FinanceInteriorProps) {
  const canEdit = role === 'chancellor' || role === 'university';
  const [tab, setTab] = useState<'budgets' | 'bills' | 'savings'>('budgets');
  const [data, setData] = useState<FinanceWorkspaceDoc>(INITIAL_FINANCE_DOC);
  const [syncErr, setSyncErr] = useState<string | null>(null);

  const [bCat, setBCat] = useState('');
  const [bScope, setBScope] = useState<BudgetRow['scope']>('Bramblewood / Business');
  const [bTarget, setBTarget] = useState('');

  const [billName, setBillName] = useState('');
  const [billAmt, setBillAmt] = useState('');
  const [billDue, setBillDue] = useState('');
  const [billAuto, setBillAuto] = useState(true);

  const [savGoal, setSavGoal] = useState('');
  const [savCur, setSavCur] = useState('');
  const [savTgt, setSavTgt] = useState('');

  useEffect(() => {
    return subscribeFinanceWorkspace(setData, (e) => setSyncErr(e.message));
  }, []);

  async function saveNext(next: FinanceWorkspaceDoc) {
    if (!canEdit) return;
    setData(next);
    await saveFinanceWorkspace(next, userEmail);
  }

  return (
    <div className="space-y-3 text-xs">
      <div className="p-3 rounded-xl bg-[#fff8e7] border border-[#b08647] flex flex-wrap items-center justify-between gap-2">
        <div className="text-[#54371b]">
          <strong>Business &amp; Publishing Treasury:</strong> Stored strictly in{' '}
          <code>private_finance/</code> (Amarette &amp; Ray only — tracks{' '}
          <strong>Children’s Books, Sparrow &amp; Sprocket &amp; Social Media</strong> P&amp;L and
          subscriptions; personal household bills stay outside Cairnspire).
        </div>
        <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-amber-400 text-amber-200 text-[10px] font-bold">
          ⏸️ 2-Agent Treasury Standby · Pending Constitution
        </span>
      </div>

      {syncErr && <div className="p-2 rounded bg-red-100 text-red-900">{syncErr}</div>}

      <div className="flex flex-wrap gap-1.5 border-b border-[#cfa96e] pb-2">
        <button
          onClick={() => setTab('budgets')}
          className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
            tab === 'budgets' ? 'bg-[#362316] text-[#fbe8b5]' : 'bg-[#f4e4c1] text-[#4a2b0f]'
          }`}
        >
          📊 Budgets ({data.budgets.length})
        </button>
        <button
          onClick={() => setTab('bills')}
          className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
            tab === 'bills' ? 'bg-[#362316] text-[#fbe8b5]' : 'bg-[#f4e4c1] text-[#4a2b0f]'
          }`}
        >
          🧾 Bills &amp; Subscriptions ({data.bills.length})
        </button>
        <button
          onClick={() => setTab('savings')}
          className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
            tab === 'savings' ? 'bg-[#362316] text-[#fbe8b5]' : 'bg-[#f4e4c1] text-[#4a2b0f]'
          }`}
        >
          🏦 Savings Goals ({data.savingsGoals.length})
        </button>
      </div>

      {tab === 'budgets' && (
        <div className="space-y-2.5">
          {canEdit && (
            <div className="p-3 rounded-xl bg-[#f7ead0] border border-[#b08647] grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                value={bCat}
                onChange={(e) => setBCat(e.target.value)}
                placeholder="Category (e.g., KDP Print Proofs)"
                className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
              />
              <select
                value={bScope}
                onChange={(e) => setBScope(e.target.value as BudgetRow['scope'])}
                className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
              >
                <option>Bramblewood / Business</option>
                <option>Social Media &amp; Printables</option>
                <option>Software &amp; Tooling</option>
                <option>Tax Reserve &amp; Savings</option>
              </select>
              <input
                value={bTarget}
                onChange={(e) => setBTarget(e.target.value)}
                placeholder="Monthly target ($)"
                className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
              />
              <button
                onClick={async () => {
                  if (!bCat.trim()) return;
                  const row: BudgetRow = {
                    id: `bd_${Date.now().toString(36)}`,
                    category: bCat.trim(),
                    scope: bScope,
                    monthlyTarget: bTarget.trim(),
                    notes: '',
                  };
                  await saveNext({ ...data, budgets: [...data.budgets, row] });
                  setBCat('');
                  setBTarget('');
                }}
                className="px-3 py-1.5 rounded bg-[#362316] text-[#fbe8b5] font-bold cursor-pointer"
              >
                ＋ Add Budget Line
              </button>
            </div>
          )}
          {data.budgets.map((b) => (
            <div
              key={b.id}
              className="p-2.5 rounded-xl bg-white/85 border border-[#b89259] flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-[#331d0b]">{b.category}</span>{' '}
                <span className="px-1.5 py-0.5 rounded bg-[#efe0bc] text-[10px]">{b.scope}</span>
                {b.monthlyTarget && <strong className="ml-2">${b.monthlyTarget}/mo</strong>}
              </div>
              {canEdit && (
                <button
                  onClick={() =>
                    void saveNext({ ...data, budgets: data.budgets.filter((x) => x.id !== b.id) })
                  }
                  className="text-red-700 font-bold cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'bills' && (
        <div className="space-y-2.5">
          {canEdit && (
            <div className="p-3 rounded-xl bg-[#f7ead0] border border-[#b08647] grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                value={billName}
                onChange={(e) => setBillName(e.target.value)}
                placeholder="Bill / subscription"
                className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
              />
              <input
                value={billAmt}
                onChange={(e) => setBillAmt(e.target.value)}
                placeholder="Amount ($)"
                className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
              />
              <input
                value={billDue}
                onChange={(e) => setBillDue(e.target.value)}
                placeholder="Due day (e.g., 15th)"
                className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
              />
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1 font-semibold">
                  <input
                    type="checkbox"
                    checked={billAuto}
                    onChange={(e) => setBillAuto(e.target.checked)}
                  />
                  Auto
                </label>
                <button
                  onClick={async () => {
                    if (!billName.trim()) return;
                    const row: BillRow = {
                      id: `bl_${Date.now().toString(36)}`,
                      name: billName.trim(),
                      amount: billAmt.trim(),
                      dueDay: billDue.trim(),
                      autopay: billAuto,
                      category: '',
                    };
                    await saveNext({ ...data, bills: [...data.bills, row] });
                    setBillName('');
                    setBillAmt('');
                    setBillDue('');
                  }}
                  className="flex-1 px-2 py-1.5 rounded bg-[#362316] text-[#fbe8b5] font-bold cursor-pointer"
                >
                  ＋ Add
                </button>
              </div>
            </div>
          )}
          {data.bills.map((b) => (
            <div
              key={b.id}
              className="p-2.5 rounded-xl bg-white/85 border border-[#b89259] flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-[#331d0b]">{b.name}</span> · ${b.amount || '0'} ·{' '}
                <span>{b.dueDay || 'TBD'}</span> ·{' '}
                <span className="text-[10px] font-bold">{b.autopay ? 'Autopay' : 'Manual'}</span>
              </div>
              {canEdit && (
                <button
                  onClick={() =>
                    void saveNext({ ...data, bills: data.bills.filter((x) => x.id !== b.id) })
                  }
                  className="text-red-700 font-bold cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'savings' && (
        <div className="space-y-2.5">
          {canEdit && (
            <div className="p-3 rounded-xl bg-[#f7ead0] border border-[#b08647] grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                value={savGoal}
                onChange={(e) => setSavGoal(e.target.value)}
                placeholder="Savings goal"
                className="sm:col-span-2 px-2 py-1.5 rounded bg-white border border-[#b89259]"
              />
              <input
                value={savCur}
                onChange={(e) => setSavCur(e.target.value)}
                placeholder="Saved so far ($)"
                className="px-2 py-1.5 rounded bg-white border border-[#b89259]"
              />
              <div className="flex gap-1.5">
                <input
                  value={savTgt}
                  onChange={(e) => setSavTgt(e.target.value)}
                  placeholder="Target ($)"
                  className="flex-1 px-2 py-1.5 rounded bg-white border border-[#b89259]"
                />
                <button
                  onClick={async () => {
                    if (!savGoal.trim()) return;
                    const row: SavingsGoalRow = {
                      id: `sg_${Date.now().toString(36)}`,
                      goal: savGoal.trim(),
                      currentAmount: savCur.trim(),
                      targetAmount: savTgt.trim(),
                      notes: '',
                    };
                    await saveNext({ ...data, savingsGoals: [...data.savingsGoals, row] });
                    setSavGoal('');
                    setSavCur('');
                    setSavTgt('');
                  }}
                  className="px-3 py-1.5 rounded bg-[#362316] text-[#fbe8b5] font-bold cursor-pointer"
                >
                  ＋
                </button>
              </div>
            </div>
          )}
          {data.savingsGoals.map((s) => (
            <div
              key={s.id}
              className="p-2.5 rounded-xl bg-white/85 border border-[#b89259] flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-[#331d0b]">{s.goal}</span> — ${s.currentAmount || '0'}{' '}
                / ${s.targetAmount || '0'}
              </div>
              {canEdit && (
                <button
                  onClick={() =>
                    void saveNext({
                      ...data,
                      savingsGoals: data.savingsGoals.filter((x) => x.id !== s.id),
                    })
                  }
                  className="text-red-700 font-bold cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
