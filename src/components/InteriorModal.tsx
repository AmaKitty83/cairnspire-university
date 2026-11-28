import { useEffect, useState } from 'react';
import type { BuildingDef } from '../data/campusData';
import { ASSETS } from '../data/assetMeta';
import { isDepartmentAuthorizedOnline } from '../data/departmentRosters';
import type { CampusRole } from '../firebase';
import {
  isCampusConstitutionRatified,
  saveDepartmentRecord,
  type AccessRoleRecord,
  type AirBridgeRecord,
  type ConductLogRecord,
  type DepartmentRecord,
  type DepartmentStatus,
  type GovernanceProposal,
  type PermitRecord,
  type SkillRegistryRecord,
} from '../services/firestoreService';
import { TownHallInterior } from './interiors/TownHallInterior';
import { CampusWatchInterior } from './interiors/CampusWatchInterior';
import { CourthouseInterior } from './interiors/CourthouseInterior';
import { CommonsSquareInterior } from './interiors/CommonsSquareInterior';
import { AirInterior } from './interiors/AirInterior';
import { HealthInterior } from './interiors/HealthInterior';
import { ChildrensBooksInterior } from './interiors/ChildrensBooksInterior';
import { GeologyInterior } from './interiors/GeologyInterior';
import { StocksInterior } from './interiors/StocksInterior';
import { FinanceInterior } from './interiors/FinanceInterior';
import { CommunicationsInterior } from './interiors/CommunicationsInterior';
import { SocialMediaInterior } from './interiors/SocialMediaInterior';
import { RdWorkshopInterior } from './interiors/RdWorkshopInterior';
import { OfflineRosterPanel } from './interiors/OfflineRosterPanel';

interface InteriorModalProps {
  building: BuildingDef | null;
  role: CampusRole;
  userEmail: string;
  departments: Record<string, DepartmentRecord>;
  proposals: GovernanceProposal[];
  permits: PermitRecord[];
  conductLogs: ConductLogRecord[];
  skills: SkillRegistryRecord[];
  bridges: AirBridgeRecord[];
  accessRoles: AccessRoleRecord[];
  onClose: () => void;
  onSelectBuilding: (b: BuildingDef) => void;
  onOpenFamilyPreview: () => void;
}

const DEEP_V2_IDS = new Set([
  'town-hall',
  'executive',
  'courthouse',
  'commons',
  'air',
  'health',
  'childrens-books',
  'geology',
  'stocks',
  'finance',
  'communications',
  'social-media',
  'rd',
]);

export function InteriorModal({
  building,
  role,
  userEmail,
  departments,
  proposals,
  permits,
  conductLogs,
  skills,
  bridges,
  accessRoles,
  onClose,
  onSelectBuilding,
  onOpenFamilyPreview,
}: InteriorModalProps) {
  const [repName, setRepName] = useState('');
  const [repStatus, setRepStatus] = useState<DepartmentStatus>('recruiting');
  const [repNotes, setRepNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedFlag, setSavedFlag] = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);

  const currentRec = building ? departments[building.id] : undefined;

  useEffect(() => {
    if (!building) return;
    setRepName(currentRec?.repName || '');
    setRepStatus(currentRec?.status || 'recruiting');
    setRepNotes(currentRec?.notes || '');
    setSavedFlag(false);
    setSaveErr(null);
  }, [building, currentRec?.repName, currentRec?.status, currentRec?.notes]);

  if (!building) return null;

  const canWrite = role === 'chancellor' || role === 'university';
  const constitutionActive = isCampusConstitutionRatified(proposals);
  const deptAuthorizedOnline = isDepartmentAuthorizedOnline(building.id, constitutionActive);
  const isDeepV2 = DEEP_V2_IDS.has(building.id);
  const cropSrc = ASSETS['crop-' + building.id]?.src || ASSETS['world-map']?.src || '';
  const repSrc = ASSETS[building.repSprite]?.src || '';

  async function handleSaveRep() {
    if (!building || !canWrite) return;
    if (!repName.trim()) {
      setSaveErr('Enter a representative name before saving.');
      return;
    }
    setSaving(true);
    setSaveErr(null);
    try {
      await saveDepartmentRecord(building.id, repName, repStatus, repNotes, userEmail);
      setSavedFlag(true);
      setTimeout(() => setSavedFlag(false), 1500);
    } catch (err: unknown) {
      setSaveErr(err instanceof Error ? err.message : 'Could not save to Firestore.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div
        className={`parchment-panel w-full ${
          isDeepV2 ? 'sm:max-w-2xl' : 'sm:max-w-xl'
        } max-h-[90vh] rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col`}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#362316] text-[#fbe8b5] border-b-2 border-[#a87e45]">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-[#dfb97a] font-semibold">
              {building.district}
            </div>
            <h2 className="font-atlas text-lg font-bold truncate">{building.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#4e3523] hover:bg-[#66462f] text-[#fbe8b5] font-bold flex items-center justify-center shrink-0 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4 text-sm text-[#352110]">
          {role === 'guest' && (
            <div className="px-3 py-2 rounded-xl bg-[#eef4f8] border border-[#8fb2c9] text-xs text-[#224459] flex items-center justify-between gap-2">
              <span>
                <strong>Campus Guest View:</strong> You can explore every hall and read campus
                charters in read-only mode.
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white text-[10px] font-bold uppercase shrink-0">
                Read-Only
              </span>
            </div>
          )}

          {/* Building Artwork + Motif */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-3 rounded-xl bg-[#fbf4e1] border border-[#c4a167]">
            {cropSrc && (
              <img
                src={cropSrc}
                alt={building.name}
                className="w-40 h-28 object-cover rounded-lg border border-[#a87e45] shrink-0 shadow"
              />
            )}
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#e6cfa0] text-[#4a2b0f] text-xs font-semibold">
                {isDeepV2 ? 'v2 Live Governance Interior' : building.phase}
              </span>
              <p className="text-xs leading-relaxed text-[#462d16]">{building.motif}</p>
            </div>
          </div>

          {/* Department Head & Government Rep (Synced via Firestore) */}
          {building.id !== 'commons' && (
            <div className="p-3 rounded-xl bg-[#f7ead0] border border-[#b08647]/70 flex items-start gap-3">
              {repSrc && (
                <img
                  src={repSrc}
                  alt="Representative"
                  className="w-12 h-14 object-contain shrink-0 drop-shadow"
                />
              )}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-[#7c5021]">
                    Department Head &amp; Government Rep
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/80 border border-[#c4a167] text-[10px] font-bold uppercase text-[#4a2b0f]">
                    {currentRec?.status || 'recruiting'}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#3a2210]">{building.headRole}</div>

                {canWrite ? (
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap gap-2">
                      <input
                        type="text"
                        value={repName}
                        onChange={(e) => setRepName(e.target.value)}
                        placeholder="Name this Dept. Head..."
                        className="flex-1 min-w-[140px] px-2.5 py-1.5 rounded-lg bg-white/90 border border-[#a87e45] text-xs text-[#2b1a0c]"
                      />
                      <select
                        value={repStatus}
                        onChange={(e) => setRepStatus(e.target.value as DepartmentStatus)}
                        className="px-2 py-1.5 rounded-lg bg-white/90 border border-[#a87e45] text-xs text-[#2b1a0c]"
                      >
                        <option value="recruiting">Recruiting</option>
                        <option value="seated">Seated (Standby)</option>
                        <option value="active" disabled={!deptAuthorizedOnline}>
                          {deptAuthorizedOnline
                            ? constitutionActive
                              ? 'Active'
                              : 'Active (Stage 1 · Convention Prep)'
                            : 'Active (Locked Until Constitution)'}
                        </option>
                      </select>
                      <button
                        disabled={saving}
                        onClick={() => void handleSaveRep()}
                        className="px-3 py-1.5 rounded-lg bg-[#6b4423] hover:bg-[#7d512b] text-[#fbe8b5] text-xs font-semibold shrink-0 cursor-pointer disabled:opacity-50"
                      >
                        {saving ? 'Saving…' : savedFlag ? 'Synced ✓' : 'Save'}
                      </button>
                    </div>
                    <input
                      type="text"
                      value={repNotes}
                      onChange={(e) => setRepNotes(e.target.value)}
                      placeholder="Optional department charter notes (synced across devices)..."
                      className="w-full px-2.5 py-1 rounded-lg bg-white/80 border border-[#c4a167] text-xs text-[#2b1a0c]"
                    />
                    {saveErr && <div className="text-[11px] text-red-700 font-semibold">{saveErr}</div>}
                  </div>
                ) : (
                  <div className="text-xs text-[#54371b]">
                    <strong>Assigned:</strong>{' '}
                    {currentRec?.repName ? currentRec.repName : 'Open seat (Recruiting)'}
                    {currentRec?.notes ? ` — ${currentRec.notes}` : ''}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Live v2 Deep Interiors */}
          {building.special === 'town-hall' && (
            <TownHallInterior
              role={role}
              userEmail={userEmail}
              proposals={proposals}
              skills={skills}
            />
          )}

          {building.special === 'executive' && (
            <CampusWatchInterior role={role} userEmail={userEmail} permits={permits} />
          )}

          {building.special === 'courthouse' && (
            <CourthouseInterior role={role} userEmail={userEmail} logs={conductLogs} />
          )}

          {building.special === 'commons' && (
            <CommonsSquareInterior
              role={role}
              userEmail={userEmail}
              departments={departments}
              proposals={proposals}
              onSelectBuilding={onSelectBuilding}
            />
          )}

          {building.special === 'air' && (
            <AirInterior
              role={role}
              userEmail={userEmail}
              bridges={bridges}
              departments={departments}
              accessRoles={accessRoles}
            />
          )}

          {building.special === 'health' && (
            <HealthInterior role={role} userEmail={userEmail} />
          )}

          {building.special === 'childrens-books' && (
            <ChildrensBooksInterior role={role} userEmail={userEmail} />
          )}

          {building.id === 'geology' && (
            <GeologyInterior role={role} userEmail={userEmail} />
          )}

          {building.special === 'stocks' && (
            <StocksInterior role={role} userEmail={userEmail} />
          )}

          {building.id === 'finance' && (
            <FinanceInterior role={role} userEmail={userEmail} />
          )}

          {building.id === 'communications' && (
            <CommunicationsInterior role={role} userEmail={userEmail} />
          )}

          {building.id === 'social-media' && (
            <SocialMediaInterior role={role} userEmail={userEmail} />
          )}

          {building.id === 'rd' && (
            <RdWorkshopInterior role={role} userEmail={userEmail} />
          )}

          {building.special === 'home-garden' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#e9f5ec] border border-[#2d6a4f] space-y-2">
                <div className="font-atlas font-bold text-sm text-[#1b4332]">
                  🏡 Family-Locked Wing (App-Within-the-App)
                </div>
                <p className="text-xs text-[#2d6a4f]">
                  Amarette and Ray have full University access; other family logins (and Liam &amp;
                  Oliver’s Parent-Paired Kid Mode) open <strong>strictly inside Home and Garden</strong>.
                  Server-side Firestore rules enforce this boundary.
                </p>
                {(canWrite || role === 'guest') && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenFamilyPreview();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-semibold cursor-pointer"
                  >
                    Open Home &amp; Garden Family Hub →
                  </button>
                )}
              </div>
              <OfflineRosterPanel deptId="home-garden" heading="🌿 Home & Garden Personal Assistant (Offline · Standby)" />
            </div>
          )}

          {/* Department Zones */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold uppercase tracking-wide text-[#7c5021]">
              Department Zones &amp; Specialist Slots
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {building.zones.map((z) => (
                <div
                  key={z}
                  className="px-3 py-2 rounded-lg bg-white/65 border border-[#b89259] text-xs font-medium text-[#3b2410]"
                >
                  ✦ {z}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
