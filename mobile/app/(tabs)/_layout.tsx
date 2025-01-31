import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Navbar from '@/components/Navbar'; 

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Navbar />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color }) => <IconSymbol name="home" color={color} />,
            tabBarLabel: 'Home',
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            tabBarIcon: ({ color }) => <IconSymbol name="search" color={color} />,
            tabBarLabel: 'Explore',
          }}
        />
      </Tabs>
    </>
  );
}