// Friends service
import {
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Profile } from '../types';

export async function addFriend(username: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  // Look up user by username
  const usernameDoc = await getDoc(doc(db, 'usernames', username.toLowerCase()));
  if (!usernameDoc.exists()) {
    throw new Error('User not found');
  }

  const friendUid = usernameDoc.data().uid;

  if (friendUid === user.uid) {
    throw new Error('Cannot add yourself as a friend');
  }

  // Check if already friends
  const existingFriend = await getDoc(doc(db, 'friends', user.uid, 'list', friendUid));
  if (existingFriend.exists()) {
    throw new Error('Already friends with this user');
  }

  // Add to friends subcollection (bidirectional)
  await setDoc(doc(db, 'friends', user.uid, 'list', friendUid), {
    createdAt: serverTimestamp(),
  });

  // Also add reverse relationship
  await setDoc(doc(db, 'friends', friendUid, 'list', user.uid), {
    createdAt: serverTimestamp(),
  });
}

export async function removeFriend(friendUid: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  await deleteDoc(doc(db, 'friends', user.uid, 'list', friendUid));
  await deleteDoc(doc(db, 'friends', friendUid, 'list', user.uid));
}

export async function getFriendIds(): Promise<string[]> {
  const user = auth.currentUser;
  if (!user) return [];

  const snapshot = await getDocs(collection(db, 'friends', user.uid, 'list'));
  return snapshot.docs.map((doc) => doc.id);
}

export async function getFriendsWithProfiles(): Promise<Profile[]> {
  const friendIds = await getFriendIds();
  if (friendIds.length === 0) return [];

  // Batch fetch profiles
  const profiles: Profile[] = [];
  for (const friendId of friendIds) {
    const profileDoc = await getDoc(doc(db, 'profiles', friendId));
    if (profileDoc.exists()) {
      profiles.push({ uid: friendId, ...profileDoc.data() } as Profile);
    }
  }

  return profiles;
}
