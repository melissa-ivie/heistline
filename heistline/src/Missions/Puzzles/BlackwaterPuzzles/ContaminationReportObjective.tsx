import { useParams, Link } from 'react-router-dom';
import '../../../App.css';
import { useState } from 'react';


export default function ContaminationReportObjective() {
  const { heistName } = useParams();
  const [complete, setComplete] = useState(
  localStorage.getItem(`${heistName}-objective-contamination-report`) === 'complete'
  );

  const handleChange = () => {
    const updated = !complete;
    setComplete(updated);
    localStorage.setItem(`${heistName}-objective-contamination-report`, updated ? 'complete' : '');
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Objective: Contamination Report</h1>
      <p className="panel-text">Recover the original water contamination report from Nexacore’s buried R&D archive.</p>
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
