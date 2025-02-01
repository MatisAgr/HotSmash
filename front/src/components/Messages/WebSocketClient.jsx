import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const WebSocketClient = ({ username }) => {
    const [ws, setWs] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [users, setUsers] = useState([]);
    const [recipientId, setRecipientId] = useState('');

    useEffect(() => {
        const token = Cookies.get('token');
        const socket = new WebSocket(`ws://localhost:8080`);
        setWs(socket);

        socket.onopen = () => {
            socket.send(JSON.stringify({ type: 'authenticate', token }));
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'users') {
                setUsers(message.users);
            } else {
                setMessages((prevMessages) => [...prevMessages, message]);
            }
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            socket.close();
        };
    }, [username]);

    const sendMessage = (recipientId, text) => {
        if (ws) {
            const message = JSON.stringify({ type: 'private', recipientId, text });
            ws.send(message);
        }
    };

    const handleSend = () => {
        sendMessage(recipientId, input);
        setInput('');
    };

    return (
        <div>
            <h1>WebSocket Client</h1>
            <div>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message"
                />
                <button onClick={handleSend}>Send</button>
            </div>
            <div>
                <h2>Messages</h2>
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index}>{msg.message}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Connected Users</h2>
                <ul>
                    {users.map((user) => (
                        <li key={user.userId} onClick={() => setRecipientId(user.userId)}>
                            {user.username}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WebSocketClient;