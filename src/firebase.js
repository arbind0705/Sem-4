// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCZ9c24W2vZedsSB2DZ2uSdD059CSAj4PU",
  authDomain: "travel-planning-app-c0f27.firebaseapp.com",
  projectId: "travel-planning-app-c0f27",
  storageBucket: "travel-planning-app-c0f27.firebasestorage.app",
  messagingSenderId: "859276799520",
  appId: "1:859276799520:web:d9fbc1f35e3e253c76d645"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
