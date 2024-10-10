// useTimer.ts
import { useState, useEffect } from 'react';

const useTimer = (initialTime: number = 0) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer : ReturnType<typeof setTimeout>;

    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning]);

  // Functions to control the timer
  const start = () => setIsRunning(true);
  const stop = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setTime(initialTime);
  };

  return { time, isRunning, start, stop, reset };
};

export default useTimer;
