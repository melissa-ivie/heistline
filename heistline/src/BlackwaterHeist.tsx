// src/BlackwaterHeist.tsx

import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import { useCountdown } from './CountdownContext';

const getObjectives = (heistName: string) => {
  const objectivesMap: Record<string, string[]> = {
    'Operation Blackwater': [
      'Prevent the plane from taking off or ensure it lands safely.',
      'Recover the original water contamination report from Nexacore’s buried R&D archive.',
      'Trace internal communications and extract the CEO’s incriminating email.',
      'Deliver the files anonymously to the FDA and FBI without leaving a digital trail.',
    ],
  };
  return objectivesMap[heistName] || [];
};

const objectiveImages = [
  '/images/airport-control.png',
  '/images/contamination-report.png',
  '/images/email-server.png',
  '/images/fbi.jpg',
];

const objectiveTitles = [
  'Airport',
  'Contamination Report',
  'Email Servers',
  'FBI',
];

const objectiveRoutes = [
  'airport',
  'contamination-report',
  'email-servers',
  'fbi',
];

export default function BlackwaterHeist() {
  const { heistName } = useParams();
  const decoded = decodeURIComponent(heistName || '');
  const { timeLeft, stopCountdown } = useCountdown();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const objectives = getObjectives(decoded);

  const [completed, setCompleted] = useState<Record<number, boolean>>(() => {
    const state: Record<number, boolean> = {};
    objectiveRoutes.forEach((route, idx) => {
      state[idx] = sessionStorage.getItem(`${decoded}-objective-${route}`) === 'complete';
    });
    return state;
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const allCompleted = Object.values(completed).every((v) => v);
    const failed = timeLeft <= 0 && !allCompleted;

    if (allCompleted || failed) {
      document.getElementById('outcome-overlay')?.classList.add('show');

      // Stop countdown interval
      stopCountdown();

      // Persist timer as 0
      sessionStorage.setItem(`${decoded}-timer`, '0');

      // Reset checkboxes if mission completed
      if (allCompleted) {
        objectiveRoutes.forEach((route) => {
          sessionStorage.setItem(`${decoded}-objective-${route}`, '');
        });
      }
    }
  }, [completed, timeLeft, stopCountdown, decoded]);

  return (
    <div
    className="app-container blackwater-background"
    style={{ overflowY: 'auto' }}
    >      
    <h2 className="operation-title">MISSION: {decoded.toUpperCase()}</h2>
      <div className="countdown-timer">{formatTime(timeLeft)}</div>

      <div className="objectives-panel">
        {objectives.map((text, idx) => (
          <div key={idx} className={`objective-box ${completed[idx] ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={completed[idx]}
              readOnly
              disabled
              className="status-checkbox"
            />
            <span>{text}</span>
          </div>
        ))}
      </div>

      <div className="puzzle-grid two-by-two">
        {objectiveTitles.map((title, idx) => (
          <Link
            to={`/heist/${encodeURIComponent(decoded)}/objective/${objectiveRoutes[idx]}`}
            key={idx}
            className="puzzle-image-tile centered-label"
            style={{ backgroundImage: `url(${objectiveImages[idx % objectiveImages.length]})` }}
            state={{ fromObjective: true }}
          >
            <span className="puzzle-label no-bg">{title}</span>
          </Link>
        ))}
      </div>

      <Link to="/">
        <button className="developer-button" style={{ marginTop: '2rem' }}>
          BACK TO HQ
        </button>
      </Link>

      <div id="outcome-overlay" className="outcome-overlay">
        <div className="outcome-modal">
          <h2>{Object.values(completed).every(v => v) ? '🎉 Mission Complete!' : '💥 Mission Failed'}</h2>
          <p>
            {Object.values(completed).every(v => v)
              ? "You've completed all objectives and saved the town!"
              : "Time ran out before all objectives were completed."}
          </p>
          <Link to="/" onClick={() => {
            sessionStorage.setItem(`${decoded}-timer`, '3600');
          }}>
            <button className="developer-button" style={{ marginTop: '1rem' }}>
              Back to HQ
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
