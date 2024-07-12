const logger = require('./logger');
const { MongoClient } = require('mongodb');

const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;
const dbName = process.env.MONGO_DB;
const uri = process.env.MONGO_URI;

if (!username || !password || !dbName || !uri) {
    logger.error('MongoDB environment variables not set');
    logger.error('Please set MONGO_USERNAME, MONGO_PASSWORD, MONGO_DB, and MONGO_URI');
    process.exit(1);
}

const client = new MongoClient(uri, {
    auth: {
        username: username,
        password: password,
    }
});

let db;

async function connect() {
    if (!db) {
        try {
            await client.connect();
            db = client.db(dbName);
            logger.info('Connected to MongoDB');
        } catch (err) {
            logger.error('Error connecting to MongoDB');
            logger.fatal(err);
            process.exit(err.code || 1)
        }
    }
    return db;
}

/**
 * 
 * @param {String} collectionName 
 * @param {Number} documentId 
 * @returns {Promise<Object>}
 */
async function getData(collectionName, documentId) {
    try {
        const database = await connect();
        const collection = database.collection(collectionName);
        const document = await collection.findOne({ id: documentId });
        if (!document) {
            return ({
                id: documentId,
            });
        }
        return document;
    } catch (err) {
        logger.error('Error reading data');
        logger.error(err);
        throw err;
    }
}

/**
 * 
 * @param {String} collectionName 
 * @param {Number} documentId 
 * @param {Object} newData 
 * @param {Boolean} merge 
 * @returns {Promise<Object>}
 */
async function writeData(collectionName, documentId, newData, merge = true) {
    try {
        const database = await connect();
        const collection = database.collection(collectionName);

        if (merge) {
            const updateResult = await collection.updateOne(
                { id: documentId },
                { $set: newData },
                { upsert: true }
            );
            return updateResult;
        } else {
            const replaceResult = await collection.replaceOne(
                { id: documentId },
                newData,
                { upsert: true }
            );
            return replaceResult;
        }
    } catch (err) {
        logger.error('Error writing data');
        logger.error(err);
        throw err;
    }
}

module.exports = {
    getData,
    writeData,
};
