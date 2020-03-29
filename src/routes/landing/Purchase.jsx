import React, { useState, useContext } from 'react';
import Landing from './Landing';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useElements,
  useStripe
} from '@stripe/react-stripe-js';
import { ButtonMain } from '../../components/buttons';
import { CardError } from '../../components/cards';
import { purchaseMonthly, purchaseFixed, purchase } from '../../apis/API';
import { AuthContext } from '../../contexts';

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
    error: ''
  });
  const stripe = useStripe();
  const elements = useElements();

  // Handle real-time validation errors from the card Element.
  const handleChange = event => {
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
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
            console.log('success');
          } else {
            throw 'Error';
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  };

  return (
    <form className='form-purchase' onSubmit={handleSubmit}>
      <section className='form'>
        <label htmlFor='card-element' className='font-short-regular'>
          Credit or debit card
        </label>
        <CardElement id='card-element' onChange={handleChange} />
        {error ? <CardError message={status.error} /> : ''}
      </section>
      <section>{/* Plan full description */}</section>
      <section>
        <ButtonMain onClick={handleSubmit} disabled={status.purchasing}>
          Purchase Premium
        </ButtonMain>
      </section>
    </form>
  );
};

export default Purchase;
