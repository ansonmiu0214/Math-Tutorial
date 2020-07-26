import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import { buildExprTree } from './parser';

const app = express();
app.use(cors({
  origin: true,
}));

app.get('/:expr', (req, res) => {
  const expr: string = req.params.expr;
  
  // TODO: error handling
  const tree = buildExprTree(expr);

  res.json(tree.serialise());
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.tree = functions.https.onRequest(app);