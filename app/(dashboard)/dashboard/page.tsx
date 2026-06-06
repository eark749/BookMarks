import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signout } from "@/lib/actions/auth";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filter?: string; page?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("handle")
    .eq("id", user.id)
    .single();

  const params = await searchParams;
  const q = params.q ?? "";
  const filter = params.filter ?? "all"; // all | public | private
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const perPage = 5;

  let query = supabase
    .from("bookmarks")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  if (q) query = query.ilike("title", `%${q}%`);
  if (filter === "public") query = query.eq("is_public", true);
  if (filter === "private") query = query.eq("is_public", false);

  const { data: bookmarks, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / perPage);

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0 }}>My Bookmarks</h1>
          {profile?.handle && (
            <a href={`/${profile.handle}`} style={{ fontSize: 13, color: "#666" }}>
              /{profile.handle} (public profile)
            </a>
          )}
        </div>
        <form action={signout}>
          <button type="submit" style={{ padding: "6px 12px", cursor: "pointer" }}>
            Sign out
          </button>
        </form>
      </div>
      <DashboardClient
        bookmarks={bookmarks ?? []}
        totalPages={totalPages}
        currentPage={page}
        currentQ={q}
        currentFilter={filter}
      />
    </div>
  );
}
