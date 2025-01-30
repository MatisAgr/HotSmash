import React, { useState } from 'react';
import ConnectedUserCard from '../../components/Card/ConnectedUserCard';
import SearchBar from '../../components/SearchBar/SearchBar';

export default function ConnectedUsers() {
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    { id: 1, username: 'JohnDoe', points: 200, smashesToDo: 5 },
    { id: 2, username: 'JaneDoe', points: 300, smashesToDo: 3 },
    { id: 3, username: 'FooBar', points: 100, smashesToDo: 2 },
    { id: 4, username: 'BazQux', points: 500, smashesToDo: 1 },
  ];

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Utilisateurs Connectés</h2>
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