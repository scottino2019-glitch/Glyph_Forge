export type EyeStyle = 'normal' | 'googly' | 'cyclops' | 'angry' | 'cute' | 'none';
export type HornStyle = 'none' | 'devil' | 'ears' | 'spikes' | 'crown' | 'slug';
export type TeethStyle = 'none' | 'fangs' | 'sharp' | 'underbite' | 'gummy';
export type DetailStyle = 'none' | 'spots' | 'scales' | 'slime' | 'tail' | 'wings';
export type AccessoryStyle = 'none' | 'glasses' | 'mustache' | 'bowtie' | 'blush';

export interface GradientStyle {
  id: string;
  name: string;
  from: string;
  to: string;
  textColor: string;
}

export interface LetterStyle {
  id: string; // unique for this letter in the word (e.g., position-based)
  char: string;
  eyeStyle: EyeStyle;
  eyeCount: number; // 0, 1, 2, 3
  eyePosition: 'top' | 'inside' | 'random';
  hornStyle: HornStyle;
  teethStyle: TeethStyle;
  detailStyle: DetailStyle;
  accessoryStyle?: AccessoryStyle;
  gradientId: string;
  gradientFrom?: string; // custom color override
  gradientTo?: string;   // custom color override
  strokeColor: string;
  strokeWidth: number;
  rotate: number; // e.g. -15 to 15 deg
  scale: number;  // e.g. 0.82 to 1.2
  offsetY: number; // e.g. -20 to 20 px for jumpy lettering
  isAnimated: boolean;
  animationType: 'jiggle' | 'bounce' | 'breath' | 'none';
}

export interface MonsterConfig {
  text: string;
  spacing: number; // letter spacing (-20 to 50)
  diversityMode?: 'asymmetric' | 'uniform';
  globalGradientId: string;
  globalEyeStyle: EyeStyle;
  globalEyeCount: number;
  globalHornStyle: HornStyle;
  globalTeethStyle: TeethStyle;
  globalDetailStyle: DetailStyle;
  globalAccessoryStyle?: AccessoryStyle;
  globalStrokeColor: string;
  globalStrokeWidth: number;
  globalGradientFrom?: string; // custom color start override globally
  globalGradientTo?: string;   // custom color end override globally
  letterOverrides: Record<number, Partial<LetterStyle>>; // index to style overloads
  backgroundColor: string;
  shadowColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
  fontSize: number;
}

export interface AiPromptResponse {
  success: boolean;
  isFallback?: boolean;
  config?: {
    globalGradientId?: string;
    customFrom?: string;
    customTo?: string;
    globalEyeStyle?: EyeStyle;
    globalEyeCount?: number;
    globalHornStyle?: HornStyle;
    globalTeethStyle?: TeethStyle;
    globalDetailStyle?: DetailStyle;
    globalAccessoryStyle?: AccessoryStyle;
    globalStrokeColor?: string;
    bgStyle?: string;
    analysis?: string; // brief description of what the AI chose and why
    letterOverrides?: any[];
  };
  error?: string;
}
