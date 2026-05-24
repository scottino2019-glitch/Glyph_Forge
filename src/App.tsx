import { useState } from 'react';
import { MonsterConfig, AiPromptResponse } from './types';
import CanvasPreview from './components/CanvasPreview';
import SidebarControls from './components/SidebarControls';
import AiWizard from './components/AiWizard';
import { compileMonsterSvg } from './utils/exportMonster';
import { Sparkles, HelpCircle, Eye, RefreshCw, Code, Download, MessageSquare, Info } from 'lucide-react';

// Pre-defined detailed overrides for 'BUONA NOTTE' to match the user's reference style perfectly on load
const INITIAL_OVERRIDES: Record<number, any> = {
  0: { gradientId: 'gold-lemon', eyeStyle: 'googly', eyeCount: 1, eyePosition: 'inside', hornStyle: 'none', teethStyle: 'underbite', detailStyle: 'tail', rotate: -9, offsetY: 12 },
  1: { gradientId: 'gold-lemon', eyeStyle: 'googly', eyeCount: 2, eyePosition: 'top', hornStyle: 'ears', teethStyle: 'gummy', detailStyle: 'slime', rotate: 6, offsetY: -10 },
  2: { gradientId: 'sunset-orange', eyeStyle: 'cyclops', eyeCount: 1, eyePosition: 'inside', hornStyle: 'none', teethStyle: 'fangs', detailStyle: 'spots', rotate: -12, offsetY: 4 },
  3: { gradientId: 'sunset-orange', eyeStyle: 'none', eyeCount: 0, eyePosition: 'top', hornStyle: 'devil', teethStyle: 'none', detailStyle: 'none', rotate: 8, offsetY: -8 },
  4: { gradientId: 'coral-sunset', eyeStyle: 'normal', eyeCount: 1, eyePosition: 'inside', hornStyle: 'none', teethStyle: 'none', detailStyle: 'scales', rotate: -6, offsetY: 8 },
  // Index 5 is a space, skipping overrides here to let our custom galactic space render pristine!
  6: { gradientId: 'coral-sunset', eyeStyle: 'none', eyeCount: 0, eyePosition: 'top', hornStyle: 'spikes', teethStyle: 'none', detailStyle: 'none', rotate: 10, offsetY: -6 },
  7: { gradientId: 'monster-magenta', eyeStyle: 'googly', eyeCount: 2, eyePosition: 'top', hornStyle: 'none', teethStyle: 'fangs', detailStyle: 'slime', rotate: -7, offsetY: 6 },
  8: { gradientId: 'monster-magenta', eyeStyle: 'none', eyeCount: 0, eyePosition: 'top', hornStyle: 'none', teethStyle: 'none', detailStyle: 'none', rotate: 5, offsetY: -10 },
  9: { gradientId: 'bubblegum-pink', eyeStyle: 'googly', eyeCount: 2, eyePosition: 'top', hornStyle: 'none', teethStyle: 'none', detailStyle: 'wings', rotate: -8, offsetY: 4 },
  10: { gradientId: 'bubblegum-pink', eyeStyle: 'normal', eyeCount: 1, eyePosition: 'top', hornStyle: 'crown', teethStyle: 'none', detailStyle: 'none', rotate: 6, offsetY: -4 }
};

const DEFAULT_CONFIG: MonsterConfig = {
  text: 'BUONA NOTTE',
  spacing: -11, // tight overlap for comic look
  diversityMode: 'asymmetric',
  globalGradientId: 'sunset-orange',
  globalEyeStyle: 'googly',
  globalEyeCount: 2,
  globalHornStyle: 'devil',
  globalTeethStyle: 'fangs',
  globalDetailStyle: 'slime',
  globalAccessoryStyle: 'none',
  globalStrokeColor: '#111827',
  globalStrokeWidth: 5,
  globalGradientFrom: '#ff007f',
  globalGradientTo: '#7f00ff',
  letterOverrides: INITIAL_OVERRIDES,
  backgroundColor: 'bedroom',
  shadowColor: 'rgba(0,0,0,0.4)',
  shadowOffsetX: 0,
  shadowOffsetY: 8,
  fontSize: 90
};

export default function App() {
  const [config, setConfig] = useState<MonsterConfig>(DEFAULT_CONFIG);
  const [selectedLetterIdx, setSelectedLetterIdx] = useState<number | null>(null);
  const [backgroundTheme, setBackgroundTheme] = useState<string>('bedroom');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [showEmbedCode, setShowEmbedCode] = useState<boolean>(false);

  const triggerNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Triggers standalone SVG vector download from browser
  const handleExportSvg = () => {
    try {
      const svgContent = compileMonsterSvg(config);
      const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `font-mostro-${config.text.toLowerCase() || 'scritta'}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerNotification('Vettoriale SVG scaricato con successo! Pronto per l\'uso professionale.', 'success');
    } catch (err) {
      console.error(err);
      triggerNotification('Inconsueto problema nel compilare la scritta SVG.', 'error');
    }
  };

  // Triggers high-res raster PNG rendering via an offscreen SVG -> Canvas bridge
  const handleExportPng = () => {
    try {
      const svgContent = compileMonsterSvg(config);
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const reader = new FileReader();

      reader.onload = function (e) {
        if (!e.target?.result) return;
        const img = new Image();
        img.onload = function () {
          // Setup offscreen canvas
          const canvas = document.createElement('canvas');
          // Support high visual resolution
          const scaleMultiplier = 2; 
          canvas.width = img.width * scaleMultiplier;
          canvas.height = img.height * scaleMultiplier;
          
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.scale(scaleMultiplier, scaleMultiplier);
            ctx.drawImage(img, 0, 0);
            
            // Try downloading
            const pngUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = pngUrl;
            link.download = `mostrofont-${config.text.toLowerCase()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            triggerNotification('Immagine PNG ad alta risoluzione scaricata correntemente!', 'success');
          }
        };
        img.src = e.target.result as string;
      };
      reader.readAsDataURL(svgBlob);
    } catch (err) {
      console.error(err);
      triggerNotification('Errore nella rasterizzazione PNG locale.', 'error');
    }
  };

  // AI-assisted layout parameters adapter callback
  const handleStyleGenerated = (aiConfig: NonNullable<AiPromptResponse['config']> & { letterOverrides?: any[] }) => {
    setConfig((prev) => {
      const overrides: Record<number, any> = {};
      if (aiConfig.letterOverrides && Array.isArray(aiConfig.letterOverrides)) {
        aiConfig.letterOverrides.forEach((item: any) => {
          if (item && typeof item.index === 'number') {
            overrides[item.index] = {
              eyeStyle: item.eyeStyle,
              eyeCount: item.eyeCount,
              hornStyle: item.hornStyle,
              teethStyle: item.teethStyle,
              detailStyle: item.detailStyle,
              accessoryStyle: item.accessoryStyle || 'none',
              gradientId: item.gradientId,
              rotate: typeof item.rotate === 'number' ? item.rotate : undefined,
              offsetY: typeof item.offsetY === 'number' ? item.offsetY : undefined,
            };
          }
        });
      }

      return {
        ...prev,
        globalGradientId: aiConfig.globalGradientId || prev.globalGradientId,
        globalEyeStyle: aiConfig.globalEyeStyle || prev.globalEyeStyle,
        globalEyeCount: aiConfig.globalEyeCount !== undefined ? aiConfig.globalEyeCount : prev.globalEyeCount,
        globalHornStyle: aiConfig.globalHornStyle || prev.globalHornStyle,
        globalTeethStyle: aiConfig.globalTeethStyle || prev.globalTeethStyle,
        globalDetailStyle: aiConfig.globalDetailStyle || prev.globalDetailStyle,
        globalAccessoryStyle: aiConfig.globalAccessoryStyle || 'none',
        globalStrokeColor: aiConfig.globalStrokeColor || prev.globalStrokeColor,
        globalGradientFrom: aiConfig.customFrom || prev.globalGradientFrom,
        globalGradientTo: aiConfig.customTo || prev.globalGradientTo,
        // Reset overrides to apply the newly minted AI style symmetrically or asymmetric letterOverrides on request
        letterOverrides: Object.keys(overrides).length > 0 ? overrides : {}
      };
    });
    
    if (aiConfig.bgStyle) {
      const matchingBg = ['swamp', 'halloween', 'space', 'bedroom'].find(x => aiConfig.bgStyle?.toLowerCase().includes(x));
      if (matchingBg) {
        setBackgroundTheme(matchingBg);
      }
    }
    
    triggerNotification('Nuovo look da mostro generato e applicato da Gemini!', 'success');
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#FAFAFA] text-[#1A1A1A] overflow-hidden font-sans" id="app-root-container">
      
      {/* HEADER BAR */}
      <header className="bg-white border-b-2 border-black px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10 text-[#1A1A1A]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-black rounded-none bg-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
            <span className="text-xl">👹</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-sans font-black text-xl text-black tracking-tighter uppercase">GLYPH_FORGE</h1>
              <span className="bg-yellow-100 text-black border border-black text-[9px] font-mono font-black px-2.5 py-0.5 uppercase tracking-wider">CREATOR_V2.5</span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Generatore di scritte tipografiche e font mostruosi vettoriali</p>
          </div>
        </div>

        {/* Embedded info popup controller & external share status */}
        <div className="flex items-center gap-2">
          {/* Web integration button */}
          <button
            onClick={() => setShowEmbedCode(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-zinc-50 text-xs text-black border-2 border-black font-black uppercase tracking-wider transition-all cursor-pointer shadow-[2px_2px_0px_#000]"
          >
            <Code className="w-3.5 h-3.5 text-black" />
            <span className="hidden sm:inline">Embed HTML</span>
          </button>

          <div
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-100 text-black border-2 border-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000]"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            <span>PRONTO_FOUNDRY</span>
          </div>
        </div>
      </header>

      {/* COMPONENT BODY */}
      <main className="flex-1 flex flex-col overflow-hidden min-h-0" id="app-main-body">
        
        {/* TOP SCROLLING CONTROLS TRAY */}
        <div className="w-full shrink-0 bg-white border-b-2 border-black overflow-x-auto select-none" id="top-controls-pnl">
          <div className="flex items-stretch h-[180px] divide-x-2 divide-black min-w-max">
            
            {/* COMPARTMENT 1: AI Assistant (AiWizard) */}
            <div className="w-[360px] p-4 flex flex-col justify-between h-full bg-zinc-50 shrink-0 select-none">
              <AiWizard 
                currentText={config.text} 
                onStyleGenerated={handleStyleGenerated} 
              />
            </div>
            
            {/* COMPARTMENT 2: Manual Controls & Exports (SidebarControls) */}
            <div className="h-full shrink-0 flex items-stretch">
              <SidebarControls
                config={config}
                onChange={setConfig}
                selectedLetterIdx={selectedLetterIdx}
                onClearSelection={() => setSelectedLetterIdx(null)}
                onExportSvg={handleExportSvg}
                onExportPng={handleExportPng}
              />
            </div>

          </div>
        </div>

        {/* Playable Live Canvas inside responsive window */}
        <div className="flex-1 flex flex-col min-h-0 relative bg-[#EBEBEB]">
          <CanvasPreview
            config={config}
            selectedLetterIdx={selectedLetterIdx}
            onSelectLetter={setSelectedLetterIdx}
            backgroundTheme={backgroundTheme}
            onChangeBackground={setBackgroundTheme}
          />
        </div>

      </main>

      {/* NOTIFICATIONS FLOAT SYSTEM */}
      {notification && (
        <div 
          className={`fixed bottom-16 left-1/2 transform -translate-x-1/2 px-6 py-3.5 border-2 border-black text-black shadow-[4px_4px_0px_#000] z-50 animate-slideUp text-xs font-black uppercase tracking-wider
            ${notification.type === 'success' ? 'bg-[#E6FAD2]' : ''}
            ${notification.type === 'info' ? 'bg-[#E0F7FA]' : ''}
            ${notification.type === 'error' ? 'bg-[#FFE2E2]' : ''}
          `}
          id="toast-notifications-area"
        >
          <div className="flex items-center gap-3">
            <span>{notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : 'ℹ️'}</span>
            <p>{notification.message}</p>
          </div>
        </div>
      )}

      {/* EMBED CODE GENERATOR MODAL VIEW */}
      {showEmbedCode && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn font-sans">
          <div className="bg-white border-4 border-black rounded-none w-full max-w-2xl p-6 shadow-[12px_12px_0px_#000] text-[#1A1A1A] relative" id="embed-code-modal">
            
            <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4 font-black text-black">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-black" />
                <h3 className="font-black text-black uppercase tracking-tighter text-base">Utilizza come Web SVG o Icone</h3>
              </div>
              <button 
                onClick={() => setShowEmbedCode(false)}
                className="text-[10px] uppercase font-mono font-black border-2 border-black px-2 py-1 hover:bg-zinc-100 cursor-pointer"
              >
                Chiudi x
              </button>
            </div>

            <p className="text-xs text-zinc-600 mb-4 leading-relaxed uppercase font-semibold">
              Puoi incorporare questa scritta vettoriale direttamente nel codice HTML del tuo sito internet. Avrai dei bellissimi mostri vettoriali leggeri e ultra-definiti su qualsiasi device! Copia il codice qui sotto:
            </p>

            <div className="relative mb-4">
              <textarea
                readOnly
                value={compileMonsterSvg(config)}
                rows={8}
                onClick={(e) => (e.target as any).select()}
                className="w-full bg-[#FAFAFA] font-mono text-[10px] text-black border-2 border-black rounded-none p-3 outline-none"
              />
              <span className="absolute bottom-2 right-2 text-[9px] uppercase font-mono text-zinc-400 font-bold">Clicca dentro per selezionare tutto</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(compileMonsterSvg(config));
                  triggerNotification('Codice vettoriale copiato negli appunti!', 'success');
                  setShowEmbedCode(false);
                }}
                className="flex-1 bg-black hover:bg-zinc-900 border-2 border-black py-3 rounded-none text-white font-black text-xs uppercase tracking-widest cursor-pointer shadow-[3px_3px_0px_rgba(0,0,0,1)] text-center active:translate-x-0.5 active:translate-y-0.5"
              >
                Copia negli Appunti
              </button>
              <button
                onClick={() => setShowEmbedCode(false)}
                className="px-6 bg-white hover:bg-zinc-100 border-2 border-black py-3 rounded-none text-black font-black text-xs uppercase tracking-widest cursor-pointer shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
