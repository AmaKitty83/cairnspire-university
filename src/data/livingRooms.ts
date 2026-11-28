export type LivingSpecies = 'Catgirl' | 'Elvaan' | 'Halfling' | 'Winged Fae';

export type LivingPose = 'idle' | 'walk' | 'sit-work' | 'stand-work' | 'talk' | 'wave';

export type HeldProp = 'none' | 'quill' | 'magnifier' | 'clipboard' | 'bell-tap' | 'mug';

export interface CharacterAppearance {
  species: LivingSpecies;
  skin: string;
  hair: string;
  outfit: string;
  outfitDark: string;
  accent: string;
  badge?: 'commissioner' | 'chief' | 'detective' | 'officer' | 'detainment';
}

export interface IsometricPropDef {
  id: string;
  kind:
    | 'iso-chair'
    | 'iso-stool'
    | 'iso-command-desk'
    | 'iso-lockout-console'
    | 'iso-checkpoint';
  x: number;
  y: number;
  depthY: number;
  facing: 1 | -1;
  linkedAgentId?: string;
  label?: string;
}

export interface WalkNode {
  id: string;
  x: number;
  y: number;
  neighbors: string[];
}

export interface LivingAgentDef {
  id: string;
  defaultName: string;
  isDeptHead?: boolean;
  roleTitle: string;
  workstationName: string;
  workstationIcon: string;
  appearance: CharacterAppearance;
  homeNodeId: string;
  homeX: number;
  homeY: number;
  homeFacing: 1 | -1;
  homePose: 'sit-work' | 'stand-work';
  homeProp: HeldProp;
  standbyQuote: string;
  activeQuote: string;
  wanderTargets: string[];
  chatLines: string[];
}

export interface LivingRoomDef {
  buildingId: string;
  width: number;
  height: number;
  backdropSrc: string;
  ambientGlows: Array<{ x: number; y: number; r: number; color: string; pulse: 'a' | 'b' }>;
  floorPolygon: Array<{ x: number; y: number }>;
  walkNodes: WalkNode[];
  props: IsometricPropDef[];
  agents: LivingAgentDef[];
  doorExit: { x: number; y: number; label: string };
  boardHotspot: { x: number; y: number; label: string };
}

export function pointInPolygon(
  pt: { x: number; y: number },
  poly: Array<{ x: number; y: number }>
): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x;
    const yi = poly[i].y;
    const xj = poly[j].x;
    const yj = poly[j].y;
    const intersect =
      yi > pt.y !== yj > pt.y &&
      pt.x < ((xj - xi) * (pt.y - yi)) / (yj - yi || 1e-6) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function clampPointToPolygon(
  pt: { x: number; y: number },
  poly: Array<{ x: number; y: number }>
): { x: number; y: number } {
  if (poly.length === 0 || pointInPolygon(pt, poly)) return pt;
  let best = poly[0];
  let bestDistSq = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const lenSq = dx * dx + dy * dy || 1;
    const t = Math.max(0, Math.min(1, ((pt.x - a.x) * dx + (pt.y - a.y) * dy) / lenSq));
    const proj = { x: a.x + t * dx, y: a.y + t * dy };
    const distSq = (pt.x - proj.x) ** 2 + (pt.y - proj.y) ** 2;
    if (distSq < bestDistSq) {
      bestDistSq = distSq;
      best = proj;
    }
  }
  return best;
}

export function findNodePath(
  nodes: WalkNode[],
  fromId: string,
  toId: string
): Array<{ x: number; y: number; nodeId: string }> {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const start = byId.get(fromId);
  const goal = byId.get(toId);
  if (!start || !goal) return [];
  if (fromId === toId) return [{ x: goal.x, y: goal.y, nodeId: goal.id }];

  const queue: string[] = [fromId];
  const cameFrom = new Map<string, string | null>([[fromId, null]]);

  while (queue.length > 0) {
    const curr = queue.shift()!;
    if (curr === toId) break;
    const node = byId.get(curr);
    if (!node) continue;
    for (const nextId of node.neighbors) {
      if (!cameFrom.has(nextId)) {
        cameFrom.set(nextId, curr);
        queue.push(nextId);
      }
    }
  }

  if (!cameFrom.has(toId)) {
    return [{ x: goal.x, y: goal.y, nodeId: goal.id }];
  }

  const ids: string[] = [];
  let cursor: string | null = toId;
  while (cursor) {
    ids.unshift(cursor);
    cursor = cameFrom.get(cursor) ?? null;
  }

  return ids
    .slice(1)
    .map((id) => byId.get(id))
    .filter((n): n is WalkNode => Boolean(n))
    .map((n) => ({ x: n.x, y: n.y, nodeId: n.id }));
}

export function findNearestWalkNode(
  nodes: WalkNode[],
  pt: { x: number; y: number }
): WalkNode | undefined {
  let best: WalkNode | undefined;
  let bestDist = Infinity;
  for (const n of nodes) {
    const d = (n.x - pt.x) ** 2 + (n.y - pt.y) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = n;
    }
  }
  return best;
}

export const LIVING_ROOMS: Record<string, LivingRoomDef> = {
  executive: {
    buildingId: 'executive',
    width: 1328,
    height: 752,
    backdropSrc: '/assets/interiors/interior-executive.png',
    ambientGlows: [
      { x: 194, y: 266, r: 28, color: '#ffbe0b', pulse: 'a' },
      { x: 446, y: 170, r: 28, color: '#ffbe0b', pulse: 'b' },
      { x: 658, y: 96, r: 28, color: '#ffbe0b', pulse: 'a' },
      { x: 856, y: 176, r: 28, color: '#ffbe0b', pulse: 'b' },
      { x: 1134, y: 270, r: 28, color: '#ffbe0b', pulse: 'a' },
    ],
    floorPolygon: [
      { x: 664, y: 344 },
      { x: 782, y: 392 },
      { x: 965, y: 468 },
      { x: 1075, y: 518 },
      { x: 664, y: 672 },
      { x: 382, y: 556 },
      { x: 604, y: 440 },
      { x: 576, y: 384 },
    ],
    walkNodes: [
      { id: 'bell_desk', x: 494, y: 504, neighbors: ['vex_entry', 'center_north', 'center_hub'] },
      { id: 'notice_board', x: 756, y: 388, neighbors: ['center_north', 'east_hall'] },
      { id: 'door_guard', x: 966, y: 480, neighbors: ['east_hall', 'briggs_entry'] },
      { id: 'vex_entry', x: 502, y: 548, neighbors: ['vex_seat', 'bell_desk', 'center_hub', 'center_south'] },
      { id: 'vex_seat', x: 532, y: 568, neighbors: ['vex_entry'] },
      { id: 'briggs_entry', x: 852, y: 548, neighbors: ['briggs_seat', 'east_hall', 'door_guard', 'center_south'] },
      { id: 'briggs_seat', x: 818, y: 570, neighbors: ['briggs_entry'] },
      { id: 'center_north', x: 664, y: 428, neighbors: ['bell_desk', 'notice_board', 'center_hub', 'east_hall'] },
      { id: 'center_hub', x: 664, y: 506, neighbors: ['center_north', 'bell_desk', 'vex_entry', 'center_south', 'east_hall'] },
      { id: 'center_south', x: 664, y: 608, neighbors: ['center_hub', 'vex_entry', 'briggs_entry'] },
      { id: 'east_hall', x: 845, y: 482, neighbors: ['notice_board', 'door_guard', 'center_north', 'center_hub', 'briggs_entry'] },
    ],
    props: [
      {
        id: 'vex-chair',
        kind: 'iso-chair',
        x: 526,
        y: 564,
        depthY: 560,
        facing: 1,
        linkedAgentId: 'ps-commissioner',
      },
      {
        id: 'vex-desk',
        kind: 'iso-command-desk',
        x: 568,
        y: 590,
        depthY: 592,
        facing: 1,
        linkedAgentId: 'ps-commissioner',
        label: 'Commissioner Command Desk',
      },
      {
        id: 'briggs-stool',
        kind: 'iso-stool',
        x: 824,
        y: 566,
        depthY: 562,
        facing: -1,
        linkedAgentId: 'ps-detainment',
      },
      {
        id: 'briggs-console',
        kind: 'iso-lockout-console',
        x: 782,
        y: 592,
        depthY: 594,
        facing: -1,
        linkedAgentId: 'ps-detainment',
        label: 'Quarantine & Lockout Console',
      },
      {
        id: 'kira-checkpoint',
        kind: 'iso-checkpoint',
        x: 918,
        y: 492,
        depthY: 492,
        facing: -1,
        linkedAgentId: 'ps-officer',
        label: 'Article II Permit Checkpoint',
      },
    ],
    doorExit: { x: 1020, y: 440, label: 'Exit Watchtower' },
    boardHotspot: { x: 760, y: 256, label: 'Open Police Station Permits' },
    agents: [
      {
        id: 'ps-commissioner',
        defaultName: 'Vex',
        isDeptHead: true,
        roleTitle: 'Commissioner',
        workstationName: 'Commissioner’s Command Desk',
        workstationIcon: '🛡️',
        appearance: {
          species: 'Catgirl',
          skin: '#f6d8c3',
          hair: '#2b2440',
          outfit: '#4338ca',
          outfitDark: '#2e248a',
          accent: '#f5c451',
          badge: 'commissioner',
        },
        homeNodeId: 'vex_seat',
        homeX: 532,
        homeY: 568,
        homeFacing: 1,
        homePose: 'sit-work',
        homeProp: 'quill',
        standbyQuote:
          'Standing by on pre-Constitution hold — reviewing Article II permit rules so nothing executes without Amarette’s ! Permit.',
        activeQuote:
          'Directing Campus Police Station patrols and verifying every Article II ! Permit.',
        wanderTargets: ['center_hub', 'bell_desk', 'notice_board'],
        chatLines: [
          'Convention drafts look tight — Article II stays crystal clear.',
          'Any anomalies on the board today, Marlowe?',
          'Keep that ! bell shining, Chief Dorian!',
        ],
      },
      {
        id: 'ps-chief',
        defaultName: 'Dorian',
        roleTitle: 'Chief of Police',
        workstationName: '! Permit Dispatch Desk',
        workstationIcon: '!',
        appearance: {
          species: 'Elvaan',
          skin: '#f4d9c6',
          hair: '#c9a66b',
          outfit: '#1d4ed8',
          outfitDark: '#17368e',
          accent: '#fbbf24',
          badge: 'chief',
        },
        homeNodeId: 'bell_desk',
        homeX: 494,
        homeY: 504,
        homeFacing: -1,
        homePose: 'stand-work',
        homeProp: 'bell-tap',
        standbyQuote:
          'Polishing the ! Permit brass bell and holding dispatch in pre-Constitution standby.',
        activeQuote:
          'Managing daily ! Permit dispatch and routing every boundary event to the Courthouse.',
        wanderTargets: ['center_hub', 'notice_board', 'center_south'],
        chatLines: [
          'The ! Permit desk scrolls are all accounted for.',
          'Nothing leaves this room without a Chancellor signature.',
          'Checking in on the east watchtower gate!',
        ],
      },
      {
        id: 'ps-detective',
        defaultName: 'Marlowe',
        roleTitle: 'Detective',
        workstationName: 'Case & Evidence Notice Board',
        workstationIcon: '🔍',
        appearance: {
          species: 'Halfling',
          skin: '#f2ccb3',
          hair: '#6e3f23',
          outfit: '#8b5a2b',
          outfitDark: '#5b3919',
          accent: '#f59e0b',
          badge: 'detective',
        },
        homeNodeId: 'notice_board',
        homeX: 756,
        homeY: 388,
        homeFacing: 1,
        homePose: 'stand-work',
        homeProp: 'magnifier',
        standbyQuote:
          'Examining the corkboard dockets under my lens — all investigations wait politely for Constitutional ratification.',
        activeQuote:
          'Auditing suspicious tool traces and cross-building boundaries for Courthouse review.',
        wanderTargets: ['center_hub', 'bell_desk', 'east_hall'],
        chatLines: [
          'Pinned the latest boundary checklist to the notice board.',
          'Zero unexpected cross-department slips so far!',
          'Comparing notes with the Commissioner.',
        ],
      },
      {
        id: 'ps-officer',
        defaultName: 'Kira',
        roleTitle: 'Law Enforcement Officer',
        workstationName: 'Article II Permit Checkpoint',
        workstationIcon: '🚧',
        appearance: {
          species: 'Catgirl',
          skin: '#f7dac7',
          hair: '#1f6f78',
          outfit: '#0f766e',
          outfitDark: '#114d49',
          accent: '#e2e8f0',
          badge: 'officer',
        },
        homeNodeId: 'door_guard',
        homeX: 966,
        homeY: 480,
        homeFacing: -1,
        homePose: 'stand-work',
        homeProp: 'clipboard',
        standbyQuote:
          'Standing guard by the Watchtower door with the Article II permit clipboard in standby.',
        activeQuote:
          'Holding restricted spending, publishing, and installs cleanly at the door until ! Permit approval.',
        wanderTargets: ['east_hall', 'center_hub', 'notice_board'],
        chatLines: [
          'Watchtower gate is quiet and secure.',
          'Permit clipboard checked — all queues clear.',
          'Good patrol along the east corridor!',
        ],
      },
      {
        id: 'ps-detainment',
        defaultName: 'Briggs',
        roleTitle: 'Detainment Force',
        workstationName: 'Quarantine & Lockout Console',
        workstationIcon: '🔒',
        appearance: {
          species: 'Elvaan',
          skin: '#e8c2a6',
          hair: '#374151',
          outfit: '#334155',
          outfitDark: '#1e293b',
          accent: '#38bdf8',
          badge: 'detainment',
        },
        homeNodeId: 'briggs_seat',
        homeX: 818,
        homeY: 570,
        homeFacing: -1,
        homePose: 'sit-work',
        homeProp: 'none',
        standbyQuote:
          'Seated at the Quarantine & Lockout Console in standby — ready to halt runaway loops with full Courthouse due process.',
        activeQuote:
          'Watching compute & lockout safety monitors to pause any misbehaving loop immediately.',
        wanderTargets: ['east_hall', 'center_south', 'center_hub'],
        chatLines: [
          'Lockout breakers tested and standing on green.',
          'Stretching my legs — Article V VRAM guard looks steady.',
          'Every detention includes notice to the Courthouse!',
        ],
      },
    ],
  },
};
