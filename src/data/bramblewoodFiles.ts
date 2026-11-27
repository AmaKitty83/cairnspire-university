export type BookFileKind =
  | 'ebook-pdf'
  | 'print-pdf'
  | 'cover-pdf'
  | 'spanish-pdf'
  | 'manuscript-doc'
  | 'activity-pdf'
  | 'reference'
  | 'bundle-zip'
  | 'folder';

export interface BookDriveFile {
  id: string;
  bookNum: number;
  label: string;
  fileName: string;
  driveId: string;
  kind: BookFileKind;
  mimeType: string;
  language?: 'EN' | 'ES' | 'Bilingual';
  notes?: string;
}

export const BRAMBLEWOOD_DRIVE_FOLDER_ID = '1w8uC_46l6jApqMwpYrnRxGIdrX2nxo-H';

export function getDriveEmbedUrl(file: Pick<BookDriveFile, 'driveId' | 'mimeType'>): string {
  if (file.mimeType === 'application/vnd.google-apps.document') {
    return `https://docs.google.com/document/d/${file.driveId}/preview`;
  }
  if (file.mimeType === 'application/vnd.google-apps.spreadsheet') {
    return `https://docs.google.com/spreadsheets/d/${file.driveId}/preview`;
  }
  if (file.mimeType === 'application/vnd.google-apps.folder') {
    return `https://drive.google.com/embeddedfolderview?id=${file.driveId}#grid`;
  }
  return `https://drive.google.com/file/d/${file.driveId}/preview`;
}

export function getDriveOpenUrl(file: Pick<BookDriveFile, 'driveId' | 'mimeType'>): string {
  if (file.mimeType === 'application/vnd.google-apps.document') {
    return `https://docs.google.com/document/d/${file.driveId}/edit`;
  }
  if (file.mimeType === 'application/vnd.google-apps.spreadsheet') {
    return `https://docs.google.com/spreadsheets/d/${file.driveId}/edit`;
  }
  if (file.mimeType === 'application/vnd.google-apps.folder') {
    return `https://drive.google.com/drive/folders/${file.driveId}`;
  }
  return `https://drive.google.com/file/d/${file.driveId}/view`;
}

export function getDriveDownloadUrl(driveId: string): string {
  return `https://drive.google.com/uc?export=download&id=${driveId}`;
}

export function getDriveThumbUrl(driveId: string, width = 480): string {
  return `https://drive.google.com/thumbnail?id=${driveId}&sz=w${width}`;
}

export function parseDriveIdFromUrl(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /\/document\/d\/([a-zA-Z0-9_-]+)/,
    /\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/,
    /\/folders\/([a-zA-Z0-9_-]+)/,
    /[?&]id=([a-zA-Z0-9_-]+)/,
  ];
  for (const re of patterns) {
    const m = re.exec(s);
    if (m?.[1]) return m[1];
  }
  if (/^[a-zA-Z0-9_-]{20,}$/.test(s)) {
    return s;
  }
  return null;
}

export function getBookFileIcon(kind: BookFileKind): string {
  switch (kind) {
    case 'ebook-pdf':
      return '📖';
    case 'print-pdf':
      return '🖨️';
    case 'cover-pdf':
      return '🎨';
    case 'spanish-pdf':
      return '🌎';
    case 'manuscript-doc':
      return '📝';
    case 'activity-pdf':
      return '🖍️';
    case 'reference':
      return '🖼️';
    case 'bundle-zip':
      return '📦';
    case 'folder':
      return '📁';
  }
}

export const INITIAL_BOOK_FILES: BookDriveFile[] = [
  // Book 1: Milo's Zoom Brain
  {
    id: 'b1-ebook',
    bookNum: 1,
    label: 'Digital Book PDF',
    fileName: 'Milos-Zoom-Brain.pdf',
    driveId: '1yRH95nAwZ7l4iEIsp0KEb4y4MQBHt4ix',
    kind: 'ebook-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b1-print',
    bookNum: 1,
    label: 'Print Interior 8.5×8.5 Bleed',
    fileName: 'Milos-Zoom-Brain-interior-8.5x8.5-bleed.pdf',
    driveId: '1gunD05V-av7AEjErHl3HOT5XwVrkhBP7',
    kind: 'print-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b1-cover',
    bookNum: 1,
    label: 'Front Cover PDF',
    fileName: 'Milos-Zoom-Brain-front-cover.pdf',
    driveId: '1B7C0zqNTql7j5qcoqGQiwvRBiFYT7qH6',
    kind: 'cover-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b1-v2',
    bookNum: 1,
    label: 'Interior v2 Fixed (s02–s09)',
    fileName: 'Milos-Zoom-Brain-interior-v2-fixed-s02-s09.pdf',
    driveId: '11bdG6LS7_vL5yqns1l27zchJcTijrOcq',
    kind: 'print-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b1-es-print',
    bookNum: 1,
    label: 'Spanish Print Interior',
    fileName: 'El-cerebro-veloz-de-Milo-interior-8.5x8.5-bleed.pdf',
    driveId: '1nhuq7rO_N8ac0OkRugmLlUfCvNcTyMqq',
    kind: 'spanish-pdf',
    mimeType: 'application/pdf',
    language: 'ES',
  },
  {
    id: 'b1-exp-int',
    bookNum: 1,
    label: 'Expanded Edition Mockup 8.25×11',
    fileName: 'Milos-Zoom-Brain-Expanded-Edition-INTERIOR-MOCKUP-8.25x11-bleed.pdf',
    driveId: '1EQ2m9uUNQv6ABN9yTdjJOH54E4ez8XNW',
    kind: 'print-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b1-exp-cov',
    bookNum: 1,
    label: 'Expanded Hardcover Rough',
    fileName: 'Milos-Zoom-Brain-Expanded-HARDCOVER-COVER-ROUGH.pdf',
    driveId: '1zxdZ5VkJmJOauCA6fC0cVMBqvaGGf4me',
    kind: 'cover-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b1-ref',
    bookNum: 1,
    label: 'Milo Character Turnaround',
    fileName: 'REF - Milo turnaround.jpg',
    driveId: '128_n3IjMx-Fb6-5bLrKveJWS6uK_Zxkr',
    kind: 'reference',
    mimeType: 'image/jpeg',
    language: 'EN',
  },

  // Book 2: Juni's Quiet Shell
  {
    id: 'b2-ebook',
    bookNum: 2,
    label: 'Digital Book PDF',
    fileName: 'Junis-Quiet-Shell.pdf',
    driveId: '1MDn4yxCrftBFlkkuUq-aoSUBUv9vxNm5',
    kind: 'ebook-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b2-print',
    bookNum: 2,
    label: 'Print Interior 8.5×8.5 Bleed',
    fileName: 'Junis-Quiet-Shell-interior-8.5x8.5-bleed.pdf',
    driveId: '1D5GLQBXu-nPgTAxBnPZseCFeCvyOb_bl',
    kind: 'print-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b2-cover',
    bookNum: 2,
    label: 'Front Cover PDF',
    fileName: 'Junis-Quiet-Shell-front-cover.pdf',
    driveId: '1HT-njsL_MPFDVNGzH4Au9hSHHSJJ-KHD',
    kind: 'cover-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b2-doc',
    bookNum: 2,
    label: 'Manuscript (Google Doc)',
    fileName: 'Book 2 - Junis Quiet Shell - Manuscript',
    driveId: '16QiZAGlaZqK8dto7ubE5IJ0hUaB8ok-j_-prA04q0OQ',
    kind: 'manuscript-doc',
    mimeType: 'application/vnd.google-apps.document',
    language: 'EN',
  },

  // Book 3: Rafi and the Wiggly Words
  {
    id: 'b3-ebook',
    bookNum: 3,
    label: 'Digital Book PDF',
    fileName: 'Rafi-and-the-Wiggly-Words.pdf',
    driveId: '1kbkDe-oruwRGkQVeK3Px1d7Wk77H_2lv',
    kind: 'ebook-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b3-print',
    bookNum: 3,
    label: 'Print Interior 8.5×8.5 Bleed',
    fileName: 'Rafi-and-the-Wiggly-Words-interior-8.5x8.5-bleed.pdf',
    driveId: '1MMYuGJ56wFe4irWAPhRimBpvq5LTGnVx',
    kind: 'print-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b3-cover',
    bookNum: 3,
    label: 'Front Cover PDF',
    fileName: 'Rafi-and-the-Wiggly-Words-front-cover.pdf',
    driveId: '1TLhi1ekp2CXNpN9Z7E_NvRoJAlvQzkQA',
    kind: 'cover-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b3-doc',
    bookNum: 3,
    label: 'Manuscript (Google Doc)',
    fileName: 'Rafi and the Wiggly Words - Manuscript (Book 3)',
    driveId: '11k0pv8ZiJdcNrwKSQdBsTwlYxv2n-hfXPJkh8rl5CHo',
    kind: 'manuscript-doc',
    mimeType: 'application/vnd.google-apps.document',
    language: 'EN',
  },

  // Book 4: Kai's Two-Speed Engine
  {
    id: 'b4-ebook',
    bookNum: 4,
    label: 'Digital Book PDF',
    fileName: 'Kais-Two-Speed-Engine.pdf',
    driveId: '1P2h_O7QRYnC_A7kEA7rdUDW9IIXTXhwS',
    kind: 'ebook-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b4-print',
    bookNum: 4,
    label: 'Print Interior 8.5×8.5 Bleed',
    fileName: 'Kais-Two-Speed-Engine-interior-8.5x8.5-bleed.pdf',
    driveId: '1ItovqxnQSCXH8CJMtA6Obza-w0yQvkOA',
    kind: 'print-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b4-cover',
    bookNum: 4,
    label: 'Front Cover PDF',
    fileName: 'Kais-Two-Speed-Engine-front-cover.pdf',
    driveId: '1QXg2bmiowvR_yX-HacWJIpmLmnE7Lkjs',
    kind: 'cover-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b4-doc',
    bookNum: 4,
    label: 'Manuscript (Google Doc)',
    fileName: "Book 4 - Kai's Two-Speed Engine - Manuscript",
    driveId: '1BlmYi8t-AhcD6NLRlQh7_IFry5h-vV9bLDAqSs9IHVo',
    kind: 'manuscript-doc',
    mimeType: 'application/vnd.google-apps.document',
    language: 'EN',
  },

  // Book 5: Priya and the Sticky Thoughts
  {
    id: 'b5-ebook',
    bookNum: 5,
    label: 'Digital Book PDF',
    fileName: 'Priya-and-the-Sticky-Thoughts.pdf',
    driveId: '1_clsKttiWU-5O_5c-9MmfFoRyqbowu5d',
    kind: 'ebook-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b5-print',
    bookNum: 5,
    label: 'Print Interior 8.5×8.5 Bleed',
    fileName: 'Priya-and-the-Sticky-Thoughts-interior-8.5x8.5-bleed.pdf',
    driveId: '1mpE_mnjnLOMcde9GcUKAEDjM_aiWjUhF',
    kind: 'print-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b5-cover',
    bookNum: 5,
    label: 'Front Cover PDF',
    fileName: 'Priya-and-the-Sticky-Thoughts-front-cover.pdf',
    driveId: '1YpjN1r3is6O-7zfR1M0wxFQLy4Kai5jn',
    kind: 'cover-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b5-es-ebook',
    bookNum: 5,
    label: 'Spanish Digital Book',
    fileName: 'Priya-y-los-pensamientos-pegajosos.pdf',
    driveId: '1spReNzHT2RD_CTOdWklPpDLKf0P5soQj',
    kind: 'spanish-pdf',
    mimeType: 'application/pdf',
    language: 'ES',
  },
  {
    id: 'b5-es-print',
    bookNum: 5,
    label: 'Spanish Print Interior',
    fileName: 'Priya-y-los-pensamientos-pegajosos-interior-8.5x8.5-bleed.pdf',
    driveId: '1X6So4mWxsVkEvrdsv27YRmB-1qkF793V',
    kind: 'spanish-pdf',
    mimeType: 'application/pdf',
    language: 'ES',
  },
  {
    id: 'b5-es-act',
    bookNum: 5,
    label: 'Spanish Activity Workbook',
    fileName: 'Priya-y-los-pensamientos-pegajosos-Cuaderno-de-Actividades.pdf',
    driveId: '1yVOmd_ZY-ejHLCSd-L1S0iJlm6lMFqVm',
    kind: 'activity-pdf',
    mimeType: 'application/pdf',
    language: 'ES',
  },
  {
    id: 'b5-doc',
    bookNum: 5,
    label: 'Manuscript (Google Doc)',
    fileName: 'Book 5 Manuscript - Priya and the Sticky Thoughts',
    driveId: '1ENRlMnBKsCmHlAzkQudSD4LeP6th-PgfQ1A7IsJOalE',
    kind: 'manuscript-doc',
    mimeType: 'application/vnd.google-apps.document',
    language: 'EN',
  },

  // Book 6: Rosie and Pip Feel Brave
  {
    id: 'b6-ebook',
    bookNum: 6,
    label: 'Digital Book PDF',
    fileName: 'Rosie-and-Pip-Feel-Brave.pdf',
    driveId: '1rIk0pGBbzDrYSOza0wWBDIuUxGJfXg9w',
    kind: 'ebook-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b6-print',
    bookNum: 6,
    label: 'Print Interior 8.5×8.5 Bleed',
    fileName: 'Rosie-and-Pip-Feel-Brave-interior-8.5x8.5-bleed.pdf',
    driveId: '1c35zJAL7VEPfOK8dSLEX7t5gGyNXkW_A',
    kind: 'print-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b6-cover',
    bookNum: 6,
    label: 'Front Cover PDF',
    fileName: 'Rosie-and-Pip-Feel-Brave-front-cover.pdf',
    driveId: '1fEvmoQEFkBrZrtogN4cuwwEyAZL59Z1I',
    kind: 'cover-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b6-doc',
    bookNum: 6,
    label: 'Manuscript (Google Doc)',
    fileName: 'Book 6 Manuscript - Rosie and Pip Feel Brave',
    driveId: '1y_T2hhdTGRCe3EzNLW4OxVWazhp-LoTsEyclo_V5jq4',
    kind: 'manuscript-doc',
    mimeType: 'application/vnd.google-apps.document',
    language: 'EN',
  },

  // Book 7: The Gray Cloud Over Teo's House
  {
    id: 'b7-ebook',
    bookNum: 7,
    label: 'Digital Book PDF',
    fileName: 'The-Gray-Cloud-Over-Teos-House.pdf',
    driveId: '1lk3DCLKe_cHX3Z_i9aPI5maBxM6BIZIw',
    kind: 'ebook-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b7-print',
    bookNum: 7,
    label: 'Print Interior 8.5×8.5 Bleed',
    fileName: 'The-Gray-Cloud-Over-Teos-House-interior-8.5x8.5-bleed.pdf',
    driveId: '1kcaWYkr29q088wgdVzvR1jeSIz6i_pjQ',
    kind: 'print-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b7-cover',
    bookNum: 7,
    label: 'Front Cover PDF',
    fileName: 'The-Gray-Cloud-Over-Teos-House-front-cover.pdf',
    driveId: '1GjszdpWZtjqON6lLKdAdhL3nTtkrj45T',
    kind: 'cover-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b7-doc',
    bookNum: 7,
    label: 'Manuscript (Google Doc)',
    fileName: "Book 7 - The Gray Cloud Over Teo's House - Manuscript",
    driveId: '1p2920OioTZlTy68NJoWu7Gr7Ooy2JgU3Pm5Rks5YWhk',
    kind: 'manuscript-doc',
    mimeType: 'application/vnd.google-apps.document',
    language: 'EN',
  },

  // Book 8: Sam's Own Steps
  {
    id: 'b8-ebook',
    bookNum: 8,
    label: 'Digital Book PDF',
    fileName: 'Sams-Own-Steps.pdf',
    driveId: '1z1hbZmbDi9FDEk8-CqXArwps16wBopBi',
    kind: 'ebook-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b8-print',
    bookNum: 8,
    label: 'Print Interior 8.5×8.5 Bleed',
    fileName: 'Sams-Own-Steps-interior-8.5x8.5-bleed.pdf',
    driveId: '12S4aTJx0xjOvgfPIEqeYEpKm9TFxEgCW',
    kind: 'print-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b8-cover',
    bookNum: 8,
    label: 'Front Cover PDF',
    fileName: 'Sams-Own-Steps-front-cover.pdf',
    driveId: '1fMNx_e1GNdvNy6b9VCoqImL6HrvJjL8H',
    kind: 'cover-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b8-doc',
    bookNum: 8,
    label: 'Manuscript (Google Doc)',
    fileName: "Book 8 - Sam's Own Steps - Manuscript",
    driveId: '1lFIdXepFyiGTZyCNW7wOzEvDMNR-zf8WD4EIOzYFzxc',
    kind: 'manuscript-doc',
    mimeType: 'application/vnd.google-apps.document',
    language: 'EN',
  },

  // Book 9: The Big Bramblewood Feelings Fair
  {
    id: 'b9-ebook',
    bookNum: 9,
    label: 'Digital Book PDF',
    fileName: 'The-Big-Bramblewood-Feelings-Fair.pdf',
    driveId: '15zMhyaxbsT5KPABqe2r8WFnSpaGMOI0u',
    kind: 'ebook-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b9-print',
    bookNum: 9,
    label: 'Print Interior 8.5×8.5 Bleed',
    fileName: 'The-Big-Bramblewood-Feelings-Fair-interior-8.5x8.5-bleed.pdf',
    driveId: '1B7rw7fvxy7s11WqwiN16bvd0FC_I6wA-',
    kind: 'print-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b9-cover',
    bookNum: 9,
    label: 'Front Cover PDF',
    fileName: 'The-Big-Bramblewood-Feelings-Fair-front-cover.pdf',
    driveId: '1hN05XoWPU8UrLGQ0sMEMTgVE0TDcxbVV',
    kind: 'cover-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 'b9-es-ebook',
    bookNum: 9,
    label: 'Spanish Digital Book',
    fileName: 'La-gran-feria-de-los-sentimientos.pdf',
    driveId: '10XSZPI1h3MpEr82ghdJz3mfALMiNQbXA',
    kind: 'spanish-pdf',
    mimeType: 'application/pdf',
    language: 'ES',
  },
  {
    id: 'b9-es-print',
    bookNum: 9,
    label: 'Spanish Print Interior',
    fileName: 'La-gran-feria-de-los-sentimientos-interior-8.5x8.5-bleed.pdf',
    driveId: '1tiJcN3Sxh65Oxq9qY1DaziBk_VWriLtG',
    kind: 'spanish-pdf',
    mimeType: 'application/pdf',
    language: 'ES',
  },
  {
    id: 'b9-doc',
    bookNum: 9,
    label: 'Manuscript (Google Doc)',
    fileName: 'Book 9 - The Big Bramblewood Feelings Fair - Manuscript',
    driveId: '1XoQN9_3ymBr3Mxzzmh2Xq2rzccm2I945ElcFb-3L83I',
    kind: 'manuscript-doc',
    mimeType: 'application/vnd.google-apps.document',
    language: 'EN',
  },

  // Series-Wide Guides, Character Art & Companions (bookNum: 0)
  {
    id: 's-bible-v5',
    bookNum: 0,
    label: 'Series Bible v5 (Books 1–9)',
    fileName: 'Bramblewood Series Bible v5 (Books 1-9)',
    driveId: '1chPy4jk1vtgdXrEH6dyNLd-XYJTGIhuhpknV2bQj0cg',
    kind: 'manuscript-doc',
    mimeType: 'application/vnd.google-apps.document',
    language: 'EN',
  },
  {
    id: 's-turnarounds-v2',
    bookNum: 0,
    label: 'Character Turnarounds v2 PDF',
    fileName: 'Bramblewood-character-turnarounds-v2.pdf',
    driveId: '1xZ_BHP7UrGIF_SbqCk0yEO6wngeyoepk',
    kind: 'reference',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 's-lineup',
    bookNum: 0,
    label: 'Character Lineup Reference',
    fileName: 'REF - character lineup.jpg',
    driveId: '1QVNa90OTAsZ4d7w8Ns0bT4CVoooh9-fa',
    kind: 'reference',
    mimeType: 'image/jpeg',
    language: 'EN',
  },
  {
    id: 's-parent-guide',
    bookNum: 0,
    label: 'Parent & Teacher Guide PDF',
    fileName: 'Bramblewood-Parent-Teacher-Guide.pdf',
    driveId: '1OO36DoscnQN093CNcFAwZluAG6PJ2IkU',
    kind: 'activity-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 's-coloring-en',
    bookNum: 0,
    label: 'Coloring Book (12 pages, EN)',
    fileName: 'Bramblewood-Coloring-Book-12-pages.pdf',
    driveId: '1lJuMlJDJ5HDLqlV_JnnUGgiAWx9vk473',
    kind: 'activity-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 's-coloring-es',
    bookNum: 0,
    label: 'Libro para Colorear (12 pages, ES)',
    fileName: 'Bramblewood-Libro-para-Colorear-12-paginas.pdf',
    driveId: '1QNmteBirHhAPRG3fISh8mJHyek3L4jtY',
    kind: 'activity-pdf',
    mimeType: 'application/pdf',
    language: 'ES',
  },
  {
    id: 's-cards-en',
    bookNum: 0,
    label: 'Feelings & Sensory Cards (18, EN)',
    fileName: 'Bramblewood-Feelings-Sensory-Cards-18.pdf',
    driveId: '1vCP_DnRMOBF9N4zrgnqDBsGuDEt91gX2',
    kind: 'activity-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 's-cards-es',
    bookNum: 0,
    label: 'Tarjetas de Sentimientos (18, ES)',
    fileName: 'Bramblewood-Tarjetas-de-Sentimientos-18.pdf',
    driveId: '16uRW2rRK7k4_1Ge1rc9GpqwTvC3JzQPf',
    kind: 'activity-pdf',
    mimeType: 'application/pdf',
    language: 'ES',
  },
  {
    id: 's-posters-en-letter',
    bookNum: 0,
    label: 'Classroom Posters 8.5×11 (EN)',
    fileName: 'Bramblewood-Classroom-Posters-8.5x11.pdf',
    driveId: '1irXrKPNnHhH4rmvnDM5Y1DtvBzgc5v3G',
    kind: 'activity-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 's-posters-en-11x17',
    bookNum: 0,
    label: 'Classroom Posters 11×17 (EN)',
    fileName: 'Bramblewood-Classroom-Posters-11x17.pdf',
    driveId: '1fcbd9m08Z0ew-lorzSdwEFNy8x80CWIc',
    kind: 'activity-pdf',
    mimeType: 'application/pdf',
    language: 'EN',
  },
  {
    id: 's-posters-es-letter',
    bookNum: 0,
    label: 'Carteles para el Salón 8.5×11 (ES)',
    fileName: 'Bramblewood-Carteles-para-el-Salon-8.5x11.pdf',
    driveId: '1j5mBokujGxMOphki1DROslRQcy5e7Qc5',
    kind: 'activity-pdf',
    mimeType: 'application/pdf',
    language: 'ES',
  },
  {
    id: 's-posters-es-11x17',
    bookNum: 0,
    label: 'Carteles para el Salón 11×17 (ES)',
    fileName: 'Bramblewood-Carteles-para-el-Salon-11x17.pdf',
    driveId: '1EPWd_JOe-ywUsFYzOooHcvnlP6OVgOED',
    kind: 'activity-pdf',
    mimeType: 'application/pdf',
    language: 'ES',
  },
  {
    id: 's-kdp-boxset',
    bookNum: 0,
    label: 'KDP Box-Set Plan Doc',
    fileName: 'Bramblewood KDP Box-Set Plan',
    driveId: '1qKDxkH48ouQIHeV-kW88WMSJDG-aaj9_pZVh4tdBq4o',
    kind: 'manuscript-doc',
    mimeType: 'application/vnd.google-apps.document',
    language: 'EN',
  },
  {
    id: 's-act-all-en',
    bookNum: 0,
    label: 'All 9 Activity Packs (EN ZIP)',
    fileName: 'Bramblewood-Activity-Packs-All-9.zip',
    driveId: '1w-CrziPp5dtOsSVZ28y9toG0AE28SqDb',
    kind: 'bundle-zip',
    mimeType: 'application/zip',
    language: 'EN',
  },
  {
    id: 's-act-all-es',
    bookNum: 0,
    label: 'Cuadernos de Actividades (ES ZIP)',
    fileName: 'Bramblewood-ES-Cuadernos-de-Actividades.zip',
    driveId: '1lTuDoDW1mSE3yWAOHMNzfYttas9pe_Ha',
    kind: 'bundle-zip',
    mimeType: 'application/zip',
    language: 'ES',
  },
  {
    id: 's-es-etsy-zip',
    bookNum: 0,
    label: 'Los Amigos de Bramblewood Spanish Etsy Pack (ZIP)',
    fileName: 'Los-Amigos-de-Bramblewood-Spanish-Etsy.zip',
    driveId: '1h3Kh9RiXpOocb6AOHPiQ1J3vrWuuCASt',
    kind: 'bundle-zip',
    mimeType: 'application/zip',
    language: 'ES',
  },
  {
    id: 's-cover-grid',
    bookNum: 0,
    label: 'Series 9-Book Cover Grid Mockup',
    fileName: '01-cover-grid (fixed).jpg',
    driveId: '1gIxHRpglUNmoszAf-0S86tI5VOfEYa-W',
    kind: 'reference',
    mimeType: 'image/jpeg',
    language: 'EN',
  },
];

export const PRINTABLE_DRIVE_FILES: Record<string, BookDriveFile[]> = {
  'p1-routine-cards': [
    {
      id: 'pr1-pdf',
      bookNum: 0,
      label: 'Preview PDF',
      fileName: '01-Visual-Routine-Cards.pdf',
      driveId: '1Tm_aAef_JJh1NLzI_8bX6cNqp0PWrwU0',
      kind: 'activity-pdf',
      mimeType: 'application/pdf',
      language: 'EN',
    },
    {
      id: 'pr1-mockup',
      bookNum: 0,
      label: 'View Mockup',
      fileName: '01-Visual-Routine-Cards-mockup.png',
      driveId: '1qVTB2VWTEbhGgPAeUnUA5GIg8AHtboG5',
      kind: 'reference',
      mimeType: 'image/png',
      language: 'EN',
    },
  ],
  'p2-chore-charts': [
    {
      id: 'pr2-fillable',
      bookNum: 0,
      label: 'Fillable PDF',
      fileName: '02-Chore-Charts-By-Age-Digital-Fillable-Letter.pdf',
      driveId: '11C6DYKXPwc6bq0UluaO9Dau-urnp7_Lx',
      kind: 'activity-pdf',
      mimeType: 'application/pdf',
      language: 'EN',
    },
    {
      id: 'pr2-print',
      bookNum: 0,
      label: 'Print PDF',
      fileName: '02-Chore-Charts-By-Age-Print-Friendly-Letter.pdf',
      driveId: '1ppbiBcAj9VOB9MFcUrvJbhfMT_GkR7aM',
      kind: 'activity-pdf',
      mimeType: 'application/pdf',
      language: 'EN',
    },
    {
      id: 'pr2-mockup',
      bookNum: 0,
      label: 'View Mockup',
      fileName: '02-Chore-Charts-By-Age-mockup.png',
      driveId: '1dOEBBsU3WfBRHNv_tFoYMzUlml5i6ru6',
      kind: 'reference',
      mimeType: 'image/png',
      language: 'EN',
    },
  ],
  'p3-first-then': [
    {
      id: 'pr3-fillable',
      bookNum: 0,
      label: 'Fillable PDF',
      fileName: '03-First-Then-Board-Kit-Digital-Fillable-Letter.pdf',
      driveId: '1u2HA-cpMiXEXLI6sXgrCRYrIBOhLCd5T',
      kind: 'activity-pdf',
      mimeType: 'application/pdf',
      language: 'EN',
    },
    {
      id: 'pr3-print',
      bookNum: 0,
      label: 'Print PDF',
      fileName: '03-First-Then-Board-Kit-Print-Friendly-Letter.pdf',
      driveId: '1ykEdveO9MU0bi_S6rknuxhHWtU9MyWMp',
      kind: 'activity-pdf',
      mimeType: 'application/pdf',
      language: 'EN',
    },
    {
      id: 'pr3-mockup',
      bookNum: 0,
      label: 'View Mockup',
      fileName: '03-First-Then-Board-Kit-mockup.png',
      driveId: '13mVX5svbtQ1j-AvRAnGo4IA0C7M2JKAY',
      kind: 'reference',
      mimeType: 'image/png',
      language: 'EN',
    },
  ],
  'p4-calm-corner': [
    {
      id: 'pr4-fillable',
      bookNum: 0,
      label: 'Fillable PDF',
      fileName: '04-Calm-Down-Corner-Kit-Digital-Fillable-Letter.pdf',
      driveId: '1IOIcK0avgV9RnmYYx_tc7-qIPTjxjw9T',
      kind: 'activity-pdf',
      mimeType: 'application/pdf',
      language: 'EN',
    },
    {
      id: 'pr4-print',
      bookNum: 0,
      label: 'Print PDF',
      fileName: '04-Calm-Down-Corner-Kit-Print-Friendly-Letter.pdf',
      driveId: '14dXLq8uJrCertwDHeE9fk3fLJB4xelRg',
      kind: 'activity-pdf',
      mimeType: 'application/pdf',
      language: 'EN',
    },
    {
      id: 'pr4-mockup',
      bookNum: 0,
      label: 'View Mockup',
      fileName: '04-Calm-Down-Corner-Kit-mockup.png',
      driveId: '1WukvUbadsW-g4HVttMX7u2IyHHPxvlR1',
      kind: 'reference',
      mimeType: 'image/png',
      language: 'EN',
    },
  ],
  'p5-family-planner': [
    {
      id: 'pr5-fillable',
      bookNum: 0,
      label: 'Fillable PDF',
      fileName: '05-Family-Week-And-Meal-Planner-Digital-Fillable-Letter.pdf',
      driveId: '15MLe-Q8SI5IWr1ehEVESmjcBZV7NdOac',
      kind: 'activity-pdf',
      mimeType: 'application/pdf',
      language: 'EN',
    },
    {
      id: 'pr5-print',
      bookNum: 0,
      label: 'Print PDF',
      fileName: '05-Family-Week-And-Meal-Planner-Print-Friendly-Letter.pdf',
      driveId: '1xM6j8mZeiCQ42piWgqLduzAbwLhaWyim',
      kind: 'activity-pdf',
      mimeType: 'application/pdf',
      language: 'EN',
    },
    {
      id: 'pr5-mockup',
      bookNum: 0,
      label: 'View Mockup',
      fileName: '05-Family-Week-And-Meal-Planner-mockup.png',
      driveId: '1Euwaw7et18uLzL8kMh4SdsJ3d544RaiW',
      kind: 'reference',
      mimeType: 'image/png',
      language: 'EN',
    },
  ],
  'p6-mirror-math': [
    {
      id: 'pr6-mockup',
      bookNum: 0,
      label: 'View Mockup',
      fileName: '06-Mirror-Math-Games-mockup.png',
      driveId: '1T2TVqTB2D1G9lJnNhcchGmG9RXWM67Hz',
      kind: 'reference',
      mimeType: 'image/png',
      language: 'EN',
    },
    {
      id: 'pr6-zip',
      bookNum: 0,
      label: 'Offline Game ZIP',
      fileName: '06-Mirror-Math-Games.zip',
      driveId: '1qi_QKOwBwSRGkObHXXco1CmrsyCki3bS',
      kind: 'bundle-zip',
      mimeType: 'application/zip',
      language: 'EN',
    },
  ],
  'bilingual-bramblewood': [
    {
      id: 'prb-etsy-zip',
      bookNum: 0,
      label: 'Spanish Etsy ZIP',
      fileName: 'Los-Amigos-de-Bramblewood-Spanish-Etsy.zip',
      driveId: '1h3Kh9RiXpOocb6AOHPiQ1J3vrWuuCASt',
      kind: 'bundle-zip',
      mimeType: 'application/zip',
      language: 'ES',
    },
    {
      id: 'prb-coloring',
      bookNum: 0,
      label: 'Libro para Colorear PDF',
      fileName: 'Bramblewood-Libro-para-Colorear-12-paginas.pdf',
      driveId: '1QNmteBirHhAPRG3fISh8mJHyek3L4jtY',
      kind: 'activity-pdf',
      mimeType: 'application/pdf',
      language: 'ES',
    },
    {
      id: 'prb-cards',
      bookNum: 0,
      label: 'Tarjetas de Sentimientos PDF',
      fileName: 'Bramblewood-Tarjetas-de-Sentimientos-18.pdf',
      driveId: '16uRW2rRK7k4_1Ge1rc9GpqwTvC3JzQPf',
      kind: 'activity-pdf',
      mimeType: 'application/pdf',
      language: 'ES',
    },
  ],
};
