import React, { useState } from 'react';

const CreateSmashForm = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [sex, setSex] = useState('');
    const [otherSex, setOtherSex] = useState('');
    const [points, setPoints] = useState('');
    const [urlImg, setUrlImg] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name) {
            setError('Name is required');
            return;
        }
        if (!age) {
            setError('Age is required');
            return;
        }
        if (!sex) {
            setError('Gender is required');
            return;
        }
        if (sex === 'other' && !otherSex) {
            setError('Please specify your gender');
            return;
        }
        if (!points) {
            setError('Points are required');
            return;
        }
        if (points < 0 || points > 1000) {
            setError('Points must be between 0 and 1000');
            return;
        }
        if (!urlImg) {
            setError('Image URL is required');
            return;
        }
        setError('');
        console.log({ name, age, sex: sex === 'other' ? otherSex : sex, points, urlImg });
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

            <label className="block text-lg mb-2 text-white">Gender:</label>
            <select
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
            >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>

            {sex === 'other' && (
                <input
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                    type="text"
                    placeholder="Please specify"
                    value={otherSex}
                    onChange={(e) => setOtherSex(e.target.value)}
                />
            )}

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

            {error && (
                <div className="bg-red-500 text-white p-2 mt-4 rounded justify-center text-center">
                    {error}
                </div>
            )}
        </form>
    );
};

export default CreateSmashForm;