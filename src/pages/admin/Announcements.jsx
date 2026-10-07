import { useEffect, useState } from "react";

function Announcements() {

  const [announcements, setAnnouncements] = useState([]);

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  const [title, setTitle] = useState("");

  const [message, setMessage] = useState("");

  const [important, setImportant] = useState(false);


  useEffect(() => {

    loadAnnouncements();

  }, []);


  const loadAnnouncements = () => {

    const saved =
      JSON.parse(
        localStorage.getItem("announcements")
      ) || [];

    setAnnouncements(saved);

  };


  const openAddForm = () => {

    setEditingAnnouncement(null);

    setTitle("");

    setMessage("");

    setImportant(false);

    setShowForm(true);

  };


  const openEditForm = (announcement) => {

    setEditingAnnouncement(announcement);

    setTitle(announcement.title);

    setMessage(announcement.message);

    setImportant(
      announcement.important || false
    );

    setShowForm(true);

  };


  const saveAnnouncement = () => {

    if (!title.trim()) {

      alert(
        "Please enter announcement title."
      );

      return;

    }


    if (!message.trim()) {

      alert(
        "Please enter announcement message."
      );

      return;

    }


    const saved =
      JSON.parse(
        localStorage.getItem("announcements")
      ) || [];


    if (editingAnnouncement) {

      const updated = saved.map(
        (announcement) => {

          if (
            announcement.id ===
            editingAnnouncement.id
          ) {

            return {
              ...announcement,
              title: title.trim(),
              message: message.trim(),
              important: important
            };

          }

          return announcement;

        }
      );


      localStorage.setItem(
        "announcements",
        JSON.stringify(updated)
      );

      setAnnouncements(updated);

      alert(
        "Announcement updated successfully!"
      );

    } else {

      const newAnnouncement = {

        id: Date.now(),

        title: title.trim(),

        message: message.trim(),

        important: important,

        date: new Date().toLocaleDateString(),

        createdAt: new Date().toISOString()

      };


      const updated = [
        newAnnouncement,
        ...saved
      ];


      localStorage.setItem(
        "announcements",
        JSON.stringify(updated)
      );

      setAnnouncements(updated);

      alert(
        "Announcement created successfully!"
      );

    }


    setShowForm(false);

  };


  const deleteAnnouncement = (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this announcement?"
      );

    if (!confirmDelete) {
      return;
    }


    const updated =
      announcements.filter(
        (announcement) =>
          announcement.id !== id
      );


    localStorage.setItem(
      "announcements",
      JSON.stringify(updated)
    );

    setAnnouncements(updated);

    alert(
      "Announcement deleted successfully!"
    );

  };


  const filteredAnnouncements =
    announcements.filter(
      (announcement) => {

        const text =
          `${announcement.title}
           ${announcement.message}`
            .toLowerCase();

        return text.includes(
          search.toLowerCase()
        );

      }
    );


  return (

    <div>

      <div className="page-heading">

        <div>

          <h1>
            Announcements 📢
          </h1>

          <p>
            Create and manage campus announcements.
          </p>

        </div>


        <button
          className="primary-button"
          onClick={openAddForm}
        >
          + New Announcement
        </button>

      </div>


      <div className="announcement-toolbar">

        <input
          type="text"
          placeholder="🔍 Search announcements..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />


        <span>
          {filteredAnnouncements.length} announcements
        </span>

      </div>


      {filteredAnnouncements.length === 0 ? (

        <div className="empty-state">

          <div>📢</div>

          <h2>
            No announcements
          </h2>

          <p>
            Create an announcement to inform students.
          </p>

        </div>

      ) : (

        <div className="announcement-list">

          {filteredAnnouncements.map(
            (announcement) => (

              <div
                className="announcement-card"
                key={announcement.id}
              >

                <div className="announcement-card-top">

                  <div>

                    {announcement.important && (
                      <span className="important-badge">
                        ⭐ Important
                      </span>
                    )}

                  </div>


                  <span>
                    {announcement.date}
                  </span>

                </div>


                <h2>
                  {announcement.title}
                </h2>


                <p>
                  {announcement.message}
                </p>


                <div className="announcement-actions">

                  <button
                    className="edit-button"
                    onClick={() =>
                      openEditForm(
                        announcement
                      )
                    }
                  >
                    Edit
                  </button>


                  <button
                    className="delete-button"
                    onClick={() =>
                      deleteAnnouncement(
                        announcement.id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            )
          )}

        </div>

      )}


      {showForm && (

        <div className="modal-overlay">

          <div className="department-modal">

            <div className="modal-header">

              <div>

                <h2>

                  {editingAnnouncement
                    ? "Edit Announcement"
                    : "New Announcement"}

                </h2>

                <p>
                  Enter announcement details.
                </p>

              </div>


              <button
                className="close-button"
                onClick={() =>
                  setShowForm(false)
                }
              >
                ✕
              </button>

            </div>


            <div className="form-group">

              <label>
                Title *
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Enter announcement title"
              />

            </div>


            <div className="form-group">

              <label>
                Message *
              </label>

              <textarea
                rows="6"
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                placeholder="Enter announcement message"
              />

            </div>


            <div className="form-group">

              <label>

                <input
                  type="checkbox"
                  checked={important}
                  onChange={(e) =>
                    setImportant(
                      e.target.checked
                    )
                  }
                />

                {" "}Mark as Important

              </label>

            </div>


            <div className="modal-actions">

              <button
                className="secondary-button"
                onClick={() =>
                  setShowForm(false)
                }
              >
                Cancel
              </button>


              <button
                className="primary-button"
                onClick={saveAnnouncement}
              >

                {editingAnnouncement
                  ? "Update Announcement"
                  : "Create Announcement"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default Announcements;