import { Routes, Route, useNavigate } from 'react-router-dom';
import HeistPage from './Components/HeistPage';
import PurchasePage from './Components/PurchasePage';

import './App.css';
import heists from './Data/heistData';
import CountdownWrapper from './Components/Utilities/CountdownWrapper';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <h1 className="app-title">HEIST LINE</h1>

      <div className="panel-row">
        <div className="welcome-panel">
          <h2 className="panel-heading">Welcome to Heist Line!</h2>
          <p className="panel-text">
            Strike from the shadows. Take down the corrupt, the powerful,
            the untouchable. With your crew of specialists, you’ll hack, 
            hustle, and outsmart your enemies to tip the scales of justice — one mission at a time.
          </p>
        </div>

        <div className="heists-panel">
          <h2 className="panel-heading">Missions</h2>
          <div className="heist-buttons">
            {Object.keys(heists).map((heistKey) => (
              <button
                key={heistKey}
                className="heist-button"
                onClick={() => navigate(`/heist/${encodeURIComponent(heistKey)}`)}
              >
                {heistKey.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="developer-button-wrapper">
        <button className="developer-button">DEVELOPERS</button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/heist/:heistName" element={<HeistPage />} />
      <Route path="/heist/:heistName/start" element={<CountdownWrapper />} />
      <Route path="/heist/:heistName/objective/:objectiveId" element={<CountdownWrapper />} />
      <Route path="/purchase/:heistName" element={<PurchasePage />} />
    </Routes>
  );
}
