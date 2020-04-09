import React, { useContext, useEffect, useState } from 'react';
import { getStreamTrack } from '../../../apis/APIWorkspace';
import { BarWhite } from '../../../components/charts';
import { AuthContext } from '../../../contexts';
import {
  createMonthOptions,
  createYearOptions,
  current,
  formatNumber,
  mapColor
} from '../../../utils/Common';

function StatisticTrack() {
  const { state: authState } = useContext(AuthContext);

  const [selected, setSelected] = useState(0);
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
    title: 'Song streaming',
    label: 'Play time',
    backgroundColor: [],
    onPointClick: index => {
      setSelected(index);
    }
  });

  const trackSrc = extra.src;
  const tracks = trackSrc.items;

  // effect: release
  useEffect(() => {
    setForm({ ...form, submitting: true });
    getStreamTrack(
      authState.token,
      authState.id,
      form.month,
      form.year,
      trackSrc.offset,
      10
    )
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
        <div className='chart flex-1 align-self-start'>
          <BarWhite {...chartData} />
        </div>
        <div className='ml-4 flex-1 align-self-start'>
          {!tracks[selected] ? (
            <span className='font-short-regular font-gray-light'>
              Select a release
            </span>
          ) : (
            <div className='list box-details'>
              <ul className='table-layout table-layout--collapse'>
                {tracks.map((item, index) => (
                  <li
                    key={index}
                    className='table-row'
                    onClick={() => {
                      if (index >= selected) setSelected(index + 1);
                      else setSelected(index);
                    }}
                  >
                    <div className='serial center font-gray-light'>
                      <span>{index + 1}</span>
                    </div>
                    <div className='title font-gray-light'>
                      <span className='ellipsis one-line'>{item.title}</span>
                    </div>
                    <div className='count font-white right'>
                      <span className='ellipsis one-line'>
                        {formatNumber(item.streamCountPerMonth)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default StatisticTrack;
