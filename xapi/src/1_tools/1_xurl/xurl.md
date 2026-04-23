# xURL - cURL for X

`xURL` is a CLI tool specifically design for interfacing with the X API.

Some key features include:

- URL shortening
- Authentication handling
- Webhook testing via ngrok

You can check out the full project, including the README here: <a href="https://github.com/xdevplatform/xurl" target="_blank">https://github.com/xdevplatform/xurl</a>

## Quick Start

Install the tool with one curl command:

```bash
curl -fsSL https://raw.githubusercontent.com/xdevplatform/xurl/main/install.sh | sudo bash
```

Register your auth token:

```bash
xurl auth app --bearer-token YOUR_BEARER_TOKEN
```

and make requests:

```bash
xurl --auth app /2/tweets/20
```

Check out the xurl GitHub README for further tutorials. For **user** (non–app-only) requests, `xurl` selects the credential profile with **`--auth oauth2`** (OAuth 2.0 user context) or **`--auth oauth1`** (OAuth 1.0a user access), depending on how you registered tokens—not a separate `--auth user` flag.

I'll be using xurl in all sample commands in follow-on sections in this blog.
