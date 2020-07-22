import express from 'express';

import { buildExprTree } from '../parser';
import { StatefulComputation  } from '../models/Computation';

export const treeRouter = express.Router();

treeRouter.get('/:expr', (req, res) => {
  
  const expr: string = req.params.expr;

  // TODO: error handling
  const tree = buildExprTree(expr);

  const computation = new StatefulComputation(tree);
  while (!computation.complete) {
    console.log('%s', computation.snapshot);
    computation.next();
  }
  console.log('%s', computation.snapshot);
  res.json(tree.serialise());
  
});