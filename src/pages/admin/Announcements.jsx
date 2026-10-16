import { useEffect, useState } from "react";
import { api } from "../../services/api";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [important, setImportant] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await api.announcements.getAll();
      if (Array.isArray(data)) {
        setAnnouncements(data);
      }
    } catch (error) {
      console.error("Error loading announcements:", error);
    } finally {
      setLoading(false);
    }
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
    setImportant(announcement.important || false);
    setShowForm(true);
  };

  const saveAnnouncement = async () => {
    if (!title.trim()) {
      alert("Please enter announcement title.");
      return;
    }

    if (!message.trim()) {
      alert("Please enter announcement message.");
      return;
    }

    try {
      setSaving(true);
      if (editingAnnouncement) {
        const id = editingAnnouncement.id || editingAnnouncement._id;
        await api.announcements.update(id, {
          title: title.trim(),
          message: message.trim(),
          important
        });
        alert("Announcement updated successfully!");
      } else {
        await api.announcements.create({
          title: title.trim(),
          message: message.trim(),
          important
        });
        alert("Announcement created successfully!");
      }

      await loadAnnouncements();
      setShowForm(false);
    } catch (error) {
      alert(error.message || "Failed to save announcement.");
    } finally {
      setSaving(false);
    }
  };

  const deleteAnnouncement = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this announcement?");
    if (!confirmDelete) return;

    try {
      await api.announcements.delete(id);
      alert("Announcement deleted successfully!");
      setAnnouncements((prev) => prev.filter((a) => (a.id || a._id) !== id));
    } catch (error) {
      alert(error.message || "Failed to delete announcement.");
    }
  };

  const filteredAnnouncements = announcements.filter((announcement) => {
    const text = `${announcement.title || ""} ${announcement.message || ""}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

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


      {loading ? (
        <div className="dashboard-card" style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
          Loading announcements...
        </div>
      ) : filteredAnnouncements.length === 0 ? (

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

          {filteredAnnouncements.map((announcement) => {
            const annId = announcement.id || announcement._id;
            return (
              <div
                className="announcement-card"
                key={annId}
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
                      openEditForm(announcement)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      deleteAnnouncement(annId)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>
            );
          })}

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
                required
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
                required
              />

            </div>


            <div className="form-group">

              <label>

                <input
                  type="checkbox"
                  checked={important}
                  onChange={(e) =>
                    setImportant(e.target.checked)
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
                disabled={saving}
              >
                Cancel
              </button>

              <button
                className="primary-button"
                onClick={saveAnnouncement}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingAnnouncement
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