import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, resolveUserRole } from './firebase';
import { AuthGate } from './components/AuthGate';
import { CampusMap } from './components/CampusMap';
import { HomeAndGardenView } from './components/HomeAndGardenView';

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [familyPreviewOpen, setFamilyPreviewOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
    });
    return unsub;
  }, []);

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

  const role = resolveUserRole(user);

  if (!user || role === 'unauthorized') {
    return <AuthGate user={user} unauthorized={Boolean(user)} />;
  }

  // Family-only accounts drop directly inside Home and Garden — zero campus map rendered
  if (role === 'family') {
    return <HomeAndGardenView canExitToCampus={false} userEmail={user.email} />;
  }

  // Chancellor (Amarette) & University Full Access (Ray)
  if (familyPreviewOpen) {
    return (
      <HomeAndGardenView
        canExitToCampus={true}
        onExitToCampus={() => setFamilyPreviewOpen(false)}
        userEmail={user.email}
      />
    );
  }

  return (
    <CampusMap
      role={role}
      userEmail={user.email}
      onOpenFamilyPreview={() => setFamilyPreviewOpen(true)}
    />
  );
}

export default App;
