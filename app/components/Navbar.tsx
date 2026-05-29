"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseIcon, HomeIcon, UserIcon } from "./Icons";

const items = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/about", label: "About", Icon: UserIcon },
  { href: "/work", label: "Work", Icon: BriefcaseIcon },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-6 left-1/2 z-50 -translate-x-1/2">
      <ul className="flex items-center gap-1 rounded-full border border-border bg-background/70 px-1.5 py-1.5 shadow-xl shadow-black/40 backdrop-blur-xl">
        {items.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className={`group flex items-center gap-2 rounded-full px-3 py-2 transition-colors ${
                  active
                    ? "bg-subtle text-foreground"
                    : "text-muted hover:bg-subtle/50 hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                <span
                  className={`font-mono text-xs ${
                    active ? "inline" : "hidden sm:inline"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
