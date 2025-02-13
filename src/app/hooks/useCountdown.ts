import { useState, useEffect } from "react";

interface UseCountdownParameters {
  startTime: number;
  interval?: number;
  repeat?: boolean;
}

export function useCountdown({ startTime, interval, repeat }: UseCountdownParameters) {
  const [timeLeft, setTimeLeft] = useState(startTime);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setTimeLeft((prevValue) => {
        if (prevValue <= 1) {
          if (repeat) {
            return startTime;
          }

          clearInterval(countdownInterval);

          return 0;
        }

        return prevValue - 1;
      });
    }, interval ?? 1000);

    return () => clearInterval(countdownInterval);
  }, [interval, startTime, repeat]);

  return { timeLeft };
}