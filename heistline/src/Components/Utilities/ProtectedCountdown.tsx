import { useParams, Navigate } from 'react-router-dom';
import heists from '../../Data/heistData';
import CountdownWrapper from './CountdownWrapper';

export default function ProtectedCountdown() {
  const { heistName } = useParams();
  const decoded = decodeURIComponent(heistName || '');
  const heist = heists[decoded as keyof typeof heists];

  const accessKey = `${decoded}-access`;
  const hasAccess = heist?.isFree || localStorage.getItem(accessKey);

  if (!heist) {
    return <Navigate to="/" replace />;
  }

  if (!hasAccess) {
    return <Navigate to={`/heist/${encodeURIComponent(decoded)}`} replace />;
  }

  return <CountdownWrapper />;
}
