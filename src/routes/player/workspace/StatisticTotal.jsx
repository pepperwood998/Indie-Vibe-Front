import React, { useContext, useEffect, useState } from 'react';
import { getStreamTotal } from '../../../apis/APIWorkspace';
import { LineWhite } from '../../../components/charts';
import { AuthContext } from '../../../contexts';
import {
  createYearOptions,
  current,
  formatNumber,
  mapColor,
  months
} from '../../../utils/Common';

function StatisticTotal() {
  const { state: authState } = useContext(AuthContext);

  const [form, setForm] = useState({
    year: current.year,
    submitting: false
  });
  const [extra, setExtra] = useState({
    selected: current.month - 1
  });

  const [chartData, setChartData] = useState({
    labels: [...months.short],
    data: [],
    title: 'Stream count per month',
    label: 'Total stream',
    onPointClick: index => {
      setExtra({ ...extra, selected: index });
    }
  });

  const revenue = chartData.data[extra.selected] * 5;

  const handleChangeYear = e => {
    setForm({ ...form, year: e.target.value });
  };

  useEffect(() => {
    setForm({ ...form, submitting: true });
    getStreamTotal(authState.token, authState.id, form.year)
      .then(res => {
        if (res.status === 'success') {
          setForm({ ...form, submitting: false });
          setChartData({
            ...chartData,
            data: [...res.data]
          });
        } else throw res.data;
      })
      .catch(err => {
        console.error(err);
      });
  }, [form.year]);

  return (
    <React.Fragment>
      <div className='d-flex w-25 pb-3'>
        <label
          htmlFor='total-year'
          className='label d-flex align-items-center pr-2'
        >
          Select year
        </label>
        <select
          id='total-year'
          name='year'
          value={form.year}
          className='custom-select'
          onChange={handleChangeYear}
        >
          {createYearOptions()}
        </select>
      </div>
      <div className='content'>
        <div className='chart'>
          {form.submitting ? <div className='layer'></div> : ''}
          <LineWhite {...chartData} />
        </div>
        <div className='revenue d-flex flex-column'>
          <div className='box-details d-flex flex-column mb-3'>
            <span className='font-short-big font-gray-light'>
              Recorded date&nbsp;
              <span>
                {current.month - 1 == extra.selected &&
                current.year == form.year ? (
                  <span className='font-weight-bold'>(current)</span>
                ) : (
                  ''
                )}
              </span>
            </span>
            <span className='font-short-extra font-white'>
              {months.full[extra.selected]} {form.year}
            </span>
          </div>
          <div className='box-details d-flex flex-column mb-3'>
            <span className='font-short-big font-gray-light'>Stream count</span>
            <span className='font-short-extra font-white'>
              {formatNumber(chartData.data[extra.selected])}
            </span>
          </div>
          <div className='box-details d-flex flex-column'>
            <span className='font-short-big font-gray-light'>
              Estimated revenue
            </span>
            <span
              className='font-short-extra'
              style={{
                color: mapColor(revenue ? revenue : 0, 2000000)
              }}
            >
              {formatNumber(revenue)} VND
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default StatisticTotal;
