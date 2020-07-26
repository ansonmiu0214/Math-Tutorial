import React from 'react';

const Latex = require('react-latex');

export default function LatexWrapper(props) {
  return <Latex>
    {typeof props.children === 'object'
      ? props.children.join('')
      : props.children
    }
  </Latex>;
}