// imports
const admin = require("firebase-admin");
const logger = require("./logger");
let serviceAccount;
try {
    serviceAccount = require("../../config/firebase-key.json");
} catch (error) {
    logger.error("Please provide a Firebase service account key \"firebase-key.json\" in the config/ folder.");
    process.exit(1);
}

// db setup
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// cache setup
const inMemoryCache = {};

/**
 * Generates a cache key based on the hierarchy of the collection and document.
 * @param {string} collectionName - The name of the Firestore collection (may include subcollections).
 * @param {string} documentId - The ID of the Firestore document.
 * @returns {string} - The generated cache key.
 */
function generateCacheKey(collectionName, documentId) {
    return `${collectionName}/${documentId}`;
}

/**
 * Retrieve data from Firestore or in-memory cache.
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {string} documentId - The ID of the Firestore document.
 * @returns {Promise<admin.firestore.DocumentData|null>} - Returns the data if found, otherwise null.
 */
async function getData(collectionName, documentId) {
    const cacheKey = generateCacheKey(collectionName, documentId);
    const cachedData = inMemoryCache[cacheKey];

    if (cachedData !== undefined) {
        return cachedData;
    }

    const docRef = db.collection(collectionName).doc(documentId);
    const snapshot = await docRef.get();

    let data = null;
    if (snapshot.exists) {
        data = snapshot.data();
        inMemoryCache[cacheKey] = data;
        logger.info(`Fetched data from Firestore ${cacheKey}`);
    } else {
        logger.info(`No data was found in Firestore for ${cacheKey}.`);
    }

    return data;
}

/**
 * Writes data to Firestore and reloads the in-memory cache.
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {string} documentId - The ID of the Firestore document.
 * @param {Object} newData - The new data to write to Firestore.
 * @param {boolean} merge - Whether to merge the data (default: true).
 * @returns {Promise<void>} - A Promise that resolves when the data has been written.
 */
async function writeData(collectionName, documentId, newData, merge = true) {
    const cacheKey = generateCacheKey(collectionName, documentId);

    await db.collection(collectionName).doc(documentId).set(newData, { merge });
    logger.info(`Successfully wrote data to Firestore ${cacheKey}`);

    // erase in-memory cache for this document
    delete inMemoryCache[cacheKey];

    // reload the data from Firestore
    await getData(collectionName, documentId);
}

module.exports = { getData, writeData };