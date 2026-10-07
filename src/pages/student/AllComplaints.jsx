import { useEffect, useState } from "react";

function AllComplaints() {

  const [complaints, setComplaints] = useState([]);

  const [search, setSearch] = useState("");

  useEffect(() => {

    const saved =
      JSON.parse(localStorage.getItem("complaints")) || [];

    setComplaints(saved);

  }, []);


  const filteredComplaints = complaints.filter((complaint) =>
    complaint.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );


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

        {filteredComplaints.length === 0 ? (

          <div className="empty-state">
            <h2>No complaints found</h2>
          </div>

        ) : (

          filteredComplaints.map((complaint) => (

            <div
              className="complaint-row"
              key={complaint.id}
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
                {complaint.status}
              </span>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default AllComplaints;