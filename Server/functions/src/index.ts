import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import { buildExprTree } from './parser';
import { getMiddleSteps, } from './models/Computation';
import { ExprNode } from './models/ExprNode';

const app = express();
app.use(cors({
  origin: true,
}));

app.get('/:expr', (req, res) => {
  const expr: string = req.params.expr;
  
  // TODO: error handling
  let tree: ExprNode;
  try {
    tree = buildExprTree(expr);
  } catch (e) {
    const error = e as Error;
    res.status(400).json({ message: error.message });
    return;
  }

  // Check for evaluation errors (e.g. DivisionByZero)
  try {
    tree.eval();
  } catch (e) {
    const error = e as Error;
    res.status(400).json({ message: error.message });
    return;
  }

  const computations = getMiddleSteps(tree);
  
  res.json({
    expr: tree.serialise(),
    steps: computations.map(computation => computation.serialise()),
  });
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.tree = functions.https.onRequest(app);