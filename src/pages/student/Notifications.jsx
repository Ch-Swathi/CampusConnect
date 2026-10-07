import { useEffect, useState } from "react";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();

    window.addEventListener("storage", loadNotifications);

    return () => {
      window.removeEventListener("storage", loadNotifications);
    };
  }, []);

  const loadNotifications = () => {
    const normalNotifications =
      JSON.parse(localStorage.getItem("notifications")) || [];

    const announcements =
      JSON.parse(localStorage.getItem("announcements")) || [];

    const announcementNotifications = announcements.map((item) => ({
      id: `announcement-${item.id}`,
      title: item.important
        ? `Important: ${item.title}`
        : item.title,
      message: item.message,
      date: item.date,
      type: "Announcement",
      important: item.important,
    }));

    const combined = [
      ...announcementNotifications,
      ...normalNotifications,
    ];

    combined.sort((a, b) => {
      return String(b.id).localeCompare(String(a.id));
    });

    setNotifications(combined);
  };

  const clearNotifications = () => {
    const normalNotifications =
      JSON.parse(localStorage.getItem("notifications")) || [];

    localStorage.setItem("notifications", JSON.stringify([]));

    setNotifications(
      notifications.filter(
        (item) => item.type === "Announcement"
      )
    );
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

      {notifications.length === 0 ? (
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
          {notifications.map((notification) => (
            <div
              key={notification.id}
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