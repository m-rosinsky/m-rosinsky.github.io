# Event types and authentication

This page lists supported **event types** and explains how they line up with **authentication**. For XAA, **whether an event is public or private is the same question as whether you may use app-only credentials or must use user credentials**. The privacy class tells you which OAuth style X expects (See section below).

## Supported event types

Most filters use **`user_id`** (numeric user ID). The exception is **`news.new`**, which uses a **`keyword`** filter.

The **Privacy** column is how X classifies the event for XAA: **Public** (app Bearer is the usual subscription path, subject to tier rules), **Private** (user OAuth required), or **Multi** (both shapes exist, for example a path that is public under Enterprise app auth and a path that is private under pay-per-user / user context, per product configuration).

### Profile events

| Event type | Description | Privacy | Filter |
| --- | --- | --- | --- |
| `profile.update.bio` | User updates their profile bio | Public | `user_id` |
| `profile.update.profile_picture` | User updates their profile picture | Public | `user_id` |
| `profile.update.banner_picture` | User updates their profile banner | Public | `user_id` |
| `profile.update.screenname` | User updates their display name | Public | `user_id` |
| `profile.update.handle` | User updates their handle | Public | `user_id` |
| `profile.update.geo` | User updates their profile location | Public | `user_id` |
| `profile.update.url` | User updates their profile website URL | Public | `user_id` |
| `profile.update.verified_badge` | User updates their verified badge | Public | `user_id` |
| `profile.update.affiliate_badge` | User updates their affiliate badge | Public | `user_id` |

### Follow events

| Event type | Description | Privacy | Filter |
| --- | --- | --- | --- |
| `follow.follow` | User follows another user | Multi | `user_id`, optional `direction` |
| `follow.unfollow` | User unfollows another user | Multi | `user_id`, optional `direction` |

> **Direction filter:** For `follow.follow` and `follow.unfollow`, the filter may include **`direction`**: **`"inbound"`** or **`"outbound"`** alongside **`user_id`**. Only follow events support this today. See [Direction filter](./5_direction_filter.md).

**Multi** here means XAA supports more than one auth posture: Some trusted packages may subscribe with **application-only** access (public-style entitlement for that tier), while **pay-per-user** flows treat the same event as **private** and require **user OAuth** for the filtered account. Confirm the matrix for your package on [docs.x.com](https://docs.x.com).

### Spaces events

| Event type | Description | Privacy | Filter |
| --- | --- | --- | --- |
| `spaces.start` | User starts a Space | Public | `user_id` |
| `spaces.end` | User ends a Space | Public | `user_id` |

### Legacy DM events

Unencrypted, legacy direct messages.

| Event type | Description | Privacy | Filter |
| --- | --- | --- | --- |
| `dm.received` | User receives an unencrypted DM | Private | `user_id` |
| `dm.sent` | User sends an unencrypted DM | Private | `user_id` |
| `dm.read` | User reads a DM or read receipt for the filtered user | Private | `user_id` |
| `dm.indicate_typing` | User is typing a message to the filtered user | Private | `user_id` |

### Chat events (encrypted / XChat)

| Event type | Description | Privacy | Filter |
| --- | --- | --- | --- |
| `chat.received` | User receives an encrypted direct message | Private | `user_id` |
| `chat.sent` | User sends an encrypted direct message | Private | `user_id` |
| `chat.conversation_join` | User joins an encrypted chat conversation | Private | `user_id` |
| `chat.indicate_typing` | User is typing in an encrypted chat | Private | `user_id` |
| `chat.read` | User read state in encrypted chat | Private | `user_id` |

The last two rows are **in development**; availability and payload fields may change—watch X developer docs.

### News events

| Event type | Description | Privacy | Filter |
| --- | --- | --- | --- |
| `news.new` | New Grok-curated trends and headlines | Public | `keyword` |

`news.new` is **Enterprise and Partner tier only** at this time.

XAA will add more event types over time (for example social interactions, content engagement, and monetization); check [X developer documentation](https://docs.x.com) for the latest list.

## Subscription limits

| Package tier | Maximum subscriptions |
| --- | --- |
| Self-serve | 1,000 |
| Enterprise | 50,000 |
| Partner | 100,000 |

## Public vs private events = app vs user auth

X labels each XAA event type as **public** or **private** in line with the main app. That label is not a separate concept from authentication: it tells you **whose OAuth grant** must back your requests.

**Private events** are activities that are not universally visible on X (for example DMs and encrypted chat). Accessing them requires **explicit user authorization**: the relevant user must have signed in and approved your app, with the right permissions. In practice that means **OAuth 2.0 user context** (“3-legged” OAuth) **or OAuth 1.0a user access**—a token tied to that user, not just your app’s identity. You may only create subscriptions for private streams for users who have authorized your application, and you will use **user-scoped** credentials in `xurl` with **`--auth oauth2`** (OAuth 2.0 user context) or **`--auth oauth1`** (OAuth 1.0a user access), after registering the matching profile. See the [xurl README](https://github.com/xdevplatform/xurl) for setup; scopes are defined in the current X developer docs.

**Public events** are activities that are already visible in public on the platform (for example many profile updates). Subscribing and receiving those streams is done with **OAuth 2.0 application-only authentication**: a **Bearer token** for your app from the [developer portal](https://developer.x.com/en/portal/dashboard)—no end-user login for that token. In this book that is the `xurl` pattern **`xurl auth app --bearer-token …`** then **`--auth app`** (see the [xURL](../../1_tools/1_xurl/xurl.md) chapter).

So: **private ⟺ user OAuth (OAuth2 user context or OAuth1 user access)**; **public ⟺ OAuth2 app Bearer** for the subscription and delivery patterns X documents for XAA. Calling subscription management endpoints themselves still typically uses your **app** credentials; the distinction above is what X requires for the **event family** you target and for **which users** you may filter on for private data.

**Caveat:** Some event types can be accessed with **either** user OAuth **or** app-level OAuth, depending on how X exposes them for your product. Even then, **application-only (Bearer) access is not always available on every package**: for certain events—for example **`follow.follow` / `follow.unfollow`**—X may reserve app-only subscriptions to **higher or “elevated” tiers**, while lower tiers still work if the relevant user has authorized your app with user context. Treat the public/private split above as the **privacy model**; treat **tier and contract** as a separate gate for whether **app** auth is actually enabled for a given `event_type` on your developer account. Confirm both in the current XAA docs and your portal entitlements.

The event tables above mix both families (for example profile vs DM/chat). For the authoritative public/private list and any nuance, use X’s **Event privacy and authentication** section for XAA on [docs.x.com](https://docs.x.com).

| | **Public events** | **Private events** |
| --- | --- | --- |
| **Relationship to your app** | Data X treats as already public; your app does not need that user’s personal OAuth grant | Data X treats as private; that user must explicitly authorize your app before you can subscribe |
| **OAuth model** | **OAuth 2.0 app-only** (Bearer token) | **OAuth 2.0 user context** or **OAuth 1.0a** user access (user explicitly grants your app) |
| **`xurl`** | `--auth app` | `--auth oauth2` or `--auth oauth1` (after configuring user tokens) |
| **Typical subscription rule** | Filter by `user_id` (or `keyword` for `news.new`) per docs | Filter only for users who have authorized your app |

## Next

- **[Subscribing to public events](2_subscribe_public.md)** — verify access with `xurl --auth app`, look up a user id, create a `profile.update.bio` subscription, and inspect webhook payloads.
- **[Subscribing to private events](3_subscribe_private.md)** — configure user OAuth and call the subscription API with **`xurl --auth oauth2`** or **`xurl --auth oauth1`** for private event types.
- **[News by keyword](4_news.md)** — `news.new` with a `keyword` filter (Enterprise / Partner).
- **[Direction filter](5_direction_filter.md)** — `direction` (`inbound` / `outbound`) for follow subscriptions.
