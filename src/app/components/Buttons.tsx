import styles from "./Buttons.module.css";

interface ButtonProps {
  children: React.ReactNode;
  variant: "text" | "outlined" | "filled";
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Button = (props: ButtonProps) => {
  const { children, variant, disabled, onClick, startIcon, endIcon } = props;

  const buttonStyles = {
    base: `${styles[`primary-button`]}`,
    variant: `${styles[`primary-button--${variant}`]}`,
    disabled: disabled ? `${styles[`primary-button--disabled`]}` : null,
  };

  return (
    <button
      className={Object.values(buttonStyles).join(" ")}
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