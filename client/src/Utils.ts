import React from 'react';

export const thunk = <A, B>(m: ((_: A) => B), n: A) => () => m(n);

const onKey = (keyCode: number) => <U>(thunk: () => U) => <T> (ev: React.KeyboardEvent<T>) => {
  if (ev.which === keyCode) {
    thunk();
  }
}

export const onEnter = onKey(13);