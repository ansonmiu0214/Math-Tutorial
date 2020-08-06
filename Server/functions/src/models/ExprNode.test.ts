import { ExprNodeUtils } from './ExprNode';
import { buildExprTree } from '../parser';

describe('ExprNode parsing', () => {
  it('should throw error on invalid input', () => {
    expect(() => buildExprTree('a')).toThrow('Invalid input');
  });
});

describe('ExprNode eval', () => {
  it('should support literal', () => {
    const tree = buildExprTree('1');
    expect(tree.eval()).toEqual(1);
  });

  it('should support signed literal', () => {
    const tree = buildExprTree('-2');
    expect(tree.eval()).toEqual(-2);
  });

  it('should support addition expression', () => {
    const tree = buildExprTree('1+2');
    expect(tree.eval()).toEqual(3);
  });

  it('should support subtraction expression', () => {
    const tree = buildExprTree('1-2');
    expect(tree.eval()).toEqual(-1);
  });

  it('should support multiplication expression', () => {
    const tree = buildExprTree('1*2');
    expect(tree.eval()).toEqual(2);
  });

  it('should support division expression', () => {
    const tree = buildExprTree('4/2');
    expect(tree.eval()).toEqual(2);
  });

  it('should throw error on evaluating Infinity', () => {
    const tree = buildExprTree('3/0');
    expect(tree.eval.bind(tree)).toThrow();
  });

  it('should throw error on evaluating NaN', () => {
    const tree = buildExprTree('0/0');
    expect(tree.eval.bind(tree)).toThrow();
  });

  it('should throw error on bad subexpression', () => {
    const tree = buildExprTree('1+0/0');
    expect(tree.eval.bind(tree)).toThrow();
  });
});

describe('ExprNode (de)serialisation', () => {
  it('should support literal', () => {
    const tree = buildExprTree('1').serialise();
    expect(ExprNodeUtils.deserialise(tree).serialise()).toEqual(tree);
  });

  it('should support signed literal', () => {
    const tree = buildExprTree('-2').serialise();
    expect(ExprNodeUtils.deserialise(tree).serialise()).toEqual(tree);
  });

  it('should support addition expression', () => {
    const tree = buildExprTree('1+2').serialise();
    expect(ExprNodeUtils.deserialise(tree).serialise()).toEqual(tree);
  });

  it('should support subtraction expression', () => {
    const tree = buildExprTree('1-2').serialise();
    expect(ExprNodeUtils.deserialise(tree).serialise()).toEqual(tree);
  });

  it('should support multiplication expression', () => {
    const tree = buildExprTree('1*2').serialise();
    expect(ExprNodeUtils.deserialise(tree).serialise()).toEqual(tree);
  });

  it('should support division expression', () => {
    const tree = buildExprTree('4/2').serialise();
    expect(ExprNodeUtils.deserialise(tree).serialise()).toEqual(tree);
  });
});