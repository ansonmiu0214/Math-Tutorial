import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts';
import { arithmeticLexer } from '../antlr/arithmeticLexer';
import { arithmeticParser, AtomContext, BinaryExprContext, UnaryExprContext, FileContext } from '../antlr/arithmeticParser';

import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor'
import { arithmeticVisitor } from '../antlr/arithmeticVisitor';
import { BinExprNode, ExprNode, ParenExprNode, ValNode } from '../models/ExprNode';

class ExprTreeVisitor extends AbstractParseTreeVisitor<ExprNode> implements arithmeticVisitor<ExprNode> {

  defaultResult() {
    return new ValNode(0);
  }

  visitFile(ctx: FileContext) {
    return super.visit(ctx.expression());
  }

  visitBinaryExpr(ctx: BinaryExprContext) {
    const leftChild = ctx.getChild(0);
    const rightChild = ctx.getChild(2);
    return new BinExprNode(super.visit(leftChild), super.visit(rightChild), ctx.getChild(1).text);
  }

  visitUnaryExpr(ctx: UnaryExprContext) {
    return new ParenExprNode(super.visit(ctx.expression()));
  }

  visitAtom(ctx: AtomContext) {
    return new ValNode(Number.parseInt(ctx.text));
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