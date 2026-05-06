import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import {
  connectFunctionsEmulator,
  Functions,
  getFunctions,
} from 'firebase/functions';

let firebaseApp: FirebaseApp;
let firebaseAuthInstance: Auth;
let firestoreInstance: Firestore;
let functionsInstance: Functions;

export function initializeFirebase(
  firebaseOptions: FirebaseOptions,
  useFunctionsEmulator: boolean,
): void {
  firebaseApp = initializeApp(firebaseOptions);

  firebaseAuthInstance = getAuth(firebaseApp);
  firestoreInstance = getFirestore(firebaseApp);
  functionsInstance = getFunctions(firebaseApp, 'europe-west1');

  if (useFunctionsEmulator) {
    connectFunctionsEmulator(functionsInstance, 'localhost', 5001);
  }
}

export function getFirebaseAuth(): Auth {
  return firebaseAuthInstance;
}

export function getFirestoreInstance(): Firestore {
  return firestoreInstance;
}

export function getFunctionsInstance(): Functions {
  return functionsInstance;
}
