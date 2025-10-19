# The X Activity API

In this chapter, we'll use the webhook that made in the previous chapter in conjunction with X's newest real-time data suite, the X Activity API.

## About

The X Activity API allows us to subscribe to event types and apply filters. When a matching event is created, it will be delivered to our app.

XAA offers both webhook and streaming support, but we'll be using the webhook option in this example.

## Routes

To manage our active subscriptions in XAA, we're offered the following routes:

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/2/activity/subscriptions` | List all active subscriptions |
| `POST` | `/2/activity/subscriptions` | Create a new subscription (see below for JSON body) |
| `DELETE` | `/2/activity/subscriptions/:subscription_id` | Delete a subscription by ID |
| `PUT` | `/2/activity/subscriptions/:subscription_id` | Update a subscription (see below for JSON body) |

> **Note**: All sample commands in this section use the `xurl` CLI tool. If you haven't set up `xurl` yet, check out the [xURL section](../../1_tools/1_xurl/xurl.md) first.

Let's run the `GET` route first just to ensure the route is working and our account has access.

You'll use your bearer token for authentication for all routes:

```
xurl --auth app /2/activity/subscriptions
```

```json
{
  "data":[
  ],
  "meta": {
    "total_subscriptions": 0
  }
}
```

Looks like everything's working. We currently have no active subscriptions.
