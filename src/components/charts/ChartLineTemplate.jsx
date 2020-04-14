import React from 'react';
import { Line } from 'react-chartjs-2';

function LineTemplate({
  labels = [],
  data = {
    label: '',
    items: [],
    borderColor: 'gray',
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  options = {
    title: '',
    titleColor: 'gray',
    axisFontColor: 'gray',
    axisFontSize: 10,
    gridLineColor: 'gray',
    padding: 0
  },
  onPointClick = index => undefined
}) {
  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            label: data.label,
            data: data.items,
            borderColor: data.borderColor,
            backgroundColor: data.backgroundColor,
            borderWidth: 1,
            hoverBorderWidth: 3,
            pointBorderWidth: 3,
            pointBackgroundColor: 'white'
          }
        ]
      }}
      options={{
        onClick: (e, arr) => {
          if (arr[0]) {
            onPointClick(arr[0]._index);
          }
        },
        legend: {
          display: false
        },
        title: {
          display: true,
          text: options.title,
          fontSize: 18,
          fontFamily: 'Montserrat',
          fontColor: options.titleColor,
          fontStyle: 'normal'
        },
        scales: {
          yAxes: [
            {
              ticks: {
                fontColor: options.axisFontColor,
                fontSize: options.axisFontSize,
                fontStyle: 'normal'
              },
              gridLines: {
                color: options.gridLineColor,
                lineWidth: 0.5
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                fontColor: options.axisFontColor,
                fontSize: options.axisFontSize,
                fontStyle: 'normal'
              },
              gridLines: {
                color: options.gridLineColor,
                lineWidth: 0.5
              }
            }
          ]
        },
        layout: { padding: options.padding },
        maintainAspectRatio: true
      }}
    />
  );
}

export default LineTemplate;
