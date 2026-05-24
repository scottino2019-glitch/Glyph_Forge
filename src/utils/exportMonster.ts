import { MonsterConfig, LetterStyle, EyeStyle, HornStyle, TeethStyle, DetailStyle, AccessoryStyle } from '../types';
import { 
  LETTERS_PATHS, 
  LETTER_CENTERS, 
  HORNS_VECTOR, 
  DRAW_EYE, 
  TEETH_VECTOR, 
  DETAILS_VECTOR, 
  GRADIENT_PRESETS 
} from '../constants/monsterGlyphs';

// Generates a fully functional scalable stand-alone vector XML SVG of the current monster text
export function compileMonsterSvg(config: MonsterConfig): string {
  const { text, spacing, letterOverrides } = config;
  const charArray = text.split('');
  
  if (charArray.length === 0) return '';

  const letterWidth = 100;
  const gap = spacing; // e.g. -15 to 30
  const letterHeight = 100;

  // Calculate coordinates
  // Width of each step is (letterWidth + gap)
  const innerWidth = charArray.length * letterWidth + (charArray.length - 1) * gap;
  const marginX = 40;
  const marginY = 40;
  const totalWidth = innerWidth + marginX * 2;
  const totalHeight = letterHeight + marginY * 2;

  let defs = '';
  let elementsXml = '';

  // Add filters for drop shadow
  defs += `
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="${config.shadowOffsetX || 0}" dy="${config.shadowOffsetY || 4}" stdDeviation="6" flood-color="#000" flood-opacity="0.35"/>
    </filter>
  `;

  charArray.forEach((char, idx) => {
    // Standard spaces are skipped from rendering nodes, preserving natural gap
    if (char === ' ') {
      return;
    }

    const upperChar = char.toUpperCase();
    const path = LETTERS_PATHS[upperChar] || LETTERS_PATHS['O'];
    const centerPos = LETTER_CENTERS[upperChar] || { x: 50, y: 50, type: 'center' };
    
    // Merge styles
    const override = letterOverrides[idx] || {};
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

    if (divMode === 'asymmetric') {
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

    const style = {
      eyeStyle: override.eyeStyle || dEyeStyle,
      eyeCount: override.eyeCount !== undefined ? override.eyeCount : dEyeCount,
      eyePosition: override.eyePosition || 'top',
      hornStyle: override.hornStyle || dHornStyle,
      teethStyle: override.teethStyle || dTeethStyle,
      detailStyle: override.detailStyle || dDetailStyle,
      accessoryStyle: override.accessoryStyle || dAccessoryStyle,
      gradientId: override.gradientId || dGradientId,
      strokeColor: override.strokeColor || config.globalStrokeColor,
      strokeWidth: override.strokeWidth || config.globalStrokeWidth,
      rotate: override.rotate !== undefined ? override.rotate : defaultRotate,
      scale: override.scale !== undefined ? override.scale : 1,
      offsetY: override.offsetY !== undefined ? override.offsetY : defaultOffsetY
    };

    // Grab colors
    let fromBg = '#f59e0b';
    let toBg = '#ef4444';
    if (style.gradientId === 'custom') {
      fromBg = override.gradientFrom || config.letterOverrides[0]?.gradientFrom || '#ff007f';
      toBg = override.gradientTo || config.letterOverrides[0]?.gradientTo || '#7f00ff';
    } else {
      const preset = GRADIENT_PRESETS.find(p => p.id === style.gradientId);
      if (preset) {
        fromBg = preset.from;
        toBg = preset.to;
      }
    }

    const gradId = `grad-ext-${idx}-${upperChar}`;
    const clipId = `clip-ext-${idx}-${upperChar}`;

    // Add unique gradients and clipping path
    defs += `
      <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${fromBg}" />
        <stop offset="100%" stop-color="${toBg}" />
      </linearGradient>
      <clipPath id="${clipId}">
        <path d="${path}" />
      </clipPath>
    `;

    // Coordinates of current glyph matrix
    const xPos = marginX + idx * (letterWidth + gap);
    const yPos = marginY + style.offsetY;

    // Build letter group with rotation and scale transforms
    let letterGroup = `<g transform="translate(${xPos}, ${yPos}) rotate(${style.rotate}, 50, 50) scale(${style.scale})">`;

    // 1. Wings
    if (style.detailStyle === 'wings') {
      DETAILS_VECTOR.wings.forEach(wing => {
        letterGroup += `
          <path d="${wing.d}" fill="${wing.fill}" stroke="${style.strokeColor}" stroke-width="${style.strokeWidth}" stroke-linejoin="round" stroke-linecap="round" />
        `;
      });
    }

    // 2. Horns
    if (style.hornStyle !== 'none' && HORNS_VECTOR[style.hornStyle]) {
      HORNS_VECTOR[style.hornStyle].forEach(horn => {
        const fillValue = horn.color || `url(#${gradId})`;
        letterGroup += `
          <path d="${horn.d}" fill="${fillValue}" stroke="${style.strokeColor}" stroke-width="${style.strokeWidth}" stroke-linejoin="round" stroke-linecap="round" />
        `;
      });
      // Specific slug antennae eye bulbs
      if (style.hornStyle === 'slug') {
        letterGroup += `
          <circle cx="34" cy="-11" r="4" fill="#fff" stroke="${style.strokeColor}" stroke-width="${style.strokeWidth/2}" />
          <circle cx="33.5" cy="-11" r="1.8" fill="${style.strokeColor}" />
          <circle cx="66" cy="-11" r="4" fill="#fff" stroke="${style.strokeColor}" stroke-width="${style.strokeWidth/2}" />
          <circle cx="65.5" cy="-11" r="1.8" fill="${style.strokeColor}" />
        `;
      }
    }

    // 3. Main Letter with Stroke
    letterGroup += `
      <path d="${path}" fill="url(#${gradId})" stroke="${style.strokeColor}" stroke-width="${style.strokeWidth}" stroke-linejoin="round" stroke-linecap="round" />
    `;

    // 4. Spots or scales clipped
    letterGroup += `<g clip-path="url(#${clipId})">`;
    if (style.detailStyle === 'spots') {
      DETAILS_VECTOR.spots.forEach(spot => {
        letterGroup += `
          <circle cx="${spot.cx}" cy="${spot.cy}" r="${spot.r}" fill="${spot.fill}" opacity="${spot.opacity}" />
        `;
      });
    } else if (style.detailStyle === 'scales') {
      letterGroup += `
        <path d="${DETAILS_VECTOR.scales[0].d}" fill="none" stroke="${style.strokeColor}" stroke-opacity="0.25" stroke-width="2.5" />
      `;
    }
    letterGroup += `</g>`;

    // 5. Teeth
    if (style.teethStyle !== 'none' && TEETH_VECTOR[style.teethStyle]) {
      const scaleOffset = style.teethStyle === 'fangs' ? { x: centerPos.x - 50, y: centerPos.y - 45 } 
                        : style.teethStyle === 'sharp' ? { x: centerPos.x - 50, y: centerPos.y - 45 }
                        : style.teethStyle === 'underbite' ? { x: centerPos.x - 50, y: centerPos.y - 70 }
                        : { x: centerPos.x - 50, y: centerPos.y - 72 }; // gummy

      letterGroup += `<g transform="translate(${scaleOffset.x}, ${scaleOffset.y})">`;
      if (style.teethStyle === 'fangs') {
        TEETH_VECTOR.fangs.forEach(tooth => {
          letterGroup += `<path d="${tooth.d}" fill="${tooth.fill}" stroke="${style.strokeColor}" stroke-width="${style.strokeWidth/1.5}" stroke-linejoin="round" stroke-linecap="round" />`;
        });
      } else if (style.teethStyle === 'sharp') {
        letterGroup += `<path d="${TEETH_VECTOR.sharp[0].d}" fill="none" stroke="${style.strokeColor}" stroke-width="${style.strokeWidth/1.5}" stroke-linejoin="round" stroke-linecap="round" />`;
      } else if (style.teethStyle === 'underbite') {
        TEETH_VECTOR.underbite.forEach(tooth => {
          letterGroup += `<path d="${tooth.d}" fill="${tooth.fill}" stroke="${style.strokeColor}" stroke-width="${style.strokeWidth/1.5}" stroke-linejoin="round" stroke-linecap="round" />`;
        });
      } else if (style.teethStyle === 'gummy') {
        letterGroup += `<path d="${TEETH_VECTOR.gummy[0].d}" fill="${TEETH_VECTOR.gummy[0].fill}" stroke="${style.strokeColor}" stroke-width="${style.strokeWidth/1.5}" stroke-linejoin="round" stroke-linecap="round" />`;
      }
      letterGroup += `</g>`;
    }

    // 6. Eyes (cyclops, googly, angry, cute)
    if (style.eyeStyle !== 'none' && style.eyeCount > 0) {
      const isInside = style.eyePosition === 'inside' && centerPos.type === 'hole';
      const eyeCoordsList = [];
      
      if (isInside) {
        const hX = centerPos.x;
        const hY = centerPos.y;
        if (style.eyeCount === 1) {
          eyeCoordsList.push({ x: hX, y: hY, r: 12 });
        } else if (style.eyeCount === 2) {
          eyeCoordsList.push({ x: hX - 8, y: hY, r: 8 });
          eyeCoordsList.push({ x: hX + 8, y: hY, r: 9 });
        } else {
          eyeCoordsList.push({ x: hX - 9, y: hY + 2, r: 7 });
          eyeCoordsList.push({ x: hX, y: hY - 6, r: 9 });
          eyeCoordsList.push({ x: hX + 9, y: hY + 2, r: 7 });
        }
      } else {
        if (style.eyeCount === 1) {
          eyeCoordsList.push({ x: 50, y: 4, r: 14 });
        } else if (style.eyeCount === 2) {
          eyeCoordsList.push({ x: 34, y: 6, r: 11 });
          eyeCoordsList.push({ x: 66, y: 4, r: 12 });
        } else if (style.eyeCount === 3) {
          eyeCoordsList.push({ x: 26, y: 10, r: 9 });
          eyeCoordsList.push({ x: 50, y: 2, r: 12 });
          eyeCoordsList.push({ x: 74, y: 10, r: 10 });
        }
      }

      eyeCoordsList.forEach((eyeCoords, eIdx) => {
        const eye = DRAW_EYE(eyeCoords.x, eyeCoords.y, eyeCoords.r, style.eyeStyle, idx + eIdx);
        letterGroup += `
          <g stroke="${style.strokeColor}" stroke-width="${style.strokeWidth / 1.8}" stroke-linejoin="round" stroke-linecap="round">
            <circle cx="${eye.white.cx}" cy="${eye.white.cy}" r="${eye.white.r}" fill="#ffffff" />
            <circle cx="${eye.pupil.cx}" cy="${eye.pupil.cy}" r="${eye.pupil.r}" fill="${style.strokeColor}" />
        `;
        // Highlighting dots
        eye.shimmer.forEach(shim => {
          letterGroup += `<circle cx="${shim.cx}" cy="${shim.cy}" r="${shim.r}" fill="#ffffff" stroke="none" />`;
        });
        // Eyebrow if angry
        if (eye.lid) {
          letterGroup += `<path d="${eye.lid.d}" fill="${eye.lid.fill}" stroke="none" />`;
        }
        // Lashes if cute
        if (eye.cuteLashes) {
          eye.cuteLashes.forEach(lash => {
            letterGroup += `<line x1="${lash.x1}" y1="${lash.y1}" x2="${lash.x2}" y2="${lash.y2}" stroke="${style.strokeColor}" stroke-width="${style.strokeWidth/1.8}" />`;
          });
        }
        letterGroup += `</g>`;
      });
    }

    // 6.5. Accessories (glasses, mustache, bowtie, blush)
    if (style.accessoryStyle === 'glasses') {
      letterGroup += `
        <g stroke="${style.strokeColor}" stroke-width="3.2" fill="none" stroke-linejoin="round" stroke-linecap="round">
          <circle cx="${centerPos.x - 14}" cy="${centerPos.y - 1}" r="10.5" />
          <circle cx="${centerPos.x + 14}" cy="${centerPos.y - 1}" r="10.5" />
          <line x1="${centerPos.x - 3.5}" y1="${centerPos.y - 1}" x2="${centerPos.x + 3.5}" y2="${centerPos.y - 1}" />
          <path d="M ${centerPos.x - 24.5} ${centerPos.y - 1} Q ${centerPos.x - 31} ${centerPos.y - 5} ${centerPos.x - 37} ${centerPos.y + 3}" />
          <path d="M ${centerPos.x + 24.5} ${centerPos.y - 1} Q ${centerPos.x + 31} ${centerPos.y - 5} ${centerPos.x + 37} ${centerPos.y + 3}" />
        </g>
      `;
    } else if (style.accessoryStyle === 'mustache') {
      letterGroup += `
        <g stroke="${style.strokeColor}" stroke-width="0.8" stroke-linejoin="round" stroke-linecap="round">
          <path d="M ${centerPos.x} ${centerPos.y + 11} Q ${centerPos.x - 13} ${centerPos.y + 7} ${centerPos.x - 20} ${centerPos.y + 14} Q ${centerPos.x - 10} ${centerPos.y + 17} ${centerPos.x} ${centerPos.y + 12.5} Q ${centerPos.x + 10} ${centerPos.y + 17} ${centerPos.x + 20} ${centerPos.y + 14} Q ${centerPos.x + 13} ${centerPos.y + 7} ${centerPos.x} ${centerPos.y + 11} Z" fill="${style.strokeColor}" />
        </g>
      `;
    } else if (style.accessoryStyle === 'bowtie') {
      letterGroup += `
        <g stroke="${style.strokeColor}" stroke-width="${style.strokeWidth / 1.5}" stroke-linejoin="round" stroke-linecap="round">
          <path d="M ${centerPos.x} 86 L ${centerPos.x - 13} 77 V 95 Z" fill="#ff296d" />
          <path d="M ${centerPos.x} 86 L ${centerPos.x + 13} 77 V 95 Z" fill="#ff296d" />
          <circle cx="${centerPos.x}" cy="86" r="4" fill="#f5ee30" stroke="${style.strokeColor}" stroke-width="${style.strokeWidth / 2}" />
        </g>
      `;
    } else if (style.accessoryStyle === 'blush') {
      letterGroup += `
        <g opacity="0.65">
          <ellipse cx="${centerPos.x - 18}" cy="${centerPos.y + 8}" rx="6.5" ry="3.5" fill="#ff4081" stroke="none" />
          <ellipse cx="${centerPos.x + 18}" cy="${centerPos.y + 8}" rx="6.5" ry="3.5" fill="#ff4081" stroke="none" />
        </g>
      `;
    }

    // 7. Slime
    if (style.detailStyle === 'slime') {
      DETAILS_VECTOR.slime.forEach(drip => {
        letterGroup += `
          <path d="${drip.d}" fill="url(#${gradId})" stroke="${style.strokeColor}" stroke-width="${style.strokeWidth/1.5}" stroke-linejoin="round" stroke-linecap="round" opacity="0.9" />
        `;
      });
    }

    // 8. Tail
    if (style.detailStyle === 'tail') {
      letterGroup += `
        <path d="${DETAILS_VECTOR.tail[0].d}" fill="url(#${gradId})" stroke="${style.strokeColor}" stroke-width="${style.strokeWidth}" stroke-linejoin="round" stroke-linecap="round" />
        <path d="${DETAILS_VECTOR.tail[1].d}" fill="${DETAILS_VECTOR.tail[1].fill}" stroke="${style.strokeColor}" stroke-width="${style.strokeWidth/1.5}" stroke-linejoin="round" stroke-linecap="round" />
        <path d="${DETAILS_VECTOR.tail[2].d}" fill="${DETAILS_VECTOR.tail[2].fill}" stroke="${style.strokeColor}" stroke-width="${style.strokeWidth/1.5}" stroke-linejoin="round" stroke-linecap="round" />
      `;
    }

    letterGroup += `</g>`; // End letter tag
    elementsXml += letterGroup;
  });

  const fullSvg = `<?xml version="1.0" encoding="utf-8"?>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}">
  <defs>
    ${defs}
  </defs>
  <!-- Background transparent or dark colored wrapper -->
  <rect width="100%" height="100%" fill="none" />
  
  <g filter="url(#shadow)">
    ${elementsXml}
  </g>
</svg>`;

  return fullSvg;
}
