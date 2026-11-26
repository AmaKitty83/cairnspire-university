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
      { x: 375, y: 112, r: 30, color: '#ffd166', pulse: 'a' },
      { x: 898, y: 122, r: 30, color: '#ffd166', pulse: 'b' },
      { x: 615, y: 260, r: 52, color: '#fff0b3', pulse: 'a' },
    ],
    stations: [
      { id: 'lectern', label: 'Bill of Rights Table · Dashboard', x: 475, y: 392, action: 'dashboard', icon: '📜' },
      { id: 'registry', label: 'Constitution & Skills Desk', x: 838, y: 342, action: 'dashboard', icon: '📚' },
      { id: 'exit', label: 'Exit to Campus', x: 475, y: 632, action: 'exit', icon: '🚪' },
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
          { x: 595, y: 405 },
          { x: 685, y: 455 },
          { x: 585, y: 505 },
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
          { x: 320, y: 415 },
          { x: 405, y: 515 },
          { x: 335, y: 470 },
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
          { x: 925, y: 425 },
          { x: 810, y: 495 },
          { x: 965, y: 465 },
        ],
        speed: 0.0048,
      },
    ],
  },

  executive: {
    hasPaintedBackdrop: true,
    backdropSrc: '/assets/interiors/interior-executive.png',
    ambientGlows: [
      { x: 592, y: 165, r: 44, color: '#ffbe0b', pulse: 'a' },
      { x: 335, y: 495, r: 28, color: '#fb8500', pulse: 'b' },
      { x: 975, y: 430, r: 26, color: '#ffbe0b', pulse: 'a' },
    ],
    stations: [
      { id: 'dispatch', label: '! Permits Dispatch Desk · Dashboard', x: 592, y: 455, action: 'dashboard', icon: '!' },
      { id: 'board', label: 'Permit Ledger & Watch Desk', x: 825, y: 465, action: 'dashboard', icon: '🛡️' },
      { id: 'exit', label: 'Watchtower Door', x: 1085, y: 565, action: 'exit', icon: '🚪' },
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
          { x: 505, y: 585 },
          { x: 685, y: 585 },
          { x: 595, y: 625 },
        ],
        speed: 0.0046,
      },
      {
        id: 'ex-warden',
        defaultName: 'Dorian',
        species: 'Elvaan',
        roleTitle: 'Permit Gatekeeper',
        spriteKey: 'sprite-elvaan',
        hue: 210,
        workIcon: '🔔',
        taskLine: 'Keeping the watch lanterns lit and routing every permit decision straight to the Courthouse ledger.',
        route: [
          { x: 390, y: 615 },
          { x: 560, y: 635 },
          { x: 820, y: 605 },
        ],
        speed: 0.0042,
      },
    ],
  },

  courthouse: {
    hasPaintedBackdrop: true,
    backdropSrc: '/assets/interiors/interior-courthouse.png',
    ambientGlows: [
      { x: 568, y: 132, r: 44, color: '#ffd166', pulse: 'a' },
      { x: 200, y: 315, r: 32, color: '#fff2b2', pulse: 'b' },
      { x: 1005, y: 315, r: 32, color: '#fff2b2', pulse: 'b' },
    ],
    stations: [
      { id: 'bench', label: 'Judicial Bench & Conduct Log · Dashboard', x: 585, y: 492, action: 'dashboard', icon: '⚖️' },
      { id: 'ledgers', label: 'Append-Only Cairn Ledgers', x: 818, y: 468, action: 'dashboard', icon: '🪨' },
      { id: 'exit', label: 'Exit Courthouse', x: 608, y: 648, action: 'exit', icon: '🚪' },
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
          { x: 475, y: 618 },
          { x: 695, y: 618 },
          { x: 585, y: 602 },
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
          { x: 355, y: 628 },
          { x: 525, y: 638 },
          { x: 830, y: 625 },
        ],
        speed: 0.005,
      },
    ],
  },

  commons: {
    hasPaintedBackdrop: true,
    backdropSrc: '/assets/interiors/interior-commons.png',
    ambientGlows: [
      { x: 256, y: 322, r: 36, color: '#c77dff', pulse: 'a' },
      { x: 906, y: 175, r: 34, color: '#f72585', pulse: 'b' },
      { x: 978, y: 278, r: 30, color: '#00d4ff', pulse: 'a' },
    ],
    stations: [
      { id: 'dais', label: 'Constitutional Convention Dais · Dashboard', x: 608, y: 335, action: 'dashboard', icon: '🏛️' },
      { id: 'terrace', label: '13 Department Seats', x: 608, y: 455, action: 'dashboard', icon: '🎙️' },
      { id: 'exit', label: 'Back to Full Campus Map', x: 608, y: 645, action: 'exit', icon: '🗺️' },
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
        taskLine: 'Taking my seat on the sunlit amphitheater terrace for the Constitutional Convention!',
        route: [
          { x: 340, y: 425 },
          { x: 470, y: 425 },
          { x: 390, y: 438 },
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
        taskLine: 'Admiring the glowing amethyst and turquoise lanterns around the amphitheater plaza.',
        route: [
          { x: 865, y: 420 },
          { x: 745, y: 430 },
          { x: 820, y: 445 },
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
          { x: 385, y: 605 },
          { x: 520, y: 590 },
          { x: 435, y: 625 },
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
        taskLine: 'Hovering around the terrace steps to keep campus assemblies bright and harmonious.',
        route: [
          { x: 790, y: 595 },
          { x: 675, y: 585 },
          { x: 760, y: 625 },
        ],
        speed: 0.0056,
      },
    ],
  },

  air: {
    hasPaintedBackdrop: true,
    backdropSrc: '/assets/interiors/interior-air.png',
    ambientGlows: [
      { x: 672, y: 375, r: 58, color: '#ffbe0b', pulse: 'a' },
      { x: 652, y: 185, r: 34, color: '#00e5ff', pulse: 'b' },
      { x: 392, y: 268, r: 32, color: '#00e5ff', pulse: 'a' },
      { x: 795, y: 268, r: 32, color: '#00e5ff', pulse: 'b' },
    ],
    stations: [
      { id: 'core', label: 'Neural Core & Compute Bridges · Dashboard', x: 672, y: 372, action: 'dashboard', icon: '⚡' },
      { id: 'roster', label: 'Agent Roster Console', x: 418, y: 505, action: 'dashboard', icon: '🧭' },
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
        taskLine: 'Routing image renders to Ray’s RTX 5090 ComfyUI and keeping Agent Zero / Oracle connected on LAN!',
        route: [
          { x: 540, y: 475 },
          { x: 650, y: 555 },
          { x: 765, y: 485 },
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
        taskLine: 'Watching RTX 5090 VRAM headroom so ComfyUI and local LLMs share resources smoothly under Article V.',
        route: [
          { x: 465, y: 425 },
          { x: 565, y: 465 },
          { x: 495, y: 515 },
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
          { x: 585, y: 615 },
          { x: 715, y: 600 },
          { x: 635, y: 565 },
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
        taskLine: 'Preparing this hall’s studio! Custom hand-painted interior art coming in Batch 2.',
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
