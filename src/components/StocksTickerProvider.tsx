import { ReactNode } from 'react';
import { StocksBar } from './StocksBar';
import { MobileStocksStrip } from './MobileStocksStrip';
import { useTickers } from '@/hooks/useTickers';

interface StocksTickerProviderProps {
  children: ReactNode;
  viewType: 'mobile' | 'desktop';
  pollMs?: number;
}

export function StocksTickerProvider({ children, viewType, pollMs = 60000 }: StocksTickerProviderProps) {
  const { tickers, loading, error } = useTickers({ pollMs });

  // On loading or error, still render with empty tickers to maintain layout
  const tickersToRender = loading || error ? [] : tickers;

  return (
    <div aria-live="polite">
      {viewType === 'desktop' ? (
        <StocksBar tickers={tickersToRender} />
      ) : (
        <MobileStocksStrip tickers={tickersToRender} />
      )}
      {children}
    </div>
  );
}