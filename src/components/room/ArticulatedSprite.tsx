import type { CharacterAppearance, HeldProp, LivingPose } from '../../data/livingRooms';

export interface JointAngles {
  bodyY: number;
  torsoLean: number;
  headTilt: number;
  leftHip: number;
  leftKnee: number;
  rightHip: number;
  rightKnee: number;
  leftShoulder: number;
  leftElbow: number;
  rightShoulder: number;
  rightElbow: number;
  tailWag: number;
  wingFlap: number;
}

export function defaultJoints(): JointAngles {
  return {
    bodyY: 0,
    torsoLean: 0,
    headTilt: 0,
    leftHip: 0,
    leftKnee: 0,
    rightHip: 0,
    rightKnee: 0,
    leftShoulder: 10,
    leftElbow: -12,
    rightShoulder: -8,
    rightElbow: -18,
    tailWag: 0,
    wingFlap: 0,
  };
}

export function computeTargetJoints(
  pose: LivingPose,
  t: number,
  prop: HeldProp
): JointAngles {
  const breathe = Math.sin(t * 2.1) * 1.1;
  const tailWag = Math.sin(t * 2.8) * 14 + Math.cos(t * 1.4) * 5;
  const wingFlap = Math.sin(t * 6.5) * 12;

  switch (pose) {
    case 'walk': {
      const stride = Math.sin(t * 9.5);
      const lift = Math.abs(Math.sin(t * 9.5)) * -3.6;
      return {
        bodyY: lift,
        torsoLean: 5 + Math.abs(stride) * 2,
        headTilt: Math.sin(t * 9.5 + 0.4) * -2.5,
        leftHip: stride * 28,
        leftKnee: Math.max(0, -stride) * 34 + 6,
        rightHip: -stride * 28,
        rightKnee: Math.max(0, stride) * 34 + 6,
        leftShoulder: -stride * 24 + 6,
        leftElbow: -20 - Math.max(0, stride) * 14,
        rightShoulder: stride * 24 - 6,
        rightElbow: -22 - Math.max(0, -stride) * 14,
        tailWag: tailWag * 1.35,
        wingFlap: wingFlap * 1.25,
      };
    }

    case 'sit-work': {
      const typeMotion = Math.sin(t * 7.2) * 8;
      const writeMotion = Math.sin(t * 5.0) * 6;
      const isWriting = prop === 'quill';
      return {
        bodyY: 13 + breathe * 0.4,
        torsoLean: 6 + Math.sin(t * 1.5) * 1.6,
        headTilt: isWriting ? 8 + Math.sin(t * 2.1) * 2.5 : 4 + Math.sin(t * 1.7) * 2,
        leftHip: -78,
        leftKnee: 82,
        rightHip: -74,
        rightKnee: 78,
        leftShoulder: -38 + (isWriting ? 4 : typeMotion * 0.5),
        leftElbow: -48 + (isWriting ? 6 : -typeMotion),
        rightShoulder: isWriting ? -46 + writeMotion * 0.7 : -34 - typeMotion * 0.5,
        rightElbow: isWriting ? -54 + writeMotion * 1.1 : -44 + typeMotion,
        tailWag: tailWag * 0.65,
        wingFlap: wingFlap * 0.6,
      };
    }

    case 'stand-work': {
      const reach = Math.sin(t * 3.0) * 6;
      if (prop === 'magnifier') {
        return {
          bodyY: breathe * 0.6,
          torsoLean: 6,
          headTilt: -8 + Math.sin(t * 1.6) * 3,
          leftHip: -4,
          leftKnee: 6,
          rightHip: 6,
          rightKnee: 4,
          leftShoulder: 18,
          leftElbow: -28,
          rightShoulder: -68 + reach * 0.5,
          rightElbow: -46 + reach,
          tailWag,
          wingFlap,
        };
      }
      if (prop === 'bell-tap') {
        return {
          bodyY: breathe * 0.6,
          torsoLean: 4,
          headTilt: 5 + Math.sin(t * 1.9) * 2,
          leftHip: -3,
          leftKnee: 5,
          rightHip: 5,
          rightKnee: 3,
          leftShoulder: -24,
          leftElbow: -48,
          rightShoulder: -42 + Math.sin(t * 4.2) * 10,
          rightElbow: -52 + Math.cos(t * 4.2) * 8,
          tailWag,
          wingFlap,
        };
      }
      if (prop === 'clipboard') {
        return {
          bodyY: breathe * 0.6,
          torsoLean: 2,
          headTilt: 4 + Math.sin(t * 1.4) * 3,
          leftHip: -4,
          leftKnee: 4,
          rightHip: 5,
          rightKnee: 4,
          leftShoulder: -34,
          leftElbow: -62,
          rightShoulder: -38 + reach * 0.8,
          rightElbow: -48 + reach,
          tailWag,
          wingFlap,
        };
      }
      return {
        bodyY: breathe * 0.7,
        torsoLean: 3,
        headTilt: Math.sin(t * 1.4) * 3,
        leftHip: -3,
        leftKnee: 4,
        rightHip: 4,
        rightKnee: 4,
        leftShoulder: -16,
        leftElbow: -28,
        rightShoulder: -36 + reach,
        rightElbow: -44 - reach * 0.5,
        tailWag,
        wingFlap,
      };
    }

    case 'talk': {
      const gestureA = Math.sin(t * 5.2) * 15;
      const gestureB = Math.cos(t * 4.1) * 11;
      return {
        bodyY: breathe * 0.8,
        torsoLean: -2 + Math.sin(t * 2.6) * 2.5,
        headTilt: Math.sin(t * 3.4) * 5.5,
        leftHip: -3,
        leftKnee: 5,
        rightHip: 4,
        rightKnee: 4,
        leftShoulder: -28 + gestureB,
        leftElbow: -52 + gestureA * 0.6,
        rightShoulder: -48 + gestureA,
        rightElbow: -56 - gestureB * 0.7,
        tailWag: tailWag * 1.15,
        wingFlap: wingFlap * 1.1,
      };
    }

    case 'wave': {
      const waveSwing = Math.sin(t * 9.0) * 22;
      return {
        bodyY: Math.abs(Math.sin(t * 4.5)) * -2.2,
        torsoLean: -4,
        headTilt: -6 + Math.sin(t * 4.5) * 4,
        leftHip: -4,
        leftKnee: 5,
        rightHip: 4,
        rightKnee: 4,
        leftShoulder: 16,
        leftElbow: -22,
        rightShoulder: -136 + waveSwing * 0.45,
        rightElbow: -42 + waveSwing,
        tailWag: tailWag * 1.4,
        wingFlap: wingFlap * 1.4,
      };
    }

    case 'idle':
    default:
      return {
        bodyY: breathe * 0.8,
        torsoLean: Math.sin(t * 1.1) * 1.5,
        headTilt: Math.sin(t * 0.9) * 3,
        leftHip: -2,
        leftKnee: 4,
        rightHip: 3,
        rightKnee: 3,
        leftShoulder: 12,
        leftElbow: -14,
        rightShoulder: -10,
        rightElbow: -18,
        tailWag,
        wingFlap,
      };
  }
}

export function lerpJoints(curr: JointAngles, target: JointAngles, alpha: number): JointAngles {
  const k = Math.max(0.01, Math.min(1, alpha));
  return {
    bodyY: curr.bodyY + (target.bodyY - curr.bodyY) * k,
    torsoLean: curr.torsoLean + (target.torsoLean - curr.torsoLean) * k,
    headTilt: curr.headTilt + (target.headTilt - curr.headTilt) * k,
    leftHip: curr.leftHip + (target.leftHip - curr.leftHip) * k,
    leftKnee: curr.leftKnee + (target.leftKnee - curr.leftKnee) * k,
    rightHip: curr.rightHip + (target.rightHip - curr.rightHip) * k,
    rightKnee: curr.rightKnee + (target.rightKnee - curr.rightKnee) * k,
    leftShoulder: curr.leftShoulder + (target.leftShoulder - curr.leftShoulder) * k,
    leftElbow: curr.leftElbow + (target.leftElbow - curr.leftElbow) * k,
    rightShoulder: curr.rightShoulder + (target.rightShoulder - curr.rightShoulder) * k,
    rightElbow: curr.rightElbow + (target.rightElbow - curr.rightElbow) * k,
    tailWag: curr.tailWag + (target.tailWag - curr.tailWag) * k,
    wingFlap: curr.wingFlap + (target.wingFlap - curr.wingFlap) * k,
  };
}

function HeldItemSvg({ prop, accent }: { prop: HeldProp; accent: string }) {
  switch (prop) {
    case 'quill':
      return (
        <g transform="translate(2, 16) rotate(-25)">
          <path d="M 0 0 L 2 -14 C 6 -16 8 -10 2 0 Z" fill="#fef3c7" stroke="#24140a" strokeWidth="1.2" />
          <line x1="0" y1="0" x2="0" y2="5" stroke="#24140a" strokeWidth="1.5" />
        </g>
      );
    case 'magnifier':
      return (
        <g transform="translate(3, 17) rotate(-20)">
          <line x1="0" y1="0" x2="2" y2="-10" stroke="#78350f" strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="3" cy="-16" r="6.5" fill="#bae6fd" fillOpacity="0.65" stroke={accent} strokeWidth="2.4" />
        </g>
      );
    case 'clipboard':
      return (
        <g transform="translate(3, 15) rotate(8)">
          <rect x="-5" y="-12" width="12" height="15" rx="1.8" fill="#8b5a2b" stroke="#24140a" strokeWidth="1.3" />
          <rect x="-3" y="-9" width="8" height="10" rx="1" fill="#fffbeb" />
          <rect x="-2" y="-13" width="6" height="3" rx="1" fill="#cbd5e1" stroke="#24140a" strokeWidth="1" />
        </g>
      );
    case 'bell-tap':
      return (
        <g transform="translate(2, 16)">
          <path d="M -2 0 L 2 -5" stroke="#fde68a" strokeWidth="2" strokeLinecap="round" />
          <circle cx="2" cy="-6" r="2.2" fill="#ffd166" />
        </g>
      );
    case 'mug':
      return (
        <g transform="translate(2, 15)">
          <rect x="-4" y="-7" width="8" height="8" rx="1.5" fill="#d97706" stroke="#24140a" strokeWidth="1.2" />
          <path d="M 4 -5 C 7 -5 7 -1 4 -1" fill="none" stroke="#24140a" strokeWidth="1.2" />
        </g>
      );
    default:
      return null;
  }
}

interface ArticulatedSpriteProps {
  name: string;
  appearance: CharacterAppearance;
  pose: LivingPose;
  prop: HeldProp;
  joints: JointAngles;
  x: number;
  y: number;
  facing: 1 | -1;
  isSelected: boolean;
  isTalking: boolean;
  isBlinking: boolean;
  speechText?: string | null;
  talkFrame: number;
  showStandbyBadge?: boolean;
  onClick: () => void;
}

export function ArticulatedSprite({
  name,
  appearance,
  pose,
  prop,
  joints,
  x,
  y,
  facing,
  isSelected,
  isTalking,
  isBlinking,
  speechText,
  talkFrame,
  showStandbyBadge,
  onClick,
}: ArticulatedSpriteProps) {
  const ink = '#24140a';
  const scale = appearance.species === 'Halfling' ? 0.88 : 1;
  const {
    skin,
    hair,
    outfit,
    outfitDark,
    accent,
    species,
    badge,
  } = appearance;

  const isWaving = pose === 'wave';
  const talkMouthOpen = isTalking && Math.sin(talkFrame * 14) > 0;
  const nameplateW = Math.max(58, name.length * 6.5 + 16);

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
        rx={isSelected ? 22 : 18}
        ry={7}
        fill={isSelected ? '#f59e0b' : '#180e06'}
        opacity={isSelected ? 0.56 : 0.42}
      />

      {isSelected && (
        <ellipse
          cx="0"
          cy="2"
          rx="25"
          ry="9"
          fill="none"
          stroke="#fde68a"
          strokeWidth="2"
          opacity="0.9"
        />
      )}

      {/* Articulated character skeleton, flipped horizontally by facing & scaled by species */}
      <g transform={`scale(${(facing * scale).toFixed(2)}, ${scale.toFixed(2)})`}>
        <g transform={`translate(0, ${joints.bodyY.toFixed(2)})`}>
          {/* SPECIES BACK ACCESSORIES (Tail or Wings) */}
          {species === 'Catgirl' && (
            <g transform={`translate(-9, -37) rotate(${(-18 + joints.tailWag).toFixed(1)})`}>
              <path
                d="M 0 0 Q -16 -6 -20 -20 Q -21 -26 -16 -26 Q -12 -24 -12 -18 Q -8 -8 0 -3 Z"
                fill={hair}
                stroke={ink}
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
            </g>
          )}
          {species === 'Winged Fae' && (
            <g transform={`translate(-8, -48) rotate(${joints.wingFlap.toFixed(1)})`}>
              <path
                d="M 0 0 C -18 -20 -30 -12 -24 2 C -18 8 -6 8 0 4 Z"
                fill="#bae6fd"
                fillOpacity="0.65"
                stroke="#38bdf8"
                strokeWidth="1.4"
              />
              <path
                d="M 0 4 C -16 6 -22 18 -14 22 C -7 24 -2 12 0 7 Z"
                fill="#e0f2fe"
                fillOpacity="0.65"
                stroke="#38bdf8"
                strokeWidth="1.2"
              />
            </g>
          )}

          {/* BACK ARM */}
          <g transform={`translate(5, -53) rotate(${joints.leftShoulder.toFixed(1)})`}>
            <rect
              x="-3.5"
              y="-1"
              width="7"
              height="15"
              rx="3.5"
              fill={outfitDark}
              stroke={ink}
              strokeWidth="1.7"
            />
            <g transform={`translate(0, 12) rotate(${joints.leftElbow.toFixed(1)})`}>
              <rect
                x="-3"
                y="-1"
                width="6"
                height="13"
                rx="3"
                fill={outfitDark}
                stroke={ink}
                strokeWidth="1.6"
              />
              <circle cx="0" cy="13" r="3.4" fill={skin} stroke={ink} strokeWidth="1.5" />
            </g>
          </g>

          {/* BACK LEG */}
          <g transform={`translate(5, -31) rotate(${joints.leftHip.toFixed(1)})`}>
            <rect
              x="-4.2"
              y="0"
              width="8.4"
              height="16"
              rx="4"
              fill="#27272a"
              stroke={ink}
              strokeWidth="1.8"
            />
            <g transform={`translate(0, 14) rotate(${joints.leftKnee.toFixed(1)})`}>
              <rect
                x="-3.8"
                y="0"
                width="7.6"
                height="15"
                rx="3.5"
                fill="#3b2616"
                stroke={ink}
                strokeWidth="1.8"
              />
              <ellipse cx="2.5" cy="15" rx="6.2" ry="3.6" fill="#2c190c" stroke={ink} strokeWidth="1.6" />
            </g>
          </g>

          {/* TORSO + HEAD */}
          <g transform={`translate(0, -32) rotate(${joints.torsoLean.toFixed(1)})`}>
            {/* Coat / Tunic Body */}
            <path
              d="M -11 -24 C -11 -27 11 -27 11 -24 L 13 1 C 10 4 -10 4 -13 1 Z"
              fill={outfit}
              stroke={ink}
              strokeWidth="1.9"
              strokeLinejoin="round"
            />
            {/* Lapels & Collar */}
            <polygon points="-6,-25 0,-14 6,-25" fill="#f8fafc" stroke={ink} strokeWidth="1.3" />
            {/* Gold / Brass Belt & Buckle */}
            <rect x="-12" y="-6" width="24" height="4.5" rx="1.5" fill="#451a03" stroke={ink} strokeWidth="1.2" />
            <rect x="-3" y="-6.6" width="6.5" height="5.6" rx="1" fill={accent} stroke={ink} strokeWidth="1.1" />
            {/* Officer / Commissioner Chest Star */}
            <circle cx="5.5" cy="-16.5" r="2.7" fill={accent} stroke={ink} strokeWidth="1" />

            {/* NECK & HEAD PIVOT */}
            <g transform={`translate(0, -27) rotate(${joints.headTilt.toFixed(1)})`}>
              {/* Neck */}
              <rect x="-3.5" y="-5" width="7" height="7" rx="2" fill={skin} stroke={ink} strokeWidth="1.4" />

              {/* Back Hair Layer */}
              <ellipse cx="-2" cy="-22" rx="15" ry="15" fill={hair} stroke={ink} strokeWidth="1.9" />

              {/* Elvaan Pointed Ears or Halfling Rounded Ears */}
              {species === 'Elvaan' && (
                <>
                  <polygon points="-13,-21 -23,-25 -14,-16" fill={skin} stroke={ink} strokeWidth="1.5" />
                  <polygon points="13,-21 21,-24 14,-16" fill={skin} stroke={ink} strokeWidth="1.5" />
                </>
              )}
              {species === 'Halfling' && (
                <circle cx="-13" cy="-19" r="3.4" fill={skin} stroke={ink} strokeWidth="1.5" />
              )}

              {/* Face */}
              <circle cx="1" cy="-19" r="12.5" fill={skin} stroke={ink} strokeWidth="1.9" />

              {/* Rosy Cheeks */}
              <ellipse cx="-4.5" cy="-15.5" rx="2.6" ry="1.4" fill="#fb7185" opacity="0.45" />
              <ellipse cx="7.5" cy="-15.5" rx="2.6" ry="1.4" fill="#fb7185" opacity="0.45" />

              {/* Eyes: blinking, waving happy ^ ^, or bright expressive irises */}
              {isBlinking ? (
                <g stroke={ink} strokeWidth="1.8" strokeLinecap="round" fill="none">
                  <path d="M -5 -20 L -1 -20" />
                  <path d="M 4 -20 L 8 -20" />
                </g>
              ) : isWaving ? (
                <g stroke={ink} strokeWidth="1.9" strokeLinecap="round" fill="none">
                  <path d="M -5 -19 Q -3 -22 -1 -19" />
                  <path d="M 4 -19 Q 6 -22 8 -19" />
                </g>
              ) : (
                <g>
                  <ellipse cx="-2.8" cy="-19.5" rx="2.2" ry="2.6" fill="#1e293b" />
                  <circle cx="-2.2" cy="-20.4" r="0.9" fill="#ffffff" />
                  <ellipse cx="6.2" cy="-19.5" rx="2.2" ry="2.6" fill="#1e293b" />
                  <circle cx="6.8" cy="-20.4" r="0.9" fill="#ffffff" />
                </g>
              )}

              {/* Animated Mouth */}
              {talkMouthOpen ? (
                <ellipse cx="2.2" cy="-12.5" rx="2.4" ry="2.2" fill="#9f1239" stroke={ink} strokeWidth="1.1" />
              ) : (
                <path
                  d="M -0.5 -12.8 Q 2.2 -10.8 4.8 -12.8"
                  fill="none"
                  stroke={ink}
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              )}

              {/* Front Bangs */}
              <path
                d="M -12 -22 C -10 -33 10 -34 13 -22 C 9 -26 5 -21 1 -24 C -3 -21 -8 -25 -12 -22 Z"
                fill={hair}
                stroke={ink}
                strokeWidth="1.7"
                strokeLinejoin="round"
              />

              {/* Catgirl Ears */}
              {species === 'Catgirl' && (
                <g>
                  <polygon points="-10,-28 -12,-39 -2,-32" fill={hair} stroke={ink} strokeWidth="1.7" />
                  <polygon points="-9,-29 -10,-36 -4,-31" fill="#f9a8d4" />
                  <polygon points="4,-32 13,-39 11,-28" fill={hair} stroke={ink} strokeWidth="1.7" />
                  <polygon points="5,-31 11,-36 10,-29" fill="#f9a8d4" />
                </g>
              )}

              {/* Role Headgear (Commissioner cap, Detective cap, Detainment visor) */}
              {badge === 'commissioner' && (
                <g>
                  <path d="M -11 -29 C -6 -37 9 -37 13 -29 Z" fill={outfitDark} stroke={ink} strokeWidth="1.6" />
                  <rect x="-10" y="-30" width="22" height="3.2" rx="1" fill={accent} stroke={ink} strokeWidth="1.1" />
                  <path d="M 4 -27 L 15 -26 L 12 -24 L 2 -25 Z" fill="#1e1b4b" stroke={ink} strokeWidth="1.2" />
                </g>
              )}
              {badge === 'detective' && (
                <g>
                  <path d="M -12 -28 C -7 -36 8 -36 12 -28 Z" fill="#6b4423" stroke={ink} strokeWidth="1.6" />
                  <ellipse cx="2" cy="-27.5" rx="13" ry="2.6" fill="#523117" stroke={ink} strokeWidth="1.4" />
                </g>
              )}
              {badge === 'detainment' && (
                <rect x="-4" y="-22" width="14" height="4.5" rx="2" fill="#38bdf8" fillOpacity="0.65" stroke={ink} strokeWidth="1.1" />
              )}
            </g>
          </g>

          {/* FRONT LEG */}
          <g transform={`translate(-3.5, -31) rotate(${joints.rightHip.toFixed(1)})`}>
            <rect
              x="-4.4"
              y="0"
              width="8.8"
              height="16.5"
              rx="4"
              fill="#334155"
              stroke={ink}
              strokeWidth="1.8"
            />
            <g transform={`translate(0, 14) rotate(${joints.rightKnee.toFixed(1)})`}>
              <rect
                x="-4"
                y="0"
                width="8"
                height="15.5"
                rx="3.5"
                fill="#4a2e16"
                stroke={ink}
                strokeWidth="1.8"
              />
              <ellipse cx="2.8" cy="15.2" rx="6.5" ry="3.8" fill="#361f0e" stroke={ink} strokeWidth="1.7" />
            </g>
          </g>

          {/* FRONT ARM + HELD PROP */}
          <g transform={`translate(-5.5, -53) rotate(${joints.rightShoulder.toFixed(1)})`}>
            <rect
              x="-3.8"
              y="-1"
              width="7.6"
              height="15"
              rx="3.8"
              fill={outfit}
              stroke={ink}
              strokeWidth="1.8"
            />
            <g transform={`translate(0, 12) rotate(${joints.rightElbow.toFixed(1)})`}>
              <rect
                x="-3.2"
                y="-1"
                width="6.4"
                height="13.5"
                rx="3"
                fill={outfit}
                stroke={ink}
                strokeWidth="1.7"
              />
              <circle cx="0" cy="13.5" r="3.6" fill={skin} stroke={ink} strokeWidth="1.6" />
              {pose !== 'wave' && pose !== 'walk' && (
                <HeldItemSvg prop={prop} accent={accent} />
              )}
            </g>
          </g>
        </g>
      </g>

      {/* FLOATING SPEECH / EMOTE BUBBLE WHEN CHATTING OR WAVING */}
      {isTalking && speechText ? (
        <g transform={`translate(0, ${(-102 * scale).toFixed(1)})`}>
          {(() => {
            const boxW = Math.min(200, Math.max(96, speechText.length * 4.8 + 18));
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
        <g transform={`translate(0, ${(-100 * scale).toFixed(1)})`}>
          <circle cx="0" cy="-9" r="12" fill="#fff8e7" stroke="#d97706" strokeWidth="1.8" />
          <text x="0" y="-5" textAnchor="middle" fontSize="12">
            👋
          </text>
        </g>
      ) : isSelected ? (
        <g transform={`translate(0, ${(-100 * scale).toFixed(1)})`}>
          <circle cx="0" cy="-9" r="11" fill="#fef3c7" stroke="#d97706" strokeWidth="1.8" />
          <text x="0" y="-5" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#78350f">
            {showStandbyBadge ? '⏸' : '★'}
          </text>
        </g>
      ) : null}

      {/* NAMEPLATE UNDER FEET */}
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
        <text x="0" y="3" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#fbe8b5">
          {name}
        </text>
      </g>
    </g>
  );
}
