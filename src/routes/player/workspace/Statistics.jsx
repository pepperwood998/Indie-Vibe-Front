import React, { useContext, useEffect, useState } from 'react';
import { getStreamRelease, getStreamTotal } from '../../../apis/APIWorkspace';
import { BarWhite, LineWhite } from '../../../components/charts';
import { AuthContext } from '../../../contexts';
import {
  createMonthOptions,
  createYearOptions,
  formatNumber,
  mapColor,
  months
} from '../../../utils/Common';

const current = {
  month: new Date().getMonth(),
  year: new Date().getFullYear()
};
function Statistics(props) {
  return (
    <div className='workspace-statistics fadein content-padding'>
      <div className='body__bound'>
        <section className='section total catalog'>
          <div className='catalog__header'>
            <h3 className='font-short-extra font-weight-bold font-white'>
              Monthly stream time
            </h3>
          </div>
          <div className='catalog__body'>
            <Total />
          </div>
        </section>
        <section className='section'>
          <div className='catalog__header'>
            <h3 className='font-short-semi font-weight-bold font-white'>
              Releases stream
            </h3>
          </div>
          <div className='catalog__body'>
            <Release />
          </div>
        </section>
        <section className='section'>
          <div className='catalog__header'>
            <h3 className='font-short-semi font-weight-bold font-white'>
              Tracks stream
            </h3>
          </div>
          <div className='catalog__body'></div>
        </section>
      </div>
    </div>
  );
}

function Total() {
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
        <div className='revenue'>
          <div className='table-layout'>
            <div className='table-row'>
              <span className='header font-short-big font-gray-light'>
                Recorded date
              </span>
              <span className='font-short-big font-white'>
                {months.full[extra.selected]} {form.year}
                {current.month - 1 === extra.selected ? (
                  <span className='font-weight-bold'>(current)</span>
                ) : (
                  ''
                )}
              </span>
            </div>
            <div className='table-row'>
              <span className='header font-short-big font-gray-light'>
                Stream count
              </span>
              <span className='font-short-big font-white'>
                {formatNumber(chartData.data[extra.selected])}
              </span>
            </div>
            <div className='table-row'>
              <span className='header font-short-big font-gray-light'>
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
      </div>
    </React.Fragment>
  );
}

function Release() {
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

export default Statistics;
