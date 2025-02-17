import { useRef, useState } from "react";
import Popover from "./Popover";

interface InlinePointerEnterAndLeaveWrapperProps {
  children: React.ReactNode;
  className?: string;
  popoverContent?: React.ReactNode;
}

export const InlinePointerEnterAndLeaveWrapper = (props: InlinePointerEnterAndLeaveWrapperProps) => {
  const { children, className, popoverContent } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const elementRef = useRef<HTMLElement>(null);

  const handleClick = () => {
    console.log("whayt")
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
      aria-label="Opens more info popup"
      aria-haspopup={true}
      onKeyDown={handleKeyDown}
    >
      {children}
      {popoverContent && anchorEl && <Popover anchorEl={anchorEl} onClose={onClose}>
        {popoverContent}
      </Popover>}
    </span>
  );
}