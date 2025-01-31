import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearRegisterSuccess } from '../redux/slices/authSlice';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function RegisterForm() {
    const dispatch = useDispatch();
    const router = useRouter();

    const { isLoading, error, registerSuccess } = useSelector((state) => state.auth);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        if (registerSuccess) {
            setAlert({ type: 'success', message: 'Inscription réussie ! Redirection vers la page de connexion...' });
            dispatch(clearRegisterSuccess());
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        }
    }, [registerSuccess, dispatch, router]);

    useEffect(() => {
        if (error) {
            setAlert({ type: 'error', message: error.error || 'Une erreur est survenue lors de l\'inscription' });
        }
    }, [error]);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const handleRegister = () => {
        if (!validateEmail(email)) {
            setAlert({ type: 'error', message: 'Veuillez entrer une adresse email valide' });
            return;
        }

        if (!validatePassword(password)) {
            setAlert({ type: 'error', message: 'Le mot de passe doit comporter au moins 6 caractères' });
            return;
        }

        if (password !== confirmPassword) {
            setAlert({ type: 'error', message: 'Les mots de passe ne correspondent pas' });
            return;
        }

        dispatch(registerUser({ username, email, password }));
    };

    return (
        <View className="flex flex-col items-center justify-center rounded-3xl p-5 bg-gray-900 shadow-md w-1/3">
            <Text className="text-4xl font-bold text-white mb-5">Register</Text>
            
            <View className="w-full mb-4">
                <Text className="text-white mb-2">Username</Text>
                <TextInput
                    className="p-2 bg-gray-800 text-white rounded-md"
                    placeholder="Entrez votre nom d'utilisateur"
                    placeholderTextColor="#888"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
            </View>
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
            <View className="w-full mb-4">
                <Text className="text-white mb-2">Confirm Password</Text>
                <TextInput
                    className="p-2 bg-gray-800 text-white rounded-md"
                    placeholder="Confirmez votre mot de passe"
                    placeholderTextColor="#888"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
            </View>

            <TouchableOpacity
                className={`bg-blue-500 text-white p-2 rounded-md w-full mt-5 text-center justify-center ${!username || !email || !password || !confirmPassword ? 'opacity-50' : ''}`}
                onPress={handleRegister}
                disabled={isLoading || !username || !email || !password || !confirmPassword}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                    <Text>Register</Text>
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