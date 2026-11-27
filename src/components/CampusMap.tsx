import { useEffect, useRef, useState } from 'react';
import {
  BUILDINGS,
  GRAPH,
  SPRITES_DATA,
  WAYPOINTS,
  type BuildingDef,
  type SpriteDef,
} from '../data/campusData';
import { ASSETS } from '../data/assetMeta';
import { signOutUser, type CampusRole } from '../firebase';
import type {
  AccessRoleRecord,
  AirBridgeRecord,
  ConductLogRecord,
  DepartmentRecord,
  GovernanceProposal,
  PermitRecord,
  SkillRegistryRecord,
} from '../services/firestoreService';
import { InteriorModal } from './InteriorModal';
import { InteriorRoomView } from './InteriorRoomView';

interface CampusMapProps {
  role: CampusRole;
  userEmail: string;
  departments: Record<string, DepartmentRecord>;
  proposals: GovernanceProposal[];
  permits: PermitRecord[];
  conductLogs: ConductLogRecord[];
  skills: SkillRegistryRecord[];
  bridges: AirBridgeRecord[];
  accessRoles: AccessRoleRecord[];
  syncError: string | null;
  onOpenFamilyPreview: () => void;
  onOpenBramblewood: () => void;
}

interface ActiveSprite extends SpriteDef {
  fromId: string;
  toId: string;
  x: number;
  y: number;
  progress: number;
  speed: number;
  phase: number;
}

const wpMap = Object.fromEntries(WAYPOINTS.map((w) => [w.id, w]));

export function CampusMap({
  role,
  userEmail,
  departments,
  proposals,
  permits,
  conductLogs,
  skills,
  bridges,
  accessRoles,
  syncError,
  onOpenFamilyPreview,
  onOpenBramblewood,
}: CampusMapProps) {
  const [labelsVisible, setLabelsVisible] = useState(true);
  const [spritesEnabled, setSpritesEnabled] = useState(true);
  const [zonedBuilding, setZonedBuilding] = useState<BuildingDef | null>(null);
  const [dashboardBuilding, setDashboardBuilding] = useState<BuildingDef | null>(null);
  const [activeSpriteToast, setActiveSpriteToast] = useState<SpriteDef | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const viewportRef = useRef<SVGGElement | null>(null);
  const trackPathRef = useRef<SVGPathElement | null>(null);
  const trainGroupRef = useRef<SVGGElement | null>(null);
  const tickerTextRef = useRef<SVGTextElement | null>(null);
  const spriteNodeRefs = useRef<(SVGGElement | null)[]>([]);
  const spritesEnabledRef = useRef(spritesEnabled);

  useEffect(() => {
    spritesEnabledRef.current = spritesEnabled;
  }, [spritesEnabled]);

  const transformRef = useRef({ panX: 0, panY: 0, scale: 1 });
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const dragOriginRef = useRef({ startX: 0, startY: 0, dragging: false });
  const pinchStartRef = useRef<{ dist: number; scale: number } | null>(null);

  function applyTransform() {
    const { panX, panY, scale } = transformRef.current;
    viewportRef.current?.setAttribute('transform', `translate(${panX}, ${panY}) scale(${scale})`);
  }

  function resetView() {
    transformRef.current = { panX: 0, panY: 0, scale: 1 };
    applyTransform();
  }

  function focusBuilding(b: BuildingDef) {
    const scale = 1.5;
    transformRef.current = {
      scale,
      panX: 800 - b.x * scale,
      panY: 450 - b.y * scale,
    };
    applyTransform();
  }

  function enterBuilding(b: BuildingDef, mode: 'zone' | 'dashboard') {
    setActiveSpriteToast(null);
    if (b.id === 'home-garden') {
      setZonedBuilding(null);
      setDashboardBuilding(null);
      onOpenFamilyPreview();
      return;
    }
    if (b.id === 'childrens-books') {
      setZonedBuilding(null);
      setDashboardBuilding(null);
      onOpenBramblewood();
      return;
    }
    if (mode === 'zone') setZonedBuilding(b);
    else setDashboardBuilding(b);
  }

  function adjustZoom(factor: number) {
    const t = transformRef.current;
    t.scale = Math.min(2.6, Math.max(0.7, t.scale * factor));
    applyTransform();
  }

  useEffect(() => {
    const activeSprites: ActiveSprite[] = SPRITES_DATA.map((s, idx) => {
      const start = wpMap[s.node] || WAYPOINTS[0];
      const neighbors = GRAPH[s.node] || ['north_quad_w'];
      const targetId = neighbors[Math.floor(Math.random() * neighbors.length)];
      return {
        ...s,
        fromId: s.node,
        toId: targetId,
        x: start.x,
        y: start.y,
        progress: Math.random() * 0.55,
        speed: 0.002 + (idx % 4) * 0.00045,
        phase: idx * 0.85,
      };
    });

    let tickerX = 176;
    let tickCount = 0;
    let rafId = 0;

    function animate() {
      tickCount += 1;

      if (spritesEnabledRef.current) {
        activeSprites.forEach((sp, idx) => {
          sp.progress += sp.speed;
          if (sp.progress >= 1) {
            sp.progress = 0;
            const prev = sp.fromId;
            sp.fromId = sp.toId;
            const opts = GRAPH[sp.fromId] || ['north_quad_w'];
            const nonBack = opts.filter((n) => n !== prev);
            const pool = nonBack.length ? nonBack : opts;
            sp.toId = pool[Math.floor(Math.random() * pool.length)];
          }
          const a = wpMap[sp.fromId];
          const b = wpMap[sp.toId];
          sp.x = a.x + (b.x - a.x) * sp.progress;
          sp.y = a.y + (b.y - a.y) * sp.progress;
          const bob = Math.abs(Math.sin(tickCount * 0.13 + sp.phase)) * -3.2;
          const flip = b.x < a.x ? -1 : 1;
          spriteNodeRefs.current[idx]?.setAttribute(
            'transform',
            `translate(${sp.x.toFixed(1)}, ${(sp.y + bob).toFixed(1)}) scale(${flip}, 1)`
          );
        });
      }

      const trackPath = trackPathRef.current;
      const trainEl = trainGroupRef.current;
      if (trackPath && trainEl) {
        const trackLen = trackPath.getTotalLength();
        const rawPhase = tickCount * 0.0065;
        const trainT = (Math.sin(rawPhase) + 1) / 2;
        const headingOut = Math.cos(rawPhase) >= 0;
        const pt = trackPath.getPointAtLength(trainT * trackLen);
        const flipTrain = headingOut ? 1 : -1;
        trainEl.setAttribute(
          'transform',
          `translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)}) scale(${flipTrain}, 1)`
        );
      }

      tickerX -= 0.55;
      if (tickerX < -375) tickerX = 178;
      tickerTextRef.current?.setAttribute('x', tickerX.toFixed(1));

      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (target?.closest('.hotspot-group') || target?.closest('.sprite-group')) return;
      svg.setPointerCapture(e.pointerId);
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointersRef.current.size === 1) {
        dragOriginRef.current = {
          dragging: true,
          startX: e.clientX - transformRef.current.panX,
          startY: e.clientY - transformRef.current.panY,
        };
        pinchStartRef.current = null;
      } else if (pointersRef.current.size === 2) {
        const pts = Array.from(pointersRef.current.values());
        const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
        pinchStartRef.current = { dist, scale: transformRef.current.scale };
        dragOriginRef.current.dragging = false;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!pointersRef.current.has(e.pointerId)) return;
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointersRef.current.size === 2 && pinchStartRef.current) {
        const pts = Array.from(pointersRef.current.values());
        const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
        if (pinchStartRef.current.dist > 0) {
          const ratio = dist / pinchStartRef.current.dist;
          transformRef.current.scale = Math.min(
            2.6,
            Math.max(0.7, pinchStartRef.current.scale * ratio)
          );
          applyTransform();
        }
      } else if (pointersRef.current.size === 1 && dragOriginRef.current.dragging) {
        transformRef.current.panX = e.clientX - dragOriginRef.current.startX;
        transformRef.current.panY = e.clientY - dragOriginRef.current.startY;
        applyTransform();
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      pointersRef.current.delete(e.pointerId);
      if (pointersRef.current.size < 2) pinchStartRef.current = null;
      if (pointersRef.current.size === 0) dragOriginRef.current.dragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      adjustZoom(e.deltaY > 0 ? 0.9 : 1.1);
    };

    svg.addEventListener('pointerdown', onPointerDown);
    svg.addEventListener('pointermove', onPointerMove);
    svg.addEventListener('pointerup', onPointerUp);
    svg.addEventListener('pointercancel', onPointerUp);
    svg.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      svg.removeEventListener('pointerdown', onPointerDown);
      svg.removeEventListener('pointermove', onPointerMove);
      svg.removeEventListener('pointerup', onPointerUp);
      svg.removeEventListener('pointercancel', onPointerUp);
      svg.removeEventListener('wheel', onWheel);
    };
  }, []);

  const trainAsset = ASSETS['stone-train'];
  const trainDrawW = 92;
  const trainDrawH =
    trainAsset?.w && trainAsset?.h ? (trainAsset.h / trainAsset.w) * trainDrawW : 46;
  const roleLabel =
    role === 'chancellor'
      ? 'Chancellor View'
      : role === 'guest'
        ? 'Campus Guest · Read-Only'
        : 'University Full Access';

  const pendingPermitCount = permits.filter((p) => p.status === 'pending').length;
  const canPreviewFamily = role === 'chancellor' || role === 'university';
  const watchBuilding = BUILDINGS.find((b) => b.id === 'executive') || null;

  return (
    <div className="h-screen w-screen flex flex-col select-none">
      {/* TOP ATLAS BAR */}
      <header className="z-20 flex items-center justify-between gap-2 px-3 py-2 bg-[#2b1d13] text-[#f7e8c6] border-b-2 border-[#a57b42] shadow-md">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ffd166] via-[#c77dff] to-[#00bbf9] p-[2px] shrink-0">
            <div className="w-full h-full rounded-full bg-[#2b1d13] flex items-center justify-center text-xs font-atlas font-bold text-[#fbe8b5]">
              AI
            </div>
          </div>
          <div className="truncate">
            <h1 className="font-atlas text-sm sm:text-base font-bold tracking-wide text-[#fbe8b5] leading-tight truncate">
              Cairnspire University
            </h1>
            <p className="text-[11px] text-[#d9be8c] leading-tight truncate">
              v2 RPG Campus · 14 Halls · {roleLabel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {pendingPermitCount > 0 && watchBuilding && (
            <button
              onClick={() => {
                focusBuilding(watchBuilding);
                setDashboardBuilding(watchBuilding);
              }}
              className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500 hover:bg-amber-400 text-[#2b1d13] shadow cursor-pointer"
            >
              ! {pendingPermitCount} Permit{pendingPermitCount === 1 ? '' : 's'}
            </button>
          )}
          <button
            onClick={() => setLabelsVisible((v) => !v)}
            className="px-2 py-1 rounded-md text-xs font-medium bg-[#402c1e] hover:bg-[#573c29] border border-[#a57b42]/60 text-[#f5dfaf] cursor-pointer"
          >
            Labels: {labelsVisible ? 'On' : 'Off'}
          </button>
          <button
            onClick={() => setSpritesEnabled((v) => !v)}
            className="hidden sm:inline-block px-2 py-1 rounded-md text-xs font-medium bg-[#402c1e] hover:bg-[#573c29] border border-[#a57b42]/60 text-[#f5dfaf] cursor-pointer"
          >
            Sprites: {spritesEnabled ? 'On' : 'Off'}
          </button>
          {canPreviewFamily && (
            <button
              onClick={onOpenFamilyPreview}
              className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#2d7a4f] hover:bg-[#379460] border border-[#8ce0ad]/60 text-white cursor-pointer"
            >
              Family / Kid Mode
            </button>
          )}
          <button
            onClick={() => void signOutUser()}
            title={userEmail}
            className="px-2 py-1 rounded-md text-xs font-medium bg-[#402c1e] hover:bg-[#573c29] border border-[#a57b42]/60 text-[#f5dfaf] cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* MAIN INTERACTIVE WORLD MAP VIEWPORT */}
      <main className="relative flex-1 overflow-hidden bg-[#2b1e14]">
        {syncError && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 rounded-lg bg-amber-100 border border-amber-500 text-xs text-amber-950 shadow">
            Firestore sync notice: {syncError}
          </div>
        )}

        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
          <button
            onClick={() => adjustZoom(1.2)}
            title="Zoom In"
            className="w-9 h-9 rounded-lg ribbon-btn font-bold text-base flex items-center justify-center cursor-pointer"
          >
            +
          </button>
          <button
            onClick={() => adjustZoom(0.85)}
            title="Zoom Out"
            className="w-9 h-9 rounded-lg ribbon-btn font-bold text-base flex items-center justify-center cursor-pointer"
          >
            −
          </button>
          <button
            onClick={resetView}
            title="Reset View"
            className="w-9 h-9 rounded-lg ribbon-btn text-xs font-bold flex items-center justify-center cursor-pointer"
          >
            Fit
          </button>
        </div>

        <div className="hidden sm:flex absolute top-3 left-3 z-20 items-center gap-2 px-3 py-1.5 rounded-full ribbon-btn text-xs">
          <span className="w-2 h-2 rounded-full bg-[#2a9d8f]" />
          <span>
            Tap any <strong>building</strong> to zone inside · Tap its <strong>cairn / ribbon</strong>{' '}
            for Dashboard
          </span>
        </div>

        {activeSpriteToast && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 parchment-panel rounded-xl px-4 py-3 max-w-sm w-[92%] text-xs">
            <div className="flex items-start gap-3">
              <img
                src={ASSETS[activeSpriteToast.spriteKey]?.src || ''}
                alt={activeSpriteToast.name}
                style={{
                  filter: activeSpriteToast.hue
                    ? `hue-rotate(${activeSpriteToast.hue}deg)`
                    : undefined,
                }}
                className="w-12 h-14 object-contain shrink-0 drop-shadow"
              />
              <div className="flex-1 min-w-0">
                <div className="font-atlas font-bold text-sm text-[#3c230f]">
                  {activeSpriteToast.name} · {activeSpriteToast.species}
                </div>
                <div className="text-[11px] font-semibold text-[#7a4f23]">
                  {activeSpriteToast.dept} · Strolling the cobblestone roads
                </div>
                <p className="mt-1 text-[#3a2614] leading-snug">“{activeSpriteToast.quote}”</p>
              </div>
              <button
                onClick={() => setActiveSpriteToast(null)}
                className="text-[#7a4f23] font-bold px-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <svg
          ref={svgRef}
          className="w-full h-full touch-none cursor-grab active:cursor-grabbing"
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <clipPath id="stocksLedClip">
              <rect x="0" y="0" width="174" height="15" rx="1" />
            </clipPath>

            <clipPath id="mineTunnelClip">
              <path d="M 800,200 L 1352,200 L 1352,325 L 1320,450 L 800,450 Z" />
            </clipPath>
          </defs>

          <g ref={viewportRef}>
            <image
              href={ASSETS['world-map']?.src || '/assets/cairnspire_world_map.jpg'}
              x="0"
              y="0"
              width="1600"
              height="900"
              preserveAspectRatio="none"
            />

            <g transform="translate(201, 250) skewY(-19.5)" pointerEvents="none">
              <rect x="0" y="0" width="174" height="15" rx="1.5" fill="#07131c" opacity="0.88" />
              <g clipPath="url(#stocksLedClip)">
                <text
                  ref={tickerTextRef}
                  x="6"
                  y="11"
                  fontFamily="monospace"
                  fontSize="10.5"
                  fontWeight="bold"
                  fill="#22c55e"
                  filter="url(#softGlow)"
                >
                  CAIRN +9.8% ▲  NVDA +3.4% ▲  GOOG +2.1% ▲  GOLD +0.8% ▲  AI +5.6% ▲  CAIRN +9.8% ▲
                </text>
              </g>
            </g>

            <g pointerEvents="none" filter="url(#softGlow)">
              <circle cx="786" cy="342" r="10" fill="#e0aaff" className="shimmer-a" />
              <circle cx="765" cy="422" r="8" fill="#52b788" className="shimmer-b" />
              <circle cx="815" cy="452" r="8" fill="#00d4ff" className="shimmer-a" />
              <circle cx="826" cy="495" r="7" fill="#ffd166" className="shimmer-b" />
              <circle cx="316" cy="420" r="34" fill="#00e5ff" opacity="0.22" className="shimmer-a" />
              <circle cx="1024" cy="96" r="14" fill="#ffbe0b" opacity="0.38" className="shimmer-b" />
            </g>

            <path
              ref={trackPathRef}
              d="M 1358,270 C 1278,334 1192,388 1098,376 C 1020,366 942,340 882,320"
              fill="none"
              stroke="none"
            />
            <g clipPath="url(#mineTunnelClip)" pointerEvents="none">
              <g ref={trainGroupRef}>
                {trainAsset?.src && (
                  <image
                    href={trainAsset.src}
                    x={(-trainDrawW / 2).toFixed(1)}
                    y={(-trainDrawH * 0.68).toFixed(1)}
                    width={trainDrawW}
                    height={trainDrawH.toFixed(1)}
                  />
                )}
              </g>
            </g>

            {/* SPLIT CLICK HOTSPOTS: Building Body = Zone Inside · Cairn / Ribbon = Direct Dashboard */}
            <g>
              {BUILDINGS.map((b) => {
                const bannerW = Math.max(114, b.label.length * 7.8 + 30);
                const halfW = bannerW / 2;
                const fillCol = b.greenBanner ? '#dcf5e4' : '#fbf1d7';
                const strokeCol = b.greenBanner ? '#205c3c' : '#634320';
                const textCol = b.greenBanner ? '#153b26' : '#331d0b';
                const tailFill = b.greenBanner ? '#b7e4c7' : '#e0c594';
                const showPermitPin = b.id === 'executive' && pendingPermitCount > 0;

                return (
                  <g key={b.id}>
                    {/* 1. BUILDING BODY: Click to ZONE INSIDE */}
                    <g
                      className="hotspot-group"
                      onClick={(e) => {
                        e.stopPropagation();
                        enterBuilding(b, 'zone');
                      }}
                    >
                      <title>Enter {b.name} (Zone Inside)</title>
                      <ellipse
                        className="hover-aura"
                        cx={b.x}
                        cy={b.y}
                        rx={b.rx}
                        ry={b.ry}
                        fill="#ffd166"
                        filter="url(#softGlow)"
                      />
                      <ellipse cx={b.x} cy={b.y} rx={b.rx} ry={b.ry} fill="transparent" />
                    </g>

                    {/* 2. CAIRN STONE & RIBBON PLAQUE: Click for DIRECT DASHBOARD */}
                    {labelsVisible && (
                      <g
                        className="hotspot-group ribbon-tag"
                        transform={`translate(${b.lx}, ${b.ly})`}
                        onClick={(e) => {
                          e.stopPropagation();
                          enterBuilding(b, 'dashboard');
                        }}
                      >
                        <title>Open {b.name} Dashboard</title>
                        <path
                          d={`M ${-halfW - 9},-8 L ${-halfW + 2},-8 L ${-halfW + 2},10 L ${-halfW - 9},10 L ${-halfW - 4},1 Z`}
                          fill={tailFill}
                          stroke={strokeCol}
                          strokeWidth="1.3"
                        />
                        <path
                          d={`M ${halfW + 9},-8 L ${halfW - 2},-8 L ${halfW - 2},10 L ${halfW + 9},10 L ${halfW + 4},1 Z`}
                          fill={tailFill}
                          stroke={strokeCol}
                          strokeWidth="1.3"
                        />
                        <rect
                          x={-halfW}
                          y="-11"
                          width={bannerW}
                          height="22"
                          rx="4"
                          fill={fillCol}
                          fillOpacity="0.95"
                          stroke={strokeCol}
                          strokeWidth="1.7"
                        />
                        {/* Sculpted 3-stone Cairn icon on left of ribbon = Dashboard indicator */}
                        <g transform={`translate(${-halfW + 11}, 0)`}>
                          <ellipse cx="0" cy="5.5" rx="6" ry="2.6" fill="#8b7355" stroke="#3c2a17" strokeWidth="0.9" />
                          <ellipse cx="0" cy="1.2" rx="4.5" ry="2.2" fill="#a68b67" stroke="#3c2a17" strokeWidth="0.9" />
                          <ellipse cx="0" cy="-2.8" rx="3" ry="1.8" fill="#c7b08e" stroke="#3c2a17" strokeWidth="0.9" />
                          <circle cx="0" cy="-5.2" r="1.5" fill="#00d4ff" />
                        </g>
                        <text
                          x="7"
                          y="3.5"
                          textAnchor="middle"
                          className="font-atlas"
                          fontSize="10.5"
                          fontWeight="bold"
                          fill={textCol}
                          letterSpacing="0.45"
                        >
                          {b.label}
                        </text>
                        {showPermitPin && (
                          <g transform={`translate(${halfW + 2}, -12)`}>
                            <circle cx="0" cy="0" r="11" fill="#f59e0b" stroke="#2b1d13" strokeWidth="2" />
                            <text
                              x="0"
                              y="4"
                              textAnchor="middle"
                              fontSize="11"
                              fontWeight="bold"
                              fill="#2b1d13"
                            >
                              !
                            </text>
                          </g>
                        )}
                      </g>
                    )}
                  </g>
                );
              })}
            </g>

            {/* WANDERING D&D FANTASY SPRITES ON COBBLESTONE ROADS */}
            <g style={{ display: spritesEnabled ? 'block' : 'none' }}>
              {SPRITES_DATA.map((s, idx) => {
                const asset = ASSETS[s.spriteKey];
                const spriteH = s.species === 'Halfling' ? 38 : 44;
                const spriteW = asset?.w && asset?.h ? (asset.w / asset.h) * spriteH : 36;
                return (
                  <g
                    key={s.name}
                    ref={(el) => {
                      spriteNodeRefs.current[idx] = el;
                    }}
                    className="sprite-group"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSpriteToast(s);
                    }}
                  >
                    <ellipse cx="0" cy="2" rx="12" ry="4" fill="#2c1c0c" opacity="0.34" />
                    {asset?.src && (
                      <image
                        href={asset.src}
                        style={s.hue ? { filter: `hue-rotate(${s.hue}deg)` } : undefined}
                        x={(-spriteW / 2).toFixed(1)}
                        y={(-spriteH + 3).toFixed(1)}
                        width={spriteW.toFixed(1)}
                        height={spriteH}
                      />
                    )}
                  </g>
                );
              })}
            </g>
          </g>
        </svg>

        {/* MOBILE-FIRST BOTTOM QUICK-JUMP BUILDING DOCK (Zones right inside!) */}
        <nav className="absolute bottom-2 left-2 right-2 z-20 flex items-center gap-1.5 overflow-x-auto no-scrollbar px-2.5 py-1.5 rounded-xl bg-[#2b1d13]/92 border border-[#a57b42] shadow-lg backdrop-blur-sm">
          <span className="text-[11px] font-atlas font-bold text-[#f7d992] px-1 shrink-0">
            Enter:
          </span>
          <div className="flex items-center gap-1.5">
            {BUILDINGS.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  focusBuilding(b);
                  enterBuilding(b, 'zone');
                }}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#402c1e] hover:bg-[#5b3f2b] text-[#f8e6bd] border border-[#a57b42]/50 whitespace-nowrap shrink-0 cursor-pointer"
              >
                {b.name}
              </button>
            ))}
          </div>
        </nav>
      </main>

      {/* FULL-SCREEN RPG ZONED INTERIOR ROOM */}
      {zonedBuilding && (
        <InteriorRoomView
          building={zonedBuilding}
          role={role}
          departmentRecord={departments[zonedBuilding.id]}
          pendingPermitCount={pendingPermitCount}
          onExitToCampus={() => setZonedBuilding(null)}
          onOpenDashboard={() => setDashboardBuilding(zonedBuilding)}
        />
      )}

      {/* DEPARTMENT DASHBOARD MODAL (Can open from outside Cairn/Ribbon OR from inside Room!) */}
      <InteriorModal
        building={dashboardBuilding}
        role={role}
        userEmail={userEmail}
        departments={departments}
        proposals={proposals}
        permits={permits}
        conductLogs={conductLogs}
        skills={skills}
        bridges={bridges}
        accessRoles={accessRoles}
        onClose={() => setDashboardBuilding(null)}
        onSelectBuilding={(b) => {
          setDashboardBuilding(null);
          focusBuilding(b);
          enterBuilding(b, 'zone');
        }}
        onOpenFamilyPreview={onOpenFamilyPreview}
      />
    </div>
  );
}
