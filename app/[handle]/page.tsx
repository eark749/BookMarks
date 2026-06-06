import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, handle")
    .eq("handle", handle.toLowerCase())
    .maybeSingle();

  if (!profile) notFound();

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("id, title, url, favicon_url, created_at")
    .eq("user_id", profile.id)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  const count = bookmarks?.length ?? 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Top nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold tracking-tight text-black">BookMarks</Link>
        <Link
          href="/"
          className="text-xs text-gray-400 hover:text-black transition-colors"
        >
          Create your profile →
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Profile header */}
        <div className="mb-10">
          <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center mb-4">
            <span className="text-white text-xl font-bold">
              {profile.handle[0].toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-black mb-1">@{profile.handle}</h1>
          <p className="text-sm text-gray-400">
            {count} public {count === 1 ? "bookmark" : "bookmarks"}
          </p>
        </div>

        {/* Bookmark list */}
        {count === 0 ? (
          <div className="text-center py-20 text-gray-300">
            <p className="text-4xl mb-3">📎</p>
            <p className="text-sm">No public bookmarks yet.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {bookmarks!.map((bm) => (
              <li key={bm.id} className="group">
                <a
                  href={bm.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 px-5 py-4 rounded-xl border border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <div className="shrink-0 w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
                    {bm.favicon_url ? (
                      <img src={bm.favicon_url} width={18} height={18} alt="" />
                    ) : (
                      <span className="text-gray-300 text-sm">🔗</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-black truncate">
                      {bm.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new URL(bm.url).hostname} · {new Date(bm.created_at).toLocaleDateString("en-US")}
                    </p>
                  </div>

                  <svg
                    className="shrink-0 text-gray-200 group-hover:text-gray-400 transition-colors"
                    width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* CTA footer */}
        <div className="mt-16 pt-8 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-400 mb-3">Want your own bookmark profile?</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
          >
            Create yours — it&apos;s free
          </Link>
        </div>
      </div>
    </div>
  );
}
