import { ANTLRInputStream, CommonTokenStream, Token } from 'antlr4ts';
import { arithmeticLexer } from './antlr/arithmeticLexer';
import { arithmeticParser, ExpressionContext, AtomContext } from './antlr/arithmeticParser';

// Create the lexer and parser
const inputStream = new ANTLRInputStream("1 + 2 * (3 + 4)");
const lexer = new arithmeticLexer(inputStream);
const tokenStream = new CommonTokenStream(lexer);
const parser = new arithmeticParser(tokenStream);

// Parse the input, where `compilationUnit` is whatever entry point you defined
const tree = parser.file();

import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor'
import { arithmeticVisitor } from './antlr/arithmeticVisitor';

// Extend the AbstractParseTreeVisitor to get default visitor behaviour
class EvalVisitor extends AbstractParseTreeVisitor<number> implements arithmeticVisitor<number> {

  defaultResult() {
    return 0
  }

  aggregateResult(aggregate: number, nextResult: number) {
    return aggregate + nextResult
  }
  
  visitExpression(context: ExpressionContext) {
    if (context.TIMES()) {
      return context.expression()
      .map(child => super.visit(child))
      .reduce((v1, v2) => v1 * v2);
    }
    // if (context.DIV()) {
    //   const [v1, v2] = context.children!.map(super.visit);
    //   return v1 / v2;
    // }
    if (context.PLUS()) {
      return context.expression()
        .map(child => super.visit(child))
        .reduce((v1, v2) => v1 + v2);
    }
    if (context.MINUS()) {
      return context.expression()
        .map(child => super.visit(child))
        .reduce((v1, v2) => v1 - v2);
    }

    return super.visitChildren(context);
  }

  visitAtom(context: AtomContext) {
    return Number.parseInt(context.SCIENTIFIC_NUMBER().text);
  }

}

const result = new EvalVisitor().visit(tree);
console.log(result);