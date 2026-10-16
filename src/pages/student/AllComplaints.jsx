import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

function AllComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComplaints() {
      try {
        setLoading(true);
        const data = await api.complaints.getAll();
        if (Array.isArray(data)) {
          setComplaints(data);
        }
      } catch (error) {
        console.error("Error fetching all complaints:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter((complaint) => {
    const text = `${complaint.title || ""} ${complaint.department || ""} ${complaint.location || ""}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div>

      <div className="page-heading">

        <div>
          <h1>All Complaints</h1>

          <p>
            View complaints submitted on campus
          </p>
        </div>

      </div>


      <div className="search-box">

        🔍

        <input
          type="text"
          placeholder="Search complaints..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>


      <div className="dashboard-card">

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
            Loading complaints...
          </div>
        ) : filteredComplaints.length === 0 ? (

          <div className="empty-state">
            <h2>No complaints found</h2>
          </div>

        ) : (

          filteredComplaints.map((complaint) => (

            <Link
              to={`/student/complaint/${complaint.id || complaint._id}`}
              className="complaint-row"
              key={complaint.id || complaint._id}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >

              <div>

                <h3>
                  {complaint.title}
                </h3>

                <p>
                  {complaint.department} •{" "}
                  {complaint.location}
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

            </Link>

          ))

        )}

      </div>

    </div>
  );
}

export default AllComplaints;