// firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// ✅ 1. Your Firebase web configuration (from Firebase Console > Project Settings)
const firebaseConfig = {
  apiKey: "AIzaSyBtgvtkBj1aruNIL5KJJGIyO911hsZY5Qk",
  authDomain: "oradosaleapp.firebaseapp.com",
  projectId: "oradosaleapp",
  storageBucket: "oradosaleapp.appspot.com",
  messagingSenderId: "908590403140",
  appId: "1:908590403140:web:860a272a880d59c3c0f611"
};

// ✅ 2. VAPID key (from Firebase Console > Project Settings > Cloud Messaging)
const vapidKey = "BEKT_8o_j4QVvic3b-GB6hDdy0RiWEPoXA1PwGUZ7xj8mBPiHFtLauRVaAhHVl5BQkTg0R-MFAnaDGyD_YVnSDM";

// ✅ 3. Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// ✅ 4. Request Permission and Get Token
export const requestFirebaseNotificationPermission = async () => {
  try {
    const token = await getToken(messaging, { vapidKey });
    if (token) {
      console.log("FCM Token:", token);
      return token; // Send this to your backend to store
    } else {  
      console.warn("No token found.");
      return null;
    }
  } catch (error) {
    console.error("FCM token error:", error);
    return null;
  }
};

// ✅ 5. Listen for foreground messages
export const onMessageListener = (callback) => {
  onMessage(messaging, (payload) => {
    console.log("Message received in foreground:", payload);
    callback(payload);
  });
};