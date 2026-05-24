import { useState } from 'react';
import { Sparkles, Loader2, RefreshCw, HelpCircle } from 'lucide-react';
import { AiPromptResponse } from '../types';

interface AiWizardProps {
  currentText: string;
  onStyleGenerated: (data: NonNullable<AiPromptResponse['config']>) => void;
}

const QUICK_PROMPTS = [
  { text: 'Alieno viscido e bavoso dello spazio profondo', label: '👽 Alieno Viscido' },
  { text: 'Dolce mostriciattolo peloso rosa e socievole', label: '🌸 Mostro Rosa' },
  { text: 'Diavoletto infuocato con corna aguzze e occhi cattivi', label: '🔥 Diavoletto' },
  { text: 'Dinosauro preistorico verde brillante con squame e coda', label: '🦖 Dino Squamoso' },
  { text: 'Re dei mostri regale con corona dorata e zanne grandi', label: '👑 Re dei Mostri' },
  { text: 'Slime radioattivo tossico e galleggiante della palude', label: '🧪 Tossico Slime' }
];

const LOADING_STEPS = [
  'Svegliando i mostri tipografici dal letargo...',
  'Pettinando la pelliccia del ciclope...',
  'Lucidando le corna e affilando le zanne...',
  'Mixando pozioni radioattive per i colori...',
  'Chiedendo consiglio a Gemini sul design ottimale...',
  'Installando bulbi oculari rimbalzanti sul canvas...'
];

export default function AiWizard({ currentText, onStyleGenerated }: AiWizardProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(LOADING_STEPS[0]);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const startLoadingTicker = () => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % LOADING_STEPS.length;
      setLoadingStep(LOADING_STEPS[index]);
    }, 2200);
    return interval;
  };

  const handleAiGeneration = async (selectedPrompt: string) => {
    if (!selectedPrompt.trim()) return;
    
    setIsLoading(true);
    setErrorMsg(null);
    setExplanation(null);
    
    const ticker = startLoadingTicker();

    try {
      const response = await fetch('/api/generate-monster-style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: selectedPrompt, currentText })
      });

      const data: AiPromptResponse = await response.json();
      
      if (data.success && data.config) {
        onStyleGenerated(data.config);
        if (data.config.analysis) {
          setExplanation(data.config.analysis);
        }
      } else if (data.isFallback && data.config) {
        // Falling back gracefully
        onStyleGenerated(data.config);
        setExplanation(data.config.analysis || "Modalità provvisoria: ho generato un mostro divertente!");
        if (data.error) {
          console.warn("API fallback used because:", data.error);
        }
      } else {
        throw new Error(data.error || 'Errore inconsueto durante la generazione dello stile.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        'Il server ha riscontrato problemi, ma la modalità disegno continua. Prova con i controlli manuali sul pannello!'
      );
    } finally {
      clearInterval(ticker);
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between text-[#1A1A1A] w-[330px]" id="ai-wizard-container">
      <div>
        <div className="flex items-center gap-1.5 mb-1 bg-black text-white px-2.5 py-1 w-max select-none">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
          <h3 className="font-sans font-black text-[10px] uppercase tracking-widest text-white leading-none">Assistente di Stile IA</h3>
        </div>
        <p className="text-[8px] text-zinc-500 font-mono uppercase tracking-wider leading-none">Gemini progetta il look dei mostri</p>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-2.5 text-center bg-[#FFFDF0] border-2 border-black border-dashed mt-1 mb-1">
          <Loader2 className="w-5 h-5 animate-spin text-black mb-1.5" />
          <p className="text-[8px] font-mono text-black font-black uppercase tracking-wide leading-tight">{loadingStep}</p>
        </div>
      ) : (
        <div className="space-y-2 py-1">
          <div className="flex gap-1.5 items-center">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
              placeholder="es: alieno rosa viscido..."
              className="flex-1 bg-white text-xs border-2 border-black px-2.5 py-1.5 text-black outline-none focus:bg-cyan-50 placeholder-slate-400 font-bold shadow-inner"
              id="ai-prompt-textarea"
            />
            <button
              onClick={() => handleAiGeneration(prompt)}
              disabled={isLoading || !prompt.trim()}
              className="bg-black hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:border-zinc-350 text-white font-black text-[9px] uppercase tracking-wider py-2 px-3 rounded-none border-2 border-black flex items-center justify-center cursor-pointer shadow-[1.5px_1.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
              id="ai-generate-button"
            >
              Crea
            </button>
          </div>

          <div className="space-y-1">
            <span className="text-[8.5px] uppercase font-black tracking-widest text-black">Preset Soluzioni:</span>
            <div className="grid grid-cols-2 gap-1 max-h-[46px] overflow-y-auto">
              {QUICK_PROMPTS.slice(0, 4).map((p, idx) => (
                <button
                  key={idx}
                  disabled={isLoading}
                  onClick={() => {
                    setPrompt(p.text);
                    handleAiGeneration(p.text);
                  }}
                  className="bg-[#FAFAFA] hover:bg-zinc-100 border border-black rounded-none py-1 px-1.5 text-[8px] text-black font-black uppercase tracking-wide transition-colors text-left truncate cursor-pointer"
                  id={`ai-quick-preset-${idx}`}
                >
                  {p.label.split(' ').slice(1).join(' ') || p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {explanation && !isLoading && (
        <div className="absolute top-1 transform translate-y-[180px] left-4 bg-[#E6FAD2] border-2 border-black p-2.5 pr-8 text-black text-[8px] font-bold uppercase tracking-wider w-[320px] z-50 shadow-[2.5px_2.5px_0px_#000]">
          <button 
            onClick={() => setExplanation(null)}
            className="absolute top-1.5 right-1.5 bg-white hover:bg-zinc-150 text-black border border-black rounded-none w-4 h-4 flex items-center justify-center cursor-pointer text-[8px] font-black shadow-[1px_1px_0px_#000] active:translate-x-[0.5px] active:translate-y-[0.5px]"
            title="Chiudi spiegazione"
            id="close-ai-explanation-btn"
          >
            ✕
          </button>
          <span className="font-mono text-[7px] uppercase text-zinc-650 block mb-0.5 font-black">Scelte del Designer IA:</span>
          <p className="italic font-normal whitespace-normal leading-normal">“ {explanation} ”</p>
        </div>
      )}

      {errorMsg && (
        <div className="absolute top-1 transform translate-y-[180px] left-4 bg-[#FFE2E2] border-2 border-black p-2.5 pr-8 text-black text-[8px] font-semibold uppercase w-[320px] z-50 shadow-[2.5px_2.5px_0px_#000]">
          <button 
            onClick={() => setErrorMsg(null)}
            className="absolute top-1.5 right-1.5 bg-white hover:bg-zinc-150 text-black border border-black rounded-none w-4 h-4 flex items-center justify-center cursor-pointer text-[8px] font-black shadow-[1px_1px_0px_#000] active:translate-x-[0.5px] active:translate-y-[0.5px]"
            title="Chiudi errore"
            id="close-ai-error-btn"
          >
            ✕
          </button>
          <p className="whitespace-normal leading-normal">{errorMsg}</p>
        </div>
      )}
    </div>
  );
}
