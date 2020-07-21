// Generated from arithmetic.g4 by ANTLR 4.7.3-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

import { FileContext } from "./arithmeticParser";
import { ExpressionContext } from "./arithmeticParser";
import { AtomContext } from "./arithmeticParser";
import { RelopContext } from "./arithmeticParser";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `arithmeticParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface arithmeticVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `arithmeticParser.file`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFile?: (ctx: FileContext) => Result;

	/**
	 * Visit a parse tree produced by `arithmeticParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpression?: (ctx: ExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `arithmeticParser.atom`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAtom?: (ctx: AtomContext) => Result;

	/**
	 * Visit a parse tree produced by `arithmeticParser.relop`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRelop?: (ctx: RelopContext) => Result;
}

