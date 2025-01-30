import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../../redux/slices/postSlice';

export default function CreatePostModal({ isOpen, onClose }) {
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.posts);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [alert, setAlert] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createPost({ title, content, author: 'JULIEN FAIS TON TAFF STP' })).unwrap();
            setAlert({ type: 'success', message: 'Post créé avec succès!' });
            setTitle('');
            setContent('');
            onClose();
        } catch (err) {
            setAlert({ type: 'error', message: err.message || 'Erreur lors de la création du post' });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 w-1/2">
                <h2 className="text-2xl mb-4">Créer un Post</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Titre</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Contenu</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            maxLength={140}
                            rows={5}
                            style={{ resize: 'none' }}
                            className="w-full px-3 py-2 border rounded"
                            disabled={isLoading}
                        ></textarea>
                        <div className="text-right text-sm text-gray-500">
                            {content.length}/140 caractères
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="mr-2 px-4 py-2 bg-gray-300 rounded"
                            disabled={isLoading}
                        >
                            Fermer
                        </button>
                        <button
                            type="submit"
                            className={`px-4 py-2 bg-blue-500 text-white rounded flex items-center justify-center ${
                                isLoading ? 'cursor-not-allowed opacity-50' : ''
                            }`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5 mr-3 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8H4z"
                                        ></path>
                                    </svg>
                                    Création...
                                </>
                            ) : (
                                'Créer'
                            )}
                        </button>
                    </div>
                </form>
                {alert && (
                    <div
                        className={`p-2 mt-4 w-full text-sm ${
                            alert.type === 'error'
                                ? 'text-red-700 bg-red-100'
                                : 'text-green-700 bg-green-100'
                        } rounded-lg`}
                        role="alert"
                    >
                        {alert.message}
                    </div>
                )}
                {error && error.message && (
                    <div
                        className="p-2 mt-4 w-full text-sm text-red-700 bg-red-100 rounded-lg"
                        role="alert"
                    >
                        {error.message}
                    </div>
                )}
            </div>
        </div>
    );
}