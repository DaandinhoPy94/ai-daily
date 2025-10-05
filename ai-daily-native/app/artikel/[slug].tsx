import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

export default function ArticleDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-4 py-3 border-b border-border bg-card">
        <Text className="text-2xl font-bold text-foreground">Artikel</Text>
      </View>
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-muted-foreground">Artikel slug: {slug}</Text>
      </View>
    </SafeAreaView>
  );
}
