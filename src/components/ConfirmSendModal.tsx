'use client';

import React from 'react';

type ConfirmSendModalProps = {
  open: boolean;
  title?: string;
  message: string;
  children?: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
};

export default function ConfirmSendModal({
  open,
  title = 'Send Message',
  message,
  children,
  onConfirm,
  onCancel,
  confirmLabel = 'Send',
}: ConfirmSendModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onCancel}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-10 w-full max-w-md rounded-lg bg-gunmetal p-6 shadow-lg mx-4 text-white"
      >
        <h3 className="mb-2 text-lg font-semibold text-neon">{title}</h3>
        <p className="mb-4 text-sm text-white">{message}</p>

        {children && <div className="mb-4">{children}</div>}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gunmetal-light px-3 py-1 text-sm text-white hover:bg-gunmetal-light/60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            aria-label={confirmLabel}
            className="rounded-md bg-neon px-3 py-1 text-sm text-gunmetal drop-shadow-neon hover:brightness-95"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
