import { doc, onSnapshot, serverTimestamp, setDoc, type Unsubscribe } from 'firebase/firestore';
import { auth, db } from '../firebase';

export interface QuestResultEntry {
  id: string;
  questId: string;
  problemId: string;
  field: string;
  answer: string;
  match: 'yes' | 'not yet' | 'question' | 'set aside' | 'not checked';
  date: string;
}

export interface ParentGradeEntry {
  grade: '' | 'Secure' | 'Developing' | 'Revisit';
  notes: string;
}

export interface AssessmentResultEntry {
  id: string;
  ts: string;
  date: string;
  subject: 'math' | 'rla' | 'sci' | 'ss';
  itemId: string;
  code: string;
  area: string;
  dok: string | number;
  calculator: boolean;
  level: number;
  answer: string;
  matches: boolean | null;
  parentScored: boolean;
  preview: boolean;
}

export interface GabeConfigDoc {
  activeScienceUnitId: string; // empty if none active
  assessmentEnabled: boolean;
}

export interface SpellingWordsDoc {
  Liam: { weekOf: string; words: string[] };
  Oliver: { weekOf: string; words: string[] };
}

export function subscribeGabeConfig(
  cb: (cfg: GabeConfigDoc) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'home_and_garden', 'gabe_config'),
    (snap) => {
      if (!snap.exists()) return cb({ activeScienceUnitId: '', assessmentEnabled: false });
      const d = snap.data() as Partial<GabeConfigDoc>;
      cb({
        activeScienceUnitId: d.activeScienceUnitId || '',
        assessmentEnabled: Boolean(d.assessmentEnabled),
      });
    },
    (err) => onError?.(err)
  );
}

export function subscribeGabeResults(
  cb: (results: QuestResultEntry[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'home_and_garden', 'gabe_results'),
    (snap) => {
      if (!snap.exists()) return cb([]);
      const d = snap.data() as { results?: QuestResultEntry[] };
      cb(Array.isArray(d.results) ? d.results : []);
    },
    (err) => onError?.(err)
  );
}

export function subscribeGabeAssessment(
  cb: (rows: AssessmentResultEntry[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'home_and_garden', 'gabe_assessment'),
    (snap) => {
      if (!snap.exists()) return cb([]);
      const d = snap.data() as { rows?: AssessmentResultEntry[] };
      cb(Array.isArray(d.rows) ? d.rows : []);
    },
    (err) => onError?.(err)
  );
}

export function subscribeParentGabeGrades(
  cb: (grades: Record<string, ParentGradeEntry>) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'home_and_garden_parents', 'gabe_grades'),
    (snap) => {
      if (!snap.exists()) return cb({});
      const d = snap.data() as { grades?: Record<string, ParentGradeEntry> };
      cb(d.grades && typeof d.grades === 'object' ? d.grades : {});
    },
    (err) => onError?.(err)
  );
}

export function subscribeSpellingWords(
  cb: (data: SpellingWordsDoc) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'home_and_garden', 'spelling_words'),
    (snap) => {
      if (!snap.exists()) {
        return cb({
          Liam: { weekOf: '', words: [] },
          Oliver: { weekOf: '', words: [] },
        });
      }
      const d = snap.data() as Partial<SpellingWordsDoc>;
      cb({
        Liam: d.Liam || { weekOf: '', words: [] },
        Oliver: d.Oliver || { weekOf: '', words: [] },
      });
    },
    (err) => onError?.(err)
  );
}

export async function saveGabeConfig(cfg: GabeConfigDoc, actorEmail: string): Promise<void> {
  const email = (actorEmail || auth.currentUser?.email || '').trim().toLowerCase();
  await setDoc(doc(db, 'home_and_garden', 'gabe_config'), {
    activeScienceUnitId: cfg.activeScienceUnitId,
    assessmentEnabled: cfg.assessmentEnabled,
    updatedAt: serverTimestamp(),
    updatedBy: email,
  });
}

export async function appendGabeResult(
  entry: Omit<QuestResultEntry, 'id'>,
  currentResults: QuestResultEntry[],
  actorEmail: string
): Promise<QuestResultEntry[]> {
  const email = (actorEmail || auth.currentUser?.email || '').trim().toLowerCase();
  const next: QuestResultEntry[] = [
    ...currentResults,
    { ...entry, id: `qr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}` },
  ];
  await setDoc(doc(db, 'home_and_garden', 'gabe_results'), {
    results: next,
    updatedAt: serverTimestamp(),
    updatedBy: email,
  });
  return next;
}

export async function appendGabeAssessment(
  entry: Omit<AssessmentResultEntry, 'id'>,
  currentRows: AssessmentResultEntry[],
  actorEmail: string
): Promise<AssessmentResultEntry[]> {
  const email = (actorEmail || auth.currentUser?.email || '').trim().toLowerCase();
  const next: AssessmentResultEntry[] = [
    ...currentRows,
    { ...entry, id: `ga_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}` },
  ];
  await setDoc(doc(db, 'home_and_garden', 'gabe_assessment'), {
    rows: next,
    updatedAt: serverTimestamp(),
    updatedBy: email,
  });
  return next;
}

export async function saveParentGabeGrades(
  grades: Record<string, ParentGradeEntry>,
  actorEmail: string
): Promise<void> {
  const email = (actorEmail || auth.currentUser?.email || '').trim().toLowerCase();
  await setDoc(doc(db, 'home_and_garden_parents', 'gabe_grades'), {
    grades,
    updatedAt: serverTimestamp(),
    updatedBy: email,
  });
}

export async function saveSpellingWords(
  data: SpellingWordsDoc,
  actorEmail: string
): Promise<void> {
  const email = (actorEmail || auth.currentUser?.email || '').trim().toLowerCase();
  await setDoc(doc(db, 'home_and_garden', 'spelling_words'), {
    Liam: data.Liam,
    Oliver: data.Oliver,
    updatedAt: serverTimestamp(),
    updatedBy: email,
  });
}
