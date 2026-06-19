# H.E.L.P. Center — Free-First AI Routing with Paid Gemini Fallback

**Date:** 2026-06-15
**Status:** Design approved, pending spec review
**Author:** J.L. Foreman (with Claude)

## Goal

Restructure the H.E.L.P. Center app's AI usage around a strict **free-first, pay-as-fallback** philosophy across all three AI modalities — text, images, and voice — by introducing paid Gemini keys that are only ever reached after free options are exhausted (text) or explicitly requested (images, voice).

## Background / current state

- **Text:** A single free `geminiApiKey` drives Gemini 2.5 Flash as primary, then Groq → OpenRouter → Ollama as fallbacks. The chain lives in several helpers that each build a provider order: `askAI` (app-phase2.js), `callAI` (app-phase1.js), `_aiStreamGeminiOrNull` (app-phase1.js), `_callToolModel` (app-phase2.js), and a non-streaming Gemini helper (app-phase2.js ~5889). `askAI` already supports a configurable, deduped provider order driven by Settings dropdowns (`aiProvider`, `aiFallbackProvider`) over the set `gemini, groq, claude, openai, openrouter, ollama`.
- **Images:** Only one integration point — Vibe Coder's `generate_image` tool (app-phase2.js ~11043/11077) — which always uses free Pollinations and embeds the resulting URL into generated HTML. No paid path exists.
- **Voice:** Voice Studio (`voiceforge.html`, a standalone file deployed to the VPS as `/pb/voiceforge.html`) uses the **Groq** key (free Groq/PlayAI TTS) via a postMessage handshake in app-phase1.js (~2612) — NOT Gemini.

## Decisions (locked)

### 1. New settings

Add two new fields to `settings` (localStorage), wired through the same save/load path as the existing `geminiApiKey`:

- `geminiApiKey2` — a **second free** Gemini key (rotation partner, doubles free daily quota)
- `geminiApiKeyPaid` — a **billing-enabled** Gemini key (paid fallback + premium images/voice)

Settings → AI Integration gains a "Free Gemini key #2" input and a "Paid Gemini key" input beside the current Gemini key field.

> Operational note: the user uploads the paid key first, then adds billing funds afterward. The design must tolerate an **uploaded-but-unfunded** paid key (calls error with billing-required) without breaking any feature — see graceful degradation below.

### 2. Text chain

Final provider order (applied in every text helper):

```
free Gemini #1  →  free Gemini #2  →  Groq  →  paid Gemini  →  Ollama
```

- The `gemini` provider step tries `geminiApiKey`, and on quota/failure rotates to `geminiApiKey2` (same pattern Groq already uses for `groqApiKey`/`groqApiKey2`). Both free keys are exhausted before Groq.
- A new `geminiPaid` provider step (uses `geminiApiKeyPaid`; same `gemini-2.5-flash` generationConfig including `thinkingConfig: { thinkingBudget: 0 }` and `maxOutputTokens: 8192`) sits **after** Groq.
- **OpenRouter is removed** from the default chain (redundant with Groq's Llama 70B). Its `_try.openrouter` branch and the `openRouterApiKey` Settings input are removed from the default order; existing code that references it is cleaned up where it touches the chain.
- Ollama remains the trailing last-resort net (user's VPS, never rate-limited).
- "Token limit reached" needs **no special detection**: the chain already advances on any provider failure (including 429 / quota / token-limit). Paid Gemini is reached only once both free Gemini keys *and* Groq have failed — which is exactly the cost-first intent.
- Claude/OpenAI provider steps, if a user has set those keys, remain available as deeper optional nets (already in the order list; leaving them costs nothing).

Helpers to update: `askAI`, `callAI`, `_aiStreamGeminiOrNull`, `_callToolModel`, and the non-streaming Gemini helper (~5889). Each carries its own chain and must reflect: two free Gemini keys, paid Gemini after Groq, no OpenRouter, Ollama last.

### 3. Images

In Vibe Coder's `generate_image` tool:

- Add an optional `quality` parameter: `"generic"` (default → Pollinations, unchanged) or `"detailed"` (→ paid Gemini image model `gemini-2.5-flash-image`).
- The AI may set `quality` per-image from the prompt's intent; a UI toggle in Vibe Coder lets the user force premium for the next image.
- Paid Gemini image generation returns base64 image data, embedded as a `data:` URI in the generated `<img src>` (self-contained; bloats project HTML — accepted tradeoff).
- **Graceful degradation:** if `quality:"detailed"` is requested but `geminiApiKeyPaid` is missing **or** the call fails (e.g., unfunded key / billing error / quota), silently fall back to Pollinations so generation never breaks.

### 4. Voice

In `voiceforge.html` + the app-phase1.js handshake:

- Keep **Groq TTS** as the free default voice path (unchanged).
- Add a paid **Gemini TTS** path (`gemini-2.5-flash-preview-tts`; returns base64 PCM, wrap to WAV at 24 kHz) selected via a "High quality (premium)" toggle in Voice Studio.
- The app-phase1.js handshake that currently posts the Groq key to the iframe also posts `geminiApiKeyPaid`, so Voice Studio can use either engine.
- **Graceful degradation:** no paid key → premium toggle disabled/hidden; if premium is on but the Gemini call fails (unfunded/billing/quota), fall back to Groq TTS so playback never breaks.

### 5. Build & deploy

All changes are client-side. Edit `src/js/app-phase1.js`, `src/js/app-phase2.js`, and `voiceforge.html`; run `node build.mjs` to regenerate `help-center-system.built.html`. **Never edit the built file directly.** Deploy is the existing scp-to-VPS step (back up the live copy with a `.bak-<reason>-YYYYMMDD` suffix first) and runs **only on the user's explicit go-ahead**.

## Non-goals

- No server-side (`server.js` / `/api/ai`) routing changes — this is all browser-direct keys.
- No change to the Claude/OpenAI optional provider steps beyond leaving them in place.
- No migration of existing stored keys (additive only; existing `geminiApiKey` keeps working unchanged).

## Risks / tradeoffs

- **Unfunded paid key window:** handled by degrade-on-error in images/voice and by the natural chain-continue in text.
- **Base64 image bloat:** detailed images embedded as data URIs enlarge generated project HTML. Acceptable since detailed is opt-in and per-image.
- **Multiple text helpers:** the chain is duplicated across ~5 helpers; each must be updated consistently to avoid one bypassing the new order (same class of bug the project's memory warns about with direct `fetch('api.groq.com')` calls).

## Verification

- Text: with only free keys set, confirm order is Gemini#1 → Gemini#2 → Groq → (paid skipped, no key) → Ollama; with a paid key set, confirm it's only reached after Groq fails.
- Images: `quality:"detailed"` with paid key → Gemini image; without/with failing key → Pollinations.
- Voice: premium toggle on with paid key → Gemini TTS; off or failing → Groq TTS.
- Build: `node build.mjs` completes; `help-center-system.built.html` regenerates without manual edits.
