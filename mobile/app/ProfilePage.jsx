import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity, Picker } from 'react-native';
import SmashCard from '../components/SmashCard';
import ConfirmationModal from '../components/ConfirmationModal';
import { useSelector, useDispatch } from 'react-redux';
import { profileUser, resetStats } from '../redux/slices/authSlice';
import { TailwindProvider } from 'tailwindcss-react-native';

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
    <TailwindProvider>
      <ScrollView className="container mx-auto p-4">
        <Text className="text-4xl font-bold mb-4 text-white">Profile Page</Text>
        {user && (
          <>
            <View className="bg-white shadow-md rounded p-4 mb-6 text-center">
              <Text className="text-3xl font-bold">Username: {user.username}</Text>
              <Text className="text-2xl"><Text className="font-bold">Email:</Text> {user.email}</Text>
            </View>
            <View className="bg-white shadow-md rounded p-4 mb-6 text-center">
              <Text className="text-4xl font-bold mb-4 text-purple-600">Points de détraquage mental</Text>
              <Text className="text-6xl font-bold text-purple-800">{user.point}</Text>
            </View>
          </>
        )}
        <View className="bg-white shadow-md rounded p-4 mb-6">
          <Text className="text-2xl font-bold mb-4">Statistiques de Smashing</Text>
          <View className="mb-4">
            <Text className="mr-2">Intervalle de temps:</Text>
            <Picker
              selectedValue={timeInterval}
              onValueChange={(itemValue) => setTimeInterval(itemValue)}
              className="p-2 border rounded"
            >
              <Picker.Item label="Date" value="date" />
              <Picker.Item label="Heure" value="hour" />
              <Picker.Item label="15 minutes" value="15min" />
            </Picker>
          </View>
          <View ref={chartRef} style={{ width: '100%', height: 400 }}></View>
        </View>
        <View className="bg-white shadow-md rounded p-4">
          <Text className="text-2xl font-bold mb-4">Liste des Smashes</Text>
          <View className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
          </View>
          <View className="flex justify-between mt-4">
            <TouchableOpacity
              onPress={handlePreviousPage}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={currentPage === 1}
            >
              Previous
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleNextPage}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={indexOfLastSmash >= matches.length}
            >
              Next
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex justify-center mt-6">
          <TouchableOpacity
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg focus:outline-none focus:shadow-outline text-3xl"
            onPress={() => setIsModalOpen(true)}
          >
            Reset les stats
          </TouchableOpacity>
        </View>
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => {
            handleReset();
            setIsModalOpen(false);
          }}
        />
      </ScrollView>
    </TailwindProvider>
  );
};

export default ProfilePage;