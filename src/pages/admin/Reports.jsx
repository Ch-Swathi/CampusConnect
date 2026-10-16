import { useEffect, useState } from "react";
import { api } from "../../services/api";

function Reports() {
  const [complaints, setComplaints] = useState([]);
  const [lostFoundItems, setLostFoundItems] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReportsData() {
      try {
        setLoading(true);
        const [complaintsData, lostFoundData, deptsData] = await Promise.all([
          api.complaints.getAll(),
          api.lostFound.getAll(),
          api.departments.getAll()
        ]);

        if (Array.isArray(complaintsData)) setComplaints(complaintsData);
        if (Array.isArray(lostFoundData)) setLostFoundItems(lostFoundData);
        if (Array.isArray(deptsData)) setDepartments(deptsData);
      } catch (error) {
        console.error("Error loading reports data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadReportsData();
  }, []);

  const totalComplaints = complaints.length;

  const pending = complaints.filter(
    (item) => !item.status || item.status === "Pending"
  ).length;

  const inProgress = complaints.filter(
    (item) => item.status === "In Progress"
  ).length;

  const resolved = complaints.filter(
    (item) => item.status === "Resolved"
  ).length;

  const lostItems = lostFoundItems.filter(
    (item) => item.type === "Lost"
  ).length;

  const foundItems = lostFoundItems.filter(
    (item) => item.type === "Found"
  ).length;

  const activeItems = lostFoundItems.filter(
    (item) => item.status !== "Resolved"
  ).length;

  const getDepartmentCount = (departmentName) => {
    return complaints.filter(
      (item) => item.department === departmentName
    ).length;
  };

  const getCategoryCount = (category) => {
    return complaints.filter(
      (item) => (item.category || "").toLowerCase() === category.toLowerCase()
    ).length;
  };

  const categories = [
    "Academic",
    "Infrastructure",
    "Hostel",
    "Library",
    "Transport",
    "Cleanliness",
    "Electrical",
    "WiFi",
    "Other",
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p>Overview of campus complaints and lost & found activity.</p>
        </div>
      </div>

      {loading ? (
        <div className="dashboard-card" style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
          Generating reports...
        </div>
      ) : (
        <>
          {/* Complaint Statistics */}
          <h2 style={{ marginTop: "25px" }}>Complaint Overview</h2>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Complaints</h3>
              <strong>{totalComplaints}</strong>
            </div>

            <div className="stat-card">
              <h3>Pending</h3>
              <strong>{pending}</strong>
            </div>

            <div className="stat-card">
              <h3>In Progress</h3>
              <strong>{inProgress}</strong>
            </div>

            <div className="stat-card">
              <h3>Resolved</h3>
              <strong>{resolved}</strong>
            </div>
          </div>

          {/* Lost Found */}
          <h2 style={{ marginTop: "30px" }}>Lost & Found Overview</h2>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Posts</h3>
              <strong>{lostFoundItems.length}</strong>
            </div>

            <div className="stat-card">
              <h3>Lost Items</h3>
              <strong>{lostItems}</strong>
            </div>

            <div className="stat-card">
              <h3>Found Items</h3>
              <strong>{foundItems}</strong>
            </div>

            <div className="stat-card">
              <h3>Active Items</h3>
              <strong>{activeItems}</strong>
            </div>
          </div>

          {/* Department Report */}
          <div className="management-card" style={{ marginTop: "30px" }}>
            <div className="table-header">
              <div>
                <h2>Department-wise Complaints</h2>
                <p>Number of complaints assigned to each department.</p>
              </div>
            </div>

            {departments.length === 0 ? (
              <div className="empty-state">
                <p>No departments available.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Complaints</th>
                    </tr>
                  </thead>

                  <tbody>
                    {departments.map((department) => (
                      <tr key={department.id || department._id}>
                        <td>{department.name}</td>
                        <td>{getDepartmentCount(department.name)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Category Report */}
          <div className="management-card" style={{ marginTop: "30px" }}>
            <div className="table-header">
              <div>
                <h2>Category-wise Complaints</h2>
                <p>Complaint distribution by category.</p>
              </div>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Complaints</th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((category) => (
                    <tr key={category}>
                      <td>{category}</td>
                      <td>{getCategoryCount(category)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="management-card" style={{ marginTop: "30px" }}>
            <div className="table-header">
              <div>
                <h2>System Summary</h2>
              </div>
            </div>

            <div style={{ padding: "20px" }}>
              <p>
                <strong>Total Departments:</strong> {departments.length}
              </p>

              <p>
                <strong>Total Complaints:</strong> {totalComplaints}
              </p>

              <p>
                <strong>Total Lost & Found Posts:</strong>{" "}
                {lostFoundItems.length}
              </p>

              <p>
                <strong>Resolved Complaints:</strong> {resolved}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Reports;