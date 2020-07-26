import React from 'react';
import { ComputedExprNode, Status } from '../models/Computation';
import { TextField, makeStyles } from '@material-ui/core';
import { tokenToTeX } from '../TeXUtils';
import { onEnter } from '../Utils';

// const Latex = require('react-latex');
import Latex from '../latex';

type Props = {
  snapshot: ComputedExprNode,
  next: () => void,
  recordAttempt: (result: boolean) => void,
};

const useStyles = makeStyles({
  root: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
  },
  input: {
    fontSize: '2rem',
  },
});

export default function SnapshotView({ snapshot, next, recordAttempt, }: Props) {

  const classes = useStyles();

  const [attempt, setAttempt] = React.useState('');
  const [error, setError] = React.useState(false);

  const buildKeyPressListener = (correctAnswer: number) => onEnter(() => {
    const numericAttempt = Number.parseInt(attempt);
    const correct = numericAttempt === correctAnswer;
    recordAttempt(correct);
    setError(!correct);
    if (correct) {
      next();
      setAttempt('');
    }
  });

  const Literal = (val: number): React.ReactElement => <Latex>${`${val}`}$</Latex>;
  const Parentheses = (expr: ComputedExprNode): React.ReactElement => (
    <>
      <Latex>$($</Latex>
      {render(expr)}
      <Latex>$)$</Latex>
    </>
  );
  const BinaryExpr = (left: ComputedExprNode, op: string, right: ComputedExprNode): JSX.Element => (
    <>
      {render(left)}
      <Latex>${tokenToTeX.get(op)}$</Latex>
      {render(right)}
    </>
  );

  const render = (node: ComputedExprNode) => {
    switch (node.type) {
      case 'val':
        return Literal(node.value);
      case 'parenexpr': 
        return Parentheses(node.expr);
      case 'binexpr':
        switch (node.status) {
          case Status.ACTIVE:
            return <TextField
              error={error}
              className={classes.input}
              InputProps={{
                style: { width: `${attempt.length * 1.2 + 2}rem`, },
              }}
              variant='outlined'
              value={attempt}
              onChange={({ target }) => setAttempt(target.value)}
              onKeyPress={buildKeyPressListener(node.eval())}
            />;
          case Status.INACTIVE:
            return BinaryExpr(node.left, node.opToken, node.right);
          case Status.COMPLETE:
            return Literal(node.eval());
        }
    }
  };

  return (
    <div className={classes.root}>
      <Latex>$=~$</Latex>
      {render(snapshot)}
    </div>
  );
}