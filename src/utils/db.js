const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const serviceAccount = require("../../config/firebase.json");

initializeApp({
  credential: cert(serviceAccount)
});

module.exports =  getFirestore();