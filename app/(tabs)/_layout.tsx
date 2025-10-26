import { IconSymbol } from '@/components/ui/icon-symbol';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

export default function TabLayout() {
  const [showTabs, setShowTabs] = useState(false);
  const slideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTabs(true);
      
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: showTabs ? 'flex' : 'none',
          backgroundColor: '#1E1E1E',
          borderTopColor: '#333333',
          borderTopWidth: 1,
          transform: [{ translateY: slideAnim }],
        },
        tabBarActiveTintColor: '#4A9EAF',
        tabBarInactiveTintColor: '#666',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <Ionicons size={26} name="search" color={color} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => <Ionicons size={26} name="bookmark" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons size={26} name="settings-sharp" color={color} />,
        }}
      />
    </Tabs>
  );
}
