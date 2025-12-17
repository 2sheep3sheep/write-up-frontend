export default function BookList({ books, onView, onEdit, onDelete }) {
  if (books.length === 0) {
    return <div className="no-books">No books found.</div>;
  }

  return (
    <div className="books-list">
      {books.map(b => (
        <div className="book-card" key={b.id}>
          <div className="book-title">{b.title}</div>

          <div className="book-meta">
            Chapters: {Array.isArray(b.chapters) ? b.chapters.length : 0}
          </div>

          <div className="book-actions">
            <button className="ds-btn ds-btn-secondary" onClick={() => onView(b)}>View</button>
            <button className="ds-btn ds-btn-secondary" onClick={() => onEdit(b)}>Edit</button>
            <button className="ds-btn ds-btn-danger" onClick={() => onDelete(b.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}