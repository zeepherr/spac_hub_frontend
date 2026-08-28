export function AttemptsExceededDialog({ message, onConfirm }) {
  if (!message) return null;

  return (
    <dialog open className="modal">
      <div className="modal-box">
        <h3 className="text-lg font-bold text-error">
          Verification attempts exceeded
        </h3>

        <p className="py-4 text-sm text-base-content/70">{message}</p>

        <div className="modal-action">
          <button type="button" className="btn btn-error" onClick={onConfirm}>
            Back to register
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button type="button" aria-label="Close" onClick={onConfirm} />
      </form>
    </dialog>
  );
}
