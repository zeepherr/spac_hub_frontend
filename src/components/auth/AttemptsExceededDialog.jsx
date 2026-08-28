export function AttemptsExceededDialog({ message, onConfirm }) {
  if (!message) return null;

  return (
    <dialog open className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-error">Too many attempts</h3>

        <p className="py-4 text-sm text-base-content/70">{message}</p>

        <div className="modal-action">
          <button type="button" className="btn btn-error" onClick={onConfirm}>
            Back to register
          </button>
        </div>
      </div>
    </dialog>
  );
}
