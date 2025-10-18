# Writing a Basic Webhook App

In this section, we'll write a basic app to get started with receiving webhook events from X.

Here's the requests that the app will need to handle:
- `GET` requests for security challenge checks
- `POST` requests for receiving events

After we make the app, we'll need to host it with a public-facing HTTPS URL. I'll show you some options for quick, free methods for getting this stood up quickly so you can test.

## The Basic App

Let's start with a basic skeleton for our webhook app. We'll build it incrementally, adding features step by step.

```python
from flask import Flask
from waitress import serve

HOST = "0.0.0.0"
PORT = 8080

app = Flask(__name__)

@app.route('/webhooks', methods=['GET', 'POST'])
def webhook_request():

    if request.method == 'GET':
        # Stub - we'll implement the security check here
        print("Got GET request")
        return '', 200

    elif request.method == 'POST':
        # Stub - we'll implement webhook event handling here
        print("Got POST request")
        return '', 200

    # Got an invalid method
    return 'Method Not Allowed', 405

def main():
    print(f"Hosting WSGI server on {HOST}:{PORT}")
    serve(app, host=HOST, port=PORT)

if __name__=='__main__':
    main()
```

This gives us a basic Flask app with stub endpoints for both GET and POST requests. Now let's implement each part step by step.

## Implementing the Security Check (GET Request)

X uses a Challenge-Response Check (CRC) to verify that your webhook endpoint is legitimate and secure. When you register a webhook URL, X will send a GET request with a `crc_token` parameter. Your app must respond with an HMAC SHA-256 hash of that token using your consumer secret.

### Getting Your Consumer Secret

To get your consumer secret, go to your X Developer Portal and navigate to your app's settings. You'll find the Consumer Keys section where you can view and regenerate your API keys:

![Finding your consumer secret in the X Developer Portal](../../../assets/keys.png)

Copy the "API Key Secret" (also called Consumer Secret) and set it as an environment variable before running your app.

### Why This Matters

The CRC check ensures that:
- Your endpoint is accessible and responding
- Only you (with your consumer secret) can validate the webhook
- The connection between X and your server is secure

### Implementation

First, let's add the necessary imports and environment variable setup:

```python
from flask import Flask, request, jsonify
from waitress import serve

import base64
import hashlib
import hmac
import os
import json
import sys

app = Flask(__name__)

# Your Twitter consumer secret - set this as an environment variable
CONSUMER_SECRET = os.environ.get("CONSUMER_SECRET")
if CONSUMER_SECRET is None:
  print("Missing consumer secret. Ensure CONSUMER_SECRET env var is set.")
  sys.exit(1)

HOST = "0.0.0.0"
PORT = 8080
```

Now let's implement the GET request handler:

```python
@app.route('/webhooks', methods=['GET', 'POST'])
def webhook_request():
    # Handle GET request (CRC challenge)
    if request.method == 'GET':
        crc_token = request.args.get('crc_token')
        print(f"CRC Token received: {crc_token}")

        if crc_token is None:
            print("Error: No crc_token found in the request.")
            return json.dumps({'error': 'No crc_token'})

        # Creates HMAC SHA-256 hash from incoming token and your consumer secret
        sha256_hash_digest = hmac.new(
            CONSUMER_SECRET.encode('utf-8'),
            msg=crc_token.encode('utf-8'),
            digestmod=hashlib.sha256
        ).digest()

        # Construct response data with base64 encoded hash
        response = {
            'response_token': 'sha256=' + base64.b64encode(sha256_hash_digest).decode('utf-8')
        }

        # Returns properly formatted json response
        return jsonify(response)

    elif request.method == 'POST':
        # Stub - we'll implement webhook event handling here
        print("Got POST request")
        return 'Not implemented yet', 501

    # Got an invalid method
    return 'Method Not Allowed', 405
```

### How the CRC Check Works

1. **X sends a challenge**: GET request with `crc_token` parameter
2. **You create an HMAC hash**: Using SHA-256 with your consumer secret and the token
3. **You respond**: With `{"response_token": "sha256=<base64_hash>"}`
4. **X verifies**: Compares your hash with what they expect

## Implementing Webhook Events (POST Request)

Now let's implement the POST request handler to receive actual webhook events from X.

Replace the POST stub with this implementation:

```python
@app.route('/webhooks', methods=['GET', 'POST'])
def webhook_request():
    # Handle GET request (CRC challenge)
    if request.method == 'GET':
        # Truncated...

    # Handle POST request (Webhook event)
    elif request.method == 'POST':

        # Use the json library to render and dump the data.
        event_data = request.get_json()
        if event_data:
            print(json.dumps(event_data, indent=2))
        else:
            # Log if the request body wasn't JSON or was empty
            print(f"Body: {request.data.decode('utf-8')}")

        # Return 200 OK to acknowledge receipt
        return '', 200

    # Got an invalid method
    return 'Method Not Allowed', 405
```

### Processing Events

The POST handler:
1. **Parses the JSON payload** from the request body
2. **Logs the event data** for debugging and processing
3. **Returns 200 OK** to acknowledge successful receipt
4. **Handles edge cases** like non-JSON payloads

## Running the Complete App

Now that we have both GET and POST implemented, let's add a proper main function:

```python
def main():
    print("--- Starting Webhook App ---")
    print(f"Using CONSUMER_SECRET from environment variable.")
    print(f"Running with Waitress WSGI server on {HOST}:{PORT}")
    serve(app, host=HOST, port=PORT)

if __name__ == '__main__':
    main()
```

To run the app:

1. Set your consumer secret:
   ```bash
   export CONSUMER_SECRET="your_consumer_secret_here"
   ```

2. Run the app:
   ```bash
   python sample_app.py
   ```

## Next Steps

Your webhook app is now complete! To use it:

1. **Host it publicly** with HTTPS (required for webhooks)
2. **Register the URL** in your X Developer Portal
3. **Configure your webhook** to listen for specific events
4. **Test with real events** as they occur

The app will now properly handle both the security challenge and incoming webhook events from X.

## The Complete Code

Here's the complete, working webhook app that combines everything we've built:

```python
from flask import Flask, request, jsonify
from waitress import serve

import base64
import hashlib
import hmac
import os
import json
import sys

app = Flask(__name__)

# Your Twitter consumer secret - set this as an environment variable
TWITTER_CONSUMER_SECRET = os.environ.get("TWITTER_CONSUMER_SECRET")
if TWITTER_CONSUMER_SECRET is None:
  print("Missing consumer secret. Ensure TWITTER_CONSUMER_SECRET env var is set.")
  sys.exit(1)

HOST = "0.0.0.0"
PORT = 8080

@app.route('/webhooks/twitter', methods=['GET', 'POST'])
def webhook_request():
    # Handle GET request (CRC challenge)
    if request.method == 'GET':

        crc_token = request.args.get('crc_token')
        print(f"CRC Token received: {crc_token}")

        if crc_token is None:
            print("Error: No crc_token found in the request.")
            return json.dumps({'error': 'No crc_token'})

        # Creates HMAC SHA-256 hash from incoming token and your consumer secret
        sha256_hash_digest = hmac.new(
            TWITTER_CONSUMER_SECRET.encode('utf-8'),
            msg=crc_token.encode('utf-8'),
            digestmod=hashlib.sha256
        ).digest()

        # Construct response data with base64 encoded hash
        response = {
            'response_token': 'sha256=' + base64.b64encode(sha256_hash_digest).decode('utf-8')
        }

        # Returns properly formatted json response
        return jsonify(response)

    # Handle POST request (Webhook event)
    elif request.method == 'POST':

        event_data = request.get_json()
        if event_data:
            print(json.dumps(event_data, indent=2))
        else:
            # Log if the request body wasn't JSON or was empty
            print(f"Body: {request.data.decode('utf-8')}")

        # Return 200 OK to acknowledge receipt
        return '', 200

    # Got an invalid method
    return 'Method Not Allowed', 405

def main():
    print("--- Starting Webhook App ---")
    print(f"Using TWITTER_CONSUMER_SECRET from environment variable.")
    print(f"Running with Waitress WSGI server on {HOST}:{PORT}")
    serve(app, host=HOST, port=PORT)

if __name__ == '__main__':
    main()
```
