// Run this in a Node.js file to convert service account JSON into a string
const fs = require('fs');
const serviceAccount = require('./firebase/serviceAccountKey.json');

console.log(JSON.stringify(serviceAccount));
