import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="auto" />
      
      {/* Header */}
      <View className="px-4 py-3 border-b border-border bg-card">
        <Text className="text-2xl font-bold text-foreground">AI Daily</Text>
      </View>

      {/* Content */}
      <ScrollView className="flex-1">
        <View className="px-4 py-6">
          <Text className="text-xl font-semibold text-foreground mb-2">
            Welkom bij AI Daily Native! 🎉
          </Text>
          <Text className="text-base text-muted-foreground mb-4">
            Dit is je nieuwe React Native app voor iOS en Android.
          </Text>
          
          <View className="bg-card border border-border rounded-lg p-4 mb-4">
            <Text className="text-lg font-semibold text-foreground mb-2">
              📱 Native Features
            </Text>
            <Text className="text-muted-foreground">
              • Werkt op iOS en Android{'\n'}
              • Native performance{'\n'}
              • Push notifications mogelijk{'\n'}
              • Camera en biometrie toegang{'\n'}
              • App store distributie
            </Text>
          </View>

          <View className="bg-card border border-border rounded-lg p-4">
            <Text className="text-lg font-semibold text-foreground mb-2">
              🎨 Styling
            </Text>
            <Text className="text-muted-foreground">
              NativeWind is geconfigureerd - gebruik Tailwind classes zoals je gewend bent!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
