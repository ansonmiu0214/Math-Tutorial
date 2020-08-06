import React from 'react';
import { TextField, makeStyles, Container, InputAdornment, IconButton, Modal, Paper, CircularProgress } from '@material-ui/core';
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
  const [errorText, setErrorText] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [parsedPayload, setParsedPayload] = React.useState<ParsedPayload>();

  const parseSuccess = async (response: Response) => {
    try {
      const { expr, steps } = await response.json();
      const exprNode = ExprNodeUtils.deserialise(expr) as ExprNode;
      const middleSteps = steps.map((step: any) => ExprNodeUtils.deserialise(step));
      setParsedPayload({ expr: exprNode, middleSteps });
    } catch (errorText) {
      setErrorText(errorText);
    }
  };

  const parseError = async (response: Response) => {
    try {
      const { message } = await response.json();
      setErrorText(`Error: ${message}`);
    } catch (errorText) {
      setErrorText(errorText);
    }
  };

  const parseInternalError = async (_: Response) => {
    setErrorText('Internal Server Error');
  }

  const responseHandlers = new Map([
    [200, parseSuccess],
    [400, parseError],
    [500, parseInternalError],
  ]);

  const parseExpression = async (exprString: string) => {
    const exprQuery = encodeURIComponent(exprString);
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/tree/${exprQuery}`);
      const handler = responseHandlers.get(response.status);
      await handler?.(response);      
    } catch (errorText) {
      setErrorText(errorText);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setExpr('');
    setParsedPayload(undefined);
    setErrorText(undefined);
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
                  {loading ? <CircularProgress /> :
                    <IconButton
                      edge='end'
                      onClick={thunk(parseExpression, expr)}
                    >
                      <KeyboardReturn />
                    </IconButton>
                  }
                </InputAdornment>
              ),
              style: {
                display: parsedPayload ? 'none' : 'inline-flex',
              },
            }}
            value={expr}
            onChange={({ target }) => setExpr(target.value)}
            onKeyPress={onEnter(thunk(parseExpression, expr))}
            error={errorText !== undefined}
            helperText={errorText}
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