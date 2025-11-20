'use client';

import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const Alert = ({ 
  variant = 'default', 
  title, 
  children, 
  onClose,
  className = '',
  ...props 
}) => {
  const variants = {
    default: 'bg-blue-50 text-blue-800 border-blue-200',
    destructive: 'bg-red-50 text-red-800 border-red-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200'
  };

  const icons = {
    default: Info,
    destructive: AlertCircle,
    success: CheckCircle,
    warning: AlertCircle
  };

  const IconComponent = icons[variant];

  return (
    <div 
      role="alert"
      className={`rounded-lg border p-4 ${variants[variant]} ${className}`}
      {...props}
    >
      <div className="flex items-start gap-3">
        <IconComponent className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          {title && <h3 className="text-sm font-semibold">{title}</h3>}
          {children && <div className="text-sm mt-1">{children}</div>}
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 transition-colors"
            aria-label="Close alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;