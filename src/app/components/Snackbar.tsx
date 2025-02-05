"use client"

import { useEffect, useState } from "react";
import styles from "./Snackbar.module.css";

const Snackbar = () => {
  const [statusText, setStatusText] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusText(prevValue => {
        if (prevValue === 3) {
          return 1;
        }

        return prevValue + 1;
      });
    }, 5000);

    return () => {
      clearInterval(interval);
    }
  });

  if (!statusText) {
    return null;
  }

  return (
    <div className={styles["snackbar-container"]}>
      <div className={styles["error-test-container"]}>
        {statusText === 1 &&
          <div className={styles["error-test-text"]}>
            This is some error text
          </div>
        }

        {statusText === 2 &&
          <div className={styles["warning-test-text"]}>
            This is some warning text
          </div>
        }

        {statusText === 3 &&
          <div className={styles["success-test-text"]}>
            This is some success text
          </div>
        }
      </div>
    </div>
  );
}

export default Snackbar;