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

export function PersonIcon({
  person,
  size = 'md',
}: {
  person: Pick<FamilyPersonProfile, 'name' | 'emoji'>;
  size?: 'sm' | 'md' | 'lg';
}) {
  if (person.name === 'Liam') {
    const dim = size === 'lg' ? 'w-9 h-9' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    return (
      <svg viewBox="0 0 32 32" className={`${dim} inline-block shrink-0`} role="img" aria-label="purple splat">
        <g fill="#8E44AD">
          <path d="M16 5c2.2 0 3 2.6 4.6 3.2 1.7.6 4-1 5.3.4 1.3 1.4-.6 3.6-.1 5.3.5 1.8 3.4 2.3 3.2 4.3-.2 2-3.2 2-4.2 3.6-1 1.6.5 4.3-1.1 5.5-1.6 1.2-3.7-1-5.6-.8-1.9.2-3.3 2.8-5.2 2.1-1.9-.7-1.2-3.6-2.4-5-1.2-1.4-4.3-1-4.9-2.8-.6-1.8 2-3.1 2.1-5 .1-1.9-2.2-3.5-1.2-5.2 1-1.7 3.8-.6 5.4-1.6C13.5 8.1 13.8 5 16 5z" />
          <circle cx="4.5" cy="7" r="2" />
          <circle cx="28" cy="6" r="1.6" />
          <circle cx="27.5" cy="27" r="1.8" />
          <circle cx="5" cy="26" r="1.4" />
        </g>
      </svg>
    );
  }
  const sz = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-sm' : 'text-lg';
  return (
    <span className={sz} aria-hidden="true">
      {person.emoji || '🙂'}
    </span>
  );
}

export function PersonChip({ person }: { person: FamilyPersonProfile }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border border-black/10"
      style={{ backgroundColor: person.color, color: person.ink }}
    >
      <PersonIcon person={person} size="sm" />
      {person.name}
    </span>
  );
}
