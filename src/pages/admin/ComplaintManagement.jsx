import { useEffect, useState } from "react";
import { api } from "../../services/api";

function ComplaintManagement() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [status, setStatus] = useState("");
  const [department, setDepartment] = useState("");
  const [remarks, setRemarks] = useState("");
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadComplaints();
    loadDepartments();
  }, []);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const data = await api.complaints.getAll();
      if (Array.isArray(data)) {
        setComplaints(data);
      }
    } catch (error) {
      console.error("Error loading complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const data = await api.departments.getAll();
      if (Array.isArray(data)) {
        setDepartments(data);
      }
    } catch (error) {
      console.warn("Could not load departments:", error.message);
    }
  };

  const openComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setStatus(complaint.status || "Pending");
    setDepartment(complaint.department || "");
    setRemarks(complaint.adminRemarks || "");
  };

  const updateComplaint = async () => {
    if (!selectedComplaint) return;
    const complaintId = selectedComplaint.id || selectedComplaint._id;

    try {
      setSaving(true);
      await api.complaints.update(complaintId, {
        status,
        department,
        adminRemarks: remarks
      });

      setComplaints((prev) =>
        prev.map((c) => {
          if ((c.id || c._id) === complaintId) {
            return {
              ...c,
              status,
              department,
              adminRemarks: remarks
            };
          }
          return c;
        })
      );

      setSelectedComplaint(null);
      alert("Complaint updated successfully!");
    } catch (error) {
      alert(error.message || "Failed to update complaint");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>

      <div className="page-heading">

        <div>

          <h1>
            Complaint Management 🔄
          </h1>

          <p>
            Review, assign and update student complaints.
          </p>

        </div>

      </div>


      <div className="admin-table-card">

        <div className="table-header">

          <h2>
            All Complaints
          </h2>

          <span>
            {complaints.length} complaints
          </span>

        </div>


        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
            Loading complaints...
          </div>
        ) : complaints.length === 0 ? (

          <div className="empty-state">

            <div>📋</div>

            <h2>
              No complaints
            </h2>

            <p>
              There are no complaints available.
            </p>

          </div>

        ) : (

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>Complaint</th>

                  <th>Student</th>

                  <th>Department</th>

                  <th>Priority</th>

                  <th>Status</th>

                  <th>Date</th>

                  <th>Action</th>

                </tr>

              </thead>


              <tbody>

                {complaints.map((complaint) => (

                  <tr key={complaint.id || complaint._id}>

                    <td>

                      <strong>
                        {complaint.title}
                      </strong>

                      <small>
                        {complaint.category}
                      </small>

                    </td>


                    <td>
                      {complaint.student}
                    </td>


                    <td>
                      {complaint.department || "Not Assigned"}
                    </td>


                    <td>

                      <span
                        className={
                          complaint.priority === "High"
                            ? "priority-high"
                            : complaint.priority === "Medium"
                              ? "priority-medium"
                              : "priority-low"
                        }
                      >

                        {complaint.priority || "Low"}

                      </span>

                    </td>


                    <td>

                      <span
                        className={
                          complaint.status === "Resolved"
                            ? "status-resolved"
                            : complaint.status === "In Progress"
                              ? "status-progress"
                              : "status-pending"
                        }
                      >

                        {complaint.status || "Pending"}

                      </span>

                    </td>


                    <td>
                      {complaint.date}
                    </td>


                    <td>

                      <button
                        className="manage-button"
                        onClick={() =>
                          openComplaint(complaint)
                        }
                      >
                        Manage
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {selectedComplaint && (

        <div className="modal-overlay">

          <div className="management-modal">

            <div className="modal-header">

              <div>

                <h2>
                  Manage Complaint
                </h2>

                <p>
                  {selectedComplaint.title}
                </p>

              </div>

              <button
                className="close-button"
                onClick={() =>
                  setSelectedComplaint(null)
                }
              >
                ✕
              </button>

            </div>


            <div className="complaint-preview">

              <h3>
                Description
              </h3>

              <p>
                {selectedComplaint.description}
              </p>

            </div>


            <div className="form-group">

              <label>
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
              >

                <option>
                  Pending
                </option>

                <option>
                  In Progress
                </option>

                <option>
                  Resolved
                </option>

                <option>
                  Rejected
                </option>

              </select>

            </div>


            {/* Assign Department */}

            <div className="form-group">

              <label>
                Assign Department
              </label>

              <select
                value={department}
                onChange={(e) =>
                  setDepartment(e.target.value)
                }
              >

                <option value="">
                  Select Department
                </option>

                {departments.map((item) => (

                  <option
                    key={item.id || item._id}
                    value={item.name}
                  >
                    {item.name}
                  </option>

                ))}

              </select>

            </div>


            <div className="form-group">

              <label>
                Admin Remarks
              </label>

              <textarea
                rows="5"
                placeholder="Enter remarks..."
                value={remarks}
                onChange={(e) =>
                  setRemarks(e.target.value)
                }
              />

            </div>


            <div className="modal-actions">

              <button
                className="secondary-button"
                onClick={() =>
                  setSelectedComplaint(null)
                }
                disabled={saving}
              >
                Cancel
              </button>

              <button
                className="primary-button"
                onClick={updateComplaint}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default ComplaintManagement;