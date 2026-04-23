# The X Activity API

This part of the book builds on the [webhook](../1_webhooks/0_webhooks.md) you registered earlier. Here we use X’s **X Activity API (XAA)** to subscribe to activity events and receive them on your app in near real time.

## About

The X Activity API lets you subscribe to **event types** with **filters** (for example a `user_id` or a `keyword`). When a matching event occurs, X delivers it to your integration—typically over a **webhook** or a **persistent HTTP stream** (`GET /2/activity/stream`). These docs focus on webhooks.

> **Note:** XAA does not deliver posts. For real-time post delivery, use the [Filtered Stream](https://developer.x.com/x-api/posts/filtered-stream/introduction) endpoint.

**Public** vs **private** for XAA is the same axis as **app vs user auth**: public streams use **OAuth 2.0 app Bearer** tokens; private streams require **explicit user OAuth** (OAuth 2.0 user context or OAuth 1.0a user access). The next chapter lists **event types**, **subscription limits**, and spells that model out in one place.

## Routes

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/2/activity/stream` | Connect to the activity stream (persistent HTTP) |
| `GET` | `/2/activity/subscriptions` | List all active subscriptions |
| `POST` | `/2/activity/subscriptions` | Create a new subscription |
| `DELETE` | `/2/activity/subscriptions/:subscription_id` | Delete a subscription by ID |
| `PUT` | `/2/activity/subscriptions/:subscription_id` | Update a subscription |

Continue to [Event types and authentication](1_events_and_auth.md) for the full event catalog and auth model, then [Subscribing to public events](2_subscribe_public.md) for a hands-on walkthrough with **`xurl --auth app`**.
