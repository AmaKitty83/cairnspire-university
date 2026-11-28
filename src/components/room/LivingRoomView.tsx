import { useEffect, useMemo, useRef, useState } from 'react';
import type { BuildingDef } from '../../data/campusData';
import type { CampusRole } from '../../firebase';
import type { DepartmentRecord } from '../../services/firestoreService';
import {
  clampPointAwayFromProps,
  findNearestWalkNode,
  findNodePath,
  type HeldProp,
  type IsometricPropDef,
  type LivingAgentDef,
  type LivingPose,
  type LivingRoomDef,
} from '../../data/livingRooms';
import { isDepartmentAuthorizedOnline } from '../../data/departmentRosters';
import {
  ArticulatedSprite,
  computeTargetJoints,
  lerpJoints,
  type JointAngles,
} from './ArticulatedSprite';
import { PaintedLivingSprite } from './PaintedLivingSprite';

interface LivingRoomViewProps {
  room: LivingRoomDef;
  building: BuildingDef;
  role: CampusRole;
  departmentRecord?: DepartmentRecord;
  pendingPermitCount: number;
  constitutionActive?: boolean;
  onExitToCampus: () => void;
  onOpenDashboard: () => void;
}

interface SimAgentState {
  def: LivingAgentDef;
  x: number;
  y: number;
  facing: 1 | -1;
  pose: LivingPose;
  prop: HeldProp;
  currentNodeId: string;
  pathQueue: Array<{ x: number; y: number; nodeId?: string }>;
  walkSpeed: number;
  stateTimer: number;
  actionAfterArrive: 'home' | 'wander-pause' | 'wave' | 'talk';
  chatPartnerId: string | null;
  speechText: string | null;
  joints: JointAngles;
  blinkTimer: number;
  isBlinking: boolean;
  animTime: number;
}

function describeActivity(st: SimAgentState, buildingName: string): string {
  if (st.pose === 'wave') return '👋 Waving hello';
  if (st.pose === 'talk') return '💬 Chatting with teammate';
  if (st.pose === 'walk') return `🚶 Walking in ${buildingName}`;
  if (st.pose === 'sit-work') return '💺 Seated at workstation';
  if (st.pose === 'stand-work') return '🧍 Working at station';
  return '⏸️ Standing by';
}

function IsometricPropSvg({
  prop,
  selected,
  onClick,
}: {
  prop: IsometricPropDef;
  selected: boolean;
  onClick: () => void;
}) {
  if (prop.paintedSrc) {
    const w = prop.width ?? 100;
    const h = prop.height ?? 100;
    const offsetY = prop.offsetY ?? 14;
    return (
      <g
        className="cursor-pointer"
        transform={`translate(${prop.x}, ${prop.y})`}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <ellipse
          cx="0"
          cy="6"
          rx={(w * 0.4).toFixed(1)}
          ry={(w * 0.14).toFixed(1)}
          fill={selected ? '#f59e0b' : '#180e06'}
          opacity={selected ? 0.52 : 0.36}
        />
        {selected && (
          <circle
            cx="0"
            cy={(-h * 0.4).toFixed(1)}
            r={(w * 0.42).toFixed(1)}
            fill="#ffd166"
            opacity="0.28"
            filter="url(#livingGlow)"
          />
        )}
        <g transform={prop.facing === 1 ? 'scale(-1, 1)' : undefined}>
          <image
            href={prop.paintedSrc}
            x={(-w / 2).toFixed(1)}
            y={(-h + offsetY).toFixed(1)}
            width={w}
            height={h}
            preserveAspectRatio="xMidYMax meet"
          />
        </g>
      </g>
    );
  }

  const stroke = selected ? '#fde68a' : '#24140a';
  const sw = selected ? 2 : 1.4;

  return (
    <g
      className="cursor-pointer"
      transform={`translate(${prop.x}, ${prop.y})`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {prop.kind === 'iso-chair' && (
        <g>
          <ellipse cx="0" cy="4" rx="16" ry="7" fill="#180e06" opacity="0.38" />
          {/* Wooden back legs & seat */}
          <line x1="-10" y1="-2" x2="-10" y2="9" stroke="#3f2412" strokeWidth="3" />
          <line x1="10" y1="-2" x2="10" y2="9" stroke="#3f2412" strokeWidth="3" />
          <polygon
            points="0,-10 15,-3 0,4 -15,-3"
            fill="#8b552e"
            stroke={stroke}
            strokeWidth={sw}
          />
          <polygon
            points="0,-9 12,-3 0,2 -12,-3"
            fill="#a16236"
            opacity="0.9"
          />
          {/* High wooden backrest behind Vex */}
          <path
            d="M -13 -3 L -15 -28 L -1 -33 L 1 -10 Z"
            fill="#5e361c"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <line x1="-11" y1="-24" x2="-4" y2="-27" stroke="#f5c451" strokeWidth="1.6" />
        </g>
      )}

      {prop.kind === 'iso-stool' && (
        <g>
          <ellipse cx="0" cy="4" rx="14" ry="6" fill="#180e06" opacity="0.38" />
          <line x1="-8" y1="-1" x2="-9" y2="9" stroke="#334155" strokeWidth="3" />
          <line x1="8" y1="-1" x2="9" y2="9" stroke="#334155" strokeWidth="3" />
          <ellipse cx="0" cy="-3" rx="13" ry="6.5" fill="#475569" stroke={stroke} strokeWidth={sw} />
          <ellipse cx="0" cy="-5" rx="10" ry="4.5" fill="#64748b" />
        </g>
      )}

      {prop.kind === 'iso-command-desk' && (
        <g>
          {/* Isometric floor shadow */}
          <polygon points="0,-24 44,-3 0,20 -44,-3" fill="#180e06" opacity="0.36" transform="translate(0, 14)" />
          {/* Front-left & front-right apron */}
          <polygon
            points="-40,-10 0,11 0,27 -40,6"
            fill="#5a3419"
            stroke={stroke}
            strokeWidth={sw}
          />
          <polygon
            points="0,11 40,-10 40,6 0,27"
            fill="#734323"
            stroke={stroke}
            strokeWidth={sw}
          />
          {/* Carvings on panels */}
          <rect x="-28" y="-1" width="14" height="9" rx="1" fill="#472812" stroke="#b07c45" strokeWidth="0.9" transform="skewY(26)" />
          {/* Top isometric slab */}
          <polygon
            points="0,-31 44,-10 0,11 -44,-10"
            fill="#9b6536"
            stroke={stroke}
            strokeWidth={sw}
          />
          {/* Parchment dossier + brass inkwell + warm brass lamp */}
          <polygon points="-14,-13 2,-21 15,-14 -1,-6" fill="#fef3c7" stroke="#78350f" strokeWidth="0.9" />
          <circle cx="-18" cy="-16" r="3.4" fill="#1e293b" stroke="#24140a" strokeWidth="0.8" />
          <circle cx="19" cy="-16" r="4.5" fill="#ffd166" />
          <circle cx="19" cy="-16" r="9" fill="#ffbe0b" opacity="0.25" />
        </g>
      )}

      {prop.kind === 'iso-lockout-console' && (
        <g>
          <polygon points="0,-24 40,-4 0,17 -40,-4" fill="#180e06" opacity="0.36" transform="translate(0, 14)" />
          {/* Riveted iron sides */}
          <polygon
            points="-36,-11 0,8 0,25 -36,6"
            fill="#273244"
            stroke={stroke}
            strokeWidth={sw}
          />
          <polygon
            points="0,8 36,-11 36,6 0,25"
            fill="#37455c"
            stroke={stroke}
            strokeWidth={sw}
          />
          {/* Isometric deck */}
          <polygon
            points="0,-29 39,-10 0,9 -39,-10"
            fill="#4b5c75"
            stroke={stroke}
            strokeWidth={sw}
          />
          {/* Glowing arcane lockout screen */}
          <polygon points="-14,-14 0,-21 14,-14 0,-7" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1.2" />
          <line x1="-8" y1="-14" x2="8" y2="-14" stroke="#7dd3fc" strokeWidth="1.5" />
          <circle cx="-18" cy="-10" r="2.2" fill="#22c55e" />
          <circle cx="18" cy="-10" r="2.2" fill="#f59e0b" />
        </g>
      )}

      {prop.kind === 'iso-checkpoint' && (
        <g>
          <ellipse cx="0" cy="8" rx="22" ry="9" fill="#180e06" opacity="0.35" />
          {/* Wood podium barrier */}
          <polygon points="-18,-8 4,3 4,17 -18,6" fill="#5e361c" stroke={stroke} strokeWidth={sw} />
          <polygon points="4,3 20,-5 20,9 4,17" fill="#7a4726" stroke={stroke} strokeWidth={sw} />
          <polygon points="-2,-17 20,-6 4,3 -18,-8" fill="#a16a3a" stroke={stroke} strokeWidth={sw} />
          {/* Amber permit lantern */}
          <rect x="0" y="-23" width="8" height="10" rx="2" fill="#fbbf24" stroke="#24140a" strokeWidth="1.2" />
          <circle cx="4" cy="-18" r="8" fill="#fbbf24" opacity="0.25" />
        </g>
      )}
    </g>
  );
}

export function LivingRoomView({
  room,
  building,
  role,
  departmentRecord,
  pendingPermitCount,
  constitutionActive = false,
  onExitToCampus,
  onOpenDashboard,
}: LivingRoomViewProps) {
  const roomOnline = isDepartmentAuthorizedOnline(building.id, constitutionActive);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [rosterOpen, setRosterOpen] = useState(false);

  // Render tick triggers smooth React SVG updates for articulated joints & depth sorting
  const [, setFrameTick] = useState(0);

  const simRef = useRef<Record<string, SimAgentState>>({});

  // Initialize simulation state whenever room changes
  useEffect(() => {
    const initial: Record<string, SimAgentState> = {};
    room.agents.forEach((agent, idx) => {
      const startPose: LivingPose = idx === 1 ? 'wave' : agent.homePose;
      initial[agent.id] = {
        def: agent,
        x: agent.homeX,
        y: agent.homeY,
        facing: idx === 1 ? 1 : agent.homeFacing,
        pose: startPose,
        prop: agent.homeProp,
        currentNodeId: agent.homeNodeId,
        pathQueue: [],
        walkSpeed: 74,
        stateTimer: idx === 1 ? 2.4 : 4.5 + idx * 2.4,
        actionAfterArrive: 'home',
        chatPartnerId: null,
        speechText: null,
        joints: computeTargetJoints(startPose, idx * 1.1, agent.homeProp),
        blinkTimer: 1.5 + idx * 0.85,
        isBlinking: false,
        animTime: idx * 1.37,
      };
    });
    simRef.current = initial;
    setSelectedAgentId(null);
    setRosterOpen(false);
    setFrameTick((t) => t + 1);
  }, [room]);

  // 60fps autonomous life loop inside the room
  useEffect(() => {
    let rafId = 0;
    let lastMs = performance.now();

    function step(nowMs: number) {
      const dt = Math.min(0.05, Math.max(0.008, (nowMs - lastMs) / 1000));
      lastMs = nowMs;

      const states = Object.values(simRef.current);

      for (const st of states) {
        st.animTime += dt;

        // Eye blinking cycle
        st.blinkTimer -= dt;
        if (st.blinkTimer <= 0) {
          if (st.isBlinking) {
            st.isBlinking = false;
            st.blinkTimer = 2.8 + Math.random() * 2.5;
          } else {
            st.isBlinking = true;
            st.blinkTimer = 0.13;
          }
        }

        // Walking along path queue
        if (st.pose === 'walk' && st.pathQueue.length > 0) {
          const target = st.pathQueue[0];
          const dx = target.x - st.x;
          const dy = target.y - st.y;
          const dist = Math.hypot(dx, dy);

          if (Math.abs(dx) > 1.5) {
            st.facing = dx >= 0 ? 1 : -1;
          }

          const moveDist = st.walkSpeed * dt;
          if (dist <= moveDist) {
            st.x = target.x;
            st.y = target.y;
            if (target.nodeId) st.currentNodeId = target.nodeId;
            st.pathQueue.shift();

            if (st.pathQueue.length === 0) {
              // Arrived at destination
              if (st.actionAfterArrive === 'home') {
                st.pose = st.def.homePose;
                st.facing = st.def.homeFacing;
                st.prop = st.def.homeProp;
                st.stateTimer = 7 + Math.random() * 6;
              } else if (st.actionAfterArrive === 'wave') {
                st.pose = 'wave';
                st.facing = 1;
                st.stateTimer = 2.6;
              } else {
                // Check if another standing agent is nearby to strike up a friendly conversation
                const nearby = states.find(
                  (other) =>
                    other.def.id !== st.def.id &&
                    other.pose !== 'sit-work' &&
                    other.pose !== 'walk' &&
                    other.pose !== 'talk' &&
                    Math.hypot(other.x - st.x, other.y - st.y) < 125
                );
                if (nearby) {
                  const line =
                    st.def.chatLines[Math.floor(Math.random() * st.def.chatLines.length)];
                  st.pose = 'talk';
                  st.chatPartnerId = nearby.def.id;
                  st.speechText = line;
                  st.facing = nearby.x >= st.x ? 1 : -1;
                  st.stateTimer = 4.2;

                  nearby.pose = 'talk';
                  nearby.chatPartnerId = st.def.id;
                  nearby.speechText = null;
                  nearby.facing = st.x >= nearby.x ? 1 : -1;
                  nearby.stateTimer = 4.2;
                } else {
                  st.pose = 'idle';
                  st.stateTimer = 3.2 + Math.random() * 2;
                }
              }
            }
          } else {
            st.x += (dx / dist) * moveDist;
            st.y += (dy / dist) * moveDist;
          }
        } else {
          // Timed transitions for non-walking poses
          st.stateTimer -= dt;
          if (st.stateTimer <= 0) {
            if (st.pose === 'talk') {
              st.chatPartnerId = null;
              st.speechText = null;
              // Return home smoothly
              const path = findNodePath(room.walkNodes, st.currentNodeId, st.def.homeNodeId);
              if (path.length > 0) {
                st.pathQueue = path;
                st.pose = 'walk';
                st.actionAfterArrive = 'home';
              } else {
                st.pose = st.def.homePose;
                st.facing = st.def.homeFacing;
                st.stateTimer = 8;
              }
            } else if (st.pose === 'wave' || st.pose === 'idle') {
              if (
                Math.hypot(st.x - st.def.homeX, st.y - st.def.homeY) > 12 &&
                st.def.homeNodeId !== st.currentNodeId
              ) {
                const path = findNodePath(room.walkNodes, st.currentNodeId, st.def.homeNodeId);
                st.pathQueue = path.length
                  ? path
                  : [{ x: st.def.homeX, y: st.def.homeY, nodeId: st.def.homeNodeId }];
                st.pose = 'walk';
                st.actionAfterArrive = 'home';
              } else {
                st.x = st.def.homeX;
                st.y = st.def.homeY;
                st.pose = st.def.homePose;
                st.facing = st.def.homeFacing;
                st.stateTimer = 7 + Math.random() * 6;
              }
            } else if (st.pose === 'sit-work' || st.pose === 'stand-work') {
              // Pick a wander/social target node inside the watchtower
              const targets = st.def.wanderTargets;
              const targetId = targets[Math.floor(Math.random() * targets.length)];
              const path = findNodePath(room.walkNodes, st.currentNodeId, targetId);
              if (path.length > 0) {
                st.pathQueue = path;
                st.pose = 'walk';
                st.actionAfterArrive = 'wander-pause';
              } else {
                st.stateTimer = 6;
              }
            }
          }
        }

        const targetJoints = computeTargetJoints(st.pose, st.animTime, st.prop);
        st.joints = lerpJoints(st.joints, targetJoints, 1 - Math.exp(-12 * dt));
      }

      setFrameTick((t) => (t + 1) % 100000);
      rafId = requestAnimationFrame(step);
    }

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [room]);

  const headDisplayName = departmentRecord?.repName?.trim() || '';
  const showWatchAlert = building.id === 'executive' && pendingPermitCount > 0;
  const simStates = simRef.current;
  const selectedAgent = selectedAgentId ? simStates[selectedAgentId] : undefined;

  function triggerAgentAction(
    agentId: string,
    action: 'wave' | 'talk' | 'stroll' | 'home'
  ) {
    const st = simRef.current[agentId];
    if (!st) return;
    st.chatPartnerId = null;

    if (action === 'wave') {
      st.pathQueue = [];
      st.pose = 'wave';
      st.facing = 1;
      st.speechText = null;
      st.stateTimer = 3.2;
      return;
    }

    if (action === 'talk') {
      st.pathQueue = [];
      st.pose = 'talk';
      st.speechText =
        st.def.chatLines[Math.floor(Math.random() * st.def.chatLines.length)] ||
        'Standing by!';
      st.stateTimer = 4.2;
      return;
    }

    if (action === 'stroll') {
      const targets = st.def.wanderTargets;
      const targetId = targets[Math.floor(Math.random() * targets.length)];
      const path = findNodePath(room.walkNodes, st.currentNodeId, targetId);
      if (path.length > 0) {
        st.pathQueue = path;
        st.pose = 'walk';
        st.speechText = null;
        st.actionAfterArrive = 'wander-pause';
      }
      return;
    }

    if (action === 'home') {
      const path = findNodePath(room.walkNodes, st.currentNodeId, st.def.homeNodeId);
      st.pathQueue = path.length
        ? path
        : [{ x: st.def.homeX, y: st.def.homeY, nodeId: st.def.homeNodeId }];
      st.pose = 'walk';
      st.speechText = null;
      st.actionAfterArrive = 'home';
    }
  }

  function handleSelectAgent(agentId: string) {
    setSelectedAgentId(agentId);
    setRosterOpen(false);
    const st = simRef.current[agentId];
    if (st && st.pose !== 'walk') {
      st.pose = 'wave';
      st.facing = 1;
      st.speechText = null;
      st.stateTimer = 2.8;
    }
  }

  function handleFloorClick(e: React.MouseEvent<SVGPolygonElement>) {
    if (!selectedAgentId) return;
    const st = simRef.current[selectedAgentId];
    const svg = e.currentTarget.ownerSVGElement;
    if (!st || !svg) return;

    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const local = pt.matrixTransform(ctm.inverse());
    const clamped = clampPointAwayFromProps(
      { x: local.x, y: local.y },
      room.floorPolygon,
      room.props
    );

    const nearestFrom = findNearestWalkNode(room.walkNodes, { x: st.x, y: st.y });
    const nearestTo = findNearestWalkNode(room.walkNodes, clamped);
    const viaNodes =
      nearestFrom && nearestTo
        ? findNodePath(room.walkNodes, nearestFrom.id, nearestTo.id)
        : [];

    st.pathQueue = [
      ...viaNodes,
      { x: clamped.x, y: clamped.y, nodeId: nearestTo?.id },
    ];
    st.pose = 'walk';
    st.speechText = null;
    st.chatPartnerId = null;
    st.actionAfterArrive = 'wave';
  }

  // Unified painter's order render list (props + articulated agents sorted by depthY)
  type RenderEntry =
    | { kind: 'prop'; depthY: number; prop: IsometricPropDef }
    | { kind: 'agent'; depthY: number; agent: SimAgentState };

  const renderList: RenderEntry[] = [
    ...room.props.map((prop) => ({ kind: 'prop' as const, depthY: prop.depthY, prop })),
    ...Object.values(simStates).map((agent) => ({
      kind: 'agent' as const,
      depthY: agent.y,
      agent,
    })),
  ].sort((a, b) => a.depthY - b.depthY);

  const floorPointsStr = useMemo(
    () => room.floorPolygon.map((p) => `${p.x},${p.y}`).join(' '),
    [room.floorPolygon]
  );

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
              {building.district} · Living Interior Prototype
            </div>
            <h2 className="font-atlas text-sm sm:text-base font-bold text-[#fbe8b5] truncate">
              Inside {building.name}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span
            className={`hidden md:inline-block px-2 py-1 rounded-md text-[11px] font-bold border ${
              constitutionActive || roomOnline
                ? 'bg-emerald-950/70 text-emerald-200 border-emerald-500/40'
                : 'bg-amber-950/70 text-amber-200 border-amber-500/40'
            }`}
          >
            {constitutionActive
              ? '✅ Constitution Active'
              : roomOnline
                ? '🟢 Government Online · Convention Prep'
                : '⏸️ Standby · Pending Constitution'}
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

      {/* LIVING ISOMETRIC WATCHTOWER SCENE */}
      <main className="relative flex-1 overflow-hidden flex items-center justify-center bg-[#0d0907]">
        <div className="hidden sm:flex absolute top-3 left-3 z-20 items-center gap-2 px-3 py-1.5 rounded-full ribbon-btn text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              constitutionActive || roomOnline ? 'bg-[#2a9d8f]' : 'bg-amber-500'
            }`}
          />
          <span>
            {selectedAgent
              ? `Selected ${
                  selectedAgent.def.isDeptHead && headDisplayName
                    ? headDisplayName
                    : selectedAgent.def.defaultName
                } — tap stone floor to walk them there, or use pose buttons below`
              : 'Sprites live inside the room! Click any sprite or workstation to interact'}
          </span>
        </div>

        <svg
          className="w-full h-full max-w-[1460px]"
          viewBox={`0 0 ${room.width} ${room.height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="livingGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Painted Isometric Diorama Backdrop */}
          <image
            href={room.backdropSrc}
            x="0"
            y="0"
            width={room.width}
            height={room.height}
            preserveAspectRatio="xMidYMid meet"
          />

          {/* Flickering Lantern Glows */}
          <g pointerEvents="none" filter="url(#livingGlow)">
            {room.ambientGlows.map((g, i) => (
              <circle
                key={i}
                cx={g.x}
                cy={g.y}
                r={g.r}
                fill={g.color}
                opacity="0.24"
                className={g.pulse === 'a' ? 'shimmer-a' : 'shimmer-b'}
              />
            ))}
          </g>

          {/* Interactive Walkable Stone Floor Zone (only active cursor when an agent is selected) */}
          <polygon
            points={floorPointsStr}
            fill="transparent"
            className={selectedAgentId ? 'cursor-crosshair' : ''}
            onClick={handleFloorClick}
          />

          {/* Clickable Wall Notice Board Landmark -> Opens Police Station Dashboard */}
          <g
            className="hotspot-group cursor-pointer"
            transform={`translate(${room.boardHotspot.x}, ${room.boardHotspot.y})`}
            onClick={onOpenDashboard}
          >
            <circle className="hover-aura" cx="0" cy="0" r="32" fill="#ffd166" filter="url(#livingGlow)" />
            <rect x="-82" y="-12" width="164" height="24" rx="12" fill="#fbf1d7" fillOpacity="0.9" stroke="#6b451f" strokeWidth="1.6" />
            <text x="0" y="4" textAnchor="middle" className="font-atlas" fontSize="11" fontWeight="bold" fill="#331d0b">
              📋 {room.boardHotspot.label}
            </text>
          </g>

          {/* Clickable Arched Watchtower Door Exit */}
          <g
            className="hotspot-group cursor-pointer"
            transform={`translate(${room.doorExit.x}, ${room.doorExit.y})`}
            onClick={onExitToCampus}
          >
            <circle className="hover-aura" cx="0" cy="0" r="26" fill="#ffd166" filter="url(#livingGlow)" />
            <rect x="-58" y="-11" width="116" height="22" rx="11" fill="#362316" fillOpacity="0.92" stroke="#d9b26f" strokeWidth="1.6" />
            <text x="0" y="3.5" textAnchor="middle" className="font-atlas" fontSize="10.5" fontWeight="bold" fill="#fbe8b5">
              🚪 {room.doorExit.label}
            </text>
          </g>

          {/* Depth-sorted Isometric Furniture + Living Articulated Sprites */}
          <g>
            {renderList.map((entry) => {
              if (entry.kind === 'prop') {
                const p = entry.prop;
                return (
                  <IsometricPropSvg
                    key={p.id}
                    prop={p}
                    selected={Boolean(selectedAgentId && p.linkedAgentId === selectedAgentId)}
                    onClick={() => {
                      if (p.linkedAgentId) handleSelectAgent(p.linkedAgentId);
                    }}
                  />
                );
              }
              const st = entry.agent;
              const displayName =
                st.def.isDeptHead && headDisplayName ? headDisplayName : st.def.defaultName;
              if (st.def.spritePoses) {
                return (
                  <PaintedLivingSprite
                    key={st.def.id}
                    name={displayName}
                    species={st.def.appearance.species}
                    pose={st.pose}
                    spritePoses={st.def.spritePoses}
                    spriteHeight={st.def.spriteHeight ?? 108}
                    nativeFacing={st.def.nativeFacing ?? 1}
                    rankTier={st.def.rankTier}
                    rankBadgeColor={st.def.rankBadgeColor}
                    workIcon={st.def.workstationIcon}
                    x={st.x}
                    y={st.y}
                    facing={st.facing}
                    isSelected={selectedAgentId === st.def.id}
                    isTalking={st.pose === 'talk'}
                    speechText={st.speechText}
                    animTime={st.animTime}
                    showStandbyBadge={!roomOnline}
                    onClick={() => handleSelectAgent(st.def.id)}
                  />
                );
              }
              return (
                <ArticulatedSprite
                  key={st.def.id}
                  name={displayName}
                  appearance={st.def.appearance}
                  pose={st.pose}
                  prop={st.prop}
                  joints={st.joints}
                  x={st.x}
                  y={st.y}
                  facing={st.facing}
                  isSelected={selectedAgentId === st.def.id}
                  isTalking={st.pose === 'talk'}
                  isBlinking={st.isBlinking}
                  speechText={st.speechText}
                  talkFrame={st.animTime}
                  showStandbyBadge={!roomOnline}
                  onClick={() => handleSelectAgent(st.def.id)}
                />
              );
            })}
          </g>
        </svg>

        {/* QUICK AGENT ROSTER POPOVER */}
        {rosterOpen && (
          <div className="absolute bottom-14 right-3 z-30 parchment-panel rounded-2xl p-3 max-w-sm w-[92%] sm:w-80 text-xs shadow-2xl">
            <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#ad8042]/40">
              <div className="font-atlas font-bold text-sm text-[#3c230f]">
                🛡️ {building.name} Living Team ({room.agents.length})
              </div>
              <button
                onClick={() => setRosterOpen(false)}
                className="text-[#7a4f23] font-bold px-1.5 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1.5">
              {Object.values(simStates).map((st) => {
                const display =
                  st.def.isDeptHead && headDisplayName ? headDisplayName : st.def.defaultName;
                const active = selectedAgentId === st.def.id;
                return (
                  <button
                    key={st.def.id}
                    onClick={() => handleSelectAgent(st.def.id)}
                    className={`w-full text-left flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl border transition cursor-pointer ${
                      active
                        ? 'bg-[#f5deb0] border-[#8a5a24]'
                        : 'bg-white/65 hover:bg-[#fbf1d7] border-[#ad8042]/35'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-[#3c230f] truncate flex items-center gap-1.5">
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-full shrink-0 border border-white/70"
                          style={{ backgroundColor: st.def.rankBadgeColor }}
                          title={st.def.rankLabel}
                        />
                        {display} · <span className="font-normal text-[#6b4423]">{st.def.roleTitle}</span>
                      </div>
                      <div className="text-[10.5px] text-[#7a4f23] truncate">
                        {st.def.workstationIcon} {st.def.workstationName}
                      </div>
                    </div>
                    <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#ead7b0] text-[#4a2e16]">
                      {describeActivity(st, building.name).split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SELECTED AGENT INTERACTION CARD + POSE CONTROLS */}
        {selectedAgent && (
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-30 parchment-panel rounded-2xl px-4 py-3 max-w-lg w-[95%] text-xs shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-atlas font-bold text-sm text-[#3c230f]">
                    {selectedAgent.def.isDeptHead && headDisplayName
                      ? headDisplayName
                      : selectedAgent.def.defaultName}{' '}
                    · {selectedAgent.def.appearance.species}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      constitutionActive || roomOnline
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}
                  >
                    {constitutionActive
                      ? '✅ Active'
                      : roomOnline
                        ? '🟢 Online · Convention Prep'
                        : '⏸️ Standby · Pending Constitution'}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#f5e1b8] text-[#5b3919] border border-[#c89d58]/60">
                    {describeActivity(selectedAgent, building.name)}
                  </span>
                </div>

                <div className="text-[11px] font-semibold text-[#7a4f23] flex flex-wrap items-center gap-1.5">
                  <span>
                    {selectedAgent.def.roleTitle} · {selectedAgent.def.workstationIcon}{' '}
                    {selectedAgent.def.workstationName}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: selectedAgent.def.rankBadgeColor }}
                  >
                    {selectedAgent.def.rankLabel}
                  </span>
                </div>
                {selectedAgent.def.tier && (
                  <div className="inline-block px-2 py-0.5 rounded bg-[#ead7b0] text-[#4a2e16] text-[10px] font-semibold">
                    ⚖️ {selectedAgent.def.tier}
                  </div>
                )}

                <p className="text-[#3a2614] leading-snug">
                  “{roomOnline ? selectedAgent.def.activeQuote : selectedAgent.def.standbyQuote}”
                </p>

                {/* Live Articulation Controls */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <button
                    onClick={() => triggerAgentAction(selectedAgent.def.id, 'wave')}
                    className="px-2.5 py-1 rounded-lg bg-[#fff8e7] hover:bg-[#fde68a] border border-[#ad8042] text-[#3c230f] font-semibold cursor-pointer"
                  >
                    👋 Wave
                  </button>
                  <button
                    onClick={() => triggerAgentAction(selectedAgent.def.id, 'talk')}
                    className="px-2.5 py-1 rounded-lg bg-[#fff8e7] hover:bg-[#fde68a] border border-[#ad8042] text-[#3c230f] font-semibold cursor-pointer"
                  >
                    💬 Talk
                  </button>
                  <button
                    onClick={() => triggerAgentAction(selectedAgent.def.id, 'stroll')}
                    className="px-2.5 py-1 rounded-lg bg-[#fff8e7] hover:bg-[#fde68a] border border-[#ad8042] text-[#3c230f] font-semibold cursor-pointer"
                  >
                    🚶 Stroll Room
                  </button>
                  <button
                    onClick={() => triggerAgentAction(selectedAgent.def.id, 'home')}
                    className="px-2.5 py-1 rounded-lg bg-[#fff8e7] hover:bg-[#fde68a] border border-[#ad8042] text-[#3c230f] font-semibold cursor-pointer"
                  >
                    💺 Go to Station
                  </button>
                  <button
                    onClick={onOpenDashboard}
                    className="ml-auto px-3 py-1 rounded-lg bg-[#6b4423] hover:bg-[#82542b] text-[#fbe8b5] font-semibold cursor-pointer"
                  >
                    {building.id === 'childrens-books'
                      ? 'Publishing Suite →'
                      : building.id === 'home-garden'
                        ? 'Family Hub →'
                        : `${building.name} Dashboard →`}
                  </button>
                </div>

                <div className="text-[10px] text-[#7a5a33]">
                  Tip: Tap anywhere on the floor to make{' '}
                  {selectedAgent.def.isDeptHead && headDisplayName
                    ? headDisplayName
                    : selectedAgent.def.defaultName}{' '}
                  walk right there!
                </div>
              </div>

              <button
                onClick={() => setSelectedAgentId(null)}
                className="text-[#7a4f23] font-bold px-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* MOBILE-FRIENDLY FOOTER DOCK */}
        <div className="absolute bottom-2 left-2 right-2 z-20 flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-[#2b1d13]/92 border border-[#a57b42] shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs text-[#f5dfaf] truncate">
            <span className="font-atlas font-bold text-[#ffd166]">
              {room.agents.length} Living Sprites (
              {constitutionActive ? 'Active' : roomOnline ? 'Online · Convention Prep' : 'Standby'})
            </span>
            <span className="hidden sm:inline text-[#d9be8c]">
              · Sit, walk, talk &amp; wave inside {building.name}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setRosterOpen((v) => !v)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#4c3322] hover:bg-[#62432d] text-[#fbe8b5] border border-[#c89d58]/60 cursor-pointer"
            >
              🧑‍🎨 Agents ({room.agents.length})
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
