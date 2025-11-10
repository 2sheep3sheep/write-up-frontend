import { ClipLoader } from "react-spinners";
import { useState, useEffect } from 'react';

function HomeScreen({ setScreen }) {
    const [bookListCall, setBookListCall] = useState({ state: "inactive" });
    const [logoutCall, setLogoutCall] = useState({ state: "inactive" });

    const loadBooks = () => {
        setBookListCall({ state: "pending" });

        setTimeout(() => {
            setBookListCall({ state: "success" });
        }, 2000);
    }

    // simulate book loading on component mount
    useEffect(() => {
        loadBooks();
    }, []);

    const handleLogout = () => {
        setLogoutCall({ state: "pending" });

        setTimeout(() => {
            setLogoutCall({ state: "success" });

            setScreen('login');
        }, 2000);
    }

    return (
        <div style={{ minHeight: '100vh', padding: 20 }}>
            <h1 style={{ textAlign: 'center' }}>My Books (placeholder)</h1>
            <p style={{ textAlign: 'center' }}>You are logged in (mock). Next: build MyBooks screen.</p>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
                {bookListCall.state === "pending" ? <ClipLoader color="var(--color-white)" size={30} /> : "There are no books yet."}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                <button className="basic-btn" onClick={handleLogout}>{
                    logoutCall.state === "pending" ? <ClipLoader color="var(--color-primary)" size={20} /> : "Logout"
                }
                </button>
            </div>
        </div>
    )
}

export default HomeScreen;