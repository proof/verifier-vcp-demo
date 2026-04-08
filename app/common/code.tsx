export function Code({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <pre
      tabIndex={0}
      aria-label={label}
      className="my-2 max-w-full overflow-auto rounded bg-gray-950 px-3 py-2 font-mono text-sm whitespace-nowrap text-gray-400"
    >
      <code>{children}</code>
    </pre>
  );
}
