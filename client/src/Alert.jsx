import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-5 left-5 right-5 sm:left-auto sm:right-5 z-[5000] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto
              flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md border border-white/10
              transform transition-all duration-500 ease-out animate-slideIn
              ${
                toast.type === "success" 
                  ? "bg-[#0d0b03]/90 border-yellow-500/50 text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.3)]" 
                  : "bg-[#1a0505]/90 border-red-500/50 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
              }
            `}
            style={{
              animation: "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
          >
            <div className={`p-2 rounded-full ${toast.type === "success" ? "bg-yellow-500/20" : "bg-red-500/20"}`}>
              {toast.type === "success" ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider">{toast.type === "success" ? "Success" : "Error"}</h4>
              <p className="text-gray-300 text-sm font-medium">{toast.message}</p>
            </div>
            <button 
              onClick={() => removeToast(toast.id)}
              className="ml-4 hover:bg-white/10 p-1 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};


