import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getLikesByUserId } from '../../redux/slices/smashSlice';

const UserLikes = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.profile);
    const likes = useSelector((state) => state.smash.likes);
    const likesStatus = useSelector((state) => state.smash.status);

    useEffect(() => {
        if (user) {
            dispatch(getLikesByUserId(user.id));
        }
    }, [dispatch, user]);

    if (likesStatus === 'loading') {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>User Likes</Text>
            {likes.length > 0 ? (
                <FlatList
                    data={likes}
                    renderItem={({ item }) => (
                        <Text style={styles.likeItem} key={item.id}>{item.matchId}</Text>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                />
            ) : (
                <Text style={styles.noLikes}>No likes found.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#FFF',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    likeItem: {
        fontSize: 16,
        marginBottom: 4,
    },
    noLikes: {
        fontSize: 16,
        color: '#888',
    },
});

export default UserLikes;