import * as React from "react";
import { createPortal } from "react-dom";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, title, children, className }, ref) => {
    if (!isOpen) return null;

    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
        <div
          ref={ref}
          className={`rounded-lg border border-stone-200 bg-white shadow-lg max-h-[90vh] overflow-y-auto ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="border-b border-stone-200 p-6">
              <h2 className="text-2xl font-bold">{title}</h2>
            </div>
          )}
          <div className="p-6">{children}</div>
        </div>
      </div>,
      document.body
    );
  }
);
Modal.displayName = "Modal";

export { Modal };
