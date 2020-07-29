import React from 'react';
import { ParsedPayload } from './MainView';
import { makeStyles, Grid } from '@material-ui/core';

import { renderToTeX } from '../TeXUtils';
import Latex from '../latex';
import SnapshotView from './SnapshotView';
import { Rating } from '@material-ui/lab';
import { ValNode } from '../models/ExprNode';

const useStyles = makeStyles({
  root: {
    fontSize: '2rem',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  equalsSign: {
    textAlign: 'right',
  },
  completedStep: {
    textAlign: 'left',
  },
  rating: {
    textAlign: 'center',
  },
});

export default function MiddleStepsView({ expr, middleSteps }: ParsedPayload) {

  const classes = useStyles();

  const [step, setStep] = React.useState(0);
  const [attempts, setAttempts] = React.useState<boolean[]>([]);
  
  const completedSteps = middleSteps.slice(0, step + 1);
  const isCompleted = step === middleSteps.length;

  if (isCompleted) {
    completedSteps.push(new ValNode(expr.eval()));
  }

  const recordAttempt = (result: boolean) => {
    if (step === attempts.length) {
      setAttempts([...attempts, result]);
    }
  };

  return (
    <div className={classes.root}>
      <Grid container>
        {completedSteps.map((completedStep, key) => (
          <React.Fragment key={key}>
            <Grid item xs={2} lg={4} className={classes.equalsSign}>
              {key !== 0 && <Latex>$=~$</Latex>}
            </Grid>
            <Grid item xs={10} lg={8} className={classes.completedStep}>
              <Latex>${renderToTeX(completedStep)}$</Latex>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>

      {isCompleted &&
        <Grid item className={classes.rating}>
           <Rating
            max={attempts.length}
            value={attempts.filter(attempt => attempt).length}
            size='large'
            readOnly
           />
        </Grid>
      }

      {!isCompleted &&
        <SnapshotView
          recordAttempt={recordAttempt}
          snapshot={middleSteps[step]}
          next={() => setStep(step + 1)}
        />
      }
    </div>
  );
}