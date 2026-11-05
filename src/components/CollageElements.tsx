/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

// Muted 8-Pointed slate-navy geometric paper star from the peg flyer
export const PaperStar: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 44 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    className={`drop-shadow-[1px_2px_0px_rgba(0,0,0,0.18)] select-none pointer-events-none ${className}`}
  >
    <polygon
      points="50,0 60,35 95,15 75,48 100,70 65,72 65,100 45,75 10,95 28,60 0,45 35,42"
      fill="#23354D"
    />
  </svg>
);

// Pressed dried daisy flower from top-left of the peg flyer
export const PressedDaisy: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 52 }) => (
  <div className={`relative select-none pointer-events-none ${className}`} style={{ width: size, height: size }}>
    <svg viewBox="0 0 100 100" width={size} height={size} className="drop-shadow-[1px_2px_2px_rgba(0,0,0,0.12)]">
      {[...Array(16)].map((_, i) => {
        const angle = (i * 360) / 16;
        return (
          <ellipse
            key={i}
            cx="50"
            cy="24"
            rx="6.5"
            ry="20"
            fill="#C9AF85"
            opacity="0.88"
            transform={`rotate(${angle} 50 50)`}
          />
        );
      })}
      <circle cx="50" cy="50" r="13" fill="#7A6038" />
      <circle cx="50" cy="50" r="9" fill="#5E4724" />
      <circle cx="48" cy="48" r="3.5" fill="#C9AF85" opacity="0.6" />
    </svg>
  </div>
);

// Washi Tape strip for photo / cutout corners
export const TapeStrip: React.FC<{ className?: string; rotation?: string }> = ({
  className = '',
  rotation = '-rotate-6',
}) => (
  <div
    className={`h-3.5 w-11 bg-amber-50/80 border-y border-amber-200/70 shadow-2xs backdrop-blur-2xs pointer-events-none select-none z-20 ${rotation} ${className}`}
  />
);

// Single Hand-crafted Cat Paw Print SVG (crisp and scalable)
export const CatPawSvg: React.FC<{
  size?: number;
  color?: string;
  className?: string;
}> = ({ size = 32, color = '#C9A86A', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none pointer-events-none drop-shadow-[1px_1px_1px_rgba(0,0,0,0.12)] ${className}`}
  >
    {/* Metacarpal Palm Pad with natural indented top and rounded bottom lobes */}
    <path
      d="M18 15.5C13.5 15.5 11 18.2 11.5 22C12 25.8 14.8 28 18 28C21.2 28 24 25.8 24.5 22C25 18.2 22.5 15.5 18 15.5Z"
      fill={color}
    />
    {/* Subtle highlight sheen */}
    <path
      d="M18 17.5C16.8 17.5 15.2 18.3 14 19.5C15.2 18.7 16.8 19 18 20C19.2 19 20.8 18.7 22 19.5C20.8 18.3 19.2 17.5 18 17.5Z"
      fill="#FAF7F2"
      opacity="0.3"
    />
    {/* 4 distinct cat toe beans */}
    <ellipse cx="8.5" cy="14" rx="2.8" ry="4" transform="rotate(-24 8.5 14)" fill={color} />
    <ellipse cx="14" cy="9.5" rx="3" ry="4.5" transform="rotate(-8 14 9.5)" fill={color} />
    <ellipse cx="22" cy="9.5" rx="3" ry="4.5" transform="rotate(8 22 9.5)" fill={color} />
    <ellipse cx="27.5" cy="14" rx="2.8" ry="4" transform="rotate(24 27.5 14)" fill={color} />
  </svg>
);

// Noticeably bigger paw prints trail walking across the header
export const PawTrail: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex flex-col items-center gap-2.5 select-none pointer-events-none opacity-85 ${className}`}>
    <div className="transform -rotate-15">
      <CatPawSvg size={36} color="#C9A86A" />
    </div>
    <div className="transform rotate-12 ml-4">
      <CatPawSvg size={30} color="#C97A56" />
    </div>
    <div className="transform -rotate-8 ml-1">
      <CatPawSvg size={34} color="#C9A86A" />
    </div>
    <div className="transform rotate-18 ml-5">
      <CatPawSvg size={28} color="#B59353" />
    </div>
  </div>
);

// Ultimate Frisbee Disc Sticker with concentric flight rings and 175g stamp
export const FrisbeeDisc: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 78,
}) => (
  <div
    className={`relative select-none pointer-events-none drop-shadow-[2px_3px_3px_rgba(0,0,0,0.18)] ${className}`}
    style={{ width: size, height: size }}
  >
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer beveled rim of disc */}
      <circle cx="50" cy="50" r="48" fill="#2E5B70" stroke="#1D3E4F" strokeWidth="2.5" />
      {/* Rim bevel reflection / highlight ring */}
      <circle cx="50" cy="50" r="44.5" stroke="#487E98" strokeWidth="2" fill="none" opacity="0.8" />
      <circle cx="50" cy="50" r="42" stroke="#214557" strokeWidth="1.5" fill="none" />

      {/* Flight plate base */}
      <circle cx="50" cy="50" r="40" fill="#244B5E" />

      {/* Iconic concentric tactile flight rings (Discraft style) */}
      <circle cx="50" cy="50" r="37" stroke="#487E98" strokeWidth="1" strokeDasharray="3 1.5" fill="none" opacity="0.65" />
      <circle cx="50" cy="50" r="33.5" stroke="#487E98" strokeWidth="1" strokeDasharray="4 2" fill="none" opacity="0.75" />
      <circle cx="50" cy="50" r="30" stroke="#487E98" strokeWidth="1" fill="none" opacity="0.8" />
      <circle cx="50" cy="50" r="26.5" stroke="#203E4E" strokeWidth="1" fill="none" />

      {/* Center foil stamp plate */}
      <circle cx="50" cy="50" r="22" fill="#FAF7F2" stroke="#E2DACB" strokeWidth="1" />
      <circle cx="50" cy="50" r="19" stroke="#C97A56" strokeWidth="1" fill="none" strokeDasharray="2 1" />

      {/* Center Stamp Graphic & Typography */}
      <path
        d="M40 45 C43 41 57 41 60 45 C56 47 44 47 40 45 Z"
        fill="#C97A56"
      />
      {/* Mini flying disc silhouette */}
      <ellipse cx="50" cy="46" rx="6" ry="2.2" fill="#2E5B70" />
      <path d="M44 49 C47 50 53 50 56 49" stroke="#2E5B70" strokeWidth="0.8" strokeLinecap="round" />

      {/* "ULTIMATE" text */}
      <text
        x="50"
        y="56"
        textAnchor="middle"
        fontSize="6.2"
        fontFamily="sans-serif"
        fontWeight="800"
        letterSpacing="0.08em"
        fill="#23354D"
      >
        ULTIMATE
      </text>

      {/* "175g" weight stamp */}
      <text
        x="50"
        y="62.5"
        textAnchor="middle"
        fontSize="4.8"
        fontFamily="sans-serif"
        fontWeight="700"
        letterSpacing="0.05em"
        fill="#C97A56"
      >
        175g • DISC
      </text>

      {/* Subtle top glare gloss highlight */}
      <path
        d="M26 28 C34 20 66 20 74 28 C66 23 34 23 26 28 Z"
        fill="#FFFFFF"
        opacity="0.3"
      />
    </svg>
  </div>
);

// Frisbee flying through the air with speed & wind trails and 3D aerodynamic perspective
export const FlyingFrisbee: React.FC<{ className?: string; width?: number; height?: number }> = ({
  className = '',
  width = 110,
  height = 58,
}) => (
  <div
    className={`relative select-none pointer-events-none drop-shadow-[3px_6px_6px_rgba(0,0,0,0.20)] ${className}`}
    style={{ width, height }}
  >
    <svg
      width={width}
      height={height}
      viewBox="0 0 125 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="flyingFrisbeeDome" x1="45" y1="18" x2="110" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B738E" />
          <stop offset="45%" stopColor="#2E5B70" />
          <stop offset="100%" stopColor="#1E3E4E" />
        </linearGradient>
        <linearGradient id="flyingFrisbeeRim" x1="45" y1="36" x2="110" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#244B5D" />
          <stop offset="100%" stopColor="#142B36" />
        </linearGradient>
        <linearGradient id="flyingFrisbeeBadge" x1="60" y1="26" x2="95" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F5EFE6" />
        </linearGradient>
      </defs>

      {/* Trailing Wind & Motion Streaks behind the flight path */}
      <path
        d="M6 21 C22 20 38 23 52 27"
        stroke="#8CB6C9"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="18 8"
        opacity="0.65"
      />
      <path
        d="M2 33 C20 32 40 34 60 38"
        stroke="#C97A56"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="24 10"
        opacity="0.75"
      />
      <path
        d="M12 45 C28 45 42 46 56 48"
        stroke="#8CB6C9"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray="14 7"
        opacity="0.5"
      />

      {/* Speed particles */}
      <circle cx="16" cy="25" r="1.3" fill="#FAF7F2" opacity="0.8" />
      <circle cx="8" cy="38" r="1.1" fill="#FAF7F2" opacity="0.7" />
      <circle cx="28" cy="18" r="0.9" fill="#C97A56" opacity="0.9" />

      {/* Flying Disc tilted for aerodynamic forward lift */}
      <g transform="rotate(-6 82 35)">
        {/* Lower rim bevel depth (3D underside lip) */}
        <path
          d="M48 34 C48 44 64 51 84 51 C104 51 120 44 120 34 C120 39 104 47 84 47 C64 47 48 39 48 34 Z"
          fill="url(#flyingFrisbeeRim)"
        />

        {/* Main outer rim disc body */}
        <ellipse cx="84" cy="33" rx="36" ry="15" fill="url(#flyingFrisbeeDome)" stroke="#1D3E4F" strokeWidth="1.5" />

        {/* Aerodynamic leading-edge highlight reflection */}
        <path
          d="M54 26 C66 21 102 21 114 26 C102 23 66 23 54 26 Z"
          fill="#FFFFFF"
          opacity="0.35"
        />

        {/* Concentric tactile flight rings */}
        <ellipse cx="84" cy="33" rx="31.5" ry="12.5" stroke="#5A95AF" strokeWidth="1" fill="none" opacity="0.6" strokeDasharray="3 1.5" />
        <ellipse cx="84" cy="33" rx="27" ry="10.2" stroke="#5A95AF" strokeWidth="1" fill="none" opacity="0.7" strokeDasharray="4 2" />
        <ellipse cx="84" cy="33" rx="22.5" ry="8.2" stroke="#487E98" strokeWidth="1" fill="none" opacity="0.8" />
        <ellipse cx="84" cy="33" rx="18" ry="6.2" stroke="#1D3E4F" strokeWidth="0.8" fill="none" />

        {/* Center hot stamp plate */}
        <ellipse cx="84" cy="33" rx="14.5" ry="5.2" fill="url(#flyingFrisbeeBadge)" stroke="#E2DACB" strokeWidth="0.8" />
        <ellipse cx="84" cy="33" rx="12.5" ry="4.2" stroke="#C97A56" strokeWidth="0.7" strokeDasharray="2 1" fill="none" />

        {/* Center hot stamp text & typography */}
        <text
          x="84"
          y="33.8"
          textAnchor="middle"
          fontSize="4"
          fontFamily="sans-serif"
          fontWeight="800"
          letterSpacing="0.08em"
          fill="#1E3A5F"
        >
          ULTIMATE
        </text>
        <text
          x="84"
          y="36.5"
          textAnchor="middle"
          fontSize="2.8"
          fontFamily="sans-serif"
          fontWeight="700"
          letterSpacing="0.05em"
          fill="#C97A56"
        >
          175g FLYER
        </text>
      </g>
    </svg>
  </div>
);


// Doctor's Stethoscope Sticker with binaural arch, Y-tubing, and dual-head chestpiece
export const Stethoscope: React.FC<{ className?: string; width?: number; height?: number }> = ({
  className = '',
  width = 72,
  height = 84,
}) => (
  <div
    className={`relative select-none pointer-events-none drop-shadow-[2px_3px_3px_rgba(0,0,0,0.16)] ${className}`}
    style={{ width, height }}
  >
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 95"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Binaural Ear Tubes (metallic chrome) */}
      <path
        d="M25 10 C25 18 32 26 38 29"
        stroke="#94A3B8"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M25 10 C25 18 32 26 38 29"
        stroke="#CBD5E1"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M55 10 C55 18 48 26 42 29"
        stroke="#94A3B8"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M55 10 C55 18 48 26 42 29"
        stroke="#CBD5E1"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Ear tips (soft silicone/rubber) */}
      <ellipse cx="24" cy="9" rx="3.5" ry="2.5" fill="#1E293B" transform="rotate(-20 24 9)" />
      <ellipse cx="56" cy="9" rx="3.5" ry="2.5" fill="#1E293B" transform="rotate(20 56 9)" />

      {/* Tension spring bar bridging binaural tubes */}
      <path d="M30 20 C36 22 44 22 50 20" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />

      {/* Y-Yoke connection piece */}
      <rect x="37" y="28" width="6" height="5" rx="1.5" fill="#475569" />

      {/* Flexible Navy acoustic tubing curving in an elegant loop */}
      <path
        d="M40 33 C40 45 68 45 68 62 C68 76 46 80 34 68 C24 57 32 44 26 50 C20 56 22 75 38 86 C50 94 65 86 65 74"
        stroke="#1E3A5F"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Tube highlight line */}
      <path
        d="M40 33 C40 45 68 45 68 62 C68 76 46 80 34 68 C24 57 32 44 26 50 C20 56 22 75 38 86 C50 94 65 86 65 74"
        stroke="#4B6E96"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.7"
      />

      {/* Stem connector leading to chestpiece */}
      <path d="M65 74 L68 76" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />

      {/* Dual Head Chestpiece (diaphragm + bell) */}
      <g transform="translate(68, 77)">
        {/* Bell side */}
        <ellipse cx="-2" cy="-2" rx="4" ry="7" fill="#64748B" transform="rotate(25)" />
        {/* Main diaphragm outer chrome bezel */}
        <ellipse cx="4" cy="4" rx="10" ry="12" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.8" transform="rotate(25)" />
        {/* Inner diaphragm rim */}
        <ellipse cx="4" cy="4" rx="8" ry="10" fill="#CBD5E1" stroke="#64748B" strokeWidth="1" transform="rotate(25)" />
        {/* Diaphragm center membrane */}
        <ellipse cx="4" cy="4" rx="5.5" ry="7" fill="#F8FAFC" transform="rotate(25)" />
        {/* Center dot */}
        <circle cx="4" cy="4" r="1.8" fill="#475569" />
      </g>
    </svg>
  </div>
);

// Hand-drawn curly doodle arrow from the peg
export const CurlyDoodleArrow: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 60 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-9 h-11 stroke-[#23354D] stroke-[2.5] stroke-linecap-round stroke-linejoin-round select-none pointer-events-none opacity-80 ${className}`}
  >
    <path d="M10,8 C40,-5 55,20 30,28 C15,33 12,48 40,55" />
    <path d="M30,55 L42,56 L38,44" />
  </svg>
);

// Polaroid Card with Medical Cross & Paw badge from the peg
export const MedSchoolPolaroid: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`bg-white p-2.5 pb-3.5 rounded-sm shadow-[2px_3px_5px_rgba(0,0,0,0.12)] border border-stone-200/90 transform -rotate-4 w-30 sm:w-34 select-none ${className}`}
  >
    <div className="bg-[#FAF9F5] border border-stone-200 aspect-square flex flex-col items-center justify-center p-2 rounded-2xs">
      <div className="relative w-11 h-11 flex items-center justify-center">
        <div className="absolute w-11 h-4.5 bg-[#23354D] rounded-xs" />
        <div className="absolute w-4.5 h-11 bg-[#23354D] rounded-xs" />
        <div className="absolute right-0 top-0 w-5.5 h-5.5 bg-[#5B7B9A] rounded-tr-xs" />
        <span className="relative z-10 text-white text-xs font-bold">🐾</span>
      </div>
      <span className="font-['Patrick_Hand'] text-[11px] font-bold text-slate-700 mt-2 tracking-tight">
        Dr. Emma • ASMPH
      </span>
    </div>
    <div className="text-center mt-1 font-['Patrick_Hand'] text-xs text-slate-700 font-bold">
      Future Doctor 🩺
    </div>
  </div>
);

/**
 * Magazine Cutout Letter Specification
 * Authentic scrapbook magazine design with scissor cuts, subtle textures,
 * corner tape, and star backdrop, but in a refined, less bright, desaturated palette.
 */
interface ScrapbookLetterConfig {
  char: string;
  bg: string;
  textColor: string;
  font: 'Patrick_Hand' | 'Plus_Jakarta_Sans';
  fontWeight: string;
  rotate: string;
  clipPath?: string;
  paperTexture?: 'newsprint' | 'halftone' | 'ruled' | 'plain';
  tape?: 'tl' | 'tr' | 'top' | 'none';
  starBackdrop?: boolean;
  border?: string;
  textShadow?: string;
}

// "SURPRISE!" scrapbook clippings in tasteful, muted, vintage magazine tones
const SURPRISE_SCRAPBOOK_LETTERS: ScrapbookLetterConfig[] = [
  {
    // 'S' - Dusty terracotta, subtle halftone, tape on corner
    char: 'S',
    bg: 'bg-[#C97A56]',
    textColor: 'text-[#FDFBF7]',
    font: 'Plus_Jakarta_Sans',
    fontWeight: 'font-bold',
    rotate: '-rotate-4',
    clipPath: 'polygon(3% 2%, 97% 5%, 94% 96%, 6% 100%)',
    paperTexture: 'halftone',
    border: 'border-2 border-[#B26644]',
    textShadow: '1px 1px 0px rgba(0,0,0,0.25)',
    tape: 'tl',
  },
  {
    // 'U' - Vintage dusty denim blue, newsprint lines
    char: 'U',
    bg: 'bg-[#5B7B9A]',
    textColor: 'text-[#FBF7EE]',
    font: 'Patrick_Hand',
    fontWeight: 'font-bold',
    rotate: 'rotate-3',
    clipPath: 'polygon(0% 4%, 100% 0%, 96% 96%, 4% 92%)',
    paperTexture: 'newsprint',
    border: 'border-2 border-[#4A6782]',
    textShadow: '1px 1.5px 0px #2D4152',
  },
  {
    // 'R' - Dusty rose / mauve, subtle newsprint grain, deep wine ink
    char: 'R',
    bg: 'bg-[#B87B90]',
    textColor: 'text-[#4A1E29]',
    font: 'Plus_Jakarta_Sans',
    fontWeight: 'font-bold',
    rotate: '-rotate-3',
    clipPath: 'polygon(4% 0%, 96% 3%, 100% 97%, 0% 95%)',
    paperTexture: 'newsprint',
    border: 'border-2 border-[#A1677B]',
    textShadow: '1px 1px 0px #EBD8DE',
  },
  {
    // 'P' - Muted antique mustard / ochre, torn bottom edge
    char: 'P',
    bg: 'bg-[#C9A86A]',
    textColor: 'text-[#1E293B]',
    font: 'Plus_Jakarta_Sans',
    fontWeight: 'font-bold',
    rotate: 'rotate-4',
    clipPath: 'polygon(0% 0%, 100% 0%, 98% 86%, 86% 95%, 72% 87%, 56% 97%, 42% 88%, 26% 96%, 12% 88%, 0% 93%)',
    paperTexture: 'plain',
    border: 'border border-[#B59353]',
    textShadow: '1px 1px 0px #EFE3C9',
  },
  {
    // 'R' - Muted sage / olive-mint, coral-brick ink, tape on top right
    char: 'R',
    bg: 'bg-[#7B9B88]',
    textColor: 'text-[#5C2320]',
    font: 'Patrick_Hand',
    fontWeight: 'font-bold',
    rotate: '-rotate-3',
    clipPath: 'polygon(2% 2%, 98% 0%, 95% 98%, 3% 94%)',
    paperTexture: 'newsprint',
    border: 'border-2 border-[#678573]',
    textShadow: '1px 1px 0px #E2ECE5',
    tape: 'tr',
  },
  {
    // 'I' - Muted vintage berry / dusty crimson, crisp ivory sans
    char: 'I',
    bg: 'bg-[#9E4349]',
    textColor: 'text-[#FFFFFF]',
    font: 'Plus_Jakarta_Sans',
    fontWeight: 'font-bold',
    rotate: 'rotate-2',
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    paperTexture: 'plain',
    border: 'border-2 border-[#85343A]',
    textShadow: '1px 1px 0px rgba(0,0,0,0.3)',
  },
  {
    // 'S' - Tea-stained parchment, ruled lines, slate navy ink
    char: 'S',
    bg: 'bg-[#E8DCC4]',
    textColor: 'text-[#23354D]',
    font: 'Plus_Jakarta_Sans',
    fontWeight: 'font-bold',
    rotate: '-rotate-4',
    clipPath: 'polygon(3% 6%, 97% 0%, 94% 94%, 5% 98%)',
    paperTexture: 'ruled',
    border: 'border-2 border-[#D4C5A8]',
    textShadow: '1px 1px 0px rgba(255,255,255,0.7)',
  },
  {
    // 'E' - Warm antique almond parchment card with dark slate navy paper star bursting behind it!
    char: 'E',
    bg: 'bg-[#F0E6D2]',
    textColor: 'text-[#1A2E40]',
    font: 'Plus_Jakarta_Sans',
    fontWeight: 'font-bold',
    rotate: 'rotate-3',
    clipPath: 'polygon(0% 2%, 96% 0%, 98% 96%, 2% 98%)',
    paperTexture: 'newsprint',
    border: 'border-2 border-[#D6C7AE]',
    textShadow: '1px 1px 0px rgba(0,0,0,0.2)',
    starBackdrop: true,
  },
  {
    // '!' - Dusty vintage lavender / heather with tape across top
    char: '!',
    bg: 'bg-[#8A7B92]',
    textColor: 'text-[#FBF7EE]',
    font: 'Patrick_Hand',
    fontWeight: 'font-bold',
    rotate: '-rotate-6',
    clipPath: 'polygon(6% 0%, 94% 4%, 100% 98%, 0% 94%)',
    paperTexture: 'plain',
    border: 'border-2 border-[#73647B]',
    textShadow: '1px 1px 0px #4E3E56',
    tape: 'top',
  },
];

// "EMMA" scrapbook clippings in matching muted tones
const EMMA_SCRAPBOOK_LETTERS: ScrapbookLetterConfig[] = [
  {
    // 'E' - Antique ochre paper scrap
    char: 'E',
    bg: 'bg-[#C9A86A]',
    textColor: 'text-[#1E293B]',
    font: 'Plus_Jakarta_Sans',
    fontWeight: 'font-bold',
    rotate: '-rotate-3',
    clipPath: 'polygon(0% 2%, 96% 0%, 98% 96%, 2% 98%)',
    paperTexture: 'newsprint',
    border: 'border-2 border-[#B59353]',
    textShadow: '1px 1px 0px #EFE3C9',
  },
  {
    // 'M' - Muted vintage slate blue, stark white letter
    char: 'M',
    bg: 'bg-[#5B7B9A]',
    textColor: 'text-[#FFFFFF]',
    font: 'Plus_Jakarta_Sans',
    fontWeight: 'font-bold',
    rotate: 'rotate-3',
    clipPath: 'polygon(2% 4%, 98% 0%, 96% 96%, 0% 100%)',
    paperTexture: 'halftone',
    border: 'border-2 border-[#4A6782]',
    textShadow: '1.5px 1.5px 0px #2D4152',
  },
  {
    // 'M' - Dusty rose mauve, deep plum ink
    char: 'M',
    bg: 'bg-[#B87B90]',
    textColor: 'text-[#4A1E29]',
    font: 'Patrick_Hand',
    fontWeight: 'font-bold',
    rotate: '-rotate-2',
    clipPath: 'polygon(4% 0%, 96% 5%, 92% 96%, 5% 94%)',
    paperTexture: 'ruled',
    border: 'border-2 border-[#A1677B]',
    textShadow: '1px 1px 0px #EBD8DE',
  },
  {
    // 'A' - Deep muted slate navy (inverted scrap), terracotta letter, tape on corner
    char: 'A',
    bg: 'bg-[#2B3E52]',
    textColor: 'text-[#E59775]',
    font: 'Plus_Jakarta_Sans',
    fontWeight: 'font-bold',
    rotate: 'rotate-4',
    clipPath: 'polygon(0% 4%, 100% 0%, 96% 96%, 2% 94%)',
    paperTexture: 'newsprint',
    border: 'border-2 border-stone-300/60',
    textShadow: '1px 1px 0px #15222E',
    tape: 'tr',
  },
];

/**
 * Individual Scrapbook Cutout Letter
 * Strict consistency in size & font sizing across all letters.
 */
export const ScrapbookLetter: React.FC<{
  config: ScrapbookLetterConfig;
  sizeClass?: string;
  textSizeClass?: string;
}> = ({
  config,
  sizeClass = 'w-9 h-11.5 sm:w-11 sm:h-14',
  textSizeClass = 'text-2xl sm:text-3xl',
}) => {
  return (
    <div className="relative inline-flex items-center justify-center group select-none">
      {/* Dark Slate Navy Star Backdrop on 'E' (like 't' in the peg flyer) */}
      {config.starBackdrop && (
        <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 z-0 transform rotate-12 scale-85 sm:scale-100 pointer-events-none">
          <PaperStar size={46} />
        </div>
      )}

      {/* Main Cutout Scrap */}
      <div
        className={`relative z-10 inline-flex items-center justify-center ${sizeClass} ${config.bg} ${config.border || ''} ${config.rotate} rounded-xs shadow-[2px_2.5px_0px_rgba(0,0,0,0.16)] transform transition-transform duration-150 group-hover:scale-110 group-hover:rotate-0 cursor-default overflow-hidden`}
        style={{ clipPath: config.clipPath }}
      >
        {/* Subtle Paper Textures */}
        {config.paperTexture === 'newsprint' && (
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.5) 3px, rgba(0,0,0,0.5) 4px)',
            }}
          />
        )}
        {config.paperTexture === 'halftone' && (
          <div
            className="absolute inset-0 opacity-12 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(0,0,0,0.35) 15%, transparent 16%)',
              backgroundSize: '4px 4px',
            }}
          />
        )}
        {config.paperTexture === 'ruled' && (
          <div
            className="absolute inset-0 opacity-12 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(180deg, transparent, transparent 5px, rgba(35,53,77,0.35) 5px, rgba(35,53,77,0.35) 6px)',
            }}
          />
        )}

        {/* The Letter Text */}
        <span
          className={`relative z-10 ${config.textColor} ${config.fontWeight} ${textSizeClass} leading-none tracking-normal`}
          style={{
            fontFamily: config.font === 'Patrick_Hand' ? "'Patrick Hand', cursive" : "'Plus Jakarta Sans', sans-serif",
            textShadow: config.textShadow || undefined,
          }}
        >
          {config.char}
        </span>
      </div>

      {/* Corner Washi Tape Details */}
      {config.tape === 'tl' && (
        <div className="absolute -top-1 -left-1 z-20 w-4 sm:w-5 h-2 bg-amber-50/85 border border-amber-200/80 -rotate-25 shadow-2xs pointer-events-none" />
      )}
      {config.tape === 'tr' && (
        <div className="absolute -top-1 -right-1 z-20 w-4 sm:w-5 h-2 bg-amber-50/85 border border-amber-200/80 rotate-25 shadow-2xs pointer-events-none" />
      )}
      {config.tape === 'top' && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-20 w-4.5 sm:w-5.5 h-2 bg-amber-50/85 border border-amber-200/80 rotate-2 shadow-2xs pointer-events-none" />
      )}
    </div>
  );
};

// Main Poster Header ("SURPRISE! EMMA") with authentic scrapbook styling & muted, desaturated tones
export const RansomTitle: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 select-none ${className}`}>
    {/* Line 1: "SURPRISE!" */}
    <div className="flex flex-wrap items-center justify-center -space-x-1 sm:-space-x-1 px-1">
      {SURPRISE_SCRAPBOOK_LETTERS.map((config, idx) => (
        <ScrapbookLetter key={idx} config={config} />
      ))}
    </div>

    {/* Line 2: "EMMA" - Exactly matching letter dimensions and font sizes */}
    <div className="flex items-center justify-center -space-x-1 sm:-space-x-1 mt-1 sm:mt-1.5">
      {EMMA_SCRAPBOOK_LETTERS.map((config, idx) => (
        <ScrapbookLetter key={idx} config={config} />
      ))}
    </div>
  </div>
);

// Compact Navigation Header Letters
export const ScrapbookNavLetters: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className="inline-flex items-center -space-x-0.5 select-none">
    {EMMA_SCRAPBOOK_LETTERS.map((config, idx) => (
      <ScrapbookLetter
        key={idx}
        config={config}
        sizeClass="w-6 h-7.5 sm:w-7 sm:h-8.5"
        textSizeClass="text-xs sm:text-sm"
      />
    ))}
  </div>
);
