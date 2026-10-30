import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OmniArb | CriptoYa Arbitrage Engine',
  description: 'AI-ready omnichaín arbitrage scanner powered by CriptoYa real-time data. LatAm CEX spreads + cross-chain settlement ready.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="bg-arb-dark text-white min-h-screen antialiased">{children}</body>
    </html>
  );
}
