import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Ticker } from '../types';

interface StocksBarProps {
  tickers: Ticker[];
  /** Scrolling speed in pixels per second */
  pxPerSecond?: number;
}

export function StocksBar({ tickers, pxPerSecond = 80 }: StocksBarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(30);

  const items = useMemo(() => tickers ?? [], [tickers]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const first = el.querySelector<HTMLDivElement>('[data-marquee-copy="1"]');
    if (!first) return;

    const totalWidth = first.scrollWidth;
    const seconds = Math.max(15, Math.round((totalWidth / pxPerSecond) * 10) / 10);
    setDuration(seconds);
  }, [items, pxPerSecond]);

  const getTrendIcon = (t: Ticker) => {
    if (t.direction === 'up') return <TrendingUp className="h-3 w-3 text-success" />;
    if (t.direction === 'down') return <TrendingDown className="h-3 w-3 text-destructive" />;
    return <Minus className="h-3 w-3 text-warning" />;
  };

  const getTrendColor = (t: Ticker) => {
    if (t.direction === 'up') return 'text-success';
    if (t.direction === 'down') return 'text-destructive';
    return 'text-warning';
  };

  const renderTickers = (ariaHidden = false) => (
    <div
      data-marquee-copy={ariaHidden ? '2' : '1'}
      className="flex items-center h-full gap-8 shrink-0 pr-8"
      aria-hidden={ariaHidden}
    >
      {items.map((ticker) => (
        <button
          key={`${ariaHidden ? 'dup-' : ''}${ticker.symbol}`}
          className="flex items-center gap-2 text-sm hover:underline transition-all duration-150"
          aria-label={`${ticker.symbol}: ${ticker.value}, ${ticker.delta}`}
        >
          <span className="font-semibold text-xs uppercase tracking-wide leading-none">
            {ticker.symbol}
          </span>
          <span className="font-mono text-sm leading-none">
            {ticker.value}
          </span>
          <div className={`flex items-center gap-1 ${getTrendColor(ticker)}`}>
            {getTrendIcon(ticker)}
            <span className="font-mono text-xs leading-none">
              {ticker.delta}
            </span>
          </div>
        </button>
      ))}
    </div>
  );

  if (!items.length) return null;

  return (
    <div className="stocks-bar border-t border-b border-border">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="group relative h-12 overflow-hidden flex items-center" aria-live="off">
          <div
            ref={trackRef}
            className="flex h-full items-center animate-marquee will-change-transform"
            style={{ animationDuration: `${duration}s` } as React.CSSProperties}
          >
            {renderTickers(false)}
            {renderTickers(true)}
          </div>

          <style>{`
            .animate-marquee { animation: marquee linear infinite; }
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee:hover { animation-play-state: paused; }
            @media (prefers-reduced-motion: reduce) {
              .animate-marquee { animation: none !important; }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}