"use client";

import { useEffect } from "react";

export type RegistrationTarget = {
  href: string;
  label: string;
};

type RegistrationPopupProps = {
  target: RegistrationTarget | null;
  onClose: () => void;
};

export default function RegistrationPopup({
  target,
  onClose,
}: RegistrationPopupProps) {
  useEffect(() => {
    if (!target) {
      return;
    }

    function handleEscKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscKey);

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [target, onClose]);

  if (!target) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-brand-surface/95 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.7)] backdrop-blur-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 rounded-lg px-2 py-1 text-brand-light/70 transition-colors hover:text-white"
          aria-label="Close popup"
        >
          ×
        </button>
        <p className="text-lg font-semibold text-white">Continue your registration here</p>
        <a
          href={target.href}
          className="mt-3 inline-block font-semibold text-brand-cyan underline decoration-brand-cyan/70 underline-offset-4 transition-colors hover:text-brand-purple"
        >
          {target.label}
        </a>
      </div>
    </div>
  );
}
