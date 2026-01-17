// Timer display component
import { View, Text, StyleSheet } from 'react-native';

interface TimerProps {
  secondsRemaining: number;
}

export function Timer({ secondsRemaining }: TimerProps) {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  // Color based on time remaining
  const getColor = () => {
    if (secondsRemaining <= 60) return '#F87171'; // red
    if (secondsRemaining <= 300) return '#FBBF24'; // yellow
    return '#FFFFFF';
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.time, { color: getColor() }]}>{formattedTime}</Text>
      <Text style={styles.label}>remaining</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  time: {
    fontSize: 72,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  label: {
    color: '#6B7280',
    marginTop: 8,
    fontSize: 16,
  },
});
