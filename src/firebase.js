import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCtZlzq-sW02NsGYgCHZXyp7y1R8ypfUPE",
  authDomain: "portofolio-4389a.firebaseapp.com",
  projectId: "portofolio-4389a",
  storageBucket: "portofolio-4389a.firebasestorage.app",
  messagingSenderId: "558004100529",
  appId: "1:558004100529:web:7b06dcef1cf37a5e8b3190"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
