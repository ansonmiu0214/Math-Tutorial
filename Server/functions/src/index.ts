import * as functions from 'firebase-functions';
import app from './routers';
import treeRouter from './routers/tree';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

app.use('/', treeRouter);

exports.tree = functions.https.onRequest(app);