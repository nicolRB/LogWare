const admin = require('firebase-admin')
const serviceAccount = require('./firebaseAdminKey.json')

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "SEU_BUCKET.appspot.com", // substitua depois
  })
}

const db = admin.firestore()
const auth = admin.auth()
const bucket = admin.storage().bucket()

module.exports = { admin, db, auth, bucket }