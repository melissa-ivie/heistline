import { useParams, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import heists from '../../Data/heistData';
import CountdownWrapper from './CountdownWrapper';

export default function ProtectedCountdown() {
  const { heistName } = useParams();
  const decoded = decodeURIComponent(heistName || '');
  const heist = heists[decoded as keyof typeof heists];

  const accessKey = `${decoded}-access`;
  const localCode = localStorage.getItem(accessKey);
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!heist) {
      setLoading(false);
      return;
    }

    if (heist.isFree) {
      setValidated(true);
      setLoading(false);
      return;
    }

    if (!localCode) {
      setValidated(false);
      setLoading(false);
      return;
    }

    fetch(`https://heistline-access-api.onrender.com/api/verify-access?code=${localCode}&heist=${decoded}`)
      .then((res) => res.json())
      .then((data) => {
        setValidated(data.valid);
        if (!data.valid) {
          localStorage.removeItem(accessKey);
        }
      })
      .catch(() => {
        setValidated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [decoded, heist, localCode, accessKey]);

  if (!heist) return <Navigate to="/" replace />;
  if (loading) return null; // Optionally show a loading indicator
  if (!validated) return <Navigate to={`/heist/${encodeURIComponent(decoded)}`} replace />;

  return <CountdownWrapper />;
}
