import { useParams, Link } from 'react-router-dom';
import '../App.css';
import { useState } from 'react';

export default function AirportObjective() {
  const { heistName } = useParams();
  const [complete, setComplete] = useState(
  sessionStorage.getItem(`${heistName}-objective-airport`) === 'complete'
  );

  const handleChange = () => {
    const updated = !complete;
    setComplete(updated);
    sessionStorage.setItem(`${heistName}-objective-airport`, updated ? 'complete' : '');
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Objective: Airport</h1>
      <p className="panel-text">Prevent the plane from taking off or ensure it lands safely.</p>
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
