import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Ticker {
  symbol: string;
  value: string;
  delta: string;
  direction: 'up' | 'down' | 'flat';
}

interface MobileStocksStripProps {
  tickers: Ticker[];
}

export function MobileStocksStrip({ tickers }: MobileStocksStripProps) {
  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '→';
    }
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up':
        return 'text-green-600 dark:text-green-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-stocks-bg border-y border-border h-12 overflow-x-auto scrollbar-none" aria-live="polite">
      <div className="flex items-center h-full px-4 gap-6 min-w-max">
        {tickers.map((ticker, index) => (
          <button
            key={index}
            className="flex items-center justify-center min-w-[80px] min-h-[44px] px-3 py-2 hover:bg-hover-bg transition-all duration-150 rounded-sm group"
            aria-label={`${ticker.symbol}, value ${ticker.value}, change ${ticker.delta}`}
          >
            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-wide text-foreground truncate leading-tight group-hover:underline sm:text-[13px]">
                {ticker.symbol}
              </div>
              <div className="flex items-center justify-center gap-1 text-xs sm:text-[13px] mt-[2px] leading-none whitespace-nowrap">
                <span className="font-mono text-foreground">
                  {ticker.value}
                </span>
                <span className="text-muted-foreground">—</span>
                <span className={`font-mono ${getTrendColor(ticker.direction)}`}>
                  {ticker.delta} {getTrendIcon(ticker.direction)}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}