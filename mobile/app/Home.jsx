import React from 'react';
import { View } from 'react-native';

import SmashList from '../components/SmashList';

export default function Home() {
  return (
    <View className="flex-1 bg-black">
      <SmashList />
    </View>
  );
}