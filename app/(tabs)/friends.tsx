// Friends screen - Add by username, list friends
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useFriends } from '../../src/hooks/useFriends';
import { FriendListItem } from '../../src/components/friends/FriendListItem';

export default function FriendsScreen() {
  const { friends, loading, addFriend, removeFriend } = useFriends();
  const [searchUsername, setSearchUsername] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAddFriend = async () => {
    if (!searchUsername.trim()) return;

    setAdding(true);
    try {
      await addFriend(searchUsername.toLowerCase());
      setSearchUsername('');
      Alert.alert('Success', 'Friend added!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not add friend');
    } finally {
      setAdding(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Friends</Text>
        </View>

        {/* Add Friend Section */}
        <View style={styles.addSection}>
          <Text style={styles.addTitle}>Add Friend</Text>
          <View style={styles.addRow}>
            <View style={styles.inputWrapper}>
              <Text style={styles.atSymbol}>@</Text>
              <TextInput
                value={searchUsername}
                onChangeText={(text) =>
                  setSearchUsername(text.toLowerCase().replace(/[^a-z0-9_]/g, ''))
                }
                placeholder="username"
                placeholderTextColor="#6B7280"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />
            </View>
            <TouchableOpacity
              onPress={handleAddFriend}
              disabled={adding || !searchUsername.trim()}
              style={[
                styles.addButton,
                !searchUsername.trim() && styles.addButtonDisabled,
              ]}
            >
              <Text style={styles.addButtonText}>{adding ? '...' : 'Add'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Friends List */}
        <FlatList
          data={friends}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <FriendListItem
              friend={item}
              onRemove={() => removeFriend(item.uid)}
            />
          )}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>👋</Text>
              <Text style={styles.emptyTitle}>No friends yet</Text>
              <Text style={styles.emptySubtitle}>
                Add friends by their username to see their lock-ins
              </Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  addSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  addTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  addRow: {
    flexDirection: 'row',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  atSymbol: {
    color: '#6B7280',
    fontSize: 16,
  },
  input: {
    flex: 1,
    color: 'white',
    paddingVertical: 12,
    paddingHorizontal: 4,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#6366F1',
    marginLeft: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#374151',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  separator: {
    height: 12,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#6B7280',
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtitle: {
    color: '#4B5563',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
