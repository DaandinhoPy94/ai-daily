import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Ticker } from '@/types';

interface MobileStocksStripProps {
  tickers: Ticker[];
  /** pixels per seconde */
  pxPerSecond?: number;
}

export function MobileStocksStrip({ tickers, pxPerSecond = 80 }: MobileStocksStripProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(30);
  const items = useMemo(() => tickers ?? [], [tickers]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.querySelector<HTMLDivElement>('[data-marquee-copy="1"]');
    if (!first) return;
    const totalWidth = first.scrollWidth;
    const seconds = Math.max(12, Math.round((totalWidth / pxPerSecond) * 10) / 10);
    setDuration(seconds);
  }, [items, pxPerSecond]);

  const getTrendIcon = (direction: string) => {
    if (direction === 'up') return '↑';
    if (direction === 'down') return '↓';
    return '→';
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

  const renderTickers = (ariaHidden = false) => (
    <div
      data-marquee-copy={ariaHidden ? '2' : '1'}
      className="flex items-center h-full gap-6 shrink-0 pr-6"
      aria-hidden={ariaHidden}
    >
      {items.map((ticker, index) => (
        <button
          key={`${ariaHidden ? 'dup-' : ''}${ticker.symbol}-${index}`}
          className="flex items-center justify-center min-w-[80px] min-h-[44px] px-3 py-2 hover:bg-hover-bg transition-all duration-150 rounded-sm group"
          aria-label={`${ticker.symbol}, value ${ticker.value}, change ${ticker.delta}`}
        >
          <div className="text-center">
            <div className="text-xs font-semibold uppercase tracking-wide text-foreground truncate leading-none sm:text-[13px]">
              {ticker.symbol}
            </div>
            <div className="flex items-center justify-center gap-1 text-xs sm:text-[13px] mt-[2px] leading-none whitespace-nowrap">
              <span className="font-mono text-foreground">{ticker.value}</span>
              <span className="text-muted-foreground">—</span>
              <span className={`font-mono ${getTrendColor(ticker.direction)}`}>
                {ticker.delta} {getTrendIcon(ticker.direction)}
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );

  if (!items.length) return null;

  return (
    <div className="bg-stocks-bg border-y border-border h-12 overflow-hidden flex items-center" aria-live="off">
      <div
        ref={trackRef}
        className="flex h-full items-center animate-marquee will-change-transform"
        style={{ animationDuration: `${duration}s` } as React.CSSProperties}
      >
        {renderTickers(false)}
        {renderTickers(true)}
      </div>

      {/* Minimal CSS for marquee */}
      <style>{`
        .animate-marquee { animation: marquee linear infinite; }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        /* Hover-pauze (heeft geen effect op mobiel, wel op desktop simulators) */
        .animate-marquee:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
