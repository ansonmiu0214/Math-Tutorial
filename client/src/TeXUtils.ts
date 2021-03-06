import { ComputedExprNode, } from './models/Computation';

export const tokenToTeX = new Map<string, string>([
  ['+', '+'],
  ['-', '-'],
  ['*', '\\times'],
  ['/', '\\div'],
]);

export function renderToTeX(node: ComputedExprNode): string {
  switch (node.type) {
    case 'val':
      return `${node.value}`;
    case 'parenexpr':
      return `(${renderToTeX(node.expr)})`;
    case 'binexpr':
      return `${renderToTeX(node.left)} ${tokenToTeX.get(node.opToken)} ${renderToTeX(node.right)}`;
    case 'computation':
      return `{\\color{blue} ${renderToTeX(node.expr)} }`;
  }
}
