import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, RotateCcw } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, onUndo, duration = 5000 }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-4 h-4 text-accent" />,
    error:   <AlertTriangle className="w-4 h-4 text-red-500" />,
    info:    <Info className="w-4 h-4 text-blue-400" />,
    undo:    <RotateCcw className="w-4 h-4 text-orange-400" />
  };

  const borderColors = {
    success: 'border-accent/40',
    error:   'border-red-500/40',
    info:    'border-blue-400/40',
    undo:    'border-orange-400/40'
  };

  return (
    <div
      className={`fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-3 bg-cinema-card border ${borderColors[type] || borderColors.success} px-4 py-3 rounded-lg shadow-2xl backdrop-blur-md max-w-xs`}
      style={{ animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
      role="alert"
    >
      <style>{`
        @keyframes slideIn {
          from { transform: translateY(20px) scale(0.95); opacity: 0; }
          to   { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
      {icons[type] || icons.success}
      <span className="text-sm font-medium text-white flex-1">{message}</span>
      {type === 'undo' && onUndo && (
        <button onClick={() => { onUndo(); onClose(); }}
          className="text-orange-400 hover:text-orange-300 text-xs font-mono font-bold border border-orange-400/40 px-2 py-0.5 rounded transition-colors cursor-pointer">
          UNDO
        </button>
      )}
      <button onClick={onClose}
        className="text-cinema-muted hover:text-white transition-colors ml-1 focus-ring rounded cursor-pointer"
        aria-label="Close notification">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
