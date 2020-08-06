import BinOp, { fromToken, } from "./BinOp";
import Identifiable, { id, } from "../utils/Identifiable";
import Serialisable from "../utils/Serialisable";
import Evaluatable from "../utils/Evaluatable";

// ======
// Models
// ======

export type ExprLike = Serialisable & Evaluatable & Identifiable;

// ==============
// Implementation
// ==============

export class ValNode implements ExprLike {

  readonly type = 'val';
  readonly id: number;

  private readonly _value: number;

  constructor(value: number) {
    this._value = value;

    this.id = id();
  }

  // Properties
  get value() { return this._value; }

  // MARK: implementing Evaluatable
  eval() { return this.value; }

  // MARK: implementing Serialisable
  serialise() {
    return {
      type: this.type,
      payload: {
        value: this.value,
      },
    };
  }

  static deserialise(payload: any) {
    return new ValNode(Number.parseFloat(payload.value));
  }

  public toString() { return `${this.value}`; }

}

export class BinExprNode<T extends ExprLike> implements ExprLike {

  readonly type = 'binexpr';
  readonly id: number;

  private readonly _left: T;
  private readonly _right: T;
  private readonly _opToken: string;
  private readonly _opFunc: BinOp;

  constructor(left: T, right: T, opToken: string) {
    this._left = left;
    this._right = right;
    this._opToken = opToken;

    const opFunc = fromToken(this.opToken);
    if (opFunc === undefined) {
      throw new Error(`Unrecognised operand: ${this.opToken}`);
    }
    this._opFunc = opFunc;

    this.id = id();
  }

  // Properties
  get left() { return this._left; }
  get right() { return this._right; }
  get opToken() { return this._opToken; }

  private get opFunc() { return this._opFunc; }

  // MARK: implementing Evaluatable
  eval() {
    const result = this.opFunc(this.left.eval(), this.right.eval());
    if (result  === Infinity || isNaN(result)) {
      throw new Error(`"${this.toString()}" evaluates to ${result}`);
    }
    return result;
  }

  // MARK: implementing Serialisable
  serialise() {
    return {
      type: this.type,
      payload: {
        left: this.left.serialise(),
        right: this.right.serialise(),
        opToken: this.opToken,
      },
    };
  }

  static deserialise(payload: any) {
    const left = ExprNodeUtils.deserialise(payload.left);
    const right = ExprNodeUtils.deserialise(payload.right);
    return new BinExprNode(left, right, payload.opToken);
  }

  public toString() {
    return `${this.left} ${this.opToken} ${this.right}`;
  }

}

export class ParenExprNode<T extends ExprLike> implements ExprLike {

  readonly type = 'parenexpr';
  readonly id: number;

  private readonly _expr: T;

  constructor(expr: T) {
    this._expr = expr;

    this.id = id();
  }

  // Properties
  get expr() { return this._expr; }

  // MARK: implementing ExprLike
  eval() { return this.expr.eval(); }

  serialise() {
    return {
      type: this.type,
      payload: {
        expr: this.expr.serialise(),
      },
    };
  }

  static deserialise(payload: any) {
    const expr = ExprNodeUtils.deserialise(payload.expr);
    return new ParenExprNode(expr);
  }

  public toString() { return `(${this.expr})`; }

}

// =========
// Utilities
// =========

export abstract class ExprNodeUtils {

  static readonly typeToDeserialisers = new Map<string, (payload: any) => ExprLike>([
    ['val', ValNode.deserialise],
    ['binexpr', BinExprNode.deserialise],
    ['parenexpr', ParenExprNode.deserialise],
  ]);
  
  static deserialise(data: any): ExprLike {
    const deserialiser = this.typeToDeserialisers.get(data.type);
    if (deserialiser === undefined) {
      throw new Error(`Unrecognised data: ${data}`);
    }
    return deserialiser(data.payload);
  }

}

// ===============
// Aggregate types
// ===============

export type ExprNode = 
  | ValNode
  | BinExprNode<ExprNode>
  | ParenExprNode<ExprNode>
  ;
