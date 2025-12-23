// src/components/BookModal.jsx
import React, { useEffect, useState } from "react";
import "../styles/book-modal.css";
import FetchHelper from "../fetchHelper";

export default function BookModal({
  open = false,
  book = null,
  mode = "view", // "view" | "edit"
  onClose = () => { },
  onSave = () => { }
}) {
  if (!open || !book) return null;

  const isView = mode === "view";

  // ---------- helper: нормалізація книги для EDIT ----------
  async function normalizeBook(b) {
    const bookResult = await FetchHelper.books.get(undefined, b.id);
    const book = bookResult.response;

    const chaptersWithContent = await Promise.all(
      (book.chapters || []).map(async (ch) => {
        const res = await FetchHelper.books.chapters.get(
          undefined,
          book.id,
          ch.id
        );
        return res.ok ? res.response : { ...ch, content: "" };
      })
    );

    return {
      ...book,
      chapters: chaptersWithContent,
    };
  }

  // draft для EDIT
  const [draft, setDraft] = useState(null);

  // розгортання глав:
  //  - для VIEW – по _viewId
  //  - для EDIT – по id
  const [viewExpandedId, setViewExpandedId] = useState(null);
  const [editExpandedId, setEditExpandedId] = useState(null);

  // loader
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!open || !book) return;

    setIsLoading(true);

    const loadBook = async () => {
      try {
        const normalized = await normalizeBook(book);
        setDraft(normalized);
        setViewExpandedId(null);
        setEditExpandedId(null);
      } catch (error) {
        console.error("Error loading book:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(loadBook, 300);

    return () => clearTimeout(timer);
  }, [book, mode, open]);

  // ---------- handlers для EDIT ----------
  const handleTitleChange = (e) => {
    const value = e.target.value;
    setDraft((prev) => prev ? ({ ...prev, name: value }) : null);
  };

  const handleGenreChange = (e) => {
    const value = e.target.value;
    setDraft((prev) => prev ? ({ ...prev, genre: value }) : null);
  };


  const handleDescChange = (e) => {
    const value = e.target.value;
    setDraft((prev) => prev ? ({ ...prev, description: value }) : null);
  };

  const handleChapterTitleChange = (chapterId, value) => {
    setDraft((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        chapters: (prev.chapters || []).map((ch) =>
          ch.id === chapterId ? { ...ch, name: value, updatedAt: new Date().toISOString() } : ch
        ),
      };
    });
  };

  const handleChapterContentChange = (chapterId, value) => {
    setDraft((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        chapters: (prev.chapters || []).map((ch) =>
          ch.id === chapterId
            ? { ...ch, content: value, updatedAt: new Date().toISOString() }
            : ch
        ),
      };
    });
  };

  const handleAddChapter = async () => {
    const result = await FetchHelper.books.chapters.create({ name: "New Chapter" }, book.id)
    if (result.ok) {
      // Reload book data to get the new chapter with proper ID
      const updatedBook = await normalizeBook(book);
      setDraft(updatedBook);
      // Expand the newly created chapter (it will be the last one)
      if (updatedBook.chapters && updatedBook.chapters.length > 0) {
        const newChapterId = updatedBook.chapters[updatedBook.chapters.length - 1].id;
        setEditExpandedId(newChapterId);
      }
    }
  };

  const handleRemoveChapter = async (chapterId) => {
    if (!draft) return;

    const chapter = draft.chapters?.find(ch => ch.id === chapterId);

    const ok = window.confirm(`Delete chapter "${chapter?.name || chapter?.title || 'Untitled'}" ? This is irreversible.`);
    if (!ok) return;

    // Delete from backend
    try {
      const result = await FetchHelper.books.chapters.delete(undefined, draft.id, chapterId);
      if (result.ok) {
        // Reload book to get updated data
        const updatedBook = await normalizeBook(book);
        setDraft(updatedBook);
        setEditExpandedId((prev) => (prev === chapterId ? null : prev));
      }
    } catch (error) {
      console.error("Error deleting chapter:", error);
    }
  };

  const handleSaveClick = async () => {
    if (!draft) return;

    // Save book metadata
    const response = await FetchHelper.books.edit({
      name: draft.name,
      genre: draft.genre,
      description: draft.description
    }, draft.id)

    console.log("EDIT BOOK RESPONSE")
    console.log(response)

    // Save chapter changes
    if (Array.isArray(draft.chapters)) {
      for (const chapter of draft.chapters) {
        try {
          if (chapter.id) {
            // Update existing chapter
            await FetchHelper.books.chapters.edit(
              {
                name: chapter.name || "Untitled",
                content: chapter.content || ""
              },
              draft.id,
              chapter.id
            );
          }
        } catch (error) {
          console.error("Error saving chapter:", error);
        }
      }
    }

    // Reload book to get latest data
    const updatedBook = await normalizeBook(book);
    const updated = {
      ...updatedBook,
      updatedAt: new Date().toISOString(),
    };

    onSave(updated);
  };

  // ---------- LOADER ----------
  if (isLoading || !draft) {
    return (
      <div className="bm-overlay">
        <div
          className="bm-modal"
          style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <div className="loader-spinner" />
        </div>
      </div>
    );
  }

  // =========================================================
  //                      VIEW MODE
  // =========================================================
  if (isView) {
    const rawChapters = Array.isArray(book.chapters) ? book.chapters : [];

    // робимо стабільний _viewId, якщо у глави немає id
    const chapters = rawChapters.map((c, idx) => ({
      ...c,
      _viewId: c.id ?? `view-${idx}`,
    }));

    return (
      <div className="bm-overlay">
        <div className="bm-modal">
          <button className="bm-close" onClick={onClose} aria-label="Close">
            ✕
          </button>

          <h2 className="bm-title">View book</h2>
          <p className="bm-sub">Book overview</p>

          {/* Title */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontSize: 14,
                color: "#98b4c9",
                marginBottom: 4,
                fontWeight: 600,
              }}
            >
              Title
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              {book.name || <em>No title</em>}
            </div>
          </div>

          {/* Genre */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontSize: 14,
                color: "#98b4c9",
                marginBottom: 4,
                fontWeight: 600,
              }}
            >
              Genre
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              {book.genre || <em>No genre</em>}
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 14,
                color: "#98b4c9",
                marginBottom: 4,
                fontWeight: 600,
              }}
            >
              Description
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
                whiteSpace: "pre-wrap",
              }}
            >
              {book.description || <em>No description</em>}
            </div>
          </div>

          {/* Chapters (view only) */}
          <h3 style={{ margin: "0 0 10px 0", color: "#e6eef0" }}>Chapters</h3>
          {chapters.length === 0 ? (
            <div className="bm-empty">No chapters yet.</div>
          ) : (
            <div className="bm-chapters">
              {chapters.map((ch, idx) => {
                const hasContent = !!ch.content;
                const isExpanded = viewExpandedId === ch._viewId;

                return (
                  <div key={ch._viewId} className="bm-chapter">
                    <div className="bm-chapter-header">
                      <div className="bm-chapter-index">{idx + 1}</div>
                      <div className="bm-chapter-title">
                        {ch.name || ch.title || <em>Untitled chapter</em>}
                      </div>
                    </div>

                    {/* Текст ВЗАГАЛІ не видно, поки не expanded */}
                    {hasContent && isExpanded && (
                      <div className="bm-chapter-content">
                        <p className="bm-pre">{ch.content}</p>
                      </div>
                    )}

                    {hasContent && (
                      <button
                        className="bm-ghost"
                        style={{ marginTop: 8, padding: "4px 10px" }}
                        onClick={() =>
                          setViewExpandedId((prev) =>
                            prev === ch._viewId ? null : ch._viewId
                          )
                        }
                      >
                        {isExpanded ? "Hide text" : "Show text"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="bm-actions">
            <button className="bm-btn bm-ghost" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  //                      EDIT MODE
  // =========================================================
  const chapters = draft?.chapters || [];

  return (
    <div className="bm-overlay">
      <div className="bm-modal">
        <button className="bm-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <h2 className="bm-title">Edit book</h2>
        <p className="bm-sub">
          Edit book title, genre and description.
        </p>

        {/* TITLE */}
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 14,
              color: "#98b4c9",
              marginBottom: 4,
              fontWeight: 600,
            }}
          >
            Title
          </div>
          <input
            className="bm-chapter-title-input"
            value={draft?.name || ""}
            onChange={handleTitleChange}
            placeholder="Book title"
          />
        </div>

        {/* GENRE */}
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 14,
              color: "#98b4c9",
              marginBottom: 4,
              fontWeight: 600,
            }}
          >
            Genre
          </div>
          <input
            className="bm-chapter-title-input"
            value={draft?.genre || ""}
            onChange={handleGenreChange}
            placeholder="Genre"
          />
        </div>

        {/* DESCRIPTION */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 14,
              color: "#98b4c9",
              marginBottom: 4,
              fontWeight: 600,
            }}
          >
            Description
          </div>
          <textarea
            className="bm-chapter-textarea"
            value={draft?.description || ""}
            onChange={handleDescChange}
            placeholder="Book description"
            style={{ width: "calc( 100% - 24px )" }}
          />
        </div>

        {/* CHAPTERS */}

        <h3 style={{ margin: "0 0 10px 0", color: "#e6eef0" }}>Chapters</h3>

        {chapters.length === 0 ? (
          <div className="bm-empty" style={{ marginBottom: 12 }}>
            No chapters yet. Add your first chapter.
          </div>
        ) : (
          <div className="bm-chapters">
            {chapters.map((ch, idx) => {
              const isExpanded = editExpandedId === ch.id;
              return (
                <div key={ch.id} className="bm-chapter">
                  <div className="bm-chapter-header">
                    <div className="bm-chapter-index">{idx + 1}</div>

                    <input
                      className="bm-chapter-title-input"
                      value={ch.name}
                      onChange={(e) =>
                        handleChapterTitleChange(ch.id, e.target.value)
                      }
                      placeholder="Chapter title"
                    />

                    <button
                      className="bm-ghost"
                      onClick={() =>
                        setEditExpandedId((prev) =>
                          prev === ch.id ? null : ch.id
                        )
                      }
                      style={{ padding: "6px 10px" }}
                      type="button"
                    >
                      {isExpanded ? "Hide text" : "Show text"}
                    </button>

                    <button
                      className="bm-remove"
                      onClick={() => handleRemoveChapter(ch.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>

                  {isExpanded && (
                    <textarea
                      className="bm-chapter-textarea"
                      value={ch.content}
                      onChange={(e) =>
                        handleChapterContentChange(ch.id, e.target.value)
                      }
                      placeholder="Chapter text"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        <button
          className="bm-btn bm-add"
          type="button"
          onClick={handleAddChapter}
          style={{ marginTop: 10 }}
        >
          + Add chapter
        </button>


        <div className="bm-actions">
          <button className="bm-btn bm-ghost" onClick={onClose}>
            Close
          </button>
          <button className="bm-btn bm-primary" onClick={handleSaveClick}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}





