import React, { useState } from 'react';

const CreateSmashForm = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [sex, setSex] = useState('');
    const [points, setPoints] = useState('');
    const [urlImg, setUrlImg] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log({ name, age, sex, points, urlImg });
    };

    return (
        <form className="p-5" onSubmit={handleSubmit}>
            <label className="block text-lg mb-2 text-white">Name:</label>
            <input
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <label className="block text-lg mb-2 text-white">Age:</label>
            <input
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
            />

            <label className="block text-lg mb-2 text-white">Sex:</label>
            <input
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                type="text"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
            />

            <label className="block text-lg mb-2 text-white">Points (0-1000):</label>
            <input
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
            />

            <label className="block text-lg mb-2 text-white">Image URL:</label>
            <input
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                type="text"
                value={urlImg}
                onChange={(e) => setUrlImg(e.target.value)}
            />

            <button className="bg-blue-500 text-white py-2 px-4 rounded" type="submit">
                Create Smash
            </button>
        </form>
    );
};

export default CreateSmashForm;