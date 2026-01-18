import { Ionicons } from '@expo/vector-icons';
import { Animated, Pressable, GestureResponderEvent } from 'react-native';
import { useRef } from 'react';

interface AnimatedCameraButtonProps {
  onPress?: (e: GestureResponderEvent) => void;
}

export function AnimatedCameraButton({ onPress }: AnimatedCameraButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.8,
        useNativeDriver: true,
        friction: 3,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.7,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 3,
        tension: 100,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: '#FFFFFF',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 14,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 10,
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Ionicons name="camera" size={28} color="#000000" />
      </Animated.View>
    </Pressable>
  );
}
