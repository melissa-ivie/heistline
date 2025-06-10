import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import '../App.css';

export default function EmbassyEscape() {
  const { heistName } = useParams();
  const [complete, setComplete] = useState(
    localStorage.getItem(`${heistName}-objective-embassy-escape`) === 'complete'
  );

  const handleChange = () => {
    const updated = !complete;
    setComplete(updated);
    localStorage.setItem(`${heistName}-objective-embassy-escape`, updated ? 'complete' : '');
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Objective: Embassy Escape</h1>
      <p className="panel-text">Get the asset across a secure border checkpoint using falsified credentials.</p>
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