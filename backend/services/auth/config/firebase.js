import {cert, initializeApp} from "firebase-admin";

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!serviceAccountJson) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not configured");
}

let serviceAccount;
try {
    serviceAccount = JSON.parse(serviceAccountJson);
} catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON must contain valid JSON");
}

const app = initializeApp({
    credential : cert(serviceAccount)
});

export default app