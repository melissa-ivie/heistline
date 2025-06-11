import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import '../../../App.css';

export default function SmugglerContact() {
  const { heistName } = useParams();
  const [complete, setComplete] = useState(
    localStorage.getItem(`${heistName}-objective-smuggler-contact`) === 'complete'
  );

  const handleChange = () => {
    const updated = !complete;
    setComplete(updated);
    localStorage.setItem(`${heistName}-objective-smuggler-contact`, updated ? 'complete' : '');
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Objective: Smuggler Contact</h1>
      <p className="panel-text">Locate the extraction smuggler and secure a travel alias.</p>
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