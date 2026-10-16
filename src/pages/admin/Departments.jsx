import { useEffect, useState } from "react";
import { api } from "../../services/api";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const data = await api.departments.getAll();
      if (Array.isArray(data)) {
        setDepartments(data);
      }
    } catch (error) {
      console.error("Error loading departments:", error);
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setEditingDepartment(null);
    setName("");
    setDescription("");
    setShowForm(true);
  };

  const openEditForm = (department) => {
    setEditingDepartment(department);
    setName(department.name);
    setDescription(department.description || "");
    setShowForm(true);
  };

  const saveDepartment = async () => {
    if (!name.trim()) {
      alert("Please enter department name.");
      return;
    }

    try {
      setSaving(true);
      if (editingDepartment) {
        const deptId = editingDepartment.id || editingDepartment._id;
        await api.departments.update(deptId, {
          name: name.trim(),
          description: description.trim()
        });
        alert("Department updated successfully!");
      } else {
        await api.departments.create({
          name: name.trim(),
          description: description.trim()
        });
        alert("Department added successfully!");
      }

      await loadDepartments();
      setShowForm(false);
    } catch (error) {
      alert(error.message || "Failed to save department.");
    } finally {
      setSaving(false);
    }
  };

  const deleteDepartment = async (id, deptName) => {
    const confirmDelete = window.confirm(`Delete ${deptName}?`);
    if (!confirmDelete) return;

    try {
      await api.departments.delete(id);
      alert("Department deleted successfully!");
      await loadDepartments();
    } catch (error) {
      alert(error.message || "Failed to delete department");
    }
  };

  const filteredDepartments = departments.filter((department) => {
    const text = `${department.name || ""} ${department.description || ""}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div>

      {/* PAGE HEADER */}

      <div className="page-heading">

        <div>

          <h1>
            Departments 🏢
          </h1>

          <p>
            Manage campus departments and complaint assignments.
          </p>

        </div>

        <button
          className="primary-button"
          onClick={openAddForm}
        >
          + Add Department
        </button>

      </div>


      {/* SEARCH */}

      <div className="department-toolbar">

        <input
          type="text"
          placeholder="🔍 Search departments..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <span>
          {filteredDepartments.length} departments
        </span>

      </div>


      {/* DEPARTMENT GRID */}

      {loading ? (
        <div className="dashboard-card" style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
          Loading departments...
        </div>
      ) : filteredDepartments.length === 0 ? (

        <div className="empty-state">

          <div>🏢</div>

          <h2>
            No departments found
          </h2>

          <p>
            Add a department to get started.
          </p>

        </div>

      ) : (

        <div className="department-grid">

          {filteredDepartments.map((department) => {
            const deptId = department.id || department._id;
            return (
              <div
                className="department-card"
                key={deptId}
              >

                <div className="department-card-top">

                  <div className="department-icon">
                    🏢
                  </div>

                  <div className="department-actions">

                    <button
                      className="edit-button"
                      onClick={() =>
                        openEditForm(department)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteDepartment(deptId, department.name)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

                <h2>
                  {department.name}
                </h2>

                <p>
                  {department.description || "No description available."}
                </p>

                <div className="department-footer">

                  <span>
                    📋 Complaints
                  </span>

                  <strong>
                    {department.complaintCount || 0}
                  </strong>

                </div>

              </div>
            );
          })}

        </div>

      )}


      {/* ADD / EDIT MODAL */}

      {showForm && (

        <div className="modal-overlay">

          <div className="department-modal">

            <div className="modal-header">

              <div>

                <h2>
                  {editingDepartment
                    ? "Edit Department"
                    : "Add Department"}
                </h2>

                <p>
                  Enter department information.
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


            {/* DEPARTMENT NAME */}

            <div className="form-group">

              <label>
                Department Name *
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter department name"
                required
              />

            </div>


            {/* DESCRIPTION */}

            <div className="form-group">

              <label>
                Description
              </label>

              <textarea
                rows="4"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Enter department description"
              />

            </div>


            {/* BUTTONS */}

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
                onClick={saveDepartment}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingDepartment
                  ? "Update Department"
                  : "Add Department"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Departments;