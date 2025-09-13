import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UsTickersOptions {
  pollMs?: number;
}

interface UseTickersReturn {
  tickers: Array<{
    symbol: string;
    value: string;
    delta: string;
    direction: 'up' | 'down' | 'flat';
  }>;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useTickers(options: UsTickersOptions = {}): UseTickersReturn {
  const { pollMs } = options;
  const [tickers, setTickers] = useState<UseTickersReturn['tickers']>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickers = useCallback(async () => {
    try {
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('v_ticker_latest')
        .select('*')
        .order('symbol');

      if (fetchError) {
        throw fetchError;
      }

      const formattedTickers = (data || []).map((r: any) => {
        const pctChange = Number(r.pct_change || 0);
        const direction: 'up' | 'down' | 'flat' = 
          pctChange > 0 ? 'up' : 
          pctChange < 0 ? 'down' : 'flat';
        
        return {
          symbol: r.symbol,
          value: Number(r.last_value || 0).toFixed(3),
          delta: pctChange !== 0 ? `${pctChange > 0 ? '+' : ''}${pctChange.toFixed(2)}%` : '0.00%',
          direction
        };
      });

      setTickers(formattedTickers);
    } catch (err) {
      console.error('Error fetching tickers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tickers');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchTickers();
  }, [fetchTickers]);

  useEffect(() => {
    fetchTickers();
  }, [fetchTickers]);

  useEffect(() => {
    if (!pollMs) return;

    const interval = setInterval(() => {
      fetchTickers();
    }, pollMs);

    return () => clearInterval(interval);
  }, [pollMs, fetchTickers]);

  return {
    tickers,
    loading,
    error,
    refresh
  };
}