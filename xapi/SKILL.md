---
name: x-api-blog
description: >-
  Build with X Developer API webhooks and the X Activity API (XAA) using patterns
  from Mike Rosinsky's X API blog. Use when implementing webhook receivers, CRC
  challenges, webhook registration/replay, XAA subscriptions (public/private),
  event types, news.keyword filters, follow/like direction filters, or when the
  user mentions xurl, X Activity API, Account Activity, or this blog's tutorials.
---

# X API Blog

Agent reference for tutorials at `xapi/` on this site. Prefer [xurl](https://github.com/xdevplatform/xurl) for sample calls. Official docs supersede this: [webhooks](https://docs.x.com/x-api/webhooks/introduction), [docs.x.com](https://docs.x.com).

## Decision tree

```
Need real-time X data?
├─ Site-wide public posts → Filtered Stream (not XAA)
├─ Specific account activity → XAA + filter.user_id
├─ Keyword news/trends → XAA news.new + filter.keyword (Enterprise/Partner)
└─ Delivery
   ├─ Webhook → POST /2/webhooks (CRC), then pass webhook_id on subscription
   └─ Stream → GET /2/activity/stream

XAA auth?
├─ Public event → xurl --auth app
├─ Private event → xurl --auth oauth2|oauth1 (user must have authorized the app)
└─ Multi (follow.*) → tier-dependent; may need Enterprise app-only or user OAuth
```

## xurl

```bash
curl -fsSL https://raw.githubusercontent.com/xdevplatform/xurl/main/install.sh | sudo bash

xurl auth app --bearer-token YOUR_BEARER_TOKEN
xurl --auth app /2/tweets/20

# User context — NOT --auth user
xurl --auth oauth2 …
xurl --auth oauth1 …
```

- Features used in the blog: auth profiles, URL shortening, `xurl webhook start` (ngrok tunnel).
- `xurl webhook start` needs OAuth1 keys (CRC uses consumer secret) and an ngrok authtoken (`NGROK_AUTHTOKEN` or prompt).
- Printed tunnel URL ends in **`/webhook`** (singular). Flask sample uses **`/webhooks`**. Register the exact URL you serve.

## Webhooks

Push delivery: register HTTPS callback → X `GET`s CRC → X `POST`s events. Products: Filtered Stream, Account Activity API, X Activity API.

### Receiver contract

| Method | Role |
|--------|------|
| `GET …?crc_token=` | Prove ownership; respond with HMAC |
| `POST` | Accept JSON event; return `200` (empty body is fine) |

**CRC (exact):**

1. Key = app **consumer secret** (Developer Portal “API Key Secret”) — not the Bearer token.
2. `digest = HMAC-SHA256(key=consumer_secret, msg=crc_token)` (raw bytes).
3. Body: `{"response_token":"sha256=<base64(digest)>"}` — literal `sha256=` prefix + base64, not hex.

```python
digest = hmac.new(
    CONSUMER_SECRET.encode("utf-8"),
    msg=crc_token.encode("utf-8"),
    digestmod=hashlib.sha256,
).digest()
return {"response_token": "sha256=" + base64.b64encode(digest).decode("utf-8")}
```

Local demo without writing a server:

```bash
xurl auth oauth1
xurl webhook start   # keep process running; use printed HTTPS URL
```

### Registration (`--auth app`)

| Method | Path |
|--------|------|
| `GET` | `/2/webhooks` |
| `POST` | `/2/webhooks` body `{"url":"<https url>"}` |
| `DELETE` | `/2/webhooks/:webhook_id` |
| `PUT` | `/2/webhooks/:webhook_id` — force CRC re-check |
| `POST` | `/2/webhooks/replay` |

```bash
xurl --auth app /2/webhooks -X POST -d '{"url":"<HTTPS_URL>"}'
# → data: { id, url, created_at, valid }
```

- `POST` create triggers an immediate CRC `GET` to your URL.
- X re-CRCs ~every 24h. `"valid": false` → **no deliveries** until `PUT` succeeds.
- Management API = app Bearer; CRC HMAC = consumer secret on your server.

### Replay (`--auth app`, package-restricted)

Redelivers up to **24h** of events (success *and* failure) for that webhook across webhook products.

```bash
xurl --auth app /2/webhooks/replay -X POST -d '{
  "webhook_id": "<ID>",
  "from_date": "YYYYMMDDHHMM",
  "to_date": "YYYYMMDDHHMM"
}'
```

- UTC only; `from_date` within last 24h; `to_date` > `from_date`; neither in the future.
- Replay deliveries include `"meta":{"replay":true}`.
- Completion may arrive as top-level `replay_job_status` and can be **out of order** vs replayed events. Dedupe against live traffic.

## X Activity API (XAA)

Subscribe to event types + filters; deliver via webhook (`webhook_id`) or `GET /2/activity/stream`.

| Method | Path |
|--------|------|
| `GET` | `/2/activity/subscriptions` |
| `POST` | `/2/activity/subscriptions` |
| `DELETE` | `/2/activity/subscriptions/:subscription_id` |
| `PUT` | `/2/activity/subscriptions/:subscription_id` |
| `GET` | `/2/activity/stream` |

**Privacy class = auth style:**

| Privacy | Auth | xurl |
|---------|------|------|
| Public | App Bearer | `--auth app` |
| Private | User OAuth | `--auth oauth2` or `--auth oauth1` |
| Multi | Tier/package dependent | confirm on docs.x.com |

Subscription caps (blog): Self-serve 1k · Enterprise 50k · Partner 100k.

`webhook_id` is optional in the API schema but **required for webhook delivery**. `tag` optional, recommended. Filters use numeric `user_id` strings (resolve via `/2/users/by/username/:name`), except `news.new`.

### Event catalog

Default filter: `user_id`. Optional `direction` only where noted.

| Event | Privacy | Filter notes |
|-------|---------|--------------|
| `profile.update.bio` | Public | |
| `profile.update.profile_picture` | Public | |
| `profile.update.banner_picture` | Public | |
| `profile.update.screenname` | Public | |
| `profile.update.handle` | Public | |
| `profile.update.geo` | Public | |
| `profile.update.url` | Public | |
| `profile.update.verified_badge` | Public | |
| `profile.update.affiliate_badge` | Public | |
| `follow.follow` / `follow.unfollow` | Multi | optional `direction` |
| `post.create` / `post.delete` | Public | author = `user_id`; not a site-wide firehose |
| `post.mention.create` | Private | mentioned user = `user_id` |
| `like.create` | Private | optional `direction` |
| `spaces.start` / `spaces.end` | Public | |
| `dm.received` / `dm.sent` / `dm.read` / `dm.indicate_typing` | Private | legacy unencrypted DM |
| `chat.received` / `chat.sent` / `chat.conversation_join` | Private | encrypted XChat |
| `chat.indicate_typing` / `chat.read` | Private | in development |
| `news.new` | Public | filter **`keyword`**; Enterprise/Partner only |

### Subscribe — public

```bash
xurl --auth app /2/users/by/username/YOUR_USERNAME
xurl --auth app /2/activity/subscriptions -X POST -d '{
  "event_type": "profile.update.bio",
  "filter": { "user_id": "YOUR_USER_ID" },
  "webhook_id": "YOUR_WEBHOOK_ID",
  "tag": "my bio updates"
}'
```

Create response nests `data.subscription` (+ `meta.total_subscriptions`). List `GET` returns a flat `data` array (+ `meta.result_count`).

Example delivery (`profile.update.bio`):

```json
{
  "data": {
    "filter": { "user_id": "…" },
    "event_type": "profile.update.bio",
    "tag": "my bio updates",
    "payload": { "before": "…", "after": "…" }
  }
}
```

### Subscribe — private

Same JSON shape; different auth. `filter.user_id` must be a user who **authorized your app** (often the OAuth user themselves for inbox-style events).

```bash
xurl --auth oauth2 /2/activity/subscriptions -X POST -d '{
  "event_type": "chat.received",
  "filter": { "user_id": "AUTHORIZED_USER_ID" },
  "webhook_id": "YOUR_WEBHOOK_ID",
  "tag": "my chat inbox"
}'
```

`GET /2/activity/subscriptions` with user auth lists **only that user's** subscriptions, not the whole app.

### Direction filter

Only for `follow.follow`, `follow.unfollow`, `like.create`. Omit = both directions.

| Value | Meaning |
|-------|---------|
| `inbound` | Activity **at** user (followed/liked) |
| `outbound` | Activity **by** user (follows/likes others) |

```json
{
  "event_type": "like.create",
  "filter": { "user_id": "AUTHORIZED_USER_ID", "direction": "outbound" },
  "webhook_id": "YOUR_WEBHOOK_ID",
  "tag": "my likes"
}
```

- Likes → always private (`oauth2`/`oauth1`).
- Follows → Multi; app-only may need Enterprise+. Other event types: ignore or reject `direction`.

### News by keyword

```bash
xurl --auth app /2/activity/subscriptions -X POST -d '{
  "event_type": "news.new",
  "filter": { "keyword": "Tesla" },
  "webhook_id": "YOUR_WEBHOOK_ID",
  "tag": "Tesla trends"
}'
```

Delivery includes `event_uuid`, `payload.headline`, `payload.summary`. One story matching multiple keyword subs → multiple deliveries; dedupe on `event_uuid`.

## Gotchas

- CRC secret ≠ Bearer token.
- xurl path `/webhook` vs sample app `/webhooks`.
- No `--auth user` in xurl — use `oauth2` / `oauth1`.
- XAA ≠ Filtered Stream firehose.
- Private events cannot target users who never authorized the app.
- Replay and live events can interleave; check `meta.replay`.
- Confirm Multi / news / follow app-only entitlements on docs.x.com for the customer's package.

## Chapter map (`xapi/`)

| Topic | Path |
|-------|------|
| Intro | `index.html` |
| xURL | `1_tools/xurl.html` |
| Webhooks overview | `2_realtime/1_webhooks/0_webhooks.html` |
| Flask CRC sample | `2_realtime/1_webhooks/1_sample_app.html` |
| xurl + ngrok webhook | `2_realtime/1_webhooks/2_xurl_webhook.html` |
| Register / validate | `2_realtime/1_webhooks/3_registration.html` |
| Replay | `2_realtime/1_webhooks/4_replay.html` |
| XAA overview | `2_realtime/2_xaa/0_xaa.html` |
| Events + auth | `2_realtime/2_xaa/1_events_and_auth.html` |
| Public subscribe | `2_realtime/2_xaa/2_subscribe_public.html` |
| Private subscribe | `2_realtime/2_xaa/3_subscribe_private.html` |
| News keyword | `2_realtime/2_xaa/4_news.html` |
| Direction filter | `2_realtime/2_xaa/5_direction_filter.html` |

HTML chapters are the source of truth for narrative detail; this file is the agent-oriented extract.
