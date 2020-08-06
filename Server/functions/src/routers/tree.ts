import express from 'express';
import { ExprNode } from '../models/ExprNode';
import { buildExprTree } from '../parser';
import { getMiddleSteps } from '../models/Computation';

const router = express.Router();

router.get('/:expr', (req, res) => {
  const expr: string = req.params.expr;
  
  // Check for parsing errors
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

export default router;