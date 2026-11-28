import { useEffect, useState } from 'react';
import type { CampusRole } from '../../firebase';
import {
  INITIAL_STOCKS_DOC,
  saveStocksWorkspace,
  subscribeStocksWorkspace,
  type StockNoteItem,
  type StocksWorkspaceDoc,
  type StockWatchItem,
} from '../../services/departmentWorkspacesService';

interface StocksInteriorProps {
  role: CampusRole;
  userEmail: string;
}

export function StocksInterior({ role, userEmail }: StocksInteriorProps) {
  const canEdit = role === 'chancellor' || role === 'university';
  const [tab, setTab] = useState<'watchlist' | 'charter'>('watchlist');
  const [data, setData] = useState<StocksWorkspaceDoc>(INITIAL_STOCKS_DOC);
  const [syncErr, setSyncErr] = useState<string | null>(null);

  const [ticker, setTicker] = useState('');
  const [thesis, setThesis] = useState('');
  const [catalysts, setCatalysts] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');

  useEffect(() => {
    return subscribeStocksWorkspace(setData, (e) => setSyncErr(e.message));
  }, []);

  async function saveNext(next: StocksWorkspaceDoc) {
    if (!canEdit) return;
    setData(next);
    await saveStocksWorkspace(next, userEmail);
  }

  return (
    <div className="space-y-3 text-xs">
      <div className="p-3 rounded-xl bg-[#fff8e7] border border-[#b08647] space-y-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="font-atlas font-bold text-sm text-[#4a2b0f]">
            📈 Article VIII Research Desk &amp; Walled MCP Exception
          </div>
          <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-amber-400 text-amber-200 text-[10px] font-bold">
            ⏸️ Agents Offline (Pending Constitution)
          </span>
        </div>
        <p className="text-[#54371b]">
          Stored strictly inside <code>private_stocks/</code> (Amarette &amp; Ray only). Live trades are
          prohibited across Stocks except GrokBot inside a dedicated walled Robinhood MCP account under
          explicit Chancellor-approved hard trading rules.
        </p>
      </div>

      {syncErr && <div className="p-2 rounded bg-red-100 text-red-900">{syncErr}</div>}

      <div className="flex flex-wrap gap-1.5 border-b border-[#cfa96e] pb-2">
        <button
          onClick={() => setTab('watchlist')}
          className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
            tab === 'watchlist' ? 'bg-[#362316] text-[#fbe8b5]' : 'bg-[#f4e4c1] text-[#4a2b0f]'
          }`}
        >
          📊 Watchlist &amp; Research ({data.watchlist.length})
        </button>
        <button
          onClick={() => setTab('charter')}
          className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
            tab === 'charter' ? 'bg-[#362316] text-[#fbe8b5]' : 'bg-[#f4e4c1] text-[#4a2b0f]'
          }`}
        >
          🛡️ Walled MCP Hard Rules Charter
        </button>
      </div>

      {tab === 'watchlist' && (
        <div className="space-y-3">
          {canEdit && (
            <div className="p-3 rounded-xl bg-[#f7ead0] border border-[#b08647] grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                placeholder="Ticker (e.g., NVDA)"
                className="px-2 py-1.5 rounded bg-white border border-[#b89259] font-bold"
              />
              <input
                value={thesis}
                onChange={(e) => setThesis(e.target.value)}
                placeholder="Research thesis"
                className="sm:col-span-2 px-2 py-1.5 rounded bg-white border border-[#b89259]"
              />
              <div className="flex gap-1.5">
                <input
                  value={catalysts}
                  onChange={(e) => setCatalysts(e.target.value)}
                  placeholder="Catalysts / notes"
                  className="flex-1 px-2 py-1.5 rounded bg-white border border-[#b89259]"
                />
                <button
                  onClick={async () => {
                    if (!ticker.trim()) return;
                    const item: StockWatchItem = {
                      id: `stk_${Date.now().toString(36)}`,
                      ticker: ticker.trim(),
                      thesis: thesis.trim(),
                      catalysts: catalysts.trim(),
                      status: 'Researching',
                    };
                    await saveNext({ ...data, watchlist: [item, ...data.watchlist] });
                    setTicker('');
                    setThesis('');
                    setCatalysts('');
                  }}
                  className="px-3 py-1.5 rounded bg-[#362316] text-[#fbe8b5] font-bold cursor-pointer"
                >
                  ＋
                </button>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            {data.watchlist.length === 0 ? (
              <div className="p-3 rounded-xl bg-white/75 border border-[#c9a86a] text-center text-[#6b4b28]">
                No watchlist tickers saved yet.
              </div>
            ) : (
              data.watchlist.map((w) => (
                <div
                  key={w.id}
                  className="p-2.5 rounded-xl bg-white/85 border border-[#b89259] flex items-start justify-between gap-2"
                >
                  <div>
                    <div className="font-bold text-[#331d0b]">
                      {w.ticker}{' '}
                      <span className="ml-1 px-2 py-0.5 rounded-full bg-[#efe0bc] text-[10px]">
                        {w.status}
                      </span>
                    </div>
                    {w.thesis && <div className="text-[#3b2410]">{w.thesis}</div>}
                    {w.catalysts && <div className="text-[11px] text-[#6b4b28]">Catalysts: {w.catalysts}</div>}
                  </div>
                  {canEdit && (
                    <button
                      onClick={() =>
                        void saveNext({
                          ...data,
                          watchlist: data.watchlist.filter((x) => x.id !== w.id),
                        })
                      }
                      className="text-red-700 font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Research Notes */}
          {canEdit && (
            <div className="p-3 rounded-xl bg-[#f7ead0] border border-[#b08647] space-y-2">
              <div className="font-bold text-[#3c230f]">Add Earnings / Market Brief Note</div>
              <input
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Note title"
                className="w-full px-2 py-1.5 rounded bg-white border border-[#b89259]"
              />
              <textarea
                rows={2}
                value={noteBody}
                onChange={(e) => setNoteBody(e.target.value)}
                placeholder="Key numbers, risk notes, questions..."
                className="w-full px-2 py-1.5 rounded bg-white border border-[#b89259]"
              />
              <button
                onClick={async () => {
                  if (!noteTitle.trim()) return;
                  const n: StockNoteItem = {
                    id: `sn_${Date.now().toString(36)}`,
                    title: noteTitle.trim(),
                    date: new Date().toISOString().slice(0, 10),
                    body: noteBody.trim(),
                  };
                  await saveNext({ ...data, researchNotes: [n, ...data.researchNotes] });
                  setNoteTitle('');
                  setNoteBody('');
                }}
                className="px-3 py-1.5 rounded bg-[#362316] text-[#fbe8b5] font-bold cursor-pointer"
              >
                Save Research Note
              </button>
            </div>
          )}

          {data.researchNotes.map((n) => (
            <div key={n.id} className="p-2.5 rounded-xl bg-white/85 border border-[#b89259] space-y-1">
              <div className="flex justify-between font-bold text-[#331d0b]">
                <span>{n.title}</span>
                <span className="text-[10px] text-[#7c5021]">{n.date}</span>
              </div>
              <p className="text-[#4a2f17] whitespace-pre-wrap">{n.body}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'charter' && (
        <div className="p-3 rounded-xl bg-white/90 border border-[#b89259] space-y-2.5">
          <div className="font-bold text-sm text-[#331d0b]">
            Walled Robinhood MCP Hard Trading Rules (Pre-Activation Draft)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label className="block">
              <span className="font-bold text-[#6b4b28]">Designated Walled Agent</span>
              <input
                disabled={!canEdit}
                value={data.mcpRulesDraft.designatedAgent}
                onChange={(e) =>
                  void saveNext({
                    ...data,
                    mcpRulesDraft: { ...data.mcpRulesDraft, designatedAgent: e.target.value },
                  })
                }
                className="mt-0.5 w-full px-2 py-1.5 rounded border border-[#b89259] bg-white"
              />
            </label>
            <label className="block">
              <span className="font-bold text-[#6b4b28]">Allowed Assets Scope</span>
              <input
                disabled={!canEdit}
                value={data.mcpRulesDraft.allowedAssets}
                onChange={(e) =>
                  void saveNext({
                    ...data,
                    mcpRulesDraft: { ...data.mcpRulesDraft, allowedAssets: e.target.value },
                  })
                }
                className="mt-0.5 w-full px-2 py-1.5 rounded border border-[#b89259] bg-white"
              />
            </label>
            <label className="block">
              <span className="font-bold text-[#6b4b28]">Max Order Size ($)</span>
              <input
                disabled={!canEdit}
                value={data.mcpRulesDraft.maxOrderUsd}
                onChange={(e) =>
                  void saveNext({
                    ...data,
                    mcpRulesDraft: { ...data.mcpRulesDraft, maxOrderUsd: e.target.value },
                  })
                }
                placeholder="e.g., 50"
                className="mt-0.5 w-full px-2 py-1.5 rounded border border-[#b89259] bg-white"
              />
            </label>
            <label className="block">
              <span className="font-bold text-[#6b4b28]">Daily Loss Cap ($)</span>
              <input
                disabled={!canEdit}
                value={data.mcpRulesDraft.dailyLossCapUsd}
                onChange={(e) =>
                  void saveNext({
                    ...data,
                    mcpRulesDraft: { ...data.mcpRulesDraft, dailyLossCapUsd: e.target.value },
                  })
                }
                placeholder="e.g., 100"
                className="mt-0.5 w-full px-2 py-1.5 rounded border border-[#b89259] bg-white"
              />
            </label>
          </div>
          <label className="flex items-center gap-2 font-bold text-[#3c230f]">
            <input
              type="checkbox"
              disabled={!canEdit}
              checked={data.mcpRulesDraft.emergencyPauseEnabled}
              onChange={(e) =>
                void saveNext({
                  ...data,
                  mcpRulesDraft: {
                    ...data.mcpRulesDraft,
                    emergencyPauseEnabled: e.target.checked,
                  },
                })
              }
            />
            Emergency Circuit Breaker Active (Police Station can pause immediately)
          </label>
          <textarea
            rows={3}
            disabled={!canEdit}
            value={data.mcpRulesDraft.notes}
            onChange={(e) =>
              void saveNext({
                ...data,
                mcpRulesDraft: { ...data.mcpRulesDraft, notes: e.target.value },
              })
            }
            className="w-full px-2.5 py-1.5 rounded border border-[#b89259] bg-white"
          />
        </div>
      )}
    </div>
  );
}
