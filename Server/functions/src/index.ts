import * as functions from 'firebase-functions';
import { buildExprTree } from './parser';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.tree = functions.https.onRequest((req, res) => {
  const expr = req.params['0'];
  if (!expr) {
    // TODO: error handling
  }

  if (!expr.startsWith('/')) {
    // TODO: error handling
  }

  // TODO: error handling
  const tree = buildExprTree(expr.substr(1, expr.length - 1));

  res.json(tree.serialise());
});