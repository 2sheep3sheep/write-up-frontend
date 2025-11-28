import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageNavbar from "./generic/PageNavbar";
import "../styles/book-detail.css";
import ChapterEditorModal from "./ChapterEditorModal";

export default function BookDetail({ books = [], setBooks = () => {} }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const book = Array.isArray(books) ? books.find(b => b.id === id) : null;

  const [editorChapter, setEditorChapter] = useState(null);

  if (!book) {
    return (
      <div style={{ padding: 20, color: "white" }}>
        <h1>Book not found</h1>
        <button onClick={() => navigate("/mybooks")}>Back</button>
        <PageNavbar />
      </div>
    );
  }

  const openEditor = (chapter) => {
    setEditorChapter(chapter);
  };

  const saveChapter = (updated) => {
    setBooks(prev =>
      prev.map(b => {
        if (b.id !== id) return b;

        let chapters = [...(b.chapters || [])];

        if (updated.id) {
          chapters = chapters.map(c =>
            c.id === updated.id ? { ...c, ...updated, lastEdited: new Date().toISOString() } : c
          );
        } else {
          chapters.unshift({
            ...updated,
            id: Date.now().toString(),
            lastEdited: new Date().toISOString()
          });
        }

        return { ...b, chapters, lastEdited: new Date().toISOString() };
      })
    );

    setEditorChapter(null);
  };

  return (
    <div className="book-detail-root">
      <h1 className="book-title">{book.title}</h1>
      <p className="book-desc">{book.description}</p>

      <div className="chapter-header">
        <h2>Chapters</h2>
        <button className="add-btn" onClick={() => openEditor({ title: "", content: "" })}>
          + Add Chapter
        </button>
      </div>

      <div className="chapter-list">
        {book.chapters?.length ? (
          book.chapters.map(c => (
            <div key={c.id} className="chapter-item">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ margin: 0 }}>{c.title}</h3>
                  <div style={{ opacity: 0.7, fontSize: 12 }}>
                    {c.lastEdited ? new Date(c.lastEdited).toLocaleString() : ""}
                  </div>
                </div>

                <div>
                  <button onClick={() => openEditor(c)}>Edit</button>
                </div>
              </div>

              <div style={{ marginTop: 8, opacity: 0.85 }}>
                {c.content
                  ? (c.content.length > 220 ? c.content.slice(0, 220) + "…" : c.content)
                  : <em>No content</em>}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-chapters">No chapters yet</div>
        )}
      </div>

      <PageNavbar />

      {editorChapter && (
        <ChapterEditorModal
          chapter={editorChapter}
          onClose={() => setEditorChapter(null)}
          onSave={saveChapter}
        />
      )}
    </div>
  );
}