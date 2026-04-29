# H.E.L.P. Center Business System — Claude Project Context
*Upload this file to your Claude Project so every conversation starts with full context.*

---

## What This Is

**H.E.L.P. Center Business System** is a SaaS platform built and owned by Joy Watford. It is a single-file HTML application being evolved into a full multi-tenant SaaS product for coaches, consultants, and entrepreneurs.

- **Owner:** Joy Watford
- **Business:** H.E.L.P. Center (Helping Everyday Leaders Prosper)
- **Location:** Jacksonville, FL
- **Email:** j.l.foreman14@gmail.com
- **Website (author page):** jlforemanauthor.com

Joy is also a published author. The SaaS is a separate business from her author work.

---

## The Product

A business management dashboard that includes:
- Client CRM (manage clients, project status, deliverables, messages)
- Native booking system (public booking page, services, availability, intake forms, Stripe payments)
- AI Business Coach (powered by Groq/Llama 3.3 70B via backend server)
- Revenue tracker (invoices, payment status, reports)
- Business document generator (proposals, contracts, business plans, program plans)
- DocuSeal integration (document signing)
- Resend integration (branded transactional emails)
- Business Library (curated business ideas and resources)
- Guides system (educational content — Joy's proprietary guides are her own add-on)
- 6 Pathways (Income, Credit, Business, Confidence, Career, Youth)
- Calendar with event management
- Client portal (public-facing page per client with project status and messaging)
- State resources (LLC filing info for all 50 states)
- Reports & Documents page
- Settings (profile, password, AI, integrations)
- PocketBase sync (optional backend data sync)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Single-file HTML, vanilla JS, CSS variables |
| Data storage | localStorage (primary) + PocketBase (optional sync) |
| Backend API | Node.js + Express (server.js on VPS port 3001) |
| Database | PocketBase (port 8090 on VPS) |
| AI | Groq API → Llama 3.3 70B (via backend, keys never in browser) |
| Email | Resend API (via backend) |
| Documents | DocuSeal (self-hosted on VPS) |
| Payments | Stripe (Checkout + webhooks) |
| Hosting | VPS at 187.124.146.184 |
| Repo | https://github.com/NuSeer/help-center (main branch) |

---

## File Locations

| File | Location | Purpose |
|------|----------|---------|
| Main app | `/opt/pocketbase/pb_public/help-center-system.html` | The SaaS dashboard |
| Landing page | `/opt/pocketbase/pb_public/landing.html` | Marketing/signup page |
| Backend server | `/opt/helpcenter-backend/server.js` | Node.js API server |
| Environment vars | `/opt/helpcenter-backend/.env` | API keys (never committed) |
| PocketBase binary | `/opt/pocketbase/pocketbase` | Database + static file server |

**Local development files:**
- `C:/Users/jfwat/Downloads/help-center-system.html` — working copy of main app
- `C:/Users/jfwat/OneDrive/Desktop/help-center/` — git repo folder

**Deploy command (run on Windows PC):**
```
scp C:\Users\jfwat\Downloads\help-center-system.html root@187.124.146.184:/opt/pocketbase/pb_public/help-center-system.html
```

---

## VPS Details

- **IP:** 187.124.146.184
- **SSH:** `ssh root@187.124.146.184`
- **PocketBase URL:** http://187.124.146.184:8090
- **Backend API URL:** http://187.124.146.184:3001
- **Main app URL:** http://187.124.146.184:8090/help-center-system.html
- **Landing page URL:** http://187.124.146.184:8090/landing.html
- **PocketBase admin:** http://187.124.146.184:8090/_/

**VPS services:**
- PocketBase: runs as a service (static file server + database)
- Backend: managed by PM2 (`pm2 status`, `pm2 restart helpcenter`, `pm2 logs helpcenter`)

---

## Backend API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Health check |
| `/api/ai` | POST | AI proxy → Groq (streaming SSE) |
| `/api/email` | POST | Send email via Resend |
| `/api/docuseal` | POST | Create DocuSeal submission |
| `/api/stripe/checkout` | POST | Create Stripe Checkout session |
| `/api/stripe/webhook` | POST | Stripe webhook handler |

**AI request format:**
```json
{
  "messages": [{"role": "user", "content": "..."}],
  "stream": true
}
```

**Email request format:**
```json
{
  "to": "client@email.com",
  "subject": "Your booking confirmation",
  "html": "<p>HTML email body</p>",
  "fromName": "Joy Watford",
  "fromEmail": "joy@helpcenter.com"
}
```

---

## Key JavaScript Architecture (main app)

```javascript
// Backend URL — all API calls go through here
const API_BASE = 'http://187.124.146.184:3001';

// Settings stored in localStorage key 'settings'
const DEFAULT_SETTINGS = {
  name: 'Joy Watford',
  email: 'joy@helpcenter.com',
  businessName: 'H.E.L.P. Center',
  tagline: 'Helping Everyday Leaders Prosper',
  password: 'help2024',
  phone: '',
  address: 'Jacksonville, FL'
};

// Login: sessionStorage.getItem('loggedIn') === 'true'
// Default password: help2024
// Master reset code: HELPRESET

// Data functions
getData(key)        // reads from localStorage
setData(key, val)   // writes to localStorage + syncs to PocketBase
getGuides()         // auto-merges DEFAULT_GUIDES with localStorage
getBookings()       // booking records
getBookingServices() // service definitions
getBookingSettings() // booking config including public booking token
```

**All UI is dynamic from settings:**
- Sidebar name, email, initials
- Mobile header business name
- Browser tab title
- Dashboard greeting
- AI coach greeting
- AI system prompt
- Client portal header and messages
- All document templates (proposals, contracts, etc.)

---

## Pricing Plans

| Plan | Price | Trial |
|------|-------|-------|
| Solo | $29.99/mo | 7 days free |
| Pro | $59.99/mo | 7 days free |

**Solo includes:** Full dashboard, client CRM, booking system, AI coach, DocuSeal contracts, revenue tracking, business documents, branded workspace

**Pro includes:** Everything in Solo + Resend branded emails, DocuSeal auto-triggers on booking, priority support

---

## What's Built ✅

- [x] Full SaaS dashboard (single HTML file)
- [x] Client CRM with portal links
- [x] Native booking system with public booking page
- [x] AI Business Coach (via backend, Groq)
- [x] Revenue tracker
- [x] Business document generator
- [x] DocuSeal integration
- [x] Resend email integration
- [x] Business Library
- [x] Guides system
- [x] 6 Pathways
- [x] Calendar
- [x] State resources
- [x] Node.js backend server (running on VPS)
- [x] Marketing landing page
- [x] All UI dynamic from settings (multi-tenant ready)
- [x] Groq AI via backend (keys never in browser)

---

## What's In Progress / Next Steps

- [ ] Stripe paid signup flow (create products in Stripe, wire payment links)
- [ ] Post-payment account setup page (onboarding for new tenants)
- [ ] Multi-tenant auth via PocketBase (each tenant has own login)
- [ ] Admin panel for Joy to manage all tenants
- [ ] PWA (Progressive Web App for mobile install)
- [ ] App Store submission via Capacitor
- [ ] Custom domain support per tenant
- [ ] DocuSeal self-hosted setup on VPS

---

## Guides & Library (Joy's Proprietary Content)

**Guides** (Joy's own — add-on feature for other tenants):
- guide-001: LLC Formation Complete Guide
- guide-002: Business Credit Building Roadmap
- guide-003: Income Pathway Guide
- guide-004: The 3-Bank Method (historical banking strategy)
- guide-005: Community Finance: ROSCAs & Mutual Aid Traditions
- guide-006: Smart Credit Repair: The Complete Playbook

**Business Library** (Joy's projects — private to her instance):
- H.E.L.P. Center (launched)
- The Green Plate (restaurant concept)
- Bern Baby Burn (seasoning/sauce brand, named after grandmother Bernice)
- Mobile Herbal Apothecary
- Holding Company structure
- Multi-Sport Complex
- Community Food Bank
- RealTalk platform

---

## Multi-Tenant Architecture (in progress)

**Goal:** Each subscriber gets their own isolated workspace.
- Joy = Tenant #1 (prototype, her data unchanged)
- New tenants sign up via Stripe → get their own account
- Data isolated per tenant in PocketBase
- All UI branded from their settings
- They never see Joy's data or other tenants' data
- Joy has admin panel to manage all tenants

**Current state:** Single-user app with full dynamic branding ready. PocketBase is in place. Multi-tenant auth not yet built.

---

## Important Notes for Claude

1. **Never remove Joy's data** — her info stays as DEFAULT_SETTINGS. Other tenants override via their settings.
2. **The guides/library are Joy's proprietary content** — other tenants create their own guides.
3. **The AI system prompt is detailed and explicit** — instructed to respond like a seasoned consultant, not generic AI. Never simplify this.
4. **Always verify JS syntax** before deploying — run `node /tmp/check2.js` (syntax checker script on the dev machine).
5. **Single file constraint** — the entire app lives in one HTML file. Be surgical with edits.
6. **Deploy flow:** Edit locally → verify syntax → git commit/push → SCP to VPS.
7. **The backend server handles all external API calls** — AI, email, DocuSeal. The browser never calls Groq, Resend, or DocuSeal directly.
8. **Default login password:** `help2024` — master reset code: `HELPRESET`
9. **PocketBase sync is optional** — app works fully offline with localStorage only.
10. **GitHub repo:** https://github.com/NuSeer/help-center — always push after changes.
