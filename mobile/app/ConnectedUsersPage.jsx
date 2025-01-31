import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ConnectedUserCard from '../../components/Card/ConnectedUserCard';
import SearchBar from '../../components/SearchBar/SearchBar';

export default function ConnectedUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const users = useSelector((state) => state.onlineUsers.users);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl text-white font-bold mb-4">Utilisateurs Connectés</h1>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.map(user => (
          <ConnectedUserCard
            key={user.id}
            username={user.username}
            points={user.points}
            smashesToDo={user.smashesToDo}
          />
        ))}
      </div>
    </div>
  );
}