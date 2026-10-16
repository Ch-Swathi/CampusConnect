import { useEffect, useState } from "react";
import { api, getStoredUser, setAuth, getToken } from "../../services/api";

function Settings() {
  const [adminName, setAdminName] = useState("Campus Admin");
  const [email, setEmail] = useState("admin@campusconnect.com");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadAdminInfo() {
      try {
        const user = getStoredUser();
        if (user) {
          setAdminName(user.name || "Campus Admin");
          setEmail(user.email || "admin@campusconnect.com");
        } else {
          const res = await api.auth.getMe();
          if (res && res.user) {
            setAdminName(res.user.name);
            setEmail(res.user.email);
          }
        }
      } catch (err) {
        console.warn("Using default admin details:", err.message);
      }
    }

    loadAdminInfo();
  }, []);

  const saveSettings = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.auth.updateProfile({ name: adminName });
      if (res && res.user) {
        setAuth(getToken(), res.user);
      }
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (err) {
      alert(err.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const clearNotifications = async () => {
    try {
      await api.notifications.clear();
      alert("Notifications cleared successfully.");
    } catch (err) {
      alert(err.message || "Failed to clear notifications.");
    }
  };

  const resetAnnouncements = async () => {
    const confirmReset = window.confirm(
      "Are you sure you want to delete all announcements?"
    );

    if (confirmReset) {
      try {
        await api.announcements.deleteAll();
        alert("Announcements deleted successfully.");
      } catch (err) {
        alert(err.message || "Failed to delete announcements.");
      }
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
            color: "#166534"
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
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              value={email}
              disabled
              title="Admin account email is fixed to login identity"
            />
          </div>

          <button type="submit" className="primary-button" disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </div>

      <div className="management-card" style={{ marginTop: "25px" }}>
        <div className="table-header">
          <div>
            <h2>Application Data</h2>
            <p>Manage persistent campus data.</p>
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
            className="delete-button"
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
            <strong>Platform:</strong> React + Vite + Node.js + Express + MongoDB
          </p>

          <p>
            <strong>Version:</strong> 1.0
          </p>

          <p>
            <strong>Database:</strong> MongoDB Atlas Connected
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;