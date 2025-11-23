import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users", {
        params: { page: 1, limit: 50 }
      });
      setUsers(res.data.data.items);
    } catch (err) {
      console.error(err);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user and their posts?")) return;
    await api.delete(`/admin/users/${id}`);
    await loadUsers();
  };

  const promote = async (id) => {
    await api.post(`/admin/owner/users/${id}/promote`);
    await loadUsers();
  };

  const demote = async (id) => {
    await api.post(`/admin/owner/users/${id}/demote`);
    await loadUsers();
  };

  const isOwner = user.role === "OWNER";

  return (
    <section className="column main">
      <h2>Admin panel</h2>
      <p className="subtext">
        Admins can delete users / posts / likes. Owners can also manage admin
        roles.
      </p>

      {loading && <p className="subtext">Loading users…</p>}

      {!loading && (
        <table className="table" style={{ marginTop: 16 }}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Display name</th>
              <th>Role</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>@{u.username}</td>
                <td>{u.displayName}</td>
                <td>
                  <span
                    className={
                      "badge " +
                      (u.role === "OWNER"
                        ? "owner"
                        : u.role === "ADMIN"
                        ? "admin"
                        : "")
                    }
                  >
                    {u.role}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  {isOwner && u.role === "USER" && (
                    <button
                      className="secondary"
                      style={{ marginRight: 8 }}
                      onClick={() => promote(u._id)}
                    >
                      Promote to admin
                    </button>
                  )}
                  {isOwner && u.role === "ADMIN" && (
                    <button
                      className="secondary"
                      style={{ marginRight: 8 }}
                      onClick={() => demote(u._id)}
                    >
                      Demote to user
                    </button>
                  )}
                  {u.role !== "OWNER" && (
                    <button
                      className="danger"
                      onClick={() => deleteUser(u._id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
