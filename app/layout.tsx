import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Theo Ai — Champion Kit",
  description:
    "Everything a Head of Litigation needs to walk into the budget conversation prepared.",
  robots: { index: false, follow: false }, // unlisted while in draft
};

const nav = [
  { href: "/", label: "Head of Litigation" },
  { href: "/security", label: "Information & Security" },
  { href: "/procurement", label: "Procurement" },
  { href: "/legal", label: "Legal" },
  { href: "/executive", label: "Executive & Board" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#221A16] text-white antialiased">
        <header className="no-print sticky top-0 z-50 border-b border-white/10 bg-[#221A16]/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <span className="inline-block h-2.5 w-2.5 rotate-45 bg-[#E8541E]" />
              theo ai
              <span className="ml-2 hidden rounded-full border border-white/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/60 sm:inline">
                Champion Kit
              </span>
            </Link>
            <nav className="flex gap-1 text-sm">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="rounded-md px-3 py-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="no-print border-t border-white/10">
          <div className="mx-auto max-w-6xl px-6 py-8 text-xs text-white/40">
            <p>
              Internal draft — contains placeholders (license pricing, customer quote). Benchmarks
              are cited estimates for a budget conversation, not a guarantee of results.
            </p>
            <p className="mt-2">© {new Date().getFullYear()} Theo Ai · theoai.ai</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
