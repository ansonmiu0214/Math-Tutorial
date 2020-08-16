import React from 'react';
import { ParsedPayload } from './MainView';
import { makeStyles } from '@material-ui/core';

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
    margin: 'auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'auto auto',
    overflow: 'auto auto',
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

  const endRef = React.useRef<HTMLDivElement>(null);

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

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [step]);

  return (
    <div className={classes.root}>
      <div className={classes.grid}>
        {completedSteps.map((completedStep, key) => (
          <React.Fragment key={key}>
            <div>{key !== 0 && <Latex>$=~$</Latex>}</div>
            <div><Latex>${renderToTeX(completedStep)}$</Latex></div>
          </React.Fragment>
        ))}
      </div>
      {isCompleted ?
        <div className={classes.rating}>
           <Rating
            max={attempts.length}
            value={attempts.filter(attempt => attempt).length}
            size='large'
            readOnly
           />
        </div>
        :
        <SnapshotView
          recordAttempt={recordAttempt}
          snapshot={middleSteps[step]}
          next={() => setStep(step + 1)}
        />
      }
    </div>
  );
}