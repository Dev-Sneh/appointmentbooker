import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

try {
  // Check if Firebase is already initialized
  if (!admin.apps.length) {
    // Use separate environment variables instead of JSON string
    const firebaseConfig = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    };

    // Validate required fields
    if (!firebaseConfig.project_id || !firebaseConfig.private_key || !firebaseConfig.client_email) {
      throw new Error('Missing required Firebase environment variables');
    }

    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount),
    });

    console.log('✅ Firebase initialized successfully');
  }
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  console.log('⚠️ App will continue without Firebase (using mock data)');
}

// Export db - will be null if Firebase failed to initialize
const db = admin.apps.length > 0 ? admin.firestore() : null;
export default db;
