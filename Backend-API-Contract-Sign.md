# Backend API Contract — `/api/sign`

**For:** Backend developers updating `server.js` on the H.E.L.P. Center VPS
**Date:** 2026-05-14
**Status:** Required to enable e-signature features after Phase 1 frontend prep

---

## Overview

The H.E.L.P. Center frontend now calls a provider-neutral endpoint `/api/sign`
instead of the legacy `/api/docuseal`. This document specifies what the backend
must implement so the frontend works correctly.

## Two call patterns from the frontend

### Pattern 1 — Document e-signature (proposal, contract, invoice)

Triggered from any document preview screen via the "Send for E-Signature" button.

**Request:**
```http
POST /api/sign
Content-Type: application/json
Authorization: Bearer {{tenant_jwt}}
```

**Body:**
```json
{
  "to": "client@example.com",
  "name": "Client Name",
  "subject": "Coaching Agreement",
  "message": "Please review and sign...",
  "content": "Full document text content here",
  "docType": "Contract"
}
```

**Success response (200):**
```json
{
  "success": true,
  "submissionId": "abc123",
  "signUrl": "https://signflow.thehelpctr.com/sign/abc123",
  "expiresAt": "2026-05-21T12:00:00Z"
}
```

### Pattern 2 — Booking contract send

Triggered from booking detail or documents tab, sends a template-based contract.

**Request:**
```http
POST /api/sign
Content-Type: application/json
Authorization: Bearer {{tenant_jwt}}
```

**Body:**
```json
{
  "templateId": "42",
  "bookingId": "bk_xyz789",
  "subject": "Contract for Coaching Session — 2026-05-20",
  "submitters": [
    { "role": "Signer", "name": "Client Name", "email": "client@example.com" }
  ]
}
```

**Success response (200):**
```json
{
  "success": true,
  "submissionId": "abc124",
  "signUrl": "https://signflow.thehelpctr.com/sign/abc124"
}
```

---

## Provider routing logic (server-side)

The backend should route requests based on tenant settings:

```js
// Pseudocode for /api/sign handler

app.post('/api/sign', authenticateTenant, async (req, res) => {
  const tenant = req.tenant; // from JWT
  const tenantSettings = await getTenantSignatureSettings(tenant.id);

  let provider;
  if (tenantSettings.url && tenantSettings.token) {
    // Tenant has configured their own provider — route there
    provider = createCustomProvider(tenantSettings.url, tenantSettings.token);
  } else {
    // Use built-in SignFlow (default)
    provider = createSignFlowProvider();
  }

  // ... call provider, return response
});
```

---

## Required backend safeguards (REQUIRED — frontend cannot enforce these alone)

These mirror the frontend's 10 safeguards but enforce them server-side, where
they cannot be bypassed by modifying client code.

| # | Safeguard | Why |
|---|-----------|-----|
| 1 | **JWT authentication** on every request | Rejects unauthenticated calls before doing anything else |
| 2 | **Tenant context verification** | Verify the JWT's tenant ID matches the request — reject cross-tenant attempts |
| 3 | **Rate limiting per tenant** | Cap at 20/hour by default. Tiered: Solo 20/hr, Pro 100/hr. Use Redis or in-memory store keyed by tenant ID. |
| 4 | **Email validation (server-side)** | Regex check `to` field — reject malformed addresses |
| 5 | **Content size limit** | Reject `content` field over 500 KB. Larger requests probably abuse or accidents. |
| 6 | **Input sanitization** | Strip HTML/script tags from `subject`, `name`, `message`. Use a library like `sanitize-html`. |
| 7 | **Webhook signature verification** | When SignFlow (or another provider) calls back with "signature complete," verify the signature header to confirm it came from the provider, not an attacker. |
| 8 | **Audit log to PocketBase** | Every signature event logged with: tenant ID, timestamp, recipient email (full, not truncated server-side), document type, subject, status, error if any. Use a new PocketBase collection `signature_events`. |
| 9 | **Document retention policy** | Temp PDFs and metadata purged from backend storage after 30 days unless tenant explicitly keeps them. Set up a daily cron. |
| 10 | **Retry with exponential backoff** | If SignFlow returns 5xx, retry up to 3 times with 1s/2s/4s backoff. If still failing, return 503 to frontend. |

---

## Error response format

```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

**Recommended error codes:**

| HTTP Status | When |
|---|---|
| 400 | Bad input (missing required fields, malformed email) |
| 401 | No JWT or invalid JWT |
| 403 | JWT valid but tenant suspended / not allowed to send |
| 429 | Rate limit exceeded |
| 502 | Upstream provider (SignFlow) failed |
| 503 | Service temporarily unavailable (retry-after header recommended) |

---

## Webhook endpoint — required for "signature complete" callbacks

SignFlow will POST back when a recipient signs. The backend needs:

```http
POST /api/sign/webhook
Content-Type: application/json
X-Signature: HMAC-SHA256-signature-here
```

**Body (example):**
```json
{
  "event": "submission.completed",
  "submissionId": "abc123",
  "signedAt": "2026-05-14T14:32:11Z",
  "signedPdfUrl": "https://signflow.thehelpctr.com/pdf/abc123.pdf",
  "auditTrail": { "ip": "...", "userAgent": "...", "events": [...] }
}
```

**Handler responsibilities:**
1. Verify `X-Signature` HMAC with the shared secret
2. Look up the tenant via `submissionId` → mapping table
3. Update the related booking/document record with `docStatus = 'signed'` and `signedPdfUrl`
4. Append to audit log
5. Trigger Resend email to tenant: "Contract signed by {client name}"
6. Respond `200 OK` (or SignFlow will retry)

---

## Migration from `/api/docuseal`

The old endpoint `/api/docuseal` was used by previous frontend code. After this
update, no frontend code calls it. **Recommended:** keep `/api/docuseal` working
as an alias for one release (calls forward to `/api/sign` with payload adapter),
then remove in the next release.

```js
// Recommended legacy alias
app.post('/api/docuseal', (req, res) => {
  // Adapt legacy body shape to new shape
  const newBody = adaptLegacyDocusealBody(req.body);
  req.body = newBody;
  return handleSignRequest(req, res);
});
```

---

## Environment variables to add

```bash
# Backend SignFlow integration (when SignFlow is deployed)
SIGNFLOW_BASE_URL="https://signflow.thehelpctr.com"
SIGNFLOW_API_KEY="..."
SIGNFLOW_WEBHOOK_SECRET="..."

# Rate limiting store (optional — defaults to in-memory if not set)
REDIS_URL="redis://localhost:6379"
```

---

## Testing checklist

Before declaring `/api/sign` ready for production:

- [ ] Returns 401 without JWT
- [ ] Returns 401 with invalid/expired JWT
- [ ] Returns 400 on missing required fields (`to`, `name`, `subject`)
- [ ] Returns 400 on malformed email
- [ ] Returns 413 (or 400) on content > 500 KB
- [ ] Returns 429 when rate limit exceeded — confirm `Retry-After` header included
- [ ] Routes to user's configured provider when their settings have URL + token
- [ ] Routes to default SignFlow when user has no settings
- [ ] Returns valid JSON on success with `submissionId` and `signUrl`
- [ ] Webhook endpoint verifies X-Signature correctly
- [ ] Webhook endpoint rejects unsigned/invalid signature with 401
- [ ] Audit log row created for every send attempt (success and failure)
- [ ] Sensitive data (full email, document content) NOT in logs at INFO level — only DEBUG
- [ ] Legacy `/api/docuseal` alias works during transition period

---

## Frontend-side state (for reference)

The frontend stores per-tenant signature settings in:

- localStorage key: `signatureSettings`
- Fields: `{ url, token, templateId }`
- Audit log: `signatureAuditLog` (last 200 events, privacy-aware)
- Backward-compat: legacy `docusealSettings` is migrated to `signatureSettings`
  automatically on first load via `Signatures.migrate()`

These keys are scoped per-tenant via the multi-tenant prefix layer at
`help-center-system.html:3961` so different tenants never see each other's
data even when sharing the same browser.

---

*End of contract document. Direct questions to Joy Watford / H.E.L.P. Center.*
