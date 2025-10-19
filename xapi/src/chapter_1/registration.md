# Registering a Webhook With X

Registering a webhook involves passing the HTTPS URL for your webhook app to X's servers, so they know where to send events to.

The official docs are here: https://docs.x.com/x-api/webhooks/introduction

## Routes

The X API offers the following endpoints to manage your registered webhooks:

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/2/webhooks`| List all registered webhooks for your account |
| `POST` | `/2/webhooks` | Create a webhook (see below for JSON body) |
| `DELETE` | `/2/webhooks/:webhook_id` | Delete a webhook by ID |
| `PUT` | `/2/webhooks/:webhook_id` | Manually trigger a security check to re-validate a webhook |

## Register a Webhook

To register the webhook, you'll use the `POST` route, along with the following JSON body:

```json
{
    "url": "<YOUR WEBHOOK HTTPS URL>"
}
```

We can use `curl` to test this:

```bash
curl https://api.x.com/2/webhooks -X POST -d '{"url": "<YOUR WEBHOOK HTTPS URL>"}'
```

When this request is sent, X will send a `GET` request to the provided URL to validate that the webhook belongs to you.

This is the security check we demonstrated in the last section.

On successful validation, the webhook will be created:

```json
"data": {
  "created_at": "2025-10-15T20:53:05.000Z",
  "id": "1146654567674912769",
  "url": "<YOUR WEBHOOK HTTPS URL>",
  "valid": true
}
```

## List your Webhooks

Now we can call the `GET` route to see our registered webhooks:

```bash
curl https://api.x.com/2/webhooks
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

## Re-validating your webhook

At regular intervals (~24hrs), X will attempt to validate that your webhook is still operational.

X does this by sending the `GET` CRC check again.

If for some reason this validation fails, the webhook will be marked as `"valid":false` and will no longer receive events.

To re-validate the webhook, you can call the `PUT` request, which will manually trigger the re-validation process:

```bash
curl https://api.x.com/2/webhooks/1146654567674912769 -X PUT 
```

Providing the validation was successful, our webhook will be re-validated:

```json
{
  "data":{
    "valid":true
  }
}
```
