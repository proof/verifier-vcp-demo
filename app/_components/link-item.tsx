import Link from "next/link";
import { ReactNode } from "react";
import { ArrowRightIcon } from "./../common/icons";

export function SimpleLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href}>
      <div className="group hover:outline-primary-30/55 outline-primary-30/15 bg-primary/25 hover:bg-primary/45 flex w-fit flex-0 cursor-pointer items-center gap-2 rounded-full px-2 py-1 outline outline-offset-0">
        <div className="text-primary-30 text-sm font-medium group-hover:text-white">
          {children}
        </div>
        <span className="text-xs">
          <ArrowRightIcon className="text-primary-30 h-[12px] w-[12px] -rotate-45 group-hover:text-white" />
        </span>
      </div>
    </Link>
  );
}

export function LinkItem({
  href,
  title,
  subtitle,
  icon,
}: {
  href: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
}) {
  return (
    <Link href={href}>
      <div className="group hover:shadow-primary/30 hover:outline-primary-30/55 outline-primary-30/15 flex cursor-pointer items-center gap-5 rounded-2xl bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-primary-dark)_25%,transparent),color-mix(in_srgb,var(--color-elevated)_80%,transparent))] px-5 py-4 text-white outline outline-offset-0 transition-all hover:translate-x-1 hover:bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-primary-30)_25%,transparent),color-mix(in_srgb,var(--color-elevated)_90%,transparent))] hover:shadow-xl">
        <div className="bg-primary/25 outline-primary-30/30 flex h-[44px] max-w-[44px] min-w-[44px] flex-0 flex-col items-center justify-center rounded-xl outline outline-offset-0">
          <span className="text-primary-30">{icon}</span>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="mb-1">{title}</div>
          <div className="text-xs font-light">{subtitle}</div>
        </div>
        <div className="primary/25 outline-primary-30/30 group-hover:bg-primary/25 group-hover:outline-primary-30/75 flex h-[28px] max-w-[28px] min-w-[28px] flex-0 flex-col items-center justify-center rounded-full outline outline-offset-0">
          <span className="text-xs">
            <ArrowRightIcon className="text-primary-30 h-[12px] w-[12px] -rotate-45" />
          </span>
        </div>
      </div>
    </Link>
  );
}
