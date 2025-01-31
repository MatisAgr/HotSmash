import React from 'react';
import { View } from 'react-native';

import RegisterForm from '../components/RegisterForm';

export default function RegisterPage() {
  return (
    <View className="flex-1 items-center justify-center">
      <RegisterForm />
    </View>
  );
}