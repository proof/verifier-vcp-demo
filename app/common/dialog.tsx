"use client";

import { useId } from "react";
import { Button } from "./button";

export function Dialog({
  title,
  children,
  onClose,
  dialogRef,
  buttons,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  buttons?: { key: string; label: string; onClick: () => void }[];
}) {
  const titleId = useId();

  return (
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      aria-labelledby={titleId}
      className="bg-elevated m-auto w-full max-w-sm rounded p-6 text-white shadow-md/30 backdrop:bg-blue-200/20"
    >
      <h2 id={titleId} className="mb-4 text-2xl font-bold">
        {title}
      </h2>
      {children}
      {buttons && (
        <div className="flex flex-wrap justify-end gap-2 pt-4">
          {buttons.map((btn) => (
            <Button key={btn.key} onClick={btn.onClick}>
              {btn.label}
            </Button>
          ))}
        </div>
      )}
    </dialog>
  );
}
