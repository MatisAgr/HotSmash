import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FaUserCircle } from 'react-icons/fa';

const ConnectedUserCard = ({ username, points, smashesToDo }) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.section}>
          <FaUserCircle style={styles.icon} />
          <View>
            <Text style={styles.title}>Username</Text>
            <Text style={styles.value}>{username}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>Points</Text>
          <Text style={styles.value}>{points}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>Smashes</Text>
          <Text style={styles.value}>{smashesToDo}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#BFDBFE',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  section: {
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 8,
    width: '30%',
    alignItems: 'center',
  },
  icon: {
    fontSize: 48,
    color: '#3B82F6',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  value: {
    fontSize: 16,
    color: 'white',
  },
});

export default ConnectedUserCard;