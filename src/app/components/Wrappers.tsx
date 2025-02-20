import { useRef, useState } from "react";
import Popover from "./Popover";

interface InlinePointerEnterAndLeaveWrapperProps {
  children: React.ReactNode;
  className?: string;
  popoverContent?: React.ReactNode;
  ariaLabel?: string;
}

export const InlinePointerEnterAndLeaveWrapper = (props: InlinePointerEnterAndLeaveWrapperProps) => {
  const { children, className, popoverContent, ariaLabel } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const elementRef = useRef<HTMLElement>(null);

  const handleClick = () => {
    setAnchorEl(elementRef.current);
  }

  const onClose = () => {
    setAnchorEl(null);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.code === "Enter" || e.code === "Space") {
      if (anchorEl) {
        return setAnchorEl(null);
      }

      handleClick();
    } else {
      setAnchorEl(null);
    }
  }

  return (
    <span
      ref={elementRef}
      className={className}
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-label={ariaLabel}
      aria-haspopup={popoverContent ? true : false}
      onKeyDown={handleKeyDown}
    >
      {children}
      {popoverContent && anchorEl && <Popover anchorEl={anchorEl} onClose={onClose}>
        {popoverContent}
      </Popover>}
    </span>
  );
}