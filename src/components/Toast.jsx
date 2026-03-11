import { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const styles = {
  success: 'alert-success border-success/20',
  error: 'alert-error border-error/20',
  info: 'alert-info border-info/20',
  warning: 'alert-warning border-warning/20',
};

export default function Toast({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose,
  className = ''
}) {
  const [isVisible, setIsVisible] = useState(true);
  const Icon = icons[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  return (
    <div
      className={`alert ${styles[type]} shadow-lg transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      } ${className}`}
      role="alert"
      aria-live="polite"
    >
      <Icon size={20} />
      <span className="text-sm font-medium flex-1">{message}</span>
      <button
        onClick={handleClose}
        className="btn btn-ghost btn-xs btn-circle"
        aria-label="Close notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// Toast Container Component
export function ToastContainer({ toasts = [], onRemove }) {
  if (toasts.length === 0) return null;

  return (
    <div 
      className="fixed top-20 right-4 z-50 space-y-2 max-w-md w-full pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}
