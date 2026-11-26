export interface RoomStation {
  id: string;
  label: string;
  x: number;
  y: number;
  action: 'dashboard' | 'exit';
  icon: string;
}

export interface RoomWorker {
  id: string;
  defaultName: string;
  isDeptHead?: boolean;
  species: string;
  roleTitle: string;
  spriteKey: string;
  hue: number;
  workIcon: string;
  taskLine: string;
  route: Array<{ x: number; y: number }>;
  speed: number;
}

export interface RoomInteriorConfig {
  hasPaintedBackdrop: boolean;
  backdropSrc?: string;
  ambientGlows: Array<{ x: number; y: number; r: number; color: string; pulse: 'a' | 'b' }>;
  stations: RoomStation[];
  workers: RoomWorker[];
}

export const ROOM_INTERIORS: Record<string, RoomInteriorConfig> = {
  'town-hall': {
    hasPaintedBackdrop: true,
    backdropSrc: '/assets/interiors/interior-town-hall.png',
    ambientGlows: [
      { x: 562, y: 112, r: 30, color: '#ffbe0b', pulse: 'a' },
      { x: 778, y: 345, r: 36, color: '#ffd166', pulse: 'b' },
      { x: 350, y: 215, r: 44, color: '#fff3b0', pulse: 'a' },
    ],
    stations: [
      { id: 'lectern', label: 'Bill of Rights Lectern · Dashboard', x: 785, y: 358, action: 'dashboard', icon: '📜' },
      { id: 'registry', label: 'Constitution & Skills Bookshelf', x: 558, y: 292, action: 'dashboard', icon: '📚' },
      { id: 'exit', label: 'Exit to Campus', x: 608, y: 638, action: 'exit', icon: '🚪' },
    ],
    workers: [
      {
        id: 'th-head',
        defaultName: 'Kaelen',
        isDeptHead: true,
        species: 'Elvaan',
        roleTitle: 'Speaker of Town Hall',
        spriteKey: 'sprite-elvaan',
        hue: 0,
        workIcon: '📜',
        taskLine: 'Guarding the ratified Preliminary Bill of Rights and preparing Constitutional Convention dockets.',
        route: [
          { x: 640, y: 455 },
          { x: 720, y: 485 },
          { x: 590, y: 520 },
        ],
        speed: 0.004,
      },
      {
        id: 'th-scribe',
        defaultName: 'Miri',
        species: 'Winged Fae',
        roleTitle: 'Skills Registry Scribe',
        spriteKey: 'sprite-fae',
        hue: 95,
        workIcon: '✨',
        taskLine: 'Cataloging active global skills (comfyui-local, agent-zero-local) and workspace rules!',
        route: [
          { x: 320, y: 435 },
          { x: 475, y: 405 },
          { x: 405, y: 520 },
        ],
        speed: 0.0055,
      },
      {
        id: 'th-clerk',
        defaultName: 'Toby',
        species: 'Halfling',
        roleTitle: 'Amendment Clerk',
        spriteKey: 'sprite-halfling',
        hue: 25,
        workIcon: '🖋️',
        taskLine: 'Checking every draft against Two-Gate Lawmaking (Antigravity Audit + Chancellor Sign-Off).',
        route: [
          { x: 890, y: 455 },
          { x: 805, y: 550 },
          { x: 965, y: 495 },
        ],
        speed: 0.0048,
      },
    ],
  },

  executive: {
    hasPaintedBackdrop: true,
    backdropSrc: '/assets/interiors/interior-executive.png',
    ambientGlows: [
      { x: 178, y: 245, r: 26, color: '#ffbe0b', pulse: 'a' },
      { x: 408, y: 158, r: 26, color: '#ffbe0b', pulse: 'b' },
      { x: 602, y: 88, r: 26, color: '#ffbe0b', pulse: 'a' },
      { x: 782, y: 162, r: 26, color: '#ffbe0b', pulse: 'b' },
      { x: 1038, y: 248, r: 26, color: '#ffbe0b', pulse: 'a' },
    ],
    stations: [
      { id: 'dispatch', label: '! Permits Dispatch Desk · Dashboard', x: 392, y: 345, action: 'dashboard', icon: '!' },
      { id: 'board', label: 'Sealed Permit Board', x: 695, y: 215, action: 'dashboard', icon: '🛡️' },
      { id: 'exit', label: 'Watchtower Door', x: 938, y: 355, action: 'exit', icon: '🚪' },
    ],
    workers: [
      {
        id: 'ex-head',
        defaultName: 'Vex',
        isDeptHead: true,
        species: 'Catgirl',
        roleTitle: 'Captain of the Watch',
        spriteKey: 'sprite-catgirl',
        hue: 245,
        workIcon: '🛡️',
        taskLine: 'Monitoring Article II action gates — no external post, spend, or install passes without a Chancellor ! Permit.',
        route: [
          { x: 525, y: 455 },
          { x: 645, y: 525 },
          { x: 495, y: 555 },
        ],
        speed: 0.0045,
      },
      {
        id: 'ex-warden',
        defaultName: 'Dorian',
        species: 'Elvaan',
        roleTitle: 'Permit Gatekeeper',
        spriteKey: 'sprite-elvaan',
        hue: 210,
        workIcon: '🔔',
        taskLine: 'Keeping the dispatch bell polished and routing every permit decision straight to the Courthouse ledger.',
        route: [
          { x: 780, y: 455 },
          { x: 660, y: 585 },
          { x: 835, y: 515 },
        ],
        speed: 0.0042,
      },
    ],
  },

  courthouse: {
    hasPaintedBackdrop: true,
    backdropSrc: '/assets/interiors/interior-courthouse.png',
    ambientGlows: [
      { x: 822, y: 165, r: 44, color: '#ffd166', pulse: 'a' },
      { x: 298, y: 185, r: 24, color: '#ffbe0b', pulse: 'b' },
      { x: 1090, y: 280, r: 24, color: '#ffbe0b', pulse: 'b' },
    ],
    stations: [
      { id: 'bench', label: 'Judicial Bench & Conduct Log · Dashboard', x: 752, y: 325, action: 'dashboard', icon: '⚖️' },
      { id: 'ledgers', label: 'Append-Only Cairn Ledgers', x: 405, y: 375, action: 'dashboard', icon: '🪨' },
      { id: 'exit', label: 'Exit Courthouse', x: 455, y: 635, action: 'exit', icon: '🚪' },
    ],
    workers: [
      {
        id: 'cr-head',
        defaultName: 'Alden',
        isDeptHead: true,
        species: 'Elvaan',
        roleTitle: 'Chief Arbiter',
        spriteKey: 'sprite-elvaan',
        hue: 35,
        workIcon: '⚖️',
        taskLine: 'Every action leaves a Cairn! Inspecting our tamper-proof Article IX conduct ledger.',
        route: [
          { x: 565, y: 445 },
          { x: 645, y: 495 },
          { x: 530, y: 535 },
        ],
        speed: 0.0038,
      },
      {
        id: 'cr-watchdog',
        defaultName: 'Pippa',
        species: 'Catgirl',
        roleTitle: 'Local-GPU Watchdog Auditor',
        spriteKey: 'sprite-catgirl',
        hue: 120,
        workIcon: '🔍',
        taskLine: 'Running quiet conduct checks and verifying Article IV zero-fabrication compliance across all halls.',
        route: [
          { x: 475, y: 555 },
          { x: 605, y: 590 },
          { x: 515, y: 485 },
        ],
        speed: 0.005,
      },
    ],
  },

  commons: {
    hasPaintedBackdrop: true,
    backdropSrc: '/assets/interiors/interior-commons.png',
    ambientGlows: [
      { x: 545, y: 98, r: 42, color: '#c77dff', pulse: 'a' },
      { x: 500, y: 290, r: 30, color: '#00d4ff', pulse: 'b' },
      { x: 602, y: 285, r: 30, color: '#52b788', pulse: 'a' },
      { x: 550, y: 390, r: 38, color: '#c77dff', pulse: 'b' },
    ],
    stations: [
      { id: 'cairnspire', label: 'Elemental Cairnspire · Convention Floor', x: 548, y: 265, action: 'dashboard', icon: '🏛️' },
      { id: 'dais', label: 'Chancellor & Speaker Dais · Dashboard', x: 545, y: 525, action: 'dashboard', icon: '🎙️' },
      { id: 'exit', label: 'Back to Full Campus Map', x: 545, y: 645, action: 'exit', icon: '🗺️' },
    ],
    workers: [
      {
        id: 'cm-1',
        defaultName: 'Nyra',
        species: 'Catgirl',
        roleTitle: 'Children’s Books Rep',
        spriteKey: 'sprite-catgirl',
        hue: 0,
        workIcon: '📖',
        taskLine: 'Taking my seat in the amphitheater ring for the Constitutional Convention!',
        route: [
          { x: 335, y: 405 },
          { x: 385, y: 470 },
          { x: 345, y: 445 },
        ],
        speed: 0.0044,
      },
      {
        id: 'cm-2',
        defaultName: 'Theron',
        species: 'Elvaan',
        roleTitle: 'Geology Rep',
        spriteKey: 'sprite-elvaan',
        hue: 150,
        workIcon: '💎',
        taskLine: 'Inspecting the glowing amethyst, emerald, and turquoise crystals inlaid into our central Cairnspire!',
        route: [
          { x: 755, y: 400 },
          { x: 715, y: 475 },
          { x: 785, y: 455 },
        ],
        speed: 0.004,
      },
      {
        id: 'cm-3',
        defaultName: 'Pip',
        species: 'Halfling',
        roleTitle: 'Home & Garden Rep',
        spriteKey: 'sprite-halfling',
        hue: 0,
        workIcon: '🌿',
        taskLine: 'Making sure the Family Sanctuary stays warm, joyful, and strictly protected in the Constitution.',
        route: [
          { x: 430, y: 495 },
          { x: 465, y: 565 },
          { x: 405, y: 535 },
        ],
        speed: 0.0052,
      },
      {
        id: 'cm-4',
        defaultName: 'Lumi',
        species: 'Winged Fae',
        roleTitle: 'School of Health Rep',
        spriteKey: 'sprite-fae',
        hue: 0,
        workIcon: '✨',
        taskLine: 'Hovering around the Cairnspire plaza to keep campus assemblies bright and harmonious.',
        route: [
          { x: 665, y: 495 },
          { x: 645, y: 570 },
          { x: 705, y: 535 },
        ],
        speed: 0.0056,
      },
    ],
  },

  air: {
    hasPaintedBackdrop: true,
    backdropSrc: '/assets/interiors/interior-air.png',
    ambientGlows: [
      { x: 606, y: 290, r: 72, color: '#00e5ff', pulse: 'a' },
      { x: 350, y: 175, r: 26, color: '#00d4ff', pulse: 'b' },
      { x: 878, y: 175, r: 26, color: '#ffbe0b', pulse: 'b' },
    ],
    stations: [
      { id: 'core', label: 'Neural Core & Compute Bridges · Dashboard', x: 608, y: 295, action: 'dashboard', icon: '⚡' },
      { id: 'roster', label: 'Agent Roster Console', x: 365, y: 315, action: 'dashboard', icon: '🧭' },
      { id: 'exit', label: 'Exit AIR Lab', x: 608, y: 648, action: 'exit', icon: '🚪' },
    ],
    workers: [
      {
        id: 'air-head',
        defaultName: 'Mina',
        isDeptHead: true,
        species: 'Catgirl',
        roleTitle: 'Director of AIR',
        spriteKey: 'sprite-catgirl',
        hue: 195,
        workIcon: '⚡',
        taskLine: 'Routing art renders to Ray’s RTX 5090 Qwen-Image-2512 and keeping Agent Zero / Oracle online!',
        route: [
          { x: 460, y: 500 },
          { x: 608, y: 565 },
          { x: 755, y: 500 },
        ],
        speed: 0.005,
      },
      {
        id: 'air-eng',
        defaultName: 'Zeph',
        species: 'Winged Fae',
        roleTitle: 'Local GPU Bridge Engineer',
        spriteKey: 'sprite-fae',
        hue: 180,
        workIcon: '🔮',
        taskLine: 'Monitoring RTX 5090 VRAM headroom so ComfyUI and local LLMs share compute smoothly under Article V.',
        route: [
          { x: 390, y: 455 },
          { x: 485, y: 525 },
          { x: 425, y: 550 },
        ],
        speed: 0.0058,
      },
      {
        id: 'air-ops',
        defaultName: 'Orin',
        species: 'Halfling',
        roleTitle: 'Access & Security Steward',
        spriteKey: 'sprite-halfling',
        hue: 170,
        workIcon: '🔐',
        taskLine: 'Keeping server-side access roles tidy — zero credentials in chat or GitHub!',
        route: [
          { x: 825, y: 455 },
          { x: 730, y: 530 },
          { x: 790, y: 555 },
        ],
        speed: 0.0046,
      },
    ],
  },
};

export function getRoomConfig(buildingId: string, repSprite: string, headRole: string): RoomInteriorConfig {
  const preset = ROOM_INTERIORS[buildingId];
  if (preset) return preset;

  return {
    hasPaintedBackdrop: false,
    ambientGlows: [{ x: 608, y: 310, r: 50, color: '#ffd166', pulse: 'a' }],
    stations: [
      { id: 'desk', label: 'Department Desk · Open Dashboard', x: 608, y: 315, action: 'dashboard', icon: '📋' },
      { id: 'exit', label: 'Exit to Campus Map', x: 608, y: 625, action: 'exit', icon: '🚪' },
    ],
    workers: [
      {
        id: `${buildingId}-head`,
        defaultName: 'Dept. Head',
        isDeptHead: true,
        species: 'Campus Rep',
        roleTitle: headRole,
        spriteKey: repSprite,
        hue: 0,
        workIcon: '✨',
        taskLine: 'Preparing this hall’s studio! Custom Qwen-Image-2512 RPG interior art coming in Batch 2.',
        route: [
          { x: 480, y: 445 },
          { x: 735, y: 445 },
          { x: 608, y: 500 },
        ],
        speed: 0.0045,
      },
    ],
  };
}
