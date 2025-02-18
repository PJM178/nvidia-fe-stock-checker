import { createPortal } from "react-dom";
import styles from "./Popover.module.css";
import { useEffect, useRef } from "react";
import { checkIfScrollbar } from "../utils/utilities";

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
    document.documentElement.style.overflow = "unset";
    document.body.style.paddingRight = "unset";
    onClose();
  }

  useEffect(() => {
    if (anchorEl) {
      const anchorRect = anchorEl.getBoundingClientRect();

      if (contentRef.current) {
        document.documentElement.style.overflow = "hidden";

        if (checkIfScrollbar()) {
          document.body.style.paddingRight = "17px";
        }

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
              onClick={handleOnClick}
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