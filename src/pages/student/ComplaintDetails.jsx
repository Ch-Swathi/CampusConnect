import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../services/api";

function ComplaintDetails() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComplaint() {
      try {
        setLoading(true);
        const data = await api.complaints.getById(id);
        setComplaint(data);
      } catch (error) {
        console.error("Error fetching complaint:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchComplaint();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="dashboard-card" style={{ padding: "40px", textAlign: "center" }}>
        <h2>Loading complaint details...</h2>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="dashboard-card">
        <h2>Complaint not found</h2>

        <Link to="/student/complaints">
          Back to My Complaints
        </Link>
      </div>
    );
  }

  const isAssigned = Boolean(complaint.department && complaint.department !== "Not Assigned");
  const isInProgress = complaint.status === "In Progress" || complaint.status === "Resolved";
  const isResolved = complaint.status === "Resolved";

  return (
    <div>

      <div className="page-heading">

        <div>
          <h1>Complaint Details</h1>

          <p>
            Complaint #{complaint.id || complaint._id}
          </p>
        </div>

        <Link
          to="/student/complaints"
          className="secondary-button"
        >
          ← Back
        </Link>

      </div>


      <div className="dashboard-card">

        <div className="detail-header">

          <div>
            <h2>{complaint.title}</h2>

            <p>
              Submitted on {complaint.date}
            </p>
          </div>

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

        </div>


        <div className="detail-grid">

          <div>
            <label>Category</label>
            <p>{complaint.category}</p>
          </div>

          <div>
            <label>Department</label>
            <p>{complaint.department || "General"}</p>
          </div>

          <div>
            <label>Location</label>
            <p>{complaint.location}</p>
          </div>

          <div>
            <label>Priority</label>
            <p>{complaint.priority || "Medium"}</p>
          </div>

        </div>


        <div className="description-box">

          <label>Description</label>

          <p>
            {complaint.description}
          </p>

        </div>

        {complaint.adminRemarks && (
          <div className="description-box" style={{ marginTop: "15px", borderLeft: "4px solid #4f46e5" }}>
            <label>Admin Remarks</label>
            <p>{complaint.adminRemarks}</p>
          </div>
        )}


        <div className="timeline">

          <h3>Complaint Status</h3>

          <div className="timeline-item active">
            <span>✓</span>
            <div>
              <strong>Complaint Submitted</strong>
              <p>{complaint.date}</p>
            </div>
          </div>

          <div className={`timeline-item ${isAssigned ? "active" : ""}`}>
            <span>{isAssigned ? "✓" : "2"}</span>
            <div>
              <strong>Complaint Assigned</strong>
              <p>{isAssigned ? `Assigned to ${complaint.department}` : "Waiting for department assignment"}</p>
            </div>
          </div>

          <div className={`timeline-item ${isInProgress ? "active" : ""}`}>
            <span>{isInProgress ? "✓" : "3"}</span>
            <div>
              <strong>Work in Progress</strong>
              <p>{isInProgress ? "Department is investigating issue" : "Pending"}</p>
            </div>
          </div>

          <div className={`timeline-item ${isResolved ? "active" : ""}`}>
            <span>{isResolved ? "✓" : "4"}</span>
            <div>
              <strong>Resolved</strong>
              <p>{isResolved ? "Issue resolved and closed" : "Pending"}</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default ComplaintDetails;