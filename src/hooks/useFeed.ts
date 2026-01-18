// Feed hook - fetches friend sessions with pagination
import { useState, useEffect, useCallback } from 'react';
import { DocumentSnapshot } from 'firebase/firestore';
import { getFriendIds } from '../services/friends';
import { getFriendsSessions, subscribeToFriendsSessions } from '../services/sessions';
import { Session } from '../types';
import { auth } from '../services/firebase';

export function useFeed() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [friendIds, setFriendIds] = useState<string[]>([]);

  // Fetch friend IDs on mount
  useEffect(() => {
    async function fetchIds() {
      try {
        const ids = await getFriendIds();
        if (auth.currentUser) {
          ids.push(auth.currentUser.uid);
        }
        setFriendIds(ids);
      } catch (error) {
        console.error('Failed to load friend IDs:', error);
      }
    }
    fetchIds();
  }, []);

  // Subscribe to feed when friendIds are available
  useEffect(() => {
    if (friendIds.length === 0) {
      if (!loading && friendIds.length === 0) {
        setSessions([]);
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToFriendsSessions(
      friendIds,
      ({ sessions: newSessions, lastDoc: newLastDoc }) => {
        setSessions(newSessions);
        setLastDoc(newLastDoc);
        setHasMore(newSessions.length === 20);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [friendIds]);

  const refresh = useCallback(async () => {
    // With real-time listener, refresh is less critical, but we can re-fetch friend IDs
    // to trigger a re-subscription in case friendship status changed.
    setLoading(true);
    const ids = await getFriendIds();
    if (auth.currentUser) ids.push(auth.currentUser.uid);
    setFriendIds(ids);
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading || !lastDoc) return;

    // "Load More" is tricky with real-time. 
    // If we are strictly real-time for the head, loading more static pages is the safest hybrid.
    // We use the existing one-time fetch for older pages.
    setLoading(true);
    try {
      const { sessions: newSessions, lastDoc: newLastDoc } =
        await getFriendsSessions(friendIds, 20, lastDoc);

      // Filter out any duplicates that might have shifted down
      setSessions((prev) => {
        const existingIds = new Set(prev.map(s => s.id));
        const uniqueNewSessions = newSessions.filter(s => !existingIds.has(s.id));
        return [...prev, ...uniqueNewSessions];
      });

      setLastDoc(newLastDoc);
      setHasMore(newSessions.length === 20);
    } catch (error) {
      console.error('Failed to load more:', error);
    } finally {
      setLoading(false);
    }
  }, [friendIds, hasMore, loading, lastDoc]);

  return { sessions, loading, refresh, loadMore, hasMore };
}
