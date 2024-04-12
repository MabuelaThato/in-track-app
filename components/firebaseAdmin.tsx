import admin from "firebase-admin";

const firebaseAdminConfig = process.env.FIREBASE_ADMIN_SDK_CONFIG;
console.log(firebaseAdminConfig);
if (!firebaseAdminConfig) {
    throw new Error('Firebase Admin SDK configuration is missing.');
}

const serviceAccount = JSON.parse(firebaseAdminConfig);

const firebaseAdmin = admin.apps.length
  ? admin.app()
  : admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

export default firebaseAdmin;