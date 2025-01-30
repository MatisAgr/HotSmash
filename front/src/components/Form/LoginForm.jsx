import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/slices/authSlice';
import { initiateWebSocket } from '../../redux/slices/onlineUsersSlice'; // Ajout
import { useNavigate } from "react-router-dom";

import Input from '../Inputs/Input';

export default function LoginForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isLoading, error, token } = useSelector((state) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        if (token) {
            dispatch(initiateWebSocket()); // Ajout
            setAlert({ type: 'success', message: 'Connexion réussie ! Redirection vers le profil...' });
            setTimeout(() => {
                navigate("/profile");
            }, 2000);
        }
    }, [token, navigate, dispatch]);

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
        <>
            <div className='flex flex-col items-center justify-center rounded-3xl p-5 bg-gray-900 shadow-md w-1/3'>
                <h1 className='text-4xl font-bold text-white mb-5'>Login</h1>
                <Input label='Email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Entrez votre email' />
                <Input label='Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Entrez votre mot de passe' />

                <button
                    className={`bg-blue-500 text-white p-2 rounded-md w-full mt-5 text-center justify-center ${!email || !password ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleLogin}
                    disabled={isLoading || !email || !password}
                >
                    {isLoading ? 
                        <div role="status" className="flex items-center justify-center">
                            <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                        : 'Login'}
                </button>                
                {alert && (
                    <div className={`p-2 mt-4 w-full text-sm ${alert.type === 'error' ? 'text-red-700 bg-red-100' : 'text-green-700 bg-green-100'} rounded-lg`} role="alert">
                        {alert.message}
                    </div>
                )}
            </div>
        </>
    );
}