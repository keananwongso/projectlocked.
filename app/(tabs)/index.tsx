// Home screen - Lock In button, today status, stats
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { useStats } from '../../src/hooks/useStats';
import { StatsCard } from '../../src/components/home/StatsCard';
import { StreakDisplay } from '../../src/components/home/StreakDisplay';
import { TodayStatus } from '../../src/components/home/TodayStatus';
import { DEMO_MODE } from '../../src/utils/constants';

export default function HomeScreen() {
  const router = useRouter();
  const { profile, signOut } = useAuth();
  const { stats, todaySessions } = useStats();

  const handleLockIn = () => {
    router.push('/session/setup');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.name}>{profile?.fullName || 'User'}</Text>
          </View>
          {DEMO_MODE && (
            <View style={styles.demoBadge}>
              <Text style={styles.demoText}>DEMO</Text>
            </View>
          )}
        </View>

        {/* Streak Display */}
        <StreakDisplay
          currentStreak={stats?.currentStreak || 0}
          longestStreak={stats?.longestStreak || 0}
        />

        {/* Lock In Button */}
        <TouchableOpacity
          onPress={handleLockIn}
          style={styles.lockInButton}
          activeOpacity={0.8}
        >
          <Text style={styles.lockInEmoji}>🔒</Text>
          <Text style={styles.lockInText}>Lock In</Text>
          <Text style={styles.lockInSubtext}>Start a focused session</Text>
        </TouchableOpacity>

        {/* Today's Status */}
        <TodayStatus sessions={todaySessions} />

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatsCard
            label="Total Sessions"
            value={stats?.totalSessions || 0}
            icon="📊"
          />
          <StatsCard
            label="Minutes This Week"
            value={stats?.minutesThisWeek || 0}
            icon="⏱️"
          />
        </View>

        {/* Sign Out */}
        <TouchableOpacity onPress={signOut} style={styles.signOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  demoBadge: {
    backgroundColor: '#CA8A04',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  demoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  lockInButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 24,
    borderRadius: 20,
    marginVertical: 24,
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  lockInEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  lockInText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  lockInSubtext: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    fontSize: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  signOut: {
    marginTop: 32,
    marginBottom: 16,
    alignItems: 'center',
  },
  signOutText: {
    color: '#6B7280',
    fontSize: 16,
  },
});
