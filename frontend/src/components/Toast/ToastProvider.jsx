import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from './Toast';
import PropTypes from 'prop-types';


const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ( {children} ) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message,duration=5000) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, duration);
    
  });

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed top-2 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
