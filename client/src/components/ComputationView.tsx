import React, { Fragment } from 'react';
import { StatefulComputation, } from '../models/Computation';
import SnapshotView from './SnapshotView';
import { Grid, } from '@material-ui/core';
import { Rating } from '@material-ui/lab';

import { renderToTeX } from '../TeXUtils';

import Latex from '../latex';

type Props = {
  computation: StatefulComputation,
};

export default function ComputationView({ computation }: Props) {

  const [isCompleted, setCompleted] = React.useState(computation.complete);
  const [completedSteps, setCompletedSteps] = React.useState<string[]>([
    renderToTeX(computation.snapshot),
  ]);
  const [snapshot, setSnapshot] = React.useState(computation.snapshot);

  const [stepIdx, setStepIdx] = React.useState(0);
  const [attempts, setAttempts] = React.useState<boolean[]>([]);

  const recordAttempt = (result: boolean) => {
    if (stepIdx === attempts.length) {
      setAttempts([...attempts, result]);
    }
  };

  const next = () => {
    computation.next();
    setCompletedSteps([
      ...completedSteps,
      renderToTeX(computation.snapshot),
    ]);
    setCompleted(computation.complete);
    setSnapshot(computation.snapshot);
    setStepIdx(stepIdx + 1);
  };

  return (
    <div style={{ fontSize: '2rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
      <Grid container>
      {completedSteps.map((completedStep, key) => { 
        return (
          <Fragment key={key}>
            <Grid item xs={2} lg={4} style={{ textAlign: 'right', }}>
              {key !== 0 && <Latex>$=~$</Latex>}
            </Grid>
            <Grid item xs={10} lg={8} style={{ textAlign: 'left', }}>

              <Latex>${completedStep}$</Latex>
            </Grid>
          </Fragment>
        );
      })}
      {isCompleted &&
        <Grid item xs={12} style={{ textAlign: 'center' }}>
          <Rating
            max={attempts.length}
            value={attempts.filter(attempt => attempt).length}
            size='large'
            readOnly
          />
        </Grid>
      }
      </Grid>
      {!isCompleted &&
        <SnapshotView
          recordAttempt={recordAttempt}
          snapshot={snapshot}
          next={next}
        />
      }
    </div>
  );
}