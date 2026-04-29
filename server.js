// H.E.L.P. Center SaaS Backend Server
// Handles AI (Groq), Resend email, DocuSeal, and Stripe
// Run: node server.js  |  Keep alive: pm2 start server.js --name helpcenter

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const fetch   = (...a) => import('node-fetch').then(({default:f}) => f(...a));

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
  const { to, subject, html, fromName, fromEmail } = req.body;
  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'Resend API key not configured on server' });
  }
  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, html' });
  }

  const senderName  = fromName  || process.env.RESEND_FROM_NAME  || 'H.E.L.P. Center';
  const senderEmail = fromEmail || process.env.RESEND_FROM_EMAIL || 'noreply@helpcenter.com';

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `${senderName} <${senderEmail}>`,
        to: Array.isArray(to) ? to : [to],
        subject,
        html
      })
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data });
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
      const session  = event.data.object;
      const email    = session.customer_email || session.customer_details?.email;
      const plan     = session.metadata?.plan || 'solo';
      const name     = session.customer_details?.name || '';
      console.log(`New subscriber: ${email} — Plan: ${plan}`);
      // TODO: Create PocketBase user account here
      // For now, log and respond OK
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

app.listen(PORT, () => {
  console.log(`H.E.L.P. Center backend running on port ${PORT}`);
  console.log(`Groq: ${process.env.GROQ_API_KEY ? '✓ configured' : '✗ missing'}`);
  console.log(`Resend: ${process.env.RESEND_API_KEY ? '✓ configured' : '✗ missing'}`);
  console.log(`Stripe: ${process.env.STRIPE_SECRET_KEY ? '✓ configured' : '✗ missing'}`);
  console.log(`DocuSeal: ${process.env.DOCUSEAL_URL ? '✓ configured' : '✗ missing'}`);
});
