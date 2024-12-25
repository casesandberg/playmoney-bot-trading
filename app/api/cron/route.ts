import { NextResponse } from "next/server";
import {
  createMarketQuote,
  getMarket,
  getMarkets,
  createMarketBuy,
} from "../../lib/playmoney";

/**
 * This endpoint runs on a schedule and performs automated trading on PlayMoney markets.
 * Current strategy: Randomly selects an active market and makes a small bet on a random option.
 *
 * @returns NextResponse with success/failure status
 */
export async function GET() {
  try {
    // Step 1: Get a list of active markets and pick a random one
    const markets = await getMarkets({ status: "active", limit: 50 });
    const randomMarket = markets[Math.floor(Math.random() * markets.length)];

    // Step 2: Fetch detailed market data
    // The 'extended: true' parameter gives us additional information including all options
    const market = await getMarket({ id: randomMarket.id, extended: true });

    // Step 3: This is where you will add logic to decide which option to pick
    const randomOption =
      market.options[Math.floor(Math.random() * market.options.length)];
    const betAmount = 25;

    // Step 4: Get a quote to see what our bet would look like
    const quote = await createMarketQuote({
      id: market.id,
      optionId: randomOption.id,
      amount: betAmount,
      isBuy: true,
    });

    console.log(
      `Market: "${market.question}"\n` +
        `Betting: ¤${betAmount} on "${randomOption.name}"\n` +
        `Expected shares: ${quote.potentialReturn.toFixed(2)}\n` +
        `New probability: ${quote.newProbability}%`
    );

    // Step 5: Execute the bet
    await createMarketBuy({
      id: market.id,
      optionId: randomOption.id,
      amount: betAmount,
    });

    return NextResponse.json({
      success: true,
      details: {
        marketQuestion: market.question,
        optionSelected: randomOption.name,
        betAmount: betAmount,
      },
    });
  } catch (error) {
    console.error("Error in trading bot:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred during automated trading" },
      { status: 500 }
    );
  }
}
