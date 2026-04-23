# Subscribing to private events

**Private** XAA event types (legacy DMs, encrypted chat, and others marked **Private** in [Event types and authentication](./1_events_and_auth.md)) require **explicit user authorization**: OAuth **2.0 user context** or **OAuth 1.0a** user access for the user whose activity you are allowed to subscribe to. Application-only Bearer tokens are **not** sufficient for creating or receiving those subscriptions on behalf of that user.

This page shows the same subscription HTTP shape as [Subscribing to public events](./2_subscribe_public.md), but with **`xurl --auth oauth2`** or **`xurl --auth oauth1`** so the request runs under a **user** credential that has granted your app the right scopes. App-only traffic continues to use **`--auth app`** (see the [xURL](../../1_tools/1_xurl/xurl.md) chapter).

## Prerequisites

1. An X app with XAA access and a [registered webhook](../1_webhooks/0_webhooks.md) (same as the public flow).
2. A real user (often you, while testing) who **signs in with X** and approves your app, granting the permissions X requires for the private event family you care about.
3. User tokens registered in `xurl` for **`--auth oauth2`** (OAuth 2.0 user context) or **`--auth oauth1`** (OAuth 1.0a user access), whichever you use.

The [xurl README](https://github.com/xdevplatform/xurl) documents how to configure **OAuth 2.0 user** flows and **OAuth 1.0a user** access; follow that for your stack (PKCE / callback URL / token storage). Exact CLI subcommands and flags can change between `xurl` releases—use the README as source of truth. The [xURL](../../1_tools/1_xurl/xurl.md) chapter covers installing the tool and **app** bearer registration; extend that setup with user credentials before continuing.

## Who the `user_id` filter refers to

For private streams, the **`user_id`** in your filter must be a user who has **authorized your app**. In the common “subscribe to my own DMs or chat” case, that is the same user whose OAuth 2.0 or OAuth 1.0a profile you select with **`--auth oauth2`** or **`--auth oauth1`**.

## Example: subscribe with user auth

Below, the authenticated user is subscribing to **their own** incoming encrypted messages (`chat.received`). Replace placeholders with your webhook id, user id, and ensure your app has the chat/DM scopes X documents for XAA. The example uses OAuth 2.0 user context; if you use OAuth 1.0a user access instead, swap in **`--auth oauth1`**.

```bash
xurl --auth oauth2 /2/activity/subscriptions -X POST -d '{
  "event_type": "chat.received",
  "filter": {
    "user_id": "AUTHORIZED_USER_ID"
  },
  "webhook_id": "YOUR_WEBHOOK_ID",
  "tag": "my chat inbox"
}'
```

If your token or scopes are wrong, X returns an OAuth or permission error instead of a `200` subscription body—treat that as a configuration issue, not a generic “XAA down” failure.

### Success response

The JSON shape matches the public case: `data.subscription` with `subscription_id`, `event_type`, `filter`, `webhook_id`, and `tag`.

```json
{
  "data": {
    "subscription": {
      "created_at": "2025-10-07T05:31:56Z",
      "event_type": "chat.received",
      "filter": {
        "user_id": "AUTHORIZED_USER_ID"
      },
      "subscription_id": "1146654567674912769",
      "tag": "my chat inbox",
      "updated_at": "2025-10-07T05:31:56Z",
      "webhook_id": "YOUR_WEBHOOK_ID"
    }
  },
  "meta": {
    "total_subscriptions": 1
  }
}
```

## Listing with user context

### Listing with user auth

When you call **`GET /2/activity/subscriptions`** with the same user profile you used to create private subscriptions—for example **`xurl --auth oauth2`** or **`xurl --auth oauth1`**—the response includes **only the subscriptions that were created under that specific user’s authorization**. You do not see every subscription visible to your app under **`--auth app`**.

That makes user-scoped `GET` useful for debugging or UI that should show “my subscriptions” for the signed-in account, without mixing in subscriptions that another user (or your app bearer) created.

```bash
xurl --auth oauth2 /2/activity/subscriptions
```

As with [Subscribing to public events](./2_subscribe_public.md), list responses use **`meta.result_count`** for how many subscription objects appear in **`data`**.

## Next

- **[News by Keyword](./4_news.md)** — `news.new` is **public** and typically uses **`--auth app`** (Enterprise / Partner); it is a separate tutorial because the filter is a **`keyword`**, not `user_id`.
