import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Ticker } from '../types';

interface StocksBarProps {
  tickers: Ticker[];
}

export function StocksBar({ tickers }: StocksBarProps) {
  const getTrendIcon = (ticker: Ticker) => {
    if (ticker.isUp) return <TrendingUp className="h-3 w-3 text-success" />;
    if (ticker.isDown) return <TrendingDown className="h-3 w-3 text-destructive" />;
    return <Minus className="h-3 w-3 text-warning" />;
  };

  const getTrendColor = (ticker: Ticker) => {
    if (ticker.isUp) return 'text-success';
    if (ticker.isDown) return 'text-destructive';
    return 'text-warning';
  };

  return (
    <div className="stocks-bar border-t border-b border-border">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center h-12 overflow-x-auto scrollbar-none">
          <div className="flex items-center space-x-8 min-w-max">
            {tickers.map((ticker) => (
              <button
                key={ticker.symbol}
                className="flex items-center space-x-2 text-sm hover:underline transition-all duration-150"
                aria-label={`${ticker.symbol}: ${ticker.value}, ${ticker.delta}`}
              >
                <span className="font-semibold text-xs uppercase tracking-wide">
                  {ticker.symbol}
                </span>
                <span className="font-mono text-sm">
                  {ticker.value}
                </span>
                <div className={`flex items-center space-x-1 ${getTrendColor(ticker)}`}>
                  {getTrendIcon(ticker)}
                  <span className="font-mono text-xs">
                    {ticker.delta}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}