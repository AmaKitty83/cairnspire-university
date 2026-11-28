import { useEffect, useMemo, useRef, useState } from 'react';
import type { BuildingDef } from '../data/campusData';
import { ASSETS } from '../data/assetMeta';
import { getRoomConfig, type RoomWorker, type WorkstationStyle } from '../data/interiorConfigs';
import { LIVING_ROOMS } from '../data/livingRooms';
import type { CampusRole } from '../firebase';
import type { DepartmentRecord } from '../services/firestoreService';
import { LivingRoomView } from './room/LivingRoomView';

interface InteriorRoomViewProps {
  building: BuildingDef;
  role: CampusRole;
  departmentRecord?: DepartmentRecord;
  pendingPermitCount: number;
  constitutionActive?: boolean;
  onExitToCampus: () => void;
  onOpenDashboard: () => void;
}

interface LiveWorkerState {
  worker: RoomWorker;
  segIdx: number;
  progress: number;
  phase: number;
}

function WorkstationProp({
  style,
  selected,
}: {
  style: WorkstationStyle;
  selected: boolean;
}) {
  const stroke = selected ? '#fde68a' : '#24140a';
  const strokeW = selected ? 2.1 : 1.5;

  switch (style) {
    case 'judge-bench':
      return (
        <g>
          {/* High carved judicial bench */}
          <rect x="-34" y="-12" width="68" height="22" rx="4" fill="#5e361c" stroke={stroke} strokeWidth={strokeW} />
          <rect x="-38" y="-18" width="76" height="8" rx="3" fill="#8b552e" stroke={stroke} strokeWidth={strokeW} />
          <rect x="-24" y="-6" width="48" height="10" rx="2" fill="#734323" stroke="#d4a45a" strokeWidth="1" />
          {/* Golden scales & gavel block */}
          <circle cx="-16" cy="-19" r="3" fill="#ffd166" />
          <rect x="10" y="-22" width="12" height="4" rx="1.5" fill="#d9b26f" stroke="#24140a" strokeWidth="1" />
          <line x1="16" y1="-18" x2="16" y2="-13" stroke="#24140a" strokeWidth="1.6" />
        </g>
      );

    case 'podium':
      return (
        <g>
          <rect x="-22" y="-14" width="44" height="24" rx="4" fill="#6b4226" stroke={stroke} strokeWidth={strokeW} />
          <polygon points="-28,-14 28,-14 24,-22 -24,-22" fill="#9c6638" stroke={stroke} strokeWidth={strokeW} />
          {/* Open parchment scroll */}
          <rect x="-13" y="-21" width="26" height="10" rx="2" fill="#fbf1d7" stroke="#7a5226" strokeWidth="1" />
          <line x1="-8" y1="-16" x2="8" y2="-16" stroke="#8a5a24" strokeWidth="1.2" />
        </g>
      );

    case 'command-desk':
      return (
        <g>
          <rect x="-34" y="-12" width="68" height="22" rx="5" fill="#683d20" stroke={stroke} strokeWidth={strokeW} />
          <rect x="-36" y="-19" width="72" height="9" rx="3.5" fill="#a16a3a" stroke={stroke} strokeWidth={strokeW} />
          {/* Brass lamp + emblem ledger */}
          <circle cx="-22" cy="-23" r="4" fill="#ffbe0b" />
          <rect x="-8" y="-22" width="24" height="8" rx="1.5" fill="#fef3c7" stroke="#6b4226" strokeWidth="1" />
          <rect x="20" y="-22" width="8" height="6" rx="1" fill="#2a9d8f" stroke="#24140a" strokeWidth="0.9" />
        </g>
      );

    case 'bookshelf-desk':
      return (
        <g>
          {/* Rear bookshelf */}
          <rect x="-28" y="-32" width="56" height="20" rx="2.5" fill="#5b341b" stroke={stroke} strokeWidth={strokeW} />
          <rect x="-23" y="-29" width="6" height="12" fill="#d97706" />
          <rect x="-15" y="-29" width="6" height="12" fill="#2a9d8f" />
          <rect x="-7" y="-29" width="6" height="12" fill="#b45309" />
          <rect x="3" y="-29" width="6" height="12" fill="#7c3aed" />
          <rect x="11" y="-29" width="6" height="12" fill="#dc2626" />
          {/* Front desk */}
          <rect x="-30" y="-12" width="60" height="18" rx="3" fill="#8b552e" stroke={stroke} strokeWidth={strokeW} />
          <rect x="-12" y="-14" width="22" height="7" rx="1" fill="#fff8e7" stroke="#6b4226" strokeWidth="0.9" />
        </g>
      );

    case 'easel':
      return (
        <g>
          {/* A-frame legs */}
          <line x1="-18" y1="10" x2="0" y2="-28" stroke="#6b4226" strokeWidth="3.2" />
          <line x1="18" y1="10" x2="0" y2="-28" stroke="#6b4226" strokeWidth="3.2" />
          <line x1="0" y1="-26" x2="0" y2="12" stroke="#4f2f19" strokeWidth="2.6" />
          {/* Canvas */}
          <rect x="-20" y="-26" width="40" height="26" rx="2.5" fill="#fbf3df" stroke={stroke} strokeWidth={strokeW} />
          <circle cx="-7" cy="-16" r="5" fill="#f59e0b" opacity="0.85" />
          <path d="M -16 -5 Q -4 -17 16 -6 Z" fill="#2a9d8f" opacity="0.85" />
        </g>
      );

    case 'map-table':
      return (
        <g>
          <rect x="-32" y="-12" width="64" height="22" rx="4" fill="#6d4324" stroke={stroke} strokeWidth={strokeW} />
          <rect x="-30" y="-18" width="60" height="14" rx="2.5" fill="#9c6638" stroke={stroke} strokeWidth={strokeW} />
          {/* Topographic parchment map */}
          <rect x="-24" y="-16" width="48" height="10" rx="1.5" fill="#f5e1b8" stroke="#6d4324" strokeWidth="1" />
          <path d="M -18 -11 Q -6 -15 4 -9 T 19 -12" fill="none" stroke="#c2410c" strokeWidth="1.4" strokeDasharray="2.5,2" />
          <circle cx="15" cy="-12" r="2.2" fill="#dc2626" />
        </g>
      );

    case 'crystal-bench':
      return (
        <g>
          <rect x="-30" y="-10" width="60" height="18" rx="3.5" fill="#4f3728" stroke={stroke} strokeWidth={strokeW} />
          <rect x="-32" y="-16" width="64" height="8" rx="2.5" fill="#6f523e" stroke={stroke} strokeWidth={strokeW} />
          {/* Glowing amethyst & cyan crystals */}
          <polygon points="-18,-15 -13,-28 -7,-15" fill="#c77dff" stroke="#24140a" strokeWidth="1" />
          <polygon points="-10,-15 -5,-24 1,-15" fill="#e0aaff" stroke="#24140a" strokeWidth="0.9" />
          <polygon points="10,-15 16,-27 22,-15" fill="#00e5ff" stroke="#24140a" strokeWidth="1" />
        </g>
      );

    case 'lab':
      return (
        <g>
          <rect x="-30" y="-10" width="60" height="18" rx="3" fill="#523c2d" stroke={stroke} strokeWidth={strokeW} />
          <rect x="-32" y="-16" width="64" height="8" rx="2" fill="#7d6452" stroke={stroke} strokeWidth={strokeW} />
          {/* Flasks / apothecary vials */}
          <rect x="-20" y="-26" width="8" height="10" rx="2" fill="#34d399" stroke="#24140a" strokeWidth="1" />
          <circle cx="-4" cy="-21" r="5" fill="#60a5fa" stroke="#24140a" strokeWidth="1" />
          <rect x="12" y="-25" width="9" height="9" rx="1.5" fill="#fbbf24" stroke="#24140a" strokeWidth="1" />
        </g>
      );

    case 'workbench':
      return (
        <g>
          <rect x="-32" y="-10" width="64" height="18" rx="2.5" fill="#7c4f2b" stroke={stroke} strokeWidth={strokeW} />
          <rect x="-35" y="-17" width="70" height="8" rx="2" fill="#b07949" stroke={stroke} strokeWidth={strokeW} />
          {/* Ruler / blueprint / wheel */}
          <rect x="-22" y="-16" width="26" height="5" fill="#e0f2fe" stroke="#0369a1" strokeWidth="0.9" />
          <circle cx="17" cy="-20" r="6" fill="#94a3b8" stroke="#24140a" strokeWidth="1.2" />
          <circle cx="17" cy="-20" r="2.2" fill="#e2e8f0" />
        </g>
      );

    case 'terminal':
      return (
        <g>
          <rect x="-30" y="-10" width="60" height="18" rx="3.5" fill="#374151" stroke={stroke} strokeWidth={strokeW} />
          <rect x="-20" y="-28" width="40" height="18" rx="3" fill="#1e293b" stroke={stroke} strokeWidth={strokeW} />
          <rect x="-16" y="-24" width="32" height="10" rx="1.5" fill="#0ea5e9" opacity="0.85" />
          <line x1="-12" y1="-19" x2="12" y2="-19" stroke="#e0f2fe" strokeWidth="1.6" />
          <circle cx="-18" cy="-4" r="2.2" fill="#f59e0b" />
          <circle cx="18" cy="-4" r="2.2" fill="#22c55e" />
        </g>
      );

    case 'corkboard':
      return (
        <g>
          {/* Wooden easel board */}
          <rect x="-30" y="-30" width="60" height="32" rx="3" fill="#78350f" stroke={stroke} strokeWidth={strokeW} />
          <rect x="-26" y="-26" width="52" height="24" rx="2" fill="#d97706" opacity="0.82" />
          {/* Notes */}
          <rect x="-21" y="-22" width="13" height="10" rx="1" fill="#fef3c7" stroke="#92400e" strokeWidth="0.8" />
          <rect x="-4" y="-20" width="14" height="11" rx="1" fill="#e0f2fe" stroke="#075985" strokeWidth="0.8" />
          <rect x="13" y="-23" width="10" height="12" rx="1" fill="#fce7f3" stroke="#9d174d" strokeWidth="0.8" />
          <line x1="-14" y1="-17" x2="3" y2="-14" stroke="#dc2626" strokeWidth="1.1" />
        </g>
      );

    case 'nook':
      return (
        <g>
          {/* Cozy cushioned alcove armchair & side table */}
          <rect x="-28" y="-14" width="36" height="22" rx="7" fill="#7c2d12" stroke={stroke} strokeWidth={strokeW} />
          <rect x="-22" y="-8" width="24" height="12" rx="4" fill="#d97706" opacity="0.88" />
          <rect x="12" y="-10" width="18" height="16" rx="3" fill="#8b552e" stroke={stroke} strokeWidth={strokeW} />
          <circle cx="21" cy="-14" r="4" fill="#fde68a" stroke="#78350f" strokeWidth="1" />
        </g>
      );

    case 'mat':
      return (
        <g>
          {/* Wellness recovery mat & weights */}
          <rect x="-34" y="-8" width="68" height="18" rx="6" fill="#0f766e" stroke={stroke} strokeWidth={strokeW} />
          <rect x="-28" y="-5" width="56" height="12" rx="4" fill="#2dd4bf" opacity="0.45" />
          <circle cx="-22" cy="-12" r="4" fill="#fbbf24" stroke="#24140a" strokeWidth="1" />
          <circle cx="22" cy="-12" r="4" fill="#475569" stroke="#24140a" strokeWidth="1" />
        </g>
      );

    case 'stage':
      return (
        <g>
          {/* Director stage box with spotlight */}
          <rect x="-36" y="-14" width="72" height="22" rx="4" fill="#4c1d95" stroke={stroke} strokeWidth={strokeW} />
          <rect x="-30" y="-22" width="60" height="10" rx="2.5" fill="#7e22ce" stroke={stroke} strokeWidth={strokeW} />
          <circle cx="-20" cy="-25" r="4" fill="#fef08a" />
          <circle cx="20" cy="-25" r="4" fill="#fef08a" />
          <rect x="-12" y="-21" width="24" height="6" rx="1.5" fill="#fde68a" />
        </g>
      );

    case 'vault':
      return (
        <g>
          {/* Riveted security vault */}
          <rect x="-28" y="-24" width="56" height="32" rx="5" fill="#475569" stroke={stroke} strokeWidth={strokeW} />
          <rect x="-22" y="-19" width="44" height="22" rx="3" fill="#334155" stroke="#94a3b8" strokeWidth="1.2" />
          <circle cx="0" cy="-8" r="7" fill="#cbd5e1" stroke="#1e293b" strokeWidth="1.3" />
          <line x1="-4" y1="-8" x2="4" y2="-8" stroke="#1e293b" strokeWidth="1.5" />
          <line x1="0" y1="-12" x2="0" y2="-4" stroke="#1e293b" strokeWidth="1.5" />
        </g>
      );

    case 'gate-desk':
      return (
        <g>
          {/* Police checkpoint barrier & desk */}
          <rect x="-32" y="-12" width="44" height="20" rx="3" fill="#475569" stroke={stroke} strokeWidth={strokeW} />
          <rect x="6" y="-20" width="28" height="7" rx="2" fill="#f59e0b" stroke="#24140a" strokeWidth="1.2" />
          <line x1="12" y1="-20" x2="18" y2="-13" stroke="#24140a" strokeWidth="2" />
          <line x1="22" y1="-20" x2="28" y2="-13" stroke="#24140a" strokeWidth="2" />
          <circle cx="-12" cy="-16" r="4" fill="#fbbf24" stroke="#24140a" strokeWidth="1" />
        </g>
      );

    case 'table':
      return (
        <g>
          <ellipse cx="0" cy="-4" rx="32" ry="14" fill="#8b552e" stroke={stroke} strokeWidth={strokeW} />
          <ellipse cx="0" cy="-8" rx="28" ry="11" fill="#b47949" stroke={stroke} strokeWidth="1.1" />
          <rect x="-12" y="-13" width="14" height="8" rx="1" fill="#fff8e7" stroke="#6b4226" strokeWidth="0.9" />
          <circle cx="12" cy="-9" r="3" fill="#ffd166" stroke="#6b4226" strokeWidth="0.8" />
        </g>
      );

    case 'desk':
    default:
      return (
        <g>
          <rect x="-30" y="-12" width="60" height="20" rx="3.5" fill="#734323" stroke={stroke} strokeWidth={strokeW} />
          <rect x="-33" y="-18" width="66" height="8" rx="2.5" fill="#a8703f" stroke={stroke} strokeWidth={strokeW} />
          <rect x="-16" y="-17" width="20" height="5" rx="1" fill="#fbf1d7" stroke="#6b4226" strokeWidth="0.9" />
          <circle cx="18" cy="-19" r="3.5" fill="#ffbe0b" stroke="#6b4226" strokeWidth="0.9" />
        </g>
      );
  }
}

export function InteriorRoomView(props: InteriorRoomViewProps) {
  const livingRoom = LIVING_ROOMS[props.building.id];
  if (livingRoom) {
    return (
      <LivingRoomView
        room={livingRoom}
        building={props.building}
        role={props.role}
        departmentRecord={props.departmentRecord}
        pendingPermitCount={props.pendingPermitCount}
        constitutionActive={props.constitutionActive}
        onExitToCampus={props.onExitToCampus}
        onOpenDashboard={props.onOpenDashboard}
      />
    );
  }
  return <StaticInteriorRoomView {...props} />;
}

function StaticInteriorRoomView({
  building,
  role,
  departmentRecord,
  pendingPermitCount,
  constitutionActive = false,
  onExitToCampus,
  onOpenDashboard,
}: InteriorRoomViewProps) {
  const room = useMemo(
    () => getRoomConfig(building.id, building.repSprite, building.headRole),
    [building.id, building.repSprite, building.headRole]
  );

  const [selectedWorker, setSelectedWorker] = useState<RoomWorker | null>(null);
  const [rosterOpen, setRosterOpen] = useState(false);
  const workerRefs = useRef<Record<string, SVGGElement | null>>({});

  useEffect(() => {
    setSelectedWorker(null);
    setRosterOpen(false);
  }, [building.id]);

  // Density-adaptive sprite sizing so 10-12 agent rooms look crisp & uncluttered
  const baseSpriteSize = useMemo(() => {
    const count = room.workers.length;
    if (count <= 4) return { regular: 84, halfling: 74 };
    if (count <= 6) return { regular: 72, halfling: 64 };
    if (count <= 10) return { regular: 62, halfling: 55 };
    return { regular: 56, halfling: 49 };
  }, [room.workers.length]);

  // Painter's order sort by initial vertical position
  const sortedWorkers = useMemo(() => {
    return [...room.workers].sort(
      (a, b) => (a.route[0]?.y ?? 440) - (b.route[0]?.y ?? 440)
    );
  }, [room.workers]);

  // Animate sprites strolling & working at their custom stations inside the room
  useEffect(() => {
    const live: LiveWorkerState[] = room.workers.map((w, idx) => ({
      worker: w,
      segIdx: 0,
      progress: (idx * 0.31) % 0.85,
      phase: idx * 1.15,
    }));

    let tick = 0;
    let rafId = 0;

    function animate() {
      tick += 1;
      live.forEach((st) => {
        const pts = st.worker.route;
        if (pts.length === 0) return;
        const from = pts[st.segIdx % pts.length];
        const to = pts[(st.segIdx + 1) % pts.length];

        st.progress += st.worker.speed;
        if (st.progress >= 1.45) {
          // Pause at workstation so sprite visibly tends its station before shifting
          st.progress = 0;
          st.segIdx = (st.segIdx + 1) % pts.length;
        }

        const t = Math.min(1, st.progress);
        const x = from.x + (to.x - from.x) * t;
        const y = from.y + (to.y - from.y) * t;
        const isWalking = st.progress < 1;
        const bob = isWalking
          ? Math.abs(Math.sin(tick * 0.14 + st.phase)) * -3.5
          : Math.sin(tick * 0.06 + st.phase) * -1.3;
        const flip = to.x < from.x ? -1 : 1;

        const el = workerRefs.current[st.worker.id];
        if (el) {
          el.setAttribute('transform', `translate(${x.toFixed(1)}, ${(y + bob).toFixed(1)})`);
          const imgGroup = el.querySelector('.sprite-flip');
          if (imgGroup) {
            imgGroup.setAttribute('transform', `scale(${flip}, 1)`);
          }
        }
      });

      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [room]);

  const headDisplayName = departmentRecord?.repName?.trim() || '';
  const cropFallback = ASSETS['crop-' + building.id]?.src || ASSETS['world-map']?.src || '';
  const showWatchAlert = building.id === 'executive' && pendingPermitCount > 0;
  const openDashboardLabel =
    building.id === 'childrens-books'
      ? 'Open Bramblewood Publishing Suite →'
      : building.id === 'home-garden'
        ? 'Open Family Sanctuary Hub →'
        : `Open ${building.name} Dashboard →`;

  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-[#1b120c] text-[#f7e8c6] select-none">
      {/* TOP ROOM HEADER */}
      <header className="flex items-center justify-between gap-2 px-3 py-2 bg-[#2b1d13] border-b-2 border-[#a57b42] shadow-md">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onExitToCampus}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#402c1e] hover:bg-[#5b3f2b] border border-[#a57b42]/70 text-[#fbe8b5] shrink-0 cursor-pointer"
          >
            ← Campus Map
          </button>
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-[#dfb97a] font-semibold truncate">
              {building.district}
            </div>
            <h2 className="font-atlas text-sm sm:text-base font-bold text-[#fbe8b5] truncate">
              Inside {building.name}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span
            className={`hidden md:inline-block px-2 py-1 rounded-md text-[11px] font-bold border ${
              constitutionActive
                ? 'bg-emerald-950/70 text-emerald-200 border-emerald-500/40'
                : 'bg-amber-950/70 text-amber-200 border-amber-500/40'
            }`}
          >
            {constitutionActive ? '✅ Constitution Active' : '⏸️ Standby · Pending Constitution'}
          </span>
          {role === 'guest' && (
            <span className="hidden sm:inline-block px-2 py-1 rounded-md bg-[#eef4f8] text-[#224459] text-[11px] font-bold">
              Read-Only Tour
            </span>
          )}
          {showWatchAlert && (
            <button
              onClick={onOpenDashboard}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-[#2b1d13] shadow cursor-pointer"
            >
              ! {pendingPermitCount} Pending
            </button>
          )}
          <button
            onClick={onOpenDashboard}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#8a5a24] hover:bg-[#a16b2d] border border-[#f5d393]/60 text-[#fff8e7] shadow cursor-pointer"
          >
            {building.id === 'childrens-books'
              ? '📚 Open Publishing Suite'
              : building.id === 'home-garden'
                ? '🏡 Open Family Hub'
                : '📋 Open Dashboard'}
          </button>
        </div>
      </header>

      {/* FULL-SCREEN INTERACTIVE ILLUSTRATED INTERIOR ROOM */}
      <main className="relative flex-1 overflow-hidden flex items-center justify-center bg-[#1e140d]">
        {/* Hint Pill */}
        <div className="hidden sm:flex absolute top-3 left-3 z-20 items-center gap-2 px-3 py-1.5 rounded-full ribbon-btn text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              constitutionActive ? 'bg-[#2a9d8f]' : 'bg-amber-500'
            }`}
          />
          <span>
            Tap any sprite or custom workstation to inspect · Click{' '}
            <strong>
              {building.id === 'childrens-books'
                ? 'Open Publishing Suite'
                : building.id === 'home-garden'
                  ? 'Open Family Hub'
                  : 'Open Dashboard'}
            </strong>{' '}
            for live tools
          </span>
        </div>

        <svg
          className="w-full h-full max-w-[1440px]"
          viewBox="0 0 1216 688"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="roomGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="parchmentFloorGrad" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#f5e4be" />
              <stop offset="100%" stopColor="#c79e61" />
            </radialGradient>
          </defs>

          {/* BACKDROP: Custom ComfyUI Painted RPG Interior OR Stylized Studio Preview */}
          {room.hasPaintedBackdrop && room.backdropSrc ? (
            <image
              href={room.backdropSrc}
              x="0"
              y="0"
              width="1216"
              height="688"
              preserveAspectRatio="xMidYMid slice"
            />
          ) : (
            <g>
              <rect x="0" y="0" width="1216" height="688" fill="url(#parchmentFloorGrad)" />
              {cropFallback && (
                <image
                  href={cropFallback}
                  x="0"
                  y="0"
                  width="1216"
                  height="688"
                  preserveAspectRatio="xMidYMid slice"
                  opacity="0.28"
                />
              )}
              <rect
                x="54"
                y="46"
                width="1108"
                height="596"
                rx="22"
                fill="#fbf2dc"
                fillOpacity="0.82"
                stroke="#7a5328"
                strokeWidth="4"
              />
              <text
                x="608"
                y="118"
                textAnchor="middle"
                className="font-atlas"
                fontSize="26"
                fontWeight="bold"
                fill="#3b220d"
              >
                {building.name} — Interior Studio Preview
              </text>
            </g>
          )}

          {/* Subtle dark vignette border for crisp framing */}
          <rect
            x="0"
            y="0"
            width="1216"
            height="688"
            fill="none"
            stroke="#2b1d13"
            strokeWidth="12"
            opacity="0.65"
            pointerEvents="none"
          />

          {/* Ambient magical/lantern shimmers */}
          <g pointerEvents="none" filter="url(#roomGlow)">
            {room.ambientGlows.map((g, i) => (
              <circle
                key={i}
                cx={g.x}
                cy={g.y}
                r={g.r}
                fill={g.color}
                opacity="0.26"
                className={g.pulse === 'a' ? 'shimmer-a' : 'shimmer-b'}
              />
            ))}
          </g>

          {/* CLICKABLE ROOM-WIDE LANDMARK STATIONS (Dashboard / Exit) */}
          <g>
            {room.stations.map((st) => {
              const pillW = Math.max(150, st.label.length * 7.0 + 34);
              const isExit = st.action === 'exit';
              return (
                <g
                  key={st.id}
                  className="hotspot-group"
                  transform={`translate(${st.x}, ${st.y})`}
                  onClick={() => (isExit ? onExitToCampus() : onOpenDashboard())}
                >
                  <circle
                    className="hover-aura"
                    cx="0"
                    cy="0"
                    r="34"
                    fill="#ffd166"
                    filter="url(#roomGlow)"
                  />
                  <rect
                    x={-pillW / 2}
                    y="-15"
                    width={pillW}
                    height="30"
                    rx="15"
                    fill={isExit ? '#362316' : '#fbf1d7'}
                    fillOpacity="0.93"
                    stroke={isExit ? '#d9b26f' : '#6b451f'}
                    strokeWidth="2"
                  />
                  <text
                    x="0"
                    y="4.5"
                    textAnchor="middle"
                    className="font-atlas"
                    fontSize="12"
                    fontWeight="bold"
                    fill={isExit ? '#fbe8b5' : '#331d0b'}
                  >
                    {st.icon} {st.label}
                  </text>
                </g>
              );
            })}
          </g>

          {/* CUSTOM AGENT WORKSTATIONS LAYER */}
          <g>
            {room.workers.map((w) => {
              if (w.stationX === undefined || w.stationY === undefined) return null;
              const isSelected = selectedWorker?.id === w.id;
              const plaqueText = `${w.workstationIcon || w.workIcon} ${
                w.workstationShort || w.workstationName || w.roleTitle
              }`;
              const plaqueW = Math.max(88, plaqueText.length * 5.6 + 18);

              return (
                <g
                  key={`${w.id}-station`}
                  className="hotspot-group cursor-pointer"
                  transform={`translate(${w.stationX}, ${w.stationY})`}
                  onClick={() => {
                    setSelectedWorker(w);
                    setRosterOpen(false);
                  }}
                >
                  {/* Soft floor rug/pad underneath furniture */}
                  <ellipse cx="0" cy="7" rx="40" ry="13" fill="#1b1008" opacity="0.4" />
                  {isSelected && (
                    <circle
                      cx="0"
                      cy="-4"
                      r="38"
                      fill="#ffd166"
                      opacity="0.34"
                      filter="url(#roomGlow)"
                    />
                  )}
                  <circle
                    className="hover-aura"
                    cx="0"
                    cy="-4"
                    r="32"
                    fill="#ffd166"
                    filter="url(#roomGlow)"
                  />
                  <WorkstationProp
                    style={w.workstationStyle || 'desk'}
                    selected={isSelected}
                  />
                  {/* Compact workstation plaque cleanly below sprite nameplate */}
                  <g transform="translate(0, 46)">
                    <rect
                      x={-plaqueW / 2}
                      y="-8.5"
                      width={plaqueW}
                      height="17"
                      rx="8.5"
                      fill={isSelected ? '#78350f' : '#fdf2d6'}
                      fillOpacity="0.93"
                      stroke={isSelected ? '#fde68a' : '#7a5226'}
                      strokeWidth={isSelected ? '1.6' : '1.1'}
                    />
                    <text
                      x="0"
                      y="3"
                      textAnchor="middle"
                      fontSize="9.2"
                      fontWeight="bold"
                      fill={isSelected ? '#fef3c7' : '#331d0b'}
                    >
                      {plaqueText}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>

          {/* D&D FANTASY SPRITES STATIONED AT THEIR CUSTOM WORKSTATIONS */}
          <g>
            {sortedWorkers.map((w) => {
              const asset = ASSETS[w.spriteKey];
              const spriteH =
                w.species === 'Halfling' ? baseSpriteSize.halfling : baseSpriteSize.regular;
              const spriteW = asset?.w && asset?.h ? (asset.w / asset.h) * spriteH : spriteH * 0.85;
              const uiScale = spriteH / 84;
              const labelName =
                w.isDeptHead && headDisplayName ? headDisplayName : w.defaultName;
              const showAlert = Boolean(w.isDeptHead && showWatchAlert);
              const isSelected = selectedWorker?.id === w.id;
              const nameplateW = Math.max(58, labelName.length * (6.2 * Math.max(0.84, uiScale)) + 14);

              return (
                <g
                  key={w.id}
                  ref={(el) => {
                    workerRefs.current[w.id] = el;
                  }}
                  className="sprite-group cursor-pointer"
                  transform={`translate(${w.route[0]?.x || 608}, ${w.route[0]?.y || 440})`}
                  onClick={() => {
                    setSelectedWorker(w);
                    setRosterOpen(false);
                  }}
                >
                  {/* Soft floor shadow */}
                  <ellipse
                    cx="0"
                    cy="3"
                    rx={(24 * uiScale).toFixed(1)}
                    ry={(8 * uiScale).toFixed(1)}
                    fill={isSelected ? '#f59e0b' : '#1c1108'}
                    opacity={isSelected ? '0.62' : '0.45'}
                  />

                  {/* Flippable sprite body */}
                  <g className="sprite-flip">
                    {asset?.src && (
                      <image
                        href={asset.src}
                        style={w.hue ? { filter: `hue-rotate(${w.hue}deg)` } : undefined}
                        x={(-spriteW / 2).toFixed(1)}
                        y={(-spriteH + 5).toFixed(1)}
                        width={spriteW.toFixed(1)}
                        height={spriteH}
                      />
                    )}
                  </g>

                  {/* Work / Standby / Alert Bubble above sprite head */}
                  <g transform={`translate(0, ${(-spriteH - 8 * uiScale).toFixed(1)})`}>
                    <circle
                      cx="0"
                      cy="0"
                      r={showAlert ? 13 : Math.max(9.5, 12 * uiScale)}
                      fill={showAlert ? '#f59e0b' : '#fff8e7'}
                      stroke={isSelected ? '#d97706' : showAlert ? '#2b1d13' : '#7a5226'}
                      strokeWidth={isSelected ? '2.4' : '1.8'}
                    />
                    <text
                      x="0"
                      y="3.8"
                      textAnchor="middle"
                      fontSize={showAlert ? 13 : Math.max(9.5, 11.5 * uiScale)}
                      fontWeight="bold"
                      fill="#2b1d13"
                    >
                      {showAlert ? '!' : w.workIcon}
                    </text>
                  </g>

                  {/* Crisp Nameplate under feet */}
                  <g transform="translate(0, 14)">
                    <rect
                      x={-nameplateW / 2}
                      y="-8"
                      width={nameplateW}
                      height="16"
                      rx="8"
                      fill={isSelected ? '#78350f' : '#2b1d13'}
                      fillOpacity="0.9"
                      stroke={isSelected ? '#fde68a' : '#c89d58'}
                      strokeWidth={isSelected ? '1.8' : '1.1'}
                    />
                    <text
                      x="0"
                      y="3"
                      textAnchor="middle"
                      fontSize={Math.max(8.8, 10 * uiScale)}
                      fontWeight="bold"
                      fill="#fbe8b5"
                    >
                      {labelName}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>

        {/* WORKSTATION ROSTER POPOVER (Quick Jump to any agent/station) */}
        {rosterOpen && (
          <div className="absolute bottom-14 right-3 z-30 parchment-panel rounded-2xl p-3 max-w-sm w-[92%] sm:w-80 max-h-[65vh] overflow-y-auto text-xs shadow-2xl">
            <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#ad8042]/40">
              <div className="font-atlas font-bold text-sm text-[#3c230f]">
                🧑‍🎨 {building.name} Workstations ({room.workers.length})
              </div>
              <button
                onClick={() => setRosterOpen(false)}
                className="text-[#7a4f23] font-bold px-1.5 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1.5">
              {room.workers.map((w) => {
                const display = w.isDeptHead && headDisplayName ? headDisplayName : w.defaultName;
                const active = selectedWorker?.id === w.id;
                return (
                  <button
                    key={w.id}
                    onClick={() => {
                      setSelectedWorker(w);
                      setRosterOpen(false);
                    }}
                    className={`w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition cursor-pointer ${
                      active
                        ? 'bg-[#f5deb0] border-[#8a5a24]'
                        : 'bg-white/65 hover:bg-[#fbf1d7] border-[#ad8042]/35'
                    }`}
                  >
                    <img
                      src={ASSETS[w.spriteKey]?.src || ''}
                      alt={display}
                      style={w.hue ? { filter: `hue-rotate(${w.hue}deg)` } : undefined}
                      className="w-7 h-8 object-contain shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-[#3c230f] truncate">
                        {display} · <span className="font-normal text-[#6b4423]">{w.roleTitle}</span>
                      </div>
                      {w.workstationName && (
                        <div className="text-[10.5px] text-[#7a4f23] truncate">
                          {w.workstationIcon || w.workIcon} {w.workstationName}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* RPG SPRITE & WORKSTATION INSPECTION CARD */}
        {selectedWorker && (
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-30 parchment-panel rounded-2xl px-4 py-3 max-w-md w-[94%] text-xs">
            <div className="flex items-start gap-3">
              <img
                src={ASSETS[selectedWorker.spriteKey]?.src || ''}
                alt={selectedWorker.defaultName}
                style={{
                  filter: selectedWorker.hue
                    ? `hue-rotate(${selectedWorker.hue}deg)`
                    : undefined,
                }}
                className="w-14 h-16 object-contain shrink-0 drop-shadow"
              />
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-atlas font-bold text-sm text-[#3c230f]">
                    {selectedWorker.isDeptHead && headDisplayName
                      ? headDisplayName
                      : selectedWorker.defaultName}{' '}
                    · {selectedWorker.species}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      constitutionActive
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}
                  >
                    {constitutionActive ? '✅ Active' : '⏸️ Standby · Pending Constitution'}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-[#7a4f23]">
                  {selectedWorker.roleTitle} · {building.name}
                </div>
                {selectedWorker.tier && (
                  <div className="inline-block px-2 py-0.5 rounded bg-[#ead7b0] text-[#4a2e16] text-[10px] font-semibold">
                    ⚖️ {selectedWorker.tier}
                  </div>
                )}
                {selectedWorker.workstationName && (
                  <div className="text-[11px] font-semibold text-[#3f5d38] bg-[#eef6ea] border border-[#b7d6ab] rounded-lg px-2 py-0.5">
                    {selectedWorker.workstationIcon || selectedWorker.workIcon} Workstation:{' '}
                    {selectedWorker.workstationName}
                  </div>
                )}
                <p className="text-[#3a2614] leading-snug pt-0.5">“{selectedWorker.taskLine}”</p>
                <div className="pt-1">
                  <button
                    onClick={onOpenDashboard}
                    className="px-3 py-1 rounded-lg bg-[#6b4423] hover:bg-[#82542b] text-[#fbe8b5] text-[11px] font-semibold cursor-pointer"
                  >
                    {openDashboardLabel}
                  </button>
                </div>
              </div>
              <button
                onClick={() => setSelectedWorker(null)}
                className="text-[#7a4f23] font-bold px-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* MOBILE-FRIENDLY ROOM FOOTER DOCK */}
        <div className="absolute bottom-2 left-2 right-2 z-20 flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-[#2b1d13]/92 border border-[#a57b42] shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs text-[#f5dfaf] truncate">
            <span className="font-atlas font-bold text-[#ffd166]">
              {room.workers.length} Sprite{room.workers.length === 1 ? '' : 's'} at Workstations (
              {constitutionActive ? 'Active' : 'Standby'})
            </span>
            <span className="hidden sm:inline text-[#d9be8c]">
              · Tap any sprite or custom desk to inspect
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setRosterOpen((v) => !v)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#4c3322] hover:bg-[#62432d] text-[#fbe8b5] border border-[#c89d58]/60 cursor-pointer"
            >
              🧑‍🎨 Workstations ({room.workers.length})
            </button>
            <button
              onClick={onOpenDashboard}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#6b4423] hover:bg-[#83542b] text-[#fbe8b5] border border-[#c89d58]/60 cursor-pointer"
            >
              {building.id === 'childrens-books'
                ? '📚 Suite'
                : building.id === 'home-garden'
                  ? '🏡 Hub'
                  : '📋 Dashboard'}
            </button>
            <button
              onClick={onExitToCampus}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#402c1e] hover:bg-[#573c29] text-[#f5dfaf] border border-[#a57b42]/60 cursor-pointer"
            >
              🚪 Exit
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
