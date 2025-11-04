# Getting New Trends By Keyword in Realtime

This chapter is a brief tutorial on how to use the X Activity API to get new trends emerging on X in realtime, filtered by keywords of your choice.

> **Note**: This feature is currently only for Enterprise customers

## Subscribing to Trends

You'll create a subscription to trends using the X Activity API in the same way you did in the last chapter.

This time, you'll use the `TrendsNew` event type, and you'll specify a `keyword` in the `filter` field instead of a user id:

```bash
xurl --auth app /2/activity/subscriptions -X POST -d '{
  "event_type": "TrendsNew",
  "filter": {
    "keyword": "Tesla"
  },
  "tag": "Tesla trends",
  "webhook_id": "YOUR_WEBHOOK_ID"
}'
```

### Success Response

Upon success, you'll receive this response:

```json
{
  "data": {
    "subscription": {
      "created_at": "2025-10-07T05:31:56Z",
      "event_type": "TrendsNew",
      "filter": {
        "keyword": "Tesla"
      },
      "subscription_id": "1146654567674912769",
      "tag": "Tesla trends",
      "updated_at": "2025-10-07T05:31:56Z",
      "webhook_id": "YOUR_WEBHOOK_ID"
    }
  },
  "meta": {
    "total_subscriptions": 1
  }
}
```

### Getting Trend Events

If you specified a webhook, then you'll start to see trends with a headline containing your keyword right away (as they are generated of course, so it may be a minute until a trend containing your keyword is seen).

Trend events have this form:

```json
{
  "data": {
    "event_uuid": "1985729017958244577",
    "filter": {
      "keyword": "news"
    },
    "event_type": "TrendsNew",
    "tag": "news trends",
    "payload": {
      "headline": "This is some news breaking on X",
      "summary": "Some new news broke on X today, which is an awesome place to go for breaking news!"
    }
  }
}
```

As the X Activity API matures, more fields will be added to the payload.

### Duplicate Trends

If you specified multiple subscriptions for trends, and a single trend event matches multiple subscriptions, it may be delivered multiple times.

Here's an example:

```json
{
  "data": {
    "event_uuid": "1985729017958244577",
    "filter": {
      "keyword": "jack"
    },
    "event_type": "TrendsNew",
    "tag": "jack trends",
    "payload": {
      "headline": "New Jersey Gubernatorial Election Between Jack Ciattarelli and Mikie Sherrill",
      "summary": "Voters in New Jersey head to the polls to elect the state's next governor in a contest between Republican Jack Ciattarelli and Democratic incumbent Mikie Sherrill. Polls are open from 6 a.m. to 8 p.m. across the state."
    }
  }
}
```

```json
{
  "data": {
    "event_uuid": "1985729017958244577",
    "filter": {
      "keyword": "mikie"
    },
    "event_type": "TrendsNew",
    "tag": "mikie trends",
    "payload": {
      "headline": "New Jersey Gubernatorial Election Between Jack Ciattarelli and Mikie Sherrill",
      "summary": "Voters in New Jersey head to the polls to elect the state's next governor in a contest between Republican Jack Ciattarelli and Democratic incumbent Mikie Sherrill. Polls are open from 6 a.m. to 8 p.m. across the state."
    }
  }
}
```

You can see there are two separate subscriptions, one on the keyword `jack` and one on `mikie`. The headline in this trend contained both keywords, so it was delivered to the webhook twice.

X does some deduplication on its end, but you can use the `event_uuid` to do deduplication at the application layer as well.

### Use Cases

Setting up a trends feed using the X Activity API is a perfect way to integrate a live news feed of events you care about into your application!
