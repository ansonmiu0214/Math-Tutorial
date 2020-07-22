import { ExprNode, ValNode, BinExprNode, ParenExprNode } from "./ExprNode";

enum Status { ACTIVE, INACTIVE, COMPLETE };

class ComputedBinExprNode extends BinExprNode {

  private _status: Status; 

  constructor(left: ExprNode, right: ExprNode, opToken: string) {
    super(left, right, opToken);
    this._status = Status.INACTIVE;
  }

  get status() { return this._status; }
  set status(newValue: Status) { this._status = newValue; }

  public toString() {
    switch (this.status) {
      case Status.ACTIVE: return `#${super.toString()}#`;
      case Status.INACTIVE: return super.toString();
      case Status.COMPLETE: return `${this.eval()}`;
    }
  }
}

export class StatefulComputation {

  private readonly _expr: ExprNode;
  private readonly _computations: ComputedBinExprNode[];
  private _computationIdx: number;

  constructor(expr: ExprNode) {
    this._expr = StatefulComputation.initialiseComputation(expr);
    this._computations = StatefulComputation.getOrderOfComputation(this._expr);
    this._computationIdx = 0;

    if (this._computationIdx < this._computations.length) {
      this._computations[this._computationIdx].status = Status.ACTIVE;
    }
  }

  get complete() { return this._computationIdx == this._computations.length; }

  get snapshot() { return this._expr; }

  next() {
    this._computations[this._computationIdx++].status = Status.COMPLETE;
    if (this._computationIdx < this._computations.length) {
      this._computations[this._computationIdx].status = Status.ACTIVE;
    }
  }

  private static initialiseComputation(node: ExprNode): ExprNode {
    switch (node.type) {
      case 'val':
        return node;
      case 'parenexpr':
        return new ParenExprNode(this.initialiseComputation(node.expr));
      case 'binexpr':
        const left = this.initialiseComputation(node.left);
        const right = this.initialiseComputation(node.right);
        return new ComputedBinExprNode(left, right, node.opToken);
    }
  }

  private static getOrderOfComputation(node: ExprNode): ComputedBinExprNode[] {
    switch (node.type) {
      case 'val':
        return [];
      case 'parenexpr':
        return this.getOrderOfComputation(node.expr);
      case 'binexpr':
        const leftOrder = this.getOrderOfComputation(node.left);
        const rightOrder = this.getOrderOfComputation(node.right);
        return [...leftOrder, ...rightOrder, node as ComputedBinExprNode];
    }
  }

}