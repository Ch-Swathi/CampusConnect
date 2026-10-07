import { useEffect, useState } from "react";

function ComplaintManagement() {

  const [complaints, setComplaints] = useState([]);

  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const [status, setStatus] = useState("");

  const [department, setDepartment] = useState("");

  const [remarks, setRemarks] = useState("");

  const [departments, setDepartments] = useState([]);


  useEffect(() => {

    loadComplaints();

    const savedDepartments =
      JSON.parse(
        localStorage.getItem("departments")
      ) || [];

    setDepartments(savedDepartments);

  }, []);


  const loadComplaints = () => {

    const saved =
      JSON.parse(
        localStorage.getItem("complaints")
      ) || [];

    setComplaints(saved);

  };


  const openComplaint = (complaint) => {

    setSelectedComplaint(complaint);

    setStatus(
      complaint.status || "Pending"
    );

    setDepartment(
      complaint.department || ""
    );

    setRemarks(
      complaint.adminRemarks || ""
    );

  };


  const updateComplaint = () => {

    const saved =
      JSON.parse(
        localStorage.getItem("complaints")
      ) || [];


    const updated = saved.map((complaint) => {

      if (
        complaint.id ===
        selectedComplaint.id
      ) {

        return {
          ...complaint,
          status: status,
          department: department,
          adminRemarks: remarks
        };

      }

      return complaint;

    });


    localStorage.setItem(
      "complaints",
      JSON.stringify(updated)
    );


    setComplaints(updated);

    setSelectedComplaint(null);

    alert(
      "Complaint updated successfully!"
    );

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


        {complaints.length === 0 ? (

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

                  <tr key={complaint.id}>

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
                    key={item.id}
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
              >
                Cancel
              </button>

              <button
                className="primary-button"
                onClick={updateComplaint}
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default ComplaintManagement;