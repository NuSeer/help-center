(function () {
  /* ============================================================
     H.E.L.P. CENTER — AI Support Widget
     Powered by Google Gemini (free tier)
     ============================================================
     SETUP:
       1. Replace GEMINI_API_KEY with your key from
          https://aistudio.google.com/app/apikey
       2. Edit BUSINESS_CONTEXT below to match your services
       3. Add to any page before </body>:
          <script src="helpctr-support-widget.js"></script>
     ============================================================ */

  const _ORIGIN = (location.origin && /^https?:/.test(location.origin)) ? location.origin : "https://thehelpctr.com";
  const CONFIG = {
    // AI runs through the H.E.L.P. Center server so the Gemini key stays PRIVATE
    // (it is never shipped to the browser). The server proxies the call to Gemini.
    API_URL: _ORIGIN + "/api/widget-chat",
    CONTACT_URL: _ORIGIN + "/api/owner/contact",
    BUSINESS_NAME: "H.E.L.P. Center",
    BUSINESS_TAGLINE: "Helping Everyday Leaders Prosper",
    ACCENT_COLOR: "#1E6FD9",
    DARK_COLOR: "#0B1B3A",
    RESPONSE_TIMEOUT_HOURS: 24,

    BUSINESS_CONTEXT: `
You are a friendly AI support agent for H.E.L.P. Center (Helping Everyday Leaders Prosper),
a company based in Henry County, GA (metro Atlanta) that offers:
  - Custom website design (churches, athletes, small businesses, nonprofits, entrepreneurs)
  - Branding & graphic design
  - Business development & consulting
  - Growth programs & coaching
  - SaaS and software products
  - E-commerce and retail solutions

SCOPE — STRICT (most important rule):
  - ONLY discuss and offer the services listed above. Stay strictly within H.E.L.P. Center's business.
  - If a visitor asks about anything OUTSIDE these services (or unrelated general questions, advice, or other companies), do NOT offer, suggest, invent, or promise anything. Politely say it's not something we offer, then point them to what we DO offer or the contact form.
  - Never make up services, products, discounts, guarantees, or capabilities that aren't listed here.

Pricing:
  - Pricing depends on the SCOPE OF WORK. We offer flat-rate packages and monthly plans.
  - DO NOT quote specific dollar amounts. If asked about price, explain it depends on scope, then invite them to share what they need (via the contact form) so we can send clear pricing — no surprises.

Timeline:
  - Most projects are delivered within 15 to 30 days — and sometimes sooner, depending on scope.
  - A timeline is confirmed up front before any work begins.

Getting started / what to provide:
  - The basics: business name, what they do, their goals, and any branding they already have (logo, colors, content, images). We guide them if they don't have it all yet.

Policies:
  - Free initial consultation available
  - We work with clients NATIONWIDE (fully remote), based in Henry County GA
  - Human agents respond within 24 hours
  - Contact: thehelpctr.com

Converting to a lead (do this naturally):
  - After a few helpful exchanges (around the 3rd-4th message), suggest the visitor reach out so we can build a more TAILORED plan around their specific goals and budget.
  - When you make that suggestion, include [SHOW_CONTACT_FORM] so the contact form appears.
  - Don't be pushy — offer it as the natural next step once you understand what they need.

Personality:
  - Warm, encouraging, and professional
  - Keep responses concise (2-4 sentences or short bullets)
  - Always end with a next step or follow-up question
  - If you cannot resolve something, collect contact info and promise a 24-hr human follow-up
  - Trigger [SHOW_CONTACT_FORM] when the user needs a human agent OR when suggesting a tailored plan
    `,

    QUICK_CHIPS: [
      { icon: "🌐", label: "Website Design",  message: "I need help with a custom website" },
      { icon: "💼", label: "Consulting",       message: "Tell me about your consulting services" },
      { icon: "🛒", label: "E-Commerce",       message: "I need an online store" },
      { icon: "💰", label: "Pricing",          message: "What are your prices?" },
      { icon: "📞", label: "Talk to a Human",  message: "I want to speak to a human agent" },
    ],
  };

  /* ── STYLES ─────────────────────────────────────────────── */
  const css = `
    #helpctr-launcher {
      position: fixed; bottom: 28px; right: 28px;
      width: 62px; height: 62px; border-radius: 50%;
      background: ${CONFIG.ACCENT_COLOR};
      border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 20px rgba(30,111,217,.55);
      transition: transform .2s, box-shadow .2s; z-index: 99999;
    }
    #helpctr-launcher:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(30,111,217,.7); }
    #helpctr-launcher svg { width: 26px; height: 26px; fill: #fff; }
    #helpctr-badge {
      position: absolute; top: -2px; right: -2px;
      width: 18px; height: 18px; border-radius: 50%;
      background: #EF4444; border: 2px solid #fff;
      font-size: 10px; font-weight: 700; color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-family: sans-serif;
    }
    #helpctr-panel {
      position: fixed; bottom: 104px; right: 28px;
      width: 390px; height: 610px;
      background: #fff; border-radius: 16px;
      box-shadow: 0 12px 48px rgba(11,27,58,.18), 0 2px 8px rgba(11,27,58,.08);
      display: flex; flex-direction: column; overflow: hidden;
      opacity: 0; transform: translateY(18px) scale(.97);
      pointer-events: none;
      transition: opacity .25s ease, transform .25s ease;
      z-index: 99998; border: 1px solid rgba(11,27,58,.1);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    #helpctr-panel.hc-open { opacity: 1; transform: translateY(0) scale(1); pointer-events: all; }
    .hc-header {
      background: ${CONFIG.DARK_COLOR};
      padding: 15px 18px; display: flex; align-items: center; gap: 12px; flex-shrink: 0;
    }
    .hc-avatar {
      width: 40px; height: 40px; border-radius: 50%;
      background: linear-gradient(135deg,${CONFIG.ACCENT_COLOR},#60A5FA);
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; flex-shrink: 0;
    }
    .hc-agent-name { color: #fff; font-size: 14px; font-weight: 600; }
    .hc-status { display: flex; align-items: center; gap: 5px; margin-top: 2px; }
    .hc-dot {
      width: 7px; height: 7px; border-radius: 50%; background: #4ADE80;
      animation: hc-pulse 2s infinite;
    }
    @keyframes hc-pulse { 0%,100%{opacity:1}50%{opacity:.4} }
    .hc-status-txt { color: rgba(255,255,255,.6); font-size: 12px; }
    .hc-hbtn {
      margin-left: auto; width: 30px; height: 30px; border-radius: 50%;
      border: none; background: rgba(255,255,255,.1); color: rgba(255,255,255,.7);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: background .15s;
    }
    .hc-hbtn:hover { background: rgba(255,255,255,.2); color: #fff; }
    .hc-chips {
      padding: 10px 14px 0; display: flex; flex-wrap: wrap; gap: 6px;
      background: #F8F9FB; border-bottom: 1px solid rgba(11,27,58,.08); flex-shrink: 0;
    }
    .hc-chip-label {
      width: 100%; font-size: 10px; font-weight: 600; color: #9CA3AF;
      text-transform: uppercase; letter-spacing: .06em; margin-bottom: 2px;
    }
    .hc-chip {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 5px 11px; border-radius: 20px;
      border: 1px solid rgba(11,27,58,.12); background: #fff;
      font-size: 12px; font-weight: 500; color: #374151;
      cursor: pointer; transition: all .15s; margin-bottom: 8px; white-space: nowrap;
    }
    .hc-chip:hover { background: #EBF3FE; border-color: ${CONFIG.ACCENT_COLOR}; color: ${CONFIG.ACCENT_COLOR}; }
    #helpctr-msgs {
      flex: 1; overflow-y: auto; padding: 14px;
      display: flex; flex-direction: column; gap: 10px; scroll-behavior: smooth;
    }
    #helpctr-msgs::-webkit-scrollbar { width: 4px; }
    #helpctr-msgs::-webkit-scrollbar-thumb { background: rgba(11,27,58,.15); border-radius: 4px; }
    .hc-row { display: flex; align-items: flex-end; gap: 7px; animation: hc-in .22s ease both; }
    @keyframes hc-in { from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none} }
    .hc-row.hc-user { flex-direction: row-reverse; }
    .hc-av {
      width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 600;
    }
    .hc-av.bot { background: linear-gradient(135deg,${CONFIG.DARK_COLOR},${CONFIG.ACCENT_COLOR}); color: #fff; font-size: 13px; }
    .hc-av.usr { background: #EBF3FE; color: ${CONFIG.ACCENT_COLOR}; }
    .hc-wrap { display: flex; flex-direction: column; }
    .hc-row.hc-user .hc-wrap { align-items: flex-end; }
    .hc-bubble {
      max-width: 80%; padding: 9px 13px; border-radius: 15px;
      font-size: 13px; line-height: 1.55; color: #111827;
    }
    .hc-row.bot .hc-bubble {
      background: #F3F4F6; border: 1px solid rgba(11,27,58,.08);
      border-bottom-left-radius: 4px;
    }
    .hc-row.hc-user .hc-bubble {
      background: ${CONFIG.ACCENT_COLOR}; color: #fff; border-bottom-right-radius: 4px;
    }
    .hc-time { font-size: 10px; color: #9CA3AF; margin-top: 2px; padding: 0 3px; }
    .hc-row.hc-user .hc-time { text-align: right; }
    .hc-typing { display: flex; align-items: center; gap: 7px; padding: 2px 4px; }
    .hc-dots { display: flex; gap: 4px; }
    .hc-dots span {
      width: 6px; height: 6px; border-radius: 50%; background: #9CA3AF;
      animation: hc-bounce 1.2s infinite;
    }
    .hc-dots span:nth-child(2){animation-delay:.2s}
    .hc-dots span:nth-child(3){animation-delay:.4s}
    @keyframes hc-bounce{0%,80%,100%{transform:none}40%{transform:translateY(-5px)}}
    .hc-dots-label { font-size: 12px; color: #9CA3AF; font-style: italic; }
    .hc-esc-card {
      background: #FEF3C7; border: 1px solid rgba(217,119,6,.25);
      border-radius: 10px; padding: 13px; font-size: 13px;
    }
    .hc-esc-title { font-weight: 700; color: #92400E; margin-bottom: 5px; }
    .hc-esc-card p { color: #78350F; line-height: 1.5; margin-bottom: 9px; }
    .hc-esc-btn {
      display: inline-flex; align-items: center; gap: 5px;
      background: #D97706; color: #fff; border: none; border-radius: 8px;
      padding: 7px 13px; font-size: 12px; font-weight: 600; cursor: pointer;
      transition: background .15s; font-family: inherit;
    }
    .hc-esc-btn:hover { background: #B45309; }
    .hc-form-card {
      background: #fff; border: 1px solid rgba(11,27,58,.1);
      border-radius: 10px; padding: 14px; font-size: 13px;
    }
    .hc-form-title { font-weight: 600; color: #111827; margin-bottom: 11px; font-size: 13.5px; }
    .hc-field { margin-bottom: 9px; }
    .hc-field label {
      display: block; font-size: 11px; font-weight: 600; color: #6B7280;
      text-transform: uppercase; letter-spacing: .05em; margin-bottom: 3px;
    }
    .hc-field input, .hc-field select, .hc-field textarea {
      width: 100%; padding: 7px 10px;
      border: 1px solid rgba(11,27,58,.2); border-radius: 7px;
      font-size: 13px; font-family: inherit; color: #111827;
      background: #F9FAFB; outline: none; transition: border-color .15s; box-sizing: border-box;
    }
    .hc-field input:focus, .hc-field select:focus, .hc-field textarea:focus {
      border-color: ${CONFIG.ACCENT_COLOR};
    }
    .hc-field textarea { resize: none; height: 65px; }
    .hc-submit {
      width: 100%; padding: 9px; background: ${CONFIG.ACCENT_COLOR}; color: #fff;
      border: none; border-radius: 8px; font-size: 13px; font-weight: 600;
      font-family: inherit; cursor: pointer; transition: background .15s; margin-top: 3px;
    }
    .hc-submit:hover { background: #1558B0; }
    .hc-success {
      background: #DCFCE7; border: 1px solid rgba(22,163,74,.25);
      border-radius: 10px; padding: 14px; text-align: center;
    }
    .hc-success-icon { font-size: 26px; margin-bottom: 5px; }
    .hc-success p { font-size: 13px; color: #14532D; line-height: 1.55; }
    .hc-input-area {
      border-top: 1px solid rgba(11,27,58,.08);
      padding: 10px 14px; display: flex; align-items: flex-end; gap: 9px;
      background: #fff; flex-shrink: 0;
    }
    #helpctr-input {
      flex: 1; border: 1px solid rgba(11,27,58,.2); border-radius: 20px;
      padding: 8px 13px; font-size: 13px; font-family: inherit; color: #111827;
      background: #F9FAFB; resize: none; height: 38px; max-height: 96px;
      overflow-y: auto; outline: none; transition: border-color .15s; line-height: 1.4;
    }
    #helpctr-input:focus { border-color: ${CONFIG.ACCENT_COLOR}; }
    #helpctr-input::placeholder { color: #9CA3AF; }
    #helpctr-send {
      width: 38px; height: 38px; border-radius: 50%; border: none;
      background: ${CONFIG.ACCENT_COLOR}; color: #fff; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background .15s, transform .1s; flex-shrink: 0;
    }
    #helpctr-send:hover { background: #1558B0; }
    #helpctr-send:active { transform: scale(.92); }
    #helpctr-send:disabled { background: #D1D5DB; cursor: not-allowed; }
    @media(max-width:480px){
      #helpctr-panel{right:0;bottom:0;width:100vw;height:100dvh;border-radius:0;}
      #helpctr-launcher{right:16px;bottom:16px;}
    }
  `;

  /* ── INJECT STYLES ──────────────────────────────────────── */
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* ── LAUNCHER ───────────────────────────────────────────── */
  const launcher = document.createElement("button");
  launcher.id = "helpctr-launcher";
  launcher.setAttribute("aria-label", "Open support chat");
  launcher.innerHTML = `
    <span id="helpctr-badge">1</span>
    <svg id="hc-icon-open" viewBox="0 0 24 24"><path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H5.17L4 15.17V4h16v10z"/></svg>
    <svg id="hc-icon-close" style="display:none" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
  `;

  /* ── PANEL ──────────────────────────────────────────────── */
  const panel = document.createElement("div");
  panel.id = "helpctr-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "H.E.L.P. Center support chat");

  panel.innerHTML = `
    <div class="hc-header">
      <div class="hc-avatar">🤝</div>
      <div style="flex:1">
        <div class="hc-agent-name">${CONFIG.BUSINESS_NAME}</div>
        <div class="hc-status">
          <div class="hc-dot"></div>
          <span class="hc-status-txt">AI Support · Online</span>
        </div>
      </div>
      <button class="hc-hbtn" title="Restart" id="hc-restart" aria-label="Restart conversation">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-8 3.58-8 8s3.58 8 8 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
      </button>
    </div>

    <div class="hc-chips" id="hc-chips">
      <div class="hc-chip-label">Quick topics</div>
      ${CONFIG.QUICK_CHIPS.map(c =>
        `<button class="hc-chip" data-msg="${c.message}">${c.icon} ${c.label}</button>`
      ).join("")}
    </div>

    <div id="helpctr-msgs" aria-live="polite"></div>

    <div class="hc-input-area">
      <textarea id="helpctr-input" placeholder="Ask us anything…" rows="1"></textarea>
      <button id="helpctr-send" aria-label="Send">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </button>
    </div>
  `;

  document.body.appendChild(launcher);
  document.body.appendChild(panel);

  /* ── STATE ──────────────────────────────────────────────── */
  let history = [];
  let busy = false;

  /* ── TOGGLE ─────────────────────────────────────────────── */
  function toggle() {
    const open = panel.classList.toggle("hc-open");
    document.getElementById("hc-icon-open").style.display = open ? "none" : "block";
    document.getElementById("hc-icon-close").style.display = open ? "block" : "none";
    document.getElementById("helpctr-badge").style.display = "none";
    if (open && history.length === 0) setTimeout(welcome, 320);
    if (open) setTimeout(() => document.getElementById("helpctr-input").focus(), 400);
  }
  launcher.addEventListener("click", toggle);

  /* ── RESTART ─────────────────────────────────────────────── */
  document.getElementById("hc-restart").addEventListener("click", () => {
    document.getElementById("helpctr-msgs").innerHTML = "";
    history = [];
    setTimeout(welcome, 80);
  });

  /* ── CHIPS ───────────────────────────────────────────────── */
  document.getElementById("hc-chips").addEventListener("click", e => {
    const chip = e.target.closest(".hc-chip");
    if (chip) sendMessage(chip.dataset.msg);
  });

  /* ── INPUT ───────────────────────────────────────────────── */
  const input = document.getElementById("helpctr-input");
  const sendBtn = document.getElementById("helpctr-send");

  input.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  input.addEventListener("input", () => {
    input.style.height = "38px";
    input.style.height = Math.min(input.scrollHeight, 96) + "px";
  });
  sendBtn.addEventListener("click", () => sendMessage());

  /* ── WELCOME ─────────────────────────────────────────────── */
  function welcome() {
    addBubble("bot", `👋 Welcome to <strong>${CONFIG.BUSINESS_NAME}</strong> — <em>${CONFIG.BUSINESS_TAGLINE}</em>.<br><br>
We turn bold dreams into thriving businesses with custom websites, branding, consulting, and growth programs.<br><br>
How can we help you grow today?`);
  }

  /* ── SEND ────────────────────────────────────────────────── */
  async function sendMessage(text) {
    text = text || input.value.trim();
    if (!text || busy) return;
    input.value = "";
    input.style.height = "38px";

    addBubble("user", text);
    history.push({ role: "user", parts: [{ text }] });

    setLoading(true);

    try {
      const res = await fetch(CONFIG.API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: CONFIG.BUSINESS_CONTEXT,
          messages: history,
        }),
      });

      const data = await res.json();
      const reply =
        data?.reply ||
        "Sorry, I had trouble responding. Please try again or use the contact form.";

      history.push({ role: "model", parts: [{ text: reply }] });
      setLoading(false);

      if (reply.includes("[SHOW_CONTACT_FORM]")) {
        const clean = reply.replace("[SHOW_CONTACT_FORM]", "").trim();
        if (clean) addBubble("bot", clean);
        setTimeout(addEscCard, 350);
      } else {
        addBubble("bot", reply);
      }
    } catch {
      setLoading(false);
      addBubble("bot", "⚠️ Connection issue. Check your API key or try again shortly.");
    }
  }

  /* ── BUBBLES ─────────────────────────────────────────────── */
  function addBubble(role, html) {
    const msgs = document.getElementById("helpctr-msgs");
    const isUser = role === "user";
    const row = document.createElement("div");
    row.className = `hc-row ${isUser ? "hc-user" : "bot"}`;

    const av = document.createElement("div");
    av.className = `hc-av ${isUser ? "usr" : "bot"}`;
    av.textContent = isUser ? "Y" : "🤝";

    const wrap = document.createElement("div");
    wrap.className = "hc-wrap";

    const bubble = document.createElement("div");
    bubble.className = "hc-bubble";
    bubble.innerHTML = fmt(html);

    const time = document.createElement("div");
    time.className = "hc-time";
    time.textContent = now();

    wrap.appendChild(bubble);
    wrap.appendChild(time);
    row.appendChild(av);
    row.appendChild(wrap);
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function fmt(t) {
    return t
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^[•\-] (.+)/gm, "<li>$1</li>")
      .replace(/(<li>[\s\S]*?<\/li>)+/g, m => `<ul style="padding-left:16px;margin:4px 0">${m}</ul>`)
      .replace(/\n{2,}/g, "<br><br>")
      .replace(/\n/g, "<br>");
  }

  /* ── LOADING ─────────────────────────────────────────────── */
  function setLoading(on) {
    busy = on;
    sendBtn.disabled = on;
    const id = "hc-typing-row";
    if (on) {
      const msgs = document.getElementById("helpctr-msgs");
      const row = document.createElement("div");
      row.className = "hc-row bot"; row.id = id;
      row.innerHTML = `
        <div class="hc-av bot">🤝</div>
        <div class="hc-typing">
          <div class="hc-dots"><span></span><span></span><span></span></div>
          <span class="hc-dots-label">typing…</span>
        </div>`;
      msgs.appendChild(row);
      msgs.scrollTop = msgs.scrollHeight;
    } else {
      document.getElementById(id)?.remove();
    }
  }

  /* ── ESCALATION CARD ─────────────────────────────────────── */
  function addEscCard() {
    const msgs = document.getElementById("helpctr-msgs");
    const row = document.createElement("div");
    row.className = "hc-row bot";
    row.innerHTML = `
      <div class="hc-av bot">🤝</div>
      <div class="hc-wrap" style="max-width:90%">
        <div class="hc-esc-card">
          <div class="hc-esc-title">⏰ Human Agent — ${CONFIG.RESPONSE_TIMEOUT_HOURS}-hr Response</div>
          <p>Our team will get back to you within ${CONFIG.RESPONSE_TIMEOUT_HOURS} hours. Fill out a quick form below.</p>
          <button class="hc-esc-btn" id="hc-open-form">📋 Submit a Request</button>
        </div>
        <div class="hc-time">${now()}</div>
      </div>`;
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
    document.getElementById("hc-open-form").addEventListener("click", showForm);
  }

  function showForm() {
    document.querySelector(".hc-esc-card").innerHTML = `
      <div class="hc-form-card">
        <div class="hc-form-title">📋 Contact Request</div>
        <div class="hc-field">
          <label>Full Name</label>
          <input id="hc-cf-name" type="text" placeholder="Jane Smith">
        </div>
        <div class="hc-field">
          <label>Email Address</label>
          <input id="hc-cf-email" type="email" placeholder="jane@example.com">
        </div>
        <div class="hc-field">
          <label>Service Needed</label>
          <select id="hc-cf-type">
            <option value="">Select a service</option>
            <option>Custom Website Design</option>
            <option>Branding & Graphic Design</option>
            <option>Business Consulting</option>
            <option>E-Commerce Setup</option>
            <option>Growth Program</option>
            <option>SaaS / Software Product</option>
            <option>Other</option>
          </select>
        </div>
        <div class="hc-field">
          <label>Tell us more</label>
          <textarea id="hc-cf-desc" placeholder="Describe what you need…"></textarea>
        </div>
        <button class="hc-submit" id="hc-cf-submit">Submit — We'll reply within ${CONFIG.RESPONSE_TIMEOUT_HOURS} hrs</button>
      </div>`;
    document.getElementById("hc-cf-submit").addEventListener("click", submitForm);
  }

  function submitForm() {
    const name  = document.getElementById("hc-cf-name")?.value.trim();
    const email = document.getElementById("hc-cf-email")?.value.trim();
    const type  = document.getElementById("hc-cf-type")?.value;
    const desc  = document.getElementById("hc-cf-desc")?.value.trim();
    const btn   = document.getElementById("hc-cf-submit");

    if (!name || !email || !type || !desc) {
      btn.textContent = "⚠️ Please fill in all fields";
      btn.style.background = "#EF4444";
      setTimeout(() => {
        btn.textContent = `Submit — We'll reply within ${CONFIG.RESPONSE_TIMEOUT_HOURS} hrs`;
        btn.style.background = "";
      }, 2200);
      return;
    }

    document.querySelector(".hc-form-card").outerHTML = `
      <div class="hc-success">
        <div class="hc-success-icon">✅</div>
        <p><strong>Got it, ${name}!</strong><br>
        Confirmation sent to <strong>${email}</strong>.<br>
        A team member will reply within <strong>${CONFIG.RESPONSE_TIMEOUT_HOURS} hours</strong>.</p>
      </div>`;

    /* ── Send the lead to H.E.L.P. Center so Joy actually gets it (email + dashboard). ── */
    try {
      fetch(CONFIG.CONTACT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: "", service: type, message: desc + "\n\n— Sent from the website AI chat widget" }),
      }).catch(function () {});
    } catch (e) {}
  }

  function now() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

})();
