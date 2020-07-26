import { ComputedExprNode, Status, } from './models/Computation';

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
      switch (node.status) {
        case Status.COMPLETE:
          return `${node.eval()}`;
        case Status.ACTIVE:
          return `{\\color{blue}${renderToTeX(node.left)} ${tokenToTeX.get(node.opToken)} ${renderToTeX(node.right)}}`;
        case Status.INACTIVE:
          return `${renderToTeX(node.left)} ${tokenToTeX.get(node.opToken)} ${renderToTeX(node.right)}`;
      }
  }
}
