import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function ComplaintDetails() {

  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);

  useEffect(() => {

    const complaints =
      JSON.parse(localStorage.getItem("complaints")) || [];

    const found = complaints.find(
      (item) => item.id.toString() === id
    );

    setComplaint(found);

  }, [id]);


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


  return (
    <div>

      <div className="page-heading">

        <div>
          <h1>Complaint Details</h1>

          <p>
            Complaint #{complaint.id}
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
            {complaint.status}
          </span>

        </div>


        <div className="detail-grid">

          <div>
            <label>Category</label>
            <p>{complaint.category}</p>
          </div>

          <div>
            <label>Department</label>
            <p>{complaint.department}</p>
          </div>

          <div>
            <label>Location</label>
            <p>{complaint.location}</p>
          </div>

          <div>
            <label>Priority</label>
            <p>{complaint.priority}</p>
          </div>

        </div>


        <div className="description-box">

          <label>Description</label>

          <p>
            {complaint.description}
          </p>

        </div>


        <div className="timeline">

          <h3>Complaint Status</h3>

          <div className="timeline-item active">
            <span>✓</span>
            <div>
              <strong>Complaint Submitted</strong>
              <p>{complaint.date}</p>
            </div>
          </div>

          <div className="timeline-item">
            <span>2</span>
            <div>
              <strong>Complaint Assigned</strong>
              <p>Waiting for department assignment</p>
            </div>
          </div>

          <div className="timeline-item">
            <span>3</span>
            <div>
              <strong>Work in Progress</strong>
              <p>Pending</p>
            </div>
          </div>

          <div className="timeline-item">
            <span>4</span>
            <div>
              <strong>Resolved</strong>
              <p>Pending</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default ComplaintDetails;