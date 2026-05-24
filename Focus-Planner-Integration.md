# Focus Planner Integration — H.E.L.P. Center Calendar

**For:** The chat / dev building the focus planner + note-taking app
**From:** H.E.L.P. Center side
**Date:** 2026-05-14

This single file contains everything needed to integrate with the H.E.L.P. Center's calendar data. Read top to bottom — schema, auth, sample code, and TypeScript types are all here.

---

## Section 1 — What you're integrating with

The H.E.L.P. Center is a multi-tenant business management SaaS for coaches, faith leaders, women entrepreneurs, and side-hustlers. It has a calendar that holds bookings, programs, sessions, and any other scheduled items. Your focus planner needs to read/write that same calendar so events flow between both apps live.

**Architecture pattern:** shared PocketBase backend. All apps in this ecosystem (H.E.L.P. Center, focus planner, future apps) read and write the same `events` collection. Tenant isolation is enforced at the database level — every app, every query, automatically scoped to the authenticated tenant.

---

## Section 2 — Backend

- **PocketBase:** `https://api.thehelpctr.com/pb` (port 8090 proxied through the main API gateway)
- **Auth:** JWT bearer tokens with claims `{ sub, tenantId, tier, email, iat, exp }`
- **Multi-tenant:** every record scoped by `tenant_id` field

---

## Section 3 — `events` collection schema

| Field | Type | Notes |
|---|---|---|
| `id` | auto | primary key |
| `tenant_id` | relation → `tenants` | indexed; enforces data isolation |
| `type` | text | `booking`, `focus_block`, `task`, `personal`, `program`, `note_anchor` |
| `title` | text | display title on the calendar |
| `description` | text | optional details |
| `start` | datetime | indexed; ISO 8601 |
| `end` | datetime | indexed; ISO 8601 |
| `all_day` | bool | for tasks / reminders |
| `color` | text | hex like `#1E5BC0` or token |
| `source_app` | text | `helpcenter`, `focusplanner` — tracks which app created the event |
| `linked_id` | text | optional — links back to source record |
| `metadata` | JSON | app-specific extras (pomodoro count, energy level, project tag, etc.) |
| `created`, `updated` | auto | |

### PocketBase API rules (set in admin → events → API rules)

```
listRule:   @request.auth.tenantId = tenant_id
viewRule:   @request.auth.tenantId = tenant_id
createRule: @request.auth.tenantId != "" && @request.data.tenant_id = @request.auth.tenantId
updateRule: @request.auth.tenantId = tenant_id
deleteRule: @request.auth.tenantId = tenant_id
```

This locks every tenant to only their own events at the database level — no client-side check needed for isolation.

---

## Section 4 — Connecting from the focus planner (plain JavaScript)

```js
// Install: npm install pocketbase
import PocketBase from 'pocketbase';
export const pb = new PocketBase('https://api.thehelpctr.com/pb');

// Login (one time; persists in localStorage)
await pb.collection('tenants').authWithPassword(email, password);
```

### Read events

```js
// Today's events
const start = new Date(); start.setHours(0,0,0,0);
const end   = new Date(); end.setHours(23,59,59,999);
const events = await pb.collection('events').getList(1, 200, {
  filter: `start >= "${start.toISOString()}" && start <= "${end.toISOString()}"`,
  sort: 'start'
});

// Only focus blocks this week
const blocks = await pb.collection('events').getList(1, 200, {
  filter: `type = "focus_block"`,
  sort: 'start'
});
```

### Create an event

```js
await pb.collection('events').create({
  tenant_id: pb.authStore.model.id,
  type: 'focus_block',
  title: 'Deep work — landing page',
  start: '2026-05-14T09:00:00Z',
  end:   '2026-05-14T11:00:00Z',
  color: '#1E5BC0',
  source_app: 'focusplanner',
  metadata: { pomodoros: 4, project: 'landing' }
});
```

### Realtime subscription (live updates across apps)

```js
pb.collection('events').subscribe('*', (e) => {
  if (e.action === 'create') addToUI(e.record);
  if (e.action === 'update') updateInUI(e.record);
  if (e.action === 'delete') removeFromUI(e.record);
});
```

When H.E.L.P. Center confirms a booking, the focus planner sees it instantly. When the focus planner adds a focus block, it appears on the H.E.L.P. calendar the same way.

---

## Section 5 — Companion `notes` collection (for note-taking)

| Field | Type | Notes |
|---|---|---|
| `id` | auto | |
| `tenant_id` | relation → `tenants` | indexed |
| `title` | text | |
| `body` | text or rich-text JSON | |
| `event_id` | relation → `events` | optional — anchors a note to a calendar event |
| `tags` | JSON | array of strings |
| `pinned` | bool | |
| `created`, `updated` | auto | |

Same API rules pattern: `@request.auth.tenantId = tenant_id` on all rules.

---

## Section 6 — Current state caveat

H.E.L.P. Center's calendar today writes to browser `localStorage`, not to PocketBase. The shared-calendar pattern above requires H.E.L.P. Center's calendar code to be migrated to PocketBase first (about a day of focused work). Once migrated, both apps share data automatically.

**Until then:** the focus planner can build against the schema using manually-seeded test events in PocketBase admin.

---

## Section 7 — TypeScript type definitions (`events.d.ts`)

If the focus planner stack is TypeScript, save the block below as `src/types/events.d.ts`. If it's plain JavaScript, **skip this section** — the JS samples in Section 4 are enough.

```typescript
/**
 * H.E.L.P. Center Calendar — TypeScript Type Definitions
 *
 * Use these types in any TypeScript app integrating with the H.E.L.P. Center
 * calendar (e.g., focus planner, note-taking app, mobile companion).
 *
 * Backend: PocketBase at https://api.thehelpctr.com/pb
 * Collections: `events`, `notes`, `tenants`
 */

// ────────────────────────────────────────────────────────────────────────────
// Common PocketBase record fields
// ────────────────────────────────────────────────────────────────────────────

export interface PocketBaseRecord {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;  // ISO 8601
  updated: string;  // ISO 8601
}

// ────────────────────────────────────────────────────────────────────────────
// Event types
// ────────────────────────────────────────────────────────────────────────────

export type EventType =
  | 'booking'       // Coaching session, scheduled by client or coach
  | 'focus_block'   // Deep-work / focus session (focus planner)
  | 'task'          // To-do item with optional due time
  | 'personal'      // Personal commitment (gym, family, etc.)
  | 'program'       // H.E.L.P. program session (Pathway, group call)
  | 'note_anchor';  // Calendar marker linked to a standalone note

export type EventSource =
  | 'helpcenter'
  | 'focusplanner'
  | 'signflow'
  | 'mobile'
  | 'admin'
  | 'import';

export interface Event extends PocketBaseRecord {
  tenant_id: string;
  type: EventType;
  title: string;
  description?: string;
  start: string;   // ISO 8601
  end: string;     // ISO 8601
  all_day: boolean;
  color: string;
  source_app: EventSource;
  linked_id?: string;
  metadata?: EventMetadata;
}

export interface EventMetadata {
  // Focus planner
  pomodoros?: number;
  energy?: 1 | 2 | 3 | 4 | 5;
  project?: string;
  completed?: boolean;

  // H.E.L.P. Center bookings
  service_id?: string;
  client_id?: string;
  doc_status?: 'none' | 'sent' | 'signed';
  price_cents?: number;

  // Tasks
  priority?: 'low' | 'medium' | 'high';
  done?: boolean;

  [key: string]: unknown;
}

// ────────────────────────────────────────────────────────────────────────────
// Notes
// ────────────────────────────────────────────────────────────────────────────

export interface Note extends PocketBaseRecord {
  tenant_id: string;
  title: string;
  body: string;
  event_id?: string;
  tags?: string[];
  pinned: boolean;
}

// ────────────────────────────────────────────────────────────────────────────
// Tenant
// ────────────────────────────────────────────────────────────────────────────

export interface Tenant extends PocketBaseRecord {
  email: string;
  name: string;
  business_name: string;
  subscription_tier: 'solo' | 'pro';
  subscription_status: 'trialing' | 'active' | 'past_due' | 'cancelled';
  trial_ends_at: string | null;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  is_suspended: boolean;
}

// ────────────────────────────────────────────────────────────────────────────
// JWT claims (returned by jwt.verify on the backend)
// ────────────────────────────────────────────────────────────────────────────

export interface HelpCenterJWTClaims {
  sub: string;
  tenantId: string;
  tier: 'solo' | 'pro';
  email: string;
  iat: number;
  exp: number;
}

// ────────────────────────────────────────────────────────────────────────────
// PocketBase response shapes
// ────────────────────────────────────────────────────────────────────────────

export interface PaginatedList<T> {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}

export interface RealtimeEvent<T> {
  action: 'create' | 'update' | 'delete';
  record: T;
}

// ────────────────────────────────────────────────────────────────────────────
// Type guards
// ────────────────────────────────────────────────────────────────────────────

export function isEvent(x: unknown): x is Event {
  if (!x || typeof x !== 'object') return false;
  const r = x as Partial<Event>;
  return (
    typeof r.id === 'string' &&
    typeof r.tenant_id === 'string' &&
    typeof r.type === 'string' &&
    typeof r.title === 'string' &&
    typeof r.start === 'string' &&
    typeof r.end === 'string' &&
    typeof r.all_day === 'boolean'
  );
}

export function isEventType(x: unknown): x is EventType {
  return (
    x === 'booking' ||
    x === 'focus_block' ||
    x === 'task' ||
    x === 'personal' ||
    x === 'program' ||
    x === 'note_anchor'
  );
}

export function isNote(x: unknown): x is Note {
  if (!x || typeof x !== 'object') return false;
  const r = x as Partial<Note>;
  return (
    typeof r.id === 'string' &&
    typeof r.tenant_id === 'string' &&
    typeof r.title === 'string' &&
    typeof r.body === 'string' &&
    typeof r.pinned === 'boolean'
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Filter builders
// ────────────────────────────────────────────────────────────────────────────

export function eventsBetweenFilter(startISO: string, endISO: string): string {
  return `start >= "${startISO}" && start <= "${endISO}"`;
}

export function eventsByTypeFilter(types: EventType | EventType[]): string {
  const arr = Array.isArray(types) ? types : [types];
  return arr.map((t) => `type = "${t}"`).join(' || ');
}

export function andFilter(...clauses: string[]): string {
  return clauses.filter(Boolean).map((c) => `(${c})`).join(' && ');
}
```

### TypeScript usage example

```typescript
import PocketBase from 'pocketbase';
import type { Event, PaginatedList, RealtimeEvent } from './types/events';
import { eventsBetweenFilter, eventsByTypeFilter, andFilter } from './types/events';

const pb = new PocketBase('https://api.thehelpctr.com/pb');
await pb.collection('tenants').authWithPassword('user@example.com', 'pw');

// Today's focus blocks
const today = new Date();
const start = new Date(today.setHours(0,0,0,0)).toISOString();
const end   = new Date(today.setHours(23,59,59,999)).toISOString();

const result = await pb.collection('events').getList<Event>(1, 100, {
  filter: andFilter(
    eventsBetweenFilter(start, end),
    eventsByTypeFilter('focus_block')
  ),
  sort: 'start',
});
// result.items is typed as Event[]

pb.collection('events').subscribe<Event>('*', (e: RealtimeEvent<Event>) => {
  if (e.action === 'create') console.log('New:', e.record.title);
});
```

---

## Section 8 — Summary checklist for the focus planner dev

- [ ] Install PocketBase SDK: `npm install pocketbase`
- [ ] Configure the SDK with the URL above
- [ ] Implement login screen using `pb.collection('tenants').authWithPassword(...)`
- [ ] Build a calendar view that queries `events` collection filtered by date range
- [ ] Build a "focus block" creator that writes to `events` with `type: 'focus_block'` and `source_app: 'focusplanner'`
- [ ] (Optional) Use realtime subscription for live cross-app updates
- [ ] (Optional) Build notes UI that reads/writes the `notes` collection
- [ ] (If TypeScript) Save Section 7's type definitions to `src/types/events.d.ts`
- [ ] (If plain JS) Skip the type file — Section 4 samples are enough

---

*End of integration handoff document. Questions back to the H.E.L.P. Center team.*
