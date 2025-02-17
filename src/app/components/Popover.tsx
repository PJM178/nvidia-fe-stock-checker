import { createPortal } from "react-dom";
import styles from "./Popover.module.css";
import { useEffect, useRef } from "react";

interface PopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  children: React.ReactNode;
}

const Popover = (props: PopoverProps) => {
  const { anchorEl, onClose, children } = props;
  const contentRef = useRef<HTMLDivElement>(null);

  const handleOnClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    onClose();
  }

  useEffect(() => {
    if (anchorEl) {
      const anchorRect = anchorEl.getBoundingClientRect();

      if (contentRef.current) {
        const contentRect = contentRef.current.getBoundingClientRect();

        contentRef.current.style.top = (anchorRect.top + anchorRect.height) + 5 + "px";
        contentRef.current.style.left = anchorRect.left - contentRect.width / 2 + anchorRect.width / 2 + "px";
      }
    }
  }, [anchorEl]);

  if (anchorEl) {
    return (
      <>
        {createPortal(
          <div className={styles["popover-container"]}>
            <div
              className={styles["popover-container--close-popover"]}
              onClick={(e) => handleOnClick(e)}
            />
            <div ref={contentRef} className={styles["popover-container--popover"]}>
              {children}
            </div>
          </div>,
          document.body
        )}
      </>
    );
  }

  return null;
};

export default Popover;