import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type StatHeartsProps = {
  label: string;
  value: number;
};

const StatHearts: React.FC<StatHeartsProps> = ({ label, value }) => {
  const filledHearts = (value / 100) * 3;
  const hearts = [];

  for (let i = 0; i < 3; i++) {
    const filled = filledHearts - i;
    if (filled >= 1) {
      hearts.push(<Ionicons key={i} name="heart" size={24} color="#FF6499" style={styles.heart} />);
    } else if (filled > 0) {
      hearts.push(
        <View key={i} style={styles.heart}>
          <Ionicons name="heart-outline" size={24} color="#FF6499" />
          <View style={[styles.partialFill, { width: `${filled * 100}%` }]}>
            <Ionicons name="heart" size={24} color="#FF6499" />
          </View>
        </View>
      );
    } else {
      hearts.push(<Ionicons key={i} name="heart-outline" size={24} color="#FF6499" style={styles.heart} />);
    }
  }

  return (
    <View style={styles.statItem}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.heartsContainer}>{hearts}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  statItem: {
    alignItems: 'center',
    margin: 8,
    minWidth: 80,
  },
  statLabel: {
    fontSize: 14,
    color: '#4B3A73',
    marginBottom: 4,
    fontWeight: '600',
  },
  heartsContainer: {
    flexDirection: 'row',
  },
  heart: {
    marginHorizontal: 2,
  },
  partialFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
});

export default StatHearts;
