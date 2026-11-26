export interface BramblewoodBook {
  num: number;
  title: string;
  illustrations: number;
  artApproved: number;
  englishApproved: number;
  spanishApproved: number;
  comfyRedo: number;
  status: 'Not started' | 'Needs ComfyUI redo' | 'In review' | 'Approved' | 'Published';
  notes?: string;
}

export interface PrintableProduct {
  id: string;
  num: string;
  title: string;
  price: string;
  pages: string;
  summary: string;
  versions: string;
  tags: string[];
  status: 'Draft' | 'Ready for Etsy' | 'Listed';
}

export const SPARROW_SPROCKET_BRAND = {
  shopName: 'Sparrow & Sprocket',
  tagline: 'Gentle routines for busy, brilliant brains — designed by a neurodivergent family of seven.',
  colors: [
    { name: 'Sage', hex: '#7FA98B' },
    { name: 'Deep Sage', hex: '#5E8C6A' },
    { name: 'Sky', hex: '#8DB8D8' },
    { name: 'Peach', hex: '#F4B183' },
    { name: 'Lilac', hex: '#C9A7D8' },
    { name: 'Cream', hex: '#FFF8EE' },
    { name: 'Ink', hex: '#33415C' },
  ],
  fonts: 'Fredoka (headings) · Atkinson Hyperlegible (body, dyslexia-friendly)',
};

export const INITIAL_BRAMBLEWOOD_BOOKS: BramblewoodBook[] = [
  { num: 1, title: "Milo's Zoom Brain", illustrations: 12, artApproved: 12, englishApproved: 0, spanishApproved: 0, comfyRedo: 0, status: 'Needs ComfyUI redo' },
  { num: 2, title: "Juni's Quiet Shell", illustrations: 12, artApproved: 0, englishApproved: 0, spanishApproved: 0, comfyRedo: 12, status: 'Needs ComfyUI redo' },
  { num: 3, title: 'Rafi and the Wiggly Words', illustrations: 12, artApproved: 0, englishApproved: 0, spanishApproved: 0, comfyRedo: 12, status: 'Needs ComfyUI redo' },
  { num: 4, title: "Kai's Two-Speed Engine", illustrations: 12, artApproved: 0, englishApproved: 0, spanishApproved: 0, comfyRedo: 12, status: 'Needs ComfyUI redo' },
  { num: 5, title: 'Priya and the Sticky Thoughts', illustrations: 12, artApproved: 0, englishApproved: 0, spanishApproved: 0, comfyRedo: 12, status: 'Needs ComfyUI redo' },
  { num: 6, title: 'Rosie and Pip Feel Brave', illustrations: 12, artApproved: 0, englishApproved: 0, spanishApproved: 0, comfyRedo: 12, status: 'Needs ComfyUI redo' },
  { num: 7, title: "The Gray Cloud Over Teo's House", illustrations: 12, artApproved: 0, englishApproved: 0, spanishApproved: 0, comfyRedo: 12, status: 'Needs ComfyUI redo' },
  { num: 8, title: "Sam's Own Steps", illustrations: 12, artApproved: 0, englishApproved: 0, spanishApproved: 0, comfyRedo: 12, status: 'Needs ComfyUI redo' },
  { num: 9, title: 'The Big Bramblewood Feelings Fair', illustrations: 12, artApproved: 0, englishApproved: 0, spanishApproved: 0, comfyRedo: 12, status: 'Needs ComfyUI redo' },
];

export const INITIAL_PRINTABLES_CATALOG: PrintableProduct[] = [
  {
    id: 'p1-routine-cards',
    num: '01',
    title: 'Visual Routine Cards for Kids',
    price: '$5.50',
    pages: '7 pages',
    summary: '32 picture cards for morning & evening, 8 blank cards, To-Do/Done strips, and parent/PDA tips.',
    versions: 'US Letter PDF + Mockup ready',
    tags: ['ADHD routine', 'Autism visual aid', 'Velcro routine'],
    status: 'Ready for Etsy',
  },
  {
    id: 'p2-chore-charts',
    num: '02',
    title: 'Chore Charts by Age (Ages 3–13+)',
    price: '$5.00',
    pages: '8 pages',
    summary: 'Age-appropriate lists (3–5, 6–8, 9–12, 13+), 4 weekly picture charts, blank chart & 8-card reward menu.',
    versions: 'Digital Fillable PDF + Print-Friendly PDF',
    tags: ['Habit stacking', 'Body doubling', 'Reward chart'],
    status: 'Ready for Etsy',
  },
  {
    id: 'p3-first-then',
    num: '03',
    title: 'First–Then & Now/Next Board Kit',
    price: '$3.99',
    pages: '6 pages',
    summary: 'First/Then board with 5-star token strip, Now/Next board, 24 picture cards, star tokens & how-to guide.',
    versions: 'Digital Fillable PDF + Print-Friendly PDF',
    tags: ['Transitions', 'Token board', 'Visual support'],
    status: 'Ready for Etsy',
  },
  {
    id: 'p4-calm-corner',
    num: '04',
    title: 'Calm-Down Corner Kit',
    price: '$7.50',
    pages: '7 pages',
    summary: 'Calm Corner sign, 12 feelings cards, 12 sensory coping cards, square breathing poster & "My Calm Plan" sheet.',
    versions: 'Digital Fillable PDF + Print-Friendly PDF',
    tags: ['Emotional regulation', 'Sensory', 'SEL printable'],
    status: 'Ready for Etsy',
  },
  {
    id: 'p5-family-planner',
    num: '05',
    title: 'Weekly Family & Meal Planner',
    price: '$3.50',
    pages: '6 pages',
    summary: 'Week-at-a-glance (who/where/drives), meal & snack planner, sorted grocery list, ADHD brain dump & top-3 box.',
    versions: 'Digital Fillable PDF + Print-Friendly PDF',
    tags: ['Command center', 'ADHD planner', 'Menu planner'],
    status: 'Ready for Etsy',
  },
  {
    id: 'p6-mirror-math',
    num: '06',
    title: 'Mirror Math Games (Digital Download)',
    price: '$4.00',
    pages: 'Offline HTML + PDF guide',
    summary: '5 calm modes: Little Adders, Mirror Easy/Harder (12×21 patterns), Step-by-Step area model & Factorials.',
    versions: 'Offline interactive ZIP + instruction PDF',
    tags: ['2e learner', 'Gifted homeschool', 'No-timer math'],
    status: 'Ready for Etsy',
  },
  {
    id: 'p7-shop-bundle',
    num: '★',
    title: 'Whole-Shop Bundle (Kits 1–6)',
    price: '$19.99',
    pages: '~30% bundle savings',
    summary: 'All 6 Sparrow & Sprocket printable kits + digital Mirror Math game packaged together.',
    versions: 'Complete bundle',
    tags: ['Bundle', 'Neurodivergent family kit'],
    status: 'Ready for Etsy',
  },
  {
    id: 'bilingual-bramblewood',
    num: 'ES',
    title: 'Los Amigos de Bramblewood (Spanish & Bilingual Kits)',
    price: 'Catalog / ETSY',
    pages: 'Books + Posters + Coloring + Feelings Fair',
    summary: 'Bilingual Mega Bundle, Spanish Activity Workbooks, Classroom Posters (8.5×11 & 11×14), Tarjetas de Sentimientos & Coloring Books.',
    versions: 'Stored in Google Drive (Printables & Bramblewood zips)',
    tags: ['Bilingual', 'Spanish SEL', 'Feelings Fair'],
    status: 'Draft',
  },
];

export const DRIVE_BOOK_RESOURCES = [
  {
    label: 'Bramblewood Friends: Book Approval Tracker',
    url: 'https://docs.google.com/spreadsheets/d/186NIe3QarbCq4HPstQ6UDc1JCG6B39vnuPqjE9qQsKs/edit',
  },
  {
    label: 'Printables Folder (Sparrow & Sprocket)',
    url: 'https://drive.google.com/drive/folders/1FmsE2r_S379kJkQYRdekYyk5r3mW0sEm',
  },
];
