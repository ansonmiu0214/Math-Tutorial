import React from 'react';
import { TextField, makeStyles, Container, OutlinedInput, InputAdornment, IconButton, Modal, Paper } from '@material-ui/core';
import { ExprNodeUtils } from '../models/ExprNode';
import ComputationView from './ComputationView';
import { KeyboardReturn } from '@material-ui/icons';
import { StatefulComputation } from '../models/Computation';

const thunk = <A, B>(m: ((_: A) => B), n: A) => () => m(n);

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
  const [computation, setComputation] = React.useState<StatefulComputation>();

  const parseExpression = async (exprString: string) => {
    try {
      const response = await fetch(`/tree/${exprString}`);
      const jsonData = await response.json();
      const exprNode = ExprNodeUtils.deserialise(jsonData);
      const computation = new StatefulComputation(exprNode);
      setComputation(computation);
    } catch (error) {
      console.error(error);
    }
  };

  const reset = () => {
    setExpr('');
    setComputation(undefined);
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
              style: { display: computation ? 'none' : 'inline-flex', },
            }}
            value={expr}
            onChange={({ target }) => setExpr(target.value)}
            onKeyPress={(ev) => {
              if (ev.which === 13) {
                parseExpression(expr);
              }
            }}
          />
        </div>

        <Modal
          open={computation !== undefined}
          onClose={reset}
        >
          <Paper
            className={classes.paper}
            elevation={5}
          >
            {<ComputationView computation={computation!} />}
          </Paper>
        </Modal>
      </div>
    </Container>
  );
}