// src/components/ProfileScreen.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import PageNavbar from "./generic/PageNavbar.jsx";
import { getProfile, updateProfile } from "../services/profileService.jsx";
import BackArrow from "./generic/BackArrow.jsx";
import { useBookContext } from "../context/BookContext.jsx";
import FetchHelper from "../fetchHelper.js";
import "../styles/profile.css";
import "../styles/home.css";

function validate(form) {
  const errors = {};

  if (form.bio && form.bio.length > 800) errors.bio = "Bio must be max 800 characters.";

  return errors;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProfileScreen({ setScreen }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    bio: "",
    imgUrl: ""
  });

  const [touched, setTouched] = useState({});
  const errors = useMemo(() => validate(form), [form]);
  const fileInputRef = useRef(null);

  const isAuthor = window.location.pathname === "/profile";

  const { currentBook } = useBookContext();
  const bookId = currentBook?.id;
  const authorId = currentBook?.authorId;

  const [authorBooks, setAuthorBooks] = useState([])

  const fetchAuthorBooks = async () => {
    if (authorId == "null" || !authorId) {
      return [];
    } else {
      const fetchedBooks = await FetchHelper.books.list({ authorId })
      console.log(fetchedBooks.response)
      setAuthorBooks(fetchedBooks.response)
    }
  }

  useEffect(() => {
    fetchAuthorBooks();
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        let p = null;

        if (window.location.pathname === "/profile") {
          p = await getProfile();
        } else {
          p = await getProfile(authorId);
        }

        if (!mounted) return;

        console.log(profile);

        setProfile(p);
        setForm({
          bio: p.bio ?? "",
          imgUrl: p.imgUrl ?? ""
        });
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function onBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  function startEdit() {
    setTouched({});
    setIsEditing(true);
  }

  function cancelEdit() {
    if (!profile) return;
    setTouched({});
    setForm({
      bio: profile.bio ?? "",
      imgUrl: profile.imgUrl ?? ""
    });
    setIsEditing(false);
  }

  async function confirmEdit() {
    setTouched({ bio: true });
    const currentErrors = validate(form);
    if (Object.keys(currentErrors).length > 0) return;

    setSaving(true);

    try {
      const updated = await updateProfile({
        bio: form.bio,
        imgUrl: form.imgUrl
      });

      setProfile({ ...profile, ...updated });
      setIsEditing(false);

    } finally {
      setSaving(false);
    }
  }

  async function onPickImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setForm((prev) => ({ ...prev, imgUrl: dataUrl }));
  }

  if (loading) {
    return (
      <div className="page">
        <div className="title">{isAuthor ? "My Profile" : "Author's Profile"}</div>
        <div className="panel">Loading...</div>
        <footer className="profile-footer">
          <PageNavbar setScreen={setScreen} />
        </footer>
      </div >
    );
  }

  // ===== VIEW MODE =====
  if (!isEditing) {
    return (
      isAuthor ?
        <div className="page">
          <div className="title">My Profile</div>

          <div className="section-title">Personal information</div>
          <div className="panel" style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div className="avatar-wrap">
              {profile?.imgUrl ? (
                <img
                  src={profile.imgUrl}
                  alt="avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={{ fontSize: 30, opacity: 0.65 }}>👤</div>
              )}
            </div>

            <div style={{ lineHeight: 1.45 }}>
              <div style={{ fontSize: 16, opacity: 0.65 }}>Name</div>
              <div style={{ fontSize: 20, fontWeight: 900 }}>{profile?.username}</div>
            </div>
          </div>

          <div className="section-title">Contact</div>
          <div className="panel">
            <div className="input-like">{profile?.email}</div>
          </div>

          <div className="section-title">Bio</div>
          <div className="panel">
            <div className="input-like" style={{ minHeight: 130, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
              {profile?.bio}
            </div>
          </div>

          <button className="primary-big" onClick={startEdit}>
            Edit Profile
          </button>

          <footer className="profile-footer">
            <PageNavbar setScreen={setScreen} />
          </footer>
        </div> :
        <div className="page">
          <div className="back-btn" style={{ marginBottom: 30 }}>
            <BackArrow onClick={() => setScreen(`/book/${bookId}`, -1)}>Back</BackArrow>
          </div>

          <div className="title">Author's Profile</div>

          <div className="section-title">Personal information</div>
          <div className="panel" style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div className="avatar-wrap">
              {profile?.imgUrl ? (
                <img
                  src={profile.imgUrl}
                  alt="avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={{ fontSize: 30, opacity: 0.65 }}>👤</div>
              )}
            </div>

            <div style={{ lineHeight: 1.45 }}>
              <div style={{ fontSize: 16, opacity: 0.65 }}>Name</div>
              <div style={{ fontSize: 20, fontWeight: 900 }}>{profile?.username}</div>
            </div>
          </div>

          <div className="section-title">Contact</div>
          <div className="panel">
            <div className="input-like">{profile?.email}</div>
          </div>

          <div className="section-title">Bio</div>
          <div className="panel">
            <div className="input-like" style={{ minHeight: 130, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
              {profile?.bio}
            </div>
          </div>

          <div className="section-title">Books</div>
          <div className="recent-list" role="list">
            {
              authorBooks.map((b) => (
                <div className="recent-item" key={b.id} role="listitem" onClick={() => setScreen(`book/${b.id}`, 1)}>
                  <div className="recent-icon">📗</div>
                  <div className="recent-body">
                    <div className="recent-title">{b.name}</div>
                    <div className="recent-meta">
                      <span>{b.genre}</span>
                      <span> • </span>
                      <span>⏱ {b.updatedAt || "—"}</span>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
    );
  }

  // ===== EDIT MODE =====
  return (
    <div className="page">

      <div className="title">Edit profile</div>

      <div style={{ marginTop: 18 }}>
        <div className="label">Profile image</div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onPickImage}
          style={{ display: "none" }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="upload-btn" style={saving ? {
            opacity: 0.65,
            cursor: "not-allowed"
          } : {}}
          disabled={saving}
        >
          Upload image
        </button>

        {form.imgUrl ? (
          <div style={{ marginTop: 12, display: "flex", gap: 12, alignItems: "center" }}>
            <div className="avatar-wrap">
              <img
                src={form.imgUrl}
                alt="preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, imgUrl: "" }))}
              style={{
                padding: "12px 14px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 900,
                ...(saving ? {
                  opacity: 0.65,
                  cursor: "not-allowed"
                } : {})
              }}
              disabled={saving}
            >
              Remove
            </button>
          </div>
        ) : null}
      </div>

      <div className="label">Bio</div>
      <textarea
        name="bio"
        value={form.bio}
        onChange={onChange}
        onBlur={onBlur}
        rows={6}
        className="input-like"
        style={{ resize: "none" }}
        placeholder="Bio"
      />
      <div style={{ opacity: 0.6, fontSize: 12, marginTop: 8 }}>{(form.bio || "").length}/800</div>
      {touched.bio && errors.bio ? <div className="error">{errors.bio}</div> : null}

      <div className="btn-row">
        <button
          type="button"
          className="cancel-btn"
          style={{
            ...(saving ? {
              opacity: 0.65,
              cursor: "not-allowed"
            } : {})
          }}
          onClick={cancelEdit}
          disabled={saving}
        >
          Cancel
        </button>

        <button
          type="button"
          className="confirm-btn"
          style={{
            ...(saving ? {
              opacity: 0.65,
              cursor: "not-allowed"
            } : {})
          }}
          onClick={confirmEdit}
          disabled={saving}
        >
          {saving ? "Saving..." : "Confirm"}
        </button>
      </div>

      <PageNavbar />
    </div>
  );
}