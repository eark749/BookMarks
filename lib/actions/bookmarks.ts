"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { fetchOGData } from "@/lib/og";

export async function addBookmark(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const url = formData.get("url") as string;
  const isPublic = formData.get("is_public") === "true";

  let title = (formData.get("title") as string)?.trim();
  let faviconUrl: string | null = null;

  try {
    const og = await fetchOGData(url);
    if (!title) title = og.title;
    faviconUrl = og.favicon;
  } catch {
    if (!title) title = url;
  }

  const { error } = await supabase.from("bookmarks").insert({
    user_id: user.id,
    url,
    title,
    favicon_url: faviconUrl,
    is_public: isPublic,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function editBookmark(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const id = formData.get("id") as string;
  const url = formData.get("url") as string;
  const title = (formData.get("title") as string).trim();
  const isPublic = formData.get("is_public") === "true";

  const { error } = await supabase
    .from("bookmarks")
    .update({ url, title, is_public: isPublic, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id); // RLS + explicit filter

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteBookmark(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const id = formData.get("id") as string;

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id); // RLS + explicit filter

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}
