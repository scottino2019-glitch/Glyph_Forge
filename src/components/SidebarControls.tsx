import { MonsterConfig, EyeStyle, HornStyle, TeethStyle, DetailStyle, GradientStyle, AccessoryStyle } from '../types';
import { GRADIENT_PRESETS } from '../constants/monsterGlyphs';
import { Download, Sliders, Palette, Sparkles, Smile, ArrowRight, Trash2, Eye, ShieldCheck, Layers } from 'lucide-react';

interface SidebarControlsProps {
  config: MonsterConfig;
  onChange: (updater: (prev: MonsterConfig) => MonsterConfig) => void;
  selectedLetterIdx: number | null;
  onClearSelection: () => void;
  onExportSvg: () => void;
  onExportPng: () => void;
}

export default function SidebarControls({
  config,
  onChange,
  selectedLetterIdx,
  onClearSelection,
  onExportSvg,
  onExportPng
}: SidebarControlsProps) {
  const {
    text,
    spacing,
    diversityMode,
    globalGradientId,
    globalEyeStyle,
    globalEyeCount,
    globalHornStyle,
    globalTeethStyle,
    globalDetailStyle,
    globalAccessoryStyle,
    globalStrokeWidth,
    backgroundColor,
    fontSize,
    letterOverrides
  } = config;

  // Selected letter for individual customizations
  const activeOverride = selectedLetterIdx !== null ? letterOverrides[selectedLetterIdx] || {} : null;
  const activeChar = selectedLetterIdx !== null ? text[selectedLetterIdx] : null;

  const updateGlobal = (key: keyof MonsterConfig, value: any) => {
    onChange((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const updateOverride = (key: string, value: any) => {
    if (selectedLetterIdx === null) return;
    onChange((prev) => {
      const overrides = { ...prev.letterOverrides };
      overrides[selectedLetterIdx] = {
        ...(overrides[selectedLetterIdx] || {}),
        [key]: value
      };
      return {
        ...prev,
        letterOverrides: overrides
      };
    });
  };

  const removeOverride = () => {
    if (selectedLetterIdx === null) return;
    onChange((prev) => {
      const overrides = { ...prev.letterOverrides };
      delete overrides[selectedLetterIdx];
      return {
        ...prev,
        letterOverrides: overrides
      };
    });
    onClearSelection();
  };

  // Find active preset
  const activeGradient = GRADIENT_PRESETS.find(g => g.id === globalGradientId) || GRADIENT_PRESETS[0];

  return (
    <div className="flex items-stretch divide-x-2 divide-black h-full text-[#1A1A1A] bg-white min-w-max" id="sidebar-controls">
      
      {/* SEZIONE 1: IMPOSTAZIONI TESTO & MISURE */}
      <div className="w-[280px] p-4 flex flex-col justify-between h-full bg-white select-none shrink-0" id="section-text-measures">
        <label className="text-[10px] uppercase font-black tracking-widest text-black block mb-1">1. Testo & Struttura</label>
        <div className="space-y-3">
          <input
            type="text"
            value={text}
            onChange={(e) => updateGlobal('text', e.target.value.substring(0, 24).toUpperCase())}
            placeholder="BUONA NOTTE"
            className="w-full bg-white border-2 border-black rounded-none px-3 py-1.5 text-xs text-black font-sans font-bold uppercase tracking-wider outline-none focus:bg-cyan-50 select-all shadow-[1.5px_1.5px_0px_#000]"
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[9px] font-black uppercase text-zinc-500 block mb-0.5">Spaziatura ({spacing}px)</span>
              <input
                type="range"
                min="-30"
                max="50"
                value={spacing}
                onChange={(e) => updateGlobal('spacing', parseInt(e.target.value))}
                className="w-full accent-black cursor-pointer h-1"
              />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase text-zinc-500 block mb-0.5">Lettera ({fontSize}px)</span>
              <input
                type="range"
                min="20"
                max="140"
                value={fontSize}
                onChange={(e) => updateGlobal('fontSize', parseInt(e.target.value))}
                className="w-full accent-black cursor-pointer h-1"
              />
            </div>
          </div>

          <div className="space-y-1.5 mt-1 border-t-2 border-dashed border-zinc-200 pt-2 pb-0.5">
            <span className="text-[9px] font-black uppercase text-zinc-650 block">Modalità Estetica</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => {
                  onChange((prev) => {
                    const preserved: Record<number, any> = {};
                    if (prev.letterOverrides[0]?.gradientFrom || prev.letterOverrides[0]?.gradientTo) {
                      preserved[0] = {
                        gradientFrom: prev.letterOverrides[0].gradientFrom,
                        gradientTo: prev.letterOverrides[0].gradientTo,
                        gradientId: 'custom'
                      };
                    }
                    return {
                      ...prev,
                      diversityMode: 'asymmetric',
                      letterOverrides: preserved
                    };
                  });
                }}
                className={`flex-1 text-[9.5px] font-black py-1 px-1 border-2 border-black cursor-pointer transition-all active:translate-y-0.5 ${
                  (diversityMode || 'asymmetric') === 'asymmetric'
                    ? 'bg-rose-500 text-white shadow-[1.5px_1.5px_0px_#000]'
                    : 'bg-white hover:bg-zinc-50 text-black shadow-none'
                }`}
                title="Ogni mostro ha uno stile e colore totalmente diverso generato automaticamente"
              >
                Creature Diverse 🌈
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange((prev) => {
                    const preserved: Record<number, any> = {};
                    if (prev.letterOverrides[0]?.gradientFrom || prev.letterOverrides[0]?.gradientTo) {
                      preserved[0] = {
                        gradientFrom: prev.letterOverrides[0].gradientFrom,
                        gradientTo: prev.letterOverrides[0].gradientTo,
                        gradientId: 'custom'
                      };
                    }
                    return {
                      ...prev,
                      diversityMode: 'uniform',
                      letterOverrides: preserved
                    };
                  });
                }}
                className={`flex-1 text-[9.5px] font-black py-1 px-1 border-2 border-black cursor-pointer transition-all active:translate-y-0.5 ${
                  diversityMode === 'uniform'
                    ? 'bg-cyan-400 text-black shadow-[1.5px_1.5px_0px_#000]'
                    : 'bg-white hover:bg-zinc-50 text-black shadow-none'
                }`}
                title="Tutti i mostri seguono le impostazioni del pannello globale"
              >
                Tutti Uguali 👥
              </button>
            </div>
          </div>
        </div>
        <p className="text-[8px] font-mono tracking-wider text-zinc-500 uppercase leading-none">Max 24 Lettere (Solo A-Z & Spazi)</p>
      </div>

      {/* SEZIONE 2: SGUARDI & ACCESSORI (DINAMICO SE LETTERA ELEMENT SELEZIONATA) */}
      {selectedLetterIdx !== null && activeChar ? (
        <div className="p-4 bg-[#FFFDF0] flex flex-col justify-between h-full shrink-0 select-none w-[540px]" id="section-selected-design">
          <div className="flex items-center justify-between border-b-2 border-dashed border-black pb-1 mb-1 leading-none">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 border-2 border-black rounded-none bg-cyan-400 text-black font-mono font-black flex items-center justify-center text-xs shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">{activeChar}</span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-black">GLIPHO ATTIVO #{selectedLetterIdx}</span>
              </div>
            </div>
            <button 
              onClick={onClearSelection}
              className="text-[8px] font-mono uppercase bg-white border-2 border-black px-1.5 py-0.5 hover:bg-slate-50 cursor-pointer shadow-[1px_1px_0px_#000] font-black"
            >
              Chiudi x
            </button>
          </div>

          <div className="grid grid-cols-3 gap-x-2 gap-y-1.5 py-1">
            <div className="space-y-0.5">
              <span className="text-[8px] font-black uppercase text-zinc-650 block">Sguardo</span>
              <select
                value={activeOverride.eyeStyle || globalEyeStyle}
                onChange={(e) => updateOverride('eyeStyle', e.target.value)}
                className="w-full bg-white border border-black py-0.5 px-1 text-[9px] text-black font-bold uppercase outline-none"
              >
                <option value="normal">Normale</option>
                <option value="googly">Googly</option>
                <option value="cyclops">Ciclope</option>
                <option value="angry">Angry</option>
                <option value="cute">Cute</option>
                <option value="none">Senza</option>
              </select>
            </div>

            <div className="space-y-0.5">
              <span className="text-[8px] font-black uppercase text-zinc-650 block">Quantità</span>
              <select
                value={activeOverride.eyeCount !== undefined ? activeOverride.eyeCount : globalEyeCount}
                onChange={(e) => updateOverride('eyeCount', parseInt(e.target.value))}
                className="w-full bg-white border border-black py-0.5 px-1 text-[9px] text-black font-bold uppercase outline-none"
              >
                <option value={0}>0 Occhi</option>
                <option value={1}>1 Occhio</option>
                <option value={2}>2 Occhi</option>
                <option value={3}>3 Occhi</option>
              </select>
            </div>

            <div className="space-y-0.5">
              <span className="text-[8px] font-black uppercase text-zinc-650 block">Posiz. Occhi</span>
              <select
                value={activeOverride.eyePosition || 'top'}
                onChange={(e) => updateOverride('eyePosition', e.target.value)}
                className="w-full bg-white border border-black py-0.5 px-1 text-[9px] text-black font-bold uppercase outline-none"
              >
                <option value="top">In Alto</option>
                <option value="inside">Nel Foro</option>
              </select>
            </div>

            <div className="space-y-0.5">
              <span className="text-[8px] font-black uppercase text-zinc-650 block">Corna / Copricapo</span>
              <select
                value={activeOverride.hornStyle || globalHornStyle}
                onChange={(e) => updateOverride('hornStyle', e.target.value)}
                className="w-full bg-white border border-black py-0.5 px-1 text-[9px] text-black font-bold uppercase outline-none"
              >
                <option value="none">Nessuna</option>
                <option value="devil">Diavolo</option>
                <option value="ears">Orecchie</option>
                <option value="spikes">Spine</option>
                <option value="crown">Corona</option>
                <option value="slug">Antenna</option>
              </select>
            </div>

            <div className="space-y-0.5">
              <span className="text-[8px] font-black uppercase text-zinc-650 block">Bocca / Denti</span>
              <select
                value={activeOverride.teethStyle || globalTeethStyle}
                onChange={(e) => updateOverride('teethStyle', e.target.value)}
                className="w-full bg-white border border-black py-0.5 px-1 text-[9px] text-black font-bold uppercase outline-none"
              >
                <option value="none">Senza</option>
                <option value="fangs">Zanne</option>
                <option value="sharp">Sega</option>
                <option value="underbite">Sotto</option>
                <option value="gummy">Linguetta</option>
              </select>
            </div>

            <div className="space-y-0.5">
              <span className="text-[8px] font-black uppercase text-zinc-650 block">Dettaglio</span>
              <select
                value={activeOverride.detailStyle || globalDetailStyle}
                onChange={(e) => updateOverride('detailStyle', e.target.value)}
                className="w-full bg-white border border-black py-0.5 px-1 text-[9px] text-black font-bold uppercase outline-none"
              >
                <option value="none">Semplice</option>
                <option value="spots">Macchie</option>
                <option value="scales">Squame</option>
                <option value="slime">Bava</option>
                <option value="tail">Coda</option>
                <option value="wings">Ali</option>
              </select>
            </div>

            <div className="space-y-0.5">
              <span className="text-[8px] font-black uppercase text-zinc-650 block">Accessorio</span>
              <select
                value={activeOverride.accessoryStyle || globalAccessoryStyle || 'none'}
                onChange={(e) => updateOverride('accessoryStyle', e.target.value)}
                className="w-full bg-white border border-black py-0.5 px-0.5 text-[9px] text-black font-bold uppercase outline-none"
              >
                <option value="none">Senza</option>
                <option value="glasses">Occhiali 👓</option>
                <option value="mustache">Baffi 🧔</option>
                <option value="bowtie">Papillon 🎀</option>
                <option value="blush">Guance 😊</option>
              </select>
            </div>

            <div className="space-y-0.5">
              <span className="text-[8px] font-black uppercase text-zinc-650 block">Sfumatura / Colore</span>
              <select
                value={activeOverride.gradientId || ''}
                onChange={(e) => updateOverride('gradientId', e.target.value || undefined)}
                className="w-full bg-white border border-black py-0.5 px-0.5 text-[9px] text-black font-bold uppercase outline-none"
              >
                <option value="">Usa Globale o Serie</option>
                {GRADIENT_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {activeOverride.gradientId === 'custom' && (
            <div className="flex items-center justify-between border-t border-dashed border-zinc-350 pt-1.5 pb-0.5">
              <span className="text-[8px] font-black uppercase text-zinc-650">Colori Personalizzati Lettera:</span>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={activeOverride.gradientFrom || '#ff007f'}
                  onChange={(e) => updateOverride('gradientFrom', e.target.value)}
                  className="w-5 h-5 bg-transparent rounded-none cursor-pointer border border-black"
                  title="Inizio Sfumatura"
                />
                <input
                  type="color"
                  value={activeOverride.gradientTo || '#7f00ff'}
                  onChange={(e) => updateOverride('gradientTo', e.target.value)}
                  className="w-5 h-5 bg-transparent rounded-none cursor-pointer border border-black"
                  title="Fine Sfumatura"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-1.5 border-t border-dashed border-zinc-350">
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] font-black uppercase text-zinc-650 shrink-0">Rotazione ({activeOverride.rotate || 0}°)</span>
              <input
                type="range"
                min="-20"
                max="20"
                value={activeOverride.rotate !== undefined ? activeOverride.rotate : 0}
                onChange={(e) => updateOverride('rotate', parseInt(e.target.value))}
                className="w-full accent-black h-1 cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] font-black uppercase text-zinc-650 shrink-0">Offset Y ({activeOverride.offsetY || 0}px)</span>
              <input
                type="range"
                min="-15"
                max="15"
                value={activeOverride.offsetY !== undefined ? activeOverride.offsetY : 0}
                onChange={(e) => updateOverride('offsetY', parseInt(e.target.value))}
                className="w-full accent-black h-1 cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={removeOverride}
            className="w-full bg-zinc-100 hover:bg-neutral-200 border border-black py-1 text-[9px] font-black uppercase tracking-wider text-black flex items-center justify-center gap-1 shadow-[1px_1px_0px_#000] cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Resetta Glipho</span>
          </button>
        </div>
      ) : (
        /* PROFILO GLOBALE SE NESSUNA LETTERA CLICCATA */
        <div className="p-4 bg-white flex flex-col justify-between h-full shrink-0 select-none w-[440px]" id="section-global-design">
          <label className="text-[10px] uppercase font-black tracking-widest text-[#1A1A1A] block mb-1">2. Look Globale dei Mostri</label>
          
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 py-1">
            <div className="space-y-0.5">
              <span className="text-[8px] font-black uppercase text-zinc-500 block">Sguardo</span>
              <select
                value={globalEyeStyle}
                onChange={(e) => updateGlobal('globalEyeStyle', e.target.value as EyeStyle)}
                className="w-full bg-white border border-black py-0.5 px-1.5 text-[9px] text-black font-bold uppercase outline-none"
              >
                <option value="normal">Normali</option>
                <option value="googly">Googly</option>
                <option value="cyclops">Ciclope Gigante</option>
                <option value="angry">Arrabbiati</option>
                <option value="cute">Cutes</option>
                <option value="none">Nessuno</option>
              </select>
            </div>

            <div className="space-y-0.5">
              <span className="text-[8px] font-black uppercase text-zinc-500 block">Numero Occhi</span>
              <select
                value={globalEyeCount}
                onChange={(e) => updateGlobal('globalEyeCount', parseInt(e.target.value))}
                className="w-full bg-white border border-black py-0.5 px-1.5 text-[9px] text-black font-bold uppercase outline-none"
              >
                <option value={0}>0 Occhi</option>
                <option value={1}>1 Occhio</option>
                <option value={2}>2 Occhi</option>
                <option value={3}>3 Occhi</option>
              </select>
            </div>

            <div className="space-y-0.5">
              <span className="text-[8px] font-black uppercase text-zinc-500 block">Corona / Corna</span>
              <select
                value={globalHornStyle}
                onChange={(e) => updateGlobal('globalHornStyle', e.target.value as HornStyle)}
                className="w-full bg-white border border-black py-0.5 px-1.5 text-[9px] text-black font-bold uppercase outline-none"
              >
                <option value="none">Nessun Copricapo</option>
                <option value="devil">Diavoletto</option>
                <option value="ears">Shrek</option>
                <option value="spikes">Cresta Spine</option>
                <option value="crown">Corona</option>
                <option value="slug">Antenna</option>
              </select>
            </div>

            <div className="space-y-0.5">
              <span className="text-[8px] font-black uppercase text-zinc-500 block">Bocca / Zanne</span>
              <select
                value={globalTeethStyle}
                onChange={(e) => updateGlobal('globalTeethStyle', e.target.value as TeethStyle)}
                className="w-full bg-white border border-black py-0.5 px-1.5 text-[9px] text-black font-bold uppercase outline-none"
              >
                <option value="none">Senza</option>
                <option value="fangs">Zanne</option>
                <option value="sharp">Seghettato</option>
                <option value="underbite">Sottodenti</option>
                <option value="gummy">Linguetta</option>
              </select>
            </div>

            <div className="space-y-0.5">
              <span className="text-[8px] font-black uppercase text-zinc-500 block">Pelliccia / Dettagli</span>
              <select
                value={globalDetailStyle}
                onChange={(e) => updateGlobal('globalDetailStyle', e.target.value as DetailStyle)}
                className="w-full bg-white border border-black py-0.5 px-1.5 text-[9px] text-black font-bold uppercase outline-none"
              >
                <option value="none">Semplice</option>
                <option value="spots">Macchie</option>
                <option value="scales">Squame</option>
                <option value="slime">Bava</option>
                <option value="tail">Coda</option>
                <option value="wings">Ali Pipistrello</option>
              </select>
            </div>

            <div className="space-y-0.5">
              <span className="text-[8px] font-black uppercase text-zinc-500 block">Accessori</span>
              <select
                value={globalAccessoryStyle || 'none'}
                onChange={(e) => updateGlobal('globalAccessoryStyle', e.target.value as AccessoryStyle)}
                className="w-full bg-white border border-black py-0.5 px-1.5 text-[9px] text-black font-bold uppercase outline-none"
              >
                <option value="none">Senza</option>
                <option value="glasses">Occhiali Nerd 👓</option>
                <option value="mustache">Baffi Spessi 🧔</option>
                <option value="bowtie">Papillon 🎀</option>
                <option value="blush">Guance Rosse 😊</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-dashed border-zinc-350 flex justify-between items-center gap-4">
            <div className="flex-1">
              <span className="text-[8px] font-black uppercase text-zinc-500 block">Spessore Contorno ({globalStrokeWidth}px) [Fino a 20 px]</span>
              <input
                type="range"
                min="2"
                max="20"
                value={globalStrokeWidth}
                onChange={(e) => updateGlobal('globalStrokeWidth', parseInt(e.target.value))}
                className="w-full accent-black cursor-pointer h-1.5 mt-1"
              />
            </div>
            {Object.keys(letterOverrides).length > 0 && (
              <button
                type="button"
                onClick={() => {
                  onChange(prev => {
                    const preserved: Record<number, any> = {};
                    if (prev.letterOverrides[0]?.gradientFrom || prev.letterOverrides[0]?.gradientTo) {
                      preserved[0] = {
                        gradientFrom: prev.letterOverrides[0].gradientFrom,
                        gradientTo: prev.letterOverrides[0].gradientTo,
                        gradientId: 'custom'
                      };
                    }
                    return { ...prev, letterOverrides: preserved };
                  });
                }}
                className="bg-zinc-100 hover:bg-neutral-200 text-black font-black text-[9px] uppercase tracking-wider py-1.5 px-3 rounded-none border-2 border-dashed border-black hover:border-solid hover:bg-zinc-200 cursor-pointer shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] active:translate-y-0.5 shrink-0"
                title="Svuota tutte le personalizzazioni fatte alle singole lettere"
                id="reset-all-letter-overrides-btn"
              >
                Reset Lettere 🧹
              </button>
            )}
          </div>
        </div>
      )}

      {/* SEZIONE 3: TAVOLOZZA COLORI */}
      <div className="w-[320px] p-4 flex flex-col justify-between h-full bg-white select-none shrink-0" id="section-gradient-colors">
        <label className="text-[10px] uppercase font-black tracking-widest text-[#1A1A1A] block mb-1">3. Colori e Spettro</label>
        
        <div className="grid grid-cols-2 gap-1.5 max-h-[110px] overflow-y-auto pr-1">
          {GRADIENT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => updateGlobal('globalGradientId', preset.id)}
              style={{
                background: `linear-gradient(to right, ${preset.from}, ${preset.to})`
              }}
              className={`rounded-none py-1 px-1.5 text-left border border-black text-[9px] font-black select-none truncate cursor-pointer transition-all ${
                globalGradientId === preset.id 
                  ? 'shadow-[2px_2px_0px_rgba(0,0,0,1)] ring-1 ring-black bg-[#E0F7FA]' 
                  : 'opacity-85 hover:opacity-100 shadow-[1px_1px_0px_transparent]'
              }`}
            >
              <span 
                style={{ color: preset.textColor }}
                className="drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.85)] font-sans truncate"
              >
                {preset.name}
              </span>
            </button>
          ))}
        </div>

        {globalGradientId === 'custom' ? (
          <div className="flex gap-2 items-center justify-between border-t border-black mt-1.5 pt-1">
            <span className="text-[8px] font-black text-black uppercase">CUSTOM RGB:</span>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.globalGradientFrom || '#ff007f'}
                onChange={(e) => {
                  updateGlobal('globalGradientFrom', e.target.value);
                }}
                className="w-5 h-5 bg-transparent rounded-none cursor-pointer border border-black"
                title="Colore Iniziale"
              />
              <input
                type="color"
                value={config.globalGradientTo || '#7f00ff'}
                onChange={(e) => {
                  updateGlobal('globalGradientTo', e.target.value);
                }}
                className="w-5 h-5 bg-transparent rounded-none cursor-pointer border border-black"
                title="Colore Finale"
              />
            </div>
          </div>
        ) : (
          <p className="text-[8px] font-mono tracking-wider text-zinc-500 uppercase leading-none mt-1">Preset {activeGradient.name} Attivo</p>
        )}
      </div>

      {/* SEZIONE 4: AZIONI D'ESPORTAZIONE */}
      <div className="w-[190px] p-4 flex flex-col justify-between h-full bg-white select-none shrink-0 border-r-2 border-black" id="section-action-exports">
        <label className="text-[10px] uppercase font-black tracking-widest text-black block mb-1">4. Esportazione</label>
        
        <div className="space-y-1.5 flex-1 flex flex-col justify-center">
          <button
            onClick={onExportSvg}
            className="w-full bg-black hover:bg-neutral-850 text-white font-black text-[9px] uppercase tracking-wider py-1.5 px-3 rounded-none border-2 border-black flex items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
            id="export-svg-btn-hor"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400 stroke-[3]" />
            <span>Esporta SVG</span>
          </button>
          
          <button
            onClick={onExportPng}
            className="w-full bg-white hover:bg-neutral-50 text-black font-black text-[9px] uppercase tracking-wider py-1.5 px-3 rounded-none border-2 border-black flex items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
            id="export-png-btn-hor"
          >
            <Layers className="w-3.5 h-3.5 text-black stroke-[3]" />
            <span>Salva PNG</span>
          </button>
        </div>

        <p className="text-[7.5px] font-mono font-black text-cyan-700 tracking-wider text-center uppercase leading-none mt-2">PRONTO FOUNDRY V2</p>
      </div>

    </div>
  );
}

// Simple Inline Lucide replacement for missing icon
function ZapIcon(props: any) {
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
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
