// Standard chunky hand-crafted SVG paths for letters A-Z (viewBox 0 0 100 100)
export const LETTERS_PATHS: Record<string, string> = {
  'A': 'M20,90 Q12,50 50,12 Q88,50 80,90 Q50,85 20,90 Z M50,38 Q60,38 58,58 Q50,64 42,58 Q40,38 50,38 Z',
  'B': 'M15,10 Q50,12 78,24 Q86,40 68,50 Q88,62 76,86 Q40,92 15,90 Z M40,26 Q55,27 55,38 Q40,40 40,26 Z M40,56 Q60,58 60,74 Q40,78 40,56 Z',
  'C': 'M82,26 Q55,8 28,30 Q10,52 28,78 Q55,96 82,82 Q72,66 54,66 Q38,56 42,42 Q48,34 68,34 Z',
  'D': 'M18,10 Q55,12 86,34 Q96,65 76,86 Q40,90 18,88 Z M40,28 Q66,30 66,54 Q66,74 40,70 Z',
  'E': 'M20,10 H80 V28 H46 V42 H74 V58 H46 V72 H80 V90 H20 Z',
  'F': 'M20,10 H80 V28 H46 V48 H72 V66 H46 V90 H20 Z',
  'G': 'M82,24 Q55,8 28,30 Q10,52 28,78 Q55,96 82,84 V52 H54 V70 H70 V75 Q55,83 44,70 Q34,54 44,38 Q55,25 72,34 Z',
  'H': 'M15,10 H38 V45 H62 V10 H85 V90 H62 V58 H38 V90 H15 Z',
  'I': 'M30,10 H70 V26 H55 V74 H70 V90 H30 V74 H45 V26 H30 Z',
  'J': 'M75,10 H52 V62 Q52,78 32,78 Q18,74 18,60 H40 Q40,66 45,64 Q48,58 48,50 V10 H75 Z',
  'K': 'M20,10 H42 V45 L68,15 H94 L58,50 L95,90 H70 L42,58 V90 H20 Z',
  'L': 'M20,10 H42 V70 H80 V90 H20 Z',
  'M': 'M15,10 H38 L50,42 L62,10 H85 V90 H65 V45 L55,75 H45 L35,45 V90 H15 Z',
  'N': 'M15,10 H38 L68,60 V10 H90 V90 H68 L38,38 V90 H15 Z',
  'O': 'M50,10 Q85,10 85,50 Q85,90 50,90 Q15,90 15,50 Q15,10 50,10 Z M50,30 Q63,30 63,50 Q63,70 50,70 Q37,70 37,50 Q37,30 50,30 Z',
  'P': 'M18,10 H68 Q88,10 88,38 Q82,62 50,62 H40 V90 H18 Z M40,25 H55 Q63,25 63,40 Q63,48 50,48 H40 Z',
  'Q': 'M50,10 Q85,10 85,50 Q85,85 50,88 Q40,89 30,94 H20 L28,84 Q15,80 15,50 Q15,10 50,10 Z M50,32 Q63,32 63,50 Q63,68 50,68 Q37,68 37,50 Q37,32 50,32 Z',
  'R': 'M18,10 H65 Q85,10 85,38 Q80,55 58,58 L85,90 H60 L38,62 H40 V90 H18 Z M40,24 H52 Q62,24 62,38 Q62,45 48,45 H40 Z',
  'S': 'M82,25 Q70,12 50,12 Q25,12 25,32 Q25,48 50,52 Q72,55 72,70 Q72,82 50,82 Q28,82 20,68 H42 Q45,70 52,70 Q60,70 60,60 Q60,53 45,50 Q20,44 20,28 Q20,10 50,10 Q80,10 85,25 Z',
  'T': 'M15,10 H85 V30 H62 V90 H38 V30 H15 Z',
  'U': 'M15,10 H38 V62 Q38,72 50,72 Q62,72 62,62 V10 H85 V62 Q85,90 50,90 Q15,90 15,62 Z',
  'V': 'M12,10 H36 L50,66 L64,10 H88 L64,90 H36 Z',
  'W': 'M8,10 H28 L38,62 L48,15 H68 L78,62 L88,10 H108 L92,90 H72 L60,42 L48,90 H28 Z',
  'X': 'M15,10 H38 L50,42 L62,10 H85 L60,50 L85,90 H62 L50,58 L38,90 H15 L40,50 Z',
  'Y': 'M15,10 H38 L50,48 L62,10 H85 L58,58 V90 H42 V58 Z',
  'Z': 'M15,10 H85 V28 L40,72 H85 V90 H15 V72 L60,28 H15 Z',
};

// Default centers for adding facial decorations inside holes or on coordinates in a 100x100 space
export const LETTER_CENTERS: Record<string, { x: number; y: number; type: 'center' | 'hole' | 'top' }> = {
  'A': { x: 50, y: 48, type: 'hole' },
  'B': { x: 48, y: 33, type: 'hole' }, // upper hole
  'C': { x: 45, y: 50, type: 'center' },
  'D': { x: 52, y: 50, type: 'hole' },
  'E': { x: 30, y: 50, type: 'center' },
  'F': { x: 30, y: 40, type: 'center' },
  'G': { x: 45, y: 45, type: 'center' },
  'H': { x: 50, y: 50, type: 'center' },
  'I': { x: 50, y: 50, type: 'center' },
  'J': { x: 55, y: 40, type: 'center' },
  'K': { x: 35, y: 50, type: 'center' },
  'L': { x: 30, y: 60, type: 'center' },
  'M': { x: 50, y: 50, type: 'center' },
  'N': { x: 50, y: 50, type: 'center' },
  'O': { x: 50, y: 50, type: 'hole' },
  'P': { x: 51, y: 36, type: 'hole' },
  'Q': { x: 50, y: 50, type: 'hole' },
  'R': { x: 51, y: 36, type: 'hole' },
  'S': { x: 50, y: 50, type: 'center' },
  'T': { x: 50, y: 20, type: 'center' },
  'U': { x: 50, y: 45, type: 'center' },
  'V': { x: 50, y: 38, type: 'center' },
  'W': { x: 50, y: 38, type: 'center' },
  'X': { x: 50, y: 50, type: 'center' },
  'Y': { x: 50, y: 32, type: 'center' },
  'Z': { x: 50, y: 50, type: 'center' },
};

export const GRADIENT_PRESETS: import('../types').GradientStyle[] = [
  { id: 'sunset-orange', name: 'Arancione Sole', from: '#ff9000', to: '#ff3d00', textColor: '#ffffff' },
  { id: 'bubblegum-pink', name: 'Bubblegum Rosa', from: '#ff3366', to: '#ff00cc', textColor: '#ffffff' },
  { id: 'neon-slime', name: 'Slime Verde', from: '#a6ff00', to: '#00e676', textColor: '#10172a' },
  { id: 'coral-sunset', name: 'Tramonto Corallo', from: '#ff416c', to: '#ff4b2b', textColor: '#ffffff' },
  { id: 'cosmic-purple', name: 'Cosmo Viola', from: '#7b2ff7', to: '#f107a3', textColor: '#ffffff' },
  { id: 'ocean-aqua', name: 'Acqua Marina', from: '#00f2fe', to: '#4facfe', textColor: '#ffffff' },
  { id: 'gold-lemon', name: 'Limone Dorato', from: '#fdd835', to: '#f57c00', textColor: '#10172a' },
  { id: 'toxic-hazard', name: 'Tossico Giallo', from: '#ffeb3b', to: '#4caf50', textColor: '#10172a' },
  { id: 'monster-magenta', name: 'Super Magenta', from: '#e91e63', to: '#9c27b0', textColor: '#ffffff' },
  { id: 'custom', name: 'Personalizzato...', from: '#ff007f', to: '#7f00ff', textColor: '#ffffff' }
];

// SVG paths for HORN types, relative to a center point or placed on top (y is top of letter around 10)
export const HORNS_VECTOR = {
  devil: [
    // Left horn, Right horn
    { d: 'M25,12 C18,2 8,10 12,25 C16,20 22,17 25,12 Z', fill: 'currentColor' },
    { d: 'M75,12 C82,2 92,10 88,25 C84,20 78,17 75,12 Z', fill: 'currentColor' }
  ],
  ears: [
    // Round shrek/alien ears or cute puppy ears
    { d: 'M18,18 Q5,5 2,22 Q5,28 15,22 Z', fill: 'currentColor' },
    { d: 'M82,18 Q95,5 98,22 Q95,28 85,22 Z', fill: 'currentColor' }
  ],
  spikes: [
    // Three cool jagged dinosaur spines on top
    { d: 'M35,10 L50,-4 L65,10 Z', fill: 'currentColor' },
    { d: 'M15,18 L26,8 L37,18 Z', fill: 'currentColor' },
    { d: 'M63,18 L74,8 L85,18 Z', fill: 'currentColor' }
  ],
  crown: [
    // Tiny sovereign crown
    { d: 'M40,12 L43,2 L50,8 L57,2 L60,12 Z', color: '#ffea00' }
  ],
  slug: [
    // Two high slug-like eyes antennae
    { d: 'M35,10 Q28,-5 34,-12 Q40,-12 40,-5 L41,10 Z' },
    { d: 'M65,10 Q72,-5 66,-12 Q60,-12 60,-5 L59,10 Z' },
    // Tiny eyeball bulbs at the tips
    { cx: 34, cy: -11, r: 4, fill: '#fff' },
    { cx: 34, cy: -11, r: 1.8, fill: '#000' },
    { cx: 66, cy: -11, r: 4, fill: '#fff' },
    { cx: 66, cy: -11, r: 1.8, fill: '#000' }
  ]
};

// SVG components/coordinates for customizable eyes
export const DRAW_EYE = (x: number, y: number, r: number, style: string, index: number) => {
  const pupilOffset = style === 'googly' 
    ? { x: index % 2 === 0 ? -r/3 : r/4, y: r/3 } 
    : style === 'angry' 
      ? { x: 0, y: -r/6 } 
      : style === 'cute' 
        ? { x: -r/10, y: -r/10 } 
        : { x: 0, y: 0 };

  return {
    white: { cx: x, cy: y, r: r },
    pupil: { cx: x + pupilOffset.x, cy: y + pupilOffset.y, r: r * 0.45 },
    shimmer: style === 'cute' ? [
      { cx: x - r/3, cy: y - r/3, r: r * 0.2, fill: '#fff' },
      { cx: x + r/4, cy: y + r/4, r: r * 0.1, fill: '#fff' }
    ] : [
      { cx: x - r/4, cy: y - r/4, r: r * 0.15, fill: '#fff' }
    ],
    lid: style === 'angry' ? {
      d: `M${x - r - 2},${y - r/2} L${x + r + 2},${y - r} L${x + r + 2},${y - r - 3} L${x - r - 2},${y - r - 3} Z`,
      fill: 'currentColor'
    } : null,
    cuteLashes: style === 'cute' ? [
      { x1: x - r * 0.8, y1: y - r * 0.5, x2: x - r * 1.2, y2: y - r * 0.9 },
      { x1: x + r * 0.8, y1: y - r * 0.5, x2: x + r * 1.2, y2: y - r * 0.9 }
    ] : null
  };
};

export const TEETH_VECTOR = {
  fangs: [
    // Two drooping sharp vampire teeth
    { d: 'M38,5 Q38,18 43,18 Q45,15 45,5 Z', fill: '#ffffff' },
    { d: 'M62,5 Q62,18 57,18 Q55,15 55,5 Z', fill: '#ffffff' }
  ],
  sharp: [
    // Zipper tooth or spiky monster elements
    { d: 'M30,5 L35,16 L40,5 L45,16 L50,5 L55,16 L65,5 L70,16 L75,5', fill: 'none', stroke: '#ffffff', strokeWidth: 2 }
  ],
  underbite: [
    // Big lower jaw tooth peeking up
    { d: 'M45,95 L50,78 L55,95 Z', fill: '#ffffff' },
    { d: 'M32,92 L36,80 L40,92 Z', fill: '#ffffff' },
    { d: 'M60,92 L64,80 L68,92 Z', fill: '#ffffff' }
  ],
  gummy: [
    // Cute pink tongue
    { d: 'M40,90 Q50,70 60,90 Q50,95 40,90 Z', fill: '#ff4081' }
  ]
};

export const DETAILS_VECTOR = {
  slime: [
    // Slime droplets dripping from bottom or points
    { d: 'M25,85 Q25,102 22,102 Q19,102 19,85 Z', fill: 'currentColor', opacity: 0.85 },
    { d: 'M50,83 Q50,110 46,110 Q42,110 42,83 Z', fill: 'currentColor', opacity: 0.85 },
    { d: 'M75,85 Q75,100 72,100 Q69,100 69,85 Z', fill: 'currentColor', opacity: 0.85 }
  ],
  spots: [
    // Five overlay design dots for monster body skin
    { cx: 30, cy: 30, r: 6, fill: '#000', opacity: 0.15 },
    { cx: 75, cy: 70, r: 8, fill: '#000', opacity: 0.15 },
    { cx: 70, cy: 25, r: 4, fill: '#000', opacity: 0.15 },
    { cx: 25, cy: 75, r: 5, fill: '#000', opacity: 0.15 }
  ],
  scales: [
    // Cute dragon skin scales pattern
    { d: 'M35,35 Q40,40 45,35 M50,45 Q55,50 60,45 M30,55 Q35,60 40,55', fill: 'none', stroke: '#000000', strokeOpacity: 0.2, strokeWidth: 2.5 }
  ],
  tail: [
    // Cute green or pink tail expanding out of bottom-right
    { d: 'M80,80 Q98,82 105,72 Q112,62 102,55 Q96,51 90,62 Q85,72 80,80 Z', fill: 'currentColor', outline: '3px solid #000' },
    // Tiny spikes on the tail
    { d: 'M101,58 L108,52 L103,64 Z', fill: '#ffeb3b' },
    { d: 'M106,66 L113,63 L107,71 Z', fill: '#ffeb3b' }
  ],
  wings: [
    // Left bat wing and right bat wing
    { d: 'M12,40 C-8,45 -12,20 -2,12 C2,22 8,30 12,40 Z M12,40 C-2,46 -4,55 0,60 C4,52 8,46 12,40 Z', fill: '#2A1A4A' },
    { d: 'M88,40 C108,45 112,20 102,12 C98,22 92,30 88,40 Z M88,40 C102,46 104,55 100,60 C96,52 92,46 88,40 Z', fill: '#2A1A4A' }
  ]
};
