import { ExprNodeUtils } from './ExprNode';
import { buildExprTree } from '../parser';

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