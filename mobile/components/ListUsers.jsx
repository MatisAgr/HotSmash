import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { FaUser } from 'react-icons/fa';

export default function ListUsers() {
    const users = useSelector((state) => state.onlineUsers.users);

    const renderItem = ({ item }) => (
        <View style={styles.userItem}>
            <FaUser style={styles.icon} />
            <Text style={styles.username}>{item.username}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Utilisateurs en ligne</Text>
            <FlatList
                data={users}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

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
    },
    list: {
        paddingBottom: 20,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#DDD',
    },
    icon: {
        fontSize: 24,
        color: '#3B82F6',
        marginRight: 10,
    },
    username: {
        fontSize: 18,
        color: '#333',
    },
});