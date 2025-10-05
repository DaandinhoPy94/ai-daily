import { View } from 'react-native';

export function LoadingSkeleton() {
  return (
    <View className="flex-1 bg-background">
      {/* Header Skeleton */}
      <View className="px-4 py-3 border-b border-border">
        <View className="h-8 w-32 bg-muted rounded" />
      </View>

      {/* Content Skeletons */}
      <View className="px-4 pt-4">
        {/* Top Two Skeletons */}
        {[1, 2].map((i) => (
          <View key={i} className="mb-4">
            <View className="w-full aspect-video bg-muted rounded-lg mb-2" />
            <View className="bg-card border border-border rounded-lg p-4">
              <View className="h-4 w-24 bg-muted rounded mb-2" />
              <View className="h-5 w-full bg-muted rounded mb-1" />
              <View className="h-5 w-3/4 bg-muted rounded mb-3" />
              <View className="h-4 w-20 bg-muted rounded" />
            </View>
          </View>
        ))}

        {/* Spacer */}
        <View className="h-2 bg-muted/30 my-4" />

        {/* List Skeletons */}
        {[1, 2, 3, 4, 5].map((i) => (
          <View key={i} className="flex-row gap-3 py-3 min-h-[96px]">
            <View className="w-[72px] h-[72px] bg-muted rounded-md" />
            <View className="flex-1">
              <View className="h-3 w-20 bg-muted rounded mb-2" />
              <View className="h-4 w-full bg-muted rounded mb-1" />
              <View className="h-4 w-2/3 bg-muted rounded" />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
