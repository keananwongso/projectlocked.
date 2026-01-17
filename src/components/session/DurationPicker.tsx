// Duration preset picker
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DEMO_MODE } from '../../utils/constants';

interface DurationPickerProps {
  presets: number[];
  selected: number;
  onSelect: (duration: number) => void;
}

export function DurationPicker({ presets, selected, onSelect }: DurationPickerProps) {
  return (
    <View style={styles.container}>
      {presets.map((duration) => (
        <TouchableOpacity
          key={duration}
          onPress={() => onSelect(duration)}
          style={[
            styles.button,
            selected === duration && styles.buttonSelected,
          ]}
        >
          <Text
            style={[
              styles.number,
              selected === duration && styles.numberSelected,
            ]}
          >
            {duration}
          </Text>
          <Text
            style={[
              styles.unit,
              selected === duration && styles.unitSelected,
            ]}
          >
            {DEMO_MODE ? 'min' : 'min'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#1F2937',
    alignItems: 'center',
  },
  buttonSelected: {
    backgroundColor: '#6366F1',
  },
  number: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
  numberSelected: {
    color: 'white',
  },
  unit: {
    fontSize: 14,
    color: '#6B7280',
  },
  unitSelected: {
    color: 'rgba(255,255,255,0.7)',
  },
});
