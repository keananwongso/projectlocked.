// Auth state hook with profile loading
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { onSnapshot, doc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { Profile } from '../types';
import {
  signInWithGoogle,
  signOut,
  createProfile,
  configureGoogleSignIn,
} from '../services/auth';

// Google Web Client ID - replace with your actual client ID
const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
  'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';

// Initialize Google Sign-In configuration
let googleConfigured = false;

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  setupProfile: (username: string, fullName: string) => Promise<void>;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Configure Google Sign-In once
  useEffect(() => {
    if (!googleConfigured) {
      configureGoogleSignIn(GOOGLE_WEB_CLIENT_ID);
      googleConfigured = true;
    }
  }, []);

  // Listen to auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setProfile(null);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  // Listen to profile when user is signed in
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      doc(db, 'profiles', user.uid),
      (docSnap) => {
        if (docSnap.exists()) {
          setProfile({ uid: user.uid, ...docSnap.data() } as Profile);
        } else {
          setProfile(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Profile snapshot error:', error);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [user]);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
      setLoading(false);
      throw error;
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const setupProfile = async (username: string, fullName: string) => {
    if (!user) throw new Error('Not signed in');
    // Pass the user's Google avatar if available
    await createProfile(user.uid, username, fullName, user.photoURL);
  };

  return {
    user,
    profile,
    loading,
    signIn: handleSignIn,
    signOut: handleSignOut,
    setupProfile,
  };
}
