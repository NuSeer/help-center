# H.E.L.P. Center — Self-Serve SaaS Plan (Signup → Pay → Auto-Provision)

*Planning document. No code yet — this is the map. Written 2026-06-05.*

---

## 1. The goal in one sentence
Turn "I manually create each tenant and email them a login" into **"a person finds the site, picks a plan, pays, and their workspace sets itself up — no action from me."**

That single change is what makes this a real, sell-in-your-sleep SaaS instead of a hand-onboarded tool.

---

## 2. What "done" looks like (the customer's journey)
1. Visitor lands on a **pricing/signup page**.
2. They pick a plan (Spark / Growth / Elite) and click **Start**.
3. They enter email + business name and go to **Stripe Checkout** (secure, hosted by Stripe).
4. They pay (or start a free trial).
5. **Automatically**, behind the scenes:
   - their tenant workspace is created,
   - their login is set up,
   - the AI tools their plan includes are turned on.
6. They get a **welcome email** with their link and a "set your password" button.
7. They log in to a working, empty-but-theirs workspace.
8. Later they can **manage/cancel** their subscription themselves.
9. If they cancel or a payment fails, their workspace **suspends automatically**.

You touch none of it unless something breaks.

---

## 3. Where we are today (honest starting point)
**Already built (reusable):**
- Multi-tenant workspace with real data isolation (PocketBase rules).
- A provisioning routine that creates a tenant's login + seeds their settings (currently triggered by *you* in the SaaS Clients form).
- Stripe is already wired for one-off invoice payments (proxy on the VPS).
- Resend email + a welcome/credentials email template.
- Plans exist as **labels** (Spark/Growth/Elite) but nothing enforces them.

**Missing (this plan fills it):**
- A public signup page tied to plan selection.
- **Subscriptions** in Stripe (recurring), not just one-off charges.
- A **webhook** so Stripe tells our server "they paid" → server provisions automatically.
- **Plan enforcement** (limits/features per tier).
- **Self-service billing** (change/cancel) + lifecycle (suspend on cancel/failed payment).

---

## 4. The pieces we need to build
Think of it as seven connected parts (A–E are the core "cash register"; F–G are run-the-business + growth, folded in from the SaaS-boilerplate review):

| # | Part | What it does | Where it lives |
|---|------|--------------|----------------|
| A | **Signup page** | Pick plan, enter email/business, go to checkout | New public page (extend landing/welcome.html) |
| B | **Stripe subscriptions** | Recurring billing for each plan | Stripe dashboard (products/prices) + checkout call |
| C | **Webhook + auto-provision** | "Payment succeeded" → create tenant automatically | VPS backend (server.js) |
| D | **Welcome + first login** | Email them their link + set-password flow | Resend + a small set-password page |
| E | **Plan enforcement + billing portal** | Gate features by tier; let them manage/cancel | Dashboard code + Stripe Customer Portal |
| F | **Owner KPI dashboard** | See MRR, active tenants, trials, churn, new signups at a glance | New owner-only page in the dashboard |
| G | **Affiliate / referral program** | Others refer customers for a commission — growth engine | Referral links + tracking + payout report |

---

## 5. Build phases (sequenced so each step is usable)

### Phase 0 — Decisions only (you, ~30 min, no building)
Before code, lock these down (see Section 8). Pricing, what each plan includes, free trial or not, signup domain.

### Phase 1 — Signup page (frontend)
- A clean pricing page with 3 plan cards and a "Start" button each.
- A short form: business name + email.
- Clicking Start kicks off Stripe Checkout for that plan.
- **Deliverable:** a real signup page that hands off to payment.

### Phase 2 — Stripe subscriptions
- In Stripe: create one **Product per plan** with a **monthly + annual price**.
- Switch the checkout call from one-off charge → **subscription mode**.
- Store the Stripe customer/subscription IDs against the future tenant.
- **Deliverable:** people can actually subscribe and Stripe bills them monthly.

### Phase 3 — Webhook → auto-provision (the heart of it)
- Add a Stripe **webhook endpoint** on the VPS backend.
- On `checkout.session.completed` / `subscription.created`:
  - read the plan + email + business name,
  - run the **existing provisioning logic** (create PB user, seed `<slug>:settings`, set `<slug>:tenantOfferedProjects` from the plan's tool list),
  - generate a slug automatically (from business name, de-duplicated).
- **Deliverable:** payment → workspace exists, fully automatic. This is the milestone that makes it "a proper SaaS."

### Phase 4 — Welcome email + first login
- After provisioning, send the **welcome email** (link + "Set your password").
- A tiny **set-password page** so they choose their own password on first visit (instead of you emailing one).
- **Deliverable:** the new customer gets in by themselves.

### Phase 5 — Plan enforcement
- Map each plan to **limits + features** (e.g., Spark = 10 clients + 1 AI tool; Growth = unlimited + all tools; Elite = + white-label).
- Enforce in the app: when a tenant hits a limit, show "Upgrade to add more."
- Tie the **AI tools list** (already per-tenant) to the plan automatically.
- **Deliverable:** plans actually mean something; upsell path exists.

### Phase 6 — Self-service billing + lifecycle
- Add a **"Manage Billing"** button → Stripe **Customer Portal** (they change card, upgrade, cancel — Stripe hosts it).
- Webhooks for `subscription.updated` / `deleted` / `invoice.payment_failed`:
  - downgrade/upgrade plan automatically,
  - **suspend** the tenant on cancel or repeated failed payment (set `tenantActive=false` → their URL stops working),
  - reactivate on recovery.
- **Deliverable:** the money side runs itself, including churn.

### Phase 7 — Owner KPI dashboard (run it by the numbers)
*Folded in from the boilerplate's "Super-Admin KPIs" idea.*
- A new **owner-only page** (think of it as the upgrade to your SaaS Clients page) showing, in real time:
  - **MRR** (monthly recurring revenue) + projected annual,
  - **Active tenants**, **trials in progress**, **past-due**, **canceled**,
  - **New signups** this week/month, and simple **churn** (cancels ÷ active).
- Numbers come from the data Phases 2–6 already store (`plan`, `planStatus`, Stripe IDs) — this phase mostly **reads and visualizes** what's already there.
- **Deliverable:** one screen that tells you if the business is growing or leaking — so you make decisions on facts, not vibes.

### Phase 8 — Affiliate / referral program (growth engine)
*Folded in from the boilerplate's "Affiliate system with commission payments."*
- Give each tenant (or outside partner) a **unique referral link** (e.g. `thehelpctr.com/start?ref=joycoach`).
- On signup, **record who referred them**; on successful paid conversion, **credit a commission** (e.g. 20% recurring or a flat first-month bounty).
- An **affiliate view**: their link, clicks, signups, earnings; and an **owner payout report** so you know who to pay.
- Start simple (manual payouts from the report); automate payouts later if it takes off.
- **Deliverable:** other people sell your SaaS for you — the cheapest growth there is.

### Phase 9 — Hardening (do once it's earning)
- Move tenants to a **separate SaaS PocketBase** (blueprint step 5) so they're not on your personal instance.
- Move the **sensitive gating/IP server-side** so the AI-project logic isn't fully shipped in the browser.
- Tenant-own **Resend** sending (already on the remembered list).
- **Deliverable:** scales safely, IP protected.

---

## 6. Data we'll add (small)
On each tenant record / PB user, store:
- `stripeCustomerId`, `stripeSubscriptionId`
- `plan` (already exists), `planStatus` (active / trialing / past_due / canceled)
- `currentPeriodEnd` (when access lapses if unpaid)

A new **plan → features map** (one small config): clients limit, AI tools included, feature flags per tier.

For the **affiliate program** (Phase 8): store `referredBy` on each tenant + a small `affiliates` record (link code, clicks, signups, commission owed/paid).

---

## 7. Security / trust notes (so it's done right)
- Stripe handles all card data — we never see card numbers.
- The **webhook must verify Stripe's signature** (so nobody can fake "they paid").
- Slugs auto-generated + de-duplicated (no collisions, no reserved words like `admin`).
- Suspended tenants lose access immediately (login URL stops working).
- Provisioning runs **server-side** (the PB admin credentials never go in the browser).

---

## 8. Decisions I need from you before Phase 1
1. **Plans & prices** — confirm the 3 tiers and monthly/annual prices (you have Spark $19 / Growth $49 / Elite $97 on the strategy page — keep those?).
2. **What each plan includes** — client limit + which AI tools + which features per tier.
3. **Free trial?** — e.g., 7- or 14-day trial, card required or not.
4. **Signup domain** — where the signup page lives (e.g., `thehelpctr.com/start`).
5. **Tenant URL style** — keep `?tenant=slug` for now, or invest in subdomains later (`name.thehelpctr.com`).
6. **Who picks the slug** — auto from business name (recommended) or let them choose at signup.
7. **Affiliate commission** (for Phase 8) — what do you pay referrers? e.g. **20% recurring** for as long as the customer stays, or a **flat first-month bounty** (e.g. $25). Who can be an affiliate — any tenant, or hand-picked partners?

---

## 9. Rough sizing (focused build sessions, not calendar time)
- Phase 1 (signup page): small.
- Phase 2 (Stripe subscriptions): small–medium.
- Phase 3 (webhook + auto-provision): **medium — the core**.
- Phase 4 (welcome + set password): small.
- Phase 5 (plan enforcement): medium (depends how many limits).
- Phase 6 (billing portal + lifecycle): medium.
- Phase 7 (owner KPI dashboard): small–medium (mostly reads data Phases 2–6 already store).
- Phase 8 (affiliate program): medium.
- Phase 9 (hardening): larger, deferrable.

**Minimum to be "a real self-serve SaaS": Phases 1–4.** Phases 5–6 make it polished and churn-proof. **Phase 7 (KPIs)** is a small add once billing exists and pays for itself in clarity. **Phase 8 (affiliates)** is your cheapest growth lever. Phase 9 is for scale.

---

## 10. Recommended order
1. **Phase 0 decisions** (you, ~30 min).
2. Build **Phases 1 → 4 as one push** (signup → pay → auto-provision → welcome) — this is the milestone that flips "I onboard people" → "people onboard themselves."
3. **Phase 5 → 6** (plan limits + self-service billing/churn) so it runs itself.
4. **Phase 7 (KPI dashboard)** — quick win once billing data exists; now you run by the numbers.
5. **Phase 8 (affiliates)** — turn customers/partners into a sales force.
6. **Phase 9 (hardening)** — when revenue justifies it.

The three things the SaaS-boilerplate review flagged as your biggest upgrades — **(1) subscriptions + self-serve signup**, **(2) the KPI/MRR dashboard**, **(3) the affiliate program** — are now Phases 1–6, 7, and 8 respectively. One master roadmap, in order.
