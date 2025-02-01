import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createMatch } from '@/redux/slices/matchSlice';
import SmashCard from './SmashCard';

const CreateSmashForm = () => {
    const dispatch = useDispatch();
    const { isLoading, error, items } = useSelector((state) => state.match);

    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [sex, setSex] = useState('');
    const [customSex, setCustomSex] = useState(''); // État pour le genre personnalisé
    const [points, setPoints] = useState('');
    const [urlImg, setUrlImg] = useState('');
    const [formError, setFormError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (!isLoading && !error && items.length > 0) {
            setSuccessMessage('Smash créé avec succès ! Il sera ajouté au tas d\'autres smashes. Bonne chance pour le retrouver !');
            setName('');
            setAge('');
            setSex('');
            setCustomSex(''); // Réinitialiser le genre personnalisé
            setPoints('');
            setUrlImg('');
        }
    }, [isLoading, error, items]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleSubmit = () => {
        if (!name) {
            setFormError('Le nom est requis');
            setSuccessMessage('');
            return;
        }
        if (!age) {
            setFormError('L\'âge est requis');
            setSuccessMessage('');
            return;
        }
        if (!sex) {
            setFormError('Le genre est requis');
            setSuccessMessage('');
            return;
        }
        if (sex === 'Autre' && !customSex) {
            setFormError('Veuillez spécifier votre genre');
            setSuccessMessage('');
            return;
        }
        if (!points) {
            setFormError('Les points sont requis');
            setSuccessMessage('');
            return;
        }
        if (points < 0 || points > 1000) {
            setFormError('Les points doivent être entre 0 et 1000');
            setSuccessMessage('');
            return;
        }
        if (!urlImg) {
            setFormError('L\'URL de l\'image est requise');
            setSuccessMessage('');
            return;
        }
        setFormError('');

        const matchData = {
            name,
            age,
            gender: sex === 'Autre' ? customSex : sex,
            point: points,
            url_img: urlImg,
        };

        dispatch(createMatch(matchData));
    };

    const handleChangePoints = (value) => {
        let pointsValue = parseInt(value, 10);
        if (pointsValue > 1000) {
            pointsValue = 1000;
        } else if (pointsValue < 0) {
            pointsValue = 0;
        }
        setPoints(pointsValue);
    };

    return (
        <View style={styles.container}>
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#FFF" />
                </View>
            )}
            <View style={styles.formContainer}>
                <Text style={styles.title}>Créer un Smash</Text>
                {formError ? <Text style={styles.error}>{formError}</Text> : null}
                {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}
                <TextInput
                    style={styles.input}
                    placeholder="Nom"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Âge"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Genre"
                    value={sex}
                    onChangeText={setSex}
                />
                {sex === 'Autre' && (
                    <TextInput
                        style={styles.input}
                        placeholder="Objet, Animal, Autre..."
                        value={customSex}
                        onChangeText={setCustomSex}
                    />
                )}
                <TextInput
                    style={styles.input}
                    placeholder="Points de détraquage mental"
                    value={points}
                    onChangeText={handleChangePoints}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="URL de l'image"
                    value={urlImg}
                    onChangeText={setUrlImg}
                />
                <Button title="Créer un Smash" onPress={handleSubmit} disabled={isLoading} />
                {error && (
                    <Text style={styles.error}>
                        {error.status === 400 ? 'Le smasher existe déjà.' : error.message}
                    </Text>
                )}
            </View>
            <View style={styles.cardContainer}>
                <SmashCard
                    name={name || '[Nom]'}
                    age={age || '[Âge]'}
                    gender={sex === 'Autre' ? customSex : sex || '[Genre]'}
                    url_img={urlImg || 'https://static.wikia.nocookie.net/disney/images/8/89/Profile_-_Kim_Possible.png/revision/latest?cb=20190312090023'}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#000',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    formContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 20,
        borderRadius: 10,
        width: '100%',
        maxWidth: 400,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#333',
        color: '#FFF',
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    success: {
        color: 'green',
        marginBottom: 10,
    },
    cardContainer: {
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
});

export default CreateSmashForm;