import { createContext, useContext, useState } from 'react';

const RouteContext = createContext();

export function useRouteContext() {
    return useContext(RouteContext);
}

export function RouteProvider({ children }) {
    const [currentRoute, setCurrentRoute] = useState("/home");

    const value = {
        currentRoute,
        setCurrentRoute
    }

    return (
        <RouteContext.Provider value={value}>
            {children}
        </RouteContext.Provider>
    )
}