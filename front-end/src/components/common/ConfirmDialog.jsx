import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
  show,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Ya, Yakin",
  cancelText = "Batal",
  type = "danger",
}) {
  if (!show) return null;

  const styles = {
    danger: {
      bg: "bg-red-600 hover:bg-red-700",
      icon: "text-red-600",
    },
    warning: {
      bg: "bg-yellow-600 hover:bg-yellow-700",
      icon: "text-yellow-600",
    },
    info: {
      bg: "bg-blue-600 hover:bg-blue-700",
      icon: "text-blue-600",
    },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slideIn">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`${styles[type].icon} flex-shrink-0`}>
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600">{message}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 text-white rounded-xl font-bold transition-all shadow-lg ${styles[type].bg}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
