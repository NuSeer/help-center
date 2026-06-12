/**
 * patch-lvs.mjs
 * Patches help-center-system.html in-place:
 *   1. Inserts/replaces the LVS Studio dashboard page
 *   2. Inserts/replaces the Agent OS iframe page
 *   3. Adds nav links for both under AI Tools
 *
 * Run: node patch-lvs.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TARGET = path.join(__dirname, 'help-center-system.html');

console.log('[patch] reading', TARGET);
let html = readFileSync(TARGET, 'utf8');
const original = html;

// ─────────────────────────────────────────────────────────────
// 1. NAV — add LVS Studio + Agent OS buttons after AI Projects
// ─────────────────────────────────────────────────────────────
const NAV_ANCHOR = `onclick="showPage('ai-projects', event)"`;
const NAV_LVS    = `\n          <button type="button" class="nav-link" onclick="showPage('lvs-studio', event)">\n            <span class="nav-icon">✨</span><span>Limitless Vision Studio</span>\n          </button>`;
const NAV_AOS    = `\n          <button type="button" class="nav-link" onclick="showPage('agent-os', event)">\n            <span class="nav-icon">🧠</span><span>Agent OS</span>\n          </button>`;

if (!html.includes(`showPage('lvs-studio'`)) {
  // Find the closing </button> right after the AI Projects nav button
  const idx = html.indexOf(NAV_ANCHOR);
  if (idx !== -1) {
    const closeBtn = html.indexOf('</button>', idx);
    if (closeBtn !== -1) {
      html = html.slice(0, closeBtn + 9) + NAV_LVS + NAV_AOS + html.slice(closeBtn + 9);
      console.log('[patch] ✓ nav links added');
    }
  } else {
    console.warn('[patch] ⚠ could not find AI Projects nav anchor — nav links NOT added');
  }
} else {
  console.log('[patch] nav links already present, skipping');
}

// ─────────────────────────────────────────────────────────────
// 2. LVS PAGE — insert/replace before </main>
// ─────────────────────────────────────────────────────────────
const LVS_START_MARKER = `<!-- ══ LIMITLESS VISION STUDIO`;
const LVS_ID_MARKER    = `id="lvs-studio-page"`;
const LVS_CLOSE_TAG    = `</div>\n      </div>`; // end of page div

const LVS_HTML = `
      <!-- ═══════════════════════════════════════════════════════════
           LIMITLESS VISION STUDIO — Standalone Dashboard
           Dark cosmic aesthetic. LVS creates; agents extend.
           ═══════════════════════════════════════════════════════════ -->
      <div id="lvs-studio-page" class="page hidden" style="background:#0A0F1E;min-height:100%;padding:0;display:flex;flex-direction:column;">

        <style>
          .lvs-category-tile { background:rgba(255,255,255,0.04); border:1px solid rgba(201,168,76,0.18); border-radius:10px; padding:14px 12px; cursor:pointer; transition:all 0.18s ease; text-align:center; display:flex; flex-direction:column; align-items:center; gap:6px; }
          .lvs-category-tile:hover { background:rgba(201,168,76,0.1); border-color:rgba(201,168,76,0.5); transform:translateY(-2px); }
          .lvs-category-tile.active { background:rgba(201,168,76,0.15); border-color:#C9A84C; }
          .lvs-mode-btn { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); color:rgba(255,255,255,0.65); border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600; cursor:pointer; transition:all 0.15s; white-space:nowrap; }
          .lvs-mode-btn:hover, .lvs-mode-btn.active { background:rgba(201,168,76,0.15); border-color:#C9A84C; color:#C9A84C; }
          .lvs-msg-user { align-self:flex-end; background:rgba(201,168,76,0.15); border:1px solid rgba(201,168,76,0.3); color:#F1F5F9; padding:10px 15px; border-radius:16px 16px 4px 16px; max-width:80%; font-size:14px; line-height:1.6; }
          .lvs-msg-ai { align-self:flex-start; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); color:#E2E8F0; padding:12px 16px; border-radius:4px 16px 16px 16px; max-width:90%; font-size:14px; line-height:1.7; border-left:3px solid #C9A84C; }
          .lvs-msg-agent { align-self:flex-start; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); color:#CBD5E1; padding:12px 16px; border-radius:4px 16px 16px 16px; max-width:90%; font-size:14px; line-height:1.7; }
          #lvs-chat-msgs .md-content h1, #lvs-chat-msgs .md-content h2, #lvs-chat-msgs .md-content h3 { color:#C9A84C; margin:12px 0 6px; }
          #lvs-chat-msgs .md-content p { margin:6px 0; }
          #lvs-chat-msgs .md-content ul, #lvs-chat-msgs .md-content ol { padding-left:20px; margin:6px 0; }
          #lvs-chat-msgs .md-content code { background:rgba(255,255,255,0.08); padding:1px 5px; border-radius:4px; font-size:0.9em; }
          #lvs-chat-msgs .md-content pre { background:#070B14; border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:12px; overflow:auto; margin:8px 0; }
          #lvs-chat-msgs .md-content strong { color:#fff; }
          #lvs-chat-msgs .md-content blockquote { border-left:3px solid #C9A84C; margin:8px 0; padding:4px 12px; color:rgba(255,255,255,0.5); }
        </style>

        <!-- HEADER -->
        <div style="background:linear-gradient(135deg,#0F172A 0%,#16213e 100%);border-bottom:1px solid rgba(201,168,76,0.25);padding:20px 24px;flex-shrink:0">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
            <div style="display:flex;align-items:center;gap:14px">
              <div style="width:44px;height:44px;border-radius:12px;background:rgba(201,168,76,0.12);border:1px solid rgba(201,168,76,0.3);display:flex;align-items:center;justify-content:center;font-size:22px">✨</div>
              <div>
                <div style="font-size:20px;font-weight:800;color:#fff;letter-spacing:-0.02em">Limitless Vision Studio</div>
                <div style="font-size:12px;color:rgba(201,168,76,0.8);margin-top:1px;font-style:italic">You can do anything… except be GOD.</div>
              </div>
            </div>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
              <div id="lvs-status-dot" style="width:8px;height:8px;border-radius:50%;background:#22C55E;box-shadow:0 0 6px #22C55E55"></div>
              <span style="font-size:12px;color:rgba(255,255,255,0.4)">Ready to create</span>
              <button onclick="lvsReset()" title="Start a new session" style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.5);padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">↺ New</button>
              <button onclick="lvsSaveCurrent()" title="Save session as Markdown" style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.5);padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">💾 Save</button>
              <button onclick="lvsPrintReport()" title="Print full report / manual" style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.5);padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600">🖨️ Print</button>
              <button onclick="showPage('agent-os',event)" style="background:rgba(201,168,76,0.15);border:1px solid rgba(201,168,76,0.4);color:#C9A84C;padding:6px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700">🤖 Agent OS →</button>
            </div>
          </div>
          <!-- Creation Mode strip -->
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:14px;align-items:center">
            <span style="font-size:11px;color:rgba(255,255,255,0.3);font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-right:4px">Mode:</span>
            <button class="lvs-mode-btn active" id="lvs-mode-fast" onclick="lvsSetMode('Fast Mode',this)">⚡ Fast</button>
            <button class="lvs-mode-btn" id="lvs-mode-step" onclick="lvsSetMode('Step-by-Step Mode',this)">📋 Step-by-Step</button>
            <button class="lvs-mode-btn" id="lvs-mode-explainer" onclick="lvsSetMode('Explainer Mode',this)">💡 Explainer</button>
            <button class="lvs-mode-btn" id="lvs-mode-remix" onclick="lvsSetMode('Remix Mode',this)">🔀 Remix</button>
            <button class="lvs-mode-btn" id="lvs-mode-prototype" onclick="lvsSetMode('Prototype Mode',this)">🔧 Prototype</button>
            <button class="lvs-mode-btn" id="lvs-mode-complex" onclick="lvsSetMode('Complex Mode',this)">🧠 Complex</button>
            <button class="lvs-mode-btn" id="lvs-mode-dark" onclick="lvsSetMode('Dark Mode',this)">🌑 Dark</button>
            <button class="lvs-mode-btn" onclick="lvsUnlockHidden()" title="Password protected">🔐 Hidden</button>
            <button class="lvs-mode-btn" onclick="lvsUnlockSoul()" title="Password protected">🌌 Soul</button>
          </div>
        </div>

        <!-- MAIN BODY -->
        <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
          <!-- Category grid -->
          <div id="lvs-categories" style="padding:20px 24px;overflow-y:auto">
            <div style="text-align:center;margin-bottom:20px">
              <div style="font-size:26px;font-weight:800;color:#fff;letter-spacing:-0.02em">What are you creating?</div>
              <div style="font-size:14px;color:rgba(255,255,255,0.4);margin-top:6px">Select a category — or describe your vision below.</div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;max-width:900px;margin:0 auto">
              <div class="lvs-category-tile" onclick="lvsSelectCategory('🔧 Inventions')"><span style="font-size:24px">🔧</span><span style="font-size:12px;font-weight:600;color:#F1F5F9">Inventions</span></div>
              <div class="lvs-category-tile" onclick="lvsSelectCategory('💡 Science & Innovation')"><span style="font-size:24px">💡</span><span style="font-size:12px;font-weight:600;color:#F1F5F9">Science & Innovation</span></div>
              <div class="lvs-category-tile" onclick="lvsSelectCategory('🤖 AI, Software & Web Development')"><span style="font-size:24px">🤖</span><span style="font-size:12px;font-weight:600;color:#F1F5F9">AI & Software</span></div>
              <div class="lvs-category-tile" onclick="lvsSelectCategory('💼 Business & Finance')"><span style="font-size:24px">💼</span><span style="font-size:12px;font-weight:600;color:#F1F5F9">Business & Finance</span></div>
              <div class="lvs-category-tile" onclick="lvsSelectCategory('🌍 African & African American Knowledge')"><span style="font-size:24px">🌍</span><span style="font-size:12px;font-weight:600;color:#F1F5F9">African Knowledge</span></div>
              <div class="lvs-category-tile" onclick="lvsSelectCategory('🌿 Holistic Health & Medicine')"><span style="font-size:24px">🌿</span><span style="font-size:12px;font-weight:600;color:#F1F5F9">Holistic Health</span></div>
              <div class="lvs-category-tile" onclick="lvsSelectCategory('⚖️ Law, Government & Policy')"><span style="font-size:24px">⚖️</span><span style="font-size:12px;font-weight:600;color:#F1F5F9">Law & Policy</span></div>
              <div class="lvs-category-tile" onclick="lvsSelectCategory('🕊️ Spirituality & World Religions')"><span style="font-size:24px">🕊️</span><span style="font-size:12px;font-weight:600;color:#F1F5F9">Spirituality</span></div>
              <div class="lvs-category-tile" onclick="lvsSelectCategory('🗺️ Geography, Languages & Global Data')"><span style="font-size:24px">🗺️</span><span style="font-size:12px;font-weight:600;color:#F1F5F9">Geography & Languages</span></div>
              <div class="lvs-category-tile" onclick="lvsSelectCategory('🛠️ DIY & Craftsmanship')"><span style="font-size:24px">🛠️</span><span style="font-size:12px;font-weight:600;color:#F1F5F9">DIY & Crafts</span></div>
              <div class="lvs-category-tile" onclick="lvsSelectCategory('🎨 Art, Music & Storytelling')"><span style="font-size:24px">🎨</span><span style="font-size:12px;font-weight:600;color:#F1F5F9">Art & Storytelling</span></div>
              <div class="lvs-category-tile" onclick="lvsSelectCategory('📚 General Education')"><span style="font-size:24px">📚</span><span style="font-size:12px;font-weight:600;color:#F1F5F9">General Education</span></div>
              <div class="lvs-category-tile" onclick="lvsSelectCategory('🧩 Games & Strategies')"><span style="font-size:24px">🧩</span><span style="font-size:12px;font-weight:600;color:#F1F5F9">Games & Strategy</span></div>
              <div class="lvs-category-tile" onclick="lvsSelectCategory('🛸 Futurism & Sci-Fi Concepts')"><span style="font-size:24px">🛸</span><span style="font-size:12px;font-weight:600;color:#F1F5F9">Futurism & Sci-Fi</span></div>
              <div class="lvs-category-tile" onclick="lvsSelectCategory('🎭 Theater & Stage Production')"><span style="font-size:24px">🎭</span><span style="font-size:12px;font-weight:600;color:#F1F5F9">Theater & Stage</span></div>
              <div class="lvs-category-tile" onclick="lvsSelectCategory('🛤️ Engineering & Infrastructure')"><span style="font-size:24px">🛤️</span><span style="font-size:12px;font-weight:600;color:#F1F5F9">Engineering</span></div>
              <div class="lvs-category-tile" onclick="lvsSelectCategory('🏡 Home & Lifestyle')"><span style="font-size:24px">🏡</span><span style="font-size:12px;font-weight:600;color:#F1F5F9">Home & Lifestyle</span></div>
              <div class="lvs-category-tile" onclick="lvsSelectCategory('🌐 Social Sciences & Psychology')"><span style="font-size:24px">🌐</span><span style="font-size:12px;font-weight:600;color:#F1F5F9">Social Sciences</span></div>
              <div class="lvs-category-tile" onclick="lvsSelectCategory('📈 Marketing & Content Creation')"><span style="font-size:24px">📈</span><span style="font-size:12px;font-weight:600;color:#F1F5F9">Marketing & Content</span></div>
              <div class="lvs-category-tile" onclick="lvsSelectCategory('🛡️ Survival Skills & Preparedness')"><span style="font-size:24px">🛡️</span><span style="font-size:12px;font-weight:600;color:#F1F5F9">Survival Skills</span></div>
              <div class="lvs-category-tile" onclick="lvsSelectCategory('🌌 Mythology & Legends')"><span style="font-size:24px">🌌</span><span style="font-size:12px;font-weight:600;color:#F1F5F9">Mythology & Legends</span></div>
              <div class="lvs-category-tile" onclick="lvsSelectCategory('📊 Data Science & Analytics')"><span style="font-size:24px">📊</span><span style="font-size:12px;font-weight:600;color:#F1F5F9">Data Science</span></div>
            </div>
            <div style="max-width:700px;margin:24px auto 0">
              <div style="position:relative">
                <textarea id="lvs-vision-input" rows="2" placeholder="Or tell me your vision… speak it and I'll help you build it." style="width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(201,168,76,0.3);color:#F1F5F9;border-radius:12px;padding:12px 120px 12px 16px;font-size:14px;font-family:inherit;resize:none;outline:none;transition:border-color 0.2s;line-height:1.5;box-sizing:border-box" onfocus="this.style.borderColor='#C9A84C'" onblur="this.style.borderColor='rgba(201,168,76,0.3)'" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();lvsStartWithVision()}"></textarea>
                <button onclick="lvsStartWithVision()" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:#C9A84C;color:#0F172A;border:none;padding:8px 16px;border-radius:8px;font-weight:700;font-size:13px;cursor:pointer;white-space:nowrap">Create →</button>
              </div>
            </div>
          </div>

          <!-- Chat messages -->
          <div id="lvs-chat-msgs" style="display:none;flex:1;overflow-y:auto;padding:20px 24px;flex-direction:column;gap:10px;max-width:900px;width:100%;margin:0 auto;box-sizing:border-box"></div>

          <!-- Send to Agent OS banner -->
          <div id="lvs-agent-bridge" style="display:none;background:rgba(201,168,76,0.08);border-top:1px solid rgba(201,168,76,0.2);border-bottom:1px solid rgba(201,168,76,0.2);padding:10px 24px;flex-shrink:0">
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;max-width:900px;margin:0 auto">
              <span style="font-size:13px;color:rgba(255,255,255,0.6)">✨ Vision created —</span>
              <span style="font-size:13px;color:#C9A84C;font-weight:600">Send to Agent OS to bring it to life</span>
              <button onclick="lvsSendToAgentOS()" style="background:#C9A84C;color:#0F172A;border:none;padding:6px 16px;border-radius:8px;font-weight:700;font-size:12px;cursor:pointer">🤖 Send to Agents →</button>
              <button onclick="document.getElementById('lvs-agent-bridge').style.display='none'" style="background:none;border:none;color:rgba(255,255,255,0.3);cursor:pointer;font-size:18px;line-height:1">×</button>
            </div>
          </div>

          <!-- Chat input bar -->
          <div id="lvs-input-bar" style="background:#0F172A;border-top:1px solid rgba(201,168,76,0.2);padding:12px 24px;flex-shrink:0">
            <div style="display:flex;gap:8px;align-items:flex-end;max-width:900px;margin:0 auto">
              <textarea id="lvs-chat-input" rows="1" placeholder="Continue creating… or type 'Menu' to return to categories." style="flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(201,168,76,0.25);color:#F1F5F9;border-radius:12px;padding:10px 14px;font-size:14px;font-family:inherit;resize:none;height:42px;max-height:120px;outline:none;transition:border-color 0.2s;line-height:1.5" onfocus="this.style.borderColor='#C9A84C'" onblur="this.style.borderColor='rgba(201,168,76,0.25)'" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();lvsSendMessage()}" oninput="this.style.height='42px';this.style.height=Math.min(this.scrollHeight,120)+'px'"></textarea>
              <button onclick="lvsSendMessage()" style="background:#C9A84C;color:#0F172A;border:none;padding:0 20px;border-radius:12px;font-weight:700;font-size:14px;cursor:pointer;height:42px;white-space:nowrap;flex-shrink:0">Send ↑</button>
            </div>
          </div>
        </div>

        <script>
        var _lvsHistory = [];
        var _lvsMode = 'Fast Mode';
        var _lvsActive = false;
        var _LVS_STORE = 'lvs_standalone_session';

        function lvsSetMode(mode, btn) {
          _lvsMode = mode;
          document.querySelectorAll('.lvs-mode-btn').forEach(function(b){ b.classList.remove('active'); });
          if (btn) btn.classList.add('active');
        }
        function lvsSelectCategory(cat) {
          document.querySelectorAll('.lvs-category-tile').forEach(function(t){ t.classList.remove('active'); });
          _lvsActivateChat();
          _lvsAppendUser(cat);
          _lvsHistory.push({ role:'user', content:'I want to explore: ' + cat + '\n\nPlease present the Creation Mode menu and help me build something amazing.' });
          _lvsAiTurn();
        }
        function lvsStartWithVision() {
          var inp = document.getElementById('lvs-vision-input');
          var text = (inp ? inp.value.trim() : '');
          if (!text) return;
          inp.value = '';
          _lvsActivateChat();
          _lvsAppendUser(text);
          _lvsHistory.push({ role:'user', content: text });
          _lvsAiTurn();
        }
        function _lvsActivateChat() {
          _lvsActive = true;
          var cats = document.getElementById('lvs-categories');
          var msgs = document.getElementById('lvs-chat-msgs');
          if (cats) cats.style.display = 'none';
          if (msgs) msgs.style.display = 'flex';
        }
        function _lvsShowCategories() {
          _lvsActive = false;
          var cats = document.getElementById('lvs-categories');
          var msgs = document.getElementById('lvs-chat-msgs');
          if (cats) cats.style.display = '';
          if (msgs) msgs.style.display = 'none';
          document.getElementById('lvs-agent-bridge').style.display = 'none';
        }
        function _lvsAppendUser(text) {
          var msgs = document.getElementById('lvs-chat-msgs');
          if (!msgs) return;
          var d = document.createElement('div'); d.className = 'lvs-msg-user'; d.textContent = text;
          msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
        }
        function _lvsAppendAI(text) {
          var msgs = document.getElementById('lvs-chat-msgs');
          if (!msgs) return null;
          var d = document.createElement('div'); d.className = 'lvs-msg-ai md-content';
          if (typeof mdRender === 'function') d.innerHTML = mdRender(text); else d.textContent = text;
          msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
          return d;
        }
        async function _lvsAiTurn() {
          var msgs = document.getElementById('lvs-chat-msgs');
          var sysDot = document.getElementById('lvs-status-dot');
          if (sysDot) { sysDot.style.background='#F59E0B'; sysDot.style.boxShadow='0 0 6px #F59E0B55'; }
          var typing = document.createElement('div');
          typing.className = 'lvs-msg-ai'; typing.style.color = 'rgba(255,255,255,0.4)'; typing.textContent = '✨ Creating…';
          if (msgs) { msgs.appendChild(typing); msgs.scrollTop = msgs.scrollHeight; }
          var sysPrompt = (typeof PROJECT_SYSTEM_PROMPTS !== 'undefined' && PROJECT_SYSTEM_PROMPTS['lvs'])
            ? PROJECT_SYSTEM_PROMPTS['lvs'] : 'You are Limitless Vision Studio.';
          if (_lvsMode && _lvsMode !== 'Fast Mode') sysPrompt += '\n\nCurrent creation mode: ' + _lvsMode + '. Apply this mode to your response.';
          var messages = [{ role:'system', content: sysPrompt }].concat(_lvsHistory);
          var bubble = null;
          try {
            var result = await (typeof askAI === 'function'
              ? askAI({ messages:messages, project:'lvs', msgsEl:msgs, onChunk:function(delta,full){
                  if (!bubble) { typing.remove(); bubble = _lvsAppendAI(''); }
                  if (typeof mdRender === 'function') bubble.innerHTML = mdRender(full); else bubble.textContent = full;
                  if (msgs) msgs.scrollTop = msgs.scrollHeight;
                }})
              : Promise.reject(new Error('askAI not available')));
            if (!bubble) { typing.remove(); bubble = _lvsAppendAI(''); }
            var reply = result.text || 'No response.';
            if (typeof mdRender === 'function') bubble.innerHTML = mdRender(reply); else bubble.textContent = reply;
            _lvsHistory.push({ role:'assistant', content: reply });
            _lvsSaveSession();
            if (_lvsHistory.filter(function(m){ return m.role==='assistant'; }).length === 1)
              document.getElementById('lvs-agent-bridge').style.display = '';
          } catch(e) { typing.remove(); _lvsAppendAI('⚠️ ' + e.message); }
          if (sysDot) { sysDot.style.background='#22C55E'; sysDot.style.boxShadow='0 0 6px #22C55E55'; }
        }
        function lvsSendMessage() {
          var inp = document.getElementById('lvs-chat-input');
          var text = (inp ? inp.value.trim() : '');
          if (!text) return;
          inp.value = ''; inp.style.height = '42px';
          if (/^menu$/i.test(text)) { _lvsHistory = []; _lvsShowCategories(); return; }
          if (!_lvsActive) _lvsActivateChat();
          _lvsAppendUser(text);
          _lvsHistory.push({ role:'user', content: text });
          _lvsAiTurn();
        }
        function lvsReset() {
          _lvsHistory = []; _lvsActive = false;
          var msgs = document.getElementById('lvs-chat-msgs');
          if (msgs) msgs.innerHTML = '';
          _lvsShowCategories();
          localStorage.removeItem(_LVS_STORE);
        }
        function _lvsSaveSession() {
          try { localStorage.setItem(_LVS_STORE, JSON.stringify({ history:_lvsHistory, mode:_lvsMode })); } catch(_){}
        }
        function lvsLoadSession() {
          try {
            var saved = JSON.parse(localStorage.getItem(_LVS_STORE) || 'null');
            if (!saved || !saved.history || !saved.history.length) return;
            _lvsHistory = saved.history; _lvsMode = saved.mode || 'Fast Mode';
            _lvsActivateChat();
            var msgs = document.getElementById('lvs-chat-msgs'); if (!msgs) return;
            _lvsHistory.forEach(function(m){
              if (m.role==='user') _lvsAppendUser(m.content);
              else if (m.role==='assistant') _lvsAppendAI(m.content);
            });
            if (_lvsHistory.some(function(m){ return m.role==='assistant'; }))
              document.getElementById('lvs-agent-bridge').style.display = '';
          } catch(_){}
        }
        function lvsSaveCurrent() {
          if (!_lvsHistory.length) { if(typeof showToast==='function') showToast('Nothing to save yet.','warn'); return; }
          var md = _lvsHistory.map(function(m){ return '## ' + (m.role==='user'?'You':'Limitless Vision Studio') + '\n\n' + m.content; }).join('\n\n---\n\n');
          var blob = new Blob(['# Limitless Vision Studio Session\n\n' + md],{type:'text/markdown'});
          var url = URL.createObjectURL(blob); var a = document.createElement('a');
          a.href=url; a.download='lvs-session-'+Date.now()+'.md';
          document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){ URL.revokeObjectURL(url); },1000);
        }
        function lvsPrintReport() {
          if (!_lvsHistory.length) { if(typeof showToast==='function') showToast('Nothing to print yet.','warn'); return; }
          var date = new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
          var bodyHtml = _lvsHistory.map(function(m){
            var isUser = m.role==='user';
            var content = m.content.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
              .replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')
              .replace(/^#{3}\s+(.+)$/gm,'<h3>$1</h3>').replace(/^#{2}\s+(.+)$/gm,'<h2>$1</h2>').replace(/^#{1}\s+(.+)$/gm,'<h1>$1</h1>')
              .replace(/^[-*]\s+(.+)$/gm,'<li>$1</li>').replace(/\n{2,}/g,'</p><p>').replace(/\n/g,'<br>');
            return '<div class="entry '+(isUser?'user-entry':'ai-entry')+'">'
              +'<div class="entry-label">'+(isUser?'You':'Limitless Vision Studio')+'</div>'
              +'<div class="entry-body"><p>'+content+'</p></div></div>';
          }).join('');
          var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>LVS Vision Report</title><style>'
            +'*{box-sizing:border-box;margin:0;padding:0}body{font:16px/1.75 Georgia,serif;background:#fff;color:#1a1a2e}'
            +'.cover{background:linear-gradient(135deg,#0A0F1E,#16213e);color:#fff;padding:72px 64px;min-height:240px;display:flex;flex-direction:column;justify-content:center}'
            +'.cover h1{font-size:36px;font-weight:800;letter-spacing:-0.02em;margin-bottom:10px}'
            +'.cover .tagline{font-size:15px;color:rgba(201,168,76,0.9);font-style:italic;margin-bottom:14px}'
            +'.cover .meta{font-size:13px;color:rgba(255,255,255,0.45)}'
            +'.content{max-width:780px;margin:0 auto;padding:48px 48px 80px}'
            +'.entry{margin-bottom:32px;page-break-inside:avoid}'
            +'.entry-label{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px}'
            +'.user-entry .entry-label{color:#64748B}.ai-entry .entry-label{color:#C9A84C}'
            +'.user-entry .entry-body{background:#F8FAFC;border-left:3px solid #CBD5E1;padding:14px 18px;border-radius:0 8px 8px 0;color:#475569}'
            +'.ai-entry .entry-body{background:#FAFAF7;border-left:3px solid #C9A84C;padding:16px 20px;border-radius:0 8px 8px 0}'
            +'.entry-body p{margin:6px 0}.entry-body h1,.entry-body h2,.entry-body h3{margin:14px 0 6px;color:#0A0F1E}'
            +'.entry-body ul{padding-left:20px;margin:8px 0}.entry-body strong{color:#0A0F1E;font-weight:700}'
            +'.footer{text-align:center;font-size:12px;color:#94A3B8;margin-top:48px;padding-top:24px;border-top:1px solid #E2E8F0}'
            +'@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}'
            +'.cover{background:linear-gradient(135deg,#0A0F1E,#16213e) !important}}'
            +'</style></head><body>'
            +'<div class="cover"><h1>✨ Limitless Vision Studio</h1>'
            +'<div class="tagline">You can do anything… except be GOD.</div>'
            +'<div class="meta">Vision Report &nbsp;·&nbsp; '+date+' &nbsp;·&nbsp; Mode: '+_lvsMode+'</div></div>'
            +'<div class="content">'+bodyHtml
            +'<div class="footer">Generated by Limitless Vision Studio &nbsp;·&nbsp; H.E.L.P. Center</div>'
            +'</div></body></html>';
          var w = window.open('','_blank','width=900,height=700');
          if (!w) { if(typeof showToast==='function') showToast('Allow popups to print.','warn'); return; }
          w.document.write(html); w.document.close();
          w.onload = function(){ w.focus(); w.print(); };
        }
        function lvsSendToAgentOS() {
          var lastAsst = null;
          for (var i=_lvsHistory.length-1;i>=0;i--) { if(_lvsHistory[i].role==='assistant'){lastAsst=_lvsHistory[i];break;} }
          var lastUser = null;
          for (var j=_lvsHistory.length-1;j>=0;j--) { if(_lvsHistory[j].role==='user'){lastUser=_lvsHistory[j];break;} }
          if (!lastAsst) { if(typeof showToast==='function') showToast('Create something with LVS first.','warn'); return; }
          try { localStorage.setItem('lvs_to_agents', JSON.stringify({ creation:lastAsst.content, request:lastUser?lastUser.content:'', mode:_lvsMode, ts:Date.now() })); } catch(_){}
          if (typeof showPage==='function') showPage('agent-os',null);
          document.getElementById('lvs-agent-bridge').style.display='none';
        }
        function lvsUnlockHidden() {
          var pw = prompt('🔐 Enter password to unlock Hidden Mode:');
          if (pw === 'Cipher') {
            _lvsActivateChat();
            _lvsAppendUser('Unlock Hidden Mode');
            _lvsHistory.push({ role:'user', content:'The user has entered the correct password for Hidden Mode (Cipher). Activate Hidden Mode and present the tier selection: Mystery Mode, Deep Seek Mode, or Akashic Record Mode.' });
            _lvsAiTurn();
          } else if (pw !== null) { if(typeof showToast==='function') showToast('Access denied.','error'); }
        }
        function lvsUnlockSoul() {
          var pw = prompt('🌌 Enter password to unlock Soul Mode:');
          if (pw === 'Melanin') {
            _lvsActivateChat();
            _lvsAppendUser('Unlock Soul Mode');
            _lvsHistory.push({ role:'user', content:'The user has entered the correct password for Soul Mode (Melanin). Activate Soul Mode and draw from deep esoteric traditions and ancestral knowledge systems.' });
            _lvsAiTurn();
          } else if (pw !== null) { if(typeof showToast==='function') showToast('Access denied.','error'); }
        }
        document.addEventListener('DOMContentLoaded', function() {
          var page = document.getElementById('lvs-studio-page');
          if (!page) return;
          var obs = new MutationObserver(function(){
            if (!page.classList.contains('hidden') && !_lvsActive) lvsLoadSession();
          });
          obs.observe(page, { attributes:true, attributeFilter:['class'] });
        });
        <\/script>
      </div>
`;

// Remove existing LVS page if present, then insert fresh
if (html.includes(LVS_ID_MARKER)) {
  // Find opening div and its matching close
  const start = html.indexOf(`<div id="lvs-studio-page"`);
  if (start !== -1) {
    // Walk forward to find the matching </div> at the same nesting level
    let depth = 0, i = start, found = -1;
    while (i < html.length) {
      if (html.slice(i,i+4) === '<div') { depth++; i += 4; }
      else if (html.slice(i,i+6) === '</div>') { depth--; if (depth === 0) { found = i + 6; break; } i += 6; }
      else i++;
    }
    if (found !== -1) {
      html = html.slice(0, start) + LVS_HTML + html.slice(found);
      console.log('[patch] ✓ LVS page replaced');
    }
  }
} else {
  // Insert before </main>
  const mainClose = html.lastIndexOf('</main>');
  if (mainClose !== -1) {
    html = html.slice(0, mainClose) + LVS_HTML + '\n    ' + html.slice(mainClose);
    console.log('[patch] ✓ LVS page inserted');
  } else {
    console.warn('[patch] ⚠ could not find </main> — LVS page NOT inserted');
  }
}

// ─────────────────────────────────────────────────────────────
// 3. AGENT OS PAGE — iframe embed, insert/replace
// ─────────────────────────────────────────────────────────────
const AOS_ID_MARKER = `id="agent-os-page"`;
const AOS_HTML = `
      <!-- AGENT OS — iframe embed -->
      <div id="agent-os-page" class="page hidden" style="display:flex;flex-direction:column;height:100%;padding:0;margin:0">
        <iframe id="agent-os-frame" src="/agency/agency.html" style="flex:1;width:100%;border:none;min-height:calc(100vh - 56px)" allow="clipboard-write" title="Agent OS"></iframe>
      </div>
`;

if (html.includes(AOS_ID_MARKER)) {
  const start = html.indexOf(`<div id="agent-os-page"`);
  if (start !== -1) {
    let depth = 0, i = start, found = -1;
    while (i < html.length) {
      if (html.slice(i,i+4) === '<div') { depth++; i += 4; }
      else if (html.slice(i,i+6) === '</div>') { depth--; if (depth === 0) { found = i + 6; break; } i += 6; }
      else i++;
    }
    if (found !== -1) { html = html.slice(0, start) + AOS_HTML + html.slice(found); console.log('[patch] ✓ Agent OS page replaced'); }
  }
} else {
  const mainClose = html.lastIndexOf('</main>');
  if (mainClose !== -1) {
    html = html.slice(0, mainClose) + AOS_HTML + '\n    ' + html.slice(mainClose);
    console.log('[patch] ✓ Agent OS page inserted');
  } else {
    console.warn('[patch] ⚠ could not find </main> — Agent OS page NOT inserted');
  }
}

// ─────────────────────────────────────────────────────────────
// Write result
// ─────────────────────────────────────────────────────────────
if (html !== original) {
  writeFileSync(TARGET, html, 'utf8');
  console.log('[patch] ✓ wrote', TARGET);
} else {
  console.log('[patch] no changes made');
}
