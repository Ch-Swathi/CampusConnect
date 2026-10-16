import { useEffect, useState } from "react";
import { api, getStoredUser } from "../../services/api";

function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    darkMode: false
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (user && user.settings) {
      setSettings(user.settings);
    } else {
      const saved = JSON.parse(localStorage.getItem("settings"));
      if (saved) setSettings(saved);
    }
  }, []);

  const updateSetting = async (name) => {
    const updated = {
      ...settings,
      [name]: !settings[name]
    };

    setSettings(updated);
    localStorage.setItem("settings", JSON.stringify(updated));

    try {
      await api.auth.updateSettings(updated);
    } catch (err) {
      console.warn("Could not save settings to server:", err.message);
    }
  };

  const resetSettings = async () => {
    const defaultSettings = {
      notifications: true,
      emailUpdates: true,
      darkMode: false
    };

    setSettings(defaultSettings);
    localStorage.setItem("settings", JSON.stringify(defaultSettings));

    try {
      await api.auth.updateSettings(defaultSettings);
    } catch (err) {
      console.warn("Could not reset settings on server:", err.message);
    }

    alert("Settings reset successfully!");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      alert("Please fill in both current and new passwords.");
      return;
    }

    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    try {
      setPasswordLoading(true);
      await api.auth.changePassword({ currentPassword, newPassword });
      alert("Password updated successfully!");
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      alert(error.message || "Failed to update password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div>

      <div className="page-heading">

        <div>

          <h1>Settings ⚙️</h1>

          <p>
            Manage your CampusConnect preferences.
          </p>

        </div>

      </div>


      <div className="settings-container">


        {/* Notifications */}

        <div className="settings-card">

          <div className="settings-card-header">

            <div className="settings-icon">
              🔔
            </div>

            <div>

              <h2>Notifications</h2>

              <p>
                Manage how you receive notifications.
              </p>

            </div>

          </div>


          <div className="setting-row">

            <div>

              <strong>Push Notifications</strong>

              <p>
                Receive updates about your complaints.
              </p>

            </div>

            <button
              className={
                settings.notifications
                  ? "toggle active"
                  : "toggle"
              }
              onClick={() =>
                updateSetting("notifications")
              }
            >
              <span></span>
            </button>

          </div>


          <div className="setting-row">

            <div>

              <strong>Email Updates</strong>

              <p>
                Receive important updates through email.
              </p>

            </div>

            <button
              className={
                settings.emailUpdates
                  ? "toggle active"
                  : "toggle"
              }
              onClick={() =>
                updateSetting("emailUpdates")
              }
            >
              <span></span>
            </button>

          </div>

        </div>


        {/* Appearance */}

        <div className="settings-card">

          <div className="settings-card-header">

            <div className="settings-icon">
              🎨
            </div>

            <div>

              <h2>Appearance</h2>

              <p>
                Customize the appearance of your portal.
              </p>

            </div>

          </div>


          <div className="setting-row">

            <div>

              <strong>Dark Mode</strong>

              <p>
                Use dark theme for the application.
              </p>

            </div>

            <button
              className={
                settings.darkMode
                  ? "toggle active"
                  : "toggle"
              }
              onClick={() =>
                updateSetting("darkMode")
              }
            >
              <span></span>
            </button>

          </div>

        </div>


        {/* Account */}

        <div className="settings-card">

          <div className="settings-card-header">

            <div className="settings-icon">
              🔐
            </div>

            <div>

              <h2>Account</h2>

              <p>
                Manage your account settings.
              </p>

            </div>

          </div>


          <div className="setting-row">

            <div>

              <strong>Change Password</strong>

              <p>
                Update your account password.
              </p>

            </div>

            <button
              className="secondary-button"
              onClick={() => setShowPasswordModal(true)}
            >
              Change
            </button>

          </div>


          <div className="setting-row">

            <div>

              <strong>Reset Settings</strong>

              <p>
                Restore default preferences.
              </p>

            </div>

            <button
              className="delete-button"
              onClick={resetSettings}
            >
              Reset
            </button>

          </div>

        </div>

      </div>

      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="management-modal">
            <div className="modal-header">
              <div>
                <h2>Change Password</h2>
                <p>Enter your current password and a new password.</p>
              </div>
              <button
                className="close-button"
                onClick={() => setShowPasswordModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password (min 6 characters)</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowPasswordModal(false)}
                  disabled={passwordLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? "Saving..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Settings;