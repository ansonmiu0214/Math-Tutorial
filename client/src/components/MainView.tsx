import React from 'react';
import { TextField, makeStyles, Container, InputAdornment, IconButton, Modal, Paper } from '@material-ui/core';
import { ExprNodeUtils } from '../models/ExprNode';
import { KeyboardReturn } from '@material-ui/icons';
import { ExprNode } from '../models/ExprNode';
import { ComputedExprNode } from '../models/Computation';

import { thunk, onEnter } from '../utils';
import MiddleStepsView from './MiddleStepsView';

export interface ParsedPayload {
  expr: ExprNode,
  middleSteps: ComputedExprNode[],
};

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  child: {
    margin: '2rem',
  },
  textField: {
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', 
  },
  input: {
    fontSize: '3rem',
  },
  paper: {
    top: '20%',
    left: '20%',
    width: '60vw',
    height: '60vh',
    position: 'absolute',
    padding: '2rem',
    outline: 0,
    overflowX: 'auto',
    overflowY: 'auto',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default function MainView() {
  const classes = useStyles();

  const [expr, setExpr] = React.useState('');
  const [parsedPayload, setParsedPayload] = React.useState<ParsedPayload>();

  const parseExpression = async (exprString: string) => {
    const exprQuery = encodeURIComponent(exprString);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/tree/${exprQuery}`);
      const json  = await response.json();
      const expr: ExprNode = json.expr;
      const steps: ComputedExprNode[] = json.steps;
      const exprNode = ExprNodeUtils.deserialise(expr) as ExprNode;
      const middleSteps = steps.map(step => ExprNodeUtils.deserialise(step)) as ComputedExprNode[];
      setParsedPayload({ expr: exprNode, middleSteps });
    } catch (error) {
      console.error(error);
    }
  };

  const reset = () => {
    setExpr('');
    setParsedPayload(undefined);
  };

  return (
    <Container>
      <div className={classes.root}> 
        <div className={classes.child}>
          <TextField
            variant='outlined'
            className={classes.textField}
            InputProps={{
              className: classes.input,
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    edge='end'
                    onClick={thunk(parseExpression, expr)}
                  >
                    <KeyboardReturn />
                  </IconButton>
                </InputAdornment>
              ),
              style: {
                display: parsedPayload ? 'none' : 'inline-flex',
              },
            }}
            value={expr}
            onChange={({ target }) => setExpr(target.value)}
            onKeyPress={onEnter(thunk(parseExpression, expr))}
          />
        </div>

        <Modal
          open={parsedPayload !== undefined}
          onClose={reset}
        >
          <Paper
            className={classes.paper}
            elevation={5}
          >
            {parsedPayload !== undefined &&
              <MiddleStepsView
                {...parsedPayload}
              />
            }
          </Paper>
        </Modal>
      </div>
    </Container>
  );
}