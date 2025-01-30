import React from 'react';
import { useSelector } from 'react-redux';
import { FaUser } from 'react-icons/fa';

export default function ListUsers() {
    const users = useSelector((state) => state.onlineUsers.users);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Utilisateurs en ligne</h2>
            <ul className="space-y-4">
                {users.map(user => (
                    <li key={user.id} className="flex items-center space-x-3">
                        <FaUser className="w-10 h-10 text-blue-500" />
                        <span className="text-gray-700">{user.username}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}