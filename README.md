# PlayMoney Bot - Trading Example

This repository demonstrates how to build a simple automated trading bot for [PlayMoney](https://playmoney.dev/). The bot showcases basic interaction with the PlayMoney API by making random bets on active markets.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcasesandberg%2Fplaymoney-bot-trading)

## How It Works

The bot runs on a cron schedule and performs the following steps:

1. **Fetch Active Markets**: Gets a list of 50 recent markets on PlayMoney and picks a random one

2. **Trading Logic**: Define custom trading logic. In this example, we're just picking a random option and betting on it.

3. **Get Quote & Place Bet**: Places a ¤25 bet

## Setup

1. Clone this repository

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with your API key:

```
PLAYMONEY_API_KEY=your_api_key
```

4. Deploy to Vercel:
   - Add the environment variables in your Vercel project settings
   - Set up a cron job to hit the `/api/cron` endpoint (recommended: every 6 hours)

## API Documentation

- PlayMoney API: [api.playmoney.dev](https://api.playmoney.dev)

## Contributing

Feel free to open issues or submit pull requests if you have suggestions for improvements!
