// Friends hook
import { useState, useEffect, useCallback } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import {
  addFriend as addFriendService,
  removeFriend as removeFriendService,
  getFriendsWithProfiles,
} from '../services/friends';
import { Profile } from '../types';

export function useFriends() {
  const [friends, setFriends] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    // Listen to changes in friends list
    const unsubscribe = onSnapshot(
      collection(db, 'friends', user.uid, 'list'),
      async () => {
        // When friends list changes, reload profiles
        try {
          const profiles = await getFriendsWithProfiles();
          setFriends(profiles);
        } catch (error) {
          console.error('Failed to load friends:', error);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Friends snapshot error:', error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const addFriend = useCallback(async (username: string) => {
    await addFriendService(username);
  }, []);

  const removeFriend = useCallback(async (friendUid: string) => {
    await removeFriendService(friendUid);
  }, []);

  return { friends, loading, addFriend, removeFriend };
}
