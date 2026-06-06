import Link from "next/link";
import { DottedSurface } from "@/components/ui/dotted-surface";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <DottedSurface />

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-100 relative z-10">
        <span className="text-sm font-semibold tracking-tight text-black">BookMarks</span>
        <Link
          href="/login"
          className="text-sm text-gray-500 hover:text-black transition-colors"
        >
          Log in
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10">
        <p className="text-2xl font-bold tracking-tight text-black mb-3">BookMarks</p>
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-6">
          Your personal link library
        </p>

        <h1 className="text-5xl sm:text-6xl font-bold text-black leading-tight tracking-tight max-w-xl mb-6">
          Save the links<br />that matter.
        </h1>

        <p className="text-gray-400 text-base max-w-sm mb-10 leading-relaxed">
          Bookmark anything. Keep it private or share it with the world via your public profile.
        </p>

        <div className="flex items-center gap-3">
          <Link
            href="/signup"
            className="px-6 py-3 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
          >
            Get started — it&apos;s free
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 border border-gray-200 text-sm text-gray-600 rounded-xl hover:border-gray-400 hover:text-black transition-colors bg-white/70 backdrop-blur-sm"
          >
            Log in
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-6 text-center relative z-10">
        <p className="text-xs text-gray-300">Simple. Private. Yours.</p>
      </footer>
    </div>
  );
}
