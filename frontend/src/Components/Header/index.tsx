import { ReactNode } from "react";
import styles from "./index.module.css";
import { useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  function handleLogout(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();
    localStorage.removeItem("token");
    navigate("/login");
  }
  return (
    <>
      <div className={styles.Header}>
        <h1>MyTasks</h1>

        {token ? (
          <a href="/login" onClick={handleLogout}>
            Logout
          </a>
        ) : (
          <a href="/login">Login</a>
        )}
      </div>
    </>
  );
}
