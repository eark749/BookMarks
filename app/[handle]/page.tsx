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

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 16px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: "0 0 4px" }}>@{profile.handle}</h1>
        <p style={{ color: "#666", margin: 0, fontSize: 14 }}>Public bookmarks</p>
      </div>

      {!bookmarks || bookmarks.length === 0 ? (
        <p style={{ color: "#888" }}>No public bookmarks yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {bookmarks.map((bm) => (
            <li key={bm.id} style={{ border: "1px solid #e0e0e0", borderRadius: 6, padding: 12 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                {bm.favicon_url && (
                  <img src={bm.favicon_url} width={16} height={16} alt="" style={{ marginTop: 3, flexShrink: 0 }} />
                )}
                <div>
                  <a href={bm.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 500, wordBreak: "break-word" }}>
                    {bm.title}
                  </a>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                    {new URL(bm.url).hostname} · {new Date(bm.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: 40, fontSize: 13, color: "#aaa" }}>
        <Link href="/signup">Create your own BookMarks profile →</Link>
      </div>
    </div>
  );
}
