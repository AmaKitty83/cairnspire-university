import { ASSETS } from '../../data/assetMeta';
import type { FamilyPersonProfile } from '../../services/familyHubService';

export function speakText(text: string, enabled: boolean) {
  if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const clean = text.replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/gu, '').trim();
    if (!clean) return;
    const u = new SpeechSynthesisUtterance(clean);
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  } catch {
    // Ignore speech synthesis errors on unsupported browsers
  }
}

const CREST_ASSETS: Record<string, string> = {
  Amarette: ASSETS['crest-amarette']?.src || '/assets/crests/amarette.png',
  Ray: ASSETS['crest-ray']?.src || '/assets/crests/ray.png',
  Oliver: ASSETS['crest-oliver']?.src || '/assets/crests/oliver.png',
  Liam: ASSETS['crest-liam']?.src || '/assets/crests/liam.png',
  Chase: ASSETS['crest-chase']?.src || '/assets/crests/chase.png',
  Gabe: ASSETS['crest-gabe']?.src || '/assets/crests/gabe.png',
  Preston: ASSETS['crest-preston']?.src || '/assets/crests/preston.png',
};

export function PersonIcon({
  person,
  size = 'md',
}: {
  person: Pick<FamilyPersonProfile, 'name' | 'emoji'>;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const crestSrc = CREST_ASSETS[person.name];
  if (crestSrc) {
    const dim =
      size === 'xl'
        ? 'w-20 h-20'
        : size === 'lg'
          ? 'w-16 h-16'
          : size === 'sm'
            ? 'w-5 h-5'
            : 'w-7 h-7';
    return (
      <img
        src={crestSrc}
        alt={person.name}
        className={`${dim} rounded-full object-contain inline-block shrink-0 drop-shadow-sm select-none`}
      />
    );
  }

  const sz =
    size === 'xl' ? 'text-4xl' : size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-sm' : 'text-lg';
  return (
    <span className={sz} aria-hidden="true">
      {person.emoji || '🙂'}
    </span>
  );
}

export function PersonChip({ person }: { person: FamilyPersonProfile }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border border-black/15 shadow-xs"
      style={{ backgroundColor: person.color, color: person.ink }}
    >
      <PersonIcon person={person} size="sm" />
      <span>{person.name}</span>
    </span>
  );
}
