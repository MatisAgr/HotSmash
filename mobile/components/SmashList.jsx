import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { getRandomMatches } from '../redux/slices/matchSlice';
import { createLike } from '../redux/slices/smashSlice';
import SmashCard from '../components/SmashCard';
import { NAME_APP } from '../constants/NameApp';

export default function SmashList() {
    const dispatch = useDispatch();
    const { items: users, isLoading, error } = useSelector((state) => state.match);
    const user = useSelector((state) => state.auth.user);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (user) {
            dispatch(getRandomMatches());
        }
    }, [dispatch, user]);

    useEffect(() => {
        setCurrentIndex(0); // Réinitialiser l'index après récupération
    }, []);

    const handleAction = (action) => {
        if (users.length > 0 && user) {
            const matchId = users[currentIndex]._id;
            const likeData = {
                userId: user.id,
                matchId,
                type: action === 'pass' ? 2 : 1, // 2 pour pass, 1 pour smash
            };
            dispatch(createLike(likeData));
            // Passer à la carte suivante ou récupérer de nouveaux matchs
            setTimeout(() => {
                if (currentIndex >= 4) {
                    dispatch(getRandomMatches());
                    setCurrentIndex(0);
                } else {
                    setCurrentIndex((i) => i + 1);
                }
            }, 500);
        }
    };

    return (
        <LinearGradient 
            colors={['#3B82F6', '#EC4899', '#EF4444']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.container}
        >
            <View style={styles.buttonContainer}>
                {/* Zone PASS à gauche */}
                <TouchableOpacity style={styles.halfButton} onPress={() => handleAction('pass')}>
                    <Text style={styles.buttonText}>PASS</Text>
                </TouchableOpacity>
                {/* Zone SMASH à droite */}
                <TouchableOpacity style={styles.halfButton} onPress={() => handleAction('smash')}>
                    <Text style={styles.buttonText}>SMASH</Text>
                </TouchableOpacity>
            </View>

            {/* Carte au centre */}
            <View style={styles.cardContainer}>
                {users.length > 0 && currentIndex < users.length && (
                    <SmashCard {...users[currentIndex]} />
                )}
            </View>

            {/* Message quand aucune carte n'est disponible */}
            {users.length === 0 && (
                <View style={styles.noCardContainer}>
                    <Text style={styles.noCardEmoji}>🤯</Text>
                    <Text style={styles.noCardTitle}>Aucune carte disponible</Text>
                    <Text style={styles.noCardMessage}>Vous avez fini {NAME_APP}</Text>
                </View>
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',   
      },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        zIndex: 5,
    },
    halfButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 50,
        fontWeight: '900',
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    cardContainer: {
        position: 'absolute',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 6,
        pointerEvents: 'none',
    },
    noCardContainer: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        backgroundColor: '#A855F7',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        zIndex: 10,
    },
    noCardEmoji: {
        fontSize: 40,
        marginBottom: 8,
        textAlign: 'center',
    },
    noCardTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 4,
    },
    noCardMessage: {
        fontSize: 20,
        color: '#FFF',
        textAlign: 'center',
    },
});