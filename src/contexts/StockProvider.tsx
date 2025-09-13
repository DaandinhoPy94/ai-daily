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
    const value = parseFloat(dbTicker.last_value?.toString() || '0');
    const pctChange = parseFloat(dbTicker.pct_change?.toString() || '0');
    
    let direction: 'up' | 'down' | 'flat' = 'flat';
    if (pctChange > 0) direction = 'up';
    else if (pctChange < 0) direction = 'down';

    return {
      symbol: dbTicker.symbol,
      value: `$${value.toFixed(2)}`,
      delta: pctChange !== 0 ? `${pctChange > 0 ? '+' : ''}${pctChange.toFixed(2)}%` : '0.00%',
      direction
    };
  };

  // Fetch initial ticker data
  const fetchTickers = async () => {
    try {
      const { data, error } = await supabase
        .from('v_ticker_latest')
        .select('*')
        .order('display_order', { ascending: true });

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