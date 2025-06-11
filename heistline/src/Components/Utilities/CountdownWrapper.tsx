import { useParams } from 'react-router-dom';
import heists from '../../Data/heistData';
import { CountdownProvider } from './CountdownContext';

export default function CountdownWrapper() {
  const { heistName, objectiveId } = useParams();
  const decoded = decodeURIComponent(heistName || '');
  const heist = heists[decoded as keyof typeof heists];

  if (!heist) {
    return (
      <div className="app-container">
        <h1 className="app-title">UNKNOWN MISSION</h1>
        <p className="panel-text">We couldn't find a mission called "{decoded}".</p>
      </div>
    );
  }

  // if we're on an objective route
  if (objectiveId) {
    const objective = heist.objectives.find((obj) => obj.id === objectiveId);

    if (!objective) {
      return (
        <div className="app-container">
          <h1 className="app-title">UNKNOWN OBJECTIVE</h1>
          <p className="panel-text">No objective called "{objectiveId}" found in mission "{decoded}".</p>
        </div>
      );
    }

    return (
      <CountdownProvider heistKey={decoded}>
        <objective.Component />
      </CountdownProvider>
    );
  }

  // fallback to mission overview
  return (
    <CountdownProvider heistKey={decoded}>
      <heist.Component />
    </CountdownProvider>
  );
}