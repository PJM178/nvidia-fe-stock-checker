import { useState, useEffect, useRef } from "react";

interface UseCountdownParameters {
  startTime: number;
  interval?: number;
  repeat?: boolean;
  callback?: () => void;
}

export function useCountdown({ startTime, interval, repeat, callback }: UseCountdownParameters) {
  const [timeLeft, setTimeLeft] = useState(startTime);
  const loopDone = useRef(false);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setTimeLeft((prevValue) => {
        if (prevValue <= 1) {
          if (repeat) {
            loopDone.current = true;

            return startTime;
          }

          clearInterval(countdownInterval);

          return 0;
        }

        return prevValue - 1;
      });
    }, interval ?? 1000);

    if (repeat && loopDone.current) {
      if (timeLeft === startTime) {
        if (callback) {
          callback();
        }
      }
    } else {
      if (timeLeft < 1) {
        if (callback) {
          callback();
        }
      }
    }

    return () => clearInterval(countdownInterval);
  }, [interval, startTime, repeat, callback, timeLeft]);

  return { timeLeft };
}