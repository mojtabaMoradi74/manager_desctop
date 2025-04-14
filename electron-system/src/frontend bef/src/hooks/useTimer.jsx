import { useState, useEffect } from 'react';
import { getTimeRemaining } from '../utils/dating';

const useTimer = () => {
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [IntervalReference, setIntervalReference] = useState();
  // const countRef = useRef<any>(null);

  const handlePause = () => {
    console.log('* * * useTimer handlePause * * * ');
    clearInterval(IntervalReference);
    setIsPaused(true);
    setIsActive(false);
  };

  const handleReset = () => {
    console.log('* * * useTimer handleReset * * * ');
    clearInterval(IntervalReference);
    setIsActive(false);
    setIsPaused(false);
    setTimer(0);
  };

  const handleResume = () => {
    console.log('* * * useTimer handleResume * * * ');
    setIsActive(true);
    setIsPaused(false);
    let newTime = Math.floor(timer) || 0;
    const interval = setInterval(() => {
      // console.log("* * * useTimer handleResume newTime :", newTime, interval);
      if (newTime <= 0) {
        clearInterval(interval);
        handleReset();
      } else setTimer((newTime -= 1));
    }, 1000);
    setIntervalReference(interval);
  };

  const handleStart = (time) => {
    if (time <= 0) return;
    console.log('* * * useTimer handleStart * * * ', time);
    let newTime = Math.floor(time) || 0;
    // if (isActive) return;
    setIsActive(true);
    setIsPaused(false);
    setTimer((newTime -= 1));
    if (IntervalReference) clearInterval(IntervalReference);
    const interval = setInterval(() => {
      // console.log("* * * useTimer handleStart newTime :", newTime, interval);

      if (newTime <= 0) {
        clearInterval(interval);
        handleReset();
      } else setTimer((newTime -= 1));
    }, 1000);
    setIntervalReference(interval);
  };

  useEffect(() => {
    if (window !== undefined) {
      const env = process.env.NODE_ENV;
      console.log({ env });
      if (env !== 'development') return () => handleReset();
    }
    // return;
  }, []);

  return {
    timer: getTimeRemaining(timer),
    count: timer,
    isActive,
    isPaused,
    handleStart,
    handlePause,
    handleResume,
    handleReset,
  };
};

export default useTimer;
