import React, { useEffect, useRef } from "react";

function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  const dialogRef = useRef(null);
  const cancelRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (open && dialog && !dialog.open) {
      previousFocusRef.current = document.activeElement;

      dialog.showModal();
      cancelRef.current?.focus();
    }

    if (!open && dialog?.open) {
      dialog.close();
      previousFocusRef.current?.focus();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
    >
      <div className="dialog-content">
        <h2 id="dialog-title">{title}</h2>

        <p id="dialog-description">{message}</p>

        <div className="dialog-actions">
          <button
            type="button"
            ref={cancelRef}
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="button"
            className="delete-button"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default ConfirmDialog;