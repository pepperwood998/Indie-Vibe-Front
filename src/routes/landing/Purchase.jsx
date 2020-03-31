import {
  CardElement,
  Elements,
  useElements,
  useStripe
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useContext, useState } from 'react';
import { purchase } from '../../apis/API';
import CreditCardLine from '../../assets/imgs/credit-card-line.png';
import Loading from '../../assets/imgs/loading.gif';
import { ButtonMain } from '../../components/buttons';
import { CardError } from '../../components/cards';
import { LinkUnderline } from '../../components/links';
import { AuthContext } from '../../contexts';
import { fixedPrices } from '../../utils/Common';
import Landing from './Landing';

const stripePromise = loadStripe('pk_test_N64DLefNNYKJ4ZO82k4GcFmI00r6PCS6Lh');

function Purchase(props) {
  const { type, packageType } = props.match.params;

  const intro = (
    <div className='content'>
      <Elements stripe={stripePromise}>
        <CheckoutForm type={type} packageType={packageType} />
      </Elements>
    </div>
  );

  return <Landing intro={intro} active='premium' short={true} />;
}

const CheckoutForm = props => {
  const { state: authState } = useContext(AuthContext);

  const [error, setError] = useState(null);
  const [status, setStatus] = useState({
    purchasing: false,
    error: '',
    success: false
  });
  const stripe = useStripe();
  const elements = useElements();

  // Handle real-time validation errors from the card Element.
  const handleChange = event => {
    if (event.error) {
      setStatus({ ...status, error: event.error.message });
    } else {
      setStatus({ ...status, error: '' });
    }
  };

  // Handle form submission.
  const handleSubmit = async event => {
    event.preventDefault();
    setStatus({ ...status, purchasing: true });
    const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);
    if (result.error) {
      // Inform the user if there was an error.
      setStatus({ ...status, error: result.error.message });
    } else {
      setStatus({ ...status, error: '' });
      // Send the token to your server.

      purchase(authState.token, props.type, result.token.id, props.packageType)
        .then(res => {
          setStatus({ ...status, purchasing: false });

          if (res.status === 'success') {
            setStatus({ ...status, success: true });
            setTimeout(() => {
              window.location.href = '/home';
            }, 500);
          } else {
            throw 'Server Error';
          }
        })
        .catch(err => {
          setStatus({
            ...status,
            error: typeof err === 'string' ? err : 'Server Error'
          });
        });
    }
  };

  let planClasses = 'plan';
  if (status.success) planClasses += ' success';
  return (
    <form className='form-purchase' onSubmit={handleSubmit}>
      {status.purchasing ? (
        <div className='layer'>
          <img src={Loading} />
        </div>
      ) : (
        ''
      )}
      <section className='addition'>
        <LinkUnderline
          className='underline font-short-s font-gray-dark'
          href='/premium'
        >
          Change plan
        </LinkUnderline>
      </section>
      <section className={planClasses}>
        {status.success ? (
          <span className='font-short-big font-weight-bold font-white'>
            Purchase Successfully
          </span>
        ) : (
          <div>
            <p className='font-short-big font-weight-bold font-white'>
              Premium Access
            </p>
            {props.type === 'monthly' ? (
              <div>
                <p className='font-short-regular font-weight-bold font-white'>
                  30,000đ / month
                </p>
                <p className='font-short-s font-gray-light'>Cancel anytime.</p>
              </div>
            ) : (
              <div>
                <p className='font-short-regular font-white'>
                  <span className='font-weight-bold'>
                    {fixedPrices[props.packageType][0]}đ
                  </span>
                  &nbsp;for&nbsp;
                  <span className='font-weight-bold'>
                    {fixedPrices[props.packageType][1]}
                  </span>
                </p>
                <p className='font-short-s font-gray-light'>
                  No partial refund.
                </p>
              </div>
            )}
          </div>
        )}
      </section>
      <section className='form'>
        <label
          htmlFor='card-element'
          className='font-short-regular font-weight-bold'
        >
          Credit or debit card:
        </label>
        <div className='credit-card'>
          <img src={CreditCardLine} />
        </div>
        <CardElement id='card-element' onChange={handleChange} />
        {status.error ? <CardError message={status.error} /> : ''}
      </section>
      <section>
        <div className='term font-short-regular'>
          {props.type === 'monthly' ? (
            <p>
              Your premium plan will start immediately after this subscription.
              You will automatically be charged the subscription for every month
              until you cancel. Cancellation can happened at any point in time
              but current month charge will not be refunded.
            </p>
          ) : (
            <p>
              Purchasing this package will allow Indie Vibe to charge you the
              price above for the duration you selected. Your Premium will start
              immediately. You agree that your right of withdrawal, including
              refund. After the period you’ve paid for ends, you will go back to
              your previous subscription at the then-current price unless you
              cancel. Non-subscribers will go back to a free account.No partial
              refunds.
            </p>
          )}
        </div>
      </section>
      <section>
        <ButtonMain onClick={handleSubmit} disabled={status.purchasing}>
          Purchase Premium
        </ButtonMain>
      </section>
    </form>
  );
};

export default Purchase;
