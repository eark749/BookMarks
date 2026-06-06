import Link from "next/link";

export default function Home() {
  return (
    <div style={{ maxWidth: 480, margin: "120px auto", padding: "0 16px", textAlign: "center" }}>
      <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>BookMarks</h1>
      <p style={{ color: "#555", marginBottom: 32 }}>Save, organize, and share your favorite links.</p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <Link href="/signup" style={{ padding: "10px 24px", background: "#0070f3", color: "#fff", borderRadius: 6, textDecoration: "none", fontWeight: 500 }}>
          Get started
        </Link>
        <Link href="/login" style={{ padding: "10px 24px", border: "1px solid #ccc", borderRadius: 6, textDecoration: "none", color: "#111" }}>
          Log in
        </Link>
      </div>
    </div>
  );
}
