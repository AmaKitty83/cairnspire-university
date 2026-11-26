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

  'home-garden': {
    hasPaintedBackdrop: true,
    backdropSrc: '/assets/interiors/interior-home-garden.png',
    ambientGlows: [
      { x: 128, y: 245, r: 28, color: '#ffbe0b', pulse: 'a' },
      { x: 618, y: 112, r: 26, color: '#ffbe0b', pulse: 'b' },
      { x: 1090, y: 248, r: 28, color: '#ffbe0b', pulse: 'a' },
    ],
    stations: [
      { id: 'chore-board', label: 'Family Chore Board · Dashboard', x: 865, y: 205, action: 'dashboard', icon: '🏡' },
      { id: 'table', label: 'Family Table & Kid Mode', x: 738, y: 410, action: 'dashboard', icon: '🌿' },
      { id: 'exit', label: 'Exit to Campus Map', x: 608, y: 638, action: 'exit', icon: '🚪' },
    ],
    workers: [
      {
        id: 'hg-head',
        defaultName: 'Pip',
        isDeptHead: true,
        species: 'Halfling',
        roleTitle: 'Steward of Home & Garden',
        spriteKey: 'sprite-halfling',
        hue: 0,
        workIcon: '🌿',
        taskLine: 'Watering the rosemary and lavender on the window sill and preparing today’s chore chart for Liam & Oliver!',
        route: [
          { x: 435, y: 445 },
          { x: 565, y: 475 },
          { x: 470, y: 545 },
        ],
        speed: 0.0045,
      },
      {
        id: 'hg-helper',
        defaultName: 'Clover',
        species: 'Winged Fae',
        roleTitle: 'Garden & Calendar Keeper',
        spriteKey: 'sprite-fae',
        hue: 70,
        workIcon: '🌸',
        taskLine: 'Keeping Family Sanctuary cheerful, child-safe, and ready for our v3 native Family Hub!',
        route: [
          { x: 845, y: 455 },
          { x: 920, y: 515 },
          { x: 790, y: 565 },
        ],
        speed: 0.0054,
      },
    ],
  },

  geology: {
    hasPaintedBackdrop: true,
    backdropSrc: '/assets/interiors/interior-geology.png',
    ambientGlows: [
      { x: 265, y: 300, r: 58, color: '#c77dff', pulse: 'a' },
      { x: 425, y: 310, r: 34, color: '#00e5ff', pulse: 'b' },
      { x: 195, y: 465, r: 30, color: '#00e5ff', pulse: 'a' },
    ],
    stations: [
      { id: 'specimens', label: 'Crystal Specimen Vault · Dashboard', x: 745, y: 295, action: 'dashboard', icon: '💎' },
      { id: 'workbench', label: 'Field Notes & Cataloging Desk', x: 975, y: 410, action: 'dashboard', icon: '🔍' },
      { id: 'exit', label: 'Exit Mountain Cavern', x: 608, y: 638, action: 'exit', icon: '🚪' },
    ],
    workers: [
      {
        id: 'geo-head',
        defaultName: 'Theron',
        isDeptHead: true,
        species: 'Elvaan',
        roleTitle: 'Chief Geologist',
        spriteKey: 'sprite-elvaan',
        hue: 150,
        workIcon: '💎',
        taskLine: 'Cataloging fresh amethyst and turquoise specimens brought in on the Stone Train!',
        route: [
          { x: 525, y: 465 },
          { x: 685, y: 495 },
          { x: 585, y: 575 },
        ],
        speed: 0.0042,
      },
      {
        id: 'geo-scout',
        defaultName: 'Flint',
        species: 'Halfling',
        roleTitle: 'Stone Train Quartermaster',
        spriteKey: 'sprite-halfling',
        hue: 195,
        workIcon: '⛏️',
        taskLine: 'Polishing geodes by the crystal alcove and checking rail schedules into Commons Square.',
        route: [
          { x: 415, y: 500 },
          { x: 540, y: 555 },
          { x: 465, y: 585 },
        ],
        speed: 0.0048,
      },
    ],
  },

  stocks: {
    hasPaintedBackdrop: true,
    backdropSrc: '/assets/interiors/interior-stocks.png',
    ambientGlows: [
      { x: 355, y: 305, r: 32, color: '#22c55e', pulse: 'a' },
      { x: 865, y: 305, r: 32, color: '#22c55e', pulse: 'b' },
      { x: 608, y: 235, r: 28, color: '#ffd166', pulse: 'a' },
    ],
    stations: [
      { id: 'research', label: 'Market Research Desk · Dashboard', x: 265, y: 425, action: 'dashboard', icon: '📈' },
      { id: 'mcp-desk', label: 'Walled MCP Charter Desk', x: 760, y: 345, action: 'dashboard', icon: '🛡️' },
      { id: 'exit', label: 'Exit Exchange', x: 608, y: 638, action: 'exit', icon: '🚪' },
    ],
    workers: [
      {
        id: 'st-head',
        defaultName: 'Sora',
        isDeptHead: true,
        species: 'Catgirl',
        roleTitle: 'Head of Markets',
        spriteKey: 'sprite-catgirl',
        hue: 48,
        workIcon: '📈',
        taskLine: 'Tracking earnings notes and market watchlists — research & alerts only outside the walled MCP exception!',
        route: [
          { x: 465, y: 475 },
          { x: 625, y: 445 },
          { x: 545, y: 565 },
        ],
        speed: 0.0048,
      },
      {
        id: 'st-analyst',
        defaultName: 'Cyrus',
        species: 'Elvaan',
        roleTitle: 'Research Analyst',
        spriteKey: 'sprite-elvaan',
        hue: 85,
        workIcon: '📊',
        taskLine: 'Auditing ticker trends and preparing clean daily briefs for Chancellor Amarette and Ray.',
        route: [
          { x: 785, y: 475 },
          { x: 660, y: 545 },
          { x: 835, y: 525 },
        ],
        speed: 0.0044,
      },
    ],
  },

  health: {
    hasPaintedBackdrop: true,
    backdropSrc: '/assets/interiors/interior-health.png',
    ambientGlows: [
      { x: 814, y: 145, r: 34, color: '#ffd166', pulse: 'a' },
      { x: 525, y: 120, r: 44, color: '#fef08a', pulse: 'b' },
      { x: 325, y: 245, r: 30, color: '#86efac', pulse: 'a' },
    ],
    stations: [
      { id: 'apothecary', label: 'Apothecary Vault · Dashboard', x: 500, y: 235, action: 'dashboard', icon: '🌿' },
      { id: 'prep', label: 'Wellness & Care Table', x: 755, y: 405, action: 'dashboard', icon: '💚' },
      { id: 'exit', label: 'Exit Greenhouse', x: 608, y: 638, action: 'exit', icon: '🚪' },
    ],
    workers: [
      {
        id: 'hl-head',
        defaultName: 'Lumi',
        isDeptHead: true,
        species: 'Winged Fae',
        roleTitle: 'Dean of Health',
        spriteKey: 'sprite-fae',
        hue: 0,
        workIcon: '💚',
        taskLine: 'Tending the apothecary herbs and guarding all wellness records under Article III strict confidentiality.',
        route: [
          { x: 430, y: 465 },
          { x: 585, y: 485 },
          { x: 495, y: 565 },
        ],
        speed: 0.0052,
      },
      {
        id: 'hl-herbalist',
        defaultName: 'Willow',
        species: 'Catgirl',
        roleTitle: 'Wellness Routine Organizer',
        spriteKey: 'sprite-catgirl',
        hue: 105,
        workIcon: '🍃',
        taskLine: 'Keeping appointment schedules and care notes strictly inside the private vault.',
        route: [
          { x: 825, y: 495 },
          { x: 675, y: 565 },
          { x: 885, y: 545 },
        ],
        speed: 0.0045,
      },
    ],
  },

  finance: {
    hasPaintedBackdrop: true,
    backdropSrc: '/assets/interiors/interior-finance.png',
    ambientGlows: [
      { x: 585, y: 185, r: 62, color: '#ffd166', pulse: 'a' },
      { x: 368, y: 138, r: 24, color: '#ffbe0b', pulse: 'b' },
      { x: 828, y: 138, r: 24, color: '#ffbe0b', pulse: 'b' },
    ],
    stations: [
      { id: 'vault', label: 'Golden Treasury Vault · Dashboard', x: 585, y: 185, action: 'dashboard', icon: '🏦' },
      { id: 'ledgers', label: 'Budget & Bills Ledger Desk', x: 310, y: 395, action: 'dashboard', icon: '📒' },
      { id: 'exit', label: 'Exit Treasury', x: 608, y: 638, action: 'exit', icon: '🚪' },
    ],
    workers: [
      {
        id: 'fn-head',
        defaultName: 'Bram',
        isDeptHead: true,
        species: 'Halfling',
        roleTitle: 'Campus Treasurer',
        spriteKey: 'sprite-halfling',
        hue: -35,
        workIcon: '🪙',
        taskLine: 'Balancing household & business budgets and double-checking subscriptions before any spend!',
        route: [
          { x: 515, y: 455 },
          { x: 695, y: 455 },
          { x: 605, y: 565 },
        ],
        speed: 0.0044,
      },
      {
        id: 'fn-clerk',
        defaultName: 'Aurelia',
        species: 'Elvaan',
        roleTitle: 'Savings & Audit Clerk',
        spriteKey: 'sprite-elvaan',
        hue: 45,
        workIcon: '⚖️',
        taskLine: 'Keeping every financial record strictly private between Amarette and Ray under Article III.',
        route: [
          { x: 465, y: 525 },
          { x: 605, y: 595 },
          { x: 745, y: 525 },
        ],
        speed: 0.004,
      },
    ],
  },

  communications: {
    hasPaintedBackdrop: true,
    backdropSrc: '/assets/interiors/interior-communications.png',
    ambientGlows: [
      { x: 1055, y: 190, r: 30, color: '#ffbe0b', pulse: 'a' },
      { x: 840, y: 165, r: 38, color: '#fff3b0', pulse: 'b' },
    ],
    stations: [
      { id: 'post-desk', label: 'Postmaster Desk · Dashboard', x: 745, y: 355, action: 'dashboard', icon: '✉️' },
      { id: 'cubbies', label: 'Scroll Pigeonholes & Drafts', x: 365, y: 265, action: 'dashboard', icon: '📬' },
      { id: 'exit', label: 'Exit Belltower', x: 608, y: 638, action: 'exit', icon: '🚪' },
    ],
    workers: [
      {
        id: 'cm-head',
        defaultName: 'Sera',
        isDeptHead: true,
        species: 'Winged Fae',
        roleTitle: 'Postmaster General',
        spriteKey: 'sprite-fae',
        hue: 25,
        workIcon: '✉️',
        taskLine: 'Sorting correspondence drafts into pigeonholes — external messages always wait for a Chancellor ! Permit!',
        route: [
          { x: 445, y: 445 },
          { x: 585, y: 525 },
          { x: 475, y: 565 },
        ],
        speed: 0.0052,
      },
      {
        id: 'cm-runner',
        defaultName: 'Kip',
        species: 'Halfling',
        roleTitle: 'Campus Courier',
        spriteKey: 'sprite-halfling',
        hue: 40,
        workIcon: '🔔',
        taskLine: 'Delivering cross-department handoff scrolls smoothly under Article VI!',
        route: [
          { x: 665, y: 555 },
          { x: 825, y: 535 },
          { x: 555, y: 585 },
        ],
        speed: 0.005,
      },
    ],
  },

  'childrens-books': {
    hasPaintedBackdrop: true,
    backdropSrc: '/assets/interiors/interior-childrens-books.png',
    ambientGlows: [
      { x: 272, y: 175, r: 26, color: '#ffbe0b', pulse: 'a' },
      { x: 392, y: 128, r: 26, color: '#ffbe0b', pulse: 'b' },
      { x: 945, y: 205, r: 26, color: '#ffbe0b', pulse: 'a' },
    ],
    stations: [
      { id: 'studio', label: 'Illustration & Story Desk · Dashboard', x: 365, y: 365, action: 'dashboard', icon: '🎨' },
      { id: 'nook', label: 'Storybook Reading Nook', x: 785, y: 325, action: 'dashboard', icon: '📖' },
      { id: 'exit', label: 'Exit Storybook Library', x: 608, y: 638, action: 'exit', icon: '🚪' },
    ],
    workers: [
      {
        id: 'cb-head',
        defaultName: 'Nyra',
        isDeptHead: true,
        species: 'Catgirl',
        roleTitle: 'Storybook Editor-in-Chief',
        spriteKey: 'sprite-catgirl',
        hue: 0,
        workIcon: '📖',
        taskLine: 'Reviewing Bramblewood Friends manuscripts and pairing warm watercolor sketches with Ray’s local ComfyUI!',
        route: [
          { x: 525, y: 465 },
          { x: 685, y: 495 },
          { x: 575, y: 585 },
        ],
        speed: 0.0046,
      },
      {
        id: 'cb-artist',
        defaultName: 'Pippin',
        species: 'Winged Fae',
        roleTitle: 'Picture-Book Illustrator',
        spriteKey: 'sprite-fae',
        hue: 310,
        workIcon: '🎨',
        taskLine: 'Mixing jewel-tone watercolors and making sure every page follows Article VII child-safe warmth!',
        route: [
          { x: 435, y: 535 },
          { x: 615, y: 555 },
          { x: 775, y: 515 },
        ],
        speed: 0.0054,
      },
    ],
  },

  'social-media': {
    hasPaintedBackdrop: true,
    backdropSrc: '/assets/interiors/interior-social-media.png',
    ambientGlows: [
      { x: 312, y: 175, r: 26, color: '#ffbe0b', pulse: 'a' },
      { x: 888, y: 175, r: 26, color: '#ffbe0b', pulse: 'b' },
      { x: 608, y: 265, r: 54, color: '#e0aaff', pulse: 'a' },
    ],
    stations: [
      { id: 'stage', label: 'Persona Playhouse Stage · Dashboard', x: 608, y: 285, action: 'dashboard', icon: '🎭' },
      { id: 'calendar', label: 'Content & Draft Studio', x: 195, y: 445, action: 'dashboard', icon: '🗓️' },
      { id: 'exit', label: 'Exit Playhouse', x: 608, y: 638, action: 'exit', icon: '🚪' },
    ],
    workers: [
      {
        id: 'sm-head',
        defaultName: 'Faye',
        isDeptHead: true,
        species: 'Winged Fae',
        roleTitle: 'Guild Director of Personas',
        spriteKey: 'sprite-fae',
        hue: 55,
        workIcon: '🎭',
        taskLine: 'Rehearsing character voices onstage — every public post stays in drafts until Chancellor Amarette approves!',
        route: [
          { x: 465, y: 475 },
          { x: 745, y: 475 },
          { x: 608, y: 545 },
        ],
        speed: 0.0054,
      },
      {
        id: 'sm-writer',
        defaultName: 'Trix',
        species: 'Catgirl',
        roleTitle: 'Content Calendar Producer',
        spriteKey: 'sprite-catgirl',
        hue: 290,
        workIcon: '✨',
        taskLine: 'Coordinating visual reels and persona lore with the creative desks.',
        route: [
          { x: 355, y: 525 },
          { x: 545, y: 565 },
          { x: 845, y: 525 },
        ],
        speed: 0.0048,
      },
    ],
  },

  rd: {
    hasPaintedBackdrop: true,
    backdropSrc: '/assets/interiors/interior-rd.png',
    ambientGlows: [
      { x: 608, y: 105, r: 72, color: '#00e5ff', pulse: 'a' },
      { x: 128, y: 280, r: 24, color: '#ffbe0b', pulse: 'b' },
      { x: 1090, y: 280, r: 24, color: '#ffbe0b', pulse: 'b' },
    ],
    stations: [
      { id: 'blueprints', label: 'Blueprint & Prototype Table · Dashboard', x: 295, y: 420, action: 'dashboard', icon: '📐' },
      { id: 'astrolabe', label: 'Local Model & Skill Bench', x: 945, y: 420, action: 'dashboard', icon: '⚙️' },
      { id: 'exit', label: 'Exit R&D Workshop', x: 608, y: 638, action: 'exit', icon: '🚪' },
    ],
    workers: [
      {
        id: 'rd-head',
        defaultName: 'Tink',
        isDeptHead: true,
        species: 'Halfling',
        roleTitle: 'Lead Artificer',
        spriteKey: 'sprite-halfling',
        hue: 165,
        workIcon: '⚙️',
        taskLine: 'Prototyping new Cairnspire tools and testing Qwen-Image & local GPU workflows under the skylight!',
        route: [
          { x: 465, y: 475 },
          { x: 745, y: 475 },
          { x: 608, y: 565 },
        ],
        speed: 0.005,
      },
      {
        id: 'rd-bench',
        defaultName: 'Lyra',
        species: 'Elvaan',
        roleTitle: 'Skill Incubator Architect',
        spriteKey: 'sprite-elvaan',
        hue: 195,
        workIcon: '🧪',
        taskLine: 'Drafting reusable Skills and benchmarking local models before proposing them to Town Hall!',
        route: [
          { x: 525, y: 425 },
          { x: 695, y: 435 },
          { x: 608, y: 515 },
        ],
        speed: 0.0044,
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
