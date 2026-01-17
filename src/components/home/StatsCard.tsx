// Stats card for home screen
import { View, Text, StyleSheet } from 'react-native';

interface StatsCardProps {
  label: string;
  value: number;
  icon: string;
}

export function StatsCard({ label, value, icon }: StatsCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    marginBottom: 12,
  },
  icon: {
    fontSize: 24,
    marginBottom: 8,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  label: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4,
  },
});
