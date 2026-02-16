import { useParams, Link } from 'react-router-dom';
import '../../../App.css';
import { useState, useEffect } from 'react';


export default function EmailServersObjective() {
  const { heistName } = useParams();
  const [complete, setComplete] = useState(
  localStorage.getItem(`${heistName}-email-servers`) === 'complete'
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = () => {
    const updated = !complete;
    setComplete(updated);
    localStorage.setItem(`${heistName}-objective-email-servers`, updated ? 'complete' : '');
  };
  return (
    <div className="app-container">
      <h1 className="app-title">Objective: Email Servers</h1>
      <p className="panel-text">Trace internal communications and extract the CEO’s incriminating email.</p>
      <label>
        <input type="checkbox" checked={complete} onChange={handleChange} />
        Mission Complete
      </label>
      <Link to={`/heist/${heistName}/start`}>
        <button className="developer-button" style={{ marginTop: '1rem' }}>
          Back to Objectives
        </button>
      </Link>
    </div>
  );
}
