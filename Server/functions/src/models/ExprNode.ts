import BinOp, { fromToken } from "./BinOp";

export interface AbstractExprNode {
  serialise(): any;
  eval(): number;
  type: string;
}

export abstract class ExprNodeUtils {
  
  static deserialise(object: any): ExprNode {
    switch (object.type) {
      case 'val':
        return ValNode.deserialise(object.payload);
      case 'binexpr':
        return BinExprNode.deserialise(object.payload);
      case 'parenexpr':
        return ParenExprNode.deserialise(object.payload);
      default:
        throw new Error(`Unrecognised object: ${object}`);
    }
  }
  
}
 
export class ValNode {
  
  readonly type = 'val';

  private readonly _value: number;

  constructor(value: number) {
    this._value = value;
  }

  get value() { return this._value; }

  eval(): number {
    return this.value;
  }

  serialise(): any {
    return {
      type: this.type,
      payload: {
        value: this.value,
      },
    };
  }

  static deserialise(payload: any) {
    return new ValNode(payload.value);
  }

  public toString() { return `${this.value}`; }

}

export class BinExprNode<T extends AbstractExprNode> {

  readonly type = 'binexpr';

  private readonly _left: T;
  private readonly _right: T;
  private readonly _opToken: string;
  private readonly _opFunc: BinOp;

  constructor(left: T, right: T, opToken: string) {
    this._left = left;
    this._right = right;
    this._opToken = opToken;

    const opFunc = fromToken(opToken);
    if (!opFunc) {
      throw new Error(`Unrecognised operand token: "${opToken}"`);
    }

    this._opFunc = opFunc;
  }

  get left() { return this._left; }
  get right() { return this._right; }
  private get opFunc() { return this._opFunc; }
  get opToken() { return this._opToken; }

  eval(): number { return this.opFunc(this.left.eval(), this.right.eval()); }

  serialise(): any {
    return {
      type: this.type,
      payload: {
        left: this.left.serialise(),
        right: this.right.serialise(),
        op: this.opToken,
      },
    };
  }

  static deserialise(payload: any) {
    const left = ExprNodeUtils.deserialise(payload.left);
    const right = ExprNodeUtils.deserialise(payload.right);
    return new BinExprNode(left, right, payload.op);
  }

  public toString() { return `${this.left} ${this.opToken} ${this.right}`; }

}

export class ParenExprNode<T extends AbstractExprNode> {
  
  readonly type = 'parenexpr';

  private readonly _expr: T;

  constructor(expr: T) {
    this._expr = expr;
  }

  get expr() { return this._expr; }

  eval(): number { return this.expr.eval(); }

  serialise(): any {
    return {
      type: this.type,
      payload: {
        expr: this.expr.serialise(),
      },
    };
  }

  static deserialise(payload: any) {
    return new ParenExprNode(ExprNodeUtils.deserialise(payload.expr));
  }

  public toString() { return `(${this.expr})`; }

}

export type ExprNode = ValNode | BinExprNode<ExprNode> | ParenExprNode<ExprNode>;