# The X Activity API

In this chapter, we'll use the webhook we set up in the previous chapter in conjunction with X's newest real-time data suite, the X Activity API.

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

## Getting Your User ID

Before creating a subscription, we need to know our user ID. The X Activity API requires user IDs (not usernames) in the filter criteria.

Let's get our user ID using the User Lookup endpoint:

```bash
xurl --auth app /2/users/by/username/YOUR_USERNAME
```

Replace `YOUR_USERNAME` with your actual X username (without the @ symbol).

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

Copy the `id` value from the response - you'll need it for creating subscriptions.

## Creating a Subscription

Now let's create our first subscription. We'll subscribe to our own profile update events first, so we can test for an event coming through.

### Subscription Parameters

When creating a subscription, you need to specify:

- **`event_type`**: The type of event to subscribe to (required)
- **`filter`**: Criteria to filter which events to receive (required)
- **`webhook_id`**: The ID of your registered webhook where events will be delivered (optional, but required for webhook delivery)
- **`tag`**: An optional identifier for your subscription (recommended)

### Available Event Types

XAA supports several event types:
- `ProfileBioUpdate` - When a user updates their bio
- `ProfilePictureUpdate` - When a user changes their profile picture
- `ProfileBannerPictureUpdate` - When a user changes their banner
- `ProfileScreennameUpdate` - When a user changes their username
- `ProfileGeoUpdate` - When a user updates their location
- `ProfileUrlUpdate` - When a user updates their website URL

### Creating the Subscription

Let's create a subscription to monitor our own profile bio updates:

```bash
xurl --auth app /2/activity/subscriptions -X POST -d '{
  "event_type": "ProfileBioUpdate",
  "filter": {
    "user_id": "YOUR_USER_ID"
  },
  "webhook_id": "YOUR_WEBHOOK_ID",
  "tag": "my bio updates"
}'
```

### Success Response

If successful, you'll receive a response like this:

```json
{
  "data": {
    "subscription": {
      "created_at": "2025-10-07T05:31:56Z",
      "event_type": "ProfileBioUpdate",
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

## Testing Your Subscription

Once you've created the subscription, any bio updates to your own profile will be delivered to your webhook endpoint. You should see events arrive in your webhook server logs.

**To test**: Update your bio on X and watch for the event to arrive at your webhook!

### Sample Event Payload

When a profile bio update occurs, you'll receive a webhook event like this:

```json
{
  "data": {
    "filter": {
      "user_id": "YOUR_USER_ID"
    },
    "event_type": "ProfileBioUpdate",
    "tag": "my bio updates",
    "payload": {
      "before": "vox populi",
      "after": "vox dei"
    }
  }
}
```

The event includes:
- **`filter`**: The filter criteria that triggered this event
- **`event_type`**: The type of event that occurred
- **`tag`**: The tag you assigned to the subscription
- **`payload`**: The actual change data (before/after values)

You can also list your active subscriptions again to confirm:

```bash
xurl --auth app /2/activity/subscriptions
```

This will now show your active subscription in the response.

## Next Steps

Your XAA subscription is now active! Events will be delivered to your webhook as they occur. In production applications, you'll want to:

1. **Handle multiple event types** based on your use case
2. **Implement proper error handling** for failed deliveries
3. **Monitor subscription health** and revalidate when needed
4. **Clean up unused subscriptions** to avoid hitting rate limits

The X Activity API provides powerful real-time monitoring capabilities when combined with webhooks!
