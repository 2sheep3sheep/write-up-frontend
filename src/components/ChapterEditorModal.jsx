import React, { useState, useEffect } from "react";
import "../styles/chapter-editor.css";

export default function ChapterEditorModal({ chapter, onClose, onSave }) {
  // Support both 'title' and 'name' for chapter title
  const [title, setTitle] = useState(chapter?.title || chapter?.name || "");
  const [content, setContent] = useState(chapter?.content || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(chapter?.title || chapter?.name || "");
    setContent(chapter?.content || "");
  }, [chapter]);

  if (!chapter) return null;

  const handleSave = async () => {
    setSaving(true);

    const payload = {
      ...chapter,
      title: title.trim() || "Untitled",
      name: title.trim() || "Untitled", // Also set name for backend compatibility
      content,
    };

    await new Promise(r => setTimeout(r, 180));
    await onSave(payload);

    setSaving(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3 style={{ color: "#fff" }}>
          {chapter.id ? "Edit chapter" : "New chapter"}
        </h3>

        <input
          className="modal-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{width:"calc( 100% - 20px )"}}
          placeholder="Chapter title"
        />

        <textarea
          className="modal-textarea"
          rows={12}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{width:"calc( 100% - 20px )"}}
          placeholder="Chapter text..."
        />

        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}