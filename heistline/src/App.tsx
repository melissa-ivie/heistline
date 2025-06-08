import { Routes, Route, useNavigate } from 'react-router-dom';
import HeistPage from './HeistPage';
import './App.css';
import BlackwaterHeist from './BlackwaterHeist';
import AirportObjective from './BlackwaterPuzzles/AirportObjective';
import ContaminationReportObjective from './BlackwaterPuzzles/ContaminationReportObjective';
import EmailServersObjective from './BlackwaterPuzzles/EmailServersObjective';
import FBIObjective from './BlackwaterPuzzles/FBIObjective';
import { CountdownProvider } from './CountdownContext';


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
            {['Operation Blackwater'].map((heist) => (
              <button
                key={heist}
                className="heist-button"
                onClick={() => navigate(`/heist/${encodeURIComponent(heist)}`)}
              >
                {heist.toUpperCase()}
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

      <Route
        path="/heist/:heistName/start"
        element={
          <CountdownProvider heistKey="Operation Blackwater">
            <BlackwaterHeist />
          </CountdownProvider>
        }
      />

      <Route
        path="/heist/:heistName/objective/airport"
        element={
          <CountdownProvider heistKey="Operation Blackwater">
            <AirportObjective />
          </CountdownProvider>
        }
      />

      <Route
        path="/heist/:heistName/objective/contamination-report"
        element={
          <CountdownProvider heistKey="Operation Blackwater">
            <ContaminationReportObjective />
          </CountdownProvider>
        }
      />

      <Route
        path="/heist/:heistName/objective/email-servers"
        element={
          <CountdownProvider heistKey="Operation Blackwater">
            <EmailServersObjective />
          </CountdownProvider>
        }
      />

      <Route
        path="/heist/:heistName/objective/fbi"
        element={
          <CountdownProvider heistKey="Operation Blackwater">
            <FBIObjective />
          </CountdownProvider>
        }
      />
    </Routes>
  );
}
