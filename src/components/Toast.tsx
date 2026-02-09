"use client";

import { useEffect } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const baseStyles =
    "fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in";
  const typeStyles = {
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
    info: "bg-blue-600 text-white",
  };

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  };

  return (
    <div className={`${baseStyles} ${typeStyles[type]}`}>
      <span className="text-xl font-bold">{icons[type]}</span>
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-white hover:opacity-80 transition-opacity"
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
}
