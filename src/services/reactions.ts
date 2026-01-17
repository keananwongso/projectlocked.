// Reactions service
import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  getDocs,
  updateDoc,
  increment,
  serverTimestamp,
  collection,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { ReactionEmoji } from '../utils/constants';
import { Reaction } from '../types';

export async function addReaction(
  sessionId: string,
  emoji: ReactionEmoji
): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const reactionRef = doc(db, 'sessions', sessionId, 'reactions', user.uid);
  const existingReaction = await getDoc(reactionRef);

  // If already reacted, just update the emoji
  if (existingReaction.exists()) {
    await setDoc(reactionRef, {
      emoji,
      createdAt: serverTimestamp(),
    });
  } else {
    // New reaction - increment count
    await setDoc(reactionRef, {
      emoji,
      createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, 'sessions', sessionId), {
      reactionCount: increment(1),
    });
  }
}

export async function removeReaction(sessionId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const reactionRef = doc(db, 'sessions', sessionId, 'reactions', user.uid);
  const existingReaction = await getDoc(reactionRef);

  if (existingReaction.exists()) {
    await deleteDoc(reactionRef);
    await updateDoc(doc(db, 'sessions', sessionId), {
      reactionCount: increment(-1),
    });
  }
}

export async function getUserReaction(
  sessionId: string
): Promise<ReactionEmoji | null> {
  const user = auth.currentUser;
  if (!user) return null;

  const reactionRef = doc(db, 'sessions', sessionId, 'reactions', user.uid);
  const reactionDoc = await getDoc(reactionRef);

  if (reactionDoc.exists()) {
    return reactionDoc.data().emoji as ReactionEmoji;
  }
  return null;
}

export async function getSessionReactions(sessionId: string): Promise<Reaction[]> {
  const snapshot = await getDocs(
    collection(db, 'sessions', sessionId, 'reactions')
  );
  return snapshot.docs.map(
    (doc) => ({ uid: doc.id, ...doc.data() }) as Reaction
  );
}
