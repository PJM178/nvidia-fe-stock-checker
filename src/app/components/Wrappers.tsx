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
    setAnchorEl(elementRef.current);
  }

  const onClose = () => {
    setAnchorEl(null);
  }

  return (
    <span
      ref={elementRef}
      className={className}
      onClick={handleClick}
    >
      {children}
      {popoverContent && anchorEl && <Popover anchorEl={anchorEl} onClose={onClose}>
        {popoverContent}
      </Popover>}
    </span>
  );
}