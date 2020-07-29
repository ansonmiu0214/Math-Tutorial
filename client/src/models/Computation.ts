import { ExprLike, ExprNode, ValNode, BinExprNode, ParenExprNode, ExprNodeUtils, } from './ExprNode';
import { id } from '../utils/Identifiable';

export class ComputationNode implements ExprLike {

  readonly type = 'computation';
  readonly id: number;

  private readonly _expr: ParenExprNode<ExprNode> | BinExprNode<ExprNode>;

  constructor(expr: ParenExprNode<ExprNode> | BinExprNode<ExprNode>) {
    this._expr = expr;
    
    this.id = id();
  }

  // Properties
  get expr() { return this._expr; }
  get step() { 
    if (this.expr.type === 'binexpr') {
      return this.expr.opToken;
    } else {
      return (this.expr.expr as BinExprNode<ExprNode>).opToken;
    }
  }
  get answer() { return this.expr.eval(); }

  // MARK: implementing ExprLike
  eval() { return this.expr.eval(); }

  serialise() {
    return {
      type: this.type,
      payload: {
        expr: this.expr.serialise(),
        answer: this.answer,
      },
    };
  }

  static deserialise(payload: any) {
    const expr = ExprNodeUtils.deserialise(payload.expr) as ParenExprNode<ExprNode> | BinExprNode<ExprNode> ;
    return new ComputationNode(expr);
  }
  
  public toString() { return `{ ${this.expr} }`; }

}

export type ComputedExprNode = 
  | ValNode
  | BinExprNode<ComputedExprNode>
  | ParenExprNode<ComputedExprNode>
  | ComputationNode
  ;


function getIdOfFirstParentheses(node: ExprNode): number | undefined {
  switch (node.type) {
    case 'val':
      return undefined;
    case 'binexpr':
      return getIdOfFirstParentheses(node.left) ?? getIdOfFirstParentheses(node.right);
    case 'parenexpr':
      return getIdOfFirstParentheses(node.expr) ?? node.id;
  }
}

function getIdOfFirstBinExpr(node: ExprNode, targetOperands: Set<string>): number | undefined {
  switch (node.type) {
    case 'val':
      return undefined;
    case 'binexpr':
      return getIdOfFirstBinExpr(node.left, targetOperands)
              ?? getIdOfFirstBinExpr(node.right, targetOperands)
              ?? (targetOperands.has(node.opToken) ? node.id : undefined);
    case 'parenexpr':
      return getIdOfFirstBinExpr(node.expr, targetOperands);
  }  
}

export function getIdOfNextStep(node: ExprNode) {
  return getIdOfFirstParentheses(node)
          ?? getIdOfFirstBinExpr(node, new Set(['*', '/']))
          ?? getIdOfFirstBinExpr(node, new Set(['+', '-']));
}

export function getComputation(node: ExprNode, target: number): ComputedExprNode {
  switch (node.type) {
    case 'val':
      return new ValNode(node.value);
    case 'binexpr':
      if (node.id === target) {
        return new ComputationNode(node) 
      } else {
        const left = getComputation(node.left, target);
        const right = getComputation(node.right, target);
        return new BinExprNode(left, right, node.opToken);
      }
    case 'parenexpr':
      if (node.id === target) {
        return new ComputationNode(node);
      } else {
        return new ParenExprNode(getComputation(node.expr, target));
      }
  }
}

export function completeComputation(node: ComputedExprNode): ExprNode {
  switch (node.type) {
    case 'val':
      return new ValNode(node.value);
    case 'binexpr':
      const left = completeComputation(node.left);
      const right = completeComputation(node.right);
      return new BinExprNode(left, right, node.opToken);
    case 'parenexpr':
      return new ParenExprNode(completeComputation(node.expr));
    case 'computation':
      return new ValNode(node.eval());
  }
}

export function getMiddleSteps(node: ExprNode) {
  const computations = [];
  let idOfNextStep = getIdOfNextStep(node);
  let computation: ComputedExprNode;

  while (idOfNextStep !== undefined) {
    computation = getComputation(node, idOfNextStep);

    computations.push(computation);

    node = completeComputation(computation);
    idOfNextStep = getIdOfNextStep(node);
  }

  return computations;
}