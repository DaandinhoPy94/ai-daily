import { Tabs } from 'expo-router';
import { Home, Clock, Heart, MoreHorizontal } from 'lucide-react-native';
import { View, Text } from 'react-native';

function TabBarIcon({ IconComponent, color, focused }: { 
  IconComponent: any; 
  color: string; 
  focused: boolean 
}) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', height: 26, marginBottom: -2 }}>
      {focused && (
        <View style={{
          position: 'absolute',
          top: -4,
          width: 32,
          height: 2,
          backgroundColor: '#E36B2C',
          borderRadius: 2,
        }} />
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
        tabBarActiveTintColor: '#E36B2C', // Oranje accent (zoals web)
        tabBarInactiveTintColor: '#0a0a0a', // Foreground (zoals web)
        tabBarStyle: {
          height: 66,
          paddingBottom: 2,
          paddingTop: 6,
          paddingHorizontal: 16,
          borderTopWidth: 1,
          borderTopColor: '#e4e4e7',
          backgroundColor: '#ffffff',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '400',
          marginTop: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
          paddingHorizontal: 2,
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
            <View style={{ alignItems: 'center', justifyContent: 'center', height: 26, marginBottom: -2, marginLeft: -8 }}>
              {focused && (
                <View style={{
                  position: 'absolute',
                  top: -4,
                  width: 32,
                  height: 2,
                  backgroundColor: '#E36B2C',
                  borderRadius: 2,
                }} />
              )}
              <MoreHorizontal size={26} color={color} strokeWidth={2} />
            </View>
          ),
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontSize: 11, fontWeight: '400', marginTop: 0, marginLeft: -8 }}>Meer</Text>
          ),
        }}
      />
      
      {/* Hidden tabs - these show the tab bar but don't appear in it */}
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="opgeslagen"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="preferences"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
