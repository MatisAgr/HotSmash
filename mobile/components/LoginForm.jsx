import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice';
import { initiateWebSocket } from '../redux/slices/onlineUsersSlice';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';

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
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Entrez votre email"
                    placeholderTextColor="#888"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Entrez votre mot de passe"
                    placeholderTextColor="#888"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>
            <TouchableOpacity
                style={[styles.button, (!email || !password) && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={isLoading || !email || !password}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                    <Text style={styles.buttonText}>Login</Text>
                )}
            </TouchableOpacity>
            {alert && (
                <View style={[styles.alert, alert.type === 'error' ? styles.alertError : styles.alertSuccess]}>
                    <Text style={styles.alertText}>{alert.message}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#1F2937',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 20,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 15,
    },
    label: {
        color: 'white',
        fontSize: 18,
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
    button: {
        backgroundColor: '#3B82F6',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
    },
    alert: {
        padding: 10,
        marginTop: 20,
        borderRadius: 5,
        width: '100%',
    },
    alertError: {
        backgroundColor: '#FEE2E2',
    },
    alertSuccess: {
        backgroundColor: '#D1FAE5',
    },
    alertText: {
        color: '#333',
        fontSize: 16,
    },
});