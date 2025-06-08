import { createContext, useContext, useEffect, useRef, useState } from 'react';

type CountdownContextType = {
  timeLeft: number;
  stopCountdown: () => void;
};

const CountdownContext = createContext<CountdownContextType>({
  timeLeft: 0,
  stopCountdown: () => {},
});

export const CountdownProvider = ({
  heistKey,
  children,
}: {
  heistKey: string;
  children: React.ReactNode;
}) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const stored = sessionStorage.getItem(`${heistKey}-timer`);
    return stored ? parseInt(stored, 10) : 3600;
  });

const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null); // ✅ Works in browser

  const stopCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (intervalRef.current !== null) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const updated = prev > 0 ? prev - 1 : 0;
        sessionStorage.setItem(`${heistKey}-timer`, updated.toString());

        if (updated === 0) stopCountdown();
        return updated;
      });
    }, 1000);

    return () => {
      stopCountdown();
    };
  }, []);

  return (
    <CountdownContext.Provider value={{ timeLeft, stopCountdown }}>
      {children}
    </CountdownContext.Provider>
  );
};

export const useCountdown = () => useContext(CountdownContext);
