import type { LivingPose, LivingSpecies } from '../../data/livingRooms';

export interface SpritePoseSet {
  stand: string;
  walk1?: string;
  walk2?: string;
  work: string;
  talk: string;
  wave: string;
}

interface PaintedLivingSpriteProps {
  name: string;
  species: LivingSpecies;
  pose: LivingPose;
  spritePoses: SpritePoseSet;
  spriteHeight: number;
  nativeFacing?: 1 | -1;
  rankTier: 1 | 2 | 3;
  rankBadgeColor: string;
  x: number;
  y: number;
  facing: 1 | -1;
  isSelected: boolean;
  isTalking: boolean;
  speechText?: string | null;
  animTime: number;
  showStandbyBadge?: boolean;
  onClick: () => void;
}

export function PaintedLivingSprite({
  name,
  species,
  pose,
  spritePoses,
  spriteHeight,
  nativeFacing = 1,
  rankTier,
  rankBadgeColor,
  x,
  y,
  facing,
  isSelected,
  isTalking,
  speechText,
  animTime,
  showStandbyBadge,
  onClick,
}: PaintedLivingSpriteProps) {
  let activeSrc = spritePoses.stand;
  let bobY = 0;
  let tiltDeg = 0;
  let scaleX = 1;
  let scaleY = 1;
  let seatOffsetY = 0;

  if (pose === 'walk') {
    activeSrc =
      spritePoses.walk1 && spritePoses.walk2
        ? Math.floor(animTime * 5.2) % 2 === 0
          ? spritePoses.walk1
          : spritePoses.walk2
        : spritePoses.stand;
    const step = Math.sin(animTime * 11.2);
    bobY = -Math.abs(step) * 5.0;
    tiltDeg = step * 3.2;
    scaleY = 1 + Math.abs(step) * 0.025;
    scaleX = 1 - Math.abs(step) * 0.018;
  } else if (pose === 'sit-work') {
    activeSrc = spritePoses.work;
    seatOffsetY = 3;
    const sway = Math.sin(animTime * 2.2);
    scaleY = 1 + sway * 0.014;
    tiltDeg = Math.sin(animTime * 1.6) * 1.1;
  } else if (pose === 'stand-work') {
    activeSrc = spritePoses.work;
    const sway = Math.sin(animTime * 2.1);
    scaleY = 1 + sway * 0.013;
    tiltDeg = Math.sin(animTime * 1.8) * 1.2;
  } else if (pose === 'talk') {
    activeSrc = spritePoses.talk;
    bobY = -Math.abs(Math.sin(animTime * 7.4)) * 2.2;
    tiltDeg = Math.sin(animTime * 4.4) * 2.1;
    scaleY = 1 + Math.sin(animTime * 6) * 0.015;
  } else if (pose === 'wave') {
    activeSrc = spritePoses.wave;
    bobY = -Math.abs(Math.sin(animTime * 6.0)) * 3.4;
    tiltDeg = Math.sin(animTime * 5.0) * 1.8;
  } else {
    activeSrc = spritePoses.stand;
    scaleY = 1 + Math.sin(animTime * 2.0) * 0.012;
  }

  const h = species === 'Halfling' ? Math.min(spriteHeight, 94) : spriteHeight;
  const w = h * 0.94;
  const isWaving = pose === 'wave';
  const nameplateW = Math.max(66, name.length * 6.5 + 24);
  const effectiveFacing = pose === 'wave' ? nativeFacing : facing;
  const flipSign = effectiveFacing === nativeFacing ? 1 : -1;

  return (
    <g
      className="cursor-pointer"
      transform={`translate(${x.toFixed(1)}, ${y.toFixed(1)})`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Ground contact shadow */}
      <ellipse
        cx="0"
        cy="2"
        rx={isSelected ? 26 : 21}
        ry={8}
        fill={isSelected ? '#f59e0b' : '#180e06'}
        opacity={isSelected ? 0.56 : 0.42}
      />

      {/* Subtle walking footstep dust puffs */}
      {pose === 'walk' && (
        <g opacity="0.5">
          <circle
            cx={(-facing * (12 + ((animTime * 24) % 10))).toFixed(1)}
            cy="2"
            r="3.2"
            fill="#e5d3b3"
          />
          <circle
            cx={(-facing * (18 + ((animTime * 24 + 5) % 10))).toFixed(1)}
            cy="0.5"
            r="2.1"
            fill="#d6bfa0"
          />
        </g>
      )}

      {isSelected && (
        <ellipse
          cx="0"
          cy="2"
          rx="29"
          ry="10"
          fill="none"
          stroke="#fde68a"
          strokeWidth="2"
          opacity="0.92"
        />
      )}

      {/* Hand-painted sprite image anchored at foot baseline (0, 0) */}
      <g
        transform={`translate(0, ${(bobY + seatOffsetY).toFixed(1)}) scale(${(
          flipSign * scaleX
        ).toFixed(3)}, ${scaleY.toFixed(3)}) rotate(${tiltDeg.toFixed(2)})`}
      >
        <image
          href={activeSrc}
          x={(-w / 2).toFixed(1)}
          y={(-h).toFixed(1)}
          width={w.toFixed(1)}
          height={h.toFixed(1)}
          preserveAspectRatio="xMidYMax meet"
        />
      </g>

      {/* Subtle floating speech or wave emote bubble */}
      {isTalking && speechText ? (
        <g transform={`translate(0, ${(-h + bobY + seatOffsetY - 8).toFixed(1)})`}>
          {(() => {
            const boxW = Math.min(206, Math.max(100, speechText.length * 4.8 + 18));
            return (
              <g>
                <rect
                  x={-boxW / 2}
                  y="-22"
                  width={boxW}
                  height="22"
                  rx="11"
                  fill="#fffdf5"
                  stroke="#7a5226"
                  strokeWidth="1.6"
                />
                <polygon points="-5,0 0,6 5,0" fill="#fffdf5" stroke="#7a5226" strokeWidth="1.2" />
                <text x="0" y="-7.5" textAnchor="middle" fontSize="9.2" fontWeight="bold" fill="#3b2310">
                  💬 {speechText.length > 36 ? speechText.slice(0, 35) + '…' : speechText}
                </text>
              </g>
            );
          })()}
        </g>
      ) : isWaving ? (
        <g transform={`translate(0, ${(-h + bobY + seatOffsetY - 8).toFixed(1)})`}>
          <circle cx="0" cy="-9" r="12" fill="#fff8e7" stroke="#d97706" strokeWidth="1.8" />
          <text x="0" y="-5" textAnchor="middle" fontSize="12">
            👋
          </text>
        </g>
      ) : isSelected ? (
        <g transform={`translate(0, ${(-h + bobY + seatOffsetY - 8).toFixed(1)})`}>
          <circle cx="0" cy="-9" r="11" fill="#fef3c7" stroke="#d97706" strokeWidth="1.8" />
          <text x="0" y="-5" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#78350f">
            {showStandbyBadge ? '⏸' : '★'}
          </text>
        </g>
      ) : null}

      {/* Nameplate with Rank Crystal Dot */}
      <g transform="translate(0, 15)">
        <rect
          x={-nameplateW / 2}
          y="-8"
          width={nameplateW}
          height="16"
          rx="8"
          fill={isSelected ? '#78350f' : '#26180d'}
          fillOpacity="0.92"
          stroke={isSelected ? '#fde68a' : '#c89d58'}
          strokeWidth={isSelected ? '1.6' : '1.1'}
        />
        <circle
          cx={-nameplateW / 2 + 9}
          cy="0"
          r="3.8"
          fill={rankBadgeColor}
          stroke="#fff8e7"
          strokeWidth="0.9"
        />
        <title>{`Tier ${rankTier} Rank Uniform`}</title>
        <text x="4" y="3" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#fbe8b5">
          {name}
        </text>
      </g>
    </g>
  );
}
