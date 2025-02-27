import styles from "./Skeleton.module.css";

type CssUnit = "px" | "rem" | "em" | "%" | "vh" | "vw";
type CssSize = `${number}${CssUnit}` | "auto";

interface SkeletonProps {
  width?: CssSize;
  height?: CssSize;
  variant: "text" | "circular" | "rectangular" | "rounded";
  // Avoid using !important here and use inlineSyles property where more specificity is required
  className?: string;
  // If maximum specificity is required use inline styles
  inlineStyles?: React.CSSProperties;
}

const Skeleton = (props: SkeletonProps) => {
  const { width, height, variant, className, inlineStyles } = props;

  return (
    <span
      className={`${className ?? ""} ${styles["skeleton-base"]} ${styles[`skeleton-${variant}`] }`.trim()}
      style={{ width: width, height: height, ...inlineStyles }}
    />
  );
};

export default Skeleton;