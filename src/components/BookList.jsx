import ConfirmDeleteBookModal from "./ConfirmDeleteBookModal";

export default function BookList({ books, onView, onEdit, onDelete, search, bookToDelete, setBookToDelete }) {
  // Ensure books is always an array
  const booksArray = Array.isArray(books) ? books : [];

  if (booksArray.length === 0) {
    return <div className="no-books">No books found.</div>;
  }

  const filteredBooks = booksArray.filter(b =>
    b.name && b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="books-list">
      {filteredBooks.map(b => (
        <div className="book-card" key={b.id}>
          <div className="book-title">{b.name}</div>
          <div className="book-meta">{b.genre}</div>

          <div className="book-actions">
            <button className="ds-btn ds-btn-primary" onClick={() => onView(b)}>View</button>
            <button className="ds-btn ds-btn-secondary" onClick={() => onEdit(b)}>Edit</button>
            <button className="ds-btn ds-btn-danger" onClick={() => setBookToDelete(b)}>Delete</button>
          </div>

          <div className="book-tiny">Last Edited: {b.updatedAt}</div>
        </div>
      ))}

      <ConfirmDeleteBookModal
        bookToDelete={bookToDelete}
        setBookToDelete={setBookToDelete}
        onDelete={() => onDelete(bookToDelete.id)}
      />
    </div>
  );
}