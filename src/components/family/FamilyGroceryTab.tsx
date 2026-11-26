import { useState } from 'react';
import type { FamilyPersonProfile, GroceryItem } from '../../services/familyHubService';

interface FamilyGroceryTabProps {
  activePerson: FamilyPersonProfile;
  canEdit: boolean;
  items: GroceryItem[];
  onToggleGot: (id: string) => Promise<void>;
  onAddItem: (input: { item: string; qty: string; category: string; store: string }) => Promise<void>;
  onClearGot: () => Promise<void>;
}

export function FamilyGroceryTab({
  activePerson,
  canEdit,
  items,
  onToggleGot,
  onAddItem,
  onClearGot,
}: FamilyGroceryTabProps) {
  const [newItem, setNewItem] = useState('');
  const [newQty, setNewQty] = useState('');
  const [newCat, setNewCat] = useState('Produce');
  const [newStore, setNewStore] = useState('Walmart');

  async function submitItem() {
    if (!canEdit || !newItem.trim()) return;
    await onAddItem({
      item: newItem.trim(),
      qty: newQty.trim(),
      category: newCat.trim() || 'Other',
      store: newStore.trim(),
    });
    setNewItem('');
    setNewQty('');
  }

  const remaining = items.filter((i) => !i.got);
  const checked = items.filter((i) => i.got);

  const categories = Array.from(new Set(remaining.map((i) => i.category || 'Other'))).sort();

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-atlas text-lg font-bold text-[#1b4332]">🛒 Grocery List</h2>
            <p className="text-xs text-[#40916c]">
              {remaining.length} needed · {checked.length} in cart
            </p>
          </div>
          {canEdit && checked.length > 0 && (
            <button
              onClick={() => void onClearGot()}
              className="px-3 py-1.5 rounded-lg bg-[#fef3c7] text-[#92400e] border border-[#fde68a] text-xs font-bold cursor-pointer"
            >
              Clear Checked ({checked.length})
            </button>
          )}
        </div>

        {canEdit && (
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 p-3 rounded-xl bg-[#f4fbf6] border border-[#dcefe2] text-xs">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={`Add item (${activePerson.name})...`}
              className="sm:col-span-2 px-2.5 py-1.5 rounded border border-[#95d5b2] bg-white"
            />
            <input
              type="text"
              value={newQty}
              onChange={(e) => setNewQty(e.target.value)}
              placeholder="Qty (e.g. 2)"
              className="px-2.5 py-1.5 rounded border border-[#95d5b2] bg-white"
            />
            <select
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              className="px-2.5 py-1.5 rounded border border-[#95d5b2] bg-white"
            >
              {['Produce', 'Meat & Seafood', 'Dairy & Eggs', 'Pantry', 'Bakery', 'Snacks', 'Household', 'Other'].map(
                (c) => (
                  <option key={c}>{c}</option>
                )
              )}
            </select>
            <div className="flex gap-1">
              <select
                value={newStore}
                onChange={(e) => setNewStore(e.target.value)}
                className="flex-1 px-2 py-1.5 rounded border border-[#95d5b2] bg-white"
              >
                <option value="Walmart">Walmart</option>
                <option value="Food Lion">Food Lion</option>
                <option value="Aldi">Aldi</option>
                <option value="">Any</option>
              </select>
              <button
                onClick={() => void submitItem()}
                className="px-3 py-1.5 rounded bg-[#2d6a4f] text-white font-bold cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      {!remaining.length ? (
        <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] text-xs text-[#40916c] text-center">
          Nothing left to pick up! 🎉
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => {
            const list = remaining.filter((i) => (i.category || 'Other') === cat);
            return (
              <div key={cat} className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-2">
                <div className="font-bold text-xs uppercase tracking-wide text-[#40916c]">{cat}</div>
                {list.map((it) => (
                  <div
                    key={it.id}
                    className="flex items-center gap-3 p-2 rounded-xl bg-[#f4fbf6] border border-[#dcefe2] text-xs"
                  >
                    <button
                      disabled={!canEdit}
                      onClick={() => void onToggleGot(it.id)}
                      className="w-6 h-6 rounded-full border-2 border-[#74c69d] bg-white shrink-0 cursor-pointer disabled:opacity-50"
                      aria-label={`Mark ${it.item} got`}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-[#1b4332]">{it.item}</span>
                      {it.qty && <span className="text-[#40916c]"> · {it.qty}</span>}
                      {it.store && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded bg-white border border-[#b7d8c2] text-[10px]">
                          {it.store}
                        </span>
                      )}
                      {it.notes && <div className="text-[10px] text-[#52796f]">{it.notes}</div>}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {checked.length > 0 && (
        <details className="p-4 rounded-2xl bg-white border border-[#95d5b2]">
          <summary className="font-bold text-xs text-[#52796f] cursor-pointer">
            ✔ Checked Off ({checked.length})
          </summary>
          <div className="mt-2 space-y-1.5">
            {checked.map((it) => (
              <div key={it.id} className="flex items-center gap-3 p-2 rounded-xl bg-[#f8fbf9] text-xs">
                <button
                  disabled={!canEdit}
                  onClick={() => void onToggleGot(it.id)}
                  className="w-6 h-6 rounded-full bg-[#2d6a4f] text-white font-bold text-xs shrink-0 cursor-pointer disabled:opacity-50"
                >
                  ✔
                </button>
                <span className="line-through text-[#52796f]">{it.item}</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
