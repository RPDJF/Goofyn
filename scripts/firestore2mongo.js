require('dotenv').config();
const admin = require('firebase-admin');
const { MongoClient } = require('mongodb');
const fs = require('fs');

// Initialize Firebase Admin
// print current directory
console.log(__dirname);
// print ./ files
console.log(fs.readdirSync('./config'));
if (!fs.existsSync('./config/firebase-key.json')) {
  console.error('Firebase service account key not found');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(require('../config/firebase-key.json'))
});
const db = admin.firestore();

// MongoDB connection string
const mongo_username = process.env.MONGO_USERNAME;
const mongo_password = process.env.MONGO_PASSWORD;
const mongo_dbName = process.env.MONGO_DB;
const mongo_uri = process.env.MONGO_URI;

if (!mongo_username || !mongo_password || !mongo_dbName || !mongo_uri) {
    console.error('MongoDB environment variables not set');
    console.error('Please set MONGO_USERNAME, MONGO_PASSWORD, MONGO_DB, and MONGO_URI');
    process.exit(1);
}

async function fetchAllCollections() {
  const collections = await db.listCollections();
  return collections.map(collection => collection.id);
}

async function fetchCollectionData(collectionId) {
  const snapshot = await db.collection(collectionId).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function writeToMongo(collectionId, data) {
  const client = new MongoClient(mongo_uri, {
    auth: {
      username: mongo_username,
      password: mongo_password
    }
  });
  try {
    await client.connect();
    const database = client.db(mongo_dbName);
    const collection = database.collection(collectionId);

    // Insert data into MongoDB
    await collection.insertMany(data);
    console.log(`Data successfully written to MongoDB for collection: ${collectionId}`);
  } finally {
    await client.close();
  }
}

async function firestoreToMongo() {
  const collections = await fetchAllCollections();
  for (const collectionId of collections) {
    const data = await fetchCollectionData(collectionId);
    await writeToMongo(collectionId, data);
  }
  console.log('Data migration complete');
  console.log('Going to infinite loop');
  while (true);
}

firestoreToMongo().catch(console.error);