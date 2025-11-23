import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="nav-left">
        <div className="nav-brand">Social Activity Feed</div>
        {user && (
          <>
            <NavLink
              to="/feed"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Feed
            </NavLink>
            <NavLink
              to={`/users/${user.id || user._id}`}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Profile
            </NavLink>
            {(user.role === "ADMIN" || user.role === "OWNER") && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                Admin
              </NavLink>
            )}
          </>
        )}
      </div>

      <div className="nav-right">
        {!user && (
          <>
            <NavLink to="/login" className="nav-link">
              Login
            </NavLink>
            <NavLink to="/signup" className="nav-link">
              Signup
            </NavLink>
          </>
        )}
        {user && (
          <>
            <span className="nav-user">
              {user.displayName || user.username}{" "}
              <span className="badge">{user.role}</span>
            </span>
            <button className="secondary" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
