"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signout } from "@/lib/actions/auth";
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
  handle: string;
  bookmarks: Bookmark[];
  totalPages: number;
  currentPage: number;
  currentQ: string;
  currentFilter: string;
};

export default function DashboardClient({
  handle,
  bookmarks,
  totalPages,
  currentPage,
  currentQ,
  currentFilter,
}: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<Bookmark | null>(null);
  const [addForm, setAddForm] = useState({ url: "", title: "", is_public: false });
  const [addError, setAddError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [fetchingOG, setFetchingOG] = useState(false);
  const [searchInput, setSearchInput] = useState(currentQ);
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowAdd(false);
        setEditTarget(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function navigate(params: Record<string, string>) {
    const sp = new URLSearchParams({
      q: currentQ,
      filter: currentFilter,
      page: String(currentPage),
      ...params,
    });
    startTransition(() => router.push(`/dashboard?${sp.toString()}`));
  }

  function handleSearchChange(val: string) {
    setSearchInput(val);
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => navigate({ q: val, page: "1" }), 400);
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
    setShowAdd(false);
    setAddForm({ url: "", title: "", is_public: false });
    startTransition(() => router.refresh());
  }

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEditError(null);
    const fd = new FormData(e.currentTarget);
    const result = await editBookmark(fd);
    if (result?.error) { setEditError(result.error); return; }
    setEditTarget(null);
    startTransition(() => router.refresh());
  }

  async function handleDelete(id: string) {
    const fd = new FormData();
    fd.set("id", id);
    await deleteBookmark(fd);
    setEditTarget(null);
    startTransition(() => router.refresh());
  }

  const filterItems = [
    { label: "All", value: "all" },
    { label: "Public", value: "public" },
    { label: "Private", value: "private" },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 flex flex-col border-r border-gray-100 bg-white px-5 py-8 fixed top-0 left-0 h-full">
        <div className="mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">BookMarks</p>
          <p className="text-sm font-medium text-gray-800">Hi, <span className="font-bold">@{handle}</span></p>
        </div>

        <nav className="flex flex-col gap-0.5 mb-8">
          {filterItems.map((item) => (
            <button
              key={item.value}
              onClick={() => navigate({ filter: item.value, page: "1" })}
              className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                currentFilter === item.value
                  ? "bg-black text-white font-medium"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-2">
          {handle && (
            <a
              href={`/${handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-black transition-colors"
            >
              View public profile →
            </a>
          )}
          <form action={signout}>
            <button
              type="submit"
              className="text-xs text-gray-400 hover:text-black transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-56 flex-1 px-10 py-8 max-w-3xl">
        {/* Top bar */}
        <div className="flex items-center gap-3 mb-8">
          <input
            type="text"
            placeholder="Search bookmarks…"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
          />
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center justify-center w-10 h-10 bg-black hover:bg-gray-800 text-white rounded-xl transition-colors shrink-0 text-lg font-light"
          >
            +
          </button>
        </div>

        {/* Bookmark list */}
        {bookmarks.length === 0 ? (
          <div className="text-center py-20 text-gray-300">
            <p className="text-4xl mb-3">📎</p>
            <p className="text-sm">No bookmarks yet. Add your first one!</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {bookmarks.map((bm) => (
              <li
                key={bm.id}
                className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center gap-4 hover:border-gray-200 transition-colors group"
              >
                <div className="shrink-0 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                  {bm.favicon_url ? (
                    <img src={bm.favicon_url} width={18} height={18} alt="" />
                  ) : (
                    <span className="text-gray-300 text-xs">🔗</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <a
                    href={bm.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-gray-900 hover:text-black transition-colors truncate block"
                  >
                    {bm.title}
                  </a>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400 truncate">{new URL(bm.url).hostname}</span>
                    <span className="text-gray-200">·</span>
                    <span className="text-xs text-gray-400">{new Date(bm.created_at).toLocaleDateString("en-US")}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      bm.is_public
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {bm.is_public ? "public" : "private"}
                  </span>
                  <button
                    onClick={() => { setEditTarget(bm); setEditError(null); }}
                    className="text-xs text-gray-300 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              disabled={currentPage <= 1}
              onClick={() => navigate({ page: String(currentPage - 1) })}
              className="text-sm text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            <span className="text-sm text-gray-300">{currentPage} / {totalPages}</span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => navigate({ page: String(currentPage + 1) })}
              className="text-sm text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </main>

      {/* Add modal */}
      {showAdd && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowAdd(false); }}
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 w-full max-w-md mx-4 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5">Add bookmark</h2>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">URL</label>
                <input
                  name="url"
                  type="url"
                  required
                  placeholder="https://example.com"
                  value={addForm.url}
                  onChange={(e) => setAddForm((f) => ({ ...f, url: e.target.value }))}
                  onBlur={handleUrlBlur}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Title</label>
                <input
                  name="title"
                  type="text"
                  placeholder={fetchingOG ? "Fetching…" : "Auto-fetched from URL"}
                  value={addForm.title}
                  onChange={(e) => setAddForm((f) => ({ ...f, title: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addForm.is_public}
                  onChange={(e) => setAddForm((f) => ({ ...f, is_public: e.target.checked }))}
                  className="accent-black"
                />
                Make public
              </label>
              {addError && <p className="text-xs text-red-500">{addError}</p>}
              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white text-sm font-medium transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setEditTarget(null); }}
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 w-full max-w-md mx-4 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5">Edit bookmark</h2>
            <form onSubmit={handleEdit} className="flex flex-col gap-4">
              <input type="hidden" name="id" value={editTarget.id} />
              <div>
                <label className="text-xs text-gray-400 mb-1 block">URL</label>
                <input
                  name="url"
                  type="url"
                  required
                  defaultValue={editTarget.url}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Title</label>
                <input
                  name="title"
                  type="text"
                  required
                  defaultValue={editTarget.title}
                  className={inputCls}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_public"
                  value="true"
                  defaultChecked={editTarget.is_public}
                  className="accent-black"
                />
                Make public
              </label>
              {editError && <p className="text-xs text-red-500">{editError}</p>}
              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => handleDelete(editTarget.id)}
                  className="py-2.5 px-4 rounded-xl border border-red-200 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white text-sm font-medium transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls =
  "w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black";
