# Direction filter

Some XAA event types accept an optional **`direction`** field inside the subscription **`filter`**, next to **`user_id`**. It restricts events to **which side of the relationship** the filtered user is on (for example “someone followed *them*” vs “*they* followed someone else”).

Today, the events that support this field are **`follow.follow`**, **`follow.unfollow`**, and **`like.create`**. Other `event_type` values either ignore `direction` or reject the subscription—check the current X developer docs if you are unsure.

## Values

- **`"inbound"`** — activity directed **at the user** identified by `user_id` (another account followed/unfollowed them, or liked one of their posts).
- **`"outbound"`** — activity **by that user** toward another account (they followed/unfollowed someone, or liked someone else's post).

Note that `like.create` is a **private** event, so its subscriptions require **user OAuth** (`--auth oauth2` or `--auth oauth1`) rather than the app-only auth used in the follow example below. See [Subscribing to private events](./3_subscribe_private.md).

## Example request

```http
POST /2/activity/subscriptions
```

Body (use **`inbound`** or **`outbound`**):

```json
{
  "event_type": "follow.follow",
  "filter": {
    "user_id": "<id>",
    "direction": "inbound"
  }
}
```

For webhook delivery, include **`webhook_id`** (and optionally **`tag`**) the same way as in [Subscribing to public events](./2_subscribe_public.md).

### With `xurl`

```bash
xurl --auth app /2/activity/subscriptions -X POST -d '{
  "event_type": "follow.follow",
  "filter": {
    "user_id": "YOUR_USER_ID",
    "direction": "inbound"
  },
  "webhook_id": "YOUR_WEBHOOK_ID",
  "tag": "follows inbound"
}'
```

Use **`"direction": "outbound"`** when you want the opposite direction. Follow subscriptions may require **Enterprise** (or other elevated) entitlements for app-only auth; see [Event types and authentication](./1_events_and_auth.md#follow-events).
