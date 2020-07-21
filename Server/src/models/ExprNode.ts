export abstract class ExprNode {

  abstract eval(): number;

  static Val(value: number) {
    return new ValNode(value);
  }

  static BinExpr(left: ExprNode, right: ExprNode, op: BinOp) {
    return new BinExprNode(left, right, op);
  }

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

  static deserialiseNode(object: any): ExprNode {
    throw new Error("TODO: implement");
  }

}

class ValNode extends ExprNode {
  
  private readonly value: number;

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

  readonly left: ExprNode
  readonly right: ExprNode
  readonly _op: BinOp

  constructor(left: ExprNode, right: ExprNode, _op: BinOp) {
    super();
    this.left = left;
    this.right = right;
    this._op = _op;
  }

  get opFunc() {
    return this._op;
  }

  get op() {
    return BinOp.toToken(this._op)!;
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
        op: this.op,
      },
    };
  }

  static deserialiseNode(object: any) {
    const { left, right, op } = object;
    return new BinExprNode(
      ExprNode.deserialise(left),
      ExprNode.deserialise(right),
      BinOp.fromToken(op)!,
    );
  }

  public toString = () => 
    `Expr(${this.left} ${BinOp.toToken(this.opFunc)} ${this.right})`;

}

interface BinOp {
  (left: number, right: number): number;
}

export namespace BinOp {

  export const Plus: BinOp = (x, y) => x + y;
  export const Minus: BinOp = (x, y) => x - y;
  export const Times: BinOp = (x, y) => x * y;

  // TODO: how to handle division by zero?
  export const Div: BinOp = (x, y) => x / y;

  const tokenToBinOp = new Map<string, BinOp>([
    ["+", Plus],
    ["-", Minus],
    ["*", Times],
    ["/", Div]
  ]);

  const binOpToToken = new Map<BinOp, string>([
    [Plus, "+"],
    [Minus, "-"],
    [Times, "*"],
    [Div, "/"]
  ]);

  export const fromToken = (token: string) => tokenToBinOp.get(token);
  export const toToken = (binOp: BinOp) => binOpToToken.get(binOp);

}