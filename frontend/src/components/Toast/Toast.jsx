import React from 'react';

import { CircleCheckBig } from 'lucide-react';
import { CircleX } from 'lucide-react';
import { OctagonAlert } from 'lucide-react';
import { X } from 'lucide-react';

const Toast = ( {type, message, onClose} ) => {
  const icons = {
    success: <CircleCheckBig className="w-5 h-5" aria-hidden="true" />,
    error: <CircleX className="w-5 h-5" aria-hidden="true" />,
    warning: <OctagonAlert className="w-5 h-5" aria-hidden="true" />,
  };

  const bgColors = {
    success: 'bg-green-100 dark:bg-green-800 text-green-500 dark:text-green-200',
    error: 'bg-red-100 dark:bg-red-800 text-red-500 dark:text-red-200',
    warning: 'bg-orange-100 dark:bg-orange-700 text-orange-500 dark:text-orange-200',
  };

  return (
    <div className={`flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800`} role="alert">
      <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${bgColors[type]} rounded-lg`}>
        {icons[type]}
        <span className="sr-only">{type} icon</span>
      </div>
      <div className="ms-3 text-sm font-normal">{message}</div>
      <button
        type="button"
        className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        onClick={onClose}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <X className="w-3 h-3" aria-hidden="true" />
      </button>
    </div>
  );
};

export default Toast;
