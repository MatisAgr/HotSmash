import React from 'react';
import { View, StyleSheet } from 'react-native';
import SmashList from '../../components/SmashList';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <SmashList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});