# Meeting Action Items Bot

This is a sample app that demonstrates how to create a bot that extracts action items from Zoom meetings using [Recall.ai](https://recall.ai) and [OpenAI](https://platform.openai.com/docs/overview).

## Prerequisites

1. [Node.js](https://nodejs.org/en/)
2. [Ngrok](https://ngrok.com/docs/getting-started/)
3. [Recall.ai API Token](https://www.recall.ai/)
4. [OpenAI API Token](https://platform.openai.com/docs/overview)
5. [Zoom App Credentials](https://docs.recall.ai/docs/set-up-zoom)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/recallai/meeting-action-items-bot
```

## Frontend Setup

```bash
cd meeting-action-items-bot/client
```

### Install App Dependencies

```bash
npm install
```

### Configure Environment

Create a `.env` file for the frontend. All you need to do here is specify the URL of the backend server. For local development, you can just copy the `.env.example` file and rename it to `.env` if your backend is running on port 3000.

### Run the Frontend

```bash
npm run dev
```

By default, the frontend will be running on port 5173.

## Backend Setup

Create a new terminal window so that you can run the backend in a separate process. Most of the action happens on the backend, so the setup here is a little more involved.

```bash
cd meeting-action-items-bot/server
```

### Install App Dependencies

```bash
npm install
```

### Configure Environment

Create a `.env` file for the backend. There's a `.env.example` file to get you started. Also, the server is designed to check for the appropriate environment variables when it starts up and will throw an error if any are missing. Your `.env` should contain the following:

```
  RECALL_API_KEY=[recall_api_key]
  RECALL_REGION=[recall_region]
  RECALL_WEBHOOK_SECRET=[recall_webhook_secret]
  OPENAI_API_KEY=[openai_api_key]
```

If you haven't already, you'll need to sign up for a [Recall.ai account](https://www.recall.ai/) and create an API key from the [Dashboard](https://us-west-2.recall.ai/dashboard/).

> **Double Check Your `RECALL_REGION`:**
>
> Recall.ai has different subdomains for different regions.
>
> - If you're an **individual developer**, you should use the **`us-west-2`** region.
> - If you're an **enterprise on a trial with Recall.ai**, you should use the **`us-east-1`** region.

### Create Zoom App Credentials

Zoom App Credentials are used to authenticate the bot with Zoom. Recall.ai has a guide on how to set this up [here](https://docs.recall.ai/docs/set-up-zoom).

### OpenAI Setup

Sign up for an [OpenAI account](https://platform.openai.com/signup) and create an API key from the [API Keys](https://platform.openai.com/account/api-keys) page.

### Webhook Setup

Since this app uses webhooks to get the status of the bot in real time, we need a way to forward webhook requests to localhost. Ngrok is the easiest way to do this. Check out [Recall's documentation](https://docs.recall.ai/docs/local-webhook-development) to get set up. Our Express server will be running on port 3000 by default, so run the following command in a new terminal window:

```bash
ngrok http --domain {YOUR_STATIC_DOMAIN} 3000
```

Now to create `RECALL_WEBHOOK_SECRET`, head to the [Recall.ai webhook dashboard](https://us-west-2.recall.ai/dashboard/webhooks/) and click **Add Endpoint**. The endpoint URL should look like this:

```bash
{YOUR_NGROK_STATIC_DOMAIN}/webhook/status_change
```

Copy the signing secret from the webhook's page and paste it into your `.env` file.

### Run The Backend

```bash
npm run dev
```

## Try It Out

To test the bot, start a Zoom meeting in your personal meeting room and invite the bot to the meeting using your link. The bot will then ask you for permission to start recording and send you a message with your action items when the meeting has finished.

## Troubleshooting

If the bot isn't transcribing your meeting, check [this link](https://docs.recall.ai/docs/meeting-caption-transcription#troubleshooting) for some common issues with Zoom transcription.
