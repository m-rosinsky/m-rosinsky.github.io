# Standing up a Temporary Webhook using xURL

> **Note**: This section assumes you have the `xurl` CLI tool set up. If you haven't installed and configured `xurl` yet, check out the [xURL section](../../1_tools/1_xurl/xurl.md) first.

If you're looking for a quick and easy way to stand up a webhook to use with the X API, the xURL tool offers this functionality.

The xURL webhook abstracts away the need to write your own handlers for the GET and POST requests that X sends to your server. If you're looking for that logic to incorporate into your production app, check out the next section where we write a Python Flask app.

## Quick Start

## Prerequisites

What you'll need:
- The xURL CLI tool (already installed and configured)
- A free (or higher) account with `ngrok.com`
- Your ngrok auth token

## Setup Steps

### 1. Register Your OAuth1 Keys

First, ensure your OAuth1 keys are registered with xurl:

```bash
xurl auth oauth1
```

You'll need to provide your consumer key and secret, and access key and secret. Generate these from the [X Developer Portal](https://developer.x.com).

### 2. Start the Webhook Server

Run the xURL webhook command:

```bash
xurl webhook start
```

You'll be prompted for your ngrok auth token so that xURL can create a temporary HTTPS endpoint:

```
Starting webhook server with ngrok...
Enter your ngrok authtoken (leave empty to try NGROK_AUTHTOKEN env var):
```

Once you've entered your auth token, your endpoint will be generated and you'll see output like this:

```
Configuring ngrok to forward to local port: 8080
Ngrok tunnel established!
  Forwarding URL: https://d1cb5181df5c.ngrok.app -> localhost:8080
Use this URL for your X API webhook registration: https://d1cb5181df5c.ngrok.app/webhook
Starting local HTTP server to handle requests from ngrok tunnel (forwarded from https://d1cb5181df5c.ngrok.app)...
```

## Using Your Webhook

Leave the terminal window running - any webhook events, including the security check, will be displayed in that window.

**To stop the webhook server**: Press `Ctrl+C` in the terminal.

You can now use the generated URL (ending in `/webhook`) to register a webhook with the X API. See the next section for a tutorial on webhook registration.
