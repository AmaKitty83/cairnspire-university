import { ASSETS } from '../../data/assetMeta';
import type { FamilyPersonProfile } from '../../services/familyHubService';
import { PersonIcon, speakText } from './PersonBadge';

interface HomeGardenMapProps {
  activePerson: FamilyPersonProfile;
  visiblePages: Set<string>;
  speakEnabled: boolean;
  labelsVisible: boolean;
  todayChoresDone: number;
  todayChoresTotal: number;
  upcomingEventsCount: number;
  onOpenTab: (tabId: string) => void;
  onToggleLabels: () => void;
}

interface CottageHotspot {
  tabId: string;
  x: number;
  y: number;
  title: string;
  kidTitle?: string;
  subtitle: string;
  icon: string;
}

const COTTAGE_SPOTS: CottageHotspot[] = [
  {
    tabId: 'meals',
    x: 19,
    y: 40,
    title: 'Kitchen & Pantry',
    kidTitle: 'Food & Kitchen',
    subtitle: 'Meals, Diet & Grocery',
    icon: '🍳',
  },
  {
    tabId: 'home',
    x: 46,
    y: 55,
    title: 'Hearth & Calendar',
    kidTitle: 'Home & Today',
    subtitle: 'Home & Announcements',
    icon: '🏡',
  },
  {
    tabId: 'school',
    x: 74,
    y: 40,
    title: 'Study Nook',
    kidTitle: 'School & Comics',
    subtitle: 'School & Comic Studio',
    icon: '🏫',
  },
  {
    tabId: 'quests',
    x: 88,
    y: 51,
    title: "Dragon's Quests",
    kidTitle: 'My Quests',
    subtitle: 'Gabe & Parents',
    icon: '📜',
  },
  {
    tabId: 'chores',
    x: 16,
    y: 70,
    title: 'Chore Workshop',
    kidTitle: 'My Jobs',
    subtitle: 'Jobs & Missions',
    icon: '🧹',
  },
  {
    tabId: 'goals',
    x: 28,
    y: 90,
    title: 'Wishing Well',
    kidTitle: 'My Goals',
    subtitle: 'Family Goals',
    icon: '🎯',
  },
  {
    tabId: 'gifts',
    x: 56,
    y: 92,
    title: 'Treasure Nook',
    kidTitle: 'Wish List',
    subtitle: 'Wish Lists & Gifts',
    icon: '🎁',
  },
  {
    tabId: 'chat',
    x: 80,
    y: 81,
    title: 'Owl Post',
    kidTitle: 'Family Chat',
    subtitle: 'Family Chat',
    icon: '💬',
  },
];

const EXTRA_DOCK_ITEMS: Array<{ tabId: string; icon: string; label: string; kidLabel?: string }> = [
  { tabId: 'grocery', icon: '🛒', label: 'Walmart Grocery' },
  { tabId: 'links', icon: '🌟', label: 'Helpful Links', kidLabel: 'Fun & Games' },
  { tabId: 'info', icon: '📌', label: 'Household Info' },
];

export function HomeGardenMap({
  activePerson,
  visiblePages,
  speakEnabled,
  labelsVisible,
  todayChoresDone,
  todayChoresTotal,
  upcomingEventsCount,
  onOpenTab,
  onToggleLabels,
}: HomeGardenMapProps) {
  const isLittle = activePerson.mode === 'little';
  const isCalmGabe = activePerson.mode === 'gabe';
  const mapSrc = ASSETS['home-garden-map']?.src || '/assets/home-garden-map.jpg';

  const visibleSpots = COTTAGE_SPOTS.filter((sp) => visiblePages.has(sp.tabId));
  const extraDock = EXTRA_DOCK_ITEMS.filter((item) => visiblePages.has(item.tabId));

  function openRoom(tabId: string, label: string) {
    if (isLittle) speakText(label, speakEnabled);
    onOpenTab(tabId);
  }

  return (
    <div className="space-y-3">
      {/* Compact Welcome Strip */}
      <div className="parchment-panel rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-[#2e1e0f]">
        <div className="flex items-center gap-2.5 min-w-0">
          <PersonIcon person={activePerson} size="md" />
          <div className="min-w-0">
            <div className="font-atlas font-bold text-sm sm:text-base truncate">
              Welcome to the Cottage Grounds, {activePerson.name}
            </div>
            <div className="text-[11px] text-[#6e4d28]">
              {isCalmGabe
                ? 'Tap any quiet corner of the yard when you are ready. Switch to List anytime above.'
                : isLittle
                  ? 'Tap any picture in the yard to go inside!'
                  : 'Click any building or garden nook to enter, or toggle Quick List in the top bar.'}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleLabels}
          className="ribbon-btn px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer shrink-0"
        >
          {labelsVisible ? '🏷️ Labels On' : '🏷️ Labels Off'}
        </button>
      </div>

      {/* Illustrated Interactive 16:9 Cottage & Grounds Map */}
      <div className="parchment-panel rounded-2xl p-1.5 sm:p-2 shadow-xl">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#8a6235] bg-[#d8c498]">
          <img
            src={mapSrc}
            alt="Home and Garden Cottage and Grounds"
            className="w-full h-full object-cover block select-none"
          />

          {/* Interactive Hotspots */}
          {visibleSpots.map((sp) => {
            const label = isLittle && sp.kidTitle ? sp.kidTitle : sp.title;
            const liveBadge =
              sp.tabId === 'chores' && todayChoresTotal > 0
                ? `${todayChoresDone}/${todayChoresTotal}`
                : sp.tabId === 'home' && upcomingEventsCount > 0 && !isCalmGabe
                  ? `${upcomingEventsCount} soon`
                  : null;

            return (
              <button
                key={sp.tabId}
                type="button"
                onClick={() => openRoom(sp.tabId, label)}
                style={{ left: `${sp.x}%`, top: `${sp.y}%`, transform: 'translate(-50%, -50%)' }}
                title={`${label} — ${sp.subtitle}`}
                className={`group absolute z-10 cursor-pointer transition-transform ${
                  isCalmGabe ? 'hover:scale-[1.03]' : 'hover:scale-105'
                }`}
              >
                {labelsVisible ? (
                  <div
                    className={`ribbon-btn rounded-xl text-center shadow-lg ${
                      isLittle ? 'px-3 py-1.5 min-w-[116px]' : 'px-2.5 py-1 min-w-[96px]'
                    }`}
                  >
                    <div
                      className={`font-atlas font-bold leading-tight whitespace-nowrap flex items-center justify-center gap-1 ${
                        isLittle ? 'text-xs sm:text-sm' : 'text-[11px] sm:text-xs'
                      }`}
                    >
                      <span>{sp.icon}</span>
                      <span>{label}</span>
                      {liveBadge && (
                        <span className="ml-0.5 px-1.5 py-0 rounded-full bg-[#2d6a4f] text-white text-[9px] font-sans font-bold">
                          {liveBadge}
                        </span>
                      )}
                    </div>
                    {!isLittle && !isCalmGabe && (
                      <div className="hidden md:block text-[9px] text-[#6e4d28] font-semibold leading-tight mt-0.5 whitespace-nowrap">
                        {sp.subtitle}
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="w-9 h-9 rounded-full ribbon-btn flex items-center justify-center text-base shadow-lg"
                    aria-label={label}
                  >
                    {sp.icon}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Dock for Extra Rooms + Direct Shortcuts */}
      {extraDock.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {extraDock.map((item) => {
            const lbl = isLittle && item.kidLabel ? item.kidLabel : item.label;
            return (
              <button
                key={item.tabId}
                type="button"
                onClick={() => openRoom(item.tabId, lbl)}
                className={`ribbon-btn rounded-xl font-bold cursor-pointer flex items-center gap-1.5 ${
                  isLittle ? 'px-4 py-2 text-sm' : 'px-3 py-1.5 text-xs'
                }`}
              >
                <span>{item.icon}</span>
                <span>{lbl}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
