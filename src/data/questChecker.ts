// Client/bridge port of Science Quests Units 1–5 & Mixed answer checking from ScienceQuests.gs
// Never exposes keys to the iframe HTML — only returns matched/step/hint message!

export interface QuestCheckResult {
  matched: boolean | '';
  step: number;
  msg: string;
}

const clean = (s: unknown) => String(s ?? '').trim();

/* ---------- SCIENCE PATH UNITS 1–5 & MIXED ---------- */
type Rule =
  | { t: 'num'; v: number; tol?: number; alt?: number[]; slips?: Array<[number, string]>; abs?: boolean; u?: RegExp; un?: string; dec?: boolean; pct?: boolean; step?: number }
  | { t: 'kw'; all: RegExp[]; not?: RegExp[]; slips?: Array<[RegExp, string]>; step?: number }
  | { t: 'label'; want: 'I' | 'D' | 'C' }
  | { t: 'two'; pool: RegExp[] }
  | { t: 'open'; any: RegExp[]; slips?: Array<[RegExp, string]>; msg?: string }
  | { t: 'square'; want: string[] }
  | { t: 'expr'; v: number; div: number; newV?: number; step?: number };

const N_ = (v: number, o: Partial<Extract<Rule, { t: 'num' }>> = {}): Rule => ({ t: 'num', v, ...o });
const W_ = (all: RegExp[], o: Partial<Extract<Rule, { t: 'kw' }>> = {}): Rule => ({ t: 'kw', all, ...o });
const L_ = (want: 'I' | 'D' | 'C'): Rule => ({ t: 'label', want });
const T_ = (pool: RegExp[]): Rule => ({ t: 'two', pool });
const O_ = (any: RegExp[], o: Partial<Extract<Rule, { t: 'open' }>> = {}): Rule => ({ t: 'open', any, ...o });
const Q_ = (want: string[]): Rule => ({ t: 'square', want });
const X_ = (v: number, div: number, o: Partial<Extract<Rule, { t: 'expr' }>> = {}): Rule => ({ t: 'expr', v, div, ...o });
const IV_ = (re: RegExp, slipRe?: RegExp, msg?: string): Rule =>
  W_([re], {
    step: 1,
    slips: slipRe ? [[slipRe, msg || 'Which one was chosen before the test started, and which one was found out at the end?']] : [],
  });

const DIV_ORIG = 'Divide by the original.';
const ADDED = 'Two in a row means multiply, not add.';
const INC = W_([/increas|\bup\b|rose|rise|more|gain|grew|went up|higher/i], { not: [/decreas|\bdown\b|less|fewer|drop|lower/i], step: 4 });
const DEC = W_([/decreas|\bdown\b|less|fewer|drop|lower|fell/i], { not: [/increas|\bup\b|more|higher/i], step: 4 });
const YES = W_([/^\s*(yes|yep|yeah|y)\b|float/i], { not: [/^\s*no\b|sink/i] });
const NO = W_([/^\s*(no|nope|n)\b|does ?n.?t|not move|stays|won.?t/i], { not: [/^\s*yes\b/i] });

const SCI_KEYS: Record<string, Record<string, Record<string, Rule>>> = {
  'SCI-U1-weighing-of-conditions': {
    E1: { A: L_('I'), B: L_('D'), C: L_('C') },
    E2: { hyp: O_([/\bif\b[\s\S]*\bthen\b|\bif\b[\s\S]*(oil|lantern)[\s\S]*(lit|long|burn|last)/i], { slips: [[/^\s*[\w\s]*\b(better|best|good)\b[\s.!]*$/i, 'Better at what? What would you measure?']] }) },
    E3: {
      A: O_([/more than once|several|many|five|5|three|3|again|repeat|more times|each oil.*times|times each|a few times|twice|two times|multiple/i]),
      B: W_([/same|both|equal|no wind|cellar/i, /place|room|cellar|wind|lantern|size|wick|amount|oil|time|day|spot|jar|container/i], { step: 2 }),
    },
    E4: {
      A: IV_(/soil|silt|loam|sand/i, /length|long|tall|grow/i),
      B: W_([/length|long|tall|grow|size|height|big/i], { step: 2, not: [/^\s*(soil|type)/i] }),
      C: T_([/water/i, /sun|light/i, /30|day|time|month|weeks?/i, /variety|kind of carrot|type of carrot|seed|same carrot/i, /depth|deep/i, /row|space|size of/i]),
    },
    E5: { A: O_([/row|variety|kind|type|seed|depth|deep|fence|rabbit|water|sun|same|more|several|again|repeat/i]) },
    E6: {
      A: IV_(/string|material|linen|sinew|silk/i, /far|distance/i),
      B: W_([/far|distance|length|how long|marker|fl(y|ies|ew)|travel|range/i], { step: 2 }),
      C: T_([/\bbow\b|same bow/i, /arrow/i, /draw|pull|tension|strength/i, /hall|wind|indoor|room|place|inside/i, /archer|person|shooter/i, /aim|angle|height/i]),
    },
    E7: {
      A: O_([/arrow|two things|both|same time|at once|changed .*and|more than one|two changes|different arrow/i]),
      IV: W_([/string/i], { step: 3 }),
      DV: W_([/far|distance|length|how long|landed|travel|marker/i], { step: 3 }),
    },
    E8: {
      A: IV_(/size|hall|room|big|chapel|which/i, /second|ring|how long/i),
      B: W_([/second|ring|long|time|sound|echo|last/i], { step: 2 }),
      C: T_([/lute/i, /string/i, /pluck|strength|hard|force/i, /spot|cent(er|re)|middle|place|position|stand/i, /note|pitch/i, /player|person|same bard/i]),
    },
    E9: {
      A: W_([/water/i, /often|every|frequen|day|schedul|how many|how much|amount|times/i], { step: 1 }),
      B: W_([/leaf|leaves/i], { step: 2 }),
      C: T_([/vine|kind|plant|type/i, /soil|dirt/i, /\bcan\b|amount|size/i, /terrace|sun|light|place|spot/i, /week|time|six|\b6\b/i]),
    },
    E10: {
      A: IV_(/liquid|water|oil|salt|cool|tub|fluid/i, /hard|dent/i),
      B: W_([/hard|dent|deep|strength|strong|tough/i], { step: 2 }),
      C: T_([/hook|size|shape/i, /iron|metal/i, /forge|fire|heat|hot/i, /steel|point|test|tool/i, /smith|person|same time|how long/i]),
    },
    SIDE: {
      A: IV_(/ris(e|ing)|time|minute|how long|30|60|90|prove/i, /tall|height/i),
      B: W_([/tall|height|high|size|big|rise/i], { step: 2, not: [/minute/i] }),
      C: T_([/dough|recipe|flour|ingredient/i, /oven/i, /shelf|rack/i, /temp|heat/i, /size|amount|pan|tray/i, /bake|baking time/i]),
    },
  },
  'SCI-U2-trial-log': {
    E1: { A: N_(150, { step: 1 }), B: N_(50, { step: 2, slips: [[150, 'Now divide the sum by the number of trials, 3.']] }) },
    E2: { A: N_(64, { step: 1 }), B: N_(21.333, { tol: 0.004, step: 3, slips: [[21.3, "Orrin's rule keeps three places for decimals."], [21, "Orrin's rule keeps three places for decimals."], [64, 'Now divide the sum by 3.']] }) },
    E3: { A: N_(4, { step: 2 }), B: N_(20, { step: 3 }), C: N_(8, { step: 4 }), D: W_([/median/i], { step: 5, not: [/\bmean\b/i] }) },
    E4: { A: N_(22, { step: 1 }), B: N_(28, { step: 2 }) },
    E5: { A1: N_(22, { step: 1 }), A2: N_(28, { step: 1 }), B: X_(27.2727, 22, { newV: 21.4286, step: 2 }), C: N_(27.2727, { tol: 0.06, step: 3, slips: [[21.43, DIV_ORIG], [21.4286, DIV_ORIG]] }) },
    E6: { A: N_(27, { step: 1 }), B: O_([/27/]) },
    E7: { A1: N_(38, { step: 1 }), A2: N_(31, { step: 1 }), B: N_(38, { step: 2 }), C1: X_(-18.421, 38, { newV: -22.58, step: 3 }), C2: N_(-18.421, { tol: 0.06, abs: true, step: 3 }), D1: N_(-18, { abs: true, step: 4 }), D2: DEC },
    E8: { A: O_([/16|20|wrong number|original|first|new mean|instead|before/i]), B1: X_(25, 16, { newV: 20, step: 2 }), B2: N_(25, { step: 3 }) },
    E9: { A: N_(60, { step: 1 }), B: N_(20, { step: 2 }) },
    E10: { A1: N_(24, { step: 1 }), A2: N_(31, { step: 1 }), B: N_(24, { step: 2 }), C1: X_(29.1667, 24, { newV: 22.58, step: 3 }), C2: N_(29.1667, { tol: 0.06, step: 3 }), D1: N_(29, { step: 4 }), D2: INC },
    SIDE: { A1: N_(85, { step: 1 }), A2: N_(102, { step: 1 }), B: N_(85, { step: 2 }), C1: N_(20, { step: 3 }), C2: INC },
  },
  'SCI-U3-given-formulas': {
    E1: { L1: W_([/dens/i], { step: 1 }), L2: W_([/mass|gram|weigh/i], { step: 1 }), L3: W_([/vol|cm|space/i], { step: 1 }), B: N_(2.6, { tol: 0.001, step: 3, u: /g\s*\/\s*cm|g\/cc|grams? per/i, un: 'g/cm³' }) },
    E2: { A: N_(0.5, { step: 2, u: /g\s*\/\s*cm|g\/cc|grams? per/i, un: 'g/cm³' }), B: YES },
    E3: { L1: W_([/force|newton|push|pull/i], { step: 1 }), L2: W_([/mass|kg|kilo/i], { step: 1 }), L3: W_([/acc|speed/i], { step: 1 }), B: N_(500, { step: 3, u: /(\d|\b)N\b|newton/i, un: 'N' }) },
    E4: { m: N_(40, { step: 1 }), a: N_(0.75, { step: 1 }), F: N_(30, { step: 2, u: /(\d|\b)N\b|newton/i, un: 'N' }) },
    E5: { a: N_(1.5, { step: 2, u: /m\s*\/\s*s|meters? per/i, un: 'm/s²' }) },
    E6: { F: N_(120, { step: 2, u: /(\d|\b)N\b|newton/i, un: 'N' }) },
    E7: { A: N_(0.5, { step: 1, u: /m\s*\/\s*s|meters? per/i, un: 'm/s²' }), B: N_(45, { step: 2, u: /(\d|\b)N\b|newton/i, un: 'N' }) },
    E8: { L1: W_([/speed|veloc|fast/i], { step: 1 }), L2: W_([/dist|km|far|kilomet/i], { step: 1 }), L3: W_([/time|hour/i], { step: 1 }), B: N_(4.5, { step: 3, u: /km\s*\/\s*h|kph|per hour/i, un: 'km/h' }) },
    E9: { v: N_(16.667, { tol: 0.0005, alt: [16.67], step: 3, u: /km\s*\/\s*h|kph|per hour/i, un: 'km/h' }) },
    E10: { L1: W_([/speed|veloc|fast/i], { step: 1 }), L2: W_([/freq|hertz|hz|vibrat/i], { step: 1 }), L3: W_([/length|long|meter|metre/i], { step: 1 }), B: N_(343.2, { tol: 0.01, step: 3, u: /m\s*\/\s*s|meters? per/i, un: 'm/s' }) },
    E11: { A: N_(343.2, { tol: 0.01, step: 1, u: /m\s*\/\s*s|meters? per/i, un: 'm/s' }), B: O_([/same|equal|match|identical|as fast|no different/i]) },
    E12: { L1: W_([/work|joule/i], { step: 1 }), L2: W_([/force|newton|push|pull/i], { step: 1 }), L3: W_([/dist|meter|metre|far/i], { step: 1 }), B: N_(300, { step: 3, u: /(\d|\b)J\b|joule/i, un: 'J' }) },
    E13: { A: N_(240, { step: 1, u: /(\d|\b)J\b|joule/i, un: 'J' }), B: N_(30, { step: 2, u: /(\d|\b)W\b|watt/i, un: 'watts' }) },
    SIDE: { A: N_(0.92, { step: 1, u: /g\s*\/\s*cm|g\/cc|grams? per/i, un: 'g/cm³' }), B: YES },
  },
  'SCI-U4-inherited-marks': {
    E1: { G1: W_([/long/i], { not: [/short/i], step: 1 }), G2: W_([/long/i], { not: [/short|half/i], step: 2 }), G3: W_([/short/i], { not: [/long/i], step: 3 }) },
    E2: { SQ: Q_(['Ee', 'Ee', 'Ee', 'Ee']), Bp: N_(100, { step: 4, pct: true }), Bd: N_(1, { step: 4, dec: true }) },
    E3: { SQ: Q_(['Rr', 'Rr', 'rr', 'rr']) },
    E4: { A: N_(50, { step: 2, pct: true }), B: N_(0.5, { step: 3, dec: true }) },
    E5: { D: N_(0.25, { step: 2, dec: true, slips: [[1, ADDED]] }), P: N_(25, { step: 3, pct: true, slips: [[100, ADDED]] }) },
    E6: { SQ: Q_(['TT', 'Tt', 'Tt', 'tt']) },
    E7: { Ap: N_(25, { step: 1, pct: true }), Ad: N_(0.25, { step: 1, dec: true }), Bp: N_(75, { step: 2, pct: true }), Bd: N_(0.75, { step: 2, dec: true }) },
    E8: { A: O_([/not the same|show|tall|only tt|capital|dominant|carry|carries|hidden|cover/i]), B: N_(25, { step: 4, pct: true }) },
    E9: { A: N_(25, { step: 2, pct: true }), B: N_(0.25, { step: 2, dec: true }) },
    E10: { A: N_(0.75, { step: 1, dec: true }), Bd: N_(0.563, { tol: 0.0005, alt: [0.5625], step: 2, slips: [[1.5, ADDED]] }), Bp: N_(56, { step: 2, alt: [56.25, 56.3], pct: true, slips: [[150, ADDED]] }), C: W_([/less/i], { not: [/more/i], step: 3 }) },
    SIDE: { SQ: Q_(['HH', 'HH', 'Hh', 'Hh']), Bp: N_(0, { step: 4 }), Bd: N_(0, { step: 4 }) },
  },
  'SCI-U5-review-chambers': {
    E1: { J1: W_([/membrane/i], { step: 1 }), J2: W_([/nucle/i], { step: 2 }), J3: W_([/chloro/i], { step: 3 }), J4: W_([/mitochond/i], { step: 4 }) },
    E2: { A: N_(800, { step: 1 }), B: N_(80, { step: 2 }) },
    E3: { A: O_([/cool|heat|evapor|dr(y|ies|ied)|temperature down|lower/i]) },
    E4: { A: O_([/warm|heat|hot/i]) },
    E5: { A: W_([/circul|cardio|blood/i], { step: 1, not: [/respir/i] }), B: W_([/respir|breath|lung/i], { step: 2, not: [/circul/i] }) },
    E6: { A: W_([/chemi|food|stored/i], { step: 1 }), B: W_([/motion|kinetic|mechanic|moving|movement/i], { step: 2 }), C: W_([/elastic|potential|stored|spring/i], { step: 3 }), D: W_([/sound|vibrat|acoustic/i], { step: 4 }) },
    E7: { A: W_([/gravit|potential|stored|height/i], { step: 1 }), B: W_([/motion|kinetic|moving|mechanic/i], { step: 2 }), C: W_([/heat|sound|noise|thermal|warm|friction/i], { step: 3 }) },
    E8: { A: NO, B1: N_(80, { step: 2 }), B2: W_([/river/i], { step: 3, not: [/hill/i] }) },
    E9: { A: W_([/second|2nd|high|thin|short|two/i], { step: 1, not: [/first|1st|low|thick/i] }), B: W_([/amplitude/i], { step: 2 }) },
    E10: { A: W_([/sun/i], { step: 1 }), B: W_([/small|shrink|wan|less|decreas/i], { step: 2, not: [/bigger|grow|wax/i] }) },
    E11: { A: W_([/day|24/i], { step: 1, not: [/year/i] }), B: W_([/year|365/i], { step: 2, not: [/\bday\b/i] }) },
    E12: { D: W_([/desert/i], { step: 2 }), V: W_([/rain ?forest|jungle/i], { step: 2 }), T: W_([/grass|prairie|plain/i], { step: 3 }), B: O_([/\b(15|320|55)\b/], { msg: 'What number in the table shows that?' }) },
    E13: { A: W_([/^\s*renew/i], { step: 1 }), B: W_([/non|not renew/i], { step: 2 }), C: W_([/^\s*renew/i], { step: 1 }), D: W_([/^\s*renew/i], { step: 1 }), E: W_([/non|not renew/i], { step: 2 }) },
  },
  'SCI-MIXED-science-check': {
    E1: { A: IV_(/colou?r|paint|white|yellow|green/i, /temp|warm|hot/i), B: W_([/temp|warm|hot|heat/i], { step: 2 }), C: T_([/size|same hive/i, /field|sun|spot|place|location/i, /fac(e|ing)|direction|way/i, /noon|time|when/i, /shape|kind of hive|wood/i]) },
    E2: { A1: N_(45, { step: 1 }), A2: N_(54, { step: 1 }), B: N_(45, { step: 2 }), C1: N_(20, { step: 3 }), C2: INC },
    E3: { A: N_(4, { step: 1, u: /m\s*\/\s*s|meters? per/i, un: 'm/s' }), B: N_(140, { step: 2 }) },
    E4: { SQ: Q_(['YY', 'Yy', 'Yy', 'yy']), Bp: N_(25, { step: 2, pct: true }), Bd: N_(0.25, { step: 2, dec: true }), Cd: N_(0.063, { tol: 0.0005, alt: [0.0625], step: 3, slips: [[0.5, ADDED]] }), Cp: N_(6, { alt: [6.25, 6.3], step: 3, pct: true, slips: [[50, ADDED]] }) },
    E5: { A: O_([/increas|more|go up|goes up|rise|grow|multipl|lots|boom|lot of/i]) },
    E6: { A: W_([/elastic|potential|stored|stretch/i], { step: 1 }), B: W_([/motion|kinetic|moving|mechanic/i], { step: 2 }) },
    E7: { A: W_([/evapor/i], { step: 1 }), B: W_([/condens/i], { step: 2 }), C: W_([/precip|rain/i], { step: 3 }) },
  },
};

function sciClean(s: string) {
  return clean(s).replace(/[−–—]/g, '-').replace(/×/g, 'x').replace(/÷/g, '/').replace(/\s+/g, ' ').trim();
}
function sciNum(s: string): number | null {
  let c = sciClean(s);
  const idx = c.lastIndexOf('=');
  if (idx > -1) c = c.slice(idx + 1);
  c = c.replace(/(\d),(?=\d{3}\b)/g, '$1');
  const m = /-?\s?\d*\.?\d+/.exec(c);
  return m ? Number(m[0].replace(/\s/g, '')) : null;
}
function sciExpr(s: string): number | null {
  let c = sciClean(s).replace(/%/g, '').replace(/(\d),(?=\d{3}\b)/g, '$1').replace(/[x*]/gi, '*');
  const i = c.lastIndexOf('=');
  if (i > -1 && /[\d)]\s*$/.test(c.slice(0, i))) c = c.slice(0, i);
  c = c.replace(/\s/g, '');
  if (!/^[\d.+\-*/()]+$/.test(c)) return null;
  let p = 0;
  function num(): number {
    const m = /^\d*\.?\d+/.exec(c.slice(p));
    if (!m) throw new Error('parse');
    p += m[0].length;
    return Number(m[0]);
  }
  function fac(): number {
    if (c[p] === '-') { p++; return -fac(); }
    if (c[p] === '(') { p++; const v = add(); if (c[p] !== ')') throw new Error('parse'); p++; return v; }
    return num();
  }
  function mul(): number {
    let v = fac();
    while (c[p] === '*' || c[p] === '/') {
      const o = c[p++];
      const r = fac();
      v = o === '*' ? v * r : v / r;
    }
    return v;
  }
  function add(): number {
    let v = mul();
    while (c[p] === '+' || c[p] === '-') {
      const o = c[p++];
      const r = mul();
      v = o === '+' ? v + r : v - r;
    }
    return v;
  }
  try {
    const v = add();
    return p === c.length && Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
}
const sciNear = (a: number, b: number, tol = 0.0005) => Math.abs(a - b) <= tol;
function sciBox(b: string): string {
  const letters = clean(b).replace(/[^A-Za-z]/g, '');
  if (letters.length !== 2) return letters;
  return letters[0] === letters[0].toLowerCase() && letters[1] !== letters[1].toLowerCase()
    ? letters[1] + letters[0]
    : letters;
}
function sciLabel(s: string): '' | 'I' | 'D' | 'C' {
  const low = clean(s).toLowerCase();
  if (/independent|\biv\b|chang|chose|choose/.test(low)) return 'I';
  if (/dependent|\bdv\b|measur|found out|result/.test(low)) return 'D';
  if (/control|same|constant|kept|keep|fair/.test(low)) return 'C';
  return '';
}

function checkScience(questId: string, pid: string, field: string, answer: string): QuestCheckResult {
  if (field === 'question' || field === 'pinned') return { matched: '', step: 0, msg: '' };
  const k = SCI_KEYS[questId]?.[pid]?.[field];
  if (!k) return { matched: '', step: 0, msg: '' };
  const a = clean(answer);

  if (k.t === 'num') {
    const st = k.step || 1;
    const n = sciNum(a);
    if (n == null) return { matched: false, step: st, msg: 'Type a number.' };
    const nn = k.abs ? Math.abs(n) : n;
    const vv = k.abs ? Math.abs(k.v) : k.v;
    let ok = sciNear(nn, vv, k.tol);
    (k.alt || []).forEach((x) => {
      if (sciNear(nn, k.abs ? Math.abs(x) : x, 0.0005)) ok = true;
    });
    if (ok) return { matched: true, step: 0, msg: k.u && !k.u.test(a) ? `Add the unit ${k.un} too.` : '' };
    for (const [val, msg] of k.slips || []) {
      if (sciNear(nn, k.abs ? Math.abs(val) : val, 0.0005)) return { matched: false, step: st, msg };
    }
    if (k.dec && sciNear(n, k.v * 100) && k.v !== 0) return { matched: false, step: st, msg: 'As a decimal, divide the percent by 100.' };
    if (k.pct && sciNear(n, k.v / 100, 0.00005) && k.v !== 0) return { matched: false, step: st, msg: 'As a percent, multiply the decimal by 100.' };
    return { matched: false, step: st, msg: '' };
  }
  if (k.t === 'kw') {
    const st = k.step || 1;
    const hit = k.all.every((re) => re.test(a)) && !(k.not || []).some((re) => re.test(a));
    if (hit) return { matched: true, step: 0, msg: '' };
    for (const [re, msg] of k.slips || []) {
      if (re.test(a)) return { matched: false, step: st, msg };
    }
    return { matched: false, step: st, msg: '' };
  }
  if (k.t === 'label') {
    const got = sciLabel(a);
    if (got === k.want) return { matched: true, step: 0, msg: '' };
    const swap = (k.want === 'I' && got === 'D') || (k.want === 'D' && got === 'I');
    const lbl = { I: 'independent', D: 'dependent', C: 'controlled' };
    return {
      matched: false,
      step: { I: 1, D: 2, C: 3 }[k.want],
      msg: swap
        ? 'Which one was chosen before the test started, and which one was found out at the end?'
        : got
          ? ''
          : `Use one of the three labels: ${lbl.I}, ${lbl.D}, or ${lbl.C}.`,
    };
  }
  if (k.t === 'two') {
    const hits = k.pool.filter((re) => re.test(a)).length;
    if (hits >= 2) return { matched: true, step: 0, msg: '' };
    return {
      matched: false,
      step: 3,
      msg: hits === 1 ? 'One found. Add one more thing that stays the same.' : 'Look for what is the same every time.',
    };
  }
  if (k.t === 'open') {
    if (k.any.some((re) => re.test(a))) return { matched: true, step: 0, msg: '' };
    for (const [re, msg] of k.slips || []) {
      if (re.test(a)) return { matched: false, step: 1, msg };
    }
    return { matched: '', step: 0, msg: k.msg || '' };
  }
  if (k.t === 'square') {
    const parts = a.split(/[,;|\s]+/).filter(Boolean);
    const got2 = parts.map(sciBox).sort().join(',');
    const want = k.want.map(sciBox).sort().join(',');
    if (got2 === want) return { matched: true, step: 0, msg: '' };
    return {
      matched: false,
      step: 3,
      msg: parts.length !== 4 ? 'Fill all four boxes.' : 'Each box gets one letter from the top and one from the side.',
    };
  }
  if (k.t === 'expr') {
    const st = k.step || 1;
    const ev = sciExpr(a);
    if (ev == null) {
      return { matched: false, step: st, msg: 'Write the setup with the numbers, like (new - original) / original x 100.' };
    }
    const divOk = new RegExp(`/\\s*\\(?\\s*${String(k.div).replace('.', '\\.')}(?![\\d.])`).test(sciClean(a));
    if (sciNear(ev, k.v, 0.06) && divOk) return { matched: true, step: 0, msg: '' };
    if (k.newV != null && sciNear(ev, k.newV, 0.06)) return { matched: false, step: st, msg: DIV_ORIG };
    if (sciNear(ev * 100, k.v, 0.06)) return { matched: false, step: st, msg: 'Add x 100 to turn it into a percent.' };
    if (!/\(/.test(a)) return { matched: false, step: st, msg: 'Use parentheses so the subtraction happens first.' };
    return { matched: false, step: st, msg: '' };
  }
  return { matched: '', step: 0, msg: '' };
}

export function checkQuestAnswer(questId: string, pid: string, field: string, answer: string): QuestCheckResult {
  return checkScience(questId, pid, field, answer);
}
