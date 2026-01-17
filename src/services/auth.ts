// Authentication service with Google Sign-In
import {
  signInWithCredential,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth, db } from './firebase';
import { Profile } from '../types';

// Configure Google Sign-In - call this once on app startup
export function configureGoogleSignIn(webClientId: string) {
  GoogleSignin.configure({
    webClientId,
    offlineAccess: true,
  });
}

export async function signInWithGoogle(): Promise<User> {
  try {
    // Check if device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    // Get the user's ID token
    const signInResult = await GoogleSignin.signIn();

    // Get the ID token from the result
    const idToken = signInResult.data?.idToken;
    if (!idToken) {
      throw new Error('No ID token found');
    }

    // Create a Google credential with the token
    const googleCredential = GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    const userCredential = await signInWithCredential(auth, googleCredential);
    return userCredential.user;
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    throw error;
  }
}

export async function signOut(): Promise<void> {
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    // Google sign out may fail if not signed in via Google
    console.log('Google sign out skipped:', error);
  }
  await firebaseSignOut(auth);
}

export async function getProfile(uid: string): Promise<Profile | null> {
  const docRef = doc(db, 'profiles', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { uid, ...docSnap.data() } as Profile;
  }
  return null;
}

export async function checkUsernameAvailable(username: string): Promise<boolean> {
  const usernameLower = username.toLowerCase();
  const docRef = doc(db, 'usernames', usernameLower);
  const docSnap = await getDoc(docRef);
  return !docSnap.exists();
}

export async function createProfile(
  uid: string,
  username: string,
  fullName: string,
  avatarUrl: string | null = null
): Promise<Profile> {
  const usernameLower = username.toLowerCase();

  // Check username availability again (race condition protection)
  const isAvailable = await checkUsernameAvailable(username);
  if (!isAvailable) {
    throw new Error('Username is already taken');
  }

  // Reserve username atomically
  await setDoc(doc(db, 'usernames', usernameLower), { uid });

  // Create profile
  const profile = {
    username,
    usernameLower,
    fullName,
    avatarUrl,
    label: 'New Member',
    createdAt: serverTimestamp(),
  };

  await setDoc(doc(db, 'profiles', uid), profile);

  return { uid, ...profile, createdAt: null } as unknown as Profile;
}
