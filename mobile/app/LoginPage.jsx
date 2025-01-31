import React from 'react';
import { View } from 'react-native';

import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <View className="flex-1 items-center justify-center">
      <LoginForm />
    </View>
  );
}