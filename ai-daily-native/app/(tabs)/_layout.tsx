import { Tabs } from 'expo-router';
import { Home, Clock, Heart, MoreHorizontal } from 'lucide-react-native';
import { View, Text } from 'react-native';

function TabBarIcon({ IconComponent, color, focused }: { 
  IconComponent: any; 
  color: string; 
  focused: boolean 
}) {
  return (
    <View className="items-center justify-center pt-2">
      {focused && (
        <View className="absolute top-0 w-8 h-0.5 bg-accent rounded-full" />
      )}
      <IconComponent size={24} color={color} strokeWidth={2} />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3b82f6', // accent color
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '400',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Voorpagina',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon IconComponent={Home} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="net-binnen"
        options={{
          title: 'Net binnen',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon IconComponent={Clock} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="mijn-nieuws"
        options={{
          title: 'Mijn nieuws',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon IconComponent={Heart} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="meer"
        options={{
          title: 'Meer',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon IconComponent={MoreHorizontal} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
