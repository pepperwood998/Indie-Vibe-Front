import React, { useState } from 'react';
import BenefitAds from '../../assets/imgs/benefit-ads.png';
import BenefitControls from '../../assets/imgs/benefit-controls.png';
import BenefitDownload from '../../assets/imgs/benefit-download.png';
import BenefitQuality from '../../assets/imgs/benefit-quality.png';
import CreditCardMonthly from '../../assets/imgs/credit-card-monthly.png';
import CreditCard from '../../assets/imgs/credit-card.png';
import Placeholder from '../../assets/imgs/placeholder.png';
import { ButtonMain } from '../../components/buttons';
import Landing from './Landing';
import { fixedPrices } from '../../utils/Common';

function Premium(props) {
  const [fixedPrice, setFixedPrice] = useState('one');

  const handleChangeFixed = e => {
    setFixedPrice(e.target.value);
  };

  const benefits = [
    {
      thumbnail: BenefitDownload,
      title: 'Mobile downloads.',
      desc: 'Service free streaming.'
    },
    {
      thumbnail: BenefitQuality,
      title: 'High quality streaming.',
      desc: 'Listen at the best quality.'
    },
    {
      thumbnail: BenefitAds,
      title: 'Free from ads.',
      desc: 'Never skips a beat.'
    },
    {
      thumbnail: BenefitControls,
      title: 'Full streaming controls.',
      desc: 'Play any tracks.'
    }
  ];

  const payments = [
    {
      title: 'Credit Card Subscription',
      desc: '30,000đ/month. Cancel at anytime.',
      thumbnail: CreditCardMonthly,
      body: (
        <div className='payment-body-single'>
          <a href='/purchase/monthly'>
            <ButtonMain full>SUBSCRIBE</ButtonMain>
          </a>
        </div>
      )
    },
    {
      title: 'Fixed Payment',
      desc: 'Fixed time, fixed payment, no periodical fee.',
      thumbnail: CreditCard,
      body: (
        <div className='payment-body-full'>
          <select
            name='bitrate'
            className='select custom-select release-type'
            onChange={handleChangeFixed}
            value={fixedPrice}
          >
            {Object.keys(fixedPrices).map((key, index) => (
              <option value={key} key={index}>
                {fixedPrices[key][1]}
              </option>
            ))}
          </select>
          <a href={`/purchase/fixed/${fixedPrice}`}>
            <ButtonMain>{`${fixedPrices[fixedPrice][1]} for ${fixedPrices[fixedPrice][0]}`}đ</ButtonMain>
          </a>
        </div>
      )
    }
  ];

  const intro = (
    <div className='content'>
      <div className='font-banner font-weight-bold font-white text-center pb-5'>
        Why <span className='font-green'>Premium</span>?
      </div>
      <div className='custom-grid two-cols'>
        {benefits.map((item, index) => (
          <CardBenefit {...item} key={index} />
        ))}
      </div>
    </div>
  );
  const body = (
    <div className='content'>
      <div className='payments'>
        {payments.map((payment, index) => (
          <CardPayment {...payment} key={index} />
        ))}
      </div>
    </div>
  );

  return <Landing intro={intro} body={body} active='premium' short={true} />;
}

function CardBenefit(props) {
  return (
    <div className='card-benefit'>
      <div className='thumbnail'>
        <img
          className='img'
          src={props.thumbnail ? props.thumbnail : Placeholder}
        />
      </div>
      <div className='info'>
        <div className='title font-short-semi font-weight-bold font-white'>
          {props.title}
        </div>
        <div className='desc font-short-big font-gray-light'>{props.desc}</div>
      </div>
    </div>
  );
}

function CardPayment(props) {
  return (
    <div className='card-payment'>
      <div className='header'>
        <div className='info'>
          <div className='title font-short-big font-weight-bold font-white'>
            {props.title}
          </div>
          <div className='desc font-short-big font-gray-light ellipsis one-line'>
            {props.desc}
          </div>
        </div>
        <div className='thumbnail'>
          <img
            className='img'
            src={props.thumbnail ? props.thumbnail : Placeholder}
          />
        </div>
      </div>
      <div className='body'>{props.body}</div>
    </div>
  );
}

export default Premium;
