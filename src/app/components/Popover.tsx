import { createPortal } from "react-dom";
import styles from "./Popover.module.css";
import { useEffect, useRef } from "react";
import { checkIfScrollbar, isMobileDevice } from "../utils/utilities";

interface PopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  children: React.ReactNode;
  popoverClassName?: string;
}

const Popover = (props: PopoverProps) => {
  const { anchorEl, onClose, children, popoverClassName } = props;
  const contentRef = useRef<HTMLDivElement>(null);

  const popoverStyles = {
    props: popoverClassName ? popoverClassName : null,
    base: styles["popover-container--popover"],
  };

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

        if (checkIfScrollbar() && !isMobileDevice()) {
          document.body.style.paddingRight = "17px";
        }

        const contentRect = contentRef.current.getBoundingClientRect();
        const top =  (anchorRect.top + anchorRect.height) + 5;
        const left = anchorRect.left - contentRect.width / 2 + anchorRect.width / 2;

        if (top + contentRect.height > window.innerHeight) {
          contentRef.current.style.top = top - (top + contentRect.height - window.innerHeight) - 2 + "px";
        } else {
          contentRef.current.style.top = top + "px";
        }

        if (left <= 0) {
          contentRef.current.style.left = 2 + "px";
        } else {
          contentRef.current.style.left = left + "px";
        }
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
            <div ref={contentRef} className={Object.values(popoverStyles).join(" ").trim()}>
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