import { useParams, Link } from 'react-router-dom';
import { useCountdown } from '../Components/Utilities/CountdownContext';
import '../App.css';
import heists from '../Data/heistData';
import { useState, useEffect } from 'react';

export default function GlassVeilHeist() {
  const { heistName } = useParams();
  const decoded = decodeURIComponent(heistName || '');
  const { timeLeft, stopCountdown } = useCountdown();
  const heist = heists[decoded as keyof typeof heists];
  const objectives = heist?.objectives || [];

  const [paused, setPaused] = useState(false);
  const [internalTime, setInternalTime] = useState(timeLeft);

  const [completed] = useState<Record<string, boolean>>(() => {
    const state: Record<string, boolean> = {};
    objectives.forEach((obj) => {
      const key = `${decoded}-objective-${obj.id}`;
      state[obj.id] = localStorage.getItem(key) === 'complete';
    });
    return state;
  });

  useEffect(() => {
    if (!paused) {
      const interval = setInterval(() => {
        setInternalTime((prev) => Math.max(prev - 1, 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [paused]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!paused) {
      const allCompleted = Object.values(completed).every(Boolean);
      const failed = timeLeft <= 0 && !allCompleted;

      if (allCompleted || failed) {
        document.getElementById('outcome-overlay')?.classList.add('show');
        stopCountdown();
        localStorage.setItem(`${decoded}-timer`, '0');

        if (allCompleted) {
          objectives.forEach((obj) => {
            localStorage.setItem(`${decoded}-objective-${obj.id}`, '');
          });
        }
      }
    }
  }, [completed, timeLeft, stopCountdown, decoded, objectives, paused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePause = () => {
    if (paused) {
      window.location.reload(); // reloads to resume the timer via CountdownProvider
    } else {
      stopCountdown();
    }
    setPaused(!paused);
  };

  return (
    <div className={`app-container blackwater-background`} style={{ overflowY: 'auto', position: 'relative' }}>
      <h2 className="operation-title">MISSION: {decoded.toUpperCase()}</h2>
      <div className="countdown-timer">{formatTime(paused ? internalTime : timeLeft)}</div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <button
          className="developer-button"
          onClick={togglePause}
          style={{ opacity: 0.6, padding: '0.5rem 1rem', fontSize: '0.8rem', maxWidth: '200px' }}
        >
          {paused ? 'RESUME' : 'PAUSE'}
        </button>
      </div>

      <div className="objectives-panel">
        {objectives.map((obj) => (
          <div key={obj.id} className={`objective-box ${completed[obj.id] ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={completed[obj.id]}
              readOnly
              disabled
              className="status-checkbox"
            />
            <span>{obj.description}</span>
          </div>
        ))}
      </div>

      <div className="puzzle-grid two-by-two" style={{ position: 'relative' }}>
        {paused && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              zIndex: 2,
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2rem',
              fontWeight: 'bold'
            }}
          >
            MISSION PAUSED
          </div>
        )}
        {objectives.map((obj) => (
          <Link
            to={paused ? '#' : `/heist/${encodeURIComponent(decoded)}/objective/${obj.id}`}
            key={obj.id}
            className={`puzzle-image-tile centered-label${paused ? ' disabled' : ''}`}
            style={{ backgroundImage: `url(${obj.image})`, zIndex: 1 }}
            state={{ fromObjective: true }}
            onClick={(e) => paused && e.preventDefault()}
          >
            <span className="puzzle-label no-bg">{obj.title}</span>
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
          <h2>{Object.values(completed).every(Boolean) ? '🎉 Mission Complete!' : '💥 Mission Failed'}</h2>
          <p>
            {Object.values(completed).every(Boolean)
              ? "You've completed all objectives and saved the town!"
              : 'Alarms have been triggered and the mission failed.'}
          </p>
          <Link
            to="/"
            onClick={() => {
              localStorage.setItem(`${decoded}-timer`, '3600');
              // Reset ALL puzzle states when restarting mission
              objectives.forEach((obj) => {
                localStorage.setItem(`${decoded}-objective-${obj.id}`, '');
              });
            }}
          >
            <button className="developer-button" style={{ marginTop: '1rem' }}>
              Back to HQ
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
