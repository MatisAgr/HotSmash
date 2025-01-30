import React, { useEffect, useState, useRef } from 'react';
import SmashCard from '../../components/Card/SmashCard';
import ConfirmationModal from '../../components/Modal/ConfirmationModal';
import * as echarts from 'echarts';

const ProfilePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const smashesPerPage = 5;
  const chartRef = useRef(null);

  // Données statiques pour l'utilisateur
  const user = {
    username: 'JohnDoe',
    email: 'john.doe@example.com',
  };

  // Données statiques pour les smashes
  const [smashes, setSmashes] = useState([
    { id: 1, name: 'Smash 1', age: 25, gender: 'Homme', points: 200, date: '2023-10-01', url_img: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Smash 2', age: 30, gender: 'Femme', points: 300, date: '2023-10-02', url_img: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Smash 3', age: 22, gender: 'Autre', points: 350, date: '2023-10-03', url_img: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Smash 4', age: 28, gender: 'Homme', points: 400, date: '2023-10-04', url_img: 'https://via.placeholder.com/150' },
    { id: 5, name: 'Smash 5', age: 27, gender: 'Femme', points: 560, date: '2023-10-05', url_img: 'https://via.placeholder.com/150' },
    { id: 6, name: 'Smash 6', age: 24, gender: 'Autre', points: 789, date: '2023-10-06', url_img: 'https://via.placeholder.com/150' },
  ]);

  const totalPoints = smashes.reduce((total, smash) => total + smash.points, 0);

  useEffect(() => {
    if (smashes.length > 0) {
      const chart = echarts.init(chartRef.current);
      const option = {
        title: {
          text: 'Points de Démence par Date',
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          data: smashes.map((smash) => smash.date),
        },
        yAxis: {
          type: 'value',
          min: 0,
        },
        series: [
          {
            name: 'Points de Démence',
            type: 'line',
            data: smashes.map((smash) => smash.points),
          },
        ],
      };
      chart.setOption(option);
    }
  }, [smashes]);

  const indexOfLastSmash = currentPage * smashesPerPage;
  const indexOfFirstSmash = indexOfLastSmash - smashesPerPage;
  const currentSmashes = smashes.slice(indexOfFirstSmash, indexOfLastSmash);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleReset = () => {
    setSmashes([]);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4 text-white">Profile Page</h1>
      {user && (
        <div className="bg-white shadow-md rounded p-4 mb-6 text-center">
          <p className="text-3xl font-bold">Username: {user.username}</p>
          <p className="text-2xl"><strong>Email:</strong> {user.email}</p>
        </div>
      )}
      <div className="bg-white shadow-md rounded p-4 mb-6 text-center">
        <h2 className="text-4xl font-bold mb-4 text-purple-600">Points de Démence</h2>
        <p className="text-6xl font-bold text-purple-800">{totalPoints}</p>
      </div>
      <div className="bg-white shadow-md rounded p-4 mb-6">
        <h2 className="text-2xl font-bold mb-4">Statistiques de Smashing</h2>
        <div ref={chartRef} style={{ width: '100%', height: '400px' }}></div>
      </div>
      <div className="bg-white shadow-md rounded p-4">
        <h2 className="text-2xl font-bold mb-4">Liste des Smashes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentSmashes.map((smash) => (
            <SmashCard
              key={smash.id}
              name={smash.name}
              age={smash.age}
              gender={smash.gender}
              url_img={smash.url_img}
            />
          ))}
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePreviousPage}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={indexOfLastSmash >= smashes.length}
          >
            Next
          </button>
        </div>
      </div>
      <div className="flex justify-center mt-6">
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg focus:outline-none focus:shadow-outline text-3xl"
          onClick={() => setIsModalOpen(true)}
        >
          Reset les stats
        </button>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          handleReset();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default ProfilePage;