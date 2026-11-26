import { doc, onSnapshot, serverTimestamp, setDoc, type Unsubscribe } from 'firebase/firestore';
import { auth, db } from '../firebase';
import {
  INITIAL_BRAMBLEWOOD_BOOKS,
  INITIAL_PRINTABLES_CATALOG,
  type BramblewoodBook,
  type PrintableProduct,
} from '../data/bramblewoodData';

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
      cb(Array.isArray(d.items) && d.items.length ? d.items : INITIAL_PRINTABLES_CATALOG);
    },
    (err) => onError?.(err)
  );
}

export async function saveBramblewoodBooks(
  books: BramblewoodBook[],
  actorEmail: string
): Promise<void> {
  const email = (actorEmail || auth.currentUser?.email || '').trim().toLowerCase();
  await setDoc(doc(db, 'campus_books', 'bramblewood_series'), {
    books,
    updatedAt: serverTimestamp(),
    updatedBy: email,
  });
}

export async function savePrintablesCatalog(
  items: PrintableProduct[],
  actorEmail: string
): Promise<void> {
  const email = (actorEmail || auth.currentUser?.email || '').trim().toLowerCase();
  await setDoc(doc(db, 'campus_books', 'printables_catalog'), {
    items,
    updatedAt: serverTimestamp(),
    updatedBy: email,
  });
}
