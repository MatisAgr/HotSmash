import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearRegisterSuccess } from '../redux/slices/authSlice';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';

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
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Entrez votre nom d'utilisateur"
                    placeholderTextColor="#888"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
            </View>
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
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Confirmez votre mot de passe"
                    placeholderTextColor="#888"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
            </View>

            <TouchableOpacity
                style={[styles.button, (!username || !email || !password || !confirmPassword) && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={isLoading || !username || !email || !password || !confirmPassword}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                    <Text style={styles.buttonText}>Register</Text>
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