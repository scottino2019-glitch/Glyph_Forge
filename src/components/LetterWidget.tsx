import { useMemo } from 'react';
import { motion } from 'motion/react';
import { LetterStyle, EyeStyle, HornStyle, TeethStyle, DetailStyle } from '../types';
import { 
  LETTERS_PATHS, 
  LETTER_CENTERS, 
  HORNS_VECTOR, 
  DRAW_EYE, 
  TEETH_VECTOR, 
  DETAILS_VECTOR, 
  GRADIENT_PRESETS 
} from '../constants/monsterGlyphs';

interface LetterWidgetProps {
  style: LetterStyle;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

export default function LetterWidget({ style, index, isSelected, onClick }: LetterWidgetProps) {
  const {
    char,
    eyeStyle,
    eyeCount,
    eyePosition,
    hornStyle,
    teethStyle,
    detailStyle,
    accessoryStyle,
    gradientId,
    gradientFrom,
    gradientTo,
    strokeColor,
    strokeWidth,
    rotate,
    scale,
    offsetY,
    isAnimated,
    animationType
  } = style;

  const upperChar = useMemo(() => char.toUpperCase(), [char]);
  const path = useMemo(() => LETTERS_PATHS[upperChar] || LETTERS_PATHS['O'], [upperChar]);
  const centerPos = useMemo(() => LETTER_CENTERS[upperChar] || { x: 50, y: 50, type: 'center' }, [upperChar]);

  // Intercept blank space and render a beautifully integrated spacer
  if (char === ' ') {
    return (
      <div 
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={`relative cursor-pointer select-none transition-all duration-300 rounded-2xl flex items-center justify-center p-1 w-full h-full
          ${isSelected ? 'ring-4 ring-rose-500 shadow-2xl bg-[#FFE4E6]/25' : 'hover:bg-[#FFF]/10'}`}
        style={{
          transformOrigin: 'center center',
          y: offsetY,
        }}
        id={`letter-widget-${index}-space`}
      >
        <div className={`w-full h-full py-6 px-1.5 rounded-xl flex flex-col items-center justify-center border-2 border-dashed aspect-square transition-all
          ${isSelected ? 'border-rose-500 bg-rose-500/15' : 'border-white/20 bg-white/5 hover:border-white/35 shadow-sm'}`}>
          <span className="text-xl select-none leading-none mb-1">🌌</span>
          <span className="text-[7.5px] font-mono font-black text-rose-400 select-none uppercase tracking-widest">SPAZIO</span>
        </div>
      </div>
    );
  }

  // Determine colors based on gradient selection
  const colors = useMemo(() => {
    if (gradientId === 'custom') {
      return {
        from: gradientFrom || '#ff007f',
        to: gradientTo || '#7f00ff'
      };
    }
    const preset = GRADIENT_PRESETS.find(p => p.id === gradientId);
    return preset ? { from: preset.from, to: preset.to } : { from: '#f59e0b', to: '#ef4444' };
  }, [gradientId, gradientFrom, gradientTo]);

  // Gradient IDs for local SVG scope
  const gradId = `grad-${index}-${upperChar}`;
  const clipId = `clip-${index}-${upperChar}`;

  // Build eyes coordinate list
  const eyes = useMemo(() => {
    if (eyeStyle === 'none' || eyeCount === 0) return [];
    
    const results = [];
    const isInside = eyePosition === 'inside' && centerPos.type === 'hole';
    
    if (isInside) {
      // Positioned tidy inside the hollow spaces of the letter
      const hX = centerPos.x;
      const hY = centerPos.y;
      if (eyeCount === 1) {
        results.push({ x: hX, y: hY, r: 12 });
      } else if (eyeCount === 2) {
        results.push({ x: hX - 8, y: hY, r: 8 });
        results.push({ x: hX + 8, y: hY, r: 9 });
      } else {
        results.push({ x: hX - 9, y: hY + 2, r: 7 });
        results.push({ x: hX, y: hY - 6, r: 9 });
        results.push({ x: hX + 9, y: hY + 2, r: 7 });
      }
    } else {
      // Placed on top of the letter shape
      if (eyeCount === 1) {
        results.push({ x: 50, y: 4, r: 14 });
      } else if (eyeCount === 2) {
        results.push({ x: 34, y: 6, r: 11 });
        results.push({ x: 66, y: 4, r: 12 });
      } else if (eyeCount === 3) {
        results.push({ x: 26, y: 10, r: 9 });
        results.push({ x: 50, y: 2, r: 12 });
        results.push({ x: 74, y: 10, r: 10 });
      }
    }
    return results;
  }, [eyeStyle, eyeCount, eyePosition, centerPos]);

  // Framer Motion Animation variants
  const animationVariants = {
    none: {},
    jiggle: {
      rotate: [rotate, rotate - 3, rotate + 3, rotate - 2, rotate],
      transition: {
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    bounce: {
      y: [offsetY, offsetY - 8, offsetY, offsetY - 4, offsetY],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.12
      }
    },
    breath: {
      scale: [scale, scale * 1.04, scale],
      transition: {
        duration: 2.2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.2
      }
    }
  };

  const activeVariant = isAnimated && animationType !== 'none' ? animationType : 'none';

  return (
    <motion.div
      variants={animationVariants}
      animate={activeVariant}
      initial={{ scale: 0.2, rotate: rotate * 2, opacity: 0 }}
      whileInView={{ scale: scale, rotate: rotate, opacity: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: scale * 1.08, zIndex: 10 }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`relative cursor-pointer select-none transition-shadow rounded-2xl flex items-center justify-center p-1
        ${isSelected ? 'ring-4 ring-rose-500 shadow-2xl bg-slate-800/20' : 'hover:bg-slate-700/5'}`}
      style={{
        transformOrigin: 'center center',
        y: offsetY,
      }}
      id={`letter-widget-${index}-${upperChar}`}
    >
      <svg
        width="140"
        height="140"
        viewBox="-20 -20 140 140"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)]"
      >
        <defs>
          {/* Main vertical linear gradient for letter fill */}
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.from} />
            <stop offset="100%" stopColor={colors.to} />
          </linearGradient>

          {/* Mask to clip detailing spots inside the letter body */}
          <clipPath id={clipId}>
            <path d={path} />
          </clipPath>
        </defs>

        {/* 1. LAYER BACKWARDS: Wings */}
        {detailStyle === 'wings' && (
          <g className="text-slate-800" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round">
            {DETAILS_VECTOR.wings.map((wing, i) => (
              <path key={i} d={wing.d} fill={wing.fill} />
            ))}
          </g>
        )}

        {/* 2. LAYER BACKWARDS: Horns (ears, slug stalks etc.) if they sit on top */}
        {hornStyle !== 'none' && HORNS_VECTOR[hornStyle] && (
          <g stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round">
            {/* Draw horns in matching colors or contrasting colors */}
            {HORNS_VECTOR[hornStyle].map((horn, i) => (
              <path 
                key={i} 
                d={horn.d} 
                fill={horn.color || `url(#${gradId})`}
                className={horn.color ? "" : "text-rose-500"} 
              />
            ))}
            {/* Special accessory renders for slug bulbs inside HORNS_VECTOR */}
            {hornStyle === 'slug' && (
              <>
                <circle cx={HORNS_VECTOR.slug[2].cx} cy={HORNS_VECTOR.slug[2].cy} r={HORNS_VECTOR.slug[2].r} fill={HORNS_VECTOR.slug[2].fill} />
                <circle cx={HORNS_VECTOR.slug[3].cx} cy={HORNS_VECTOR.slug[3].cy} r={HORNS_VECTOR.slug[3].r} fill={HORNS_VECTOR.slug[3].fill} />
                <circle cx={HORNS_VECTOR.slug[4].cx} cy={HORNS_VECTOR.slug[4].cy} r={HORNS_VECTOR.slug[4].r} fill={HORNS_VECTOR.slug[4].fill} />
                <circle cx={HORNS_VECTOR.slug[5].cx} cy={HORNS_VECTOR.slug[5].cy} r={HORNS_VECTOR.slug[5].r} fill={HORNS_VECTOR.slug[5].fill} />
              </>
            )}
          </g>
        )}

        {/* 3. LAYER MAIN: Letters & Inner Detailing */}
        <g stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round">
          {/* Main letter body with border */}
          <path d={path} fill={`url(#${gradId})`} />

          {/* Detailing shapes clipped to the body (e.g. skin spots, scales) */}
          <g clipPath={`url(#${clipId})`}>
            {detailStyle === 'spots' && DETAILS_VECTOR.spots.map((spot, i) => (
              <circle key={i} cx={spot.cx} cy={spot.cy} r={spot.r} fill={spot.fill} opacity={spot.opacity} />
            ))}
            {detailStyle === 'scales' && (
              <path d={DETAILS_VECTOR.scales[0].d} fill={DETAILS_VECTOR.scales[0].fill} stroke={strokeColor} strokeOpacity={0.25} strokeWidth={2.5} />
            )}
          </g>
        </g>

        {/* 4. LAYER OVERLAY: Teeth (inside hole or offset over center) */}
        {teethStyle !== 'none' && TEETH_VECTOR[teethStyle] && (
          <g stroke={strokeColor} strokeWidth={strokeWidth / 1.5} strokeLinejoin="round" strokeLinecap="round">
            {teethStyle === 'fangs' && (
              // Fangs drop down from top edge of hole or mouth center coordinates
              <g transform={`translate(${centerPos.x - 50}, ${centerPos.y - 45})`}>
                {TEETH_VECTOR.fangs.map((tooth, i) => (
                  <path key={i} d={tooth.d} fill={tooth.fill} />
                ))}
              </g>
            )}
            {teethStyle === 'sharp' && (
              // Spiky horizontal teeth line inside
              <g transform={`translate(${centerPos.x - 50}, ${centerPos.y - 45})`}>
                <path d={TEETH_VECTOR.sharp[0].d} fill={TEETH_VECTOR.sharp[0].fill} stroke={strokeColor} strokeWidth={strokeWidth / 1.5} />
              </g>
            )}
            {teethStyle === 'underbite' && (
              // Giant tasking hooks pointing up
              <g transform={`translate(${centerPos.x - 50}, ${centerPos.y - 70})`}>
                {TEETH_VECTOR.underbite.map((tooth, i) => (
                  <path key={i} d={tooth.d} fill={tooth.fill} />
                ))}
              </g>
            )}
            {teethStyle === 'gummy' && (
              <g transform={`translate(${centerPos.x - 50}, ${centerPos.y - 72})`}>
                <path d={TEETH_VECTOR.gummy[0].d} fill={TEETH_VECTOR.gummy[0].fill} />
              </g>
            )}
          </g>
        )}

        {/* 5. LAYER OVERLAY: Googly/Monster Eyes */}
        {eyes.map((eyeCoords, i) => {
          const eye = DRAW_EYE(eyeCoords.x, eyeCoords.y, eyeCoords.r, eyeStyle, index + i);
          return (
            <g key={i} stroke={strokeColor} strokeWidth={strokeWidth / 1.8} strokeLinejoin="round" strokeLinecap="round">
              {/* Eye White */}
              <circle cx={eye.white.cx} cy={eye.white.cy} r={eye.white.r} fill="#ffffff" />
              
              {/* Pupil Iris/Pupil */}
              <circle cx={eye.pupil.cx} cy={eye.pupil.cy} r={eye.pupil.r} fill={strokeColor} />
              
              {/* Highlighting Shimmers */}
              {eye.shimmer.map((shim, sIdx) => (
                <circle key={sIdx} cx={shim.cx} cy={shim.cy} r={shim.r} fill={shim.fill} stroke="none" />
              ))}

              {/* Angle eyebrow/eyelid if angry */}
              {eye.lid && <path d={eye.lid.d} fill={eye.lid.fill} />}

              {/* Cute Eyelashes if cute */}
              {eye.cuteLashes && eye.cuteLashes.map((lash, lIdx) => (
                <line 
                  key={lIdx} 
                  x1={lash.x1} 
                  y1={lash.y1} 
                  x2={lash.x2} 
                  y2={lash.y2} 
                  stroke={strokeColor} 
                  strokeWidth={strokeWidth / 1.8} 
                />
              ))}
            </g>
          );
        })}

        {/* 5b. LAYER OVERLAY: Accessories (glasses, mustache, bowtie, blush) */}
        {accessoryStyle === 'glasses' && (
          <g stroke={strokeColor} strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm">
            <circle cx={centerPos.x - 14} cy={centerPos.y - 1} r="10.5" />
            <circle cx={centerPos.x + 14} cy={centerPos.y - 1} r="10.5" />
            <line x1={centerPos.x - 3.5} y1={centerPos.y - 1} x2={centerPos.x + 3.5} y2={centerPos.y - 1} />
            {/* Side frame pieces */}
            <path d={`M ${centerPos.x - 24.5} ${centerPos.y - 1} Q ${centerPos.x - 31} ${centerPos.y - 5} ${centerPos.x - 37} ${centerPos.y + 3}`} />
            <path d={`M ${centerPos.x + 24.5} ${centerPos.y - 1} Q ${centerPos.x + 31} ${centerPos.y - 5} ${centerPos.x + 37} ${centerPos.y + 3}`} />
          </g>
        )}

        {accessoryStyle === 'mustache' && (
          <g stroke={strokeColor} strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
            <path 
              d={`M ${centerPos.x} ${centerPos.y + 11} 
                  Q ${centerPos.x - 13} ${centerPos.y + 7} ${centerPos.x - 20} ${centerPos.y + 14} 
                  Q ${centerPos.x - 10} ${centerPos.y + 17} ${centerPos.x} ${centerPos.y + 12.5} 
                  Q ${centerPos.x + 10} ${centerPos.y + 17} ${centerPos.x + 20} ${centerPos.y + 14} 
                  Q ${centerPos.x + 13} ${centerPos.y + 7} ${centerPos.x} ${centerPos.y + 11} Z`} 
              fill={strokeColor} 
            />
          </g>
        )}

        {accessoryStyle === 'bowtie' && (
          <g stroke={strokeColor} strokeWidth={strokeWidth / 1.5} strokeLinejoin="round" strokeLinecap="round">
            <path d={`M ${centerPos.x} 86 L ${centerPos.x - 13} 77 V 95 Z`} fill="#ff296d" />
            <path d={`M ${centerPos.x} 86 L ${centerPos.x + 13} 77 V 95 Z`} fill="#ff296d" />
            <circle cx={centerPos.x} cy="86" r="4" fill="#f5ee30" stroke={strokeColor} strokeWidth={strokeWidth / 2} />
          </g>
        )}

        {accessoryStyle === 'blush' && (
          <g opacity="0.65">
            <ellipse cx={centerPos.x - 18} cy={centerPos.y + 8} rx="6.5" ry="3.5" fill="#ff4081" stroke="none" />
            <ellipse cx={centerPos.x + 18} cy={centerPos.y + 8} rx="6.5" ry="3.5" fill="#ff4081" stroke="none" />
          </g>
        )}

        {/* 6. LAYER OVERLAY: Slime / Tail details (which bleed out of the letter box) */}
        {detailStyle === 'slime' && (
          <g stroke={strokeColor} strokeWidth={strokeWidth / 1.5} strokeLinejoin="round" strokeLinecap="round" opacity="0.9">
            {DETAILS_VECTOR.slime.map((drip, i) => (
              <path key={i} d={drip.d} fill={`url(#${gradId})`} />
            ))}
          </g>
        )}

        {detailStyle === 'tail' && (
          <g stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round">
            <path d={DETAILS_VECTOR.tail[0].d} fill={`url(#${gradId})`} />
            <path d={DETAILS_VECTOR.tail[1].d} fill={DETAILS_VECTOR.tail[1].fill} stroke={strokeColor} strokeWidth={strokeWidth / 1.5} />
            <path d={DETAILS_VECTOR.tail[2].d} fill={DETAILS_VECTOR.tail[2].fill} stroke={strokeColor} strokeWidth={strokeWidth / 1.5} />
          </g>
        )}
      </svg>
      
      {/* Letter selection highlight frame */}
      {isSelected && (
        <span className="absolute bottom-1 right-1 bg-rose-500 font-mono text-[10px] text-white px-1.5 py-0.5 rounded-md shadow-md animate-pulse">
          MODIFICA
        </span>
      )}
    </motion.div>
  );
}
