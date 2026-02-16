import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../../../App.css';

export default function IdentityWipe() {
  const { heistName } = useParams();
  const [complete, setComplete] = useState(
    localStorage.getItem(`${heistName}-objective-identity-wipe`) === 'complete'
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = () => {
    const updated = !complete;
    setComplete(updated);
    localStorage.setItem(`${heistName}-objective-identity-wipe`, updated ? 'complete' : '');
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Objective: Identity Wipe</h1>
      <p className="panel-text">Scrub all biometric and identity records from central databases.</p>
      <label>
        <input type="checkbox" checked={complete} onChange={handleChange} /> Mission Complete
      </label>
      <Link to={`/heist/${heistName}/start`}>
        <button className="developer-button" style={{ marginTop: '1rem' }}>
          Back to Objectives
        </button>
      </Link>
    </div>
  );
}