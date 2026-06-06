"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendWelcomeEmail } from "@/lib/resend";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const handle = (formData.get("handle") as string).toLowerCase().trim();

  if (!/^[a-z0-9_]{3,30}$/.test(handle)) {
    return { error: "Handle must be 3-30 chars: letters, numbers, underscores only." };
  }

  // Check handle uniqueness before signup
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("handle", handle)
    .maybeSingle();

  if (existing) {
    return { error: "Handle already taken." };
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    const admin = createAdminClient();
    const { error: profileError } = await admin.from("profiles").insert({
      id: data.user.id,
      handle,
      email,
    });

    if (profileError) {
      // Rollback: delete the auth user so they can retry
      await admin.auth.admin.deleteUser(data.user.id);
      return { error: profileError.code === "23505" ? "Handle already taken." : "Failed to create profile." };
    }

    try {
      await sendWelcomeEmail(email, handle);
    } catch {
      // Non-fatal — account created, email failed
    }
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
