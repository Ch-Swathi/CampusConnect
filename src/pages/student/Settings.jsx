import { useEffect, useState } from "react";

function Settings() {

  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    darkMode: false
  });


  useEffect(() => {

    const saved =
      JSON.parse(localStorage.getItem("settings"));

    if (saved) {
      setSettings(saved);
    }

  }, []);


  const updateSetting = (name) => {

    const updated = {
      ...settings,
      [name]: !settings[name]
    };

    setSettings(updated);

    localStorage.setItem(
      "settings",
      JSON.stringify(updated)
    );

  };


  const resetSettings = () => {

    const defaultSettings = {
      notifications: true,
      emailUpdates: true,
      darkMode: false
    };

    setSettings(defaultSettings);

    localStorage.setItem(
      "settings",
      JSON.stringify(defaultSettings)
    );

    alert("Settings reset successfully!");

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
              onClick={() =>
                alert("Password change feature will be connected to the backend later.")
              }
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

    </div>
  );
}

export default Settings;