import { useEffect, useRef } from 'react';
import Button from '../UI/Button';
import './DeleteModal.css';

export default function DeleteModal({ invoiceId, onConfirm, onCancel }) {
  const modalRef = useRef(null);
  const cancelBtnRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;

    cancelBtnRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previousFocus?.focus();
    };
  }, [onCancel]);

  return (
    <div
      className="delete-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="delete-modal" ref={modalRef}>
        <h2 className="delete-modal__title" id="delete-modal-title">
          Confirm Deletion
        </h2>
        <p className="delete-modal__text">
          Are you sure you want to delete invoice #{invoiceId}? This action cannot be undone.
        </p>
        <div className="delete-modal__actions">
          <Button variant="secondary" onClick={onCancel} ref={cancelBtnRef}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
