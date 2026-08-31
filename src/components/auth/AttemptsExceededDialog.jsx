export function AttemptsExceededDialog({ message, onConfirm }) {
  if (!message) return null;

  return (
    <dialog open className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-[#f97316]">Too many attempts</h3>

        <p className="py-4 text-sm text-base-content/70">{message}</p>

        <div className="modal-action">
          <button
            type="button"
            className="btn bg-[#f97316] text-[#ffffff] btn-error"
            onClick={onConfirm}
          >
            Back to register
          </button>
        </div>
      </div>
    </dialog>
  );
}
