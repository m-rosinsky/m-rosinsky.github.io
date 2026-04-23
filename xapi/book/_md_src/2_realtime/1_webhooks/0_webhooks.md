# Using Webhooks with the X Developer API

> ☎️ Don't call us, we'll call you!

## What's a Webhook?

Webhooks are an efficient way to receive real-time data from the X Developer API. It's an industry standard practice, and a growing number of X's products currently support webhooks.

Instead of polling the API servers to check if any new data is available on a regular interval, the API will reach out to you automatically!

You register your server's callback URL with X, and when new data becomes available that matches your criteria, the API will reach out to your server, deliver the event, and disconnect.

This is all secured using industry standard encryption, making it an ideal choice for efficient, event-driven data delivery.

A growing number of X's real-time products support webhook delivery. These products include:

- Filtered Stream
- Account Activity API
- X Activity API
