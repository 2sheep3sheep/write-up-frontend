import { ClipLoader } from "react-spinners";
import { useState, useEffect } from 'react';
import { useParams } from "react-router";
import BackArrow from "./generic/BackArrow";
import "../styles/chapter.css";

function Chapter({ books, setScreen }) {
    const [chapterCall, setChapterCall] = useState({ state: "inactive" });

    const params = useParams();

    const chapterId = params.id;
    const book = books.find(b => b.chapters.some(ch => ch.id === chapterId));
    const chapter = book.chapters.find(ch => ch.id === chapterId);

    const loadChapter = () => {
        setChapterCall({ state: "pending" });

        setTimeout(() => {
            setChapterCall({ state: "success" });
        }, 100);
    }

    // simulate chapter loading on component mount
    useEffect(() => {
        loadChapter();
    }, []);

    return (
        <>
            <div className="chapter-root">
                <header className="chapter-header">
                    <div className="header-left">
                        <BackArrow onClick={() => setScreen("/home", -1)} />
                    </div>
                    <div className="header-center">
                        <h1 className="chapter-title">Chapter {chapter.index} - {chapter.name}</h1>
                    </div>
                    <div className="header-right" />
                </header>

                <div>
                    <div style={{ position: "absolute", left: "10%", right: "10%" }}>
                        {chapterCall.state === "pending" ? <div style={{ display: "flex", justifyContent: "center" }}>
                            <ClipLoader color="var(--color-white)" size={30} />
                        </div> :
                            <div>
                                <div style={{ display: "flex", justifyContent: "left", marginTop: 30 }} className="chapter-content">
                                    {chapter.content}
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Chapter;
