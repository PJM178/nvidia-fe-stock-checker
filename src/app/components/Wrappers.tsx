import { useRef, useState } from "react";
import Popover from "./Popover";

interface InlinePointerEnterAndLeaveWrapperProps {
  children: React.ReactNode;
  className?: string;
  popoverContent?: React.ReactNode;
  ariaLabel?: string;
  popoverClassName?: string;
  callback?: () => void;
}

export const InlinePointerEnterAndLeaveWrapper = (props: InlinePointerEnterAndLeaveWrapperProps) => {
  const { children, className, popoverContent, ariaLabel, popoverClassName, callback } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const elementRef = useRef<HTMLElement>(null);

  const handleClick = () => {
    if (!!callback) {
      return callback();
    }

    setAnchorEl(elementRef.current);
  }

  const onClose = () => {
    setAnchorEl(null);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.ctrlKey || e.shiftKey) return;

    if (anchorEl) {
      if (e.code === "Escape") {
        anchorEl.focus();

        setAnchorEl(null);
      }

      return;
    };

    if (e.code === "Enter" || e.code === "Space") {
      if (!!callback) {
        return callback();
      }

      if (anchorEl) {
        return setAnchorEl(null);
      }

      handleClick();
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
      {popoverContent && anchorEl && <Popover popoverClassName={popoverClassName} anchorEl={anchorEl} onClose={onClose}>
        {popoverContent}
      </Popover>}
    </span>
  );
}