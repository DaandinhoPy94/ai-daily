import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { Ticker } from '@/src/contexts/StockProvider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AnimatedStocksTickerProps {
  tickers: Ticker[];
}

function TickerItem({ ticker }: { ticker: Ticker }) {
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
    <View style={styles.tickerItem}>
      <Text style={styles.symbol}>{ticker.symbol}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>{ticker.value}</Text>
        <Text style={styles.separator}> — </Text>
        <Text style={[styles.delta, { color: getTrendColor(ticker.direction) }]}>
          {ticker.delta}
        </Text>
      </View>
    </View>
  );
}

export function AnimatedStocksTicker({ tickers }: AnimatedStocksTickerProps) {
  const translateX = useSharedValue(0);

  // Calculate the width of all ticker items
  const ITEM_WIDTH = 100; // Approximate width per ticker
  const TOTAL_WIDTH = tickers.length * ITEM_WIDTH;
  const ANIMATION_DURATION = tickers.length * 3000; // 3 seconds per ticker

  useEffect(() => {
    if (tickers.length === 0) return;

    // Reset and start animation
    translateX.value = 0;
    translateX.value = withRepeat(
      withTiming(-TOTAL_WIDTH, {
        duration: ANIMATION_DURATION,
        easing: Easing.linear,
      }),
      -1, // Infinite repeat
      false // Don't reverse
    );
  }, [tickers.length, TOTAL_WIDTH, ANIMATION_DURATION, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  if (!tickers.length) return null;

  // Duplicate tickers for seamless loop
  const duplicatedTickers = [...tickers, ...tickers];

  return (
    <View style={styles.container}>
      <BlurView intensity={60} tint="systemChromeMaterialLight" style={styles.blurBackground}>
        <Animated.View style={[styles.tickerRow, animatedStyle]}>
          {duplicatedTickers.map((ticker, index) => (
            <TickerItem key={`${ticker.symbol}-${index}`} ticker={ticker} />
          ))}
        </Animated.View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    overflow: 'hidden',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  blurBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(250, 250, 250, 0.8)',
  },
  tickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tickerItem: {
    width: 100,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  symbol: {
    fontSize: 12,
    fontWeight: '700',
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
    fontWeight: '500',
    color: '#0a0a0a',
  },
  separator: {
    fontSize: 13,
    color: '#71717a',
  },
  delta: {
    fontSize: 13,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
});
