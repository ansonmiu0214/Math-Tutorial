import { buildExprTree } from '../parser';
import { getIdOfNextStep, getMiddleSteps } from './Computation';
import { BinExprNode, ExprNode, ParenExprNode } from './ExprNode';

describe('BEDMAS computation', () => {
  it('is undefined for literals', () => {
    const tree = buildExprTree('1');
    expect(getIdOfNextStep(tree)).toBeUndefined();
  });

  it('recognises binary expressions', () => {
    const tree = buildExprTree('1+2');
    expect(getIdOfNextStep(tree)).toEqual(tree.id);
  });

  it('recognises left associativity expressions for addition/subtraction', () => {
    const tree = buildExprTree('1+2-3');
    expect(tree).toBeInstanceOf(BinExprNode);

    const first = (tree as BinExprNode<ExprNode>).left;
    expect(first).toBeInstanceOf(BinExprNode);

    expect(getIdOfNextStep(tree)).toEqual(first.id);
  });

  it('recognises left associativity expressions for multiplication/division', () => {
    const tree = buildExprTree('3/2*1');
    expect(tree).toBeInstanceOf(BinExprNode);

    const first = (tree as BinExprNode<ExprNode>).left;
    expect(first).toBeInstanceOf(BinExprNode);

    expect(getIdOfNextStep(tree)).toEqual(first.id);
  });

  it('recognises left associativity expressions for parentheses', () => {
    const tree = buildExprTree('(1+2)*(3-4)');
    expect(tree).toBeInstanceOf(BinExprNode);

    const first = (tree as BinExprNode<ExprNode>).left;
    expect(first).toBeInstanceOf(ParenExprNode);

    expect(getIdOfNextStep(tree)).toEqual(first.id);
  });

  it('priorities multiplication/division over addition/subtraction', () => {
    const tree = buildExprTree('1+2*3');
    expect(tree).toBeInstanceOf(BinExprNode);

    const first = (tree as BinExprNode<ExprNode>).right;
    expect(first).toBeInstanceOf(BinExprNode);

    expect(getIdOfNextStep(tree)).toEqual(first.id);
  });

  it('priorities parentheses over multiplication/division', () => {
    const tree = buildExprTree('(1+2)*3');
    expect(tree).toBeInstanceOf(BinExprNode);

    const first = (tree as BinExprNode<ExprNode>).left;
    expect(first).toBeInstanceOf(ParenExprNode);

    expect(getIdOfNextStep(tree)).toEqual(first.id);
  });

  it('priorities parentheses over addition/subtraction', () => {
    const tree = buildExprTree('(1+2)-3');
    expect(tree).toBeInstanceOf(BinExprNode);

    const first = (tree as BinExprNode<ExprNode>).left;
    expect(first).toBeInstanceOf(ParenExprNode);

    expect(getIdOfNextStep(tree)).toEqual(first.id);
  });
});

describe('BEDMAS middle step generation', () => {
  it('is empty for literals', () => {
    const tree = buildExprTree('1');
    expect(getMiddleSteps(tree)).toHaveLength(0);
  });

  it('has the correct number of steps', () => {
    const tree = buildExprTree('(1+2)*(3-4)/5');
    expect(getMiddleSteps(tree)).toHaveLength(4);
  });
});