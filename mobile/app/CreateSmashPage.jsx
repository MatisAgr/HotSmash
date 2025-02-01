import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CreateSmashForm from '@/components/CreateSmashForm';

export default function CreateSmashPage() {
  return (
    <LinearGradient
      colors={['#8B5CF6', '#EC4899', '#EF4444']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <CreateSmashForm />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
  },
});