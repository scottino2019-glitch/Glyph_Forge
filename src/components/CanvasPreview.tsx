import { MonsterConfig, LetterStyle, EyeStyle, HornStyle, TeethStyle, DetailStyle, AccessoryStyle } from '../types';
import LetterWidget from './LetterWidget';
import { Sparkles, HelpCircle, Layers, Palette } from 'lucide-react';

interface CanvasPreviewProps {
  config: MonsterConfig;
  selectedLetterIdx: number | null;
  onSelectLetter: (idx: number | null) => void;
  backgroundTheme: string;
  onChangeBackground: (theme: string) => void;
}

const BG_THEMES = [
  { id: 'bedroom', name: 'Camera da Letto (Originale)', className: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/40 via-stone-900 to-black text-amber-500' },
  { id: 'halloween', name: 'Sunset Spettrale', className: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-950/70 via-slate-950 to-black text-amber-500' },
  { id: 'swamp', name: 'Palude Slime', className: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-950/50 via-slate-950 to-neutral-950 text-emerald-400' },
  { id: 'space', name: 'Fondale Cosmico', className: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-950/40 via-slate-950 to-black text-rose-500' }
];

export default function CanvasPreview({
  config,
  selectedLetterIdx,
  onSelectLetter,
  backgroundTheme,
  onChangeBackground
}: CanvasPreviewProps) {
  const { text, spacing, fontSize, letterOverrides } = config;

  // Split word into letters
  const charArray = text.split('');

  // Assemble the style for each individual letter
  const getLetterStyle = (char: string, idx: number): LetterStyle => {
    const override = letterOverrides[idx] || {};
    
    // Rotate defaults alternating to look playful like the image if there's no override
    const defaultRotate = idx % 2 === 0 ? -6 : 6;
    const defaultOffsetY = idx % 3 === 0 ? -6 : idx % 3 === 1 ? 6 : 0;

    const divMode = config.diversityMode || 'asymmetric';

    let dEyeStyle = config.globalEyeStyle;
    let dEyeCount = config.globalEyeCount;
    let dHornStyle = config.globalHornStyle;
    let dTeethStyle = config.globalTeethStyle;
    let dDetailStyle = config.globalDetailStyle;
    let dAccessoryStyle = config.globalAccessoryStyle || 'none';
    let dGradientId = config.globalGradientId;

    if (divMode === 'asymmetric' && char !== ' ') {
      // Deterministic mix of styles if no override exists, guaranteeing perfect visual diversity
      const eyeStyles: EyeStyle[] = ['googly', 'cyclops', 'angry', 'cute', 'normal'];
      const eyeCounts = [2, 1, 3, 2, 1];
      const hornStyles: HornStyle[] = ['devil', 'ears', 'spikes', 'crown', 'slug', 'none'];
      const teethStyles: TeethStyle[] = ['fangs', 'sharp', 'underbite', 'gummy', 'none'];
      const detailStyles: DetailStyle[] = ['slime', 'spots', 'scales', 'tail', 'wings', 'none'];
      const accessoryStyles: AccessoryStyle[] = ['none', 'glasses', 'mustache', 'bowtie', 'blush'];
      
      const grads = ['sunset-orange', 'bubblegum-pink', 'neon-slime', 'coral-sunset', 'cosmic-purple', 'ocean-aqua', 'gold-lemon', 'toxic-hazard', 'monster-magenta'];
      
      dEyeStyle = eyeStyles[idx % eyeStyles.length];
      dEyeCount = eyeCounts[idx % eyeCounts.length];
      dHornStyle = hornStyles[(idx + 1) % hornStyles.length];
      dTeethStyle = teethStyles[(idx + 2) % teethStyles.length];
      dDetailStyle = detailStyles[(idx + 4) % detailStyles.length];
      dAccessoryStyle = accessoryStyles[(idx + 3) % accessoryStyles.length];
      dGradientId = grads[idx % grads.length];
    }

    return {
      id: `letter-${idx}-${char}`,
      char,
      eyeStyle: override.eyeStyle || dEyeStyle,
      eyeCount: override.eyeCount !== undefined ? override.eyeCount : dEyeCount,
      eyePosition: override.eyePosition || 'top',
      hornStyle: override.hornStyle || dHornStyle,
      teethStyle: override.teethStyle || dTeethStyle,
      detailStyle: override.detailStyle || dDetailStyle,
      accessoryStyle: override.accessoryStyle || dAccessoryStyle,
      gradientId: override.gradientId || dGradientId,
      gradientFrom: override.gradientFrom || (config.letterOverrides[0]?.gradientFrom),
      gradientTo: override.gradientTo || (config.letterOverrides[0]?.gradientTo),
      strokeColor: override.strokeColor || config.globalStrokeColor,
      strokeWidth: override.strokeWidth || config.globalStrokeWidth,
      rotate: override.rotate !== undefined ? override.rotate : defaultRotate,
      scale: override.scale !== undefined ? override.scale : 1,
      offsetY: override.offsetY !== undefined ? override.offsetY : defaultOffsetY,
      isAnimated: true,
      animationType: override.animationType || 'jiggle'
    };
  };

  const activeBg = BG_THEMES.find(b => b.id === backgroundTheme) || BG_THEMES[0];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#EBEBEB] overflow-hidden p-6 relative select-none" id="canvas-preview-container">
      {/* Blueprint Grid Lines for the typographic drafting canvas */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{
        backgroundImage: `
          linear-gradient(to right, #000 1px, transparent 1px),
          linear-gradient(to bottom, #000 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px'
      }} />

      {/* Grid status markings matching GLYPH_FORGE draft look */}
      <div className="flex justify-between items-center mb-3 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest px-1">
        <span>DRAWING_BOARD_CANVAS (U+004D)</span>
        <span>GRID: ACTIVE (24px)</span>
      </div>

      {/* Main framed viewport mimicking a high-end typography layout block with drop shadows */}
      <div className="flex-1 border-4 border-black relative bg-[#F5F5F5] shadow-[8px_8px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden min-h-0">
        
        {/* Dynamic Inner Preview container showing colors corresponding to original backgroundTheme settings */}
        <div className={`flex-1 flex flex-col items-center justify-center p-8 transition-all duration-700 relative ${activeBg.className}`}>
          
          {/* Grid pattern overlays inside the frame */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
            backgroundImage: `
              radial-gradient(ellipse at center, #ffffff 2px, transparent 2px)
            `,
            backgroundSize: '32px 32px'
          }} />

          {/* Grounding line / Shelf matching original cartoon requirements but modernized */}
          <div className="absolute inset-x-0 bottom-1/4 h-0.5 opacity-25 bg-amber-500 shadow-[0_22px_45px_12px_rgba(245,158,11,0.4)]"></div>

          {/* Tiny spec metadata tags inside the draft board */}
          <div className="absolute top-4 left-4 flex items-center gap-2 select-none pointer-events-none bg-black text-white border-2 border-black px-3 py-1 text-[9px] font-mono uppercase tracking-[0.2em]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>SPECIMEN_VIEW</span>
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2 select-none pointer-events-none text-[9px] font-mono text-white/50">
            <span>ZOOM: 100%</span>
          </div>

          {/* Text/Word center wrapper */}
          {charArray.length === 0 ? (
            <div className="text-center space-y-2 select-none z-10">
              <h3 className="text-xl font-black text-white/90 font-sans tracking-tight uppercase">PAROLA_OUT_OF_BOUNDS</h3>
              <p className="text-xs text-slate-400 font-mono">Digita un termine nel pannello di destra per iniziare...</p>
            </div>
          ) : (
            <div className="w-full max-w-5xl flex justify-center items-center py-10 overflow-x-auto select-none scrollbar-thin z-10">
              <div 
                className="flex items-center justify-center flex-wrap px-12"
                onClick={() => onSelectLetter(null)}
              >
                {charArray.map((char, idx) => {
                  const letterStyle = getLetterStyle(char, idx);
                  const isSelected = selectedLetterIdx === idx;
                  
                  return (
                    <div
                      key={idx}
                      style={{
                        marginLeft: idx > 0 ? `${spacing}px` : '0px',
                        marginRight: `${spacing}px`,
                        width: `${fontSize}px`,
                        height: `${fontSize}px`,
                      }}
                      className="relative transition-all duration-300 flex items-center justify-center"
                    >
                      <LetterWidget
                        style={letterStyle}
                        index={idx}
                        isSelected={isSelected}
                        onClick={() => onSelectLetter(idx)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Interactive footer click instructions */}
          <div className="absolute bottom-6 text-center flex items-center gap-2 bg-black/80 border-2 border-black rounded-none px-4 py-1.5 z-10 shadow-[2px_2px_0px_#000]">
            <MouseIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] text-zinc-100 font-mono uppercase tracking-wider">
              Premere sopra una lettera per personalizzare lo stile singolarmente
            </span>
          </div>
        </div>

        {/* Ambient background selector bar integrated as a bottom status tray */}
        <div className="bg-white border-t-2 border-black px-6 py-3.5 shrink-0 flex flex-wrap gap-4 items-center justify-between text-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-black"></span>
            <span className="text-xs font-black uppercase tracking-widest">Sfoglia Fondale Ambientale:</span>
          </div>
          <div className="flex gap-2.5">
            {BG_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => onChangeBackground(theme.id)}
                className={`text-[10px] font-mono font-black uppercase tracking-widest border-2 border-black px-3.5 py-1.5 transition-all cursor-pointer relative ${
                  backgroundTheme === theme.id
                    ? 'bg-black text-white hover:bg-neutral-800 shadow-[2px_2px_0px_#000]'
                    : 'bg-white text-black hover:bg-slate-100'
                }`}
              >
                {theme.id === 'bedroom' && '💡 Originale'}
                {theme.id === 'halloween' && '🎃 Sunset'}
                {theme.id === 'swamp' && '🐸 Slime'}
                {theme.id === 'space' && '🛸 Cosmo'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline Mouse Icon indicator
function MouseIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="5" y="2" width="14" height="20" rx="7" />
      <path d="M12 6v4" />
    </svg>
  );
}
