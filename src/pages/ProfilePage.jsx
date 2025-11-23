// client/src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const isOwnProfile =
    currentUser && (currentUser.id === id || currentUser._id === id);

  const loadProfile = async () => {
    try {
      setError("");
      setLoading(true);

      // backend returns the user object with extra fields
      const res = await api.get(`/users/${id}`);
      setProfile(res.data || null);
    } catch (err) {
      console.error("loadProfile error", err);
      setError("Could not load profile");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const follow = async () => {
    if (isOwnProfile || !profile) return;
    try {
      setActionLoading(true);
      await api.post(`/users/${id}/follow`);
      await loadProfile(); // refresh followers, following, isFollowing
    } catch (err) {
      console.error("follow/unfollow error:", err);
      alert("Could not update follow state");
    } finally {
      setActionLoading(false);
    }
  };

  const block = async () => {
    if (isOwnProfile || !profile) return;
    try {
      setActionLoading(true);
      await api.post(`/users/${id}/block`);
      await loadProfile(); // refresh blocked state
    } catch (err) {
      console.error("block/unblock error:", err);
      alert("Could not update block state");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <section className="column main">Loading…</section>;
  }

  if (!profile) {
    return (
      <section className="column main">
        {error || "Profile not found"}
      </section>
    );
  }

  return (
    <section className="column main">
      <h2>{profile.name || profile.username}</h2>
      <p className="subtext">@{profile.username}</p>

      <div className="stats-row" style={{ marginTop: 16, marginBottom: 16 }}>
        <span>
          <span className="stat-label">{profile.followersCount ?? 0}</span>{" "}
          followers
        </span>
        <span>
          <span className="stat-label">{profile.followingCount ?? 0}</span>{" "}
          following
        </span>
        <span>
          <span className="stat-label">Role:</span> {profile.role}
        </span>
      </div>

      {!isOwnProfile && (
        <div className="actions-row" style={{ display: "flex", gap: 8 }}>
          <button onClick={follow} disabled={actionLoading}>
            {profile.isFollowing ? "Unfollow" : "Follow"}
          </button>
          <button
            className="secondary"
            onClick={block}
            disabled={actionLoading}
          >
            {profile.isBlocked ? "Unblock" : "Block"}
          </button>
        </div>
      )}

      {isOwnProfile && (
        <p className="subtext" style={{ marginTop: 16 }}>
          This is your profile.
        </p>
      )}
    </section>
  );
}
