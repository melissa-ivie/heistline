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

 const handleMockPayment = async () => {
  const email = prompt("Enter your email to receive your access code:");
  if (!email) return;

  try {
    const response = await fetch('https://heistline-access-api.onrender.com/api/generate-access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_HEISTLINE_ACCESS_TOKEN}`
      },
      body: JSON.stringify({ email, heistName: decoded }),
    });

    const data = await response.json();
        if (data.success) {
        alert(`Access code sent to ${email}`);
        navigate(`/heist/${encodeURIComponent(decoded)}`);
        } else {
        alert(data.error || 'Failed to generate access code.');
        }
        } catch (err) {
            alert('Network error. Please try again later.');
        }
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
