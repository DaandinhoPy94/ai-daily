import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ticker } from '@/src/contexts/StockProvider';

interface MobileStocksStripProps {
  tickers: Ticker[];
}

export function MobileStocksStrip({ tickers }: MobileStocksStripProps) {
  if (!tickers.length) return null;

  const getTrendIcon = (direction: string) => {
    if (direction === 'up') return '→';
    if (direction === 'down') return '→';
    return '→';
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up':
        return '#16a34a';
      case 'down':
        return '#dc2626';
      default:
        return '#71717a';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tickers.map((ticker, index) => (
          <TouchableOpacity
            key={`${ticker.symbol}-${index}`}
            style={styles.tickerButton}
            activeOpacity={0.7}
          >
            <View style={styles.tickerContent}>
              <Text style={styles.symbol}>{ticker.symbol}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>{ticker.value}</Text>
                <Text style={styles.separator}> — </Text>
                <Text style={[styles.delta, { color: getTrendColor(ticker.direction) }]}>
                  {ticker.delta}
                </Text>
                <Text style={[styles.arrow, { color: getTrendColor(ticker.direction) }]}>
                  {' '}{getTrendIcon(ticker.direction)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fafafa',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e4e4e7',
    height: 48,
    justifyContent: 'center',
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 0,
    gap: 0,
  },
  tickerButton: {
    minWidth: 80,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tickerContent: {
    alignItems: 'center',
  },
  symbol: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0a0a0a',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: '#0a0a0a',
  },
  separator: {
    fontSize: 13,
    color: '#71717a',
  },
  delta: {
    fontSize: 13,
    fontFamily: 'monospace',
  },
  arrow: {
    fontSize: 13,
  },
});
