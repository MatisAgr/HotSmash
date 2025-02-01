import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import SmashCard from '@/components/SmashCard';
import ConfirmationModal from '@/components/ConfirmationModal';
import { useSelector, useDispatch } from 'react-redux';
import { profileUser, resetStats } from '@/redux/slices/authSlice';
import RNPickerSelect from 'react-native-picker-select';

const ProfilePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeInterval, setTimeInterval] = useState('date'); // 'date', 'hour', '15min'
  const [isLoading, setIsLoading] = useState(true);
  const smashesPerPage = 4;
  const chartRef = useRef(null);

  const dispatch = useDispatch();
  const { user, pointsByDay, matches = [] } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(profileUser()).then(() => setIsLoading(false));
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile Page</Text>
      {user && (
        <>
          <View style={styles.userInfo}>
            <Text style={styles.username}>Username: {user.username}</Text>
            <Text style={styles.email}><Text style={styles.bold}>Email:</Text> {user.email}</Text>
          </View>
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsTitle}>Points de détraquage mental</Text>
            <Text style={styles.points}>{user.point}</Text>
          </View>
        </>
      )}
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Statistiques de Smashing</Text>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Intervalle de temps:</Text>
          <RNPickerSelect
            onValueChange={(value) => setTimeInterval(value)}
            items={[
              { label: 'Date', value: 'date' },
              { label: 'Heure', value: 'hour' },
              { label: '15 minutes', value: '15min' },
            ]}
            style={pickerSelectStyles}
            value={timeInterval}
          />
        </View>
        <View ref={chartRef} style={styles.chart}>
          <Text>Pas réussi à mettre un graphique en react-native</Text>
        </View>
      </View>
      <View style={styles.smashesContainer}>
        <Text style={styles.smashesTitle}>Liste des Smashes</Text>
        <View style={styles.smashesGrid}>
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
        <View style={styles.pagination}>
          <TouchableOpacity
            onPress={handlePreviousPage}
            style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
            disabled={currentPage === 1}
          >
            <Text style={styles.paginationButtonText}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNextPage}
            style={[styles.paginationButton, indexOfLastSmash >= matches.length && styles.disabledButton]}
            disabled={indexOfLastSmash >= matches.length}
          >
            <Text style={styles.paginationButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.resetContainer}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => setIsModalOpen(true)}
        >
          <Text style={styles.resetButtonText}>Reset les stats</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#1F2937',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F2937',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 16,
  },
  userInfo: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
  pointsContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  pointsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 8,
  },
  points: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  statsContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  chart: {
    width: '100%',
    height: 400,
  },
  smashesContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  smashesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  smashesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  paginationButton: {
    backgroundColor: '#3B82F6',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  paginationButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  resetContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  resetButton: {
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = {
  inputIOS: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#333',
    color: '#FFF',
    paddingRight: 30,
  },
  inputAndroid: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#333',
    color: '#FFF',
    paddingRight: 30,
  },
  inputWeb: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
      borderRadius: 5,
      backgroundColor: '#333',
      color: '#FFF',
      paddingRight: 30,
    },
};

export default ProfilePage;