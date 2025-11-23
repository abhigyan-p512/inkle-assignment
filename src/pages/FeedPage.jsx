// client/src/pages/FeedPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import PostComposer from "../components/PostComposer";
import ActivityList from "../components/ActivityList";

export default function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [activity, setActivity] = useState([]);

  const loadFeed = async () => {
    const res = await api.get("/feed");
    setPosts(res.data?.data || []);
  };

  const loadActivity = async () => {
    const res = await api.get("/feed/activity");
    setActivity(res.data?.data || []);
  };

  useEffect(() => {
    loadFeed();
    loadActivity();
  }, []);

  return (
    <div className="page feed-layout">
      {/* MAIN FEED */}
      <div className="page-main column main">
        <h1 className="page-title">Welcome, {user?.username}</h1>

        <PostComposer onPostCreated={loadFeed} />

        <section className="section">
          <h2 className="section-title">Latest posts</h2>

          {posts.length === 0 && (
            <p className="section-empty">
              No posts yet. Be the first to post!
            </p>
          )}

          {posts.map((post) => (
            <article key={post._id} className="card post-card">
              <header className="post-header">
                <div className="post-avatar">
                  {(post.author?.displayName ||
                    post.author?.username ||
                    "?")[0].toUpperCase()}
                </div>
                <div className="post-meta">
                  {post.author ? (
                    <Link
                      to={`/users/${post.author._id}`}
                      className="post-author-name"
                    >
                      {post.author.displayName || post.author.username}
                    </Link>
                  ) : (
                    <span className="post-author-name">Unknown user</span>
                  )}

                  <span className="post-author-handle">
                    @{post.author?.username || "user"}
                  </span>
                  <span className="post-date">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>
              </header>

              <p className="post-content">{post.content}</p>
            </article>
          ))}
        </section>
      </div>

      {/* RIGHT SIDEBAR – NETWORK ACTIVITY */}
      <aside className="page-sidebar column side">
        <ActivityList items={activity} />
      </aside>
    </div>
  );
}
