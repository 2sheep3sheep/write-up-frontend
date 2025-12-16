import { useParams } from "react-router";

function Chapter({ books }) {
    const params = useParams();

    const chapterId = params.id;
    const book = books.find(b => b.chapters.some(ch => ch.id === chapterId));
    const chapter = book.chapters.find(ch => ch.id === chapterId);

    console.log(books)

    return (
        <>
            <div>{chapter.name}</div>
        </>
    )
}

export default Chapter;
