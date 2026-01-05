import { createContext, useContext, useState } from 'react';

const BookContext = createContext();

export function useBookContext() {
    return useContext(BookContext);
}

export function BookProvider({ children }) {
    const [currentBook, setCurrentBook] = useState(null);

    const value = {
        currentBook,
        setCurrentBook
    }

    return (
        <BookContext.Provider value={value}>
            {children}
        </BookContext.Provider>
    )
}