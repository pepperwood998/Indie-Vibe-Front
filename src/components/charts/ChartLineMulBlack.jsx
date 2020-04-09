import React from 'react';
import LineMulTemplate from './ChartLineMulTemplate';

function LineMulBlack({
  labels = [],
  set = [],
  title = '',
  onClick = index => undefined
}) {
  return (
    <LineMulTemplate
      labels={labels}
      set={set}
      options={{
        title: {
          text: title,
          fontColor: '#191922'
        },
        axis: {
          color: '#191922',
          gridColor: '#c9c9c9'
        },
        onClick
      }}
    />
  );
}

export default LineMulBlack;
