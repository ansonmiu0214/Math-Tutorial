// Generated from arithmetic.g4 by ANTLR 4.7.3-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

import { BinaryExprContext } from "./arithmeticParser";
import { UnaryExprContext } from "./arithmeticParser";
import { LiteralExprContext } from "./arithmeticParser";
import { FileContext } from "./arithmeticParser";
import { ExpressionContext } from "./arithmeticParser";
import { AtomContext } from "./arithmeticParser";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `arithmeticParser`.
 */
export interface arithmeticListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by the `BinaryExpr`
	 * labeled alternative in `arithmeticParser.expression`.
	 * @param ctx the parse tree
	 */
	enterBinaryExpr?: (ctx: BinaryExprContext) => void;
	/**
	 * Exit a parse tree produced by the `BinaryExpr`
	 * labeled alternative in `arithmeticParser.expression`.
	 * @param ctx the parse tree
	 */
	exitBinaryExpr?: (ctx: BinaryExprContext) => void;

	/**
	 * Enter a parse tree produced by the `UnaryExpr`
	 * labeled alternative in `arithmeticParser.expression`.
	 * @param ctx the parse tree
	 */
	enterUnaryExpr?: (ctx: UnaryExprContext) => void;
	/**
	 * Exit a parse tree produced by the `UnaryExpr`
	 * labeled alternative in `arithmeticParser.expression`.
	 * @param ctx the parse tree
	 */
	exitUnaryExpr?: (ctx: UnaryExprContext) => void;

	/**
	 * Enter a parse tree produced by the `LiteralExpr`
	 * labeled alternative in `arithmeticParser.expression`.
	 * @param ctx the parse tree
	 */
	enterLiteralExpr?: (ctx: LiteralExprContext) => void;
	/**
	 * Exit a parse tree produced by the `LiteralExpr`
	 * labeled alternative in `arithmeticParser.expression`.
	 * @param ctx the parse tree
	 */
	exitLiteralExpr?: (ctx: LiteralExprContext) => void;

	/**
	 * Enter a parse tree produced by `arithmeticParser.file`.
	 * @param ctx the parse tree
	 */
	enterFile?: (ctx: FileContext) => void;
	/**
	 * Exit a parse tree produced by `arithmeticParser.file`.
	 * @param ctx the parse tree
	 */
	exitFile?: (ctx: FileContext) => void;

	/**
	 * Enter a parse tree produced by `arithmeticParser.expression`.
	 * @param ctx the parse tree
	 */
	enterExpression?: (ctx: ExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `arithmeticParser.expression`.
	 * @param ctx the parse tree
	 */
	exitExpression?: (ctx: ExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `arithmeticParser.atom`.
	 * @param ctx the parse tree
	 */
	enterAtom?: (ctx: AtomContext) => void;
	/**
	 * Exit a parse tree produced by `arithmeticParser.atom`.
	 * @param ctx the parse tree
	 */
	exitAtom?: (ctx: AtomContext) => void;
}

