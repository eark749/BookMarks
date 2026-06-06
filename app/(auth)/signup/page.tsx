import Link from "next/link";
import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <>
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
        {/* Tabs */}
        <div className="flex items-center justify-center gap-1 mb-7">
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm text-gray-400 hover:text-black transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>
            Login
          </Link>
          <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gray-100 text-sm font-medium text-black">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            Sign Up
          </span>
        </div>

        <SignupForm />
      </div>

      {/* Bottom link */}
      <p className="text-center text-sm text-gray-400 mt-5">
        Already have an account?{" "}
        <Link href="/login" className="text-black font-semibold underline underline-offset-2">
          Login
        </Link>
      </p>
    </>
  );
}
