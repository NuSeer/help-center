// H.E.L.P. Center SaaS Backend Server
// Handles AI (Groq), Resend email, DocuSeal, and Stripe
// Run: node server.js  |  Keep alive: pm2 start server.js --name helpcenter

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const fetch   = (...a) => import('node-fetch').then(({default:f}) => f(...a));
const webpush = require('web-push');
try {
  if (process.env.VAPID_PUBLIC && process.env.VAPID_PRIVATE) {
    webpush.setVapidDetails(process.env.VAPID_SUBJECT || 'mailto:joy@thehelpctr.com', process.env.VAPID_PUBLIC, process.env.VAPID_PRIVATE);
    console.log('[push] VAPID configured');
  } else { console.warn('[push] VAPID keys missing — push disabled'); }
} catch (e) { console.error('[push] VAPID setup failed:', e.message); }

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '2mb' }));

// ─── HEALTH CHECK ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── AI PROXY (Groq → Llama 3.3 70B) ────────────────────────────────────────
// Receives: { messages: [...], stream: true/false, context: 'page context string' }
// Returns: SSE stream or JSON response

const GROQ_SYSTEM_PROMPT = `You are an elite business coach and strategic advisor. You operate at the level of a seasoned McKinsey consultant combined with a street-smart entrepreneur who has built real businesses from nothing.

YOUR COMMUNICATION STANDARD:
- Be detailed, specific, and explicit — never vague or generic
- Give real numbers, real platforms, real timelines, real costs
- Structure every response clearly: use headers, numbered steps, bullet points
- When someone asks a question, answer it completely — not halfway
- Think three steps ahead and tell the client what they're not asking but need to know
- Call out mistakes directly and kindly — sugarcoating wastes their time
- Back up recommendations with reasoning — "do this because..."

YOUR EXPERTISE COVERS:
1. Business Formation & Legal — LLC, S-Corp, holding companies, EINs, operating agreements, registered agents
2. Business Credit & Finance — D&B, Paydex scores, vendor credit, business bank accounts, CDFI loans, SBA programs, ROSCAs, the 3-Bank Method
3. Personal Credit Repair — dispute letters, FCRA rights, secured cards, credit-builder loans, pay-for-delete, goodwill letters
4. Revenue & Pricing Strategy — service packaging, value-based pricing, retainer models, upsells, passive income, digital products
5. Marketing & Client Acquisition — social media, referral systems, Google Business, email marketing, content strategy, lead magnets
6. Operations & Systems — CRM setup, booking systems, contract templates, automation, SOPs, team building
7. Digital Presence — websites, branding, SEO basics, landing pages, portfolio strategy
8. Mindset & Leadership — imposter syndrome, pricing confidence, boundary setting, visibility, executive presence
9. Career Strategy — promotions, salary negotiation, LinkedIn optimization, career pivots, networking
10. Youth & Community Programs — curriculum design, program pricing, grant writing, school partnerships, legal safeguarding

RESPONSE FORMAT RULES:
- Short question → direct answer first, then expand with context
- Complex question → start with a 1-sentence summary, then break into numbered steps or sections
- Always end with: either a next action ("Your next step is...") or a clarifying question if more info is needed
- Use dollar amounts and timeframes whenever relevant: not "it costs some money" but "typically $100-$300 for state filing"
- If you see a mistake in their plan, say so: "One issue I see here is..."
- Never say "it depends" without immediately explaining what it depends on and the answer for each scenario

TONE:
- Direct, warm, and professional — like a mentor who respects your intelligence
- No filler phrases: no "Great question!", no "Certainly!", no "Of course!"
- Confident — you know this material cold
- Culturally aware — you understand that many clients face systemic barriers and you factor that into your advice without being patronizing

You are embedded inside a business management dashboard. The client is working in real-time on their business. Give them advice they can act on today.`;

app.post('/api/ai', async (req, res) => {
  const { messages = [], stream = true, systemOverride } = req.body;
  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'Groq API key not configured on server' });
  }

  const systemPrompt = systemOverride || GROQ_SYSTEM_PROMPT;
  const payload = {
    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    messages: [{ role: 'system', content: systemPrompt }, ...messages],
    temperature: 0.7,
    max_tokens: 2048,
    stream
  };

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      return res.status(groqRes.status).json({ error: err });
    }

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      groqRes.body.pipe(res);
    } else {
      const data = await groqRes.json();
      res.json(data);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── RESEND EMAIL ─────────────────────────────────────────────────────────────
// Receives: { to, subject, html, fromName, fromEmail }
app.post('/api/email', async (req, res) => {
  const { to, subject, html, fromName, fromEmail, replyToEmail, replyToName } = req.body;
  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'Resend API key not configured on server' });
  }
  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, html' });
  }

  // Always send FROM the verified Resend domain. fromName/fromEmail are accepted
  // but only used if the supplied email is the same domain as the verified one
  // (otherwise Resend rejects with a 403). Unverified senders go in Reply-To.
  const verifiedEmail = process.env.RESEND_FROM_EMAIL || 'noreply@thehelpctr.com';
  const verifiedDomain = (verifiedEmail.split('@')[1] || '').toLowerCase();
  const requestedEmail = (fromEmail || verifiedEmail).toLowerCase();
  const senderEmail = requestedEmail.endsWith('@' + verifiedDomain) ? requestedEmail : verifiedEmail;
  const senderName  = fromName  || process.env.RESEND_FROM_NAME  || 'H.E.L.P. Center';

  // If the original requestedEmail wasn't on the verified domain (e.g. a client
  // writing in via /portal.html), put it in reply_to so the owner can hit reply.
  const replyTo = [];
  if (replyToEmail) {
    replyTo.push(replyToName ? `${replyToName} <${replyToEmail}>` : replyToEmail);
  } else if (fromEmail && !fromEmail.toLowerCase().endsWith('@' + verifiedDomain)) {
    replyTo.push(fromName ? `${fromName} <${fromEmail}>` : fromEmail);
  }

  const body = {
    from: `${senderName} <${senderEmail}>`,
    to: Array.isArray(to) ? to : [to],
    subject,
    html
  };
  if (replyTo.length) body.reply_to = replyTo;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    const data = await r.json();
    if (!r.ok) {
      // Flatten Resend's structured error into a single string so the caller's
      // `new Error(errBody.error)` produces a useful message instead of "[object Object]".
      const msg = (data && (data.message || data.error || data.name)) || ('Resend HTTP ' + r.status);
      console.error('[email] Resend error:', JSON.stringify(data));
      return res.status(r.status).json({ error: String(msg) });
    }
    res.json({ success: true, id: data.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── DOCUSEAL PROXY ───────────────────────────────────────────────────────────
// Receives: { submitterEmail, submitterName, templateId, fields }
app.post('/api/docuseal', async (req, res) => {
  const docusealUrl   = process.env.DOCUSEAL_URL;
  const docusealToken = process.env.DOCUSEAL_TOKEN;
  if (!docusealUrl || !docusealToken) {
    return res.status(500).json({ error: 'DocuSeal not configured on server' });
  }

  const { submitterEmail, submitterName, templateId, fields = [] } = req.body;
  if (!submitterEmail || !templateId) {
    return res.status(400).json({ error: 'Missing submitterEmail or templateId' });
  }

  try {
    const r = await fetch(`${docusealUrl}/api/submissions`, {
      method: 'POST',
      headers: {
        'X-Auth-Token': docusealToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        template_id: templateId,
        send_email: true,
        submitters: [{
          role: 'First Party',
          email: submitterEmail,
          name: submitterName || '',
          fields
        }]
      })
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data });
    res.json({ success: true, submission: data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── STRIPE WEBHOOK ───────────────────────────────────────────────────────────
// Receives raw body from Stripe, verifies signature, provisions tenant
app.post('/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig    = req.headers['stripe-signature'];
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) return res.status(500).send('Webhook secret not configured');

    let event;
    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      event = stripe.webhooks.constructEvent(req.body, sig, secret);
    } catch (err) {
      console.error('Webhook signature failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      if (session.mode === 'subscription') {
        // SaaS tenant signup
        const email = session.customer_email || session.customer_details?.email;
        const plan  = session.metadata?.plan || 'solo';
        console.log(`New subscriber: ${email} — Plan: ${plan}`);
        // TODO: Create PocketBase user account here
      } else if (session.mode === 'payment') {
        // Client paid an invoice via /api/owner/invoice/send's Stripe Checkout.
        // Writes invoice:paid:<INV> to PB store; the realtime listener in the
        // Help Center portal flips the invoice to Paid and fires the
        // notification + email (see _handleStoreEvent in app-phase1.js).
        // _pbUpsert is defined later in this file but hoisting makes it safe.
        const invoiceNumber = session.metadata?.invoiceNumber || session.client_reference_id;
        if (invoiceNumber) {
          const payload = {
            invoiceNumber,
            amount: (session.amount_total || 0) / 100,
            currency: session.currency || 'usd',
            clientEmail: session.customer_email || session.customer_details?.email || '',
            clientName: session.customer_details?.name || session.metadata?.clientName || '',
            portalToken: session.metadata?.portalToken || '',
            paidAt: new Date().toISOString().split('T')[0],
            stripeSessionId: session.id,
            firedAt: new Date().toISOString()
          };
          try {
            _pbUpsert('invoice:paid:' + invoiceNumber, payload);
            console.log('Invoice paid via Stripe Checkout:', invoiceNumber, payload.amount);
          } catch (e) {
            console.error('Failed to write invoice:paid to PB:', e.message);
          }
        } else {
          console.warn('Stripe one-off payment received but no invoiceNumber in metadata — skipping PB write');
        }
      }
    }

    // Backup signal — PaymentIntent path (set on /api/stripe/invoice-checkout
    // via payment_intent_data.metadata). Same upsert; safe if it fires after
    // the Checkout path because we upsert by the same key.
    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object;
      const invoiceNumber = pi.metadata?.invoiceNumber;
      if (invoiceNumber) {
        const payload = {
          invoiceNumber,
          amount: (pi.amount_received || pi.amount || 0) / 100,
          currency: pi.currency || 'usd',
          clientEmail: pi.receipt_email || '',
          clientName: pi.metadata?.clientName || '',
          portalToken: pi.metadata?.portalToken || '',
          paidAt: new Date().toISOString().split('T')[0],
          stripePaymentIntentId: pi.id,
          firedAt: new Date().toISOString()
        };
        try {
          _pbUpsert('invoice:paid:' + invoiceNumber, payload);
          console.log('Invoice paid via Stripe PI:', invoiceNumber, payload.amount);
        } catch (e) {
          console.error('Failed to write invoice:paid to PB:', e.message);
        }
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const sub   = event.data.object;
      const email = sub.customer_email || '';
      console.log(`Subscription cancelled: ${email}`);
      // TODO: Deactivate PocketBase user here
    }

    res.json({ received: true });
  }
);

// ─── STRIPE CHECKOUT SESSION ──────────────────────────────────────────────────
// Creates a Stripe Checkout session for subscription signup
app.post('/api/stripe/checkout', async (req, res) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }
  const { plan = 'solo', email } = req.body;
  const priceId = plan === 'pro'
    ? process.env.STRIPE_PRICE_PRO
    : process.env.STRIPE_PRICE_SOLO;

  if (!priceId) {
    return res.status(500).json({ error: `Stripe price ID for plan "${plan}" not configured` });
  }

  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 7,
        metadata: { plan }
      },
      metadata: { plan },
      success_url: `${process.env.APP_URL || 'http://187.124.146.184:8090'}/help-center-system.html?setup=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.APP_URL || 'http://187.124.146.184:8090'}/landing.html`
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// ADDITIONS TO H.E.L.P. CENTER BACKEND — apply by inserting BEFORE app.listen
// ═══════════════════════════════════════════════════════════════════════════

const path   = require('path');
const fs     = require('fs');
const multer = require('multer');

// ─── CLIENT FILE UPLOADS (public-readable, owner-controlled namespace) ──────
// Files land in /opt/helpcenter-backend/uploads/{clientId}/{timestamp}-{name}
// and are served at GET /uploads/{clientId}/{filename}
const UPLOADS_ROOT = path.join(__dirname, 'uploads');
fs.mkdirSync(UPLOADS_ROOT, { recursive: true });

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const cid = (req.query.clientId || req.body.clientId || "misc").replace(/[^a-z0-9_-]/gi, '');
    const dir = path.join(UPLOADS_ROOT, cid || 'misc');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const safeBase = file.originalname.replace(/[^a-z0-9._-]/gi, '_').slice(0, 80);
    cb(null, Date.now() + '-' + safeBase);
  }
});
const upload = multer({
  storage: fileStorage,
  limits: { fileSize: 50 * 1024 * 1024 }  // 50 MB cap
});

app.use('/uploads', express.static(UPLOADS_ROOT, { maxAge: '7d' }));

// Agency OS agents — served for LVS collaboration feature
app.get('/agency-agents.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'agency-agents.json'));
});

// Agency OS — serve the standalone app and its agents data
app.get('/agency.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'agency.html'));
});
app.get('/agents.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'agency-agents.json'));
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file received (use field name "file")' });
  const cid = (req.body.clientId || 'misc').replace(/[^a-z0-9_-]/gi, '') || 'misc';
  const publicUrl = (process.env.APP_URL || 'http://187.124.146.184:3001')
    .replace(/\/$/, '') + '/uploads/' + cid + '/' + path.basename(req.file.filename);
  res.json({
    ok: true,
    url: publicUrl,
    filename: req.file.originalname,
    size: req.file.size,
    mime: req.file.mimetype,
    clientId: cid
  });
});

// ─── STRIPE ONE-OFF INVOICE CHECKOUT (per-client invoice payment) ──────────
// Creates a one-time Checkout Session for an invoice amount. Separate from
// the subscription endpoint above — this one is for charging a client an
// arbitrary dollar amount, not enrolling them in a recurring plan.
app.post('/api/stripe/invoice-checkout', async (req, res) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe not configured on server' });
  }
  const {
    amount, currency = 'usd', description, siteTag = 'HC',
    clientName, clientEmail, successUrl, cancelUrl, metadata = {}
  } = req.body;
  const cents = parseInt(amount, 10);
  if (!cents || cents < 50) return res.status(400).json({ error: 'amount must be cents and >= 50' });
  const cleanTag = String(siteTag).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: description || 'Invoice payment',
            description: clientName ? ('For: ' + clientName) : undefined
          },
          unit_amount: cents
        },
        quantity: 1
      }],
      customer_email: clientEmail || undefined,
      success_url: successUrl || (process.env.APP_URL || 'http://187.124.146.184:3001') + '/help-center-system.html#paid',
      cancel_url:  cancelUrl  || (process.env.APP_URL || 'http://187.124.146.184:3001') + '/help-center-system.html',
      payment_intent_data: {
        statement_descriptor_suffix: cleanTag,
        metadata
      },
      metadata
    });
    res.json({ url: session.url, id: session.id });
  } catch (e) {
    console.error('[stripe invoice-checkout]', e.message);
    res.status(500).json({ error: e.message });
  }
});


// ═══════════════════════════════════════════════════════════════════════════
// OWNER QUICK-UPLOAD ENDPOINTS (used by /upload.html)
// ═══════════════════════════════════════════════════════════════════════════
// Read/write PocketBase data directly via the sqlite3 CLI so we don't need to
// hold long-lived PB superuser credentials in this process.
const { execSync } = require('child_process');
const PB_DB = '/opt/pocketbase/pb_data/data.db';

function _pbGet(key) {
  try {
    const safeKey = String(key).replace(/'/g, "''");
    const out = execSync(`sqlite3 ${PB_DB} "SELECT value FROM store WHERE key='${safeKey}' LIMIT 1;"`, { encoding: 'utf8' });
    return out.trim() ? JSON.parse(out.trim()) : null;
  } catch (e) {
    console.error('[pbGet]', key, e.message);
    return null;
  }
}

function _pbSet(key, val) {
  const safeKey = String(key).replace(/'/g, "''");
  const tmpFile = `/tmp/pbset-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.json`;
  fs.writeFileSync(tmpFile, JSON.stringify(val));
  const ts = new Date().toISOString().replace('T', ' ');
  try {
    execSync(`sqlite3 ${PB_DB} "UPDATE store SET value=readfile('${tmpFile}'), updated='${ts}' WHERE key='${safeKey}';"`);
  } finally {
    try { fs.unlinkSync(tmpFile); } catch (e) {}
  }
}

function _pbUpsert(key, val) {
  const safeKey = String(key).replace(/'/g, "''");
  const tmpFile = `/tmp/pbupsert-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.json`;
  fs.writeFileSync(tmpFile, JSON.stringify(val));
  const ts = new Date().toISOString().replace('T', ' ');
  try {
    const countOut = execSync(`sqlite3 ${PB_DB} "SELECT COUNT(*) FROM store WHERE key='${safeKey}';"`, { encoding: 'utf8' }).trim();
    if (countOut === '0') {
      execSync(`sqlite3 ${PB_DB} "INSERT INTO store (key, value, updated) VALUES ('${safeKey}', readfile('${tmpFile}'), '${ts}');"`);
    } else {
      execSync(`sqlite3 ${PB_DB} "UPDATE store SET value=readfile('${tmpFile}'), updated='${ts}' WHERE key='${safeKey}';"`);
    }
  } finally {
    try { fs.unlinkSync(tmpFile); } catch (e) {}
  }
}

function _verifyOwner(req) {
  const submitted = (req.body && req.body.password) || req.get('x-owner-password') || '';
  if (!submitted) return false;
  const settings = _pbGet('settings');
  if (!settings || !settings.password) return false;
  return String(submitted) === String(settings.password);
}

// POST /api/owner/clients — returns the client list (auth-gated)
app.post('/api/owner/clients', (req, res) => {
  if (!_verifyOwner(req)) return res.status(401).json({ error: 'Invalid owner password' });
  const clients = _pbGet('clients') || [];
  // Slim the response — only the fields the upload UI needs
  const trimmed = clients.map(c => ({
    id: c.id,
    portalToken: c.portalToken,
    name: c.name,
    businessName: c.businessName,
    email: c.email,
    service: c.service,
    status: c.status
  }));
  res.json({ ok: true, clients: trimmed });
});

// POST /api/owner/booking/list - returns the booking-requests log (auth-gated)
// Body: { password, status?:'pending'|'all' }
app.post('/api/owner/booking/list', (req, res) => {
  if (!_verifyOwner(req)) return res.status(401).json({ error: 'Invalid owner password' });
  const { status } = req.body || {};
  const rec = _pbGet('booking-requests') || { requests: [] };
  let reqs = Array.isArray(rec.requests) ? rec.requests : [];
  if (status === 'pending') reqs = reqs.filter(r => (r.status || 'pending') === 'pending');
  res.json({ ok: true, requests: reqs });
});

// POST /api/owner/booking/update - mark a request as accepted/declined/done
// Body: { password, requestId, status }
app.post('/api/owner/booking/update', async (req, res) => {
  if (!_verifyOwner(req)) return res.status(401).json({ error: 'Invalid owner password' });
  const { requestId, status } = req.body || {};
  if (!requestId || !status) return res.status(400).json({ error: 'requestId and status are required' });
  const rec = _pbGet('booking-requests') || { requests: [] };
  const idx = (rec.requests || []).findIndex(r => r.id === requestId);
  if (idx < 0) return res.status(404).json({ error: 'request not found' });
  rec.requests[idx].status = status;
  rec.requests[idx].handledAt = new Date().toISOString();
  _pbUpsert('booking-requests', rec);

  // Auto-notify the client on confirm/decline so they always hear back, even
  // when the owner doesn't write a detailed personal reply. Best-effort: a
  // failure here never fails the status update. Other statuses don't email.
  let emailed = false;
  const bk = rec.requests[idx];
  const notify = (status === 'confirmed' || status === 'declined');
  if (notify && bk.email && process.env.RESEND_API_KEY && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(bk.email)) {
    const ownerEmail = process.env.RESEND_FROM_EMAIL || 'joy@thehelpctr.com';
    const ownerName = process.env.RESEND_FROM_NAME || 'Joy Watford';
    const escH = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const dateLabel = bk.date ? new Date(bk.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '';
    const bookingUrl = 'https://thehelpctr.com/booking.html';

    let subject, headline, bodyHtml;
    if (status === 'confirmed') {
      subject = 'Your booking is confirmed — H.E.L.P. Center';
      headline = "You're confirmed! 🎉";
      bodyHtml =
        '<p style="margin:0 0 14px">Hi ' + escH(bk.name) + ',</p>' +
        '<p style="margin:0 0 14px">Good news — ' + escH(ownerName) + ' confirmed your time. We look forward to speaking with you!</p>' +
        '<div style="padding:14px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;font-size:14px;color:#475569">' +
          '<strong style="color:#0F172A">Your confirmed time</strong><br>' +
          escH(dateLabel) + (bk.time ? '<br>' + escH(bk.time) : '') +
          (bk.service ? '<br>About: ' + escH(bk.service) : '') +
        '</div>' +
        '<p style="margin:16px 0 0;font-size:13px;color:#64748B">Need to reschedule? Just reply to this email.</p>';
    } else {
      subject = 'About your booking request — H.E.L.P. Center';
      headline = 'About your requested time';
      bodyHtml =
        '<p style="margin:0 0 14px">Hi ' + escH(bk.name) + ',</p>' +
        '<p style="margin:0 0 14px">Thanks so much for reaching out. Unfortunately we\'re not able to confirm the time you requested' + (dateLabel ? ' (' + escH(dateLabel) + (bk.time ? ', ' + escH(bk.time) : '') + ')' : '') + '.</p>' +
        '<p style="margin:0 0 14px">We\'d still love to connect — please pick another time that works for you:</p>' +
        '<p style="margin:0 0 14px"><a href="' + bookingUrl + '" style="display:inline-block;background:#1E5BC0;color:#fff;text-decoration:none;font-weight:700;padding:11px 20px;border-radius:8px;font-size:14px">Choose another time →</a></p>' +
        '<p style="margin:16px 0 0;font-size:13px;color:#64748B">Or just reply to this email and we\'ll find something that fits.</p>';
    }

    const html =
      '<div style="font-family:Helvetica,Arial,sans-serif;background:#F1F5F9;padding:24px">' +
        '<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(15,23,42,0.08)">' +
          '<div style="background:linear-gradient(135deg,#0F172A,#1e3a5f);padding:22px;color:#fff">' +
            '<div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.75">H.E.L.P. Center</div>' +
            '<div style="font-size:20px;font-weight:700;margin-top:4px">' + headline + '</div>' +
          '</div>' +
          '<div style="padding:24px;color:#1F2937;font-size:15px;line-height:1.7">' + bodyHtml + '</div>' +
        '</div>' +
      '</div>';

    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'H.E.L.P. Center <' + ownerEmail + '>',
          to: [bk.email],
          subject,
          html,
          reply_to: [ownerName + ' <' + ownerEmail + '>']
        })
      });
      emailed = r.ok;
      if (!r.ok) { const d = await r.json().catch(() => ({})); console.error('[booking/update notify]', (d && (d.message || d.error)) || ('HTTP ' + r.status)); }
    } catch (e) {
      console.error('[booking/update notify send]', e.message);
    }
  }

  res.json({ ok: true, request: rec.requests[idx], emailed });
});

// POST /api/owner/booking/request - public booking-request from booking.html (no auth)
// Emails the owner with the request details. Stored in a flat 'booking-requests' log key.
app.post('/api/owner/booking/request', async (req, res) => {
  const { bookingToken, name, email, phone, service, date, time, notes } = req.body || {};
  if (!name || !email || !date || !time) {
    return res.status(400).json({ error: 'name, email, date, and time are required' });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'invalid email' });
  }

  // Store the request (append-only) so the owner can see all requests in one place
  const reqRecord = {
    id: 'br-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    bookingToken: bookingToken || '',
    name, email, phone: phone || '', service: service || '', date, time, notes: notes || '',
    receivedAt: new Date().toISOString(),
    status: 'pending'
  };
  try {
    const key = 'booking-requests';
    const existing = _pbGet(key) || { requests: [] };
    if (!Array.isArray(existing.requests)) existing.requests = [];
    existing.requests.unshift(reqRecord); // newest first
    existing.requests = existing.requests.slice(0, 200); // cap log size
    _pbUpsert(key, existing);
  } catch (e) {
    console.error('[booking/request store]', e.message);
    // Continue and email even if store failed
  }

  // Instant push alert to the owner's devices.
  _sendPushAll({ title: '📅 New booking request', body: name + ' — ' + date + (time ? ' ' + time : ''), url: 'https://thehelpctr.com/help-center-system.html' }).catch(() => {});

  // Email the owner
  const ownerEmail = process.env.RESEND_FROM_EMAIL || 'joy@thehelpctr.com';
  const ownerName = process.env.RESEND_FROM_NAME || 'Joy Watford';
  const escH = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const dateLabel = new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const html =
    '<div style="font-family:Helvetica,Arial,sans-serif;background:#F1F5F9;padding:24px">' +
      '<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(15,23,42,0.08)">' +
        '<div style="background:linear-gradient(135deg,#0F172A,#1e3a5f);padding:22px;color:#fff">' +
          '<div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.75">H.E.L.P. Center</div>' +
          '<div style="font-size:20px;font-weight:700;margin-top:4px">New booking request</div>' +
        '</div>' +
        '<div style="padding:24px;color:#1F2937;font-size:15px;line-height:1.7">' +
          '<table style="width:100%;border-collapse:collapse">' +
            '<tr><td style="padding:8px 0;font-weight:700;width:120px;color:#64748B;font-size:13px">Name</td><td style="padding:8px 0">' + escH(name) + '</td></tr>' +
            '<tr><td style="padding:8px 0;font-weight:700;color:#64748B;font-size:13px">Email</td><td style="padding:8px 0"><a href="mailto:' + encodeURIComponent(email) + '" style="color:#1E5BC0">' + escH(email) + '</a></td></tr>' +
            (phone ? '<tr><td style="padding:8px 0;font-weight:700;color:#64748B;font-size:13px">Phone</td><td style="padding:8px 0">' + escH(phone) + '</td></tr>' : '') +
            '<tr><td style="padding:8px 0;font-weight:700;color:#64748B;font-size:13px">Date</td><td style="padding:8px 0">' + escH(dateLabel) + '</td></tr>' +
            '<tr><td style="padding:8px 0;font-weight:700;color:#64748B;font-size:13px">Time</td><td style="padding:8px 0">' + escH(time) + '</td></tr>' +
            (service ? '<tr><td style="padding:8px 0;font-weight:700;color:#64748B;font-size:13px">About</td><td style="padding:8px 0">' + escH(service) + '</td></tr>' : '') +
          '</table>' +
          (notes ? '<div style="margin-top:18px;padding:14px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;font-size:13.5px;color:#475569"><strong style="color:#0F172A">Notes from ' + escH(name) + ':</strong><br>' + escH(notes).replace(/\n/g, '<br>') + '</div>' : '') +
          '<div style="margin-top:24px;font-size:13px;color:#64748B">Reply directly to this email to confirm or suggest a different time. ' + (bookingToken ? '<br><span style="font-family:monospace;font-size:11px;color:#94A3B8">Token: ' + escH(bookingToken) + '</span>' : '') + '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  if (!process.env.RESEND_API_KEY) {
    console.warn('[booking/request] No Resend key; request stored but no email sent');
    return res.json({ ok: true, emailed: false });
  }
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'H.E.L.P. Center <' + ownerEmail + '>',
        to: [ownerEmail],
        subject: 'Booking request from ' + name + ' - ' + dateLabel,
        html,
        reply_to: [name + ' <' + email + '>']
      })
    });
    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      const msg = (data && (data.message || data.error || data.name)) || ('Resend HTTP ' + r.status);
      console.error('[booking/request resend]', msg);
      return res.json({ ok: true, emailed: false, emailError: String(msg) });
    }
  } catch (e) {
    console.error('[booking/request send]', e.message);
    return res.json({ ok: true, emailed: false, emailError: e.message });
  }

  // Send the requester a confirmation copy of their booking request. Best-effort:
  // a failure here doesn't fail the request (the owner email already went out).
  try {
    const confHtml =
      '<div style="font-family:Helvetica,Arial,sans-serif;background:#F1F5F9;padding:24px">' +
        '<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(15,23,42,0.08)">' +
          '<div style="background:linear-gradient(135deg,#0F172A,#1e3a5f);padding:22px;color:#fff">' +
            '<div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.75">H.E.L.P. Center</div>' +
            '<div style="font-size:20px;font-weight:700;margin-top:4px">We received your request</div>' +
          '</div>' +
          '<div style="padding:24px;color:#1F2937;font-size:15px;line-height:1.7">' +
            '<p style="margin:0 0 14px">Hi ' + escH(name) + ',</p>' +
            '<p style="margin:0 0 14px">Thanks for reaching out to H.E.L.P. Center! We received your request and ' + escH(ownerName) + ' will be in touch within <strong>48 hours</strong> to confirm your time or suggest another.</p>' +
            '<div style="padding:14px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;font-size:14px;color:#475569">' +
              '<strong style="color:#0F172A">Your requested time</strong><br>' +
              escH(dateLabel) + '<br>' + escH(time) +
              (service ? '<br>About: ' + escH(service) : '') +
            '</div>' +
            '<p style="margin:16px 0 0;font-size:13px;color:#64748B">Need to change something? Just reply to this email.</p>' +
          '</div>' +
        '</div>' +
      '</div>';
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'H.E.L.P. Center <' + ownerEmail + '>',
        to: [email],
        subject: 'We received your booking request — H.E.L.P. Center',
        html: confHtml,
        reply_to: [ownerName + ' <' + ownerEmail + '>']
      })
    });
  } catch (e) {
    console.error('[booking/request confirm]', e.message);
  }

  res.json({ ok: true, emailed: true });
});

// POST /api/owner/contact - public "more information" inquiry from the main
// site contact form (no auth). Stores the lead AND emails the owner. Mirrors
// /api/owner/booking/request. This is the low-commitment front door; the
// booking flow (booking.html) is the "let's establish business" path.
app.post('/api/owner/contact', async (req, res) => {
  const { name, email, phone, service, message } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'invalid email' });
  }

  // Store the lead (append-only) so nothing is lost even if email fails.
  const leadRecord = {
    id: 'lead-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name, email, phone: phone || '', service: service || '', message: message || '',
    source: 'Website Contact Form',
    receivedAt: new Date().toISOString(),
    status: 'new'
  };
  try {
    const key = 'website-leads';
    const existing = _pbGet(key) || { leads: [] };
    if (!Array.isArray(existing.leads)) existing.leads = [];
    existing.leads.unshift(leadRecord); // newest first
    existing.leads = existing.leads.slice(0, 500); // cap log size
    _pbUpsert(key, existing);
  } catch (e) {
    console.error('[contact store]', e.message);
    // Continue and email even if store failed
  }

  // Instant push alert to the owner's devices.
  _sendPushAll({ title: '🔔 New website inquiry', body: name + (service ? ' — ' + service : ''), url: 'https://thehelpctr.com/help-center-system.html' }).catch(() => {});

  // Email the owner
  const ownerEmail = process.env.RESEND_FROM_EMAIL || 'joy@thehelpctr.com';
  const escH = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const html =
    '<div style="font-family:Helvetica,Arial,sans-serif;background:#F1F5F9;padding:24px">' +
      '<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(15,23,42,0.08)">' +
        '<div style="background:linear-gradient(135deg,#0F172A,#1e3a5f);padding:22px;color:#fff">' +
          '<div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.75">H.E.L.P. Center</div>' +
          '<div style="font-size:20px;font-weight:700;margin-top:4px">New website inquiry</div>' +
        '</div>' +
        '<div style="padding:24px;color:#1F2937;font-size:15px;line-height:1.7">' +
          '<table style="width:100%;border-collapse:collapse">' +
            '<tr><td style="padding:8px 0;font-weight:700;width:120px;color:#64748B;font-size:13px">Name</td><td style="padding:8px 0">' + escH(name) + '</td></tr>' +
            '<tr><td style="padding:8px 0;font-weight:700;color:#64748B;font-size:13px">Email</td><td style="padding:8px 0"><a href="mailto:' + escH(email) + '" style="color:#1E5BC0">' + escH(email) + '</a></td></tr>' +
            (phone ? '<tr><td style="padding:8px 0;font-weight:700;color:#64748B;font-size:13px">Phone</td><td style="padding:8px 0">' + escH(phone) + '</td></tr>' : '') +
            (service ? '<tr><td style="padding:8px 0;font-weight:700;color:#64748B;font-size:13px">Service</td><td style="padding:8px 0">' + escH(service) + '</td></tr>' : '') +
          '</table>' +
          (message ? '<div style="margin-top:18px;padding:14px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;font-size:13.5px;color:#475569"><strong style="color:#0F172A">Message from ' + escH(name) + ':</strong><br>' + escH(message).replace(/\n/g, '<br>') + '</div>' : '') +
          '<div style="margin-top:24px;font-size:13px;color:#64748B">Reply directly to this email to respond to ' + escH(name) + '.</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  if (!process.env.RESEND_API_KEY) {
    console.warn('[contact] No Resend key; lead stored but no email sent');
    return res.json({ ok: true, emailed: false });
  }
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'H.E.L.P. Center <' + ownerEmail + '>',
        to: [ownerEmail],
        subject: 'New website inquiry from ' + name + (service ? ' - ' + service : ''),
        html,
        reply_to: [name + ' <' + email + '>']
      })
    });
    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      const msg = (data && (data.message || data.error || data.name)) || ('Resend HTTP ' + r.status);
      console.error('[contact resend]', msg);
      return res.json({ ok: true, emailed: false, emailError: String(msg) });
    }
  } catch (e) {
    console.error('[contact send]', e.message);
    return res.json({ ok: true, emailed: false, emailError: e.message });
  }

  res.json({ ok: true, emailed: true });
});

// POST /api/owner/review - public review submission from review.html (no auth).
// Stores the review as pending AND emails the owner a JSON blob to paste into
// the Frontend Manager -> Reviews. Mirrors the portal review flow + /api/owner/contact.
app.post('/api/owner/review', async (req, res) => {
  const { name, businessName, websiteUrl, rating, text } = req.body || {};
  const rate = Math.max(1, Math.min(5, parseInt(rating, 10) || 0));
  if (!name || !text || !rate) {
    return res.status(400).json({ error: 'name, rating, and review text are required' });
  }

  const record = {
    id: 'rev-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name, businessName: businessName || '', rating: rate, text,
    websiteUrl: websiteUrl || '', graphicUrl: '',
    approved: false, submittedAt: new Date().toISOString(), source: 'website'
  };
  try {
    const key = 'website-reviews';
    const existing = _pbGet(key) || { reviews: [] };
    if (!Array.isArray(existing.reviews)) existing.reviews = [];
    existing.reviews.unshift(record);
    existing.reviews = existing.reviews.slice(0, 500);
    _pbUpsert(key, existing);
  } catch (e) { console.error('[review store]', e.message); }

  // Instant push alert to the owner's devices.
  _sendPushAll({ title: '⭐ New review', body: name + ' (' + rate + '★)', url: 'https://thehelpctr.com/help-center-system.html' }).catch(() => {});

  const ownerEmail = process.env.RESEND_FROM_EMAIL || 'joy@thehelpctr.com';
  const escH = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const stars = '★'.repeat(rate) + '☆'.repeat(5 - rate);
  const reviewJson = JSON.stringify(record);

  const html =
    '<div style="font-family:Helvetica,Arial,sans-serif;background:#F1F5F9;padding:20px">' +
      '<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(15,23,42,0.08)">' +
        '<div style="background:linear-gradient(135deg,#0F172A,#16A34A);padding:22px;color:#fff">' +
          '<div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.8">New Website Review</div>' +
          '<div style="font-size:22px;font-weight:700;margin-top:6px;color:#FFC107;letter-spacing:4px">' + stars + '</div>' +
          '<div style="font-size:18px;font-weight:700;margin-top:4px">' + escH(name) + (businessName ? ' <span style="font-weight:400;opacity:0.85">— ' + escH(businessName) + '</span>' : '') + '</div>' +
        '</div>' +
        '<div style="padding:24px;color:#1F2937;font-size:15px;line-height:1.7">' +
          '<div style="font-style:italic;background:#F8FAFC;border-left:3px solid #16A34A;padding:12px 16px;border-radius:0 8px 8px 0;white-space:pre-wrap">' + escH(text) + '</div>' +
          (websiteUrl ? '<div style="margin-top:16px;font-size:14px"><strong>Their website:</strong> <a href="' + escH(websiteUrl) + '" style="color:#1E5BC0">' + escH(websiteUrl) + '</a></div>' : '') +
          '<div style="margin-top:24px;padding:14px;background:#FFF7ED;border:1px solid #FED7AA;border-radius:8px;font-size:12px;color:#475569">' +
            '<strong style="color:#9A3412">To publish this review:</strong> open the Frontend Manager &rarr; Reviews &rarr; <strong>+ Add review</strong> (rating ' + rate + ', name "' + escH(name) + '"), or paste this JSON into your reviews list:' +
            '<pre style="background:#0F172A;color:#E2E8F0;padding:10px;border-radius:6px;margin-top:8px;overflow-x:auto;font-size:11px;white-space:pre-wrap;word-break:break-all">' + escH(reviewJson) + '</pre>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  if (!process.env.RESEND_API_KEY) {
    console.warn('[review] No Resend key; review stored but no email sent');
    return res.json({ ok: true, emailed: false });
  }
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'H.E.L.P. Center <' + ownerEmail + '>',
        to: [ownerEmail],
        subject: '⭐ New review from ' + name + (businessName ? ' · ' + businessName : ''),
        html
      })
    });
    if (!r.ok) {
      const d = await r.json().catch(() => ({}));
      const msg = (d && (d.message || d.error)) || ('Resend HTTP ' + r.status);
      console.error('[review resend]', msg);
      return res.json({ ok: true, emailed: false, emailError: String(msg) });
    }
  } catch (e) {
    console.error('[review send]', e.message);
    return res.json({ ok: true, emailed: false, emailError: e.message });
  }

  res.json({ ok: true, emailed: true });
});

// ─── WEB PUSH NOTIFICATIONS ───────────────────────────────────────────────
// Browser push subscriptions stored in PB ('push-subscriptions'). Reusable:
// any feature can call _sendPushAll({title, body, url}) to alert all devices.
function _pushRec() { const r = _pbGet('push-subscriptions') || { subs: [] }; if (!Array.isArray(r.subs)) r.subs = []; return r; }
async function _sendPushAll(payload) {
  if (!process.env.VAPID_PUBLIC) return { sent: 0, removed: 0, error: 'no VAPID' };
  const rec = _pushRec();
  const body = JSON.stringify(payload || {});
  let sent = 0; const dead = [];
  for (const s of rec.subs) {
    try { await webpush.sendNotification(s.sub, body); sent++; }
    catch (e) {
      if (e && (e.statusCode === 404 || e.statusCode === 410)) dead.push(s.id);
      else console.error('[push] send error:', (e && e.message) || e);
    }
  }
  if (dead.length) { rec.subs = rec.subs.filter(x => !dead.includes(x.id)); try { _pbUpsert('push-subscriptions', rec); } catch (e) {} }
  return { sent, removed: dead.length };
}

// Public VAPID key — client needs it to subscribe (public, safe to expose).
app.get('/api/owner/push/key', (req, res) => res.json({ key: process.env.VAPID_PUBLIC || '' }));

// Save a device's push subscription (owner-gated; dedup by endpoint).
app.post('/api/owner/push/subscribe', (req, res) => {
  if (!_verifyOwner(req)) return res.status(401).json({ error: 'Invalid owner password' });
  const sub = req.body && req.body.subscription;
  if (!sub || !sub.endpoint) return res.status(400).json({ error: 'subscription required' });
  try {
    const rec = _pushRec();
    rec.subs = rec.subs.filter(x => x.sub && x.sub.endpoint !== sub.endpoint);
    rec.subs.push({ id: 'ps-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), sub, label: (req.body.label || ''), addedAt: new Date().toISOString() });
    rec.subs = rec.subs.slice(-50);
    _pbUpsert('push-subscriptions', rec);
    res.json({ ok: true, count: rec.subs.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Send a test push to all subscribed devices (owner-gated).
app.post('/api/owner/push/test', async (req, res) => {
  if (!_verifyOwner(req)) return res.status(401).json({ error: 'Invalid owner password' });
  const r = await _sendPushAll({ title: '🔔 H.E.L.P. Center', body: 'Push notifications are working!', url: 'https://thehelpctr.com/help-center-system.html' });
  res.json({ ok: true, ...r });
});

// POST /api/portal/message - a client message from portal.html. Stores it,
// PUSHES the owner instantly, and emails the owner (reply-to the client).
app.post('/api/portal/message', async (req, res) => {
  const { name, email, message, attachmentUrl, clientId, token } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ error: 'name, email, and message are required' });
  try {
    const key = 'portal-msgs:' + (token || clientId || 'unknown');
    const rec = _pbGet(key) || { msgs: [] };
    if (!Array.isArray(rec.msgs)) rec.msgs = [];
    rec.msgs.push({ from: 'client', name, email, message, attachmentUrl: attachmentUrl || '', at: new Date().toISOString() });
    rec.msgs = rec.msgs.slice(-200);
    _pbUpsert(key, rec);
  } catch (e) { console.error('[portal/message store]', e.message); }

  _sendPushAll({ title: '💬 New portal message', body: name + ': ' + String(message).slice(0, 90), url: 'https://thehelpctr.com/help-center-system.html' }).catch(() => {});

  const ownerEmail = process.env.RESEND_FROM_EMAIL || 'joy@thehelpctr.com';
  const escH = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const html =
    '<div style="font-family:Helvetica,Arial,sans-serif;background:#F1F5F9;padding:20px">' +
      '<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(15,23,42,0.08)">' +
        '<div style="background:linear-gradient(135deg,#0F172A,#312E81);padding:22px;color:#fff">' +
          '<div style="font-size:11px;letter-spacing:1px;text-transform:uppercase;opacity:0.8">Client Portal — Incoming Message</div>' +
          '<div style="font-size:20px;font-weight:700;margin-top:4px">' + escH(name) + '</div>' +
          '<div style="font-size:13px;opacity:0.85;margin-top:2px">' + escH(email) + '</div>' +
        '</div>' +
        '<div style="padding:24px;color:#1F2937;font-size:15px;line-height:1.7">' +
          '<div style="white-space:pre-wrap">' + escH(message) + '</div>' +
          (attachmentUrl ? '<div style="margin-top:18px;font-size:13px">📎 <a href="' + escH(attachmentUrl) + '" style="color:#1E5BC0">' + escH(attachmentUrl) + '</a></div>' : '') +
          '<div style="margin-top:24px;font-size:12px;color:#64748B">Reply to this email to respond directly to ' + escH(name) + '.</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  if (process.env.RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: 'H.E.L.P. Center <' + ownerEmail + '>', to: [ownerEmail], subject: '💬 Portal message from ' + name, html, reply_to: [name + ' <' + email + '>'] })
      });
    } catch (e) { console.error('[portal/message email]', e.message); }
  }
  res.json({ ok: true });
});

// POST /api/owner/invoice/send - persist invoice in portal-extras + email client with Stripe pay link
app.post('/api/owner/invoice/send', async (req, res) => {
  if (!_verifyOwner(req)) return res.status(401).json({ error: 'Invalid owner password' });
  const { portalToken, clientName, clientEmail, extraRecipients, businessName, invoice } = req.body || {};
  if (!portalToken || !clientEmail || !invoice || !Array.isArray(invoice.items) || !invoice.items.length) {
    return res.status(400).json({ error: 'portalToken, clientEmail, and invoice.items are required' });
  }

  try {
    const extrasKey = 'portal-extras:' + portalToken;
    const existing = _pbGet(extrasKey) || { deliverables: [] };
    existing.invoice = invoice;
    existing.updated = new Date().toISOString();
    _pbUpsert(extrasKey, existing);
  } catch (e) {
    return res.status(500).json({ error: 'PB write failed: ' + e.message });
  }

  let payUrl = '';
  const dueCents = Math.round(((invoice.totals && invoice.totals.dueNow) || 0) * 100);
  if (process.env.STRIPE_SECRET_KEY && dueCents >= 50) {
    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const lineItems = invoice.items
        .filter(it => Number(it.amount) > 0)
        .map(it => ({
          price_data: {
            currency: 'usd',
            product_data: { name: String(it.description || 'Item').slice(0, 250) },
            unit_amount: Math.round((Number(it.amount) || 0) * 100)
          },
          quantity: Number(it.qty) || 1
        }));
      if (lineItems.length) {
        const session = await stripe.checkout.sessions.create({
          mode: 'payment',
          payment_method_types: ['card'],
          line_items: lineItems,
          customer_email: clientEmail,
          success_url: 'https://thehelpctr.com/portal.html?t=' + portalToken + '&paid=' + encodeURIComponent(invoice.number || ''),
          cancel_url:  'https://thehelpctr.com/portal.html?t=' + portalToken,
          metadata: { portalToken: portalToken, invoiceNumber: invoice.number || '', clientName: clientName || '' }
        });
        payUrl = session.url;
      }
    } catch (e) {
      console.error('[invoice/send stripe]', e.message);
    }
  }

  const biz = businessName || 'H.E.L.P. Center';
  const ownerEmail = process.env.RESEND_FROM_EMAIL || 'joy@thehelpctr.com';
  const ownerName = process.env.RESEND_FROM_NAME || 'Joy Watford';
  const dueLabel = invoice.dueDate ? ('Due by ' + new Date(invoice.dueDate).toLocaleDateString()) : '';
  const fmt = n => '$' + Number(n).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2});
  const escH = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const itemsRows = invoice.items.map(it => {
    const sub = (Number(it.amount) || 0) * (Number(it.qty) || 1);
    const typeTag = it.type === 'monthly'
      ? '<span style="background:#DBEAFE;color:#1E40AF;padding:2px 7px;border-radius:99px;font-size:10px;font-weight:700;margin-left:6px">MONTHLY</span>'
      : (it.type === "other" || it.type === "incidental")
        ? '<span style="background:#FED7AA;color:#9A3412;padding:2px 7px;border-radius:99px;font-size:10px;font-weight:700;margin-left:6px">OTHER</span>'
        : '';
    const amtDisplay = it.type === 'monthly' ? (fmt(sub) + '/mo') : fmt(sub);
    const qtyDisplay = it.qty > 1 ? (' <span style="color:#94A3B8">x ' + it.qty + '</span>') : '';
    return '<tr><td style="padding:10px 8px;border-bottom:1px solid #E2E8F0;font-size:14px;color:#0F172A">' + escH(it.description) + typeTag + qtyDisplay + '</td><td style="padding:10px 8px;border-bottom:1px solid #E2E8F0;font-size:14px;color:#0F172A;text-align:right;font-weight:600">' + amtDisplay + '</td></tr>';
  }).join('');

  const t = invoice.totals || { flat:0, monthly:0, incidental:0, dueNow:0 };
  const monthlyRow = t.monthly > 0
    ? '<tr><td style="padding:6px 8px;color:#1E40AF;font-size:13px">Monthly recurring</td><td style="padding:6px 8px;text-align:right;color:#1E40AF;font-weight:700">' + fmt(t.monthly) + '/mo</td></tr>'
    : '';

  const html =
    '<div style="font-family:Helvetica,Arial,sans-serif;background:#F1F5F9;padding:24px">' +
      '<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(15,23,42,0.08)">' +
        '<div style="background:linear-gradient(135deg,#0F172A,#1e3a5f);padding:26px;color:#fff">' +
          '<div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.75">' + escH(biz) + '</div>' +
          '<div style="font-size:22px;font-weight:700;margin-top:4px">Invoice ' + escH(invoice.number || '') + '</div>' +
          (dueLabel ? '<div style="font-size:13px;opacity:0.85;margin-top:6px">' + escH(dueLabel) + '</div>' : '') +
        '</div>' +
        '<div style="padding:24px;color:#1F2937;font-size:15px;line-height:1.6">' +
          '<div>Hi ' + escH(clientName || '') + ',</div>' +
          '<div style="margin:12px 0">Here is your invoice from ' + escH(biz) + '. ' + (payUrl ? 'Pay now with the secure link below.' : '') + '</div>' +
          '<table style="width:100%;border-collapse:collapse;margin:16px 0">' +
            '<thead><tr><th style="text-align:left;padding:8px;font-size:11px;text-transform:uppercase;color:#64748B;border-bottom:2px solid #CBD5E1">Item</th><th style="text-align:right;padding:8px;font-size:11px;text-transform:uppercase;color:#64748B;border-bottom:2px solid #CBD5E1">Amount</th></tr></thead>' +
            '<tbody>' + itemsRows + '</tbody>' +
            '<tfoot>' + monthlyRow + '<tr><td style="padding:14px 8px;font-size:15px;font-weight:700;color:#0F172A;border-top:2px solid #0F172A">Due now</td><td style="padding:14px 8px;text-align:right;font-size:18px;font-weight:700;color:#16A34A;border-top:2px solid #0F172A">' + fmt(t.dueNow) + '</td></tr></tfoot>' +
          '</table>' +
          (payUrl ? (
  '<div style="margin:24px 0;padding:20px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px">' +
    '<div style="display:flex;gap:20px;align-items:center;flex-wrap:wrap">' +
      '<div style="flex-shrink:0;text-align:center">' +
        '<img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=10&data=' + encodeURIComponent(payUrl) + '" alt="Scan to pay" width="160" height="160" style="display:block;border:1px solid #E2E8F0;border-radius:8px;background:#fff">' +
        '<div style="font-size:11px;color:#64748B;margin-top:6px;letter-spacing:0.5px;text-transform:uppercase;font-weight:600">Scan to pay</div>' +
      '</div>' +
      '<div style="flex:1;min-width:180px">' +
        '<div style="font-size:13px;color:#0F172A;font-weight:600;margin-bottom:8px">Two ways to pay:</div>' +
        '<div style="font-size:13px;color:#475569;line-height:1.6">' +
          '<div style="margin-bottom:8px"><strong>1.</strong> Tap the button below from your phone or computer</div>' +
          '<div><strong>2.</strong> Or scan the QR code with your phone\'s camera to pay on mobile</div>' +
        '</div>' +
        '<div style="text-align:left;margin-top:14px">' +
          '<a href="' + payUrl + '" style="display:inline-block;padding:12px 26px;background:#16A34A;color:#fff;text-decoration:none;border-radius:10px;font-weight:700;font-size:15px">Pay ' + fmt(t.dueNow) + ' Now &rarr;</a>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>'
) : '') +
          (invoice.notes ? '<div style="margin-top:16px;padding:12px 14px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;font-size:13.5px;color:#475569"><strong>Notes:</strong><br>' + escH(invoice.notes).replace(/\n/g, '<br>') + '</div>' : '') +
          '<div style="margin-top:20px;font-size:13px;color:#64748B">View this invoice and reply at any time: <a href="https://thehelpctr.com/portal.html?t=' + portalToken + '" style="color:#1E5BC0">your portal</a></div>' +
          '<div style="margin-top:24px;padding-top:14px;border-top:1px solid #E2E8F0;font-size:13px;color:#64748B">Reply directly to this email if you have questions. - ' + escH(ownerName) + '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: ownerName + ' <' + ownerEmail + '>',
        to: [clientEmail].concat(Array.isArray(extraRecipients) ? extraRecipients.filter(Boolean) : []),
        subject: 'Invoice ' + (invoice.number || '') + ' from ' + biz + ' - ' + fmt(t.dueNow) + ' due',
        html
      })
    });
    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      const msg = (data && (data.message || data.error || data.name)) || ('Resend HTTP ' + r.status);
      return res.status(r.status).json({ error: String(msg), payUrl });
    }
  } catch (e) {
    return res.status(500).json({ error: 'Email send failed: ' + e.message, payUrl });
  }

  res.json({ ok: true, payUrl });
});

// POST /api/owner/invoice/delete - remove the invoice from portal-extras:{token}
// Body: { password, portalToken }
app.post('/api/owner/invoice/delete', (req, res) => {
  if (!_verifyOwner(req)) return res.status(401).json({ error: 'Invalid owner password' });
  const { portalToken } = req.body || {};
  if (!portalToken) return res.status(400).json({ error: 'portalToken is required' });
  const extrasKey = 'portal-extras:' + portalToken;
  const existing = _pbGet(extrasKey);
  if (!existing) return res.json({ ok: true, hadInvoice: false });
  const hadInvoice = !!existing.invoice;
  delete existing.invoice;
  existing.updated = new Date().toISOString();
  try {
    _pbUpsert(extrasKey, existing);
  } catch (e) {
    return res.status(500).json({ error: 'PB write failed: ' + e.message });
  }
  res.json({ ok: true, hadInvoice });
});

// POST /api/owner/deliverable/delete — remove a quick-upload deliverable
// Body: { password, portalToken, deliverableId }
app.post('/api/owner/deliverable/delete', (req, res) => {
  if (!_verifyOwner(req)) return res.status(401).json({ error: 'Invalid owner password' });
  const { portalToken, deliverableId } = req.body || {};
  if (!portalToken || !deliverableId) {
    return res.status(400).json({ error: 'portalToken and deliverableId are required' });
  }
  const extrasKey = 'portal-extras:' + portalToken;
  const existing = _pbGet(extrasKey);
  if (!existing || !Array.isArray(existing.deliverables)) {
    return res.status(404).json({ error: 'No extras found for that portal token' });
  }
  const before = existing.deliverables.length;
  existing.deliverables = existing.deliverables.filter(d => d.id !== deliverableId);
  if (existing.deliverables.length === before) {
    return res.status(404).json({ error: 'Deliverable id not found in extras' });
  }
  existing.updated = new Date().toISOString();
  try {
    _pbUpsert(extrasKey, existing);
  } catch (e) {
    return res.status(500).json({ error: 'PB write failed: ' + e.message });
  }
  res.json({ ok: true, remaining: existing.deliverables.length });
});

// POST /api/owner/deliverable — add a deliverable to a client's portal record
// Body: { password, portalToken, deliverable:{name,description,url}, notify:bool }
app.post('/api/owner/deliverable', async (req, res) => {
  if (!_verifyOwner(req)) return res.status(401).json({ error: 'Invalid owner password' });
  const { portalToken, deliverable, notify } = req.body || {};
  if (!portalToken || !deliverable || !deliverable.name) {
    return res.status(400).json({ error: 'portalToken and deliverable.name are required' });
  }

  // Read the snapshot only to get branding/client info for the notification email.
  // The deliverable itself goes to portal-extras:{token} (separate key) so the
  // work portal's auto-sync of portal:{token} can't overwrite it.
  const snap = _pbGet('portal:' + portalToken);
  if (!snap || !snap.client) {
    return res.status(404).json({ error: 'Portal snapshot not found for that token' });
  }

  // Build the new deliverable record
  const id = 'd-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const newDeliv = {
    id,
    name: String(deliverable.name).slice(0, 200),
    description: String(deliverable.description || '').slice(0, 2000),
    url: String(deliverable.url || '').slice(0, 1000),
    dateAdded: new Date().toISOString().slice(0, 10),
    addedVia: 'quick-upload',
    addedAt: new Date().toISOString()
  };

  // Append to portal-extras:{token}. portal.html merges these with the snapshot's
  // deliverables at render time.
  try {
    const extrasKey = 'portal-extras:' + portalToken;
    const existing = _pbGet(extrasKey) || { deliverables: [] };
    if (!Array.isArray(existing.deliverables)) existing.deliverables = [];
    existing.deliverables.push(newDeliv);
    existing.updated = new Date().toISOString();
    _pbUpsert(extrasKey, existing);
  } catch (e) {
    return res.status(500).json({ error: 'PB write failed: ' + e.message });
  }

  // Optional notification email to the client
  let emailed = false;
  if (notify && snap.client.email && process.env.RESEND_API_KEY) {
    try {
      const portalUrl = 'https://thehelpctr.com/portal.html?t=' + portalToken;
      const html =
        '<div style="font-family:Helvetica,Arial,sans-serif;background:#F1F5F9;padding:20px">' +
          '<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(15,23,42,0.08)">' +
            '<div style="background:linear-gradient(135deg,#0F172A,#312E81);padding:22px;color:#fff">' +
              '<div style="font-size:11px;letter-spacing:1px;text-transform:uppercase;opacity:0.8">' + (snap.branding && snap.branding.businessName || 'H.E.L.P. Center') + '</div>' +
              '<div style="font-size:20px;font-weight:700;margin-top:4px">A new deliverable is ready</div>' +
            '</div>' +
            '<div style="padding:24px;color:#1F2937;font-size:15px;line-height:1.7">' +
              '<div>Hi ' + (snap.client.name || '') + ',</div>' +
              '<div style="margin:14px 0"><strong>' + newDeliv.name + '</strong></div>' +
              (newDeliv.description ? '<div style="margin-bottom:14px;color:#475569">' + newDeliv.description + '</div>' : '') +
              '<div style="text-align:center;margin:22px 0">' +
                '<a href="' + portalUrl + '" style="display:inline-block;padding:12px 24px;background:#16A34A;color:#fff;text-decoration:none;border-radius:8px;font-weight:700">Open Your Portal &rarr;</a>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';

      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: ((snap.branding && snap.branding.businessName) || 'H.E.L.P. Center') + ' <noreply@thehelpctr.com>',
          to: [snap.client.email],
          subject: 'New deliverable ready in your portal',
          html
        })
      });
      emailed = r.ok;
    } catch (e) {
      console.error('[owner/deliverable email]', e.message);
    }
  }

  res.json({ ok: true, deliverable: newDeliv, emailed });
});


app.listen(PORT, () => {
  console.log(`H.E.L.P. Center backend running on port ${PORT}`);
  console.log(`Groq: ${process.env.GROQ_API_KEY ? '✓ configured' : '✗ missing'}`);
  console.log(`Resend: ${process.env.RESEND_API_KEY ? '✓ configured' : '✗ missing'}`);
  console.log(`Stripe: ${process.env.STRIPE_SECRET_KEY ? '✓ configured' : '✗ missing'}`);
  console.log(`DocuSeal: ${process.env.DOCUSEAL_URL ? '✓ configured' : '✗ missing'}`);
});
