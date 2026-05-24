import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini API client
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("ATTENZIONE: GEMINI_API_KEY non configurata. L'assistente IA funzionerà in modalità simulata.");
      throw new Error("GEMINI_API_KEY is not defined. Please configure it in your Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API to generate a monster style via Gemini
app.post('/api/generate-monster-style', async (req, res) => {
  const { prompt, currentText } = req.body;

  if (!prompt) {
    return res.status(400).json({ success: false, error: 'Prompt is required' });
  }

  try {
    const ai = getAiClient();
    
    const promptInstructions = `
You are an expert cartoon monster typography stylist and illustrator.
The user wants to configure a highly customized "Monster Font" styled text with dynamic physical attributes like eyes, fangs, horns, slime, colors, accessories (mustache, glasses, bowtie, blush), and textures based on this descriptive query: "${prompt}".
The active text being styled is: "${currentText || 'BUONANOTTE'}".

Your goal is to make the letters look beautiful, extremely varied, and cohesive under the user's theme.
Return a global style config and a detailed 'letterOverrides' array showing custom parameters for EVERY letter index in "${currentText || 'BUONANOTTE'}" so they look totally distinct from each other.

Analyze their request and output the design parameters as a JSON object matching this schema.
Values should align with these precise choices:
- globalGradientId: one of 'sunset-orange', 'bubblegum-pink', 'neon-slime', 'coral-sunset', 'cosmic-purple', 'ocean-aqua', 'gold-lemon', 'toxic-hazard', 'monster-magenta', 'custom'.
- customFrom: a hex color string (e.g. '#ff007f') to use if globalGradientId is 'custom', or to replace default colors.
- customTo: a hex color string (e.g. '#7f00ff') to use if globalGradientId is 'custom'.
- globalEyeStyle: one of 'normal', 'googly', 'cyclops', 'angry', 'cute', 'none'.
- globalEyeCount: integer from 0 to 3.
- globalHornStyle: one of 'none', 'devil', 'ears', 'spikes', 'crown', 'slug'.
- globalTeethStyle: one of 'none', 'fangs', 'sharp', 'underbite', 'gummy'.
- globalDetailStyle: one of 'none', 'spots', 'scales', 'slime', 'tail', 'wings'.
- globalAccessoryStyle: one of 'none', 'glasses', 'mustache', 'bowtie', 'blush'.
- globalStrokeColor: a hex color string for the heavy cartoon borders (usually dark deep purple or charcoal: e.g. '#1e1b4b', '#000000', or '#0f172a').
- bgStyle: description of background color (e.g., 'dark-night', 'swamp', 'cute-pink', 'toxic-green').
- analysis: A single, warm, enthusiastic sentence in Italian explaining the aesthetic choices of the generated monster character.
- letterOverrides: A customized, highly creative list of distinct style overrides for each character index in currentText so that every single letter is uniquely designed, styled, and rotated (-15 to 15 deg) to align with the theme!

Choose high-variety values! Mix and match gradients, eyes, and appendages.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: promptInstructions,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            globalGradientId: {
              type: Type.STRING,
              description: 'Gradient ID from the preset choices',
            },
            customFrom: {
              type: Type.STRING,
              description: 'Start hex color',
            },
            customTo: {
              type: Type.STRING,
              description: 'End hex color',
            },
            globalEyeStyle: {
              type: Type.STRING,
              description: 'Style of eyes',
            },
            globalEyeCount: {
              type: Type.INTEGER,
              description: 'Number of eyes',
            },
            globalHornStyle: {
              type: Type.STRING,
              description: 'Style of horns or ear structures on top',
            },
            globalTeethStyle: {
              type: Type.STRING,
              description: 'Style of mouth/fangs',
            },
            globalDetailStyle: {
              type: Type.STRING,
              description: 'Style of special decorations like tail, wings, or slime',
            },
            globalAccessoryStyle: {
              type: Type.STRING,
              description: 'Style of accessory like glasses, mustache, bowtie, blush',
            },
            globalStrokeColor: {
              type: Type.STRING,
              description: 'Hex string for borders',
            },
            bgStyle: {
              type: Type.STRING,
              description: 'Name of appropriate background class',
            },
            analysis: {
              type: Type.STRING,
              description: 'Self-explanation in Italian of what decisions were made to model the request.',
            },
            letterOverrides: {
              type: Type.ARRAY,
              description: 'A customized, creative list of style overrides for each character in the active text (length matched to currentText), so each letter looks unique and themed.',
              items: {
                type: Type.OBJECT,
                properties: {
                  index: { type: Type.INTEGER, description: 'Zero-based character index' },
                  eyeStyle: { type: Type.STRING, description: 'normal, googly, cyclops, angry, cute, none' },
                  eyeCount: { type: Type.INTEGER, description: 'Number of eyes 0 to 3' },
                  hornStyle: { type: Type.STRING, description: 'none, devil, ears, spikes, crown, slug' },
                  teethStyle: { type: Type.STRING, description: 'none, fangs, sharp, underbite, gummy' },
                  detailStyle: { type: Type.STRING, description: 'none, spots, scales, slime, tail, wings' },
                  accessoryStyle: { type: Type.STRING, description: 'none, glasses, mustache, bowtie, blush' },
                  gradientId: { type: Type.STRING, description: 'Gradient ID preset or custom' },
                  rotate: { type: Type.INTEGER, description: 'Rotation in degrees (-15 to 15)' },
                  offsetY: { type: Type.INTEGER, description: 'Vertical offset (-15 to 15)' }
                },
                required: ['index', 'eyeStyle', 'eyeCount', 'hornStyle', 'teethStyle', 'detailStyle', 'gradientId']
              }
            }
          },
          required: [
            'globalGradientId',
            'globalEyeStyle',
            'globalEyeCount',
            'globalHornStyle',
            'globalTeethStyle',
            'globalDetailStyle',
            'globalAccessoryStyle',
            'analysis',
            'letterOverrides'
          ],
        },
      },
    });

    const resultText = response.text;
    const parsedData = JSON.parse(resultText || '{}');

    return res.json({
      success: true,
      config: parsedData,
    });
  } catch (error: any) {
    console.error('Gemini processing error:', error);
    
    // Graceful fallback if API key is missing or calls fail, so the user has an awesome experience anyhow
    const mockResponses = [
      {
        globalGradientId: 'neon-slime',
        globalEyeStyle: 'googly',
        globalEyeCount: 2,
        globalHornStyle: 'slug',
        globalTeethStyle: 'fangs',
        globalDetailStyle: 'slime',
        globalAccessoryStyle: 'glasses',
        globalStrokeColor: '#111827',
        bgStyle: 'swamp',
        analysis: "Ho creato uno stile Slime Verde viscido con dettagli unici cuciti lettera per lettera!",
        letterOverrides: [
          { index: 0, eyeStyle: 'googly', eyeCount: 2, hornStyle: 'slug', teethStyle: 'fangs', detailStyle: 'slime', accessoryStyle: 'glasses', gradientId: 'neon-slime', rotate: -8, offsetY: 10 },
          { index: 1, eyeStyle: 'cyclops', eyeCount: 1, hornStyle: 'spikes', teethStyle: 'none', detailStyle: 'spots', accessoryStyle: 'none', gradientId: 'toxic-hazard', rotate: 5, offsetY: -8 },
          { index: 2, eyeStyle: 'normal', eyeCount: 2, hornStyle: 'none', teethStyle: 'sharp', detailStyle: 'slime', accessoryStyle: 'mustache', gradientId: 'gold-lemon', rotate: -4, offsetY: 6 },
          { index: 3, eyeStyle: 'angry', eyeCount: 3, hornStyle: 'devil', teethStyle: 'fangs', detailStyle: 'tail', accessoryStyle: 'none', gradientId: 'sunset-orange', rotate: 8, offsetY: -12 },
          { index: 4, eyeStyle: 'cute', eyeCount: 2, hornStyle: 'ears', teethStyle: 'underbite', detailStyle: 'wings', accessoryStyle: 'bowtie', gradientId: 'monster-magenta', rotate: -6, offsetY: 4 },
          { index: 5, eyeStyle: 'googly', eyeCount: 1, hornStyle: 'crown', teethStyle: 'gummy', detailStyle: 'scales', accessoryStyle: 'blush', gradientId: 'cosmic-purple', rotate: 10, offsetY: -10 },
          { index: 6, eyeStyle: 'cyclops', eyeCount: 1, hornStyle: 'slug', teethStyle: 'fangs', detailStyle: 'slime', accessoryStyle: 'glasses', gradientId: 'neon-slime', rotate: -5, offsetY: 8 },
          { index: 7, eyeStyle: 'angry', eyeCount: 2, hornStyle: 'devil', teethStyle: 'sharp', detailStyle: 'wings', accessoryStyle: 'none', gradientId: 'bubblegum-pink', rotate: 7, offsetY: -5 },
          { index: 8, eyeStyle: 'normal', eyeCount: 3, hornStyle: 'spikes', teethStyle: 'underbite', detailStyle: 'spots', accessoryStyle: 'bowtie', gradientId: 'coral-sunset', rotate: -9, offsetY: 12 },
          { index: 9, eyeStyle: 'cute', eyeCount: 2, hornStyle: 'ears', teethStyle: 'gummy', detailStyle: 'tail', accessoryStyle: 'blush', gradientId: 'ocean-aqua', rotate: 6, offsetY: -8 },
          { index: 10, eyeStyle: 'googly', eyeCount: 2, hornStyle: 'spikes', teethStyle: 'sharp', detailStyle: 'slime', accessoryStyle: 'glasses', gradientId: 'neon-slime', rotate: -7, offsetY: 5 }
        ]
      },
      {
        globalGradientId: 'monster-magenta',
        globalEyeStyle: 'angry',
        globalEyeCount: 3,
        globalHornStyle: 'devil',
        globalTeethStyle: 'underbite',
        globalDetailStyle: 'wings',
        globalAccessoryStyle: 'bowtie',
        globalStrokeColor: '#1e0b20',
        bgStyle: 'dark-night',
        analysis: "Ecco un piccolo diavolo rosa-magenta con ali di pipistrello, tre occhi infuriati e una dentatura sporgente aggressiva!",
        letterOverrides: [
          { index: 0, eyeStyle: 'angry', eyeCount: 3, hornStyle: 'devil', teethStyle: 'underbite', detailStyle: 'wings', accessoryStyle: 'bowtie', gradientId: 'monster-magenta', rotate: -10, offsetY: 8 },
          { index: 1, eyeStyle: 'normal', eyeCount: 2, hornStyle: 'none', teethStyle: 'fangs', detailStyle: 'spots', accessoryStyle: 'glasses', gradientId: 'cosmic-purple', rotate: 6, offsetY: -6 },
          { index: 2, eyeStyle: 'cute', eyeCount: 1, hornStyle: 'crown', teethStyle: 'none', detailStyle: 'scales', accessoryStyle: 'blush', gradientId: 'bubblegum-pink', rotate: -4, offsetY: 12 },
          { index: 3, eyeStyle: 'googly', eyeCount: 2, hornStyle: 'ears', teethStyle: 'sharp', detailStyle: 'slime', accessoryStyle: 'mustache', gradientId: 'neon-slime', rotate: 8, offsetY: -8 },
          { index: 4, eyeStyle: 'cyclops', eyeCount: 1, hornStyle: 'spikes', teethStyle: 'gummy', detailStyle: 'tail', accessoryStyle: 'none', gradientId: 'sunset-orange', rotate: -7, offsetY: 5 },
          { index: 5, eyeStyle: 'angry', eyeCount: 0, hornStyle: 'none', teethStyle: 'underbite', detailStyle: 'wings', accessoryStyle: 'bowtie', gradientId: 'monster-magenta', rotate: 9, offsetY: -10 },
          { index: 6, eyeStyle: 'normal', eyeCount: 2, hornStyle: 'devil', teethStyle: 'fangs', detailStyle: 'slime', accessoryStyle: 'glasses', gradientId: 'coral-sunset', rotate: -5, offsetY: 7 },
          { index: 7, eyeStyle: 'cute', eyeCount: 3, hornStyle: 'slug', teethStyle: 'gummy', detailStyle: 'spots', accessoryStyle: 'blush', gradientId: 'gold-lemon', rotate: 8, offsetY: -4 },
          { index: 8, eyeStyle: 'googly', eyeCount: 2, hornStyle: 'spikes', teethStyle: 'sharp', detailStyle: 'tail', accessoryStyle: 'mustache', gradientId: 'toxic-hazard', rotate: -12, offsetY: 10 },
          { index: 9, eyeStyle: 'cyclops', eyeCount: 1, hornStyle: 'ears', teethStyle: 'none', detailStyle: 'wings', accessoryStyle: 'none', gradientId: 'ocean-aqua', rotate: 5, offsetY: -8 }
        ]
      }
    ];

    const randomMock = mockResponses[Math.floor(Math.random() * mockResponses.length)];

    return res.json({
      success: false,
      isFallback: true,
      config: randomMock,
      error: error.message || 'Error occurred, returning style preset'
    });
  }
});

// Vite middleware setup or Static assets serving
async function initializeServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Serve SPA index.html
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MostroFont Studio] Server running on http://0.0.0.0:${PORT}`);
  });
}

initializeServer().catch(err => {
  console.error('Error starting server:', err);
});
