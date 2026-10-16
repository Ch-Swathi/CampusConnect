import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComplaints() {
      try {
        setLoading(true);
        const data = await api.complaints.getMy();
        if (Array.isArray(data)) {
          setComplaints(data);
        }
      } catch (error) {
        console.error("Error fetching my complaints:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchComplaints();
  }, []);

  return (
    <div>

      <div className="page-heading">

        <div>
          <h1>My Complaints</h1>

          <p>
            View and track your submitted complaints
          </p>
        </div>

        <Link
          to="/student/submit-complaint"
          className="primary-button"
        >
          + New Complaint
        </Link>

      </div>


      <div className="dashboard-card">

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
            Loading your complaints...
          </div>
        ) : complaints.length === 0 ? (

          <div className="empty-state">

            <div>📝</div>

            <h2>No complaints yet</h2>

            <p>
              You haven't submitted any complaints.
            </p>

            <Link
              to="/student/submit-complaint"
              className="primary-button"
            >
              Submit Complaint
            </Link>

          </div>

        ) : (

          <div className="complaints-table">

            <div className="table-header">
              <span>Complaint</span>
              <span>Department</span>
              <span>Priority</span>
              <span>Status</span>
              <span>Action</span>
            </div>


            {complaints.map((complaint) => (

              <div
                className="table-row"
                key={complaint.id || complaint._id}
              >

                <div>
                  <strong>
                    {complaint.title}
                  </strong>

                  <small>
                    {complaint.date}
                  </small>
                </div>

                <span>
                  {complaint.department}
                </span>

                <span>
                  {complaint.priority}
                </span>

                <span
                  className={`status ${
                    complaint.status === "Resolved"
                      ? "resolved"
                      : complaint.status === "In Progress"
                      ? "progress"
                      : "pending"
                  }`}
                >
                  {complaint.status || "Pending"}
                </span>

                <Link
                  to={`/student/complaint/${complaint.id || complaint._id}`}
                  className="view-button"
                >
                  View
                </Link>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default MyComplaints;