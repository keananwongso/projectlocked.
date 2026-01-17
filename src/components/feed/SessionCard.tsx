// Session card for feed display
import { View, Text, Image, StyleSheet } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { Session } from '../../types';
import { ReactionBar } from './ReactionBar';
import { TAG_ICONS } from '../../utils/constants';

interface SessionCardProps {
  session: Session;
}

export function SessionCard({ session }: SessionCardProps) {
  const timeAgo = session.startedAt
    ? formatDistanceToNow(session.startedAt.toDate(), { addSuffix: true })
    : 'just now';
  const isAbandoned = session.status === 'abandoned';

  return (
    <View style={[styles.card, isAbandoned && styles.cardAbandoned]}>
      {/* Header */}
      <View style={styles.header}>
        {session.avatarUrl ? (
          <Image source={{ uri: session.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {session.username?.[0]?.toUpperCase() || '?'}
            </Text>
          </View>
        )}
        <View style={styles.headerText}>
          <Text style={styles.username}>{session.username}</Text>
          <Text style={styles.time}>{timeAgo}</Text>
        </View>
        <View style={styles.tagBadge}>
          <Text style={styles.tagText}>
            {TAG_ICONS[session.tag as keyof typeof TAG_ICONS] || '✨'} {session.durationMin}m
          </Text>
        </View>
      </View>

      {/* Status */}
      {isAbandoned && (
        <View style={styles.abandonedBadge}>
          <Text style={styles.abandonedText}>Abandoned</Text>
        </View>
      )}

      {/* Note */}
      {session.note ? <Text style={styles.note}>{session.note}</Text> : null}

      {/* Proof Photos */}
      {(session.beforeProofUrl || session.afterProofUrl) && (
        <View style={styles.proofContainer}>
          {session.beforeProofUrl && (
            <View style={styles.proofWrapper}>
              <Text style={styles.proofLabel}>Before</Text>
              <Image
                source={{ uri: session.beforeProofUrl }}
                style={styles.proofImage}
                resizeMode="cover"
              />
            </View>
          )}
          {session.afterProofUrl && (
            <View style={styles.proofWrapper}>
              <Text style={styles.proofLabel}>After</Text>
              <Image
                source={{ uri: session.afterProofUrl }}
                style={styles.proofImage}
                resizeMode="cover"
              />
            </View>
          )}
        </View>
      )}

      {/* Reactions */}
      <ReactionBar sessionId={session.id} reactionCount={session.reactionCount || 0} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1F2937',
    borderRadius: 20,
    padding: 16,
  },
  cardAbandoned: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerText: {
    flex: 1,
  },
  username: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  time: {
    color: '#6B7280',
    fontSize: 14,
  },
  tagBadge: {
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  tagText: {
    color: '#D1D5DB',
    fontSize: 14,
  },
  abandonedBadge: {
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  abandonedText: {
    color: '#F87171',
    fontSize: 14,
  },
  note: {
    color: '#D1D5DB',
    marginBottom: 12,
    fontSize: 15,
    lineHeight: 22,
  },
  proofContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  proofWrapper: {
    flex: 1,
  },
  proofLabel: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 4,
  },
  proofImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
  },
});
