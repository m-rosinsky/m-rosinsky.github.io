# Subscribing to public events

This walkthrough assumes you have completed the [X Activity API introduction](./0_xaa.md) and read [Event types and authentication](./1_events_and_auth.md). It uses a **public** event type (`profile.update.bio`) with **OAuth 2.0 application-only** credentials (`xurl --auth app`). Commands use the `xurl` CLI; if you have not installed it yet, follow the [xURL](../../1_tools/1_xurl/xurl.md) chapter first.

For **private** event types (DMs, chat, and so on) you must use **user OAuth** instead—see [Subscribing to private events](./3_subscribe_private.md).

## Verify access

Confirm your app can call the subscriptions API:

```
xurl --auth app /2/activity/subscriptions
```

```json
{
  "data":[
  ],
  "meta": {
    "result_count": 0
  }
}
```

If you see a JSON body like the above (possibly with existing subscriptions), your bearer token and project access are working. For **`GET /2/activity/subscriptions`**, `meta.result_count` is the number of subscription objects returned in `data` (not `total_subscriptions`).

## Getting your user ID

Most public XAA filters use **`user_id`** (numeric user ID, not username). The exception is **`news.new`**, which uses a **`keyword`** filter—see [News by Keyword](./4_news.md).

Look up your user id with the User Lookup endpoint:

```bash
xurl --auth app /2/users/by/username/YOUR_USERNAME
```

Replace `YOUR_USERNAME` with your X handle without `@`.

**Example response:**

```json
{
  "data": {
    "id": "1234567890",
    "name": "Your Name",
    "username": "your_username"
  }
}
```

Copy the `id` value for the subscription below.

## Creating a subscription

Subscribe to your own profile bio updates so you can trigger a test event.

### Subscription payload

When creating a subscription, you typically send:

- **`event_type`**: The event to subscribe to (required)
- **`filter`**: Match criteria (required)—often `{ "user_id": "…" }`
- **`webhook_id`**: Where to deliver events (optional, but required for webhook delivery)
- **`tag`**: Optional label for your own bookkeeping (recommended)

Create the subscription:

```bash
xurl --auth app /2/activity/subscriptions -X POST -d '{
  "event_type": "profile.update.bio",
  "filter": {
    "user_id": "YOUR_USER_ID"
  },
  "webhook_id": "YOUR_WEBHOOK_ID",
  "tag": "my bio updates"
}'
```

### Success response

```json
{
  "data": {
    "subscription": {
      "created_at": "2025-10-07T05:31:56Z",
      "event_type": "profile.update.bio",
      "filter": {
        "user_id": "YOUR_USER_ID"
      },
      "subscription_id": "1146654567674912769",
      "tag": "my bio updates",
      "updated_at": "2025-10-07T05:31:56Z",
      "webhook_id": "YOUR_WEBHOOK_ID"
    }
  },
  "meta": {
    "total_subscriptions": 1
  }
}
```

## Testing your subscription

After the subscription is created, change your profile bio on X. Your webhook server should log a delivery.

### Sample webhook payload

```json
{
  "data": {
    "filter": {
      "user_id": "YOUR_USER_ID"
    },
    "event_type": "profile.update.bio",
    "tag": "my bio updates",
    "payload": {
      "before": "vox populi",
      "after": "vox dei"
    }
  }
}
```

Fields:

- **`filter`**: The subscription filter that matched
- **`event_type`**: Which event fired
- **`tag`**: The tag you set when creating the subscription
- **`payload`**: Change-specific data (here, before/after bio text)

List subscriptions again to confirm:

```bash
xurl --auth app /2/activity/subscriptions
```

## Next steps

1. **Handle multiple event types** as needed for your product
2. **Handle delivery failures** and retries responsibly
3. **Monitor subscription health** and rotate credentials on schedule
4. **Delete unused subscriptions** and stay under your tier cap (see [Subscription limits](./1_events_and_auth.md#subscription-limits))

Continue with [Subscribing to private events](./3_subscribe_private.md) for user-authenticated subscriptions, or [News by Keyword](./4_news.md) for `news.new` and keyword filters.
