"use client";

import { useState, useCallback } from "react";
import { clsx } from "clsx";

type JsonObject = Record<string, unknown>;
type JsonValue = JsonObject | unknown[];

const renderEntries = (data: JsonObject) => {
  const keys = Object.keys(data);
  return keys.map((key, index) => {
    const value = data[key];
    const isPrimitive = typeof value !== "object" || value === null;
    const isArray = Array.isArray(value);
    const isLast = index === keys.length - 1;

    if (isArray) {
      const arrayVal = (value as unknown[]).map((v, i) => {
        const isLastItem = i === (value as unknown[]).length - 1;
        const isPrimitiveItem = typeof v !== "object" || v === null;
        if (isPrimitiveItem) {
          return (
            <div className="pr-2" key={i}>
              {JSON.stringify(v)}
              {!isLastItem && ","}
            </div>
          );
        }
        return (
          <div key={i}>
            {`{`}
            <div className="ml-4">{renderEntries(v as JsonObject)}</div>
            <span>
              {`}`}
              {!isLastItem && ","}
            </span>
          </div>
        );
      });
      return (
        <Info key={key} label={key} isLast={isLast}>
          <div>
            {`[`}
            <div className="ml-4">{arrayVal}</div>
            <span>
              {`]`}
              {!isLast && ","}
            </span>
          </div>
        </Info>
      );
    }

    return (
      <Info key={key} label={key} isLast={isLast} isExpandable={!isPrimitive}>
        {isPrimitive ? (
          <div className="pr-2 whitespace-nowrap">
            {JSON.stringify(value)}
            {!isLast && ","}
          </div>
        ) : (
          <div>
            {`{`}
            <div className="ml-4">{renderEntries(value as JsonObject)}</div>
            <span>
              {`}`}
              {!isLast && ","}
            </span>
          </div>
        )}
      </Info>
    );
  });
};

const Info = ({
  label,
  children,
  isLast,
  isExpandable = true,
}: {
  label: string;
  children: React.ReactNode;
  isLast?: boolean;
  isExpandable?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(!isExpandable);

  return (
    <div
      className={clsx(
        "flex items-baseline gap-x-1",
        isExpandable && "flex-wrap",
      )}
    >
      {isExpandable ? (
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-label={`${isExpanded ? "Collapse" : "Expand"} ${label}`}
          onClick={() => setIsExpanded((prev) => !prev)}
          className="shrink-0 cursor-pointer rounded font-mono text-sm font-bold whitespace-nowrap text-white hover:text-gray-300"
        >
          <span
            aria-hidden="true"
            className={clsx(
              "mr-2 inline-block transform transition-transform duration-200",
              isExpanded && "rotate-90",
            )}
          >
            {/* \uFE0E forces text rendering, preventing emoji variant on iOS/Android */}
            {"\u25B6\uFE0E"}
          </span>
          {label}:
        </button>
      ) : (
        <span className="shrink-0 font-mono text-sm whitespace-nowrap text-white">
          {label}:
        </span>
      )}
      <div
        inert={!isExpanded || undefined}
        className={clsx(
          "font-mono text-sm text-gray-400 transition-opacity duration-300",
          isExpanded ? "opacity-100" : "h-0 w-0 overflow-hidden opacity-0",
        )}
      >
        {children}
      </div>
      {!isExpanded && (
        <span aria-hidden="true" className="font-mono text-sm text-gray-400">
          ...{!isLast && ","}
        </span>
      )}
    </div>
  );
};

const isEmpty = (data: JsonValue) =>
  Array.isArray(data) ? data.length === 0 : Object.keys(data).length === 0;

function ExpandedView({
  open,
  close,
  data,
}: {
  open: string;
  close: string;
  data: JsonValue;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(() => {
    const jsonData = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(jsonData).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [data]);

  return (
    <div className="relative">
      <button
        onClick={copy}
        aria-label="Copy JSON to clipboard"
        aria-live="polite"
        className="absolute top-3 right-3 cursor-pointer rounded font-mono text-xs text-gray-300 transition-colors hover:font-bold hover:text-white"
      >
        {isCopied ? "copied" : "copy"}
      </button>
      <div
        tabIndex={0}
        className="flex flex-col overflow-auto rounded bg-gray-950 p-6 font-mono text-sm text-gray-500"
      >
        {isEmpty(data) ? (
          <span>
            {open}
            {close}
          </span>
        ) : (
          <>
            <span>{open}</span>
            <div className="ml-4">{renderEntries(data as JsonObject)}</div>
            <span>{close}</span>
          </>
        )}
      </div>
    </div>
  );
}

export function Visualizer({
  isLoading,
  data,
}: {
  isLoading?: boolean;
  // An explicit null data value tells the component it has no data,
  // where as undefined implies it is awaiting data
  data?: JsonValue | null;
}) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded border-2 border-dashed border-gray-300">
        <span className="animate-pulse text-gray-500">Signing...</span>
      </div>
    );
  }

  if (data != null) {
    const isArray = Array.isArray(data);
    const open = isArray ? "[" : "{";
    const close = isArray ? "]" : "}";
    return <ExpandedView open={open} close={close} data={data} />;
  }

  if (data === null) {
    return (
      <div className="rounded bg-gray-950 px-3 py-2 font-mono text-sm text-gray-400">
        Not present
      </div>
    );
  }

  return (
    <div className="flex h-64 items-center justify-center rounded border-2 border-dashed border-gray-300">
      <span className="text-gray-400">Awaiting data...</span>
    </div>
  );
}
