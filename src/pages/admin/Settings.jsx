import { useState } from "react";

function Settings() {
  const [adminName, setAdminName] = useState(
    localStorage.getItem("adminName") || "Campus Admin"
  );

  const [email, setEmail] = useState(
    localStorage.getItem("adminEmail") || "admin@campusconnect.com"
  );

  const [saved, setSaved] = useState(false);

  const saveSettings = (e) => {
    e.preventDefault();

    localStorage.setItem("adminName", adminName);
    localStorage.setItem("adminEmail", email);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const clearNotifications = () => {
    localStorage.removeItem("notifications");
    alert("Notifications cleared.");
  };

  const resetAnnouncements = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to delete all announcements?"
    );

    if (confirmReset) {
      localStorage.removeItem("announcements");
      alert("Announcements deleted.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Admin Settings</h1>
          <p>Manage your CampusConnect administrator settings.</p>
        </div>
      </div>

      {saved && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "20px",
            borderRadius: "8px",
            background: "#e8f7ee",
          }}
        >
          Settings saved successfully.
        </div>
      )}

      <div className="management-card">
        <div className="table-header">
          <div>
            <h2>Admin Profile</h2>
            <p>Update administrator information.</p>
          </div>
        </div>

        <form
          onSubmit={saveSettings}
          style={{
            padding: "25px",
            maxWidth: "600px",
          }}
        >
          <div className="form-group">
            <label>Admin Name</label>

            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="primary-button">
            Save Settings
          </button>
        </form>
      </div>

      <div className="management-card" style={{ marginTop: "25px" }}>
        <div className="table-header">
          <div>
            <h2>Application Data</h2>
            <p>Manage locally stored application information.</p>
          </div>
        </div>

        <div style={{ padding: "25px" }}>
          <button
            className="secondary-button"
            onClick={clearNotifications}
            style={{ marginRight: "10px" }}
          >
            Clear Notifications
          </button>

          <button
            className="danger-button"
            onClick={resetAnnouncements}
          >
            Delete All Announcements
          </button>
        </div>
      </div>

      <div className="management-card" style={{ marginTop: "25px" }}>
        <div className="table-header">
          <div>
            <h2>About CampusConnect</h2>
            <p>Campus complaint and lost & found management system.</p>
          </div>
        </div>

        <div style={{ padding: "25px" }}>
          <p>
            <strong>Application:</strong> CampusConnect
          </p>

          <p>
            <strong>Platform:</strong> React + Vite
          </p>

          <p>
            <strong>Version:</strong> 1.0
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;