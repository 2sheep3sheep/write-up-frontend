// src/components/BookModal.jsx
import React, { useState, useEffect } from "react";
import "../styles/book-modal.css";
import ChapterModal from "./ChapterModal";

export default function BookModal({ open, book = null, mode = "view", onClose = () => {}, onSave = () => {} }) {
  const [local, setLocal] = useState(null);
  const [chapterOpen, setChapterOpen] = useState(null);
  const [chapterMode, setChapterMode] = useState("view"); // view | edit
  const [editingChapterIndex, setEditingChapterIndex] = useState(null);

  useEffect(() => {
    setLocal(book ? { ...book, chapters: (book.chapters || []).map(c => ({ title: c.title ?? c, content: c.content ?? "" })) } : null);
  }, [book]);

  if (!open || !local) return null;

  const saveBook = () => {
    const updated = { ...local, lastEdited: new Date().toISOString() };
    onSave(updated);
    setLocal(updated);
  };

  const openChapter = (idx, mode = "view") => {
    setEditingChapterIndex(idx);
    setChapterMode(mode);
    setChapterOpen({ ...local.chapters[idx], index: idx });
  };

  const handleChapterSave = (idx, updatedChapter) => {
    setLocal(prev => {
      const next = { ...prev, chapters: prev.chapters.map((c,i)=> i===idx ? updatedChapter : c) };
      return next;
    });
    setChapterOpen(null);
  };

  const handleAddChapter = () => {
    const title = `New chapter ${ (local.chapters?.length ?? 0) + 1 }`;
    setLocal(prev => ({ ...prev, chapters: [...(prev.chapters||[]), { title, content: "" }] }));
  };

  const handleRemoveChapter = (idx) => {
    setLocal(prev => ({ ...prev, chapters: prev.chapters.filter((_,i)=>i!==idx) }));
  };

  return (
    <div className="bm-overlay" role="dialog" aria-modal="true">
      <div className="bm-modal">
        <button className="bm-close" onClick={onClose} aria-label="Close">✕</button>

        <h2 className="bm-title">{local.title}</h2>
        {local.description && <p className="bm-desc">{local.description}</p>}

        <div className="bm-meta">
          <span>{(local.chapters||[]).length} chapters</span>
          <span> • </span>
          <span>Last edited: {local.lastEdited ? new Date(local.lastEdited).toLocaleString() : "—"}</span>
        </div>

        <div className="bm-actions-top">
          <button className="bm-btn bm-add" onClick={handleAddChapter}>+ Add Chapter</button>
          <button className="bm-btn bm-save" onClick={saveBook}>Save book</button>
        </div>

        <h3 className="bm-sub">Chapters</h3>
        <div className="bm-chapters">
          {(local.chapters || []).map((ch, i) => (
            <div className="bm-chapter" key={i}>
              <div className="bm-chapter-left">
                <div className="bm-ch-index">{i+1}.</div>
                <div className="bm-ch-info">
                  <div className="bm-ch-title">{ch.title}</div>
                  <div className="bm-ch-preview">{ch.content ? ch.content.slice(0, 120) : <em>— no content —</em>}</div>
                </div>
              </div>

              <div className="bm-ch-actions">
                <button className="bm-btn" onClick={() => openChapter(i, "view")}>View</button>
                <button className="bm-btn" onClick={() => openChapter(i, "edit")}>Edit</button>
                <button className="bm-btn bm-del" onClick={() => handleRemoveChapter(i)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* chapter modal */}
      <ChapterModal
        open={!!chapterOpen}
        mode={chapterMode}
        chapter={chapterOpen}
        onClose={() => setChapterOpen(null)}
        onSave={(updated) => handleChapterSave(editingChapterIndex, updated)}
      />
    </div>
  );
}