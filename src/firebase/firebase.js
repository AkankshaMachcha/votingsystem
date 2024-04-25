import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAgU04CikeGG9Q1wMnEYHqcXAv32He7a-I",
    authDomain: "blockchainvotingsystem-6d5d3.firebaseapp.com",
    projectId: "blockchainvotingsystem-6d5d3",
    storageBucket: "blockchainvotingsystem-6d5d3.appspot.com",
    messagingSenderId: "776517005198",
    appId: "1:776517005198:web:84d066ce3a3b87d13cfedf",
    measurementId: "G-QB86F65229"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app); // Initialize storage module

export { app, database, auth, ref, get, set, update, storage };  // Export auth module along with other modules
