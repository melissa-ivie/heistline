import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useStripe, useElements, Elements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions } from '@stripe/stripe-js';
import heists from '../Data/heistData';
import '../App.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

export default function PurchasePage() {
  const { heistName } = useParams();
  const navigate = useNavigate();
  const decoded = decodeURIComponent(heistName || '');
  const heist = heists[decoded as keyof typeof heists];

  const [clientSecret, setClientSecret] = useState('');
  const [email, setEmail] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const accessKey = `${decoded}-access`;
  const hasHandledRedirect = useRef(false);

  useEffect(() => {
    const secret = new URLSearchParams(window.location.search).get('payment_intent_client_secret');
    if (!secret || hasHandledRedirect.current) return;

    hasHandledRedirect.current = true;

    stripePromise.then(stripe => {
      if (!stripe) return;
      stripe.retrievePaymentIntent(secret).then(({ paymentIntent }) => {
        if (paymentIntent?.status === 'succeeded') {
          alert('Payment successful! Your access code will arrive via email shortly.');
          navigate(`/heist/${encodeURIComponent(decoded)}`);
        }
      });
    });
  }, [decoded, navigate]);

  useEffect(() => {
    if (!decoded || !email) return;

    fetch('https://heistline-access-api.onrender.com/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, heistName: decoded }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.clientSecret) setClientSecret(data.clientSecret);
      })
      .catch(err => {
        console.error('Failed to create payment intent:', err);
      });
  }, [decoded, email]);

  const appearance: StripeElementsOptions['appearance'] = {
    theme: 'night',
    labels: 'floating',
  };

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  const handleAccessCodeSubmit = async () => {
    try {
      const res = await fetch(`https://heistline-access-api.onrender.com/api/verify-access?code=${enteredCode}&heist=${decoded}`);
      const data = await res.json();
      if (data.valid) {
        localStorage.setItem(accessKey, enteredCode);
        navigate(`/heist/${encodeURIComponent(decoded)}/start`);
      } else {
        alert('Invalid access code.');
      }
    } catch (err) {
      alert('Failed to verify access code. Please try again later.');
    }
  };

  if (!heist) {
    return (
      <div className="app-container">
        <h1 className="app-title">INVALID MISSION</h1>
        <Link to="/">
          <button className="developer-button">Back to HQ</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1 className="app-title">Unlock {heist.title}</h1>

      <div className="mission-briefing fade-in">
        <p className="panel-text">This mission costs $10. Pay below to receive your access code via email.</p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid #4C5A6B',
            backgroundColor: '#0F1C2F',
            color: '#E3EAF3',
            marginBottom: '1rem',
          }}
        />

        {clientSecret && (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm isProcessing={isProcessing} setIsProcessing={setIsProcessing} />
          </Elements>
        )}

        <hr style={{ margin: '2rem 0', width: '100%', borderColor: '#2A3244' }} />

        <h2 className="panel-heading">Already have an access code?</h2>
        <input
          type="text"
          placeholder="Enter access code"
          value={enteredCode}
          onChange={(e) => setEnteredCode(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid #4C5A6B',
            backgroundColor: '#0F1C2F',
            color: '#E3EAF3',
            marginBottom: '1rem',
          }}
        />
        <button className="developer-button" onClick={handleAccessCodeSubmit}>
          Submit Code
        </button>
      </div>

      <Link to="/">
        <button className="developer-button" style={{ marginTop: '2rem' }}>
          Back to HQ
        </button>
      </Link>
    </div>
  );
}


type CheckoutFormProps = {
  isProcessing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
};

function CheckoutForm({ isProcessing, setIsProcessing }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: 'always',
    });

    if (result.error) {
      alert(result.error.message);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        className="developer-button"
        type="submit"
        disabled={!stripe || isProcessing}
        style={{ marginTop: '1rem' }}
      >
        {isProcessing ? 'Processing...' : 'Pay $10'}
      </button>
    </form>
  );
}
