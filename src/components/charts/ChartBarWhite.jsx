import React from 'react';
import BarTemplate from './ChartBarTemplate';

function BarWhite({
  labels = [],
  data = [],
  title = '',
  label = '',
  padding = 0,
  backgroundColor,
  onPointClick
}) {
  return (
    <BarTemplate
      labels={labels}
      data={{
        label,
        items: data,
        borderColor: '#23aecd',
        backgroundColor
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

export default BarWhite;
