import { useParams, Link } from 'react-router-dom';
import heists from './heistData';
import './App.css';

type HeistKey = keyof typeof heists;

export default function HeistPage() {
  const { heistName } = useParams();
  const decoded = decodeURIComponent(heistName || '');

  const isValidHeist = decoded in heists;

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
        <Link
            to={`/heist/${encodeURIComponent(decoded)}/start`}
            state={{ fromStartButton: true }}
            >
            <button className="developer-button" style={{ marginBottom: '2rem' }}>
                START MISSION
            </button>
        </Link>


        <Link to="/">
          <button className="developer-button" style={{ marginTop: '1rem' }}>
            BACK TO HQ
          </button>
        </Link>
      </div>
    </div>
  );
}
