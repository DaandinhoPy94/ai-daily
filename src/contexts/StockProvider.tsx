import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Ticker } from '@/types';

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

  // Transform database ticker data to component format
  const transformTicker = (dbTicker: any): Ticker => {
    const latestValue = parseFloat(dbTicker.latest_value?.toString() || '0');
    const prevValue = parseFloat(dbTicker.prev_value?.toString() || '0');
    
    let direction: 'up' | 'down' | 'flat' = 'flat';
    let delta = '-';
    
    if (prevValue && prevValue > 0) {
      const absoluteChange = latestValue - prevValue;
      const percentChange = (absoluteChange / prevValue) * 100;
      
      if (absoluteChange > 0) {
        direction = 'up';
        delta = `+${absoluteChange.toFixed(2)} (+${percentChange.toFixed(2)}%)`;
      } else if (absoluteChange < 0) {
        direction = 'down';
        delta = `${absoluteChange.toFixed(2)} (${percentChange.toFixed(2)}%)`;
      } else {
        direction = 'flat';
        delta = '0.00 (0.00%)';
      }
    }

    return {
      symbol: dbTicker.symbol,
      value: `$${latestValue.toFixed(2)}`,
      delta,
      direction
    };
  };

  // Fetch initial ticker data
  const fetchTickers = async () => {
    try {
      const { data, error } = await supabase
        .from('ticker_with_prev' as any)
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
    // Fetch initial data
    fetchTickers();

    // Set up periodic updates every minute
    const intervalId = setInterval(() => {
      fetchTickers();
    }, 60000); // 60 seconds

    // Subscribe to real-time updates on ticker_quotes table
    const channel = supabase
      .channel('ticker-updates')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'ticker_quotes'
        },
        (payload) => {
          console.log('Ticker update received:', payload);
          // Refetch all tickers when any quote changes
          // This ensures we get the latest values from the view
          fetchTickers();
        }
      )
      .subscribe();

    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(channel);
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