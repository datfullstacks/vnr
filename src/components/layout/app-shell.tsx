import Image from "next/image";
import { ReactNode } from "react";
import { PrimaryNav } from "@/components/layout/primary-nav";
import { primaryNavItems } from "@/lib/navigation";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-brand" role="banner">
          <Image
            src="/images/common/logo.png"
            alt="Logo"
            width={183}
            height={126}
            className="brand-logo"
            priority
          />
          <Image
            src="/images/common/logotext.png"
            alt="Vai tro cua sinh vien trong viec xay dung chu nghia xa hoi"
            width={905}
            height={97}
            className="brand-logo-text"
            priority
          />
        </div>
        <PrimaryNav items={primaryNavItems} />
      </header>

      <main className="site-main">{children}</main>

      <footer className="site-footer" />
    </div>
  );
}
