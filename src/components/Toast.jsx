import React, { useState, useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  return (
    <div
      className={`toast toast-${type} ${isVisible ? 'toast-visible' : 'toast-hidden'}`}
      role="alert"
      aria-live="assertive"
    >
      <span className="toast-icon" aria-hidden="true">{getIcon()}</span>
      <span className="toast-message">{message}</span>
      <button
        className="toast-close"
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        aria-label="Cerrar notificación"
      >
        ×
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default Toast;