import { useParams, useNavigate, Link } from 'react-router-dom';
import heists from '../Data/heistData';
import '../App.css';
import { useState } from 'react';

export default function PurchasePage() {
  const { heistName } = useParams();
  const navigate = useNavigate();
  const decoded = decodeURIComponent(heistName || '');
  const heist = heists[decoded as keyof typeof heists];
  const [enteredCode, setEnteredCode] = useState('');

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

  const accessKey = `${decoded}-access`;

  const handleMockPayment = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    const email = prompt("Enter your email to receive your access code:");
    if (email) {
      localStorage.setItem(accessKey, code);
      alert(`Access code sent to ${email}: ${code}`);
      navigate(`/heist/${encodeURIComponent(decoded)}/start`);
    }
  };

  const handleAccessCodeSubmit = () => {
    const savedCode = localStorage.getItem(accessKey);
    if (enteredCode === savedCode) {
      navigate(`/heist/${encodeURIComponent(decoded)}/start`);
    } else {
      alert('Invalid access code.');
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Unlock {heist.title}</h1>

      <div className="mission-briefing fade-in">
        <p className="panel-text">
          This mission costs $10. You’ll receive an access code via email upon payment.
        </p>
        <button className="developer-button" onClick={handleMockPayment}>
          Pay with Google Pay
        </button>

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
            marginBottom: '1rem'
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
