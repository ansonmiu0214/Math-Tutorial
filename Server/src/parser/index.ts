import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts';
import { arithmeticLexer } from '../antlr/arithmeticLexer';
import { arithmeticParser, AtomContext, BinaryExprContext, UnaryExprContext, FileContext } from '../antlr/arithmeticParser';

import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor'
import { arithmeticVisitor } from '../antlr/arithmeticVisitor';
import { ExprNode } from '../models/ExprNode';
import { fromToken } from '../models/BinOp';

class ExprTreeVisitor extends AbstractParseTreeVisitor<ExprNode> implements arithmeticVisitor<ExprNode> {

  defaultResult() {
    return ExprNode.Val(0);
  }

  visitFile(ctx: FileContext) {
    return super.visit(ctx.expression());
  }

  visitBinaryExpr(ctx: BinaryExprContext) {
    const opToken = ctx.getChild(1).text;
    const op = fromToken(opToken);
    if (!op) {
      throw new Error(`Unsupported operand: ${op}`);
    }

    const leftChild = ctx.getChild(0);
    const rightChild = ctx.getChild(2);
    return ExprNode.BinExpr(super.visit(leftChild), super.visit(rightChild), op);
  }

  visitUnaryExpr(ctx: UnaryExprContext) {
    return super.visit(ctx.expression());
  }

  visitAtom(ctx: AtomContext) {
    return ExprNode.Val(Number.parseInt(ctx.text));
  }

}

export function buildExprTree(expr: string) {
  // Create the lexer and parser
  const inputStream = new ANTLRInputStream(expr);
  const lexer = new arithmeticLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new arithmeticParser(tokenStream);

  // Parse the input
  // TODO: error handling
  const tree = parser.file();

  return new ExprTreeVisitor().visit(tree);
}