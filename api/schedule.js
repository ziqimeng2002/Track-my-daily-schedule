// api/Schedule.js

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query } from 'firebase/firestore';

// --- Global Variables (Essential for the hosting environment) ---
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Helper function to sign in and get user ID
async function authenticateAndGetUserId() {
  let userCredential;
  if (initialAuthToken) {
    userCredential = await signInWithCustomToken(auth, initialAuthToken);
  } else {
    userCredential = await signInAnonymously(auth);
  }
  return userCredential.user.uid;
}

/**
 * Vercel Serverless Function entry point. (Made asynchronous for database operations)
 * @param {import('@vercel/node').VercelRequest} req 
 * @param {import('@vercel/node').VercelResponse} res
 */
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 1. Authenticate the user to scope data storage
    const userId = await authenticateAndGetUserId();

    // Define the collection path for private user data: /artifacts/{appId}/users/{userId}/schedules
    const schedulesCollectionPath = `artifacts/${appId}/users/${userId}/schedules`;
    const schedulesCollectionRef = collection(db, schedulesCollectionPath);

    // --- GET Request: Retrieve all schedules for the current user ---
    if (req.method === 'GET') {
      const q = query(schedulesCollectionRef);
      const snapshot = await getDocs(q);
      
      const schedules = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return res.status(200).json({
        success: true,
        count: schedules.length,
        schedules: schedules,
        userId: userId
      });
    }

    // --- POST Request: Add a new schedule item ---
    if (req.method === 'POST') {
      const { taskName, dueDate, estimatedTime, priority } = req.body;

      // Error Handling: Check for missing required fields
      if (!taskName || !dueDate || !estimatedTime || !priority) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields. taskName, dueDate, estimatedTime, and priority are mandatory.',
        });
      }

      // Input validation
      const timeInMinutes = parseInt(estimatedTime, 10);
      if (isNaN(timeInMinutes) || timeInMinutes <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid estimatedTime. Must be a positive number.',
        });
      }

      const newSchedule = {
        taskName,
        dueDate,
        estimatedTime: timeInMinutes,
        priority,
        createdAt: new Date().toISOString()
      };

      // Add the new document to Firestore
      const docRef = await addDoc(schedulesCollectionRef, newSchedule);

      return res.status(201).json({
        success: true,
        message: 'Schedule item added successfully.',
        schedule: { id: docRef.id, ...newSchedule },
        userId: userId
      });
    }

    // --- Fallback for unsupported methods ---
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed. Only GET and POST are supported.`,
    });

  } catch (error) {
    // Global Error Handler
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error during API processing. Check console for details.',
      error: error.message
    });
  }
};
