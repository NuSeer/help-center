    // ── MULTI-TENANT PREFIX LAYER (must run before any localStorage access) ───
    // Single-tenant by default. Deploy a separate tenant by copying this HTML
    // into a subdirectory and adding `<meta name="tenant" content="toby">` in
    // the <head>. Every localStorage and PB-store key transparently gets the
    // tenant prefix. Public lookup keys (portal:, cal:, share:, booking:) stay
    // un-prefixed so PB hooks can find them by token.
    // Detect tenant from URL ?tenant=<slug> (preferred) → meta tag → empty (owner)
    const TENANT = (function(){
      try {
        const m = (location.search || '').match(/[?&]tenant=([^&#]+)/);
        if (m) return decodeURIComponent(m[1]).toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 32);
      } catch(e){}
      const meta = document.querySelector('meta[name="tenant"]');
      return (meta && meta.content && meta.content.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 32)) || '';
    })();
    const TENANT_PREFIX = TENANT ? (TENANT + ':') : '';
    const _UNPREFIXED_RE = /^(portal:|cal:|share:|booking:|admin:)/;
    // Override Storage.prototype directly — instance-level Object.defineProperty
    // can fail silently on Safari/Firefox. Restrict to window.localStorage only
    // (sessionStorage stays untouched) by checking `this`.
    window._tenantOverrideActive = false;
    (function installTenantOverride(){
      if (!TENANT_PREFIX) return;
      try {
        const SP = Object.getPrototypeOf(window.localStorage);
        const ogGet    = SP.getItem;
        const ogSet    = SP.setItem;
        const ogRemove = SP.removeItem;
        const realKey = k => (typeof k === 'string' && !_UNPREFIXED_RE.test(k) ? TENANT_PREFIX + k : k);
        SP.getItem = function(k){
          if (this === window.localStorage) return ogGet.call(this, realKey(k));
          return ogGet.call(this, k);
        };
        SP.setItem = function(k, v){
          if (this === window.localStorage) return ogSet.call(this, realKey(k), v);
          return ogSet.call(this, k, v);
        };
        SP.removeItem = function(k){
          if (this === window.localStorage) return ogRemove.call(this, realKey(k));
          return ogRemove.call(this, k);
        };
        // Verify the override took effect by writing/reading a probe value
        const probeKey = '__tenant_probe__';
        const probeVal = 'ok-' + Date.now();
        window.localStorage.setItem(probeKey, probeVal);
        const raw = ogGet.call(window.localStorage, TENANT_PREFIX + probeKey);
        if (raw === probeVal) {
          window._tenantOverrideActive = true;
          ogGet.call(window.localStorage, TENANT_PREFIX + probeKey); // no-op cleanup
          window.localStorage.removeItem(probeKey);
        }
      } catch (err) {
        console.error('Tenant override install failed:', err);
      }
    })();
    // Visible tenant banner so the owner can tell at a glance which copy
    // they're looking at (especially when previewing a tenant in a new tab).
    if (TENANT) {
      window.addEventListener('DOMContentLoaded', () => {
        const banner = document.createElement('div');
        banner.id = 'tenant-banner';
        banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99999;background:linear-gradient(90deg,#7C3AED,#3B82F6);color:#fff;font-size:12px;font-weight:700;letter-spacing:0.4px;text-align:center;padding:6px 12px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.15)';
        banner.innerHTML = 'TENANT: ' + TENANT.toUpperCase() + ' · Data isolated · ' +
          (window._tenantOverrideActive
            ? '✅ Override active'
            : '⚠️ Override FAILED — data may leak from owner copy. Refresh or use a different browser.');
        document.body.appendChild(banner);
        // Push the page below the banner
        document.body.style.paddingTop = '32px';
      });
    }
    // ── TENANT GATING ─────────────────────────────────────────────────────────
    // In a tenant copy (?tenant=slug) the workspace is restricted to the SaaS
    // feature set. Owner-only tools AND the owner's personal AI projects stay
    // hidden. Data is already isolated by the prefix layer; this hides the UI
    // surface so a tenant only sees what they're meant to. (Client-side gating —
    // the real data wall is the PB collection rules; this is the visibility wall.)
    const TENANT_ALLOWED_PAGES = ['dashboard','my-ideas','calendar','revenue','clients','client-portal','booking','messages','strategy','pricing','ai-projects','settings','my-profile'];
    function _tenantPageAllowed(pageId){ return !TENANT || TENANT_ALLOWED_PAGES.indexOf(pageId) !== -1; }
    function _applyTenantNavGating(){
      if (!TENANT) return;
      try {
        document.querySelectorAll('.sidebar .nav-link').forEach(link => {
          const oc = link.getAttribute('onclick') || '';
          if (/openAssistantChat\(/.test(oc)) return;  // keep the AI Assistant launcher
          const m = oc.match(/showPage\(\s*['"]([^'"]+)['"]/);
          const pid = m ? m[1] : null;
          if (!pid || !_tenantPageAllowed(pid)) link.style.display = 'none';
        });
        document.querySelectorAll('.sidebar .nav-section').forEach(sec => {
          const links = sec.querySelectorAll('.nav-link');
          const anyVisible = Array.prototype.some.call(links, l => l.style.display !== 'none');
          if (links.length && !anyVisible) sec.style.display = 'none';
        });
      } catch(_){}
    }
    if (TENANT) window.addEventListener('DOMContentLoaded', _applyTenantNavGating);

    // In a tenant copy, the Settings page swaps the "powered by H.E.L.P. — no key
    // required" message for the bring-your-own-key note, and hides the PocketBase
    // backend card (their backend is auto-wired, not self-configured).
    function _applyTenantAiSettingsCopy(){
      if (!TENANT) return;
      try {
        const ownerNote = document.getElementById('ai-owner-note'); if (ownerNote) ownerNote.style.display = 'none';
        const ownerBanner = document.getElementById('ai-owner-banner'); if (ownerBanner) ownerBanner.style.display = 'none';
        const tenantNote = document.getElementById('ai-tenant-note'); if (tenantNote) tenantNote.style.display = 'block';
        const pbCard = document.getElementById('pb-backend-card'); if (pbCard) pbCard.style.display = 'none';
      } catch(_){}
    }

    function _pbKey(key) {
      if (!TENANT_PREFIX || _UNPREFIXED_RE.test(key)) return key;
      return TENANT_PREFIX + key;
    }
    function _pbStripPrefix(key) {
      return TENANT_PREFIX && key.startsWith(TENANT_PREFIX) ? key.slice(TENANT_PREFIX.length) : key;
    }

    // ── SEED DATA ──────────────────────────────────────────────────────────────
    const SEED_CLIENTS = [
      { id:'client-001', name:'Lester & Vernest Rice', businessName:'CASC Counseling', email:'', phone:'', service:'Website Design', status:'Completed', startDate:'2024-01-01', completedDate:'2024-12-31', price:250, paid:true, paidDate:'2024-12-31', portalToken:'casc-rice-portal-001', deliverables:[{id:'d1',name:'Completed Website',description:'Full CASC Counseling website — designed, built, and delivered',url:'',dateAdded:'2024-12-31'}], messages:[], intakeForm:{completed:true,answers:{}}, notes:'CASC Counseling website — completed and delivered.', projectStatus:100, invoiceNumber:'INV-001' },
      { id:'client-002', name:"La'Anta Watford", businessName:'Watford ENT Apparel', email:'watford.ent@gmail.com', phone:'', service:'Ecommerce Website', status:'Completed', startDate:'2024-01-01', completedDate:'2024-12-31', price:250, paid:true, paidDate:'2024-12-31', portalToken:'watford-ent-portal-002', deliverables:[{id:'d2',name:'Completed Ecommerce Website',description:'Full apparel ecommerce website — designed, built, and delivered',url:'',dateAdded:'2024-12-31'}], messages:[], intakeForm:{completed:true,answers:{}}, notes:'Apparel ecommerce site for Watford ENT — completed.', projectStatus:100, invoiceNumber:'INV-002' },
      { id:'client-003', name:'Tikiah Maddox', businessName:'Genealogy Business', email:'', phone:'', service:'Business Dashboard & Page', status:'Completed', startDate:'2024-01-01', completedDate:'2024-12-31', price:250, paid:true, paidDate:'2024-12-31', portalToken:'maddox-genealogy-portal-003', deliverables:[{id:'d3',name:'Completed Dashboard & Business Page',description:'Full genealogy business dashboard and web page — designed, built, and delivered',url:'',dateAdded:'2024-12-31'}], messages:[], intakeForm:{completed:true,answers:{}}, notes:'Genealogy business dashboard and page — completed.', projectStatus:100, invoiceNumber:'INV-003' }
    ];
    const SEED_IDEAS = [
      { id:'idea-001', name:'H.E.L.P. Center', stage:'Launched', icon:'🤝', tagline:'Helping Everyday Leaders Prosper', description:'A complete business consulting and coaching system offering 6 pathways.', businessPlan:'<h3>Services</h3><ul><li>Consulting Sessions — $75/hour</li><li>Website Design & Development — $250+</li><li>Business Formation & Setup</li><li>Program Development</li><li>Dashboard & System Builds</li></ul>', brandGuide:'<h3>Brand</h3><p>Colors: Navy #0F172A, Blue var(--brand-primary), Green #10B981, Orange #F59E0B. Tagline: Helping Everyday Leaders Prosper</p>', financials:{startupCost:0,projectedRevenue:'$2,000-$5,000/month',notes:'Services-based. Low overhead.'}, notes:'Currently active. Expand into digital courses and membership community.', dateCreated:'2024-01-01', lastUpdated:'2025-04-01' },
      { id:'idea-002', name:'The Green Plate', stage:'Planning', icon:'🥗', tagline:'Healthy Starts Here.', description:'Modern, casual sit-down dining restaurant near gyms and office parks. General healthy eating with specialty diet options.', businessPlan:'<h3>Concept</h3><p>Sit-down casual with quick service. Customizable bowls, wraps, smoothies, kids menu. Urban/suburban near gyms.</p>', brandGuide:'<h3>Brand Identity</h3><p>Colors: Dark Green #1E4620, Leaf Green #5DAE49, Peach #F9D5A7. Vibe: Modern + vibrant with earthy accents.</p>', financials:{startupCost:50000,projectedRevenue:'$20,000-$50,000/month',notes:'Lease $20k, Equipment $10k, Marketing $5k'}, notes:'Start with one location near gyms/office parks. Year 2: food truck or second location.', dateCreated:'2024-06-01', lastUpdated:'2025-04-01' },
      { id:'idea-003', name:'Bern Baby Burn', stage:'Planning', icon:'🌶️', tagline:'Sweet. Spicy. Southern.', description:'Black-owned specialty seasoning and sauce brand named after grandmother Bernice.', businessPlan:'<h3>Product Line</h3><ul><li>Southern-Style French Fry Seasoning</li><li>Spicy Cajun Seasoning</li><li>Herb Garden Seasoning</li><li>Peach Barbecue Sauce — Original & Vegan</li></ul>', brandGuide:'<h3>Brand Story</h3><p>Named after Bernice ("Bern") — a Southern woman who loved to cook. Black-owned identity is central.</p>', financials:{startupCost:2000,projectedRevenue:'$1,000-$5,000/month',notes:'Start small batch. Reinvest profits. Farmers market first.'}, notes:'Start with 3-4 flagship products. Test at farmers markets.', dateCreated:'2024-08-01', lastUpdated:'2025-04-01' },
      { id:'idea-004', name:'Mobile Herbal Apothecary', stage:'Planning', icon:'🌿', tagline:'Bringing Nature to Your Neighborhood', description:'Mobile herbal apothecary serving teas, tinctures, salves at farmers markets and community events.', businessPlan:'<h3>120-Day Launch Plan</h3><p>Month 1: Planning, legal setup, herb sourcing. Month 2: Product development & branding. Month 3: Marketing & soft launch. Month 4: Official launch.</p>', brandGuide:'<h3>Branding</h3><p>Earthy, organic, community-rooted. Amber glass bottles, kraft paper labels. Authentic and approachable.</p>', financials:{startupCost:5000,projectedRevenue:'$500-$3,000/month',notes:'Start lean. Farmers markets + online. Scale as revenue grows.'}, notes:'Slow rollout preferred. Product development is priority.', dateCreated:'2024-09-01', lastUpdated:'2025-04-01' },
      { id:'idea-005', name:'Holding Company / Business Structure', stage:'Idea', icon:'🏛️', tagline:'The Unseen Foundation', description:'Silent holding company as parent entity over all businesses. Privacy-focused. Protects personal assets.', businessPlan:'<h3>Structure</h3><p>Parent Entity: Silent Holding LLC or Trust. Holds ownership of all subsidiary businesses without public exposure.</p><p>Jurisdiction options: Wyoming (strong privacy), Delaware, or offshore.</p>', brandGuide:'<h3>Privacy Notes</h3><p>This entity operates silently. No public branding. Its purpose is control and protection, not visibility.</p>', financials:{startupCost:1000,projectedRevenue:'N/A — holding structure',notes:'Wyoming LLC ~$100. Registered agent ~$50/year.'}, notes:'Research complete. Need attorney consultation before formation. Wyoming preferred.', dateCreated:'2025-01-01', lastUpdated:'2025-04-01' }
    ];
    const SEED_REVENUE = [
      { id:'rev-001', clientId:'client-001', clientName:'Lester & Vernest Rice', amount:250, date:'2024-12-31', status:'Paid', serviceType:'Website Design', invoiceNumber:'INV-001' },
      { id:'rev-002', clientId:'client-002', clientName:"La'Anta Watford", amount:250, date:'2024-12-31', status:'Paid', serviceType:'Ecommerce Website', invoiceNumber:'INV-002' },
      { id:'rev-003', clientId:'client-003', clientName:'Tikiah Maddox', amount:250, date:'2024-12-31', status:'Paid', serviceType:'Business Dashboard & Page', invoiceNumber:'INV-003' }
    ];
    // Default settings per tenant. Non-owner tenants start blank and use a
    // placeholder password until the owner sets them up via the Tenants panel.
    const DEFAULT_SETTINGS = TENANT
      ? {
          name: TENANT.charAt(0).toUpperCase() + TENANT.slice(1),
          email: '', businessName: 'My Business', tagline: '',
          password: 'changeme', phone: '', address: ''
        }
      : {
          name:'Joy Watford', email:'joy@thehelpctr.com', businessName:'H.E.L.P. Center',
          tagline:'Helping Everyday Leaders Prosper', password:'help2024',
          phone:'', address:''
        };

    // ── DATA LAYER ─────────────────────────────────────────────────────────────
    function getData(key) { return JSON.parse(localStorage.getItem(key)) || []; }
    function setData(key, val) {
      localStorage.setItem(key, JSON.stringify(val));
      _pbStampLocal(key); // mark local-newer for the conflict resolver
      pbWrite(key, val); // fire-and-forget PocketBase sync
      // When client-facing data changes, refresh per-client portal snapshots.
      if (key === 'clients' || key === 'settings' || key === 'stripeSettings') {
        if (typeof schedulePortalSync === 'function') schedulePortalSync();
      }
      // Mirror calendar events to the public iCal feed key so subscribers
      // (Google / Apple / Outlook) see new events within ~minutes.
      if (key === 'calEvents') {
        const tok = _getCalendarToken();
        if (tok) pbWrite('cal:' + tok, val);
      }
    }
    function generateId() { return Date.now().toString(36) + Math.random().toString(36).substr(2); }
    function generateToken() { return Math.random().toString(36).substr(2,9) + '-' + Date.now().toString(36); }

    // ── REPORTS PAGE AUTOSAVE ──────────────────────────────────────────────
    // Save every form field + preview textarea on the Reports page so the
    // user can navigate away and come back without losing in-progress docs.
    const _REPORT_DRAFT_FIELDS = [
      'rp-client','rp-contact','rp-service','rp-desc','rp-timeline','rp-deposit','rp-notes','report-preview',
      'ct-type','ct-client','ct-org','ct-service','ct-price','ct-deposit','ct-start','ct-end','ct-revisions','contract-preview',
      'rcpt-client','rcpt-invnum','rcpt-amount','rcpt-service','rcpt-date','rcpt-paid','rcpt-method','receipt-preview',
      'bp-bizname','bp-owner','bp-industry','bp-mission','bp-market','bp-services','bp-revenue','bp-costs','bp-advantage','bizplan-preview',
      'pp-name','pp-director','pp-participants','pp-goals','pp-curriculum','pp-budget','pp-start','pp-partners','program-preview'
    ];
    let _reportSaveTimer = null;
    function _autoSaveReportDrafts() {
      clearTimeout(_reportSaveTimer);
      _reportSaveTimer = setTimeout(() => {
        const drafts = {};
        _REPORT_DRAFT_FIELDS.forEach(id => {
          const el = document.getElementById(id);
          if (el && (el.value || '').length > 0) drafts[id] = el.value;
        });
        drafts._savedAt = new Date().toISOString();
        localStorage.setItem('reportDrafts', JSON.stringify(drafts));
      }, 600);
    }
    function _loadReportDrafts() {
      const drafts = JSON.parse(localStorage.getItem('reportDrafts') || 'null');
      if (!drafts) return;
      _REPORT_DRAFT_FIELDS.forEach(id => {
        const el = document.getElementById(id);
        if (el && drafts[id] != null && (el.value == null || el.value === '')) el.value = drafts[id];
      });
    }
    function initReportsAutoSave() {
      _loadReportDrafts();
      _REPORT_DRAFT_FIELDS.forEach(id => {
        const el = document.getElementById(id);
        if (!el || el.dataset._autosaveBound) return;
        el.addEventListener('input', _autoSaveReportDrafts);
        el.addEventListener('change', _autoSaveReportDrafts);
        el.dataset._autosaveBound = '1';
      });
    }

    // ── LEGACY DATA MIGRATIONS (run once on every page load) ──────────────────
    (function migrateLegacySettings(){
      try {
        const s = JSON.parse(localStorage.getItem('settings') || 'null');
        if (!s) return;
        let changed = false;
        // Migrate the old joy@helpcenter.com placeholder to the live domain.
        if (s.email && /helpcenter\.com$/i.test(s.email) && !/thehelpctr\.com$/i.test(s.email)) {
          s.email = s.email.replace(/helpcenter\.com$/i, 'thehelpctr.com');
          changed = true;
        }
        if (changed) {
          localStorage.setItem('settings', JSON.stringify(s));
          if (typeof pbWrite === 'function') pbWrite('settings', s);
        }
      } catch (e) { /* ignore */ }
    })();

    // ── CALENDAR SUBSCRIPTION ──────────────────────────────────────────────────
    function _getCalendarToken() {
      const s = JSON.parse(localStorage.getItem('settings') || '{}');
      return s.calendarToken || null;
    }
    function _ensureCalendarToken() {
      const s = JSON.parse(localStorage.getItem('settings') || '{}');
      if (!s.calendarToken) {
        s.calendarToken = (Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10)).slice(0, 16);
        localStorage.setItem('settings', JSON.stringify(s));
        pbWrite('settings', s);
      }
      return s.calendarToken;
    }
    function _calendarUrl(token) {
      const s = JSON.parse(localStorage.getItem('settings') || '{}');
      const base = (s.calendarBaseUrl || 'http://187.124.146.184/pb').replace(/\/$/, '');
      return base + '/api/calendar/' + token + '.ics';
    }
    function loadCalendarSubscriptionUI() {
      const input = document.getElementById('cal-sub-url');
      if (!input) return;
      const tok = _ensureCalendarToken();
      input.value = _calendarUrl(tok);
      // Mirror current events to the feed key in case this is the first time.
      const events = JSON.parse(localStorage.getItem('calEvents') || '[]');
      pbWrite('cal:' + tok, events);
    }
    function copyCalendarUrl() {
      const input = document.getElementById('cal-sub-url');
      if (!input || !input.value) return;
      navigator.clipboard.writeText(input.value).then(() => {
        const s = document.getElementById('cal-sub-status');
        if (s) { s.textContent = 'Copied to clipboard'; s.style.color = 'var(--brand-secondary)'; setTimeout(() => s.textContent = '', 2200); }
      });
    }
    function regenerateCalendarToken() {
      if (!confirm('Rotate your calendar URL? Anyone subscribed to the old URL will stop seeing updates.')) return;
      const s = JSON.parse(localStorage.getItem('settings') || '{}');
      const oldTok = s.calendarToken;
      s.calendarToken = (Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10)).slice(0, 16);
      localStorage.setItem('settings', JSON.stringify(s));
      pbWrite('settings', s);
      // Push current events to the new key. Old key remains until owner clears
      // the store record manually (deliberate — gives time to switch subscriptions).
      const events = JSON.parse(localStorage.getItem('calEvents') || '[]');
      pbWrite('cal:' + s.calendarToken, events);
      const input = document.getElementById('cal-sub-url');
      if (input) input.value = _calendarUrl(s.calendarToken);
      const status = document.getElementById('cal-sub-status');
      if (status) { status.textContent = 'New URL generated. Re-subscribe in your calendar app.'; status.style.color = 'var(--brand-accent)'; setTimeout(() => status.textContent = '', 6000); }
    }

    // ── POCKETBASE INTEGRATION ──────────────────────────────────────────────────
    // PocketBase is a self-hosted Go backend you can run on any VPS.
    // Setup: download pocketbase, run it, create an "store" collection with
    //   fields: key (Text, unique) and value (JSON). Enable API access.
    // Then enter your PocketBase URL and admin credentials in Settings → Backend.

    function pbSettings() {
      const s = JSON.parse(localStorage.getItem('settings')) || {};
      return {
        url: (s.pbUrl||'').replace(/\/$/,''),
        email: s.pbEmail||'',
        password: s.pbPassword||'',
        enabled: !!(s.pbEnabled && s.pbUrl),
        // For tenants: 'user' (auth as PB user → collection rules enforce isolation)
        // For owner:   'admin' (auth as PB admin → bypass rules, see all data)
        authMode: s.pbAuthMode || (TENANT ? 'user' : 'admin')
      };
    }

    async function pbAuth() {
      const pb = pbSettings();
      if (!pb.enabled) return null;
      const cached = localStorage.getItem('pb_token');
      if (cached) return cached;
      // Two auth modes:
      //   - 'user' → /api/collections/users/auth-with-password (per-tenant accounts)
      //   - 'admin' (default for owner / legacy) → /api/admins/auth-with-password
      // Tenant copies set authMode='user' in their settings; owner stays admin
      // because she has full role=owner via her user record AND the legacy
      // admin login. Admin auth bypasses collection rules entirely.
      const authMode = pb.authMode === 'user' ? 'user' : 'admin';
      const endpoint = authMode === 'user'
        ? '/api/collections/users/auth-with-password'
        : '/api/admins/auth-with-password';
      try {
        const r = await fetch(pb.url + endpoint, {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({identity: pb.email, password: pb.password})
        });
        if (!r.ok) return null;
        const d = await r.json();
        localStorage.setItem('pb_token', d.token);
        // Cache the auth record so we can read tenantSlug/tenantRole later
        if (d.record) localStorage.setItem('pb_user', JSON.stringify(d.record));
        if (d.admin)  localStorage.setItem('pb_admin', JSON.stringify(d.admin));
        return d.token;
      } catch(e) { return null; }
    }

    async function pbPull() {
      // On login: pull all stored records from PocketBase into localStorage.
      // For tenant copies, only pull records whose key starts with this
      // tenant's prefix — don't drag in another tenant's data.
      const pb = pbSettings();
      if (!pb.enabled) return;
      const token = await pbAuth();
      if (!token) { showToast('PocketBase: auth failed — using local data', 'warn'); return; }
      // Push any pending local changes BEFORE pulling, otherwise the pull
      // would overwrite unsynced edits with stale server data.
      await pbDrainQueue();
      try {
        let url = pb.url + '/api/collections/store/records?perPage=500';
        if (TENANT_PREFIX) url += '&filter=' + encodeURIComponent(`key~"${TENANT_PREFIX}"`);
        const r = await fetch(url, { headers: {'Authorization': token} });
        if (r.status === 401) { localStorage.removeItem('pb_token'); return; }
        if (!r.ok) return;
        const {items=[]} = await r.json();
        items.forEach(item => {
          if (!item.key || item.value === undefined) return;
          const localKey = _pbStripPrefix(item.key);
          // For the 'settings' key: MERGE remote into local rather than
          // replace, so device-local fields like pbUrl/pbEmail/pbPassword
          // (per-device PB credentials) and pbAuthMode aren't wiped when
          // the cloud copy doesn't include them.
          if (localKey === 'settings' && typeof item.value === 'object' && item.value !== null) {
            const local = (function(){ try { return JSON.parse(localStorage.getItem('settings')) || {}; } catch(e) { return {}; } })();
            const protectedKeys = ['pbUrl','pbEmail','pbPassword','pbEnabled','pbAuthMode'];
            const merged = {...item.value};
            protectedKeys.forEach(k => { if (local[k] !== undefined && local[k] !== '') merged[k] = local[k]; });
            // Also keep local password if remote one is empty
            if (!merged.password && local.password) merged.password = local.password;
            localStorage.setItem(localKey, JSON.stringify(merged));
            return;
          }
          const v = typeof item.value === 'string' ? item.value : JSON.stringify(item.value);
          localStorage.setItem(localKey, v);
        });
        showToast('Synced from PocketBase', 'success');
      } catch(e) {}
    }

    // Build a per-client snapshot and push it to PocketBase under key=portal:{token}.
    // The public route GET /api/portal/:token reads this back so the CLIENT'S browser
    // (which has no localStorage data of its own) can render the portal.
    function pbPushPortalSnapshot(client) {
      if (!client || !client.portalToken) return;
      const docs = (typeof getDocsForClient === 'function') ? getDocsForClient(client.id) : [];
      const settings = JSON.parse(localStorage.getItem('settings') || '{}');
      const stripeCfg = (function(){ try { return JSON.parse(localStorage.getItem('stripeSettings')||'{}'); } catch(e){ return {}; } })();
      const snapshot = {
        client: {
          id: client.id, name: client.name, businessName: client.businessName,
          service: client.service, status: client.status, projectStatus: client.projectStatus,
          invoiceNumber: client.invoiceNumber, price: client.price, paid: client.paid,
          email: client.email, phone: client.phone || '',
          messages: client.messages || [],
          deliverables: client.deliverables || []
        },
        documents: docs,
        branding: {
          businessName: settings.businessName || 'H.E.L.P. Center',
          ownerName: settings.name || '',
          ownerEmail: settings.email || '',
          tenant: TENANT || ''
        },
        stripe: {
          pubKey: stripeCfg.pubKey || '',
          proxyUrl: stripeCfg.proxyUrl || '',
          siteTag: stripeCfg.siteTag || 'HELPCENTER',
          currency: stripeCfg.currency || 'usd'
        },
        booking: (function(){
          try {
            const bs = JSON.parse(localStorage.getItem('bookingSettings')||'{}');
            if (!bs || !bs.bookingToken || !bs.enabled) return null;
            const base = (settings.portalBaseUrl || window.location.href.split('#')[0]).replace(/\/$/, '');
            return {
              enabled: true,
              token: bs.bookingToken,
              url: (((window.location.origin && /^https?:/.test(window.location.origin)) ? window.location.origin : 'https://thehelpctr.com') + '/booking.html?u=' + bs.bookingToken),
              label: bs.label || 'Schedule a Call'
            };
          } catch(e) { return null; }
        })(),
        feedback: (function(){
          // Carry forward existing feedback so it survives snapshot refreshes
          const all = JSON.parse(localStorage.getItem('clientFeedback')||'[]');
          return all.filter(f => f.clientId === client.id);
        })(),
        snapshotAt: new Date().toISOString()
      };
      pbWrite('portal:' + client.portalToken, snapshot);
    }

    // Push snapshots for ALL clients (used after bulk operations, and at idle).
    function pbPushAllPortalSnapshots() {
      const clients = getData('clients') || [];
      clients.forEach(c => { try { pbPushPortalSnapshot(c); } catch(e){} });
    }

    // Pending writes that couldn't reach PocketBase (offline, auth fail, tab
    // suspended mid-request). Drained on next successful auth so changes made
    // on mobile aren't lost when iOS kills the tab.
    function pbQueueAdd(key, val) {
      try {
        const q = JSON.parse(localStorage.getItem('pb_queue')) || [];
        // Only the latest value per key matters
        const filtered = q.filter(item => item.key !== key);
        filtered.push({key, val});
        localStorage.setItem('pb_queue', JSON.stringify(filtered));
      } catch(e) {}
    }

    async function pbDrainQueue() {
      let q;
      try { q = JSON.parse(localStorage.getItem('pb_queue')) || []; } catch(e) { q = []; }
      if (!q.length) return;
      const remaining = [];
      for (const item of q) {
        const ok = await pbWriteOnce(item.key, item.val);
        if (!ok) remaining.push(item);
      }
      localStorage.setItem('pb_queue', JSON.stringify(remaining));
    }

    // Single write attempt — returns true on success, false on failure.
    async function pbWriteOnce(key, val) {
      const pb = pbSettings();
      if (!pb.enabled) return false;
      const token = await pbAuth();
      if (!token) return false;
      const storeKey = _pbKey(key);  // tenant-prefixed
      // tenantSlug field on every record for collection-rule isolation. Owner
      // writes as "" (or matches whatever tenant key prefix the data was for);
      // tenant writes ALWAYS use their tenant slug.
      const tenantSlug = TENANT || '';
      try {
        const check = await fetch(`${pb.url}/api/collections/store/records?filter=(key='${storeKey}')&perPage=1`, {
          headers: {'Authorization': token}
        });
        if (check.status === 401) { localStorage.removeItem('pb_token'); return false; }
        if (!check.ok) return false;
        const {items=[]} = await check.json();
        const body = JSON.stringify({key: storeKey, value: val, tenantSlug});
        let res;
        if (items.length) {
          res = await fetch(`${pb.url}/api/collections/store/records/${items[0].id}`, {
            method:'PATCH', headers:{'Content-Type':'application/json','Authorization':token}, body
          });
        } else {
          res = await fetch(`${pb.url}/api/collections/store/records`, {
            method:'POST', headers:{'Content-Type':'application/json','Authorization':token}, body
          });
        }
        if (res.status === 401) { localStorage.removeItem('pb_token'); return false; }
        return res.ok;
      } catch(e) { return false; }
    }

    async function pbWrite(key, val) {
      const pb = pbSettings();
      if (!pb.enabled) return;
      const ok = await pbWriteOnce(key, val);
      if (!ok) pbQueueAdd(key, val);
    }

    // ── Sync v2 (B + i): timestamps + background sync + newer-wins ──────────
    // Every key in this list is what the cross-device sync considers part of
    // the user's "data" — pulled on login, pushed on write, and resolved by
    // timestamp during background sync. Add here when introducing a new key
    // that needs to follow the user across devices.
    const TRACKED_KEYS = [
      'clients','ideas','revenue','settings','activity','events','calEvents',
      'notes','sentEmails','businessFile','personalFiles','clientDocuments',
      'wbBuilds','vibeProjects','bookingSettings','stripeSettings','aiProjects',
      'myProfile','reportDrafts','clientFeedback'
    ];

    // pb_localTs: { [key]: ISO timestamp of last local write }. Used to decide
    // whether local or remote is newer during pbSyncAll.
    function _pbStampLocal(key) {
      try {
        const m = JSON.parse(localStorage.getItem('pb_localTs')) || {};
        m[key] = new Date().toISOString();
        localStorage.setItem('pb_localTs', JSON.stringify(m));
      } catch(e) {}
    }
    function _pbGetLocalTs(key) {
      try {
        const m = JSON.parse(localStorage.getItem('pb_localTs')) || {};
        return m[key] || null;
      } catch(e) { return null; }
    }

    // Manual full push (used by Settings "Push all to PocketBase" button) —
    // now iterates every tracked key, not just the legacy six.
    async function pbPushAll() {
      for (const k of TRACKED_KEYS) {
        const raw = localStorage.getItem(k);
        if (raw === null) continue;
        let v; try { v = JSON.parse(raw); } catch(e) { continue; }
        if (v === null) continue;
        await pbWrite(k, v);
      }
      showToast('All data pushed to PocketBase', 'success');
    }

    // Bidirectional sync: for every tracked key, compare local timestamp vs
    // PB record's `updated` field. Newer wins (rule "i" from the design pitch).
    // Single-user app so true conflicts are rare; this just keeps two devices
    // in step without ever silently demoting fresher edits.
    let _pbSyncing = false;
    async function pbSyncAll(opts) {
      opts = opts || {};
      const pb = pbSettings();
      if (!pb.enabled) return false;
      if (_pbSyncing) return false; // overlap guard for interval + manual
      _pbSyncing = true;
      _pbSetStatus('syncing');
      try {
        const token = await pbAuth();
        if (!token) { _pbSetStatus('error', 'auth failed'); return false; }
        await pbDrainQueue();
        // Fetch all tenant records once
        let url = pb.url + '/api/collections/store/records?perPage=500';
        if (TENANT_PREFIX) url += '&filter=' + encodeURIComponent(`key~"${TENANT_PREFIX}"`);
        const r = await fetch(url, { headers: {'Authorization': token} });
        if (r.status === 401) { localStorage.removeItem('pb_token'); _pbSetStatus('error', 'auth lost'); return false; }
        if (!r.ok) { _pbSetStatus('error', 'fetch ' + r.status); return false; }
        const {items=[]} = await r.json();
        const remoteByKey = {};
        items.forEach(it => { if (it && it.key) remoteByKey[_pbStripPrefix(it.key)] = it; });

        // Walk the union of tracked keys + anything remote has that we don't
        const seen = new Set();
        TRACKED_KEYS.forEach(k => seen.add(k));
        Object.keys(remoteByKey).forEach(k => seen.add(k));

        for (const key of seen) {
          // Skip per-portal and per-calendar snapshot keys — those have their
          // own push paths and aren't owner-edited locally.
          if (key.startsWith('portal:') || key.startsWith('cal:')) continue;
          const remote = remoteByKey[key];
          const localRaw = localStorage.getItem(key);
          const localTs = _pbGetLocalTs(key);
          const remoteTs = remote && remote.updated ? remote.updated : null;

          if (!remote && localRaw !== null) {
            // Remote missing → push local up
            try { await pbWrite(key, JSON.parse(localRaw)); } catch(e) {}
            continue;
          }
          if (remote && localRaw === null) {
            // Local missing → pull remote down
            const v = typeof remote.value === 'string' ? remote.value : JSON.stringify(remote.value);
            localStorage.setItem(key, v);
            continue;
          }
          if (!remote && localRaw === null) continue;

          // Both sides exist — newer wins by timestamp (rule "i").
          // If we have no localTs (legacy data), treat remote as authoritative.
          const localMs = localTs ? Date.parse(localTs) : 0;
          const remoteMs = remoteTs ? Date.parse(remoteTs) : 0;
          if (localMs > remoteMs + 500) {
            // Local newer — push (with 500ms grace to avoid PB clock jitter)
            try { await pbWrite(key, JSON.parse(localRaw)); } catch(e) {}
          } else if (remoteMs > localMs) {
            // Remote newer — pull, with the same settings-merge protection
            // pbPull() uses so per-device PB creds aren't wiped.
            if (key === 'settings' && typeof remote.value === 'object' && remote.value !== null) {
              const local = (function(){ try { return JSON.parse(localRaw) || {}; } catch(e) { return {}; } })();
              const protectedKeys = ['pbUrl','pbEmail','pbPassword','pbEnabled','pbAuthMode'];
              const merged = {...remote.value};
              protectedKeys.forEach(k => { if (local[k] !== undefined && local[k] !== '') merged[k] = local[k]; });
              if (!merged.password && local.password) merged.password = local.password;
              localStorage.setItem(key, JSON.stringify(merged));
            } else {
              const v = typeof remote.value === 'string' ? remote.value : JSON.stringify(remote.value);
              localStorage.setItem(key, v);
            }
          }
        }
        localStorage.setItem('pb_lastSync', new Date().toISOString());
        _pbSetStatus('ok');
        if (opts.toast) showToast('Synced with PocketBase', 'success');
        return true;
      } catch(e) {
        _pbSetStatus('error', (e && e.message) || 'network');
        return false;
      } finally {
        _pbSyncing = false;
      }
    }

    // Background sync — runs every 30s while the app is open and a tab is
    // visible. Cleared on logout / refresh. Skips when the tab is hidden so
    // we don't burn cycles on a background tab.
    let _pbSyncTimer = null;
    function startBackgroundSync() {
      if (_pbSyncTimer) return;
      _pbSyncTimer = setInterval(() => {
        if (document.hidden) return;
        const pb = pbSettings();
        if (!pb.enabled) return;
        pbSyncAll();
      }, 30000);
    }
    function stopBackgroundSync() {
      if (_pbSyncTimer) { clearInterval(_pbSyncTimer); _pbSyncTimer = null; }
    }
    function syncNow() { pbSyncAll({ toast: true }).then(() => _pbRenderBadge()); }

    // ── Calendar reminders (Tier A — in-app) ───────────────────────────────
    // While the dashboard is open, every 30s we check calEvents and fire a
    // sound + browser notification + toast a set lead time before each timed
    // event. Background/app-closed push (Tier B) is a separate future build.
    let _reminderTimer = null;
    const _firedReminders = new Set();   // event ids already alerted this session
    let _remAudioCtx = null;
    // Audio needs a user gesture to be allowed to play later from a timer, so we
    // unlock a shared AudioContext on the first interaction after login.
    function _unlockReminderAudio() {
      try {
        const C = window.AudioContext || window.webkitAudioContext;
        if (!C) return;
        if (!_remAudioCtx) _remAudioCtx = new C();
        if (_remAudioCtx.state === 'suspended') _remAudioCtx.resume();
      } catch (e) {}
    }
    function _reminderLeadMin() {
      const s = JSON.parse(localStorage.getItem('settings') || '{}');
      const n = parseInt(s.reminderLeadMin, 10);
      return (isNaN(n) || n < 0) ? 15 : n;
    }
    function _playReminderChime() {
      try {
        _unlockReminderAudio();
        const ctx = _remAudioCtx;
        if (!ctx) return;
        const beep = (freq, start, dur) => {
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.type = 'sine'; o.frequency.value = freq;
          o.connect(g); g.connect(ctx.destination);
          g.gain.setValueAtTime(0.0001, ctx.currentTime + start);
          g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + start + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
          o.start(ctx.currentTime + start); o.stop(ctx.currentTime + start + dur + 0.02);
        };
        beep(880, 0, 0.18); beep(1175, 0.22, 0.28); // pleasant two-tone chime
      } catch (e) {}
    }
    function _fireReminder(ev, minsAway) {
      _playReminderChime();
      const when = minsAway <= 0 ? 'now' : ('in ' + minsAway + ' min');
      const timeLabel = ev.time ? (typeof formatTime === 'function' ? formatTime(ev.time) : ev.time) : '';
      const title = '⏰ ' + (ev.title || 'Event') + ' — ' + when;
      const body = timeLabel ? ('Scheduled for ' + timeLabel) : '';
      try {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(title, { body: body, tag: 'cal-' + ev.id });
        }
      } catch (e) {}
      if (typeof showToast === 'function') showToast(title + (body ? ' · ' + body : ''), 'info');
    }
    function checkReminders() {
      try {
        if (typeof getEvents !== 'function') return;
        const lead = _reminderLeadMin();
        const now = Date.now();
        getEvents().forEach(ev => {
          if (!ev || !ev.date || !ev.time || _firedReminders.has(ev.id)) return;
          const hhmm = (ev.time.length === 5 ? ev.time : '00:00');
          const t = new Date(ev.date + 'T' + hhmm + ':00').getTime();
          if (isNaN(t)) return;
          const minsAway = Math.round((t - now) / 60000);
          if (minsAway <= lead && minsAway >= -1) {   // within lead window, not long past
            _firedReminders.add(ev.id);
            _fireReminder(ev, Math.max(0, minsAway));
          }
        });
      } catch (e) {}
    }
    function startReminders() {
      if (_reminderTimer) return;
      try { if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission(); } catch (e) {}
      ['click', 'keydown', 'touchstart'].forEach(evt => document.addEventListener(evt, _unlockReminderAudio, { once: true }));
      checkReminders();
      _reminderTimer = setInterval(() => { if (!document.hidden) checkReminders(); }, 30000);
    }
    function stopReminders() {
      if (_reminderTimer) { clearInterval(_reminderTimer); _reminderTimer = null; }
    }

    // Sidebar badge: shows "Synced 2m ago" / "Syncing…" / "Sync error" with a
    // manual Sync now button. Re-rendered every 15s so the relative time stays
    // fresh without needing a sync to fire.
    let _pbStatus = 'idle';
    let _pbStatusDetail = '';
    function _pbSetStatus(s, detail) {
      _pbStatus = s;
      _pbStatusDetail = detail || '';
      _pbRenderBadge();
    }
    function _pbFmtAgo(iso) {
      if (!iso) return 'never';
      const ms = Date.now() - Date.parse(iso);
      if (isNaN(ms) || ms < 0) return 'just now';
      const s = Math.floor(ms/1000);
      if (s < 10) return 'just now';
      if (s < 60) return s + 's ago';
      const m = Math.floor(s/60);
      if (m < 60) return m + 'm ago';
      const h = Math.floor(m/60);
      if (h < 24) return h + 'h ago';
      return Math.floor(h/24) + 'd ago';
    }
    function _pbRenderBadge() {
      const el = document.getElementById('pb-sync-badge');
      if (!el) return;
      const pb = pbSettings();
      if (!pb.enabled) { el.style.display = 'none'; return; }
      el.style.display = 'block';
      const last = localStorage.getItem('pb_lastSync');
      let label, color;
      if (_pbStatus === 'syncing') { label = 'Syncing…'; color = '#F59E0B'; }
      else if (_pbStatus === 'error') { label = 'Sync error' + (_pbStatusDetail ? ' (' + _pbStatusDetail + ')' : ''); color = '#EF4444'; }
      else { label = 'Synced ' + _pbFmtAgo(last); color = '#10B981'; }
      el.querySelector('.pb-sync-dot').style.background = color;
      el.querySelector('.pb-sync-label').textContent = label;
    }
    // Keep relative time fresh even between sync runs
    setInterval(_pbRenderBadge, 15000);

    function showToast(msg, type='info') {
      let t = document.getElementById('help-toast');
      if (!t) { t = document.createElement('div'); t.id='help-toast'; document.body.appendChild(t); }
      t.textContent = msg;
      t.style.cssText = `position:fixed;bottom:90px;right:24px;z-index:9999;padding:10px 18px;border-radius:8px;font-size:14px;font-weight:600;color:#fff;opacity:1;transition:opacity 0.4s;background:${type==='success'?'#10B981':type==='warn'?'#F59E0B':'var(--brand-primary)'}`;
      clearTimeout(t._tid);
      t._tid = setTimeout(()=>{ t.style.opacity='0'; },3000);
    }

    // ── Undo toast ───────────────────────────────────────────────────────────
    // Pops a slate-dark toast at the bottom with the message and an Undo button.
    // The undoFn runs only if the user clicks Undo before the 6-second timeout.
    function showUndoToast(msg, undoFn, opts) {
      opts = opts || {};
      document.getElementById('help-undo-toast')?.remove();
      const t = document.createElement('div');
      t.id = 'help-undo-toast';
      t.style.cssText = 'position:fixed;bottom:90px;right:24px;z-index:9999;padding:10px 14px 10px 18px;border-radius:10px;font-size:14px;font-weight:500;color:#fff;background:#1E293B;box-shadow:0 8px 28px rgba(0,0,0,0.25);display:flex;align-items:center;gap:12px';
      const safe = String(msg||'').replace(/&/g,'&amp;').replace(/</g,'&lt;');
      t.innerHTML = `<span>${safe}</span><button type="button" id="undo-btn" style="padding:5px 12px;border-radius:6px;border:none;background:#F59E0B;color:#1F2937;font-weight:700;font-size:12px;cursor:pointer">Undo</button>`;
      document.body.appendChild(t);
      const ttl = opts.ttl || 6000;
      const cleanup = () => { if (t.parentNode) t.parentNode.removeChild(t); };
      const tid = setTimeout(cleanup, ttl);
      document.getElementById('undo-btn').addEventListener('click', () => {
        clearTimeout(tid);
        cleanup();
        try { undoFn && undoFn(); } catch(e) { console.error('undo failed', e); }
      });
    }

    // ── File upload helper (shared) ─────────────────────────────────────────
    // Uploads a single File to the backend /api/upload endpoint and returns
    // { name, url, mime, size }. Used by Personal Files, Notes, and Ideas.
    async function uploadAttachment(file, opts) {
      opts = opts || {};
      const clientId = opts.clientId || (typeof _pfId === 'function' ? _pfId() : 'attach-' + (Date.now()));
      const fd = new FormData();
      fd.append('clientId', clientId);
      fd.append('file', file);
      const r = await fetch(HC_BACKEND + '/api/upload?clientId=' + encodeURIComponent(clientId), { method:'POST', body: fd });
      if (!r.ok) throw new Error('Upload failed (HTTP ' + r.status + ')');
      const j = await r.json();
      return { name: file.name, url: j.url, mime: j.mime || file.type, size: file.size, uploadedAt: new Date().toISOString() };
    }

    // ── Emoji picker ────────────────────────────────────────────────────────
    // Curated grid of ~80 common emoji. Click an emoji to insert it into the
    // target textarea/input at the cursor position. Hidden when clicking away.
    const EMOJI_SET = [
      '😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰',
      '😘','😋','😎','🤩','🥳','🤔','🤨','😐','😑','😶','🙄','😏','😒','😔','😬','🤐',
      '😢','😭','😤','😠','😡','🤯','😳','🥺','😨','😰','😱','🤗','🤝','👍','👎','👏',
      '🙌','🙏','💪','✌️','👌','👋','✋','🤞','💯','✨','🌟','⭐','🔥','💥','⚡','🎉',
      '🎊','💼','📁','📂','📝','📄','📋','📊','📈','📉','💰','💵','💳','📅','⏰','⏳',
      '🔔','🔒','🔑','🚀','⚙️','💡','🎯','🏆','🎁','💬','❓','❗','⚠️','✅','❌','❤️'
    ];
    function openEmojiPicker(targetId, anchorEl) {
      document.getElementById('emoji-picker-pop')?.remove();
      const target = document.getElementById(targetId);
      if (!target) return;
      const pop = document.createElement('div');
      pop.id = 'emoji-picker-pop';
      pop.style.cssText = 'position:fixed;z-index:10000;background:#fff;border:1px solid #E2E8F0;border-radius:10px;box-shadow:0 12px 32px rgba(15,23,42,0.18);padding:8px;width:320px;max-height:240px;overflow-y:auto;display:grid;grid-template-columns:repeat(8,1fr);gap:2px';
      pop.innerHTML = EMOJI_SET.map(e =>
        `<button type="button" data-emoji="${e}" style="font-size:20px;padding:6px;background:none;border:none;border-radius:6px;cursor:pointer;transition:background .1s" onmouseenter="this.style.background='#F1F5F9'" onmouseleave="this.style.background='none'">${e}</button>`
      ).join('');
      // Anchor below the button that opened it; fallback to viewport center.
      let top = 100, left = 100;
      if (anchorEl) {
        const r = anchorEl.getBoundingClientRect();
        top = Math.min(r.bottom + 6, window.innerHeight - 250);
        left = Math.min(r.left, window.innerWidth - 332);
      }
      pop.style.top = Math.max(10, top) + 'px';
      pop.style.left = Math.max(10, left) + 'px';
      pop.addEventListener('click', e => {
        const btn = e.target.closest('button[data-emoji]');
        if (!btn) return;
        const emoji = btn.dataset.emoji;
        const start = target.selectionStart || 0;
        const end = target.selectionEnd || 0;
        const val = target.value || '';
        target.value = val.slice(0, start) + emoji + val.slice(end);
        // Move caret after the inserted emoji.
        const newPos = start + emoji.length;
        target.focus();
        target.setSelectionRange(newPos, newPos);
        target.dispatchEvent(new Event('input', { bubbles: true }));
      });
      document.body.appendChild(pop);
      // Close on outside click — defer so the click that opened it doesn't immediately close it.
      setTimeout(() => {
        const closeOnAway = e => {
          if (!pop.contains(e.target) && e.target !== anchorEl) {
            pop.remove();
            document.removeEventListener('mousedown', closeOnAway);
          }
        };
        document.addEventListener('mousedown', closeOnAway);
      }, 0);
    }

    // ── Attachment grid (shared render for notes & ideas) ────────────────────
    // Pass an array of { name, url, mime } objects; returns thumbnail+filename
    // HTML. Used inside note/idea modals to show what's already attached.
    function renderAttachmentList(attachments, removeHandler) {
      if (!attachments || !attachments.length) return '';
      const escH = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      const rows = attachments.map((a, i) => {
        const isImg = (a.mime||'').startsWith('image/') || /\.(png|jpe?g|gif|webp|svg)$/i.test(a.name||'');
        const thumb = isImg
          ? `<img src="${escH(a.url)}" alt="" style="width:48px;height:48px;object-fit:cover;border-radius:6px;border:1px solid #E2E8F0">`
          : `<div style="width:48px;height:48px;border-radius:6px;background:#F1F5F9;display:flex;align-items:center;justify-content:center;font-size:22px">${/pdf/i.test(a.mime||a.name)?'📄':/docx?/i.test(a.name)?'📝':/xlsx?|csv/i.test(a.name)?'📊':/mp[34]|wav|m4a/i.test(a.name)?'🎵':/mp4|mov|webm/i.test(a.name)?'🎬':'📎'}</div>`;
        const rm = removeHandler ? `<button type="button" onclick="${removeHandler}(${i})" title="Remove" style="background:none;border:none;color:#94A3B8;font-size:18px;cursor:pointer;padding:2px 8px;line-height:1">×</button>` : '';
        return `<div style="display:flex;align-items:center;gap:10px;padding:6px 10px;border:1px solid #E2E8F0;border-radius:8px;background:#F8FAFC">
          ${thumb}
          <div style="flex:1;min-width:0">
            <a href="${escH(a.url)}" target="_blank" rel="noopener" style="display:block;font-size:13px;font-weight:500;color:#1F2937;text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escH(a.name||'attachment')}</a>
            <div style="font-size:11px;color:#94A3B8">${a.mime||''}</div>
          </div>
          ${rm}
        </div>`;
      }).join('');
      return `<div style="display:flex;flex-direction:column;gap:6px;margin:8px 0">${rows}</div>`;
    }

    function initializeData() {
      if (!localStorage.getItem('initialized')) {
        // Tenants start blank — only the owner gets the legacy Joy seed data.
        setData('clients', TENANT ? [] : SEED_CLIENTS);
        setData('ideas',   TENANT ? [] : SEED_IDEAS);
        setData('revenue', TENANT ? [] : SEED_REVENUE);
        setData('settings', DEFAULT_SETTINGS);
        setData('activity', []);
        setData('events', []);
        localStorage.setItem('initialized', 'true');
      }
    }

    function logActivity(type, message) {
      const activity = getData('activity');
      activity.unshift({ id: generateId(), type, message, timestamp: new Date().toISOString() });
      if (activity.length > 50) activity.pop();
      setData('activity', activity);
    }

    // ── SESSION ────────────────────────────────────────────────────────────────
    function updateBrandUI() {
      const s = JSON.parse(localStorage.getItem('settings')) || DEFAULT_SETTINGS;
      const biz = s.businessName || DEFAULT_SETTINGS.businessName;
      const firstName = (s.name || DEFAULT_SETTINGS.name).split(' ')[0];
      const lt = document.getElementById('login-title');
      if (lt) lt.textContent = biz.toUpperCase();
      const ag = document.getElementById('ai-greeting-msg');
      if (ag) ag.textContent = `Hey ${firstName} 👋 I'm your AI Coach for ${biz}. What are you working on?`;
    }

    function checkSession() {
      updateBrandUI();
      if (localStorage.getItem('loggedIn') === 'true') {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        if (typeof updateDashboard === 'function') updateDashboard();
        if (typeof checkOnboarding === 'function') checkOnboarding();
        // Resume cross-device sync on refresh so the badge updates and any
        // edits made elsewhere flow in within the next 30s tick.
        try { pbSyncAll().then(()=>{ try{updateMessagesBadge();}catch(_){} }); startBackgroundSync(); startReminders(); _pbRenderBadge(); updateMessagesBadge(); } catch(e) {}
      }
    }

    // For tenant copies (?tenant=<slug>): on first load, pull this tenant's
    // settings from PocketBase BEFORE the login form is used. PB store reads
    // are public, so we don't need auth. Without this, Toby's password (set
    // by the owner via the admin panel) wouldn't be available — she'd be
    // stuck with the placeholder default.
    async function _hydrateTenantSettings() {
      if (!TENANT) return;
      // Only run on first visit when localStorage is empty for this tenant
      if (localStorage.getItem('settings')) return;
      const pbBase = (window.location.origin && /thehelpctr/.test(window.location.origin))
        ? window.location.origin + '/pb'
        : 'https://thehelpctr.com/pb';
      // Use the public /api/tenant-settings/:slug hook which bypasses auth
      // and rules (since the tenant hasn't logged in yet). Falls back to
      // the (legacy, now rule-protected) direct collection read.
      try {
        const r = await fetch(pbBase + '/api/tenant-settings/' + encodeURIComponent(TENANT));
        if (r.ok) {
          const j = await r.json();
          // Build a settings record from the public-safe fields. Password is
          // NEVER returned by this endpoint — the tenant types their password
          // at login and we authenticate against PB directly.
          const seed = {
            name: (j.branding && j.branding.ownerName) || '',
            email: j.email || '',
            businessName: (j.branding && j.branding.businessName) || '',
            tagline: '',
            password: '',  // empty — login flow auths against PB user record
            phone: '', address: '',
            pbUrl: pbBase,
            pbEmail: j.email || '',
            pbPassword: '',  // filled in at login from the form
            pbAuthMode: 'user',
            pbEnabled: true,
            tenantPlan: (j.branding && j.branding.plan) || 'Trial',
            tenantActive: !(j.branding && j.branding.active === false)
          };
          localStorage.setItem('settings', JSON.stringify(seed));
          if (!localStorage.getItem('initialized')) localStorage.setItem('initialized', 'true');
          updateBrandUI();
          return;
        }
      } catch(e) {}
    }

    // ── LOGIN ──────────────────────────────────────────────────────────────────
    document.getElementById('password-input').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') { e.preventDefault(); login(); }
    });

    async function login() {
      const stored = JSON.parse(localStorage.getItem('settings')) || {};
      const entered = document.getElementById('password-input').value.trim();
      const errEl = document.getElementById('login-error');
      const isMaster = entered === 'HELPRESET';

      // For tenant copies (Path B), authenticate against PB user account.
      // The password the user types is their PB user password — there's no
      // local-only password fallback (data isolation depends on real auth).
      if (TENANT && !isMaster) {
        const pbUrl = stored.pbUrl || (window.location.origin + '/pb');
        const userEmail = stored.email || stored.pbEmail || '';
        if (!userEmail) {
          errEl.textContent = 'Tenant not provisioned — contact platform owner.';
          errEl.style.display = 'block';
          return;
        }
        errEl.style.color = '#666';
        errEl.style.display = 'block';
        errEl.textContent = 'Signing in…';
        try {
          const r = await fetch(pbUrl.replace(/\/$/,'') + '/api/collections/users/auth-with-password', {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ identity: userEmail, password: entered })
          });
          if (!r.ok) {
            errEl.style.color = 'var(--error)';
            errEl.textContent = r.status === 400 ? 'Incorrect password.' : 'Login failed (' + r.status + ').';
            document.getElementById('password-input').value = '';
            document.getElementById('password-input').focus();
            return;
          }
          const auth = await r.json();
          if (auth.record && auth.record.tenantActive === false) {
            errEl.style.color = 'var(--error)';
            errEl.textContent = 'Account suspended — contact the platform owner.';
            return;
          }
          // Persist session — pbAuth() will reuse this token
          localStorage.setItem('pb_token', auth.token);
          if (auth.record) localStorage.setItem('pb_user', JSON.stringify(auth.record));
          // Sync the password into local settings so subsequent pbAuth re-auths work
          stored.pbPassword = entered;
          stored.password = entered;  // legacy field for any old code paths
          localStorage.setItem('settings', JSON.stringify(stored));
          localStorage.setItem('loggedIn', 'true');
          errEl.style.display = 'none';
          document.getElementById('login-page').classList.add('hidden');
          document.getElementById('app').classList.remove('hidden');
          await pbSyncAll();
          startBackgroundSync(); startReminders();
          if (typeof updateDashboard === 'function') updateDashboard();
          if (typeof checkOnboarding === 'function') checkOnboarding();
          setTimeout(checkModelHealth, 2000);
        } catch (e) {
          errEl.style.color = 'var(--error)';
          errEl.textContent = 'Network error: ' + e.message;
        }
        return;
      }

      // Owner copy (or master reset) — original local-password flow.
      const password = (stored.password && stored.password.length > 0) ? stored.password : DEFAULT_SETTINGS.password;
      if (entered === password || isMaster) {
        if (isMaster) {
          const s = stored; s.password = DEFAULT_SETTINGS.password;
          localStorage.setItem('settings', JSON.stringify(s));
        }
        localStorage.setItem('loggedIn', 'true');
        if (window.location.hash) history.replaceState(null, '', window.location.pathname + window.location.search);
        errEl.style.display = 'none';
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        pbSyncAll();
        startBackgroundSync(); startReminders();
        if (typeof updateDashboard === 'function') updateDashboard();
        if (typeof checkOnboarding === 'function') checkOnboarding();
        setTimeout(checkModelHealth, 2000);
        if (typeof _initLiveNotifications === 'function') setTimeout(_initLiveNotifications, 1500);
      } else {
        // Never reveal the default password here — anyone watching the screen
        // could read it. Direct them to the recovery flow instead.
        errEl.innerHTML = 'Incorrect password. <a href="#" onclick="showForgotPwModal();return false;" style="color:var(--brand-primary);text-decoration:underline;font-weight:600">Forgot password?</a>';
        errEl.style.display = 'block';
        document.getElementById('password-input').value = '';
        document.getElementById('password-input').focus();
      }
    }

    // ── Forgot password recovery ───────────────────────────────────────────
    // Two-step modal: verify master reset code, then set a new password. The
    // master code is never echoed back so a shoulder-surfer can't learn it.
    function showForgotPwModal() {
      document.getElementById('forgot-pw-modal')?.remove();
      const modal = document.createElement('div');
      modal.id = 'forgot-pw-modal';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:1001;display:flex;align-items:center;justify-content:center;padding:20px';
      modal.innerHTML = `
        <div style="background:#fff;border-radius:14px;padding:28px 30px;width:420px;max-width:100%;box-shadow:0 24px 60px rgba(0,0,0,0.25)">
          <h2 style="font-size:19px;font-weight:700;margin:0 0 6px">Reset password</h2>
          <p style="font-size:13px;color:#64748B;margin:0 0 18px;line-height:1.55">Enter the master reset code that was set when this dashboard was configured. You'll then set a new password.</p>
          <input type="password" id="fp-code" placeholder="Master reset code" class="form-input" style="margin-bottom:10px" autocomplete="off">
          <div id="fp-new-block" style="display:none">
            <input type="password" id="fp-new" placeholder="New password" class="form-input" style="margin-bottom:10px" autocomplete="new-password">
            <input type="password" id="fp-confirm" placeholder="Confirm new password" class="form-input" style="margin-bottom:10px" autocomplete="new-password">
          </div>
          <div id="fp-error" style="color:var(--error);font-size:13px;margin-bottom:10px;display:none"></div>
          <button id="fp-submit" class="btn-primary" onclick="submitForgotPw()" style="width:100%">Verify code</button>
          <button onclick="document.getElementById('forgot-pw-modal').remove()" style="width:100%;padding:11px;margin-top:8px;background:none;border:1px solid var(--gray-300);border-radius:8px;cursor:pointer;font-size:14px">Cancel</button>
        </div>`;
      document.body.appendChild(modal);
      setTimeout(() => document.getElementById('fp-code')?.focus(), 50);
      document.getElementById('fp-code').addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); submitForgotPw(); }
      });
    }
    function submitForgotPw() {
      const codeEl = document.getElementById('fp-code');
      const newBlock = document.getElementById('fp-new-block');
      const submitBtn = document.getElementById('fp-submit');
      const errEl = document.getElementById('fp-error');
      errEl.style.display = 'none';
      // Step 1 — verify the master code.
      if (newBlock.style.display === 'none') {
        if ((codeEl.value || '').trim() !== 'HELPRESET') {
          errEl.textContent = 'Master reset code is incorrect.';
          errEl.style.display = 'block';
          codeEl.value = '';
          return;
        }
        codeEl.disabled = true;
        newBlock.style.display = 'block';
        submitBtn.textContent = 'Set new password';
        setTimeout(() => document.getElementById('fp-new')?.focus(), 50);
        return;
      }
      // Step 2 — capture the new password.
      const nw = document.getElementById('fp-new').value;
      const conf = document.getElementById('fp-confirm').value;
      if (nw.length < 4)  { errEl.textContent = 'New password must be at least 4 characters.'; errEl.style.display = 'block'; return; }
      if (nw !== conf)    { errEl.textContent = 'Passwords do not match.'; errEl.style.display = 'block'; return; }
      const stored = JSON.parse(localStorage.getItem('settings')) || DEFAULT_SETTINGS;
      stored.password = nw;
      setData('settings', stored);
      document.getElementById('forgot-pw-modal').remove();
      const loginErr = document.getElementById('login-error');
      if (loginErr) { loginErr.style.color = '#10B981'; loginErr.textContent = 'Password reset. Sign in with your new password.'; loginErr.style.display = 'block'; }
    }

    // Pull all data from PocketBase into this device's localStorage.
    // Used when logging in on a new device (iPad, phone, etc.) where
    // localStorage is empty but the user has data saved in the cloud.
    async function restoreFromCloud() {
      const defaultUrl = (window.location.origin && window.location.origin.includes('thehelpctr'))
        ? (window.location.origin + '/pb')
        : 'https://thehelpctr.com/pb';
      const url = (prompt('PocketBase URL', defaultUrl) || '').trim().replace(/\/$/, '');
      if (!url) return;
      const email = (prompt('PocketBase admin email') || '').trim();
      if (!email) return;
      const password = prompt('PocketBase admin password') || '';
      if (!password) return;
      const errEl = document.getElementById('login-error');
      errEl.textContent = 'Connecting to cloud…';
      errEl.style.color = '#666';
      errEl.style.display = 'block';
      try {
        const r = await fetch(url + '/api/admins/auth-with-password', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({identity: email, password})
        });
        if (!r.ok) throw new Error('Authentication failed (' + r.status + ')');
        const auth = await r.json();
        localStorage.setItem('pb_token', auth.token);
        let pullUrl = url + '/api/collections/store/records?perPage=500';
        if (TENANT_PREFIX) pullUrl += '&filter=' + encodeURIComponent(`key~"${TENANT_PREFIX}"`);
        const r2 = await fetch(pullUrl, { headers: {'Authorization': auth.token} });
        if (!r2.ok) throw new Error('Pull failed (' + r2.status + ')');
        const {items=[]} = await r2.json();
        let count = 0;
        items.forEach(item => {
          if (item.key && item.value !== undefined) {
            const localKey = _pbStripPrefix(item.key);
            const v = typeof item.value === 'string' ? item.value : JSON.stringify(item.value);
            localStorage.setItem(localKey, v);
            count++;
          }
        });
        // Persist creds so future loads on this device sync automatically.
        const s = JSON.parse(localStorage.getItem('settings') || '{}');
        s.pbUrl = url; s.pbEmail = email; s.pbPassword = password; s.pbEnabled = true;
        localStorage.setItem('settings', JSON.stringify(s));
        localStorage.setItem('initialized', 'true');
        errEl.style.color = '#10B981';
        errEl.textContent = 'Restored ' + count + ' records. Reloading…';
        setTimeout(() => location.reload(), 900);
      } catch (e) {
        errEl.style.color = 'var(--error)';
        errEl.textContent = 'Restore failed: ' + e.message;
      }
    }

    function togglePassword() {
      const input = document.getElementById('password-input');
      const btn = document.getElementById('eye-btn');
      if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = 'HIDE';
        btn.style.background = 'var(--brand-primary)';
        btn.style.color = '#fff';
        btn.style.borderColor = 'var(--brand-primary)';
      } else {
        input.type = 'password';
        btn.textContent = 'SHOW';
        btn.style.background = '#F1F5F9';
        btn.style.color = '#475569';
        btn.style.borderColor = '#CBD5E1';
      }
      input.focus();
    }

    function logout() {
      localStorage.removeItem('loggedIn');
      stopBackgroundSync(); stopReminders();
      document.getElementById('app').classList.add('hidden');
      document.getElementById('login-page').classList.remove('hidden');
      document.getElementById('password-input').value = '';
    }

    function showChangePwModal() {
      let modal = document.getElementById('change-pw-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'change-pw-modal';
        modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;';
        modal.innerHTML = `
          <div style="background:#fff;border-radius:12px;padding:32px;width:400px;max-width:90vw;">
            <h2 style="margin-bottom:20px;font-size:20px;">Change Password</h2>
            <input type="password" id="cp-current" placeholder="Current password" class="form-input">
            <input type="password" id="cp-new" placeholder="New password" class="form-input">
            <input type="password" id="cp-confirm" placeholder="Confirm new password" class="form-input">
            <div id="cp-error" style="color:var(--error);font-size:14px;margin-bottom:12px;display:none;"></div>
            <button class="btn-primary" onclick="submitChangePw()">Update Password</button>
            <button onclick="document.getElementById('change-pw-modal').remove()"
                    style="width:100%;padding:12px;margin-top:8px;background:none;border:1px solid var(--gray-300);border-radius:8px;cursor:pointer;font-size:16px;">Cancel</button>
          </div>`;
        document.body.appendChild(modal);
      }
      modal.style.display = 'flex';
    }

    function submitChangePw() {
      const stored = JSON.parse(localStorage.getItem('settings')) || DEFAULT_SETTINGS;
      const cur  = document.getElementById('cp-current').value;
      const nw   = document.getElementById('cp-new').value;
      const conf = document.getElementById('cp-confirm').value;
      const errEl = document.getElementById('cp-error');
      if (cur !== stored.password) { errEl.textContent = 'Current password is incorrect.'; errEl.style.display = 'block'; return; }
      if (nw.length < 4)           { errEl.textContent = 'New password must be at least 4 characters.'; errEl.style.display = 'block'; return; }
      if (nw !== conf)             { errEl.textContent = 'Passwords do not match.'; errEl.style.display = 'block'; return; }
      stored.password = nw;
      setData('settings', stored);
      document.getElementById('change-pw-modal').remove();
      alert('Password updated successfully!');
    }

    // ── PORTAL ROUTING ─────────────────────────────────────────────────────────
    function checkPortalRoute() {
      const hash = window.location.hash;
      // Public routes always take precedence — even when an owner is already
      // logged in, opening a portal/shared/booking URL must render that view
      // (so "Preview Portal →" works in a new tab without session conflict).
      if (hash.startsWith('#portal?token=')) {
        const token = hash.split('token=')[1];
        showPortal(token);
        return true;
      }
      if (hash.startsWith('#shared?t=')) {
        const sharetoken = hash.split('t=')[1];
        showSharedPortal(sharetoken);
        return true;
      }
      if (hash.startsWith('#book?u=')) {
        const token = hash.split('u=')[1];
        showPublicBookingPage(token);
        return true;
      }
      return false;
    }

    // Public PocketBase endpoint (set this to match your VPS).
    // Auto-detect: on HTTPS thehelpctr.com use same-origin /pb/api/portal/
    // (nginx proxies to PB on 8090). Fallback: direct VPS for local dev.
    const PORTAL_PUBLIC_PB = (function(){
      try {
        const o = window.location.origin;
        if (o && /^https?:\/\//.test(o) && !/file:|^null$/.test(o)) {
          return o + '/pb/api/portal/';
        }
      } catch (e) {}
      return 'https://thehelpctr.com/pb/api/portal/';
    })();
    // Help Center backend (Resend, Stripe invoice checkout, file uploads).
    // Auto-detect the right backend URL.
    // - On https://thehelpctr.com (or any same-origin HTTPS): use the same origin
    //   so nginx proxies /api/* → :3001 (no mixed-content, no CORS).
    // - On localhost / file:// preview: fall back to the direct VPS port.
    const HC_BACKEND = (function(){
      try {
        const o = window.location.origin;
        if (o && /^https?:\/\//.test(o) && !/file:|^null$/.test(o)) return o;
      } catch (e) {}
      return 'http://187.124.146.184:3001';
    })();

    // Send a portal-notification email through the existing /api/email proxy
    // (which holds your Resend API key on the server). Fails silently if
    // Resend isn't configured — addDeliverable etc. still complete.
    async function sendPortalNotificationEmail(client, opts) {
      if (!client || !client.email) return { ok:false, error:'no client email' };
      const settings = JSON.parse(localStorage.getItem('settings'))||{};
      const integrations = getData('integrationSettings') || {};
      const businessName = settings.businessName || 'H.E.L.P. Center';
      const ownerName = settings.name || businessName;
      // Send notification emails point clients to the dedicated portal.html page
      // (query-string routing survives email clients; no sign-in screen).
      const _origin = (window.location.origin && /^https?:/.test(window.location.origin)) ? window.location.origin : 'https://thehelpctr.com';
      const portalUrl = (settings.portalShareBase || (_origin + '/portal.html')) + '?t=' + (client.portalToken || '');
      const subject = opts.subject || ('Update from ' + businessName);
      const heading = opts.heading || 'A new update is ready for you';
      const bodyHtml = opts.body || '';
      const ctaLabel = opts.ctaLabel || 'Open Your Portal';
      const safeName = (client.name||'').replace(/&/g,'&amp;').replace(/</g,'&lt;');
      const html = '<!doctype html><html><body style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,sans-serif;background:#F1F5F9;margin:0;padding:24px">'
        + '<table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;margin:auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(15,23,42,0.08)">'
        + '<tr><td style="background:linear-gradient(135deg,#0F172A,#312E81);padding:24px;color:#fff">'
        +   '<div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;opacity:0.8">' + (businessName.replace(/&/g,'&amp;').replace(/</g,'&lt;')) + '</div>'
        +   '<div style="font-size:22px;font-weight:700;margin-top:4px">' + heading.replace(/&/g,'&amp;').replace(/</g,'&lt;') + '</div>'
        + '</td></tr>'
        + '<tr><td style="padding:28px 24px;color:#1F2937;font-size:15px;line-height:1.6">'
        +   '<div>Hi ' + safeName + ',</div>'
        +   '<div style="margin:14px 0">' + bodyHtml + '</div>'
        +   '<div style="text-align:center;margin:22px 0"><a href="' + portalUrl + '" style="display:inline-block;background:linear-gradient(135deg,var(--brand-primary),#7C3AED);color:#fff;text-decoration:none;padding:13px 28px;border-radius:10px;font-weight:700;font-size:14px">' + ctaLabel + '</a></div>'
        +   '<div style="font-size:13px;color:#64748B;margin-top:18px">Or paste this link in your browser: <br><span style="word-break:break-all;color:var(--brand-primary)">' + portalUrl + '</span></div>'
        + '</td></tr>'
        + '<tr><td style="padding:14px 24px 24px;font-size:12px;color:#94A3B8;border-top:1px solid #E2E8F0">— ' + ownerName.replace(/&/g,'&amp;').replace(/</g,'&lt;') + '</td></tr>'
        + '</table></body></html>';
      try {
        const r = await fetch(HC_BACKEND + '/api/email', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: client.email, subject, html,
            fromName: integrations.resendSenderName || businessName,
            fromEmail: integrations.resendSenderEmail || undefined
          })
        });
        if (!r.ok) {
          const e = await r.json().catch(()=>({}));
          if (typeof _logEmail === 'function') _logEmail({ to: client.email, subject, body: bodyHtml, context: 'portal-notif', clientId: client.id, clientName: client.name, status: 'failed', error: e.error || ('HTTP ' + r.status) });
          showToast('Email send failed — check Settings → Resend', 'warn');
          return { ok:false, error: e.error };
        }
        if (typeof _logEmail === 'function') _logEmail({ to: client.email, subject, body: bodyHtml, context: 'portal-notif', clientId: client.id, clientName: client.name, status: 'sent' });
        showToast('✉ Email sent to ' + client.name, 'success');
        return { ok:true };
      } catch (e) {
        if (typeof _logEmail === 'function') _logEmail({ to: client.email, subject, body: bodyHtml, context: 'portal-notif', clientId: client.id, clientName: client.name, status: 'failed', error: e.message });
        showToast('Email send error: ' + e.message, 'warn');
        return { ok:false, error: e.message };
      }
    }

    // ── SHARED-WITH-TEAM PORTAL VIEW ───────────────────────────────────────
    // When a client forwards selected deliverables to a team member, the team
    // member opens a URL with #shared?t=<sharetoken>. We fetch a stripped-down
    // portal snapshot from the public share endpoint and render the standard
    // portal shell — but only the deliverables tab/section is exposed.
    async function showSharedPortal(sharetoken) {
      document.getElementById('login-page').classList.add('hidden');
      document.getElementById('app').classList.add('hidden');
      let el = document.getElementById('portal-view');
      if (!el) {
        el = document.createElement('div');
        el.id = 'portal-view';
        document.body.appendChild(el);
      }
      el.classList.remove('hidden');
      el.innerHTML = '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#F8FAFC"><div style="text-align:center;color:#64748B"><div style="font-size:32px;margin-bottom:10px">⏳</div><div>Loading shared deliverables…</div></div></div>';

      let snap = null;
      try {
        const r = await fetch(PORTAL_PUBLIC_PB.replace(/\/$/, '') + '/shared/' + encodeURIComponent(sharetoken));
        if (r.ok) {
          const j = await r.json();
          snap = j.data;
        }
      } catch (e) { /* fall through */ }

      if (!snap || !snap.client) {
        const _s = JSON.parse(localStorage.getItem('settings')) || DEFAULT_SETTINGS;
        el.innerHTML = '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#F8FAFC;"><div style="text-align:center;padding:40px;max-width:480px;"><h2 style="color:#0F172A;margin-bottom:8px;">Shared link not found</h2><p style="color:#64748B;">This share link is invalid or has been revoked. Please contact ' + (_s.businessName || DEFAULT_SETTINGS.businessName) + '.</p></div></div>';
        return;
      }

      window._portalRemote = snap;
      window._portalShareMode = true;
      el.innerHTML = renderModernPortalShell(snap.client, snap.branding || null);
      // Default to deliverables tab and hide all other tabs
      setTimeout(() => {
        document.querySelectorAll('.pp-tab').forEach(t => {
          if (t.getAttribute('onclick') && t.getAttribute('onclick').indexOf("'deliverables'") < 0) t.style.display = 'none';
        });
        const tab = document.querySelector('.pp-tab[onclick*="\'deliverables\'"]');
        if (tab) tab.click();
        // Show share-mode banner at top
        const banner = document.createElement('div');
        banner.style.cssText = 'background:#1E5BC0;color:#fff;padding:10px 16px;text-align:center;font-size:13px;font-weight:600';
        banner.innerHTML = 'Shared deliverables from ' + (snap.sourceClientName || '').replace(/[<>]/g, '') + (snap.recipientName ? ' — for ' + (snap.recipientName).replace(/[<>]/g, '') : '');
        const heroEl = el.querySelector('.pp-hero');
        if (heroEl) heroEl.parentNode.insertBefore(banner, heroEl);
      }, 60);
    }

    // ── SHARE MODAL (from inside the client's own portal) ──────────────────
    // Open ANY deliverable for in-browser reading (instead of download).
    // Office docs are routed through Google Docs Viewer (already wrapped by
    // caller). PDFs and images render natively in iframe. Text/HTML loads
    // directly. Data URLs and external sites use iframe.
    function ppOpenDeliverableInline(delivId, viewerUrl, name) {
      const old = document.getElementById('pp-deliv-viewer'); if (old) old.remove();
      const modal = document.createElement('div');
      modal.id = 'pp-deliv-viewer';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.85);z-index:99999;display:flex;flex-direction:column';
      const safeName = (name || 'Deliverable').replace(/[<>"]/g,'');
      modal.innerHTML =
        '<div style="background:#0F172A;color:#fff;padding:12px 18px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">' +
          '<div style="font-size:14px;font-weight:600;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + safeName + '</div>' +
          '<div style="display:flex;gap:8px">' +
            '<a href="' + viewerUrl.replace(/"/g,'&quot;') + '" target="_blank" rel="noopener" style="background:rgba(255,255,255,0.18);border:none;color:#fff;padding:7px 12px;border-radius:6px;font-size:12px;font-weight:600;text-decoration:none">Open Full Page ↗</a>' +
            '<button onclick="document.getElementById(\'pp-deliv-viewer\').remove()" style="background:rgba(255,255,255,0.2);border:none;color:#fff;padding:7px 14px;border-radius:6px;font-size:14px;cursor:pointer;font-weight:600">×</button>' +
          '</div>' +
        '</div>' +
        '<iframe src="' + viewerUrl.replace(/"/g,'&quot;') + '" style="flex:1;border:none;background:#fff" title="' + safeName + '"></iframe>';
      document.body.appendChild(modal);
    }

    // Client-side: forward the entire portal URL to a reviewer (team member,
    // boss, board, etc.). Uses native Web Share API on mobile, falls back to
    // a mailto: link that opens the user's native email composer pre-filled.
    function ppForwardPortal() {
      const portalUrl = window.location.href;
      const settings = JSON.parse(localStorage.getItem('settings') || '{}');
      const biz = (window._portalRemote && window._portalRemote.branding && window._portalRemote.branding.businessName) || settings.businessName || 'H.E.L.P. Center';
      const clientObj = (window._portalRemote && window._portalRemote.client) || {};
      const subject = 'Please review my ' + biz + ' portal';
      const body = 'Hi,\n\n' +
        'Could you take a look at my portal from ' + biz + ' and let me know what you think? It has the proposal/contract details, deliverables, and invoice for our project.\n\n' +
        'Open the portal:\n' + portalUrl + '\n\n' +
        'Thanks,\n' + (clientObj.name || '');
      // Try native Web Share first (works on iOS/Android)
      if (navigator.share) {
        navigator.share({ title: subject, text: body, url: portalUrl }).catch(() => {
          window.location.href = 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        });
        return;
      }
      // Desktop fallback — open mailto: which opens default email app
      window.location.href = 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    }

    function ppOpenShareModal() {
      const client = (window._portalRemote && window._portalRemote.client) ||
        (function(){
          const tok = (window.location.hash.split('token=')[1] || '');
          const cs = JSON.parse(localStorage.getItem('clients') || '[]');
          return cs.find(c => c.portalToken === tok) || null;
        })();
      if (!client) { alert('Cannot find this portal.'); return; }
      const deliv = client.deliverables || [];
      if (!deliv.length) { alert('No deliverables to share yet.'); return; }
      const escH = s => (s || '').toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      const old = document.getElementById('pp-share-overlay'); if (old) old.remove();
      const overlay = document.createElement('div');
      overlay.id = 'pp-share-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(15,23,42,0.55);display:flex;align-items:center;justify-content:center;padding:18px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif';
      overlay.innerHTML =
        '<div style="background:#fff;border-radius:14px;max-width:500px;width:100%;overflow:hidden;box-shadow:0 16px 50px rgba(0,0,0,0.25)">' +
          '<div style="padding:18px 22px;border-bottom:1px solid #E2E8F0">' +
            '<h3 style="font-size:17px;font-weight:700;margin:0;color:#0F172A">Forward to a team member</h3>' +
            '<p style="font-size:12.5px;color:#64748B;margin:4px 0 0">They\'ll see ONLY the deliverables you check below — no documents, messages, or invoice info.</p>' +
          '</div>' +
          '<div style="padding:14px 22px;max-height:50vh;overflow-y:auto">' +
            '<label style="font-size:12px;font-weight:600;color:#475569;display:block;margin-bottom:4px">Recipient name (optional)</label>' +
            '<input id="pp-share-name" type="text" placeholder="e.g. Marketing Lead" style="width:100%;padding:9px 12px;border:1px solid #CBD5E1;border-radius:8px;font-size:14px;font-family:inherit;outline:none;margin-bottom:14px">' +
            '<div style="font-size:12px;font-weight:600;color:#475569;margin-bottom:8px">Pick which deliverables they can see</div>' +
            '<div id="pp-share-list" style="border:1px solid #E2E8F0;border-radius:8px;max-height:240px;overflow-y:auto">' +
              deliv.map(d =>
                '<label style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-bottom:1px solid #F1F5F9;cursor:pointer;font-size:13.5px"><input type="checkbox" data-id="' + escH(d.id) + '" style="cursor:pointer"><div style="flex:1"><div style="font-weight:600;color:#0F172A">' + escH(d.name || '(unnamed)') + '</div>' + (d.description ? '<div style="font-size:12px;color:#64748B;margin-top:2px">' + escH(d.description) + '</div>' : '') + '</div></label>'
              ).join('') +
            '</div>' +
            '<div id="pp-share-result" style="margin-top:14px;display:none"></div>' +
          '</div>' +
          '<div style="padding:14px 22px;border-top:1px solid #E2E8F0;background:#F8FAFC;display:flex;justify-content:flex-end;gap:8px">' +
            '<button onclick="document.getElementById(\'pp-share-overlay\').remove()" class="pp-btn pp-btn-outline">Cancel</button>' +
            '<button id="pp-share-submit" onclick="ppSubmitShare()" class="pp-btn pp-btn-primary">Generate share link</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(overlay);
    }
    async function ppSubmitShare() {
      const overlay = document.getElementById('pp-share-overlay');
      if (!overlay) return;
      const ids = [].map.call(overlay.querySelectorAll('input[type="checkbox"]:checked'), cb => cb.dataset.id);
      if (!ids.length) { alert('Pick at least one deliverable to share.'); return; }
      const recipientName = (document.getElementById('pp-share-name').value || '').trim();
      const submit = document.getElementById('pp-share-submit');
      submit.disabled = true; submit.textContent = 'Generating…';
      const tok = (window.location.hash.split('token=')[1] || '').split('&')[0];
      try {
        const r = await fetch(PORTAL_PUBLIC_PB.replace(/\/$/,'') + '/' + encodeURIComponent(tok) + '/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ op: 'share', recipientName: recipientName, deliverableIds: ids })
        });
        const j = await r.json();
        if (!r.ok || !j.shareToken) throw new Error(j.error || 'failed');
        const baseUrl = window.location.href.split('#')[0];
        const shareUrl = baseUrl + '#shared?t=' + j.shareToken;
        const result = document.getElementById('pp-share-result');
        result.style.display = 'block';
        result.innerHTML =
          '<div style="background:#ECFDF5;border:1px solid #A7F3D0;border-radius:10px;padding:14px">' +
            '<div style="font-size:13px;font-weight:700;color:#065F46;margin-bottom:8px">✓ Share link ready</div>' +
            '<div style="display:flex;gap:8px;align-items:center">' +
              '<input id="pp-share-url" type="text" readonly value="' + shareUrl.replace(/"/g, '&quot;') + '" style="flex:1;padding:8px 10px;border:1px solid #A7F3D0;border-radius:6px;font-size:11.5px;font-family:Consolas,monospace;background:#fff;outline:none">' +
              '<button onclick="navigator.clipboard.writeText(document.getElementById(\'pp-share-url\').value);this.textContent=\'Copied\'" class="pp-btn pp-btn-primary" style="white-space:nowrap">Copy</button>' +
            '</div>' +
            '<div style="font-size:11.5px;color:#065F46;margin-top:8px">Send this link to your team member. It only exposes the ' + ids.length + ' deliverable' + (ids.length !== 1 ? 's' : '') + ' you picked.</div>' +
          '</div>';
        submit.textContent = 'Done';
      } catch (e) {
        alert('Share failed: ' + e.message);
        submit.disabled = false; submit.textContent = 'Generate share link';
      }
    }

    // Delete a quick-upload deliverable (one added via /upload.html or the + Upload button).
    // Calls POST /api/owner/deliverable/delete on the backend, then refreshes the Preview.
    async function ppDeleteQuickUpload(portalToken, deliverableId, btn) {
      if (!confirm('Remove this uploaded deliverable from the client portal?')) return;
      const settings = JSON.parse(localStorage.getItem('settings') || '{}');
      const password = settings.password || '';
      if (!password) { alert('No owner password in settings.'); return; }
      btn.disabled = true; btn.textContent = 'Removing…';
      try {
        const r = await fetch(location.origin + '/api/owner/deliverable/delete', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password, portalToken, deliverableId })
        });
        if (!r.ok) { const j = await r.json().catch(()=>({})); throw new Error(j.error || ('HTTP ' + r.status)); }
        showToast('Deliverable removed', 'success');
        // Re-open the preview to show fresh data
        setTimeout(() => { const m = document.getElementById('portal-preview-modal'); if (m) m.remove(); previewPortalLink(portalToken); }, 400);
      } catch (e) {
        alert('Delete failed: ' + e.message);
        btn.disabled = false; btn.textContent = '× Remove';
      }
    }

    async function showPortal(token) {
      document.getElementById('login-page').classList.add('hidden');
      document.getElementById('app').classList.add('hidden');
      let el = document.getElementById('portal-view');
      if (!el) { el = document.createElement('div'); el.id = 'portal-view'; document.body.appendChild(el); }

      // Loading state while we look up local + remote data
      el.innerHTML = '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#F8FAFC"><div style="text-align:center;color:#64748B"><div style="font-size:32px;margin-bottom:10px">⏳</div><div>Loading portal…</div></div></div>';

      // Try local first (works on the OWNER's device for preview)
      const clients = getData('clients') || [];
      let client = clients.find(c => c.portalToken === token);
      let remoteSnapshot = null;
      let isRemote = false;

      if (!client) {
        // Fall back to PocketBase public endpoint (this is what runs on the CLIENT's device)
        try {
          const r = await fetch(PORTAL_PUBLIC_PB + encodeURIComponent(token));
          if (r.ok) {
            const j = await r.json();
            remoteSnapshot = j.data;
            isRemote = true;
          }
        } catch (e) { /* network/CORS error → treat as not-found */ }

        if (remoteSnapshot && remoteSnapshot.client) {
          // Build a "client" object from the snapshot so the existing renderer can use it.
          client = remoteSnapshot.client;
        }
      }

      if (!client) {
        const _s = JSON.parse(localStorage.getItem('settings')) || DEFAULT_SETTINGS;
        el.innerHTML = `<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#F8FAFC;"><div style="text-align:center;padding:40px;max-width:480px;"><div style="font-size:48px;">🔍</div><h2 style="color:#0F172A;margin-bottom:8px;">Portal Not Found</h2><p style="color:#64748B;">This link is invalid or expired. Please contact ${_s.businessName || DEFAULT_SETTINGS.businessName}.</p></div></div>`;
        return;
      }
      // If we loaded from PocketBase, stash the snapshot so the section renderers
      // (docs, branding, stripe button) can read remote data instead of localStorage.
      window._portalRemote = isRemote ? remoteSnapshot : null;
      try {
        el.innerHTML = renderModernPortalShell(client, isRemote ? (remoteSnapshot.branding||{}) : null);
      } catch (renderErr) {
        // Surface the error so we can debug instead of staying stuck on Loading
        console.error('Portal render failed:', renderErr);
        el.innerHTML = '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#F8FAFC;padding:24px"><div style="max-width:560px;text-align:left;color:#991B1B"><h2 style="margin:0 0 12px">Portal failed to render</h2><p style="font-size:14px;color:#7C2D12;margin:0 0 12px">A code error happened while building this page. Details below — please screenshot and send to your platform owner.</p><pre style="background:#FEF2F2;padding:14px;border-radius:8px;border:1px solid #FCA5A5;font-size:12px;overflow:auto;white-space:pre-wrap;color:#7F1D1D">' + (renderErr && renderErr.stack ? renderErr.stack.replace(/</g,'&lt;') : (renderErr && renderErr.message ? renderErr.message : String(renderErr))) + '</pre></div></div>';
      }
    }

    // ──────────── MODERN PORTAL UI (SaaS-style) ────────────
    function renderModernPortalShell(client, remoteBranding) {
      const settings = JSON.parse(localStorage.getItem('settings'))||DEFAULT_SETTINGS;
      const escH = s => (s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      const bizName = (remoteBranding && remoteBranding.businessName) || settings.businessName || DEFAULT_SETTINGS.businessName;
      const ownerName = (remoteBranding && remoteBranding.ownerName) || settings.name || DEFAULT_SETTINGS.name;
      const initials = (client.name||'?').split(/\s+/).map(w=>w[0]).filter(Boolean).slice(0,2).join('').toUpperCase() || 'C';
      const deliverables = client.deliverables || [];
      // Merge in client messages sent through portal.html (stored server-side as
      // portal-msgs:<token> and synced down), so portal replies show in the thread
      // — not just in email/push. Owner side reads its synced localStorage; remote
      // client view reads the snapshot copy if present.
      const _portalMsgs = (function(){
        try {
          const tok = client.portalToken || '';
          const rec = window._portalRemote
            ? (window._portalRemote.portalMsgs || null)
            : JSON.parse(localStorage.getItem('portal-msgs:' + tok) || '{}');
          const arr = rec && Array.isArray(rec.msgs) ? rec.msgs : [];
          return arr.map(m => ({ from: 'client', message: m.message, timestamp: m.at, fromPortal: true }));
        } catch (e) { return []; }
      })();
      const messages = (client.messages||[]).concat(_portalMsgs)
        .slice().sort((a,b) => (a.timestamp||'').localeCompare(b.timestamp||''));
      const docs = window._portalRemote ? (window._portalRemote.documents||[]) : getDocsForClient(client.id);
      const unsignedDocs = docs.filter(d => d.status !== 'signed').length;
      const status = client.status || 'Active';
      const statusColors = { Active:'#10B981', Lead:'#F59E0B', Completed:'var(--brand-primary)', Paused:'#94A3B8' };
      const statusColor = statusColors[status] || '#64748B';
      const stripeReady = window._portalRemote
        ? !!(window._portalRemote.stripe && window._portalRemote.stripe.proxyUrl)
        : !!(getData('stripeSettings')||{}).proxyUrl;
      const price = Number(client.price)||0;
      // Booking config — only show "Schedule a Call" if it's enabled in settings
      const booking = window._portalRemote
        ? (window._portalRemote.booking || null)
        : (function(){
            try {
              const bs = JSON.parse(localStorage.getItem('bookingSettings')||'{}');
              if (!bs || !bs.bookingToken || !bs.enabled) return null;
              const base = (JSON.parse(localStorage.getItem('settings'))||{}).portalBaseUrl || window.location.href.split('#')[0];
              return { enabled: true, token: bs.bookingToken, url: (((window.location.origin && /^https?:/.test(window.location.origin)) ? window.location.origin : 'https://thehelpctr.com') + '/booking.html?u=' + bs.bookingToken), label: bs.label || 'Schedule a Call' };
            } catch(e){ return null; }
          })();

      return `
      <style>
        .pp-page { min-height:100vh; background:#F1F5F9; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; color:#0F172A; padding-bottom:env(safe-area-inset-bottom); }
        .pp-hero { background:linear-gradient(135deg,#0F172A 0%,#1E293B 50%,#312E81 100%); color:#fff; padding:24px 24px 80px; padding-top:calc(24px + env(safe-area-inset-top)); }
        .pp-hero-row { display:flex; align-items:center; gap:14px; max-width:1100px; margin:0 auto; }
        .pp-logo { width:42px; height:42px; background:linear-gradient(135deg,var(--brand-primary),#7C3AED); border-radius:10px; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:800; font-size:18px; flex-shrink:0; box-shadow:0 4px 12px rgba(124,58,237,0.4); }
        .pp-biz { flex:1; min-width:0 }
        .pp-biz-name { font-weight:700; font-size:16px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .pp-biz-sub { font-size:11px; color:#94A3B8; letter-spacing:.5px; text-transform:uppercase; margin-top:2px; }
        .pp-hero-card { max-width:1100px; margin:24px auto 0; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:16px; padding:24px; backdrop-filter:blur(8px); display:flex; gap:18px; align-items:center; flex-wrap:wrap; }
        .pp-avatar { width:64px; height:64px; border-radius:50%; background:linear-gradient(135deg,var(--brand-primary),#7C3AED); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; font-size:22px; flex-shrink:0; }
        .pp-greeting h1 { font-size:24px; font-weight:700; margin:0 0 4px; line-height:1.2; }
        .pp-greeting p { margin:0; color:#CBD5E1; font-size:14px; }
        .pp-status-pill { padding:5px 12px; border-radius:99px; background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.2); font-size:11px; font-weight:700; letter-spacing:.4px; text-transform:uppercase; }
        .pp-status-dot { display:inline-block; width:8px; height:8px; border-radius:50%; background:${statusColor}; margin-right:6px; vertical-align:middle; box-shadow:0 0 0 3px ${statusColor}33; }
        .pp-content { max-width:1100px; margin:-56px auto 24px; padding:0 16px; position:relative; z-index:2; }
        .pp-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); gap:12px; margin-bottom:20px; }
        .pp-stat { background:#fff; border-radius:14px; padding:16px 18px; box-shadow:0 1px 3px rgba(15,23,42,0.06), 0 8px 24px rgba(15,23,42,0.05); }
        .pp-stat-icon { font-size:18px; opacity:0.85; }
        .pp-stat-label { font-size:11px; font-weight:700; color:#64748B; text-transform:uppercase; letter-spacing:.5px; margin:8px 0 4px; }
        .pp-stat-value { font-size:24px; font-weight:800; color:#0F172A; line-height:1.1; }
        .pp-stat-sub { font-size:11px; color:#94A3B8; margin-top:4px; }
        .pp-tabs { display:flex; gap:4px; background:#fff; padding:4px; border-radius:12px; margin-bottom:18px; overflow-x:auto; -webkit-overflow-scrolling:touch; box-shadow:0 1px 3px rgba(15,23,42,0.06); }
        .pp-tab { flex:1 1 auto; min-width:max-content; padding:9px 14px; border:none; background:none; font-size:13px; font-weight:600; color:#64748B; cursor:pointer; border-radius:8px; white-space:nowrap; transition:all .15s; }
        .pp-tab.active { background:linear-gradient(135deg,var(--brand-primary),#7C3AED); color:#fff; box-shadow:0 2px 8px rgba(66,103,178,0.3); }
        .pp-section { background:#fff; border-radius:16px; padding:24px; margin-bottom:16px; box-shadow:0 1px 3px rgba(15,23,42,0.06); }
        .pp-section-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; gap:10px; flex-wrap:wrap; }
        .pp-section-title { font-size:15px; font-weight:700; color:#0F172A; display:flex; align-items:center; gap:8px; }
        .pp-section-title .pp-count { background:#EEF2FF; color:var(--brand-primary); font-size:11px; font-weight:700; padding:2px 8px; border-radius:99px; }
        .pp-progress { background:#E2E8F0; border-radius:99px; height:10px; overflow:hidden; margin:6px 0 8px; }
        .pp-progress-fill { background:linear-gradient(90deg,#10B981,#3B82F6); height:100%; border-radius:99px; transition:width .4s ease; }
        .pp-row { display:flex; justify-content:space-between; align-items:center; padding:14px 0; border-bottom:1px solid #F1F5F9; gap:12px; flex-wrap:wrap; }
        .pp-row:last-child { border-bottom:none; }
        .pp-row-title { font-weight:600; color:#0F172A; font-size:14px; }
        .pp-row-sub { font-size:12px; color:#64748B; margin-top:3px; }
        .pp-badge { font-size:10px; font-weight:700; padding:3px 9px; border-radius:99px; letter-spacing:.4px; }
        .pp-badge.signed { background:rgba(16,185,129,0.12); color:#10B981; }
        .pp-badge.viewed { background:rgba(245,158,11,0.12); color:#F59E0B; }
        .pp-badge.sent { background:rgba(66,103,178,0.12); color:var(--brand-primary); }
        .pp-badge.paid { background:rgba(16,185,129,0.12); color:#10B981; }
        .pp-badge.pending { background:rgba(245,158,11,0.12); color:#F59E0B; }
        .pp-btn { font-family:inherit; font-size:13px; font-weight:600; padding:9px 16px; border-radius:8px; border:none; cursor:pointer; transition:transform .12s; }
        .pp-btn:active { transform:scale(0.97); }
        .pp-btn-primary { background:linear-gradient(135deg,var(--brand-primary),#7C3AED); color:#fff; }
        .pp-btn-primary:hover { box-shadow:0 4px 14px rgba(66,103,178,0.35); }
        .pp-btn-outline { background:#fff; color:#475569; border:1px solid #E2E8F0; }
        .pp-btn-success { background:linear-gradient(135deg,#10B981,#059669); color:#fff; padding:14px 22px; font-size:15px; font-weight:700; width:100%; }
        .pp-btn-stripe { background:linear-gradient(135deg,#635BFF,#4F45E0); color:#fff; padding:14px; font-size:15px; font-weight:700; width:100%; letter-spacing:.3px; margin-top:14px; box-shadow:0 4px 14px rgba(99,91,255,0.35); }
        .pp-msg-list { max-height:340px; overflow-y:auto; margin-bottom:16px; display:flex; flex-direction:column; gap:8px; padding:6px 4px; }
        .pp-bubble { max-width:80%; padding:10px 14px; border-radius:14px; font-size:14px; line-height:1.5; word-break:break-word; }
        .pp-bubble.owner { background:#F1F5F9; color:#0F172A; border-radius:14px 14px 14px 4px; align-self:flex-start; }
        .pp-bubble.client { background:linear-gradient(135deg,var(--brand-primary),var(--brand-primary-light)); color:#fff; border-radius:14px 14px 4px 14px; align-self:flex-end; }
        .pp-bubble-meta { font-size:10px; opacity:0.75; margin-top:6px; }
        .pp-empty { text-align:center; color:#94A3B8; padding:18px 0; font-size:13px; }
        .pp-deliv { padding:14px; border:1px solid #F1F5F9; border-radius:12px; margin-bottom:10px; transition:border-color .12s, box-shadow .12s; }
        .pp-deliv:hover { border-color:var(--brand-primary); box-shadow:0 4px 12px rgba(66,103,178,0.08); }
        .pp-deliv-iframe { margin-top:10px; width:100%; height:520px; border:1px solid #E2E8F0; border-radius:10px; background:#fff; }
        @media (max-width:600px) { .pp-content { padding:0 12px; margin-top:-44px; } .pp-section { padding:18px; border-radius:14px; } .pp-stat { padding:14px; } .pp-stat-value { font-size:20px; } .pp-hero { padding:18px 16px 80px; } }
      </style>
      <div class="pp-page">
        <header class="pp-hero">
          <div class="pp-hero-row">
            <div class="pp-logo">${(bizName||'H')[0]}</div>
            <div class="pp-biz"><div class="pp-biz-name">${escH(bizName)}</div><div class="pp-biz-sub">Client Portal</div></div>
            <span class="pp-status-pill"><span class="pp-status-dot"></span>${escH(status)}</span>
          </div>
          <div class="pp-hero-card">
            <div class="pp-avatar">${escH(initials)}</div>
            <div class="pp-greeting" style="flex:1;min-width:200px">
              <h1>Welcome, ${escH(client.name||'')}</h1>
              <p>${escH(client.businessName||'')}${client.businessName && client.service ? ' · ' : ''}${escH(client.service||'')}</p>
            </div>
            ${!window._portalShareMode ? `<button onclick="ppForwardPortal()" class="pp-btn pp-btn-outline" style="background:rgba(255,255,255,0.15);color:#fff;border-color:rgba(255,255,255,0.3);white-space:nowrap"><span class="icon icon-sm" data-icon="send" style="margin-right:6px;vertical-align:-2px"></span>Forward for Review</button>` : ''}
          </div>
        </header>
        <main class="pp-content">
          <div class="pp-stats">
            <div class="pp-stat">
              <div class="pp-stat-icon">📊</div>
              <div class="pp-stat-label">Project</div>
              <div class="pp-stat-value">${client.projectStatus||0}%</div>
              <div class="pp-progress"><div class="pp-progress-fill" style="width:${Math.max(0,Math.min(100,client.projectStatus||0))}%"></div></div>
              <div class="pp-stat-sub">complete</div>
            </div>
            <div class="pp-stat">
              <div class="pp-stat-icon">📄</div>
              <div class="pp-stat-label">Documents</div>
              <div class="pp-stat-value">${docs.length}</div>
              <div class="pp-stat-sub">${unsignedDocs ? unsignedDocs+' awaiting your signature' : 'all signed'}</div>
            </div>
            <div class="pp-stat">
              <div class="pp-stat-icon">📦</div>
              <div class="pp-stat-label">Deliverables</div>
              <div class="pp-stat-value">${deliverables.length}</div>
              <div class="pp-stat-sub">${deliverables.length ? 'available to review' : 'pending'}</div>
            </div>
            <div class="pp-stat">
              <div class="pp-stat-icon">🧾</div>
              <div class="pp-stat-label">Invoice</div>
              <div class="pp-stat-value">$${price.toLocaleString()}</div>
              <div class="pp-stat-sub"><span class="pp-badge ${client.paid?'paid':'pending'}">${client.paid?'PAID':'PENDING'}</span></div>
            </div>
          </div>

          <div class="pp-tabs" id="pp-tabs">
            <button class="pp-tab active" onclick="ppShowTab('docs',this)">📄 Documents${unsignedDocs?` <span style="background:#EF4444;color:#fff;padding:1px 7px;border-radius:99px;font-size:10px;margin-left:4px">${unsignedDocs}</span>`:''}</button>
            <button class="pp-tab" onclick="ppShowTab('deliverables',this)">📦 Deliverables</button>
            <button class="pp-tab" onclick="ppShowTab('invoice',this)">🧾 Invoice</button>
            <button class="pp-tab" onclick="ppShowTab('messages',this)">💬 Messages${messages.filter(m=>m.from==='owner'&&!m.read).length?' •':''}</button>
          </div>

          ${booking ? `<section class="pp-pane" style="display:block">
            <div class="pp-section" style="background:linear-gradient(135deg,#1E5BC0,#4A86DD);color:#fff;border:none">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px">
                <div>
                  <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;opacity:0.85;margin-bottom:4px">Need to talk?</div>
                  <div style="font-size:18px;font-weight:700">${escH(booking.label)}</div>
                  <div style="font-size:13px;opacity:0.85;margin-top:4px">Pick a time that works for you — automatic confirmations.</div>
                </div>
                <a href="${escH(booking.url)}" target="_blank" rel="noopener" class="pp-btn" style="background:#fff;color:#1E5BC0;text-decoration:none;font-weight:700;padding:12px 20px;display:inline-block;border-radius:10px;flex-shrink:0">Book a time →</a>
              </div>
            </div>
          </section>` : ''}

          <section id="pp-pane-docs" class="pp-pane">
            <div class="pp-section">
              <div class="pp-section-head"><div class="pp-section-title">📄 Documents <span class="pp-count">${docs.length}</span></div></div>
              ${docs.length ? docs.sort((a,b)=>(b.sentAt||'').localeCompare(a.sentAt||'')).map(d => {
                const sentDate = d.sentAt ? new Date(d.sentAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '';
                const isInv = /invoice|receipt/i.test(d.type||'');
                const badgeClass = (d.status === 'signed' || d.status === 'paid') ? 'signed' : d.status === 'viewed' ? 'viewed' : 'sent';
                const badgeText = isInv
                  ? (d.status === 'paid' ? '✓ PAID' : d.status === 'viewed' ? 'VIEWED' : 'INVOICE — VIEW & PAY')
                  : (d.status === 'signed' ? '✓ SIGNED' : d.status === 'viewed' ? 'VIEWED' : 'NEEDS YOUR SIGNATURE');
                const ownerSigned = d.ownerSignedBy ? '<span class="pp-badge signed" style="margin-left:6px">✓ '+escH(d.ownerSignedBy||(JSON.parse(localStorage.getItem('settings'))||DEFAULT_SETTINGS).name||'PROVIDER')+' SIGNED</span>' : '';
                return `<div class="pp-row">
                  <div style="flex:1;min-width:200px">
                    <div class="pp-row-title">${escH(d.title)}</div>
                    <div class="pp-row-sub">Sent ${sentDate} · <span class="pp-badge ${badgeClass}">${badgeText}</span> ${d.ownerSignedBy?'<span class="pp-badge signed" style="margin-left:6px">✓ PROVIDER SIGNED</span>':''}</div>
                  </div>
                  <div style="display:flex;gap:6px;flex-wrap:wrap">
                    <button class="pp-btn pp-btn-primary" onclick="openPortalDoc('${d.id}')">${isInv?(d.status==='paid'?'View Invoice':'View &amp; Pay →'):(d.status==='signed'?'View Signed':'Review &amp; Sign →')}</button>
                    <button class="pp-btn pp-btn-outline" onclick="ppPrintDoc('${d.id}')"><span class="icon icon-sm" data-icon="print" style="margin-right:6px;vertical-align:-2px"></span>Print</button>
                    <button class="pp-btn pp-btn-outline" onclick="ownerDeleteClientDoc('${d.id}')" style="border-color:#DC2626;color:#DC2626" title="Remove this document from the client portal">× Remove</button>
                  </div>
                </div>`;
              }).join('') : '<div class="pp-empty">No documents yet. New documents appear here when sent.</div>'}
            </div>
          </section>

          <section id="pp-pane-deliverables" class="pp-pane" style="display:none">
            <div class="pp-section">
              <div class="pp-section-head">
                <div class="pp-section-title">📦 Deliverables <span class="pp-count">${deliverables.length}</span></div>
                ${(!window._portalShareMode && deliverables.length) ? `<button class="pp-btn pp-btn-outline" onclick="ppOpenShareModal()" title="Forward selected deliverables to a team member"><span class="icon icon-sm" data-icon="send" style="margin-right:6px;vertical-align:-2px"></span>Share with Team</button>` : ''}
              </div>
              ${deliverables.length ? deliverables.map(d => {
                if (!d.url) return `<div class="pp-deliv"><div style="flex:1"><div class="pp-row-title">${escH(d.name||'(unnamed)')}</div>${d.description?`<div class="pp-row-sub">${escH(d.description)}</div>`:''}<div style="font-size:12px;color:#94A3B8;margin-top:6px">No file or link attached yet.</div></div></div>`;
                const url = d.url;
                const isHttpUrl = /^https?:\/\//i.test(url);
                const ext = (url.split('?')[0].split('#')[0].match(/\.([a-z0-9]+)$/i)||['',''])[1].toLowerCase();
                const isOffice = /^(docx?|xlsx?|pptx?)$/.test(ext);
                const isPdf = ext === 'pdf';
                const isImage = /^(png|jpe?g|gif|svg|webp)$/.test(ext);
                const isText = /^(txt|md|html?|csv)$/.test(ext);
                const isData = /^data:/i.test(url);
                const isSite = isHttpUrl && !ext;
                // "Read" URL — for office docs, route through Google Docs Viewer
                // so the client can read in-browser instead of getting a download.
                let readUrl = url;
                if (isOffice && isHttpUrl) {
                  readUrl = 'https://docs.google.com/viewer?url=' + encodeURIComponent(url) + '&embedded=true';
                }
                // Download URL — same URL but we render with `download` attribute
                // and a hint, browsers honor it for same-origin files.
                const downloadName = (d.name || 'deliverable').replace(/[^a-z0-9._ -]/gi, '_').slice(0,80);
                return `<div class="pp-deliv">
                  <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap">
                    <div style="flex:1;min-width:200px">
                      <div class="pp-row-title">${escH(d.name||'(unnamed)')}</div>
                      ${d.description?`<div class="pp-row-sub">${escH(d.description)}</div>`:''}
                      <div style="font-size:11.5px;color:#94A3B8;margin-top:4px">${isOffice?'Word/Excel/PowerPoint':isPdf?'PDF':isImage?'Image':isText?'Text/HTML':isSite?'Web link':isData?'Inline':'File'}${ext?' · .'+ext:''}</div>
                    </div>
                    <div style="display:flex;gap:6px;flex-wrap:wrap">
                      ${isSite ? `<button class="pp-btn pp-btn-outline" onclick="ppToggleSitePreview('${d.id}')"><span class="icon icon-sm" data-icon="eye" style="margin-right:6px;vertical-align:-2px"></span>Preview Inline</button>` : ''}
                      <button class="pp-btn pp-btn-primary" onclick="ppOpenDeliverableInline('${d.id}', ${JSON.stringify(readUrl).replace(/"/g,'&quot;')}, ${JSON.stringify(d.name||'').replace(/"/g,'&quot;')})"><span class="icon icon-sm" data-icon="eye" style="margin-right:6px;vertical-align:-2px"></span>Read</button>
                      <a class="pp-btn pp-btn-outline" href="${escH(url)}" target="_blank" rel="noopener" download="${escH(downloadName)}"><span class="icon icon-sm" data-icon="download" style="margin-right:6px;vertical-align:-2px"></span>Download</a>
                      ${d.addedVia === 'quick-upload' ? `<button class="pp-btn pp-btn-outline" onclick="ppDeleteQuickUpload('${client.portalToken}','${d.id}', this)" style="border-color:#DC2626;color:#DC2626" title="Remove this uploaded deliverable">× Remove</button>` : ''}
                    </div>
                  </div>
                  ${isSite?`<iframe id="pp-iframe-${d.id}" class="pp-deliv-iframe" style="display:none" src="" data-src="${escH(url)}" title="${escH(d.name)}"></iframe>`:''}
                </div>`;
              }).join('') : '<div class="pp-empty">No deliverables added yet.</div>'}
            </div>
          </section>

          <section id="pp-pane-invoice" class="pp-pane" style="display:none">
            <div class="pp-section">
              <div class="pp-section-head"><div class="pp-section-title">🧾 Invoice ${client.invoiceNumber?`<span class="pp-count">${escH(client.invoiceNumber)}</span>`:''}</div><span class="pp-badge ${client.paid?'paid':'pending'}">${client.paid?'PAID':'PENDING'}</span></div>
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px">
                <div>
                  <div class="pp-row-title">${escH(client.service||'Service')}</div>
                  <div class="pp-row-sub">${client.invoiceNumber?'Invoice '+escH(client.invoiceNumber):''}</div>
                </div>
                <div style="font-size:32px;font-weight:800;color:#0F172A">$${price.toLocaleString()}</div>
              </div>
              ${(!client.paid && stripeReady && price > 0) ? `
                <button class="pp-btn pp-btn-stripe" onclick="ppPayInvoice('${client.id}')">💳 Pay $${price.toLocaleString()} with Stripe</button>
                <div style="margin-top:10px;font-size:11px;color:#94A3B8;text-align:center">Secure checkout via Stripe. Cards, Apple Pay, Google Pay accepted.</div>` : ''}
              ${client.paid ? '<div style="margin-top:14px;padding:12px;background:#ECFDF5;border:1px solid #A7F3D0;border-radius:10px;color:#065F46;font-size:13px;text-align:center;font-weight:600">✓ Thank you — payment received</div>' : ''}
            </div>
          </section>

          <section id="pp-pane-messages" class="pp-pane" style="display:none">
            <div class="pp-section">
              <div class="pp-section-head"><div class="pp-section-title">💬 Messages <span class="pp-count">${messages.length}</span></div></div>
              ${messages.length ? `<div class="pp-msg-list">${messages.map(m => {
                const isOwner = m.from === 'owner';
                const time = m.timestamp ? new Date(m.timestamp).toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}) : '';
                return `<div style="display:flex;justify-content:${isOwner?'flex-start':'flex-end'}">
                  <div class="pp-bubble ${isOwner?'owner':'client'}">
                    ${(m.message||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\\n/g,'<br>')}
                    <div class="pp-bubble-meta">${isOwner?escH(ownerName):'You'} · ${escH(time)}</div>
                  </div>
                </div>`;
              }).join('')}</div>` : '<div class="pp-empty">No messages yet. Send one below to start the conversation.</div>'}
              <div id="portal-msg-success" style="display:none;color:#10B981;margin-bottom:12px;font-size:13px;font-weight:600">✅ Message sent! ${escH(ownerName)} will be in touch soon.</div>
              <textarea id="portal-msg" placeholder="Type your message here..." style="width:100%;padding:12px;border:1px solid #E2E8F0;border-radius:10px;font-size:15px;height:100px;resize:vertical;margin-bottom:10px;font-family:inherit;outline:none;background:#FAFAFA"></textarea>
              <button class="pp-btn pp-btn-primary" style="padding:12px 22px;font-size:14px" onclick="sendPortalMessage('${client.id}')">Send Message</button>
            </div>
          </section>

          <section class="pp-pane" style="display:block">
            <div class="pp-section" style="background:#FAFAFA;border:1px dashed #E2E8F0;text-align:center">
              <div class="pp-section-head" style="justify-content:center"><div class="pp-section-title">⭐ Loved working with ${escH(bizName)}?</div></div>
              <div style="font-size:13px;color:#64748B;margin:6px 0 14px">A quick review helps other leaders find us — it takes 30 seconds.</div>
              <a href="https://thehelpctr.com/review.html" target="_blank" rel="noopener" class="pp-btn pp-btn-primary" style="display:inline-block;text-decoration:none;padding:12px 24px;font-size:14px">⭐ Leave a Review →</a>
            </div>
          </section>

          <footer style="text-align:center;color:#94A3B8;font-size:11px;padding:24px 0 8px">Powered by ${escH(bizName)}</footer>
        </main>
      </div>`;
    }

    // Tab switcher (used inside the portal)
    function ppShowTab(name, btn) {
      document.querySelectorAll('.pp-pane').forEach(p => p.style.display='none');
      const target = document.getElementById('pp-pane-'+name);
      if (target) target.style.display = '';
      document.querySelectorAll('#pp-tabs .pp-tab').forEach(b => b.classList.remove('active'));
      if (btn) btn.classList.add('active');
    }

    // Star-rating widget on the portal — sets a temporary _ppRating var.
    let _ppRating = 0;
    function ppRate(n) {
      _ppRating = n;
      document.querySelectorAll('#pp-stars [data-star]').forEach(el => {
        el.style.color = (parseInt(el.dataset.star,10) <= n) ? '#F59E0B' : '#CBD5E1';
      });
    }

    async function ppSubmitFeedback(clientId) {
      if (!_ppRating) { alert('Please tap a star to rate first.'); return; }
      const note = (document.getElementById('pp-feedback-msg')?.value || '').trim();
      const entry = {
        id: 'fb-' + Math.random().toString(36).slice(2,9) + Date.now().toString(36),
        clientId, rating: _ppRating, note, submittedAt: new Date().toISOString()
      };
      // On client device → POST to public action endpoint
      if (window._portalRemote) {
        const token = (location.hash.split('token=')[1] || '').trim();
        try {
          const r = await fetch(PORTAL_PUBLIC_PB + encodeURIComponent(token) + '/action', {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ op:'feedback', rating: _ppRating, note })
          });
          if (!r.ok) {
            const e = await r.json().catch(()=>({}));
            alert('Send failed: ' + (e.error || ('HTTP ' + r.status)));
            return;
          }
        } catch (e) { alert('Send failed: ' + e.message); return; }
      } else {
        // Owner preview — write to local clientFeedback
        const list = JSON.parse(localStorage.getItem('clientFeedback')||'[]');
        list.push(entry);
        localStorage.setItem('clientFeedback', JSON.stringify(list));
      }
      const box = document.getElementById('pp-feedback-box');
      if (box) box.innerHTML = '<div style="text-align:center;padding:24px 0;color:#10B981;font-weight:600;font-size:15px">✓ Thank you for your feedback!</div>';
      _ppRating = 0;
    }

    // Toggle inline site/HTML preview for a deliverable
    function ppToggleSitePreview(deliverableId) {
      const f = document.getElementById('pp-iframe-'+deliverableId);
      if (!f) return;
      if (f.style.display === 'none') {
        if (!f.src) f.src = f.dataset.src;
        f.style.display = 'block';
      } else {
        f.style.display = 'none';
      }
    }

    // Pay invoice — works on both owner preview and client remote view
    function ppPayInvoice(clientId) {
      let client;
      if (window._portalRemote && window._portalRemote.client) {
        client = window._portalRemote.client;
      } else {
        client = (getData('clients')||[]).find(c => c.id === clientId);
      }
      if (!client) return;
      // Build stripe args from snapshot if remote, else from local
      if (window._portalRemote) {
        const sc = window._portalRemote.stripe || {};
        // Mirror the remote stripe config into local-shaped settings for the helper
        const prev = JSON.parse(localStorage.getItem('stripeSettings')||'{}');
        const merged = Object.assign({}, prev, sc);
        // Don't persist; use a temporary in-memory shim
        const original = localStorage.getItem('stripeSettings');
        try {
          localStorage.setItem('stripeSettings', JSON.stringify(merged));
          openStripeCheckoutForInvoice({
            clientId: client.id, clientName: client.name, clientEmail: client.email||'',
            amountUsd: Number(client.price)||0,
            description: (client.service||'Service')+' — '+(client.invoiceNumber||''),
            invoiceNumber: client.invoiceNumber||''
          });
        } finally {
          // restore (we may not return here if redirect happens, but be safe)
          setTimeout(() => { if (original !== null) localStorage.setItem('stripeSettings', original); }, 5000);
        }
      } else {
        openStripeCheckoutForInvoice({
          clientId: client.id, clientName: client.name, clientEmail: client.email||'',
          amountUsd: Number(client.price)||0,
          description: (client.service||'Service')+' — '+(client.invoiceNumber||''),
          invoiceNumber: client.invoiceNumber||''
        });
      }
    }

    // Print a portal document — opens a clean print window with the doc + signatures
    function ppPrintDoc(docId) {
      const doc = getClientDoc(docId);
      if (!doc) { alert('Document not found.'); return; }
      const escH = s => (s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      // Render content with the same sig-line treatment as the on-screen reader
      const lines = (doc.content||'').split('\\n');
      let bodyHtml = '';
      for (const line of lines) {
        if (/:\\s*_{3,}/.test(line)) {
          const segs = line.split(/\\s{2,}|\\t+/).map(s=>s.trim()).filter(Boolean);
          const renderSig = seg => {
            const m = seg.match(/^(.+?):\\s*(_{3,})\\s*$/);
            if (!m) return '<span>'+escH(seg)+'</span>';
            return '<div class="sig-line"><span class="sig-label">'+escH(m[1].trim())+':</span><span class="sig-blank"></span></div>';
          };
          bodyHtml += segs.length > 1 ? '<div class="sig-row">'+segs.map(renderSig).join('')+'</div>' : renderSig(segs[0]||line.trim());
        } else if (/^[━─=]{3,}$/.test(line.trim())) {
          bodyHtml += '<hr>';
        } else if (line.trim() === '') {
          bodyHtml += '<div style="height:8px"></div>';
        } else {
          bodyHtml += '<div style="white-space:pre-wrap;line-height:1.6">'+escH(line)+'</div>';
        }
      }
      const sigBlock = (doc.status==='signed' || doc.ownerSignedBy) ? '<div style="margin-top:30px;padding:16px;border:2px solid #10B981;border-radius:8px"><div style="font-weight:700;color:#10B981;margin-bottom:10px">SIGNATURES</div>'
        + (doc.ownerSignedBy ? '<div style="margin-bottom:14px"><div style="font-size:12px;color:#666">Provider — '+escH(doc.ownerSignedBy)+' on '+new Date(doc.ownerSignedAt).toLocaleString()+'</div>'+(doc.ownerSignatureType==='drawn'?'<img src="'+doc.ownerSignatureData+'" style="max-width:280px;display:block;margin-top:6px">':'<div style="font-family:\'Brush Script MT\',\'Lucida Handwriting\',cursive;font-size:32px;margin-top:4px">'+escH(doc.ownerSignatureData||doc.ownerSignedBy)+'</div>')+'</div>' : '')
        + (doc.signedBy ? '<div><div style="font-size:12px;color:#666">Client — '+escH(doc.signedBy)+' on '+new Date(doc.signedAt).toLocaleString()+'</div>'+(doc.signatureType==='drawn'?'<img src="'+doc.signatureData+'" style="max-width:280px;display:block;margin-top:6px">':'<div style="font-family:\'Brush Script MT\',\'Lucida Handwriting\',cursive;font-size:32px;margin-top:4px">'+escH(doc.signatureData||doc.signedBy)+'</div>')+'</div>' : '')
        + '</div>' : '';
      const w = window.open('', '_blank', 'width=900,height=1100');
      if (!w) { alert('Please allow popups to print.'); return; }
      w.document.write('<!doctype html><html><head><title>'+escH(doc.title)+'</title><style>'
        + 'body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;margin:40px;color:#1a1a1a;line-height:1.6}'
        + 'h1{font-size:22px;border-bottom:2px solid var(--brand-primary);padding-bottom:8px;margin:0 0 18px}'
        + 'hr{border:none;border-top:1px solid #ccc;margin:14px 0}'
        + '.sig-line{display:flex;align-items:flex-end;gap:10px;margin:14px 0 8px;font-size:13px}'
        + '.sig-line .sig-label{font-weight:600;white-space:nowrap;padding-bottom:2px}'
        + '.sig-line .sig-blank{flex:1;border-bottom:1px solid #1a1a1a;height:24px;min-width:120px}'
        + '.sig-row{display:flex;gap:24px;margin:14px 0;flex-wrap:wrap}.sig-row .sig-line{margin:0;flex:1;min-width:200px}'
        + '@media print { @page { margin:0.6in } }'
        + '</style></head><body>'
        + '<h1>'+escH(doc.title)+'</h1>'
        + bodyHtml + sigBlock + '</body></html>');
      w.document.close();
      setTimeout(() => { w.focus(); w.print(); }, 300);
    }

    async function sendPortalMessage(clientId) {
      const msg = document.getElementById('portal-msg').value.trim();
      if (!msg) return;
      if (window._portalRemote) {
        // Client's device — POST to public action endpoint
        const token = (location.hash.split('token=')[1] || '').trim();
        try {
          const r = await fetch(PORTAL_PUBLIC_PB + encodeURIComponent(token) + '/action', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ op: 'message', message: msg })
          });
          if (!r.ok) {
            const e = await r.json().catch(()=>({}));
            alert('Send failed: ' + (e.error || ('HTTP ' + r.status)));
            return;
          }
          // Update in-memory snapshot so the new message renders immediately
          const c2 = window._portalRemote.client;
          if (c2) {
            c2.messages = c2.messages || [];
            c2.messages.push({ from:'client', message: msg, timestamp: new Date().toISOString(), read:false });
          }
        } catch (e) {
          alert('Send failed: ' + e.message);
          return;
        }
      } else {
        // Owner preview path
        const clients = getData('clients');
        const client = clients.find(c => c.id === clientId);
        if (client) {
          client.messages = client.messages || [];
          client.messages.push({ id: generateId(), from: 'client', message: msg, timestamp: new Date().toISOString(), read: false });
          setData('clients', clients);
        }
      }
      document.getElementById('portal-msg').value = '';
      const succ = document.getElementById('portal-msg-success');
      if (succ) succ.style.display = 'block';
      // Re-render
      const tok = (location.hash.split('token=')[1] || '').trim();
      if (tok && typeof showPortal === 'function') setTimeout(()=>showPortal(tok), 600);
    }

    // ── MESSAGES INBOX (owner-side) ─────────────────────────────────────────────
    // One unified inbox for BOTH conversation types:
    //   • Clients  — portal.html replies (portal-msgs:<token>) + in-portal messages
    //                on the client record (key 'client:<id>')
    //   • SaaS     — tenant messages in 'admin:tenant-messages', grouped by tenant
    //                slug (key 'saas:<slug>')
    // Read state is auto-set on open; a manual "Done" check-off lets the owner
    // file a handled thread away into the Done group.
    function _msgEsc(s){ return (s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
    function _msgTimeAgo(ts){
      if(!ts) return '';
      const d = new Date(ts); if(isNaN(d.getTime())) return '';
      const diff = (Date.now() - d.getTime())/1000;
      if(diff < 60) return 'just now';
      if(diff < 3600) return Math.floor(diff/60)+'m ago';
      if(diff < 86400) return Math.floor(diff/3600)+'h ago';
      if(diff < 604800) return Math.floor(diff/86400)+'d ago';
      return d.toLocaleDateString();
    }

    function _gatherAllThreads() {
      const threads = [];
      // 1) Regular clients
      const clients = (typeof getData === 'function' ? getData('clients') : null) || [];
      const lastRead = getData('msgLastRead') || {};
      clients.forEach(c => {
        const tok = c.portalToken || '';
        const msgs = [];
        (c.messages || []).forEach(m => msgs.push({ from: (m.from === 'owner' ? 'owner' : 'client'), message: m.message, ts: m.timestamp || '' }));
        try {
          const rec = JSON.parse(localStorage.getItem('portal-msgs:' + tok) || '{}');
          (rec.msgs || []).forEach(m => msgs.push({ from: 'client', message: m.message, ts: m.at || '' }));
        } catch (_) {}
        if (!msgs.length) return;
        msgs.sort((a, b) => (a.ts || '').localeCompare(b.ts || ''));
        const lr = lastRead[c.id] || '';
        const unread = msgs.filter(m => m.from === 'client' && (m.ts || '') > lr).length;
        threads.push({ type:'client', key:'client:'+c.id, id:c.id, name:c.name||'Client', email:c.email||'', portalToken:tok, msgs, last:msgs[msgs.length-1], unread });
      });
      // 2) SaaS tenants — group admin:tenant-messages by tenant slug
      const tmsgs = getData('admin:tenant-messages') || [];
      const tenants = (typeof getTenants === 'function' ? getTenants() : []) || [];
      const bySlug = {};
      tmsgs.forEach(m => { const s = m.tenant || '(unknown)'; (bySlug[s] = bySlug[s] || []).push(m); });
      Object.keys(bySlug).forEach(slug => {
        const arr = bySlug[slug].slice().sort((a,b) => (a.ts||'').localeCompare(b.ts||''));
        const tn = tenants.find(t => t.slug === slug) || {};
        const msgs = arr.map(m => ({ from: (m.from === 'owner' ? 'owner' : 'client'), message: (m.subject && m.from !== 'owner' ? (m.subject + '\n') : '') + (m.body||''), ts: m.ts || '' }));
        const unread = arr.filter(m => m.from !== 'owner' && !m.read).length;
        threads.push({ type:'saas', key:'saas:'+slug, id:slug, slug, name: tn.businessName || tn.name || slug, email: tn.email || (arr[arr.length-1]||{}).fromEmail || '', msgs, last:msgs[msgs.length-1], unread });
      });
      threads.sort((a, b) => ((b.last&&b.last.ts)||'').localeCompare((a.last&&a.last.ts)||''));
      return threads;
    }

    function updateMessagesBadge() {
      try {
        const done = getData('msgThreadDone') || {};
        const totalUnread = _gatherAllThreads()
          .filter(t => !done[t.key] || t.unread > 0)
          .reduce((n, t) => n + t.unread, 0);
        const badge = document.getElementById('nav-msg-badge');
        if (!badge) return;
        if (totalUnread > 0) { badge.textContent = totalUnread > 99 ? '99+' : String(totalUnread); badge.style.display = 'inline-block'; }
        else { badge.style.display = 'none'; }
      } catch (_) {}
    }
    setInterval(updateMessagesBadge, 15000);

    let _openMsgThreadKey = null;
    let _msgShowDone = false;
    function _renderMsgThreadCard(t, isDone) {
      const sendBtnStyle = 'white-space:nowrap;padding:10px 16px;background:linear-gradient(135deg,var(--brand-primary),#7C3AED);color:#fff;border:none;border-radius:10px;font-weight:700;cursor:pointer;font-family:inherit;font-size:14px';
      const openBtnStyle = 'font-size:13px;padding:8px 14px;background:#fff;border:1px solid #E2E8F0;border-radius:8px;color:#475569;cursor:pointer;font-weight:600;font-family:inherit';
      const open = _openMsgThreadKey === t.key;
      const initials = (t.name||'?').split(/\s+/).map(w=>w[0]).filter(Boolean).slice(0,2).join('').toUpperCase() || 'C';
      const lastMsg = (t.last && t.last.message) || '';
      const snippet = _msgEsc(lastMsg.slice(0,90)).replace(/\n/g,' ') + (lastMsg.length>90?'…':'');
      const isSaas = t.type === 'saas';
      const tag = isSaas
        ? '<span style="background:#EDE9FE;color:#7C3AED;font-size:9.5px;font-weight:700;padding:2px 7px;border-radius:99px;letter-spacing:.4px">SAAS</span>'
        : '<span style="background:#E0F2FE;color:#0369A1;font-size:9.5px;font-weight:700;padding:2px 7px;border-radius:99px;letter-spacing:.4px">CLIENT</span>';
      const avatarBg = isSaas ? 'linear-gradient(135deg,#7C3AED,#4F46E5)' : 'linear-gradient(135deg,var(--brand-primary),#7C3AED)';
      let html = '<div class="card" style="padding:0;overflow:hidden;margin-bottom:12px;border:1px solid '+(t.unread?'#C7D2FE':'#E2E8F0')+';'+(isDone?'opacity:0.72':'')+'">';
      html += '<div style="display:flex;align-items:center;gap:14px;padding:16px 18px;'+(t.unread?'background:#F5F7FF':'')+'">'
        + '<div onclick="toggleMsgDone(\''+t.key+'\')" title="'+(isDone?'Mark not done':'Check off as done')+'" style="width:24px;height:24px;border-radius:6px;border:2px solid '+(isDone?'#10B981':'#CBD5E1')+';background:'+(isDone?'#10B981':'#fff')+';color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;font-size:14px;font-weight:800">'+(isDone?'✓':'')+'</div>'
        + '<div onclick="toggleMsgThread(\''+t.key+'\')" style="display:flex;align-items:center;gap:14px;flex:1;min-width:0;cursor:pointer">'
        +   '<div style="width:44px;height:44px;border-radius:50%;background:'+avatarBg+';color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0">'+initials+'</div>'
        +   '<div style="flex:1;min-width:0">'
        +     '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">'+tag+'<span style="font-weight:700;color:#0F172A">'+_msgEsc(t.name)+'</span>'+(t.unread?'<span style="background:#4F46E5;color:#fff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:99px">'+t.unread+' NEW</span>':'')+'</div>'
        +     '<div style="font-size:13px;color:'+(t.unread?'#0F172A':'#64748B')+';margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+((t.last&&t.last.from==='owner')?'<span style="color:#94A3B8">You: </span>':'')+snippet+'</div>'
        +   '</div>'
        +   '<div style="text-align:right;flex-shrink:0"><div style="font-size:12px;color:#94A3B8">'+_msgTimeAgo(t.last&&t.last.ts)+'</div><div style="font-size:11px;color:#CBD5E1;margin-top:4px">'+(open?'▲':'▼')+'</div></div>'
        + '</div>'
        + '</div>';
      if (open) {
        html += '<div style="padding:6px 18px 18px;border-top:1px solid #F1F5F9">';
        html += '<div style="max-height:360px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;padding:14px 0">';
        (t.msgs||[]).forEach(m => {
          const mine = m.from === 'owner';
          html += '<div style="align-self:'+(mine?'flex-end':'flex-start')+';max-width:78%;background:'+(mine?'linear-gradient(135deg,var(--brand-primary),#7C3AED)':'#F1F5F9')+';color:'+(mine?'#fff':'#0F172A')+';padding:9px 13px;border-radius:14px;font-size:14px;line-height:1.5;white-space:pre-wrap;word-break:break-word">'+_msgEsc(m.message)+'<div style="font-size:10px;opacity:0.7;margin-top:4px">'+_msgTimeAgo(m.ts)+'</div></div>';
        });
        html += '</div>';
        const replyFn = isSaas ? ('replyToSaasThread(\''+t.slug+'\')') : ('replyToClientThread(\''+t.id+'\')');
        html += '<div style="display:flex;gap:8px;align-items:flex-end;margin-top:8px">'
          + '<textarea id="msg-reply-'+t.key.replace(/[^a-z0-9]/gi,'_')+'" rows="1" placeholder="Type a reply to '+_msgEsc(t.name)+'…" style="flex:1;padding:10px 12px;border:1px solid #CBD5E1;border-radius:10px;font-size:14px;font-family:inherit;resize:none;outline:none" oninput="this.style.height=\'auto\';this.style.height=Math.min(this.scrollHeight,120)+\'px\'"></textarea>'
          + '<button onclick="'+replyFn+'" style="'+sendBtnStyle+'">Send ✉</button>'
          + '</div>';
        html += '<div style="margin-top:10px;display:flex;gap:10px;flex-wrap:wrap;align-items:center">';
        if (!isSaas) html += '<button onclick="showPortal(\''+(t.portalToken||'')+'\')" style="'+openBtnStyle+'">Open Portal →</button>';
        html += (t.email
            ? '<span style="font-size:12px;color:#94A3B8">Replies email '+_msgEsc(t.email)+(isSaas?'.':' and post to their portal.')+'</span>'
            : '<span style="font-size:12px;color:#F59E0B">No email on file'+(isSaas?' — add one on the tenant.':' — reply will only post to their portal.')+'</span>');
        html += '</div>';
        html += '</div>';
      }
      html += '</div>';
      return html;
    }

    function renderMessagesInbox() {
      const wrap = document.getElementById('messages-inbox');
      if (!wrap) return;
      const all = _gatherAllThreads();
      updateMessagesBadge();
      if (!all.length) {
        wrap.innerHTML = '<div class="card" style="text-align:center;padding:48px 24px;color:#64748B"><div style="font-size:40px;margin-bottom:12px">💬</div><div style="font-weight:700;color:#0F172A;margin-bottom:6px">No messages yet</div><div style="font-size:14px">When a client or SaaS tenant sends you a message, the conversation shows up here.</div></div>';
        return;
      }
      const doneMap = getData('msgThreadDone') || {};
      // A thread with new unread resurfaces from Done automatically.
      const active = all.filter(t => !doneMap[t.key] || t.unread > 0);
      const done = all.filter(t => doneMap[t.key] && t.unread === 0);
      let html = '';
      if (!active.length) {
        html += '<div class="card" style="text-align:center;padding:28px 24px;color:#64748B;margin-bottom:12px"><div style="font-size:28px;margin-bottom:6px">✅</div><div style="font-weight:600;color:#0F172A">All caught up</div><div style="font-size:13px;margin-top:2px">No open conversations. Nicely done.</div></div>';
      } else {
        active.forEach(t => { html += _renderMsgThreadCard(t, false); });
      }
      if (done.length) {
        html += '<div onclick="_toggleMsgDoneGroup()" style="display:flex;align-items:center;gap:8px;cursor:pointer;margin:18px 4px 10px;color:#64748B;font-size:13px;font-weight:700;user-select:none">'
          + '<span>'+(_msgShowDone?'▼':'▶')+'</span><span>Done ('+done.length+')</span>'
          + '<span style="flex:1;height:1px;background:#E2E8F0"></span></div>';
        if (_msgShowDone) done.forEach(t => { html += _renderMsgThreadCard(t, true); });
      }
      wrap.innerHTML = html;
    }
    function _toggleMsgDoneGroup(){ _msgShowDone = !_msgShowDone; renderMessagesInbox(); }

    function _markThreadRead(key) {
      if (key.indexOf('client:') === 0) {
        const id = key.slice(7);
        const lastRead = getData('msgLastRead') || {};
        lastRead[id] = new Date().toISOString();
        setData('msgLastRead', lastRead);
      } else if (key.indexOf('saas:') === 0) {
        const slug = key.slice(5);
        const list = getData('admin:tenant-messages') || [];
        let changed = false;
        list.forEach(m => { if ((m.tenant||'(unknown)') === slug && m.from !== 'owner' && !m.read) { m.read = true; changed = true; } });
        if (changed) setData('admin:tenant-messages', list);
      }
    }

    function toggleMsgThread(key) {
      if (_openMsgThreadKey === key) {
        _openMsgThreadKey = null;
      } else {
        _openMsgThreadKey = key;
        _markThreadRead(key);
      }
      renderMessagesInbox();
    }

    function toggleMsgDone(key) {
      const done = getData('msgThreadDone') || {};
      if (done[key]) { delete done[key]; }
      else { done[key] = true; _markThreadRead(key); if (_openMsgThreadKey === key) _openMsgThreadKey = null; }
      setData('msgThreadDone', done);
      renderMessagesInbox();
    }

    async function replyToClientThread(clientId) {
      const ta = document.getElementById('msg-reply-client_' + clientId.replace(/[^a-z0-9]/gi,'_'));
      const text = (ta && ta.value || '').trim();
      if (!text) return;
      const clients = getData('clients') || [];
      const client = clients.find(c => c.id === clientId);
      if (!client) return;
      client.messages = client.messages || [];
      client.messages.push({ id: (typeof generateId==='function'?generateId():String(Date.now())), from: 'owner', message: text, timestamp: new Date().toISOString(), read: true });
      setData('clients', clients);
      // Republish the portal snapshot so the reply appears in the client's portal.
      try { if (typeof pbPushPortalSnapshot === 'function') pbPushPortalSnapshot(client); } catch (_) {}
      // Email fallback so they're notified even if the portal isn't open.
      if (client.email && typeof sendPortalNotificationEmail === 'function') {
        const biz = (JSON.parse(localStorage.getItem('settings'))||{}).businessName || 'your provider';
        sendPortalNotificationEmail(client, {
          subject: 'New message from ' + biz,
          heading: 'You have a new message',
          body: _msgEsc(text).replace(/\n/g,'<br>'),
          ctaLabel: 'Open Your Portal & Reply'
        });
      }
      if (ta) { ta.value = ''; ta.style.height = 'auto'; }
      _markThreadRead('client:' + clientId);
      _openMsgThreadKey = 'client:' + clientId;
      renderMessagesInbox();
      if (typeof showToast === 'function') showToast('Reply sent to ' + client.name, 'success');
    }

    async function replyToSaasThread(slug) {
      const ta = document.getElementById('msg-reply-saas_' + slug.replace(/[^a-z0-9]/gi,'_'));
      const text = (ta && ta.value || '').trim();
      if (!text) return;
      const tenants = (typeof getTenants === 'function' ? getTenants() : []) || [];
      const tn = tenants.find(t => t.slug === slug) || {};
      // Record the owner's reply in the thread (also shows in Settings → tenant inbox).
      const list = getData('admin:tenant-messages') || [];
      list.push({ id: (typeof generateId==='function'?generateId():String(Date.now())), tenant: slug, from: 'owner', fromName: 'You', subject: '(your reply)', body: text, ts: new Date().toISOString(), read: true });
      setData('admin:tenant-messages', list);
      // Email the tenant if we have an address.
      const to = tn.email || '';
      if (to && typeof HC_BACKEND !== 'undefined') {
        const settings = JSON.parse(localStorage.getItem('settings'))||{};
        const integrations = getData('integrationSettings') || {};
        const biz = settings.businessName || 'H.E.L.P. Center';
        const html = '<!doctype html><html><body style="font-family:-apple-system,Segoe UI,sans-serif;background:#F1F5F9;margin:0;padding:24px">'
          + '<table cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;margin:auto;background:#fff;border-radius:14px;overflow:hidden">'
          + '<tr><td style="background:linear-gradient(135deg,#0F172A,#312E81);padding:22px;color:#fff;font-size:20px;font-weight:700">'+_msgEsc(biz)+'</td></tr>'
          + '<tr><td style="padding:26px 24px;color:#1F2937;font-size:15px;line-height:1.6">'+_msgEsc(text).replace(/\n/g,'<br>')+'</td></tr>'
          + '</table></body></html>';
        try {
          await fetch(HC_BACKEND + '/api/email', {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ to, subject:'Message from '+biz, html, fromName: integrations.resendSenderName || biz, fromEmail: integrations.resendSenderEmail || undefined })
          });
        } catch (_) {}
      }
      if (ta) { ta.value = ''; ta.style.height = 'auto'; }
      _markThreadRead('saas:' + slug);
      _openMsgThreadKey = 'saas:' + slug;
      // Keep the old Settings inbox view in sync if it's on screen.
      if (typeof renderTenantInbox === 'function') { try { renderTenantInbox(); } catch(_){} }
      renderMessagesInbox();
      if (typeof showToast === 'function') showToast('Reply sent' + (to ? ' to ' + (tn.name||slug) : ''), 'success');
    }

    // ── NAVIGATION ─────────────────────────────────────────────────────────────
    function showPage(pageId, event) {
      // Tenant gate: block navigation to owner-only pages in a tenant copy.
      if (TENANT && !_tenantPageAllowed(pageId)) { pageId = 'dashboard'; event = null; }
      // Exit voice studio fullscreen overlay if navigating elsewhere — the
      // exit button is appended to document.body and would linger otherwise.
      if (pageId !== 'voice-studio') {
        const vsWrap = document.getElementById('voice-studio-frame-wrap');
        if (vsWrap && vsWrap.dataset.fullscreen === '1' && typeof _voiceStudioFullscreen === 'function') {
          _voiceStudioFullscreen();
        }
      }
      document.querySelectorAll('.page').forEach(p => { p.classList.add('hidden'); p.removeAttribute('aria-current'); });
      const target = document.getElementById(pageId + '-page');
      if (target) {
        target.classList.remove('hidden');
        target.setAttribute('aria-current', 'page');
        // A11y: move focus to the page heading so screen readers announce
        // the navigation (the h1 is given tabindex=-1 so it's programmatically focusable)
        const h1 = target.querySelector('h1, h2');
        if (h1) {
          if (!h1.hasAttribute('tabindex')) h1.setAttribute('tabindex', '-1');
          setTimeout(() => { try { h1.focus({ preventScroll: false }); } catch {} }, 0);
        }
      }
      document.querySelectorAll('.nav-link').forEach(n => { n.classList.remove('active'); n.removeAttribute('aria-current'); });
      if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
        event.currentTarget.setAttribute('aria-current', 'page');
      }
      if (window.innerWidth <= 768) closeSidebar();
      const renders = { dashboard: updateDashboard, clients: renderClients, messages: renderMessagesInbox, 'my-ideas': renderIdeasKanban, notes: renderNotes, 'business-file': renderBusinessFile, 'client-portal': renderPortalLinks, 'income-pathway': renderIncomeWizard, 'credit-pathway': renderBizCreditChecklist, settings: () => { loadSettingsPage(); loadIntegrationSettingsUI(); loadCalendarSubscriptionUI(); }, revenue: renderRevenue, calendar: renderCalendar, 'state-resources': renderStates, library: renderLibrary, guides: renderGuides,
  'career-pathway': () => { renderJobApps(); restoreCareerChecks(); loadCareerGoals(); if (typeof _a10xRefreshBfDropdown === 'function') _a10xRefreshBfDropdown(); },
  'youth-pathway': () => { renderCurriculum(); renderOutreach(); restoreYouthChecks(); loadYouthProgram(); loadYouthPlatform(); },
  'course-pathway': loadCoursePathway,
  'vibe-coder': initVibeCoder,
  'breakdowns': renderBreakdowns,
  'voice-studio': () => {
    const f = document.getElementById('voice-studio-frame');
    if (f && (!f.src || f.src === 'about:blank')) f.src = '/pb/voiceforge.html';
    // Default to full screen — voice studio needs all the room it can get.
    const wrap = document.getElementById('voice-studio-frame-wrap');
    if (wrap && wrap.dataset.fullscreen !== '1' && typeof _voiceStudioFullscreen === 'function') {
      _voiceStudioFullscreen();
    }
  },
  'saas-clients': renderSaasClientsPage,
  'personal-files': renderPersonalFiles,
  pricing: () => { renderPricingPage(); updateProposalPreview(); },
  strategy: () => { renderStrategyPage(); },
  // Merged: both initReportsAutoSave AND populateReportClientDropdowns ran here.
  // Previously two separate `reports` keys silently overwrote each other, so
  // initReportsAutoSave never ran. Now both run on every reports-page navigation.
  reports: () => { initReportsAutoSave(); populateReportClientDropdowns(); if (typeof renderReportsManuals === 'function') renderReportsManuals(); if (typeof renderReportsReports === 'function') renderReportsReports(); },
  'website-builder': () => { wbInit(); },
  booking: () => { renderBookingDashboard(); },
  'ai-projects': () => { renderAIProjectSkills(); },
  'my-profile': () => { loadProfileForm(); }
};
      if (renders[pageId] && typeof renders[pageId] === 'function') renders[pageId]();
      if (typeof setAiContext === 'function') setAiContext(pageId);
    }

    function showTab(tabId, event) {
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      const target = document.getElementById(tabId + '-tab');
      if (target) target.classList.add('active');
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      if (event && event.currentTarget) event.currentTarget.classList.add('active');
    }

    // ── MOBILE SIDEBAR ─────────────────────────────────────────────────────────
    function toggleSidebarCollapse() {
      const sb = document.querySelector('.sidebar');
      const mc = document.querySelector('.main-content');
      const btn = document.getElementById('sb-toggle-btn');
      const collapsed = sb.classList.toggle('collapsed');
      mc.classList.toggle('sidebar-collapsed', collapsed);
      if (btn) btn.textContent = collapsed ? '▶' : '◀ Collapse';
      localStorage.setItem('sidebarCollapsed', collapsed ? '1' : '0');
    }

    function toggleSidebar() {
      document.querySelector('.sidebar').classList.toggle('open');
      document.getElementById('sidebar-overlay').classList.toggle('open');
    }
    function closeSidebar() {
      document.querySelector('.sidebar').classList.remove('open');
      document.getElementById('sidebar-overlay').classList.remove('open');
    }

    // ── MINIMIZE-TO-TRAY (any modal/popup can shrink to a corner chip) ────────
    // Lets the user park an open modal at the bottom-right and navigate the
    // sidebar without losing context. Click the chip → restore the modal.
    window._minimizedModals = window._minimizedModals || {};
    function _ensureMinTray() {
      let tray = document.getElementById('min-tray');
      if (tray) return tray;
      tray = document.createElement('div');
      tray.id = 'min-tray';
      tray.style.cssText = 'position:fixed;bottom:18px;right:18px;z-index:99990;display:flex;flex-direction:column-reverse;gap:8px;align-items:flex-end;pointer-events:none;font-family:-apple-system,BlinkMacSystemFont,sans-serif';
      document.body.appendChild(tray);
      return tray;
    }
    function minimizeModal(modalId, title) {
      const el = document.getElementById(modalId);
      if (!el) return;
      // Save original display, then hide
      window._minimizedModals[modalId] = {
        title: title || modalId,
        originalDisplay: el.style.display || ''
      };
      el.style.display = 'none';
      const tray = _ensureMinTray();
      // Remove any existing chip for this modalId so we don't dupe
      const old = document.getElementById('min-chip-' + modalId);
      if (old) old.remove();
      const chip = document.createElement('button');
      chip.id = 'min-chip-' + modalId;
      chip.style.cssText = 'pointer-events:auto;background:linear-gradient(135deg,var(--brand-primary,#1E5BC0),#7C3AED);color:#fff;border:none;padding:9px 14px 9px 16px;border-radius:99px;font-size:12.5px;font-weight:600;cursor:pointer;box-shadow:0 4px 14px rgba(15,23,42,0.25);display:flex;align-items:center;gap:8px;max-width:280px';
      const safeTitle = (title || modalId).replace(/</g,'&lt;');
      chip.innerHTML = '<span style="font-size:14px">▲</span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:200px">' + safeTitle + '</span><span class="min-chip-x" title="Close" style="margin-left:4px;opacity:0.7;font-size:14px;line-height:1;padding:0 2px">×</span>';
      // Click chip → restore. Click X → close entirely.
      chip.onclick = (e) => {
        if (e.target.classList.contains('min-chip-x')) {
          // Close instead of restore
          chip.remove();
          delete window._minimizedModals[modalId];
          if (el && el.parentNode) el.remove();
          return;
        }
        restoreModal(modalId);
      };
      tray.appendChild(chip);
    }
    function restoreModal(modalId) {
      const el = document.getElementById(modalId);
      const meta = window._minimizedModals[modalId];
      if (el && meta) {
        el.style.display = meta.originalDisplay || 'flex';
        delete window._minimizedModals[modalId];
      }
      const chip = document.getElementById('min-chip-' + modalId);
      if (chip) chip.remove();
    }
    // Inject a minimize button into any element. Pass the modal element + the
    // title to show on the chip. Idempotent — won't add twice.
    function addMinimizeBtn(modalEl, title) {
      if (!modalEl || modalEl.querySelector('.modal-min-btn')) return;
      const btn = document.createElement('button');
      btn.className = 'modal-min-btn';
      btn.title = 'Minimize (keep open in tray)';
      btn.innerHTML = '−';
      btn.style.cssText = 'position:absolute;top:14px;right:54px;background:rgba(15,23,42,0.08);border:none;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:20px;font-weight:700;line-height:1;color:#0F172A;display:flex;align-items:center;justify-content:center;z-index:10';
      btn.onmouseenter = () => btn.style.background = 'rgba(15,23,42,0.18)';
      btn.onmouseleave = () => btn.style.background = 'rgba(15,23,42,0.08)';
      btn.onclick = (e) => { e.stopPropagation(); minimizeModal(modalEl.id, title); };
      // Find a good parent container — first child of modalEl that's positioned
      const inner = modalEl.firstElementChild || modalEl;
      if (getComputedStyle(inner).position === 'static') inner.style.position = 'relative';
      inner.appendChild(btn);
    }
    // Auto-attach minimize buttons to any new modal-overlay that appears.
    // Watches the DOM and injects into matching elements as they're added.
    (function watchModals() {
      const target = document.body;
      const observer = new MutationObserver(muts => {
        muts.forEach(m => {
          m.addedNodes.forEach(n => {
            if (n.nodeType !== 1) return;
            // Match common modal patterns
            if (n.classList && (n.classList.contains('modal-overlay') ||
                                (n.id && /-(overlay|modal)$/i.test(n.id)))) {
              // Use the first heading inside as title, fallback to id
              const heading = n.querySelector('h2, h3, .modal-title');
              const title = heading ? heading.textContent.trim().slice(0, 60) : (n.id || 'Window');
              addMinimizeBtn(n, title);
            }
          });
        });
      });
      observer.observe(target, { childList: true, subtree: false });
    })();

    // ── LIVE NOTIFICATIONS (browser push for new client/tenant messages) ──────
    // Subscribes to PocketBase realtime and fires a desktop/mobile Notification
    // (plus an in-dashboard toast) the moment a client posts a portal message
    // or a tenant submits a Contact Owner message. No polling, no third-party.
    const _SEEN_PORTAL_MSGS_KEY    = '_seenPortalMsgIds';
    const _SEEN_TENANT_MSGS_KEY    = '_seenTenantMsgIds';
    const _SEEN_STRIPE_PAYMENTS_KEY = '_seenStripePayments';
    let _liveNotifEventSource = null;
    let _liveNotifClientId = null;

    function _seenIds(key) {
      try { return new Set(JSON.parse(sessionStorage.getItem(key) || '[]')); }
      catch(e) { return new Set(); }
    }
    function _markSeen(key, ids) {
      const all = _seenIds(key);
      ids.forEach(id => all.add(id));
      const arr = Array.from(all).slice(-300); // cap memory
      sessionStorage.setItem(key, JSON.stringify(arr));
    }

    // Toggle voice studio iframe to/from fullscreen overlay (covers the
    // entire viewport including sidebar; ESC or button to exit).
    function _voiceStudioFullscreen() {
      const wrap = document.getElementById('voice-studio-frame-wrap');
      if (!wrap) return;
      const f = document.getElementById('voice-studio-frame');
      if (f && (!f.src || f.src === 'about:blank')) f.src = '/pb/voiceforge.html';
      const isFullscreen = wrap.dataset.fullscreen === '1';
      if (isFullscreen) {
        // Exit
        wrap.dataset.fullscreen = '';
        wrap.style.position = '';
        wrap.style.inset = '';
        wrap.style.zIndex = '';
        wrap.style.borderRadius = '12px';
        wrap.style.height = '85vh';
        wrap.style.minHeight = '600px';
        const exit = document.getElementById('vs-exit-fullscreen-btn');
        if (exit) exit.remove();
      } else {
        // Enter fullscreen
        wrap.dataset.fullscreen = '1';
        wrap.style.position = 'fixed';
        wrap.style.inset = '0';
        wrap.style.zIndex = '99999';
        wrap.style.borderRadius = '0';
        wrap.style.height = 'auto';
        wrap.style.minHeight = 'auto';
        const exit = document.createElement('button');
        exit.id = 'vs-exit-fullscreen-btn';
        exit.textContent = '✕ Exit Fullscreen';
        exit.style.cssText = 'position:fixed;top:14px;right:14px;z-index:100000;background:#0F172A;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,0.3);font-family:-apple-system,BlinkMacSystemFont,sans-serif';
        exit.onclick = _voiceStudioFullscreen;
        document.body.appendChild(exit);
      }
    }

    // Voice Studio (voiceforge.html) auto-key handshake.
    // The iframe posts {type:'voiceforge:ready'} on load; we reply with the
    // Groq key from settings so the user never sees the setup screen.
    window.addEventListener('message', function (e) {
      if (!e || !e.data || e.data.type !== 'voiceforge:ready') return;
      const f = document.getElementById('voice-studio-frame');
      if (!f || !f.contentWindow || e.source !== f.contentWindow) return;
      const s = (typeof getData === 'function' && getData('settings')) || {};
      const key = s.groqApiKey || s.groqApiKey2 || '';
      if (!key) return; // no key configured — let the setup screen show
      f.contentWindow.postMessage({
        type: 'voiceforge:set-key',
        key: key,
        name: s.userName || s.ownerName || s.fullName || ''
      }, '*');
    });

    // Direct click handler for the Enable Notifications button on the
    // SaaS Clients page header. Always available — no dependency on the
    // floating badge being visible.
    async function _clickEnableNotifs() {
      if (typeof Notification === 'undefined') {
        alert('Your browser does not support notifications. Try Chrome, Edge, or Safari 16.4+.');
        return;
      }
      const btn = document.getElementById('enable-notifs-btn');
      if (Notification.permission === 'granted') {
        if (btn) { btn.textContent = '✅ Notifications enabled'; btn.style.color = '#10B981'; btn.style.borderColor = '#10B981'; }
        try { new Notification('🎉 You\'re already enabled!', { body: "You'll get alerts when clients or tenants message you." }); } catch(e){}
        return;
      }
      if (Notification.permission === 'denied') {
        alert('Notifications are BLOCKED for this site.\n\nTo enable:\n• Chrome/Edge: click the lock icon left of the URL → Site settings → Notifications → Allow → reload\n• Safari (Mac): Safari menu → Settings → Websites → Notifications → set thehelpctr.com to Allow → reload\n• Safari (iPad/iPhone): Settings → Safari → Notifications → set thehelpctr.com to Allow (PWA recommended)\n• Firefox: click the lock icon → Permissions → Notifications → Allow → reload');
        return;
      }
      try {
        const result = await Notification.requestPermission();
        if (result === 'granted') {
          if (btn) { btn.textContent = '✅ Notifications enabled'; btn.style.color = '#10B981'; btn.style.borderColor = '#10B981'; }
          try { new Notification('🎉 Notifications enabled!', { body: "You'll get alerts when clients or tenants message you." }); } catch(e){}
          if (typeof _initLiveNotifications === 'function') _initLiveNotifications();
        } else if (result === 'denied') {
          if (btn) { btn.textContent = '🔕 Notifications blocked'; btn.style.color = '#EF4444'; btn.style.borderColor = '#FCA5A5'; }
          alert('You blocked notifications. Click the button again for instructions to re-enable in your browser settings.');
        }
      } catch (e) {
        alert('Could not enable notifications: ' + e.message);
      }
    }
    function _refreshEnableNotifsBtn() {
      const btn = document.getElementById('enable-notifs-btn');
      if (!btn || typeof Notification === 'undefined') return;
      if (Notification.permission === 'granted') { btn.textContent = '✅ Notifications enabled'; btn.style.color = '#10B981'; btn.style.borderColor = '#10B981'; }
      else if (Notification.permission === 'denied') { btn.textContent = '🔕 Notifications blocked'; btn.style.color = '#EF4444'; btn.style.borderColor = '#FCA5A5'; }
      else { btn.textContent = '🔔 Enable Notifications'; btn.style.color = ''; btn.style.borderColor = ''; }
    }

    // Floating "Enable Notifications" badge that the user can click to grant
    // permission. Only shown for the owner, and only when permission is
    // 'default' (not yet asked) or 'denied' (so they can troubleshoot).
    function _renderNotifPermBadge() {
      if (TENANT) return;
      const existing = document.getElementById('notif-perm-badge');
      if (existing) existing.remove();
      if (typeof Notification === 'undefined') return;
      const perm = Notification.permission;
      if (perm === 'granted') return; // already enabled — no badge needed
      const banner = document.createElement('div');
      banner.id = 'notif-perm-badge';
      const isDenied = perm === 'denied';
      banner.style.cssText = 'position:fixed;top:18px;right:18px;z-index:99996;background:' + (isDenied?'#FEE2E2':'linear-gradient(135deg,#3B82F6,#7C3AED)') + ';border:' + (isDenied?'1px solid #FCA5A5':'none') + ';color:' + (isDenied?'#991B1B':'#fff') + ';padding:12px 18px;border-radius:99px;box-shadow:0 6px 20px rgba(59,130,246,0.45);font-size:13px;font-weight:700;font-family:-apple-system,BlinkMacSystemFont,sans-serif;cursor:pointer;max-width:320px;display:flex;align-items:center;gap:10px;line-height:1.3;animation:notif-pulse 2s ease-in-out infinite';
      // Add pulse animation if not already in <head>
      if (!document.getElementById('notif-pulse-style')) {
        const st = document.createElement('style');
        st.id = 'notif-pulse-style';
        st.textContent = '@keyframes notif-pulse { 0%,100% { transform:scale(1); box-shadow:0 6px 20px rgba(59,130,246,0.45); } 50% { transform:scale(1.04); box-shadow:0 8px 28px rgba(59,130,246,0.7); } }';
        document.head.appendChild(st);
      }
      banner.innerHTML = isDenied
        ? '<span style="font-size:20px">🔕</span><div><div>Notifications blocked</div><div style="font-size:11px;font-weight:400;margin-top:2px">Click to learn how to enable in browser settings</div></div>'
        : '<span style="font-size:20px">🔔</span><div><div>Click to enable notifications</div><div style="font-size:11px;font-weight:400;margin-top:2px">Get instant alerts when clients or tenants message you</div></div>';
      banner.onclick = async () => {
        if (isDenied) {
          alert('Your browser is blocking notifications for this site.\n\nTo enable:\n• Chrome/Edge: click the lock icon left of the URL → Site settings → Notifications → Allow\n• Safari: Safari menu → Settings → Websites → Notifications → set thehelpctr.com to Allow\n• Firefox: click the lock icon → Permissions → Notifications → Allow\n\nThen reload this page.');
          return;
        }
        try {
          const result = await Notification.requestPermission();
          if (result === 'granted') {
            banner.remove();
            // Test ping so user sees it worked
            try { new Notification('🎉 Notifications enabled!', { body: "You'll be alerted the moment a client or tenant messages you." }); } catch(e){}
          } else if (result === 'denied') {
            _renderNotifPermBadge(); // re-render in denied state
          }
        } catch(e) {}
      };
      document.body.appendChild(banner);
    }

    function _showLiveNotification(title, body, onClick) {
      // In-dashboard toast (always)
      if (typeof showToast === 'function') showToast('🔔 ' + title + ' · ' + body, 'success');
      // Native browser notification (if permitted)
      if (typeof Notification === 'undefined') return;
      if (Notification.permission !== 'granted') return;
      try {
        const n = new Notification(title, {
          body: body,
          icon: '/pb/help-center-icon.png',
          tag: 'help-center-msg-' + Date.now(),
          requireInteraction: false
        });
        if (onClick) n.onclick = () => { window.focus(); onClick(); n.close(); };
        setTimeout(() => { try { n.close(); } catch(e){} }, 12000);
      } catch(e) {}
    }

    // Send a notification email via the server's Resend proxy. Owner's
    // `settings.notifyEmail` (or fallback `settings.email`) is the recipient.
    // Silently no-ops if no address is configured or the server is unreachable.
    async function _sendNotifEmail(subject, html) {
      try {
        const s = JSON.parse(localStorage.getItem('settings') || '{}');
        const to = s.notifyEmail || s.email;
        if (!to || !subject || !html) return;
        await fetch(location.origin + '/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to, subject, html })
        });
      } catch(e) { /* silent — notifications must not break the UI */ }
    }

    function _handleStoreEvent(record) {
      if (!record || !record.key || !record.value) return;
      const value = typeof record.value === 'string' ? (function(){ try { return JSON.parse(record.value); } catch(e){ return null; } })() : record.value;
      if (!value) return;
      // Owner copy: react to portal:* updates AND admin:tenant-messages
      if (TENANT) return; // tenants don't get owner-side notifications
      // 1) Client portal message
      if (record.key.startsWith('portal:') && value.client && Array.isArray(value.client.messages)) {
        const seen = _seenIds(_SEEN_PORTAL_MSGS_KEY);
        const newClientMsgs = value.client.messages.filter(m => m.from === 'client' && !seen.has(m.id));
        if (newClientMsgs.length) {
          const last = newClientMsgs[newClientMsgs.length-1];
          const clientName = value.client.name || value.client.businessName || 'a client';
          const portalToken = record.key.slice('portal:'.length);
          _showLiveNotification(
            'New message from ' + clientName,
            (last.message || '').slice(0, 120),
            () => {
              const c = (getData('clients')||[]).find(x => x.portalToken === portalToken);
              if (c) openClientDetail(c.id);
            }
          );
          _markSeen(_SEEN_PORTAL_MSGS_KEY, newClientMsgs.map(m => m.id));
        }
      }
      // 2) Tenant Contact Owner message
      if (record.key === 'admin:tenant-messages' && Array.isArray(value)) {
        const seen = _seenIds(_SEEN_TENANT_MSGS_KEY);
        const newTenantMsgs = value.filter(m => !seen.has(m.id));
        if (newTenantMsgs.length) {
          const last = newTenantMsgs[0]; // tenant inbox is unshift-first (newest first)
          _showLiveNotification(
            'New tenant message from ' + (last.fromName || last.tenant),
            (last.subject || '') + ' — ' + (last.body || '').slice(0, 80),
            () => { showPage('saas-clients'); }
          );
          _markSeen(_SEEN_TENANT_MSGS_KEY, newTenantMsgs.map(m => m.id));
        }
      }
      // 3) Stripe-paid invoice — written server-side by the /api/stripe/webhook
      //    handler when payment_intent.succeeded or checkout.session.completed
      //    (mode=payment) fires with metadata.invoiceNumber set.
      if (record.key.startsWith('invoice:paid:') && value && value.invoiceNumber) {
        const fingerprint = value.invoiceNumber + ':' + (value.firedAt || value.paidAt || '');
        const seen = _seenIds(_SEEN_STRIPE_PAYMENTS_KEY);
        if (!seen.has(fingerprint)) {
          const base = value.invoiceNumber.replace(/-\d+$/, '');
          const revenue = getData('revenue') || [];
          let updated = false;
          let total = 0;
          let clientId = null;
          revenue.forEach(r => {
            const rBase = (r.invoiceNumber || '').replace(/-\d+$/, '');
            if (rBase === base && r.status !== 'Paid') {
              total += Number(r.amount || 0);
              r.status = 'Paid';
              r.paidDate = value.paidAt || new Date().toISOString().split('T')[0];
              if (!clientId) clientId = r.clientId;
              updated = true;
            }
          });
          if (updated) setData('revenue', revenue);
          let clientName = value.clientName || '';
          if (clientId) {
            const clients = getData('clients') || [];
            const ci = clients.findIndex(c => c.id === clientId);
            if (ci > -1) {
              clientName = clients[ci].name || clientName;
              if (clients[ci].invoiceNumber === base && !clients[ci].paid) {
                clients[ci].paid = true;
                clients[ci].paidDate = value.paidAt || new Date().toISOString().split('T')[0];
                setData('clients', clients);
              }
            }
          }
          const shownAmt = '$' + Number(value.amount || total || 0).toLocaleString();
          _showLiveNotification(
            '💳 Stripe payment received: ' + shownAmt,
            'Invoice ' + base + (clientName ? ' from ' + clientName : ''),
            () => { if (clientId) openClientDetail(clientId); else showPage('revenue'); }
          );
          _sendNotifEmail(
            '💳 Stripe payment received: ' + shownAmt + ' — Invoice ' + base,
            `<p>A Stripe payment landed.</p>
             <ul style="line-height:1.7">
               <li><strong>Invoice:</strong> ${base}</li>
               <li><strong>Amount:</strong> ${shownAmt}</li>
               ${clientName ? `<li><strong>Client:</strong> ${clientName}</li>` : ''}
               ${value.clientEmail ? `<li><strong>Client email:</strong> ${value.clientEmail}</li>` : ''}
               <li><strong>Paid:</strong> ${value.paidAt || ''}</li>
             </ul>
             <p style="font-size:12px;color:#94A3B8">${updated ? 'Help Center invoice status has been flipped to Paid.' : 'Invoice already marked Paid in the Help Center (no change).'}</p>`
          );
          if (typeof renderClients === 'function') renderClients();
          if (typeof updateDashboard === 'function') updateDashboard();
          _markSeen(_SEEN_STRIPE_PAYMENTS_KEY, [fingerprint]);
        }
      }
    }

    async function _initLiveNotifications() {
      if (TENANT) return; // owner only for now
      if (localStorage.getItem('loggedIn') !== 'true') return;
      // Show a visible "Enable Notifications" button if permission isn't granted.
      // Browsers require a user click before the permission prompt shows up —
      // we can't trigger it silently on page load anymore.
      _renderNotifPermBadge();
      // Bootstrap "seen" sets from current data so we don't fire on existing
      // unread items at first connect — only on records that arrive after
      const portalSeed = [];
      (getData('clients')||[]).forEach(c => (c.messages||[]).forEach(m => { if (m.id) portalSeed.push(m.id); }));
      _markSeen(_SEEN_PORTAL_MSGS_KEY, portalSeed);
      _markSeen(_SEEN_TENANT_MSGS_KEY, ((getData('admin:tenant-messages')||[]).map(m => m.id).filter(Boolean)));
      // Open SSE connection to PB realtime
      const pbBase = (window.location.origin && /thehelpctr/.test(window.location.origin))
        ? window.location.origin + '/pb'
        : 'https://thehelpctr.com/pb';
      try {
        if (_liveNotifEventSource) { try { _liveNotifEventSource.close(); } catch(e){} }
        _liveNotifEventSource = new EventSource(pbBase + '/api/realtime');
        _liveNotifEventSource.addEventListener('PB_CONNECT', async (e) => {
          try {
            _liveNotifClientId = JSON.parse(e.data).clientId;
            // Subscribe to the entire store collection
            await fetch(pbBase + '/api/realtime', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ clientId: _liveNotifClientId, subscriptions: ['store'] })
            });
          } catch(err) { console.warn('[live notif] subscribe failed:', err); }
        });
        _liveNotifEventSource.addEventListener('store', (e) => {
          try {
            const data = JSON.parse(e.data);
            if (data && data.record) _handleStoreEvent(data.record);
          } catch(err){}
        });
        _liveNotifEventSource.onerror = (err) => {
          // PB closes idle connections; reconnect after a short delay
          if (_liveNotifEventSource && _liveNotifEventSource.readyState === EventSource.CLOSED) {
            setTimeout(_initLiveNotifications, 8000);
          }
        };
      } catch(e) { console.warn('[live notif] init error:', e); }
      // Bookings don't live in the realtime store collection — poll the REST
      // endpoint every 60s for new pending requests. Seed `seen` with the
      // current set so we only fire on bookings that arrive AFTER login.
      try {
        const seedReqs = await _fetchPendingBookings();
        _markSeen(_SEEN_BOOKINGS_KEY, (seedReqs || []).map(b => b && b.id).filter(Boolean));
      } catch(e){}
      if (_bookingPollTimer) clearInterval(_bookingPollTimer);
      _bookingPollTimer = setInterval(_checkNewBookings, 60000);
    }

    // ── BOOKING POLL ───────────────────────────────────────────────────────────
    let _bookingPollTimer = null;
    const _SEEN_BOOKINGS_KEY = 'hc:seen:bookings';

    async function _fetchPendingBookings() {
      const s = JSON.parse(localStorage.getItem('settings') || '{}');
      const password = s.password || '';
      if (!password) return [];
      const r = await fetch(location.origin + '/api/owner/booking/list', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, status: 'pending' })
      });
      if (!r.ok) return [];
      const j = await r.json();
      return j.requests || [];
    }

    async function _checkNewBookings() {
      if (TENANT) return;
      if (localStorage.getItem('loggedIn') !== 'true') return;
      let reqs;
      try { reqs = await _fetchPendingBookings(); } catch(e){ return; }
      const seen = _seenIds(_SEEN_BOOKINGS_KEY);
      const fresh = (reqs || []).filter(b => b && b.id && !seen.has(b.id));
      if (!fresh.length) return;
      if (fresh.length === 1) {
        const b = fresh[0];
        const when = (b.date ? new Date(b.date).toLocaleDateString(undefined, { month:'short', day:'numeric' }) : '?') + (b.time ? ' · ' + b.time : '');
        _showLiveNotification(
          '📅 New booking from ' + (b.name || 'someone'),
          when + (b.service ? ' · ' + b.service : ''),
          () => { showPage('booking'); }
        );
        _sendNotifEmail(
          'New booking request: ' + (b.name || 'unknown'),
          `<p><strong>${(b.name||'(no name)')}</strong> requested a booking.</p>
           <ul style="line-height:1.7">
             <li><strong>When:</strong> ${when}</li>
             ${b.service ? `<li><strong>Service:</strong> ${b.service}</li>` : ''}
             ${b.email ? `<li><strong>Email:</strong> ${b.email}</li>` : ''}
             ${b.phone ? `<li><strong>Phone:</strong> ${b.phone}</li>` : ''}
             ${b.notes ? `<li><strong>Notes:</strong> ${b.notes}</li>` : ''}
           </ul>`
        );
      } else {
        _showLiveNotification(
          fresh.length + ' new booking requests',
          fresh.map(b => b.name).filter(Boolean).slice(0, 3).join(', ') + (fresh.length > 3 ? '…' : ''),
          () => { showPage('booking'); }
        );
        _sendNotifEmail(
          fresh.length + ' new booking requests',
          '<p>You have <strong>' + fresh.length + '</strong> new booking requests waiting.</p>' +
          '<ul>' + fresh.map(b => `<li>${b.name || '(no name)'} — ${b.date || '?'} ${b.time || ''}</li>`).join('') + '</ul>'
        );
      }
      _markSeen(_SEEN_BOOKINGS_KEY, fresh.map(b => b.id));
    }

    // ── CLOUD SYNC STATUS BADGE ────────────────────────────────────────────────
    // If PB sync isn't enabled, show a VERY visible warning so Joy knows her
    // data isn't being pushed to the cloud (and therefore portals won't work).
    function _renderSyncStatusBadge() {
      try {
        if (localStorage.getItem('loggedIn') !== 'true') return;
        const s = JSON.parse(localStorage.getItem('settings') || '{}');
        const enabled = !!(s.pbEnabled && s.pbUrl && s.pbEmail && s.pbPassword);
        const existing = document.getElementById('sync-status-banner');
        if (existing) existing.remove();
        if (enabled) {
          // Banner used to push the page down with body padding; clear it
          // when sync gets enabled so the layout doesn't keep the gap.
          document.body.style.paddingTop = '';
          return;
        }
        const banner = document.createElement('div');
        banner.id = 'sync-status-banner';
        banner.style.cssText = 'position:fixed;top:' + (TENANT ? '32px' : '0') + ';left:0;right:0;z-index:99998;background:linear-gradient(90deg,#DC2626,#F59E0B);color:#fff;font-size:12px;font-weight:700;letter-spacing:0.3px;text-align:center;padding:8px 14px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.2);cursor:pointer';
        banner.innerHTML = '⚠️ CLOUD SYNC IS OFF — your client portals won\'t work and your data isn\'t backed up. Click here to enable.';
        banner.onclick = () => { showPage('settings'); setTimeout(() => { const el = document.getElementById('set-pb-url'); if (el) el.scrollIntoView({behavior:'smooth', block:'center'}); }, 300); };
        document.body.appendChild(banner);
        // Push the page below the banner
        document.body.style.paddingTop = (TENANT ? '64px' : '34px');
      } catch(e){}
    }

    // ── INIT ───────────────────────────────────────────────────────────────────
    async function init() {
      // For tenant copies: hydrate this tenant's settings from PB *before*
      // initializeData runs, so the proper password (set by the owner) is in
      // localStorage when login is checked.
      if (TENANT) await _hydrateTenantSettings();
      initializeData();
      if (!checkPortalRoute()) checkSession();
      initThemeBtn();
      // Restore sidebar collapsed state
      if (localStorage.getItem('sidebarCollapsed') === '1') {
        document.querySelector('.sidebar')?.classList.add('collapsed');
        document.querySelector('.main-content')?.classList.add('sidebar-collapsed');
        const btn = document.getElementById('sb-toggle-btn');
        if (btn) btn.textContent = '▶';
      }
      // Flush any writes that were queued in a previous (likely mobile) session
      // where the tab was suspended before the PocketBase request completed.
      if (localStorage.getItem('loggedIn') === 'true') pbDrainQueue();
      // After login render, push any portal snapshots that need the latest
      // schema (ownerEmail, tenant id) — runs once, idle, fire-and-forget.
      // Skipped for tenant copies that haven't logged in yet.
      setTimeout(() => {
        try {
          _renderSyncStatusBadge();
          if (localStorage.getItem('loggedIn') === 'true' &&
              typeof pbPushAllPortalSnapshots === 'function') {
            pbPushAllPortalSnapshots();
          }
          // Start live notifications subscription (owner only)
          if (typeof _initLiveNotifications === 'function') _initLiveNotifications();
        } catch (e) {}
      }, 4000);
    }

    window.addEventListener('hashchange', checkPortalRoute);
    window.addEventListener('load', init);
    // Mobile tabs often resume from a frozen state rather than a full reload;
    // retry queued writes when the page becomes visible again.
    // On resume (reopening the PWA / switching back to the tab), pull the latest
    // from PocketBase and re-render the current page — otherwise the app shows
    // the stale state it had when it was backgrounded instead of the live sync.
    function _resyncOnResume() {
      if (localStorage.getItem('loggedIn') !== 'true') return;
      try {
        Promise.resolve(pbSyncAll()).then(() => {
          if (typeof _pbRenderBadge === 'function') _pbRenderBadge();
          if (typeof updateMessagesBadge === 'function') updateMessagesBadge();
          const visible = document.querySelector('#app .page:not(.hidden)');
          if (visible && /-page$/.test(visible.id) && typeof showPage === 'function') {
            showPage(visible.id.replace(/-page$/, ''));
          }
        });
      } catch (e) {}
    }
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') _resyncOnResume();
    });
    // iOS/Safari restores the PWA from the back-forward cache without firing
    // visibilitychange — pageshow catches that case.
    window.addEventListener('pageshow', (e) => { if (e.persisted) _resyncOnResume(); });

    // ══════════════════════════════════════════════════════════════
    // PHASE 2 — DASHBOARD, CLIENTS, MY IDEAS, PORTAL LINKS
    // ══════════════════════════════════════════════════════════════

    // ── MODAL HELPERS ──────────────────────────────────────────────
    // Per-modal state: stores the element to return focus to when the modal
    // closes, plus the bound keydown handler so we can remove it on close.
    const _modalState = new Map();

    function buildModal(id, title, bodyHTML) {
      const el = document.createElement('div');
      el.id = id;
      el.className = 'modal-overlay';
      // A11y: dialog role + modal flag + labelledby pointing at the title
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-modal', 'true');
      el.setAttribute('aria-labelledby', id + '-title');
      el.innerHTML = `<div class="modal-box" tabindex="-1"><div class="modal-header"><div class="modal-title" id="${id}-title">${title}</div><button class="modal-close" aria-label="Close dialog" onclick="closeModal('${id}')">×</button></div><div class="modal-body">${bodyHTML}</div></div>`;
      el.addEventListener('click', function(e) { if (e.target === el) closeModal(id); });

      // Remember what had focus so we can return to it on close
      const previouslyFocused = document.activeElement;

      // Keyboard: Esc closes; Tab is trapped within the modal
      const keyHandler = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeModal(id);
          return;
        }
        if (e.key === 'Tab') {
          const focusable = el.querySelectorAll('a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])');
          if (!focusable.length) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      };
      document.addEventListener('keydown', keyHandler);
      _modalState.set(id, { previouslyFocused, keyHandler });

      return el;
    }

    function closeModal(id) {
      const el = document.getElementById(id);
      if (el) el.remove();
      // Restore focus + unbind keydown handler
      const state = _modalState.get(id);
      if (state) {
        document.removeEventListener('keydown', state.keyHandler);
        try { state.previouslyFocused?.focus({ preventScroll: false }); } catch {}
        _modalState.delete(id);
      }
    }

    // After a modal is added to the DOM by openModal(), focus its first
    // interactive element so keyboard users land inside the dialog
    function _focusFirstInModal(id) {
      const el = document.getElementById(id);
      if (!el) return;
      const focusable = el.querySelector('input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled])');
      try { (focusable || el.querySelector('.modal-box') || el).focus({ preventScroll: false }); } catch {}
    }

    // One-time setup: watch for new modal-overlay nodes being added to <body>
    // and auto-focus the first interactive element inside. This covers every
    // place in the codebase that creates a modal via document.body.appendChild()
    // without us needing to edit each call site.
    (function installModalA11yObserver() {
      if (typeof MutationObserver === 'undefined' || !document.body) return;
      const obs = new MutationObserver((mutations) => {
        for (const m of mutations) {
          for (const node of m.addedNodes) {
            if (!(node instanceof Element)) continue;
            if (node.classList?.contains('modal-overlay')) {
              setTimeout(() => { if (node.id) _focusFirstInModal(node.id); }, 30);
            } else if (node.querySelector) {
              const inner = node.querySelector('.modal-overlay');
              if (inner && inner.id) setTimeout(() => _focusFirstInModal(inner.id), 30);
            }
          }
        }
      });
      obs.observe(document.body, { childList: true, subtree: true });
    })();
    function switchModalTab(prefix, name, el) {
      document.querySelectorAll('[id^="' + prefix + '-tab-"]').forEach(t => t.classList.remove('active'));
      const target = document.getElementById(prefix + '-tab-' + name);
      if (target) target.classList.add('active');
      el.parentElement.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
      el.classList.add('active');
    }
    function timeAgo(ts) {
      const m = Math.floor((Date.now() - new Date(ts)) / 60000);
      if (m < 1) return 'Just now'; if (m < 60) return m + 'm ago';
      const h = Math.floor(m / 60); if (h < 24) return h + 'h ago';
      return Math.floor(h / 24) + 'd ago';
    }
    function copyText(btn, text) {
      navigator.clipboard.writeText(text).catch(() => {});
      const orig = btn.textContent; btn.textContent = '✓ Copied!';
      setTimeout(() => btn.textContent = orig, 2000);
    }

    // ── DASHBOARD ─────────────────────────────────────────────────
    // Navigate from a dashboard stat card to its review page with a status pre-filter applied.
    function dashStatJump(page, status) {
      showPage(page, null);
      setTimeout(() => {
        if (page === 'revenue') {
          const sel = document.getElementById('rev-filter-status');
          if (sel) { sel.value = status || ''; if (typeof renderRevenue === 'function') renderRevenue(); }
        } else if (page === 'clients') {
          const sel = document.getElementById('client-filter');
          if (sel) { sel.value = status || 'All'; if (typeof renderClients === 'function') renderClients(); }
        }
      }, 80);
    }

    // Quick snapshot modal opened from a dashboard stat card. Lists the
    // relevant records inline so Joy doesn't have to leave the dashboard.
    // The "View all →" footer button calls dashStatJump to drill into the
    // full filtered page.
    function dashStatSnapshot(kind) {
      const esc = s => String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      const money = n => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 0 });
      let title = '', rowsHtml = '', footerJump = null, footerLabel = 'View all', emptyMsg = '';
      const clients = getData('clients') || [];
      const revenue = getData('revenue') || [];
      const ideas   = getData('ideas')   || [];

      const tableShell = (head, body) =>
        `<table style="width:100%;border-collapse:collapse;font-size:13px">
           <thead><tr style="background:#f8fafc;border-bottom:1.5px solid #e2e8f0">${head}</tr></thead>
           <tbody>${body}</tbody>
         </table>`;
      const th = t => `<th style="padding:8px 10px;text-align:left;font-weight:700;color:#475569;text-transform:uppercase;font-size:11px;letter-spacing:0.3px">${t}</th>`;
      const td = (t, extra) => `<td style="padding:9px 10px;border-bottom:1px solid #f1f5f9;${extra || ''}">${t}</td>`;

      if (kind === 'paid') {
        title = '✓ Paid Revenue';
        footerJump = () => dashStatJump('revenue', 'Paid');
        footerLabel = 'View all in Revenue Tracker →';
        const paid = revenue.filter(r => r.status === 'Paid').sort((a,b) => (b.date||'').localeCompare(a.date||'')).slice(0, 20);
        const total = revenue.filter(r => r.status === 'Paid').reduce((s,r) => s + Number(r.amount||0), 0);
        if (!paid.length) emptyMsg = 'No paid invoices yet.';
        else {
          rowsHtml = `<div style="margin-bottom:12px;padding:10px 14px;background:rgba(16,185,129,0.08);border-radius:8px;font-size:13px;color:#065F46"><strong>${revenue.filter(r => r.status==='Paid').length}</strong> paid invoice(s), total <strong>${money(total)}</strong></div>` +
            tableShell(
              th('Date') + th('Client') + th('Invoice') + th('Amount'),
              paid.map(r => `<tr>${td(esc(r.date||''))}${td(esc(r.clientName||''))}${td(esc(r.invoiceNumber||''))}${td(money(r.amount), 'text-align:right;font-weight:700;color:#10B981')}</tr>`).join('')
            );
        }
      } else if (kind === 'pending') {
        title = '⏳ Pending Revenue';
        footerJump = () => dashStatJump('revenue', 'Pending');
        footerLabel = 'View all in Revenue Tracker →';
        const today = new Date();
        const pending = revenue.filter(r => r.status === 'Pending' && Number(r.amount||0) > 0).sort((a,b) => (a.date||'').localeCompare(b.date||'')).slice(0, 20);
        const total = revenue.filter(r => r.status === 'Pending').reduce((s,r) => s + Number(r.amount||0), 0);
        if (!pending.length) emptyMsg = 'No pending invoices.';
        else {
          rowsHtml = `<div style="margin-bottom:12px;padding:10px 14px;background:rgba(245,158,11,0.08);border-radius:8px;font-size:13px;color:#9A3412"><strong>${pending.length}</strong> pending invoice(s), total <strong>${money(total)}</strong></div>` +
            tableShell(
              th('Date') + th('Client') + th('Invoice') + th('Age') + th('Amount'),
              pending.map(r => {
                const age = r.date ? Math.max(0, Math.floor((today - new Date(r.date)) / 86400000)) : 0;
                const ageColor = age > 30 ? '#DC2626' : age > 14 ? '#F59E0B' : '#64748B';
                return `<tr>${td(esc(r.date||''))}${td(esc(r.clientName||''))}${td(esc(r.invoiceNumber||''))}${td(age + 'd', 'color:'+ageColor+';font-weight:600')}${td(money(r.amount), 'text-align:right;font-weight:700;color:#F59E0B')}</tr>`;
              }).join('')
            );
        }
      } else if (kind === 'active') {
        title = '◉ Active Clients';
        footerJump = () => dashStatJump('clients', 'Active');
        footerLabel = 'View all in Client Manager →';
        const active = clients.filter(c => c.status === 'Active').sort((a,b) => (a.name||'').localeCompare(b.name||'')).slice(0, 30);
        if (!active.length) emptyMsg = 'No active clients.';
        else {
          rowsHtml = `<div style="margin-bottom:12px;padding:10px 14px;background:rgba(30,91,192,0.08);border-radius:8px;font-size:13px;color:#1E40AF"><strong>${active.length}</strong> active client(s)</div>` +
            tableShell(
              th('Name') + th('Business') + th('Service'),
              active.map(c => {
                const svc = c.services && c.services.length ? c.services.map(s => s.name).join(', ') : (c.service || '');
                return `<tr style="cursor:pointer" onclick="closeModal('dash-snap-modal');openClientDetail('${c.id}')">${td(esc(c.name||''))}${td(esc(c.businessName||''), 'color:#64748B')}${td(esc(svc), 'color:#64748B;font-size:12px')}</tr>`;
              }).join('')
            );
        }
      } else if (kind === 'completed') {
        title = '✓ Completed Projects';
        footerJump = () => dashStatJump('clients', 'Completed');
        footerLabel = 'View all in Client Manager →';
        const completed = clients.filter(c => c.status === 'Completed').sort((a,b) => (a.name||'').localeCompare(b.name||'')).slice(0, 30);
        if (!completed.length) emptyMsg = 'No completed projects yet.';
        else {
          rowsHtml = `<div style="margin-bottom:12px;padding:10px 14px;background:rgba(59,109,17,0.08);border-radius:8px;font-size:13px;color:#3B6D11"><strong>${completed.length}</strong> completed project(s)</div>` +
            tableShell(
              th('Name') + th('Business') + th('Service'),
              completed.map(c => {
                const svc = c.services && c.services.length ? c.services.map(s => s.name).join(', ') : (c.service || '');
                return `<tr style="cursor:pointer" onclick="closeModal('dash-snap-modal');openClientDetail('${c.id}')">${td(esc(c.name||''))}${td(esc(c.businessName||''), 'color:#64748B')}${td(esc(svc), 'color:#64748B;font-size:12px')}</tr>`;
              }).join('')
            );
        }
      } else if (kind === 'pipeline') {
        title = '◈ Pipeline (Ideas)';
        footerJump = () => dashStatJump('my-ideas', null);
        footerLabel = 'View pipeline →';
        const stages = ['Idea','Planning','Building'];
        const stageIcons = { Idea:'💭', Planning:'📋', Building:'🔨' };
        const inFlight = ideas.filter(i => i.stage !== 'Launched');
        if (!inFlight.length) emptyMsg = 'No ideas in the pipeline.';
        else {
          rowsHtml = stages.map(s => {
            const group = inFlight.filter(i => i.stage === s);
            if (!group.length) return '';
            return `<div style="margin-bottom:14px"><div style="font-size:12px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:6px">${stageIcons[s]} ${s} (${group.length})</div>` +
              group.map(i => `<div style="padding:8px 12px;background:#f8fafc;border-radius:8px;margin-bottom:4px;cursor:pointer" onclick="closeModal('dash-snap-modal');showPage('my-ideas',null);setTimeout(()=>openIdeaDetail('${i.id}'),60)"><strong style="font-size:13px">${esc(i.icon || '·')} ${esc(i.name || '')}</strong>${i.tagline ? `<div style="font-size:11px;color:#94A3B8;margin-top:2px">${esc(i.tagline)}</div>` : ''}</div>`).join('') + '</div>';
          }).filter(Boolean).join('');
        }
      } else {
        return;
      }

      const existing = document.getElementById('dash-snap-modal');
      if (existing) existing.remove();
      const wrap = document.createElement('div');
      wrap.id = 'dash-snap-modal';
      wrap.className = 'modal show';
      wrap.style.cssText = 'display:flex;align-items:center;justify-content:center;position:fixed;inset:0;background:rgba(15,23,42,0.6);z-index:9999;padding:20px';
      wrap.onclick = (e) => { if (e.target === wrap) closeModal('dash-snap-modal'); };
      wrap.innerHTML =
        `<div class="modal-content" style="background:#fff;border-radius:14px;max-width:760px;width:100%;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 24px 64px rgba(0,0,0,0.3)">
           <div style="padding:18px 22px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center">
             <h2 style="margin:0;font-size:18px;font-weight:700;color:#0F172A">${title}</h2>
             <button onclick="closeModal('dash-snap-modal')" style="background:transparent;border:none;font-size:24px;color:#94A3B8;cursor:pointer;line-height:1;padding:0 4px">×</button>
           </div>
           <div style="padding:18px 22px;overflow-y:auto;flex:1">
             ${emptyMsg ? `<div style="text-align:center;color:#94A3B8;padding:40px 0;font-size:14px">${emptyMsg}</div>` : rowsHtml}
           </div>
           <div style="padding:14px 22px;border-top:1px solid #e2e8f0;display:flex;justify-content:flex-end;gap:8px">
             <button onclick="closeModal('dash-snap-modal')" class="btn btn-outline" style="padding:8px 16px;font-size:13px">Close</button>
             <button id="dash-snap-view-all" class="btn btn-solid" style="padding:8px 16px;font-size:13px">${footerLabel}</button>
           </div>
         </div>`;
      document.body.appendChild(wrap);
      const jumpBtn = document.getElementById('dash-snap-view-all');
      if (jumpBtn) jumpBtn.onclick = () => { closeModal('dash-snap-modal'); if (footerJump) footerJump(); };
    }
    function updateDashboard() {
      const clients = getData('clients');
      const revenue = getData('revenue');
      const ideas   = getData('ideas');
      const h = new Date().getHours();
      const greet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
      const el = id => document.getElementById(id);
      const s = JSON.parse(localStorage.getItem('settings')) || DEFAULT_SETTINGS;
      const firstName = (s.name || DEFAULT_SETTINGS.name).split(' ')[0];
      const initials = (s.name || DEFAULT_SETTINGS.name).split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
      // Branded greeting: H.E.L.P. tagline-aware, falls back to firstName on subsequent loads
      if (el('dash-greeting')) {
        const biz = s.businessName || DEFAULT_SETTINGS.businessName || 'H.E.L.P. Center';
        el('dash-greeting').textContent = greet + ', ' + firstName + ' — welcome to your ' + biz;
      }
      if (el('sidebar-name')) el('sidebar-name').textContent = s.name || DEFAULT_SETTINGS.name;
      if (el('sidebar-email')) el('sidebar-email').textContent = s.email || DEFAULT_SETTINGS.email;
      if (el('sidebar-avatar')) el('sidebar-avatar').textContent = initials;
      if (el('mobile-biz-name')) el('mobile-biz-name').textContent = s.businessName || DEFAULT_SETTINGS.businessName;
      if (el('sidebar-biz-name')) el('sidebar-biz-name').textContent = s.businessName || DEFAULT_SETTINGS.businessName;
      document.title = (s.businessName || DEFAULT_SETTINGS.businessName) + ' — Business System';
      const paid = revenue.filter(r => r.status === 'Paid').reduce((s, r) => s + (r.amount||0), 0);
      // Group revenue by invoice base number, calc net per invoice, sum only truly pending ones
      const invGroups = {};
      revenue.forEach(r => {
        const base = (r.invoiceNumber||'').replace(/-\d+$/, '');
        if (!invGroups[base]) invGroups[base] = { items: [], anyPaid: false };
        invGroups[base].items.push(r);
        if (r.status === 'Paid') invGroups[base].anyPaid = true;
      });
      let pending = 0, pendingCount = 0;
      Object.values(invGroups).forEach(grp => {
        if (grp.anyPaid) return; // already paid
        const charges    = grp.items.filter(r => r.paidBy !== 'client').reduce((a, r) => a + Math.abs(r.amount||0), 0);
        const deductions = grp.items.filter(r => r.paidBy === 'client').reduce((a, r) => a + Math.abs(r.amount||0), 0);
        const net = charges - deductions;
        const hasPending = grp.items.some(r => r.status === 'Pending');
        if (hasPending && net > 0) { pending += net; pendingCount++; }
      });
      if (el('stat-revenue'))   el('stat-revenue').textContent   = '$' + paid.toLocaleString('en-US', {minimumFractionDigits:0});
      if (el('stat-revenue-sub')) el('stat-revenue-sub').textContent = revenue.filter(r=>r.status==='Paid').length + ' paid invoice' + (revenue.filter(r=>r.status==='Paid').length===1?'':'s');
      if (el('stat-pending'))   el('stat-pending').textContent   = '$' + pending.toLocaleString('en-US', {minimumFractionDigits:0});
      if (el('stat-pending-sub')) el('stat-pending-sub').textContent = pendingCount + ' invoice' + (pendingCount===1?'':'s') + ' awaiting payment';
      if (el('stat-active'))    el('stat-active').textContent    = clients.filter(c => c.status === 'Active').length;
      if (el('stat-completed')) el('stat-completed').textContent = clients.filter(c => c.status === 'Completed').length;
      if (el('stat-ideas'))     el('stat-ideas').textContent     = ideas.filter(i => i.stage !== 'Launched').length;
      renderActivityFeed();
      renderDashKanban();
      renderDashUpcoming();
    }

    function renderDashUpcoming() {
      const el = document.getElementById('dash-upcoming');
      if (!el) return;
      const today = new Date(); today.setHours(0,0,0,0);
      const events = (typeof getEvents === 'function' ? getEvents() : (JSON.parse(localStorage.getItem('calEvents')||'[]')))
        .filter(e => e && e.date && new Date(e.date+'T12:00:00') >= today)
        .sort((a,b) => (a.date+' '+(a.time||'')).localeCompare(b.date+' '+(b.time||'')))
        .slice(0,8);
      if (!events.length) {
        el.innerHTML = '<div style="color:#999;font-size:13px;text-align:center;padding:20px 0">No upcoming events. <a onclick="showPage(\'calendar\',null)" style="color:var(--brand-primary);cursor:pointer;font-weight:600">Add one →</a></div>';
        return;
      }
      el.innerHTML = events.map(e => {
        const d = new Date(e.date+'T12:00:00');
        const dayLabel = d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
        const timeLabel = e.time ? (typeof formatTime === 'function' ? formatTime(e.time) : e.time) : '';
        return `<div onclick="showPage('calendar',null);setTimeout(()=>{ if(typeof openEditEventModal==='function') openEditEventModal('${e.id}'); }, 200)"
          style="display:flex;gap:10px;padding:10px 4px;border-bottom:1px solid #f0f0f0;cursor:pointer;align-items:flex-start"
          onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='transparent'">
          <div style="width:4px;border-radius:2px;background:${e.color||'var(--brand-primary)'};align-self:stretch;flex-shrink:0"></div>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:600;color:#1a1a1a;line-height:1.3">${e.title||'(untitled)'}</div>
            <div style="font-size:11px;color:#888;margin-top:2px">${dayLabel}${timeLabel?' · '+timeLabel:''}${e.location?' · '+e.location:''}</div>
            ${e.type?`<div style="font-size:10px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.4px;margin-top:2px">${e.type}</div>`:''}
          </div>
        </div>`;
      }).join('');
    }
    function dashClientSearch(q) {
      const box = document.getElementById('dash-search-results');
      if (!box) return;
      const clients = getData('clients');
      q = (q || '').trim().toLowerCase();
      const matches = q.length === 0
        ? clients.slice(0, 8)
        : clients.filter(c =>
            (c.name||'').toLowerCase().includes(q) ||
            (c.businessName||'').toLowerCase().includes(q) ||
            (c.email||'').toLowerCase().includes(q) ||
            (c.service||'').toLowerCase().includes(q)
          ).slice(0, 10);
      if (!matches.length) {
        box.style.display = 'block';
        box.innerHTML = `<div style="padding:14px 16px;font-size:13px;color:#999">No clients found</div>`;
        return;
      }
      const revenue = getData('revenue');
      box.style.display = 'block';
      box.innerHTML = matches.map(c => {
        const statusColor = c.status === 'Active' ? '#185fa5' : c.status === 'Completed' ? '#3b6d11' : c.status === 'Lead' ? '#854f0b' : '#888';
        const statusBg    = c.status === 'Active' ? '#e6f1fb' : c.status === 'Completed' ? '#eaf3de' : c.status === 'Lead' ? '#faeeda' : '#f1f1f1';
        // calc pending for this client
        const cRev = revenue.filter(r => r.clientId === c.id);
        const pending = cRev.filter(r => r.status === 'Pending' && (r.amount||0) > 0).reduce((a, r) => a + r.amount, 0);
        const services = c.services?.length
          ? c.services.map(s => s.name).join(', ')
          : (c.service || '');
        return `<div onclick="document.getElementById('dash-client-search').value='';document.getElementById('dash-search-results').style.display='none';openClientDetail('${c.id}')"
          style="display:flex;align-items:center;gap:12px;padding:10px 14px;cursor:pointer;border-bottom:0.5px solid rgba(0,0,0,0.06);transition:background .12s"
          onmouseenter="this.style.background='#f9f9f9'" onmouseleave="this.style.background='#fff'">
          <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--brand-primary),#7C3AED);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;flex-shrink:0">
            ${(c.name||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}
          </div>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:500;color:#1a1a1a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.name}${c.businessName ? ' <span style="color:#999;font-weight:400">— '+c.businessName+'</span>' : ''}</div>
            <div style="font-size:11px;color:#999;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${services || 'No services'}</div>
          </div>
          <div style="text-align:right;flex-shrink:0">
            <div style="display:inline-block;font-size:10px;font-weight:600;padding:2px 8px;border-radius:99px;background:${statusBg};color:${statusColor};margin-bottom:3px">${c.status||'Lead'}</div>
            ${pending > 0 ? `<div style="font-size:11px;color:#854f0b;font-weight:600">$${pending.toLocaleString()} due</div>` : ''}
          </div>
        </div>`;
      }).join('');
    }

    function renderActivityFeed() {
      const feed = document.getElementById('activity-feed');
      if (!feed) return;
      const activity = getData('activity');
      const iconMap  = { client:'👤', idea:'◈', revenue:'✓', system:'⚙' };
      const classMap = { client:'ai-client', idea:'ai-idea', revenue:'ai-revenue', system:'ai-system' };
      feed.innerHTML = activity.length
        ? activity.slice(0,12).map(a => {
            const cls = classMap[a.type] || 'ai-system';
            const ico = iconMap[a.type] || '·';
            return `<div class="activity-item">
              <div class="activity-icon ${cls}">${ico}</div>
              <div class="activity-content">
                <div class="activity-title">${a.message}</div>
                <div class="activity-time">${timeAgo(a.timestamp)}</div>
              </div>
            </div>`;
          }).join('')
        : '<p style="color:#999;font-size:13px;padding:8px 0">No activity yet.</p>';
    }
    function renderDashKanban() {
      const el = document.getElementById('dash-kanban');
      if (!el) return;
      const ideas = getData('ideas');
      const stages = ['Idea','Planning','Building','Launched'];
      const icons  = { Idea:'💭', Planning:'📋', Building:'🔨', Launched:'🚀' };
      el.innerHTML = stages.map(s => {
        const group = ideas.filter(i => i.stage === s);
        return `<div class="kanban-column"><div class="kanban-header">${icons[s]} ${s}</div>${
          group.map(i => `<div class="kanban-card" onclick="showPage('my-ideas',null);setTimeout(()=>openIdeaDetail('${i.id}'),60)"><div class="kanban-card-title">${i.icon} ${i.name}</div><div class="kanban-card-meta">${i.tagline||''}</div></div>`).join('')
          || '<div style="font-size:13px;color:var(--gray-400);padding:8px;">None yet</div>'
        }</div>`;
      }).join('');
    }

    // ── MY IDEAS ──────────────────────────────────────────────────
    function renderIdeasKanban() {
      const el = document.getElementById('ideas-kanban');
      if (!el) return;
      const ideas = getData('ideas');
      const stages = ['Idea','Planning','Building','Launched'];
      const icons  = { Idea:'💭', Planning:'📋', Building:'🔨', Launched:'🚀' };
      const cols   = { Idea:[], Planning:[], Building:[], Launched:[] };
      ideas.forEach(i => { if (cols[i.stage]) cols[i.stage].push(i); });
      el.innerHTML = stages.map(s => `
        <div class="kanban-column">
          <div class="kanban-header">${icons[s]} ${s} (${cols[s].length})</div>
          ${cols[s].map(i => `
            <div class="idea-kanban-card" onclick="openIdeaDetail('${i.id}')">
              <div style="font-size:22px;margin-bottom:6px;">${i.icon}</div>
              <div class="kanban-card-title">${i.name}</div>
              <div class="kanban-card-meta">${i.tagline||''}</div>
              ${i.financials?.projectedRevenue ? `<div style="font-size:11px;color:var(--success);margin-top:6px;font-weight:600;">${i.financials.projectedRevenue}</div>` : ''}
            </div>`).join('')}
          <button onclick="openAddIdeaModal('${s}')" style="width:100%;padding:8px;background:none;border:1px dashed var(--gray-300);border-radius:8px;color:var(--gray-400);cursor:pointer;font-size:13px;margin-top:4px;">+ Add</button>
        </div>`).join('');
    }

    function openAddIdeaModal(defaultStage) {
      const ex = document.getElementById('add-idea-modal'); if (ex) ex.remove();
      window._ideaAttachments = [];
      document.body.appendChild(buildModal('add-idea-modal', '💡 New Business Idea', ideaFormHTML(null, defaultStage||'Idea')));
      setTimeout(() => _wireDragDrop('if-desc-wrap', 'if-drop-overlay', _ideaAddFile), 50);
    }
    function openIdeaDetail(id) {
      const ideas = getData('ideas');
      const idea = ideas.find(i => i.id === id);
      if (!idea) return;
      const ex = document.getElementById('idea-detail-modal'); if (ex) ex.remove();
      window._ideaAttachments = (idea.attachments || []).slice();
      document.body.appendChild(buildModal('idea-detail-modal', idea.icon + ' ' + idea.name, ideaDetailHTML(idea)));
      setTimeout(() => _wireDragDrop('if-desc-wrap', 'if-drop-overlay', _ideaAddFile), 50);
    }
    async function _ideaAddFile(file) {
      const status = document.getElementById('if-upload-status');
      if (!file) return;
      if (file.size > 50 * 1024 * 1024) { if (status) status.innerHTML = '<span style="color:var(--error)">File too large (50MB max)</span>'; return; }
      if (status) status.innerHTML = '⏳ Uploading ' + file.name + '…';
      try {
        const att = await uploadAttachment(file);
        window._ideaAttachments = window._ideaAttachments || [];
        window._ideaAttachments.push(att);
        document.getElementById('if-attachments').innerHTML = renderAttachmentList(window._ideaAttachments, '_ideaRemoveAttachment');
        if (status) status.innerHTML = '<span style="color:#10B981">✓ ' + file.name + ' attached</span>';
        setTimeout(() => { if (status) status.innerHTML = ''; }, 3000);
      } catch (e) {
        if (status) status.innerHTML = '<span style="color:var(--error)">⚠ ' + e.message + '</span>';
      }
    }
    function _ideaRemoveAttachment(idx) {
      window._ideaAttachments = (window._ideaAttachments || []).filter((_,i) => i !== idx);
      const el = document.getElementById('if-attachments');
      if (el) el.innerHTML = renderAttachmentList(window._ideaAttachments, '_ideaRemoveAttachment');
    }

    function ideaFormHTML(idea, defaultStage) {
      const s = idea?.stage || defaultStage || 'Idea';
      const stages = ['Idea','Planning','Building','Launched'];
      return `
        <div class="form-row">
          <div class="form-group"><label class="form-label">Business Name *</label>
            <input type="text" id="if-name" class="form-input" style="margin:0" value="${idea?.name||''}" placeholder="e.g. The Green Plate"></div>
          <div class="form-group"><label class="form-label">Icon (emoji)</label>
            <div style="display:flex;gap:6px">
              <input type="text" id="if-icon" class="form-input" style="margin:0;flex:1" value="${idea?.icon||'🏢'}" maxlength="4">
              <button type="button" onclick="openEmojiPicker('if-icon', this)" class="btn btn-outline" style="padding:8px 12px;font-size:13px" title="Pick emoji">😀</button>
            </div></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Stage</label>
            <select id="if-stage" class="form-select">${stages.map(st=>`<option value="${st}"${st===s?' selected':''}>${{Idea:'💭',Planning:'📋',Building:'🔨',Launched:'🚀'}[st]} ${st}</option>`).join('')}</select></div>
          <div class="form-group"><label class="form-label">Tagline</label>
            <input type="text" id="if-tagline" class="form-input" style="margin:0" value="${idea?.tagline||''}" placeholder="One-line pitch"></div>
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">
            <button type="button" onclick="document.getElementById('if-camera').click()" class="btn btn-outline" style="padding:7px 12px;font-size:12.5px">📷 Take photo</button>
            <button type="button" onclick="document.getElementById('if-file').click()" class="btn btn-outline" style="padding:7px 12px;font-size:12.5px">📎 Upload file</button>
            <button type="button" onclick="openEmojiPicker('if-desc', this)" class="btn btn-outline" style="padding:7px 12px;font-size:12.5px">😀 Emoji</button>
            <span style="font-size:12px;color:#94A3B8;align-self:center">…or drag a file onto the description</span>
          </div>
          <input type="file" id="if-camera" accept="image/*" capture="environment" style="display:none" onchange="if(this.files[0])_ideaAddFile(this.files[0]);this.value=''">
          <input type="file" id="if-file" style="display:none" onchange="if(this.files[0])_ideaAddFile(this.files[0]);this.value=''">
          <div id="if-desc-wrap" style="position:relative">
            <textarea id="if-desc" class="form-textarea">${idea?.description||''}</textarea>
            <div id="if-drop-overlay" style="display:none;position:absolute;inset:0;background:rgba(30,91,192,0.10);border:2px dashed var(--brand-primary);border-radius:8px;align-items:center;justify-content:center;color:var(--brand-primary);font-size:15px;font-weight:600;pointer-events:none">Drop file to attach</div>
          </div>
          <div id="if-upload-status" style="font-size:12px;color:var(--gray-500);margin-top:6px;min-height:16px"></div>
          <div id="if-attachments">${renderAttachmentList(window._ideaAttachments || [], '_ideaRemoveAttachment')}</div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Startup Cost ($)</label>
            <input type="number" id="if-cost" class="form-input" style="margin:0" value="${idea?.financials?.startupCost||0}"></div>
          <div class="form-group"><label class="form-label">Projected Revenue</label>
            <input type="text" id="if-rev" class="form-input" style="margin:0" value="${idea?.financials?.projectedRevenue||''}" placeholder="e.g. $2,000–$5,000/mo"></div>
        </div>
        <div class="form-group"><label class="form-label">Notes</label>
          <textarea id="if-notes" class="form-textarea">${idea?.notes||''}</textarea></div>
        <input type="hidden" id="if-id" value="${idea?.id||''}">
        <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px;">
          ${idea ? `<button onclick="deleteIdea('${idea.id}')" style="padding:10px 14px;background:none;border:1px solid var(--error);color:var(--error);border-radius:8px;cursor:pointer;font-weight:600;">Delete</button>` : ''}
          <button onclick="closeModal('${idea?'idea-detail-modal':'add-idea-modal'}')" style="padding:10px 14px;background:none;border:1px solid var(--gray-300);border-radius:8px;cursor:pointer;font-weight:600;">Cancel</button>
          <button onclick="saveIdea()" class="btn btn-solid">Save Idea</button>
        </div>`;
    }

    function ideaDetailHTML(idea) {
      return `
        <div class="modal-tabs">
          <div class="modal-tab active" onclick="switchModalTab('idea','overview',this)">Overview</div>
          <div class="modal-tab" onclick="switchModalTab('idea','plan',this)">Business Plan</div>
          <div class="modal-tab" onclick="switchModalTab('idea','brand',this)">Brand Guide</div>
          <div class="modal-tab" onclick="switchModalTab('idea','financials',this)">Financials</div>
        </div>
        <div id="idea-tab-overview" class="modal-tab-content active">${ideaFormHTML(idea)}</div>
        <div id="idea-tab-plan" class="modal-tab-content">
          <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
            <button id="ai-bizplan-btn-${idea.id}" onclick="generateAiBizPlan('${idea.id}')" class="btn btn-solid" style="background:linear-gradient(135deg,var(--accent),#7C3AED)"><span class="icon icon-sm" data-icon="spark" style="margin-right:6px;vertical-align:-2px"></span>Generate with AI</button>
            <span style="font-size:13px;color:var(--gray-500);align-self:center">or write your own below</span>
          </div>
          <div id="ai-bizplan-result-${idea.id}" style="display:none;margin-bottom:12px"></div>
          <div class="form-group"><label class="form-label">Business Plan</label>
            <textarea id="idea-bp" class="form-textarea" style="min-height:220px">${idea.businessPlan||''}</textarea></div>
          <div style="display:flex;justify-content:flex-end">
            <button onclick="saveIdeaField('${idea.id}','businessPlan','idea-bp')" class="btn btn-solid">Save</button></div>
        </div>
        <div id="idea-tab-brand" class="modal-tab-content">
          <div class="form-group"><label class="form-label">Brand Guide</label>
            <textarea id="idea-bg" class="form-textarea" style="min-height:220px">${idea.brandGuide||''}</textarea></div>
          <div style="display:flex;justify-content:flex-end">
            <button onclick="saveIdeaField('${idea.id}','brandGuide','idea-bg')" class="btn btn-solid">Save</button></div>
        </div>
        <div id="idea-tab-financials" class="modal-tab-content">
          <div class="form-row">
            <div class="form-group"><label class="form-label">Startup Cost ($)</label>
              <input type="number" id="idea-fc" class="form-input" style="margin:0" value="${idea.financials?.startupCost||0}"></div>
            <div class="form-group"><label class="form-label">Projected Revenue</label>
              <input type="text" id="idea-fr" class="form-input" style="margin:0" value="${idea.financials?.projectedRevenue||''}"></div>
          </div>
          <div class="form-group"><label class="form-label">Financial Notes</label>
            <textarea id="idea-fn" class="form-textarea">${idea.financials?.notes||''}</textarea></div>
          <div style="display:flex;justify-content:flex-end">
            <button onclick="saveIdeaFinancials('${idea.id}')" class="btn btn-solid">Save</button></div>
        </div>`;
    }

    function saveIdea() {
      const id = document.getElementById('if-id').value;
      const name = document.getElementById('if-name').value.trim();
      if (!name) { alert('Business name is required.'); return; }
      const ideas = getData('ideas');
      const today = new Date().toISOString().split('T')[0];
      const attachments = (window._ideaAttachments || []).slice();
      const data = {
        name, icon: document.getElementById('if-icon').value.trim()||'🏢',
        stage: document.getElementById('if-stage').value,
        tagline: document.getElementById('if-tagline').value.trim(),
        description: document.getElementById('if-desc').value.trim(),
        notes: document.getElementById('if-notes').value.trim(),
        attachments,
        financials: { startupCost: parseFloat(document.getElementById('if-cost').value)||0, projectedRevenue: document.getElementById('if-rev').value.trim(), notes: '' },
        lastUpdated: today
      };
      if (id) {
        const idx = ideas.findIndex(i => i.id === id);
        if (idx > -1) Object.assign(ideas[idx], data);
        logActivity('idea', 'Updated idea: ' + name);
        closeModal('idea-detail-modal');
      } else {
        ideas.push({ ...data, id: generateId(), businessPlan:'', brandGuide:'', dateCreated: today });
        logActivity('idea', 'New idea added: ' + name);
        closeModal('add-idea-modal');
      }
      setData('ideas', ideas);
      window._ideaAttachments = [];
      renderIdeasKanban(); updateDashboard();
    }
    function saveIdeaField(id, field, inputId) {
      const val = document.getElementById(inputId).value;
      const ideas = getData('ideas');
      const idx = ideas.findIndex(i => i.id === id);
      if (idx > -1) { ideas[idx][field] = val; ideas[idx].lastUpdated = new Date().toISOString().split('T')[0]; }
      setData('ideas', ideas);
      const btn = event.currentTarget; btn.textContent = '✓ Saved!';
      setTimeout(() => btn.textContent = 'Save', 1500);
    }
    function saveIdeaFinancials(id) {
      const ideas = getData('ideas');
      const idx = ideas.findIndex(i => i.id === id);
      if (idx > -1) { ideas[idx].financials = { startupCost: parseFloat(document.getElementById('idea-fc').value)||0, projectedRevenue: document.getElementById('idea-fr').value.trim(), notes: document.getElementById('idea-fn').value.trim() }; ideas[idx].lastUpdated = new Date().toISOString().split('T')[0]; }
      setData('ideas', ideas);
      const btn = event.currentTarget; btn.textContent = '✓ Saved!';
      setTimeout(() => btn.textContent = 'Save', 1500);
    }
    function deleteIdea(id) {
      let ideas = getData('ideas');
      const idea = ideas.find(i => i.id === id);
      if (!idea) return;
      if (!confirm('Delete this idea?')) return;
      const idx = ideas.findIndex(i => i.id === id);
      setData('ideas', ideas.filter(i => i.id !== id));
      logActivity('idea', 'Deleted idea: ' + idea.name);
      closeModal('idea-detail-modal');
      renderIdeasKanban(); updateDashboard();
      showUndoToast('Idea deleted', () => {
        const current = getData('ideas') || [];
        current.splice(Math.min(idx, current.length), 0, idea);
        setData('ideas', current);
        renderIdeasKanban(); updateDashboard();
        showToast('Idea restored', 'success');
      });
    }

    // ── NOTES ─────────────────────────────────────────────────────
    const NOTE_CATEGORIES = ['General', 'Business Idea', 'Brand', 'Marketing', 'Client', 'Finance', 'Strategy', 'Personal', 'AI Output', 'Research'];

    function renderNotes() {
      const grid = document.getElementById('notes-grid');
      const tagsBar = document.getElementById('notes-tags-bar');
      if (!grid) return;
      const notes = getData('notes') || [];
      const search = (document.getElementById('notes-search')?.value || '').trim().toLowerCase();
      const activeTag = window._notesActiveTag || '';

      // Tags bar
      if (tagsBar) {
        const allTags = ['All', ...new Set(notes.map(n => n.category).filter(Boolean))];
        tagsBar.innerHTML = allTags.map(t => {
          const active = (t === 'All' && !activeTag) || t === activeTag;
          return `<button onclick="filterNotesByTag('${t === 'All' ? '' : t}')"
            style="padding:5px 12px;border-radius:99px;font-size:12px;font-weight:500;cursor:pointer;border:0.5px solid ${active?'var(--brand-primary)':'rgba(0,0,0,0.12)'};background:${active?'var(--brand-primary)':'#f9f9f9'};color:${active?'#fff':'#666'};transition:all .15s">
            ${t} ${t!=='All'?`<span style="opacity:0.7">(${notes.filter(n=>n.category===t).length})</span>`:`<span style="opacity:0.7">(${notes.length})</span>`}
          </button>`;
        }).join('');
      }

      // Filter
      let filtered = notes;
      if (activeTag) filtered = filtered.filter(n => n.category === activeTag);
      if (search) filtered = filtered.filter(n =>
        (n.subject||'').toLowerCase().includes(search) ||
        (n.body||'').toLowerCase().includes(search) ||
        (n.tags||'').toLowerCase().includes(search) ||
        (n.category||'').toLowerCase().includes(search)
      );

      // Sort newest first by date, then createdAt
      filtered.sort((a,b) => (b.date||'').localeCompare(a.date||'') || (b.createdAt||0) - (a.createdAt||0));

      if (!filtered.length) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:48px 24px;color:#999;font-size:14px">
          ${notes.length === 0 ? '📝 No notes yet. Click "+ New Note" to create your first one.' : 'No notes match your search.'}
        </div>`;
        return;
      }

      grid.innerHTML = filtered.map(n => {
        const dateStr = n.date ? new Date(n.date + 'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '';
        const preview = (n.body || '').slice(0, 180) + ((n.body||'').length > 180 ? '…' : '');
        const tagPills = (n.tags||'').split(',').map(t=>t.trim()).filter(Boolean).slice(0,3).map(t =>
          `<span style="font-size:10px;padding:2px 8px;border-radius:99px;background:#eef2ff;color:var(--brand-primary);font-weight:500">${t}</span>`
        ).join(' ');
        return `<div onclick="openNoteReader('${n.id}')"
          style="background:#fff;border:0.5px solid rgba(0,0,0,0.1);border-radius:12px;padding:16px;cursor:pointer;transition:box-shadow .15s,border-color .15s"
          onmouseenter="this.style.boxShadow='0 4px 14px rgba(0,0,0,0.08)';this.style.borderColor='var(--brand-primary)'"
          onmouseleave="this.style.boxShadow='none';this.style.borderColor='rgba(0,0,0,0.1)'">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;gap:8px">
            <div style="font-size:14px;font-weight:500;color:#1a1a1a;line-height:1.3">${n.subject || '(Untitled)'}</div>
            ${n.category ? `<span style="font-size:10px;padding:2px 8px;border-radius:99px;background:#f1f1f1;color:#666;font-weight:500;white-space:nowrap;flex-shrink:0">${n.category}</span>` : ''}
          </div>
          <div style="font-size:11px;color:#999;margin-bottom:10px">${dateStr}</div>
          <div style="font-size:13px;color:#555;line-height:1.55;white-space:pre-wrap;margin-bottom:10px">${preview || '<em style="color:#bbb">No content</em>'}</div>
          ${tagPills ? `<div style="display:flex;gap:4px;flex-wrap:wrap">${tagPills}</div>` : ''}
        </div>`;
      }).join('');
    }

    function filterNotesByTag(tag) {
      window._notesActiveTag = tag;
      renderNotes();
    }

    function openAddNoteModal() {
      openNoteModal(null);
    }

    function openEditNoteModal(id) {
      const note = getData('notes').find(n => n.id === id);
      if (note) openNoteModal(note);
    }

    function openNoteReader(id) {
      const note = getData('notes').find(n => n.id === id);
      if (!note) return;
      const dateStr = note.date ? new Date(note.date+'T00:00:00').toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'}) : '';
      const tagPills = (note.tags||'').split(',').map(t=>t.trim()).filter(Boolean).map(t =>
        `<span style="font-size:11px;padding:3px 10px;border-radius:99px;background:#eef2ff;color:var(--brand-primary);font-weight:500">${t}</span>`
      ).join(' ');
      // Render body — use mdRender if available, else preserve newlines
      let bodyHtml;
      if (typeof mdRender === 'function') {
        bodyHtml = `<div class="md-content" style="font-size:15px;line-height:1.75;color:#1a1a1a">${mdRender(note.body || '')}</div>`;
      } else {
        const safe = (note.body||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        bodyHtml = `<div style="font-size:15px;line-height:1.75;color:#1a1a1a;white-space:pre-wrap">${safe}</div>`;
      }
      const existing = document.getElementById('note-reader-overlay');
      if (existing) existing.remove();
      const overlay = document.createElement('div');
      overlay.id = 'note-reader-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9998;display:flex;align-items:center;justify-content:center;padding:24px';
      overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };
      overlay.innerHTML = `
        <div id="note-reader-modal" style="width:100%;max-width:900px;max-height:92vh;background:#fff;border-radius:16px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,0.25)">
          <div style="padding:16px 24px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;background:#fafbfc">
            <div style="font-size:12px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:.5px">📝 Note Reader</div>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
              <button onclick="noteReaderEdit('${note.id}')" class="btn btn-solid" style="padding:8px 14px;font-size:13px">✏️ Edit</button>
              <button onclick="noteReaderExport('${note.id}')" class="btn btn-outline" style="padding:8px 14px;font-size:13px"><span class="icon icon-sm" data-icon="download" style="margin-right:6px;vertical-align:-2px"></span>Export</button>
              <button onclick="noteReaderPrint()" class="btn btn-outline" style="padding:8px 14px;font-size:13px"><span class="icon icon-sm" data-icon="print" style="margin-right:6px;vertical-align:-2px"></span>Print</button>
              <button onclick="document.getElementById('note-reader-overlay').remove()" style="background:#f1f1f1;border:none;width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:18px;line-height:1;display:flex;align-items:center;justify-content:center;color:#666">×</button>
            </div>
          </div>
          <div id="note-reader-body" style="flex:1;overflow-y:auto;padding:32px 48px">
            <div style="margin-bottom:8px;display:flex;gap:8px;align-items:center;flex-wrap:wrap">
              ${note.category?`<span style="font-size:11px;padding:3px 10px;border-radius:99px;background:#f1f1f1;color:#666;font-weight:600;text-transform:uppercase;letter-spacing:.4px">${note.category}</span>`:''}
              ${dateStr?`<span style="font-size:13px;color:#888">${dateStr}</span>`:''}
            </div>
            <h1 style="font-size:28px;font-weight:700;color:#0F172A;margin:6px 0 18px 0;line-height:1.25">${note.subject || '(Untitled)'}</h1>
            ${tagPills?`<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:24px">${tagPills}</div>`:''}
            ${bodyHtml}
            ${(note.attachments && note.attachments.length) ? `<div style="margin-top:28px"><div style="font-size:12px;font-weight:600;color:#64748B;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:10px">Attachments (${note.attachments.length})</div>${renderAttachmentList(note.attachments)}</div>` : ''}
          </div>
        </div>`;
      document.body.appendChild(overlay);
    }

    function noteReaderEdit(id) {
      const overlay = document.getElementById('note-reader-overlay');
      if (overlay) overlay.remove();
      openEditNoteModal(id);
    }

    function noteReaderExport(id) {
      const note = getData('notes').find(n => n.id === id);
      if (!note) return;
      const dateStr = note.date ? new Date(note.date+'T00:00:00').toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}) : '';
      const lines = [];
      lines.push('# ' + (note.subject || 'Untitled Note'));
      lines.push('');
      if (dateStr) lines.push('**Date:** ' + dateStr);
      if (note.category) lines.push('**Category:** ' + note.category);
      if (note.tags) lines.push('**Tags:** ' + note.tags);
      lines.push('');
      lines.push('---');
      lines.push('');
      lines.push(note.body || '');
      const safeName = (note.subject || 'note').replace(/[^a-z0-9-_ ]/gi,'').trim().slice(0,60).replace(/\s+/g,'-') || 'note';
      const blob = new Blob([lines.join('\n')], { type:'text/markdown' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = safeName + '.md';
      a.click();
      setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
    }

    function noteReaderPrint() {
      const body = document.getElementById('note-reader-body');
      if (!body) { window.print(); return; }
      const w = window.open('', '_blank', 'width=900,height=1100');
      if (!w) { alert('Please allow popups to print.'); return; }
      w.document.write(`<!doctype html><html><head><title>Print Note</title>
        <style>
          body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;margin:40px;color:#1a1a1a;line-height:1.7}
          h1{font-size:26px;margin:6px 0 16px;border-bottom:2px solid var(--brand-primary);padding-bottom:10px}
          h2,h3,h4{margin-top:18px}
          p{margin:0 0 12px}
          ul,ol{padding-left:22px;margin:0 0 12px}
          li{margin:4px 0}
          code{background:#f4f4f4;padding:2px 6px;border-radius:4px;font-family:Consolas,monospace;font-size:13px}
          pre{background:#f4f4f4;padding:12px;border-radius:6px;overflow-x:auto}
          blockquote{border-left:3px solid #ccc;margin:0;padding:4px 14px;color:#555}
          .badge{display:inline-block;font-size:11px;padding:3px 10px;border-radius:99px;background:#eef2ff;color:var(--brand-primary);font-weight:600;margin-right:6px}
          @media print { @page { margin:0.6in } }
        </style></head><body>${body.innerHTML}</body></html>`);
      w.document.close();
      setTimeout(()=>{ w.focus(); w.print(); }, 250);
    }

    function openNoteModal(note) {
      const isEdit = !!note;
      const today = new Date().toISOString().split('T')[0];
      const modalId = 'note-modal';
      // Track this modal's attachments separately from the saved note until Save.
      window._noteAttachments = (note?.attachments || []).slice();
      const html = `
        <div class="form-row">
          <div class="form-group" style="flex:2"><label class="form-label">Subject *</label>
            <input type="text" id="note-subject" class="form-input" style="margin:0" value="${note?.subject || ''}" placeholder="What's this note about?"></div>
          <div class="form-group"><label class="form-label">Date</label>
            <input type="date" id="note-date" class="form-input" style="margin:0" value="${note?.date || today}"></div>
        </div>
        <div class="form-row">
          <div class="form-group" style="flex:1"><label class="form-label">Category</label>
            <select id="note-category" class="form-select">
              ${NOTE_CATEGORIES.map(c => `<option${c === (note?.category||'General') ? ' selected' : ''}>${c}</option>`).join('')}
            </select></div>
          <div class="form-group" style="flex:2"><label class="form-label">Tags <span style="color:#999;font-weight:400">(comma-separated)</span></label>
            <input type="text" id="note-tags" class="form-input" style="margin:0" value="${note?.tags || ''}" placeholder="e.g. branding, launch-plan, follow-up"></div>
        </div>
        <div class="form-group">
          <label class="form-label">Note Content</label>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">
            <button type="button" onclick="document.getElementById('note-camera').click()" class="btn btn-outline" style="padding:7px 12px;font-size:12.5px">📷 Take photo</button>
            <button type="button" onclick="document.getElementById('note-file').click()" class="btn btn-outline" style="padding:7px 12px;font-size:12.5px">📎 Upload file</button>
            <button type="button" id="note-emoji-btn" onclick="openEmojiPicker('note-body', this)" class="btn btn-outline" style="padding:7px 12px;font-size:12.5px">😀 Emoji</button>
            <span style="font-size:12px;color:#94A3B8;align-self:center">…or drag a file onto the textarea</span>
          </div>
          <input type="file" id="note-camera" accept="image/*" capture="environment" style="display:none" onchange="if(this.files[0])_noteAddFile(this.files[0]);this.value=''">
          <input type="file" id="note-file" style="display:none" onchange="if(this.files[0])_noteAddFile(this.files[0]);this.value=''">
          <div id="note-body-wrap" style="position:relative">
            <textarea id="note-body" class="form-textarea" style="min-height:380px;font-family:inherit;font-size:16px;line-height:2">${note?.body || ''}</textarea>
            <div id="note-drop-overlay" style="display:none;position:absolute;inset:0;background:rgba(30,91,192,0.10);border:2px dashed var(--brand-primary);border-radius:8px;align-items:center;justify-content:center;color:var(--brand-primary);font-size:15px;font-weight:600;pointer-events:none">Drop file to attach</div>
          </div>
          <div id="note-upload-status" style="font-size:12px;color:var(--gray-500);margin-top:6px;min-height:16px"></div>
          <div id="note-attachments">${renderAttachmentList(window._noteAttachments, '_noteRemoveAttachment')}</div>
        </div>
        <input type="hidden" id="note-id" value="${note?.id || ''}">
        <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px">
          ${isEdit ? `<button onclick="deleteNote('${note.id}')" style="padding:10px 14px;background:none;border:1px solid var(--error);color:var(--error);border-radius:8px;cursor:pointer;font-weight:600">Delete</button>` : ''}
          <button onclick="closeModal('${modalId}')" style="padding:10px 14px;background:none;border:1px solid var(--gray-300);border-radius:8px;cursor:pointer;font-weight:600">Cancel</button>
          <button onclick="saveNote()" class="btn btn-solid">${isEdit ? 'Save Changes' : 'Save Note'}</button>
        </div>`;
      const modal = buildModal(modalId, isEdit ? 'Edit Note' : 'New Note', html);
      document.body.appendChild(modal);
      setTimeout(() => document.getElementById('note-subject')?.focus(), 50);
      _wireDragDrop('note-body-wrap', 'note-drop-overlay', _noteAddFile);
    }
    // Hook drag-and-drop on a wrapper so dropped files are added as attachments.
    function _wireDragDrop(wrapId, overlayId, addFn) {
      const wrap = document.getElementById(wrapId);
      const overlay = document.getElementById(overlayId);
      if (!wrap || !overlay) return;
      let depth = 0;
      wrap.addEventListener('dragenter', e => { e.preventDefault(); depth++; overlay.style.display = 'flex'; });
      wrap.addEventListener('dragover',  e => { e.preventDefault(); });
      wrap.addEventListener('dragleave', e => { depth--; if (depth <= 0) { depth = 0; overlay.style.display = 'none'; } });
      wrap.addEventListener('drop', e => {
        e.preventDefault(); depth = 0; overlay.style.display = 'none';
        const f = e.dataTransfer?.files?.[0];
        if (f) addFn(f);
      });
    }
    async function _noteAddFile(file) {
      const status = document.getElementById('note-upload-status');
      if (!file) return;
      if (file.size > 50 * 1024 * 1024) { if (status) status.innerHTML = '<span style="color:var(--error)">File too large (50MB max)</span>'; return; }
      if (status) status.innerHTML = '⏳ Uploading ' + file.name + '…';
      try {
        const att = await uploadAttachment(file);
        window._noteAttachments = window._noteAttachments || [];
        window._noteAttachments.push(att);
        document.getElementById('note-attachments').innerHTML = renderAttachmentList(window._noteAttachments, '_noteRemoveAttachment');
        if (status) status.innerHTML = '<span style="color:#10B981">✓ ' + file.name + ' attached</span>';
        setTimeout(() => { if (status) status.innerHTML = ''; }, 3000);
      } catch (e) {
        if (status) status.innerHTML = '<span style="color:var(--error)">⚠ ' + e.message + '</span>';
      }
    }
    function _noteRemoveAttachment(idx) {
      window._noteAttachments = (window._noteAttachments || []).filter((_,i) => i !== idx);
      const el = document.getElementById('note-attachments');
      if (el) el.innerHTML = renderAttachmentList(window._noteAttachments, '_noteRemoveAttachment');
    }

    function saveNote() {
      const id = document.getElementById('note-id').value;
      const subject = document.getElementById('note-subject').value.trim();
      const date = document.getElementById('note-date').value;
      const category = document.getElementById('note-category').value;
      const tags = document.getElementById('note-tags').value.trim();
      const body = document.getElementById('note-body').value.trim();
      const attachments = (window._noteAttachments || []).slice();
      if (!subject) { alert('Subject is required.'); return; }
      const notes = getData('notes') || [];
      if (id) {
        const idx = notes.findIndex(n => n.id === id);
        if (idx > -1) {
          notes[idx] = { ...notes[idx], subject, date, category, tags, body, attachments, updatedAt: Date.now() };
        }
      } else {
        notes.push({ id: generateId(), subject, date, category, tags, body, attachments, createdAt: Date.now(), updatedAt: Date.now() });
      }
      setData('notes', notes);
      window._noteAttachments = [];
      closeModal('note-modal');
      renderNotes();
      showToast(id ? 'Note updated' : 'Note saved', 'success');
    }

    function deleteNote(id) {
      const notes = getData('notes') || [];
      const note = notes.find(n => n.id === id);
      if (!note) return;
      if (!confirm('Delete this note?')) return;
      const idx = notes.findIndex(n => n.id === id);
      setData('notes', notes.filter(n => n.id !== id));
      closeModal('note-modal');
      renderNotes();
      // Restore by re-inserting at the original index so order is preserved.
      showUndoToast('Note deleted', () => {
        const current = getData('notes') || [];
        current.splice(Math.min(idx, current.length), 0, note);
        setData('notes', current);
        renderNotes();
        showToast('Note restored', 'success');
      });
    }

    // ── BUSINESS FILE (Audit-ready document archive) ──────────────────
    // Stores proposals, contracts, invoices, brand packages with timestamps
    // Saves to localStorage as 'businessFile' — survives across sessions

    function saveToBusinessFile(opts) {
      // opts = { type, title, content, clientId?, clientName?, meta? }
      const docs = getData('businessFile') || [];
      const doc = {
        id: generateId(),
        type: opts.type || 'Document',
        title: opts.title || 'Untitled',
        content: opts.content || '',
        clientId: opts.clientId || '',
        clientName: opts.clientName || '',
        meta: opts.meta || {},
        createdAt: Date.now(),
        date: new Date().toISOString().split('T')[0]
      };
      docs.unshift(doc);
      setData('businessFile', docs);
      logActivity('system', `Saved to Business File: ${doc.type} — ${doc.title}`);
      // ALSO push to the client's portal — but ONLY after the owner confirms.
      // Limited to types that the client typically reviews/signs.
      const portalTypes = ['Proposal','Contract','Invoice','Receipt','Service Contract','Program Plan'];
      const shouldPush = doc.clientId && portalTypes.includes(doc.type) && typeof getAllClientDocs === 'function' && typeof setAllClientDocs === 'function';
      if (shouldPush && !opts.skipPortalConfirm && !confirm('Push this ' + doc.type + ' to ' + (doc.clientName || 'client') + "'s portal now?\n\nClick OK to send — they'll see it on their next portal load.\nClick Cancel to keep it private (in Business File only).")) {
        showToast('💾 Saved to Business File ✓ (not pushed to portal)', 'success');
        return doc;
      }
      if (shouldPush) {
        try {
          const existing = getAllClientDocs().filter(d => d.clientId === doc.clientId && d.type === doc.type && d.status !== 'signed');
          const portalDoc = {
            id: generateId(),
            clientId: doc.clientId,
            clientName: doc.clientName,
            type: doc.type,
            title: doc.title,
            content: doc.content,
            sentAt: new Date().toISOString(),
            status: 'sent',
            sourceBfId: doc.id  // link back to Business File copy
          };
          // Replace any unsigned previous version of the same type
          const all = getAllClientDocs();
          if (existing.length) {
            const idx = all.findIndex(d => d.id === existing[0].id);
            if (idx > -1) all[idx] = { ...portalDoc, id: existing[0].id };
            else all.push(portalDoc);
          } else {
            all.push(portalDoc);
          }
          setAllClientDocs(all);
          // Force-push the snapshot RIGHT NOW so client sees it on next reload
          const client = (getData('clients')||[]).find(c => c.id === doc.clientId);
          if (client && typeof pbPushPortalSnapshot === 'function') {
            try { pbPushPortalSnapshot(client); } catch(e){}
          }
          showToast('💾 Saved to Business File · 📤 Pushed to ' + (doc.clientName || 'client') + ' portal', 'success');
        } catch(e) {
          showToast('💾 Saved to Business File ✓', 'success');
        }
      } else {
        showToast('💾 Saved to Business File ✓', 'success');
      }
      return doc;
    }

    // ── PERSONAL FILE (text-document archive — mirrors saveToBusinessFile) ──
    // Stores AI-generated docs, website builds, notes, etc. that are personal
    // to the owner. Sits in the same `personalFiles` array as uploaded files
    // but tagged with kind:'doc' so renderPersonalFiles can show it differently.
    // Render the Manuals tab on the Reports page. Pulls from businessFile
    // entries with meta.showInReports === true (set by the Full Manual flow
    // and the "Open in Reports" toolbar button on every AI reply).
    function renderReportsManuals() {
      const list = document.getElementById('reports-manuals-list');
      if (!list) return;
      const all = getData('businessFile') || [];
      const manuals = all.filter(d => d && d.meta && d.meta.showInReports);
      if (!manuals.length) {
        list.innerHTML = '<div style="padding:36px 20px;text-align:center;color:#94A3B8;font-size:13px;background:#F8FAFC;border-radius:10px">No generated manuals yet. Open the <strong>AI Project Suite</strong>, ask a specialist for a comprehensive manual, and click the <strong>📚 Full Manual</strong> button next to Send.</div>';
        return;
      }
      const esc = s => String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      list.innerHTML = manuals.map(d => {
        const date = d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : (d.date || '');
        const sections = d.meta && d.meta.sections ? d.meta.sections + ' sections · ' : '';
        const size = d.content ? Math.round(d.content.length/1000) + 'KB' : '';
        return '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 14px;background:#fff;border:1px solid #E2E8F0;border-radius:8px;gap:12px;flex-wrap:wrap">' +
          '<div style="flex:1;min-width:200px">' +
            '<div style="font-weight:700;font-size:14px;color:#0F172A">📚 ' + esc(d.title || 'Untitled') + '</div>' +
            '<div style="font-size:11px;color:#64748B;margin-top:2px">' + esc(d.type || '') + ' · ' + sections + size + ' · ' + esc(date) + (d.meta && d.meta.partial ? ' · <span style="color:#9A3412;font-weight:700">PARTIAL</span>' : '') + '</div>' +
          '</div>' +
          '<div style="display:flex;gap:6px;flex-wrap:wrap">' +
            '<button onclick="renderReportsManualView(\'' + d.id + '\')" style="padding:6px 12px;font-size:12px;background:#1E5BC0;color:#fff;border:none;border-radius:6px;cursor:pointer">Open</button>' +
            '<button onclick="renderReportsManualDownload(\'' + d.id + '\',\'doc\')" style="padding:6px 12px;font-size:12px;background:#fff;border:1px solid #E2E8F0;color:#475569;border-radius:6px;cursor:pointer">⬇ .doc</button>' +
            '<button onclick="renderReportsManualDownload(\'' + d.id + '\',\'html\')" style="padding:6px 12px;font-size:12px;background:#fff;border:1px solid #E2E8F0;color:#475569;border-radius:6px;cursor:pointer">⬇ .html</button>' +
            '<button onclick="renderReportsManualDelete(\'' + d.id + '\')" style="padding:6px 10px;font-size:12px;background:#fff;border:1px solid rgba(0,0,0,0.15);color:#dc2626;border-radius:6px;cursor:pointer">Delete</button>' +
          '</div>' +
        '</div>';
      }).join('');
    }
    // Render the Reports tab — single AI replies saved via the "🗂 Report" /
    // "Open in Reports" buttons (meta.showAsReport). A SEPARATE bucket from the
    // multi-section Manuals (meta.showInReports). Reuses the manual view /
    // download / delete handlers since both live in the same businessFile array.
    function renderReportsReports() {
      const list = document.getElementById('reports-reports-list');
      if (!list) return;
      const all = getData('businessFile') || [];
      const reports = all.filter(d => d && d.meta && d.meta.showAsReport);
      if (!reports.length) {
        list.innerHTML = '<div style="padding:36px 20px;text-align:center;color:#94A3B8;font-size:13px;background:#F8FAFC;border-radius:10px">No reports saved yet. In an AI specialist chat, click 🗂 Report to save a reply here.</div>';
        return;
      }
      const esc = s => String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      list.innerHTML = reports.map(d => {
        const date = d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : (d.date || '');
        const size = d.content ? Math.round(d.content.length/1000) + 'KB' : '';
        return '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 14px;background:#fff;border:1px solid #E2E8F0;border-radius:10px;gap:12px;flex-wrap:wrap">' +
          '<div style="flex:1;min-width:200px">' +
            '<div style="font-weight:700;font-size:14px;color:#0F172A">📄 ' + esc(d.title || 'Untitled') + '</div>' +
            '<div style="font-size:11px;color:#64748B;margin-top:2px">' + esc(d.type || '') + ' · ' + size + ' · ' + esc(date) + '</div>' +
          '</div>' +
          '<div style="display:flex;gap:6px;flex-wrap:wrap">' +
            '<button onclick="renderReportsManualView(\'' + d.id + '\')" style="padding:6px 12px;font-size:12px;background:#1E5BC0;color:#fff;border:none;border-radius:6px;cursor:pointer">View</button>' +
            '<button onclick="renderReportsManualDownload(\'' + d.id + '\',\'doc\')" style="padding:6px 12px;font-size:12px;background:#fff;border:1px solid #CBD5E1;color:#475569;border-radius:6px;cursor:pointer">.doc</button>' +
            '<button onclick="renderReportsManualDownload(\'' + d.id + '\',\'html\')" style="padding:6px 12px;font-size:12px;background:#fff;border:1px solid #CBD5E1;color:#475569;border-radius:6px;cursor:pointer">.html</button>' +
            '<button onclick="renderReportsManualDelete(\'' + d.id + '\')" style="padding:6px 10px;font-size:12px;background:#fff;border:1px solid rgba(220,38,38,0.4);color:#dc2626;border-radius:6px;cursor:pointer">🗑</button>' +
          '</div>' +
        '</div>';
      }).join('');
    }
    function renderReportsManualView(id) {
      const d = (getData('businessFile') || []).find(x => x.id === id);
      if (!d) return;
      const ex = document.getElementById('reports-manual-view'); if (ex) ex.remove();
      const wrap = document.createElement('div');
      wrap.id = 'reports-manual-view';
      wrap.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px';
      wrap.onclick = (e) => { if (e.target === wrap) wrap.remove(); };
      wrap.innerHTML =
        '<div style="background:#fff;border-radius:14px;max-width:900px;width:100%;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 24px 64px rgba(0,0,0,0.3)">' +
          '<div style="padding:18px 22px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center">' +
            '<h2 style="margin:0;font-size:17px;font-weight:700;color:#0F172A">📚 ' + (d.title || 'Untitled') + '</h2>' +
            '<button onclick="document.getElementById(\'reports-manual-view\').remove()" style="background:transparent;border:none;font-size:24px;color:#94A3B8;cursor:pointer">×</button>' +
          '</div>' +
          '<iframe srcdoc="' + (d.content || '').replace(/"/g,'&quot;') + '" sandbox="allow-same-origin" style="flex:1;border:none;background:#fff;min-height:65vh"></iframe>' +
        '</div>';
      document.body.appendChild(wrap);
    }
    function renderReportsManualDownload(id, kind) {
      const d = (getData('businessFile') || []).find(x => x.id === id);
      if (!d || !d.content) return;
      const safeName = (d.title || 'manual').replace(/[^a-z0-9_-]+/gi, '_').slice(0, 80) + '.' + kind;
      const mime = kind === 'doc' ? 'application/msword' : 'text/html';
      const blob = new Blob([kind === 'doc' ? '﻿' : '', d.content], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = safeName;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    function renderReportsManualDelete(id) {
      if (!confirm('Delete this document? It will be removed from Reports and Business File.')) return;
      const all = getData('businessFile') || [];
      setData('businessFile', all.filter(x => x.id !== id));
      renderReportsManuals();
      if (typeof renderReportsReports === 'function') renderReportsReports();
      showToast('Document deleted', 'success');
    }

    function saveToPersonalFile(opts) {
      // opts = { type, title, content, meta? }
      const files = getData('personalFiles') || [];
      const doc = {
        id: generateId(),
        kind: 'doc',
        type: opts.type || 'Document',
        title: opts.title || 'Untitled',
        content: opts.content || '',
        meta: opts.meta || {},
        // Compatibility shims so the existing renderer's null-checks don't blow up
        name: (opts.title || 'Untitled') + (opts.type ? ' · ' + opts.type : ''),
        size: (opts.content || '').length,
        mime: 'text/html',
        uploadedAt: new Date().toISOString(),
        createdAt: Date.now(),
        date: new Date().toISOString().split('T')[0]
      };
      files.unshift(doc);
      setData('personalFiles', files);
      logActivity('system', `Saved to Personal File: ${doc.type} — ${doc.title}`);
      showToast('💾 Saved to Personal File ✓', 'success');
      return doc;
    }

    function renderBusinessFile() {
      const list = document.getElementById('bf-list');
      const filterBar = document.getElementById('bf-filter-bar');
      if (!list) return;
      const docs = getData('businessFile') || [];
      const search = (document.getElementById('bf-search')?.value || '').trim().toLowerCase();
      const activeType = window._bfActiveType || '';
      const activeFolder = window._bfActiveFolder || '';

      // Apply search first so folder/type pill counts reflect post-search items.
      const afterSearch = search ? docs.filter(d =>
        (d.title||'').toLowerCase().includes(search) ||
        (d.clientName||'').toLowerCase().includes(search) ||
        (d.content||'').toLowerCase().includes(search) ||
        (d.type||'').toLowerCase().includes(search) ||
        (d.folder||'').toLowerCase().includes(search)
      ) : docs;

      // Folder bar (sits above type pills)
      renderFolderBar('bf', afterSearch);

      // Type filter pills — counts respect search + folder
      const afterFolder = !activeFolder
        ? afterSearch
        : (activeFolder === '__unfiled'
            ? afterSearch.filter(d => !d.folder)
            : afterSearch.filter(d => d.folder === activeFolder));
      if (filterBar) {
        const types = ['All', ...new Set(afterFolder.map(d => d.type).filter(Boolean))];
        filterBar.innerHTML = types.map(t => {
          const active = (t === 'All' && !activeType) || t === activeType;
          const count = t === 'All' ? afterFolder.length : afterFolder.filter(d => d.type === t).length;
          return `<button onclick="bfFilter('${t === 'All' ? '' : t}')"
            style="padding:5px 12px;border-radius:99px;font-size:12px;font-weight:500;cursor:pointer;border:0.5px solid ${active?'var(--brand-primary)':'rgba(0,0,0,0.12)'};background:${active?'var(--brand-primary)':'#f9f9f9'};color:${active?'#fff':'#666'};transition:all .15s">
            ${t} <span style="opacity:0.7">(${count})</span>
          </button>`;
        }).join('');
      }

      // Final filtered list — search + folder + type
      let filtered = afterFolder;
      if (activeType) filtered = filtered.filter(d => d.type === activeType);

      if (!filtered.length) {
        list.innerHTML = `<div style="background:#fff;border:0.5px solid rgba(0,0,0,0.1);border-radius:12px;padding:48px 24px;text-align:center;color:#999">
          ${docs.length === 0
            ? '<div style="font-size:36px;margin-bottom:10px">📁</div><div style="font-size:15px;color:#666;margin-bottom:6px">No saved documents yet</div><div style="font-size:13px">Generate a proposal, contract, invoice, or brand package and click <strong>💾 Save to Business File</strong> to archive it here.</div>'
            : 'No documents match your search.'
          }</div>`;
        return;
      }

      // Group by type for cleaner UI
      list.innerHTML = `<table style="width:100%;border-collapse:collapse;background:#fff;border:0.5px solid rgba(0,0,0,0.1);border-radius:12px;overflow:hidden">
        <thead><tr style="background:#f9f9f9;border-bottom:0.5px solid rgba(0,0,0,0.08)">
          <th style="text-align:left;padding:12px 14px;font-size:11px;font-weight:600;color:#666;text-transform:uppercase;letter-spacing:0.5px">Date</th>
          <th style="text-align:left;padding:12px 14px;font-size:11px;font-weight:600;color:#666;text-transform:uppercase;letter-spacing:0.5px">Type</th>
          <th style="text-align:left;padding:12px 14px;font-size:11px;font-weight:600;color:#666;text-transform:uppercase;letter-spacing:0.5px">Title</th>
          <th style="text-align:left;padding:12px 14px;font-size:11px;font-weight:600;color:#666;text-transform:uppercase;letter-spacing:0.5px">Client</th>
          <th style="text-align:right;padding:12px 14px;font-size:11px;font-weight:600;color:#666;text-transform:uppercase;letter-spacing:0.5px">Actions</th>
        </tr></thead>
        <tbody>${filtered.map(d => {
          const dateStr = new Date(d.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
          const typeColors = {
            'Proposal': 'var(--brand-primary)', 'Contract': '#7C3AED', 'Invoice': '#10B981',
            'Receipt': '#10B981', 'Brand Package': '#E65100', 'Business Plan': '#1e40af'
          };
          const typeBg = {
            'Proposal': '#e6f1fb', 'Contract': '#f3e8ff', 'Invoice': '#f0fdf4',
            'Receipt': '#f0fdf4', 'Brand Package': '#fff7ed', 'Business Plan': '#eff6ff'
          };
          return `<tr style="border-bottom:0.5px solid rgba(0,0,0,0.06);transition:background .12s"
            onmouseenter="this.style.background='#fafafa'" onmouseleave="this.style.background='#fff'">
            <td style="padding:12px 14px;font-size:13px;color:#666;white-space:nowrap">${dateStr}</td>
            <td style="padding:12px 14px"><span style="font-size:11px;padding:3px 9px;border-radius:99px;font-weight:600;background:${typeBg[d.type]||'#f1f1f1'};color:${typeColors[d.type]||'#555'}">${d.type}</span></td>
            <td style="padding:12px 14px;font-size:13px;font-weight:500;color:#1a1a1a">
              <div>${d.title}</div>
              <div style="margin-top:5px">${_folderBadgeHTML('bf', d)}</div>
            </td>
            <td style="padding:12px 14px;font-size:13px;color:#666">${d.clientName || '—'}</td>
            <td style="padding:12px 14px;text-align:right;white-space:nowrap">
              <button onclick="bfView('${d.id}')" style="padding:5px 10px;font-size:12px;background:none;border:0.5px solid rgba(0,0,0,0.15);border-radius:6px;cursor:pointer;color:var(--brand-primary);font-weight:500">View</button>
              <button onclick="bfPrint('${d.id}')" style="padding:5px 10px;font-size:12px;background:none;border:0.5px solid rgba(0,0,0,0.15);border-radius:6px;cursor:pointer;color:#666;font-weight:500;margin-left:4px">Print</button>
              <button onclick="bfDownload('${d.id}')" style="padding:5px 10px;font-size:12px;background:none;border:0.5px solid rgba(0,0,0,0.15);border-radius:6px;cursor:pointer;color:#666;font-weight:500;margin-left:4px"><span class="icon icon-sm" data-icon="download" style="margin-right:4px;vertical-align:-2px"></span>Download</button>
              <button onclick="bfEmail('${d.id}')" style="padding:5px 10px;font-size:12px;background:none;border:0.5px solid var(--brand-primary);border-radius:6px;cursor:pointer;color:var(--brand-primary);font-weight:600;margin-left:4px"><span class="icon icon-sm" data-icon="send" style="margin-right:4px;vertical-align:-2px"></span>Email</button>
              <button onclick="bfSendToPortal('${d.id}')" style="padding:5px 10px;font-size:12px;background:none;border:0.5px solid #10B981;border-radius:6px;cursor:pointer;color:#10B981;font-weight:600;margin-left:4px"><span class="icon icon-sm" data-icon="upload" style="margin-right:4px;vertical-align:-2px"></span>Portal</button>
              <button onclick="bfReSign('${d.id}')" style="padding:5px 10px;font-size:12px;background:none;border:0.5px solid #7C3AED;border-radius:6px;cursor:pointer;color:#7C3AED;font-weight:600;margin-left:4px">Re-sign</button>
              <button onclick="bfDelete('${d.id}')" style="padding:5px 10px;font-size:12px;background:none;border:0.5px solid rgba(0,0,0,0.15);border-radius:6px;cursor:pointer;color:#dc2626;font-weight:500;margin-left:4px">Delete</button>
            </td>
          </tr>`;
        }).join('')}</tbody>
      </table>`;
    }

    function bfFilter(type) { window._bfActiveType = type; renderBusinessFile(); }

    // ── Styled text-prompt modal (replaces window.prompt) ────────────────────
    // Returns a Promise that resolves to the entered string, or null on cancel.
    // Used by folder Create / Rename / Move-modal "+ New folder" so the UX
    // matches the rest of the app instead of the native browser pop-up.
    function askText(opts) {
      opts = opts || {};
      return new Promise(resolve => {
        document.getElementById('ask-text-modal')?.remove();
        const m = document.createElement('div');
        m.id = 'ask-text-modal';
        m.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.55);z-index:10002;display:flex;align-items:center;justify-content:center;padding:20px';
        const escA = s => String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
        m.innerHTML = `
          <div style="background:#fff;border-radius:14px;padding:24px 26px;width:400px;max-width:100%;box-shadow:0 24px 60px rgba(0,0,0,0.25)">
            <h2 style="font-size:17px;font-weight:700;margin:0 0 4px">${escA(opts.title || 'Enter a value')}</h2>
            ${opts.message ? `<p style="font-size:13px;color:#64748B;margin:0 0 14px;line-height:1.5">${escA(opts.message)}</p>` : '<div style="margin-bottom:14px"></div>'}
            <input type="text" id="ask-text-input" class="form-input" style="margin:0 0 14px;width:100%" placeholder="${escA(opts.placeholder||'')}" value="${escA(opts.value||'')}" maxlength="${opts.maxLength || 60}">
            <div style="display:flex;gap:8px;justify-content:flex-end">
              <button type="button" id="ask-text-cancel" class="btn btn-outline" style="padding:8px 14px;font-size:13px">Cancel</button>
              <button type="button" id="ask-text-ok" class="btn btn-solid" style="padding:8px 14px;font-size:13px">${escA(opts.okLabel || 'OK')}</button>
            </div>
          </div>`;
        document.body.appendChild(m);
        const input = document.getElementById('ask-text-input');
        const cleanup = val => { m.remove(); resolve(val); };
        document.getElementById('ask-text-cancel').onclick = () => cleanup(null);
        document.getElementById('ask-text-ok').onclick = () => cleanup((input.value || '').trim());
        m.addEventListener('click', e => { if (e.target === m) cleanup(null); });
        input.addEventListener('keydown', e => {
          if (e.key === 'Enter')  { e.preventDefault(); cleanup((input.value || '').trim()); }
          if (e.key === 'Escape') { e.preventDefault(); cleanup(null); }
        });
        setTimeout(() => { input.focus(); input.select(); }, 50);
      });
    }

    // ── Folders (shared, scope-aware) ────────────────────────────────────────
    // Groups Business File and Personal Files items into user-defined folders.
    // Scope is 'bf' (businessFile) or 'pf' (personalFiles). Folders themselves
    // are stored explicitly so empty folders persist; items reference a folder
    // by name string. `__unfiled` filter targets items with empty/missing folder.
    const _FOLDER_CFG = {
      bf: { folderKey:'businessFileFolders', itemKey:'businessFile', render:() => renderBusinessFile(), label:'Business File' },
      pf: { folderKey:'personalFileFolders', itemKey:'personalFiles', render:() => renderPersonalFiles(), label:'Personal Files' }
    };
    function _foldersGet(scope) {
      const cfg = _FOLDER_CFG[scope]; if (!cfg) return [];
      const raw = getData(cfg.folderKey);
      return Array.isArray(raw) ? raw.slice() : [];
    }
    function _foldersSet(scope, list) {
      const cfg = _FOLDER_CFG[scope]; if (!cfg) return;
      const uniq = [...new Set(list.filter(Boolean).map(s => String(s).trim()).filter(Boolean))]
        .sort((a,b) => a.localeCompare(b));
      setData(cfg.folderKey, uniq);
    }
    async function _folderNew(scope) {
      const raw = await askText({
        title: 'New folder',
        message: 'Group related ' + _FOLDER_CFG[scope].label.toLowerCase() + ' items together.',
        placeholder: 'e.g. Project Alpha',
        okLabel: 'Create'
      });
      if (raw == null) return;
      const name = raw.slice(0, 60);
      if (!name) return;
      const folders = _foldersGet(scope);
      if (folders.some(f => f.toLowerCase() === name.toLowerCase())) {
        showToast('Folder "' + name + '" already exists', 'warn'); return;
      }
      folders.push(name);
      _foldersSet(scope, folders);
      _FOLDER_CFG[scope].render();
    }
    async function _folderRename(scope, oldName) {
      const raw = await askText({
        title: 'Rename folder',
        value: oldName,
        okLabel: 'Rename'
      });
      if (raw == null) return;
      const newName = raw.slice(0, 60);
      if (!newName || newName === oldName) return;
      const folders = _foldersGet(scope);
      if (folders.some(f => f.toLowerCase() === newName.toLowerCase() && f !== oldName)) {
        showToast('Folder "' + newName + '" already exists', 'warn'); return;
      }
      const idx = folders.indexOf(oldName);
      if (idx > -1) folders[idx] = newName;
      _foldersSet(scope, folders);
      const items = getData(_FOLDER_CFG[scope].itemKey) || [];
      items.forEach(x => { if (x.folder === oldName) x.folder = newName; });
      setData(_FOLDER_CFG[scope].itemKey, items);
      // If user was filtering by the renamed folder, follow it.
      const activeProp = scope === 'bf' ? '_bfActiveFolder' : '_pfActiveFolder';
      if (window[activeProp] === oldName) window[activeProp] = newName;
      _FOLDER_CFG[scope].render();
    }
    function _folderDelete(scope, name) {
      const items = getData(_FOLDER_CFG[scope].itemKey) || [];
      const inFolder = items.filter(x => x.folder === name).length;
      let msg = 'Delete folder "' + name + '"?';
      if (inFolder) msg += '\n\nThis folder contains ' + inFolder + ' item' + (inFolder>1?'s':'') + '. They will be moved to Unfiled (the items themselves are kept).';
      if (!confirm(msg)) return;
      const folders = _foldersGet(scope).filter(f => f !== name);
      _foldersSet(scope, folders);
      items.forEach(x => { if (x.folder === name) x.folder = ''; });
      setData(_FOLDER_CFG[scope].itemKey, items);
      const activeProp = scope === 'bf' ? '_bfActiveFolder' : '_pfActiveFolder';
      if (window[activeProp] === name) window[activeProp] = '';
      _FOLDER_CFG[scope].render();
    }
    function _itemSetFolder(scope, id, folder) {
      const items = getData(_FOLDER_CFG[scope].itemKey) || [];
      const idx = items.findIndex(x => x.id === id);
      if (idx < 0) return;
      items[idx].folder = folder || '';
      // If user typed in a folder that doesn't exist yet, register it.
      if (folder) {
        const folders = _foldersGet(scope);
        if (!folders.some(f => f.toLowerCase() === folder.toLowerCase())) {
          folders.push(folder);
          _foldersSet(scope, folders);
        }
      }
      setData(_FOLDER_CFG[scope].itemKey, items);
      _FOLDER_CFG[scope].render();
    }
    function _folderSetActive(scope, name) {
      if (scope === 'bf') window._bfActiveFolder = name;
      else window._pfActiveFolder = name;
      _FOLDER_CFG[scope].render();
    }
    // Render the folder pill bar for a scope. Counts reflect the items array
    // passed in (search-filtered but NOT folder-filtered, so each pill's count
    // shows the items it would contain).
    function renderFolderBar(scope, items) {
      const barEl = document.getElementById(scope + '-folder-bar');
      if (!barEl) return;
      const active = scope === 'bf' ? (window._bfActiveFolder || '') : (window._pfActiveFolder || '');
      const folders = _foldersGet(scope);
      const escAttr = s => String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
      const escHtml = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;');
      const pill = (key, label, count, isActive, isDashed) => `
        <button onclick="_folderSetActive('${scope}', '${escAttr(key)}')"
          style="padding:5px 12px;border-radius:99px;font-size:12px;font-weight:500;cursor:pointer;border:0.5px ${isDashed?'dashed':'solid'} ${isActive?'var(--brand-primary)':'rgba(0,0,0,0.12)'};background:${isActive?'var(--brand-primary)':'#f9f9f9'};color:${isActive?'#fff':'#666'};transition:all .15s">
          ${label} ${count != null ? '<span style="opacity:0.7">('+count+')</span>' : ''}
        </button>`;
      let html = '';
      html += pill('', '📁 All', items.length, !active);
      html += pill('__unfiled', '📂 Unfiled', items.filter(x => !x.folder).length, active === '__unfiled');
      folders.forEach(f => {
        html += pill(f, '📂 ' + escHtml(f), items.filter(x => x.folder === f).length, active === f);
      });
      html += `<button onclick="_folderNew('${scope}')" style="padding:5px 12px;border-radius:99px;font-size:12px;font-weight:500;cursor:pointer;border:0.5px dashed rgba(0,0,0,0.25);background:transparent;color:#666;transition:all .15s">+ New folder</button>`;
      if (folders.length) {
        html += `<button onclick="_folderManageOpen('${scope}')" style="padding:5px 12px;border-radius:99px;font-size:12px;font-weight:500;cursor:pointer;border:0.5px solid rgba(0,0,0,0.12);background:#f9f9f9;color:#666;transition:all .15s">⚙ Manage</button>`;
      }
      barEl.innerHTML = html;
    }
    function _folderManageOpen(scope) {
      const folders = _foldersGet(scope);
      if (!folders.length) return;
      const id = 'folder-manage-modal';
      document.getElementById(id)?.remove();
      const items = getData(_FOLDER_CFG[scope].itemKey) || [];
      const escA = s => String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
      const escH = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      const rows = folders.map(f => {
        const count = items.filter(x => x.folder === f).length;
        return `<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 14px;border-bottom:1px solid #F1F5F9">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:20px">📂</span>
            <div>
              <div style="font-size:14px;font-weight:600;color:#0F172A">${escH(f)}</div>
              <div style="font-size:11px;color:#94A3B8">${count} item${count===1?'':'s'}</div>
            </div>
          </div>
          <div style="display:flex;gap:6px">
            <button onclick="_folderRename('${scope}','${escA(f)}');setTimeout(()=>_folderManageOpen('${scope}'),0)" style="padding:5px 10px;font-size:12px;background:none;border:0.5px solid rgba(0,0,0,0.15);border-radius:6px;cursor:pointer;color:#666">Rename</button>
            <button onclick="_folderDelete('${scope}','${escA(f)}');setTimeout(()=>{var m=document.getElementById('${id}');if(m&&_foldersGet('${scope}').length)_folderManageOpen('${scope}');else m&&m.remove()},0)" style="padding:5px 10px;font-size:12px;background:none;border:0.5px solid rgba(0,0,0,0.15);border-radius:6px;cursor:pointer;color:#dc2626">Delete</button>
          </div>
        </div>`;
      }).join('');
      const overlay = document.createElement('div');
      overlay.id = id;
      overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(15,23,42,0.55);display:flex;align-items:center;justify-content:center;padding:20px';
      overlay.innerHTML = `<div style="background:#fff;border-radius:14px;max-width:480px;width:100%;box-shadow:0 16px 50px rgba(0,0,0,0.25);overflow:hidden">
        <div style="padding:18px 22px;border-bottom:1px solid #E2E8F0">
          <h3 style="font-size:17px;font-weight:700;margin:0">Manage folders</h3>
          <p style="font-size:12.5px;color:#64748B;margin:4px 0 0">${_FOLDER_CFG[scope].label}</p>
        </div>
        <div style="max-height:60vh;overflow-y:auto">${rows}</div>
        <div style="padding:12px 22px;border-top:1px solid #E2E8F0;background:#F8FAFC;display:flex;justify-content:flex-end;gap:8px">
          <button onclick="document.getElementById('${id}').remove()" class="btn btn-solid" style="padding:8px 16px">Done</button>
        </div>
      </div>`;
      overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
      document.body.appendChild(overlay);
    }
    function _folderMoveOpen(scope, id) {
      const items = getData(_FOLDER_CFG[scope].itemKey) || [];
      const item = items.find(x => x.id === id);
      if (!item) return;
      const folders = _foldersGet(scope);
      const modalId = 'folder-move-modal';
      document.getElementById(modalId)?.remove();
      const escA = s => String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
      const escH = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      const current = item.folder || '';
      const opts = `<option value="">— Unfiled —</option>` +
        folders.map(f => `<option value="${escA(f)}" ${f===current?'selected':''}>${escH(f)}</option>`).join('');
      const itemLabel = scope === 'bf' ? (item.title || 'Untitled') : (item.name || 'File');
      const overlay = document.createElement('div');
      overlay.id = modalId;
      overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(15,23,42,0.55);display:flex;align-items:center;justify-content:center;padding:20px';
      overlay.innerHTML = `<div style="background:#fff;border-radius:14px;max-width:420px;width:100%;box-shadow:0 16px 50px rgba(0,0,0,0.25);overflow:hidden">
        <div style="padding:18px 22px;border-bottom:1px solid #E2E8F0">
          <h3 style="font-size:17px;font-weight:700;margin:0">Move to folder</h3>
          <p style="font-size:12.5px;color:#64748B;margin:4px 0 0">${escH(itemLabel)}</p>
        </div>
        <div style="padding:16px 22px">
          <label class="form-label">Folder</label>
          <select id="folder-move-select" class="form-input" style="margin:0 0 10px">${opts}</select>
          <button type="button" onclick="_folderMoveNewFolder()" class="btn btn-outline" style="padding:6px 12px;font-size:12.5px">+ New folder</button>
        </div>
        <div style="padding:12px 22px;border-top:1px solid #E2E8F0;background:#F8FAFC;display:flex;justify-content:flex-end;gap:8px">
          <button onclick="document.getElementById('${modalId}').remove()" class="btn btn-outline" style="padding:8px 16px">Cancel</button>
          <button onclick="_folderMoveApply('${scope}','${escA(id)}')" class="btn btn-solid" style="padding:8px 16px">Move</button>
        </div>
      </div>`;
      overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
      document.body.appendChild(overlay);
    }
    async function _folderMoveNewFolder() {
      const raw = await askText({
        title: 'New folder',
        placeholder: 'e.g. Project Alpha',
        okLabel: 'Create'
      });
      if (raw == null) return;
      const v = raw.slice(0, 60);
      if (!v) return;
      const sel = document.getElementById('folder-move-select');
      if (!sel) return;
      // If a matching option already exists, just select it.
      const match = Array.from(sel.options).find(o => o.value.toLowerCase() === v.toLowerCase());
      if (match) { match.selected = true; return; }
      const o = document.createElement('option');
      o.value = v; o.textContent = v; o.selected = true;
      sel.appendChild(o);
    }
    function _folderMoveApply(scope, id) {
      const sel = document.getElementById('folder-move-select');
      if (!sel) return;
      const folder = (sel.value || '').trim();
      _itemSetFolder(scope, id, folder);
      document.getElementById('folder-move-modal')?.remove();
      showToast(folder ? 'Moved to "' + folder + '"' : 'Moved to Unfiled', 'success');
    }
    function _folderBadgeHTML(scope, item) {
      const f = item.folder || '';
      const esc = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/'/g,'&#39;');
      const label = f ? '📂 ' + esc(f) : '+ Folder';
      const bg = f ? '#EEF2FF' : 'transparent';
      const color = f ? '#3730A3' : '#94A3B8';
      const border = f ? '0.5px solid #C7D2FE' : '0.5px dashed rgba(0,0,0,0.18)';
      return `<button onclick="event.stopPropagation();_folderMoveOpen('${scope}','${esc(item.id)}')" title="${f ? 'Move folder' : 'Add to folder'}" style="padding:3px 9px;font-size:11px;border-radius:99px;border:${border};background:${bg};color:${color};cursor:pointer;font-weight:500;white-space:nowrap">${label}</button>`;
    }

    // ── Styled long-form report renderer ─────────────────────────────────────
    // Turns AI-generated markdown-ish content into a polished sectioned report
    // with auto-numbered headings, tables, callouts, and a per-type palette.
    // Used by bfView, bfPrint, bfDownload for non-financial doc types.
    const REPORT_PALETTES = {
      'Business Plan':         { primary:'#1E3A8A', accent:'#3B82F6', tint:'#EFF6FF', soft:'#DBEAFE' },
      'Business Strategy':     { primary:'#1E3A8A', accent:'#3B82F6', tint:'#EFF6FF', soft:'#DBEAFE' },
      'Brand Package':         { primary:'#9A3412', accent:'#F59E0B', tint:'#FFFBEB', soft:'#FEF3C7' },
      'LVS':                   { primary:'#5B21B6', accent:'#8B5CF6', tint:'#F5F3FF', soft:'#EDE9FE' },
      'Limitless Vision':      { primary:'#5B21B6', accent:'#8B5CF6', tint:'#F5F3FF', soft:'#EDE9FE' },
      'Career Channel':        { primary:'#0F766E', accent:'#14B8A6', tint:'#F0FDFA', soft:'#CCFBF1' },
      'Career Plan':           { primary:'#0F766E', accent:'#14B8A6', tint:'#F0FDFA', soft:'#CCFBF1' },
      'Smart Credit':          { primary:'#166534', accent:'#22C55E', tint:'#F0FDF4', soft:'#DCFCE7' },
      'Outreach Comms':        { primary:'#9D174D', accent:'#EC4899', tint:'#FDF2F8', soft:'#FCE7F3' },
      'Program Plan':          { primary:'#3730A3', accent:'#6366F1', tint:'#EEF2FF', soft:'#E0E7FF' },
      'Program Planner':       { primary:'#3730A3', accent:'#6366F1', tint:'#EEF2FF', soft:'#E0E7FF' },
      'AI Coach':              { primary:'#0F172A', accent:'#1E5BC0', tint:'#EFF6FF', soft:'#DBEAFE' },
      'Document':              { primary:'#0F172A', accent:'#1E5BC0', tint:'#F1F5F9', soft:'#E2E8F0' }
    };
    const REPORT_DEFAULT_PALETTE = { primary:'#0F172A', accent:'#1E5BC0', tint:'#F1F5F9', soft:'#E2E8F0' };
    // Financial / legal docs already render via printDoc's line-item engine.
    const _financialDocTypes = new Set([
      'Invoice','Receipt','Proposal','Contract','Service Contract','NDA',
      'IC','Coaching','Retainer','SOW','Website','Copyright','Release','Speaker'
    ]);
    function _isFinancialDoc(t) { return _financialDocTypes.has(t || ''); }
    function _reportPalette(type) { return REPORT_PALETTES[type] || REPORT_DEFAULT_PALETTE; }
    // Some docs (Full Manuals) are saved with content that is ALREADY a complete
    // styled HTML document (from _wrapManualHtml). Those must be shown/printed as-is
    // in an iframe — never re-run through the markdown renderer, which would escape
    // every tag and surface the raw HTML/CSS as literal text.
    function _isFullHtmlDoc(c) { return /^\s*(<!DOCTYPE html|<html[\s>])/i.test(c || ''); }

    function _mdInline(s) {
      s = String(s == null ? '' : s)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      s = s.replace(/`([^`]+)`/g, '<code style="background:rgba(15,23,42,0.06);padding:1px 5px;border-radius:3px;font-family:ui-monospace,Menlo,monospace;font-size:0.92em">$1</code>');
      s = s.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
      s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
      s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" style="color:inherit;text-decoration:underline">$1</a>');
      return s;
    }

    // Parse markdown-ish text into a block list. Lightweight; only handles the
    // features AI commonly emits — headings, paragraphs, lists, tables, quotes.
    function _parseMd(text) {
      const lines = (text || '').replace(/\r\n/g, '\n').split('\n');
      const out = [];
      let i = 0;
      const isStartOfBlock = ln => /^(#{1,6}\s|>|\||[-*]\s|\d+\.\s|---|===|___)/.test(ln.trim());
      while (i < lines.length) {
        const ln = lines[i], t = ln.trim();
        if (!t) { i++; continue; }
        if (/^[-=_*]{3,}$/.test(t)) { out.push({ type:'hr' }); i++; continue; }
        let m;
        if (m = t.match(/^(#{1,6})\s+(.*)$/)) {
          out.push({ type:'h', level:m[1].length, text:m[2].trim() }); i++; continue;
        }
        if (t.startsWith('>')) {
          const buf = [];
          while (i < lines.length && lines[i].trim().startsWith('>')) {
            buf.push(lines[i].trim().replace(/^>\s?/, '')); i++;
          }
          out.push({ type:'quote', text: buf.join('\n') });
          continue;
        }
        // Markdown table: header row with pipes, divider row with --- in pipes
        if (t.includes('|') && i+1 < lines.length
            && /^\s*\|?\s*:?-{2,}.*$/.test(lines[i+1])
            && lines[i+1].includes('-') && lines[i+1].includes('|')) {
          const head = t.replace(/^\||\|$/g, '').split('|').map(s => s.trim());
          i += 2;
          const rows = [];
          while (i < lines.length && lines[i].includes('|') && lines[i].trim()) {
            rows.push(lines[i].trim().replace(/^\||\|$/g, '').split('|').map(s => s.trim()));
            i++;
          }
          out.push({ type:'table', head, rows });
          continue;
        }
        if (/^[-*]\s+/.test(t) || /^\d+\.\s+/.test(t)) {
          const ordered = /^\d+\.\s+/.test(t);
          const items = [];
          while (i < lines.length && (ordered ? /^\d+\.\s+/.test(lines[i].trim()) : /^[-*]\s+/.test(lines[i].trim()))) {
            items.push(lines[i].trim().replace(/^([-*]|\d+\.)\s+/, ''));
            i++;
          }
          out.push({ type:'list', ordered, items });
          continue;
        }
        const buf = [t]; i++;
        while (i < lines.length && lines[i].trim() && !isStartOfBlock(lines[i])) {
          buf.push(lines[i].trim()); i++;
        }
        out.push({ type:'p', text: buf.join(' ') });
      }
      return out;
    }

    // Build the report HTML. opts.standalone returns a full HTML doc for
    // print/download windows; otherwise returns an inner fragment for modals.
    function renderReportHTML(doc, opts) {
      opts = opts || {};
      const pal = _reportPalette(doc.type);
      const blocks = _parseMd(doc.content || '');

      // Auto-number top-level / second-level headings only if not already
      // numbered. Skips H3+ — those are subsection labels, not chapters.
      let h1 = 0, h2 = 0;
      for (const b of blocks) {
        if (b.type !== 'h') continue;
        if (b.level === 1) {
          h1++; h2 = 0;
          if (!/^\d+\.\s/.test(b.text)) b.text = h1 + '. ' + b.text;
        } else if (b.level === 2) {
          h2++;
          if (!/^\d+\.\d+\s/.test(b.text)) b.text = (h1 || 1) + '.' + h2 + ' ' + b.text;
        }
      }

      const isBottomLine = txt => /^bottom line\b/i.test((txt || '').trim());
      let body = '';
      for (const b of blocks) {
        if (b.type === 'hr') {
          body += `<hr style="border:none;border-top:1px solid ${pal.soft};margin:24px 0">`;
        } else if (b.type === 'h' && b.level === 1) {
          body += `<h2 style="font-size:22px;font-weight:700;color:${pal.primary};margin:32px 0 12px;padding-bottom:8px;border-bottom:2px solid ${pal.accent};page-break-after:avoid">${_mdInline(b.text)}</h2>`;
        } else if (b.type === 'h' && b.level === 2) {
          body += `<h3 style="font-size:17px;font-weight:600;color:${pal.primary};margin:22px 0 10px;page-break-after:avoid">${_mdInline(b.text)}</h3>`;
        } else if (b.type === 'h') {
          body += `<h4 style="font-size:13px;font-weight:700;color:${pal.primary};margin:18px 0 8px;text-transform:uppercase;letter-spacing:0.6px;page-break-after:avoid">${_mdInline(b.text)}</h4>`;
        } else if (b.type === 'p') {
          body += `<p style="font-size:14px;line-height:1.75;color:#1F2937;margin:0 0 14px">${_mdInline(b.text)}</p>`;
        } else if (b.type === 'quote') {
          const bottom = isBottomLine(b.text);
          const bg = bottom ? pal.primary : pal.tint;
          const fg = bottom ? '#fff' : '#1F2937';
          const bd = bottom ? pal.primary : pal.accent;
          const label = bottom ? `<div style="font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${bottom?'rgba(255,255,255,0.7)':pal.accent};margin-bottom:6px">Bottom Line</div>` : '';
          body += `<div style="background:${bg};color:${fg};border-left:4px solid ${bd};padding:18px 22px;margin:18px 0;border-radius:6px;font-size:14px;line-height:1.7;page-break-inside:avoid">${label}${_mdInline(b.text).replace(/\n/g,'<br>')}</div>`;
        } else if (b.type === 'table') {
          const hdr = b.head.map(h => `<th style="text-align:left;padding:10px 14px;background:${pal.primary};color:#fff;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.4px">${_mdInline(h)}</th>`).join('');
          const rowsHtml = b.rows.map((r, idx) => {
            const cells = r.map(c => `<td style="padding:10px 14px;font-size:13px;border-bottom:1px solid ${pal.soft};color:#1F2937;vertical-align:top">${_mdInline(c)}</td>`).join('');
            return `<tr style="background:${idx % 2 === 0 ? '#fff' : pal.tint}">${cells}</tr>`;
          }).join('');
          body += `<div style="overflow-x:auto;margin:16px 0;page-break-inside:avoid"><table style="width:100%;border-collapse:collapse;border:1px solid ${pal.soft};border-radius:6px;overflow:hidden"><thead><tr>${hdr}</tr></thead><tbody>${rowsHtml}</tbody></table></div>`;
        } else if (b.type === 'list') {
          const tag = b.ordered ? 'ol' : 'ul';
          const items = b.items.map(it => `<li style="font-size:14px;line-height:1.7;color:#1F2937;margin:5px 0">${_mdInline(it)}</li>`).join('');
          body += `<${tag} style="margin:10px 0 16px;padding-left:24px">${items}</${tag}>`;
        }
      }

      const settings = (typeof getData === 'function') ? (getData('settings') || {}) : {};
      const biz = settings.businessName || 'H.E.L.P. Center';
      const escH = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      const dateStr = new Date(doc.createdAt || Date.now())
        .toLocaleDateString('en-US', { month:'long', year:'numeric' });
      const stamp = doc.clientName ? 'Prepared for ' + doc.clientName : 'Confidential';

      const titleBlock = `
        <div style="border-top:6px solid ${pal.accent};padding:32px 40px 26px;background:${pal.tint};border-radius:6px 6px 0 0">
          <div style="font-size:11px;font-weight:700;letter-spacing:1.6px;color:${pal.primary};text-transform:uppercase;margin-bottom:6px">${escH(biz)}</div>
          <div style="font-size:12px;font-weight:600;color:${pal.accent};margin-bottom:18px;letter-spacing:0.5px;text-transform:uppercase">${escH(doc.type || 'Report')}</div>
          <h1 style="font-size:30px;font-weight:700;color:${pal.primary};margin:0 0 14px;line-height:1.2">${escH(doc.title || 'Untitled')}</h1>
          <div style="font-size:11px;color:#64748B;letter-spacing:0.4px">Version 1.0 &nbsp;·&nbsp; ${escH(dateStr)} &nbsp;·&nbsp; ${escH(stamp)}</div>
        </div>`;
      const inner = `${titleBlock}<div style="padding:8px 40px 40px">${body || '<p style="color:#94A3B8;font-style:italic">No content.</p>'}</div>`;

      if (opts.standalone) {
        return `<!doctype html><html><head><meta charset="utf-8"><title>${escH(doc.title || 'Report')}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background:#F8FAFC; margin:0; padding:24px; color:#1F2937; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  .report { max-width: 880px; margin: 0 auto; background:#fff; border-radius:6px; box-shadow:0 4px 24px rgba(15,23,42,0.08); overflow:hidden; }
  @media print {
    body { background:#fff; padding:0; }
    .report { box-shadow:none; max-width:none; border-radius:0; }
    @page { margin: 0.6in; }
    table, ul, ol { page-break-inside: auto; }
  }
</style></head><body><div class="report">${inner}</div></body></html>`;
      }
      return `<div style="background:#fff;border-radius:6px;overflow:hidden;border:1px solid ${pal.soft}">${inner}</div>`;
    }

    function bfView(id) {
      const doc = (getData('businessFile')||[]).find(d => d.id === id);
      if (!doc) return;
      const modalId = 'bf-view-modal';
      document.getElementById(modalId)?.remove();
      const modal = document.createElement('div');
      modal.id = modalId;
      modal.className = 'modal-overlay';
      // Long-form reports use the styled renderer; financial docs (Invoice,
      // Receipt, Proposal, Contract...) keep the plain <pre> view because their
      // print flow depends on the raw ASCII line-item layout.
      const useStyled = !_isFinancialDoc(doc.type);
      const bodyHtml = _isFullHtmlDoc(doc.content)
        ? `<iframe srcdoc="${(doc.content||'').replace(/"/g,'&quot;')}" sandbox="allow-same-origin" style="width:100%;border:none;background:#fff;min-height:70vh;border-radius:8px"></iframe>`
        : useStyled
          ? renderReportHTML(doc)
          : `<pre style="white-space:pre-wrap;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;line-height:1.7;background:#f9f9f9;padding:18px;border-radius:8px;border:0.5px solid rgba(0,0,0,0.08);margin:0;color:#1a1a1a">${(doc.content||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</pre>`;
      modal.innerHTML = `
        <div class="modal-box" style="max-width:920px;max-height:92vh;display:flex;flex-direction:column">
          <div class="modal-header">
            <div class="modal-title">${doc.type} — ${doc.title}</div>
            <button class="modal-close" onclick="closeModal('${modalId}')">×</button>
          </div>
          <div class="modal-body" style="overflow-y:auto;flex:1;background:#F8FAFC">
            <div style="font-size:12px;color:#94A3B8;margin-bottom:12px">
              Saved ${new Date(doc.createdAt).toLocaleString()} ${doc.clientName ? '• Client: '+doc.clientName : ''}
            </div>
            ${bodyHtml}
            <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:14px;flex-wrap:wrap">
              <button onclick="bfCopy('${doc.id}')" class="btn btn-outline" style="padding:8px 14px;font-size:13px"><span class="icon icon-sm" data-icon="clipboard" style="margin-right:6px;vertical-align:-2px"></span>Copy</button>
              <button onclick="bfDownload('${doc.id}')" class="btn btn-outline" style="padding:8px 14px;font-size:13px"><span class="icon icon-sm" data-icon="download" style="margin-right:6px;vertical-align:-2px"></span>Download</button>
              <button onclick="bfPrint('${doc.id}')" class="btn btn-outline" style="padding:8px 14px;font-size:13px"><span class="icon icon-sm" data-icon="print" style="margin-right:6px;vertical-align:-2px"></span>Print</button>
              <button onclick="closeModal('${modalId}')" class="btn btn-solid" style="padding:8px 14px;font-size:13px">Close</button>
            </div>
          </div>
        </div>`;
      modal.addEventListener('click', e => { if (e.target === modal) closeModal(modalId); });
      document.body.appendChild(modal);
    }

    function bfCopy(id) {
      const doc = (getData('businessFile')||[]).find(d => d.id === id);
      if (!doc) return;
      navigator.clipboard.writeText(doc.content || '').catch(()=>{});
      showToast('Copied to clipboard ✓','success');
    }

    function bfPrint(id) {
      const doc = (getData('businessFile')||[]).find(d => d.id === id);
      if (!doc) return;
      // Long-form reports (Business Plan, Brand Package, AI Coach, 10x outputs)
      // open in a styled print window. Invoices, contracts, etc. fall back to
      // printDoc which knows how to format line-item tables and signatures.
      if (!_isFinancialDoc(doc.type)) {
        const html = _isFullHtmlDoc(doc.content) ? doc.content : renderReportHTML(doc, { standalone: true });
        const w = window.open('', '_blank', 'width=900,height=1000');
        if (!w) { showToast('Pop-up blocked — allow pop-ups to print', 'warn'); return; }
        w.document.write(html);
        w.document.close();
        // Defer print() until images/fonts settle.
        setTimeout(() => { try { w.focus(); w.print(); } catch(_) {} }, 350);
        return;
      }
      let temp = document.getElementById('bf-print-temp');
      if (!temp) {
        temp = document.createElement('textarea');
        temp.id = 'bf-print-temp';
        temp.style.display = 'none';
        document.body.appendChild(temp);
      }
      temp.value = doc.content;
      printDoc('bf-print-temp');
    }

    function bfDelete(id) {
      const docs = getData('businessFile') || [];
      const doc = docs.find(d => d.id === id);
      if (!doc) return;
      if (!confirm('Delete this document from your Business File?')) return;
      const idx = docs.findIndex(d => d.id === id);
      setData('businessFile', docs.filter(d => d.id !== id));
      renderBusinessFile();
      showUndoToast('Document deleted', () => {
        const current = getData('businessFile') || [];
        current.splice(Math.min(idx, current.length), 0, doc);
        setData('businessFile', current);
        renderBusinessFile();
        showToast('Document restored', 'success');
      });
    }

    // Send a Business File doc to a client's portal — opens the same modal used
    // for AI-chat outputs but pre-fills with the doc's title/type/content.
    // Download long-form reports as a styled .html file (opens in any browser
    // and Word); financial docs (Invoice, Contract, etc.) stay .txt so the
    // ASCII line-item layout survives the round-trip.
    function bfDownload(id) {
      const doc = (getData('businessFile') || []).find(d => d.id === id);
      if (!doc) { showToast('Document not found'); return; }
      const safeTitle = (doc.title || doc.type || 'document').replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 60);
      const dateStr = new Date(doc.createdAt || Date.now()).toISOString().slice(0, 10);
      const styled = !_isFinancialDoc(doc.type);
      const payload = styled ? (_isFullHtmlDoc(doc.content) ? doc.content : renderReportHTML(doc, { standalone: true })) : (doc.content || '');
      const mime = styled ? 'text/html;charset=utf-8' : 'text/plain;charset=utf-8';
      const ext = styled ? 'html' : 'txt';
      const blob = new Blob([payload], { type: mime });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = safeTitle + '_' + dateStr + '.' + ext;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }

    // Email a saved Business File doc to a client (or any address) via Resend
    function bfEmail(id) {
      const doc = (getData('businessFile') || []).find(d => d.id === id);
      if (!doc) { showToast('Document not found'); return; }
      const clients = getData('clients') || [];
      const settings = JSON.parse(localStorage.getItem('settings') || '{}');
      const ownerName = settings.name || 'Joy Watford';
      const biz = settings.businessName || 'H.E.L.P. Center';
      const escH = s => (s || '').toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      const old = document.getElementById('bf-email-overlay'); if (old) old.remove();
      const overlay = document.createElement('div');
      overlay.id = 'bf-email-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(15,23,42,0.55);display:flex;align-items:center;justify-content:center;padding:20px';
      const clientOpts = '<option value="">— pick a client or enter custom email below —</option>' +
        clients.filter(c => c.email).map(c => '<option value="' + escH(c.email) + '">' + escH(c.name || c.businessName) + ' &lt;' + escH(c.email) + '&gt;</option>').join('');
      const seedEmail = (clients.find(c => c.id === doc.clientId) || {}).email || '';
      overlay.innerHTML =
        '<div style="background:#fff;border-radius:14px;max-width:540px;width:100%;box-shadow:0 16px 50px rgba(0,0,0,0.25);overflow:hidden">' +
          '<div style="padding:18px 22px;border-bottom:1px solid var(--gray-200,#e5e7eb)">' +
            '<h3 style="font-size:17px;font-weight:700;margin:0">Email document</h3>' +
            '<p style="font-size:12.5px;color:#64748B;margin:4px 0 0">Sending: <strong>' + escH(doc.title) + '</strong> &middot; <span style="color:#94A3B8">' + escH(doc.type) + '</span></p>' +
          '</div>' +
          '<div style="padding:16px 22px">' +
            '<label class="form-label">Pick a client</label><select id="bf-em-client" class="form-input" style="margin:0 0 10px" onchange="document.getElementById(\'bf-em-to\').value=this.value">' + clientOpts + '</select>' +
            '<label class="form-label">To (email address)</label><input id="bf-em-to" type="email" class="form-input" style="margin:0 0 12px" placeholder="recipient@example.com" value="' + escH(seedEmail) + '">' +
            '<label class="form-label">Subject</label><input id="bf-em-subj" class="form-input" style="margin:0 0 12px" value="' + escH(doc.title + ' — ' + biz) + '">' +
            '<label class="form-label">Note to recipient (added before the document)</label>' +
            '<textarea id="bf-em-note" class="form-input" style="margin:0;min-height:90px;resize:vertical;font-family:inherit;line-height:1.55">Hi,\n\nPlease find attached the ' + escH(doc.type.toLowerCase()) + ' below.\n\n— ' + escH(ownerName) + '</textarea>' +
          '</div>' +
          '<div style="padding:12px 22px;border-top:1px solid var(--gray-200,#e5e7eb);background:#F8FAFC;display:flex;justify-content:flex-end;gap:8px">' +
            '<button onclick="document.getElementById(\'bf-email-overlay\').remove()" class="btn btn-outline" style="padding:8px 16px">Cancel</button>' +
            '<button onclick="_bfDoEmail(\'' + id + '\')" id="bf-em-send" class="btn btn-solid" style="padding:8px 16px">Send</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(overlay);
    }
    async function _bfDoEmail(id) {
      const doc = (getData('businessFile') || []).find(d => d.id === id);
      if (!doc) return;
      const to = (document.getElementById('bf-em-to').value || '').trim();
      const subject = (document.getElementById('bf-em-subj').value || '').trim();
      const note = (document.getElementById('bf-em-note').value || '').trim();
      if (!to || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) { alert('Please enter a valid email address.'); return; }
      const btn = document.getElementById('bf-em-send');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      const noteHtml = note.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br>');
      const docHtml = '<pre style="font-family:Consolas,monospace;font-size:12.5px;white-space:pre-wrap;line-height:1.5;color:#0F172A;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:14px">' + (doc.content || '').replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</pre>';
      const body = noteHtml + '<br><br>' + docHtml;
      try {
        const r = await fetch(API_BASE + '/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to, subject, html: body })
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || j.error) throw new Error(j.error || ('HTTP ' + r.status));
        _logEmail({ to, subject, body: noteHtml + '\n\n' + (doc.content || ''), context: 'business-file', clientId: doc.clientId || '', clientName: doc.clientName || '', status: 'sent' });
        const overlay = document.getElementById('bf-email-overlay');
        if (overlay) overlay.remove();
        showToast('Sent ' + (doc.type || 'document') + ' to ' + to, 'success');
        if (typeof logActivity === 'function') logActivity('email', 'Emailed ' + (doc.type || 'document') + ' "' + (doc.title || '') + '" to ' + to);
      } catch (e) {
        _logEmail({ to, subject, body: noteHtml, context: 'business-file', clientId: doc.clientId || '', status: 'failed', error: e.message });
        showToast('Email failed: ' + e.message, 'error');
        if (btn) { btn.disabled = false; btn.textContent = 'Send'; }
      }
    }

    function bfSendToPortal(id) {
      const doc = (getData('businessFile')||[]).find(d => d.id === id);
      if (!doc) { showToast('Document not found'); return; }
      // Reuse openSendChatToPortalModal but seed it with this doc's metadata.
      openSendChatToPortalModal(doc.content || '');
      // After the modal is built, pre-select client + type
      setTimeout(() => {
        const sel = document.getElementById('sp-client');
        if (sel && doc.clientId) sel.value = doc.clientId;
        const typeIn = document.getElementById('sp-type');
        if (typeIn && doc.type) typeIn.value = doc.type;
      }, 60);
    }

    // Re-sign a saved Business File document — opens a signature pad,
    // appends a fresh signature block to the doc's content, and saves
    // back. Use case: you sent a proposal/contract last month and need
    // to re-sign it because terms changed or you forgot to sign.
    function bfReSign(id) {
      const doc = (getData('businessFile')||[]).find(d => d.id === id);
      if (!doc) { showToast('Document not found'); return; }
      const settings = JSON.parse(localStorage.getItem('settings') || '{}');
      const ownerName = settings.name || 'Joy Watford';
      const old = document.getElementById('bf-resign-overlay'); if (old) old.remove();
      const overlay = document.createElement('div');
      overlay.id = 'bf-resign-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(15,23,42,0.55);display:flex;align-items:center;justify-content:center;padding:20px';
      overlay.innerHTML =
        '<div style="background:#fff;border-radius:14px;max-width:560px;width:100%;box-shadow:0 16px 50px rgba(0,0,0,0.25);overflow:hidden">' +
          '<div style="padding:18px 22px;border-bottom:1px solid #e5e7eb">' +
            '<h3 style="font-size:17px;font-weight:700;margin:0">Re-sign document</h3>' +
            '<p style="font-size:12.5px;color:#64748B;margin:4px 0 0">' + (doc.title||'').replace(/</g,'&lt;') + ' · ' + (doc.type||'') + '</p>' +
          '</div>' +
          '<div style="padding:16px 22px">' +
            '<label class="form-label">Signed by</label>' +
            '<input id="bf-rs-name" class="form-input" style="margin:0 0 12px" value="' + ownerName.replace(/"/g,'&quot;') + '">' +
            '<label class="form-label">Sign below</label>' +
            '<canvas id="bf-rs-canvas" width="500" height="160" style="width:100%;height:160px;border:1px dashed #94A3B8;border-radius:8px;background:#F8FAFC;touch-action:none;cursor:crosshair"></canvas>' +
            '<div style="display:flex;gap:8px;justify-content:space-between;margin-top:8px">' +
              '<button onclick="_bfClearSig()" class="btn btn-outline" style="padding:6px 12px;font-size:12px">Clear</button>' +
              '<label style="font-size:12px;color:#64748B;display:flex;align-items:center;gap:6px"><input type="checkbox" id="bf-rs-replace"> Replace previous signature block</label>' +
            '</div>' +
          '</div>' +
          '<div style="padding:12px 22px;border-top:1px solid #e5e7eb;background:#F8FAFC;display:flex;justify-content:flex-end;gap:8px">' +
            '<button onclick="document.getElementById(\'bf-resign-overlay\').remove()" class="btn btn-outline" style="padding:8px 16px">Cancel</button>' +
            '<button onclick="_bfDoReSign(\'' + id + '\')" class="btn btn-solid" style="padding:8px 16px">Apply signature</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(overlay);
      _bfBindSig(document.getElementById('bf-rs-canvas'));
    }
    function _bfBindSig(canvas) {
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.strokeStyle = '#0F172A';
      let drawing = false, last = null;
      const pos = e => {
        const r = canvas.getBoundingClientRect();
        const t = e.touches ? e.touches[0] : e;
        return { x: (t.clientX - r.left) * (canvas.width/r.width), y: (t.clientY - r.top) * (canvas.height/r.height) };
      };
      const down = e => { e.preventDefault(); drawing = true; last = pos(e); canvas.dataset.drawn = '1'; };
      const move = e => {
        if (!drawing) return;
        e.preventDefault();
        const p = pos(e);
        ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke();
        last = p;
      };
      const up = () => { drawing = false; };
      canvas.addEventListener('mousedown', down); canvas.addEventListener('mousemove', move);
      canvas.addEventListener('mouseup', up); canvas.addEventListener('mouseleave', up);
      canvas.addEventListener('touchstart', down); canvas.addEventListener('touchmove', move);
      canvas.addEventListener('touchend', up);
    }
    function _bfClearSig() {
      const c = document.getElementById('bf-rs-canvas');
      if (!c) return;
      c.getContext('2d').clearRect(0, 0, c.width, c.height);
      c.dataset.drawn = '';
    }
    function _bfDoReSign(id) {
      const docs = getData('businessFile') || [];
      const idx = docs.findIndex(d => d.id === id);
      if (idx < 0) return;
      const canvas = document.getElementById('bf-rs-canvas');
      if (!canvas || !canvas.dataset.drawn) { alert('Please sign in the box first.'); return; }
      const name = (document.getElementById('bf-rs-name').value || '').trim() || 'Signed';
      const replace = document.getElementById('bf-rs-replace').checked;
      const sigDataUrl = canvas.toDataURL('image/png');
      const dateStr = new Date().toLocaleString('en-US', { dateStyle:'long', timeStyle:'short' });
      const block =
        '\n\n────────────────────────\n' +
        'Signed by: ' + name + '\n' +
        'Date: ' + dateStr + '\n' +
        '[signature on file]\n' +
        '────────────────────────';
      let content = docs[idx].content || '';
      if (replace) {
        // Strip the most recent signature block (anything after the last separator line)
        content = content.replace(/\n*────────────────────────\nSigned by:[\s\S]*?────────────────────────\s*$/, '');
      }
      docs[idx].content = content + block;
      docs[idx].signatures = (docs[idx].signatures || []).concat([{ name, signedAt: new Date().toISOString(), dataUrl: sigDataUrl }]);
      docs[idx].lastSignedAt = new Date().toISOString();
      setData('businessFile', docs);
      document.getElementById('bf-resign-overlay').remove();
      renderBusinessFile();
      showToast('Signature applied','success');
      if (typeof logActivity === 'function') logActivity('signature', 'Re-signed ' + (docs[idx].type||'document') + ': ' + (docs[idx].title||''));
    }

    // ── TENANT → OWNER MESSAGING ─────────────────────────────────────────────
    // Tenants get a "Contact Owner" button (top-right) for sending notes to
    // Joy. Each message is appended to PB key 'admin:tenant-messages' AND
    // fires a Resend email to Joy so she's notified even when offline.
    function _installContactOwnerWidget() {
      if (!TENANT) return;
      // Wait until the app shell is visible (after login)
      const tryInstall = () => {
        if (localStorage.getItem('loggedIn') !== 'true') return setTimeout(tryInstall, 800);
        if (document.getElementById('contact-owner-fab')) return;
        const btn = document.createElement('button');
        btn.id = 'contact-owner-fab';
        btn.title = 'Contact platform owner';
        btn.innerHTML = '💬 Contact Owner';
        btn.style.cssText = 'position:fixed;bottom:24px;left:24px;z-index:9998;background:linear-gradient(135deg,#7C3AED,#3B82F6);color:#fff;border:none;padding:11px 18px;font-size:13px;font-weight:600;border-radius:99px;cursor:pointer;box-shadow:0 4px 16px rgba(124,58,237,0.35);font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,sans-serif';
        btn.onclick = openContactOwnerModal;
        document.body.appendChild(btn);
      };
      tryInstall();
    }
    function openContactOwnerModal() {
      const settings = JSON.parse(localStorage.getItem('settings') || '{}');
      const old = document.getElementById('contact-owner-overlay'); if (old) old.remove();
      const overlay = document.createElement('div');
      overlay.id = 'contact-owner-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:10006;background:rgba(15,23,42,0.55);display:flex;align-items:center;justify-content:center;padding:20px';
      overlay.innerHTML =
        '<div style="background:#fff;border-radius:14px;max-width:520px;width:100%;box-shadow:0 16px 50px rgba(0,0,0,0.25);overflow:hidden">' +
          '<div style="padding:18px 22px;border-bottom:1px solid #e5e7eb">' +
            '<h3 style="font-size:17px;font-weight:700;margin:0">Contact Platform Owner</h3>' +
            '<p style="font-size:12.5px;color:#64748B;margin:4px 0 0">Send a note to the H.E.L.P. Center owner. They\'ll get an email and reply when they can.</p>' +
          '</div>' +
          '<div style="padding:16px 22px">' +
            '<label class="form-label">Subject</label>' +
            '<input id="co-subj" class="form-input" style="margin:0 0 12px" placeholder="Quick question about…">' +
            '<label class="form-label">Message</label>' +
            '<textarea id="co-body" class="form-input" style="margin:0;min-height:180px;resize:vertical;font-family:inherit;line-height:1.55" placeholder="Hey, just wanted to ask about…"></textarea>' +
          '</div>' +
          '<div style="padding:12px 22px;border-top:1px solid #e5e7eb;background:#F8FAFC;display:flex;justify-content:flex-end;gap:8px">' +
            '<button onclick="document.getElementById(\'contact-owner-overlay\').remove()" class="btn btn-outline" style="padding:8px 16px">Cancel</button>' +
            '<button onclick="_doContactOwner()" id="co-send" class="btn btn-solid" style="padding:8px 16px;background:linear-gradient(135deg,#7C3AED,#3B82F6)">Send</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(overlay);
      setTimeout(() => document.getElementById('co-subj')?.focus(), 60);
    }
    async function _doContactOwner() {
      const subject = (document.getElementById('co-subj').value || '').trim();
      const body = (document.getElementById('co-body').value || '').trim();
      if (!subject || !body) { alert('Subject and message are required.'); return; }
      const settings = JSON.parse(localStorage.getItem('settings') || '{}');
      const fromName = settings.name || 'Tenant';
      const fromEmail = settings.email || '';
      const fromBiz = settings.businessName || '';
      const btn = document.getElementById('co-send');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      // Append to admin:tenant-messages list (un-prefixed = visible to owner)
      try {
        const pb = pbSettings();
        if (pb.enabled) {
          const tk = await pbAuth();
          if (tk) {
            // Read existing
            const filterUrl = pb.url + '/api/collections/store/records?filter=' + encodeURIComponent(`key="admin:tenant-messages"`) + '&perPage=1';
            const check = await fetch(filterUrl, { headers: {'Authorization': tk} });
            const {items=[]} = await check.json();
            let list = [];
            if (items.length) {
              try { list = typeof items[0].value === 'string' ? JSON.parse(items[0].value) : items[0].value; } catch(e) { list = []; }
              if (!Array.isArray(list)) list = [];
            }
            const entry = {
              id: 'tm-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36),
              tenant: TENANT,
              fromName, fromEmail, fromBiz,
              subject, body,
              ts: new Date().toISOString(),
              read: false
            };
            list.unshift(entry);
            if (list.length > 200) list.length = 200;
            const reqBody = JSON.stringify({ key: 'admin:tenant-messages', value: list });
            if (items.length) {
              await fetch(pb.url + '/api/collections/store/records/' + items[0].id, {
                method:'PATCH', headers:{'Content-Type':'application/json','Authorization':tk}, body: reqBody
              });
            } else {
              await fetch(pb.url + '/api/collections/store/records', {
                method:'POST', headers:{'Content-Type':'application/json','Authorization':tk}, body: reqBody
              });
            }
          }
        }
      } catch (e) {}
      // Email Joy via Resend
      const ownerEmail = (function(){
        // Owner email: if shared in settings.ownerEmailOverride or hardcoded
        return 'joy@thehelpctr.com';
      })();
      const emailHtml = '<div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#F1F5F9;padding:24px"><div style="max-width:540px;margin:auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(15,23,42,0.08)"><div style="background:linear-gradient(135deg,#7C3AED,#3B82F6);padding:24px;color:#fff"><div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;opacity:0.8">Tenant Message · ' + TENANT + '</div><div style="font-size:20px;font-weight:700;margin-top:6px">' + subject.replace(/</g,'&lt;') + '</div></div><div style="padding:24px;color:#1F2937;font-size:14px;line-height:1.6"><p style="margin:0 0 14px;font-size:13px;color:#64748B">From <strong>' + fromName.replace(/</g,'&lt;') + '</strong>' + (fromBiz ? ' — ' + fromBiz.replace(/</g,'&lt;') : '') + (fromEmail ? ' &lt;<a href="mailto:' + fromEmail + '" style="color:#3B82F6;text-decoration:none">' + fromEmail + '</a>&gt;' : '') + '</p><div style="white-space:pre-wrap">' + body.replace(/&/g,'&amp;').replace(/</g,'&lt;') + '</div></div></div></div>';
      try {
        await fetch(API_BASE + '/api/email', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ to: ownerEmail, subject: '[Tenant: ' + TENANT + '] ' + subject, html: emailHtml })
        });
      } catch (e) {}
      document.getElementById('contact-owner-overlay').remove();
      showToast('Message sent. They\'ll reply by email.', 'success');
    }
    // Install on tenant copies after page load
    if (TENANT) window.addEventListener('load', _installContactOwnerWidget);

    // ── OWNER INBOX FOR TENANT MESSAGES ──────────────────────────────────────
    // Joy sees a new "Tenant Inbox" card in Settings showing all tenant messages.
    function renderTenantInbox() {
      const targets = [document.getElementById('tenant-inbox-list'), document.getElementById('tenant-inbox-list-saas')].filter(Boolean);
      if (!targets.length) return;
      if (TENANT) { const card = document.getElementById('settings-tenant-inbox-card'); if (card) card.style.display = 'none'; return; }
      const messages = getData('admin:tenant-messages') || [];
      if (!messages.length) {
        targets.forEach(t => { t.innerHTML = '<div style="padding:32px 20px;text-align:center;color:#94A3B8;font-size:13px">No tenant messages yet.</div>'; });
        return;
      }
      const escH = s => (s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      const html = messages.map(m => {
        const dt = new Date(m.ts).toLocaleString('en-US', { month:'short', day:'numeric', hour:'numeric', minute:'2-digit' });
        return '<div style="padding:12px 14px;border-bottom:1px solid #F1F5F9' + (m.read ? '' : ';background:#FEF3C7') + '">' +
          '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px">' +
          '<div><div style="font-weight:600;color:#0F172A;font-size:13.5px">' + escH(m.subject) + '</div>' +
          '<div style="font-size:11.5px;color:#64748B;margin-top:2px">From <strong>' + escH(m.fromName) + '</strong> · ' + escH(m.tenant) + ' · ' + escH(dt) + (m.fromEmail ? ' · <a href="mailto:' + escH(m.fromEmail) + '" style="color:#3B82F6">' + escH(m.fromEmail) + '</a>' : '') + '</div></div>' +
          (m.read ? '' : '<span style="background:#F59E0B;color:#fff;font-size:10px;padding:2px 8px;border-radius:99px;font-weight:700">NEW</span>') +
          '</div>' +
          '<div style="font-size:13px;color:#1F2937;white-space:pre-wrap;background:#F8FAFC;padding:10px 12px;border-radius:8px;border:1px solid #E2E8F0;margin-top:6px">' + escH(m.body) + '</div>' +
          '<div style="display:flex;gap:6px;margin-top:8px;justify-content:flex-end">' +
            (m.fromEmail ? '<a href="mailto:' + escH(m.fromEmail) + '?subject=Re: ' + encodeURIComponent(m.subject) + '" class="btn btn-outline" style="padding:5px 11px;font-size:11.5px;text-decoration:none">Reply by Email</a>' : '') +
            (m.read ? '' : '<button onclick="_markTenantMsgRead(\'' + m.id + '\')" class="btn btn-outline" style="padding:5px 11px;font-size:11.5px">Mark Read</button>') +
          '</div></div>';
      }).join('');
      targets.forEach(t => { t.innerHTML = html; });
    }
    function _markTenantMsgRead(id) {
      const messages = getData('admin:tenant-messages') || [];
      const idx = messages.findIndex(m => m.id === id);
      if (idx < 0) return;
      messages[idx].read = true;
      setData('admin:tenant-messages', messages);
      renderTenantInbox();
    }

    // ── TENANT MANAGEMENT (OWNER ONLY) ───────────────────────────────────────
    // Joy creates new tenants here. Each tenant entry is stored under PB key
    // 'admin:tenants' (un-prefixed so it's visible only from the owner copy).
    // Creating a tenant ALSO writes the tenant's initial settings record at
    // '<slug>:settings' in PB so that when the tenant first opens their URL,
    // _hydrateTenantSettings() can pull their password.
    function getTenants() { return getData('admin:tenants') || []; }
    function setTenants(arr) { setData('admin:tenants', arr); }

    function renderTenantsList() {
      const targets = [document.getElementById('tenants-list'), document.getElementById('saas-clients-list')].filter(Boolean);
      if (!targets.length) return;
      // Hide the entire card on tenant copies — only the owner manages tenants.
      if (TENANT) {
        const card = document.getElementById('settings-tenants-card');
        if (card) card.style.display = 'none';
        return;
      }
      const tenants = getTenants();
      if (!tenants.length) {
        const empty = '<div style="padding:32px 20px;text-align:center;color:#94A3B8;font-size:13px">No tenants yet. Click <strong>+ Add Tenant</strong> to onboard your first one.</div>';
        targets.forEach(t => { t.innerHTML = empty; });
        return;
      }
      const escH = s => (s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      const baseUrl = window.location.href.split('?')[0].split('#')[0];
      const tableHtml = '<table style="width:100%;border-collapse:collapse;font-size:13px">' +
        '<thead><tr style="background:#F8FAFC;border-bottom:1px solid #E2E8F0">' +
        '<th style="text-align:left;padding:9px 12px;font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase">Slug</th>' +
        '<th style="text-align:left;padding:9px 12px;font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase">Name</th>' +
        '<th style="text-align:left;padding:9px 12px;font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase">Plan</th>' +
        '<th style="text-align:left;padding:9px 12px;font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase">Status</th>' +
        '<th style="text-align:right;padding:9px 12px;font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase">Actions</th>' +
        '</tr></thead><tbody>' +
        tenants.map(t => {
          const url = baseUrl + '?tenant=' + encodeURIComponent(t.slug);
          const statusBg = t.active === false ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)';
          const statusFg = t.active === false ? '#EF4444' : '#10B981';
          const statusText = t.active === false ? 'SUSPENDED' : 'ACTIVE';
          return '<tr style="border-bottom:1px solid #F1F5F9">' +
            '<td style="padding:10px 12px;font-family:monospace;color:#7C3AED;font-weight:600">' + escH(t.slug) + '</td>' +
            '<td style="padding:10px 12px"><div style="font-weight:600;color:#0F172A">' + escH(t.name) + '</div><div style="font-size:11.5px;color:#64748B">' + escH(t.email) + '</div></td>' +
            '<td style="padding:10px 12px;color:#475569">' + escH(t.plan || 'Discounted') + '</td>' +
            '<td style="padding:10px 12px"><span style="background:' + statusBg + ';color:' + statusFg + ';padding:2px 9px;border-radius:99px;font-size:10.5px;font-weight:700;letter-spacing:0.4px">' + statusText + '</span></td>' +
            '<td style="padding:10px 12px;text-align:right;white-space:nowrap">' +
              '<button onclick="window.open(\'' + url + '\',\'_blank\')" class="btn btn-outline" style="padding:5px 10px;font-size:11.5px;margin-right:4px">Open ↗</button>' +
              '<button onclick="copyTenantUrl(\'' + escH(t.slug) + '\')" class="btn btn-outline" style="padding:5px 10px;font-size:11.5px;margin-right:4px">Copy URL</button>' +
              '<button onclick="emailTenantCredentials(\'' + escH(t.slug) + '\')" class="btn btn-solid" style="padding:5px 10px;font-size:11.5px;margin-right:4px;background:linear-gradient(135deg,#10B981,#059669)">Email Login</button>' +
              '<button onclick="editTenant(\'' + escH(t.slug) + '\')" class="btn btn-outline" style="padding:5px 10px;font-size:11.5px;margin-right:4px">Edit</button>' +
              '<button onclick="toggleTenantActive(\'' + escH(t.slug) + '\')" class="btn btn-outline" style="padding:5px 10px;font-size:11.5px;margin-right:4px">' + (t.active === false ? 'Reactivate' : 'Suspend') + '</button>' +
              '<button onclick="deleteTenant(\'' + escH(t.slug) + '\')" style="padding:5px 10px;font-size:11.5px;background:none;border:0.5px solid rgba(0,0,0,0.15);border-radius:6px;cursor:pointer;color:#dc2626;font-weight:500">Delete</button>' +
            '</td>' +
          '</tr>';
        }).join('') + '</tbody></table>';
      targets.forEach(t => { t.innerHTML = tableHtml; });
    }

    // Renders the dedicated SaaS Clients page (sidebar entry). Shows tenant
    // count + active count stats on top, then reuses renderTenantsList()
    // and renderTenantInbox() for the body.
    function renderSaasClientsPage() {
      if (TENANT) return;  // page hidden for tenant copies
      const tenants = getTenants();
      const total = tenants.length;
      const active = tenants.filter(t => t.active !== false).length;
      const suspended = tenants.filter(t => t.active === false).length;
      const planCounts = {};
      tenants.forEach(t => { const p = t.plan || 'Discounted'; planCounts[p] = (planCounts[p]||0) + 1; });
      const stats = document.getElementById('saas-stats');
      if (stats) {
        const card = (label, value, color) => `<div style="background:#fff;border:1px solid var(--gray-200);border-radius:12px;padding:16px 18px;box-shadow:0 1px 3px rgba(15,23,42,0.05)"><div style="font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">${label}</div><div style="font-size:24px;font-weight:800;color:${color||'#0F172A'};line-height:1.1">${value}</div></div>`;
        const planBadges = Object.entries(planCounts).map(([p,c]) => `<span style="font-size:11px;background:#EDE9FE;color:#7C3AED;padding:2px 8px;border-radius:99px;margin-right:4px;font-weight:600">${p}: ${c}</span>`).join('') || '<span style="color:#94A3B8;font-size:12px">—</span>';
        stats.innerHTML =
          card('Total Tenants', total) +
          card('Active', active, '#10B981') +
          card('Suspended', suspended, suspended ? '#EF4444' : '#94A3B8') +
          `<div style="background:#fff;border:1px solid var(--gray-200);border-radius:12px;padding:16px 18px;box-shadow:0 1px 3px rgba(15,23,42,0.05)"><div style="font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Plans</div><div>${planBadges}</div></div>`;
      }
      renderTenantsList();
      renderTenantInbox();
      if (typeof _refreshEnableNotifsBtn === 'function') _refreshEnableNotifsBtn();
    }

    function addTenantPrompt() {
      _showTenantForm(null);
    }

    function editTenant(slug) {
      const t = getTenants().find(x => x.slug === slug);
      if (!t) return;
      _showTenantForm(t);
    }

    function _showTenantForm(existing) {
      const old = document.getElementById('tenant-form-overlay'); if (old) old.remove();
      const overlay = document.createElement('div');
      overlay.id = 'tenant-form-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:10004;background:rgba(15,23,42,0.55);display:flex;align-items:center;justify-content:center;padding:20px';
      const e = existing || {};
      const escH = s => (s||'').toString().replace(/"/g,'&quot;');
      overlay.innerHTML =
        '<div style="background:#fff;border-radius:14px;max-width:520px;width:100%;box-shadow:0 16px 50px rgba(0,0,0,0.25);overflow:hidden">' +
          '<div style="padding:18px 22px;border-bottom:1px solid #e5e7eb">' +
            '<h3 style="font-size:17px;font-weight:700;margin:0">' + (existing ? 'Edit tenant' : 'Add new tenant') + '</h3>' +
            '<p style="font-size:12.5px;color:#64748B;margin:4px 0 0">' + (existing ? 'Updates take effect on the tenant\'s next page load.' : 'Creates a new isolated workspace under your PocketBase.') + '</p>' +
          '</div>' +
          '<div style="padding:16px 22px">' +
            '<label class="form-label">Slug (URL identifier — letters, numbers, dashes only)</label>' +
            '<input id="tn-slug" class="form-input" style="margin:0 0 12px;font-family:monospace" placeholder="toby" value="' + escH(e.slug || '') + '"' + (existing ? ' readonly' : '') + '>' +
            '<label class="form-label">Owner name</label>' +
            '<input id="tn-name" class="form-input" style="margin:0 0 12px" placeholder="Toby Foreman Rayford" value="' + escH(e.name || '') + '">' +
            '<label class="form-label">Owner email</label>' +
            '<input id="tn-email" type="email" class="form-input" style="margin:0 0 12px" placeholder="toby@example.com" value="' + escH(e.email || '') + '">' +
            '<label class="form-label">Business name</label>' +
            '<input id="tn-biz" class="form-input" style="margin:0 0 12px" placeholder="Toby\'s Studio" value="' + escH(e.businessName || '') + '">' +
            '<label class="form-label">Login password (you give this to them)</label>' +
            '<input id="tn-pass" class="form-input" style="margin:0 0 12px" placeholder="' + (existing ? '(leave blank to keep current)' : 'set initial password') + '" value="">' +
            '<label class="form-label">Plan</label>' +
            '<select id="tn-plan" class="form-input" style="margin:0 0 12px">' +
              ['Discounted','Trial','Pro','Elite','Comped'].map(p => '<option' + ((e.plan||'Discounted') === p ? ' selected' : '') + '>' + p + '</option>').join('') +
            '</select>' +
            '<label class="form-label">AI Tools this tenant can use <span style="font-weight:400;color:#94A3B8">— your personal projects stay hidden unless checked</span></label>' +
            '<div style="border:1px solid #e5e7eb;border-radius:8px;padding:8px 12px;max-height:172px;overflow:auto;margin:0 0 4px">' +
              ((typeof PROJECTS === 'object' && PROJECTS) ? Object.keys(PROJECTS).map(k => {
                const checked = ((e.aiProjects||[]).indexOf(k) !== -1) ? ' checked' : '';
                const nm = (PROJECTS[k] && PROJECTS[k].name) ? PROJECTS[k].name : k;
                return '<label style="display:flex;align-items:center;gap:8px;padding:4px 0;font-size:13px;cursor:pointer"><input type="checkbox" class="tn-aiproj" value="' + k + '"' + checked + '><span>' + nm.replace(/</g,'&lt;') + '</span></label>';
              }).join('') : '<div style="font-size:12px;color:#94A3B8;padding:6px 0">AI project list unavailable.</div>') +
            '</div>' +
            '<div style="font-size:11.5px;color:#94A3B8;margin:0 0 4px">None checked = tenant sees no AI tools (default).</div>' +
          '</div>' +
          '<div style="padding:12px 22px;border-top:1px solid #e5e7eb;background:#F8FAFC;display:flex;justify-content:flex-end;gap:8px">' +
            '<button onclick="document.getElementById(\'tenant-form-overlay\').remove()" class="btn btn-outline" style="padding:8px 16px">Cancel</button>' +
            '<button onclick="_saveTenantForm(' + (existing ? '\'' + escH(existing.slug) + '\'' : 'null') + ')" id="tn-save-btn" class="btn btn-solid" style="padding:8px 16px">' + (existing ? 'Save changes' : 'Create tenant') + '</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(overlay);
      setTimeout(() => document.getElementById(existing ? 'tn-name' : 'tn-slug')?.focus(), 60);
    }

    async function _saveTenantForm(existingSlug) {
      const slugRaw = (document.getElementById('tn-slug').value || '').trim().toLowerCase();
      const slug = slugRaw.replace(/[^a-z0-9_-]/g, '').slice(0, 32);
      const name = (document.getElementById('tn-name').value || '').trim();
      const email = (document.getElementById('tn-email').value || '').trim();
      const biz = (document.getElementById('tn-biz').value || '').trim();
      const pass = document.getElementById('tn-pass').value || '';
      const plan = document.getElementById('tn-plan').value || 'Discounted';
      if (!slug) { alert('Slug is required (letters, numbers, dashes).'); return; }
      if (!name) { alert('Owner name is required.'); return; }
      if (!existingSlug && !pass) { alert('Initial password is required for new tenants.'); return; }
      if (slug === 'admin' || slug === 'pb' || slug === 'api') { alert('Reserved slug — pick another.'); return; }
      const tenants = getTenants();
      const idx = tenants.findIndex(t => t.slug === (existingSlug || slug));
      const existing = idx >= 0 ? tenants[idx] : null;
      if (!existingSlug && existing) { alert('A tenant with this slug already exists.'); return; }
      const password = pass || (existing && existing.password) || 'changeme';
      const aiProjects = Array.prototype.map.call(document.querySelectorAll('.tn-aiproj:checked'), c => c.value);
      const tenant = {
        slug,
        name,
        email,
        businessName: biz || (name + "'s Workspace"),
        password,
        plan,
        aiProjects,
        active: existing ? existing.active !== false : true,
        createdAt: existing ? existing.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      if (idx >= 0) tenants[idx] = tenant; else tenants.push(tenant);
      setTenants(tenants);
      // PATH B: create or update a real PocketBase user account for this
      // tenant. Their dashboard will authenticate against this user (NOT
      // your admin password). Collection rules then enforce isolation.
      let userCreated = false, userError = null;
      try {
        const pb = pbSettings();
        if (pb.enabled) {
          const tk = await pbAuth();
          if (tk) {
            // Use a synthetic email if the tenant didn't provide one (PB users
            // require unique email). Slug-based fallback works.
            const userEmail = email || (slug + '@tenant.thehelpctr.com');
            // Look up by tenantSlug first
            const filterUrl = pb.url + '/api/collections/users/records?filter=' + encodeURIComponent(`tenantSlug="${slug}"`) + '&perPage=1';
            const check = await fetch(filterUrl, { headers: {'Authorization': tk} });
            const {items=[]} = await check.json();
            const userPayload = {
              email: userEmail,
              name,
              tenantSlug: slug,
              tenantRole: 'tenant',
              tenantPlan: plan,
              tenantActive: tenant.active,
              tenantBusiness: biz || (name + "'s Workspace"),
              verified: true
            };
            if (pass) {
              userPayload.password = pass;
              userPayload.passwordConfirm = pass;
            }
            if (items.length) {
              // Update existing user
              const r = await fetch(pb.url + '/api/collections/users/records/' + items[0].id, {
                method:'PATCH', headers:{'Content-Type':'application/json','Authorization':tk},
                body: JSON.stringify(userPayload)
              });
              if (!r.ok) userError = 'PATCH ' + r.status;
              else userCreated = true;
            } else {
              // Create new user — password required for new accounts
              if (!userPayload.password) {
                userError = 'password required for new user';
              } else {
                const r = await fetch(pb.url + '/api/collections/users/records', {
                  method:'POST', headers:{'Content-Type':'application/json','Authorization':tk},
                  body: JSON.stringify(userPayload)
                });
                if (!r.ok) {
                  const errBody = await r.json().catch(()=>({}));
                  userError = 'POST ' + r.status + ': ' + JSON.stringify(errBody.data || errBody);
                } else userCreated = true;
              }
            }
            // Write the tenant's seed settings record to PB store. This
            // record is what the tenant's browser pulls on first visit.
            // No more storing PB admin creds inside it!
            const tenantSettings = {
              name, email: userEmail, businessName: biz || (name + "'s Workspace"),
              tagline: '', password, phone: '', address: '',
              pbUrl: pb.url,
              pbEmail: userEmail,
              pbPassword: pass || '',  // tenant uses their OWN PB user creds
              pbAuthMode: 'user',
              pbEnabled: true
            };
            const settingsKey = slug + ':settings';
            const sFilterUrl = pb.url + '/api/collections/store/records?filter=' + encodeURIComponent(`key="${settingsKey}"`) + '&perPage=1';
            const sCheck = await fetch(sFilterUrl, { headers: {'Authorization': tk} });
            const sItems = (await sCheck.json()).items || [];
            const sBody = JSON.stringify({ key: settingsKey, value: tenantSettings, tenantSlug: slug });
            if (sItems.length) {
              await fetch(pb.url + '/api/collections/store/records/' + sItems[0].id, {
                method:'PATCH', headers:{'Content-Type':'application/json','Authorization':tk}, body: sBody
              });
            } else {
              await fetch(pb.url + '/api/collections/store/records', {
                method:'POST', headers:{'Content-Type':'application/json','Authorization':tk}, body: sBody
              });
            }
            // Write the gated AI-tools list to the tenant's own readable key so
            // their copy shows ONLY the projects checked above (default none).
            const offerKey = slug + ':tenantOfferedProjects';
            const oFilterUrl = pb.url + '/api/collections/store/records?filter=' + encodeURIComponent(`key="${offerKey}"`) + '&perPage=1';
            const oItems = ((await (await fetch(oFilterUrl, { headers: {'Authorization': tk} })).json()).items) || [];
            const oBody = JSON.stringify({ key: offerKey, value: aiProjects, tenantSlug: slug });
            if (oItems.length) {
              await fetch(pb.url + '/api/collections/store/records/' + oItems[0].id, {
                method:'PATCH', headers:{'Content-Type':'application/json','Authorization':tk}, body: oBody
              });
            } else {
              await fetch(pb.url + '/api/collections/store/records', {
                method:'POST', headers:{'Content-Type':'application/json','Authorization':tk}, body: oBody
              });
            }
          }
        }
      } catch(e) { userError = String(e.message || e); }
      if (userError) {
        alert('Tenant entry saved, but PocketBase user setup failed:\n' + userError + '\n\nThe tenant URL will not work until this is resolved.');
      }
      document.getElementById('tenant-form-overlay').remove();
      renderTenantsList();
      showToast(existing ? 'Tenant updated' : 'Tenant created', 'success');
    }

    // Email a tenant their dashboard URL + login password through Resend.
    // Opens a pre-filled review modal so the owner can edit before sending.
    function emailTenantCredentials(slug) {
      const t = getTenants().find(x => x.slug === slug);
      if (!t) return;
      if (!t.email) { alert('No email saved for this tenant. Click Edit to add one.'); return; }
      const settings = JSON.parse(localStorage.getItem('settings') || '{}');
      const ownerName = settings.name || 'Joy Watford';
      const ownerBiz = settings.businessName || 'H.E.L.P. Center';
      const url = window.location.href.split('?')[0].split('#')[0] + '?tenant=' + encodeURIComponent(t.slug);
      const escH = s => (s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      const subject = 'Your ' + ownerBiz + ' dashboard is ready, ' + (t.name || '').split(' ')[0];
      const defaultBody =
        'Hi ' + (t.name || '').split(' ')[0] + ',\n\n' +
        'Your dashboard is set up and waiting for you.\n\n' +
        '🔗 Login URL:\n' + url + '\n\n' +
        '🔑 Password: ' + (t.password || '(set in tenants panel)') + '\n\n' +
        'A few things to know:\n' +
        '  • Bookmark the URL — that\'s your only way in.\n' +
        '  • Change your password after your first login (Settings → Profile).\n' +
        '  • Your data is private to you. I (' + ownerName + ') can see admin-level info but not your day-to-day client work.\n' +
        '  • If you get stuck, email me back at ' + (settings.email || 'joy@thehelpctr.com') + '.\n\n' +
        'Welcome aboard.\n\n' +
        '— ' + ownerName + '\n' + ownerBiz;
      const old = document.getElementById('tn-cred-overlay'); if (old) old.remove();
      const overlay = document.createElement('div');
      overlay.id = 'tn-cred-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:10005;background:rgba(15,23,42,0.55);display:flex;align-items:center;justify-content:center;padding:20px';
      overlay.innerHTML =
        '<div style="background:#fff;border-radius:14px;max-width:580px;width:100%;box-shadow:0 16px 50px rgba(0,0,0,0.25);overflow:hidden">' +
          '<div style="padding:18px 22px;border-bottom:1px solid #e5e7eb">' +
            '<h3 style="font-size:17px;font-weight:700;margin:0">Email login details</h3>' +
            '<p style="font-size:12.5px;color:#64748B;margin:4px 0 0">Sending to <strong>' + escH(t.email) + '</strong> via Resend</p>' +
          '</div>' +
          '<div style="padding:16px 22px">' +
            '<label class="form-label">Subject</label>' +
            '<input id="tn-cred-subj" class="form-input" style="margin:0 0 12px" value="' + escH(subject) + '">' +
            '<label class="form-label">Message</label>' +
            '<textarea id="tn-cred-body" class="form-input" style="margin:0;min-height:300px;resize:vertical;font-family:inherit;line-height:1.55">' + escH(defaultBody) + '</textarea>' +
            '<label style="display:flex;align-items:center;gap:6px;margin-top:10px;font-size:12.5px;color:#475569"><input type="checkbox" id="tn-cred-bcc" checked> Send a copy to me (' + escH(settings.email || 'joy@thehelpctr.com') + ')</label>' +
          '</div>' +
          '<div style="padding:12px 22px;border-top:1px solid #e5e7eb;background:#F8FAFC;display:flex;justify-content:flex-end;gap:8px">' +
            '<button onclick="document.getElementById(\'tn-cred-overlay\').remove()" class="btn btn-outline" style="padding:8px 16px">Cancel</button>' +
            '<button onclick="_doEmailTenantCredentials(\'' + escH(slug) + '\')" id="tn-cred-send" class="btn btn-solid" style="padding:8px 16px;background:linear-gradient(135deg,#10B981,#059669)">Send Email</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(overlay);
    }
    async function _doEmailTenantCredentials(slug) {
      const t = getTenants().find(x => x.slug === slug);
      if (!t) return;
      const subject = (document.getElementById('tn-cred-subj').value || '').trim();
      const body = (document.getElementById('tn-cred-body').value || '').trim();
      const wantsBcc = document.getElementById('tn-cred-bcc').checked;
      if (!subject || !body) { alert('Subject and message are required.'); return; }
      const settings = JSON.parse(localStorage.getItem('settings') || '{}');
      const bccAddr = wantsBcc ? (settings.email || 'joy@thehelpctr.com') : '';
      const btn = document.getElementById('tn-cred-send');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      const html = body.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\n/g,'<br>');
      try {
        const r = await fetch(API_BASE + '/api/email', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ to: t.email, subject, html: html })
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || j.error) throw new Error(j.error || ('HTTP ' + r.status));
        if (typeof _logEmail === 'function') _logEmail({ to: t.email, subject, body, context: 'tenant-credentials', clientName: t.name, status: 'sent' });
        if (bccAddr) {
          const copyHtml = '<p style="color:#64748B;font-size:12px;margin:0 0 12px">Copy of credentials sent to <strong>' + t.email.replace(/</g,'&lt;') + '</strong></p>' + html;
          fetch(API_BASE + '/api/email', {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ to: bccAddr, subject: '[Copy] ' + subject, html: copyHtml })
          }).then(() => _logEmail && _logEmail({ to: bccAddr, subject:'[Copy] '+subject, body, context:'tenant-credentials-copy', clientName: t.name, status:'sent' }))
            .catch(() => {});
        }
        // Track that creds were sent on the tenant record
        const tenants = getTenants();
        const idx = tenants.findIndex(x => x.slug === slug);
        if (idx >= 0) { tenants[idx].credentialsEmailedAt = new Date().toISOString(); setTenants(tenants); }
        document.getElementById('tn-cred-overlay').remove();
        showToast('Login emailed to ' + t.email + (bccAddr ? ' (copy to you)' : ''), 'success');
      } catch (e) {
        if (typeof _logEmail === 'function') _logEmail({ to: t.email, subject, body, context: 'tenant-credentials', clientName: t.name, status: 'failed', error: e.message });
        alert('Email failed: ' + e.message);
        if (btn) { btn.disabled = false; btn.textContent = 'Send Email'; }
      }
    }

    function copyTenantUrl(slug) {
      const url = window.location.href.split('?')[0].split('#')[0] + '?tenant=' + encodeURIComponent(slug);
      navigator.clipboard.writeText(url).then(
        () => showToast('URL copied: ' + url, 'success'),
        () => prompt('Copy this URL:', url)
      );
    }

    async function toggleTenantActive(slug) {
      const tenants = getTenants();
      const idx = tenants.findIndex(t => t.slug === slug);
      if (idx < 0) return;
      const newActive = tenants[idx].active === false;  // flip
      tenants[idx].active = newActive;
      tenants[idx].updatedAt = new Date().toISOString();
      setTenants(tenants);
      renderTenantsList();
      // ALSO update the tenant's PB user record so the login flow blocks
      // them at authentication time. If the user record can't be found
      // (e.g. legacy tenant with no real PB user), we just update the
      // tenant entry — they remain unblocked until you re-create them
      // via Add Tenant.
      try {
        const pb = pbSettings();
        if (pb.enabled) {
          const tk = await pbAuth();
          if (tk) {
            const filterUrl = pb.url + '/api/collections/users/records?filter=' + encodeURIComponent(`tenantSlug="${slug}"`) + '&perPage=1';
            const check = await fetch(filterUrl, { headers: {'Authorization': tk} });
            const j = await check.json();
            const user = (j.items || [])[0];
            if (user) {
              const r = await fetch(pb.url + '/api/collections/users/records/' + user.id, {
                method:'PATCH',
                headers:{'Content-Type':'application/json','Authorization':tk},
                body: JSON.stringify({ tenantActive: newActive })
              });
              if (!r.ok) {
                console.warn('toggleTenantActive: PB user PATCH failed', r.status);
              }
            } else {
              showToast('⚠ No PB user found for "' + slug + '" — suspend is flag-only. Re-create via + Add SaaS Client.', 'warn');
              return;
            }
          }
        }
      } catch(e) { console.warn('toggleTenantActive PB sync error:', e); }
      // Optional: invalidate any active session for the suspended tenant.
      // PB doesn't expose a "revoke token" API in 0.22, so the suspended
      // user stays logged in until their token expires (~14 days default)
      // or they manually log out. The blocker fires on their next login
      // attempt.
      showToast(newActive
        ? '✓ Tenant reactivated — they can log in again'
        : '🔒 Tenant suspended — login will be blocked', newActive ? 'success' : 'warn');
    }

    function deleteTenant(slug) {
      if (!confirm('Delete tenant "' + slug + '"?\n\nTheir data in your PocketBase will REMAIN (you can recover it). The tenant entry itself will be removed and their URL will stop working.')) return;
      const tenants = getTenants().filter(t => t.slug !== slug);
      setTenants(tenants);
      renderTenantsList();
      showToast('Tenant entry removed', 'warn');
    }
    // ── END TENANT MANAGEMENT ────────────────────────────────────────────────

    // ── EMAIL LOG ────────────────────────────────────────────────────────────
    // Records every email sent through /api/email so Joy can review history.
    // Stored in localStorage under 'sentEmails' (capped at 200 entries) and
    // mirrored to PocketBase via setData so it syncs across her devices.
    function _logEmail(entry) {
      try {
        const log = JSON.parse(localStorage.getItem('sentEmails') || '[]');
        log.unshift({
          id: generateId(),
          ts: new Date().toISOString(),
          to: entry.to || '',
          subject: entry.subject || '',
          body: (entry.body || '').slice(0, 4000),
          context: entry.context || '',     // 'team-member' | 'portal-notif' | 'business-file' | 'client'
          clientId: entry.clientId || '',
          clientName: entry.clientName || '',
          status: entry.status || 'sent',   // 'sent' | 'failed'
          error: entry.error || ''
        });
        if (log.length > 200) log.length = 200;
        setData('sentEmails', log);
      } catch (e) {}
    }
    function renderEmailHistory() {
      const list = document.getElementById('email-history-list');
      if (!list) return;
      const log = getData('sentEmails') || [];
      if (!log.length) { list.innerHTML = '<p style="color:#94A3B8;font-size:13px;text-align:center;padding:24px">No emails sent yet.</p>'; return; }
      const escH = s => (s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      list.innerHTML = '<table style="width:100%;border-collapse:collapse;font-size:13px">' +
        '<thead><tr style="background:#F8FAFC;border-bottom:1px solid #E2E8F0">' +
        '<th style="text-align:left;padding:8px 10px;font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase">Sent</th>' +
        '<th style="text-align:left;padding:8px 10px;font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase">To</th>' +
        '<th style="text-align:left;padding:8px 10px;font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase">Subject</th>' +
        '<th style="text-align:left;padding:8px 10px;font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase">Context</th>' +
        '<th style="text-align:right;padding:8px 10px;font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase">Status</th>' +
        '</tr></thead><tbody>' +
        log.map(e => {
          const dt = new Date(e.ts);
          const dtStr = dt.toLocaleString('en-US', { month:'short', day:'numeric', hour:'numeric', minute:'2-digit' });
          const okBg = e.status === 'sent' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)';
          const okC = e.status === 'sent' ? '#10B981' : '#EF4444';
          return '<tr style="border-bottom:1px solid #F1F5F9;cursor:pointer" onclick="_emailHistoryView(\'' + e.id + '\')" onmouseenter="this.style.background=\'#FAFAFA\'" onmouseleave="this.style.background=\'\'">' +
            '<td style="padding:8px 10px;color:#475569;white-space:nowrap">' + escH(dtStr) + '</td>' +
            '<td style="padding:8px 10px;color:#0F172A">' + escH(e.to) + '</td>' +
            '<td style="padding:8px 10px;color:#0F172A;max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escH(e.subject) + '</td>' +
            '<td style="padding:8px 10px;color:#64748B">' + escH(e.context || '—') + (e.clientName ? ' · ' + escH(e.clientName) : '') + '</td>' +
            '<td style="padding:8px 10px;text-align:right"><span style="background:' + okBg + ';color:' + okC + ';padding:2px 8px;border-radius:99px;font-size:11px;font-weight:700">' + escH(e.status) + '</span></td>' +
            '</tr>';
        }).join('') +
        '</tbody></table>';
    }
    function _emailHistoryView(id) {
      const log = getData('sentEmails') || [];
      const e = log.find(x => x.id === id);
      if (!e) return;
      const escH = s => (s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      const old = document.getElementById('eh-view-overlay'); if (old) old.remove();
      const overlay = document.createElement('div');
      overlay.id = 'eh-view-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:10003;background:rgba(15,23,42,0.55);display:flex;align-items:center;justify-content:center;padding:20px';
      overlay.innerHTML =
        '<div style="background:#fff;border-radius:14px;max-width:680px;width:100%;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 16px 50px rgba(0,0,0,0.25);overflow:hidden">' +
          '<div style="padding:18px 22px;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:flex-start">' +
            '<div><h3 style="font-size:17px;font-weight:700;margin:0">' + escH(e.subject) + '</h3>' +
            '<p style="font-size:12.5px;color:#64748B;margin:4px 0 0">To: <strong>' + escH(e.to) + '</strong> · ' + escH(new Date(e.ts).toLocaleString()) + '</p></div>' +
            '<button onclick="document.getElementById(\'eh-view-overlay\').remove()" style="background:none;border:none;font-size:22px;cursor:pointer;color:#64748B">×</button>' +
          '</div>' +
          '<div style="padding:18px 22px;overflow-y:auto;flex:1">' +
            (e.error ? '<div style="background:#FEE2E2;color:#991B1B;padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:14px"><strong>Failed:</strong> ' + escH(e.error) + '</div>' : '') +
            '<div style="font-size:13px;line-height:1.6;color:#0F172A;background:#F8FAFC;padding:16px;border-radius:8px;border:1px solid #E2E8F0;white-space:pre-wrap;word-break:break-word">' + (e.body || '').replace(/<br>/gi, '\n').replace(/<[^>]+>/g, '') + '</div>' +
          '</div>' +
        '</div>';
      document.body.appendChild(overlay);
    }
    // ── END EMAIL LOG ─────────────────────────────────────────────────────────

    // ── CLIENT TEAM-MEMBER EMAIL ─────────────────────────────────────────────
    // Joy can attach team members (CFO, ops lead, marketing contact, etc.)
    // to each client and email any of them — typically to request additional
    // information. Every send is BCC'd to her own email so she keeps a copy.
    function addTeamMember(clientId) {
      const name = (prompt('Team member name (e.g. "Lester Rice")') || '').trim();
      if (!name) return;
      const role = (prompt('Role (optional, e.g. "Operations Manager")') || '').trim();
      const email = (prompt('Email address') || '').trim();
      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { alert('Please enter a valid email address.'); return; }
      const clients = getData('clients');
      const idx = clients.findIndex(c => c.id === clientId);
      if (idx < 0) return;
      clients[idx].teamMembers = clients[idx].teamMembers || [];
      clients[idx].teamMembers.push({ id: generateId(), name, role, email, addedAt: new Date().toISOString() });
      setData('clients', clients);
      closeModal('client-detail-modal'); openClientDetail(clientId);
    }
    function removeTeamMember(clientId, memberId) {
      if (!confirm('Remove this team member?')) return;
      const clients = getData('clients');
      const idx = clients.findIndex(c => c.id === clientId);
      if (idx < 0) return;
      clients[idx].teamMembers = (clients[idx].teamMembers || []).filter(t => t.id !== memberId);
      setData('clients', clients);
      closeModal('client-detail-modal'); openClientDetail(clientId);
    }
    function openTeamEmailModal(clientId, memberId) {
      const client = getData('clients').find(c => c.id === clientId);
      if (!client) return;
      const settings = JSON.parse(localStorage.getItem('settings') || '{}');
      const ownerName = settings.name || 'Joy Watford';
      const biz = settings.businessName || 'H.E.L.P. Center';
      const escH = s => (s || '').toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      const members = client.teamMembers || [];
      const seed = memberId ? members.find(t => t.id === memberId) : null;
      const memberOpts = '<option value="">— pick a team member or enter custom email —</option>' +
        members.map(t => '<option value="' + escH(t.email) + '"' + (seed && seed.email === t.email ? ' selected' : '') + '>' + escH(t.name) + (t.role ? ' (' + escH(t.role) + ')' : '') + ' &lt;' + escH(t.email) + '&gt;</option>').join('');
      const old = document.getElementById('tm-email-overlay'); if (old) old.remove();
      const overlay = document.createElement('div');
      overlay.id = 'tm-email-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:10001;background:rgba(15,23,42,0.55);display:flex;align-items:center;justify-content:center;padding:20px';
      const defaultBody = 'Hi ' + (seed ? seed.name.split(' ')[0] : 'there') + ',\n\n' +
        'I\'m reaching out on behalf of ' + (client.businessName || client.name) + ' regarding the ' + (client.service || 'project') + ' we\'re working on.\n\n' +
        'Could you please send over the following information at your earliest convenience:\n' +
        '  • [Item 1]\n  • [Item 2]\n  • [Item 3]\n\n' +
        'Let me know if you have any questions.\n\nThanks so much,\n' + ownerName + '\n' + biz;
      overlay.innerHTML =
        '<div style="background:#fff;border-radius:14px;max-width:560px;width:100%;box-shadow:0 16px 50px rgba(0,0,0,0.25);overflow:hidden">' +
          '<div style="padding:18px 22px;border-bottom:1px solid #e5e7eb">' +
            '<h3 style="font-size:17px;font-weight:700;margin:0">Email team member</h3>' +
            '<p style="font-size:12.5px;color:#64748B;margin:4px 0 0">For client: <strong>' + escH(client.name) + '</strong>' + (client.businessName ? ' — ' + escH(client.businessName) : '') + '</p>' +
          '</div>' +
          '<div style="padding:16px 22px">' +
            '<label class="form-label">Pick team member</label><select id="tm-em-pick" class="form-input" style="margin:0 0 10px" onchange="document.getElementById(\'tm-em-to\').value=this.value">' + memberOpts + '</select>' +
            '<label class="form-label">To</label><input id="tm-em-to" type="email" class="form-input" style="margin:0 0 12px" placeholder="recipient@example.com" value="' + escH(seed ? seed.email : '') + '">' +
            '<label class="form-label">Subject</label><input id="tm-em-subj" class="form-input" style="margin:0 0 12px" value="' + escH('Information request — ' + (client.businessName || client.name)) + '">' +
            '<label class="form-label">Message</label>' +
            '<textarea id="tm-em-body" class="form-input" style="margin:0;min-height:200px;resize:vertical;font-family:inherit;line-height:1.55">' + escH(defaultBody) + '</textarea>' +
            '<label style="display:flex;align-items:center;gap:6px;margin-top:10px;font-size:12.5px;color:#475569"><input type="checkbox" id="tm-em-bcc" checked> Send a copy to ' + escH(settings.email || 'joy@thehelpctr.com') + '</label>' +
          '</div>' +
          '<div style="padding:12px 22px;border-top:1px solid #e5e7eb;background:#F8FAFC;display:flex;justify-content:flex-end;gap:8px">' +
            '<button onclick="document.getElementById(\'tm-email-overlay\').remove()" class="btn btn-outline" style="padding:8px 16px">Cancel</button>' +
            '<button onclick="_sendTeamEmail(\'' + clientId + '\')" id="tm-em-send" class="btn btn-solid" style="padding:8px 16px">Send Email</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(overlay);
    }
    async function _sendTeamEmail(clientId) {
      const to = (document.getElementById('tm-em-to').value || '').trim();
      const subject = (document.getElementById('tm-em-subj').value || '').trim();
      const body = (document.getElementById('tm-em-body').value || '').trim();
      const wantsBcc = document.getElementById('tm-em-bcc').checked;
      if (!to || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) { alert('Please enter a valid email address.'); return; }
      if (!body) { alert('Please add a message.'); return; }
      const settings = JSON.parse(localStorage.getItem('settings') || '{}');
      const bccAddr = wantsBcc ? (settings.email || 'joy@thehelpctr.com') : '';
      const btn = document.getElementById('tm-em-send');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      const html = body.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br>');
      try {
        const r = await fetch(API_BASE + '/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to, subject, html: html })
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || j.error) throw new Error(j.error || ('HTTP ' + r.status));
        const client = (getData('clients') || []).find(c => c.id === clientId) || {};
        _logEmail({ to, subject, body, context: 'team-member', clientId, clientName: client.name || '', status: 'sent' });
        // Send a separate copy to Joy as a "[Copy]" — keeps her in the loop even
        // if the backend doesn't natively support bcc.
        if (bccAddr) {
          const copyHtml = '<p style="color:#64748B;font-size:12px;margin:0 0 12px">Copy of email sent to <strong>' + to.replace(/</g,'&lt;') + '</strong></p>' + html;
          fetch(API_BASE + '/api/email', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: bccAddr, subject: '[Copy] ' + subject, html: copyHtml })
          }).then(() => _logEmail({ to: bccAddr, subject: '[Copy] ' + subject, body, context: 'team-member-copy', clientId, clientName: client.name || '', status: 'sent' }))
            .catch(() => {});
        }
        document.getElementById('tm-email-overlay').remove();
        showToast('Email sent to ' + to + (bccAddr ? ' (copy to ' + bccAddr + ')' : ''), 'success');
        if (typeof logActivity === 'function') logActivity('email', 'Emailed team member ' + to + ' for client ' + (clientId));
      } catch (e) {
        _logEmail({ to, subject, body, context: 'team-member', clientId, status: 'failed', error: e.message });
        alert('Email failed: ' + e.message + '\n\nTip: make sure thehelpctr.com is verified in Resend (Settings → Domains).');
        if (btn) { btn.disabled = false; btn.textContent = 'Send Email'; }
      }
    }
    // ── END TEAM EMAIL ────────────────────────────────────────────────────────

    function exportBusinessFile() {
      const docs = getData('businessFile') || [];
      if (!docs.length) { showToast('No documents to export'); return; }
      const blob = new Blob([JSON.stringify(docs, null, 2)], { type:'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'business-file-export-' + new Date().toISOString().slice(0,10) + '.json';
      a.click();
      URL.revokeObjectURL(a.href);
      showToast('✓ Exported all documents','success');
    }
    // ── END BUSINESS FILE ─────────────────────────────────────────────

    // Save AI-generated content as a note (used by Brand Wizard, AI tools, etc.)
    function saveAsNote(subject, body, category) {
      const notes = getData('notes') || [];
      notes.push({
        id: generateId(),
        subject: subject || 'AI Output',
        date: new Date().toISOString().split('T')[0],
        category: category || 'AI Output',
        tags: '',
        body: body || '',
        createdAt: Date.now(), updatedAt: Date.now()
      });
      setData('notes', notes);
      showToast('Saved to Notes ✓', 'success');
    }

    // ── CLIENTS ───────────────────────────────────────────────────
    function setClientView(mode) {
      localStorage.setItem('clientView', mode);
      const cBtn = document.getElementById('client-view-cards');
      const lBtn = document.getElementById('client-view-list');
      if (cBtn && lBtn) {
        const active = mode === 'cards';
        cBtn.style.background = active ? 'var(--brand-primary)' : '#fff';
        cBtn.style.color      = active ? '#fff'    : 'var(--gray-600)';
        lBtn.style.background = active ? '#fff'    : 'var(--brand-primary)';
        lBtn.style.color      = active ? 'var(--gray-600)' : '#fff';
      }
      renderClients();
    }

    function _filteredSortedClients() {
      let clients = getData('clients');
      const search = (document.getElementById('client-search')?.value||'').toLowerCase();
      const filter = document.getElementById('client-filter')?.value||'All';
      const sort   = document.getElementById('client-sort')?.value||'name';
      if (search) clients = clients.filter(c => (c.name+c.businessName+c.email+c.service).toLowerCase().includes(search));
      if (filter !== 'All') clients = clients.filter(c => c.status === filter);
      clients.sort((a,b) => {
        if (sort==='name') return a.name.localeCompare(b.name);
        if (sort==='date') return (b.startDate||'').localeCompare(a.startDate||'');
        if (sort==='status') return a.status.localeCompare(b.status);
        if (sort==='revenue') return (b.price||0)-(a.price||0);
        return 0;
      });
      return clients;
    }

    function renderClients() {
      const el = document.getElementById('clients-grid');
      if (!el) return;
      const view = localStorage.getItem('clientView') || 'cards';
      // sync toggle button styling
      const cBtn = document.getElementById('client-view-cards');
      const lBtn = document.getElementById('client-view-list');
      if (cBtn && lBtn) {
        const active = view === 'cards';
        cBtn.style.background = active ? 'var(--brand-primary)' : '#fff';
        cBtn.style.color      = active ? '#fff'    : 'var(--gray-600)';
        lBtn.style.background = active ? '#fff'    : 'var(--brand-primary)';
        lBtn.style.color      = active ? 'var(--gray-600)' : '#fff';
      }
      const clients = _filteredSortedClients();
      const sBg   = { Lead:'rgba(66,103,178,0.1)', Active:'rgba(16,185,129,0.1)', Completed:'rgba(16,185,129,0.1)', 'On Hold':'var(--gray-100)' };
      const sTxt  = { Lead:'var(--brand-primary)', Active:'#10B981', Completed:'#10B981', 'On Hold':'#64748B' };
      if (!clients.length) {
        el.style.display = 'block';
        el.innerHTML = '<div style="text-align:center;padding:60px;color:var(--gray-400);">No clients found. Click <strong>+ Add Client</strong> to get started.</div>';
        return;
      }
      if (view === 'list') {
        el.style.display = 'block';
        el.innerHTML = `
          <div style="background:#fff;border:1px solid #E8ECF1;border-radius:6px;overflow:auto">
            <table style="width:100%;border-collapse:collapse;font-size:13px">
              <thead style="background:var(--gray-100)">
                <tr style="text-align:left">
                  <th style="padding:10px 14px;font-weight:700;color:var(--gray-700);white-space:nowrap">Name</th>
                  <th style="padding:10px 14px;font-weight:700;color:var(--gray-700);white-space:nowrap">Business</th>
                  <th style="padding:10px 14px;font-weight:700;color:var(--gray-700);white-space:nowrap">Service</th>
                  <th style="padding:10px 14px;font-weight:700;color:var(--gray-700);white-space:nowrap">Status</th>
                  <th style="padding:10px 14px;font-weight:700;color:var(--gray-700);white-space:nowrap;text-align:right">Price</th>
                  <th style="padding:10px 14px;font-weight:700;color:var(--gray-700);white-space:nowrap">Paid</th>
                  <th style="padding:10px 14px;font-weight:700;color:var(--gray-700);white-space:nowrap">Progress</th>
                  <th style="padding:10px 14px;font-weight:700;color:var(--gray-700);white-space:nowrap">Email</th>
                  <th style="padding:10px 14px;font-weight:700;color:var(--gray-700);white-space:nowrap;text-align:right">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${clients.map(c => `
                  <tr style="border-top:1px solid #E8ECF1">
                    <td style="padding:10px 14px;font-weight:600">${c.name}</td>
                    <td style="padding:10px 14px;color:var(--gray-600)">${c.businessName||'—'}</td>
                    <td style="padding:10px 14px;color:var(--gray-600)">${c.service||'—'}</td>
                    <td style="padding:10px 14px;white-space:nowrap"><span style="background:${sBg[c.status]||'var(--gray-100)'};color:${sTxt[c.status]||'#64748B'};padding:3px 9px;border-radius:99px;font-size:11px;font-weight:700">${c.status}</span></td>
                    <td style="padding:10px 14px;text-align:right;font-weight:700">$${c.price||0}</td>
                    <td style="padding:10px 14px;color:${c.paid?'var(--success)':'var(--warning)'};font-weight:600">${c.paid?'✓ Paid':'⏳ Pending'}</td>
                    <td style="padding:10px 14px;color:var(--gray-600)">${c.projectStatus||0}%</td>
                    <td style="padding:10px 14px;color:var(--gray-500);font-size:12px">${c.email||'—'}</td>
                    <td style="padding:10px 14px;text-align:right;white-space:nowrap">
                      <button onclick="openClientDetail('${c.id}')" class="btn btn-outline" style="padding:4px 8px;font-size:11px;margin-right:4px">View</button>
                      <button onclick="openEditClientModal('${c.id}')" class="btn btn-solid" style="padding:4px 8px;font-size:11px;margin-right:4px">Edit</button>
                      <button onclick="openClientDocs('${c.id}')" class="btn btn-outline" style="padding:4px 8px;font-size:11px;border-color:var(--accent);color:var(--accent)">📄</button>
                    </td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>`;
        return;
      }
      // Default: card view
      el.style.display = 'grid';
      el.innerHTML = clients.map(c => `
        <div class="client-card">
          <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:12px;">
            <div><div class="client-name">${c.name}</div><div class="client-biz">${c.businessName||'—'}</div></div>
            <span style="background:${sBg[c.status]||'var(--gray-100)'};color:${sTxt[c.status]||'#64748B'};padding:4px 10px;border-radius:99px;font-size:11px;font-weight:700;white-space:nowrap;">${c.status}</span>
          </div>
          <div style="font-size:13px;color:var(--gray-500);margin-bottom:6px;">📦 ${c.service}</div>
          ${c.email?`<div style="font-size:13px;color:var(--gray-500);margin-bottom:6px;">✉️ ${c.email}</div>`:''}
          <div style="margin-bottom:12px;">
            <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--gray-400);margin-bottom:4px;"><span>Progress</span><span>${c.projectStatus}%</span></div>
            <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:${c.projectStatus}%"></div></div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="font-size:18px;font-weight:700;color:var(--gray-900);">$${c.price}<span style="font-size:12px;font-weight:400;color:${c.paid?'var(--success)':'var(--warning)'}"> ${c.paid?'✓ Paid':'⏳ Pending'}</span></div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button onclick="openClientDetail('${c.id}')" class="btn btn-outline" style="padding:6px 12px;font-size:12px;">View</button>
              <button onclick="openEditClientModal('${c.id}')" class="btn btn-solid" style="padding:6px 12px;font-size:12px;">Edit</button>
              <button onclick="openClientDocs('${c.id}')" class="btn btn-outline" style="padding:6px 12px;font-size:12px;border-color:var(--accent);color:var(--accent);">📄 Docs</button>
            </div>
          </div>
        </div>`).join('');
    }

    function printClientReport() {
      const clients = _filteredSortedClients();
      const cfg = JSON.parse(localStorage.getItem('settings'))||{};
      const biz = cfg.businessName || 'H.E.L.P. Center';
      const today = new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
      const totalRev = clients.reduce((a,c)=>a+(c.paid?(c.price||0):0),0);
      const totalPending = clients.reduce((a,c)=>a+(!c.paid?(c.price||0):0),0);
      const w = window.open('','_blank');
      if (!w) { showToast('Popup blocked — allow popups to print','error'); return; }
      w.document.write(`<!DOCTYPE html><html><head><title>Client Report — ${biz}</title>
        <style>
          body{font-family:Arial,sans-serif;max-width:980px;margin:30px auto;padding:20px;color:#111;line-height:1.5}
          .lh{text-align:center;border-bottom:3px solid var(--brand-primary);padding-bottom:14px;margin-bottom:22px}
          .lh h1{margin:0;font-size:22px;color:var(--brand-primary)}
          .lh p{margin:4px 0;color:#555;font-size:13px}
          table{width:100%;border-collapse:collapse;font-size:12px;margin-top:16px}
          th{text-align:left;background:#F1F5F9;padding:8px 10px;border-bottom:2px solid #CBD5E1}
          td{padding:8px 10px;border-bottom:1px solid #E2E8F0}
          .right{text-align:right}
          .summary{display:flex;gap:20px;margin:14px 0;font-size:13px}
          .summary div{flex:1;background:#F8FAFC;padding:10px 14px;border-radius:6px;border:1px solid #E2E8F0}
          .summary .lbl{color:#64748B;font-size:11px;text-transform:uppercase;letter-spacing:.5px;font-weight:700}
          .summary .val{font-size:18px;font-weight:700;color:#0F172A;margin-top:2px}
          @media print { body { margin:0 } button { display:none } }
        </style>
      </head><body>
        <div class="lh">
          <h1>${biz} — Client Report</h1>
          <p>Generated: ${today} · ${clients.length} client${clients.length===1?'':'s'}</p>
        </div>
        <div class="summary">
          <div><div class="lbl">Total Clients</div><div class="val">${clients.length}</div></div>
          <div><div class="lbl">Revenue (paid)</div><div class="val">$${totalRev.toLocaleString()}</div></div>
          <div><div class="lbl">Pending</div><div class="val">$${totalPending.toLocaleString()}</div></div>
        </div>
        <table>
          <thead><tr>
            <th>Name</th><th>Business</th><th>Service</th><th>Status</th>
            <th class="right">Price</th><th>Paid</th><th>Progress</th><th>Email</th>
          </tr></thead>
          <tbody>${clients.map(c=>`
            <tr>
              <td><strong>${c.name||''}</strong></td>
              <td>${c.businessName||'—'}</td>
              <td>${c.service||'—'}</td>
              <td>${c.status||''}</td>
              <td class="right">$${c.price||0}</td>
              <td>${c.paid?'✓ Paid':'⏳ Pending'}</td>
              <td>${c.projectStatus||0}%</td>
              <td>${c.email||'—'}</td>
            </tr>`).join('')}
          </tbody>
        </table>
        <div style="margin-top:24px;text-align:center;color:#64748B;font-size:11px">${biz} — Confidential client list. Printed for internal use only.</div>
        <script>window.onload=()=>setTimeout(()=>window.print(),300);<\/script>
      </body></html>`);
      w.document.close();
    }

    function openAddClientModal() {
      const ex = document.getElementById('add-client-modal'); if (ex) ex.remove();
      document.body.appendChild(buildModal('add-client-modal', '+ New Client', clientFormHTML(null)));
      cfToggleServicesForStatus();
    }
    function openEditClientModal(id) {
      const client = getData('clients').find(c => c.id === id);
      if (!client) return;
      const ex = document.getElementById('edit-client-modal'); if (ex) ex.remove();
      document.body.appendChild(buildModal('edit-client-modal', 'Edit Client', clientFormHTML(client)));
      cfToggleServicesForStatus();
    }

    // When the client form's Status field is 'Lead', shadow the Services &
    // Pricing block so it's clear pricing isn't relevant yet. Re-enables on
    // Active / Completed / On Hold.
    function cfToggleServicesForStatus() {
      const sel = document.getElementById('cf-status');
      const wrap = document.getElementById('cf-services-wrap');
      if (!sel || !wrap) return;
      const isLead = sel.value === 'Lead';
      wrap.style.opacity = isLead ? '0.4' : '';
      wrap.style.pointerEvents = isLead ? 'none' : '';
      wrap.style.position = 'relative';
      let badge = document.getElementById('cf-services-lead-badge');
      if (isLead) {
        if (!badge) {
          badge = document.createElement('div');
          badge.id = 'cf-services-lead-badge';
          badge.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;font-size:12px;font-weight:700;color:#475569;background:rgba(248,250,252,0.5);border-radius:10px;text-transform:uppercase;letter-spacing:0.6px;text-align:center;padding:20px';
          badge.innerHTML = 'Lead — change status to Active to add services & pricing';
          wrap.appendChild(badge);
        }
      } else if (badge) {
        badge.remove();
      }
    }

    const CLIENT_SERVICES = ['Website Design','Ecommerce Website','Business Dashboard & Page','Domain','Website Hosting','Church Website Maintenance','Monthly Website Maintenance','SEO & Digital Marketing','Social Media Management','Promotional Materials','Athlete NIL Branding','Consulting','Business Formation','Credit Repair Coaching','Grant Writing','Program Development','Nonprofit Formation','Bookkeeping','Other (custom)'];

    function cfServiceRowHTML(svc, price, idx, billingType, paidBy, description) {
      const bt = billingType || 'flat';
      const pb = paidBy ?? '';
      const desc = description || '';
      return `<div class="cf-svc-row" id="cf-svc-row-${idx}" style="border:1px solid ${pb==='client'?'rgba(16,185,129,0.3)':'var(--gray-200)'};border-radius:10px;padding:10px 12px;margin-bottom:10px;background:${pb==='client'?'rgba(240,253,244,0.5)':'#fff'}">
        <div style="display:grid;grid-template-columns:1fr 90px auto;gap:8px;align-items:start;margin-bottom:8px">
          <div>
            <label style="font-size:11px;font-weight:600;color:var(--gray-500)">Service</label>
            <select class="form-select cf-svc-select" data-idx="${idx}" onchange="cfSvcChange(this,${idx})" style="margin-top:2px">
              ${CLIENT_SERVICES.map(s=>`<option${s===svc?' selected':''}>${s}</option>`).join('')}
            </select>
            <input type="text" class="form-input cf-svc-custom" data-idx="${idx}" style="margin-top:4px;margin-bottom:0;${svc&&!CLIENT_SERVICES.includes(svc)?'':'display:none'}" placeholder="Describe service..." value="${svc&&!CLIENT_SERVICES.includes(svc)?svc:''}">
          </div>
          <div>
            <label style="font-size:11px;font-weight:600;color:var(--gray-500)">Price ($)</label>
            <input type="number" class="form-input cf-svc-price" data-idx="${idx}" style="margin:2px 0 0 0;width:100%" value="${price||0}" min="0" oninput="cfUpdateTotal()">
          </div>
          <button type="button" onclick="cfRemoveSvc(${idx})" style="margin-top:20px;background:none;border:none;cursor:pointer;color:var(--gray-400);font-size:20px;line-height:1;padding:4px" title="Remove">×</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div>
            <label style="font-size:11px;font-weight:600;color:var(--gray-500)">Billing</label>
            <div style="display:flex;gap:0;margin-top:2px;border:1px solid var(--gray-300);border-radius:7px;overflow:hidden;height:32px">
              <button type="button" class="cf-svc-billing-btn" data-idx="${idx}" data-val="ongoing"
                onclick="cfBillingToggle(this,${idx},'ongoing')"
                style="flex:1;border:none;background:${bt==='ongoing'?'var(--brand-primary)':'#fff'};color:${bt==='ongoing'?'#fff':'var(--gray-600)'};font-size:11px;font-weight:700;cursor:pointer;transition:all .15s">
                🔄 Ongoing
              </button>
              <button type="button" class="cf-svc-billing-btn" data-idx="${idx}" data-val="flat"
                onclick="cfBillingToggle(this,${idx},'flat')"
                style="flex:1;border:none;border-left:1px solid var(--gray-300);background:${bt==='flat'?'var(--brand-primary)':'#fff'};color:${bt==='flat'?'#fff':'var(--gray-600)'};font-size:11px;font-weight:700;cursor:pointer;transition:all .15s">
                1× Flat
              </button>
            </div>
            <input type="hidden" class="cf-svc-billing" data-idx="${idx}" value="${bt}">
          </div>
          <div>
            <label style="font-size:11px;font-weight:600;color:var(--gray-500)">Paid By <span style="font-weight:400;color:var(--gray-400)">(select when paid)</span></label>
            <div style="display:flex;gap:6px;margin-top:4px">
              <button type="button" class="cf-svc-paidby-btn" data-idx="${idx}" data-val="owner"
                onclick="cfPaidByToggle(this,${idx},'owner')"
                style="flex:1;border:1.5px solid ${pb==='owner'?'var(--brand-primary)':'var(--gray-300)'};border-radius:7px;background:${pb==='owner'?'var(--brand-primary)':'#fff'};color:${pb==='owner'?'#fff':'var(--gray-500)'};font-size:11px;font-weight:700;cursor:pointer;transition:all .15s;height:30px"><span class="icon icon-sm" data-icon="briefcase" style="margin-right:6px;vertical-align:-2px"></span>I Paid
              </button>
              <button type="button" class="cf-svc-paidby-btn" data-idx="${idx}" data-val="client"
                onclick="cfPaidByToggle(this,${idx},'client')"
                style="flex:1;border:1.5px solid ${pb==='client'?'#10B981':'var(--gray-300)'};border-radius:7px;background:${pb==='client'?'#10B981':'#fff'};color:${pb==='client'?'#fff':'var(--gray-500)'};font-size:11px;font-weight:700;cursor:pointer;transition:all .15s;height:30px"><span class="icon icon-sm" data-icon="check" style="margin-right:6px;vertical-align:-2px"></span>Client Paid
              </button>
            </div>
            <input type="hidden" class="cf-svc-paidby" data-idx="${idx}" value="${pb}">
          </div>
        </div>
        <div class="cf-svc-hint" style="font-size:10px;margin-top:5px;color:${pb==='client'?'#10B981':pb==='owner'?'var(--brand-primary)':'var(--gray-400)'};font-weight:${pb?'600':'400'}">
          ${pb==='client'?'✅ Client paid — deducted from invoice':pb==='owner'?'💼 I paid — client reimburses (added to invoice)':'Not yet paid — select above when payment is received'}
          ${pb?'&nbsp;·&nbsp; '+(bt==='ongoing'?'Monthly recurring':'One-time'):''}
        </div>
        <div style="margin-top:8px">
          <label style="font-size:11px;font-weight:600;color:var(--gray-500)">What's Included <span style="font-weight:400;color:var(--gray-400)">(shown on proposal — bullet each item with •)</span></label>
          <textarea class="form-textarea cf-svc-desc" data-idx="${idx}" style="margin:2px 0 0 0;min-height:50px;font-size:12px" placeholder="e.g. • Calendar events updated monthly\n• Flyers/photos added to website\n• Website troubleshooting">${desc}</textarea>
        </div>
      </div>`;
    }

    function cfBillingToggle(btn, idx, val) {
      const hidden = document.querySelector(`.cf-svc-billing[data-idx="${idx}"]`);
      if (hidden) hidden.value = val;
      const row = document.getElementById('cf-svc-row-' + idx);
      if (!row) return;
      row.querySelectorAll('.cf-svc-billing-btn').forEach(b => {
        const active = b.dataset.val === val;
        b.style.background = active ? 'var(--brand-primary)' : '#fff';
        b.style.color = active ? '#fff' : 'var(--gray-600)';
      });
      cfUpdateHint(idx);
    }

    function cfPaidByToggle(btn, idx, val) {
      const hidden = document.querySelector(`.cf-svc-paidby[data-idx="${idx}"]`);
      // Clicking the already-active button deselects it (back to neither)
      if (hidden && hidden.value === val) val = '';
      if (hidden) hidden.value = val;
      const row = document.getElementById('cf-svc-row-' + idx);
      if (!row) return;
      row.querySelectorAll('.cf-svc-paidby-btn').forEach(b => {
        const active = b.dataset.val === val;
        const activeColor = b.dataset.val === 'owner' ? 'var(--brand-primary)' : '#10B981';
        b.style.background = active ? activeColor : '#fff';
        b.style.color = active ? '#fff' : 'var(--gray-500)';
        b.style.borderColor = active ? activeColor : 'var(--gray-300)';
      });
      // Tint row based on selection; clear if neither
      row.style.border = val==='client' ? '1px solid rgba(16,185,129,0.3)' : val==='owner' ? '1px solid rgba(66,103,178,0.3)' : '1px solid var(--gray-200)';
      row.style.background = val==='client' ? 'rgba(240,253,244,0.5)' : val==='owner' ? 'rgba(239,246,255,0.5)' : '#fff';
      cfUpdateHint(idx);
      cfUpdateTotal();
    }

    function cfUpdateHint(idx) {
      const row = document.getElementById('cf-svc-row-' + idx);
      if (!row) return;
      const bt = document.querySelector(`.cf-svc-billing[data-idx="${idx}"]`)?.value || 'flat';
      const pb = document.querySelector(`.cf-svc-paidby[data-idx="${idx}"]`)?.value || 'client';
      const hint = row.querySelector('.cf-svc-hint');
      if (hint) {
        hint.style.color = pb==='client' ? '#10B981' : pb==='owner' ? 'var(--brand-primary)' : 'var(--gray-400)';
        hint.style.fontWeight = pb ? '600' : '400';
        hint.innerHTML = (pb==='client' ? '✅ Client paid — deducted from invoice'
          : pb==='owner' ? '💼 I paid — client reimburses (added to invoice)'
          : 'Not yet paid — select above when payment is received')
          + (pb ? ' &nbsp;·&nbsp; ' + (bt==='ongoing' ? 'Monthly recurring' : 'One-time') : '');
      }
    }

    function cfSvcChange(sel, idx) {
      const customEl = document.querySelector(`.cf-svc-custom[data-idx="${idx}"]`);
      if (customEl) customEl.style.display = sel.value === 'Other (custom)' ? 'block' : 'none';
      cfCheckAthlete();
    }

    function cfAddSvc() {
      const container = document.getElementById('cf-services-list');
      if (!container) return;
      const idx = Date.now();
      const div = document.createElement('div');
      div.innerHTML = cfServiceRowHTML('Website Design', 0, idx, 'flat', '', '');
      container.appendChild(div.firstChild);
      cfCheckAthlete();
    }

    function cfRemoveSvc(idx) {
      const row = document.getElementById('cf-svc-row-' + idx);
      const container = document.getElementById('cf-services-list');
      if (row && container && container.children.length > 1) row.remove();
      else showToast('At least one service is required');
      cfUpdateTotal();
      cfCheckAthlete();
    }

    // Reveal the Athlete's Name field whenever any service row is "Athlete NIL Branding".
    function cfCheckAthlete() {
      const has = [...document.querySelectorAll('.cf-svc-select')].some(s => s.value === 'Athlete NIL Branding');
      const wrap = document.getElementById('cf-athlete-wrap');
      if (wrap) wrap.style.display = has ? 'block' : 'none';
    }

    // Additional people (more than one contact) on a client.
    function cfPersonRowHTML(name, contact, idx) {
      const esc = v => (v || '').replace(/"/g, '&quot;');
      return `<div class="cf-person-row" id="cf-person-row-${idx}" style="display:grid;grid-template-columns:1fr 1fr auto;gap:8px;margin-bottom:8px">
        <input type="text" class="form-input cf-person-name" style="margin:0" placeholder="Name" value="${esc(name)}">
        <input type="text" class="form-input cf-person-contact" style="margin:0" placeholder="Email or phone" value="${esc(contact)}">
        <button type="button" onclick="document.getElementById('cf-person-row-${idx}').remove()" style="background:none;border:none;cursor:pointer;color:var(--gray-400);font-size:20px;line-height:1;padding:4px" title="Remove">×</button>
      </div>`;
    }
    function cfAddPerson(name, contact) {
      const list = document.getElementById('cf-people-list');
      if (!list) return;
      const div = document.createElement('div');
      div.innerHTML = cfPersonRowHTML(name || '', contact || '', Date.now() + '' + Math.floor(Math.random() * 1000));
      list.appendChild(div.firstChild);
    }
    function cfGetPeople() {
      return [...document.querySelectorAll('.cf-person-row')].map(r => ({
        name: r.querySelector('.cf-person-name')?.value.trim() || '',
        contact: r.querySelector('.cf-person-contact')?.value.trim() || ''
      })).filter(p => p.name || p.contact);
    }

    function cfUpdateTotal() {
      const rows = [...document.querySelectorAll('.cf-svc-row')];
      let providerTotal = 0, clientDeductTotal = 0;
      rows.forEach(row => {
        const price = parseFloat(row.querySelector('.cf-svc-price')?.value)||0;
        const pb = row.querySelector('.cf-svc-paidby')?.value || '';
        // '' or 'owner' = charge to client (pending or I paid = client reimburses)
        // 'client' = client already paid = deduction
        if (pb === 'client') clientDeductTotal += price; else providerTotal += price;
      });
      const netTotal = providerTotal - clientDeductTotal;
      const el = document.getElementById('cf-total-display');
      const deductEl = document.getElementById('cf-deduct-display');
      if (el) el.textContent = '$' + Math.max(0,netTotal).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
      if (deductEl) {
        deductEl.style.display = clientDeductTotal > 0 ? 'flex' : 'none';
        const deductAmt = deductEl.querySelector('#cf-deduct-amt');
        if (deductAmt) deductAmt.textContent = '$' + clientDeductTotal.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
      }
    }

    function cfGetServices() {
      return [...document.querySelectorAll('.cf-svc-row')].map(row => {
        const idx = row.id.replace('cf-svc-row-','');
        const sel = row.querySelector('.cf-svc-select');
        const custom = row.querySelector('.cf-svc-custom');
        const price = parseFloat(row.querySelector('.cf-svc-price')?.value)||0;
        const billingType = row.querySelector('.cf-svc-billing')?.value || 'flat';
        const paidBy = row.querySelector('.cf-svc-paidby')?.value ?? '';
        const description = row.querySelector('.cf-svc-desc')?.value.trim() || '';
        const name = sel?.value === 'Other (custom)' ? (custom?.value.trim()||'Other') : (sel?.value||'');
        return { name, price, billingType, paidBy, description };
      }).filter(s=>s.name);
    }

    function clientFormHTML(client) {
      const id = client?.id||'';
      const sta = ['Lead','Active','Completed','On Hold'];
      // Support legacy single-service OR new services array
      const existingServices = client?.services?.length
        ? client.services.map(s => ({ ...s, paidBy: s.paidBy ?? '' }))
        : (client?.service ? [{ name: client.service, price: client?.price||0, billingType:'flat', paidBy:'' }] : [{ name:'Website Design', price:250, billingType:'flat', paidBy:'' }]);
      const showAthlete = existingServices.some(s => s.name === 'Athlete NIL Branding') || !!client?.athleteName;
      const people = client?.additionalContacts || [];
      return `
        <div class="form-row">
          <div class="form-group"><label class="form-label">Status <span style="color:#999;font-weight:400">(Lead = not a paying client yet)</span></label>
            <select id="cf-status" class="form-select" onchange="cfToggleServicesForStatus()">${sta.map(s=>`<option${s===(client?.status||'Lead')?' selected':''}>${s}</option>`).join('')}</select></div>
          <div class="form-group"><label class="form-label">Start Date</label>
            <input type="date" id="cf-start" class="form-input" style="margin:0" value="${client?.startDate||''}"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Full Name *</label>
            <input type="text" id="cf-name" class="form-input" style="margin:0" value="${client?.name||''}" placeholder="Full Name"></div>
          <div class="form-group"><label class="form-label">Business Name <span style="color:#999;font-weight:400">(optional)</span></label>
            <input type="text" id="cf-biz" class="form-input" style="margin:0" value="${client?.businessName||''}" placeholder="Business Name"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Email</label>
            <input type="email" id="cf-email" class="form-input" style="margin:0" value="${client?.email||''}" placeholder="email@example.com"></div>
          <div class="form-group"><label class="form-label">Phone</label>
            <input type="tel" id="cf-phone" class="form-input" style="margin:0" value="${client?.phone||''}" placeholder="(000) 000-0000"></div>
        </div>

        <div class="form-group" style="margin-bottom:6px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <label class="form-label" style="margin:0">Additional People <span style="color:#999;font-weight:400">(optional — extra contacts on this client)</span></label>
            <button type="button" onclick="cfAddPerson()" style="background:none;border:1px solid var(--brand-primary);color:var(--brand-primary);border-radius:6px;padding:4px 10px;font-size:12px;font-weight:700;cursor:pointer">+ Add Person</button>
          </div>
          <div id="cf-people-list">
            ${people.map((p,i)=>cfPersonRowHTML(p.name, p.contact, 'init'+i)).join('')}
          </div>
        </div>

        <div class="form-group" id="cf-services-wrap" style="margin-bottom:6px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <label class="form-label" style="margin:0">Services & Pricing</label>
            <button type="button" onclick="cfAddSvc()" style="background:none;border:1px solid var(--brand-primary);color:var(--brand-primary);border-radius:6px;padding:4px 10px;font-size:12px;font-weight:700;cursor:pointer">+ Add Service</button>
          </div>
          <div id="cf-services-list" oninput="cfUpdateTotal()">
            ${existingServices.map((s,i) => cfServiceRowHTML(s.name, s.price, i, s.billingType||'flat', s.paidBy??'', s.description||'')).join('')}
          </div>
          <div style="margin-top:8px;padding-top:8px;border-top:1px solid #E2E8F0">
            <div id="cf-deduct-display" style="display:${existingServices.some(s=>s.paidBy==='client')?'flex':'none'};justify-content:space-between;align-items:center;font-size:12px;color:#10B981;margin-bottom:4px;padding:4px 8px;background:rgba(240,253,244,0.9);border-radius:6px;border:1px solid rgba(16,185,129,0.2)">
              <span>✅ Client paid directly (deducted)</span>
              <span id="cf-deduct-amt" style="font-weight:700">−$${existingServices.filter(s=>s.paidBy==='client').reduce((a,s)=>a+(s.price||0),0).toLocaleString('en-US',{minimumFractionDigits:2})}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span style="font-size:12px;color:var(--gray-500)">Client owes (net)</span>
              <span style="font-size:13px;font-weight:700;color:#0F172A">Total: <span id="cf-total-display">$${Math.max(0, existingServices.filter(s=>s.paidBy!=='client').reduce((a,s)=>a+(s.price||0),0) - existingServices.filter(s=>s.paidBy==='client').reduce((a,s)=>a+(s.price||0),0)).toLocaleString('en-US',{minimumFractionDigits:2})}</span></span>
            </div>
          </div>
        </div>

        <div class="form-group" id="cf-athlete-wrap" style="display:${showAthlete?'block':'none'};margin-bottom:6px">
          <label class="form-label">Athlete's Name <span style="color:#999;font-weight:400">(for NIL branding)</span></label>
          <input type="text" id="cf-athlete" class="form-input" style="margin:0" value="${(client?.athleteName||'').replace(/"/g,'&quot;')}" placeholder="Athlete's full name">
        </div>

        <div class="form-group"><label class="form-label">Project Description <span style="color:#999;font-weight:400">(used on proposals)</span></label>
          <textarea id="cf-project-desc" class="form-textarea" style="min-height:60px" placeholder="e.g. Church Website Design and Hosting.">${client?.projectDescription||''}</textarea></div>

        <div class="form-row">
          <div class="form-group"><label class="form-label">Timeline <span style="color:#999;font-weight:400">(for proposal)</span></label>
            <input type="text" id="cf-timeline" class="form-input" style="margin:0" value="${client?.timeline||''}" placeholder="e.g. ~30 days"></div>
          <div class="form-group">
            <label class="form-label" style="display:flex;align-items:center;gap:10px;cursor:pointer;user-select:none">
              <input type="checkbox" id="cf-deposit-required" style="width:18px;height:18px;cursor:pointer;accent-color:var(--brand-primary)"${client?.depositRequired?' checked':''}
                onchange="document.getElementById('cf-deposit-amount').disabled=!this.checked;document.getElementById('cf-deposit-amount').style.opacity=this.checked?'1':'0.5'">
              <span>Deposit Required</span>
            </label>
            <input type="text" id="cf-deposit-amount" class="form-input" style="margin:6px 0 0 0;${client?.depositRequired?'':'opacity:0.5'}"
              ${client?.depositRequired?'':'disabled'}
              value="${client?.depositAmount||'50%'}" placeholder="e.g. 50% or $500">
          </div>
        </div>

        <div class="form-group"><label class="form-label">Notes <span style="color:#999;font-weight:400">(internal — not shown on proposal)</span></label>
          <textarea id="cf-notes" class="form-textarea">${client?.notes||''}</textarea></div>
        <input type="hidden" id="cf-id" value="${id}">
        <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px;">
          ${id?`<button onclick="deleteClient('${id}')" style="padding:10px 14px;background:none;border:1px solid var(--error);color:var(--error);border-radius:8px;cursor:pointer;font-weight:600;">Delete</button>`:''}
          <button onclick="closeModal('${id?'edit-client-modal':'add-client-modal'}')" style="padding:10px 14px;background:none;border:1px solid var(--gray-300);border-radius:8px;cursor:pointer;font-weight:600;">Cancel</button>
          <button onclick="saveClient()" class="btn btn-solid">Save Client</button>
        </div>`;
    }

    function saveClient() {
      const id = document.getElementById('cf-id').value;
      const name = document.getElementById('cf-name').value.trim();
      if (!name) { alert('Client name is required.'); return; }
      const status = document.getElementById('cf-status').value;
      const isLead = status === 'Lead';
      // Leads aren't paying clients yet — skip services + revenue entirely.
      // When the user later changes status to Active they can add services
      // via Edit Client, which will populate the first invoice.
      const services = isLead ? [] : cfGetServices();
      if (!isLead && !services.length) { alert('Add at least one service.'); return; }
      // Net charge = sum of (provider/unselected) services minus client-paid services
      // Client-paid = deduction; unselected ('') or 'owner' = charge
      const chargeTotal  = services.filter(s => s.paidBy !== 'client').reduce((a,s) => a + (s.price||0), 0);
      const deductTotal  = services.filter(s => s.paidBy === 'client').reduce((a,s) => a + (s.price||0), 0);
      const totalPrice   = Math.max(0, chargeTotal - deductTotal);
      // Legacy compat: keep service/price fields for existing code that reads them
      const data = {
        name, businessName: document.getElementById('cf-biz').value.trim(),
        email: document.getElementById('cf-email').value.trim(),
        phone: document.getElementById('cf-phone').value.trim(),
        services,                                    // new: array of {name, price, billingType, paidBy}
        service: services.map(s=>s.name).join(', '), // legacy: comma-joined string
        price: totalPrice,                           // legacy: net total client owes
        status: document.getElementById('cf-status').value,
        startDate: document.getElementById('cf-start').value,
        notes: document.getElementById('cf-notes').value.trim(),
        projectDescription: document.getElementById('cf-project-desc')?.value.trim() || '',
        timeline: document.getElementById('cf-timeline')?.value.trim() || '',
        depositRequired: !!document.getElementById('cf-deposit-required')?.checked,
        depositAmount: document.getElementById('cf-deposit-amount')?.value.trim() || '',
        athleteName: document.getElementById('cf-athlete')?.value.trim() || '',
        additionalContacts: (typeof cfGetPeople === 'function' ? cfGetPeople() : [])
      };
      const clients = getData('clients');
      let revenue = getData('revenue');
      if (id) {
        const idx = clients.findIndex(c => c.id === id);
        if (idx > -1) Object.assign(clients[idx], data);
        // Refresh the FIRST/initial invoice line items to match the updated services
        // (preserves any monthly invoices and any already-paid invoices)
        const baseInv = clients[idx]?.invoiceNumber;
        if (baseInv) {
          // Only remove pending first-invoice rows for this client; keep paid rows + monthly invoices
          revenue = revenue.filter(r => !(
            r.clientId === id &&
            r.invoiceNumber.replace(/-\d+$/,'') === baseInv &&
            r.status !== 'Paid'
          ));
          const startDate = data.startDate || new Date().toISOString().split('T')[0];
          services.forEach((s, i) => {
            const suffix = i === 0 ? '' : '-' + (i+1);
            const isClientPaid = s.paidBy === 'client';
            revenue.push({
              id: generateId(), clientId: id, clientName: data.name,
              amount: isClientPaid ? -(s.price||0) : (s.price||0),
              date: startDate,
              status: isClientPaid ? 'Client-Paid' : 'Pending',
              serviceType: s.name, invoiceNumber: baseInv + suffix,
              billingType: s.billingType || 'flat',
              billingPeriod: s.billingType === 'ongoing' ? startDate.slice(0,7) : null,
              paidBy: s.paidBy ?? '',
              isFirstInvoice: true
            });
          });
          setData('revenue', revenue);
        }
        logActivity('client', 'Updated client: ' + name);
        closeModal('edit-client-modal');
      } else {
        const clientCount = clients.length + 1;
        const inv = 'INV-' + String(clientCount).padStart(3,'0');
        const today = new Date().toISOString().split('T')[0];
        const startDate = data.startDate || today;
        const nc = { ...data, id: generateId(), completedDate:'', paid:false, paidDate:'', portalToken: generateToken(), deliverables:[], messages:[], intakeForm:{completed:false,answers:{}}, projectStatus:0, invoiceNumber: inv };
        clients.push(nc);
        // FIRST INVOICE: includes ALL services — flat rate (one-time) + first month of ongoing
        // Client-paid services stored with paidBy:'client' and shown as deductions on the invoice
        services.forEach((s, i) => {
          const suffix = i === 0 ? '' : '-' + (i+1);
          const isClientPaid = s.paidBy === 'client';
          revenue.push({
            id: generateId(), clientId: nc.id, clientName: nc.name,
            // client paid = deduction (negative); provider paid or unselected = charge (positive)
            amount: isClientPaid ? -(s.price||0) : (s.price||0),
            date: startDate,
            status: isClientPaid ? 'Client-Paid' : 'Pending',
            serviceType: s.name, invoiceNumber: inv + suffix,
            billingType: s.billingType || 'flat',
            billingPeriod: s.billingType === 'ongoing' ? startDate.slice(0,7) : null,
            paidBy: s.paidBy ?? '',
            isFirstInvoice: true
          });
        });
        setData('revenue', revenue);
        logActivity('client', 'New client added: ' + name);
        closeModal('add-client-modal');
        // Fire welcome email if client has an email + Resend is configured.
        // Wait briefly so the portal snapshot push debounce completes first
        // (otherwise the link would 404 on the client's first click).
        if (nc.email && typeof sendPortalNotificationEmail === 'function') {
          if (confirm('Send ' + nc.name + ' a welcome email with their portal link now?')) {
            setTimeout(() => {
              sendPortalNotificationEmail(nc, {
                subject: 'Welcome to your client portal',
                heading: 'Your private client portal is ready',
                body: 'Welcome aboard! I\'ve set up a private portal where you can review documents, see deliverables, message me, and pay invoices — all in one place.<br><br>Bookmark the link below; you\'ll come back to it as we work together.',
                ctaLabel: 'Open My Portal'
              });
            }, 2200);
          }
        }
      }
      setData('clients', clients);
      renderClients(); updateDashboard();
    }

    function deleteClient(id) {
      if (!confirm('Delete this client and all their data? Cannot be undone.')) return;
      let clients = getData('clients');
      const client = clients.find(c => c.id === id);
      clients = clients.filter(c => c.id !== id);
      let revenue = getData('revenue');
      revenue = revenue.filter(r => r.clientId !== id);
      setData('clients', clients); setData('revenue', revenue);
      if (client) logActivity('client', 'Deleted client: ' + client.name);
      closeModal('edit-client-modal'); closeModal('client-detail-modal');
      renderClients(); updateDashboard();
    }

    function openClientDetail(id) {
      const clientsAll = getData('clients');
      const cIdx = clientsAll.findIndex(c => c.id === id);
      if (cIdx < 0) return;
      const client = clientsAll[cIdx];
      // Backfill any missing fields older client records might lack — prevents
      // blank Preview Portal and undefined errors elsewhere.
      let migrated = false;
      if (!client.portalToken) { client.portalToken = generateToken(); migrated = true; }
      if (!Array.isArray(client.deliverables)) { client.deliverables = []; migrated = true; }
      if (!Array.isArray(client.messages)) { client.messages = []; migrated = true; }
      if (!Array.isArray(client.teamMembers)) { client.teamMembers = []; migrated = true; }
      if (typeof client.projectStatus !== 'number') { client.projectStatus = 0; migrated = true; }
      if (migrated) { clientsAll[cIdx] = client; setData('clients', clientsAll); }
      const ex = document.getElementById('client-detail-modal'); if (ex) ex.remove();
      const unread = client.messages.filter(m => !m.read && m.from === 'client').length;
      const modal = document.createElement('div');
      modal.id = 'client-detail-modal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal-box" style="max-width:820px">
          <div class="modal-header">
            <div><div class="modal-title">${client.name}</div><div style="font-size:13px;color:var(--gray-500)">${client.businessName||''} · ${client.service}</div></div>
            <button class="modal-close" onclick="closeModal('client-detail-modal')">×</button>
          </div>
          <div class="modal-body">
            <div class="modal-tabs">
              <div class="modal-tab active" onclick="switchModalTab('cdm','overview',this)">Overview</div>
              <div class="modal-tab" onclick="switchModalTab('cdm','project',this)">Project</div>
              <div class="modal-tab" onclick="switchModalTab('cdm','invoice',this)">Invoice</div>
              <div class="modal-tab" onclick="switchModalTab('cdm','messages',this)">Messages${unread?` <span style="background:var(--error);color:#fff;border-radius:99px;padding:1px 6px;font-size:10px;margin-left:4px">${unread}</span>`:''}</div>
              <div class="modal-tab" onclick="switchModalTab('cdm','portal',this)">Portal Link</div>
            </div>

            <div id="cdm-tab-overview" class="modal-tab-content active">
              <div class="form-row"><div><div class="form-label">Client</div><div style="font-size:15px;font-weight:600">${client.name}</div></div><div><div class="form-label">Business</div><div style="font-size:15px;font-weight:600">${client.businessName||'—'}</div></div></div>
              <div class="form-row" style="margin-top:16px"><div><div class="form-label">Email</div><div>${client.email||'—'}</div></div><div><div class="form-label">Phone</div><div>${client.phone||'—'}</div></div></div>
              <div class="form-row" style="margin-top:16px"><div><div class="form-label">Service</div><div>${client.service}</div></div><div><div class="form-label">Status</div><div>${client.status}</div></div></div>
              ${client.notes?`<div style="margin-top:16px"><div class="form-label">Notes</div><div style="font-size:14px;color:var(--gray-600)">${client.notes}</div></div>`:''}
              <div style="margin-top:20px;display:flex;gap:8px;flex-wrap:wrap">
                <button onclick="openEditClientModal('${client.id}')" class="btn btn-solid" style="padding:8px 18px">Edit Client Info</button>
                <button onclick="openTeamEmailModal('${client.id}')" class="btn btn-outline" style="padding:8px 18px">Email Team Member</button>
              </div>
              <div style="margin-top:20px;padding-top:16px;border-top:1px dashed var(--gray-200)">
                <div class="form-label" style="margin-bottom:8px">Team Members</div>
                <div id="tm-list-${client.id}">
                  ${(client.teamMembers||[]).length
                    ? (client.teamMembers||[]).map(t => `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;border:1px solid var(--gray-200);border-radius:8px;margin-bottom:6px;font-size:13px">
                        <div><strong>${(t.name||'').replace(/</g,'&lt;')}</strong> ${t.role?'<span style="color:var(--gray-500)"> · '+(t.role||'').replace(/</g,'&lt;')+'</span>':''}<div style="font-size:12px;color:var(--gray-500)">${(t.email||'').replace(/</g,'&lt;')}</div></div>
                        <div style="display:flex;gap:6px">
                          <button onclick="openTeamEmailModal('${client.id}','${t.id}')" class="btn btn-outline" style="padding:5px 10px;font-size:12px">Request Info</button>
                          <button onclick="removeTeamMember('${client.id}','${t.id}')" style="background:none;border:none;color:var(--error);cursor:pointer;font-size:18px;padding:0 4px">×</button>
                        </div>
                      </div>`).join('')
                    : '<p style="color:var(--gray-400);font-size:13px;margin:0">No team members added yet.</p>'}
                </div>
                <button onclick="addTeamMember('${client.id}')" class="btn btn-outline" style="padding:6px 12px;font-size:12px;margin-top:8px">+ Add Team Member</button>
              </div>
            </div>

            <div id="cdm-tab-project" class="modal-tab-content">
              <div style="margin-bottom:20px">
                <div style="display:flex;justify-content:space-between;font-size:14px;font-weight:600;margin-bottom:8px"><span>Project Progress</span><span id="pp-lbl">${client.projectStatus}%</span></div>
                <input type="range" id="pp-range" min="0" max="100" value="${client.projectStatus}" style="width:100%;accent-color:var(--accent)" oninput="document.getElementById('pp-lbl').textContent=this.value+'%'">
                <button onclick="saveProgress('${client.id}')" class="btn btn-solid" style="margin-top:10px;padding:8px 18px;font-size:13px">Save Progress</button>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
                <div class="form-label" style="margin:0">Deliverables (${client.deliverables.length})</div>
                <button onclick="showDelForm('${client.id}')" class="btn btn-solid" style="padding:7px 14px;font-size:13px">+ Add</button>
              </div>
              <div id="del-list-${client.id}">
                ${client.deliverables.map(d=>`
                  <div style="display:flex;justify-content:space-between;align-items:start;padding:12px;border:1px solid var(--gray-200);border-radius:8px;margin-bottom:8px">
                    <div><div style="font-weight:600;font-size:14px">${d.name}</div><div style="font-size:13px;color:var(--gray-500)">${d.description}</div>${d.url?`<a href="${d.url}" target="_blank" style="font-size:13px;color:var(--accent)">Open Link →</a>`:''}</div>
                    <button onclick="removeDeliverable('${client.id}','${d.id}')" style="background:none;border:none;cursor:pointer;color:var(--error);font-size:20px;padding:0 4px;line-height:1">×</button>
                  </div>`).join('') || '<p style="color:var(--gray-400);font-size:14px">No deliverables yet.</p>'}
              </div>
              <div id="del-form-${client.id}" style="display:none;padding:16px;border:1px solid var(--gray-200);border-radius:8px;margin-top:12px">
                <div class="form-group"><label class="form-label">Name *</label><input type="text" id="dn-${client.id}" class="form-input" style="margin:0" placeholder="e.g. Completed Website"></div>
                <div class="form-group"><label class="form-label">Description</label><textarea id="dd-${client.id}" class="form-textarea" placeholder="What was delivered?"></textarea></div>
                <div class="form-group">
                  <label class="form-label">Upload File <span style="color:var(--gray-400);font-weight:400">(drag & drop, click to browse, or paste a URL — max 50MB)</span></label>
                  <div id="dz-${client.id}"
                       ondragover="event.preventDefault();this.style.background='#EFF6FF';this.style.borderColor='var(--brand-primary)';"
                       ondragleave="this.style.background='#F8FAFC';this.style.borderColor='#CBD5E1';"
                       ondrop="event.preventDefault();this.style.background='#F8FAFC';this.style.borderColor='#CBD5E1';if(event.dataTransfer.files&&event.dataTransfer.files[0]){const inp=document.getElementById('df-${client.id}');const dt=new DataTransfer();dt.items.add(event.dataTransfer.files[0]);inp.files=dt.files;handleDeliverableFileUpload('${client.id}', inp);}"
                       onclick="document.getElementById('df-${client.id}').click()"
                       style="border:2px dashed #CBD5E1;border-radius:10px;padding:18px;text-align:center;cursor:pointer;background:#F8FAFC;transition:all 0.15s;font-size:13px;color:#64748B">
                    <div style="font-size:24px;margin-bottom:6px">📎</div>
                    <strong style="color:#0F172A">Drag a file here</strong> or click to browse
                    <div style="font-size:11.5px;color:#94A3B8;margin-top:4px">PDF, Word, images, ZIP, HTML — up to 50MB</div>
                  </div>
                  <input type="file" id="df-${client.id}" style="display:none" accept=".html,.htm,.pdf,.zip,.png,.jpg,.jpeg,.gif,.svg,.docx,.doc,.xlsx,.xls,.txt,.md" onchange="handleDeliverableFileUpload('${client.id}', this)">
                  <div id="df-status-${client.id}" style="font-size:12px;margin-top:6px;color:var(--gray-500)"></div>
                </div>
                <div class="form-group"><label class="form-label">Link / URL</label><input type="url" id="du-${client.id}" class="form-input" style="margin:0" placeholder="https://..."></div>
                <div class="form-group">
                  <label class="form-label">Or pick from Business File</label>
                  <select id="dbf-${client.id}" class="form-input" style="margin:0" onchange="_pickFromBusinessFile('${client.id}', this.value)">
                    <option value="">— select a saved document —</option>
                    ${(getData('businessFile')||[]).map(d => `<option value="${d.id}">${(d.type||'Doc')} · ${(d.title||'').replace(/"/g,'&quot;').slice(0,80)}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;color:var(--gray-700)">
                    <input type="checkbox" id="dem-${client.id}" checked> Also email ${client.name||'this client'} a notification with the portal link
                  </label>
                </div>
                <div style="display:flex;gap:8px;justify-content:flex-end">
                  <button onclick="document.getElementById('del-form-${client.id}').style.display='none'" style="padding:8px 14px;background:none;border:1px solid var(--gray-300);border-radius:8px;cursor:pointer">Cancel</button>
                  <button onclick="addDeliverable('${client.id}')" class="btn btn-solid" style="padding:8px 16px;font-size:13px">Add</button>
                </div>
              </div>
            </div>

            <div id="cdm-tab-invoice" class="modal-tab-content">
              ${(()=>{
                const allRev = getData('revenue').filter(r=>r.clientId===client.id).sort((a,b)=>a.date<b.date?1:-1);
                const hasOngoing = (client.services||[]).some(s=>s.billingType==='ongoing');
                // Group revenue by invoiceNumber prefix (base invoice)
                const grouped = {};
                allRev.forEach(r=>{
                  const base = r.invoiceNumber.replace(/-\d+$/,'');
                  if (!grouped[base]) grouped[base] = { date: r.date, items:[], status:'Paid' };
                  grouped[base].items.push(r);
                  if (r.status !== 'Paid' && r.status !== 'Client-Paid') grouped[base].status = 'Pending';
                });
                const invoiceBlocks = Object.entries(grouped).map(([inv, grp])=>{
                  const chargeItems    = grp.items.filter(r=>r.paidBy!=='client'); // provider paid = client owes
                  const deductionItems = grp.items.filter(r=>r.paidBy==='client'); // client paid = deduction
                  const subtotal   = chargeItems.reduce((a,r)=>a+Math.abs(r.amount),0);
                  const deductions = deductionItems.reduce((a,r)=>a+Math.abs(r.amount),0);
                  const total = Math.max(0, subtotal - deductions);
                  const isPaid = grp.status === 'Paid';
                  const firstRevId = grp.items[0]?.id || '';
                  return `
                    <div style="border:1.5px solid ${isPaid?'rgba(16,185,129,0.35)':'rgba(245,158,11,0.4)'};border-radius:12px;padding:16px;margin-bottom:14px">
                      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;flex-wrap:wrap;gap:8px">
                        <div>
                          <div style="font-weight:700;font-size:15px;color:var(--gray-900)">${inv}</div>
                          <div style="display:flex;align-items:center;gap:8px;margin-top:4px">
                            <label style="font-size:12px;color:var(--gray-500)">Date:</label>
                            <input type="date" value="${grp.date}" style="font-size:12px;border:1px solid var(--gray-300);border-radius:5px;padding:3px 7px;color:var(--gray-700)"
                              onchange="updateInvoiceDate('${client.id}','${inv}',this.value)">
                          </div>
                        </div>
                        <div style="text-align:right">
                          <div style="font-size:22px;font-weight:700;color:var(--gray-900)">$${total.toLocaleString('en-US',{minimumFractionDigits:2})}</div>
                          <span style="background:${isPaid?'rgba(16,185,129,0.1)':'rgba(245,158,11,0.1)'};color:${isPaid?'#10B981':'#F59E0B'};padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700">${isPaid?'✓ PAID':'⏳ PENDING'}</span>
                        </div>
                      </div>
                      <table style="width:100%;font-size:13px;border-collapse:collapse;margin-bottom:10px">
                        ${grp.items.map(r=>`
                          <tr style="border-top:1px solid var(--gray-100)">
                            <td style="padding:6px 4px;color:${r.paidBy==='client'?'#10B981':'var(--gray-700)'}">
                              ${r.serviceType}
                              ${r.paidBy==='client'?`<div style="font-size:10px;color:#10B981;font-weight:600">✅ Client paid — deduction</div>`:''}
                            </td>
                            <td style="padding:6px 4px;text-align:center">
                              ${r.paidBy==='client'
                                ? `<span style="font-size:10px;padding:2px 7px;border-radius:99px;font-weight:700;background:rgba(16,185,129,0.1);color:#10B981">✅ Client Paid</span>`
                                : `<span style="font-size:10px;padding:2px 7px;border-radius:99px;font-weight:700;background:${r.billingType==='ongoing'?'rgba(66,103,178,0.1)':'rgba(100,116,139,0.1)'};color:${r.billingType==='ongoing'?'var(--brand-primary)':'#64748b'}">${r.billingType==='ongoing'?'🔄 Ongoing':'1× Flat'}${r.billingPeriod?' · '+r.billingPeriod:''}</span>`}
                            </td>
                            <td style="padding:6px 4px;text-align:right;font-weight:600;color:${r.paidBy==='client'?'#10B981':'inherit'}">
                              ${r.paidBy==='client'?'−':''}$${Math.abs(r.amount).toLocaleString('en-US',{minimumFractionDigits:2})}
                            </td>
                            <td style="padding:6px 4px;text-align:right;width:60px">
                              <button onclick="editRevenueLine('${client.id}','${r.id}')" title="Edit amount or service" style="background:transparent;border:none;color:#64748B;cursor:pointer;font-size:13px;padding:2px 4px">✎</button>
                              <button onclick="deleteRevenueLine('${client.id}','${r.id}')" title="Remove this line item" style="background:transparent;border:none;color:#DC2626;cursor:pointer;font-size:16px;padding:2px 4px">×</button>
                            </td>
                          </tr>`).join('')}
                      </table>
                      ${deductions > 0 ? `
                        <div style="border-top:1px dashed var(--gray-200);padding-top:8px;margin-top:4px;margin-bottom:10px">
                          <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--gray-500);margin-bottom:3px">
                            <span>Charges (provider paid / services)</span><span>$${subtotal.toLocaleString('en-US',{minimumFractionDigits:2})}</span>
                          </div>
                          <div style="display:flex;justify-content:space-between;font-size:12px;color:#10B981;font-weight:600;margin-bottom:6px">
                            <span>✅ Client paid directly (deduction)</span><span>−$${deductions.toLocaleString('en-US',{minimumFractionDigits:2})}</span>
                          </div>
                          <div style="display:flex;justify-content:space-between;font-size:14px;font-weight:700;color:var(--gray-900);border-top:1.5px solid var(--gray-200);padding-top:6px">
                            <span>Client Owes</span><span>$${total.toLocaleString('en-US',{minimumFractionDigits:2})}</span>
                          </div>
                        </div>` : ''}
                      ${!isPaid
                        ?`<button onclick="markInvoicePaid('${client.id}','${inv}')" class="btn btn-solid" style="width:100%;padding:10px;font-size:13px">✓ Mark Invoice Paid</button>`
                        :`<button onclick="markInvoiceUnpaid('${client.id}','${inv}')" style="width:100%;padding:10px;background:none;border:1px solid var(--gray-300);border-radius:8px;cursor:pointer;font-weight:600;font-size:13px">Mark as Unpaid</button>`}
                    </div>`;
                }).join('');
                const genBtn = hasOngoing ? `
                  <div style="background:linear-gradient(135deg,#EFF6FF,#EDE9FE);border-radius:12px;padding:16px;margin-bottom:16px;border:1px solid #BFDBFE">
                    <div style="font-size:13px;font-weight:600;color:#1e40af;margin-bottom:6px">🔄 Ongoing Services Detected</div>
                    <p style="font-size:12px;color:#3b82f6;margin-bottom:10px">Generate a new monthly invoice for recurring services. Invoice date defaults to the 1st of next month — you can adjust before saving.</p>
                    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
                      <input type="date" id="monthly-inv-date-${client.id}" value="${nextMonthFirst()}" style="font-size:13px;border:1px solid #93c5fd;border-radius:7px;padding:6px 10px;color:#1e40af">
                      <button onclick="generateMonthlyInvoice('${client.id}')" class="btn btn-solid" style="background:linear-gradient(135deg,var(--brand-primary),#7C3AED);padding:8px 16px;font-size:13px">📄 Generate Monthly Invoice</button>
                    </div>
                  </div>` : '';
                // Per-service invoicing panel: bill any individual service
                // separately (flat fee paid before monthly, or any single
                // ongoing service billed on its own date).
                const services = (client.services || []);
                const perServicePanel = services.length ? `
                  <div style="background:#FFF7ED;border:1px solid #FDBA74;border-radius:12px;padding:16px;margin-bottom:16px" id="bs-panel-${client.id}">
                    <div style="font-size:13px;font-weight:600;color:#9A3412;margin-bottom:6px">📋 Bill Services Separately</div>
                    <p style="font-size:12px;color:#7C2D12;margin-bottom:12px">Pick one or more services. Combined totals (flat + monthly) update as you check boxes. Click "Generate Invoice for Selected" to open the editor pre-loaded with them.</p>
                    ${services.map((s,i) => `
                      <label style="display:flex;align-items:center;gap:10px;padding:8px 0;border-top:1px solid #FED7AA;cursor:pointer">
                        <input type="checkbox" class="bs-pick" data-idx="${i}" data-price="${Number(s.price)||0}" data-monthly="${s.billingType==='ongoing'?'1':'0'}" onchange="updateBillSeparatelyTotals('${client.id}')" style="width:18px;height:18px;accent-color:#F97316;cursor:pointer">
                        <div style="flex:1;min-width:0">
                          <div style="font-weight:600;color:#0F172A;font-size:13px">${(s.name||'').replace(/</g,'&lt;')}</div>
                          <div style="font-size:11.5px;color:#9A3412">$${(s.price||0).toLocaleString()} · ${s.billingType==='ongoing' ? '🔄 Monthly' : '1× Flat'}${s.paidBy==='client' ? ' · client paid' : ''}</div>
                        </div>
                      </label>`).join('')}
                    <div style="margin-top:12px;padding:12px;background:#fff;border:1px solid #FED7AA;border-radius:8px">
                      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:12px;color:#7C2D12">
                        <div><div style="font-weight:700;text-transform:uppercase;font-size:10px;color:#9A3412">Flat</div><div style="font-size:15px;font-weight:700;color:#0F172A" id="bs-flat-${client.id}">$0</div></div>
                        <div><div style="font-weight:700;text-transform:uppercase;font-size:10px;color:#9A3412">Monthly</div><div style="font-size:15px;font-weight:700;color:#1E40AF" id="bs-monthly-${client.id}">$0/mo</div></div>
                        <div><div style="font-weight:700;text-transform:uppercase;font-size:10px;color:#9A3412">Combined now</div><div style="font-size:18px;font-weight:700;color:#16A34A" id="bs-total-${client.id}">$0</div></div>
                      </div>
                    </div>
                    <button onclick="generateInvoiceFromSelected('${client.id}')" class="btn btn-solid" style="margin-top:10px;width:100%;padding:10px;background:#F97316;border-color:#F97316;font-size:13px">📄 Generate Invoice for Selected</button>
                  </div>` : '';
                return perServicePanel + genBtn + (invoiceBlocks || `<p style="color:var(--gray-400);text-align:center;padding:24px">No invoices yet.</p>`);
              })()}
            </div>

            <div id="cdm-tab-messages" class="modal-tab-content">
              <div id="msg-thread-${client.id}" style="max-height:280px;overflow-y:auto;margin-bottom:16px;padding:4px">
                ${client.messages.length
                  ? client.messages.map(m=>`<div style="display:flex;flex-direction:column;align-items:${m.from==='owner'?'flex-end':'flex-start'};margin-bottom:12px"><div class="message-bubble ${m.from==='owner'?'msg-owner':'msg-client'}">${m.message}<div class="message-meta">${m.from==='owner'?'You':'Client'} · ${timeAgo(m.timestamp)}</div></div></div>`).join('')
                  : '<p style="color:var(--gray-400);font-size:14px;text-align:center;padding:20px 0">No messages yet.</p>'}
              </div>
              <div style="display:flex;gap:8px">
                <input type="text" id="omsg-${client.id}" class="form-input" style="flex:1;margin:0" placeholder="Type a message to ${client.name.split(' ')[0]}…" onkeypress="if(event.key==='Enter')sendOwnerMsg('${client.id}')">
                <button id="ai-draft-btn-${client.id}" onclick="draftAiReply('${client.id}')" class="btn btn-outline" style="padding:12px 14px;white-space:nowrap;font-size:13px"><span class="icon icon-sm" data-icon="spark" style="margin-right:6px;vertical-align:-2px"></span>Draft</button>
                <button onclick="sendOwnerMsg('${client.id}')" class="btn btn-solid" style="padding:12px 20px">Send</button>
              </div>
            </div>

            <div id="cdm-tab-portal" class="modal-tab-content">
              <div style="background:var(--gray-50);border-radius:12px;padding:20px;margin-bottom:16px">
                <div style="font-size:13px;font-weight:600;color:var(--gray-700);margin-bottom:8px">Client Portal Link</div>
                <div style="display:flex;gap:8px;align-items:center">
                  <input type="text" id="pl-${client.id}" class="form-input" style="flex:1;margin:0;font-size:12px" value="${(window.location.origin && /^https?:/.test(window.location.origin)) ? window.location.origin : 'https://thehelpctr.com'}/portal.html?t=${client.portalToken}" readonly>
                  <button onclick="copyPortalLink('${client.id}')" class="btn btn-solid" style="padding:12px 16px;white-space:nowrap">Copy</button>
                </div>
                <div id="pl-confirm-${client.id}" style="color:var(--success);font-size:13px;margin-top:8px;display:none">✓ Link copied to clipboard!</div>
              </div>
              <div style="padding:16px;border:1px solid var(--gray-200);border-radius:8px;margin-bottom:12px">
                <div style="font-weight:600;font-size:14px;margin-bottom:8px">What the client sees:</div>
                <ul style="font-size:13px;color:var(--gray-600);padding-left:20px;line-height:2.2">
                  <li>Project status progress bar</li><li>All deliverables with links</li><li>Invoice & payment status</li><li>Message form to reach you</li>
                </ul>
              </div>
              <button onclick="closeModal('client-detail-modal');previewPortalLink('${client.portalToken}')" class="btn btn-outline" style="width:100%">Preview Portal →</button>
            </div>
          </div>
        </div>`;
      document.body.appendChild(modal);
      modal.addEventListener('click', e => { if (e.target === modal) closeModal('client-detail-modal'); });
      // Mark client messages as read
      const clients = getData('clients');
      const idx = clients.findIndex(c => c.id === id);
      if (idx > -1) { clients[idx].messages.forEach(m => { if (m.from==='client') m.read=true; }); setData('clients', clients); }
    }

    // Live recalculate of the "Bill Services Separately" totals when boxes are checked.
    function updateBillSeparatelyTotals(clientId) {
      const panel = document.getElementById('bs-panel-' + clientId);
      if (!panel) return;
      let flat = 0, monthly = 0;
      panel.querySelectorAll('.bs-pick:checked').forEach(cb => {
        const p = Number(cb.dataset.price) || 0;
        if (cb.dataset.monthly === '1') monthly += p;
        else flat += p;
      });
      const fmt = n => '$' + Number(n).toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:2});
      const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
      set('bs-flat-' + clientId, fmt(flat));
      set('bs-monthly-' + clientId, fmt(monthly) + '/mo');
      // "Combined now" = flat + monthly's first month — what the client owes on this invoice
      set('bs-total-' + clientId, fmt(flat + monthly));
    }

    // Open the new invoice editor pre-loaded with the selected services from the
    // legacy "Bill Services Separately" panel.
    function generateInvoiceFromSelected(clientId) {
      const panel = document.getElementById('bs-panel-' + clientId);
      if (!panel) return;
      const picks = Array.from(panel.querySelectorAll('.bs-pick:checked')).map(cb => Number(cb.dataset.idx));
      if (!picks.length) { alert('Pick at least one service.'); return; }
      const clients = getData('clients') || [];
      const c = clients.find(cl => cl.id === clientId);
      if (!c) return;
      // Close the client detail modal so the invoice editor has the stage
      closeModal('client-detail-modal');
      // Open the invoice editor and seed items from the selected services
      setTimeout(() => {
        if (typeof openInvoiceEditorModal !== 'function') { alert('Invoice editor not available.'); return; }
        openInvoiceEditorModal(clientId);
        setTimeout(() => {
          // Clear any default seed items and load our selected ones
          window._invoiceDraft.items = [];
          picks.forEach(i => {
            if (typeof addInvoiceLineFromService === 'function') addInvoiceLineFromService(i);
          });
        }, 80);
      }, 100);
    }

    // Delete a single line item from the revenue table (one row of an invoice).
    // Auto-reopens the client detail modal on the invoice tab so the user sees the change.
    function deleteRevenueLine(clientId, revenueId) {
      const rev = getData('revenue') || [];
      const r = rev.find(x => x.id === revenueId);
      if (!r) return;
      if (!confirm('Remove "' + (r.serviceType || 'this line') + '" — $' + Math.abs(r.amount).toLocaleString() + ' from the invoice?\n\nThis updates the invoice total and cannot be undone.')) return;
      const next = rev.filter(x => x.id !== revenueId);
      setData('revenue', next);
      logActivity('invoice', 'Removed line "' + (r.serviceType || '') + '" from invoice ' + (r.invoiceNumber || ''));
      // Refresh: close + reopen modal on the Invoice tab
      const cid = clientId;
      closeModal('client-detail-modal');
      setTimeout(() => {
        openClientDetail(cid);
        // Switch to invoice tab after the modal renders
        setTimeout(() => { const tab = document.querySelector('[onclick*="cdm"][onclick*="invoice"]'); if (tab) tab.click(); }, 100);
      }, 100);
    }

    // Edit a line item: prompts for new service name + amount.
    function editRevenueLine(clientId, revenueId) {
      const rev = getData('revenue') || [];
      const idx = rev.findIndex(x => x.id === revenueId);
      if (idx < 0) return;
      const r = rev[idx];
      const newName = prompt('Service/description for this line:', r.serviceType || '');
      if (newName === null) return;
      const newAmtStr = prompt('Amount (USD):', String(Math.abs(r.amount) || 0));
      if (newAmtStr === null) return;
      const newAmt = Number(newAmtStr);
      if (!isFinite(newAmt) || newAmt < 0) { alert('Invalid amount.'); return; }
      rev[idx] = Object.assign({}, r, {
        serviceType: newName.trim(),
        amount: r.paidBy === 'client' ? -Math.abs(newAmt) : Math.abs(newAmt)
      });
      setData('revenue', rev);
      logActivity('invoice', 'Edited line on invoice ' + (r.invoiceNumber || ''));
      closeModal('client-detail-modal');
      setTimeout(() => {
        openClientDetail(clientId);
        setTimeout(() => { const tab = document.querySelector('[onclick*="cdm"][onclick*="invoice"]'); if (tab) tab.click(); }, 100);
      }, 100);
    }

    function saveProgress(clientId) {
      const val = parseInt(document.getElementById('pp-range').value);
      const clients = getData('clients');
      const idx = clients.findIndex(c => c.id === clientId);
      if (idx > -1) {
        clients[idx].projectStatus = val;
        if (val === 100 && clients[idx].status === 'Active') { clients[idx].status = 'Completed'; clients[idx].completedDate = new Date().toISOString().split('T')[0]; }
        setData('clients', clients);
        logActivity('client', 'Progress updated for ' + clients[idx].name + ': ' + val + '%');
        renderClients(); updateDashboard();
        const btn = event.currentTarget; btn.textContent = '✓ Saved!';
        setTimeout(() => btn.textContent = 'Save Progress', 1500);
      }
    }
    function showDelForm(clientId) {
      document.getElementById('del-form-' + clientId).style.display = 'block';
      ['dn','dd','du'].forEach(p => { const e = document.getElementById(p+'-'+clientId); if(e) e.value=''; });
      document.getElementById('dn-' + clientId)?.focus();
    }
    // Upload a file via the helpcenter-backend /api/upload route. Returns the
    // public URL on success, "" on failure (status text shows the error).
    // When the owner picks a saved Business File doc from the deliverable form:
    // pre-fill name + description AND upload the doc as an HTML file so the
    // client can open it from the portal as a real shareable link (not just
    // text). For receipts, contracts, proposals — the styled HTML keeps the
    // formatting (signatures, dividers, dollar amounts) intact.
    async function _pickFromBusinessFile(clientId, docId) {
      if (!docId) return;
      const doc = (getData('businessFile')||[]).find(d => d.id === docId);
      if (!doc) return;
      const nameEl = document.getElementById('dn-' + clientId);
      const descEl = document.getElementById('dd-' + clientId);
      const urlEl  = document.getElementById('du-' + clientId);
      const status = document.getElementById('df-status-' + clientId);
      if (nameEl && !nameEl.value) nameEl.value = (doc.type||'Document') + ' — ' + (doc.title||'');
      if (descEl && !descEl.value) descEl.value = 'From your Business File · ' + new Date(doc.createdAt).toLocaleDateString();
      if (status) status.innerHTML = '<span style="color:#3B82F6">⏳ Uploading "' + (doc.title||doc.type||'document').replace(/</g,'&lt;') + '" to portal storage…</span>';
      // Wrap the doc text in a print-friendly HTML page
      const settings = JSON.parse(localStorage.getItem('settings') || '{}');
      const ownerName = settings.name || 'Joy Watford';
      const biz = settings.businessName || 'H.E.L.P. Center';
      const safeText = (doc.content || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      const safeTitle = (doc.title || doc.type || 'Document').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
      const html = '<!doctype html><html><head><meta charset="utf-8"><title>' + safeTitle + ' — ' + biz + '</title>' +
        '<style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;background:#F1F5F9;margin:0;padding:32px;color:#0F172A;line-height:1.6}.doc{max-width:780px;margin:auto;background:#fff;border-radius:14px;box-shadow:0 4px 20px rgba(15,23,42,0.08);padding:48px 56px}.brand{font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:#64748B;margin-bottom:6px}.title{font-size:22px;font-weight:700;color:#0F172A;margin:0 0 24px;border-bottom:2px solid #E2E8F0;padding-bottom:14px}pre{font-family:Consolas,"Courier New",monospace;font-size:13px;line-height:1.7;white-space:pre-wrap;word-wrap:break-word;color:#0F172A;margin:0}.footer{margin-top:32px;padding-top:18px;border-top:1px solid #E2E8F0;font-size:12px;color:#94A3B8;text-align:center}@media print{body{background:#fff;padding:0}.doc{box-shadow:none;border-radius:0;padding:24px}}</style>' +
        '</head><body><div class="doc"><div class="brand">' + biz + '</div><h1 class="title">' + safeTitle + '</h1><pre>' + safeText + '</pre><div class="footer">' + biz + ' · ' + (settings.email || 'joy@thehelpctr.com') + ' · Generated ' + new Date(doc.createdAt).toLocaleDateString('en-US',{dateStyle:'long'}) + '</div></div></body></html>';
      // Upload to /api/upload via the helpcenter-backend
      try {
        const apiBase = (typeof API_BASE !== 'undefined' && API_BASE) ? API_BASE : (window.location.origin || 'https://thehelpctr.com');
        const safeFilename = (doc.title || doc.type || 'document').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 60) + '.html';
        const fd = new FormData();
        fd.append('file', new Blob([html], { type: 'text/html' }), safeFilename);
        const r = await fetch(apiBase + '/api/upload', { method: 'POST', body: fd });
        if (!r.ok) throw new Error('Upload failed: HTTP ' + r.status);
        const j = await r.json();
        const uploadedUrl = j.url || j.path || (apiBase + (j.file || ''));
        if (urlEl) urlEl.value = uploadedUrl;
        if (status) status.innerHTML = '<span style="color:#10B981">✓ Uploaded — link ready. Click <strong>Add</strong> to attach as a deliverable. (Client opens at: <a href="' + uploadedUrl + '" target="_blank" style="color:var(--brand-primary)">' + uploadedUrl + '</a>)</span>';
      } catch (e) {
        // Fallback to inline data URL — still works but ugly
        if (status) status.innerHTML = '<span style="color:#F59E0B">⚠ Upload failed (' + e.message + ') — using inline link instead.</span>';
        if (urlEl) urlEl.value = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
      }
    }

    async function handleDeliverableFileUpload(clientId, inputEl) {
      const status = document.getElementById('df-status-' + clientId);
      const urlInput = document.getElementById('du-' + clientId);
      if (!inputEl.files || !inputEl.files[0]) return;
      const f = inputEl.files[0];
      if (status) status.textContent = '⏳ Uploading ' + f.name + ' (' + Math.round(f.size/1024) + ' KB)…';
      const fd = new FormData();
      // Put clientId FIRST so multer's destination callback sees it before
      // the file (multer reads multipart fields sequentially).
      fd.append('clientId', clientId);
      fd.append('file', f);
      try {
        // ALSO pass via URL query — bullet-proof against any ordering issue.
        const r = await fetch(HC_BACKEND + '/api/upload?clientId=' + encodeURIComponent(clientId), { method:'POST', body: fd });
        if (!r.ok) {
          const e = await r.json().catch(()=>({}));
          throw new Error(e.error || ('HTTP ' + r.status));
        }
        const d = await r.json();
        if (urlInput) urlInput.value = d.url;
        // Pre-fill name if empty
        const nameInput = document.getElementById('dn-' + clientId);
        if (nameInput && !nameInput.value.trim()) nameInput.value = f.name.replace(/\.[^.]+$/,'');
        if (status) status.innerHTML = '<span style="color:#10B981">✓ Uploaded — URL filled in below</span>';
      } catch (e) {
        if (status) status.innerHTML = '<span style="color:var(--error)">⚠️ Upload failed: ' + e.message + '</span>';
      }
    }

    async function addDeliverable(clientId) {
      const name = document.getElementById('dn-' + clientId).value.trim();
      if (!name) { alert('Name required.'); return; }
      const clients = getData('clients');
      const idx = clients.findIndex(c => c.id === clientId);
      if (idx > -1) {
        const d = { id: generateId(), name, description: document.getElementById('dd-'+clientId).value.trim(), url: document.getElementById('du-'+clientId).value.trim(), dateAdded: new Date().toISOString().split('T')[0] };
        clients[idx].deliverables = clients[idx].deliverables || [];
        clients[idx].deliverables.push(d);
        setData('clients', clients);
        logActivity('client', 'Deliverable added for ' + clients[idx].name + ': ' + name);
        // Force-push the portal snapshot RIGHT AWAY (don't wait for the
        // 1.5s schedulePortalSync timer) so the client's next page load
        // sees the new deliverable.
        if (typeof pbPushPortalSnapshot === 'function') {
          try { pbPushPortalSnapshot(clients[idx]); } catch(e){}
        }
        showToast('✓ Deliverable added — visible in client portal now', 'success');
        const list = document.getElementById('del-list-' + clientId);
        if (list) list.innerHTML += `<div style="display:flex;justify-content:space-between;align-items:start;padding:12px;border:1px solid var(--gray-200);border-radius:8px;margin-bottom:8px"><div><div style="font-weight:600;font-size:14px">${d.name}</div><div style="font-size:13px;color:var(--gray-500)">${d.description}</div>${d.url?`<a href="${d.url}" target="_blank" style="font-size:13px;color:var(--accent)">Open Link →</a>`:''}</div><button onclick="removeDeliverable('${clientId}','${d.id}')" style="background:none;border:none;cursor:pointer;color:var(--error);font-size:20px;padding:0 4px;line-height:1">×</button></div>`;
        document.getElementById('del-form-' + clientId).style.display = 'none';
        // Auto-email client if checkbox is on
        const wantEmail = document.getElementById('dem-' + clientId)?.checked;
        if (wantEmail) {
          await sendPortalNotificationEmail(clients[idx], {
            subject: 'New deliverable available — ' + name,
            heading: 'A new deliverable is ready for you',
            body: 'I just added <strong>' + escapeHtml(name) + '</strong> to your portal' + (d.url ? '.' : '.') + (d.description?'<br><br>'+escapeHtml(d.description):''),
            ctaLabel: 'Review in Portal'
          });
        }
        renderClients();
      }
    }

    function escapeHtml(s) {
      return (s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }
    function removeDeliverable(clientId, delId) {
      if (!confirm('Remove this deliverable?')) return;
      const clients = getData('clients');
      const idx = clients.findIndex(c => c.id === clientId);
      if (idx > -1) { clients[idx].deliverables = clients[idx].deliverables.filter(d => d.id !== delId); setData('clients', clients); }
      closeModal('client-detail-modal');
      openClientDetail(clientId);
    }
    function markPaid(clientId) {
      const clients = getData('clients');
      const idx = clients.findIndex(c => c.id === clientId);
      if (idx > -1) {
        clients[idx].paid = true; clients[idx].paidDate = new Date().toISOString().split('T')[0];
        setData('clients', clients);
        const revenue = getData('revenue');
        const ri = revenue.findIndex(r => r.clientId === clientId);
        if (ri > -1) { revenue[ri].status = 'Paid'; revenue[ri].date = clients[idx].paidDate; setData('revenue', revenue); }
        logActivity('revenue', 'Payment received from ' + clients[idx].name + ': $' + clients[idx].price);
        const amt = '$' + Number(clients[idx].price || 0).toLocaleString();
        _showLiveNotification('✅ Payment received: ' + amt, 'from ' + (clients[idx].name || 'a client'), () => openClientDetail(clientId));
        _sendNotifEmail(
          '✅ Payment received: ' + amt + ' — ' + (clients[idx].name || 'client'),
          `<p>Payment recorded.</p>
           <ul style="line-height:1.7">
             <li><strong>Client:</strong> ${clients[idx].name || '(unknown)'}</li>
             <li><strong>Amount:</strong> ${amt}</li>
             <li><strong>Date:</strong> ${clients[idx].paidDate}</li>
           </ul>`
        );
      }
      closeModal('client-detail-modal'); openClientDetail(clientId);
      renderClients(); updateDashboard();
    }
    function markUnpaid(clientId) {
      const clients = getData('clients');
      const idx = clients.findIndex(c => c.id === clientId);
      if (idx > -1) { clients[idx].paid = false; clients[idx].paidDate = ''; setData('clients', clients); }
      closeModal('client-detail-modal'); openClientDetail(clientId);
      renderClients(); updateDashboard();
    }

    // ── INVOICE HELPERS ──────────────────────────────────────────────────
    function nextMonthFirst() {
      const d = new Date();
      return new Date(d.getFullYear(), d.getMonth() + 1, 1).toISOString().split('T')[0];
    }

    function updateInvoiceDate(clientId, invoiceBase, newDate) {
      const revenue = getData('revenue');
      revenue.forEach(r => {
        if (r.clientId === clientId && r.invoiceNumber.replace(/-\d+$/,'') === invoiceBase) {
          r.date = newDate;
        }
      });
      setData('revenue', revenue);
      showToast('Invoice date updated', 'success');
      renderClients(); updateDashboard();
    }

    function markInvoicePaid(clientId, invoiceBase) {
      const revenue = getData('revenue');
      const today = new Date().toISOString().split('T')[0];
      let total = 0;
      revenue.forEach(r => {
        if (r.clientId === clientId && r.invoiceNumber.replace(/-\d+$/,'') === invoiceBase) {
          if (r.status !== 'Paid') total += Number(r.amount || 0);
          r.status = 'Paid'; r.paidDate = today;
        }
      });
      setData('revenue', revenue);
      // Also mark client.paid if this is their primary invoice
      const clients = getData('clients');
      const ci = clients.findIndex(c => c.id === clientId);
      if (ci > -1 && clients[ci].invoiceNumber === invoiceBase) {
        clients[ci].paid = true; clients[ci].paidDate = today;
        setData('clients', clients);
      }
      const clientName = (ci > -1 ? clients[ci].name : '') || 'client';
      const amt = '$' + total.toLocaleString();
      _showLiveNotification('✅ Invoice ' + invoiceBase + ' paid: ' + amt, 'from ' + clientName, () => openClientDetail(clientId));
      _sendNotifEmail(
        '✅ Invoice ' + invoiceBase + ' paid: ' + amt + ' — ' + clientName,
        `<p>Invoice <strong>${invoiceBase}</strong> marked paid.</p>
         <ul style="line-height:1.7">
           <li><strong>Client:</strong> ${clientName}</li>
           <li><strong>Amount:</strong> ${amt}</li>
           <li><strong>Date:</strong> ${today}</li>
         </ul>`
      );
      closeModal('client-detail-modal'); openClientDetail(clientId);
      renderClients(); updateDashboard();
      showToast('Invoice marked as paid ✓', 'success');
    }

    function markInvoiceUnpaid(clientId, invoiceBase) {
      const revenue = getData('revenue');
      revenue.forEach(r => {
        if (r.clientId === clientId && r.invoiceNumber.replace(/-\d+$/,'') === invoiceBase) {
          r.status = 'Pending'; r.paidDate = '';
        }
      });
      setData('revenue', revenue);
      const clients = getData('clients');
      const ci = clients.findIndex(c => c.id === clientId);
      if (ci > -1 && clients[ci].invoiceNumber === invoiceBase) {
        clients[ci].paid = false; clients[ci].paidDate = '';
        setData('clients', clients);
      }
      closeModal('client-detail-modal'); openClientDetail(clientId);
      renderClients(); updateDashboard();
    }

    // Generate a one-line invoice for a single service. Useful when flat
    // fee should be invoiced separately from monthly recurring services.
    // Also auto-pushes a friendly receipt-style document to the client portal.
    function billSingleService(clientId, serviceIdx) {
      const clients = getData('clients');
      const client = clients.find(c => c.id === clientId);
      if (!client) return;
      const service = (client.services || [])[serviceIdx];
      if (!service) { alert('Service not found.'); return; }
      const today = new Date().toISOString().slice(0,10);
      const dateInput = prompt('Invoice date (YYYY-MM-DD):', today);
      if (!dateInput) return;
      const invDate = /^\d{4}-\d{2}-\d{2}$/.test(dateInput) ? dateInput : today;
      const revenue = getData('revenue');
      // Build a unique invoice number for this single-service bill
      const baseInv = client.invoiceNumber || ('INV-' + String(clients.findIndex(c => c.id === clientId)+1).padStart(3,'0'));
      const tag = service.billingType === 'ongoing' ? '-M' + invDate.slice(0,7).replace('-','') : '-S' + (serviceIdx+1);
      const newInv = baseInv + tag;
      // Skip if an invoice with this exact number already exists
      if (revenue.some(r => r.invoiceNumber === newInv)) {
        alert('An invoice already exists with number ' + newInv + '. Edit or delete the existing one first.');
        return;
      }
      revenue.push({
        id: generateId(),
        clientId, clientName: client.name,
        amount: service.price, date: invDate, status: 'Pending',
        serviceType: service.name, invoiceNumber: newInv,
        billingType: service.billingType || 'flat',
        billingPeriod: service.billingType === 'ongoing' ? invDate.slice(0,7) : null,
        paidBy: service.paidBy || 'owner',
        isFirstInvoice: false,
        singleServiceInvoice: true
      });
      setData('revenue', revenue);
      // Auto-generate the receipt-style invoice document and push to portal
      const settings = JSON.parse(localStorage.getItem('settings') || '{}');
      const ownerName = settings.name || 'Joy Watford';
      const ownerBiz = settings.businessName || 'H.E.L.P. Center';
      const ownerEmail = settings.email || 'joy@thehelpctr.com';
      const docContent = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${ownerBiz.toUpperCase()} — INVOICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Invoice #: ${newInv}
Date: ${new Date(invDate).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}
Status: PENDING

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BILL TO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${client.name}${client.businessName ? '\n'+client.businessName : ''}${client.email ? '\n'+client.email : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SERVICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${service.name}
${service.billingType === 'ongoing' ? 'Recurring Monthly · '+invDate.slice(0,7) : 'One-time fee'}

Amount: $${(service.price||0).toLocaleString('en-US',{minimumFractionDigits:2})}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL DUE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
$${(service.price||0).toLocaleString('en-US',{minimumFractionDigits:2})}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAYMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pay via your portal — Stripe checkout (credit/debit card).
Portal: see your private link.

Other methods accepted: Zelle · PayPal · Venmo · CashApp · Cash

Questions? Reply to this invoice in your portal or email ${ownerEmail}.

— ${ownerName}
${ownerBiz}`;
      saveToBusinessFile({
        type: 'Invoice',
        title: newInv + ' — ' + service.name + ' (' + client.name + ')',
        content: docContent,
        clientId, clientName: client.name
      });
      closeModal('client-detail-modal'); openClientDetail(clientId);
      renderClients(); updateDashboard();
      showToast('✓ Invoice ' + newInv + ' created · Saved to Business File · Pushed to portal', 'success');
    }

    function generateMonthlyInvoice(clientId) {
      const clients = getData('clients');
      const client = clients.find(c => c.id === clientId);
      if (!client) return;
      const services = (client.services || []).filter(s => s.billingType === 'ongoing' && s.paidBy !== 'owner');
      if (!services.length) { showToast('No ongoing services on this client', 'warning'); return; }
      const dateEl = document.getElementById('monthly-inv-date-' + clientId);
      const invoiceDate = dateEl?.value || nextMonthFirst();
      const billingPeriod = invoiceDate.slice(0, 7); // YYYY-MM
      const revenue = getData('revenue');
      // Check for duplicate (same client + same period)
      const alreadyExists = revenue.some(r => r.clientId === clientId && r.billingPeriod === billingPeriod && r.billingType === 'ongoing');
      if (alreadyExists) { showToast('Monthly invoice for ' + billingPeriod + ' already exists', 'warning'); return; }
      // New invoice number: base on existing count
      const clientRevCount = revenue.filter(r => r.clientId === clientId).length;
      const allClients = getData('clients');
      const clientIdx = allClients.findIndex(c => c.id === clientId);
      const baseInv = client.invoiceNumber || ('INV-' + String(clientIdx+1).padStart(3,'0'));
      const newInvBase = baseInv + '-M' + billingPeriod.replace('-','');
      services.forEach((s, i) => {
        const suffix = i === 0 ? '' : '-' + (i+1);
        revenue.push({
          id: generateId(), clientId, clientName: client.name,
          amount: s.price, date: invoiceDate, status: 'Pending',
          serviceType: s.name, invoiceNumber: newInvBase + suffix,
          billingType: 'ongoing', billingPeriod,
          isFirstInvoice: false
        });
      });
      setData('revenue', revenue);
      closeModal('client-detail-modal'); openClientDetail(clientId);
      renderClients(); updateDashboard();
      showToast('Monthly invoice generated for ' + billingPeriod + ' ✓', 'success');
    }
    // ── END INVOICE HELPERS ──────────────────────────────────────────────

    function sendOwnerMsg(clientId) {
      const inp = document.getElementById('omsg-' + clientId);
      const msg = inp?.value.trim(); if (!msg) return;
      const clients = getData('clients');
      const idx = clients.findIndex(c => c.id === clientId);
      if (idx > -1) {
        const m = { id: generateId(), from:'owner', message: msg, timestamp: new Date().toISOString(), read: true };
        clients[idx].messages.push(m); setData('clients', clients);
        inp.value = '';
        const thread = document.getElementById('msg-thread-' + clientId);
        if (thread) { thread.innerHTML += `<div style="display:flex;flex-direction:column;align-items:flex-end;margin-bottom:12px"><div class="message-bubble msg-owner">${msg}<div class="message-meta">You · Just now</div></div></div>`; thread.scrollTop = thread.scrollHeight; }
      }
    }
    // Robust clipboard helper — works on HTTP contexts where navigator.clipboard is undefined.
    function copyTextSafe(text) {
      const ok = (() => {
        try {
          if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text);
            return true;
          }
        } catch(e) {}
        // Fallback: temporary textarea + execCommand
        try {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;z-index:-1';
          document.body.appendChild(ta);
          ta.select(); ta.setSelectionRange(0, text.length);
          const success = document.execCommand('copy');
          document.body.removeChild(ta);
          return success;
        } catch(e) { return false; }
      })();
      return ok;
    }

    // Email the portal link directly to the client via the existing Resend
    // proxy on the helpcenter backend — no copy/paste needed.
    async function emailPortalLinkToClient(clientId) {
      const clients = getData('clients') || [];
      const idx = clients.findIndex(x => x.id === clientId);
      if (idx < 0) return;
      const c = clients[idx];
      if (!c.email) {
        const entered = (prompt('No email on file for ' + (c.name || 'this client') + '.\nEnter their email address to save and send the portal link:', '') || '').trim();
        if (!entered) return;
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(entered)) { alert('That doesn\'t look like a valid email — please try again.'); return; }
        c.email = entered;
        clients[idx] = c;
        setData('clients', clients);
        if (typeof renderPortalLinks === 'function') renderPortalLinks();
      }
      if (typeof sendPortalNotificationEmail !== 'function') { alert('Email helper missing.'); return; }
      const settings = JSON.parse(localStorage.getItem('settings') || '{}');
      // Use the dedicated client-facing portal.html (query-string survives email
      // clients that strip URL fragments; no work-portal sign-in screen).
      const _origin = (window.location.origin && /^https?:/.test(window.location.origin)) ? window.location.origin : 'https://thehelpctr.com';
      const portalUrl = (settings.portalShareBase || (_origin + '/portal.html')) + '?t=' + (c.portalToken || '');
      const owner = settings.name || 'Joy Watford';
      const biz = settings.businessName || 'H.E.L.P. Center';
      // Show editable preview modal so the owner sees EXACTLY what's being sent
      const escH = s => (s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      const old = document.getElementById('portal-link-overlay'); if (old) old.remove();
      const overlay = document.createElement('div');
      overlay.id = 'portal-link-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:10010;background:rgba(15,23,42,0.55);display:flex;align-items:center;justify-content:center;padding:20px';
      const defaultSubject = 'Your private portal — ' + biz;
      const defaultBody = 'Hi ' + (c.name || 'there') + ',\n\n' +
        'I have set up a private portal for our work together. You can review your documents, deliverables, invoice, and message me directly here at any time:\n\n' +
        portalUrl + '\n\n' +
        'Bookmark that link — I will send your contracts and project files to it as we go.\n\n' +
        '— ' + owner + '\n' + biz;
      overlay.innerHTML =
        '<div style="background:#fff;border-radius:14px;max-width:560px;width:100%;box-shadow:0 16px 50px rgba(0,0,0,0.25);overflow:hidden">' +
          '<div style="padding:18px 22px;border-bottom:1px solid #E2E8F0">' +
            '<h3 style="font-size:17px;font-weight:700;margin:0">Send portal link</h3>' +
            '<p style="font-size:12.5px;color:#64748B;margin:4px 0 0">For <strong>' + escH(c.name || c.businessName) + '</strong></p>' +
          '</div>' +
          '<div style="padding:16px 22px">' +
            '<label class="form-label">Send to (one or more emails — separate with commas)</label>' +
            '<input id="pl-to" class="form-input" style="margin:0 0 12px" value="' + escH(c.email) + '" placeholder="email1@example.com, email2@example.com">' +
            '<p style="font-size:11.5px;color:#64748B;margin:-8px 0 12px"><strong>Tip:</strong> add their team member or anyone reviewing — each will receive their own copy.</p>' +
            '<label class="form-label">Subject</label>' +
            '<input id="pl-subj" class="form-input" style="margin:0 0 12px" value="' + escH(defaultSubject) + '">' +
            '<label class="form-label">Message (preview of what they\'ll receive)</label>' +
            '<textarea id="pl-body" class="form-input" style="margin:0;min-height:200px;resize:vertical;font-family:inherit;line-height:1.55">' + escH(defaultBody) + '</textarea>' +
            '<p style="font-size:11.5px;color:#64748B;margin:8px 0 0">Each recipient gets the same message plus an "Open Your Portal" button. URL: <code style="background:#F1F5F9;padding:1px 5px;border-radius:4px;font-size:11px">' + escH(portalUrl) + '</code></p>' +
          '</div>' +
          '<div style="padding:12px 22px;border-top:1px solid #E2E8F0;background:#F8FAFC;display:flex;justify-content:flex-end;gap:8px">' +
            '<button onclick="document.getElementById(\'portal-link-overlay\').remove()" class="btn btn-outline" style="padding:8px 16px">Cancel</button>' +
            '<button onclick="_doSendPortalLink(\'' + c.id + '\')" id="pl-send-btn" class="btn btn-solid" style="padding:8px 16px">Send Email</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(overlay);
    }
    async function _doSendPortalLink(clientId) {
      const c = (getData('clients') || []).find(x => x.id === clientId);
      if (!c) return;
      const toRaw = (document.getElementById('pl-to')?.value || '').trim();
      const subject = (document.getElementById('pl-subj')?.value || '').trim();
      const bodyText = (document.getElementById('pl-body')?.value || '').trim();
      if (!toRaw) { alert('Enter at least one recipient email.'); return; }
      if (!subject || !bodyText) { alert('Subject and message are required.'); return; }
      // Parse comma/semicolon/whitespace-separated emails
      const recipients = toRaw.split(/[,;\s]+/).map(s => s.trim()).filter(Boolean);
      const valid = recipients.filter(e => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e));
      const invalid = recipients.filter(e => !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e));
      if (!valid.length) { alert('No valid email addresses found. Format: name@example.com'); return; }
      if (invalid.length && !confirm('Skip these invalid addresses?\n\n' + invalid.join('\n') + '\n\nProceed sending to ' + valid.length + ' valid recipient(s)?')) return;
      const btn = document.getElementById('pl-send-btn');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending to ' + valid.length + '…'; }
      const settings = JSON.parse(localStorage.getItem('settings') || '{}');
      // Use the dedicated client-facing portal.html (query-string survives email
      // clients that strip URL fragments; no work-portal sign-in screen).
      const _origin = (window.location.origin && /^https?:/.test(window.location.origin)) ? window.location.origin : 'https://thehelpctr.com';
      const portalUrl = (settings.portalShareBase || (_origin + '/portal.html')) + '?t=' + (c.portalToken || '');
      const bodyHtml = bodyText.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\n/g,'<br>').replace(/(https?:\/\/\S+)/g,'<a href="$1" style="color:#1E5BC0;font-weight:600">$1</a>');
      let successCount = 0, failed = [];
      for (const email of valid) {
        // Build a per-recipient client clone so sendPortalNotificationEmail
        // routes to the right address
        const clientCopy = { ...c, email };
        const result = await sendPortalNotificationEmail(clientCopy, { subject, body: bodyHtml, portalUrl });
        if (result && result.ok) successCount++;
        else failed.push(email + (result && result.error ? ' (' + result.error + ')' : ''));
      }
      if (btn) { btn.disabled = false; btn.textContent = 'Send Email'; }
      if (successCount > 0) {
        document.getElementById('portal-link-overlay').remove();
        const msg = successCount === valid.length
          ? '✓ Sent to ' + successCount + ' recipient(s)'
          : '⚠ Sent to ' + successCount + ' of ' + valid.length + ' (failed: ' + failed.length + ')';
        showToast(msg, successCount === valid.length ? 'success' : 'warn');
        logActivity('email', 'Portal link emailed to ' + successCount + ' recipient(s) for ' + (c.name || c.businessName));
      }
      if (failed.length) {
        alert('Failed to send to:\n' + failed.join('\n'));
      }
    }

    // Re-notify the client that their portal has been updated. Lightweight
    // modal so the operator can customize subject + message before sending.
    function sendPortalUpdateEmail(clientId) {
      const clients = getData('clients') || [];
      const idx = clients.findIndex(x => x.id === clientId);
      if (idx < 0) return;
      const c = clients[idx];
      if (!c.email) {
        const entered = (prompt('No email on file for ' + (c.name || 'this client') + '.\nEnter their email address to save and continue:', '') || '').trim();
        if (!entered) return;
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(entered)) { alert('That doesn\'t look like a valid email — please try again.'); return; }
        c.email = entered;
        clients[idx] = c;
        setData('clients', clients);
        if (typeof renderPortalLinks === 'function') renderPortalLinks();
      }
      const settings = JSON.parse(localStorage.getItem('settings') || '{}');
      // Use the dedicated client-facing portal.html (query-string survives email
      // clients that strip URL fragments; no work-portal sign-in screen).
      const _origin = (window.location.origin && /^https?:/.test(window.location.origin)) ? window.location.origin : 'https://thehelpctr.com';
      const portalUrl = (settings.portalShareBase || (_origin + '/portal.html')) + '?t=' + (c.portalToken || '');
      const biz = settings.businessName || 'H.E.L.P. Center';
      const owner = settings.name || 'Joy Watford';
      const old = document.getElementById('portal-update-overlay'); if (old) old.remove();
      const overlay = document.createElement('div');
      overlay.id = 'portal-update-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(15,23,42,0.55);display:flex;align-items:center;justify-content:center;padding:20px';
      const escH = s => (s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      overlay.innerHTML =
        '<div style="background:#fff;border-radius:14px;max-width:520px;width:100%;box-shadow:0 16px 50px rgba(0,0,0,0.25);overflow:hidden">' +
          '<div style="padding:18px 22px;border-bottom:1px solid #E2E8F0">' +
            '<h3 style="font-size:17px;font-weight:700;margin:0">Send portal update</h3>' +
            '<p style="font-size:12.5px;color:#64748B;margin:4px 0 0">To <strong>' + escH(c.name || c.businessName) + '</strong> &lt;' + escH(c.email) + '&gt;</p>' +
          '</div>' +
          '<div style="padding:16px 22px">' +
            '<label class="form-label">Subject</label><input id="pu-subj" class="form-input" style="margin:0 0 12px" value="Update on your portal — ' + escH(biz) + '">' +
            '<label class="form-label">Message</label>' +
            '<textarea id="pu-body" class="form-input" style="margin:0;min-height:140px;resize:vertical;font-family:inherit;line-height:1.55">Hi ' + escH(c.name || 'there') + ',\n\nI have just updated your private portal — there are new items waiting for your review. Click the link below to see what is new:\n\n' + portalUrl + '\n\nLet me know if you have any questions.\n\n— ' + escH(owner) + '</textarea>' +
          '</div>' +
          '<div style="padding:12px 22px;border-top:1px solid #E2E8F0;background:#F8FAFC;display:flex;justify-content:flex-end;gap:8px">' +
            '<button onclick="document.getElementById(\'portal-update-overlay\').remove()" class="btn btn-outline" style="padding:8px 16px">Cancel</button>' +
            '<button onclick="_doSendPortalUpdate(\'' + c.id + '\')" id="pu-send-btn" class="btn btn-solid" style="padding:8px 16px">Send Update</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(overlay);
    }
    async function _doSendPortalUpdate(clientId) {
      const clients = getData('clients') || [];
      const c = clients.find(x => x.id === clientId);
      if (!c) return;
      const subject = document.getElementById('pu-subj')?.value.trim() || 'Update on your portal';
      const bodyText = document.getElementById('pu-body')?.value.trim() || '';
      const body = bodyText.replace(/\n/g, '<br>').replace(/(https?:\/\/\S+)/g, '<a href="$1" style="color:#1E5BC0;font-weight:600">$1</a>');
      const settings = JSON.parse(localStorage.getItem('settings') || '{}');
      // Use the dedicated client-facing portal.html (query-string survives email
      // clients that strip URL fragments; no work-portal sign-in screen).
      const _origin = (window.location.origin && /^https?:/.test(window.location.origin)) ? window.location.origin : 'https://thehelpctr.com';
      const portalUrl = (settings.portalShareBase || (_origin + '/portal.html')) + '?t=' + (c.portalToken || '');
      const btn = document.getElementById('pu-send-btn');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      const result = await sendPortalNotificationEmail(c, { subject, title: subject, body, portalUrl });
      const overlay = document.getElementById('portal-update-overlay');
      if (result && result.ok) {
        if (overlay) overlay.remove();
        showToast('Update sent to ' + c.email, 'success');
        logActivity('email', 'Portal-update email to ' + (c.name || c.businessName));
      } else {
        showToast('Send failed: ' + ((result && result.error) || 'unknown'), 'error');
        if (btn) { btn.disabled = false; btn.textContent = 'Send Update'; }
      }
    }

    function copyPortalLink(clientId) {
      const inp = document.getElementById('pl-' + clientId);
      if (!inp) return;
      const ok = copyTextSafe(inp.value);
      const c = document.getElementById('pl-confirm-' + clientId);
      if (c) {
        c.textContent = ok ? '✓ Copied to clipboard' : '⚠️ Copy failed — long-press the link to copy manually';
        c.style.color = ok ? '#10B981' : '#F59E0B';
        c.style.display='block';
        setTimeout(()=>c.style.display='none', 3500);
      }
      if (!ok) { inp.focus(); inp.select(); }
    }

    // ── CLIENT PORTAL LINKS PAGE ───────────────────────────────────

    // ══════════════════════════════════════════════════════════════
    // AI INTEGRATION
    // ══════════════════════════════════════════════════════════════

    function buildSystemPrompt() {
      const s = JSON.parse(localStorage.getItem('settings')) || DEFAULT_SETTINGS;
      const name = s.name || DEFAULT_SETTINGS.name;
      const biz  = s.businessName || DEFAULT_SETTINGS.businessName;
      const tag  = s.tagline || DEFAULT_SETTINGS.tagline;
      const loc  = s.address || DEFAULT_SETTINGS.address;
      const ai   = JSON.parse(localStorage.getItem('aiSettings')) || {};
      const custom = (ai.systemPrompt || '').trim();
      if (custom) return custom;
      return `You are the expert AI Coach for ${biz}${tag?' ('+tag+')':''}, founded by ${name}${loc?' in '+loc:''}. You are a world-class business consultant, financial strategist, career coach, and life advisor — all in one.

## SCOPING FIRST — DEFAULT TO QUESTIONS WHEN INPUT IS VAGUE
Before producing a long answer, decide: did the user give you enough context to answer well?
- Inputs of 1–4 words ("the portal", "credit", "marketing", "my business"), one-line questions without specifics, or topic-only mentions = NOT enough context. Do NOT launch into a long step-by-step.
- Instead, respond with a SHORT acknowledgement (1–2 sentences) followed by 3–5 SPECIFIC clarifying questions to scope what the user actually needs. Number the questions. End with: "Pick the ones that fit and tell me, or paste any details you already have."
- Only produce the comprehensive expert answer AFTER the user gives you scoping details (target audience, goal, budget, timeline, current state, specific scenario, etc.).
- Exception: if the user types something like "give me everything", "go deep", "full breakdown", "show me how to build X step by step" — they explicitly want the long form, so deliver it.

## RESPONSE QUALITY STANDARDS (once scoped)
- Give DETAILED, comprehensive, expert-level answers proportionate to what was asked.
- Structure responses with clear headers, numbered steps, bullets where helpful.
- Include SPECIFIC details: exact dollar amounts, real platform names, realistic timelines, step-by-step instructions.
- Write at the level of a $500/hour consultant who has actually built businesses, repaired credit, launched programs, and grown audiences.
- When asked how to do something — SHOW them exactly how, step by step, with examples.
- Never say "it depends" without immediately explaining exactly what it depends on and giving concrete guidance for each scenario.
- Always complete your full answer. Never truncate. If a topic has 8 steps, give all 8 steps.

## YOUR EXPERTISE AREAS
1. **Business Development**: LLC/Corp formation, business plans, revenue models, pricing strategy, client acquisition, marketing funnels, brand building, scaling, franchising, passive income, holding companies
2. **Credit & Finance**: Reading credit reports (Equifax/Experian/TransUnion), dispute letters, debt payoff strategies (avalanche/snowball), business credit (DUNS, net-30 accounts, Tier 1/2/3), funding options, SBA loans, grants
3. **Career Advancement**: Resume writing with ATS optimization, interview preparation, salary negotiation scripts, career pivots, professional certifications, LinkedIn strategy, networking
4. **Content & Social Media**: YouTube channel growth, TikTok algorithm, Instagram Reels, content calendars, monetization (AdSense, sponsorships, affiliates), faceless channels, podcast production
5. **Nonprofit & Programs**: 501(c)(3) formation, grant writing, program curriculum, youth leadership, after-school programs, community outreach, board development, impact measurement
6. **Communications & Marketing**: Email campaigns, press releases, fundraising appeals, sponsorship decks, donor letters, media pitches, announcement copy
7. **Mindset & Leadership**: Goal setting, 90-day planning, accountability systems, confidence, vision boarding, overcoming limiting beliefs

## COACHING STYLE
- **Direct and honest** — say exactly what the client needs to hear, not just what sounds nice
- **Specific over generic** — "Go to irs.gov/EIN and apply online (free, takes 10 minutes)" not "register your business"
- **Action-oriented** — every response ends with clear, immediate next steps numbered 1-2-3
- **Comprehensive** — if a question has multiple parts, answer every part thoroughly
- **Encouraging** — acknowledge where they are, affirm where they're going, and push them forward

${biz} clients are serious, ambitious people building real businesses and real legacies. Every answer you give should feel like premium, paid coaching that moves them forward TODAY.`;
    }
    const HELPCENTER_SYSTEM_PROMPT = buildSystemPrompt();

    const GROQ_MODELS = [
      { id:'openai/gpt-oss-120b',      label:'⭐ GPT OSS 120B — Recommended (Best for tools, deep reasoning)' },
      { id:'llama-3.3-70b-versatile',  label:'🦙 Llama 3.3 70B — Strong general chat (128K context)' },
      { id:'openai/gpt-oss-20b',       label:'⚡ GPT OSS 20B — Fastest tool-capable model' },
      { id:'llama-3.1-8b-instant',     label:'💨 Llama 3.1 8B — Fastest (simple tasks only)' },
      { id:'compound-beta',            label:'🌐 Groq Compound — Web search (experimental)' }
    ];

    // ── MODEL FALLBACK CHAIN (primary → backups in order) ────────────────────
    // System tries primary first; on decommission / tool-call failure / rate limit
    // it auto-falls forward through this list.
    const GROQ_FALLBACK_CHAIN = [
      'openai/gpt-oss-120b',
      'llama-3.3-70b-versatile',
      'openai/gpt-oss-20b',
      'llama-3.1-8b-instant'
    ];
    const GROQ_DEFAULT_MODEL = GROQ_FALLBACK_CHAIN[0];

    // Detect if an error means we should fail over to the next model.
    // Covers: model decommissioned, tool-call generation failure, rate limit, 5xx.
    function isModelDeadError(msg) {
      const m = (msg||'').toLowerCase();
      return m.includes('decommission') || m.includes('not found') ||
             m.includes('does not exist') || m.includes('no longer available') ||
             m.includes('deprecated') || m.includes('model_not_found') ||
             m.includes('invalid model') || m.includes('failed_generation') ||
             m.includes('failed to call a function') || m.includes('rate limit') ||
             m.includes('too many requests') || m.includes('overloaded') ||
             m.includes('service unavailable') || m.includes('502') ||
             m.includes('503') || m.includes('504');
    }

    // Auto-switch to the next working model in the fallback chain
    async function autoSwitchModel(deadModel, groqKey) {
      const chain = GROQ_FALLBACK_CHAIN;
      const startIdx = chain.indexOf(deadModel);
      for (let i = startIdx + 1; i < chain.length; i++) {
        const candidate = chain[i];
        try {
          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + groqKey },
            body: JSON.stringify({ model: candidate, messages: [{ role: 'user', content: 'hi' }], max_tokens: 5 })
          });
          if (res.ok || (await res.json().catch(()=>({}))).error?.code !== 'model_not_found') {
            // Save the new working model
            const s = JSON.parse(localStorage.getItem('settings')) || {};
            s.aiModel = candidate;
            localStorage.setItem('settings', JSON.stringify(s));
            const label = GROQ_MODELS.find(m => m.id === candidate)?.label || candidate;
            showToast('⚠️ Model switched to: ' + label.replace(/[🧠⚡🚀🔍💨🌐]/g,'').trim(), 6000);
            console.warn('[H.E.L.P.] Model auto-switched:', deadModel, '→', candidate);
            return candidate;
          }
        } catch(e) { continue; }
      }
      showToast('⚠️ All AI models unavailable. Check Settings.', 8000);
      return null;
    }

    // Health check — runs after login, silently tests the active model
    async function checkModelHealth() {
      const s = JSON.parse(localStorage.getItem('settings')) || {};
      const groqKey = s.groqApiKey || '';
      if (!groqKey) return; // No key, skip
      const model = s.aiModel || GROQ_DEFAULT_MODEL;
      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + groqKey },
          body: JSON.stringify({ model, messages: [{ role: 'user', content: 'hi' }], max_tokens: 5 })
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          if (isModelDeadError(err?.error?.message || '')) {
            console.warn('[H.E.L.P.] Health check: model decommissioned —', model);
            await autoSwitchModel(model, groqKey);
          }
        }
      } catch(e) { /* network error, skip silently */ }
    }
    const OPENAI_MODELS = [
      { id:'gpt-4o-mini', label:'GPT-4o Mini — Fast & Affordable' },
      { id:'gpt-4o', label:'GPT-4o — Most Capable' }
    ];
    const CLAUDE_MODELS = [
      { id:'claude-sonnet-4-6', label:'Claude Sonnet 4.6 — Recommended (Latest)' },
      { id:'claude-opus-4-7', label:'Claude Opus 4.7 — Most Powerful' },
      { id:'claude-haiku-4-5-20251001', label:'Claude Haiku 4.5 — Fast & Efficient' }
    ];

    // ── BACKEND API BASE ──────────────────────────────────────────────────────
    // Same auto-detect logic as HC_BACKEND — keeps API calls same-origin
    // when served from https://thehelpctr.com so nginx handles the proxy.
    const API_BASE = (function(){
      try {
        const o = window.location.origin;
        if (o && /^https?:\/\//.test(o) && !/file:|^null$/.test(o)) return o;
      } catch (e) {}
      return 'http://187.124.146.184:3001';
    })();

    function getAiSettings() {
      const s = JSON.parse(localStorage.getItem('settings')) || {};
      return { provider: s.aiProvider||'groq', model: s.aiModel||'llama-3.3-70b-versatile', coachName: s.aiCoachName||'H.E.L.P. AI Coach' };
    }

    // Strip reasoning model <think>...</think> chain-of-thought tags from output
    function cleanGroqResponse(text) {
      return (text || '').replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    }

    // Stream Gemini 2.5 Flash for any AI generator. Shared by every callsite
    // that previously hit Groq directly (deep dives, brand wizard, business
    // tools, 10x apply, etc.) so they all benefit from Gemini's higher daily
    // cap + 1M-token context. Returns the final text on success, or null when
    // there's no Gemini key configured / call failed — caller falls back to
    // Groq in that case.
    async function _aiStreamGeminiOrNull(messages, onTextChunk, opts) {
      opts = opts || {};
      const cfg = JSON.parse(localStorage.getItem('settings') || '{}');
      const geminiKey = cfg.geminiApiKey || '';
      if (!geminiKey) return null;
      try {
        let systemInstruction = null;
        const contents = [];
        for (const m of (messages || [])) {
          if (m.role === 'system') { systemInstruction = { parts: [{ text: m.content }] }; continue; }
          contents.push({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: String(m.content || '') }] });
        }
        const body = {
          contents,
          generationConfig: {
            temperature: opts.temperature == null ? 0.4 : opts.temperature,
            maxOutputTokens: opts.maxTokens || 4096
          }
        };
        if (systemInstruction) body.systemInstruction = systemInstruction;
        const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': geminiKey },
          body: JSON.stringify(body)
        });
        if (!r.ok) {
          const t = await r.text().catch(() => '');
          console.warn('[aiStreamGemini] HTTP ' + r.status + ': ' + t.slice(0, 200) + ' — falling back to Groq');
          return null;
        }
        const reader = r.body.getReader(), dec = new TextDecoder();
        let full = '', sseBuffer = '';
        const handle = (line) => {
          if (!line.startsWith('data: ')) return;
          const d = line.slice(6);
          try {
            const ev = JSON.parse(d);
            const dt = ev.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';
            if (dt) { full += dt; if (onTextChunk) onTextChunk(dt, full); }
          } catch {}
        };
        while (true) {
          const { done, value } = await reader.read();
          if (done) { if (sseBuffer) handle(sseBuffer); break; }
          sseBuffer += dec.decode(value, { stream: true });
          const lines = sseBuffer.split('\n');
          sseBuffer = lines.pop() || '';
          for (const line of lines) handle(line);
        }
        return full || null;
      } catch (e) {
        console.warn('[aiStreamGemini] error — falling back to Groq:', e.message);
        return null;
      }
    }

    // Render markdown to styled HTML using marked.js
    function mdRender(text) {
      const clean = cleanGroqResponse(text || '');
      let html = null;
      if (typeof marked !== 'undefined') {
        try {
          marked.setOptions({ breaks: true, gfm: true });
          html = marked.parse(clean);
        } catch(e) { html = null; }
      }
      if (html == null) {
        html = clean.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
      }
      // Page-break marker → a divider that is VISIBLE on screen (so the user can
      // see the document and its trailing notes are separated) AND forces a real
      // new sheet in Word/print. Lenient about how the AI writes the marker:
      // [[PAGEBREAK]], {{PAGE BREAK}}, <PAGEBREAK>, ---PAGEBREAK---, or a lone line.
      // Lets AI projects (e.g. Legal Shield) keep the clean document up front and
      // push completion/modification notes onto later pages.
      const PB = '<div class="pagebreak" style="page-break-before:always;break-before:page;margin:22px 0;border-top:2px dashed #CBD5E1;padding-top:7px;text-align:center;font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:#94A3B8">— new page —</div>';
      return html
        // a lone marker line that marked wrapped in its own <p>…</p>
        .replace(/<p>\s*[-*=_ ]*\[?\[?\{?\{?<?\s*page\s*[-_ ]?break\s*>?\}?\}?\]?\]?[-*=_ ]*\s*<\/p>/gi, PB)
        // bracketed / angled marker appearing inline anywhere
        .replace(/[\[\{<]{1,2}\s*page\s*[-_ ]?break\s*[\]\}>]{1,2}/gi, PB);
    }

    // ── Claude (Anthropic) direct, browser-streamed. Returns text or null. ──────
    async function _aiStreamClaude(messages, onChunk, apiKey, model) {
      if (!apiKey) return null;
      try {
        let system = ''; const msgs = [];
        for (const m of (messages || [])) {
          if (m.role === 'system') { system += (system ? '\n\n' : '') + (m.content || ''); continue; }
          msgs.push({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content || '') });
        }
        // Map the dropdown choice to a stable Anthropic alias so a tenant's key
        // always resolves (speculative dated IDs can 404 on some accounts).
        const mdl = /opus/i.test(model||'') ? 'claude-3-opus-latest'
                  : /haiku/i.test(model||'') ? 'claude-3-5-haiku-latest'
                  : 'claude-3-5-sonnet-latest';
        const resp = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
          body: JSON.stringify({ model: mdl, max_tokens: 4096, system: system || undefined, messages: msgs, stream: true })
        });
        if (!resp.ok) { const t = await resp.text().catch(()=> ''); console.warn('[claude] HTTP', resp.status, t.slice(0,200)); return null; }
        const reader = resp.body.getReader(), dec = new TextDecoder(); let full = '', buf = '';
        const handle = (line) => {
          if (!line.startsWith('data: ')) return; const d = line.slice(6); if (d === '[DONE]') return;
          try { const ev = JSON.parse(d); if (ev.type === 'content_block_delta' && ev.delta && ev.delta.text) { full += ev.delta.text; if (onChunk) onChunk(ev.delta.text, full); } } catch {}
        };
        while (true) { const { done, value } = await reader.read(); if (done) { if (buf) handle(buf); break; } buf += dec.decode(value, { stream: true }); const lines = buf.split('\n'); buf = lines.pop() || ''; for (const l of lines) handle(l); }
        return full ? cleanGroqResponse(full) : null;
      } catch (e) { console.warn('[claude] error', e.message); return null; }
    }

    // ── OpenAI direct, browser-streamed. Returns text or null. ──────────────────
    async function _aiStreamOpenAI(messages, onChunk, apiKey, model) {
      if (!apiKey) return null;
      try {
        const mdl = (model && /^(gpt|o\d|chatgpt)/i.test(model)) ? model : 'gpt-4o-mini';
        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
          body: JSON.stringify({ model: mdl, messages: (messages || []).map(m => ({ role: m.role, content: String(m.content || '') })), max_tokens: 4096, temperature: 0.4, stream: true })
        });
        if (!resp.ok) { const t = await resp.text().catch(()=> ''); console.warn('[openai] HTTP', resp.status, t.slice(0,200)); return null; }
        const reader = resp.body.getReader(), dec = new TextDecoder(); let full = '', buf = '';
        const handle = (line) => {
          if (!line.startsWith('data: ')) return; const d = line.slice(6); if (d === '[DONE]') return;
          try { const ev = JSON.parse(d); const delta = (ev.choices && ev.choices[0] && ev.choices[0].delta && ev.choices[0].delta.content) || ''; if (delta) { full += delta; if (onChunk) onChunk(delta, full); } } catch {}
        };
        while (true) { const { done, value } = await reader.read(); if (done) { if (buf) handle(buf); break; } buf += dec.decode(value, { stream: true }); const lines = buf.split('\n'); buf = lines.pop() || ''; for (const l of lines) handle(l); }
        return full ? cleanGroqResponse(full) : null;
      } catch (e) { console.warn('[openai] error', e.message); return null; }
    }

    async function callAI(messages, onChunk) {
      const ai = getAiSettings();
      const cfg = JSON.parse(localStorage.getItem('settings')) || {};
      const groqKey = cfg.groqApiKey || '';
      const anthropicKey = cfg.anthropicApiKey || '';
      const openaiKey = cfg.openaiApiKey || '';
      const _primary = ai.provider || 'groq';
      const _fallbackProv = cfg.aiFallbackProvider || '';

      // Safety: trim oversized message contents so the request body fits Groq's
      // ~1MB gateway limit. Long resumes / pasted documents are the usual cause
      // of 413 Request Entity Too Large.
      const MAX_PER_MSG_CHARS = 60000;
      const safeMessages = (messages || []).map(m => {
        const c = (m && typeof m.content === 'string') ? m.content : '';
        if (c.length <= MAX_PER_MSG_CHARS) return m;
        const trimmed = c.slice(0, MAX_PER_MSG_CHARS) + '\n\n[…content truncated to fit AI request size limit; ' + (c.length - MAX_PER_MSG_CHARS).toLocaleString() + ' more characters omitted]';
        console.warn('[callAI] truncated a message from', c.length, 'to', trimmed.length, 'chars to avoid 413');
        return Object.assign({}, m, { content: trimmed });
      });

      // ── Premium providers (Claude / OpenAI): try the chosen primary first, then
      // the chosen fallback. These run direct from the browser with the user's
      // own key — this is how tenants run AI on their own accounts. ──
      if (_primary === 'claude' && anthropicKey) { const r = await _aiStreamClaude(safeMessages, onChunk, anthropicKey, ai.model); if (r) return r; }
      if (_primary === 'openai' && openaiKey)   { const r = await _aiStreamOpenAI(safeMessages, onChunk, openaiKey, ai.model); if (r) return r; }
      if (_fallbackProv === 'claude' && anthropicKey) { const r = await _aiStreamClaude(safeMessages, onChunk, anthropicKey, ai.model); if (r) return r; }
      if (_fallbackProv === 'openai' && openaiKey)    { const r = await _aiStreamOpenAI(safeMessages, onChunk, openaiKey, ai.model); if (r) return r; }

      // ── PRIMARY: Try Gemini 2.5 Flash first (higher daily cap than Groq) ──
      const geminiKey = cfg.geminiApiKey || '';
      if (geminiKey) {
        try {
          // Convert OpenAI-style messages → Gemini format
          let systemInstruction = null;
          const contents = [];
          for (const m of safeMessages) {
            if (m.role === 'system') { systemInstruction = { parts: [{ text: m.content }] }; continue; }
            contents.push({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: String(m.content || '') }] });
          }
          const gBody = { contents, generationConfig: { temperature: 0.4, maxOutputTokens: 4096 } };
          if (systemInstruction) gBody.systemInstruction = systemInstruction;
          const gResp = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': geminiKey },
            body: JSON.stringify(gBody)
          });
          if (gResp.ok) {
            const reader = gResp.body.getReader(), dec = new TextDecoder();
            let full = '', sseBuffer = '';
            const handle = (line) => {
              if (!line.startsWith('data: ')) return;
              const d = line.slice(6);
              try {
                const ev = JSON.parse(d);
                const dt = ev.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';
                if (dt) { full += dt; if (onChunk) onChunk(dt, full); }
              } catch {}
            };
            while (true) {
              const { done, value } = await reader.read();
              if (done) { if (sseBuffer) handle(sseBuffer); break; }
              sseBuffer += dec.decode(value, { stream: true });
              const lines = sseBuffer.split('\n');
              sseBuffer = lines.pop() || '';
              for (const line of lines) handle(line);
            }
            if (full) return cleanGroqResponse(full);
            // Empty response — fall through to Groq
            console.warn('[callAI] Gemini returned empty, trying Groq');
          } else {
            const errTxt = await gResp.text().catch(() => '');
            console.warn('[callAI] Gemini HTTP', gResp.status, errTxt.slice(0, 200), '— falling back to Groq');
          }
        } catch (e) {
          console.warn('[callAI] Gemini error, falling back to Groq:', e.message);
        }
      }

      // ── FALLBACK: Call Groq directly when API key is set ──────────────
      if (groqKey) {
        try {
          const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + groqKey },
            body: JSON.stringify({
              model: ai.model || GROQ_DEFAULT_MODEL,
              messages: safeMessages,
              max_tokens: 4096,
              temperature: 0.4,
              stream: true
            })
          });
          if (!resp.ok) {
            const e = await resp.json().catch(()=>({}));
            const errMsg = e.error?.message || 'Groq '+resp.status;
            console.error('[callAI] Groq error', resp.status, e);
            // Auto-switch if model is decommissioned
            if (isModelDeadError(errMsg)) {
              const newModel = await autoSwitchModel(ai.model, groqKey);
              if (newModel) return callAI(messages, onChunk); // retry with new model
            }
            throw new Error(errMsg);
          }
          // Buffered SSE parser — handles partial lines across chunk boundaries
          const reader = resp.body.getReader(), dec = new TextDecoder();
          let full = '';
          let sseBuffer = '';
          const processLine = (line) => {
            if (!line.startsWith('data: ')) return;
            const d = line.slice(6); if (d === '[DONE]') return;
            try {
              const evt = JSON.parse(d);
              const delta = evt.choices?.[0]?.delta?.content || '';
              if (delta) {
                full += delta;
                const clean = cleanGroqResponse(full);
                if (onChunk) onChunk(delta, clean);
              }
            } catch {}
          };
          while (true) {
            const { done, value } = await reader.read();
            if (done) { if (sseBuffer) processLine(sseBuffer); break; }
            sseBuffer += dec.decode(value, { stream: true });
            const lines = sseBuffer.split('\n');
            sseBuffer = lines.pop() || '';
            for (const line of lines) processLine(line);
          }
          return cleanGroqResponse(full);
        } catch (e) {
          console.warn('Groq direct failed, trying VPS:', e.message);
          // fall through to VPS
        }
      }

      // ── Premium providers as last-resort fallback (key present, not yet tried) ──
      if (anthropicKey) { const r = await _aiStreamClaude(safeMessages, onChunk, anthropicKey, ai.model); if (r) return r; }
      if (openaiKey)    { const r = await _aiStreamOpenAI(safeMessages, onChunk, openaiKey, ai.model); if (r) return r; }

      // Tenants run on THEIR OWN keys only — never fall through to the owner's
      // shared H.E.L.P. Center server. If nothing above produced a reply, tell
      // them to add a key.
      if (typeof TENANT !== 'undefined' && TENANT) {
        const msg = '⚠️ No AI response yet. Add your own AI key in Settings → AI Integration (Groq, Gemini, Claude, or OpenAI). The "How to get your keys" guide right there walks you through it.';
        if (onChunk) onChunk(msg, msg);
        return msg;
      }

      // ── FALLBACK: VPS backend (owner only) ────────────────────────────
      const sysMsg = messages.find(m => m.role === 'system');
      const chatMsgs = messages.filter(m => m.role !== 'system');
      try {
        const resp = await fetch(`${API_BASE}/api/ai`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: ai.provider, model: ai.model, messages: chatMsgs, systemPrompt: sysMsg ? sysMsg.content : undefined }),
        });
        if (!resp.ok) { const e = await resp.json().catch(()=>({})); return 'AI Error: ' + (e.error || resp.statusText); }
        // Buffered SSE parser
        const reader = resp.body.getReader(), dec = new TextDecoder();
        let full = '';
        let sseBuffer = '';
        let errored = false;
        const processLine = (line) => {
          if (errored) return;
          if (!line.startsWith('data: ')) return;
          const d = line.slice(6); if (d === '[DONE]') return;
          try {
            const evt = JSON.parse(d);
            if (evt.error) { full = 'AI Error: '+evt.error; if (onChunk) onChunk('',full); errored = true; return; }
            const delta = evt.delta || '';
            if (delta) { full += delta; if (onChunk) onChunk(delta, full); }
          } catch {}
        };
        while (true) {
          const { done, value } = await reader.read();
          if (done) { if (sseBuffer && !errored) processLine(sseBuffer); break; }
          sseBuffer += dec.decode(value, { stream: true });
          const lines = sseBuffer.split('\n');
          sseBuffer = lines.pop() || '';
          for (const line of lines) { if (errored) break; processLine(line); }
          if (errored) break;
        }
        return full;
      } catch (e) {
        const noKey = !groqKey && !geminiKey;
        return noKey
          ? '⚠️ No AI key set. Go to Settings → AI Integration and add a Gemini key (aistudio.google.com/apikey) or Groq key (console.groq.com).'
          : 'Connection error: ' + e.message;
      }
    }

    // ── AI CHAT PANEL ──────────────────────────────────────────────
    let aiChatHistory=[], aiCurrentPage='dashboard';

    function toggleAiPanel() {
      const panel=document.getElementById('ai-panel');
      if(!panel)return;
      panel.classList.toggle('hidden');
      if(!panel.classList.contains('hidden')) {
        const inp=document.getElementById('ai-input');
        // Restore any draft the user was typing (survives a page refresh).
        try { const d=localStorage.getItem('aiCoachDraft'); if(d && inp && !inp.value){ inp.value=d; inp.style.height='auto'; inp.style.height=Math.min(inp.scrollHeight,140)+'px'; } } catch(_){}
        inp?.focus();
        const ai=getAiSettings();
        const titleEl=document.getElementById('ai-panel-title');
        if(titleEl)titleEl.textContent=ai.coachName;
        // Re-clamp into viewport in case the window was resized while hidden.
        if (typeof _aiCoachClamp === 'function') _aiCoachClamp(panel);
      }
    }

    // Autosave the coach draft as the user types so a refresh never loses it.
    function aiCoachDraftSave(el){
      if(!el) return;
      el.style.height='auto'; el.style.height=Math.min(el.scrollHeight,140)+'px';
      try { localStorage.setItem('aiCoachDraft', el.value); } catch(_){}
    }

    // Start a fresh conversation — clears history + the chat pane + the draft.
    function newAiCoachChat(){
      aiChatHistory=[];
      const ai=(typeof getAiSettings==='function')?getAiSettings():{coachName:'AI Coach'};
      const name=(ai&&ai.coachName)?ai.coachName:'AI Coach';
      const msgsEl=document.getElementById('ai-messages');
      if(msgsEl) msgsEl.innerHTML='<div class="ai-msg ai-msg-ai" id="ai-greeting-msg">Hey 👋 I\'m your '+name.replace(/</g,'&lt;')+'. What are you working on?</div>';
      const inp=document.getElementById('ai-input');
      if(inp){ inp.value=''; inp.style.height='auto'; }
      try { localStorage.removeItem('aiCoachDraft'); } catch(_){}
      inp?.focus();
    }

    // ── Draggable AI Coach (FAB + Panel) ──────────────────────────────────────
    // The coach sits fixed at bottom-right and can cover whatever's behind it.
    // Drag the FAB to relocate the button; drag the panel by its header to
    // relocate the chat window. Positions persist via setData (tenant-aware).
    let _aiCoachClamp;
    (function initAiCoachDrag(){
      const PAD = 8, DRAG_THRESHOLD = 5;
      const fab = document.getElementById('ai-fab');
      const panel = document.getElementById('ai-panel');
      const panelHeader = panel && panel.querySelector('.ai-panel-header');
      const fabLabel = document.querySelector('.ai-fab-label');

      function clamp(el, x, y) {
        const w = el.offsetWidth, h = el.offsetHeight;
        return {
          x: Math.max(PAD, Math.min(window.innerWidth  - w - PAD, x)),
          y: Math.max(PAD, Math.min(window.innerHeight - h - PAD, y))
        };
      }
      function apply(el, x, y) {
        const p = clamp(el, x, y);
        el.style.left = p.x + 'px';
        el.style.top  = p.y + 'px';
        el.style.right = 'auto';
        el.style.bottom = 'auto';
      }
      _aiCoachClamp = function(el) {
        if (!el || !el.style.left) return;
        if (el.classList.contains('hidden') || el.offsetParent === null) return;
        apply(el, parseFloat(el.style.left), parseFloat(el.style.top));
      };

      function loadPos(key, el) {
        try {
          const raw = getData(key);
          if (raw && typeof raw.x === 'number' && typeof raw.y === 'number') {
            el.style.left = raw.x + 'px';
            el.style.top  = raw.y + 'px';
            el.style.right = 'auto';
            el.style.bottom = 'auto';
          }
        } catch (_) {}
      }

      function makeDraggable(el, handle, storageKey, onDragStart) {
        let sx, sy, ox, oy, dragging = false, moved = false;
        function down(e) {
          const t = e.touches ? e.touches[0] : e;
          const r = el.getBoundingClientRect();
          sx = t.clientX; sy = t.clientY; ox = r.left; oy = r.top;
          dragging = true; moved = false;
          if (onDragStart) onDragStart();
          document.addEventListener('mousemove', move);
          document.addEventListener('mouseup', up);
          document.addEventListener('touchmove', move, { passive: false });
          document.addEventListener('touchend', up);
        }
        function move(e) {
          if (!dragging) return;
          const t = e.touches ? e.touches[0] : e;
          const dx = t.clientX - sx, dy = t.clientY - sy;
          if (!moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
          moved = true;
          if (e.cancelable) e.preventDefault();
          apply(el, ox + dx, oy + dy);
        }
        function up() {
          document.removeEventListener('mousemove', move);
          document.removeEventListener('mouseup', up);
          document.removeEventListener('touchmove', move);
          document.removeEventListener('touchend', up);
          dragging = false;
          if (moved) {
            const r = el.getBoundingClientRect();
            try { setData(storageKey, { x: r.left, y: r.top }); } catch (_) {}
          }
          // Keep `moved` true through the trailing click so we can suppress it.
          setTimeout(() => { moved = false; }, 0);
        }
        handle.addEventListener('mousedown', down);
        handle.addEventListener('touchstart', down, { passive: true });
        // Capture-phase listener so it runs before the inline onclick handler.
        el.addEventListener('click', function(e) {
          if (moved) { e.preventDefault(); e.stopImmediatePropagation(); }
        }, true);
      }

      if (fab) {
        loadPos('aiCoachFabPos', fab);
        makeDraggable(fab, fab, 'aiCoachFabPos', () => {
          if (fabLabel) fabLabel.style.display = 'none';
        });
      }
      if (panel && panelHeader) {
        panelHeader.style.cursor = 'move';
        panelHeader.style.userSelect = 'none';
        panelHeader.style.touchAction = 'none';
        loadPos('aiCoachPanelPos', panel);
        makeDraggable(panel, panelHeader, 'aiCoachPanelPos');
      }

      // ── Resizable panel (drag the bottom-right grip; size persists) ──────────
      const resizeHandle = panel && panel.querySelector('#ai-resize-handle');
      if (panel && resizeHandle) {
        // Restore a previously saved size.
        try {
          const s = getData('aiCoachPanelSize');
          if (s && typeof s.w === 'number' && typeof s.h === 'number') {
            panel.style.width  = s.w + 'px';
            panel.style.height = s.h + 'px';
          }
        } catch (_) {}
        let rsx, rsy, rw, rh, rleft, rtop, resizing = false;
        function rdown(e) {
          const t = e.touches ? e.touches[0] : e;
          const r = panel.getBoundingClientRect();
          rsx = t.clientX; rsy = t.clientY; rw = r.width; rh = r.height; rleft = r.left; rtop = r.top;
          resizing = true;
          // Pin the top-left corner so the panel grows toward the grip.
          panel.style.left = rleft + 'px';
          panel.style.top  = rtop + 'px';
          panel.style.right = 'auto';
          panel.style.bottom = 'auto';
          document.addEventListener('mousemove', rmove);
          document.addEventListener('mouseup', rup);
          document.addEventListener('touchmove', rmove, { passive: false });
          document.addEventListener('touchend', rup);
          if (e.cancelable) e.preventDefault();
          e.stopPropagation();
        }
        function rmove(e) {
          if (!resizing) return;
          const t = e.touches ? e.touches[0] : e;
          if (e.cancelable) e.preventDefault();
          const maxW = window.innerWidth  - rleft - PAD;
          const maxH = window.innerHeight - rtop  - PAD;
          let w = Math.max(320, Math.min(maxW, rw + (t.clientX - rsx)));
          let h = Math.max(360, Math.min(maxH, rh + (t.clientY - rsy)));
          panel.style.width  = w + 'px';
          panel.style.height = h + 'px';
        }
        function rup() {
          document.removeEventListener('mousemove', rmove);
          document.removeEventListener('mouseup', rup);
          document.removeEventListener('touchmove', rmove);
          document.removeEventListener('touchend', rup);
          if (!resizing) return;
          resizing = false;
          try { setData('aiCoachPanelSize', { w: panel.offsetWidth, h: panel.offsetHeight }); } catch (_) {}
        }
        resizeHandle.addEventListener('mousedown', rdown);
        resizeHandle.addEventListener('touchstart', rdown, { passive: false });
      }

      window.addEventListener('resize', () => {
        _aiCoachClamp(fab);
        _aiCoachClamp(panel);
      });
    })();

    function setAiContext(page) {
      aiCurrentPage=page;
      const labels={'income-pathway':'Income Growth','credit-pathway':'Credit & Finance','business-pathway':'Business Development','confidence-pathway':'Confidence & Leadership','career-pathway':'Career Advancement','youth-pathway':'Youth Leadership','course-pathway':'Course Development','clients':'Client Manager','my-ideas':'My Ideas','dashboard':'Dashboard','settings':'Settings','client-portal':'Client Portal'};
      const bar=document.getElementById('ai-context-bar');
      if(bar)bar.textContent='Context: '+(labels[page]||'H.E.L.P. Center');
    }

    async function sendAiMessage() {
      const input=document.getElementById('ai-input');
      const msg=input?.value.trim(); if(!msg)return;
      input.value=''; input.style.height='auto';
      try { localStorage.removeItem('aiCoachDraft'); } catch(_){}
      const msgsEl=document.getElementById('ai-messages');
      // append user bubble
      const uDiv=document.createElement('div');
      uDiv.className='ai-msg ai-msg-user';
      uDiv.innerHTML=msg.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\n/g,'<br>');
      msgsEl.appendChild(uDiv);
      // append ai typing bubble
      const aDiv=document.createElement('div');
      aDiv.className='ai-msg ai-msg-ai typing';
      aDiv.innerHTML='<span style="color:#94A3B8;font-size:13px">⏳ Thinking…</span>';
      msgsEl.appendChild(aDiv);
      msgsEl.scrollTop=msgsEl.scrollHeight;
      aiChatHistory.push({role:'user',content:'[Page: '+aiCurrentPage+']\n'+msg});
      const messages=[{role:'system',content:HELPCENTER_SYSTEM_PROMPT},...aiChatHistory.slice(-10)];
      let gotChunk=false;
      const result = await callAI(messages,(delta,full)=>{
        gotChunk=true;
        aDiv.classList.remove('typing');
        aDiv.className='ai-msg ai-msg-ai md-content';
        aDiv.innerHTML=mdRender(full);
        msgsEl.scrollTop=msgsEl.scrollHeight;
      });
      aDiv.classList.remove('typing');
      aDiv.className='ai-msg ai-msg-ai md-content';
      if(!gotChunk && result) aDiv.innerHTML=mdRender(result);
      msgsEl.scrollTop=msgsEl.scrollHeight;
      aiChatHistory.push({role:'assistant',content:aDiv.innerText||''});
      // Append per-message action buttons (Save to Notes / Print / Copy)
      _addAiCoachActions(aDiv, aiChatHistory[aiChatHistory.length-1].content);
    }

    function _addAiCoachActions(bubbleEl, replyText) {
      if (!bubbleEl) return;
      if (bubbleEl.parentElement?.querySelector('.ai-coach-actions[data-for="'+bubbleEl.id+'"]')) return;
      const id = 'aic-' + Math.random().toString(36).slice(2,9);
      bubbleEl.id = id;
      const bar = document.createElement('div');
      bar.className = 'ai-coach-actions';
      bar.dataset.for = id;
      bar.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;align-self:flex-start;max-width:88%';
      const mk = (label, onclick, color) => {
        const b = document.createElement('button');
        b.textContent = label;
        b.style.cssText = 'padding:4px 9px;background:#fff;border:1px solid #E2E8F0;color:'+(color||'#475569')+';font-size:11px;font-weight:600;border-radius:6px;cursor:pointer';
        b.onclick = onclick;
        return b;
      };
      bar.appendChild(mk('Copy', () => { copyTextSafe(replyText); showToast('Copied','success'); }));
      bar.appendChild(mk('Save to Notes', () => {
        const subject = (replyText.split('\n').find(l=>l.trim())||'AI Coach output').replace(/^#+\s*/,'').slice(0,80);
        const list = getData('notes') || [];
        list.push({ id: generateId(), subject, body: replyText, category:'AI Coach', tags:'ai-coach,'+(aiCurrentPage||''), date:new Date().toISOString().split('T')[0], createdAt:Date.now(), updatedAt:Date.now() });
        setData('notes', list);
        showToast('Saved to Notes','success');
      }, '#1E5BC0'));
      bar.appendChild(mk('Print', () => {
        const w = window.open('', '_blank', 'width=900,height=1100');
        if (!w) { alert('Allow popups to print.'); return; }
        const safe = (replyText||'').replace(/&/g,'&amp;').replace(/</g,'&lt;');
        w.document.write('<!doctype html><html><head><title>AI Coach Reply</title><style>body{font-family:Inter,system-ui,sans-serif;margin:40px;line-height:1.7;color:#1a1a1a}h1{color:#1E5BC0;border-bottom:2px solid #1E5BC0;padding-bottom:8px}@media print{@page{margin:0.6in}}</style></head><body><h1>AI Coach</h1><div style="white-space:pre-wrap">'+safe+'</div></body></html>');
        w.document.close();
        setTimeout(()=>{w.focus();w.print();},250);
      }));
      bar.appendChild(mk('Save to Business File', () => {
        const titleLine = (replyText.split('\n').find(l=>l.trim())||'AI Coach output').replace(/^#+\s*/,'').slice(0,100);
        if (typeof saveToBusinessFile === 'function') saveToBusinessFile({ type:'AI Coach', title: titleLine, content: replyText });
      }, '#16A34A'));
      bar.appendChild(mk('Save to Personal File', () => {
        const titleLine = (replyText.split('\n').find(l=>l.trim())||'AI Coach output').replace(/^#+\s*/,'').slice(0,100);
        if (typeof saveToPersonalFile === 'function') saveToPersonalFile({ type:'AI Coach', title: titleLine, content: replyText });
      }, '#8B5CF6'));
      bubbleEl.parentElement.insertBefore(bar, bubbleEl.nextSibling);
    }

    // ── AI INLINE COACHING (assessments) ──────────────────────────
    async function getAiCoaching(containerId, userContext, pathway) {
      const container=document.getElementById(containerId); if(!container)return;
      container.innerHTML=`<div class="ai-result"><div class="ai-result-badge">✨ AI COACHING</div><div style="display:flex;align-items:center;gap:8px;color:var(--gray-500);font-size:14px;margin-bottom:8px"><div class="ai-dots"><span>●</span><span>●</span><span>●</span></div>Generating personalized coaching...</div><div id="${containerId}-text" style="font-size:14px;line-height:1.8;color:var(--gray-700)"></div></div>`;
      container.style.display='block';
      const messages=[
        {role:'system',content:HELPCENTER_SYSTEM_PROMPT},
        {role:'user',content:`H.E.L.P. Center Pathway: ${pathway}\n\nClient self-assessment:\n${userContext}\n\nProvide a specific, personalized coaching response with:\n1. A direct, honest read of where they are right now\n2. Their top 3 immediate priority actions — specific tools, platforms, and timelines\n3. A 90-day milestone they should be hitting\n4. A powerful closing that connects this to their bigger vision\n\nDo NOT give generic advice. Reference real tools, real steps, real numbers. This is H.E.L.P. Center quality coaching for a client who is serious about building nationwide.`}
      ];
      const textEl=document.getElementById(containerId+'-text');
      if(textEl) textEl.classList.add('md-content');
      const result=await callAI(messages,(delta,full)=>{ if(textEl)textEl.innerHTML=mdRender(full); });
      if(textEl)textEl.innerHTML=mdRender(result);
    }

    // ── AI BUSINESS PLAN WRITER ────────────────────────────────────
    async function generateAiBizPlan(ideaId) {
      const ideas=getData('ideas'), idea=ideas.find(i=>i.id===ideaId); if(!idea)return;
      const btn=document.getElementById('ai-bizplan-btn-'+ideaId); if(btn){btn.disabled=true;btn.textContent='Generating...';}
      const container=document.getElementById('ai-bizplan-result-'+ideaId);
      if(container){container.style.display='block';container.innerHTML=`<div class="ai-result"><div class="ai-result-badge">✨ AI GENERATING</div><div class="ai-dots" style="margin:8px 0"><span>●</span><span>●</span><span>●</span></div><div id="ai-bp-text-${ideaId}" class="md-content" style="font-size:14px;line-height:1.8"></div></div>`;}
      // Focused short system prompt — neutral on demographics
      const sysPrompt = `You are an expert business strategist. Write thorough, specific, ready-to-use business plans. Tailor to the actual idea and audience described. Do NOT default to any specific demographic unless the user has explicitly indicated one. Use clean Markdown with headers and numbered lists.`;
      const messages=[
        {role:'system',content:sysPrompt},
        {role:'user',content:`Write a complete business plan based on these inputs:\n\nBusiness: ${idea.name}\nTagline: ${idea.tagline||'N/A'}\nDescription: ${idea.description||'N/A'}\nStage: ${idea.stage}\nStartup Budget: $${idea.financials?.startupCost||0}\nProjected Revenue: ${idea.financials?.projectedRevenue||'N/A'}\nNotes: ${idea.notes||'N/A'}\n\nProduce all sections:\n1. Executive Summary\n2. Problem & Market Opportunity\n3. Target Customer (specific demographics, psychographics, location — based ONLY on the description above)\n4. Solution & Unique Value Proposition\n5. Revenue Model & Pricing Strategy\n6. 90-Day Launch Plan (week by week)\n7. 12-Month Milestones & Revenue Targets\n8. Startup Cost Breakdown\n9. Key Risks & Mitigation Strategies\n10. Why This Business Wins\n\nBe specific. Reference real platforms, real costs, real strategies. Make it ready for a real founder to act on.`}
      ];
      const textEl=document.getElementById('ai-bp-text-'+ideaId);
      let full='';
      try {
        await callAI(messages,(delta,f)=>{ full=f; if(textEl) textEl.innerHTML = mdRender(f); });
        if (!full) {
          if (textEl) textEl.innerHTML = '<div style="color:#dc2626;padding:10px;background:#fef2f2;border-radius:6px">⚠️ No response. Check Settings → Groq API key.</div>';
        } else {
          const cleaned = cleanGroqResponse(full);
          if (textEl) textEl.innerHTML = mdRender(cleaned) +
            `<div style="margin-top:12px;padding-top:10px;border-top:0.5px solid rgba(0,0,0,0.1)">
              <button onclick="saveAsNote('${idea.name.replace(/'/g,'')} — Business Plan', \`${cleaned.replace(/`/g,"'").slice(0,50000)}\`, 'Business Idea')" class="btn btn-outline" style="padding:6px 12px;font-size:12px"><span class="icon icon-sm" data-icon="note" style="margin-right:6px;vertical-align:-2px"></span>Save to Notes</button>
            </div>`;
          const idx=ideas.findIndex(i=>i.id===ideaId);
          if(idx>-1){ideas[idx].businessPlan=cleaned;setData('ideas',ideas);const ta=document.getElementById('idea-bp');if(ta)ta.value=cleaned;}
          logActivity('idea','AI generated business plan for: '+idea.name);
        }
      } catch(e) {
        console.error('[generateAiBizPlan] failed:', e);
        if (textEl) textEl.innerHTML = `<div style="color:#dc2626;padding:10px;background:#fef2f2;border-radius:6px">⚠️ ${e.message}</div>`;
      }
      if(btn){btn.disabled=false;btn.textContent='✨ Regenerate Plan';}
    }

    // ── AI MESSAGE DRAFT ──────────────────────────────────────────
    async function draftAiReply(clientId) {
      const clients=getData('clients'), client=clients.find(c=>c.id===clientId); if(!client)return;
      const btn=document.getElementById('ai-draft-btn-'+clientId); if(btn){btn.disabled=true;btn.textContent='Drafting...';}
      const _os = JSON.parse(localStorage.getItem('settings')) || DEFAULT_SETTINGS;
      const ownerName = _os.name || DEFAULT_SETTINGS.name;
      const recentMsgs=client.messages.slice(-6).map(m=>`${m.from==='owner'?ownerName:client.name}: ${m.message}`).join('\n');
      const messages=[
        {role:'system',content:buildSystemPrompt()},
        {role:'user',content:`Draft a professional reply from ${ownerName} to their client ${client.name}${client.businessName?' ('+client.businessName+')':''}, working on: ${client.service}. Project status: ${client.projectStatus||0}%.\n\nConversation:\n${recentMsgs||'No messages yet — '+ownerName+' is reaching out first.'}\n\nWrite a reply that is warm, specific to their project progress, and ends with a clear next step or question. Be direct, encouraging, and professional. Under 80 words.`}
      ];
      const reply=await callAI(messages);
      const input=document.getElementById('omsg-'+clientId); if(input)input.value=reply;
      if(btn){btn.disabled=false;btn.textContent='✨ Draft Reply';}
    }

    // ── SETTINGS FUNCTIONS ────────────────────────────────────────
    function loadSettingsPage() {
      const s=JSON.parse(localStorage.getItem('settings'))||{};
      const sv=(id,v)=>{const el=document.getElementById(id);if(el)el.value=v||'';};
      sv('set-name',s.name); sv('set-email',s.email); sv('set-biz',s.businessName); sv('set-tagline',s.tagline); sv('set-portal-url',s.portalBaseUrl||'');
      sv('set-ai-provider',s.aiProvider||'groq'); sv('set-ai-name',s.aiCoachName||'H.E.L.P. AI Coach');
      sv('set-ai-fallback',s.aiFallbackProvider||'');
      if(s.groqApiKey) sv('set-groq-key',s.groqApiKey);
      if(s.groqApiKey2) sv('set-groq-key-2',s.groqApiKey2);
      if(s.geminiApiKey) sv('set-gemini-key',s.geminiApiKey);
      if(s.anthropicApiKey) sv('set-claude-key',s.anthropicApiKey);
      if(s.openaiApiKey) sv('set-openai-key',s.openaiApiKey);
      if(s.openRouterApiKey) sv('set-openrouter-key',s.openRouterApiKey);
      if (typeof _applyTenantAiSettingsCopy === 'function') _applyTenantAiSettingsCopy();
      sv('set-ollama-url',s.ollamaUrl||'');
      sv('set-ollama-model',s.ollamaModel||'');
      const ollEnabled=document.getElementById('set-ollama-enabled'); if(ollEnabled) ollEnabled.checked=!!s.ollamaEnabled;
      sv('set-pb-url',s.pbUrl||''); sv('set-pb-email',s.pbEmail||''); sv('set-pb-password',s.pbPassword||'');
      updateAiModelOptions();
      setTimeout(()=>sv('set-ai-model',s.aiModel||'llama-3.3-70b-versatile'),0);
      const pbResult = document.getElementById('set-pb-result');
      if (pbResult && s.pbEnabled) pbResult.innerHTML = '<span style="color:var(--success)">✅ PocketBase enabled — '+s.pbUrl+'</span>';
      if (typeof renderEmailHistory === 'function') renderEmailHistory();
      if (typeof renderTenantsList === 'function') renderTenantsList();
      if (typeof renderTenantInbox === 'function') renderTenantInbox();
    }

    async function savePbSettings() {
      const s=JSON.parse(localStorage.getItem('settings'))||{};
      const newUrl=(document.getElementById('set-pb-url')?.value||'').trim().replace(/\/$/,'');
      const newEmail=document.getElementById('set-pb-email')?.value.trim()||'';
      const newPassword=document.getElementById('set-pb-password')?.value||'';
      // Only update fields when the form has a value, so re-saving doesn't
      // wipe credentials when the form is partially filled or password is
      // hidden by browser autofill.
      if (newUrl) s.pbUrl = newUrl;
      if (newEmail) s.pbEmail = newEmail;
      if (newPassword) s.pbPassword = newPassword;
      s.pbEnabled=!!(s.pbUrl && s.pbEmail && s.pbPassword);
      localStorage.setItem('settings', JSON.stringify(s));
      localStorage.removeItem('pb_token');
      const res=document.getElementById('set-pb-result');
      if (!s.pbEnabled) { if(res)res.innerHTML='<span style="color:var(--error)">Enter URL, email, and password to enable PocketBase.</span>'; return; }
      if(res)res.innerHTML='<span style="color:var(--gray-500)">Testing connection...</span>';
      // Direct admin auth — same logic as testPbConnection so it can't fail
      // due to anything else in the new pbAuth dispatcher.
      let token = null;
      try {
        const r = await fetch(s.pbUrl + '/api/admins/auth-with-password', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({identity: s.pbEmail, password: s.pbPassword})
        });
        if (r.ok) {
          const d = await r.json();
          token = d.token;
          localStorage.setItem('pb_token', d.token);
          if (d.admin) localStorage.setItem('pb_admin', JSON.stringify(d.admin));
        }
      } catch(e) {}
      if(token) {
        if(res)res.innerHTML='<span style="color:var(--success)">✅ Connected to PocketBase! Data will now sync on every save.</span>';
        logActivity('system','PocketBase backend connected');
        // Push the full settings record (now including pb credentials) to PB
        // so future pbPull calls don't wipe them on other devices.
        try { await pbWrite('settings', s); } catch(e) {}
        // Re-render the "CLOUD SYNC IS OFF" warning banner — it was painted at
        // page load and won't notice that PB is now enabled until the next
        // refresh otherwise. Same goes for the sidebar sync badge.
        try { _renderSyncStatusBadge(); } catch(e) {}
        try { startBackgroundSync(); startReminders(); pbSyncAll().then(()=>_pbRenderBadge()); } catch(e) {}
      } else {
        // Don't disable or wipe — just show error. Credentials stay in LS so
        // the user can fix one field (e.g. password) without re-entering all.
        if(res)res.innerHTML='<span style="color:var(--error)">❌ Could not connect. Check your URL, email, and password — your other settings were NOT wiped.</span>';
      }
    }

    async function testPbConnection() {
      const url=(document.getElementById('set-pb-url')?.value||'').trim().replace(/\/$/,'');
      const email=document.getElementById('set-pb-email')?.value.trim()||'';
      const pw=document.getElementById('set-pb-password')?.value||'';
      const res=document.getElementById('set-pb-result');
      if(!url||!email||!pw){if(res)res.innerHTML='<span style="color:var(--error)">Fill in all three fields first.</span>';return;}
      if(res)res.innerHTML='<span style="color:var(--gray-500)">Connecting...</span>';
      try {
        const r=await fetch(url+'/api/admins/auth-with-password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({identity:email,password:pw})});
        if(r.ok){if(res)res.innerHTML='<span style="color:var(--success)">✅ Connection successful! Click "Save & Enable" to activate.</span>';}
        else{if(res)res.innerHTML='<span style="color:var(--error)">❌ Auth failed — check email and password.</span>';}
      } catch(e){if(res)res.innerHTML='<span style="color:var(--error)">❌ Cannot reach server — check URL and CORS settings.</span>';}
    }

    function disablePb() {
      const s=JSON.parse(localStorage.getItem('settings'))||{};
      s.pbEnabled=false; localStorage.setItem('settings',JSON.stringify(s)); localStorage.removeItem('pb_token');
      const res=document.getElementById('set-pb-result'); if(res)res.innerHTML='<span style="color:var(--gray-500)">PocketBase disabled — using local storage.</span>';
      showToast('Switched to local storage only');
    }

    const GEMINI_MODELS = [
      { id:'gemini-2.5-flash', label:'Gemini 2.5 Flash — Fast, Free tier' }
    ];
    function updateAiModelOptions() {
      const provider=document.getElementById('set-ai-provider')?.value||'groq';
      const models=provider==='groq'?GROQ_MODELS:provider==='claude'?CLAUDE_MODELS:provider==='gemini'?GEMINI_MODELS:OPENAI_MODELS;
      const el=document.getElementById('set-ai-model');
      if(el)el.innerHTML=models.map(m=>`<option value="${m.id}">${m.label}</option>`).join('');
    }

    function saveSettings() {
      const s=JSON.parse(localStorage.getItem('settings'))||{};
      ['name','email','businessName','tagline','portalBaseUrl'].forEach(k=>{ const id={'name':'set-name','email':'set-email','businessName':'set-biz','tagline':'set-tagline','portalBaseUrl':'set-portal-url'}[k]; const el=document.getElementById(id); if(el)s[k]=el.value.trim(); });
      setData('settings',s); logActivity('system','Profile updated');
      updateBrandUI(); updateDashboard();
      showToast('Profile saved!','success');
    }

    function saveAiSettings() {
      const s=JSON.parse(localStorage.getItem('settings'))||{};
      s.aiProvider=document.getElementById('set-ai-provider')?.value||'groq';
      s.aiModel=document.getElementById('set-ai-model')?.value||'llama-3.3-70b-versatile';
      s.aiCoachName=document.getElementById('set-ai-name')?.value.trim()||'H.E.L.P. AI Coach';
      s.aiFallbackProvider=document.getElementById('set-ai-fallback')?.value||'';
      const gk=document.getElementById('set-groq-key')?.value.trim();
      if(gk) s.groqApiKey=gk;
      const gk2=document.getElementById('set-groq-key-2')?.value.trim();
      if(gk2!==undefined) s.groqApiKey2=gk2;
      const gmk=document.getElementById('set-gemini-key')?.value.trim();
      if(gmk!==undefined) s.geminiApiKey=gmk;
      const clk=document.getElementById('set-claude-key')?.value.trim();
      if(clk!==undefined) s.anthropicApiKey=clk;
      const opk=document.getElementById('set-openai-key')?.value.trim();
      if(opk!==undefined) s.openaiApiKey=opk;
      const ork=document.getElementById('set-openrouter-key')?.value.trim();
      if(ork!==undefined) s.openRouterApiKey=ork;
      s.ollamaUrl=(document.getElementById('set-ollama-url')?.value.trim() || '').replace(/\/$/,'');
      s.ollamaModel=document.getElementById('set-ollama-model')?.value.trim() || '';
      s.ollamaEnabled=!!document.getElementById('set-ollama-enabled')?.checked;
      setData('settings',s); logActivity('system','AI settings updated');
      const nameEl=document.getElementById('ai-panel-title'); if(nameEl)nameEl.textContent=s.aiCoachName;
      showToast('AI settings saved!','success');
    }

    // ── OLLAMA LOCAL FALLBACK ──────────────────────────────────────────────
    // Calls a local Ollama instance using its OpenAI-compatible chat endpoint
    // when Groq rate-limits. Requires Ollama started with OLLAMA_ORIGINS=*.
    //
    // Smart model routing — given a task hint and content length, pick the
    // best available local model. Falls back to the user-configured default
    // if the preferred specialty model isn't installed.
    let _ollamaTagsCache = null;
    async function _getOllamaTags(base) {
      if (_ollamaTagsCache) return _ollamaTagsCache;
      try {
        const r = await fetch(base + '/api/tags');
        if (!r.ok) return [];
        const j = await r.json();
        _ollamaTagsCache = (j.models || []).map(m => m.name);
        setTimeout(() => { _ollamaTagsCache = null; }, 60000); // 60s cache
        return _ollamaTagsCache;
      } catch (e) { return []; }
    }
    async function _pickOllamaModel(opts) {
      opts = opts || {};
      const s = JSON.parse(localStorage.getItem('settings') || '{}');
      const base = (s.ollamaUrl || 'http://localhost:11434').replace(/\/$/, '');
      const installed = await _getOllamaTags(base);
      const hasModel = (n) => installed.some(x => x === n || x.startsWith(n.split(':')[0] + ':'));
      // Code task → prefer qwen2.5-coder
      if (opts.task === 'code' && hasModel('qwen2.5-coder:3b')) return 'qwen2.5-coder:3b';
      // Long doc → prefer 7B if installed
      if ((opts.task === 'longDoc' || (opts.contentLength || 0) > 6000) && hasModel('qwen2.5:7b')) return 'qwen2.5:7b';
      return s.ollamaModel || 'qwen2.5:3b';
    }
    async function callOllama(messages, opts) {
      opts = opts || {};
      const s = JSON.parse(localStorage.getItem('settings') || '{}');
      const base = (s.ollamaUrl || 'http://localhost:11434').replace(/\/$/, '');
      const contentLength = (messages || []).reduce((a, m) => a + ((m && m.content) || '').length, 0);
      const model = opts.model || await _pickOllamaModel({ task: opts.task, contentLength });
      const r = await fetch(base + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages, stream: false, options: { temperature: opts.temperature == null ? 0.3 : opts.temperature, num_predict: opts.max_tokens || 4096 } })
      });
      if (!r.ok) {
        const txt = await r.text().catch(() => '');
        throw new Error('Ollama HTTP ' + r.status + ': ' + txt.slice(0, 200));
      }
      const data = await r.json();
      return (data.message && data.message.content) || '';
    }
    async function testOllamaConnection() {
      const status = document.getElementById('ollama-status');
      if (!status) return;
      status.style.color = 'var(--gray-500)';
      status.textContent = 'Testing…';
      const url = (document.getElementById('set-ollama-url')?.value.trim() || 'http://localhost:11434').replace(/\/$/, '');
      const model = document.getElementById('set-ollama-model')?.value.trim();
      try {
        const r = await fetch(url + '/api/tags');
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const j = await r.json();
        const names = (j.models || []).map(m => m.name);
        if (model && !names.includes(model) && !names.some(n => n.startsWith(model.split(':')[0]))) {
          status.style.color = 'var(--brand-accent)';
          status.innerHTML = '⚠ Reachable but model "' + model + '" not installed. Run: <code>ollama pull ' + model + '</code>. Available: ' + names.slice(0, 4).join(', ');
          return;
        }
        status.style.color = 'var(--brand-secondary)';
        status.innerHTML = '✓ Reachable. ' + names.length + ' model' + (names.length !== 1 ? 's' : '') + ' available' + (names.length ? ': ' + names.slice(0, 4).join(', ') + (names.length > 4 ? '…' : '') : '');
      } catch (e) {
        status.style.color = 'var(--error,#DC2626)';
        const msg = String(e.message || e);
        if (/cors|opaque|fetch/i.test(msg)) {
          status.innerHTML = '✗ ' + msg + ' — start Ollama with <code>OLLAMA_ORIGINS=*</code> env var.';
        } else {
          status.innerHTML = '✗ ' + msg + ' — check that Ollama is running locally.';
        }
      }
    }
    function _ollamaConfigured() {
      const s = JSON.parse(localStorage.getItem('settings') || '{}');
      return !!(s.ollamaEnabled && s.ollamaUrl && s.ollamaModel);
    }

    async function testAiConnection() {
      // Test backend health + AI connectivity
      try {
        const r = await fetch(`${API_BASE}/api/health`);
        const d = await r.json();
        if (r.ok) showToast('✓ H.E.L.P. Center AI server connected!', 'success');
        else showToast('AI server error: ' + (d.error || r.statusText), 'error');
      } catch(e) { showToast('Cannot reach AI server: ' + e.message, 'error'); }
    }

    function changePasswordSettings() {
      const cur=document.getElementById('set-pw-current')?.value, nw=document.getElementById('set-pw-new')?.value, conf=document.getElementById('set-pw-confirm')?.value;
      const msg=document.getElementById('set-pw-msg');
      const s=JSON.parse(localStorage.getItem('settings'))||DEFAULT_SETTINGS;
      if(cur!==(s.password||DEFAULT_SETTINGS.password)){if(msg)msg.innerHTML='<span style="color:var(--error)">Current password is incorrect.</span>';return;}
      if(!nw||nw.length<6){if(msg)msg.innerHTML='<span style="color:var(--error)">Password must be at least 6 characters.</span>';return;}
      if(nw!==conf){if(msg)msg.innerHTML='<span style="color:var(--error)">Passwords do not match.</span>';return;}
      s.password=nw; setData('settings',s);
      if(msg)msg.innerHTML='<span style="color:#10B981">✓ Password updated.</span>';
      ['set-pw-current','set-pw-new','set-pw-confirm'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
    }

    const _EXPORT_KEYS = ['clients','ideas','revenue','activity','bookings','notes','myIdeas','services','availability','blockedDates','calEvents','intakeForms','contracts','projects','documents','settings','goals','tasks','invoices','expenses'];
    // Map legacy/aliased keys in incoming backups → current canonical keys.
    const _IMPORT_KEY_ALIASES = { events: 'calEvents' };

    function exportData() {
      const data = { exportDate: new Date().toISOString(), version: 2, origin: location.href };
      _EXPORT_KEYS.forEach(k => {
        const v = getData(k);
        if (v == null) return;
        if (Array.isArray(v) && !v.length) return;
        if (typeof v === 'object' && !Array.isArray(v) && !Object.keys(v).length) return;
        data[k] = v;
      });
      const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
      a.download='helpcenter-backup-'+new Date().toISOString().split('T')[0]+'.json'; a.click();
      logActivity('system','Data exported ('+Object.keys(data).filter(k=>!['exportDate','version','origin'].includes(k)).length+' keys)');
    }

    function importData() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,application/json';
      input.onchange = e => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
          let data;
          try { data = JSON.parse(ev.target.result); }
          catch (err) { alert('Invalid JSON file: '+err.message); return; }
          // Translate legacy aliases so old/mislabeled backups still land in the right slot
          Object.entries(_IMPORT_KEY_ALIASES).forEach(([legacy, current]) => {
            if ((legacy in data) && !(current in data)) data[current] = data[legacy];
          });
          _showImportPicker(data, file.name);
        };
        reader.readAsText(file);
      };
      input.click();
    }

    // ── SELECTIVE IMPORT PICKER ────────────────────────────────────────────
    // Show every category in the imported JSON with per-record checkboxes.
    // User picks exactly what to bring in; everything else stays untouched.
    // Imports always MERGE (never replace) so existing records aren't lost.
    function _importLabel(key, rec) {
      if (!rec) return '(empty)';
      if (typeof rec !== 'object') return String(rec).slice(0, 80);
      switch (key) {
        case 'clients':     return (rec.name || '') + (rec.businessName ? ' · ' + rec.businessName : '') + (rec.email ? ' · ' + rec.email : '');
        case 'ideas':       return (rec.name || rec.title || '(idea)') + (rec.stage ? ' · ' + rec.stage : '');
        case 'myIdeas':     return rec.title || rec.name || '(idea)';
        case 'revenue':     return (rec.clientName || '?') + ' · $' + (rec.amount || 0) + (rec.date ? ' · ' + rec.date : '');
        case 'notes':       return (rec.title || '(untitled)') + (rec.content ? ' — ' + String(rec.content).slice(0, 60) : '');
        case 'bookings':    return (rec.title || rec.serviceType || '(booking)') + (rec.start ? ' · ' + rec.start : '');
        case 'calEvents':   return (rec.title || '(event)') + (rec.start ? ' · ' + rec.start : '');
        case 'contracts':   return (rec.clientName || '?') + (rec.contractType ? ' · ' + rec.contractType : '') + (rec.date ? ' · ' + rec.date : '');
        case 'invoices':    return (rec.invoiceNumber || '?') + ' · ' + (rec.clientName || '?') + ' · $' + (rec.amount || 0);
        case 'expenses':    return (rec.description || rec.category || '(expense)') + ' · $' + (rec.amount || 0) + (rec.date ? ' · ' + rec.date : '');
        case 'tasks':       return (rec.title || '(task)') + (rec.dueDate ? ' · due ' + rec.dueDate : '');
        case 'goals':       return rec.title || rec.name || '(goal)';
        case 'projects':    return (rec.name || '?') + (rec.clientName ? ' · ' + rec.clientName : '');
        case 'documents':   return (rec.title || rec.type || '(document)') + (rec.clientName ? ' · ' + rec.clientName : '');
        case 'intakeForms': return (rec.clientName || rec.name || '(intake)') + (rec.completed ? ' · completed' : '');
        case 'services':    return (rec.name || '?') + (rec.price ? ' · $' + rec.price : '');
        case 'activity':    return (rec.message || rec.type || '(event)') + (rec.timestamp ? ' · ' + new Date(rec.timestamp).toLocaleDateString() : '');
        default:            return rec.id || rec.name || rec.title || JSON.stringify(rec).slice(0, 80);
      }
    }

    function _showImportPicker(data, fileName) {
      const existing = document.getElementById('import-picker-overlay');
      if (existing) existing.remove();

      const categories = _EXPORT_KEYS
        .filter(k => k in data && data[k] != null)
        .map(k => {
          const v = data[k];
          if (Array.isArray(v)) return { key: k, kind: 'array', items: v, count: v.length };
          if (typeof v === 'object') return { key: k, kind: 'object', items: [v], count: Object.keys(v).length };
          return { key: k, kind: 'scalar', items: [v], count: 1 };
        })
        .filter(c => c.count > 0);

      const overlay = document.createElement('div');
      overlay.id = 'import-picker-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.55);display:flex;align-items:center;justify-content:center;padding:20px';
      overlay.innerHTML =
        '<div style="background:#fff;border-radius:14px;padding:0;max-width:780px;width:100%;max-height:86vh;display:flex;flex-direction:column;box-shadow:0 16px 50px rgba(0,0,0,0.25);overflow:hidden">' +
          '<div style="padding:18px 22px;border-bottom:1px solid var(--gray-200,#e5e7eb)">' +
            '<h3 style="font-size:18px;font-weight:700;margin:0">Pick what to import</h3>' +
            '<p style="font-size:12.5px;color:var(--gray-500);margin:4px 0 0">From <strong>' + (fileName || 'backup file') + '</strong>. Selected records will be MERGED into your current data (de-duped by id). Anything you don\'t pick stays untouched.</p>' +
          '</div>' +
          '<div id="import-picker-body" style="flex:1;overflow-y:auto;padding:6px 0"></div>' +
          '<div style="padding:14px 22px;border-top:1px solid var(--gray-200,#e5e7eb);display:flex;justify-content:space-between;align-items:center;background:var(--gray-50,#f9fafb)">' +
            '<div id="import-picker-count" style="font-size:13px;color:var(--gray-600)">0 records selected</div>' +
            '<div style="display:flex;gap:8px">' +
              '<button onclick="document.getElementById(\'import-picker-overlay\').remove()" class="btn btn-outline" style="padding:8px 16px">Cancel</button>' +
              '<button onclick="_importPickerSelectAll(true)" class="btn btn-outline" style="padding:8px 16px">Select all</button>' +
              '<button onclick="_importPickerSelectAll(false)" class="btn btn-outline" style="padding:8px 16px">Clear</button>' +
              '<button onclick="_importPickerApply()" id="import-picker-apply" class="btn btn-solid" style="padding:8px 16px">Apply selection</button>' +
            '</div>' +
          '</div>' +
        '</div>';
      document.body.appendChild(overlay);

      const body = overlay.querySelector('#import-picker-body');
      window._importPickerData = { data, categories };

      categories.forEach((cat, ci) => {
        const block = document.createElement('div');
        block.style.cssText = 'border-bottom:1px solid var(--gray-100,#f1f5f9);padding:10px 22px';
        const headerId = 'imp-cat-' + ci;
        const listId = 'imp-list-' + ci;
        block.innerHTML =
          '<div style="display:flex;align-items:center;gap:10px;cursor:pointer" onclick="_importPickerToggleExpand(' + ci + ')">' +
            '<input type="checkbox" id="' + headerId + '" onclick="event.stopPropagation();_importPickerToggleCategory(' + ci + ',this.checked)" style="cursor:pointer;transform:scale(1.15)">' +
            '<div style="flex:1"><strong style="font-size:14px;color:var(--gray-900)">' + cat.key + '</strong> <span style="font-size:12px;color:var(--gray-500)">— ' + cat.count + (cat.kind === 'array' ? ' record' + (cat.count !== 1 ? 's' : '') : ' field' + (cat.count !== 1 ? 's' : '')) + '</span></div>' +
            '<span id="exp-' + ci + '" style="font-size:12px;color:var(--gray-500)">▸ expand</span>' +
          '</div>' +
          '<div id="' + listId + '" style="display:none;margin:8px 0 0 28px;max-height:240px;overflow-y:auto;border:1px solid var(--gray-200,#e5e7eb);border-radius:8px;background:var(--gray-50,#fafafa)"></div>';
        body.appendChild(block);
      });

      _importPickerUpdateCount();
    }

    function _importPickerToggleExpand(ci) {
      const list = document.getElementById('imp-list-' + ci);
      const expIcon = document.getElementById('exp-' + ci);
      if (list.style.display === 'none') {
        if (!list.dataset.populated) {
          const cat = window._importPickerData.categories[ci];
          if (cat.kind === 'array') {
            list.innerHTML = cat.items.map((item, ii) =>
              '<label style="display:flex;align-items:center;gap:8px;padding:7px 12px;border-bottom:1px solid var(--gray-100,#f1f5f9);cursor:pointer;font-size:12.5px"><input type="checkbox" data-cat="' + ci + '" data-idx="' + ii + '" onchange="_importPickerUpdateCount()" style="cursor:pointer"><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + _importLabel(cat.key, item).replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</span></label>'
            ).join('');
          } else {
            const obj = cat.items[0];
            list.innerHTML = Object.keys(obj).map(field =>
              '<label style="display:flex;align-items:center;gap:8px;padding:7px 12px;border-bottom:1px solid var(--gray-100,#f1f5f9);cursor:pointer;font-size:12.5px"><input type="checkbox" data-cat="' + ci + '" data-field="' + field + '" onchange="_importPickerUpdateCount()" style="cursor:pointer"><span style="font-family:Consolas,monospace;color:var(--gray-700)">' + field + '</span><span style="color:var(--gray-500);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:380px">' + (typeof obj[field] === 'string' ? '"' + obj[field].slice(0, 80) + '"' : JSON.stringify(obj[field]).slice(0, 80)) + '</span></label>'
            ).join('');
          }
          list.dataset.populated = '1';
        }
        list.style.display = 'block';
        expIcon.textContent = '▾ collapse';
      } else {
        list.style.display = 'none';
        expIcon.textContent = '▸ expand';
      }
    }

    function _importPickerToggleCategory(ci, checked) {
      // Ensure list is populated so checkboxes exist
      const list = document.getElementById('imp-list-' + ci);
      if (!list.dataset.populated) _importPickerToggleExpand(ci);
      list.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = checked);
      _importPickerUpdateCount();
    }

    function _importPickerSelectAll(checked) {
      const overlay = document.getElementById('import-picker-overlay');
      if (!overlay) return;
      window._importPickerData.categories.forEach((_, ci) => {
        const header = document.getElementById('imp-cat-' + ci);
        if (header) header.checked = checked;
        _importPickerToggleCategory(ci, checked);
      });
    }

    function _importPickerUpdateCount() {
      const overlay = document.getElementById('import-picker-overlay');
      if (!overlay) return;
      const checked = overlay.querySelectorAll('#import-picker-body input[type="checkbox"]:checked').length;
      // Update category-level checkbox state based on its children
      window._importPickerData.categories.forEach((cat, ci) => {
        const list = document.getElementById('imp-list-' + ci);
        const header = document.getElementById('imp-cat-' + ci);
        if (!list || !header || !list.dataset.populated) return;
        const childCbs = list.querySelectorAll('input[type="checkbox"]');
        const childChecked = list.querySelectorAll('input[type="checkbox"]:checked').length;
        if (childChecked === 0) { header.checked = false; header.indeterminate = false; }
        else if (childChecked === childCbs.length) { header.checked = true; header.indeterminate = false; }
        else { header.checked = false; header.indeterminate = true; }
      });
      const counter = document.getElementById('import-picker-count');
      if (counter) counter.textContent = checked + ' record' + (checked !== 1 ? 's' : '') + ' selected';
    }

    function _importPickerApply() {
      const overlay = document.getElementById('import-picker-overlay');
      if (!overlay) return;
      const ctx = window._importPickerData;
      let arrayAdded = 0, objectFieldsMerged = 0, keysTouched = 0;

      ctx.categories.forEach((cat, ci) => {
        const list = document.getElementById('imp-list-' + ci);
        if (!list || !list.dataset.populated) return; // not expanded → not selected
        if (cat.kind === 'array') {
          const picked = [];
          list.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
            const idx = parseInt(cb.dataset.idx, 10);
            if (!isNaN(idx)) picked.push(cat.items[idx]);
          });
          if (!picked.length) return;
          const existing = getData(cat.key) || [];
          const seen = new Set(existing.map(x => x && x.id).filter(Boolean));
          const merged = existing.slice();
          picked.forEach(x => {
            if (x && x.id && seen.has(x.id)) return;
            merged.push(x); arrayAdded++;
            if (x && x.id) seen.add(x.id);
          });
          setData(cat.key, merged); keysTouched++;
        } else if (cat.kind === 'object') {
          const obj = cat.items[0];
          const partial = {};
          list.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
            const field = cb.dataset.field;
            if (field) { partial[field] = obj[field]; objectFieldsMerged++; }
          });
          if (!Object.keys(partial).length) return;
          const existing = getData(cat.key) || {};
          setData(cat.key, Object.assign({}, existing, partial));
          keysTouched++;
        }
      });

      logActivity('system', 'Selective import — ' + keysTouched + ' keys, ' + arrayAdded + ' new records, ' + objectFieldsMerged + ' fields merged');
      overlay.remove();
      delete window._importPickerData;
      alert('Imported ' + arrayAdded + ' record' + (arrayAdded !== 1 ? 's' : '') + (objectFieldsMerged ? ' and ' + objectFieldsMerged + ' setting field' + (objectFieldsMerged !== 1 ? 's' : '') : '') + '.\n\nReloading…');
      location.reload();
    }

    function resetSystem() {
      if(!confirm('Delete ALL data and restore seed data? This cannot be undone.'))return;
      if(!confirm('Final confirmation — are you sure?'))return;
      ['initialized','incomeResults','confProfile','bizChecks','careerChecks','youthChecks','bizCreditChecks'].forEach(k=>localStorage.removeItem(k));
      initializeData(); alert('Reset complete.'); location.reload();
    }

    // ── REVENUE TRACKER ────────────────────────────────────────────────────────
    function renderRevenue() {
      const all = getData('revenue');
      const status = document.getElementById('rev-filter-status')?.value||'';
      const year = document.getElementById('rev-filter-year')?.value||'';
      let rows = all.filter(r => (!status||r.status===status) && (!year||r.date.startsWith(year)));
      rows.sort((a,b)=>b.date.localeCompare(a.date));

      // Stats
      const paid = all.filter(r=>r.status==='Paid').reduce((s,r)=>s+r.amount,0);
      const pending = all.filter(r=>r.status==='Pending').reduce((s,r)=>s+r.amount,0);
      const thisMonth = all.filter(r=>{const d=new Date(r.date);const n=new Date();return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear()&&r.status==='Paid';}).reduce((s,r)=>s+r.amount,0);
      const statsEl = document.getElementById('rev-stats');
      if (statsEl) statsEl.innerHTML = [
        {label:'Total Collected',val:'$'+paid.toLocaleString(),icon:'💰',color:'#10B981'},
        {label:'Outstanding',val:'$'+pending.toLocaleString(),icon:'⏳',color:'#F59E0B'},
        {label:'This Month',val:'$'+thisMonth.toLocaleString(),icon:'📅',color:'var(--brand-primary)'},
        {label:'Total Entries',val:all.length,icon:'📋',color:'#64748B'}
      ].map(s=>`<div class="stat-card" style="padding:20px"><div style="font-size:13px;font-weight:700;color:var(--gray-500);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">${s.icon} ${s.label}</div><div style="font-size:28px;font-weight:800;color:${s.color}">${s.val}</div></div>`).join('');

      const tbody = document.getElementById('rev-table-body');
      const tfoot = document.getElementById('rev-table-foot');
      if (!tbody) return;
      if (!rows.length) { tbody.innerHTML=`<tr><td colspan="7" style="padding:32px;text-align:center;color:var(--gray-400)">No revenue entries found.</td></tr>`; if(tfoot)tfoot.innerHTML=''; return; }
      tbody.innerHTML = rows.map(r=>`<tr style="border-bottom:1px solid var(--gray-100)">
        <td style="padding:12px">${new Date(r.date+'T00:00:00').toLocaleDateString()}</td>
        <td style="padding:12px;font-weight:600">${r.clientName||'—'}</td>
        <td style="padding:12px;color:var(--gray-600)">${r.serviceType||'—'}</td>
        <td style="padding:12px;font-family:monospace;font-size:13px">${r.invoiceNumber||'—'}</td>
        <td style="padding:12px;text-align:right;font-weight:700;color:${r.status==='Paid'?'#10B981':'#F59E0B'}">$${r.amount.toLocaleString()}</td>
        <td style="padding:12px;text-align:center"><span style="padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;background:${r.status==='Paid'?'rgba(16,185,129,0.1)':'rgba(245,158,11,0.1)'};color:${r.status==='Paid'?'#10B981':'#F59E0B'}">${r.status}</span></td>
        <td style="padding:12px;text-align:center"><button onclick="deleteRevenue('${r.id}')" class="btn btn-outline" style="padding:4px 10px;font-size:12px;color:var(--error);border-color:var(--error)">Delete</button></td>
      </tr>`).join('');
      const filtTotal = rows.reduce((s,r)=>s+r.amount,0);
      if (tfoot) tfoot.innerHTML = `<tr style="background:var(--gray-50);font-weight:700"><td colspan="4" style="padding:12px">Showing ${rows.length} of ${all.length} entries</td><td style="padding:12px;text-align:right">$${filtTotal.toLocaleString()}</td><td colspan="2"></td></tr>`;
    }

    function deleteRevenue(id) {
      if (!confirm('Delete this revenue entry?')) return;
      const rev = getData('revenue').filter(r=>r.id!==id);
      setData('revenue', rev);
      renderRevenue();
      updateDashboard();
    }

    function openAddRevenueModal() {
      let modal = document.getElementById('add-rev-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'add-rev-modal';
        modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px';
        modal.innerHTML = `<div style="background:#fff;border-radius:16px;padding:32px;width:100%;max-width:500px">
          <h3 style="font-size:20px;font-weight:700;margin-bottom:20px">+ Add Revenue Entry</h3>
          <div class="form-group"><label class="form-label">Client Name</label><input id="rev-client" class="form-input" style="margin:0" placeholder="Client or company name"></div>
          <div class="form-group" style="margin-top:12px"><label class="form-label">Service Type</label><input id="rev-service" class="form-input" style="margin:0" placeholder="e.g. Website Design, Consulting"></div>
          <div class="form-row" style="margin-top:12px">
            <div class="form-group"><label class="form-label">Amount ($)</label><input id="rev-amount" type="number" class="form-input" style="margin:0" placeholder="0.00"></div>
            <div class="form-group"><label class="form-label">Date</label><input id="rev-date" type="date" class="form-input" style="margin:0" value="${new Date().toISOString().split('T')[0]}"></div>
          </div>
          <div class="form-row" style="margin-top:12px">
            <div class="form-group"><label class="form-label">Invoice #</label><input id="rev-inv" class="form-input" style="margin:0" placeholder="INV-xxx"></div>
            <div class="form-group"><label class="form-label">Status</label><select id="rev-status" class="form-select"><option value="Paid">Paid</option><option value="Pending">Pending</option></select></div>
          </div>
          <div style="display:flex;gap:10px;margin-top:20px">
            <button onclick="saveRevenue()" class="btn btn-solid" style="flex:1">Save Entry</button>
            <button onclick="document.getElementById('add-rev-modal').remove()" class="btn btn-outline" style="flex:1">Cancel</button>
          </div>
        </div>`;
        document.body.appendChild(modal);
      }
      modal.style.display = 'flex';
    }

    function saveRevenue() {
      const client = document.getElementById('rev-client')?.value.trim();
      const amount = parseFloat(document.getElementById('rev-amount')?.value||0);
      if (!client||!amount) { alert('Client name and amount are required.'); return; }
      const entry = {
        id: generateId(),
        clientId: '', clientName: client,
        amount, date: document.getElementById('rev-date')?.value||new Date().toISOString().split('T')[0],
        status: document.getElementById('rev-status')?.value||'Paid',
        serviceType: document.getElementById('rev-service')?.value.trim()||'',
        invoiceNumber: document.getElementById('rev-inv')?.value.trim()||'INV-'+Date.now().toString(36).toUpperCase()
      };
      const rev = getData('revenue'); rev.unshift(entry); setData('revenue', rev);
      document.getElementById('add-rev-modal').remove();
      renderRevenue(); updateDashboard();
      logActivity('revenue','Added revenue entry: $'+amount+' from '+client);
      showToast('Revenue entry saved', 'success');
    }

    // ── STATE RESOURCES ────────────────────────────────────────────────────────
    const STATES_DATA = [
      {name:'Alabama',abbr:'AL',fee:200,annual:'$10/yr',time:'3-7 days',sos:'sos.alabama.gov',notes:'Biennial report required.'},
      {name:'Alaska',abbr:'AK',fee:250,annual:'$100/2yrs',time:'10-15 days',sos:'commerce.alaska.gov',notes:'Biennial report due every 2 years.'},
      {name:'Arizona',abbr:'AZ',fee:50,annual:'None',time:'Same day',sos:'azcc.gov',notes:'No annual report — great for low-overhead LLCs.'},
      {name:'Arkansas',abbr:'AR',fee:45,annual:'$150/yr',time:'1-3 days',sos:'sos.arkansas.gov',notes:'Annual franchise tax report required.'},
      {name:'California',abbr:'CA',fee:70,annual:'$800 min tax',time:'3-5 days',sos:'sos.ca.gov',notes:'Flat $800/yr minimum franchise tax. High cost state.'},
      {name:'Colorado',abbr:'CO',fee:50,annual:'$10/yr',time:'Same day',sos:'sos.state.co.us',notes:'Very affordable. Online filing is instant.'},
      {name:'Connecticut',abbr:'CT',fee:120,annual:'$80/yr',time:'3-5 days',sos:'portal.ct.gov',notes:'Annual report due every year.'},
      {name:'Delaware',abbr:'DE',fee:90,annual:'$300/yr',time:'Same day',sos:'corp.delaware.gov',notes:'Top choice for investors and corporations. Strong privacy laws.'},
      {name:'Florida',abbr:'FL',fee:125,annual:'$138.75/yr',time:'1-3 days',sos:'dos.myflorida.com',notes:'H.E.L.P. Center home state. Annual report due May 1.'},
      {name:'Georgia',abbr:'GA',fee:100,annual:'$50/yr',time:'1-3 days',sos:'sos.ga.gov',notes:'Annual registration required.'},
      {name:'Hawaii',abbr:'HI',fee:50,annual:'$15/yr',time:'3-5 days',sos:'cca.hawaii.gov',notes:'Low annual fee but remote location costs apply.'},
      {name:'Idaho',abbr:'ID',fee:100,annual:'$0',time:'1-3 days',sos:'sos.idaho.gov',notes:'No annual report fee — just annual report filing.'},
      {name:'Illinois',abbr:'IL',fee:150,annual:'$75/yr',time:'1-5 days',sos:'ilsos.gov',notes:'Annual report required.'},
      {name:'Indiana',abbr:'IN',fee:95,annual:'$50/yr',time:'1-3 days',sos:'sos.in.gov',notes:'Biennial report every 2 years.'},
      {name:'Iowa',abbr:'IA',fee:50,annual:'$60/2yrs',time:'1-3 days',sos:'sos.iowa.gov',notes:'Biennial report required.'},
      {name:'Kansas',abbr:'KS',fee:160,annual:'$55/yr',time:'1-3 days',sos:'sos.ks.gov',notes:'Annual report due.'},
      {name:'Kentucky',abbr:'KY',fee:40,annual:'$15/yr',time:'1-3 days',sos:'sos.ky.gov',notes:'Lowest formation fee in the Southeast.'},
      {name:'Louisiana',abbr:'LA',fee:100,annual:'$30/yr',time:'3-5 days',sos:'sos.la.gov',notes:'Annual report required.'},
      {name:'Maine',abbr:'ME',fee:175,annual:'$85/yr',time:'3-7 days',sos:'maine.gov/sos',notes:'Annual report required.'},
      {name:'Maryland',abbr:'MD',fee:100,annual:'$300/yr',time:'1-3 days',sos:'dat.maryland.gov',notes:'Personal property report + $300 annual fee.'},
      {name:'Massachusetts',abbr:'MA',fee:500,annual:'$500/yr',time:'1-3 days',sos:'corp.sec.state.ma.us',notes:'High cost — $500 to file and $500 annually.'},
      {name:'Michigan',abbr:'MI',fee:50,annual:'$25/yr',time:'1-3 days',sos:'michigan.gov/sos',notes:'Very affordable. Annual statement required.'},
      {name:'Minnesota',abbr:'MN',fee:155,annual:'$0',time:'1-3 days',sos:'sos.state.mn.us',notes:'No annual report required after formation.'},
      {name:'Mississippi',abbr:'MS',fee:50,annual:'$0',time:'1-5 days',sos:'sos.ms.gov',notes:'No annual report required — very affordable.'},
      {name:'Missouri',abbr:'MO',fee:50,annual:'$0',time:'1-3 days',sos:'sos.mo.gov',notes:'No annual report required.'},
      {name:'Montana',abbr:'MT',fee:35,annual:'$20/yr',time:'1-3 days',sos:'sos.mt.gov',notes:'One of the lowest formation fees in the US.'},
      {name:'Nebraska',abbr:'NE',fee:100,annual:'$13/yr',time:'1-3 days',sos:'sos.ne.gov',notes:'Very low annual fee.'},
      {name:'Nevada',abbr:'NV',fee:425,annual:'$350/yr',time:'1-3 days',sos:'nvsos.gov',notes:'Privacy-friendly but high fees. Wyoming is better for most.'},
      {name:'New Hampshire',abbr:'NH',fee:100,annual:'$100/yr',time:'1-5 days',sos:'sos.nh.gov',notes:'Annual report required.'},
      {name:'New Jersey',abbr:'NJ',fee:125,annual:'$75/yr',time:'1-3 days',sos:'njportal.com',notes:'Annual report required.'},
      {name:'New Mexico',abbr:'NM',fee:50,annual:'$0',time:'1-3 days',sos:'sos.nm.gov',notes:'No annual report. Great privacy — members not required to be listed publicly.'},
      {name:'New York',abbr:'NY',fee:200,annual:'$9/2yrs',time:'1-3 days',sos:'dos.ny.gov',notes:'Publication requirement adds ~$1,500 in NYC. Avoid for new LLCs.'},
      {name:'North Carolina',abbr:'NC',fee:125,annual:'$202/yr',time:'1-3 days',sos:'sosnc.gov',notes:'Annual report required.'},
      {name:'North Dakota',abbr:'ND',fee:135,annual:'$50/yr',time:'1-5 days',sos:'sos.nd.gov',notes:'Annual report required.'},
      {name:'Ohio',abbr:'OH',fee:99,annual:'$0',time:'1-3 days',sos:'sos.state.oh.us',notes:'No annual report required after formation.'},
      {name:'Oklahoma',abbr:'OK',fee:100,annual:'$25/yr',time:'1-5 days',sos:'sos.ok.gov',notes:'Annual certificate of compliance required.'},
      {name:'Oregon',abbr:'OR',fee:100,annual:'$100/yr',time:'1-3 days',sos:'sos.oregon.gov',notes:'Annual report required.'},
      {name:'Pennsylvania',abbr:'PA',fee:125,annual:'$7/yr',time:'1-5 days',sos:'dos.pa.gov',notes:'Decennial report every 10 years.'},
      {name:'Rhode Island',abbr:'RI',fee:150,annual:'$50/yr',time:'1-5 days',sos:'sos.ri.gov',notes:'Annual report required.'},
      {name:'South Carolina',abbr:'SC',fee:110,annual:'$0',time:'1-5 days',sos:'sos.sc.gov',notes:'No annual report required.'},
      {name:'South Dakota',abbr:'SD',fee:150,annual:'$50/yr',time:'1-3 days',sos:'sdsos.gov',notes:'Annual report required.'},
      {name:'Tennessee',abbr:'TN',fee:300,annual:'$300/yr',time:'1-3 days',sos:'sos.tn.gov',notes:'High fees. Annual report required.'},
      {name:'Texas',abbr:'TX',fee:300,annual:'Franchise Tax',time:'1-3 days',sos:'sos.state.tx.us',notes:'Franchise tax based on revenue — no-tax threshold for small businesses.'},
      {name:'Utah',abbr:'UT',fee:54,annual:'$18/yr',time:'Same day',sos:'corporations.utah.gov',notes:'Very affordable. Annual renewal required.'},
      {name:'Vermont',abbr:'VT',fee:125,annual:'$35/yr',time:'1-5 days',sos:'sos.vermont.gov',notes:'Annual report required.'},
      {name:'Virginia',abbr:'VA',fee:100,annual:'$50/yr',time:'1-3 days',sos:'sos.virginia.gov',notes:'Annual registration fee.'},
      {name:'Washington',abbr:'WA',fee:200,annual:'$60/yr',time:'1-5 days',sos:'sos.wa.gov',notes:'Annual report required.'},
      {name:'West Virginia',abbr:'WV',fee:100,annual:'$25/yr',time:'1-5 days',sos:'sos.wv.gov',notes:'Annual report required.'},
      {name:'Wisconsin',abbr:'WI',fee:130,annual:'$25/yr',time:'1-3 days',sos:'wdfi.wi.gov',notes:'Annual report required.'},
      {name:'Wyoming',abbr:'WY',fee:100,annual:'$60 min/yr',time:'Same day',sos:'wysos.gov',notes:'Top choice for privacy — no public member list. Holding companies love Wyoming.'}
    ];

    function renderStates(data) {
      const grid = document.getElementById('states-grid');
      if (!grid) return;
      const items = data || STATES_DATA;
      if (!items.length) { grid.innerHTML = '<div class="card">No states match your search.</div>'; return; }
      const feeColor = f => f < 100 ? '#10B981' : f < 200 ? '#F59E0B' : '#EF4444';
      grid.innerHTML = items.map(s => `<div class="card" style="padding:18px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <div><span style="font-size:13px;font-weight:700;background:var(--accent);color:#fff;padding:2px 8px;border-radius:4px;margin-right:8px">${s.abbr}</span><strong style="font-size:15px">${s.name}</strong></div>
          <span style="font-size:18px;font-weight:800;color:${feeColor(s.fee)}">$${s.fee}</span>
        </div>
        <div style="font-size:12px;color:var(--gray-500);display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px">
          <div>📅 Annual: <strong>${s.annual}</strong></div>
          <div>⚡ Time: <strong>${s.time}</strong></div>
        </div>
        <p style="font-size:13px;color:var(--gray-600);margin-bottom:10px;line-height:1.6">${s.notes}</p>
        <a href="https://${s.sos}" target="_blank" rel="noopener" style="font-size:13px;color:var(--accent);font-weight:600">Visit SOS Site →</a>
      </div>`).join('');
    }

    function filterStates() {
      const search = (document.getElementById('state-search')?.value||'').toLowerCase();
      const feeRange = document.getElementById('state-filter-fee')?.value||'';
      let data = STATES_DATA.filter(s => {
        const matchSearch = !search || s.name.toLowerCase().includes(search) || s.abbr.toLowerCase().includes(search) || s.notes.toLowerCase().includes(search);
        const matchFee = !feeRange || (feeRange==='low'&&s.fee<100) || (feeRange==='mid'&&s.fee>=100&&s.fee<=200) || (feeRange==='high'&&s.fee>200);
        return matchSearch && matchFee;
      });
      renderStates(data);
    }

    // ══════════════════════════════════════════════════════════════
    // CALENDAR SYSTEM — Full overhaul with Day/Week/Month/Year views
    // ══════════════════════════════════════════════════════════════

    let calCurrentDate = new Date();
    let calView = 'month';

    const EVENT_COLORS = [
      { label:'Blue',   value:'var(--brand-primary)' },
      { label:'Green',  value:'#10B981' },
      { label:'Gold',   value:'#C9A84C' },
      { label:'Red',    value:'#EF4444' },
      { label:'Purple', value:'#8B5CF6' },
      { label:'Pink',   value:'#EC4899' },
    ];

    const EVENT_TYPES = ['Meeting','Appointment','Deadline','Follow-Up','Workshop','Payment','Invoice','Call','Other'];
    const EVENT_RECURRENCES = [
      { value:'none',     label:'Does not repeat' },
      { value:'daily',    label:'Daily' },
      { value:'weekly',   label:'Weekly' },
      { value:'biweekly', label:'Every 2 weeks' },
      { value:'monthly',  label:'Monthly (same day)' },
      { value:'yearly',   label:'Yearly' }
    ];
    // Cap each recurrence type so a single Save can't accidentally create
    // thousands of rows in localStorage.
    const EVENT_RECURRENCE_MAX = { daily: 365, weekly: 104, biweekly: 52, monthly: 60, yearly: 10 };

    function getEvents() { return JSON.parse(localStorage.getItem('calEvents')||'[]'); }
    function saveEvents(ev) { setData('calEvents', ev); }

    function calGoToday() { calCurrentDate = new Date(); renderCalendar(); }

    function calNav(dir) {
      if (calView === 'day')   calCurrentDate.setDate(calCurrentDate.getDate() + dir);
      else if (calView === 'week') calCurrentDate.setDate(calCurrentDate.getDate() + dir*7);
      else if (calView === 'month') calCurrentDate.setMonth(calCurrentDate.getMonth() + dir);
      else if (calView === 'year') calCurrentDate.setFullYear(calCurrentDate.getFullYear() + dir);
      renderCalendar();
    }

    function setCalView(view, btn) {
      calView = view;
      document.querySelectorAll('[id^="cal-view-"]').forEach(b => {
        b.style.background = 'none'; b.style.boxShadow = 'none'; b.style.color = 'var(--gray-500)';
      });
      if (btn) { btn.style.background = '#fff'; btn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; btn.style.color = 'var(--gray-900)'; }
      renderCalendar();
    }

    function renderCalendar() {
      updateCalLabel();
      renderUpcomingEvents();
      const view = document.getElementById('cal-main-view');
      if (!view) return;
      if (calView === 'day')   renderDayView(view);
      else if (calView === 'week')  renderWeekView(view);
      else if (calView === 'month') renderMonthView(view);
      else if (calView === 'year')  renderYearView(view);
    }

    function updateCalLabel() {
      const el = document.getElementById('cal-month-label');
      if (!el) return;
      const opts = { month:'long', year:'numeric' };
      if (calView === 'day') el.textContent = calCurrentDate.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});
      else if (calView === 'week') {
        const start = new Date(calCurrentDate); start.setDate(start.getDate() - start.getDay());
        const end = new Date(start); end.setDate(end.getDate() + 6);
        el.textContent = start.toLocaleDateString('en-US',{month:'short',day:'numeric'}) + ' – ' + end.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
      }
      else if (calView === 'month') el.textContent = calCurrentDate.toLocaleDateString('en-US', opts);
      else el.textContent = calCurrentDate.getFullYear().toString();
    }

    function getEventsForDate(ds) {
      return getEvents().filter(e => e.date === ds);
    }

    function dateStr(d) {
      return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
    }

    // ── DAY VIEW ──────────────────────────────────────────────────
    function renderDayView(container) {
      const events = getEventsForDate(dateStr(calCurrentDate));
      const hours = [];
      for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 30) {
          const timeLabel = (h === 0 ? 12 : h > 12 ? h-12 : h) + ':' + (m===0?'00':'30') + ' ' + (h < 12 ? 'AM' : 'PM');
          const timeKey = String(h).padStart(2,'0') + ':' + (m===0?'00':'30');
          const slotEvents = events.filter(e => e.time && e.time.startsWith(timeKey));
          hours.push(
            '<div style="display:grid;grid-template-columns:70px 1fr;min-height:40px;border-bottom:1px solid var(--gray-100)">' +
            '<div style="padding:8px 10px;font-size:11px;color:var(--gray-400);font-weight:500;border-right:1px solid var(--gray-100);background:var(--gray-50)">' + (m===0?timeLabel:'') + '</div>' +
            '<div style="padding:4px 8px;position:relative">' +
            slotEvents.map(ev => '<div onclick="openEditEventModal(\''+ev.id+'\')" style="background:'+(ev.color||'var(--brand-primary)')+';color:#fff;border-radius:4px;padding:3px 8px;font-size:12px;font-weight:600;cursor:pointer;margin-bottom:2px">'+ev.title+'</div>').join('') +
            '</div></div>'
          );
        }
      }
      container.innerHTML =
        '<div style="padding:14px 16px;border-bottom:2px solid var(--gray-200);background:var(--gray-50)">' +
        '<div style="font-weight:700;font-size:15px">' + calCurrentDate.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}) + '</div>' +
        '<div style="font-size:13px;color:var(--gray-500)">' + events.length + ' event' + (events.length!==1?'s':'') + '</div>' +
        '</div>' +
        '<div style="overflow-y:auto;max-height:600px">' + hours.join('') + '</div>';
    }

    // ── WEEK VIEW ─────────────────────────────────────────────────
    function renderWeekView(container) {
      const startOfWeek = new Date(calCurrentDate);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const days = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek); d.setDate(d.getDate() + i);
        days.push(d);
      }
      const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      const todayStr = dateStr(new Date());

      const dayHeaders = days.map((d,i) => {
        const isToday = dateStr(d) === todayStr;
        return '<div style="text-align:center;padding:10px 4px;border-right:1px solid var(--gray-100);font-size:12px">' +
          '<div style="font-weight:600;color:var(--gray-500)">' + DAY_NAMES[i] + '</div>' +
          '<div style="width:28px;height:28px;border-radius:50%;' + (isToday?'background:var(--brand-primary);color:#fff;':'') + 'font-weight:700;font-size:14px;display:flex;align-items:center;justify-content:center;margin:4px auto">' + d.getDate() + '</div>' +
          '</div>';
      }).join('');

      const hourRows = [];
      for (let h = 6; h < 22; h++) {
        for (let m = 0; m < 60; m += 30) {
          const timeLabel = (h===0?12:h>12?h-12:h)+':'+(m===0?'00':'30')+' '+(h<12?'AM':'PM');
          const timeKey = String(h).padStart(2,'0')+':'+(m===0?'00':'30');
          const cells = days.map(d => {
            const ev = getEventsForDate(dateStr(d)).filter(e => e.time && e.time.startsWith(timeKey));
            return '<div style="border-right:1px solid var(--gray-100);padding:2px 4px;min-height:36px">' +
              ev.map(e => '<div onclick="openEditEventModal(\''+e.id+'\')" style="background:'+(e.color||'var(--brand-primary)')+';color:#fff;border-radius:3px;padding:2px 6px;font-size:11px;font-weight:600;cursor:pointer;margin-bottom:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+e.title+'</div>').join('') +
              '</div>';
          }).join('');
          hourRows.push('<div style="display:grid;grid-template-columns:60px repeat(7,1fr);border-bottom:1px solid var(--gray-100)">' +
            '<div style="padding:4px 6px;font-size:10px;color:var(--gray-400);border-right:1px solid var(--gray-100);background:var(--gray-50)">' + (m===0?timeLabel:'') + '</div>' +
            cells + '</div>');
        }
      }

      container.innerHTML =
        '<div style="display:grid;grid-template-columns:60px repeat(7,1fr);border-bottom:2px solid var(--gray-200);background:var(--gray-50)">' +
        '<div></div>' + dayHeaders + '</div>' +
        '<div style="overflow-y:auto;max-height:580px">' + hourRows.join('') + '</div>';
    }

    // ── MONTH VIEW ────────────────────────────────────────────────
    function renderMonthView(container) {
      const year = calCurrentDate.getFullYear();
      const month = calCurrentDate.getMonth();
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month+1, 0).getDate();
      const todayStr = dateStr(new Date());
      const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

      let cells = '';
      for (let i = 0; i < firstDay; i++) cells += '<div style="min-height:90px;border-right:1px solid var(--gray-100);border-bottom:1px solid var(--gray-100);background:var(--gray-50)"></div>';

      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        const ds = dateStr(date);
        const isToday = ds === todayStr;
        const dayEvents = getEventsForDate(ds);
        cells +=
          '<div onclick="calClickDay(\''+ds+'\')" style="min-height:90px;border-right:1px solid var(--gray-100);border-bottom:1px solid var(--gray-100);padding:6px;cursor:pointer;transition:background 0.1s" onmouseover="this.style.background=\'var(--gray-50)\'" onmouseout="this.style.background=\'\'">' +
          '<div style="width:26px;height:26px;border-radius:50%;' + (isToday?'background:var(--brand-primary);color:#fff;':'color:var(--gray-700);') + 'font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center;margin-bottom:4px">' + d + '</div>' +
          dayEvents.slice(0,3).map(ev => '<div style="background:'+(ev.color||'var(--brand-primary)')+';color:#fff;border-radius:3px;padding:2px 6px;font-size:11px;font-weight:600;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+ev.title+'</div>').join('') +
          (dayEvents.length>3?'<div style="font-size:10px;color:var(--gray-400);font-weight:600">+'+(dayEvents.length-3)+' more</div>':'') +
          '</div>';
      }

      container.innerHTML =
        '<div style="display:grid;grid-template-columns:repeat(7,1fr);background:var(--gray-50);border-bottom:2px solid var(--gray-200)">' +
        DAY_NAMES.map(d => '<div style="padding:10px;text-align:center;font-size:12px;font-weight:700;color:var(--gray-500)">'+d+'</div>').join('') +
        '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(7,1fr)">' + cells + '</div>';
    }

    // ── YEAR VIEW ─────────────────────────────────────────────────
    function renderYearView(container) {
      const year = calCurrentDate.getFullYear();
      const months = [];
      const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      const todayStr = dateStr(new Date());

      for (let m = 0; m < 12; m++) {
        const firstDay = new Date(year, m, 1).getDay();
        const daysInMonth = new Date(year, m+1, 0).getDate();
        let cells = '';
        for (let i = 0; i < firstDay; i++) cells += '<div></div>';
        for (let d = 1; d <= daysInMonth; d++) {
          const ds = year+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
          const hasEvents = getEventsForDate(ds).length > 0;
          const isToday = ds === todayStr;
          cells += '<div onclick="calClickDay(\''+ds+'\')" style="width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;cursor:pointer;'+(isToday?'background:var(--brand-primary);color:#fff;font-weight:700;':hasEvents?'background:var(--gold-dim);color:var(--gray-900);font-weight:600;':'color:var(--gray-600);')+'">'+d+'</div>';
        }
        months.push(
          '<div style="padding:14px">' +
          '<div style="font-size:13px;font-weight:700;margin-bottom:8px;color:var(--gray-700)">'+MONTH_NAMES[m]+'</div>' +
          '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;font-size:10px;color:var(--gray-400);font-weight:600;margin-bottom:4px">' +
          ['S','M','T','W','T','F','S'].map(d=>'<div style="text-align:center">'+d+'</div>').join('') +
          '</div>' +
          '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px">'+cells+'</div>' +
          '</div>'
        );
      }

      container.innerHTML = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0;border-top:1px solid var(--gray-100)">' +
        months.map((m,i) => '<div style="border-right:'+(i%4!==3?'1px solid var(--gray-100)':'none')+';border-bottom:1px solid var(--gray-100)">'+m+'</div>').join('') +
        '</div>';
    }

    function calClickDay(ds) {
      const d = new Date(ds+'T12:00:00');
      calCurrentDate = d;
      setCalView('day', document.getElementById('cal-view-day'));
    }

    // ── UPCOMING EVENTS ───────────────────────────────────────────
    function renderUpcomingEvents() {
      const el = document.getElementById('cal-upcoming');
      if (!el) return;
      const today = new Date(); today.setHours(0,0,0,0);
      const events = getEvents()
        .filter(e => new Date(e.date+'T12:00:00') >= today)
        .sort((a,b) => a.date.localeCompare(b.date))
        .slice(0,10);
      if (!events.length) { el.innerHTML = '<div style="color:var(--gray-400);font-size:13px;text-align:center;padding:20px 0">No upcoming events</div>'; return; }
      el.innerHTML = events.map(e =>
        '<div onclick="openEditEventModal(\''+e.id+'\')" style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--gray-100);cursor:pointer;align-items:start" onmouseover="this.style.opacity=\'.7\'" onmouseout="this.style.opacity=\'1\'">' +
        '<div style="width:4px;border-radius:2px;background:'+(e.color||'var(--brand-primary)')+';align-self:stretch;flex-shrink:0"></div>' +
        '<div style="flex:1;min-width:0">' +
        '<div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+e.title+'</div>' +
        '<div style="font-size:11px;color:var(--gray-500)">'+new Date(e.date+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'})+(e.time?' · '+formatTime(e.time):'')+'</div>' +
        (e.type?'<div style="font-size:10px;font-weight:700;color:var(--gray-400);text-transform:uppercase;margin-top:1px">'+e.type+'</div>':'') +
        '</div></div>'
      ).join('');
    }

    function formatTime(t) {
      if (!t) return '';
      const [h,m] = t.split(':').map(Number);
      return (h===0?12:h>12?h-12:h)+':'+String(m).padStart(2,'0')+' '+(h<12?'AM':'PM');
    }

    // ── ADD / EDIT EVENT MODAL ────────────────────────────────────
    function openAddEventModal(ds) {
      // If no date is passed but the calendar is focused on a specific day
      // (user clicked a cell), pre-fill the modal with that date.
      if (!ds && typeof calCurrentDate !== 'undefined' && calCurrentDate) {
        const y = calCurrentDate.getFullYear();
        const m = String(calCurrentDate.getMonth() + 1).padStart(2, '0');
        const d = String(calCurrentDate.getDate()).padStart(2, '0');
        ds = y + '-' + m + '-' + d;
      }
      openEventModal(null, ds);
    }

    function openEditEventModal(id) {
      openEventModal(getEvents().find(e => e.id === id));
    }

    function openEventModal(event, prefillDate) {
      const isEdit = !!event;
      let modal = document.getElementById('event-modal');
      if (!modal) { modal = document.createElement('div'); modal.id = 'event-modal'; document.body.appendChild(modal); }
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px';
      modal.innerHTML =
        '<div style="background:#fff;border-radius:12px;width:100%;max-width:500px;padding:28px;box-shadow:0 24px 48px rgba(0,0,0,0.2)">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">' +
        '<h3 style="font-size:18px;font-weight:700">'+(isEdit?'Edit Event':'New Event')+'</h3>' +
        '<button onclick="document.getElementById(\'event-modal\').remove()" style="background:none;border:1px solid var(--gray-200);width:32px;height:32px;border-radius:6px;cursor:pointer">✕</button>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">' +
        '<div style="grid-column:1/-1"><label class="form-label">Event Title</label><input id="em-title" class="form-input" style="margin:0" placeholder="e.g. Client Call — Joy" value="'+(isEdit?event.title:'')+'"></div>' +
        '<div><label class="form-label">Date</label><input id="em-date" type="date" class="form-input" style="margin:0" value="'+(isEdit?event.date:(prefillDate||''))+'"></div>' +
        '<div><label class="form-label">Time</label><input id="em-time" type="time" class="form-input" style="margin:0" value="'+(isEdit?(event.time||''):'09:00')+'"></div>' +
        '<div><label class="form-label">End Time</label><input id="em-endtime" type="time" class="form-input" style="margin:0" value="'+(isEdit?(event.endTime||''):'10:00')+'"></div>' +
        '<div><label class="form-label">Type</label>' +
        '<select id="em-type" class="form-select" style="margin:0">' +
        EVENT_TYPES.map(t => '<option'+(isEdit&&event.type===t?' selected':'')+'>'+t+'</option>').join('') +
        '</select></div>' +
        '<div><label class="form-label">Repeat</label>' +
        '<select id="em-recurrence" class="form-select" style="margin:0" onchange="document.getElementById(\'em-recurrence-count-wrap\').style.display=this.value===\'none\'?\'none\':\'block\'">' +
        EVENT_RECURRENCES.map(r => '<option value="'+r.value+'"'+(isEdit&&(event.recurrence||'none')===r.value?' selected':'')+'>'+r.label+'</option>').join('') +
        '</select></div>' +
        '<div id="em-recurrence-count-wrap" style="grid-column:1/-1;'+(isEdit&&event.recurrence&&event.recurrence!=='none'?'':'display:none')+'"><label class="form-label">For how many occurrences (including this one)</label><input id="em-recurrence-count" type="number" min="2" max="365" class="form-input" style="margin:0" value="'+(isEdit&&event.recurrenceCount?event.recurrenceCount:'12')+'"></div>' +
        '<div style="grid-column:1/-1"><label class="form-label">Color</label>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px">' +
        EVENT_COLORS.map(c => '<div onclick="selectEventColor(\''+c.value+'\',this)" data-color="'+c.value+'" style="width:28px;height:28px;border-radius:50%;background:'+c.value+';cursor:pointer;border:3px solid '+(isEdit&&event.color===c.value?'#0F172A':'transparent')+';transition:border 0.1s" title="'+c.label+'"></div>').join('') +
        '</div>' +
        '<input type="hidden" id="em-color" value="'+(isEdit?(event.color||'var(--brand-primary)'):'var(--brand-primary)')+'"></div>' +
        '<div style="grid-column:1/-1"><label class="form-label">Description / Notes</label><textarea id="em-desc" class="form-input" style="margin:0;height:70px;resize:vertical" placeholder="Meeting agenda, location, prep notes...">'+(isEdit?(event.description||''):'')+'</textarea></div>' +
        '<div style="grid-column:1/-1"><label class="form-label">Location / Link</label><input id="em-location" class="form-input" style="margin:0" placeholder="Office, Zoom link, phone number..." value="'+(isEdit?(event.location||''):'')+'"></div>' +
        '</div>' +
        '<div style="display:flex;gap:10px;margin-top:18px">' +
        '<button onclick="saveEvent(\''+(isEdit?event.id:'')+'\''+')" class="btn-primary" style="flex:1">'+(isEdit?'Save Changes':'Add Event')+'</button>' +
        (isEdit?'<button onclick="deleteEvent(\''+event.id+'\')" style="padding:14px 16px;background:none;border:1px solid var(--error);color:var(--error);border-radius:8px;cursor:pointer">Delete</button>':'') +
        '<button onclick="document.getElementById(\'event-modal\').remove()" style="padding:14px 16px;background:none;border:1px solid var(--gray-300);border-radius:8px;cursor:pointer">Cancel</button>' +
        '</div></div>';
      setTimeout(() => {
        const color = isEdit ? (event.color||'var(--brand-primary)') : 'var(--brand-primary)';
        document.querySelectorAll('[data-color]').forEach(dot => {
          dot.style.border = dot.dataset.color === color ? '3px solid #0F172A' : '3px solid transparent';
        });
      }, 10);
    }

    function selectEventColor(color, el) {
      document.querySelectorAll('[data-color]').forEach(d => d.style.border = '3px solid transparent');
      el.style.border = '3px solid #0F172A';
      const inp = document.getElementById('em-color');
      if (inp) inp.value = color;
    }

    function saveEvent(editId) {
      const title = (document.getElementById('em-title')?.value||'').trim();
      if (!title) { alert('Event title is required.'); return; }
      const events = getEvents();
      const recurrence = (document.getElementById('em-recurrence')?.value || 'none');
      const recurrenceCount = Math.max(1, Math.min(parseInt(document.getElementById('em-recurrence-count')?.value || '12', 10) || 1, EVENT_RECURRENCE_MAX[recurrence] || 1));
      const entry = {
        id: editId || 'ev-'+generateId(),
        title,
        date: document.getElementById('em-date')?.value||'',
        time: document.getElementById('em-time')?.value||'',
        endTime: document.getElementById('em-endtime')?.value||'',
        type: document.getElementById('em-type')?.value||'',
        color: document.getElementById('em-color')?.value||'var(--brand-primary)',
        description: document.getElementById('em-desc')?.value||'',
        location: document.getElementById('em-location')?.value||'',
        recurrence,
        recurrenceCount: recurrence === 'none' ? 0 : recurrenceCount
      };
      if (editId) {
        // Editing an existing event: in-place update, do NOT regenerate series.
        // Series-level edits would need a separate UX; for now treat each occurrence as independent.
        const i = events.findIndex(e=>e.id===editId);
        if(i>-1) { entry.seriesId = events[i].seriesId; events[i]=entry; }
        saveEvents(events);
      } else if (recurrence === 'none' || recurrenceCount <= 1) {
        events.push(entry);
        saveEvents(events);
      } else {
        // New recurring event: expand into N occurrences sharing a seriesId.
        const seriesId = 'srs-'+generateId();
        if (!entry.date) { alert('Date is required for a recurring event.'); return; }
        const base = new Date(entry.date + 'T12:00:00'); // noon to dodge DST edges
        if (isNaN(base.getTime())) { alert('Invalid date.'); return; }
        for (let i = 0; i < recurrenceCount; i++) {
          const occDate = new Date(base.getTime());
          if (recurrence === 'daily')    occDate.setDate(base.getDate() + i);
          if (recurrence === 'weekly')   occDate.setDate(base.getDate() + 7 * i);
          if (recurrence === 'biweekly') occDate.setDate(base.getDate() + 14 * i);
          if (recurrence === 'monthly')  occDate.setMonth(base.getMonth() + i);
          if (recurrence === 'yearly')   occDate.setFullYear(base.getFullYear() + i);
          const yyyy = occDate.getFullYear();
          const mm = String(occDate.getMonth() + 1).padStart(2, '0');
          const dd = String(occDate.getDate()).padStart(2, '0');
          events.push(Object.assign({}, entry, {
            id: i === 0 ? entry.id : ('ev-'+generateId()),
            date: yyyy + '-' + mm + '-' + dd,
            seriesId,
            seriesOriginal: i === 0,
            seriesIndex: i + 1,
            seriesTotal: recurrenceCount
          }));
        }
        saveEvents(events);
      }
      document.getElementById('event-modal').remove();
      renderCalendar();
      const msg = editId ? 'Event updated!'
        : (recurrence !== 'none' && recurrenceCount > 1)
          ? recurrenceCount + ' recurring events added!'
          : 'Event added!';
      showToast(msg, 'success');
    }

    function deleteEvent(id) {
      const events = getEvents();
      const ev = events.find(e => e.id === id);
      if (!ev) return;
      // Series-aware delete: offer to wipe the whole series if this event is part of one.
      if (ev.seriesId) {
        const total = events.filter(e => e.seriesId === ev.seriesId).length;
        const choice = confirm('This is one of ' + total + ' recurring events.\n\nOK = delete ALL ' + total + ' in the series\nCancel = keep, but delete just this one');
        if (choice) {
          if (!confirm('Delete ALL ' + total + ' events in the series?')) return;
          saveEvents(events.filter(e => e.seriesId !== ev.seriesId));
          showToast('Deleted ' + total + ' events in the series', 'success');
        } else {
          if (!confirm('Delete just this one occurrence?')) return;
          saveEvents(events.filter(e => e.id !== id));
          showToast('Event deleted', 'success');
        }
      } else {
        if (!confirm('Delete this event?')) return;
        saveEvents(events.filter(e => e.id !== id));
        showToast('Event deleted', 'success');
      }
      const modal = document.getElementById('event-modal');
      if (modal) modal.remove();
      renderCalendar();
    }

        const LIBRARY_IDEAS = [
  {
    id:'lib-001', icon:'🍃', title:'Mobile Herbal Apothecary', rating:4.9,
    revenue:'$500-$5,000/mo', launch:'60 days', cost:'$1,000-$5,000', difficulty:'Intermediate',
    tags:['Wellness','Community','Mobile','Products'],
    description:'A mobile apothecary serving herbal teas, tinctures, and salves at farmers markets, community events, and wellness fairs. Rooted in natural healing traditions.',
    plan:`<h3>Business Concept</h3><p>A mobile herbal apothecary can operate from a compact setup — a bicycle cart, retrofitted van, or pop-up tent — serving herbal teas, tinctures, salves, and botanical remedies directly to the community. It bridges traditional herbal wisdom with modern wellness culture.</p>
<h3>60-Day Launch Plan</h3>
<ul><li><strong>Week 1-2:</strong> Define niche (teas, tinctures, salves), draft business plan, research local regulations. Register LLC, get EIN, obtain seller's permit and product liability insurance.</li>
<li><strong>Week 3-4:</strong> Source herbs (grow, forage, or buy from Mountain Rose Herbs / Starwest Botanicals). Begin first test batches. Set up clean workspace with airtight storage.</li>
<li><strong>Week 5-6:</strong> Finalize product formulas. Design brand identity and labels. Order packaging (amber glass, kraft pouches, tins). Ensure FDA compliance — no drug claims, proper disclaimers.</li>
<li><strong>Week 7-8:</strong> Acquire booth equipment (10x10 tent, tables, display stands, mobile card reader). Apply for farmers market vendor spots. Soft launch to friends and family for feedback.</li>
</ul>
<h3>Revenue Streams</h3>
<ul><li>Farmers market and event sales (direct, highest margin)</li><li>Online store via Etsy or personal website</li><li>Wholesale to local spas, health food stores, wellness centers</li><li>Workshops: Herbal Tea Blending, DIY Salve Making ($25-75/person)</li></ul>
<h3>Legal & Compliance Notes</h3>
<p>In Florida, "apothecary" in a business name is legally restricted to licensed pharmacies — use "Herbals" or "Botanicals" instead. Herbal teas under cottage food law may be sold from home (check state rules). Never claim to "treat or cure" any disease — FDA classification matters. Get product liability insurance before first sale.</p>
<h3>Startup Budget (Lean)</h3>
<ul><li>LLC formation + permits: $300-500</li><li>Initial herb inventory: $200-500</li><li>Packaging and labels: $200-400</li><li>Booth equipment (tent, table, display): $300-600</li><li>Insurance: $300-600/year</li></ul>`
  },
  {
    id:'lib-002', icon:'🥗', title:'The Green Plate Restaurant', rating:4.8,
    revenue:'$20,000-$50,000/mo', launch:'3-6 months', cost:'$30,000-$50,000', difficulty:'Intermediate',
    tags:['Restaurant','Healthy','Family-Friendly','Sit-Down'],
    description:'A modern casual sit-down restaurant near gyms and office parks offering customizable healthy bowls, wraps, smoothies, and kids meals. Tagline: Healthy Starts Here.',
    plan:`<h3>Concept</h3>
<p>The Green Plate is a vibrant, modern restaurant with a casual sit-down experience. Think natural wood, green plants, clean white walls with fitness-themed art, and energetic music. Customers build customizable bowls, wraps, and smoothies — catering to gym-goers, health-conscious professionals, and families.</p>
<h3>Brand Identity</h3>
<ul><li><strong>Tagline:</strong> Healthy Starts Here.</li><li><strong>Colors:</strong> Dark Green #1E4620, Leaf Green #5DAE49, Peach #F9D5A7, Citrus Coral #F86E51, Earth Brown #6C4F3D</li><li><strong>Fonts:</strong> Montserrat Bold (headings), Open Sans (body)</li><li><strong>Vibe:</strong> Modern + vibrant with earthy accents. Family-friendly with a fitness energy.</li></ul>
<h3>Core Menu</h3>
<ul><li><strong>Build-Your-Own Bowls:</strong> Base (quinoa, brown rice, mixed greens, cauliflower rice) + Protein (grilled chicken, tofu, grass-fed beef, salmon) + Toppings + House dressings</li><li><strong>Wraps & Paninis:</strong> Grilled Chicken Power Wrap, Tofu & Veggie Panini (Vegan), Keto Chicken Lettuce Wraps</li><li><strong>Smoothies:</strong> Green Detox, High-Protein Chocolate, Berry Antioxidant, Immunity Booster</li><li><strong>Kids' Mini Green Plates:</strong> Mini Protein Bowl, Kids' Smoothie, Whole Grain Quesadilla with Hidden Veggies, Fresh Fruit Cup</li><li><strong>Healthy Sides:</strong> Sweet Potato Fries, Hummus & Veggie Sticks, Roasted Veggies, Garlic Mashed Cauliflower</li><li><strong>Desserts:</strong> Avocado Chocolate Mousse, Chia Fruit Parfait, Baked Apple Crisp</li></ul>
<h3>The Green Plate Nights</h3>
<p>Late-night extension: Weekdays until 11 PM, Weekends until Midnight. Streamlined menu for gym-goers and night workers. Sub-brand with moon/star accent. Loyalty rewards after 8 PM.</p>
<h3>Startup Budget</h3>
<ul><li>Lease & Renovations: $20,000</li><li>Kitchen Equipment & Furnishings: $10,000</li><li>Branding, Website, Marketing: $5,000</li><li>Initial Inventory & Supplies: $5,000</li><li>Permits, Utilities & Misc: $10,000</li></ul>
<h3>Revenue Streams</h3>
<ul><li>Dine-in and takeout sales</li><li>Catering for corporate clients and events</li><li>Delivery via DoorDash / Uber Eats</li><li>Loyalty app and subscription meal plans</li><li>Branded merchandise (Year 2)</li></ul>
<h3>Location Strategy</h3>
<p>Urban or suburban area near gyms, office parks, and wellness centers. Look for 1,000–2,500 sq ft. Consider proximity to LA Fitness, Planet Fitness, or corporate campuses. Year 2: second location or food truck.</p>`
  },
  {
    id:'lib-003', icon:'🌶️', title:'Bern Baby Burn Seasonings', rating:4.8,
    revenue:'$1,000-$10,000/mo', launch:'30-60 days', cost:'$500-$2,000', difficulty:'Beginner',
    tags:['Products','Food','Black-Owned','E-commerce'],
    description:'A Black-owned specialty seasoning and sauce brand named after grandmother Bernice "Bern" — a Southern woman who loved to cook. Sweet, spicy, and soulful.',
    plan:`<h3>Brand Story</h3>
<p>Named after Bernice — called "Bern" for short — a Southern woman who poured love into every dish. Bern Baby Burn carries that legacy forward with bold, authentic seasonings and sauces rooted in Southern, African, and Caribbean culinary traditions. Black-owned. Family-rooted. Fire in every jar.</p>
<h3>Product Line</h3>
<ul>
<li><strong>Southern-Style French Fry Seasoning (2.5 oz):</strong> Kosher salt, garlic powder, onion powder, smoked paprika, parsley, oregano, thyme, cayenne, brown sugar, mustard powder. The perfect balance of savory, smoky, and slightly sweet.</li>
<li><strong>Spicy Cajun Seasoning (2.5 oz):</strong> Kosher salt, garlic powder, onion powder, smoked paprika, cayenne, black pepper, white pepper, thyme, oregano, red pepper flakes. Louisiana heat in every shake.</li>
<li><strong>Herb Garden Seasoning (2.5 oz):</strong> Salt, garlic, onion powder, parsley, basil, chives, thyme, rosemary, oregano. Fresh and versatile — works on everything.</li>
<li><strong>Grits Seasoning (2.5 oz):</strong> Garlic powder, onion powder, smoked paprika, thyme, oregano, black pepper, white pepper, cayenne, parsley. Elevates classic Southern grits.</li>
<li><strong>Peach Blaze BBQ Sauce (16 oz):</strong> Canned peach purée, ketchup, apple cider vinegar, brown sugar, molasses, Worcestershire, liquid smoke, smoked paprika, cayenne. Sweet, smoky, and made in under 15 minutes.</li>
<li><strong>Vegan Peach Blaze BBQ Sauce (16 oz):</strong> Same as above with vegan Worcestershire. Certified plant-based version.</li>
</ul>
<h3>Brand Identity</h3>
<ul><li><strong>Colors:</strong> Deep red, burnt orange, golden yellow — fire palette with Southern heritage accents</li><li><strong>Taglines:</strong> "Sweet. Spicy. Southern." / "Taste the Bern" / "Where Flavor Ignites Tradition"</li><li><strong>Identity:</strong> Black-owned, family-recipe brand with cultural pride and modern appeal</li></ul>
<h3>Launch Strategy</h3>
<ul><li>Start with 3-4 flagship products (Southern Fry, Cajun, Peach BBQ, Vegan BBQ)</li><li>Test at farmers markets and local events</li><li>Build Etsy store and Instagram presence simultaneously</li><li>Approach local restaurants and specialty grocery stores for wholesale</li><li>Pitch to Whole Foods local supplier program and Black business directories</li></ul>
<h3>Startup Budget</h3>
<ul><li>Ingredients (first run): $300-600</li><li>Packaging (jars, labels, boxes): $400-800</li><li>LLC + cottage food or food processing permit: $200-400</li><li>Product liability insurance: $300-600/year</li><li>Marketing + Etsy setup: $100-200</li></ul>`
  },
  {
    id:'lib-004', icon:'⚽', title:'Multi-Sport Complex', rating:4.7,
    revenue:'$50,000-$200,000/mo', launch:'12-24 months', cost:'$500,000-$2,000,000', difficulty:'Advanced',
    tags:['Sports','Community','Large-Scale','Facility'],
    description:'A multi-sport facility offering courts, fields, training programs, leagues, and youth development. A community hub for athletics and leadership.',
    plan:`<h3>Concept</h3>
<p>A multi-sport complex that serves as a community hub — offering courts for basketball and volleyball, turf fields for soccer and football, training rooms, youth programs, adult leagues, and event space. This is about more than sports; it's about community development, leadership, and economic opportunity.</p>
<h3>Facilities & Offerings</h3>
<ul><li><strong>Indoor Courts:</strong> Basketball (2-4 courts), volleyball, pickleball, badminton</li><li><strong>Outdoor Fields:</strong> Soccer, flag football, track</li><li><strong>Training Center:</strong> Weight room, agility training, film room</li><li><strong>Youth Programs:</strong> After-school athletics, summer camps, leadership development</li><li><strong>Adult Leagues:</strong> Basketball, soccer, flag football, volleyball</li><li><strong>Event Space:</strong> Tournaments, fundraisers, community events, birthday parties</li><li><strong>Pro Shop & Café:</strong> Equipment, gear, healthy snacks and beverages</li></ul>
<h3>Revenue Streams</h3>
<ul><li>Membership fees (individual, family, corporate)</li><li>League registration fees</li><li>Court/field rental by the hour</li><li>Youth program fees</li><li>Tournament hosting fees</li><li>Event space rental</li><li>Concessions and pro shop sales</li><li>Sponsorships from local businesses and brands</li></ul>
<h3>Target Market</h3>
<ul><li>Youth athletes ages 8-18</li><li>Adult recreational players (25-55)</li><li>Corporate wellness programs</li><li>Schools and churches needing athletic space</li><li>Event organizers and tournament directors</li></ul>
<h3>Key Startup Steps</h3>
<ul><li>Identify and secure facility space (purchase or long-term lease)</li><li>Obtain all required permits (building, business, recreational facility)</li><li>Develop youth program curriculum and hire qualified coaches</li><li>Partner with local schools, churches, and recreation departments</li><li>Launch memberships pre-opening to fund initial operations</li></ul>
<h3>Financial Overview</h3>
<ul><li>Startup: $500K-$2M depending on facility size and whether building or leasing</li><li>Break-even: Typically 18-36 months with consistent membership and programming</li><li>Long-term revenue target: $50K-$200K/month at full capacity</li></ul>`
  },
  {
    id:'lib-005', icon:'🍲', title:'Community Food Bank & Pantry', rating:4.6,
    revenue:'Grant & Donation Funded', launch:'3-6 months', cost:'$10,000-$50,000', difficulty:'Intermediate',
    tags:['Nonprofit','Community','Food Security','Mission-Driven'],
    description:'A nonprofit community food bank providing groceries, fresh produce, and nutrition education to families in need. Funded through grants, donations, and community partnerships.',
    plan:`<h3>Mission</h3>
<p>To eliminate food insecurity in our community by providing nutritious food, resources, and dignity to families who need it most. The food bank operates as both a distribution center and a community gathering space — serving with compassion, not charity.</p>
<h3>Programs & Services</h3>
<ul><li><strong>Weekly Food Pantry:</strong> Households receive groceries based on family size</li><li><strong>Fresh Produce Program:</strong> Partner with local farms for fresh fruits and vegetables</li><li><strong>Mobile Food Distribution:</strong> Van or truck delivers to seniors, disabled individuals, and underserved areas</li><li><strong>Nutrition Education Workshops:</strong> Cooking classes, meal planning, healthy eating on a budget</li><li><strong>Emergency Food Boxes:</strong> Crisis response for families experiencing sudden hardship</li><li><strong>Holiday Programs:</strong> Thanksgiving baskets, Christmas toy/food drives</li></ul>
<h3>Funding Strategy</h3>
<ul><li><strong>Federal Grants:</strong> USDA Emergency Food Assistance Program (TEFAP), Community Development Block Grants</li><li><strong>State & Local Grants:</strong> Florida Department of Agriculture, local community foundations</li><li><strong>Corporate Sponsorships:</strong> Walmart, Publix, Amazon, local businesses</li><li><strong>Individual Donations:</strong> Monthly giving program, annual fundraiser gala</li><li><strong>Food Drives:</strong> Churches, schools, civic organizations</li><li><strong>Feeding America Network:</strong> Affiliate membership provides access to donated national food supply</li></ul>
<h3>Organizational Structure</h3>
<ul><li>Form 501(c)(3) nonprofit — IRS application + state registration</li><li>Board of Directors (5-9 members) with community leaders</li><li>Executive Director (paid), volunteer coordinator, part-time staff</li><li>Volunteer program — essential to operations</li></ul>
<h3>Startup Steps</h3>
<ul><li>Incorporate as nonprofit corporation in Florida</li><li>Apply for 501(c)(3) tax-exempt status with IRS (Form 1023)</li><li>Secure warehouse or distribution space</li><li>Apply to join Feeding America network for food supply access</li><li>Build donor base and apply for first foundation grants</li><li>Recruit board and launch volunteer program</li></ul>`
  },
  {
    id:'lib-006', icon:'🎙️', title:'RealTalk Community Platform', rating:4.7,
    revenue:'$5,000-$30,000/mo', launch:'2-4 months', cost:'$2,000-$10,000', difficulty:'Intermediate',
    tags:['Media','Community','Digital','Education'],
    description:'A community-focused media and coaching platform providing real conversations about business, life, finances, and leadership. Podcasts, events, coaching, and digital content.',
    plan:`<h3>Concept</h3>
<p>RealTalk is a platform rooted in authentic conversation — no fluff, no filter. It serves entrepreneurs, community leaders, and everyday people who want real information about building businesses, managing money, and leading with purpose. Think part podcast, part coaching network, part community movement.</p>
<h3>Content & Programming</h3>
<ul><li><strong>Podcast/Show:</strong> Weekly episodes featuring entrepreneurs, community leaders, financial experts, and everyday achievers. Real stories, real lessons.</li><li><strong>Live Events:</strong> Quarterly community forums, business mixers, women's empowerment summits, youth town halls</li><li><strong>Digital Content:</strong> YouTube channel, social media series, email newsletter</li><li><strong>Workshops & Masterclasses:</strong> Business formation, credit building, social media marketing, leadership</li><li><strong>1:1 Coaching:</strong> Business strategy sessions, accountability coaching, income pathway planning</li></ul>
<h3>Revenue Streams</h3>
<ul><li>Podcast sponsorships and brand partnerships</li><li>Event ticket sales and sponsorships</li><li>Digital course sales ($97-$497 each)</li><li>Coaching packages ($500-$2,000/month)</li><li>Membership community ($27-$97/month for premium content)</li><li>Affiliate partnerships with business tools and services</li></ul>
<h3>Brand Identity</h3>
<ul><li><strong>Tone:</strong> Direct, real, culturally grounded, empowering — not preachy</li><li><strong>Audience:</strong> Black entrepreneurs, community leaders, first-generation business owners, youth</li><li><strong>Tagline:</strong> "Real Conversations. Real Results."</li></ul>
<h3>Launch Steps</h3>
<ul><li>Choose platform (podcast host: Buzzsprout, Anchor, or Spotify for Podcasters)</li><li>Record first 3 episodes before launching (so listeners have content from Day 1)</li><li>Build social media presence 30-60 days before launch</li><li>Host first live event within 90 days of launch to build community</li><li>Launch first paid digital course within 6 months</li></ul>`
  },
  {
    id:'lib-007', icon:'🤖', title:'AI Biz Builder Program', rating:4.9,
    revenue:'$3,000-$20,000/mo', launch:'2-4 weeks', cost:'$200-$1,000', difficulty:'Beginner-Intermediate',
    tags:['AI','Education','Coaching','Digital Products'],
    description:'A structured program teaching entrepreneurs how to use AI tools to build, launch, and grow businesses faster. Curriculum-based with live coaching and digital resources.',
    plan:`<h3>Program Vision</h3>
<p>The AI Biz Builder Program teaches entrepreneurs and aspiring business owners how to leverage AI tools — ChatGPT, Claude, Groq, Canva AI, and more — to start and scale a business without a large team or budget. This is practical, hands-on, results-focused training that democratizes business-building tools.</p>
<h3>Curriculum Overview</h3>
<ul>
<li><strong>Module 1 — AI Foundations:</strong> What AI is, how to prompt effectively, free vs paid tools, best tools for entrepreneurs</li>
<li><strong>Module 2 — Business Ideation with AI:</strong> Using AI to validate ideas, research markets, identify competitors, and name your business</li>
<li><strong>Module 3 — Branding with AI:</strong> Generate brand identity, logo concepts, color palettes, brand voice, and marketing copy</li>
<li><strong>Module 4 — Content Creation:</strong> Social media posts, email newsletters, blog articles, video scripts — all AI-assisted</li>
<li><strong>Module 5 — Business Documents:</strong> Business plans, proposals, contracts, SOPs — generated and customized with AI</li>
<li><strong>Module 6 — Automation & Systems:</strong> Use Make.com, Zapier, and AI to automate client follow-up, invoicing, and scheduling</li>
<li><strong>Module 7 — Client Acquisition:</strong> AI-powered outreach scripts, DM strategies, sales funnels</li>
<li><strong>Module 8 — Launch & Scale:</strong> From idea to paying client in 30 days using AI as your co-founder</li>
</ul>
<h3>Delivery Formats</h3>
<ul><li><strong>Self-Paced Course:</strong> $197-$497 on Teachable or Kajabi</li><li><strong>Group Cohort (6 weeks):</strong> $597-$997 with weekly live calls</li><li><strong>1:1 AI Business Coaching:</strong> $500-$1,500/month</li><li><strong>Corporate/School Workshops:</strong> $1,500-$5,000/day</li></ul>
<h3>Target Audience</h3>
<ul><li>Aspiring entrepreneurs with no tech background</li><li>Small business owners wanting to save time with AI</li><li>Corporate employees wanting to launch a side hustle</li><li>Youth ages 14-24 in entrepreneurship programs</li><li>Nonprofit and community organization staff</li></ul>
<h3>Revenue Potential</h3>
<p>With 20 students/month at $297 average = $5,940/month. With corporate contracts at $3,000/workshop = 3 workshops = $9,000/month. Combined at scale: $15,000-$20,000/month achievable within 12 months.</p>`
  },
  {
    id:'lib-008', icon:'💳', title:'Smart Credit Repair Service', rating:4.8,
    revenue:'$3,000-$15,000/mo', launch:'1-2 weeks', cost:'$0-$500', difficulty:'Beginner',
    tags:['Finance','Credit','Services','Recurring'],
    description:'A credit repair and financial coaching service that helps clients remove negative items, build positive credit history, and achieve financial goals through personalized strategy.',
    plan:`<h3>Service Concept</h3>
<p>Smart Credit Repair combines credit dispute services with financial education and coaching. Unlike generic credit repair mills, this service personalizes the strategy to each client — addressing their specific negative items, credit utilization, and financial habits — while teaching them how to maintain good credit long-term.</p>
<h3>Service Packages</h3>
<ul>
<li><strong>Credit Audit ($75 one-time):</strong> Pull and analyze all 3 credit reports. Identify negative items, errors, and opportunities. Deliver a written action plan.</li>
<li><strong>Dispute Service ($150-$300/month):</strong> Send dispute letters to Equifax, Experian, TransUnion on client's behalf. Follow up and track results. Monthly progress report.</li>
<li><strong>Credit Builder Program ($297/month, 3-month minimum):</strong> Full dispute service + credit building strategy: secured cards, authorized user status, credit-builder loans. Weekly check-ins.</li>
<li><strong>Financial Coaching Add-On ($150/month):</strong> Budgeting, debt payoff strategy, savings goals, and income planning alongside credit work.</li>
</ul>
<h3>What You Can Legally Do</h3>
<ul><li>Dispute inaccurate, unverifiable, or outdated information on credit reports</li><li>Teach clients to write their own dispute letters (most powerful and free)</li><li>Advise on credit utilization, payment history, and positive credit building</li><li>Recommend credit products (secured cards, credit-builder loans)</li></ul>
<h3>Legal Requirements</h3>
<p>In Florida, credit repair organizations must comply with the Credit Repair Organizations Act (CROA) and Florida's Credit Services Organizations Act. You must: provide a written contract, give clients a 3-day right to cancel, and never charge upfront fees before services are rendered. Consult an attorney before launching.</p>
<h3>Tools & Resources</h3>
<ul><li>AnnualCreditReport.com — free credit reports for clients</li><li>Credit Karma / Experian — free monitoring and score tracking</li><li>CreditRepairCloud — software for managing disputes at scale ($179/month)</li><li>Sample dispute letter templates (customize for each client)</li></ul>
<h3>Client Acquisition</h3>
<ul><li>Partner with H.E.L.P. Center clients — credit repair is part of the pathways</li><li>Referrals from real estate agents, car dealerships, and mortgage brokers</li><li>Facebook groups focused on credit improvement</li><li>Free credit audit as a lead magnet</li></ul>`
  }
];

    function renderLibrary() {
      const grid = document.getElementById('library-ideas-grid');
      if (!grid) return;
      const savedIdeas = getData('ideas').map(i=>i.name);
      grid.innerHTML = LIBRARY_IDEAS.map(idea => {
        const isSaved = savedIdeas.includes(idea.title);
        return `
        <div class="idea-card">
          <div class="idea-header"><span class="idea-icon">${idea.icon}</span><span class="idea-rating">⭐ ${idea.rating}</span></div>
          <h3 class="idea-title">${idea.title}</h3>
          <p class="idea-description">${idea.description}</p>
          <div class="idea-stats">
            <div class="idea-stat"><span class="idea-stat-label">💰 Revenue</span><span class="idea-stat-value">${idea.revenue}</span></div>
            <div class="idea-stat"><span class="idea-stat-label">🚀 Launch Time</span><span class="idea-stat-value">${idea.launch}</span></div>
            <div class="idea-stat"><span class="idea-stat-label">💸 Startup Cost</span><span class="idea-stat-value">${idea.cost}</span></div>
            <div class="idea-stat"><span class="idea-stat-label">📊 Difficulty</span><span class="idea-stat-value">${idea.difficulty}</span></div>
          </div>
          <div class="idea-tags">${idea.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
          <div class="idea-actions" style="flex-direction:column;gap:8px">
            <div style="display:flex;gap:8px">
              <button class="btn btn-outline" style="flex:1;font-size:12px" onclick="viewLibraryPlan('${idea.id}')"><span class="icon icon-sm" data-icon="clipboard" style="margin-right:6px;vertical-align:-2px"></span>View Plan</button>
              <button class="btn btn-outline" style="flex:1;font-size:12px;border-color:var(--accent);color:var(--accent)" onclick="libraryAiDeepDive('${idea.id}')"><span class="icon icon-sm" data-icon="spark" style="margin-right:6px;vertical-align:-2px"></span>AI Analysis</button>
            </div>
            <div style="display:flex;gap:8px">
              <button class="btn btn-outline" style="flex:1;font-size:12px" onclick="printLibraryIdea('${idea.id}')"><span class="icon icon-sm" data-icon="print" style="margin-right:6px;vertical-align:-2px"></span>Print</button>
              <button class="btn btn-solid" style="flex:1;font-size:12px" onclick="saveLibraryIdea('${idea.id}')" id="lib-save-${idea.id}">${isSaved?'✅ Added':'➕ Add to My Ideas'}</button>
            </div>
          </div>
        </div>`;
      }).join('');
    }

    function viewLibraryPlan(ideaId) {
      const idea = LIBRARY_IDEAS.find(i=>i.id===ideaId);
      if (!idea) return;
      let modal = document.getElementById('lib-plan-modal');
      if (!modal) { modal = document.createElement('div'); modal.id='lib-plan-modal'; document.body.appendChild(modal); }
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;overflow-y:auto';
      const isSaved = getData('ideas').some(i=>i.name===idea.title);
      modal.innerHTML = `<div style="background:#fff;border-radius:16px;padding:32px;width:100%;max-width:660px;max-height:90vh;overflow-y:auto" id="lib-plan-inner">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">
          <div><div style="font-size:32px;margin-bottom:6px">${idea.icon}</div><h2 style="font-size:22px;font-weight:800">${idea.title}</h2><p style="font-size:14px;color:var(--gray-500)">${idea.description}</p></div>
          <button onclick="document.getElementById('lib-plan-modal').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:var(--gray-400);flex-shrink:0">×</button>
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:20px">
          ${[['💰 Revenue',idea.revenue],['🚀 Launch',idea.launch],['💸 Startup Cost',idea.cost],['📊 Difficulty',idea.difficulty]].map(([l,v])=>`<div style="background:var(--gray-50);border-radius:8px;padding:12px"><div style="font-size:11px;font-weight:700;color:var(--gray-500);margin-bottom:2px">${l}</div><div style="font-weight:700">${v}</div></div>`).join('')}
        </div>
        <div style="font-size:14px;line-height:1.8;color:var(--gray-700)" id="lib-plan-body">${idea.plan}</div>
        <div style="display:flex;gap:10px;margin-top:24px;flex-wrap:wrap">
          <button onclick="libraryAiDeepDive('${idea.id}')" class="btn btn-outline" style="flex:1;min-width:130px;border-color:var(--accent);color:var(--accent)"><span class="icon icon-sm" data-icon="spark" style="margin-right:6px;vertical-align:-2px"></span>AI Deep Dive</button>
          <button onclick="printLibraryIdeaModal('${idea.id}')" class="btn btn-outline" style="flex:1;min-width:100px"><span class="icon icon-sm" data-icon="print" style="margin-right:6px;vertical-align:-2px"></span>Print</button>
          <button onclick="saveLibraryIdea('${idea.id}');document.getElementById('lib-plan-modal').remove()" class="btn btn-solid" style="flex:1;min-width:130px">${isSaved?'✅ Already Added':'➕ Add to My Ideas'}</button>
          <button onclick="document.getElementById('lib-plan-modal').remove()" class="btn btn-outline" style="flex:1;min-width:80px">Close</button>
        </div>
      </div>`;
    }

    function saveLibraryIdea(ideaId) {
      const idea = LIBRARY_IDEAS.find(i=>i.id===ideaId);
      if (!idea) return;
      const ideas = getData('ideas');
      if (ideas.find(i=>i.name===idea.title)) { showToast(idea.title+' is already in My Ideas'); return; }
      const newIdea = {
        id: generateId(), name: idea.title, stage:'Idea', icon: idea.icon,
        tagline: idea.description.slice(0,80), description: idea.description,
        businessPlan: idea.plan, brandGuide:'', financials:{startupCost:0,projectedRevenue:idea.revenue,notes:''},
        notes:'Saved from Business Library.', dateCreated: new Date().toISOString().split('T')[0], lastUpdated: new Date().toISOString().split('T')[0]
      };
      ideas.push(newIdea); setData('ideas', ideas);
      logActivity('idea','Saved library idea: '+idea.title);
      showToast(idea.title+' added to My Ideas!', 'success');
      // Update button immediately without full re-render
      const btn = document.getElementById('lib-save-'+ideaId);
      if (btn) { btn.textContent='✅ Added'; btn.disabled=true; }
    }

    function printLibraryIdea(ideaId) {
      const idea = LIBRARY_IDEAS.find(i=>i.id===ideaId);
      if (!idea) return;
      printLibraryContent(idea);
    }

    function printLibraryIdeaModal(ideaId) {
      const idea = LIBRARY_IDEAS.find(i=>i.id===ideaId);
      if (!idea) return;
      printLibraryContent(idea);
    }

    function printLibraryContent(idea) {
      const cfg = JSON.parse(localStorage.getItem('settings'))||{};
      const bizName = cfg.businessName||'H.E.L.P. Center';
      const w = window.open('','_blank');
      w.document.write(`<!DOCTYPE html><html><head><title>${idea.title} — Business Plan</title>
      <style>
        body{font-family:'Georgia',serif;max-width:800px;margin:40px auto;padding:24px;color:#1a1a1a;line-height:1.8}
        .letterhead{text-align:center;border-bottom:3px solid var(--brand-primary);padding-bottom:20px;margin-bottom:32px}
        .letterhead h1{font-size:26px;font-weight:900;color:var(--brand-primary);margin:0 0 6px}
        .letterhead p{font-size:13px;color:#666;margin:2px 0}
        h2{font-size:22px;font-weight:800;margin-bottom:6px}
        .subtitle{color:#555;font-size:15px;margin-bottom:24px}
        .stats-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin:20px 0;background:#f8f9fb;padding:20px;border-radius:8px}
        .stat-box{background:#fff;padding:14px;border-radius:6px;border:1px solid #e0e4ef}
        .stat-label{font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.5px}
        .stat-val{font-size:15px;font-weight:800;color:#1a1a1a;margin-top:4px}
        .tags{margin:16px 0;display:flex;flex-wrap:wrap;gap:8px}
        .tag{background:#EEF2FF;color:var(--brand-primary);padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600}
        .plan-body{font-size:15px;line-height:1.9;color:#333}
        .plan-body ul{padding-left:20px} .plan-body li{margin-bottom:8px}
        .print-btn{display:block;margin:32px auto;padding:14px 32px;background:var(--brand-primary);color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:700;cursor:pointer}
        @media print{.print-btn{display:none}body{margin:0;padding:16px}}
      </style></head><body>
      <div class="letterhead">
        <h1>${bizName}</h1>
        <p>Business Idea Library — Execution Plan</p>
      </div>
      <div style="font-size:36px;margin-bottom:8px">${idea.icon}</div>
      <h2>${idea.title}</h2>
      <p class="subtitle">${idea.description}</p>
      <div class="stats-grid">
        <div class="stat-box"><div class="stat-label">💰 Revenue Potential</div><div class="stat-val">${idea.revenue}</div></div>
        <div class="stat-box"><div class="stat-label">🚀 Launch Time</div><div class="stat-val">${idea.launch}</div></div>
        <div class="stat-box"><div class="stat-label">💸 Startup Cost</div><div class="stat-val">${idea.cost}</div></div>
        <div class="stat-box"><div class="stat-label">📊 Difficulty</div><div class="stat-val">${idea.difficulty}</div></div>
      </div>
      <div class="tags">${idea.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      <hr style="border:1px solid #e0e4ef;margin:24px 0">
      <div class="plan-body">${idea.plan}</div>
      <button class="print-btn" onclick="window.print()"><span class="icon icon-sm" data-icon="print" style="margin-right:6px;vertical-align:-2px"></span>Print / Save as PDF</button>
      </body></html>`);
      w.document.close();
    }

    // ── LIBRARY AI DEEP DIVE ──────────────────────────────────────────────────
    async function libraryAiDeepDive(ideaId) {
      const idea = LIBRARY_IDEAS.find(i=>i.id===ideaId);
      if (!idea) return;
      const cfg = JSON.parse(localStorage.getItem('settings'))||{};
      const groqKey = cfg.groqApiKey||'';
      if (!groqKey) { alert('Add your Groq API key in Settings → AI Settings to use AI Analysis.'); return; }

      // Build or reuse analysis modal
      let modal = document.getElementById('lib-ai-modal');
      if (!modal) { modal = document.createElement('div'); modal.id='lib-ai-modal'; document.body.appendChild(modal); }
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:1100;display:flex;align-items:center;justify-content:center;padding:20px;overflow-y:auto';
      modal.innerHTML = `<div style="background:#fff;border-radius:16px;padding:32px;width:100%;max-width:720px;max-height:92vh;overflow-y:auto">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="font-size:28px">${idea.icon}</div>
            <div>
              <div style="font-size:18px;font-weight:800">${idea.title}</div>
              <div style="font-size:12px;color:var(--brand-primary);font-weight:700;text-transform:uppercase;letter-spacing:.5px">✨ AI Deep Dive Analysis</div>
            </div>
          </div>
          <button onclick="document.getElementById('lib-ai-modal').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:#999">×</button>
        </div>
        <div id="lib-ai-output" style="font-size:14px;line-height:1.85;color:#333;min-height:200px;white-space:pre-wrap">
          <div style="display:flex;align-items:center;gap:10px;color:var(--brand-primary);font-weight:600"><div style="font-size:20px">⏳</div> Running deep analysis with Groq Compound… this gives you 20+ pages of actionable detail.</div>
        </div>
        <div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap" id="lib-ai-btns" style="display:none">
          <button onclick="printAiAnalysis('${idea.id}')" class="btn btn-outline" style="flex:1;min-width:120px"><span class="icon icon-sm" data-icon="print" style="margin-right:6px;vertical-align:-2px"></span>Print Analysis</button>
          <button onclick="document.getElementById('lib-ai-modal').remove()" class="btn btn-solid" style="flex:1;min-width:100px">Done</button>
        </div>
      </div>`;

      const outputEl = document.getElementById('lib-ai-output');
      const btnEl = document.getElementById('lib-ai-btns');

      const systemPrompt = `You are an expert business strategist, startup consultant, and revenue coach. You give exhaustive, actionable analyses for any business idea — neutral and broadly applicable unless the user has specified a target community.

## CRITICAL
- Do NOT default the analysis toward any specific demographic (Black, women, faith-based, etc.) unless the idea description explicitly indicates that audience.
- Address the actual market for this specific business idea.

## RESPONSE QUALITY RULES — MANDATORY
- Give LONG, DETAILED, THOROUGH responses. Aim for 20+ paragraphs of real value.
- Include SPECIFIC details: exact dollar amounts, real platform names, step-by-step scripts, templates, timelines.
- Use numbered lists, section headers (##), and bullet points for clarity.
- Cover EVERY aspect requested with full depth — never summarize or truncate.
- Every response MUST end with: "## TODAY'S ACTION STEPS" with 5 specific tasks the person can start in the next 24 hours.`;

      const userPrompt = `Give me an EXHAUSTIVE deep-dive business analysis for: **${idea.title}**

DESCRIPTION: ${idea.description}
REVENUE POTENTIAL: ${idea.revenue}
STARTUP COST: ${idea.cost}
LAUNCH TIME: ${idea.launch}
DIFFICULTY: ${idea.difficulty}
TAGS: ${idea.tags.join(', ')}

Please analyze in full detail across ALL of these sections:

## 1. BUSINESS MODEL BREAKDOWN
Explain exactly how this business makes money — every revenue stream, pricing structure, and upsell opportunity with real dollar amounts.

## 2. MARKET OPPORTUNITY
Who needs this? Size of the market, demographics, underserved communities, and why NOW is the right time to launch.

## 3. 90-DAY LAUNCH ROADMAP
Week-by-week action plan from Day 1 through Day 90. What to do, in what order, with real deadlines.

## 4. STARTUP COSTS ITEMIZED
Break down every single startup cost with specific dollar ranges. What's required vs. optional. Where to save money.

## 5. REVENUE PROJECTIONS
Month 1, Month 3, Month 6, Month 12 realistic projections. What does success look like at each stage?

## 6. CLIENT ACQUISITION STRATEGY
10 specific ways to get your first 10 paying clients — scripts, platforms, outreach methods, partnerships.

## 7. PRICING STRATEGY
Exact pricing tiers with justification. What to charge for each service/package. How to raise prices over time.

## 8. TOOLS & PLATFORMS
Every software, app, and platform needed. Free vs. paid options. Which ones to use first.

## 9. COMPETITION ANALYSIS
Who are the main competitors? What do they charge? What gap can this business fill that they don't cover?

## 10. RISK & CHALLENGES
Top 5 challenges you'll face and exactly how to overcome each one. What trips people up.

## 11. SCALE & EXIT STRATEGY
How to grow from solo to team. What does a $10K/month version look like? $50K/month?

## 12. NEXT-LEVEL OPPORTUNITIES
What partnerships, complementary businesses, or growth angles could expand this idea over time?

## TODAY'S ACTION STEPS
5 specific things to do in the next 24 hours to start this business.`;

      let fullText = '';
      outputEl.innerHTML = '';
      try {
        const messages = [{role:'system',content:systemPrompt},{role:'user',content:userPrompt}];

        // Try Gemini 2.5 Flash first (higher daily cap than Groq).
        fullText = await _aiStreamGeminiOrNull(messages, null, { temperature: 0.6, maxTokens: 4096 });

        // Fall back to Groq if Gemini unavailable or empty.
        if (!fullText) {
          const modelToUse = cfg.aiModel || GROQ_DEFAULT_MODEL;
          console.log('[libraryAiDeepDive] Gemini unavailable — using Groq model=' + modelToUse);
          const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method:'POST',
            headers:{'Content-Type':'application/json','Authorization':'Bearer '+groqKey},
            body: JSON.stringify({
              model: modelToUse,
              messages,
              max_tokens:4096, temperature:0.6
            })
          });
          if (!resp.ok) {
            const errText = await resp.text();
            let detail = errText.slice(0,400);
            try { detail = JSON.parse(errText).error?.message || detail; } catch {}
            console.error('[libraryAiDeepDive] API error:', resp.status, errText);
            throw new Error('Groq ' + resp.status + ': ' + detail);
          }
          const data = await resp.json();
          fullText = data?.choices?.[0]?.message?.content || '';
        }
        if (!fullText) {
          throw new Error('AI returned an empty response. Check your Gemini/Groq keys in Settings.');
        }
        outputEl.classList.add('md-content');
        outputEl.style.whiteSpace = 'normal';
        window._libAiLastAnalysis = { idea, text: cleanGroqResponse(fullText) };
        outputEl.innerHTML = mdRender(cleanGroqResponse(fullText)) +
          `<div style="margin-top:14px;padding-top:12px;border-top:0.5px solid rgba(0,0,0,0.1);display:flex;gap:8px;flex-wrap:wrap">
            <button onclick="libSaveToNotes()" class="btn btn-outline" style="padding:7px 14px;font-size:12px"><span class="icon icon-sm" data-icon="note" style="margin-right:6px;vertical-align:-2px"></span>Save to Notes</button>
            <button onclick="printAiAnalysis('${idea.id}')" class="btn btn-outline" style="padding:7px 14px;font-size:12px"><span class="icon icon-sm" data-icon="print" style="margin-right:6px;vertical-align:-2px"></span>Print</button>
          </div>`;
        if(btnEl) btnEl.style.display='flex';
      } catch(e) {
        console.error('[libraryAiDeepDive] failed:', e);
        outputEl.innerHTML = `<div style="color:#dc2626;padding:14px;background:#fef2f2;border-radius:8px;border:1px solid #fca5a5">
          <strong>⚠️ AI Analysis Failed</strong><br>
          <code style="font-size:12px">${e.message}</code>
          <div style="margin-top:8px;font-size:13px">Open the browser console (F12) for full details. Common causes: invalid Groq API key, model name not available on the selected plan, or the input + output token total exceeds the model's context window.</div>
        </div>`;
      }
    }

    function libSaveToNotes() {
      const data = window._libAiLastAnalysis;
      if (!data?.text) { showToast('Nothing to save yet.'); return; }
      saveAsNote(data.idea.title + ' — Deep Dive Analysis', data.text, 'Business Idea');
    }

    function printAiAnalysis(ideaId) {
      const data = window._libAiLastAnalysis;
      if (!data) return;
      const cfg = JSON.parse(localStorage.getItem('settings'))||{};
      const bizName = cfg.businessName||'H.E.L.P. Center';
      const w = window.open('','_blank');
      const htmlContent = data.text
        .replace(/## ([^\n]+)/g,'<h2 style="color:var(--brand-primary);font-size:18px;margin:24px 0 10px;border-bottom:2px solid #EEF2FF;padding-bottom:6px">$1</h2>')
        .replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')
        .replace(/\n\n/g,'<br><br>').replace(/\n- /g,'<br>• ').replace(/\n(\d+)\. /g,'<br>$1. ').replace(/\n/g,'<br>');
      w.document.write(`<!DOCTYPE html><html><head><title>${data.idea.title} — AI Analysis</title>
      <style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;padding:24px;color:#1a1a1a;line-height:1.85}
      .lh{text-align:center;border-bottom:3px solid var(--brand-primary);padding-bottom:20px;margin-bottom:32px}
      .lh h1{font-size:26px;font-weight:900;color:var(--brand-primary);margin:0 0 4px}.lh p{font-size:13px;color:#666}
      .print-btn{display:block;margin:32px auto;padding:14px 32px;background:var(--brand-primary);color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:700;cursor:pointer}
      @media print{.print-btn{display:none}}</style></head><body>
      <div class="lh"><h1>${bizName}</h1><p>AI Deep Dive Business Analysis</p></div>
      <div style="font-size:36px;margin-bottom:8px">${data.idea.icon}</div>
      <h2 style="font-size:24px;font-weight:900;margin-bottom:6px">${data.idea.title}</h2>
      <p style="color:#666;margin-bottom:24px">${data.idea.description}</p>
      <hr style="border:1px solid #e0e4ef;margin:24px 0">
      <div style="font-size:15px;line-height:1.9">${htmlContent}</div>
      <button class="print-btn" onclick="window.print()"><span class="icon icon-sm" data-icon="print" style="margin-right:6px;vertical-align:-2px"></span>Print / Save as PDF</button>
      </body></html>`);
      w.document.close();
    }

    // ── BUSINESS BUILDER TOOLS ─────────────────────────────────────────────────

    function selectBbOption(el, hiddenId) {
      el.closest('[id$="-opts"]')?.querySelectorAll('.tool-option').forEach(o => o.classList.remove('selected'));
      el.classList.add('selected');
      const h = document.getElementById(hiddenId);
      if (h) h.value = el.dataset.val || el.textContent.trim();
    }

    // Multi-select toggle (for personality — up to 3)
    function bwToggle(el, hiddenId) {
      const selected = el.classList.contains('selected');
      const h = document.getElementById(hiddenId);
      const current = h ? h.value.split(',').filter(v=>v.trim()) : [];
      if (selected) {
        el.classList.remove('selected');
        const idx = current.indexOf(el.dataset.val);
        if (idx > -1) current.splice(idx, 1);
      } else {
        if (current.length >= 3) { showToast('Pick up to 3 personality traits'); return; }
        el.classList.add('selected');
        current.push(el.dataset.val);
      }
      if (h) h.value = current.join(', ');
    }

    // bw2 = Brand Wizard embedded in Business Development pathway
    function bwNext2(step) {
      [1,2,3,4].forEach(i => {
        const el = document.getElementById('bw2-step-' + i);
        if (el) el.style.display = i === step ? 'block' : 'none';
        const prog = document.getElementById('bw2-prog-' + i);
        if (prog) prog.style.background = i <= step ? 'var(--brand-primary)' : '#E2E8F0';
      });
      const lbl = document.getElementById('bw2-step-label');
      if (lbl) lbl.textContent = 'Step ' + step + ' of 4';
    }
    function bwToggle2(el, hiddenId) {
      const selected = el.classList.contains('selected');
      const h = document.getElementById(hiddenId);
      const current = h ? h.value.split(',').filter(v=>v.trim()) : [];
      if (selected) { el.classList.remove('selected'); const idx = current.indexOf(el.dataset.val); if (idx > -1) current.splice(idx, 1); }
      else { if (current.length >= 3) { showToast('Pick up to 3 personality traits'); return; } el.classList.add('selected'); current.push(el.dataset.val); }
      if (h) h.value = current.join(', ');
    }
    async function bwGenerate2() {
      const cfg = JSON.parse(localStorage.getItem('settings')) || {};
      const groqKey = cfg.groqApiKey || '';
      const resultEl = document.getElementById('bw2-result');
      if (!groqKey) { if(resultEl) resultEl.innerHTML='<div style="color:#dc2626;padding:12px;background:#fef2f2;border-radius:8px">⚠️ Add your Groq API key in Settings first.</div>'; return; }
      const name = document.getElementById('bw2-name')?.value.trim() || '(no name yet)';
      const what = document.getElementById('bw2-what')?.value.trim() || '';
      const who  = document.getElementById('bw2-who')?.value.trim() || '';
      const diff = document.getElementById('bw2-diff')?.value.trim() || '';
      const personality = document.getElementById('bw2-personality')?.value || '';
      const style = document.getElementById('bw2-style')?.value || '';
      const color = document.getElementById('bw2-color')?.value || '';
      if (!what) { showToast('Fill in Step 1 first.'); bwNext2(1); return; }
      resultEl.innerHTML = '<div style="color:var(--brand-primary);font-weight:600;padding:12px">✨ Building your complete brand package…</div>';
      const prompt = `Build a COMPLETE BRAND PACKAGE. Business: "${name}" — ${what}. Serves: ${who}. Differentiator: ${diff}. Personality: ${personality||'Bold, Professional'}. Style: ${style||'Modern'}. Colors: ${color||'Blues & Navy'}.

Output ALL sections:
## 🏷️ Tagline Options — 5 options, bold the recommended one
## 📖 Brand Story — 3 sentences for About page
## 🎨 Color Palette — 5 colors (name + hex + how to use)
## 🖋️ Typography — 2 Google Fonts + import link + CSS snippet
## 🗣️ Brand Voice — tone in 3 words, 5 dos, 5 don'ts, sample caption, 3 email subject lines
## 📋 Logo Brief — complete brief to send to a Fiverr designer
## 📱 Social Bios — Instagram (150 chars), LinkedIn (3 sentences), Facebook (2 sentences)
## 🏆 Content Pillars — 3 pillars with 5 post ideas each`;
      let fullText = '';
      try {
        const messages = [{role:'system',content:'You are a world-class brand strategist. Output every section completely. Use specific hex codes, real font names, and actual copy — never placeholders. Tailor to the audience the user describes; do not default to any specific demographic.'},{role:'user',content:prompt}];

        // Try Gemini 2.5 Flash first (streaming, higher daily cap than Groq).
        fullText = await _aiStreamGeminiOrNull(messages, (chunk, full) => {
          resultEl.innerHTML = mdRender(full);
        }, { temperature: 0.7, maxTokens: 6000 });

        // Fall back to Groq if Gemini failed.
        if (!fullText) {
          const modelToUse = cfg.aiModel || GROQ_DEFAULT_MODEL;
          console.log('[bwGenerate2] Gemini unavailable — using Groq model:', modelToUse);
          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+groqKey},
            body: JSON.stringify({ model: modelToUse, messages, max_tokens:6000, temperature:0.7, stream:true })
          });
          if (!res.ok) {
            const errBody = await res.text();
            console.error('[bwGenerate2] API error:', res.status, errBody);
            let detail = errBody.slice(0, 300);
            try { detail = JSON.parse(errBody).error?.message || detail; } catch {}
            throw new Error(`Groq ${res.status}: ${detail}`);
          }
          // Buffered SSE parser — handles partial lines across chunk boundaries
          const reader = res.body.getReader(), dec = new TextDecoder();
          let sseBuffer = '';
          const processLine = (line) => {
            if (!line.startsWith('data: ')) return;
            const d = line.slice(6); if (d === '[DONE]') return;
            try { const dt = JSON.parse(d).choices?.[0]?.delta?.content || ''; if (dt) { fullText += dt; resultEl.innerHTML = mdRender(fullText); } } catch(e) {}
          };
          while (true) {
            const { done, value } = await reader.read();
            if (done) { if (sseBuffer) processLine(sseBuffer); break; }
            sseBuffer += dec.decode(value, { stream: true });
            const lines = sseBuffer.split('\n');
            sseBuffer = lines.pop() || '';
            for (const line of lines) processLine(line);
          }
        }
        const cleaned = cleanGroqResponse(fullText);
        resultEl.innerHTML = mdRender(cleaned) +
          `<div style="margin-top:16px;padding-top:14px;border-top:0.5px solid rgba(0,0,0,0.1);display:flex;gap:8px;flex-wrap:wrap">
            <button onclick="bw2SaveToBusinessFile()" class="btn btn-solid" style="padding:8px 16px;font-size:13px">💾 Save to Business File</button>
            <button onclick="bw2SaveToNotes()" class="btn btn-outline" style="padding:8px 14px;font-size:13px"><span class="icon icon-sm" data-icon="note" style="margin-right:6px;vertical-align:-2px"></span>Save to Notes</button>
            <button onclick="bwPrint2()" class="btn btn-outline" style="padding:8px 14px;font-size:13px"><span class="icon icon-sm" data-icon="print" style="margin-right:6px;vertical-align:-2px"></span>Print / PDF</button>
          </div>`;
        window._bw2LastBrand = { name, text: cleaned };
      } catch(e) {
        console.error('[bwGenerate2] failed:', e);
        resultEl.innerHTML = `<div style="color:#dc2626;padding:14px;background:#fef2f2;border-radius:8px;border:1px solid #fca5a5">
          <strong>⚠️ Brand generation failed:</strong> ${e.message}<br>
          <span style="font-size:12px;color:#7f1d1d">Check your Groq API key in Settings, try a different model, or open console (F12).</span>
        </div>`;
      }
    }

    function bw2SaveToNotes() {
      const data = window._bw2LastBrand;
      if (!data?.text) { showToast('Generate your brand first.'); return; }
      saveAsNote((data.name || 'Brand') + ' — Brand Package', data.text, 'Brand');
    }
    function bw2SaveToBusinessFile() {
      const data = window._bw2LastBrand;
      if (!data?.text) { showToast('Generate your brand first.'); return; }
      saveToBusinessFile({ type: 'Brand Package', title: (data.name || 'Brand Package'), content: data.text });
    }
    function bwPrint2() {
      const data = window._bw2LastBrand;
      if (!data?.text) { showToast('Generate your brand first.'); return; }
      const w = window.open('','_blank');
      w.document.write(`<!DOCTYPE html><html><head><title>${data.name} — Brand Package</title><style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;padding:0 24px;color:#111}h2{color:var(--brand-primary);margin-top:28px}table{width:100%;border-collapse:collapse}th{background:var(--brand-primary);color:#fff;padding:8px}td{padding:7px;border-bottom:1px solid #eee}code{background:#f1f5f9;padding:2px 6px;border-radius:4px}@media print{button{display:none}}</style></head><body><div style="text-align:right;margin-bottom:16px"><button onclick="window.print()" style="padding:10px 20px;background:var(--brand-primary);color:#fff;border:none;border-radius:6px;cursor:pointer"><span class="icon icon-sm" data-icon="print" style="margin-right:6px;vertical-align:-2px"></span>Print</button></div><h1>${data.name} — Brand Package</h1>${mdRender(data.text)}</body></html>`);
      w.document.close();
    }

    function bwNext(step) {
      [1,2,3,4].forEach(i => {
        const el = document.getElementById('bw-step-' + i);
        if (el) el.style.display = i === step ? 'block' : 'none';
        const prog = document.getElementById('bw-prog-' + i);
        if (prog) prog.style.background = i <= step ? 'var(--brand-primary)' : '#E2E8F0';
      });
      const lbl = document.getElementById('bw-step-label');
      if (lbl) lbl.textContent = 'Step ' + step + ' of 4';
      document.getElementById('branding-tab')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    async function bwGenerate() {
      const cfg = JSON.parse(localStorage.getItem('settings')) || {};
      const groqKey = cfg.groqApiKey || '';
      const resultEl = document.getElementById('bw-result');
      if (!groqKey) { if(resultEl) resultEl.innerHTML='<div style="color:#dc2626;padding:12px;background:#fef2f2;border-radius:8px">⚠️ Add your Groq API key in Settings to generate your brand.</div>'; return; }

      const name = document.getElementById('bw-name')?.value.trim() || '(no name yet)';
      const what = document.getElementById('bw-what')?.value.trim() || '';
      const who  = document.getElementById('bw-who')?.value.trim() || '';
      const diff = document.getElementById('bw-diff')?.value.trim() || '';
      const personality = document.getElementById('bw-personality')?.value || '';
      const style = document.getElementById('bw-style')?.value || '';
      const color = document.getElementById('bw-color')?.value || '';

      if (!what) { showToast('Fill in Step 1 first — what does your business do?'); bwNext(1); return; }

      resultEl.innerHTML = '<div style="color:var(--brand-primary);font-weight:600;padding:12px">✨ Building your complete brand package — this takes about 30 seconds…</div>';

      const prompt = `You are building a COMPLETE BRAND PACKAGE for this business. Output every section — do not skip any.

BUSINESS INFO:
- Name: ${name}
- What we do: ${what}
- Who we serve: ${who}
- What makes us different: ${diff}
- Brand personality: ${personality || 'Bold, Professional, Community-Focused'}
- Visual style: ${style || 'Modern & Clean'}
- Color direction: ${color || 'Blues & Navy'}

Generate ALL of the following sections with headers:

## 🏷️ Tagline Options
Write 5 tagline options (short, punchy, memorable). Bold the recommended one.

## 📖 Brand Story
Write a 3-sentence brand story they can use on their About page and social media bio.

## 🎨 Color Palette
Provide exactly 5 colors with: color name, hex code, and where/how to use it. Include: Primary, Secondary, Accent, Background, Text.

## 🖋️ Typography
Recommend 2 Google Fonts (heading + body). Include the Google Fonts import link and CSS snippet ready to paste.

## 🗣️ Brand Voice Guide
- Tone in 3 words
- 5 things we always say / how we say it (examples)
- 5 things we never say (examples)
- Sample Instagram caption
- Sample email subject line (3 options)

## 📋 Logo Design Brief
Write a complete brief they can send to a Fiverr designer: style, colors, must-haves, must-avoids, symbol ideas, deliverables to request.

## 📱 Social Media Bios
- Instagram bio (150 chars max, include emoji)
- LinkedIn summary (3 sentences, professional)
- Facebook page description (2 sentences)

## 🏆 Brand Pillars
3 content pillars with 5 post ideas each for social media.`;

      let fullText = '';
      try {
        const messages = [{role:'system',content:'You are a world-class brand strategist. Produce the complete brand package as instructed. Never skip sections. Be specific with hex codes, real font names, and actual copy — not placeholders.'},{role:'user',content:prompt}];

        // Try Gemini 2.5 Flash first (streaming, higher daily cap than Groq).
        fullText = await _aiStreamGeminiOrNull(messages, (chunk, full) => {
          resultEl.innerHTML = mdRender(full);
        }, { temperature: 0.7, maxTokens: 6000 });

        // Fall back to Groq if Gemini failed.
        if (!fullText) {
          const modelToUse = cfg.aiModel || GROQ_DEFAULT_MODEL;
          console.log('[bwGenerate] Gemini unavailable — using Groq model:', modelToUse);
          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+groqKey},
            body: JSON.stringify({ model: modelToUse, messages, max_tokens:6000, temperature:0.7, stream:true })
          });
          if (!res.ok) {
            const errBody = await res.text();
            console.error('[bwGenerate] API error:', res.status, errBody);
            let detail = '';
            try { detail = JSON.parse(errBody).error?.message || errBody.slice(0,300); } catch { detail = errBody.slice(0,300); }
            throw new Error(`Groq API ${res.status}: ${detail}`);
          }
          // Buffered SSE parser
          const reader = res.body.getReader(), dec = new TextDecoder();
          let sseBuffer = '';
          const processLine = (line) => {
            if (!line.startsWith('data: ')) return;
            const d = line.slice(6); if (d === '[DONE]') return;
            try { const dt = JSON.parse(d).choices?.[0]?.delta?.content || ''; if (dt) { fullText += dt; resultEl.innerHTML = mdRender(fullText); } } catch(e) {}
          };
          while (true) {
            const { done, value } = await reader.read();
            if (done) { if (sseBuffer) processLine(sseBuffer); break; }
            sseBuffer += dec.decode(value, { stream: true });
            const lines = sseBuffer.split('\n');
            sseBuffer = lines.pop() || '';
            for (const line of lines) processLine(line);
          }
        }
        const cleaned = cleanGroqResponse(fullText);
        resultEl.innerHTML = mdRender(cleaned) +
          `<div style="margin-top:16px;padding-top:16px;border-top:0.5px solid rgba(0,0,0,0.1);display:flex;gap:8px;flex-wrap:wrap">
            <button onclick="bwSaveToBusinessFile()" class="btn btn-solid" style="padding:8px 16px;font-size:13px">💾 Save to Business File</button>
            <button onclick="bwSaveToNotes()" class="btn btn-outline" style="padding:8px 14px;font-size:13px"><span class="icon icon-sm" data-icon="note" style="margin-right:6px;vertical-align:-2px"></span>Save to Notes</button>
            <button onclick="bwPrint()" class="btn btn-outline" style="padding:8px 14px;font-size:13px"><span class="icon icon-sm" data-icon="print" style="margin-right:6px;vertical-align:-2px"></span>Print / Save PDF</button>
          </div>`;
        window._bwLastBrand = { name, what, who, text: cleaned };
      } catch(e) {
        console.error('[bwGenerate] Failed:', e);
        resultEl.innerHTML = `<div style="color:#dc2626;padding:14px;background:#fef2f2;border-radius:8px;border:1px solid #fca5a5">
          <strong>⚠️ Brand generation failed:</strong><br>
          <code style="font-size:12px">${e.message}</code>
          <div style="margin-top:10px;font-size:13px;color:#7f1d1d">
            Common fixes:<br>
            1. Make sure your Groq API key is valid in Settings<br>
            2. Try changing the AI model in Settings (try "Llama 3.3 70B" if Compound fails)<br>
            3. Check your internet connection<br>
            <br>Open browser console (F12) for full error details.
          </div>
        </div>`;
      }
    }

    function bwSaveToBusinessFile() {
      const data = window._bwLastBrand;
      if (!data?.text) { showToast('Generate your brand first.'); return; }
      saveToBusinessFile({ type: 'Brand Package', title: (data.name && data.name !== '(no name yet)' ? data.name : 'Brand Package'), content: data.text });
    }

    function bwSaveToNotes() {
      const data = window._bwLastBrand;
      if (!data?.text) { showToast('Generate your brand first.'); return; }
      const subject = (data.name && data.name !== '(no name yet)' ? data.name : 'Brand Package') + ' — Brand Package';
      saveAsNote(subject, data.text, 'Brand');
    }

    function bwPrint() {
      const data = window._bwLastBrand;
      if (!data?.text) { showToast('Generate your brand first, then print.'); return; }
      const w = window.open('','_blank');
      w.document.write(`<!DOCTYPE html><html><head><title>${data.name} — Brand Package</title>
      <style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;padding:0 24px;color:#111}
      h1{font-size:28px;border-bottom:3px solid var(--brand-primary);padding-bottom:12px}
      h2{font-size:18px;color:var(--brand-primary);margin-top:32px}
      table{width:100%;border-collapse:collapse}th{background:var(--brand-primary);color:#fff;padding:8px}td{padding:7px;border-bottom:1px solid #eee}
      code{background:#f1f5f9;padding:2px 6px;border-radius:4px}
      @media print{button{display:none}}</style></head><body>
      <div style="text-align:right;margin-bottom:20px"><button onclick="window.print()" style="padding:10px 20px;background:var(--brand-primary);color:#fff;border:none;border-radius:6px;cursor:pointer"><span class="icon icon-sm" data-icon="print" style="margin-right:6px;vertical-align:-2px"></span>Print</button></div>
      <h1>Brand Package — ${data.name}</h1>
      ${mdRender(data.text)}
      </body></html>`);
      w.document.close();
    }

    const BB_PROMPTS = {
      'brand-voice': (f) => `Write a complete Brand Voice Guide for "${f.biz}" with tone: ${f.tone||'Professional'}. Include: 1) Brand Personality (5 adjectives), 2) Tone of Voice description, 3) Language Do's (10 examples of how to write), 4) Language Don'ts (5 examples), 5) Sample tagline, 6) Sample Instagram caption, 7) Sample email subject line, 8) Sample cold outreach opener. Format with clear headers.`,
      'color-palette': (f) => `Generate a complete brand color palette for a business described as: "${f.desc}". Provide: 1) Primary color (hex + name + psychology), 2) Secondary color (hex), 3) Accent color (hex), 4) Neutral/background color (hex), 5) Text color (hex), 6) Where to use each color, 7) Colors to AVOID and why, 8) CSS variables snippet ready to copy-paste. Format as a clear guide.`,
      'typography': (f) => `Recommend a complete typography system for a brand described as: "${f.desc}". Include: 1) Primary heading font (name + weight + where to get it free), 2) Body font (name + weight), 3) Accent/display font if applicable, 4) Font size scale (h1 through body), 5) Line height recommendations, 6) Letter spacing tips, 7) Google Fonts import code ready to use, 8) Why these fonts work for this brand.`,
      'logo-brief': (f) => `Write a professional logo design brief for "${f.biz}" to send to a designer on Fiverr or 99designs. Include: 1) Company overview (2-3 sentences), 2) Target audience, 3) Brand personality (5 words), 4) Logo style preference (wordmark/icon/combination), 5) Color direction, 6) Competitors to reference, 7) Competitors to NOT look like, 8) Must-have elements, 9) Must-avoid elements, 10) Deliverables to request, 11) Suggested budget range. Make it detailed enough that a designer can start without a call.`,
      'process-template': (f) => `Write a complete, ready-to-use Standard Operating Procedure (SOP) for: "${f.type||'Client Onboarding'}" for a ${f.biz||'service-based business'}. Include: step-by-step instructions (numbered), tools/software to use at each step, email templates or scripts where applicable, timeline for each step, who is responsible, what success looks like. Format so it can be immediately handed to a team member or VA.`,
      'automations': (f) => `I run a service business and spend time on these tasks: "${f.tasks}". Create a complete automation plan: 1) For each task — recommend the best free or low-cost tool ($0-$30/mo) to automate it, 2) Exact setup steps, 3) How much time it saves per week, 4) Priority order (what to automate first), 5) Total estimated time savings per month, 6) A 30-day implementation schedule to set everything up without overwhelm.`,
      'social-media': (f) => `Create a complete 30-day ${f.platform||'Instagram'} content strategy for: "${f.biz}". Include: 1) Content pillars (4-5 themes), 2) Post frequency & best times to post, 3) 30 specific post ideas with captions (10 educational, 10 engagement, 10 promotional), 4) Hashtag strategy (3 tiers: niche, medium, broad), 5) Story ideas (5), 6) Reel concepts (5), 7) How to grow from 0 followers — first 30 days tactics, 8) Engagement strategy (how to spend 15 min/day building community).`,
      'ad-copy': (f) => `Write complete ad copy for: "${f.product}" targeting "${f.audience}". Deliver: 1) Facebook/Instagram ad — headline (5 variations), primary text (3 variations: short/medium/long), call-to-action (3 options), 2) Google search ad — 3 headlines (30 char max each), 2 descriptions (90 char max each), 3) One retargeting ad variation, 4) Best image/video direction for each ad, 5) A/B test recommendation — which version to run first and why.`,
      'email-campaign': (f) => `Write a complete 5-email sequence for "${f.biz}" with the goal: "${f.goal}". Emails: 1) Welcome email (immediate — builds relationship, sets expectations), 2) Value email (Day 2 — share a quick win or insight), 3) Story email (Day 4 — share a transformation story or case study), 4) Offer email (Day 6 — make the ask with urgency), 5) Follow-up email (Day 8 — handle objections, last chance). For each email: subject line (3 options), preview text, full body copy, CTA button text. Write them as if ready to load into Mailchimp.`,
      'hire-pack': (f) => `Build a complete hiring pack for the role "${f.role}" at a business described as: "${f.biz}". Include: 1) Job title & summary, 2) Responsibilities (10 bullet points), 3) Required skills, 4) Nice-to-have skills, 5) Compensation range guidance, 6) Where to post the job (free & paid sites), 7) Screening questions for application, 8) 10 interview questions (mix of behavioral, technical, scenario), 9) Scoring rubric (1–5 scale on 5 criteria), 10) Sample offer letter language. Make it ready to use today.`,
      'pricing-strategy': (f) => `Build a complete pricing strategy for "${f.svc}" targeting $${f.target}/month revenue. Include: 1) Three tiered packages (Starter / Pro / Premium) with name, price, and what's included for each, 2) Add-ons / upsells, 3) Retainer/recurring options, 4) Discount strategy (when/why), 5) Pricing psychology tactics (anchoring, decoys, charm pricing), 6) How many clients per tier you need to hit the goal, 7) When to raise prices and by how much, 8) Sample sales-page pricing section copy. Be specific with real dollar amounts.`,
      'intake-form': (f) => `Build a complete client intake form for a "${f.svc}" project. Include: 1) Section headers, 2) Every question to ask (with the right field type — text/dropdown/checkbox/file upload), 3) Required vs optional fields, 4) Conditional logic where helpful, 5) Helper text/placeholders, 6) Confirmation message after submission, 7) Internal notes on what to do with the form data. Format so it can be pasted directly into Google Forms or Typeform. Aim for thorough but not overwhelming.`,
      'email-templates': (f) => `Generate 8 reusable email templates for "${f.biz}". Include: 1) Inquiry response (warm + clear next step), 2) Proposal sent (excited tone), 3) Proposal follow-up (no answer, 3 days later), 4) Invoice reminder (friendly, before due date), 5) Late payment follow-up (firmer but professional), 6) Project kickoff (welcome + what to expect), 7) Project completion / delivery (recap + ask for review), 8) Re-engagement / checkin (after 3 months silence). For each: subject line, full body, signature placeholder. Ready to copy into Gmail or Mailchimp.`,
      'seo-strategy': (f) => `Build a complete SEO strategy for "${f.biz}"${f.loc?' (location: '+f.loc+')':''}. Include: 1) 25 target keywords (mix of high-intent commercial + informational + long-tail), 2) Search volume estimate ranges, 3) Top 5 priority pages to create with title tags + meta descriptions ready to copy, 4) Content cluster topics (5 pillar topics + 3 supporting articles each), 5) Local SEO actions (Google Business Profile, citations, reviews) if location-relevant, 6) Backlink ideas (10 specific outreach opportunities), 7) On-page SEO checklist, 8) 90-day execution plan.`,
      'lead-magnet': (f) => `Design a high-converting lead magnet for "${f.biz}" that solves this audience pain point: "${f.aud}". Include: 1) Lead magnet idea + title (3 options) — bold the strongest, 2) Format recommendation (PDF, checklist, swipe file, mini course, audit, etc.), 3) Full outline with sections, 4) Opt-in landing page copy (headline, subhead, 3 benefit bullets, CTA button text, social proof line), 5) Thank-you page copy, 6) Welcome email delivering the magnet (subject + body), 7) Day 2 follow-up email, 8) How to drive traffic to it (5 specific channels). Ready to launch this week.`,
      'press-release': (f) => `Write a complete press release in AP format for: "${f.event}". Key details: ${f.details}. Include: 1) Strong headline (under 12 words), 2) Optional subhead, 3) Dateline (CITY, State — Date), 4) Lead paragraph (who/what/when/where/why), 5) 2–3 body paragraphs with details and a quote from a key person, 6) Boilerplate "About" paragraph, 7) Media contact line (Name, Title, Email, Phone), 8) "###" close. Write it ready-to-send to journalists with no further editing required.`
    };

    async function bbGenerate(type) {
      const cfg = JSON.parse(localStorage.getItem('settings')) || {};
      const groqKey = cfg.groqApiKey || '';
      const resultEl = document.getElementById('bb-' + type + '-result');
      if (!resultEl) return;
      if (!groqKey) { resultEl.style.display='block'; resultEl.innerHTML='<div style="color:#dc2626;padding:12px;background:#fef2f2;border-radius:8px">⚠️ Add your Groq API key in Settings to use AI tools.</div>'; return; }

      // Gather fields based on type
      const v = (id) => document.getElementById(id)?.value || '';
      const f = {
        biz: v('bv-biz') || v('logo-biz') || v('sm-biz') || v('em-biz') || v('proc-biz') || v('hire-biz') || v('emt-biz') || v('seo-biz') || v('lm-biz') || '',
        tone: v('bv-tone'),
        desc: v('cp-desc') || v('font-desc'),
        type: v('proc-type'),
        tasks: v('auto-tasks'),
        platform: v('sm-platform'),
        product: v('ad-product'),
        audience: v('ad-audience'),
        goal: v('em-goal'),
        role: v('hire-role'),
        svc: v('price-svc') || v('intake-svc'),
        target: v('price-target'),
        loc: v('seo-loc'),
        aud: v('lm-aud'),
        event: v('pr-event'),
        details: v('pr-details')
      };

      const promptFn = BB_PROMPTS[type];
      if (!promptFn) return;
      const userPrompt = promptFn(f);

      resultEl.style.display = 'block';
      resultEl.innerHTML = '<div style="color:var(--brand-primary);font-weight:600">✨ Generating with AI…</div>';

      // Map type to a friendly label for saving
      const BB_LABELS = {
        'brand-voice': { type:'Brand Voice', cat:'Brand' },
        'color-palette': { type:'Color Palette', cat:'Brand' },
        'typography': { type:'Typography Guide', cat:'Brand' },
        'logo-brief': { type:'Logo Brief', cat:'Brand' },
        'process-template': { type:'SOP', cat:'Operations' },
        'automations': { type:'Automation Plan', cat:'Operations' },
        'hire-pack': { type:'Hiring Pack', cat:'Operations' },
        'pricing-strategy': { type:'Pricing Strategy', cat:'Strategy' },
        'intake-form': { type:'Intake Form', cat:'Operations' },
        'email-templates': { type:'Email Templates', cat:'Operations' },
        'social-media': { type:'Social Media Strategy', cat:'Marketing' },
        'ad-copy': { type:'Ad Copy', cat:'Marketing' },
        'email-campaign': { type:'Email Campaign', cat:'Marketing' },
        'seo-strategy': { type:'SEO Strategy', cat:'Marketing' },
        'lead-magnet': { type:'Lead Magnet', cat:'Marketing' },
        'press-release': { type:'Press Release', cat:'Marketing' }
      };
      const label = BB_LABELS[type] || { type:'Document', cat:'AI Output' };

      let fullText = '';
      try {
        const messages = [{ role: 'system', content: 'You are a world-class business strategist and copywriter. Give detailed, specific, ready-to-use output. Never give templates — give the actual finished content. Tailor output to the user\'s specific business and audience; do not default to any specific demographic.' }, { role: 'user', content: userPrompt }];

        // Try Gemini 2.5 Flash first (streaming, higher daily cap than Groq).
        fullText = await _aiStreamGeminiOrNull(messages, (chunk, full) => {
          resultEl.innerHTML = mdRender(full);
        }, { temperature: 0.6, maxTokens: 4096 });

        // Fall back to Groq if Gemini failed.
        if (!fullText) {
          const modelToUse = cfg.aiModel || GROQ_DEFAULT_MODEL;
          console.log('[bbGenerate] Gemini unavailable — using Groq model:', modelToUse);
          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + groqKey },
            body: JSON.stringify({ model: modelToUse, messages, max_tokens: 4096, temperature: 0.6, stream: true })
          });
          if (!res.ok) {
            const errBody = await res.text();
            let detail = errBody.slice(0, 300);
            try { detail = JSON.parse(errBody).error?.message || detail; } catch {}
            console.error('[bbGenerate] API error:', res.status, errBody);
            throw new Error(`Groq ${res.status}: ${detail}`);
          }
          // Buffered SSE parser
          const reader = res.body.getReader(), dec = new TextDecoder();
          let sseBuffer = '';
          const processLine = (line) => {
            if (!line.startsWith('data: ')) return;
            const d = line.slice(6); if (d === '[DONE]') return;
            try { const dt = JSON.parse(d).choices?.[0]?.delta?.content || ''; if (dt) { fullText += dt; resultEl.innerHTML = mdRender(fullText); } } catch(e) {}
          };
          while (true) {
            const { done, value } = await reader.read();
            if (done) { if (sseBuffer) processLine(sseBuffer); break; }
            sseBuffer += dec.decode(value, { stream: true });
            const lines = sseBuffer.split('\n');
            sseBuffer = lines.pop() || '';
            for (const line of lines) processLine(line);
          }
        }
        const cleaned = cleanGroqResponse(fullText);
        const bizName = (f.biz || cfg.businessName || 'Business').trim();
        // Stash for save handlers
        if (!window._bbLast) window._bbLast = {};
        window._bbLast[type] = { content: cleaned, title: `${bizName} — ${label.type}`, type: label.type, cat: label.cat };
        resultEl.innerHTML = mdRender(cleaned) +
          `<div style="margin-top:16px;padding-top:14px;border-top:0.5px solid rgba(0,0,0,0.1);display:flex;gap:8px;flex-wrap:wrap">
            <button onclick="bbSaveBusinessFile('${type}')" class="btn btn-solid" style="padding:8px 16px;font-size:13px">💾 Save to Business File</button>
            <button onclick="bbSaveNote('${type}')" class="btn btn-outline" style="padding:8px 14px;font-size:13px"><span class="icon icon-sm" data-icon="note" style="margin-right:6px;vertical-align:-2px"></span>Save to Notes</button>
            <button onclick="bbCopyResult('${type}')" class="btn btn-outline" style="padding:8px 14px;font-size:13px"><span class="icon icon-sm" data-icon="clipboard" style="margin-right:6px;vertical-align:-2px"></span>Copy</button>
          </div>`;
      } catch(e) {
        console.error('[bbGenerate] failed:', e);
        resultEl.innerHTML = `<div style="color:#dc2626;padding:14px;background:#fef2f2;border-radius:8px;border:1px solid #fca5a5"><strong>⚠️ Error:</strong> ${e.message}<br><span style="font-size:12px;color:#7f1d1d">Check Settings → Groq API key, or open console (F12).</span></div>`;
      }
    }

    function bbSaveBusinessFile(type) {
      const data = window._bbLast?.[type];
      if (!data?.content) { showToast('Generate first.'); return; }
      saveToBusinessFile({ type: data.type, title: data.title, content: data.content });
    }
    function bbSaveNote(type) {
      const data = window._bbLast?.[type];
      if (!data?.content) { showToast('Generate first.'); return; }
      saveAsNote(data.title, data.content, data.cat);
    }
    function bbCopyResult(type) {
      const data = window._bbLast?.[type];
      if (!data?.content) { showToast('Generate first.'); return; }
      navigator.clipboard.writeText(data.content).catch(()=>{});
      showToast('Copied to clipboard ✓','success');
    }

    /* ===== APPLY 10X FASTER ===== */
    function a10xGetKey() {
      const cfg = JSON.parse(localStorage.getItem('settings') || '{}');
      return cfg.groqApiKey || '';
    }
    async function a10xStreamFetch(messages, onChunk, maxTokens) {
      // Try Gemini 2.5 Flash first (higher daily cap than Groq).
      // Adapter: caller's onChunk expects (full), our helper passes (chunk, full).
      const geminiFull = await _aiStreamGeminiOrNull(messages, (chunk, full) => { if (onChunk) onChunk(full); }, { temperature: 0.4, maxTokens: maxTokens || 4096 });
      if (geminiFull) return geminiFull;

      // Fall back to Groq.
      const key = a10xGetKey();
      const cfg = JSON.parse(localStorage.getItem('settings') || '{}');
      const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
        body: JSON.stringify({ model: cfg.aiModel || GROQ_DEFAULT_MODEL, messages, max_tokens: maxTokens || 4096, temperature: 0.4, stream: true })
      });
      if (!resp.ok) { const e = await resp.json().catch(()=>({})); throw new Error(e.error?.message || 'API error ' + resp.status); }
      // Buffered SSE parser
      const reader = resp.body.getReader(), dec = new TextDecoder();
      let full = '';
      let sseBuffer = '';
      const processLine = (line) => {
        if (!line.startsWith('data: ')) return;
        const d = line.slice(6); if (d === '[DONE]') return;
        try { const dt = JSON.parse(d).choices?.[0]?.delta?.content || ''; if (dt) { full += dt; if (onChunk) onChunk(full); } } catch(e) {}
      };
      while (true) {
        const { done, value } = await reader.read();
        if (done) { if (sseBuffer) processLine(sseBuffer); break; }
        sseBuffer += dec.decode(value, { stream: true });
        const lines = sseBuffer.split('\n');
        sseBuffer = lines.pop() || '';
        for (const line of lines) processLine(line);
      }
      return full;
    }
    // Handle file upload / drag-drop for resume
    // ── PERSONAL FILES ────────────────────────────────────────────────────────
    // Owner-private file vault. Files upload to /api/upload under a special
    // "personal-<random>" client ID so they're isolated from any client folder.
    // Metadata stored in localStorage 'personalFiles' + synced to PB.
    function _pfId() {
      const s = JSON.parse(localStorage.getItem('settings') || '{}');
      if (!s._personalFilesId) {
        s._personalFilesId = 'personal-' + Math.random().toString(36).slice(2, 12);
        localStorage.setItem('settings', JSON.stringify(s));
        if (typeof pbWrite === 'function') pbWrite('settings', s);
      }
      return s._personalFilesId;
    }
    async function _pfHandleFile(f) {
      const status = document.getElementById('pf-status');
      if (!f) return;
      if (f.size > 50 * 1024 * 1024) { if (status) status.innerHTML = '<span style="color:var(--error)">File too large (50MB max)</span>'; return; }
      if (status) status.innerHTML = '⏳ Uploading ' + f.name + ' (' + Math.round(f.size/1024) + ' KB)…';
      const cid = _pfId();
      const fd = new FormData();
      fd.append('clientId', cid);
      fd.append('file', f);
      try {
        const r = await fetch(HC_BACKEND + '/api/upload?clientId=' + encodeURIComponent(cid), { method:'POST', body: fd });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const j = await r.json();
        const files = getData('personalFiles') || [];
        files.unshift({
          id: generateId(),
          name: f.name,
          url: j.url,
          size: f.size,
          mime: j.mime || f.type,
          uploadedAt: new Date().toISOString()
        });
        setData('personalFiles', files);
        if (status) status.innerHTML = '<span style="color:#10B981">✓ Uploaded ' + f.name + '</span>';
        renderPersonalFiles();
        setTimeout(() => { if (status) status.innerHTML = ''; }, 4000);
      } catch (e) {
        if (status) status.innerHTML = '<span style="color:var(--error)">⚠ Upload failed: ' + e.message + '</span>';
      }
    }
    function renderPersonalFiles() {
      const list = document.getElementById('pf-list');
      if (!list) return;
      const files = getData('personalFiles') || [];
      const search = (document.getElementById('pf-search')?.value || '').trim().toLowerCase();
      const activeFolder = window._pfActiveFolder || '';

      const afterSearch = search
        ? files.filter(f => (f.name||'').toLowerCase().includes(search) || (f.folder||'').toLowerCase().includes(search))
        : files;
      renderFolderBar('pf', afterSearch);
      const filtered = !activeFolder
        ? afterSearch
        : (activeFolder === '__unfiled'
            ? afterSearch.filter(f => !f.folder)
            : afterSearch.filter(f => f.folder === activeFolder));

      if (!filtered.length) {
        const emptyMsg = files.length
          ? (activeFolder
              ? 'No files in this folder.'
              : 'No files match "' + search.replace(/</g,'&lt;') + '"')
          : 'No files uploaded yet. Drag a file above to get started.';
        list.innerHTML = '<div style="padding:32px 20px;text-align:center;color:#94A3B8;font-size:13px">' + emptyMsg + '</div>';
        return;
      }
      const escH = s => (s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      list.innerHTML = '<table style="width:100%;border-collapse:collapse;font-size:13px">' +
        '<thead><tr style="background:#F8FAFC;border-bottom:1px solid #E2E8F0">' +
        '<th style="text-align:left;padding:9px 12px;font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase">Name</th>' +
        '<th style="text-align:left;padding:9px 12px;font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase">Size</th>' +
        '<th style="text-align:left;padding:9px 12px;font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase">Uploaded</th>' +
        '<th style="text-align:right;padding:9px 12px;font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase">Actions</th>' +
        '</tr></thead><tbody>' +
        filtered.map(f => {
          const dt = new Date(f.uploadedAt);
          const isDoc = f.kind === 'doc';
          const ext = (f.name && f.name.includes('.') ? f.name.split('.').pop() : '').toLowerCase();
          const icon = isDoc ? '🧾'
            : /pdf/.test(ext) ? '📄' : /docx?|odt/.test(ext) ? '📝' : /xlsx?|csv/.test(ext) ? '📊' : /pptx?/.test(ext) ? '📽️' : /png|jpe?g|gif|svg|webp/.test(ext) ? '🖼️' : /mp[34]|wav|m4a|ogg/.test(ext) ? '🎵' : /mp4|mov|webm/.test(ext) ? '🎬' : /zip|rar|7z/.test(ext) ? '🗜️' : '📎';
          const sizeKb = Math.round((f.size || 0) / 1024);
          const sizeLabel = isDoc
            ? (f.type || 'Document')
            : (sizeKb > 1024 ? (sizeKb/1024).toFixed(1) + ' MB' : sizeKb + ' KB');
          const actions = isDoc
            ? ('<button onclick="_pfViewDoc(\'' + f.id + '\')" class="btn btn-outline" style="padding:5px 11px;font-size:11.5px;margin-right:4px">View</button>' +
               '<button onclick="_pfDownloadDoc(\'' + f.id + '\')" class="btn btn-outline" style="padding:5px 11px;font-size:11.5px;margin-right:4px">Download</button>' +
               '<button onclick="_pfRename(\'' + f.id + '\')" class="btn btn-outline" style="padding:5px 11px;font-size:11.5px;margin-right:4px">Rename</button>' +
               '<button onclick="_pfDelete(\'' + f.id + '\')" style="padding:5px 11px;font-size:11.5px;background:none;border:0.5px solid rgba(0,0,0,0.15);border-radius:6px;cursor:pointer;color:#dc2626;font-weight:500">Delete</button>')
            : ('<a href="' + escH(f.url) + '" target="_blank" rel="noopener" class="btn btn-outline" style="padding:5px 11px;font-size:11.5px;text-decoration:none;margin-right:4px">View ↗</a>' +
               '<a href="' + escH(f.url) + '" download="' + escH(f.name) + '" class="btn btn-outline" style="padding:5px 11px;font-size:11.5px;text-decoration:none;margin-right:4px">Download</a>' +
               '<button onclick="_pfRename(\'' + f.id + '\')" class="btn btn-outline" style="padding:5px 11px;font-size:11.5px;margin-right:4px">Rename</button>' +
               '<button onclick="_pfDelete(\'' + f.id + '\')" style="padding:5px 11px;font-size:11.5px;background:none;border:0.5px solid rgba(0,0,0,0.15);border-radius:6px;cursor:pointer;color:#dc2626;font-weight:500">Delete</button>');
          return '<tr style="border-bottom:1px solid #F1F5F9">' +
            '<td style="padding:10px 12px"><div><span style="margin-right:8px;font-size:18px">' + icon + '</span><strong style="color:#0F172A">' + escH(f.name) + '</strong></div>' +
              '<div style="margin-top:5px;margin-left:26px">' + _folderBadgeHTML('pf', f) + '</div></td>' +
            '<td style="padding:10px 12px;color:#64748B">' + sizeLabel + '</td>' +
            '<td style="padding:10px 12px;color:#64748B">' + dt.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) + '</td>' +
            '<td style="padding:10px 12px;text-align:right;white-space:nowrap">' + actions + '</td>' +
          '</tr>';
        }).join('') + '</tbody></table>';
    }

    function _pfViewDoc(id) {
      const f = (getData('personalFiles') || []).find(x => x.id === id);
      if (!f) return;
      const ex = document.getElementById('pf-doc-view'); if (ex) ex.remove();
      const wrap = document.createElement('div');
      wrap.id = 'pf-doc-view';
      wrap.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px';
      wrap.onclick = (e) => { if (e.target === wrap) wrap.remove(); };
      const isHtml = /^\s*<!doctype/i.test(f.content || '') || /<html[\s>]/i.test(f.content || '');
      wrap.innerHTML =
        '<div style="background:#fff;border-radius:14px;max-width:900px;width:100%;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 24px 64px rgba(0,0,0,0.3)">' +
          '<div style="padding:18px 22px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">' +
            '<div><div style="font-size:11px;color:#94A3B8;text-transform:uppercase;font-weight:700;letter-spacing:0.4px">' + (f.type||'Document') + '</div>' +
            '<h2 style="margin:4px 0 0;font-size:17px;font-weight:700;color:#0F172A">' + (f.title||f.name||'Untitled') + '</h2></div>' +
            '<button onclick="document.getElementById(\'pf-doc-view\').remove()" style="background:transparent;border:none;font-size:24px;color:#94A3B8;cursor:pointer">×</button>' +
          '</div>' +
          (isHtml
            ? '<iframe srcdoc="' + (f.content || '').replace(/"/g,'&quot;') + '" sandbox="allow-same-origin" style="flex:1;border:none;background:#fff;min-height:60vh"></iframe>'
            : '<pre style="flex:1;overflow:auto;padding:18px 22px;font-family:var(--font-mono,monospace);font-size:13px;line-height:1.55;white-space:pre-wrap;color:#0F172A;background:#F8FAFC;margin:0;border-radius:0 0 14px 14px">' + (f.content||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</pre>') +
        '</div>';
      document.body.appendChild(wrap);
    }
    function _pfDownloadDoc(id) {
      const f = (getData('personalFiles') || []).find(x => x.id === id);
      if (!f) return;
      const isHtml = /^\s*<!doctype/i.test(f.content || '') || /<html[\s>]/i.test(f.content || '');
      const safeName = (f.title || 'document').replace(/[^a-z0-9_-]+/gi, '_').slice(0, 80) + (isHtml ? '.html' : '.txt');
      const blob = new Blob([f.content || ''], { type: isHtml ? 'text/html' : 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = safeName;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    function _pfRename(id) {
      const files = getData('personalFiles') || [];
      const f = files.find(x => x.id === id);
      if (!f) return;
      const newName = prompt('Rename file:', f.name);
      if (!newName || newName === f.name) return;
      f.name = newName.trim().slice(0, 200);
      setData('personalFiles', files);
      renderPersonalFiles();
    }
    function _pfDelete(id) {
      const files = getData('personalFiles') || [];
      const file = files.find(f => f.id === id);
      if (!file) return;
      if (!confirm('Remove this file from your list? (The file itself stays on the server.)')) return;
      const idx = files.findIndex(f => f.id === id);
      setData('personalFiles', files.filter(f => f.id !== id));
      renderPersonalFiles();
      showUndoToast('File removed', () => {
        const current = getData('personalFiles') || [];
        current.splice(Math.min(idx, current.length), 0, file);
        setData('personalFiles', current);
        renderPersonalFiles();
        showToast('File restored', 'success');
      });
    }
    // ── END PERSONAL FILES ────────────────────────────────────────────────────

    // Career Advancement: pick a saved doc from Business File and load its
    // text into the resume textarea. Filters to docs whose type or title
    // hints at "resume" but allows any saved doc as a fallback.
    async function _a10xPickFromBusinessFile(val) {
      if (!val) return;
      const ta = document.getElementById('a10x-resume');
      if (!ta) return;
      const dropZone = document.getElementById('a10x-drop-zone');
      const flashLoaded = (label, source) => {
        if (!dropZone) return;
        dropZone.style.borderColor = '#10B981';
        const line = dropZone.querySelector('div:nth-child(2)');
        if (line) line.innerHTML = '✓ Loaded "' + (label||'').replace(/</g,'&lt;') + '" from ' + source;
        setTimeout(() => {
          dropZone.style.borderColor = '#cbd5e1';
          if (line) line.innerHTML = '<span style="color:var(--brand-primary);text-decoration:underline">Click to upload</span> or drag &amp; drop';
        }, 3000);
      };

      // Prefixed values: bf:<id> = Business File doc, pf:<id> = Personal File.
      // Bare ids fall back to legacy Business File lookup.
      if (val.startsWith('pf:')) {
        const id = val.slice(3);
        const f = (getData('personalFiles') || []).find(x => x.id === id);
        if (!f) { alert('File not found.'); return; }
        if (!f.url) { alert('This personal file has no downloadable URL.'); return; }
        showToast('Loading "' + (f.name||'file') + '" from Personal Files…', 'info');
        try {
          const res = await fetch(f.url);
          if (!res.ok) throw new Error('HTTP ' + res.status);
          const blob = await res.blob();
          const fakeFile = new File([blob], f.name || 'file', { type: blob.type || '' });
          // Reuse the same parser as the drag-drop upload (handles PDF/DOCX/TXT).
          if (typeof a10xHandleFile === 'function') await a10xHandleFile(fakeFile);
          flashLoaded(f.name, 'Personal Files');
          showToast('Resume loaded from Personal Files', 'success');
        } catch (e) {
          alert('Could not load file: ' + (e && e.message || e));
        }
        return;
      }

      const id = val.startsWith('bf:') ? val.slice(3) : val;
      const doc = (getData('businessFile') || []).find(d => d.id === id);
      if (!doc) { alert('Doc not found.'); return; }
      ta.value = doc.content || '';
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      flashLoaded(doc.title, 'Business File');
      showToast('Resume loaded from Business File', 'success');
    }

    // Populate the saved-docs dropdown whenever the Career page is shown.
    // Lists Personal Files (PDF/DOCX/TXT) and Business File docs, with
    // resumes/cover letters surfaced first.
    function _a10xRefreshBfDropdown() {
      const sel = document.getElementById('a10x-bf-pick');
      if (!sel) return;
      const escAttr = s => (s||'').toString().replace(/&/g,'&amp;').replace(/"/g,'&quot;').slice(0, 90);
      const bizAll = getData('businessFile') || [];
      const isResume = d => /resume|cv|cover\s*letter/i.test((d.type||'') + ' ' + (d.title||''));
      const bizResumes = bizAll.filter(isResume);
      const bizOthers  = bizAll.filter(d => !isResume(d));
      const persAll = getData('personalFiles') || [];
      const isDocLike = f => /\.(pdf|docx?|txt)$/i.test(f.name||'');
      const persDocs = persAll.filter(isDocLike);
      const persResumes = persDocs.filter(f => /resume|cv|cover.?letter/i.test(f.name||''));
      const persOthers  = persDocs.filter(f => !/resume|cv|cover.?letter/i.test(f.name||''));
      const bfOpt = (d) => '<option value="bf:' + d.id + '">' + escAttr('💼 ' + (d.type||'Doc') + ' · ' + (d.title||'')) + '</option>';
      const pfOpt = (f) => '<option value="pf:' + f.id + '">' + escAttr('📎 ' + (f.name||'')) + '</option>';
      let html = '<option value="">— pick a resume from your Personal or Business Files —</option>';
      if (persResumes.length) html += '<optgroup label="Personal Files · Resumes & Cover Letters">' + persResumes.map(pfOpt).join('') + '</optgroup>';
      if (bizResumes.length)  html += '<optgroup label="Business File · Resumes & Cover Letters">' + bizResumes.map(bfOpt).join('') + '</optgroup>';
      if (persOthers.length)  html += '<optgroup label="Personal Files · Other docs">' + persOthers.map(pfOpt).join('') + '</optgroup>';
      if (bizOthers.length)   html += '<optgroup label="Business File · Other docs">' + bizOthers.map(bfOpt).join('') + '</optgroup>';
      sel.innerHTML = html;
    }

    async function a10xHandleFile(file) {
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) { alert('File too large — max 5 MB.'); return; }
      const dropZone = document.getElementById('a10x-drop-zone');
      if (dropZone) dropZone.innerHTML = `<div style="font-size:13px;color:var(--brand-primary);font-weight:600">⏳ Reading ${file.name}…</div>`;
      const ta = document.getElementById('a10x-resume');
      try {
        let text = '';
        const lower = file.name.toLowerCase();
        if (lower.endsWith('.txt') || file.type === 'text/plain') {
          text = await file.text();
        } else if (lower.endsWith('.pdf') || file.type === 'application/pdf') {
          // Load pdf.js on demand
          if (typeof pdfjsLib === 'undefined') {
            await new Promise((res, rej) => {
              const s = document.createElement('script');
              s.src = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js';
              s.onload = res; s.onerror = rej;
              document.head.appendChild(s);
            });
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
          }
          const buf = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
          for (let p = 1; p <= pdf.numPages; p++) {
            const page = await pdf.getPage(p);
            const content = await page.getTextContent();
            text += content.items.map(it => it.str).join(' ') + '\n\n';
          }
        } else if (lower.endsWith('.docx')) {
          // Load mammoth on demand for DOCX
          if (typeof mammoth === 'undefined') {
            await new Promise((res, rej) => {
              const s = document.createElement('script');
              s.src = 'https://cdn.jsdelivr.net/npm/mammoth@1.6.0/mammoth.browser.min.js';
              s.onload = res; s.onerror = rej;
              document.head.appendChild(s);
            });
          }
          const buf = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer: buf });
          text = result.value;
        } else {
          alert('Unsupported file type. Please upload PDF, DOCX, or TXT.');
          a10xResetDropZone();
          return;
        }
        if (ta) ta.value = text.trim();
        if (dropZone) dropZone.innerHTML = `<div style="font-size:13px;color:#10B981;font-weight:600">✅ Loaded: ${file.name} <span style="color:#94a3b8;font-weight:400">— ${text.length.toLocaleString()} characters</span></div><div style="font-size:11px;color:#94a3b8;margin-top:4px;cursor:pointer;text-decoration:underline" onclick="event.stopPropagation();a10xResetDropZone()">Upload a different file</div>`;
      } catch(e) {
        console.error('[a10xHandleFile] failed:', e);
        alert('Could not read this file: ' + e.message + '\n\nTry pasting the text manually.');
        a10xResetDropZone();
      }
    }

    function a10xResetDropZone() {
      const dz = document.getElementById('a10x-drop-zone');
      if (!dz) return;
      dz.innerHTML = `<div style="font-size:22px;margin-bottom:4px">📎</div>
        <div style="font-size:13px;color:#475569;font-weight:500"><span style="color:var(--brand-primary);text-decoration:underline">Click to upload</span> or drag & drop</div>
        <div style="font-size:11px;color:#94a3b8;margin-top:3px">PDF, DOCX, or TXT — max 5 MB</div>`;
      const fi = document.getElementById('a10x-file-input');
      if (fi) fi.value = '';
    }

    function a10xSetStats(score, full, partial, missing) {
      const sd = document.getElementById('a10x-score-display');
      const fd = document.getElementById('a10x-full-display');
      const pd = document.getElementById('a10x-partial-display');
      const md = document.getElementById('a10x-missing-display');
      if (sd) sd.textContent = (score !== null ? score + '%' : '--');
      if (fd) fd.textContent = (full !== null ? full : '--');
      if (pd) pd.textContent = (partial !== null ? partial : '--');
      if (md) md.textContent = (missing !== null ? missing : '--');
    }
    function a10xAddCopyBtn(containerId) {
      const el = document.getElementById(containerId);
      if (!el) return;
      // Remove old action bar if present, then re-add fresh
      const existingBar = el.querySelector('.a10x-action-bar');
      if (existingBar) existingBar.remove();
      const bar = document.createElement('div');
      bar.className = 'a10x-action-bar';
      bar.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;padding-top:14px;border-top:1px solid #F1F4F8';
      // Type label (resume vs cover letter)
      const docType = containerId === 'a10x-resume-result' ? 'Resume'
                    : containerId === 'a10x-cover-result' ? 'Cover Letter'
                    : containerId === 'a10x-analysis-result' ? 'Resume Analysis'
                    : 'Document';
      const grabContent = () => el.innerText.replace(/(📋 Copy to Clipboard|✅ Copied!|💾 Save to Notes|📁 Save to Business File|✓ Saved|❌ Failed)/g, '').trim();
      // Copy
      const copyBtn = document.createElement('button');
      copyBtn.className = 'btn btn-outline';
      copyBtn.style.cssText = 'font-size:12.5px;padding:7px 13px';
      copyBtn.textContent = '📋 Copy to Clipboard';
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(grabContent())
          .then(() => { copyBtn.textContent = '✅ Copied!'; setTimeout(() => copyBtn.textContent = '📋 Copy to Clipboard', 2000); })
          .catch(() => { copyBtn.textContent = '❌ Failed'; setTimeout(() => copyBtn.textContent = '📋 Copy to Clipboard', 2000); });
      };
      // Save to Notes
      const noteBtn = document.createElement('button');
      noteBtn.className = 'btn btn-outline';
      noteBtn.style.cssText = 'font-size:12.5px;padding:7px 13px';
      noteBtn.textContent = '💾 Save to Notes';
      noteBtn.onclick = () => {
        const content = grabContent();
        if (!content) { alert('Nothing to save yet.'); return; }
        const notes = getData('notes') || [];
        const title = docType + ' — ' + new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
        notes.unshift({ id: generateId(), title, body: content, dateCreated: new Date().toISOString(), tags: ['career', docType.toLowerCase()] });
        setData('notes', notes);
        noteBtn.textContent = '✓ Saved to Notes';
        setTimeout(() => noteBtn.textContent = '💾 Save to Notes', 2200);
      };
      // Save to Business File
      const bfBtn = document.createElement('button');
      bfBtn.className = 'btn btn-solid';
      bfBtn.style.cssText = 'font-size:12.5px;padding:7px 13px;background:linear-gradient(135deg,var(--brand-primary),#7C3AED)';
      bfBtn.textContent = '📁 Save to Business File';
      bfBtn.onclick = () => {
        const content = grabContent();
        if (!content) { alert('Nothing to save yet.'); return; }
        const docs = getData('businessFile') || [];
        const title = (function(){
          const t = (prompt('Title for this saved ' + docType + ':', docType + ' — ' + new Date().toLocaleDateString()) || '').trim();
          return t || (docType + ' — ' + new Date().toLocaleDateString());
        })();
        docs.unshift({ id: generateId(), type: docType, title, content, clientId: '', clientName: '', createdAt: new Date().toISOString() });
        setData('businessFile', docs);
        bfBtn.textContent = '✓ Saved to Business File';
        setTimeout(() => bfBtn.textContent = '📁 Save to Business File', 2200);
      };
      bar.appendChild(copyBtn);
      bar.appendChild(noteBtn);
      bar.appendChild(bfBtn);
      el.appendChild(bar);
    }
    async function a10xAnalyze() {
      if (!a10xGetKey()) { alert('Add your Groq API key in Settings first.'); return; }
      const resume = (document.getElementById('a10x-resume') || {}).value || '';
      const job = (document.getElementById('a10x-job') || {}).value || '';
      if (!resume.trim()) { alert('Please paste your resume first.'); return; }
      if (!job.trim()) { alert('Please paste the job description first.'); return; }
      const resultEl = document.getElementById('a10x-analysis-result');
      if (!resultEl) return;
      resultEl.style.display = 'block';
      resultEl.innerHTML = '<div style="color:var(--brand-primary);font-weight:600;padding:12px">🔍 Analyzing your resume against the job description…</div>';
      a10xSetStats(null, null, null, null);
      const sysPrompt = `You are an expert ATS (Applicant Tracking System) analyst and career coach. Your job is to deeply analyze how well a candidate's resume matches a job description.

When given a resume and job description, you will:
1. Extract all key skills, technologies, requirements, and keywords from the job description
2. Compare them to what's in the resume
3. Calculate a match percentage (0–100%) based on keyword and skill overlap
4. Categorize findings as:
   - ✅ Full Matches: exact skills/keywords found in resume
   - 🔶 Partial Matches: related/adjacent skills present
   - ❌ Missing: important requirements not found in resume
5. Provide specific, actionable recommendations

IMPORTANT: Start your response with a JSON block wrapped in \`\`\`json ... \`\`\` containing exactly:
{ "score": <number 0-100>, "full": <count>, "partial": <count>, "missing": <count> }

Then provide the full detailed analysis in markdown below that JSON block.`;
      const messages = [
        { role: 'system', content: sysPrompt },
        { role: 'user', content: `RESUME:\n${resume}\n\n---\n\nJOB DESCRIPTION:\n${job}` }
      ];
      try {
        let fullText = '';
        await a10xStreamFetch(messages, (full) => {
          fullText = full;
          // Strip the JSON block from the displayed markdown — it's only used for parsing stats
          const display = cleanGroqResponse(full).replace(/```json[\s\S]*?```/g, '').trim();
          resultEl.innerHTML = mdRender(display);
          // Live-update stats as JSON appears in the stream
          const liveJson = full.match(/```json\s*([\s\S]*?)```/);
          if (liveJson) {
            try {
              const s = JSON.parse(liveJson[1]);
              a10xSetStats(s.score ?? null, s.full ?? null, s.partial ?? null, s.missing ?? null);
            } catch(e) {}
          }
        }, 4096);
        // Final stats parse
        const jsonMatch = fullText.match(/```json\s*([\s\S]*?)```/);
        if (jsonMatch) {
          try {
            const stats = JSON.parse(jsonMatch[1]);
            a10xSetStats(stats.score ?? null, stats.full ?? null, stats.partial ?? null, stats.missing ?? null);
          } catch(e) { console.warn('[a10xAnalyze] stats parse failed:', e); }
        }
        const cleanText = cleanGroqResponse(fullText).replace(/```json[\s\S]*?```/g, '').trim();
        resultEl.innerHTML = mdRender(cleanText);
        a10xAddCopyBtn('a10x-analysis-result');
        // Scroll up to the stats panel so user sees the score
        const statsPanel = document.getElementById('a10x-score-display');
        if (statsPanel) statsPanel.closest('.card, [style*="grid-template"]')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch(e) {
        console.error('[a10xAnalyze] failed:', e);
        resultEl.innerHTML = `<div style="color:#dc2626;padding:14px;background:#fef2f2;border-radius:8px;border:1px solid #fca5a5"><strong>⚠️ Analysis failed:</strong> ${e.message}<br><span style="font-size:12px;color:#7f1d1d">Check Groq API key in Settings, or try a different model.</span></div>`;
      }
    }
    async function a10xOptimize() {
      if (!a10xGetKey()) { alert('Add your Groq API key in Settings first.'); return; }
      const resume = (document.getElementById('a10x-resume') || {}).value || '';
      const job = (document.getElementById('a10x-job') || {}).value || '';
      if (!resume.trim()) { alert('Please paste your resume first.'); return; }
      if (!job.trim()) { alert('Please paste the job description first.'); return; }
      const resultEl = document.getElementById('a10x-resume-result');
      if (!resultEl) return;
      resultEl.style.display = 'block';
      resultEl.innerHTML = '<div style="color:var(--brand-primary);font-weight:600;padding:12px">✨ Optimizing your resume for this role… (this may take 30–60 seconds)</div>';
      const sysPrompt = `You are an expert resume writer and ATS optimization specialist. ONE RULE OVERRIDES EVERYTHING ELSE: never add a skill, tool, system, certification, responsibility, or experience that is not already in the candidate's resume. If the job description requires something the candidate doesn't have, you do NOT add it — full stop.

WHAT YOU MAY DO (rewriting only):
- Reword existing bullets with stronger action verbs and clearer impact
- Reorder bullets and sections so the most relevant existing items appear first
- Mirror the job description's keyword phrasing ONLY when the resume already shows the same underlying skill (e.g. resume says "answered customer questions about billing" + JD says "claims inquiries" → fine to use "billing inquiries"; resume never mentions billing → NOT fine)
- Quantify achievements that are already on the resume (numbers, %, scale) only if the number is stated or is a faithful interpretation of what's truly there
- Tighten language, fix grammar, fix formatting

WHAT YOU MUST NOT DO (no exceptions):
- Add a skill, technology, tool, software, or system not on the resume (e.g. don't write "processed insurance claims" if the resume never mentions billing/claims)
- Invent metrics, dollar amounts, team sizes, or timeframes that aren't supported
- Translate a vaguely related task into a specific JD requirement (don't reword "answered phones" as "managed multi-line PBX system" unless the resume actually says so)
- Add new bullets, new responsibilities, or new job functions
- Add years of experience, education, certifications, or credentials not on the resume
- Stretch the meaning of an existing bullet to cover a JD keyword that isn't really represented

If the job requires meaningful things the resume lacks, end the response with a clearly labeled separate section:
## Skills to Consider Adding (NOT in the resume above)
- list the gaps here so the candidate knows what to work on — never weave them into the resume body.

Output the FULL optimized resume in clean markdown (don't abbreviate sections), then the optional Skills-to-Consider section if relevant.`;
      const messages = [
        { role: 'system', content: sysPrompt },
        { role: 'user', content: `Please optimize my resume for this job. CRITICAL: do not add anything that isn't already in my resume — only rephrase, reorder, and quantify what's truly there. If the job needs something I don't have, list those gaps separately at the end; never fold them into the resume body.\n\nMY RESUME:\n${resume}\n\n---\n\nJOB DESCRIPTION:\n${job}\n\n---\n\nProvide the full optimized resume in clean markdown format, followed by a "Skills to Consider Adding" list only if there are real gaps.` }
      ];
      try {
        let acc = '';
        await a10xStreamFetch(messages, (full) => {
          acc = full;
          resultEl.innerHTML = mdRender(cleanGroqResponse(full));
        }, 4096);
        a10xAddCopyBtn('a10x-resume-result');
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch(e) {
        console.error('[a10xOptimize] failed:', e);
        resultEl.innerHTML = `<div style="color:#dc2626;padding:14px;background:#fef2f2;border-radius:8px;border:1px solid #fca5a5"><strong>⚠️ Error:</strong> ${e.message}</div>`;
      }
    }
    async function a10xCoverLetter() {
      if (!a10xGetKey()) { alert('Add your Groq API key in Settings first.'); return; }
      const resume = (document.getElementById('a10x-resume') || {}).value || '';
      const job = (document.getElementById('a10x-job') || {}).value || '';
      if (!resume.trim()) { alert('Please paste your resume first.'); return; }
      if (!job.trim()) { alert('Please paste the job description first.'); return; }
      const resultEl = document.getElementById('a10x-cover-result');
      if (!resultEl) return;
      resultEl.style.display = 'block';
      resultEl.innerHTML = '<div style="color:var(--brand-primary);font-weight:600;padding:12px">📝 Writing your cover letter…</div>';
      const sysPrompt = `You are an expert cover letter writer. ONE RULE OVERRIDES EVERYTHING ELSE: never claim a skill, experience, tool, or accomplishment that is not on the candidate's resume. Only use examples and metrics that are truly there.

Write a compelling, personalized cover letter that:
1. Opens with a strong hook showing genuine interest in the specific role and company
2. Highlights 2–3 of the candidate's strongest ACTUAL qualifications that match the job (drawn from the resume only)
3. Uses specific examples and metrics that come from the resume — never invent numbers, durations, or duties
4. Addresses key requirements from the job description ONLY when the resume actually supports them; if the resume doesn't support a requirement, focus on related transferable strengths instead of fabricating
5. Closes with a confident, professional call to action
6. Is 3–4 paragraphs, concise, ready to send
7. Professional yet personable tone
8. Does NOT start with "I am writing to apply for..."

Format: clean markdown, ready to copy directly into an application.`;
      const messages = [
        { role: 'system', content: sysPrompt },
        { role: 'user', content: `Write a cover letter for this job application.\n\nMY RESUME:\n${resume}\n\n---\n\nJOB DESCRIPTION:\n${job}\n\n---\n\nWrite a compelling, job-specific cover letter I can use immediately.` }
      ];
      try {
        await a10xStreamFetch(messages, (full) => {
          resultEl.innerHTML = mdRender(cleanGroqResponse(full));
        }, 2048);
        a10xAddCopyBtn('a10x-cover-result');
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch(e) {
        console.error('[a10xCoverLetter] failed:', e);
        resultEl.innerHTML = `<div style="color:#dc2626;padding:14px;background:#fef2f2;border-radius:8px;border:1px solid #fca5a5"><strong>⚠️ Error:</strong> ${e.message}</div>`;
      }
    }
    /* ===== END APPLY 10X FASTER ===== */

    async function generateBizName() {
      const input = document.getElementById('biz-name-keywords');
      const result = document.getElementById('biz-name-results');
      const btn = document.getElementById('biz-name-btn');
      if (!input || !result) return;
      const keywords = input.value.trim();
      if (!keywords) { alert('Enter keywords first — describe your business, audience, or vibe.'); return; }
      if (btn) { btn.disabled=true; btn.textContent='Generating...'; }
      result.style.display = 'block';
      result.innerHTML = '<div style="color:var(--gray-500);font-size:14px">Asking AI for name ideas...</div>';
      // SHORT focused system prompt (avoids "Request Entity Too Large" from huge HELPCENTER_SYSTEM_PROMPT).
      // Critically: do NOT default to any demographic — let the user's keywords dictate the audience.
      const sysPrompt = `You are a brand naming expert. Generate creative, memorable business names that are professional, brandable, and easy to pronounce.

CRITICAL RULES:
- Base name suggestions ONLY on the user's keywords. Do NOT assume the target audience is Black, women, faith-based, or any specific demographic unless their keywords explicitly indicate it.
- Generate names that fit the INDUSTRY/VIBE in the keywords — neutral and broadly appealing unless the user has stated a target community.
- Each name should be unique, brandable, and check well for domain availability.

Format your response in clean Markdown:
For each of 8 names, provide:
1. **Name** (bold)
2. *Tagline:* short one-liner
3. *Domain note:* likelihood of .com availability (Likely available / May be taken / Try variations)
4. *Why it works:* one sentence on the name's strategic angle`;
      const messages = [
        { role:'system', content: sysPrompt },
        { role:'user',   content: `Generate 8 creative, brandable business name ideas. Keywords describing the business: "${keywords}". Be specific to these keywords — no generic placeholders.` }
      ];
      let accumulated = '';
      try {
        await callAI(messages, (delta, full) => {
          accumulated = full;
          result.classList.add('md-content');
          result.innerHTML = mdRender(full);
        });
        if (!accumulated) {
          result.innerHTML = `<div style="color:#dc2626;padding:12px;background:#fef2f2;border-radius:8px"><strong>⚠️ No response from AI.</strong><br><span style="font-size:12px">Check your Groq API key in Settings, or try a different model.</span></div>`;
        } else {
          result.classList.add('md-content');
          result.innerHTML = mdRender(cleanGroqResponse(accumulated)) +
            `<div style="margin-top:14px;padding-top:12px;border-top:0.5px solid rgba(0,0,0,0.1)">
              <button onclick="saveAsNote('Business Name Ideas: ${keywords.replace(/'/g, '')}', \`${cleanGroqResponse(accumulated).replace(/`/g,"'")}\`, 'Business Idea')" class="btn btn-outline" style="padding:7px 14px;font-size:12px"><span class="icon icon-sm" data-icon="note" style="margin-right:6px;vertical-align:-2px"></span>Save to Notes</button>
            </div>`;
        }
      } catch(e) {
        console.error('[generateBizName] failed:', e);
        result.innerHTML = `<div style="color:#dc2626;padding:12px;background:#fef2f2;border-radius:8px"><strong>⚠️ Error:</strong> ${e.message}<br><span style="font-size:12px">Check console (F12) for details. Verify your Groq API key in Settings.</span></div>`;
      }
      if (btn) { btn.disabled=false; btn.textContent='✨ Regenerate Names'; }
    }

    function showLegalInfo(type, el) {
      document.querySelectorAll('#builder-page .tool-option').forEach(o=>o.style.background='');
      if (el) el.style.background = 'rgba(66,103,178,0.1)';
      const info = {
        llc: '<strong>LLC (Limited Liability Company)</strong> is the best starting point for most entrepreneurs. Your personal assets are protected from business debts. Flexible tax options. Easy to maintain. <strong>Recommended for H.E.L.P. Center clients.</strong> File in your state via the SOS website — see State Resources for fees.',
        scorp: '<strong>S-Corp</strong> is best once you\'re making $50K+/year and want to reduce self-employment tax. You pay yourself a salary and take the rest as distributions — the distributions aren\'t subject to SE tax. Requires more paperwork than an LLC. Often an LLC taxed as S-Corp (called "LLC/S-Corp election") is the move.',
        sole: '<strong>Sole Proprietorship</strong> requires no formal registration — you\'re automatically a sole prop if you operate under your own name. Zero protection of personal assets. Good for testing a business idea before committing, but move to an LLC as soon as you\'re making real money or taking on clients.'
      };
      const el2 = document.getElementById('legal-info');
      if (el2) { el2.innerHTML = info[type]||''; el2.style.display='block'; }
    }

