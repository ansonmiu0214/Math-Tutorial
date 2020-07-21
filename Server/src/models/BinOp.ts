export default interface BinOp {
  (left: number, right: number): number;
}

const Plus: BinOp = (x, y) => x + y;
const Minus: BinOp = (x, y) => x - y;
const Times: BinOp = (x, y) => x * y;

// TODO: how to handle division by zero?
const Div: BinOp = (x, y) => x / y;

const tokenToBinOp = new Map<string, BinOp>([
  ['+', Plus],
  ['-', Minus],
  ['*', Times],
  ['/', Div]
]);

const binOpToToken = new Map<BinOp, string>([
  [Plus, '+'],
  [Minus, '-'],
  [Times, '*'],
  [Div, '/']
]);

export const fromToken = (token: string) => tokenToBinOp.get(token);
export const toToken = (binOp: BinOp) => binOpToToken.get(binOp);