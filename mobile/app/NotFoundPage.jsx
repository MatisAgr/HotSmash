import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function NotFoundPage() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <View className="text-center">
        <Text className="text-9xl font-bold text-gray-800">404</Text>
        <Text className="text-2xl font-medium text-gray-600 mb-8">
          La page que vous recherchez n'existe pas.
        </Text>
        <Link href="/" asChild>
          <TouchableOpacity className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
            <Text>Retour à l'accueil</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}