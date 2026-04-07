"use client";
import { useState, useId } from "react";
import { clsx } from "clsx";

export function Details({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const id = useId();

  return (
    <div>
      <button
        type="button"
        aria-controls={id}
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded((prev) => !prev)}
        className="mb-2 cursor-pointer rounded text-sm text-gray-400 transition-colors duration-200 hover:text-white"
      >
        <span
          aria-hidden="true"
          className={clsx(
            "mr-2 inline-block transform text-xs transition-transform duration-200",
            isExpanded && "rotate-90",
          )}
        >
          {/* \uFE0E forces text rendering, preventing emoji variant on iOS/Android */}
          {"\u25B6\uFE0E"}
        </span>
        {label}
      </button>
      <div
        id={id}
        inert={!isExpanded || undefined}
        className={clsx(
          "transition-opacity duration-300",
          isExpanded ? "opacity-100" : "h-0 w-0 overflow-hidden opacity-0",
        )}
      >
        {children}
      </div>
    </div>
  );
}
