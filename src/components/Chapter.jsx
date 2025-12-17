import { ClipLoader } from "react-spinners";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import BackArrow from "./generic/BackArrow";
import "../styles/chapter.css";

function Chapter({ books, setScreen, fetchBooks }) {
    const [chapterCall, setChapterCall] = useState("inactive");
    const [chapterData, setChapterData] = useState(null);
    const [bookData, setBookData] = useState(null);

    const params = useParams();
    const chapterId = params.id;

    // Helper to find chapter in a books list
    const findChapterInBooks = (booksList) => {
        if (!Array.isArray(booksList)) return null;
        for (const b of booksList) {
            if (Array.isArray(b.chapters)) {
                const ch = b.chapters.find((c) => c.id === chapterId);
                if (ch) return { book: b, chapter: ch };
            }
        }
        return null;
    };

    const loadChapter = async () => {
        setChapterCall("pending");

        try {
            // Try finding the chapter in books prop
            let result = findChapterInBooks(books);

            // Fetch books if not found
            if (!result) {
                const fetchedBooks = await fetchBooks();
                result = findChapterInBooks(fetchedBooks);
            }

            if (result) {
                setBookData(result.book);
                setChapterData(result.chapter);
                setChapterCall("success");
            } else {
                setChapterCall("error");
            }
        } catch (err) {
            console.error(err);
            setChapterCall("error");
        }
    };

    // Load chapter on mount
    useEffect(() => {
        loadChapter();
    }, []);

    // Loading state
    if (chapterCall === "pending") {
        return (
            <div className="chapter-root">
                <header className="chapter-header">
                    <div className="header-left">
                        <BackArrow onClick={() => setScreen("/home", -1)} />
                    </div>
                    <div className="header-center">
                        <h1 className="chapter-title">Loading...</h1>
                    </div>
                    <div className="header-right" />
                </header>
                <div
                    style={{
                        position: "absolute",
                        left: "10%",
                        right: "10%",
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 50,
                    }}
                >
                    <ClipLoader color="var(--color-white)" size={30} />
                </div>
            </div>
        );
    }

    // Error
    if (chapterCall === "error" || !chapterData) {
        return (
            <div className="chapter-root">
                <header className="chapter-header">
                    <div className="header-left">
                        <BackArrow onClick={() => setScreen("/home", -1)} />
                    </div>
                    <div className="header-center">
                        <h1 className="chapter-title">Chapter Not Found</h1>
                    </div>
                    <div className="header-right" />
                </header>
                <div
                    style={{
                        position: "absolute",
                        left: "10%",
                        right: "10%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginTop: 50,
                    }}
                >
                    <button
                        onClick={() => setScreen("/home", -1)}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "var(--accent)",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        Go Back Home
                    </button>
                </div>
            </div>
        );
    }

    // Success state
    return (
        <div className="chapter-root">
            <header className="chapter-header">
                <div className="header-left">
                    <BackArrow onClick={() => setScreen("/home", -1)} />
                </div>
                <div className="header-center">
                    <h1 className="chapter-title">
                        Chapter {chapterData.index} - {chapterData.name}
                    </h1>
                </div>
                <div className="header-right" />
            </header>
            <div>
                <div style={{ position: "absolute", left: "10%", right: "10%" }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "left",
                            marginTop: 30,
                        }}
                        className="chapter-content"
                    >
                        {chapterData.content}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chapter;