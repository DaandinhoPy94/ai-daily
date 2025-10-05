import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Ticker {
  symbol: string;
  value: string;
  delta: string;
  direction: 'up' | 'down' | 'flat';
}

interface StockContextType {
  tickers: Ticker[];
  loading: boolean;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

interface StockProviderProps {
  children: React.ReactNode;
}

export function StockProvider({ children }: StockProviderProps) {
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [loading, setLoading] = useState(true);

  const transformTicker = (dbTicker: any): Ticker => {
    const latestValue = parseFloat(dbTicker.latest_value?.toString() || '0');
    const prevValue = parseFloat(dbTicker.prev_value?.toString() || '0');

    let direction: 'up' | 'down' | 'flat' = 'flat';
    let delta = '-';

    if (prevValue !== null && prevValue !== 0) {
      const percentChange = ((latestValue - prevValue) / prevValue) * 100;

      if (percentChange > 0) {
        direction = 'up';
        delta = `+${percentChange.toFixed(2)}%`;
      } else if (percentChange < 0) {
        direction = 'down';
        delta = `${percentChange.toFixed(2)}%`;
      } else {
        direction = 'flat';
        delta = '0.00%';
      }
    }

    return {
      symbol: dbTicker.symbol,
      value: `$${latestValue.toFixed(2)}`,
      delta,
      direction,
    };
  };

  const fetchTickers = async () => {
    try {
      const { data, error } = await supabase
        .from('ticker_with_prev')
        .select('*')
        .order('symbol', { ascending: true });

      if (error) throw error;

      const transformedTickers = data?.map(transformTicker) || [];
      setTickers(transformedTickers);
    } catch (error) {
      console.error('Error fetching tickers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickers();

    // Update every minute
    const intervalId = setInterval(() => {
      fetchTickers();
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <StockContext.Provider value={{ tickers, loading }}>
      {children}
    </StockContext.Provider>
  );
}

export function useStocks(): StockContextType {
  const context = useContext(StockContext);
  if (context === undefined) {
    throw new Error('useStocks must be used within a StockProvider');
  }
  return context;
}
