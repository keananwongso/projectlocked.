// Friend list item component
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Profile } from '../../types';

interface FriendListItemProps {
  friend: Profile;
  onRemove: () => void;
}

export function FriendListItem({ friend, onRemove }: FriendListItemProps) {
  const handleRemove = () => {
    Alert.alert(
      'Remove Friend',
      `Are you sure you want to remove @${friend.username}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: onRemove },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {friend.avatarUrl ? (
        <Image source={{ uri: friend.avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {friend.username?.[0]?.toUpperCase() || '?'}
          </Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name}>{friend.fullName}</Text>
        <Text style={styles.username}>@{friend.username}</Text>
      </View>

      <TouchableOpacity onPress={handleRemove}>
        <Text style={styles.removeText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  info: {
    flex: 1,
  },
  name: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  username: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  removeText: {
    color: '#6B7280',
  },
});
