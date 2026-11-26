import { useEffect, useMemo, useRef, useState } from 'react';
import type { BuildingDef } from '../data/campusData';
import { ASSETS } from '../data/assetMeta';
import { getRoomConfig, type RoomWorker } from '../data/interiorConfigs';
import type { CampusRole } from '../firebase';
import type { DepartmentRecord } from '../services/firestoreService';

interface InteriorRoomViewProps {
  building: BuildingDef;
  role: CampusRole;
  departmentRecord?: DepartmentRecord;
  pendingPermitCount: number;
  onExitToCampus: () => void;
  onOpenDashboard: () => void;
}

interface LiveWorkerState {
  worker: RoomWorker;
  segIdx: number;
  progress: number;
  phase: number;
}

export function InteriorRoomView({
  building,
  role,
  departmentRecord,
  pendingPermitCount,
  onExitToCampus,
  onOpenDashboard,
}: InteriorRoomViewProps) {
  const room = useMemo(
    () => getRoomConfig(building.id, building.repSprite, building.headRole),
    [building.id, building.repSprite, building.headRole]
  );

  const [selectedWorker, setSelectedWorker] = useState<RoomWorker | null>(null);
  const workerRefs = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    setSelectedWorker(null);
  }, [building.id]);

  // Animate sprites strolling & working between stations inside the room
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
      live.forEach((st, idx) => {
        const pts = st.worker.route;
        if (pts.length === 0) return;
        const from = pts[st.segIdx % pts.length];
        const to = pts[(st.segIdx + 1) % pts.length];

        st.progress += st.worker.speed;
        if (st.progress >= 1.35) {
          // Brief pause at station (1.0 -> 1.35) so sprite visibly "works" before moving on
          st.progress = 0;
          st.segIdx = (st.segIdx + 1) % pts.length;
        }

        const t = Math.min(1, st.progress);
        const x = from.x + (to.x - from.x) * t;
        const y = from.y + (to.y - from.y) * t;
        const isWalking = st.progress < 1;
        const bob = isWalking
          ? Math.abs(Math.sin(tick * 0.14 + st.phase)) * -4.2
          : Math.sin(tick * 0.06 + st.phase) * -1.4;
        const flip = to.x < from.x ? -1 : 1;

        workerRefs.current[idx]?.setAttribute(
          'transform',
          `translate(${x.toFixed(1)}, ${(y + bob).toFixed(1)})`
        );
        const imgGroup = workerRefs.current[idx]?.querySelector('.sprite-flip');
        if (imgGroup) {
          imgGroup.setAttribute('transform', `scale(${flip}, 1)`);
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
            📋 Open Dashboard
          </button>
        </div>
      </header>

      {/* FULL-SCREEN INTERACTIVE ILLUSTRATED INTERIOR ROOM */}
      <main className="relative flex-1 overflow-hidden flex items-center justify-center bg-[#1e140d]">
        {/* Hint Pill */}
        <div className="hidden sm:flex absolute top-3 left-3 z-20 items-center gap-2 px-3 py-1.5 rounded-full ribbon-btn text-xs">
          <span className="w-2 h-2 rounded-full bg-[#2a9d8f]" />
          <span>
            Tap any working sprite to chat · Tap a room station or <strong>Open Dashboard</strong>{' '}
            for live controls
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
              <text
                x="608"
                y="150"
                textAnchor="middle"
                fontSize="14"
                fill="#6e4820"
              >
                Custom hand-painted RPG interior art queued for Batch 2 after your v2 review
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

          {/* CLICKABLE INTERACTIVE ROOM STATIONS */}
          <g>
            {room.stations.map((st) => {
              const pillW = Math.max(150, st.label.length * 7.2 + 34);
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
                    r="36"
                    fill="#ffd166"
                    filter="url(#roomGlow)"
                  />
                  <rect
                    x={-pillW / 2}
                    y="-16"
                    width={pillW}
                    height="32"
                    rx="16"
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

          {/* WORKING D&D FANTASY SPRITES INSIDE THE ROOM */}
          <g>
            {room.workers.map((w, idx) => {
              const asset = ASSETS[w.spriteKey];
              const spriteH = w.species === 'Halfling' ? 76 : 88;
              const spriteW = asset?.w && asset?.h ? (asset.w / asset.h) * spriteH : 72;
              const labelName =
                w.isDeptHead && headDisplayName ? headDisplayName : w.defaultName;
              const showAlert = Boolean(w.isDeptHead && showWatchAlert);

              return (
                <g
                  key={w.id}
                  ref={(el) => {
                    workerRefs.current[idx] = el;
                  }}
                  className="sprite-group"
                  transform={`translate(${w.route[0]?.x || 608}, ${w.route[0]?.y || 440})`}
                  onClick={() => setSelectedWorker(w)}
                >
                  {/* Soft floor shadow */}
                  <ellipse cx="0" cy="4" rx="26" ry="9" fill="#1c1108" opacity="0.45" />

                  {/* Flippable sprite body */}
                  <g className="sprite-flip">
                    {asset?.src && (
                      <image
                        href={asset.src}
                        style={w.hue ? { filter: `hue-rotate(${w.hue}deg)` } : undefined}
                        x={(-spriteW / 2).toFixed(1)}
                        y={(-spriteH + 6).toFixed(1)}
                        width={spriteW.toFixed(1)}
                        height={spriteH}
                      />
                    )}
                  </g>

                  {/* Work / Alert Bubble above sprite head */}
                  <g transform={`translate(0, ${(-spriteH - 12).toFixed(1)})`}>
                    <circle
                      cx="0"
                      cy="0"
                      r={showAlert ? '15' : '13'}
                      fill={showAlert ? '#f59e0b' : '#fff8e7'}
                      stroke={showAlert ? '#2b1d13' : '#7a5226'}
                      strokeWidth="2"
                    />
                    <text
                      x="0"
                      y="4.5"
                      textAnchor="middle"
                      fontSize={showAlert ? '14' : '12'}
                      fontWeight="bold"
                      fill="#2b1d13"
                    >
                      {showAlert ? '!' : w.workIcon}
                    </text>
                  </g>

                  {/* Crisp Nameplate under feet */}
                  <g transform="translate(0, 20)">
                    <rect
                      x={-(Math.max(70, labelName.length * 6.8 + 16)) / 2}
                      y="-9"
                      width={Math.max(70, labelName.length * 6.8 + 16)}
                      height="18"
                      rx="9"
                      fill="#2b1d13"
                      fillOpacity="0.88"
                      stroke="#c89d58"
                      strokeWidth="1.2"
                    />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fontSize="10.5"
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

        {/* RPG SPRITE DIALOGUE BOX (WHEN A WORKING SPRITE IS TAPPED) */}
        {selectedWorker && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 parchment-panel rounded-2xl px-4 py-3 max-w-md w-[94%] text-xs">
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
                <div className="font-atlas font-bold text-sm text-[#3c230f]">
                  {selectedWorker.isDeptHead && headDisplayName
                    ? headDisplayName
                    : selectedWorker.defaultName}{' '}
                  · {selectedWorker.species}
                </div>
                <div className="text-[11px] font-semibold text-[#7a4f23]">
                  {selectedWorker.roleTitle} · Working in {building.name}
                </div>
                <p className="text-[#3a2614] leading-snug">“{selectedWorker.taskLine}”</p>
                <div className="pt-1">
                  <button
                    onClick={onOpenDashboard}
                    className="px-3 py-1 rounded-lg bg-[#6b4423] hover:bg-[#82542b] text-[#fbe8b5] text-[11px] font-semibold cursor-pointer"
                  >
                    Open {building.name} Dashboard →
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
              {room.workers.length} Sprite{room.workers.length === 1 ? '' : 's'} Working
            </span>
            <span className="hidden sm:inline text-[#d9be8c]">
              · Tap a sprite to talk or click a station for live tools
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onOpenDashboard}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#6b4423] hover:bg-[#83542b] text-[#fbe8b5] border border-[#c89d58]/60 cursor-pointer"
            >
              📋 Dashboard
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
