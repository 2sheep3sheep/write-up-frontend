import { Outlet } from "react-router-dom";
import PageNavbar from "../components/generic/PageNavbar";

export default function BookLayout() {
  return (
    <div className="book-layout">
      <h1 className="page-title">My books</h1>

      <main className="book-content">
        <Outlet />
      </main>

      <PageNavbar />
    </div>
  );
}