import React, { useContext, useEffect, useState } from 'react';
import {
  getStatisticsAnnual,
  getStatisticsMonthly
} from '../../../apis/APICms';
import { LineMulBlack } from '../../../components/charts';
import { AuthContext } from '../../../contexts';
import {
  createYearOptions,
  current,
  mapColor,
  months,
  streamCompare
} from '../../../utils/Common';

function StreamingStatistics(props) {
  const [formAnnual, setFormAnnual] = useState({
    start: 2019,
    end: current.year
  });
  const [formMonthly, setFormMonthly] = useState({
    year: current.year
  });

  const handleChangeAnnual = e => {
    const target = e.target;
    setFormAnnual({
      ...formAnnual,
      [target.getAttribute('name')]: target.value
    });
  };

  return (
    <div className='mono-page-wrapper'>
      <div className='mono-page padder fadein'>
        <section className='catalog-menu boxy'>
          <div className='header'>
            <span className='font-short-big'>Statistics on streaming Time</span>
          </div>
          <div className='content'>
            <div className='d-flex align-items-center mb-3'>
              <label htmlFor='annual-start' className='pr-2'>
                Select start year
              </label>
              <select
                id='annual-start'
                name='start'
                value={formAnnual.start}
                className='custom-select'
                onChange={handleChangeAnnual}
              >
                {createYearOptions()}
              </select>
              <label htmlFor='annual-end' className='pr-2 ml-3'>
                Select end year
              </label>
              <select
                id='annual-end'
                name='end'
                value={formAnnual.end}
                className='custom-select'
                onChange={handleChangeAnnual}
              >
                {createYearOptions()}
              </select>
            </div>
            <Annual form={formAnnual} />
            <div className='d-flex align-items-center mt-5 mb-3'>
              <label htmlFor='year' className='pr-2'>
                Select end year
              </label>
              <select
                id='year'
                name='year'
                value={formMonthly.year}
                className='custom-select'
                onChange={e => {
                  setFormMonthly({ ...formMonthly, year: e.target.value });
                }}
              >
                {createYearOptions()}
              </select>
            </div>
            <Monthly form={formMonthly} />
          </div>
        </section>
      </div>
    </div>
  );
}

function Annual({ form = { start: 2019, end: current.year } }) {
  const { state: authState } = useContext(AuthContext);

  const [chartData, setChartData] = useState([
    {
      label: 'Count',
      data: [],
      borderColor: '#23aecd',
      backgroundColor: 'rgba(35, 174, 205, 0.1)'
    }
  ]);
  const [selected, setSelected] = useState(current.year - form.start);

  const labels = [];
  for (let i = form.start; i <= form.end; i++) {
    labels.push(i);
  }
  const change =
    (chartData[0].data[selected] | 0) - (chartData[0].data[selected - 1] | 0);

  useEffect(() => {
    getStatisticsAnnual(authState.token, form.start, form.end)
      .then(res => {
        if (res.status === 'success' && res.data) {
          const newChartData = [...chartData];
          newChartData[0].data = res.data;

          setChartData([...newChartData]);
        } else throw res.data;
      })
      .catch(err => {
        console.error(err);
      });
  }, [form]);

  return (
    <div className='d-flex'>
      <div className='flex-1'>
        <LineMulBlack
          title='Stream time over the years'
          labels={labels}
          set={chartData}
          onClick={index => {
            setSelected(index);
          }}
        />
      </div>
      <div className='flex-1'>
        <div className='box-statistic shadow mb-3'>
          <div className='font-short-big font-gray-dark'>
            <span>Year</span>
          </div>
          <div className='font-short-extra font-blue-main'>
            <span>{labels[selected]}</span>
          </div>
        </div>
        <div className='box-statistic shadow mb-3'>
          <div className='font-short-big font-gray-dark'>
            <span>Stream time</span>
          </div>
          <div className='font-short-extra font-blue-main'>
            <span
              style={{
                color: mapColor(
                  chartData[0].data[selected] | 0,
                  streamCompare.cms.year
                )
              }}
            >
              {chartData[0].data[selected]} times
            </span>
          </div>
        </div>
        {selected > 0 ? (
          <div className='box-statistic shadow'>
            <div className='font-short-big font-gray-dark'>
              <span>Change from {labels[selected - 1]}</span>
            </div>
            <div className='font-short-extra font-blue-main'>
              <span
                style={{
                  color: change > 0 ? 'green' : change !== 0 ? 'red' : 'gray'
                }}
              >
                {change > 0 ? '+' : ''} {change}
              </span>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

function Monthly({ form = { year: current.year } }) {
  const { state: authState } = useContext(AuthContext);

  const [chartData, setChartData] = useState([
    {
      label: 'Count',
      data: [],
      borderColor: '#46a049',
      backgroundColor: 'rgba(70, 160, 73, 0.1)'
    }
  ]);
  const [selected, setSelected] = useState(current.month - 1);

  const data = chartData[0].data;
  const change = data[selected] - (data[selected - 1] | 0);

  useEffect(() => {
    getStatisticsMonthly(authState.token, form.year)
      .then(res => {
        if (res.status === 'success' && res.data) {
          const newChartData = [...chartData];
          newChartData[0].data = res.data;

          setChartData([...newChartData]);
        } else throw res.data;
      })
      .catch(err => {
        console.error(err);
      });
  }, [form]);

  const labels = [...months.short];

  return (
    <div className='d-flex'>
      <div className='flex-1 pr-5'>
        <div className='box-statistic shadow mb-3'>
          <div className='font-short-big font-gray-dark'>
            <span>Selected date</span>
          </div>
          <div className='font-short-extra font-blue-main'>
            <span>
              {months.full[selected]} {form.year}
            </span>
          </div>
        </div>
        <div className='box-statistic shadow mb-3'>
          <div className='font-short-big font-gray-dark'>
            <span>Stream time</span>
          </div>
          <div className='font-short-extra font-blue-main'>
            <span
              style={{
                color: mapColor(data[selected] | 0, streamCompare.cms.month)
              }}
            >
              {data[selected]} times
            </span>
          </div>
        </div>
        {selected > 0 ? (
          <div className='box-statistic shadow'>
            <div className='font-short-big font-gray-dark'>
              <span>
                Change from{' '}
                {selected === 0 ? `last December` : months.full[selected - 1]}
              </span>
            </div>
            <div className='font-short-extra font-blue-main'>
              <span
                style={{
                  color: change > 0 ? 'green' : change !== 0 ? 'red' : 'gray'
                }}
              >
                {change > 0 ? '+' : ''} {change}
              </span>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
      <div className='flex-1'>
        <LineMulBlack
          title={`Monthly stream time of ${form.year}`}
          labels={labels}
          set={chartData}
          legend={false}
          onClick={index => {
            setSelected(index);
          }}
        />
      </div>
    </div>
  );
}

export default StreamingStatistics;
