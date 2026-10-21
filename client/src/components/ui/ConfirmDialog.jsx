import Modal from './Modal';
import { FiAlertTriangle } from 'react-icons/fi';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title = 'Are you sure?', message, confirmLabel = 'Confirm', danger = true }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${danger ? 'bg-primary-50 text-primary-600' : 'bg-accent-500/10 text-accent-600'}`}>
          <FiAlertTriangle size={22} />
        </div>
        <p className="text-sm text-ink-500">{message}</p>
        <div className="flex w-full gap-3 pt-2">
          <button onClick={onClose} className="btn-outline flex-1">Cancel</button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`btn flex-1 text-white ${danger ? 'bg-primary-500 hover:bg-primary-600' : 'bg-accent-500 hover:bg-accent-600'} px-4 py-3`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
