import React from 'react';
import LineTemplate from './ChartLineTemplate';

function LineBlack({
  labels = [],
  data = [],
  title = '',
  label = '',
  padding = 0
}) {
  return (
    <LineTemplate
      labels={labels}
      data={{
        label,
        items: data,
        borderColor: '#4d4d4d',
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      }}
      options={{
        title,
        titleColor: '#191922',
        axisFontColor: '#191922',
        gridLineColor: '#c9c9c9',
        padding
      }}
    />
  );
}

export default LineBlack;
