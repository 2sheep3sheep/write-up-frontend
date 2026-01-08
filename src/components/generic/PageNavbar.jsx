// src/components/generic/PageNavbar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PersonIcon from "@mui/icons-material/Person";
import "./page-navbar.css"; // шлях до css (постав вірний)

export default function PageNavbar(props) {
  const navigate = useNavigate();
  const loc = useLocation();

  const navTo = props.setScreen;

  const dirTo = (newPath) => {
    const pathList = ["/home", "/discover", "/mybooks", "/profile"]
    const currentIndex = pathList.findIndex((e) => e === loc.pathname)
    const newIndex = pathList.findIndex((e) => e === newPath)


    return currentIndex < newIndex ? 1 : -1;
  };

  const nav = (path) => {
    if (loc.pathname !== path) navigate(path);
  };

  const authorId = localStorage.getItem("authorId")

  if (authorId == "null") {
    return <></>
  }

  return (
    <>
      <div className="page-navbar" role="navigation" aria-label="Bottom navigation">
        <button
          className={`nav-btn ${loc.pathname === "/home" ? "active" : ""}`}
          onClick={() => loc.pathname !== "/home" && navTo("/home", dirTo("/home"))}
        >
          <HomeIcon className="nav-icon" />
          <div className="nav-label">Home</div>
        </button>

        <button
          className={`nav-btn ${loc.pathname === "/discover" ? "active" : ""}`}
          onClick={() => loc.pathname !== "/discover" && navTo("/discover", dirTo("/discover"))}
        >
          <SearchIcon className="nav-icon" />
          <div className="nav-label">Discover</div>
        </button>

        <button
          className={`nav-btn ${loc.pathname === "/mybooks" ? "active" : ""}`}
          onClick={() => loc.pathname !== "/mybooks" && navTo("/mybooks", dirTo("/mybooks"))}
        >
          <MenuBookIcon className="nav-icon" />
          <div className="nav-label">My Books</div>
        </button>

        <button
          className={`nav-btn ${loc.pathname === "/profile" ? "active" : ""}`}
          onClick={() => loc.pathname !== "/profile" && navTo("/profile", dirTo("/profile"))}
        >
          <PersonIcon className="nav-icon" />
          <div className="nav-label">Profile</div>
        </button>
      </div>
    </>
  )
}