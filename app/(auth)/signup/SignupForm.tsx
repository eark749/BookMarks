"use client";

import { signup } from "@/lib/actions/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await signup(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <label htmlFor="handle">Handle (@username)</label>
        <input
          id="handle"
          name="handle"
          type="text"
          required
          pattern="[a-zA-Z0-9_]{3,30}"
          title="3-30 chars: letters, numbers, underscores"
          placeholder="yourhandle"
          style={inputStyle}
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required placeholder="you@example.com" style={inputStyle} />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required minLength={6} placeholder="••••••" style={inputStyle} />
      </div>
      {error && <p style={{ color: "red", margin: 0 }}>{error}</p>}
      <button type="submit" disabled={loading} style={buttonStyle}>
        {loading ? "Creating account…" : "Sign up"}
      </button>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "8px 10px",
  marginTop: 4,
  border: "1px solid #ccc",
  borderRadius: 4,
  fontSize: 14,
  boxSizing: "border-box",
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 16px",
  background: "#0070f3",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 14,
};
