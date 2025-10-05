import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock } from 'lucide-react-native';

interface Article {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  readTimeMinutes: number;
  topicName?: string;
  media_asset_url?: string;
  media_asset_alt?: string;
}

interface LargeNewsCardProps {
  article: Article;
}

export function LargeNewsCard({ article }: LargeNewsCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/artikel/${article.slug}` as any);
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.7}
      className="mb-4"
    >
      {/* Image */}
      {article.media_asset_url && (
        <Image
          source={{ uri: article.media_asset_url }}
          className="w-full aspect-video rounded-lg"
          resizeMode="cover"
        />
      )}

      {/* Card Content */}
      <View className="bg-card border border-border rounded-lg p-4 -mt-6 mx-2">
        {/* Topic Badge */}
        {article.topicName && (
          <View className="mb-2">
            <Text className="text-xs text-muted-foreground uppercase tracking-wide">
              {article.topicName}
            </Text>
          </View>
        )}

        {/* Title */}
        <Text className="text-lg font-semibold text-foreground mb-2">
          {article.title}
        </Text>

        {/* Summary */}
        {article.summary && (
          <Text className="text-sm text-muted-foreground mb-3" numberOfLines={2}>
            {article.summary}
          </Text>
        )}

        {/* Read Time */}
        <View className="flex-row items-center">
          <Clock size={14} color="#6b7280" />
          <Text className="text-xs text-muted-foreground ml-1">
            {article.readTimeMinutes} min lezen
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
