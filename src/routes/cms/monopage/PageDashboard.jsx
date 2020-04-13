import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRevenueMonth, getStatisticsMonthly } from '../../../apis/APICms';
import { ArrowRight } from '../../../assets/svgs';
import { LineMulBlack } from '../../../components/charts';
import { AuthContext, LibraryContext } from '../../../contexts';
import { current, months } from '../../../utils/Common';
import { TableArtistRequests, TableReportRequests } from '../components/tables';

function Dashboard(props) {
  const { state: authState } = useContext(AuthContext);
  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);

  const [chartRevenue, setChartRevenue] = useState([
    {
      label: 'Total revenue',
      data: [],
      borderColor: '#23aecd',
      backgroundColor: 'rgba(35, 174, 205, 0.1)'
    }
  ]);
  const [chartStream, setChartStream] = useState([
    {
      label: 'Count',
      data: [],
      borderColor: '#46a049',
      backgroundColor: 'rgba(70, 160, 73, 0.1)'
    }
  ]);

  useEffect(() => {
    getRevenueMonth(authState.token, current.year)
      .then(res => {
        if (res.status === 'success' && res.data) {
          const { data } = res;

          let newChart = [...chartRevenue];
          newChart[0].data = data.fixed.map((num, i) => num + data.monthly[i]);
          setChartRevenue([...newChart]);
        } else throw res.data;
      })
      .catch(err => {
        if (typeof err !== 'string') {
          err = 'Server error';
        }

        libDispatch(libActions.setNotification(true, false, err));
      });
    getStatisticsMonthly(authState.token, current.year)
      .then(res => {
        if (res.status === 'success' && res.data) {
          const newChart = [...chartStream];
          newChart[0].data = res.data;

          setChartStream([...newChart]);
        } else throw res.data;
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  return (
    <div className='mono-page-wrapper'>
      <div className='mono-page padder page-home'>
        <section className='catalog-menu'>
          <div className='header'>
            <h3 className='font-short-semi'>CMS Dashboard Overview</h3>
          </div>
          <div className='content'>
            <div className='d-flex'>
              <div className='flex-1 boxy'>
                <h4 className='font-short-big font-weight-bold'>
                  <Link to='/cms/revenue'>
                    Revenue
                    <span>
                      <ArrowRight className='svg--blue' />
                    </span>
                  </Link>
                </h4>
                <LineMulBlack
                  title={`Revenue in ${current.year}`}
                  labels={[...months.short]}
                  set={chartRevenue}
                  legend={false}
                />
              </div>
              <div className='flex-1 boxy ml-3'>
                <h4 className='font-short-big font-weight-bold'>
                  <Link to='/cms/reports'>
                    Reports details
                    <span>
                      <ArrowRight className='svg--blue' />
                    </span>
                  </Link>
                </h4>
                <TableReportRequests
                  onView={report => {
                    props.history.push('/cms/reports');
                  }}
                />
              </div>
            </div>
            <div className='d-flex mt-4'>
              <div className='flex-1 boxy'>
                <h4 className='font-short-big font-weight-bold'>
                  <Link to='/cms/requests'>
                    Review pending requests
                    <span>
                      <ArrowRight className='svg--blue' />
                    </span>
                  </Link>
                </h4>
                <TableArtistRequests />
              </div>
              <div className='flex-1 boxy ml-3'>
                <h4 className='font-short-big font-weight-bold'>
                  <Link to='/cms/streaming'>
                    Go to stream
                    <span>
                      <ArrowRight className='svg--blue' />
                    </span>
                  </Link>
                </h4>
                <LineMulBlack
                  title={`${current.year} stream time`}
                  labels={[...months.short]}
                  set={chartStream}
                  legend={false}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
