import styles from "./Buttons.module.css";

interface ButtonProps {
  children: React.ReactNode;
  variant: "text" | "outlined" | "filled";
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  className?: string;
}

export const Button = (props: ButtonProps) => {
  const { children, variant, disabled, onClick, startIcon, endIcon, className } = props;

  const buttonStyles = {
    base: `${styles[`primary-button`]}`,
    variant: `${styles[`primary-button--${variant}`]}`,
    disabled: disabled ? `${styles[`primary-button--disabled`]}` : null,
    className: className,
  };

  return (
    <button
      className={Object.values(buttonStyles).join(" ").trim()}
      disabled={disabled}
      onClick={onClick}
    >
      {startIcon &&
        <span className={`${styles["primary-button--icon"]} ${styles["start"]}`}>{startIcon}</span>}
      {children}
      {endIcon &&
        <span className={`${styles["primary-button--icon"]} ${styles["end"]}`}>{endIcon}</span>}
    </button>
  );
};

interface SwitchProps {
  isActive: boolean;
  onClick: () => void;
}

export const Switch = (props: SwitchProps) => {
  const { isActive, onClick } = props;

  function handleStyles(element: "background" | "tack" | "tack-container") {
    if (element === "background") {
      const switchStyles = {
        base: styles["switch--background"],
        isActive: isActive ? styles["active"] : null,
      };

      return Object.values(switchStyles).join(" ").trim();
    }

    if (element === "tack") {
      const switchStyles = {
        base: styles["switch--tack"],
        isActive: isActive ? styles["active"] : null,
      };

      return Object.values(switchStyles).join(" ").trim();
    }

    if (element === "tack-container") {
      const switchStyles = {
        base: styles["switch--tack-container"],
        isActive: isActive ? styles["active"] : null,
      };

      return Object.values(switchStyles).join(" ").trim();
    }
  }

  return (
    <span
      className={styles["switch--container"]}
      onClick={onClick}
    >
      <span  className={handleStyles("tack-container")}>
        <span className={handleStyles("tack")} />
        <span className={styles["switch--tack-border"]} />
      </span>
      <span className={handleStyles("background")} />
    </span>
  )
}