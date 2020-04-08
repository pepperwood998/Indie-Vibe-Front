import React, { useContext, useEffect, useState } from 'react';
import { getStreamRelease } from '../../../apis/APIWorkspace';
import { BarWhite } from '../../../components/charts';
import { AuthContext } from '../../../contexts';
import {
  createMonthOptions,
  createYearOptions,
  current,
  mapColor
} from '../../../utils/Common';
function StatisticRelease() {
  const { state: authState } = useContext(AuthContext);

  const [selected, setSelected] = useState(current.month - 1);
  const [form, setForm] = useState({
    month: current.month,
    year: current.year,
    submitting: false
  });
  const [extra, setExtra] = useState({
    src: { items: [], offset: 0, limit: 0, total: 0 }
  });
  const [chartData, setChartData] = useState({
    labels: [],
    data: [],
    title: 'Release stream per month',
    label: 'Play time',
    backgroundColor: [],
    onPointClick: index => {
      setSelected(index);
    }
  });

  const releaseSrc = extra.src;

  // effect: release
  useEffect(() => {
    setForm({ ...form, submitting: true });
    getStreamRelease(authState.token, authState.id, form.month, form.year)
      .then(res => {
        if (res.status === 'success' && res.data) {
          setForm({ ...form, submitting: false });

          const { items } = res.data;
          setExtra({ src: { ...res.data } });
          setChartData({
            ...chartData,
            labels: items.map(release => release.title),
            data: items.map(release => release.streamCountPerMonth),
            backgroundColor: items.map(release =>
              mapColor(release.streamCountPerMonth, 50000)
            )
          });
        } else throw res.data;
      })
      .catch(err => {
        console.error(err);
      });
  }, [form.month, form.year]);

  const handleChangeDate = e => {
    setForm({
      ...form,
      [e.target.getAttribute('name')]: e.target.value
    });
  };

  return (
    <React.Fragment>
      <div className='d-flex w-50 pb-3'>
        <label
          htmlFor='release-month'
          className='label d-flex align-items-center pr-2'
        >
          Select month
        </label>
        <select
          id='release-month'
          name='month'
          value={form.month}
          className='custom-select'
          onChange={handleChangeDate}
        >
          {createMonthOptions()}
        </select>
        <label
          htmlFor='release-year'
          className='label d-flex align-items-center ml-4 pr-2'
        >
          Select year
        </label>
        <select
          id='release-year'
          name='year'
          value={form.year}
          className='custom-select'
          onChange={handleChangeDate}
        >
          {createYearOptions()}
        </select>
      </div>
      <div className='d-flex'>
        <div className='flex-1'>
          <span className='font-white'>
            {releaseSrc.items[selected] ? releaseSrc.items[selected].title : ''}
          </span>
        </div>
        <div className='chart flex-1'>
          <BarWhite {...chartData} />
        </div>
      </div>
    </React.Fragment>
  );
}

export default StatisticRelease;
