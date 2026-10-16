import { useEffect, useState } from "react";
import { api, setAuth, getToken } from "../../services/api";

function Profile() {
  const [profile, setProfile] = useState({
    name: "Swathi Dhanalakshmi",
    rollNumber: "23CSE001",
    email: "student@campus.com",
    phone: "",
    department: "Computer Science & Engineering",
    year: "3rd Year",
    section: "A"
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await api.auth.getMe();
        if (data && data.user) {
          setProfile({
            name: data.user.name || "",
            rollNumber: data.user.rollNumber || data.user.studentId || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            department: data.user.department || "Computer Science & Engineering",
            year: data.user.year || "3rd Year",
            section: data.user.section || "A"
          });
        }
      } catch (err) {
        console.warn("Could not load profile from server, using cached profile:", err.message);
        const saved = JSON.parse(localStorage.getItem("studentProfile"));
        if (saved) setProfile(saved);
      }
    }

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const saveProfile = async () => {
    try {
      setLoading(true);
      const res = await api.auth.updateProfile({
        name: profile.name,
        rollNumber: profile.rollNumber,
        phone: profile.phone,
        department: profile.department,
        year: profile.year,
        section: profile.section
      });

      if (res && res.user) {
        setAuth(getToken(), res.user);
      }

      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      alert(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <div className="page-heading">

        <div>

          <h1>My Profile 👤</h1>

          <p>
            View and manage your student information.
          </p>

        </div>

        {!editing && (
          <button
            className="primary-button"
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </button>
        )}

      </div>


      <div className="profile-card">

        <div className="profile-header">

          <div className="large-avatar">
            {profile.name?.charAt(0) || "S"}
          </div>

          <div>

            <h2>{profile.name}</h2>

            <p>
              {profile.department}
            </p>

            <span className="profile-badge">
              Student
            </span>

          </div>

        </div>


        <div className="profile-divider"></div>


        <div className="profile-grid">


          <div className="profile-field">

            <label>Full Name</label>

            {editing ? (

              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
              />

            ) : (

              <p>{profile.name}</p>

            )}

          </div>


          <div className="profile-field">

            <label>Roll Number</label>

            {editing ? (

              <input
                name="rollNumber"
                value={profile.rollNumber}
                onChange={handleChange}
              />

            ) : (

              <p>{profile.rollNumber}</p>

            )}

          </div>


          <div className="profile-field">

            <label>Email</label>

            {editing ? (

              <input
                name="email"
                value={profile.email}
                disabled
                title="Email cannot be changed"
              />

            ) : (

              <p>{profile.email}</p>

            )}

          </div>


          <div className="profile-field">

            <label>Phone</label>

            {editing ? (

              <input
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />

            ) : (

              <p>
                {profile.phone || "Not provided"}
              </p>

            )}

          </div>


          <div className="profile-field">

            <label>Department</label>

            {editing ? (
              <input
                name="department"
                value={profile.department}
                onChange={handleChange}
              />
            ) : (
              <p>{profile.department}</p>
            )}

          </div>


          <div className="profile-field">

            <label>Year</label>

            {editing ? (
              <input
                name="year"
                value={profile.year}
                onChange={handleChange}
              />
            ) : (
              <p>{profile.year}</p>
            )}

          </div>


          <div className="profile-field">

            <label>Section</label>

            {editing ? (
              <input
                name="section"
                value={profile.section}
                onChange={handleChange}
              />
            ) : (
              <p>{profile.section}</p>
            )}

          </div>

        </div>


        {editing && (

          <div className="profile-actions">

            <button
              className="secondary-button"
              onClick={() => setEditing(false)}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              className="primary-button"
              onClick={saveProfile}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default Profile;