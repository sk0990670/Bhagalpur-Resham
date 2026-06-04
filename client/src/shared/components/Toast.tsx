import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

const Toast = ({ message, type = 'success', duration = 3000, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Slide in
    requestAnimationFrame(() => setIsVisible(true));
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // wait for slide-out animation
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-surface-container-highest' : type === 'error' ? 'bg-error-container' : 'bg-surface-container';
  const textColor = type === 'success' ? 'text-on-surface' : type === 'error' ? 'text-on-error-container' : 'text-on-surface';
  const icon = type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info';
  const iconColor = type === 'success' ? 'text-secondary' : type === 'error' ? 'text-error' : 'text-primary';

  return (
    <div
      className={`flex items-center gap-3 px-5 py-4 rounded shadow-lg border border-outline-variant/30 ${bgColor} ${textColor} transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ minWidth: '280px', maxWidth: '360px' }}
    >
      <span className={`material-symbols-outlined ${iconColor}`} style={{ fontVariationSettings: "'FILL' 1", fontSize: '20px' }}>{icon}</span>
      <span className="font-body-md text-body-md flex-1">{message}</span>
      <button onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }} className="text-on-surface-variant hover:text-on-surface transition-colors ml-1 cursor-pointer">
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
      </button>
    </div>
  );
};

// ─── Toast Container ────────────────────────────────────────────────────────
interface ToastItem {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

export const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <Toast message={t.message} type={t.type} onClose={() => onRemove(t.id)} />
        </div>
      ))}
    </div>
  );
};

export default Toast;
