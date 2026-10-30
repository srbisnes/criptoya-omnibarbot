import { NextRequest, NextResponse } from 'next/server';
import { fetchAggregated, findOpportunities } from '@/lib/criptoya';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const coin = searchParams.get('coin') || 'USDT';
  const fiat = searchParams.get('fiat') || 'ARS';
  const volume = Number(searchParams.get('volume') || 100);
  const minPct = Number(searchParams.get('minPct') || 0.4);

  try {
    const quotes = await fetchAggregated(coin, fiat, volume);
    const opportunities = findOpportunities(quotes, volume, coin, fiat, minPct);
    return NextResponse.json({
      coin,
      fiat,
      volume,
      exchangeCount: Object.keys(quotes).length,
      opportunities,
      scannedAt: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to scan' }, { status: 500 });
  }
}
