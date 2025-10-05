import { View, Text, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function MijnNieuwsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="auto" />
      
      <View className="px-4 py-3 border-b border-border bg-card">
        <Text className="text-2xl font-bold text-foreground">Mijn Nieuws</Text>
      </View>

      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-lg text-muted-foreground text-center">
          Hier komt je persoonlijke nieuwsfeed
        </Text>
      </View>
    </SafeAreaView>
  );
}
