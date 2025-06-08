import { useParams, Link } from 'react-router-dom';
import '../App.css';
import { useState } from 'react';

export default function FBIObjective() {
  const { heistName } = useParams();
  const [complete, setComplete] = useState(
  sessionStorage.getItem(`${heistName}-objective-fbi`) === 'complete'
  );

  const handleChange = () => {
    const updated = !complete;
    setComplete(updated);
    sessionStorage.setItem(`${heistName}-objective-fbi`, updated ? 'complete' : '');
  };
  return (
    <div className="app-container">
      <h1 className="app-title">Objective: FBI</h1>
      <p className="panel-text">Deliver the files anonymously to the FDA and FBI without leaving a digital trail.</p>
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
