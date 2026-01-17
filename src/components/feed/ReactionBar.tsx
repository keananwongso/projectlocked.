// Reaction bar component
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { REACTION_EMOJIS, ReactionEmoji } from '../../utils/constants';
import { addReaction, removeReaction, getUserReaction } from '../../services/reactions';

interface ReactionBarProps {
  sessionId: string;
  reactionCount: number;
}

export function ReactionBar({ sessionId, reactionCount }: ReactionBarProps) {
  const [userReaction, setUserReaction] = useState<ReactionEmoji | null>(null);
  const [localCount, setLocalCount] = useState(reactionCount);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    getUserReaction(sessionId).then(setUserReaction);
  }, [sessionId]);

  const handleReaction = async (emoji: ReactionEmoji) => {
    try {
      if (userReaction === emoji) {
        // Remove reaction
        await removeReaction(sessionId);
        setUserReaction(null);
        setLocalCount((c) => c - 1);
      } else {
        // Add or change reaction
        const hadReaction = userReaction !== null;
        await addReaction(sessionId, emoji);
        setUserReaction(emoji);
        if (!hadReaction) {
          setLocalCount((c) => c + 1);
        }
      }
    } catch (error) {
      console.error('Reaction error:', error);
    }
    setShowPicker(false);
  };

  return (
    <View>
      <View style={styles.mainRow}>
        <TouchableOpacity
          onPress={() => setShowPicker(!showPicker)}
          style={[styles.reactButton, userReaction && styles.reactButtonActive]}
        >
          {userReaction ? (
            <>
              <Text style={styles.emoji}>{userReaction}</Text>
              <Text style={styles.reactedText}>You reacted</Text>
            </>
          ) : (
            <Text style={styles.reactText}>React</Text>
          )}
        </TouchableOpacity>

        {localCount > 0 && (
          <Text style={styles.count}>
            {localCount} reaction{localCount !== 1 ? 's' : ''}
          </Text>
        )}
      </View>

      {showPicker && (
        <View style={styles.picker}>
          {REACTION_EMOJIS.map((emoji) => (
            <TouchableOpacity
              key={emoji}
              onPress={() => handleReaction(emoji)}
              style={[
                styles.emojiButton,
                userReaction === emoji && styles.emojiButtonActive,
              ]}
            >
              <Text style={styles.pickerEmoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  reactButtonActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.3)',
  },
  emoji: {
    fontSize: 16,
    marginRight: 4,
  },
  reactText: {
    color: '#9CA3AF',
  },
  reactedText: {
    color: '#818CF8',
    fontSize: 14,
  },
  count: {
    color: '#6B7280',
    fontSize: 14,
  },
  picker: {
    flexDirection: 'row',
    marginTop: 12,
    backgroundColor: '#374151',
    borderRadius: 9999,
    padding: 8,
  },
  emojiButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    marginHorizontal: 2,
  },
  emojiButtonActive: {
    backgroundColor: '#6366F1',
  },
  pickerEmoji: {
    fontSize: 20,
  },
});
