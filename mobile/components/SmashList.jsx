import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getRandomMatches } from '../redux/slices/matchSlice';
import { createLike } from '../redux/slices/smashSlice';
import SmashCard from '../components/SmashCard';
import { NAME_APP } from '../constants/NameApp';
import { TailwindProvider } from 'tailwindcss-react-native';

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
        setCurrentIndex(0); // Réinitialiser l'index après avoir récupéré de nouveaux matchs
    }, []);

    const handleAction = async (action) => {
        if (users.length > 0 && user) {
            const matchId = users[currentIndex]._id;
            const likeData = {
                userId: user.id,
                matchId,
                type: action === 'pass' ? 2 : 1 // Type 2 for pass, 1 for smash
            };
            dispatch(createLike(likeData));
            // Retirer la carte actuelle après l'action
            setTimeout(() => {
                if (currentIndex >= 4) {
                    dispatch(getRandomMatches());
                    setCurrentIndex(0); // Réinitialiser l'index après avoir récupéré de nouveaux matchs
                } else {
                    setCurrentIndex((currentIndex) => currentIndex + 1); // Passer à l'élément suivant
                }
            }, 500);
        }
    };

    return (
        <TailwindProvider>
            <View className="flex items-center justify-center min-h-screen bg-white select-none relative bg-gradient-to-r from-blue-500 via-pink-500 to-red-500">
                <View className="flex items-center justify-between w-full relative z-5">
                    {/* Zone PASS à gauche */}
                    <TouchableOpacity
                        className="h-full sm:h-[50rem] md:h-[54rem] lg:h-[58rem] w-1/2 flex items-center justify-center cursor-pointer p-4 relative"
                        onPress={() => handleAction('pass')}
                    >
                        <Text className="text-white text-6xl font-extrabold drop-shadow-lg">
                            PASS
                        </Text>
                    </TouchableOpacity>

                    {/* Zone SMASH à droite */}
                    <TouchableOpacity
                        className="h-full sm:h-[50rem] md:h-[54rem] lg:h-[58rem] w-1/2 flex items-center justify-center cursor-pointer p-4 relative"
                        onPress={() => handleAction('smash')}
                    >
                        <Text className="text-white text-6xl font-extrabold drop-shadow-lg">
                            SMASH
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* SmashCard au centre */}
                <View className="flex items-center justify-center w-full absolute z-6 pointer-events-none">
                    {users.length > 0 && currentIndex < users.length && (
                        <SmashCard {...users[currentIndex]} />
                    )}
                </View>

                {users.length === 0 && (
                    <View className="absolute bottom-10 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white text-xl py-4 px-6 rounded-3xl shadow-lg select-none text-center">
                        <Text className='text-4xl mb-2'>🤯</Text>
                        <Text className='text-2xl font-bold'>Aucune carte disponible</Text>
                        <Text className='text-lg mt-2'>Vous avez fini {NAME_APP}</Text>
                    </View>
                )}
            </View>
        </TailwindProvider>
    );
}