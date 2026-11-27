import { doc, onSnapshot, serverTimestamp, setDoc, type Unsubscribe } from 'firebase/firestore';
import { auth, db } from '../firebase';
import {
  INITIAL_AGENT_TASKS,
  INITIAL_BRAMBLEWOOD_BOOKS,
  INITIAL_CHARACTER_BIBLE,
  INITIAL_PRINTABLES_CATALOG,
  type BramblewoodAgentTask,
  type BramblewoodBook,
  type BramblewoodCharacter,
  type PrintableProduct,
} from '../data/bramblewoodData';
import {
  INITIAL_BRAMBLEWOOD_SPREADS,
  type BramblewoodSpreadItem,
} from '../data/bramblewoodSpreads';
import {
  INITIAL_BOOK_FILES,
  type BookDriveFile,
} from '../data/bramblewoodFiles';

function cleanActor(actorEmail: string): string {
  return (actorEmail || auth.currentUser?.email || '').trim().toLowerCase();
}

export function subscribeBramblewoodBooks(
  cb: (books: BramblewoodBook[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'campus_books', 'bramblewood_series'),
    (snap) => {
      if (!snap.exists()) return cb(INITIAL_BRAMBLEWOOD_BOOKS);
      const d = snap.data() as { books?: BramblewoodBook[] };
      cb(Array.isArray(d.books) && d.books.length ? d.books : INITIAL_BRAMBLEWOOD_BOOKS);
    },
    (err) => onError?.(err)
  );
}

export function subscribePrintablesCatalog(
  cb: (items: PrintableProduct[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'campus_books', 'printables_catalog'),
    (snap) => {
      if (!snap.exists()) return cb(INITIAL_PRINTABLES_CATALOG);
      const d = snap.data() as { items?: PrintableProduct[] };
      if (!Array.isArray(d.items) || !d.items.length) return cb(INITIAL_PRINTABLES_CATALOG);
      // Enrich older saved items with starter copy/checklists if missing
      const starterMap = new Map(INITIAL_PRINTABLES_CATALOG.map((x) => [x.id, x]));
      cb(
        d.items.map((item) => {
          const base = starterMap.get(item.id);
          return {
            ...base,
            ...item,
            listingTitle: item.listingTitle ?? base?.listingTitle,
            listingDescription: item.listingDescription ?? base?.listingDescription,
            checklist: item.checklist ?? base?.checklist,
          };
        })
      );
    },
    (err) => onError?.(err)
  );
}

export function subscribeBramblewoodSpreads(
  cb: (spreads: Record<number, BramblewoodSpreadItem[]>) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'campus_books', 'bramblewood_spreads'),
    (snap) => {
      if (!snap.exists()) return cb(INITIAL_BRAMBLEWOOD_SPREADS);
      const d = snap.data() as { spreadsByBook?: Record<string, BramblewoodSpreadItem[]> };
      if (!d.spreadsByBook) return cb(INITIAL_BRAMBLEWOOD_SPREADS);
      const merged: Record<number, BramblewoodSpreadItem[]> = { ...INITIAL_BRAMBLEWOOD_SPREADS };
      for (const [k, v] of Object.entries(d.spreadsByBook)) {
        const num = Number(k);
        if (num >= 1 && num <= 9 && Array.isArray(v) && v.length) {
          merged[num] = v;
        }
      }
      cb(merged);
    },
    (err) => onError?.(err)
  );
}

export function subscribeCharacterBible(
  cb: (chars: BramblewoodCharacter[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'campus_books', 'character_bible'),
    (snap) => {
      if (!snap.exists()) return cb(INITIAL_CHARACTER_BIBLE);
      const d = snap.data() as { characters?: BramblewoodCharacter[] };
      cb(Array.isArray(d.characters) && d.characters.length ? d.characters : INITIAL_CHARACTER_BIBLE);
    },
    (err) => onError?.(err)
  );
}

export function subscribeAgentTasks(
  cb: (tasks: BramblewoodAgentTask[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'campus_books', 'agent_tasks'),
    (snap) => {
      if (!snap.exists()) return cb(INITIAL_AGENT_TASKS);
      const d = snap.data() as { tasks?: BramblewoodAgentTask[] };
      cb(Array.isArray(d.tasks) ? d.tasks : INITIAL_AGENT_TASKS);
    },
    (err) => onError?.(err)
  );
}

export async function saveBramblewoodBooks(
  books: BramblewoodBook[],
  actorEmail: string
): Promise<void> {
  await setDoc(doc(db, 'campus_books', 'bramblewood_series'), {
    books,
    updatedAt: serverTimestamp(),
    updatedBy: cleanActor(actorEmail),
  });
}

export async function savePrintablesCatalog(
  items: PrintableProduct[],
  actorEmail: string
): Promise<void> {
  await setDoc(doc(db, 'campus_books', 'printables_catalog'), {
    items,
    updatedAt: serverTimestamp(),
    updatedBy: cleanActor(actorEmail),
  });
}

export async function saveBramblewoodSpreads(
  spreadsByBook: Record<number, BramblewoodSpreadItem[]>,
  actorEmail: string
): Promise<void> {
  const stringKeyed: Record<string, BramblewoodSpreadItem[]> = {};
  for (const [k, v] of Object.entries(spreadsByBook)) {
    stringKeyed[String(k)] = v;
  }
  await setDoc(doc(db, 'campus_books', 'bramblewood_spreads'), {
    spreadsByBook: stringKeyed,
    updatedAt: serverTimestamp(),
    updatedBy: cleanActor(actorEmail),
  });
}

export async function saveCharacterBible(
  characters: BramblewoodCharacter[],
  actorEmail: string
): Promise<void> {
  await setDoc(doc(db, 'campus_books', 'character_bible'), {
    characters,
    updatedAt: serverTimestamp(),
    updatedBy: cleanActor(actorEmail),
  });
}

export async function saveAgentTasks(
  tasks: BramblewoodAgentTask[],
  actorEmail: string
): Promise<void> {
  await setDoc(doc(db, 'campus_books', 'agent_tasks'), {
    tasks,
    updatedAt: serverTimestamp(),
    updatedBy: cleanActor(actorEmail),
  });
}

export function subscribeBookFiles(
  cb: (files: BookDriveFile[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'campus_books', 'book_files'),
    (snap) => {
      if (!snap.exists()) return cb(INITIAL_BOOK_FILES);
      const d = snap.data() as { files?: BookDriveFile[] };
      if (!Array.isArray(d.files) || !d.files.length) return cb(INITIAL_BOOK_FILES);
      const byId = new Map<string, BookDriveFile>();
      for (const f of INITIAL_BOOK_FILES) byId.set(f.id, f);
      for (const f of d.files) {
        if (f?.id) byId.set(f.id, f);
      }
      cb(Array.from(byId.values()));
    },
    (err) => onError?.(err)
  );
}

export async function saveBookFiles(
  files: BookDriveFile[],
  actorEmail: string
): Promise<void> {
  await setDoc(doc(db, 'campus_books', 'book_files'), {
    files,
    updatedAt: serverTimestamp(),
    updatedBy: cleanActor(actorEmail),
  });
}
