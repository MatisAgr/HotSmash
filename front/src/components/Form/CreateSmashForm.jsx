import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createMatch } from '../../redux/slices/matchSlice';
import SmashCard from '../Card/SmashCard';

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

    const handleSubmit = (e) => {
        e.preventDefault();
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

    const handleChangePoints = (e) => {
        let value = parseInt(e.target.value, 10);
        if (value > 1000) {
            value = 1000;
        } else if (value < 0) {
            value = 0;
        }
        setPoints(value);
    };

    return (
        <div className="relative flex flex-col md:flex-row items-center justify-center min-h-screen w-full">
            {isLoading && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="text-white text-2xl">Chargement...</div>
                </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <div className="absolute w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>
            <form className="relative p-10 bg-black bg-opacity-80 rounded-3xl shadow-lg overflow-y-auto w-full max-w-md md:max-w-lg lg:max-w-xl" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-6 text-white">Créer un Smash</h2>
                <label className="block text-lg mb-2 text-white">Nom:</label>
                <input
                    className="w-full p-2 mb-4 border border-gray-300 rounded bg-gray-800 text-white"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <label className="block text-lg mb-2 text-white">Âge:</label>
                <input
                    className="w-full p-2 mb-4 border border-gray-300 rounded bg-gray-800 text-white"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                />

                <label className="block text-lg mb-2 text-white">Genre:</label>
                <select
                    className="w-full p-2 mb-4 border border-gray-300 rounded bg-gray-800 text-white"
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                >
                    <option value="">Sélectionner le genre</option>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                    <option value="Autre">Autre</option>
                </select>

                {sex === 'Autre' && (
                    <input
                        className="w-full p-2 mb-4 border border-gray-300 rounded bg-gray-800 text-white"
                        type="text"
                        placeholder="Objet, Animal, Autre..."
                        value={customSex}
                        onChange={(e) => setCustomSex(e.target.value)}
                    />
                )}

                <label className="block text-lg mb-2 text-white">Points de détraquage mental:</label>
                <input
                    className="w-full p-2 mb-4 border border-gray-300 rounded bg-gray-800 text-white"
                    type="number"
                    value={points}
                    placeholder='0 - 1000'
                    min="0"
                    max="1000"
                    onChange={handleChangePoints}
                />

                <label className="block text-lg mb-2 text-white">URL de l'image:</label>
                <input
                    className="w-full p-2 mb-4 border border-gray-300 rounded bg-gray-800 text-white"
                    type="text"
                    value={urlImg}
                    onChange={(e) => setUrlImg(e.target.value)}
                />

                <button className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition duration-300 w-full" type="submit" disabled={isLoading}>
                    {isLoading ? 'Création en cours...' : 'Créer un Smash'}
                </button>

                {formError && (
                    <div className="bg-red-500 text-white p-2 mt-4 rounded justify-center text-center">
                        {formError}
                    </div>
                )}

                {error && (
                    <div className="bg-red-500 text-white p-2 mt-4 rounded justify-center text-center">
                        {error.status === 400 ? 'Le smasher existe déjà.' : error.message}
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-500 text-white p-2 mt-4 rounded justify-center text-center max-w-xs mx-auto overflow-hidden break-words">
                        {successMessage}
                    </div>
                )}
            </form>
            <div className="p-5 w-full md:w-1/2 flex items-center justify-center">
                <SmashCard
                    name={name || '[Nom]'}
                    age={age || '[Âge]'}
                    gender={sex === 'Autre' ? customSex : sex || '[Genre]'}
                    url_img={urlImg || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNNLEL-qmmLeFR1nxJuepFOgPYfnwHR56vcw&s'}
                />
            </div>
        </div>
    );
};

export default CreateSmashForm;