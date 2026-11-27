import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, resolveUserRoleAsync, type CampusRole } from './firebase';
import {
  ensureStarterGovernanceSeeded,
  subscribeAccessRoles,
  subscribeAirBridges,
  subscribeConductLogs,
  subscribeDepartments,
  subscribePermits,
  subscribeProposals,
  subscribeSkills,
  type AccessRoleRecord,
  type AirBridgeRecord,
  type ConductLogRecord,
  type DepartmentRecord,
  type GovernanceProposal,
  type PermitRecord,
  type SkillRegistryRecord,
} from './services/firestoreService';
import { AuthGate } from './components/AuthGate';
import { BramblewoodSuiteView } from './components/BramblewoodSuiteView';
import { CampusMap } from './components/CampusMap';
import { HomeAndGardenView } from './components/HomeAndGardenView';
import { PublicGiftsPage } from './components/PublicGiftsPage';

export function App() {
  const isPublicGiftsRoute =
    typeof window !== 'undefined' &&
    (window.location.pathname.replace(/\/+$/, '') === '/gifts' ||
      new URLSearchParams(window.location.search).get('gifts') === '1');

  if (isPublicGiftsRoute) {
    return <PublicGiftsPage />;
  }
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<CampusRole>('unauthorized');
  const [authReady, setAuthReady] = useState(false);
  const [familyPreviewOpen, setFamilyPreviewOpen] = useState(false);
  const [bramblewoodOpen, setBramblewoodOpen] = useState(false);

  // Live Firestore collections
  const [departments, setDepartments] = useState<Record<string, DepartmentRecord>>({});
  const [proposals, setProposals] = useState<GovernanceProposal[]>([]);
  const [permits, setPermits] = useState<PermitRecord[]>([]);
  const [conductLogs, setConductLogs] = useState<ConductLogRecord[]>([]);
  const [skills, setSkills] = useState<SkillRegistryRecord[]>([]);
  const [bridges, setBridges] = useState<AirBridgeRecord[]>([]);
  const [accessRoles, setAccessRoles] = useState<AccessRoleRecord[]>([]);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setRole('unauthorized');
        setAuthReady(true);
        return;
      }
      void resolveUserRoleAsync(nextUser).then((resolved) => {
        setRole(resolved);
        setAuthReady(true);
      });
    });
    return unsub;
  }, []);

  // Seed starter governance records once when Chancellor opens v2
  useEffect(() => {
    if (!user?.email || role !== 'chancellor') return;
    void ensureStarterGovernanceSeeded(user.email).catch((err: unknown) => {
      setSyncError(err instanceof Error ? err.message : 'Could not seed starter governance data.');
    });
  }, [user?.email, role]);

  // Live Firestore subscriptions for Campus roles (Chancellor, University, Read-Only Guest)
  useEffect(() => {
    if (!user || (role !== 'chancellor' && role !== 'university' && role !== 'guest')) return;
    setSyncError(null);
    const onErr = (err: Error) => setSyncError(err.message);

    const unsubs = [
      subscribeDepartments(setDepartments, onErr),
      subscribeProposals(setProposals, onErr),
      subscribePermits(setPermits, onErr),
      subscribeConductLogs(setConductLogs, onErr),
      subscribeSkills(setSkills, onErr),
      subscribeAirBridges(setBridges, onErr),
    ];
    if (role === 'chancellor') {
      unsubs.push(subscribeAccessRoles(setAccessRoles, onErr));
    }
    return () => {
      unsubs.forEach((u) => u());
    };
  }, [user, role]);

  if (!authReady) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#211710] text-[#fbe8b5] font-atlas">
        <div className="text-center space-y-2">
          <div className="text-lg font-bold">Opening Cairnspire University…</div>
          <div className="text-xs text-[#d9be8c]">Checking campus credentials</div>
        </div>
      </div>
    );
  }

  if (!user || role === 'unauthorized') {
    return <AuthGate user={user} unauthorized={Boolean(user)} />;
  }

  if (role === 'family') {
    return <HomeAndGardenView canExitToCampus={false} userEmail={user.email} role={role} />;
  }

  if (familyPreviewOpen && (role === 'chancellor' || role === 'university' || role === 'guest')) {
    return (
      <HomeAndGardenView
        canExitToCampus={true}
        onExitToCampus={() => setFamilyPreviewOpen(false)}
        userEmail={user.email}
        role={role}
      />
    );
  }

  if (bramblewoodOpen && (role === 'chancellor' || role === 'university' || role === 'guest')) {
    return (
      <BramblewoodSuiteView
        role={role}
        userEmail={user.email || ''}
        proposals={proposals}
        onExitToCampus={() => setBramblewoodOpen(false)}
      />
    );
  }

  return (
    <CampusMap
      role={role}
      userEmail={user.email || ''}
      departments={departments}
      proposals={proposals}
      permits={permits}
      conductLogs={conductLogs}
      skills={skills}
      bridges={bridges}
      accessRoles={accessRoles}
      syncError={syncError}
      onOpenFamilyPreview={() => setFamilyPreviewOpen(true)}
      onOpenBramblewood={() => setBramblewoodOpen(true)}
    />
  );
}

export default App;
