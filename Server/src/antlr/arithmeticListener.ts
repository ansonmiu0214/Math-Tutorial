// Generated from arithmetic.g4 by ANTLR 4.7.3-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

import { FileContext } from "./arithmeticParser";
import { ExpressionContext } from "./arithmeticParser";
import { AtomContext } from "./arithmeticParser";
import { RelopContext } from "./arithmeticParser";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `arithmeticParser`.
 */
export interface arithmeticListener extends ParseTreeListener {
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

	/**
	 * Enter a parse tree produced by `arithmeticParser.relop`.
	 * @param ctx the parse tree
	 */
	enterRelop?: (ctx: RelopContext) => void;
	/**
	 * Exit a parse tree produced by `arithmeticParser.relop`.
	 * @param ctx the parse tree
	 */
	exitRelop?: (ctx: RelopContext) => void;
}

