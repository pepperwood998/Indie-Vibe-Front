import React from 'react';
import LineTemplate from './ChartLineTemplate';

function LineWhite({
  labels = [],
  data = [],
  title = '',
  label = '',
  padding = 0,
  onPointClick
}) {
  return (
    <LineTemplate
      labels={labels}
      data={{
        label,
        items: data,
        borderColor: '#23aecd',
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      }}
      options={{
        title,
        titleColor: '#f7f7f7',
        axisFontColor: 'white',
        gridLineColor: '#4d4d4d',
        padding
      }}
      onPointClick={onPointClick}
    />
  );
}

export default LineWhite;
