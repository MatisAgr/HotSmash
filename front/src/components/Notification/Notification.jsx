import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import WebSocket from 'react-native-websocket';

export default function Notification() {
  const [messages, setMessages] = useState([]);

  return (
    <View style={styles.container}>
      <WebSocket
        url="ws://localhost:8080"
        onOpen={() => console.log('WebSocket connected')}
        onMessage={(event) => {
          const message = event.data;
          setMessages((prevMessages) => [...prevMessages, message]);
        }}
        onError={(error) => console.log('WebSocket error', error)}
        onClose={() => console.log('WebSocket disconnected')}
      />
      {messages.map((message, index) => (
        <Text key={index}>{message}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});