import React, { useEffect, useState, useRef } from 'react';
import SmashCard from '../../components/Card/SmashCard';
import ConfirmationModal from '../../components/Modal/ConfirmationModal';
import * as echarts from 'echarts';
import { useSelector, useDispatch } from 'react-redux';
import { profileUser } from '../../redux/slices/authSlice';
import { getLikesByUserId } from '../../redux/slices/smashSlice';

const ProfilePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [smashes, setSmashes] = useState([]);
  const smashesPerPage = 4;
  const chartRef = useRef(null);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(profileUser());
    setSmashes(dispatch(getLikesByUserId()));
  }, [dispatch]);
  


  const totalPoints = smashes.reduce((total, smash) => total + smash.points, 0);

  useEffect(() => {
    if (smashes.length > 0) {
      const chart = echarts.init(chartRef.current);
      const option = {
        title: {
          text: 'Points de détraquage mental par date',
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
            name: 'Points de détraquage mental',
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

  const handleIncreasePoints = (id) => {
    setSmashes((prevSmashes) =>
      prevSmashes.map((smash) =>
        smash.id === id ? { ...smash, points: smash.points + 1 } : smash
      )
    );
  };

  const handleDecreasePoints = (id) => {
    setSmashes((prevSmashes) =>
      prevSmashes.map((smash) =>
        smash.id === id ? { ...smash, points: Math.max(smash.points - 1, 0) } : smash
      )
    );
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
        <h2 className="text-4xl font-bold mb-4 text-purple-600">Points de détraquage mental</h2>
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
              points={smash.points}
              size='small'
              onIncrease={() => handleIncreasePoints(smash.id)}
              onDecrease={() => handleDecreasePoints(smash.id)}
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