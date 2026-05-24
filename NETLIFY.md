# Guida di Installazione su Netlify 🚀

Questa guida ti spiega come caricare ed eseguire **MostroFont Studio** su Netlify in pochissimi clic, mantenendo sicura ed attiva la generazione IA tramite **Gemini**.

## Come funziona?
Grazie al file `netlify.toml` che ho configurato per te:
1. Il codice React (frontend) viene compilato automaticamente dentro la cartella `dist/`.
2. I servizi di intelligenza artificiale di **Gemini v3.5 Flash** verranno eseguiti in modo sicuro sul server tramite una **Netlify Serverless Function** situata in `/netlify/functions/generate-monster-style.ts`.
3. In questo modo la tua chiave API di Gemini rimane nascosta nel backend di Netlify e nessuno potrà mai vederla o rubarla dal browser!

---

## Passo 1: Collega o Carica il Progetto su Netlify

### Opzione A: Collegamento automatico tramite GitHub (Consigliato ❤️)
1. Esporta questo progetto su **GitHub** inserendolo in un tuo repository privato o pubblico (puoi scaricare il file ZIP dal menu a sinistra o fare direttamente l'esportazione su GitHub).
2. Accedi al sito di [Netlify](https://www.netlify.com/) ed esegui il login.
3. Clicca su **"Add new site"** ➜ **"Import an existing project"**.
4. Scegli **GitHub** e seleziona il tuo repository.
5. Netlify rileverà automaticamente le impostazioni corrette grazie al file `netlify.toml`! 
   * *Se richiesto, assicurati che siano queste:*
     * **Build command**: `npm run build`
     * **Publish directory**: `dist`
6. Clicca su **"Deploy site"**.

### Opzione B: Caricamento manuale (Netlify Drop)
1. Scarica il codice in formato ZIP o compila l'applicazione in locale inserendo le dipendenze con `npm install` e poi compilando con `npm run build`.
2. Trascina la cartella `dist` risultante su **Netlify Drop**.

---

## Passo 2: Configura la Chiave API di Gemini 🔑

Per far funzionare l'Assistente IA di design su Netlify, devi inserire la tua chiave API di Gemini nei segreti di Netlify:

1. Nel pannello di controllo del tuo sito su Netlify, vai in **"Site configuration"** (Impostazioni del sito) nel menu a sinistra.
2. Clicca su **"Environment variables"** (Variabili d'ambiente) ➜ **"Add a variable"** (Aggiungi variabile).
3. Compila i campi in questo modo:
   * **Key**: `GEMINI_API_KEY`
   * **Value**: *Incolla qui la tua chiave API di Google Gemini*
4. Clicca su **"Create variable"** (Salva).
5. Vai nella sezione **"Deploys"** e clicca su **"Trigger deploy"** ➜ **"Clear cache and deploy site"** per ricaricare il sito con la nuova variabile salvata!

Fatto! Ora la tua bellissima applicazione MostroFont Studio funzionerà al 100% su Netlify, inclusa la divertente generazione automatica con intelligenza artificiale! 🎉
