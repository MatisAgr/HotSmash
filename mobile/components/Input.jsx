import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function Input({ type, value, onChange, placeholder, label }) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                keyboardType={type === 'number' ? 'numeric' : 'default'}
                value={value}
                onChangeText={onChange}
                placeholder={placeholder}
                placeholderTextColor="#888"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 15,
    },
    label: {
        color: 'white',
        fontSize: 18,
        textAlign: 'left',
        width: '100%',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#333',
        color: '#FFF',
    },
});