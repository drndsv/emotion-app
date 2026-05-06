import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

import { environment } from '../../../../apps/emotion-diary/src/environments/environment';

export const firebaseApp = initializeApp(environment.firebase);

export const firebaseAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const functions = getFunctions(firebaseApp, 'europe-west1');

if (!environment.production) {
  connectFunctionsEmulator(functions, 'localhost', 5001);
}
