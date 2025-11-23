// client/src/pages/components/ActivityList.jsx
import React from "react";

export default function ActivityList({ items = [] }) {
  return (
    <>
      <div className="section-title">Network activity</div>

      {items.length === 0 && (
        <p className="subtext">No activity yet.</p>
      )}

      {items.map((item) => {
        const key = item.id || item._id;
        const message =
          item.message ||
          `${item.actor?.username || "Someone"} did something`;

        const when = item.createdAt
          ? new Date(item.createdAt).toLocaleString()
          : "";

        return (
          <div key={key} className="activity-item">
            <div className="activity-message">{message}</div>
            <div className="activity-meta">{when}</div>
          </div>
        );
      })}
    </>
  );
}
