import type { ReactNode } from "react";

export function Block({
  id,
  title,
  children,
  className = "",
}: {
  id?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`text-foreground bg-elevated relative scroll-m-3 overflow-hidden ${className}`}
    >
      <div className="border-primary border-t-4 p-4 sm:p-6">
        {title && <h2 className="mb-2 text-2xl font-bold">{title}</h2>}
        <>{children}</>
      </div>
    </section>
  );
}
