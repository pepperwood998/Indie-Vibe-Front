import React, { useContext, useEffect, useState } from 'react';
import { getStreamRelease } from '../../../apis/APIWorkspace';
import Placeholder from '../../../assets/imgs/placeholder.png';
import { ButtonLoadMore } from '../../../components/buttons';
import { BarWhite } from '../../../components/charts';
import { AuthContext } from '../../../contexts';
import {
  createMonthOptions,
  createYearOptions,
  current,
  formatNumber,
  getDatePart,
  mapColor,
  streamCompare
} from '../../../utils/Common';

function StatisticRelease() {
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
    title: 'Release stream per month',
    label: 'Play time',
    backgroundColor: [],
    onPointClick: index => {
      setSelected(index);
    }
  });

  const releaseSrc = extra.src;
  const releases = releaseSrc.items;

  // effect: release
  useEffect(() => {
    setForm({ ...form, submitting: true });
    getStreamRelease(
      authState.token,
      authState.id,
      form.month,
      form.year,
      releaseSrc.offset
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
              mapColor(release.streamCountPerMonth, streamCompare.release)
            )
          });
        } else throw res.data;
      })
      .catch(err => {
        console.error(err);
      });
  }, [form.month, form.year]);

  const handleChangeDate = e => {
    setExtra({ ...extra, src: { ...extra.src, offset: 0 } });
    setForm({
      ...form,
      [e.target.getAttribute('name')]: e.target.value
    });
  };

  const handleLoadMore = () => {
    getStreamRelease(
      authState.token,
      authState.id,
      form.month,
      form.year,
      releaseSrc.offset + releaseSrc.limit
    )
      .then(res => {
        if (res.status === 'success' && res.data) {
          const { items } = res.data;

          setExtra({
            ...extra,
            src: {
              ...releaseSrc,
              ...res.data,
              items: [...releaseSrc.items, ...items]
            }
          });
          setChartData({
            ...chartData,
            labels: [
              ...chartData.labels,
              ...items.map(release => release.title)
            ],
            data: [
              ...chartData.data,
              ...items.map(release => release.streamCountPerMonth)
            ],
            backgroundColor: [
              ...chartData.backgroundColor,
              ...items.map(release =>
                mapColor(release.streamCountPerMonth, streamCompare.release)
              )
            ]
          });
        }
      })
      .catch(err => {
        console.error(err);
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
        <div className='mr-4 flex-1 align-self-start'>
          {!releases[selected] ? (
            <span className='font-short-regular font-gray-light'>
              Select a release
            </span>
          ) : (
            <React.Fragment>
              <section className='single box-details d-flex'>
                <div className='thumbnail'>
                  <div className='img-wrapper'>
                    <img
                      className='img'
                      src={
                        releases[selected].thumbnail
                          ? releases[selected].thumbnail
                          : Placeholder
                      }
                    />
                  </div>
                </div>
                <div className='d-flex pl-3 flex-column'>
                  <span className='font-short-regular font-white pb-1'>
                    {releases[selected].title}
                  </span>
                  <span className='font-short-regular font-white pb-2'>
                    {getDatePart(releases[selected].date)}
                  </span>
                  <span
                    className='font-short-extra font-weight-bold font-white'
                    style={{
                      color: mapColor(
                        releases[selected].streamCountPerMonth,
                        streamCompare.release
                      )
                    }}
                  >
                    {formatNumber(releases[selected].streamCountPerMonth)} times
                  </span>
                </div>
                <div className='flex-1'></div>
              </section>
              <section className='list box-details'>
                <ul className='table-layout table-layout--collapse'>
                  {releases
                    .filter((item, index) => index !== selected)
                    .map((item, index) => (
                      <li
                        key={index}
                        className='table-row'
                        onClick={() => {
                          if (index >= selected) setSelected(index + 1);
                          else setSelected(index);
                        }}
                      >
                        <div className='serial center content-width center font-gray-light'>
                          <span>{index + 1}</span>
                        </div>
                        <div className='thumbnail-wrapper content-width'>
                          <div className='thumbnail'>
                            <div className='img-wrapper'>
                              <img
                                className='img'
                                src={
                                  item.thumbnail ? item.thumbnail : Placeholder
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className='title font-gray-light'>
                          <span className='ellipsis one-line'>
                            {item.title}
                          </span>
                        </div>
                        <div className='count right font-white'>
                          <span className='ellipsis one-line'>
                            {formatNumber(item.streamCountPerMonth)}
                          </span>
                        </div>
                      </li>
                    ))}
                </ul>
                {releaseSrc.total > releaseSrc.offset + releaseSrc.limit ? (
                  <ButtonLoadMore onClick={handleLoadMore}>
                    Load more
                  </ButtonLoadMore>
                ) : (
                  ''
                )}
              </section>
            </React.Fragment>
          )}
        </div>
        <div className='chart flex-1 align-self-start'>
          <BarWhite {...chartData} />
        </div>
      </div>
    </React.Fragment>
  );
}

export default StatisticRelease;
