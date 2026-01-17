// Session flow as modal stack
import { Stack } from 'expo-router';

export default function SessionLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: 'modal',
        headerStyle: { backgroundColor: '#111827' },
        headerTintColor: '#FFFFFF',
        headerShadowVisible: false,
        contentStyle: { backgroundColor: '#111827' },
      }}
    >
      <Stack.Screen
        name="setup"
        options={{ title: 'Start a Lock-In' }}
      />
      <Stack.Screen
        name="active"
        options={{
          title: 'Locked In',
          headerBackVisible: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="proof"
        options={{
          title: 'Capture Proof',
          headerBackVisible: false,
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}
