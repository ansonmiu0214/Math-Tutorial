import { ExprNode, ValNode, BinExprNode, ParenExprNode } from "./ExprNode";

export enum Status { ACTIVE, INACTIVE, COMPLETE };

export class ComputedBinExprNode extends BinExprNode<ComputedExprNode> {

  private _status: Status; 

  constructor(left: ComputedExprNode, right: ComputedExprNode, opToken: string) {
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

export type ComputedExprNode = ValNode | ComputedBinExprNode| ParenExprNode<ComputedExprNode>;

export class StatefulComputation {

  private readonly _expr: ComputedExprNode;
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

  get complete() { return this._computationIdx === this._computations.length; }

  get snapshot() { return this._expr; }

  next() {
    this._computations[this._computationIdx++].status = Status.COMPLETE;
    if (this._computationIdx < this._computations.length) {
      this._computations[this._computationIdx].status = Status.ACTIVE;
    }
  }

  private static initialiseComputation(node: ExprNode): ComputedExprNode {
    switch (node.type) {
      case 'val':
        return new ValNode(node.value);
      case 'parenexpr':
        return new ParenExprNode(this.initialiseComputation(node.expr));
      case 'binexpr':
        const left = this.initialiseComputation(node.left);
        const right = this.initialiseComputation(node.right);
        return new ComputedBinExprNode(left, right, node.opToken);
    }
  }

  private static getOrderOfComputation(node: ComputedExprNode): ComputedBinExprNode[] {
    return [
      ...this.postTraversal(node, new Set(['/', '*'])),
      ...this.postTraversal(node, new Set(['+', '-'])),
    ];
  }

  private static postTraversal(node: ComputedExprNode, operands: Set<string>): ComputedBinExprNode[] {
    switch (node.type) {
      case 'val':
        return [];
      case 'parenexpr':
        return this.postTraversal(node.expr, operands);
      case 'binexpr':
        const leftOrder = this.postTraversal(node.left, operands);
        const rightOrder = this.postTraversal(node.right, operands);
        if (operands.has(node.opToken)) {
          return [...leftOrder, ...rightOrder, node as ComputedBinExprNode];
        } else {
          return [...leftOrder, ...rightOrder];
        }
    }
  }

}