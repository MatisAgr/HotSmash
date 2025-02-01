import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

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

    const handleSubmit = () => {
        if (socket && message) {
            socket.send(message);
            setMessage('');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>WS Messages</Text>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type your message"
                    placeholderTextColor="#888"
                />
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Send</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.messagesContainer}>
                <Text style={styles.subtitle}>Messages</Text>
                <FlatList
                    data={messages}
                    renderItem={({ item }) => (
                        <View style={styles.messageItem}>
                            <Text>{item}</Text>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    form: {
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: '#FFF',
    },
    button: {
        backgroundColor: '#3B82F6',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
    },
    messagesContainer: {
        flex: 1,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    messageItem: {
        padding: 10,
        backgroundColor: '#F3F4F6',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 5,
    },
});

export default SendMessage;