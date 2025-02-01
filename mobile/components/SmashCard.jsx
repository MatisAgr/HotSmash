import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

export default function SmashCard({ name, age, gender, url_img, points, type, date, size = 'normal' }) {
  const isSmall = size === 'small';
  const formattedDate = date ? new Date(date).toLocaleString() : null;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(1) }],
    };
  });

  return (
    <Animated.View
      style={[styles.card, isSmall ? styles.smallCard : styles.largeCard, animatedStyle]}
      onTouchStart={() => {
        animatedStyle.transform = [{ scale: withSpring(1.05) }];
      }}
      onTouchEnd={() => {
        animatedStyle.transform = [{ scale: withSpring(1) }];
      }}
    >
      {formattedDate && (
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
      )}
      <Image
        style={[styles.image, isSmall ? styles.smallImage : styles.largeImage]}
        source={{ uri: url_img }}
        alt={name}
      />
      <View style={styles.infoContainer}>
        <Text style={[styles.name, isSmall ? styles.smallText : styles.largeText]}>
          {name}, {age} ans
        </Text>
        <Text style={[styles.gender, isSmall ? styles.smallText : styles.largeText]}>
          {gender}
        </Text>
        {points !== undefined && (
          <View style={[styles.pointsContainer, type === 1 ? styles.positivePoints : styles.negativePoints]}>
            <Text style={styles.pointsText}>
              {type === 1 ? `+${points}` : `-${points}`} points
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  smallCard: {
    width: 200,
  },
  largeCard: {
    width: 320,
  },
  dateContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#3B82F6',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  dateText: {
    color: 'white',
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    resizeMode: 'cover',
  },
  smallImage: {
    height: 200,
  },
  largeImage: {
    height: 320,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  name: {
    color: 'white',
    fontWeight: 'bold',
  },
  gender: {
    color: 'white',
    marginTop: 5,
  },
  smallText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 24,
  },
  pointsContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  positivePoints: {
    backgroundColor: '#EF4444',
  },
  negativePoints: {
    backgroundColor: '#10B981',
  },
  pointsText: {
    color: 'white',
    fontWeight: 'bold',
  },
});