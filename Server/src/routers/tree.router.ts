import express from 'express';

import { buildExprTree } from '../parser';

export const treeRouter = express.Router();

treeRouter.get('/:expr', (req, res) => {
  
  const expr: string = req.params.expr;

  // TODO: error handling
  const tree = buildExprTree(expr);
  res.json(tree.serialise());
  
});