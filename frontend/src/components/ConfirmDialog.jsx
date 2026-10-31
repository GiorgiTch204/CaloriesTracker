import Modal from "./Modal";

export default function ConfirmDialog({ open, onClose, onConfirm, title = "Are you sure?", description, confirmLabel = "Confirm", danger = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      {description && <p className="mb-5 text-sm text-ink-500 dark:text-ink-300">{description}</p>}
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="rounded-lg border border-ink-200 px-4 py-2 text-sm font-medium text-ink-600 hover:bg-ink-50 dark:border-ink-600 dark:text-ink-200 dark:hover:bg-ink-700"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
            danger ? "bg-brick-500 hover:bg-brick-600" : "bg-moss-600 hover:bg-moss-700"
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
