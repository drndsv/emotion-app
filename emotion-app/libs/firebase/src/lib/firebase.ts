import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import {
  connectFunctionsEmulator,
  Functions,
  getFunctions,
} from 'firebase/functions';

import {
  FIREBASE_FUNCTIONS_EMULATOR_HOST,
  FIREBASE_FUNCTIONS_EMULATOR_PORT,
  FIREBASE_FUNCTIONS_REGION,
} from './constants/firebase';
import {
  FIREBASE_AUTH_NOT_INITIALIZED_ERROR,
  FIREBASE_FUNCTIONS_NOT_INITIALIZED_ERROR,
  FIRESTORE_NOT_INITIALIZED_ERROR,
} from './constants/firebase-errors';

let firebaseApp: FirebaseApp | null = null;
let firebaseAuthInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;
let functionsInstance: Functions | null = null;

export function initializeFirebase(
  firebaseOptions: FirebaseOptions,
  useFunctionsEmulator: boolean,
): void {
  firebaseApp = initializeApp(firebaseOptions);

  firebaseAuthInstance = getAuth(firebaseApp);
  firestoreInstance = getFirestore(firebaseApp);
  functionsInstance = getFunctions(firebaseApp, FIREBASE_FUNCTIONS_REGION);

  if (useFunctionsEmulator) {
    connectFunctionsEmulator(
      functionsInstance,
      FIREBASE_FUNCTIONS_EMULATOR_HOST,
      FIREBASE_FUNCTIONS_EMULATOR_PORT,
    );
  }
}

export function getFirebaseAuth(): Auth {
  if (firebaseAuthInstance === null) {
    throw new Error(FIREBASE_AUTH_NOT_INITIALIZED_ERROR);
  }

  return firebaseAuthInstance;
}

export function getFirestoreInstance(): Firestore {
  if (firestoreInstance === null) {
    throw new Error(FIRESTORE_NOT_INITIALIZED_ERROR);
  }

  return firestoreInstance;
}

export function getFunctionsInstance(): Functions {
  if (functionsInstance === null) {
    throw new Error(FIREBASE_FUNCTIONS_NOT_INITIALIZED_ERROR);
  }

  return functionsInstance;
}
