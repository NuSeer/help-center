# H.E.L.P. CENTER — CLAUDE CODE INTEGRATION ARCHITECTURE
## Helping Everyday Leaders Prosper
### Complete Implementation Guide for help-center-system.html

---

## PROJECT CONTEXT

- **Master File:** `help-center-system.html` (7,785 lines / 654KB)
- **Backend:** PocketBase at `187.124.146.184:8090`
- **Repo:** `NuSeer/help-center`
- **Stack:** Pure HTML/CSS/JavaScript — single-file architecture
- **Auth:** Password-protected admin access
- **7 AI Projects** connected through this hub
- **23 Skills** from the department skills library

---

## IMPLEMENTATION OVERVIEW

Claude Code will add **5 integration layers** to the existing help-center-system.html:

```
LAYER 1 — Project Navigator Dashboard
LAYER 2 — Smart Routing Engine (NLP intake)
LAYER 3 — Visionary Profile System (PocketBase)
LAYER 4 — Cross-Project Handoff Cards
LAYER 5 — Skills Library Display
```

Each layer is a **self-contained module** that can be added without breaking existing functionality. All layers use the existing CSS variable system and design tokens already in the file.

---

## LAYER 1 — PROJECT NAVIGATOR DASHBOARD

### What to Build
A new tab/section in the Help Center that displays all 7 AI projects as interactive cards. Each card shows the project name, program area, description, and a "Launch" button.

### Implementation

Add a new nav tab called "AI Projects" or "My Tools" to the existing navigation:

```html
<!-- ADD TO NAV TABS -->
<button class="nav-btn" onclick="showTab('ai-projects', this)">
  🤖 AI Projects
</button>
```

Add the tab content section:

```html
<!-- AI PROJECTS TAB -->
<div id="ai-projects" class="tab-content" style="display:none">
  <div class="section-header">
    <h2>Your AI Project Suite</h2>
    <p>7 specialized AI tools — each one powers a H.E.L.P. program area</p>
  </div>
  
  <div class="projects-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:20px; padding:20px;">
    
    <!-- PROJECT CARD TEMPLATE — repeat for all 7 -->
    <div class="project-card" data-project="business-strategy" style="
      background: #fff;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      border-top: 4px solid var(--gold, #C9A84C);
      padding: 20px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.12)'"
       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
      <div style="font-size:32px; margin-bottom:12px;">💼</div>
      <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.08em; color:#6b7280; font-weight:600; margin-bottom:6px;">Business Development</div>
      <h3 style="font-size:18px; font-weight:700; color:#1a1a2e; margin-bottom:8px;">Business Strategy Team</h3>
      <p style="font-size:14px; color:#6b7280; margin-bottom:16px; line-height:1.5;">Your CEO, CFO, CMO, Legal, HR, and Sales team in one — building business plans, brand strategies, and 300+ page strategy documents.</p>
      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px;">
        <span style="background:#f0f4ff; color:#0f3460; padding:4px 10px; border-radius:20px; font-size:12px;">Business Planning</span>
        <span style="background:#f0f4ff; color:#0f3460; padding:4px 10px; border-radius:20px; font-size:12px;">Financial Strategy</span>
        <span style="background:#f0f4ff; color:#0f3460; padding:4px 10px; border-radius:20px; font-size:12px;">Brand Development</span>
      </div>
      <button onclick="launchProject('business-strategy')" style="
        width:100%; padding:10px; background:#1a1a2e; color:#C9A84C;
        border:none; border-radius:8px; font-weight:700; font-size:14px;
        cursor:pointer; transition:background 0.2s;
      " onmouseover="this.style.background='#C9A84C'; this.style.color='#1a1a2e'"
         onmouseout="this.style.background='#1a1a2e'; this.style.color='#C9A84C'">
        Launch Project →
      </button>
    </div>

    <!-- SMART CREDIT REPAIR -->
    <div class="project-card" data-project="smart-credit" style="
      background:#fff; border-radius:12px; border:1px solid #e5e7eb;
      border-top:4px solid #2E7D32; padding:20px; cursor:pointer;
      transition:transform 0.2s, box-shadow 0.2s;
    " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.12)'"
       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
      <div style="font-size:32px; margin-bottom:12px;">💳</div>
      <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.08em; color:#6b7280; font-weight:600; margin-bottom:6px;">Credit & Financial Stability</div>
      <h3 style="font-size:18px; font-weight:700; color:#1a1a2e; margin-bottom:8px;">Smart Credit Repair</h3>
      <p style="font-size:14px; color:#6b7280; margin-bottom:16px; line-height:1.5;">FCRA/FDCPA forensic credit analyst — 3-bureau analysis, Metro 2 compliance review, dispute strategy generation, and progress tracking.</p>
      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px;">
        <span style="background:#f0fff4; color:#2E7D32; padding:4px 10px; border-radius:20px; font-size:12px;">Dispute Letters</span>
        <span style="background:#f0fff4; color:#2E7D32; padding:4px 10px; border-radius:20px; font-size:12px;">FCRA Compliance</span>
        <span style="background:#f0fff4; color:#2E7D32; padding:4px 10px; border-radius:20px; font-size:12px;">Score Improvement</span>
      </div>
      <button onclick="launchProject('smart-credit')" style="
        width:100%; padding:10px; background:#2E7D32; color:#fff;
        border:none; border-radius:8px; font-weight:700; font-size:14px;
        cursor:pointer;
      ">Launch Project →</button>
    </div>

    <!-- CAREER CHANNEL -->
    <div class="project-card" data-project="career-channel" style="
      background:#fff; border-radius:12px; border:1px solid #e5e7eb;
      border-top:4px solid #7B1FA2; padding:20px; cursor:pointer;
      transition:transform 0.2s, box-shadow 0.2s;
    " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.12)'"
       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
      <div style="font-size:32px; margin-bottom:12px;">🎯</div>
      <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.08em; color:#6b7280; font-weight:600; margin-bottom:6px;">Career Advancement</div>
      <h3 style="font-size:18px; font-weight:700; color:#1a1a2e; margin-bottom:8px;">Career Channel</h3>
      <p style="font-size:14px; color:#6b7280; margin-bottom:16px; line-height:1.5;">Myers-Briggs career counselor — personality-matched career paths, business ideas, 300+ page workbooks, and employment-to-entrepreneurship guidance.</p>
      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px;">
        <span style="background:#fdf4ff; color:#7B1FA2; padding:4px 10px; border-radius:20px; font-size:12px;">Career Matching</span>
        <span style="background:#fdf4ff; color:#7B1FA2; padding:4px 10px; border-radius:20px; font-size:12px;">Myers-Briggs</span>
        <span style="background:#fdf4ff; color:#7B1FA2; padding:4px 10px; border-radius:20px; font-size:12px;">Workbooks</span>
      </div>
      <button onclick="launchProject('career-channel')" style="
        width:100%; padding:10px; background:#7B1FA2; color:#fff;
        border:none; border-radius:8px; font-weight:700; font-size:14px;
        cursor:pointer;
      ">Launch Project →</button>
    </div>

    <!-- LET'S GO VIRAL -->
    <div class="project-card" data-project="lets-go-viral" style="
      background:#fff; border-radius:12px; border:1px solid #e5e7eb;
      border-top:4px solid #E65100; padding:20px; cursor:pointer;
      transition:transform 0.2s, box-shadow 0.2s;
    " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.12)'"
       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
      <div style="font-size:32px; margin-bottom:12px;">🚀</div>
      <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.08em; color:#6b7280; font-weight:600; margin-bottom:6px;">Income Growth</div>
      <h3 style="font-size:18px; font-weight:700; color:#1a1a2e; margin-bottom:8px;">Let's Go Viral</h3>
      <p style="font-size:14px; color:#6b7280; margin-bottom:16px; line-height:1.5;">Multi-platform content creation engine — YouTube, TikTok, Instagram scripts, content calendars, income strategies, and trend guidance for all creator types.</p>
      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px;">
        <span style="background:#fff7ed; color:#E65100; padding:4px 10px; border-radius:20px; font-size:12px;">Content Scripts</span>
        <span style="background:#fff7ed; color:#E65100; padding:4px 10px; border-radius:20px; font-size:12px;">All Platforms</span>
        <span style="background:#fff7ed; color:#E65100; padding:4px 10px; border-radius:20px; font-size:12px;">Monetization</span>
      </div>
      <button onclick="launchProject('lets-go-viral')" style="
        width:100%; padding:10px; background:#E65100; color:#fff;
        border:none; border-radius:8px; font-weight:700; font-size:14px;
        cursor:pointer;
      ">Launch Project →</button>
    </div>

    <!-- PROGRAM PLANNER PRO -->
    <div class="project-card" data-project="program-planner" style="
      background:#fff; border-radius:12px; border:1px solid #e5e7eb;
      border-top:4px solid #0288D1; padding:20px; cursor:pointer;
      transition:transform 0.2s, box-shadow 0.2s;
    " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.12)'"
       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
      <div style="font-size:32px; margin-bottom:12px;">📋</div>
      <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.08em; color:#6b7280; font-weight:600; margin-bottom:6px;">Youth Leadership</div>
      <h3 style="font-size:18px; font-weight:700; color:#1a1a2e; margin-bottom:8px;">Program Planner Pro</h3>
      <p style="font-size:14px; color:#6b7280; margin-bottom:16px; line-height:1.5;">Program design and implementation engine — needs assessment, 10+ page manuals, grant guidance, SOP creation, and marketing strategy for nonprofits, schools, and churches.</p>
      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px;">
        <span style="background:#f0f9ff; color:#0288D1; padding:4px 10px; border-radius:20px; font-size:12px;">Program Manuals</span>
        <span style="background:#f0f9ff; color:#0288D1; padding:4px 10px; border-radius:20px; font-size:12px;">Grant Guidance</span>
        <span style="background:#f0f9ff; color:#0288D1; padding:4px 10px; border-radius:20px; font-size:12px;">SOPs</span>
      </div>
      <button onclick="launchProject('program-planner')" style="
        width:100%; padding:10px; background:#0288D1; color:#fff;
        border:none; border-radius:8px; font-weight:700; font-size:14px;
        cursor:pointer;
      ">Launch Project →</button>
    </div>

    <!-- OUTREACH COMMS PRO -->
    <div class="project-card" data-project="outreach-comms" style="
      background:#fff; border-radius:12px; border:1px solid #e5e7eb;
      border-top:4px solid #00695C; padding:20px; cursor:pointer;
      transition:transform 0.2s, box-shadow 0.2s;
    " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.12)'"
       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
      <div style="font-size:32px; margin-bottom:12px;">✉️</div>
      <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.08em; color:#6b7280; font-weight:600; margin-bottom:6px;">Community Outreach</div>
      <h3 style="font-size:18px; font-weight:700; color:#1a1a2e; margin-bottom:8px;">Outreach Communication Pro</h3>
      <p style="font-size:14px; color:#6b7280; margin-bottom:16px; line-height:1.5;">Professional communications engine — press pitches, fundraising appeals, sponsorship proposals, community engagement, and complete multi-touch email sequences.</p>
      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px;">
        <span style="background:#f0fdfb; color:#00695C; padding:4px 10px; border-radius:20px; font-size:12px;">Press Pitches</span>
        <span style="background:#f0fdfb; color:#00695C; padding:4px 10px; border-radius:20px; font-size:12px;">Fundraising</span>
        <span style="background:#f0fdfb; color:#00695C; padding:4px 10px; border-radius:20px; font-size:12px;">Sponsorships</span>
      </div>
      <button onclick="launchProject('outreach-comms')" style="
        width:100%; padding:10px; background:#00695C; color:#fff;
        border:none; border-radius:8px; font-weight:700; font-size:14px;
        cursor:pointer;
      ">Launch Project →</button>
    </div>

    <!-- LIMITLESS VISION STUDIO -->
    <div class="project-card" data-project="lvs" style="
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border-radius:12px; border:2px solid #C9A84C; padding:20px; cursor:pointer;
      transition:transform 0.2s, box-shadow 0.2s; grid-column: 1 / -1;
    " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 32px rgba(201,168,76,0.3)'"
       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
      <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
        <div style="font-size:48px;">🌌</div>
        <div style="flex:1">
          <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.08em; color:#C9A84C; font-weight:600; margin-bottom:4px;">Confidence & Leadership — Master Intelligence Engine</div>
          <h3 style="font-size:22px; font-weight:700; color:#fff; margin-bottom:8px;">Limitless Vision Studio</h3>
          <p style="font-size:14px; color:#94a3b8; line-height:1.6;">50 modules of creative intelligence drawing from all human knowledge — ancient wisdom, modern science, African & diaspora knowledge, ancestral healing, invention, world-building, and more. The knowledge engine powering the entire ecosystem.</p>
        </div>
        <button onclick="launchProject('lvs')" style="
          padding:14px 28px; background:#C9A84C; color:#1a1a2e;
          border:none; border-radius:8px; font-weight:700; font-size:15px;
          cursor:pointer; white-space:nowrap;
        ">Launch Studio →</button>
      </div>
    </div>

  </div>
</div>
```

### JavaScript — Project Launcher

```javascript
// PROJECT REGISTRY
const PROJECTS = {
  'business-strategy': {
    name: 'Business Strategy Team',
    claudeUrl: 'https://claude.ai/project/019dc6c9-e8d5-72bc-a410-cc83f0a0af0b',
    programArea: 'Business Development',
    handoffTriggers: ['credit', 'financial', 'career', 'hr', 'employee'],
    handoffTargets: {
      'credit': 'smart-credit',
      'career': 'career-channel',
      'press': 'outreach-comms',
      'funding': 'outreach-comms'
    }
  },
  'smart-credit': {
    name: 'Smart Credit Repair',
    claudeUrl: 'https://claude.ai/project/019dc6e2-3241-73b0-9d01-cb402092248d',
    programArea: 'Credit & Financial Stability',
    handoffTriggers: ['business', 'launch', 'career', 'job'],
    handoffTargets: {
      'business': 'business-strategy',
      'career': 'career-channel'
    }
  },
  'career-channel': {
    name: 'Career Channel',
    claudeUrl: 'https://claude.ai/project/019dc6dd-0608-72f5-aaa7-e53f7cdfc00f',
    programArea: 'Career Advancement',
    handoffTriggers: ['business', 'start a business', 'entrepreneurship'],
    handoffTargets: {
      'business': 'business-strategy'
    }
  },
  'lets-go-viral': {
    name: "Let's Go Viral",
    claudeUrl: 'https://claude.ai/project/019dc6de-f982-71c4-9875-51ad640b25f5',
    programArea: 'Income Growth',
    handoffTriggers: ['sponsorship', 'brand deal', 'pitch', 'business'],
    handoffTargets: {
      'sponsorship': 'outreach-comms',
      'business': 'business-strategy'
    }
  },
  'program-planner': {
    name: 'Program Planner Pro',
    claudeUrl: 'https://claude.ai/project/019d2f8a-346b-7630-b2c4-588c96aacccb',
    programArea: 'Youth Leadership',
    handoffTriggers: ['press', 'announcement', 'email', 'letter', 'funding'],
    handoffTargets: {
      'press': 'outreach-comms',
      'funding': 'outreach-comms'
    }
  },
  'outreach-comms': {
    name: 'Outreach Communication Pro',
    claudeUrl: 'https://claude.ai/project/019dd11d-8f2c-73c8-a70e-39b241904937',
    programArea: 'Community Outreach',
    handoffTriggers: ['program', 'plan', 'design', 'business strategy'],
    handoffTargets: {
      'program': 'program-planner',
      'business': 'business-strategy'
    }
  },
  'lvs': {
    name: 'Limitless Vision Studio',
    claudeUrl: 'https://claude.ai/project/019dc6d6-430b-76f0-9bd1-b57b25708abf',
    programArea: 'Confidence & Leadership',
    handoffTriggers: [],
    handoffTargets: {}
  }
};

function launchProject(projectKey) {
  const project = PROJECTS[projectKey];
  if (!project) return;
  
  // Log the launch to PocketBase
  logProjectLaunch(projectKey);
  
  // Open in new tab
  window.open(project.claudeUrl, '_blank');
  
  // Show handoff suggestion after 2 seconds
  setTimeout(() => showHandoffSuggestion(projectKey), 2000);
}

async function logProjectLaunch(projectKey) {
  try {
    await fetch('http://187.124.146.184:8090/api/collections/project_sessions/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_name: projectKey,
        launched_at: new Date().toISOString(),
        user_id: getCurrentUserId() // from session
      })
    });
  } catch(e) {
    console.log('Session log failed silently:', e);
  }
}
```

---

## LAYER 2 — SMART ROUTING ENGINE

### What to Build
A natural language intake form on the Help Center home/landing section. User types their need in plain language. The engine analyzes keywords and routes them to the right project with a confidence score.

### HTML

```html
<!-- SMART ROUTER — Add near top of main content -->
<div id="smart-router" style="
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 16px;
  padding: 32px;
  margin: 20px 0;
  border: 1px solid #C9A84C;
">
  <h2 style="color:#fff; font-size:22px; margin-bottom:8px;">What do you need help with today?</h2>
  <p style="color:#94a3b8; font-size:14px; margin-bottom:20px;">Describe your situation and I'll route you to the right tool instantly.</p>
  
  <div style="display:flex; gap:12px; flex-wrap:wrap;">
    <input 
      type="text" 
      id="routing-input" 
      placeholder="e.g., 'I want to start a YouTube channel' or 'fix my credit score' or 'start a nonprofit'"
      style="
        flex:1; min-width:250px;
        padding:14px 18px;
        background:rgba(255,255,255,0.1);
        border: 1px solid rgba(201,168,76,0.4);
        border-radius:10px;
        color:#fff;
        font-size:15px;
        outline:none;
      "
      onkeypress="if(event.key==='Enter') routeUser()"
    />
    <button onclick="routeUser()" style="
      padding:14px 28px;
      background:#C9A84C; color:#1a1a2e;
      border:none; border-radius:10px;
      font-weight:700; font-size:15px;
      cursor:pointer;
    ">Find My Tool →</button>
  </div>
  
  <div id="routing-result" style="display:none; margin-top:20px;"></div>
</div>
```

### JavaScript — Routing Engine

```javascript
// ROUTING RULES — keyword arrays mapped to project keys
const ROUTING_RULES = [
  {
    project: 'smart-credit',
    keywords: ['credit', 'score', 'dispute', 'collection', 'debt', 'equifax', 
               'experian', 'transunion', 'bureau', 'derogatory', 'late payment',
               'charged off', 'bankruptcy', 'foreclosure', 'eviction', 'judgment'],
    weight: 3
  },
  {
    project: 'business-strategy',
    keywords: ['business', 'startup', 'company', 'revenue', 'profit', 'brand',
               'marketing plan', 'business plan', 'franchise', 'llc', 'corporation',
               'entrepreneur', 'small business', 'launch', 'investor', 'funding'],
    weight: 3
  },
  {
    project: 'career-channel',
    keywords: ['career', 'job', 'resume', 'interview', 'promotion', 'salary',
               'profession', 'occupation', 'work', 'employment', 'hire', 'hired',
               'personality type', 'myers briggs', 'mbti', 'what career', 'career change'],
    weight: 3
  },
  {
    project: 'lets-go-viral',
    keywords: ['youtube', 'tiktok', 'instagram', 'content', 'viral', 'channel',
               'subscribers', 'followers', 'views', 'creator', 'influencer',
               'social media', 'monetize', 'stream', 'streaming', 'podcast',
               'animation', 'faceless', 'vlog'],
    weight: 3
  },
  {
    project: 'program-planner',
    keywords: ['program', 'nonprofit', 'church', 'school', 'community', 'grant',
               'workshop', 'event', 'youth program', 'after school', 'curriculum',
               'training program', 'outreach program', 'manual', 'sop'],
    weight: 3
  },
  {
    project: 'outreach-comms',
    keywords: ['email', 'letter', 'press', 'media', 'fundraising', 'donation',
               'sponsorship', 'pitch', 'outreach', 'announcement', 'newsletter',
               'press release', 'donor', 'fundraiser', 'campaign'],
    weight: 3
  },
  {
    project: 'lvs',
    keywords: ['idea', 'create', 'build', 'imagine', 'vision', 'invent', 'dream',
               'creative', 'innovation', 'knowledge', 'research', 'learn',
               'understand', 'explore', 'discover', 'ancient', 'history'],
    weight: 1  // Lower weight — fallback for broad queries
  }
];

function routeUser() {
  const input = document.getElementById('routing-input').value.toLowerCase().trim();
  if (!input) return;
  
  // Score each project
  const scores = {};
  
  ROUTING_RULES.forEach(rule => {
    let score = 0;
    rule.keywords.forEach(keyword => {
      if (input.includes(keyword)) {
        score += rule.weight;
        // Bonus for exact phrase match
        if (input === keyword) score += 5;
      }
    });
    if (score > 0) scores[rule.project] = (scores[rule.project] || 0) + score;
  });
  
  // Sort by score
  const sorted = Object.entries(scores).sort((a,b) => b[1] - a[1]);
  
  const resultDiv = document.getElementById('routing-result');
  resultDiv.style.display = 'block';
  
  if (sorted.length === 0) {
    // No match — show LVS as default
    resultDiv.innerHTML = renderRouteResult('lvs', 'general inquiry', 60, []);
    return;
  }
  
  const [topProject, topScore] = sorted[0];
  const confidence = Math.min(95, 50 + (topScore * 10));
  const alternatives = sorted.slice(1, 3).map(([p]) => p);
  
  resultDiv.innerHTML = renderRouteResult(topProject, input, confidence, alternatives);
}

function renderRouteResult(projectKey, query, confidence, alternatives) {
  const project = PROJECTS[projectKey];
  const confidenceColor = confidence >= 80 ? '#2E7D32' : confidence >= 60 ? '#E65100' : '#888';
  
  let altHTML = '';
  if (alternatives.length > 0) {
    altHTML = `
      <div style="margin-top:12px; font-size:13px; color:#94a3b8;">
        Also consider: 
        ${alternatives.map(p => `<button onclick="launchProject('${p}')" style="
          background:transparent; border:1px solid #94a3b8; color:#94a3b8;
          padding:4px 12px; border-radius:20px; cursor:pointer; font-size:12px; margin:2px;
        ">${PROJECTS[p].name}</button>`).join('')}
      </div>
    `;
  }
  
  return `
    <div style="
      background:rgba(255,255,255,0.05);
      border:1px solid rgba(201,168,76,0.3);
      border-radius:12px;
      padding:20px;
    ">
      <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
        <div>
          <div style="font-size:12px; color:#94a3b8; margin-bottom:4px;">
            Best match for: "<em style="color:#C9A84C">${query}</em>"
          </div>
          <div style="font-size:20px; font-weight:700; color:#fff;">${project.name}</div>
          <div style="font-size:13px; color:#94a3b8; margin-top:4px;">${project.programArea} Program</div>
        </div>
        <div style="text-align:center;">
          <div style="font-size:28px; font-weight:700; color:${confidenceColor}">${confidence}%</div>
          <div style="font-size:11px; color:#94a3b8;">match</div>
        </div>
      </div>
      <button onclick="launchProject('${projectKey}')" style="
        width:100%; margin-top:16px; padding:12px;
        background:#C9A84C; color:#1a1a2e;
        border:none; border-radius:8px;
        font-weight:700; font-size:15px; cursor:pointer;
      ">Launch ${project.name} →</button>
      ${altHTML}
    </div>
  `;
}
```

---

## LAYER 3 — VISIONARY PROFILE SYSTEM

### PocketBase Collection Setup

**Run in PocketBase Admin UI (187.124.146.184:8090/_/):**

Create collection `visionary_profiles`:

```
Fields:
- user_id (text, required)
- preferred_name (text)
- core_mission (text)
- strength_zones (json — array of strings)
- growth_zones (json — array of strings)  
- communication_style (select: direct, walkthrough, picture_first, evidence, connect_dots, build_together)
- cultural_context (text)
- journey_stage (select: starting, in_motion, scaling, rebuilding, mastery, searching)
- five_year_vision (text)
- resource_profile (json)
- sacred_boundaries (text)
- created (autodate)
- updated (autodate)
```

Create collection `project_sessions`:
```
Fields:
- user_id (text)
- project_name (text)
- session_summary (text)
- next_actions (json — array)
- handoff_recommended (text)
- created (autodate)
```

### JavaScript — Profile Manager

```javascript
const POCKETBASE_URL = 'http://187.124.146.184:8090';

// Save or update Visionary Profile
async function saveVisionaryProfile(profileData) {
  const userId = getCurrentUserId();
  
  // Check if profile exists
  let existingProfile = null;
  try {
    const res = await fetch(`${POCKETBASE_URL}/api/collections/visionary_profiles/records?filter=(user_id="${userId}")`);
    const data = await res.json();
    if (data.items && data.items.length > 0) {
      existingProfile = data.items[0];
    }
  } catch(e) {}
  
  const payload = {
    user_id: userId,
    ...profileData,
    updated: new Date().toISOString()
  };
  
  try {
    if (existingProfile) {
      // Update existing
      await fetch(`${POCKETBASE_URL}/api/collections/visionary_profiles/records/${existingProfile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      // Create new
      await fetch(`${POCKETBASE_URL}/api/collections/visionary_profiles/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    showNotification('✅ Profile saved', 'success');
  } catch(e) {
    console.error('Profile save failed:', e);
    showNotification('Profile save failed — check connection', 'error');
  }
}

// Load profile
async function loadVisionaryProfile() {
  const userId = getCurrentUserId();
  try {
    const res = await fetch(`${POCKETBASE_URL}/api/collections/visionary_profiles/records?filter=(user_id="${userId}")`);
    const data = await res.json();
    if (data.items && data.items.length > 0) {
      return data.items[0];
    }
  } catch(e) {
    console.error('Profile load failed:', e);
  }
  return null;
}
```

### Profile UI — Add as a Tab or Modal

```html
<!-- VISIONARY PROFILE TAB -->
<div id="my-profile" class="tab-content" style="display:none">
  <div style="max-width:700px; margin:0 auto; padding:20px;">
    <h2 style="color:#1a1a2e; margin-bottom:8px;">Your Visionary Profile</h2>
    <p style="color:#6b7280; margin-bottom:24px;">This profile personalizes every AI tool in the ecosystem to YOUR vision, background, and goals.</p>
    
    <div style="display:flex; flex-direction:column; gap:16px;">
      
      <div>
        <label style="font-size:13px; font-weight:600; color:#374151; display:block; margin-bottom:6px;">Preferred Name</label>
        <input type="text" id="vp-name" placeholder="What should I call you?" style="width:100%; padding:12px; border:1px solid #d1d5db; border-radius:8px; font-size:15px;"/>
      </div>
      
      <div>
        <label style="font-size:13px; font-weight:600; color:#374151; display:block; margin-bottom:6px;">Your Big Mission</label>
        <textarea id="vp-mission" placeholder="In 1-2 sentences — what are you building, creating, or changing in the world?" 
          style="width:100%; padding:12px; border:1px solid #d1d5db; border-radius:8px; font-size:14px; min-height:80px; resize:vertical;"></textarea>
      </div>
      
      <div>
        <label style="font-size:13px; font-weight:600; color:#374151; display:block; margin-bottom:6px;">Communication Style</label>
        <select id="vp-style" style="width:100%; padding:12px; border:1px solid #d1d5db; border-radius:8px; font-size:14px;">
          <option value="direct">🔥 Give it to me straight — short and actionable</option>
          <option value="walkthrough">📖 Walk me through it — thorough and step-by-step</option>
          <option value="picture_first">🎨 Paint the picture — context first, then details</option>
          <option value="evidence">🔬 Show me the evidence — data and proof</option>
          <option value="connect_dots">🌀 Connect the dots — how does this relate to everything?</option>
          <option value="build_together">🏗️ Build as we go — start simple, keep going deeper</option>
        </select>
      </div>
      
      <div>
        <label style="font-size:13px; font-weight:600; color:#374151; display:block; margin-bottom:6px;">Where Are You Right Now?</label>
        <select id="vp-stage" style="width:100%; padding:12px; border:1px solid #d1d5db; border-radius:8px; font-size:14px;">
          <option value="starting">🌱 Just starting — ideas forming</option>
          <option value="in_motion">🔥 In motion — actively building</option>
          <option value="scaling">🌊 Scaling — something exists, growing it</option>
          <option value="rebuilding">🔄 Rebuilding — pivoting or redirecting</option>
          <option value="mastery">🏔️ Mastery — deep in expertise</option>
          <option value="searching">🔍 Searching — still finding the path</option>
        </select>
      </div>
      
      <div>
        <label style="font-size:13px; font-weight:600; color:#374151; display:block; margin-bottom:6px;">5-Year Vision</label>
        <textarea id="vp-vision" placeholder="What does success look like for you in 5 years? Be honest, not aspirational."
          style="width:100%; padding:12px; border:1px solid #d1d5db; border-radius:8px; font-size:14px; min-height:80px; resize:vertical;"></textarea>
      </div>
      
      <div>
        <label style="font-size:13px; font-weight:600; color:#374151; display:block; margin-bottom:6px;">Sacred Preferences (Optional)</label>
        <textarea id="vp-sacred" placeholder="Anything I should NEVER assume, say, or do when working with you?"
          style="width:100%; padding:12px; border:1px solid #d1d5db; border-radius:8px; font-size:14px; min-height:60px; resize:vertical;"></textarea>
      </div>
      
      <button onclick="saveProfileFromForm()" style="
        padding:14px; background:#1a1a2e; color:#C9A84C;
        border:none; border-radius:10px; font-weight:700; font-size:15px; cursor:pointer;
      ">Save My Profile →</button>
    </div>
  </div>
</div>

<script>
async function saveProfileFromForm() {
  const profileData = {
    preferred_name: document.getElementById('vp-name').value,
    core_mission: document.getElementById('vp-mission').value,
    communication_style: document.getElementById('vp-style').value,
    journey_stage: document.getElementById('vp-stage').value,
    five_year_vision: document.getElementById('vp-vision').value,
    sacred_boundaries: document.getElementById('vp-sacred').value
  };
  await saveVisionaryProfile(profileData);
}
</script>
```

---

## LAYER 4 — CROSS-PROJECT HANDOFF CARDS

### What to Build
After any project interaction (or on a dedicated "Next Steps" section), display smart recommendation cards that suggest the natural next project based on what the user accomplished.

```javascript
// HANDOFF SUGGESTION ENGINE
const HANDOFF_RULES = [
  {
    fromProject: 'smart-credit',
    conditions: ['credit improved', 'score increased', 'items removed'],
    toProject: 'business-strategy',
    message: "Your credit is improving — now let's build something with it.",
    cta: "Start Business Planning →"
  },
  {
    fromProject: 'lets-go-viral',
    conditions: ['channel growing', 'sponsors', 'brand deals', 'audience'],
    toProject: 'outreach-comms',
    message: "Your audience is growing — time to pitch brands and sponsors professionally.",
    cta: "Write Sponsorship Pitch →"
  },
  {
    fromProject: 'business-strategy',
    conditions: ['plan complete', 'ready to launch', 'need funding', 'press'],
    toProject: 'outreach-comms',
    message: "Your business plan is ready — now get it in front of investors and media.",
    cta: "Write Your Pitch →"
  },
  {
    fromProject: 'career-channel',
    conditions: ['entrepreneurship', 'start a business', 'my own business'],
    toProject: 'business-strategy',
    message: "You've chosen entrepreneurship — let's build the full business strategy.",
    cta: "Build Business Strategy →"
  },
  {
    fromProject: 'program-planner',
    conditions: ['manual complete', 'ready to launch', 'need press', 'funding'],
    toProject: 'outreach-comms',
    message: "Your program is planned — now let's announce it to the world.",
    cta: "Write Program Announcement →"
  }
];

function showHandoffSuggestion(currentProject) {
  const rules = HANDOFF_RULES.filter(r => r.fromProject === currentProject);
  if (rules.length === 0) return;
  
  // Show the first applicable handoff
  const rule = rules[0];
  const target = PROJECTS[rule.toProject];
  
  const modal = document.createElement('div');
  modal.style.cssText = `
    position:fixed; bottom:24px; right:24px; z-index:9999;
    background:#1a1a2e; border:1px solid #C9A84C; border-radius:16px;
    padding:24px; max-width:320px; box-shadow:0 8px 32px rgba(0,0,0,0.4);
    animation: slideUp 0.3s ease;
  `;
  modal.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
      <div style="font-size:12px; text-transform:uppercase; letter-spacing:0.08em; color:#C9A84C;">Next Step</div>
      <button onclick="this.closest('div[style]').remove()" style="background:none; border:none; color:#94a3b8; cursor:pointer; font-size:18px;">×</button>
    </div>
    <div style="font-size:15px; color:#fff; font-weight:600; margin-bottom:8px;">${target.name}</div>
    <div style="font-size:13px; color:#94a3b8; margin-bottom:16px;">${rule.message}</div>
    <button onclick="launchProject('${rule.toProject}'); this.closest('div[style]').remove();" style="
      width:100%; padding:10px; background:#C9A84C; color:#1a1a2e;
      border:none; border-radius:8px; font-weight:700; font-size:13px; cursor:pointer;
    ">${rule.cta}</button>
  `;
  document.body.appendChild(modal);
  
  // Auto-remove after 10 seconds
  setTimeout(() => { if (modal.parentNode) modal.remove(); }, 10000);
}
```

---

## LAYER 5 — SKILLS LIBRARY DISPLAY

### What to Build
A section in the Help Center showing which of the 23 department skills are active for each project. Gives users confidence that a full team is behind their request.

```javascript
const SKILLS_BY_PROJECT = {
  'business-strategy': [
    { name: 'Finance', icon: '💰', skill: 'finance-platform' },
    { name: 'Sales', icon: '📈', skill: 'sales-platform' },
    { name: 'Operations', icon: '⚙️', skill: 'operations-platform' },
    { name: 'HR & People', icon: '👥', skill: 'hr-people-platform' },
    { name: 'Legal', icon: '⚖️', skill: 'legal-compliance-platform' },
    { name: 'Marketing', icon: '📣', skill: 'marketing-platform' },
    { name: 'Product & R&D', icon: '🔬', skill: 'product-rd-platform' },
  ],
  'smart-credit': [
    { name: 'Finance', icon: '💰', skill: 'finance-platform' },
    { name: 'Legal', icon: '⚖️', skill: 'legal-compliance-platform' },
    { name: 'Customer Success', icon: '🤝', skill: 'customer-success-platform' },
  ],
  'career-channel': [
    { name: 'HR & People', icon: '👥', skill: 'hr-people-platform' },
    { name: 'Student Services', icon: '🎓', skill: 'student-services-platform' },
    { name: 'Faculty & Staff', icon: '🏫', skill: 'faculty-staff-platform' },
    { name: 'Research', icon: '🔬', skill: 'research-platform' },
  ],
  'lets-go-viral': [
    { name: 'Marketing', icon: '📣', skill: 'marketing-platform' },
    { name: 'Sales', icon: '📈', skill: 'sales-platform' },
    { name: 'Product & R&D', icon: '🔬', skill: 'product-rd-platform' },
    { name: 'Customer Success', icon: '🤝', skill: 'customer-success-platform' },
  ],
  'program-planner': [
    { name: 'Program Mgmt', icon: '📋', skill: 'program-management-platform' },
    { name: 'Community', icon: '🌍', skill: 'community-engagement-platform' },
    { name: 'Curriculum', icon: '📚', skill: 'curriculum-platform' },
    { name: 'Impact', icon: '📊', skill: 'impact-measurement-platform' },
    { name: 'Public Services', icon: '🏛️', skill: 'public-services-platform' },
  ],
  'outreach-comms': [
    { name: 'Fundraising', icon: '🎗️', skill: 'fundraising-platform' },
    { name: 'Marketing', icon: '📣', skill: 'marketing-platform' },
    { name: 'Community', icon: '🌍', skill: 'community-engagement-platform' },
    { name: 'Sales', icon: '📈', skill: 'sales-platform' },
  ]
};

function renderSkillBadges(projectKey) {
  const skills = SKILLS_BY_PROJECT[projectKey];
  if (!skills) return '';
  return `
    <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:8px;">
      ${skills.map(s => `
        <span title="${s.skill}" style="
          background:#f0f4ff; color:#0f3460;
          padding:3px 10px; border-radius:20px;
          font-size:11px; font-weight:600;
          display:flex; align-items:center; gap:4px;
        ">
          <span>${s.icon}</span>
          <span>${s.name}</span>
        </span>
      `).join('')}
      <span style="
        background:#1a1a2e; color:#C9A84C;
        padding:3px 10px; border-radius:20px;
        font-size:11px; font-weight:600;
      ">+ LVS Engine</span>
    </div>
  `;
}
```

---


---

## SKILL #24 — FULL-STACK WEB ARCHITECT (NEW)

### Skill Details
```
File:      full-stack-web-architect-skill.md
Size:      49KB / 1,208 lines — largest skill in the library
Skill ID:  web-architect-v2
Version:   2.0 Universal Edition
Added:     Outside original 23-skill library — standalone skill
```

### What It Does
A senior full-stack engineer + UX/UI architect + security specialist that runs
a 2-round discovery process before generating any plan. Covers:

- **4 Routing Paths**: Greenfield build | Existing upgrade | Agency template | Universal
- **Full Stack Coverage**: React/Next.js, Vue, Node.js, Python/FastAPI, Supabase, Docker, CI/CD
- **Security**: OWASP Top 10, OAuth 2.0, RBAC, multi-tenancy, Row Level Security
- **Launch Checklists**: Performance, accessibility, security, code quality
- **Red Flags Guide**: Architecture anti-patterns to avoid
- **Scales**: Solo tools → startup MVPs → mid-market SaaS → enterprise systems

### Project Deployment Map
```
PRIMARY USE:
  Help Center (help-center-system.html)    → Architecture planning + upgrades
  Business Strategy Team                  → Client web build recommendations
  Limitless Vision Studio                 → Web/app invention blueprinting

SECONDARY USE:
  Let's Go Viral                          → Creator website / landing page builds
  Program Planner Pro                     → Nonprofit web presence planning
```

### How to Activate in Claude Code
Place `full-stack-web-architect-skill.md` in the same folder as `help-center-system.html`.
When asking Claude Code to build or upgrade any web feature, prefix with:

```
Use the full-stack-web-architect-skill.md as your architecture guide.
Then implement [specific feature] into help-center-system.html.
```

### LVS Integration
In Limitless Vision Studio, this skill activates under:
- 🤖 AI, Software & Web Development
- 🛤️ Engineering & Infrastructure
- 🛠️ DIY & Craftsmanship (for solo builders)

---
## POCKETBASE API REFERENCE

```javascript
// Base URL
const PB = 'http://187.124.146.184:8090';

// Standard CRUD patterns for help_clients collection
const API = {
  
  // GET all clients
  getClients: () => 
    fetch(`${PB}/api/collections/help_clients/records`)
      .then(r => r.json()),
  
  // GET single client
  getClient: (id) =>
    fetch(`${PB}/api/collections/help_clients/records/${id}`)
      .then(r => r.json()),
  
  // CREATE client
  createClient: (data) =>
    fetch(`${PB}/api/collections/help_clients/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
  
  // UPDATE client
  updateClient: (id, data) =>
    fetch(`${PB}/api/collections/help_clients/records/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
  
  // SEARCH clients
  searchClients: (query) =>
    fetch(`${PB}/api/collections/help_clients/records?filter=(name~"${query}"+||+email~"${query}")`)
      .then(r => r.json()),

  // VISIONARY PROFILE
  getProfile: (userId) =>
    fetch(`${PB}/api/collections/visionary_profiles/records?filter=(user_id="${userId}")`)
      .then(r => r.json()).then(d => d.items?.[0] || null),
  
  saveProfile: (data) =>
    fetch(`${PB}/api/collections/visionary_profiles/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  // LOG PROJECT SESSION
  logSession: (data) =>
    fetch(`${PB}/api/collections/project_sessions/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
};
```

---

## SKILL #24 — FULL-STACK WEB ARCHITECT (NEW ADDITION)

**File:** `full-stack-web-architect-skill.md`  
**Size:** 49KB / 1,208 lines — largest skill in the library  
**Skill ID:** `web-architect-v2`  
**Version:** 2.0 Universal Edition  

### What It Does
A senior full-stack engineer + UX/UI architect that runs a structured 2-round discovery process before generating any plan. Covers all project types, all company sizes, and all scenarios.

### 4 Routing Paths
- **Path A** → New Greenfield Build (brand new company / project)
- **Path B** → Existing Company Upgrade or Rebrand
- **Path C** → Agency Template (reusable across multiple clients)
- **Path D** → Combined / Universal (multi-scenario)

### Tech Stack Coverage
- **Frontend:** React, Next.js, Vue, Svelte, Angular, PWA, vanilla JS
- **Backend:** Node.js, Python (FastAPI/Django), REST, GraphQL, WebSockets
- **Database:** PostgreSQL, Supabase, RLS, multi-tenancy
- **DevOps:** Docker, CI/CD, Vercel, Railway, Render, AWS
- **Security:** OWASP Top 10, OAuth 2.0, RBAC, rate limiting, input validation
- **Design:** Design tokens, accessibility (WCAG), motion, multi-brand theming

### Project Deployment Map
```
PRIMARY:   Help Center (help-center-system.html upgrades and new builds)
SECONDARY: Business Strategy Team (client web build recommendations)
           Limitless Vision Studio (AI/Software & Web Dev category)
           Any future H.E.L.P. platform builds
```

### LVS Category Activation
- 🤖 AI, Software & Web Development
- 🛤️ Engineering & Infrastructure
- 🔧 Inventions (new product builds)

### Skills Integration
Add to SKILLS_BY_PROJECT in Layer 5:
```javascript
'help-center-admin': [
  { name: 'IT & Tech', icon: '💻', skill: 'it-technology-platform' },
  { name: 'Web Architect', icon: '🏗️', skill: 'full-stack-web-architect' },  // NEW
  { name: 'Customer Success', icon: '🤝', skill: 'customer-success-platform' },
],
'business-strategy': [
  // ... existing skills ...
  { name: 'Web Architect', icon: '🏗️', skill: 'full-stack-web-architect' },  // NEW
]
```

---

## CLAUDE CODE IMPLEMENTATION CHECKLIST

```
PHASE 1 — PROJECT NAVIGATOR (Start here)
□ Add "AI Projects" tab to existing navigation
□ Build 7 project cards with correct colors and descriptions
□ Add PROJECTS registry object with Claude project URLs
□ Implement launchProject() function
□ Test all 7 cards open correct URLs

PHASE 2 — SMART ROUTING ENGINE
□ Add smart router HTML below the main header
□ Implement ROUTING_RULES with all keywords
□ Implement routeUser() function
□ Implement renderRouteResult() with confidence display
□ Test routing with sample queries from each project area

PHASE 3 — VISIONARY PROFILE
□ Create visionary_profiles collection in PocketBase admin
□ Add "My Profile" tab to navigation
□ Build profile form with all 10 fields
□ Implement saveVisionaryProfile() and loadVisionaryProfile()
□ Load and display profile on login/return visit

PHASE 4 — HANDOFF CARDS
□ Implement showHandoffSuggestion() function
□ Define all HANDOFF_RULES for each project
□ Trigger handoff suggestions after project launch
□ Style handoff modal consistently with H.E.L.P. design

PHASE 5 — SKILLS DISPLAY
□ Add SKILLS_BY_PROJECT mapping
□ Implement renderSkillBadges() function
□ Add skill badges to each project card
□ Add skills count to project header displays

PHASE 6 — FINAL INTEGRATION
□ Create project_sessions collection in PocketBase
□ Log all project launches to project_sessions
□ Add analytics view showing which projects are most used
□ Test complete user journey: router → project → handoff
□ Update CLAUDE_PROJECT_CONTEXT.md with completed modules
```

---

## SKILL #24 IN THE HELP CENTER SKILLS DISPLAY

Add to `SKILLS_BY_PROJECT` for Help Center and Business Strategy:

```javascript
// Add to 'business-strategy' skills array:
{ name: 'Web Architect', icon: '🏗️', skill: 'full-stack-web-architect' },

// Add to Help Center admin display:
{ name: 'Web Architect', icon: '🏗️', skill: 'full-stack-web-architect' },
```

---

## IMPORTANT NOTES FOR CLAUDE CODE

1. **Single-file architecture** — All code goes into `help-center-system.html`. Do not create separate JS or CSS files.

2. **Preserve existing functionality** — The CRM, business library, my hub, and all existing tabs must continue working exactly as before.

3. **Match existing styles** — Use the CSS variables already defined in the file (`--navy`, `--gold`, `--blue`, etc.). Check what variables exist before adding new ones.

4. **PocketBase connection** — The backend is at `187.124.146.184:8090`. Always use try/catch around API calls and fail silently rather than breaking the UI.

5. **Claude Project URLs** — Replace all `'https://claude.ai/project/[id]'` placeholders — all now filled in. Claude project URLs once provided.

6. **Password protection** — The existing password system must remain intact. The new modules should respect the existing auth state.

7. **Mobile responsive** — All new sections should work on mobile. Use `minmax()` in CSS grid and `flex-wrap:wrap` on flex containers.

8. **Test incrementally** — Add one layer at a time and verify it works before moving to the next layer.

---

*H.E.L.P. Center Integration Architecture v1.0*
*"You can do anything... except be GOD."*
