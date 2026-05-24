/**
 * H.E.L.P. Center Calendar — TypeScript Type Definitions
 *
 * Use these types in any TypeScript app integrating with the H.E.L.P. Center
 * calendar (e.g., focus planner, note-taking app, mobile companion).
 *
 * Backend: PocketBase at https://api.thehelpctr.com/pb
 * Collections: `events`, `notes`, `tenants`
 *
 * Usage:
 *   import type { Event, EventType, Note, Tenant } from './events';
 *   import { isEvent } from './events';
 *
 * If your stack is NOT TypeScript, ignore this file — the integration brief
 * works fine in plain JavaScript. This file only exists to give TS users
 * autocomplete, compile-time safety, and refactoring support.
 */

// ────────────────────────────────────────────────────────────────────────────
// Common PocketBase record fields (every collection has these)
// ────────────────────────────────────────────────────────────────────────────

export interface PocketBaseRecord {
  /** Auto-generated record ID */
  id: string;
  /** Collection ID (PocketBase internal) */
  collectionId: string;
  /** Collection name (e.g., "events") */
  collectionName: string;
  /** ISO 8601 timestamp */
  created: string;
  /** ISO 8601 timestamp */
  updated: string;
}

// ────────────────────────────────────────────────────────────────────────────
// Event types
// ────────────────────────────────────────────────────────────────────────────

/**
 * The full enumeration of event types supported by the H.E.L.P. Center
 * calendar. Add new values here if you introduce new event types — keep this
 * file in sync with the PocketBase schema.
 */
export type EventType =
  | 'booking'       // Coaching session, scheduled by client or coach
  | 'focus_block'   // Deep-work / focus session (focus planner)
  | 'task'          // To-do item with optional due time
  | 'personal'      // Personal commitment (gym, family, etc.)
  | 'program'       // H.E.L.P. program session (Pathway, group call)
  | 'note_anchor';  // Calendar marker linked to a standalone note

/**
 * Source app — which app created the event. Useful for filtering and for
 * showing a small indicator badge ("created in focus planner").
 */
export type EventSource =
  | 'helpcenter'
  | 'focusplanner'
  | 'signflow'
  | 'mobile'
  | 'admin'
  | 'import';

/**
 * Calendar event record.
 *
 * Tenant isolation is enforced at the database level via PocketBase API rules:
 *   listRule:   @request.auth.tenantId = tenant_id
 * Your app does NOT need to filter by tenant_id client-side — PocketBase
 * already restricts results to the authenticated tenant.
 */
export interface Event extends PocketBaseRecord {
  /** Tenant that owns this event (relation → tenants.id) */
  tenant_id: string;

  /** What kind of event this is */
  type: EventType;

  /** Display title shown on the calendar */
  title: string;

  /** Optional longer description */
  description?: string;

  /** ISO 8601 start datetime (e.g., "2026-05-14T09:00:00Z") */
  start: string;

  /** ISO 8601 end datetime */
  end: string;

  /** True if this is an all-day event (start/end times are ignored) */
  all_day: boolean;

  /**
   * Color shown on the calendar. Accepts hex (#1E5BC0) or a design-system
   * token (e.g., "amber", "primary"). The receiving app decides how to render.
   */
  color: string;

  /** Which app created this event */
  source_app: EventSource;

  /**
   * Optional reference back to a record in the source app
   * (e.g., a booking ID, a focus session ID, a task ID).
   */
  linked_id?: string;

  /**
   * App-specific extra data. The shape depends on `source_app`. Keep this
   * flexible — each app reads only the keys it cares about.
   */
  metadata?: EventMetadata;
}

/**
 * Flexible metadata bag. Apps add their own keys; consumers ignore unknown ones.
 * Documented common keys below — extend as needed.
 */
export interface EventMetadata {
  // ── Focus planner ──
  /** Number of pomodoros planned or completed */
  pomodoros?: number;
  /** Energy level 1-5 */
  energy?: 1 | 2 | 3 | 4 | 5;
  /** Project tag, e.g., "landing-rewrite" */
  project?: string;
  /** True if the user marked the focus block as complete */
  completed?: boolean;

  // ── H.E.L.P. Center bookings ──
  /** Service ID (e.g., "consultation-30min") */
  service_id?: string;
  /** Client ID for bookings */
  client_id?: string;
  /** Has a contract been sent for this booking? */
  doc_status?: 'none' | 'sent' | 'signed';
  /** Price in USD cents */
  price_cents?: number;

  // ── Tasks ──
  /** Priority level */
  priority?: 'low' | 'medium' | 'high';
  /** True if task is complete */
  done?: boolean;

  // Anything else — extend freely
  [key: string]: unknown;
}

// ────────────────────────────────────────────────────────────────────────────
// Notes (companion collection)
// ────────────────────────────────────────────────────────────────────────────

export interface Note extends PocketBaseRecord {
  /** Tenant that owns this note */
  tenant_id: string;

  /** Note title */
  title: string;

  /**
   * Note body. Plain text or stringified rich-text JSON (e.g., from a
   * TipTap or ProseMirror editor) — the app decides which.
   */
  body: string;

  /** Optional anchor to a calendar event (e.g., "notes for my 2pm meeting") */
  event_id?: string;

  /** Free-form tags */
  tags?: string[];

  /** Pinned notes show first */
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
  /** ISO 8601 — null after trial ends */
  trial_ends_at: string | null;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  is_suspended: boolean;
}

// ────────────────────────────────────────────────────────────────────────────
// JWT claims (what your app receives after login)
// ────────────────────────────────────────────────────────────────────────────

export interface HelpCenterJWTClaims {
  /** Tenant ID — same as `tenantId` (sub is JWT-standard, tenantId is convenience) */
  sub: string;
  tenantId: string;
  tier: 'solo' | 'pro';
  email: string;
  /** Issued at (unix seconds) */
  iat: number;
  /** Expires at (unix seconds) */
  exp: number;
}

// ────────────────────────────────────────────────────────────────────────────
// PocketBase API response shapes
// ────────────────────────────────────────────────────────────────────────────

/** Standard paginated list response from `pb.collection(x).getList()` */
export interface PaginatedList<T> {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}

/** Realtime subscription event */
export interface RealtimeEvent<T> {
  action: 'create' | 'update' | 'delete';
  record: T;
}

// ────────────────────────────────────────────────────────────────────────────
// Type guards (runtime checks for unknown payloads — useful for webhooks)
// ────────────────────────────────────────────────────────────────────────────

/** Type guard: confirms an unknown object is a valid Event */
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

/** Type guard: confirms a value is one of the known EventType strings */
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

/** Type guard: confirms an unknown object is a valid Note */
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
// Common filter builders (typed wrappers over PocketBase filter strings)
// ────────────────────────────────────────────────────────────────────────────

/** Build a filter string for events between two ISO datetimes */
export function eventsBetweenFilter(startISO: string, endISO: string): string {
  return `start >= "${startISO}" && start <= "${endISO}"`;
}

/** Build a filter string for events of one or more types */
export function eventsByTypeFilter(types: EventType | EventType[]): string {
  const arr = Array.isArray(types) ? types : [types];
  return arr.map((t) => `type = "${t}"`).join(' || ');
}

/** Combine multiple filter clauses with AND */
export function andFilter(...clauses: string[]): string {
  return clauses.filter(Boolean).map((c) => `(${c})`).join(' && ');
}

// ────────────────────────────────────────────────────────────────────────────
// Example usage (delete or adapt — kept here for the integrating dev)
// ────────────────────────────────────────────────────────────────────────────

/*
import PocketBase from 'pocketbase';
import type { Event, EventType, PaginatedList, RealtimeEvent } from './events';
import { eventsBetweenFilter, eventsByTypeFilter, andFilter } from './events';

const pb = new PocketBase('https://api.thehelpctr.com/pb');

await pb.collection('tenants').authWithPassword('joy@example.com', 'pass');

// Today's events, focus blocks only
const today = new Date();
const start = new Date(today.setHours(0, 0, 0, 0)).toISOString();
const end   = new Date(today.setHours(23, 59, 59, 999)).toISOString();

const result = await pb.collection('events').getList<Event>(1, 100, {
  filter: andFilter(
    eventsBetweenFilter(start, end),
    eventsByTypeFilter('focus_block')
  ),
  sort: 'start',
});
// result.items is Event[]

// Realtime subscription
pb.collection('events').subscribe<Event>('*', (e: RealtimeEvent<Event>) => {
  switch (e.action) {
    case 'create': console.log('New event:', e.record.title); break;
    case 'update': console.log('Updated:',   e.record.title); break;
    case 'delete': console.log('Deleted:',   e.record.id);    break;
  }
});

// Create a focus block
const block = await pb.collection('events').create<Event>({
  tenant_id: pb.authStore.model!.id,
  type: 'focus_block',
  title: 'Deep work — landing page',
  start: '2026-05-14T09:00:00Z',
  end:   '2026-05-14T11:00:00Z',
  all_day: false,
  color: '#1E5BC0',
  source_app: 'focusplanner',
  metadata: { pomodoros: 4, energy: 4, project: 'landing-rewrite' },
});
*/
