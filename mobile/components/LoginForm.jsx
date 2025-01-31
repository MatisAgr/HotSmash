import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice';
import { initiateWebSocket } from '../redux/slices/onlineUsersSlice';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function LoginForm() {
    const dispatch = useDispatch();
    const router = useRouter();

    const { isLoading, error, token } = useSelector((state) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        if (token) {
            dispatch(initiateWebSocket());
            setAlert({ type: 'success', message: 'Connexion réussie ! Redirection vers le profil...' });
            setTimeout(() => {
                router.push("/profile");
            }, 2000);
        }
    }, [token, router, dispatch]);

    useEffect(() => {
        if (error) {
            setAlert({ type: 'error', message: error.error || 'Une erreur est survenue lors de la connexion' });
        }
    }, [error]);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const handleLogin = () => {
        if (!validateEmail(email)) {
            setAlert({ type: 'error', message: 'Veuillez entrer une adresse email valide' });
            return;
        }

        if (!validatePassword(password)) {
            setAlert({ type: 'error', message: 'Le mot de passe doit comporter au moins 6 caractères' });
            return;
        }

        dispatch(loginUser({ email, password }));
    };

    return (
        <View className="flex flex-col items-center justify-center rounded-3xl p-5 bg-gray-900 shadow-md w-1/3">
            <Text className="text-4xl font-bold text-white mb-5">Login</Text>
            <View className="w-full mb-4">
                <Text className="text-white mb-2">Email</Text>
                <TextInput
                    className="p-2 bg-gray-800 text-white rounded-md"
                    placeholder="Entrez votre email"
                    placeholderTextColor="#888"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>
            <View className="w-full mb-4">
                <Text className="text-white mb-2">Password</Text>
                <TextInput
                    className="p-2 bg-gray-800 text-white rounded-md"
                    placeholder="Entrez votre mot de passe"
                    placeholderTextColor="#888"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>
            <TouchableOpacity
                className={`bg-blue-500 text-white p-2 rounded-md w-full mt-5 text-center justify-center ${!email || !password ? 'opacity-50' : ''}`}
                onPress={handleLogin}
                disabled={isLoading || !email || !password}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                    <Text>Login</Text>
                )}
            </TouchableOpacity>
            {alert && (
                <View className={`p-2 mt-4 w-full text-sm ${alert.type === 'error' ? 'text-red-700 bg-red-100' : 'text-green-700 bg-green-100'} rounded-lg`} role="alert">
                    <Text>{alert.message}</Text>
                </View>
            )}
        </View>
    );
}