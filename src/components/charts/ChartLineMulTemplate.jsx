import React from 'react';
import { Line } from 'react-chartjs-2';

function LineMulTemplate({
  labels = [],
  set = [
    {
      label: '',
      data: [],
      borderColor: '',
      backgroundColor: ''
    }
  ],
  options = {
    title: {
      text: '',
      fontColor: ''
    },
    axis: {
      color: '',
      gridColor: ''
    },
    onClick: (e, arr) => undefined
  }
}) {
  let datasets = [];
  datasets = set.map(item => ({
    ...item,
    borderWidth: 1,
    hoverBorderWidth: 3,
    pointBorderWidth: 3,
    pointBackgroundColor: 'white'
  }));

  return (
    <Line
      data={{ labels, datasets }}
      options={{
        onClick: (e, arr) => {},
        title: {
          ...options.title,
          display: true,
          fontSize: 18,
          fontFamily: 'Montserrat',
          fontStyle: 'normal'
        },
        scales: {
          yAxes: [
            {
              ticks: {
                fontColor: options.axis.color,
                fontStyle: 'normal'
              },
              gridLines: {
                color: options.axis.gridColor,
                lineWidth: 0.5
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                fontColor: options.axis.color,
                fontStyle: 'normal'
              },
              gridLines: {
                color: options.axis.gridColor,
                lineWidth: 0.5
              }
            }
          ]
        },
        maintainAspectRatio: true
      }}
    />
  );
}

export default LineMulTemplate;
