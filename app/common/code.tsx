export function Code({
  children,
  label,
  wrap = false,
}: {
  children: React.ReactNode;
  label: string;
  wrap?: boolean;
}) {
  return (
    <pre
      tabIndex={0}
      aria-label={label}
      className={`my-2 max-w-full overflow-auto rounded bg-gray-950 px-3 py-2 font-mono text-sm text-gray-400 ${
        wrap ? "break-all whitespace-pre-wrap" : "whitespace-nowrap"
      }`}
    >
      <code>{children}</code>
    </pre>
  );
}
