"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addBookmark, editBookmark, deleteBookmark } from "@/lib/actions/bookmarks";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  favicon_url: string | null;
  is_public: boolean;
  created_at: string;
};

type Props = {
  bookmarks: Bookmark[];
  totalPages: number;
  currentPage: number;
  currentQ: string;
  currentFilter: string;
};

export default function DashboardClient({ bookmarks, totalPages, currentPage, currentQ, currentFilter }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [fetchingOG, setFetchingOG] = useState(false);
  const [addForm, setAddForm] = useState({ url: "", title: "", is_public: false });

  function navigate(params: Record<string, string>) {
    const sp = new URLSearchParams({ q: currentQ, filter: currentFilter, page: String(currentPage), ...params });
    router.push(`/dashboard?${sp.toString()}`);
  }

  async function handleUrlBlur() {
    if (!addForm.url || addForm.title) return;
    setFetchingOG(true);
    try {
      const res = await fetch(`/api/og?url=${encodeURIComponent(addForm.url)}`);
      if (res.ok) {
        const data = await res.json();
        setAddForm((f) => ({ ...f, title: data.title }));
      }
    } finally {
      setFetchingOG(false);
    }
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAddError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("is_public", addForm.is_public ? "true" : "false");
    const result = await addBookmark(fd);
    if (result?.error) { setAddError(result.error); return; }
    setAddForm({ url: "", title: "", is_public: false });
    startTransition(() => router.refresh());
  }

  async function handleEdit(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await editBookmark(fd);
    setEditingId(null);
    startTransition(() => router.refresh());
  }

  async function handleDelete(id: string) {
    const fd = new FormData();
    fd.set("id", id);
    await deleteBookmark(fd);
    startTransition(() => router.refresh());
  }

  return (
    <div>
      {/* Add bookmark */}
      <form onSubmit={handleAdd} style={{ border: "1px solid #e0e0e0", borderRadius: 6, padding: 16, marginBottom: 24 }}>
        <h3 style={{ margin: "0 0 12px" }}>Add bookmark</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input
            name="url"
            type="url"
            required
            placeholder="https://example.com"
            value={addForm.url}
            onChange={(e) => setAddForm((f) => ({ ...f, url: e.target.value }))}
            onBlur={handleUrlBlur}
            style={inputStyle}
          />
          <input
            name="title"
            type="text"
            placeholder={fetchingOG ? "Fetching title…" : "Title (auto-fetched if blank)"}
            value={addForm.title}
            onChange={(e) => setAddForm((f) => ({ ...f, title: e.target.value }))}
            style={inputStyle}
          />
          <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14 }}>
            <input
              type="checkbox"
              checked={addForm.is_public}
              onChange={(e) => setAddForm((f) => ({ ...f, is_public: e.target.checked }))}
            />
            Public
          </label>
          {addError && <p style={{ color: "red", margin: 0, fontSize: 13 }}>{addError}</p>}
          <button type="submit" style={btnStyle}>Add</button>
        </div>
      </form>

      {/* Search + filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search…"
          defaultValue={currentQ}
          onKeyDown={(e) => {
            if (e.key === "Enter") navigate({ q: (e.target as HTMLInputElement).value, page: "1" });
          }}
          style={{ ...inputStyle, flex: 1 }}
        />
        <select
          defaultValue={currentFilter}
          onChange={(e) => navigate({ filter: e.target.value, page: "1" })}
          style={{ padding: "8px 10px", borderRadius: 4, border: "1px solid #ccc" }}
        >
          <option value="all">All</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>

      {/* Bookmark list */}
      {bookmarks.length === 0 ? (
        <p style={{ color: "#666" }}>No bookmarks found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {bookmarks.map((bm) =>
            editingId === bm.id ? (
              <li key={bm.id} style={cardStyle}>
                <form onSubmit={(e) => handleEdit(e, bm.id)} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <input type="hidden" name="id" value={bm.id} />
                  <input name="url" type="url" required defaultValue={bm.url} style={inputStyle} />
                  <input name="title" type="text" required defaultValue={bm.title} style={inputStyle} />
                  <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14 }}>
                    <input type="checkbox" name="is_public" value="true" defaultChecked={bm.is_public} />
                    Public
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button type="submit" style={btnStyle}>Save</button>
                    <button type="button" onClick={() => setEditingId(null)} style={{ ...btnStyle, background: "#666" }}>Cancel</button>
                  </div>
                </form>
              </li>
            ) : (
              <li key={bm.id} style={cardStyle}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  {bm.favicon_url && (
                    <img src={bm.favicon_url} width={16} height={16} alt="" style={{ marginTop: 3, flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <a href={bm.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 500, wordBreak: "break-word" }}>
                      {bm.title}
                    </a>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                      {new URL(bm.url).hostname} · {bm.is_public ? "public" : "private"} · {new Date(bm.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button onClick={() => setEditingId(bm.id)} style={smallBtnStyle}>Edit</button>
                    <button onClick={() => handleDelete(bm.id)} style={{ ...smallBtnStyle, color: "#c00" }}>Delete</button>
                  </div>
                </div>
              </li>
            )
          )}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", gap: 8, marginTop: 16, alignItems: "center" }}>
          <button
            disabled={currentPage <= 1}
            onClick={() => navigate({ page: String(currentPage - 1) })}
            style={btnStyle}
          >
            ← Prev
          </button>
          <span style={{ fontSize: 14 }}>Page {currentPage} of {totalPages}</span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => navigate({ page: String(currentPage + 1) })}
            style={btnStyle}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "8px 10px",
  border: "1px solid #ccc",
  borderRadius: 4,
  fontSize: 14,
  width: "100%",
  boxSizing: "border-box",
};

const btnStyle: React.CSSProperties = {
  padding: "8px 14px",
  background: "#0070f3",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 13,
};

const smallBtnStyle: React.CSSProperties = {
  padding: "4px 8px",
  background: "none",
  border: "1px solid #ccc",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 12,
};

const cardStyle: React.CSSProperties = {
  border: "1px solid #e0e0e0",
  borderRadius: 6,
  padding: 12,
};
