import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ChevronRight } from 'lucide-react-native';

export default function MeerScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="auto" />
      
      <View className="px-4 py-3 border-b border-border bg-card">
        <Text className="text-2xl font-bold text-foreground">Meer</Text>
      </View>

      <View className="flex-1 px-4 py-4">
        <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-border">
          <Text className="text-base text-foreground">Over Ons</Text>
          <ChevronRight size={20} color="#6b7280" />
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-border">
          <Text className="text-base text-foreground">Nieuwsbrief</Text>
          <ChevronRight size={20} color="#6b7280" />
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-border">
          <Text className="text-base text-foreground">AI Cursussen</Text>
          <ChevronRight size={20} color="#6b7280" />
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-border">
          <Text className="text-base text-foreground">AI Jobs</Text>
          <ChevronRight size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
