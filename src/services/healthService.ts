import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type Timestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { auth, db } from '../firebase';

export interface OuraDayRecord {
  date: string;
  sleep: number | null;
  sleepH: number | null;
  deepH: number | null;
  remH: number | null;
  eff: number | null;
  ready: number | null;
  rhr: number | null;
  hrv: number | null;
  temp: number | null;
  act: number | null;
  steps: number | null;
  cal: number | null;
  spo2: number | null;
  workouts: string;
}

export interface HealthContentBlock {
  type: 'text' | 'table' | 'sources';
  text?: string;
  columns?: string[];
  rows?: string[][];
  links?: string[][];
}

export interface HealthContentCard {
  id: string;
  title: string;
  color: string;
  blocks: HealthContentBlock[];
}

export interface HealthContentSection {
  id: string;
  title: string;
  color: string;
  intro?: string;
  cards: HealthContentCard[];
  disclaimer?: string;
}

export interface HealthFitnessContentDoc {
  content: {
    page: string;
    visibility: string;
    sections: HealthContentSection[];
  } | null;
  meno: {
    title: string;
    overall: string;
    categories: Array<[string, string]>;
    levels: Array<[string, string]>;
    oura30: Array<[string, string]>;
    plan: string[];
  } | null;
  updatedAt?: Timestamp | null;
}

export type AmaretteMedicalType = 'Provider' | 'Condition' | 'Medication' | 'Note';

export interface AmaretteMedicalItem {
  id: string;
  type: AmaretteMedicalType | string;
  name: string;
  detail: string;
  location: string;
  phone: string;
  notes: string;
  updated: string;
}

export interface FamilyMedicalCardFields {
  carrier: string;
  memberId: string;
  group: string;
  plan: string;
  rxBin: string;
  rxPcn: string;
  memberPhone: string;
  doctor: string;
  doctorPhone: string;
  dentist: string;
  dentistPhone: string;
  allergies: string;
  meds: string;
  notes: string;
  nameOnCard: string;
  planCode: string;
  deductible: string;
  oopMax: string;
  phones: string;
  website: string;
  claims: string;
  issued: string;
}

export interface FamilyMedicalEntry {
  person: string;
  card: FamilyMedicalCardFields;
  updated: string;
  hasFront?: boolean;
  hasBack?: boolean;
  hasCombined?: boolean;
}

export const EMPTY_FAMILY_CARD: FamilyMedicalCardFields = {
  carrier: '',
  memberId: '',
  group: '',
  plan: '',
  rxBin: '',
  rxPcn: '',
  memberPhone: '',
  doctor: '',
  doctorPhone: '',
  dentist: '',
  dentistPhone: '',
  allergies: '',
  meds: '',
  notes: '',
  nameOnCard: '',
  planCode: '',
  deductible: '',
  oopMax: '',
  phones: '',
  website: '',
  claims: '',
  issued: '',
};

// ============================================================================
// REALTIME SUBSCRIPTIONS (CALL ONLY WHEN ROLE PERMITS!)
// ============================================================================

export function subscribeHealthFitnessDays(
  cb: (days: OuraDayRecord[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'private_health_owner', 'health_fitness_days'),
    (snap) => {
      if (!snap.exists()) {
        cb([]);
        return;
      }
      const data = snap.data() as { days?: OuraDayRecord[] };
      cb(Array.isArray(data.days) ? data.days : []);
    },
    (err) => onError?.(err)
  );
}

export function subscribeHealthFitnessContent(
  cb: (docData: HealthFitnessContentDoc | null) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'private_health_owner', 'health_fitness_content'),
    (snap) => {
      if (!snap.exists()) {
        cb(null);
        return;
      }
      const raw = snap.data() as HealthFitnessContentDoc & {
        contentJson?: string;
        menoJson?: string;
      };
      let content = raw.content ?? null;
      let meno = raw.meno ?? null;
      try {
        if (!content && raw.contentJson) content = JSON.parse(raw.contentJson);
      } catch {
        // ignore parse fallback
      }
      try {
        if (!meno && raw.menoJson) meno = JSON.parse(raw.menoJson);
      } catch {
        // ignore parse fallback
      }
      cb({ content, meno, updatedAt: raw.updatedAt });
    },
    (err) => onError?.(err)
  );
}

export function subscribeAmaretteMedical(
  cb: (items: AmaretteMedicalItem[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'private_health_owner', 'amarette_medical'),
    (snap) => {
      if (!snap.exists()) {
        cb([]);
        return;
      }
      const data = snap.data() as { items?: AmaretteMedicalItem[] };
      cb(Array.isArray(data.items) ? data.items : []);
    },
    (err) => onError?.(err)
  );
}

export function subscribeFamilyMedical(
  cb: (cards: Record<string, FamilyMedicalEntry>) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'private_health', 'family_medical'),
    (snap) => {
      if (!snap.exists()) {
        cb({});
        return;
      }
      const data = snap.data() as { cards?: Record<string, FamilyMedicalEntry> };
      cb(data.cards && typeof data.cards === 'object' ? data.cards : {});
    },
    (err) => onError?.(err)
  );
}

// ============================================================================
// MUTATIONS
// ============================================================================

export async function saveAmaretteMedicalList(
  items: AmaretteMedicalItem[],
  actorEmail: string
): Promise<void> {
  await setDoc(doc(db, 'private_health_owner', 'amarette_medical'), {
    items,
    updatedAt: serverTimestamp(),
    updatedBy: actorEmail.trim().toLowerCase(),
  });
}

export async function saveFamilyMedicalCard(
  personName: string,
  card: FamilyMedicalCardFields,
  flags: { hasFront?: boolean; hasBack?: boolean; hasCombined?: boolean },
  currentAll: Record<string, FamilyMedicalEntry>,
  actorEmail: string
): Promise<void> {
  const nextAll: Record<string, FamilyMedicalEntry> = {
    ...currentAll,
    [personName]: {
      person: personName,
      card,
      updated: new Date().toISOString().slice(0, 16).replace('T', ' '),
      hasFront: flags.hasFront ?? currentAll[personName]?.hasFront ?? false,
      hasBack: flags.hasBack ?? currentAll[personName]?.hasBack ?? false,
      hasCombined: flags.hasCombined ?? currentAll[personName]?.hasCombined ?? false,
    },
  };
  await setDoc(doc(db, 'private_health', 'family_medical'), {
    cards: nextAll,
    updatedAt: serverTimestamp(),
    updatedBy: actorEmail.trim().toLowerCase(),
  });
}

export type CardSide = 'front' | 'back' | 'combined';

export async function saveFamilyMedCardImage(
  personName: string,
  side: CardSide,
  dataUrl: string,
  currentAll: Record<string, FamilyMedicalEntry>,
  actorEmail: string
): Promise<void> {
  const email = actorEmail.trim().toLowerCase();
  const imgDocId = `${personName.toLowerCase()}_${side}`;
  await setDoc(doc(db, 'private_health', 'family_medical_cards', 'images', imgDocId), {
    person: personName,
    side,
    dataUrl,
    updatedAt: serverTimestamp(),
    updatedBy: email,
  });

  const existing = currentAll[personName] || {
    person: personName,
    card: { ...EMPTY_FAMILY_CARD },
    updated: '',
  };
  const flags = {
    hasFront: side === 'front' ? Boolean(dataUrl) : Boolean(existing.hasFront),
    hasBack: side === 'back' ? Boolean(dataUrl) : Boolean(existing.hasBack),
    hasCombined: side === 'combined' ? Boolean(dataUrl) : Boolean(existing.hasCombined),
  };
  await saveFamilyMedicalCard(personName, existing.card, flags, currentAll, email);
}

export async function getFamilyMedCardImage(
  personName: string,
  side: CardSide
): Promise<string> {
  const snap = await getDoc(
    doc(db, 'private_health', 'family_medical_cards', 'images', `${personName.toLowerCase()}_${side}`)
  );
  if (!snap.exists()) return '';
  const data = snap.data() as { dataUrl?: string };
  return data.dataUrl || '';
}

export interface HealthImportSection {
  privateHealth?: {
    familyMedical?: Record<string, FamilyMedicalEntry>;
  };
  privateHealthOwner?: {
    amaretteMedical?: { items: AmaretteMedicalItem[] };
    healthFitnessDays?: { days: OuraDayRecord[] };
    healthFitnessContent?: HealthFitnessContentDoc | null;
  };
}

export async function importHealthBundle(
  bundle: HealthImportSection,
  actorEmail: string
): Promise<void> {
  const email = (actorEmail || auth.currentUser?.email || '').trim().toLowerCase();
  const sanitize = <T,>(val: T): T => JSON.parse(JSON.stringify(val ?? null)) as T;

  const writeHealthStep = async (label: string, path: [string, string], payload: Record<string, unknown>) => {
    try {
      await setDoc(doc(db, path[0], path[1]), sanitize(payload));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`${label} failed (${auth.currentUser?.email || 'no-auth'}): ${msg}`);
    }
  };

  if (bundle.privateHealth?.familyMedical) {
    await writeHealthStep('private_health/family_medical', ['private_health', 'family_medical'], {
      cards: bundle.privateHealth.familyMedical,
      updatedAt: serverTimestamp(),
      updatedBy: email,
    });
  }
  if (bundle.privateHealthOwner?.amaretteMedical) {
    await writeHealthStep('private_health_owner/amarette_medical', ['private_health_owner', 'amarette_medical'], {
      items: bundle.privateHealthOwner.amaretteMedical.items || [],
      updatedAt: serverTimestamp(),
      updatedBy: email,
    });
  }
  if (bundle.privateHealthOwner?.healthFitnessDays) {
    await writeHealthStep(
      'private_health_owner/health_fitness_days',
      ['private_health_owner', 'health_fitness_days'],
      {
        days: bundle.privateHealthOwner.healthFitnessDays.days || [],
        updatedAt: serverTimestamp(),
        updatedBy: email,
      }
    );
  }
  if (bundle.privateHealthOwner?.healthFitnessContent) {
    // Store nested-array content & meno cleanly as JSON strings because Firestore forbids nested arrays
    await writeHealthStep(
      'private_health_owner/health_fitness_content',
      ['private_health_owner', 'health_fitness_content'],
      {
        contentJson: JSON.stringify(bundle.privateHealthOwner.healthFitnessContent.content || null),
        menoJson: JSON.stringify(bundle.privateHealthOwner.healthFitnessContent.meno || null),
        updatedAt: serverTimestamp(),
        updatedBy: email,
      }
    );
  }
}
