import BinOp, { fromToken, toToken } from './BinOp';

export abstract class ExprNode {

  abstract eval(): number;

  abstract serialise(): any;

  static deserialise(object: any): ExprNode {
    switch (object.type) {
      case "value":
        return ValNode.deserialiseNode(object.payload);
      case "binexpr":
        return BinExprNode.deserialiseNode(object.payload);
      default:
        throw new Error(`Unrecognised object: ${object}`);
    }
  }

  static Val(value: number) {
    return new ValNode(value);
  }

  static BinExpr(left: ExprNode, right: ExprNode, op: BinOp) {
    return new BinExprNode(left, right, op);
  }

  static deserialiseNode(object: any): ExprNode {
    throw new Error("TODO: implement");
  }

}

class ValNode extends ExprNode {
  
  readonly value: number;

  constructor(value: number) {
    super();
    this.value = value;
  }
  
  eval() {
    return this.value;
  }

  serialise() {
    return {
      type: "value",
      payload: {
        value: this.value,
      },
    };
  }

  static deserialiseNode(object: any) {
    return new ValNode(Number.parseInt(object.value));
  }

  public toString = () =>
    `Val(${this.value})`;
  
}

class BinExprNode extends ExprNode {

  readonly left: ExprNode;
  readonly right: ExprNode;
  private readonly _op: BinOp;

  constructor(left: ExprNode, right: ExprNode, _op: BinOp) {
    super();
    this.left = left;
    this.right = right;
    this._op = _op;
  }

  get opFunc() {
    return this._op;
  }

  get opToken() {
    return toToken(this._op)!;
  }

  eval() {
    return this.opFunc(this.left.eval(), this.right.eval());
  }

  serialise() {
    return {
      type: "binexpr",
      payload: {
        left: this.left.serialise(),
        right: this.right.serialise(),
        op: this.opToken,
      },
    };
  }

  static deserialiseNode(object: any) {
    const { left, right, op } = object;
    const opToken = fromToken(op);
    if (!opToken) {
      throw new Error(`Unsupported opera`)
    }
    return new BinExprNode(
      ExprNode.deserialise(left),
      ExprNode.deserialise(right),
      fromToken(op)!,
    );
  }

  public toString = () => 
    `Expr(${this.left} ${toToken(this.opFunc)} ${this.right})`;

}

