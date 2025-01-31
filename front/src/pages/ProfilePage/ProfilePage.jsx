import React, { useEffect, useState, useRef } from 'react';
import SmashCard from '../../components/Card/SmashCard';
import ConfirmationModal from '../../components/Modal/ConfirmationModal';
import * as echarts from 'echarts';
import { useSelector, useDispatch } from 'react-redux';
import { profileUser, resetStats } from '../../redux/slices/authSlice';

const ProfilePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeInterval, setTimeInterval] = useState('date'); // 'date', 'hour', '15min'
  const smashesPerPage = 4;
  const chartRef = useRef(null);

  const dispatch = useDispatch();
  const { user, pointsByDay, matches = [] } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(profileUser());
  }, [dispatch]);

  const totalPoints = matches.reduce((total, match) => total + (match.type === 1 ? match.points : -match.points), 0);

  console.log('les likes: ', matches);

  const groupPointsByInterval = (matches, interval) => {
    return matches.reduce((acc, match) => {
      const date = new Date(match.date);
      let key;
      if (interval === 'date') {
        key = date.toISOString().split('T')[0];
      } else if (interval === 'hour') {
        key = date.toISOString().split(':')[0];
      } else if (interval === '15min') {
        const minutes = Math.floor(date.getMinutes() / 15) * 15;
        key = `${date.toISOString().split(':')[0]}:${minutes.toString().padStart(2, '0')}`;
      }
      const points = match.type === 1 ? match.points : -match.points;
      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key] += points;
      return acc;
    }, {});
  };

  const groupedPoints = groupPointsByInterval(matches, timeInterval);

  useEffect(() => {
    if (groupedPoints && Object.keys(groupedPoints).length > 0) {
      const chart = echarts.init(chartRef.current);
      const option = {
        title: {
          text: 'Points de détraquage mental par intervalle',
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          data: Object.keys(groupedPoints),
        },
        yAxis: {
          type: 'value',
          min: 0,
        },
        series: [
          {
            name: 'Points de détraquage mental',
            type: 'line',
            data: Object.values(groupedPoints),
          },
        ],
      };
      chart.setOption(option);
    }
  }, [groupedPoints]);

  const indexOfLastSmash = currentPage * smashesPerPage;
  const indexOfFirstSmash = indexOfLastSmash - smashesPerPage;
  const currentSmashes = matches.slice(indexOfFirstSmash, indexOfLastSmash);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleReset = () => {
    dispatch(resetStats());
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4 text-white">Profile Page</h1>
      {user && (
        <>
          <div className="bg-white shadow-md rounded p-4 mb-6 text-center">
            <p className="text-3xl font-bold">Username: {user.username}</p>
            <p className="text-2xl"><strong>Email:</strong> {user.email}</p>
          </div>
          <div className="bg-white shadow-md rounded p-4 mb-6 text-center">
            <h2 className="text-4xl font-bold mb-4 text-purple-600">Points de détraquage mental</h2>
            <p className="text-6xl font-bold text-purple-800">{user.point}</p>
          </div>
        </>
      )}
      <div className="bg-white shadow-md rounded p-4 mb-6">
        <h2 className="text-2xl font-bold mb-4">Statistiques de Smashing</h2>
        <div className="mb-4">
          <label htmlFor="timeInterval" className="mr-2">Intervalle de temps:</label>
          <select
            id="timeInterval"
            value={timeInterval}
            onChange={(e) => setTimeInterval(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="date">Date</option>
            <option value="hour">Heure</option>
            <option value="15min">15 minutes</option>
          </select>
        </div>
        <div ref={chartRef} style={{ width: '100%', height: '400px' }}></div>
      </div>
      <div className="bg-white shadow-md rounded p-4">
        <h2 className="text-2xl font-bold mb-4">Liste des Smashes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentSmashes.map((smash) => (
            <SmashCard
              key={smash.matchId}
              name={smash.name}
              age={smash.age}
              gender={smash.gender}
              url_img={smash.url_img}
              points={smash.points}
              type={smash.type}
              date={smash.date} // Pass the date to SmashCard
              size='small'
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
            disabled={indexOfLastSmash >= matches.length}
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