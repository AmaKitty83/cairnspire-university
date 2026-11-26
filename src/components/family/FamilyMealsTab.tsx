import { useMemo, useState } from 'react';
import {
  FAMILY_PEOPLE,
  type AnchorMealRow,
  type DietaryProfile,
  type FamilyPersonProfile,
  type MealPickRow,
  type MealWeekRow,
  type PantryItem,
  type RecipeItem,
} from '../../services/familyHubService';
import { PersonChip } from './PersonBadge';

interface FamilyMealsTabProps {
  activePerson: FamilyPersonProfile;
  canEdit: boolean;
  weekOf: string;
  mealsWeek: MealWeekRow[];
  anchors: AnchorMealRow[];
  picks: MealPickRow[];
  recipes: RecipeItem[];
  pantry: PantryItem[];
  dietaryProfiles: DietaryProfile[];
  onToggleFavorite: (recipeId: string) => Promise<void>;
  onAddRecipe: (rec: Omit<RecipeItem, 'id' | 'favs' | 'fitsChecked'>) => Promise<void>;
  onAddBundleToGrocery: (recipe: RecipeItem) => Promise<number>;
  onSetPantryStatus: (pantryId: string, out: boolean) => Promise<void>;
  onPantryToGrocery: (item: PantryItem) => Promise<void>;
  onSaveMealPick: (pick: MealPickRow) => Promise<void>;
}

type MealSubTab = 'plan' | 'tonight' | 'recipes' | 'picks' | 'pantry' | 'diets';

const STAPLES = new Set([
  'salt', 'pepper', 'black pepper', 'sea salt', 'kosher salt', 'water', 'oil', 'vegetable oil', 'olive oil', 'cooking spray',
]);

function normalizeWords(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[^a-z0-9' ]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function matchPantry(ingLine: string, inStockPantry: PantryItem[]): string | null {
  const low = ingLine.toLowerCase();
  for (const st of STAPLES) {
    if (low.includes(st)) return 'Always on hand';
  }
  const words = normalizeWords(ingLine);
  if (!words.length) return null;
  for (const p of inStockPantry) {
    const terms = (p.alsoMatches || p.item)
      .toLowerCase()
      .split(/[,/]/)
      .map((x) => x.trim())
      .filter(Boolean);
    for (const term of terms) {
      const tw = normalizeWords(term);
      if (tw.length && tw.every((w) => words.includes(w))) {
        return p.item;
      }
    }
  }
  return null;
}

export function FamilyMealsTab({
  activePerson,
  canEdit,
  weekOf,
  mealsWeek,
  anchors,
  picks,
  recipes,
  pantry,
  dietaryProfiles,
  onToggleFavorite,
  onAddRecipe,
  onAddBundleToGrocery,
  onSetPantryStatus,
  onPantryToGrocery,
  onSaveMealPick,
}: FamilyMealsTabProps) {
  const isParent = activePerson.mode === 'parent';
  const [subTab, setSubTab] = useState<MealSubTab>('plan');
  const [showAllWeek, setShowAllWeek] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [onlyFavs, setOnlyFavs] = useState(false);
  const [onlySafe, setOnlySafe] = useState(false);
  const [openRecipe, setOpenRecipe] = useState<RecipeItem | null>(null);
  const [showAddRec, setShowAddRec] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Add Recipe form
  const [recName, setRecName] = useState('');
  const [recCuisine, setRecCuisine] = useState('');
  const [recProtein, setRecProtein] = useState('');
  const [recTime, setRecTime] = useState('30');
  const [recIngredients, setRecIngredients] = useState('');
  const [recSteps, setRecSteps] = useState('');
  const [recLink, setRecLink] = useState('');
  const [recBackups, setRecBackups] = useState('');

  // Meal Picks state
  const [pickDay, setPickDay] = useState(mealsWeek[0]?.day || 'Monday');
  const [pickMeal, setPickMeal] = useState('Dinner');
  const [pickChoice, setPickChoice] = useState('');
  const [pickAddons, setPickAddons] = useState('');

  function flash(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2200);
  }

  const inStockPantry = useMemo(() => pantry.filter((p) => !p.out), [pantry]);

  const enrichedRecipes = useMemo(() => {
    return recipes.map((r) => {
      const have: string[] = [];
      const need: string[] = [];
      for (const line of r.ingredients) {
        const m = matchPantry(line, inStockPantry);
        if (m) have.push(line);
        else need.push(line);
      }
      return {
        recipe: r,
        haveCount: have.length,
        totalCount: r.ingredients.length,
        needLines: need,
      };
    });
  }, [recipes, inStockPantry]);

  const todayName = new Date().toLocaleDateString([], { weekday: 'long' });

  const filteredRecipes = useMemo(() => {
    const q = searchQ.trim().toLowerCase();
    return enrichedRecipes.filter(({ recipe }) => {
      if (onlyFavs && !recipe.favs.includes(activePerson.name)) return false;
      if (onlySafe && !recipe.safe) return false;
      if (!q) return true;
      return (
        recipe.name.toLowerCase().includes(q) ||
        recipe.protein.toLowerCase().includes(q) ||
        recipe.tags.toLowerCase().includes(q) ||
        recipe.ingredients.some((i) => i.toLowerCase().includes(q))
      );
    });
  }, [enrichedRecipes, searchQ, onlyFavs, onlySafe, activePerson.name]);

  const tonightRecipes = useMemo(
    () =>
      [...enrichedRecipes].sort(
        (a, b) => a.needLines.length - b.needLines.length || b.haveCount - a.haveCount
      ),
    [enrichedRecipes]
  );

  async function submitRecipe() {
    if (!canEdit || !recName.trim()) return;
    await onAddRecipe({
      name: recName.trim(),
      cuisine: recCuisine.trim(),
      protein: recProtein.trim(),
      time: Number(recTime) || 0,
      ingredients: recIngredients.split('\n').map((x) => x.trim()).filter(Boolean),
      steps: recSteps.split('\n').map((x) => x.trim()).filter(Boolean),
      link: recLink.trim(),
      safe: false,
      tags: '',
      source: 'Family / original',
      serves: '',
      backups: recBackups.trim(),
    });
    setRecName('');
    setRecIngredients('');
    setRecSteps('');
    setShowAddRec(false);
    flash('Recipe saved ✔');
  }

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-atlas text-lg font-bold text-[#1b4332]">🍽️ Meals &amp; Recipes</h2>
            {weekOf && <p className="text-xs text-[#40916c]">Week of {weekOf}</p>}
          </div>
          {toastMsg && (
            <span className="px-2.5 py-1 rounded-full bg-[#d8f3dc] text-[#1b4332] text-xs font-bold">
              {toastMsg}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ['plan', '📅 This Week'],
              ['tonight', '🥫 Make Tonight'],
              ['recipes', `📖 Recipes (${recipes.length})`],
              ['picks', '🎲 Meal Picks'],
              ['pantry', `🧺 Pantry (${pantry.length})`],
              ['diets', '⚙️ Diets & Safety'],
            ] as Array<[MealSubTab, string]>
          ).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setSubTab(k)}
              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer border ${
                subTab === k
                  ? 'bg-[#2d6a4f] text-white border-[#1b4332]'
                  : 'bg-[#f4fbf6] text-[#1b4332] border-[#b7d8c2]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. THIS WEEK PLAN + ANCHOR MEALS */}
      {subTab === 'plan' && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-2.5">
            <h3 className="font-bold text-sm text-[#1b4332]">This Week’s Dinners</h3>
            {(showAllWeek ? mealsWeek : mealsWeek.slice(0, 3)).map((m) => {
              const anchor = anchors.find((a) => a.day.toLowerCase() === m.day.toLowerCase());
              const dinnerName = m.dinner || anchor?.meal || 'Open / Leftovers';
              const matchedRecipe = recipes.find(
                (r) => r.name.toLowerCase() === dinnerName.toLowerCase()
              );
              const isToday = m.day.toLowerCase().startsWith(todayName.toLowerCase().slice(0, 3));
              return (
                <div
                  key={m.day}
                  className={`p-3 rounded-xl border space-y-1.5 ${
                    isToday ? 'bg-[#e9f5ec] border-[#2d6a4f]' : 'bg-[#f4fbf6] border-[#dcefe2]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-bold text-xs text-[#1b4332]">
                      {m.day} {isToday ? '· Tonight ⭐' : ''}
                    </div>
                    {m.cook && <span className="text-[11px] text-[#40916c]">Cook: {m.cook}</span>}
                  </div>
                  <div className="text-sm font-bold text-[#14532d]">
                    {dinnerName} {!m.dinner && anchor?.meal ? '⚓' : ''}
                  </div>
                  {(m.safe || anchor?.backups) && (
                    <div className="text-[11px] text-[#355e47]">
                      <strong>Safe backups:</strong> {m.safe || anchor?.backups}
                    </div>
                  )}
                  {m.notes && <div className="text-[11px] text-[#52796f]">{m.notes}</div>}
                  {matchedRecipe && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        onClick={() => setOpenRecipe(matchedRecipe)}
                        className="px-2.5 py-1 rounded bg-white border border-[#95d5b2] text-[11px] font-bold cursor-pointer"
                      >
                        📖 Open Recipe
                      </button>
                      {canEdit && (
                        <button
                          onClick={async () => {
                            const added = await onAddBundleToGrocery(matchedRecipe);
                            flash(`Added ${added} items to Walmart Grocery list 🛒`);
                          }}
                          className="px-2.5 py-1 rounded bg-[#2d6a4f] text-white text-[11px] font-bold cursor-pointer"
                        >
                          🛒 Add Missing to Walmart List
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            {mealsWeek.length > 3 && (
              <button
                onClick={() => setShowAllWeek((v) => !v)}
                className="w-full py-2 rounded-xl bg-[#edf6f0] text-[#1b4332] text-xs font-bold cursor-pointer"
              >
                {showAllWeek ? 'Show fewer days' : `Show whole week (${mealsWeek.length} days)`}
              </button>
            )}
          </div>

          {anchors.length > 0 && (
            <details className="p-4 rounded-2xl bg-white border border-[#95d5b2]">
              <summary className="font-bold text-sm text-[#1b4332] cursor-pointer">
                ⚓ Anchor Meal Rotation ({anchors.length} days)
              </summary>
              <div className="mt-2 space-y-2 text-xs">
                {anchors.map((a) => (
                  <div key={a.day} className="p-2 rounded-lg bg-[#f4fbf6] border border-[#dcefe2]">
                    <div className="font-bold text-[#1b4332]">
                      {a.day}: {a.meal || 'Open night'}
                    </div>
                    {a.setup && <div className="text-[#355e47]">{a.setup}</div>}
                    {a.backups && <div className="text-[#52796f]">Backups: {a.backups}</div>}
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}

      {/* 2. MAKE TONIGHT */}
      {subTab === 'tonight' && (
        <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-3">
          <div className="font-bold text-sm text-[#1b4332]">
            🥫 Easiest to Make Tonight (Matched Against {inStockPantry.length} In-Stock Pantry Items)
          </div>
          <div className="space-y-2">
            {tonightRecipes.slice(0, 10).map(({ recipe, haveCount, totalCount, needLines }) => (
              <div
                key={recipe.id}
                className="p-3 rounded-xl bg-[#f4fbf6] border border-[#dcefe2] flex flex-wrap items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="font-bold text-xs text-[#1b4332]">{recipe.name}</div>
                  <div className="text-[11px] text-[#40916c]">
                    Have {haveCount}/{totalCount} ingredients · Need {needLines.length}
                    {recipe.time ? ` · ${recipe.time} min` : ''}
                  </div>
                </div>
                <button
                  onClick={() => setOpenRecipe(recipe)}
                  className="px-2.5 py-1 rounded bg-white border border-[#95d5b2] text-xs font-bold cursor-pointer"
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ALL RECIPES */}
      {subTab === 'recipes' && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-2.5">
            <div className="flex flex-wrap gap-2">
              <input
                type="search"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="🔎 Search recipe name, protein, or ingredient..."
                className="flex-1 min-w-[200px] px-3 py-1.5 rounded-xl border border-[#95d5b2] text-xs"
              />
              {canEdit && (
                <button
                  onClick={() => setShowAddRec((v) => !v)}
                  className="px-3 py-1.5 rounded-xl bg-[#2d6a4f] text-white text-xs font-bold cursor-pointer"
                >
                  ＋ Add Recipe
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <button
                onClick={() => setOnlyFavs((v) => !v)}
                className={`px-2.5 py-1 rounded-full font-bold cursor-pointer border ${
                  onlyFavs ? 'bg-[#fef3c7] border-[#f59e0b]' : 'bg-[#f4fbf6] border-[#b7d8c2]'
                }`}
              >
                ⭐ My Favorites
              </button>
              <button
                onClick={() => setOnlySafe((v) => !v)}
                className={`px-2.5 py-1 rounded-full font-bold cursor-pointer border ${
                  onlySafe ? 'bg-[#dcfce7] border-[#22c55e]' : 'bg-[#f4fbf6] border-[#b7d8c2]'
                }`}
              >
                🌱 Kid Safe-Food Backups
              </button>
            </div>

            {showAddRec && canEdit && (
              <div className="p-3 rounded-xl bg-[#f4fbf6] border border-[#74c69d] space-y-2 text-xs">
                <div className="font-bold text-[#1b4332]">Add Family Recipe</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={recName}
                    onChange={(e) => setRecName(e.target.value)}
                    placeholder="Recipe name"
                    className="px-2.5 py-1.5 rounded border border-[#95d5b2] bg-white"
                  />
                  <input
                    type="text"
                    value={recCuisine}
                    onChange={(e) => setRecCuisine(e.target.value)}
                    placeholder="Cuisine / category"
                    className="px-2.5 py-1.5 rounded border border-[#95d5b2] bg-white"
                  />
                  <input
                    type="text"
                    value={recProtein}
                    onChange={(e) => setRecProtein(e.target.value)}
                    placeholder="Main protein"
                    className="px-2.5 py-1.5 rounded border border-[#95d5b2] bg-white"
                  />
                  <input
                    type="number"
                    value={recTime}
                    onChange={(e) => setRecTime(e.target.value)}
                    placeholder="Minutes"
                    className="px-2.5 py-1.5 rounded border border-[#95d5b2] bg-white"
                  />
                  <input
                    type="url"
                    value={recLink}
                    onChange={(e) => setRecLink(e.target.value)}
                    placeholder="Link (optional)"
                    className="px-2.5 py-1.5 rounded border border-[#95d5b2] bg-white sm:col-span-2"
                  />
                </div>
                <textarea
                  rows={3}
                  value={recIngredients}
                  onChange={(e) => setRecIngredients(e.target.value)}
                  placeholder="Ingredients (one per line)"
                  className="w-full px-2.5 py-1.5 rounded border border-[#95d5b2] bg-white"
                />
                <textarea
                  rows={3}
                  value={recSteps}
                  onChange={(e) => setRecSteps(e.target.value)}
                  placeholder="Steps (one per line)"
                  className="w-full px-2.5 py-1.5 rounded border border-[#95d5b2] bg-white"
                />
                <input
                  type="text"
                  value={recBackups}
                  onChange={(e) => setRecBackups(e.target.value)}
                  placeholder="Safe-food backup ideas"
                  className="w-full px-2.5 py-1.5 rounded border border-[#95d5b2] bg-white"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => void submitRecipe()}
                    className="px-3 py-1.5 rounded-lg bg-[#2d6a4f] text-white font-bold cursor-pointer"
                  >
                    Save Recipe
                  </button>
                  <button
                    onClick={() => setShowAddRec(false)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-[#95d5b2] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredRecipes.map(({ recipe, haveCount, totalCount }) => {
              const isFav = recipe.favs.includes(activePerson.name);
              return (
                <div
                  key={recipe.id}
                  className="p-3 rounded-2xl bg-white border border-[#95d5b2] flex flex-col justify-between gap-2"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold text-sm text-[#1b4332]">{recipe.name}</div>
                      {canEdit && (
                        <button
                          onClick={() => void onToggleFavorite(recipe.id)}
                          className="text-base cursor-pointer shrink-0"
                          title="Favorite"
                        >
                          {isFav ? '⭐' : '☆'}
                        </button>
                      )}
                    </div>
                    <div className="text-[11px] text-[#40916c] mt-0.5">
                      {[recipe.cuisine, recipe.protein, recipe.time ? `${recipe.time} min` : '']
                        .filter(Boolean)
                        .join(' · ')}
                    </div>
                    <div className="text-[11px] text-[#355e47] mt-1">
                      Pantry: {haveCount}/{totalCount} ingredients on hand
                    </div>
                    {recipe.fitsChecked.length > 0 && (
                      <div className="text-[10px] text-[#15803d] mt-1">
                        ✔ Fits: {recipe.fitsChecked.join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setOpenRecipe(recipe)}
                      className="px-2.5 py-1 rounded-lg bg-[#edf6f0] text-[#1b4332] text-xs font-bold cursor-pointer"
                    >
                      📖 Read
                    </button>
                    {canEdit && (
                      <button
                        onClick={async () => {
                          const count = await onAddBundleToGrocery(recipe);
                          flash(`Added ${count} missing items 🛒`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#2d6a4f] text-white text-xs font-bold cursor-pointer"
                      >
                        🛒 Shop Missing
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. PER-PERSON MEAL PICKS */}
      {subTab === 'picks' && (
        <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-3 text-xs">
          <h3 className="font-bold text-sm text-[#1b4332]">🎲 Build-Your-Own Meal Picks</h3>
          {canEdit && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 p-3 rounded-xl bg-[#f4fbf6] border border-[#dcefe2]">
              <select
                value={pickDay}
                onChange={(e) => setPickDay(e.target.value)}
                className="px-2 py-1.5 rounded border border-[#95d5b2] bg-white"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              <select
                value={pickMeal}
                onChange={(e) => setPickMeal(e.target.value)}
                className="px-2 py-1.5 rounded border border-[#95d5b2] bg-white"
              >
                {['Breakfast', 'Lunch', 'Dinner'].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
              <input
                type="text"
                value={pickChoice}
                onChange={(e) => setPickChoice(e.target.value)}
                placeholder="Choice / plate"
                className="px-2 py-1.5 rounded border border-[#95d5b2] bg-white"
              />
              <button
                onClick={async () => {
                  if (!pickChoice.trim()) return;
                  await onSaveMealPick({
                    day: pickDay,
                    meal: pickMeal,
                    who: activePerson.name,
                    choice: pickChoice.trim(),
                    addons: pickAddons.trim(),
                    by: activePerson.name,
                  });
                  setPickChoice('');
                  setPickAddons('');
                  flash('Pick saved ✔');
                }}
                className="px-3 py-1.5 rounded bg-[#2d6a4f] text-white font-bold cursor-pointer"
              >
                Save My Pick
              </button>
              <input
                type="text"
                value={pickAddons}
                onChange={(e) => setPickAddons(e.target.value)}
                placeholder="Add-ons or safe-food backup (optional)"
                className="px-2 py-1.5 rounded border border-[#95d5b2] bg-white sm:col-span-4"
              />
            </div>
          )}
          <div className="space-y-1.5">
            {picks.map((pk, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-[#f4fbf6] border border-[#dcefe2]">
                <strong>
                  {pk.day} {pk.meal} ({pk.who}):
                </strong>{' '}
                {pk.choice} {pk.addons ? `· ${pk.addons}` : ''}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. PANTRY */}
      {subTab === 'pantry' && (
        <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-2 text-xs">
          <div className="font-bold text-sm text-[#1b4332]">🧺 Pantry Inventory (“We’re out of this”)</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
            {pantry.map((p) => (
              <div
                key={p.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                  p.out ? 'bg-amber-50 border-amber-300' : 'bg-[#f4fbf6] border-[#dcefe2]'
                }`}
              >
                <div className="min-w-0">
                  <div className="font-bold text-[#1b4332] truncate">{p.item}</div>
                  <div className="text-[10px] text-[#52796f]">{p.category}</div>
                </div>
                {canEdit && (
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => void onSetPantryStatus(p.id, !p.out)}
                      className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                        p.out ? 'bg-amber-600 text-white' : 'bg-white border border-[#95d5b2]'
                      }`}
                    >
                      {p.out ? 'Out' : 'Have'}
                    </button>
                    {p.out && (
                      <button
                        onClick={async () => {
                          await onPantryToGrocery(p);
                          flash(`Added ${p.item} 🛒`);
                        }}
                        className="px-2 py-1 rounded bg-[#2d6a4f] text-white text-[10px] font-bold cursor-pointer"
                      >
                        ＋🛒
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. DIETARY PROFILES */}
      {subTab === 'diets' && (
        <div className="p-4 rounded-2xl bg-white border border-[#95d5b2] space-y-2.5 text-xs">
          <div className="font-bold text-sm text-[#1b4332]">
            ⚙️ Dietary &amp; Sensory Profiles (Safe Meal Matching)
          </div>
          {dietaryProfiles.map((dp) => {
            const pObj = FAMILY_PEOPLE.find((p) => p.name === dp.person);
            return (
              <div key={dp.person} className="p-3 rounded-xl bg-[#f4fbf6] border border-[#dcefe2] space-y-1">
                {pObj ? <PersonChip person={pObj} /> : <strong>{dp.person}</strong>}
                {dp.avoid && (
                  <div>
                    <strong>Avoids:</strong> {dp.avoid}
                  </div>
                )}
                {dp.allow && (
                  <div>
                    <strong>Allowed exceptions:</strong> {dp.allow}
                  </div>
                )}
                {dp.safe && (
                  <div>
                    <strong>Safe foods:</strong> {dp.safe}
                  </div>
                )}
                {dp.textures && (
                  <div>
                    <strong>Textures / sensory:</strong> {dp.textures}
                  </div>
                )}
                {dp.allergies && (
                  <div className="text-red-700">
                    <strong>Allergies:</strong> {dp.allergies}
                  </div>
                )}
                {dp.notes && <div className="text-[#40916c]">{dp.notes}</div>}
              </div>
            );
          })}
          {!isParent && <div className="text-[11px] text-[#52796f]">Managed by Amarette &amp; Ray.</div>}
        </div>
      )}

      {/* Recipe Reader Modal */}
      {openRecipe && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpenRecipe(null);
          }}
          className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-5 space-y-3 border-2 border-[#74c69d] shadow-xl">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-atlas text-lg font-bold text-[#1b4332]">{openRecipe.name}</h3>
                <div className="text-xs text-[#40916c]">
                  {[openRecipe.cuisine, openRecipe.protein, openRecipe.time ? `${openRecipe.time} min` : '']
                    .filter(Boolean)
                    .join(' · ')}
                </div>
              </div>
              <button
                onClick={() => setOpenRecipe(null)}
                className="px-2.5 py-1 rounded-full bg-[#edf6f0] font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div>
              <div className="font-bold text-xs text-[#1b4332] mb-1">Ingredients</div>
              <ul className="list-disc pl-5 text-xs space-y-0.5 text-[#26382c]">
                {openRecipe.ingredients.map((i, idx) => (
                  <li key={idx}>{i}</li>
                ))}
              </ul>
            </div>
            {openRecipe.steps.length > 0 && (
              <div>
                <div className="font-bold text-xs text-[#1b4332] mb-1">Steps</div>
                <ol className="list-decimal pl-5 text-xs space-y-1 text-[#26382c]">
                  {openRecipe.steps.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ol>
              </div>
            )}
            {openRecipe.backups && (
              <div className="p-2.5 rounded-lg bg-[#fef9c3] text-xs">
                <strong>Safe-food backups:</strong> {openRecipe.backups}
              </div>
            )}
            <div className="flex flex-wrap gap-2 pt-1">
              {openRecipe.link && (
                <a
                  href={openRecipe.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#edf6f0] text-[#1b4332] text-xs font-bold underline"
                >
                  Open Source Link ↗
                </a>
              )}
              {canEdit && (
                <button
                  onClick={async () => {
                    const cnt = await onAddBundleToGrocery(openRecipe);
                    flash(`Added ${cnt} missing items 🛒`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#2d6a4f] text-white text-xs font-bold cursor-pointer"
                >
                  🛒 Add Missing to Walmart List
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
