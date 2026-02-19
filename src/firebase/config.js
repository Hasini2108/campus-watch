import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// ========================================
// Firebase Configuration
// ========================================
const firebaseConfig = {
    apiKey: 'AIzaSyCrWcRacL_OTBIg6CeuYTxDR19qfGc4Qos',
    authDomain: 'campuswatch-7f272.firebaseapp.com',
    projectId: 'campuswatch-7f272',
    storageBucket: 'campuswatch-7f272.firebasestorage.app',
    messagingSenderId: '469191986590',
    appId: '1:469191986590:web:6339c732b5f9b728635a8f',
    measurementId: 'G-WRZ16M1WCK',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
