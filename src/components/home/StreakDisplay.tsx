// Streak display component
import { View, Text, StyleSheet } from 'react-native';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakDisplay({ currentStreak, longestStreak }: StreakDisplayProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.label}>Current Streak</Text>
        <View style={styles.streakRow}>
          <Text style={styles.streakNumber}>{currentStreak}</Text>
          <Text style={styles.fireEmoji}>🔥</Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.label}>Best</Text>
        <Text style={styles.bestNumber}>{longestStreak}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EA580C',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {},
  rightSection: {
    alignItems: 'flex-end',
  },
  label: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  streakNumber: {
    fontSize: 56,
    fontWeight: 'bold',
    color: 'white',
  },
  fireEmoji: {
    fontSize: 24,
    marginLeft: 4,
  },
  bestNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
});
