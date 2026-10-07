import { useEffect, useState } from "react";

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

  useEffect(() => {

    const saved =
      JSON.parse(localStorage.getItem("studentProfile"));

    if (saved) {
      setProfile(saved);
    }

  }, []);


  const handleChange = (e) => {

    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });

  };


  const saveProfile = () => {

    localStorage.setItem(
      "studentProfile",
      JSON.stringify(profile)
    );

    setEditing(false);

    alert("Profile updated successfully!");

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
            {profile.name.charAt(0)}
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
                onChange={handleChange}
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

            <p>{profile.department}</p>

          </div>


          <div className="profile-field">

            <label>Year</label>

            <p>{profile.year}</p>

          </div>


          <div className="profile-field">

            <label>Section</label>

            <p>{profile.section}</p>

          </div>

        </div>


        {editing && (

          <div className="profile-actions">

            <button
              className="secondary-button"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>

            <button
              className="primary-button"
              onClick={saveProfile}
            >
              Save Changes
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default Profile;