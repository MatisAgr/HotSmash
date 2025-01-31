import React, { useState, useEffect } from 'react';

const SendMessage = () => {
    const [message, setMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080');

        ws.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        ws.onmessage = (event) => {
            console.log(`Message from server: ${event.data}`);
            setMessages(prevMessages => [...prevMessages, event.data]);
        };

        ws.onclose = () => {
            console.log('Disconnected from WebSocket server');
        };

        ws.onerror = (error) => {
            console.error(`WebSocket error: ${error}`);
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (socket && message) {
            socket.send(message);
            setMessage('');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-5 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-5 text-center">WS Messages</h1>
            <form onSubmit={handleSubmit} className="mb-5">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message"
                    required
                    className="w-full p-2 border border-gray-300 rounded mb-3"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
                >
                    Send
                </button>
            </form>
            <div>
                <h2 className="text-xl font-semibold mb-3">Messages</h2>
                <ul className="space-y-2">
                    {messages.map((msg, index) => (
                        <li key={index} className="p-2 bg-gray-100 rounded border border-gray-200">
                            {msg}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SendMessage;