'use client';

import { useEffect, useState } from 'react';
import { Opportunity } from '@/lib/criptoya';

export default function Home() {
  const [coin, setCoin] = useState('USDT');
  const [fiat, setFiat] = useState('ARS');
  const [volume, setVolume] = useState(100);
  const [minPct, setMinPct] = useState(0.4);
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const scan = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/scan?coin=${coin}&fiat=${fiat}&volume=${volume}&minPct=${minPct}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Scan failed');
      setOpps(data.opportunities || []);
      setLastUpdate(new Date());
    } catch (e: any) {
      setError(e.message);
      setOpps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scan();
    const id = setInterval(scan, 45000);
    return () => clearInterval(id);
  }, [coin, fiat, volume, minPct]);

  return (
    <main className="max-w-7xl mx-auto p-4 md:p-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-arb-green to-emerald-400 bg-clip-text text-transparent">
            OmniArb
          </h1>
          <p className="text-slate-400 mt-1">CriptoYa-powered arbitrage engine · LatAm CEX spreads · Omnichaín ready</p>
        </div>
        <div className="text-sm text-slate-500">
          {lastUpdate ? `Updated ${lastUpdate.toLocaleTimeString()}` : 'Scanning...'}
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 bg-arb-card/60 backdrop-blur border border-white/10 rounded-2xl p-4">
        <label className="flex flex-col text-xs uppercase tracking-wider text-slate-400">
          Coin
          <input value={coin} onChange={e => setCoin(e.target.value.toUpperCase())} className="mt-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white" />
        </label>
        <label className="flex flex-col text-xs uppercase tracking-wider text-slate-400">
          Fiat
          <input value={fiat} onChange={e => setFiat(e.target.value.toUpperCase())} className="mt-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white" />
        </label>
        <label className="flex flex-col text-xs uppercase tracking-wider text-slate-400">
          Volume
          <input type="number" value={volume} onChange={e => setVolume(Number(e.target.value))} className="mt-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white" />
        </label>
        <label className="flex flex-col text-xs uppercase tracking-wider text-slate-400">
          Min Profit %
          <input type="number" step="0.1" value={minPct} onChange={e => setMinPct(Number(e.target.value))} className="mt-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white" />
        </label>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300">{error}</div>}

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-arb-card/40">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400 border-b border-white/10">
            <tr>
              <th className="p-3">Buy</th>
              <th className="p-3">Sell</th>
              <th className="p-3 text-right">Buy Price</th>
              <th className="p-3 text-right">Sell Price</th>
              <th className="p-3 text-right">Profit %</th>
              <th className="p-3 text-right">Est. Net</th>
            </tr>
          </thead>
          <tbody>
            {loading && opps.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-slate-500">Scanning CriptoYa feeds…</td></tr>
            )}
            {opps.map((o, i) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-3 font-medium">{o.buyExchange}</td>
                <td className="p-3 font-medium">{o.sellExchange}</td>
                <td className="p-3 text-right">{o.buyPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                <td className="p-3 text-right">{o.sellPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                <td className="p-3 text-right font-bold text-arb-green">{o.profitPercent}%</td>
                <td className="p-3 text-right">{o.netProfitEst.toLocaleString(undefined, { maximumFractionDigits: 0 })} {o.fiat}</td>
              </tr>
            ))}
            {!loading && opps.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-slate-500">No opportunities above threshold. Try lower min % or different pair.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <section className="mt-10 grid md:grid-cols-3 gap-4 text-sm">
        <div className="p-4 rounded-2xl bg-arb-card/50 border border-white/10">
          <h3 className="font-semibold text-arb-green mb-2">Detection</h3>
          <p className="text-slate-400">Polls CriptoYa aggregated endpoint every ~45s. Compares totalAsk vs totalBid across all listed exchanges after basic fee buffer.</p>
        </div>
        <div className="p-4 rounded-2xl bg-arb-card/50 border border-white/10">
          <h3 className="font-semibold text-arb-green mb-2">Omnichaín Path</h3>
          <p className="text-slate-400">Architecture ready for LayerZero / CCTP settlement. Buy on one CEX, bridge USDT, sell on another. Contracts in /contracts for settlement vault demo.</p>
        </div>
        <div className="p-4 rounded-2xl bg-arb-card/50 border border-white/10">
          <h3 className="font-semibold text-arb-green mb-2">Next</h3>
          <p className="text-slate-400">AI scoring, wallet connect, one-click execution simulation, funding-rate overlay, and real bridge cost integration.</p>
        </div>
      </section>
    </main>
  );
}
