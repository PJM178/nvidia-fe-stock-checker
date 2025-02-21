import { createPortal } from "react-dom";
import styles from "./Popover.module.css";
import { useEffect, useRef } from "react";
import { checkIfScrollbar, isMobileDevice } from "../utils/utilities";

interface PopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  children: React.ReactNode;
  popoverClassName?: string;
  anchorOrigin?: "left" | "center" | "right";
}

const Popover = (props: PopoverProps) => {
  const { anchorEl, onClose, children, popoverClassName, anchorOrigin = "center" } = props;
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
        const top = (anchorRect.top + anchorRect.height) + 5;
        // Default origin is center
        let left = anchorRect.left - contentRect.width / 2 + anchorRect.width / 2;
 
        if (anchorOrigin === "left") {
          left = anchorRect.left;
        }

        if (anchorOrigin === "right") {
          left = anchorRect.left - contentRect.width + anchorRect.width;
        }

        if (top + contentRect.height > window.innerHeight) {
          contentRef.current.style.top = top - (top + contentRect.height - window.innerHeight) - 2 + "px";
        } else {
          contentRef.current.style.top = top + "px";
        }

        if (left <= 0) {
          contentRef.current.style.left = 2 + "px";
        } else if ((left + contentRect.width) > window.innerWidth) {
          contentRef.current.style.left = left - ((left + contentRect.width) - window.innerWidth) - 2 + "px";
        } else {
          contentRef.current.style.left = left + "px";
        }
      }

    }
  }, [anchorEl, anchorOrigin]);

  useEffect(() => {
    if (!anchorEl || !contentRef.current) return;

    const focusableElements = contentRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    if (focusableElements.length) {
      focusableElements[0].focus();
    }

    const handleTab = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey) return;

      if (contentRef.current) {
        if (!contentRef.current.contains(e.target as Node)) {
          e.preventDefault();
          
          return;
        }
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.code === "Tab") {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTab);

    return () => document.removeEventListener("keydown", handleTab);
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