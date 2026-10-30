export const CRIPTOYA_BASE = process.env.CRIPTOYA_BASE_URL || 'https://criptoya.com/api';

export interface Quote {
  ask: number;
  totalAsk: number;
  bid: number;
  totalBid: number;
  time: number;
}

export interface AggregatedQuotes {
  [exchange: string]: Quote;
}

export interface Opportunity {
  buyExchange: string;
  sellExchange: string;
  buyPrice: number;
  sellPrice: number;
  volume: number;
  grossProfit: number;
  profitPercent: number;
  netProfitEst: number;
  timestamp: number;
  coin: string;
  fiat: string;
}

export async function fetchAggregated(coin: string, fiat: string, volume: number): Promise<AggregatedQuotes> {
  const url = `${CRIPTOYA_BASE}/${coin}/${fiat}/${volume}`;
  const res = await fetch(url, { next: { revalidate: 30 } });
  if (!res.ok) throw new Error(`CriptoYa error: ${res.status}`);
  const text = await res.text();
  if (text.includes('Invalid') || !text.startsWith('{')) {
    throw new Error('Invalid pair or empty response');
  }
  return JSON.parse(text);
}

export function findOpportunities(
  quotes: AggregatedQuotes,
  volume: number,
  coin: string,
  fiat: string,
  minPercent = 0.3
): Opportunity[] {
  const entries = Object.entries(quotes).filter(([, q]) => q.totalAsk > 0 && q.totalBid > 0);
  const opps: Opportunity[] = [];

  for (const [buyEx, buyQ] of entries) {
    for (const [sellEx, sellQ] of entries) {
      if (buyEx === sellEx) continue;
      const buyPrice = buyQ.totalAsk;
      const sellPrice = sellQ.totalBid;
      if (sellPrice <= buyPrice) continue;

      const cost = buyPrice * volume;
      const proceeds = sellPrice * volume;
      const gross = proceeds - cost;
      const percent = (gross / cost) * 100;

      if (percent >= minPercent) {
        const feeBuffer = cost * 0.002 + proceeds * 0.001;
        const net = gross - feeBuffer;
        opps.push({
          buyExchange: buyEx,
          sellExchange: sellEx,
          buyPrice,
          sellPrice,
          volume,
          grossProfit: Number(gross.toFixed(2)),
          profitPercent: Number(percent.toFixed(3)),
          netProfitEst: Number(net.toFixed(2)),
          timestamp: Math.max(buyQ.time, sellQ.time),
          coin,
          fiat,
        });
      }
    }
  }

  return opps.sort((a, b) => b.profitPercent - a.profitPercent).slice(0, 25);
}
