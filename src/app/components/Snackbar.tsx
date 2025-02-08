"use client"

import { useEffect, useState } from "react";
import styles from "./Snackbar.module.css";

interface SnackbarProps {
  type: "success" | "warning" | "error" | null;
  setNotification: React.Dispatch<React.SetStateAction<"success" | "warning" | "error" | null>>;
}

const Snackbar = (props: SnackbarProps) => {
  const { type } = props;

  if (!type) return null;

  return <SnackbarContent {...props} />;
}

const SnackbarContent = (props: SnackbarProps) => {
  const { type, setNotification } = props;
  const [isContentOpen, setIsContentOpen] = useState(false);

  useEffect(() => {
    setIsContentOpen(true);

    const timeout = setTimeout(() => {
      setIsContentOpen(false);
    }, 20000);

    return () => {
      clearTimeout(timeout);
    }
  }, [type]);

  const handleTransitionEnd = () => {
    if (!isContentOpen) {
      setNotification(null);
    }
  };

  return (
    <div
      className={`${styles["snackbar-container"]} ${isContentOpen ? styles["visible"] : ""}`}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className={styles["snackbar-content-container"]}>
        <div className={styles[`snackbar-content-${type}`]}>
          <div className={styles[`snackbar-content`]}>
            <div>
              This is some message
            </div>
            <div>
              cancel
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Snackbar;