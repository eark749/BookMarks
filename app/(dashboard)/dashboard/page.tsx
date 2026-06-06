import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filter?: string; page?: string }>;
}) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");
  const userId = session.user.id;

  const { data: profile } = await supabase
    .from("profiles")
    .select("handle")
    .eq("id", userId)
    .single();

  const params = await searchParams;
  const q = params.q ?? "";
  const filter = params.filter ?? "all";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const perPage = 5;

  let query = supabase
    .from("bookmarks")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  if (q) query = query.ilike("title", `%${q}%`);
  if (filter === "public") query = query.eq("is_public", true);
  if (filter === "private") query = query.eq("is_public", false);

  const { data: bookmarks, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / perPage);

  return (
    <DashboardClient
      handle={profile?.handle ?? ""}
      bookmarks={bookmarks ?? []}
      totalPages={totalPages}
      currentPage={page}
      currentQ={q}
      currentFilter={filter}
    />
  );
}
