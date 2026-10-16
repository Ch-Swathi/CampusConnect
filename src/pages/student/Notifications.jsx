import { useEffect, useState } from "react";
import { api } from "../../services/api";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await api.notifications.getAll();
      if (Array.isArray(data)) {
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const clearNotifications = async () => {
    try {
      await api.notifications.clear();
      setNotifications(notifications.filter((item) => item.type === "Announcement"));
      alert("Personal notifications cleared.");
    } catch (error) {
      alert(error.message || "Failed to clear notifications");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p>Stay updated with campus announcements and activities.</p>
        </div>

        {notifications.some(
          (item) => item.type !== "Announcement"
        ) && (
          <button
            className="secondary-button"
            onClick={clearNotifications}
          >
            Clear Notifications
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
          Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div className="empty-state">
          <h3>No Notifications</h3>
          <p>You don't have any notifications right now.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "15px",
          }}
        >
          {notifications.map((notification, index) => (
            <div
              key={notification.id || notification._id || index}
              className="management-card"
              style={{
                padding: "20px",
                borderLeft: notification.important
                  ? "5px solid #dc2626"
                  : "5px solid #2563eb",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "15px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h3 style={{ marginBottom: "8px" }}>
                    {notification.title}
                  </h3>

                  <p>{notification.message}</p>
                </div>

                <span>{notification.date}</span>
              </div>

              {notification.type === "Announcement" && (
                <div style={{ marginTop: "12px" }}>
                  <span className="status-badge">
                    Announcement
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;