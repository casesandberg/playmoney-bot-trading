// See documentation here: https://api.playmoney.dev/

const PLAYMONEY_API_BASE_URL = "https://api.playmoney.dev/v1";
const PLAYMONEY_API_KEY = process.env.PLAYMONEY_API_KEY;

type Market = {
  id: string;
  question: string;
  description: string;
  slug: string;
  closeDate?: string;
  resolvedAt?: string;
  canceledAt?: string;
  canceledById?: string;
  createdBy: string;
  tags: string[];
  ammAccountId: string;
  clearingAccountId: string;
  commentCount: number;
  uniqueTradersCount?: number;
  uniquePromotersCount?: number;
  liquidityCount?: number;
  parentListId?: string;
  createdAt: string;
  updatedAt: string;
};

type ExtendedMarket = Market & {
  user: User;
  options: MarketOption[];
};

type MarketOption = {
  id: string;
  name: string;
  marketId: string;
  color: string;
  liquidityProbability: number;
  probability: number;
  createdAt: string;
  updatedAt: string;
};

type User = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  twitterHandle?: string;
  discordHandle?: string;
  website?: string;
  bio?: string;
  timezone: string;
  primaryAccountId: string;
  referralCode?: string;
  referredBy?: string;
  createdAt: string;
  updatedAt: string;
};

type MarketQuote = {
  newProbability: number;
  potentialReturn: number;
};

if (!PLAYMONEY_API_KEY) {
  throw new Error("PLAYMONEY_API_KEY environment variable is not set");
}

const headers = {
  "Content-Type": "application/json",
  "x-api-key": PLAYMONEY_API_KEY,
};

async function handlePlayMoneyResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(`PlayMoney API error: ${data.error}`);
  }

  return data.data;
}

export async function getMarkets({
  status = "active",
  limit = 50,
}: {
  status: "active" | "closed" | "all";
  limit: number;
}): Promise<Array<Market>> {
  const response = await fetch(
    `${PLAYMONEY_API_BASE_URL}/markets?status=${status}&limit=${limit}`
  );
  return handlePlayMoneyResponse(response);
}

export async function getMarket({
  id,
  extended = false,
}: {
  id: string;
  extended: boolean;
}): Promise<ExtendedMarket> {
  const response = await fetch(
    `${PLAYMONEY_API_BASE_URL}/markets/${id}?extended=${extended}`
  );
  return handlePlayMoneyResponse(response);
}

export async function createMarketQuote({
  id,
  optionId,
  amount,
  isBuy,
}: {
  id: string;
  optionId: string;
  amount: number;
  isBuy: boolean;
}): Promise<MarketQuote> {
  const response = await fetch(
    `${PLAYMONEY_API_BASE_URL}/markets/${id}/quote`,
    {
      method: "POST",
      body: JSON.stringify({ optionId, amount, isBuy }),
    }
  );
  return handlePlayMoneyResponse(response);
}

export async function createMarketBuy({
  id,
  optionId,
  amount,
}: {
  id: string;
  optionId: string;
  amount: number;
}): Promise<{ success: boolean }> {
  const response = await fetch(`${PLAYMONEY_API_BASE_URL}/markets/${id}/buy`, {
    method: "POST",
    headers,
    body: JSON.stringify({ optionId, amount }),
  });
  return handlePlayMoneyResponse(response);
}
