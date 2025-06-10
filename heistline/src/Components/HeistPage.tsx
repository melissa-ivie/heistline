import { useParams, Link, useNavigate } from 'react-router-dom';
import heists from '../Data/heistData';
import '../App.css';
import { useState } from 'react';

type HeistKey = keyof typeof heists;

export default function HeistPage() {
  const { heistName } = useParams();
  const navigate = useNavigate();
  const decoded = decodeURIComponent(heistName || '');
  const isValidHeist = decoded in heists;

  const [enteredCode, setEnteredCode] = useState('');

  if (!isValidHeist) {
    return (
      <div className="app-container">
        <h1 className="app-title">UNKNOWN MISSION</h1>
        <p className="panel-text">We couldn't find a mission called "{decoded}".</p>
        <Link to="/">
          <button className="developer-button">Back to HQ</button>
        </Link>
      </div>
    );
  }

  const heist = heists[decoded as HeistKey];
  const accessKey = `${decoded}-access`;
  const localAccessCode = localStorage.getItem(accessKey);
  const hasAccess = heist.isFree || localAccessCode;

  const handleAccessCodeSubmit = () => {
    if (enteredCode === localAccessCode) {
      navigate(`/heist/${encodeURIComponent(decoded)}/start`);
    } else {
      alert('Invalid access code.');
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">{heist.title.toUpperCase()}</h1>

      <div className="mission-briefing fade-in">
        <div className="mission-header">
          <h2 className="mission-label">Mission Briefing</h2>
          <div className="mission-id">
            FILE #{heist.title.toUpperCase().replace(/\s/g, '_')}
          </div>
        </div>
        <div className="panel-text mission-text">{heist.description}</div>
      </div>

      <div className="developer-button-wrapper">
        {hasAccess ? (
          <Link
            to={`/heist/${encodeURIComponent(decoded)}/start`}
            state={{ fromStartButton: true }}
          >
            <button className="developer-button" style={{ marginBottom: '2rem' }}>
              START MISSION
            </button>
          </Link>
        ) : (
          <>
            <h2 className="panel-heading">Enter Access Code</h2>
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
            <button
              className="developer-button"
              style={{ marginBottom: '2rem' }}
              onClick={handleAccessCodeSubmit}
            >
              Submit Code
            </button>

            <p className="panel-text" style={{ marginBottom: '1rem' }}>
              Don’t have a code?
            </p>
            <button
              className="developer-button"
              onClick={() => navigate(`/purchase/${encodeURIComponent(decoded)}`)}
            >
              Unlock Mission - $10
            </button>
          </>
        )}

        <Link to="/">
          <button className="developer-button" style={{ marginTop: '2rem' }}>
            BACK TO HQ
          </button>
        </Link>
      </div>
    </div>
  );
}
