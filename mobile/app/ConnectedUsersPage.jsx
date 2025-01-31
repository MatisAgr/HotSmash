import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, FlatList } from 'react-native';
import ConnectedUserCard from '../components/ConnectedUserCard';
import SearchBar from '../components/SearchBar';

export default function ConnectedUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const users = useSelector((state) => state.onlineUsers.users);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View className="p-4">
      <Text className="text-2xl text-white font-bold mb-4">Utilisateurs Connectés</Text>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <FlatList
        data={filteredUsers}
        keyExtractor={(user) => user.id.toString()}
        renderItem={({ item }) => (
          <ConnectedUserCard
            username={item.username}
            points={item.points}
            smashesToDo={item.smashesToDo}
          />
        )}
        contentContainerStyle={{ gap: 16 }}
      />
    </View>
  );
}