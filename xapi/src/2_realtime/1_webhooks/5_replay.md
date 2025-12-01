# Replaying Webhook Events

The X webhook suite allows you to replay past events that were either successfully or unsuccessfully delivered to your endpoint.

This is useful for recovering missed events due to downtime.

You can replay up to 24 hours of events (due to data retention restrictions). Note that this functionality is restricted to certain packages.

## Route

To initiate replay, you'll use a `POST` endpoint:

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/2/webhooks/replay` | Initiate a replay job |

To use this endpoint, you'll specify the following fields in the JSON body of the request:

```json
{
    "webhook_id": "<YOUR WEBHOOK ID>",
    "from_date": "YYYYMMDDHHMM",
    "to_date": "YYYYMMDDHHMM",
}
```

All fields are required. The `from_date` must be within 24 hours, and the `to_date` must be after the `from_date`. Both dates must not be in the future.

> Note: Both dates must be in UTC time

## What is delivered in replay?

Any event, regardless of product (Filtered Stream, AAA, XAA), that is delivered via webhook, either successfully or unsuccessfully, will be attempted to be re-delivered during replay.

## Example

You'll check your active webhook IDs using the `GET` endpoint:

```bash
xurl --auth app /2/webhooks
```

```json
{
  "data":[
    {
      "created_at":"2025-10-15T20:53:05.000Z",
      "id":"1146654567674912769",
      "url":"<YOUR WEBHOOK HTTPS URL>",
      "valid":true
    }
  ],
  "meta":{
    "result_count":1
  }
}
```

Then you can start a replay job for the past hour of data using your webhook ID.

Keep in mind that the `from_date` and `to_date` are in UTC. So if the time right now is 1200UTC on Dec 1, 2025 you can ask for the past hour like so:

```bash
xurl --auth app /2/webhooks/replay -X POST -d '{
  "webhook_id": "1146654567674912769",
  "from_date": "202512011100", 
  "to_date": "202512011200",
}'
```

And if successful, you'll see this response:

```json
{
  "data":{
    "job_id":"1995507200941260800",
    "created_at":"2025-12-01T12:00:07.000Z"
  }
}
```

Near instantly, you should see events start to be delivered to your webhook, if any events were attempted to be delivered in that time frame.

The events delivered as part of a replay job will have the special tag in the `meta` field:

```json
{
    "data": {
        ...
    },
    "meta": {
        "replay": true
    }
}
```

This allows your app to differentiate when an event is from replay vs first-time delivery, since normal events may be delivered at the same time that replay events are coming through.

## Replay job completion

When the replay job completes, you'll see the following event be delivered to your webhook:

```json
{
    "replay_job_status": {
        "webhook_id":"1146654567674912769",
        "job_state": "Complete",
        "job_state_description": "Job completed successfully",
        "job_id": "1995507200941260800"
    }
}
```

> **Note**: The replay completion event may arrive out-of-order due to real-world network latencies between X's proxies that distribute events.
