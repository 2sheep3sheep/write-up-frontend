// src/components/HomeScreen.jsx
import { ClipLoader } from "react-spinners";
import { useState, useEffect } from "react";
import PageNavbar from "./generic/PageNavbar";
import LogoutIcon from "@mui/icons-material/Logout";
import "../styles/home.css";
import "../styles/mybooks.css";
import Stack from "@mui/material/Stack";
import BookModal from "./BookModal";
import SearchField from "./SearchField";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import SearchIcon from '@mui/icons-material/Search';
import { useRouteContext } from "../context/RouteContext";

export default function DiscoverScreen({
    setScreen,
    onViewChapter,
    books = [],
    fetchBooks,
    removeLocalSessionData,
}) {
    const [bookListCall, setBookListCall] = useState({ state: "inactive" });
    const [logoutCall, setLogoutCall] = useState({ state: "inactive" });

    const [error, setError] = useState(null);
    const [bookList, setBookList] = useState([]);
    const [openBook, setOpenBook] = useState(null);
    const [modalMode, setModalMode] = useState("view");

    const [bookRange, setBookRange] = useState(0);
    const [search, setSearch] = useState("");
    const [searchMode, setSearchMode] = useState("name");

    const { setCurrentRoute } = useRouteContext();

    const loadBooks = async (sourceBooks, bookOffset = bookRange) => {

        // Fetch books online
        sourceBooks = [];
        var searchParams = { offset: bookOffset, limit: 20 }

        if (search !== "") {
            if (searchMode === "name") searchParams.name = search
            if (searchMode === "genre") searchParams.genre = search
        }

        sourceBooks = await fetchBooks(searchParams);


        setBookList(Array.isArray(sourceBooks) ? sourceBooks : []);

        setBookListCall({ state: "pending" });
        setError(null);
        try {
            let sb = Array.isArray(sourceBooks) && sourceBooks.length ? sourceBooks : [];
            sb = sb.sort((a, b) => { return new Date(b.updatedAt) - new Date(a.updatedAt) })

            setBookListCall({ state: "success" });
            setCurrentRoute("/discover");
        } catch (err) {
            console.error(err);
            setError("Failed to load books. Try again.");
            setBookListCall({ state: "error" });
        }
    };

    useEffect(() => {
        loadBooks(books);
    }, [books]);

    // Reload books on empty search
    useEffect(() => {
        if (search === "") {
            loadBooks(null, 0);
        }
    }, [search]);

    const handleLogout = () => {
        setLogoutCall({ state: "pending" });
        setTimeout(() => {
            setLogoutCall({ state: "success" });
            if (setScreen) setScreen("/login", -1);
            removeLocalSessionData();
        }, 700);
    };

    return (
        <div className="home-root">
            <header className="home-header">
                <div className="header-left" />
                <div className="header-center">
                    <Stack>
                        <h1 className="home-title">Discover books</h1>
                        <p className="home-sub">Get inspired by work of other authors.</p>
                    </Stack>
                </div>
                <div className="header-right">
                    <button aria-label="Logout" className="logout-btn" onClick={handleLogout}>
                        {logoutCall.state === "pending" ? (
                            <ClipLoader color="var(--accent)" size={18} />
                        ) : (
                            <span className="logout-inner"><LogoutIcon fontSize="small" /> Logout</span>
                        )}
                    </button>
                </div>
            </header>

            <div className="mybooks-root">
                <main className="mybooks-main">

                    <Stack direction="horizontal" style={{ justifyContent: "center" }} gap={1}>
                        <SearchField value={search} onChange={setSearch} />
                        <button className="ds-btn ds-btn-primary" style={{ height: "30px", marginTop: "12px", paddingTop: "4px" }}
                            onClick={
                                () => {
                                    loadBooks(null, bookRange)
                                }
                            }
                        ><SearchIcon /></button>
                    </Stack>
                    <Stack direction="horizontal" style={{ justifyContent: "center", marginBottom: "24px" }}>
                        Search by
                        <Stack direction="horizontal" style={{ marginLeft: "8px" }}>
                            {searchMode === "name" ? <button className="ds-btn ds-btn-primary" style={{ borderTopRightRadius: "0px", borderBottomRightRadius: "0px" }}>Name</button> : <></>}
                            {searchMode !== "name" ? <button className="ds-btn ds-btn-secondary" onClick={() => { setSearchMode("name") }} style={{ borderTopRightRadius: "0px", borderBottomRightRadius: "0px" }}>Name</button> : <></>}
                            {searchMode === "genre" ? <button className="ds-btn ds-btn-primary" style={{ borderTopLeftRadius: "0px", borderBottomLeftRadius: "0px" }}>Genre</button> : <></>}
                            {searchMode !== "genre" ? <button className="ds-btn ds-btn-secondary" onClick={() => { setSearchMode("genre") }} style={{ borderTopLeftRadius: "0px", borderBottomLeftRadius: "0px" }}>Genre</button> : <></>}
                        </Stack>
                    </Stack>

                    <Stack direction="horizontal" style={{ justifyContent: "space-evenly", maxWidth: "360px", margin: "0 auto" }}>
                        <button className="ds-btn"
                            onClick={() => {
                                setBookRange(0)
                                loadBooks(null, 0)
                            }}
                        ><KeyboardDoubleArrowLeftIcon style={{ fontSize: "24px" }} /></button>

                        <button className="ds-btn"
                            onClick={() => {
                                if (bookRange > 0) {
                                    setBookRange(bookRange - 20)
                                    loadBooks(null, bookRange - 20)
                                }
                            }}
                        ><KeyboardArrowLeftIcon style={{ fontSize: "24px" }} /></button>

                        <div style={{ display: "flex", alignItems: "center" }}>
                            {`${bookRange} - ${bookRange + 20}`}
                        </div>

                        <button className="ds-btn"
                            onClick={() => {
                                setBookRange(bookRange + 20)
                                loadBooks(null, bookRange + 20)
                            }}
                        ><KeyboardArrowRightIcon style={{ fontSize: "24px" }} /></button>
                    </Stack>

                    <div className="books-list">
                        {
                            bookList.map(b => (
                                <div className="book-card" key={b.id}>
                                    <div className="book-title">{b.name}</div>
                                    <div className="book-meta">
                                        <div>
                                            Genre: {b.genre}
                                        </div>
                                        <div>
                                            Last edited: {b.updatedAt ? new Date(b.updatedAt).toLocaleString() : "—"}
                                        </div>
                                    </div>

                                    <div className="book-actions">
                                        <button className="btn btn-view" onClick={() => setScreen(`/book/${b.id}`, 1)}>View</button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </main>

                <footer className="home-footer">
                    <PageNavbar setScreen={setScreen} />
                </footer>

                <BookModal
                    open={!!openBook}
                    book={openBook}
                    mode={modalMode}
                    onClose={() => setOpenBook(null)}
                    onViewChapter={onViewChapter}
                />
            </div >
        </div >
    );
}