import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dashboard() {

  const [stats, setStats] = useState({
    complaints: 0,
    pending: 0,
    resolved: 0,
    students: 0,
    lostFound: 0
  });


  useEffect(() => {

    const complaints =
      JSON.parse(localStorage.getItem("complaints")) || [];

    const items =
      JSON.parse(localStorage.getItem("lostFoundItems")) || [];

    const students =
      JSON.parse(localStorage.getItem("students")) || [
        {
          id: 1,
          name: "Swathi Dhanalakshmi"
        }
      ];


    setStats({

      complaints: complaints.length,

      pending: complaints.filter(
        (item) => item.status === "Pending"
      ).length,

      resolved: complaints.filter(
        (item) => item.status === "Resolved"
      ).length,

      students: students.length,

      lostFound: items.length

    });

  }, []);


  return (
    <div>

      {/* PAGE HEADER */}

      <div className="page-heading">

        <div>

          <h1>Admin Dashboard 📊</h1>

          <p>
            Manage campus complaints, students and activities.
          </p>

        </div>

      </div>


      {/* STATISTICS */}

      <div className="admin-stat-grid">


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            📋
          </div>

          <div>

            <span>Total Complaints</span>

            <h2>{stats.complaints}</h2>

          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            ⏳
          </div>

          <div>

            <span>Pending Complaints</span>

            <h2>{stats.pending}</h2>

          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            ✅
          </div>

          <div>

            <span>Resolved</span>

            <h2>{stats.resolved}</h2>

          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            👥
          </div>

          <div>

            <span>Students</span>

            <h2>{stats.students}</h2>

          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            🔎
          </div>

          <div>

            <span>Lost & Found</span>

            <h2>{stats.lostFound}</h2>

          </div>

        </div>

      </div>


      {/* QUICK ACTIONS */}

      <div className="admin-section">

        <div className="section-title">

          <div>

            <h2>Quick Actions</h2>

            <p>
              Frequently used admin functions.
            </p>

          </div>

        </div>


        <div className="admin-action-grid">


          <Link
            to="/admin/complaints"
            className="admin-action-card"
          >

            <div>📋</div>

            <h3>Manage Complaints</h3>

            <p>
              Review and update student complaints.
            </p>

          </Link>


          <Link
            to="/admin/students"
            className="admin-action-card"
          >

            <div>👥</div>

            <h3>Manage Students</h3>

            <p>
              View and manage student records.
            </p>

          </Link>


          <Link
            to="/admin/lost-found"
            className="admin-action-card"
          >

            <div>🔎</div>

            <h3>Lost & Found</h3>

            <p>
              Verify and manage reported items.
            </p>

          </Link>


          <Link
            to="/admin/announcements"
            className="admin-action-card"
          >

            <div>📢</div>

            <h3>Announcements</h3>

            <p>
              Create campus announcements.
            </p>

          </Link>


        </div>

      </div>


      {/* SYSTEM INFORMATION */}

      <div className="admin-section">

        <div className="section-title">

          <div>

            <h2>System Overview</h2>

            <p>
              Current CampusConnect system status.
            </p>

          </div>

        </div>


        <div className="system-status">

          <div>
            <span className="status-dot"></span>
            Frontend System
          </div>

          <strong>Active</strong>

        </div>


        <div className="system-status">

          <div>
            <span className="status-dot"></span>
            Complaint Management
          </div>

          <strong>Active</strong>

        </div>


        <div className="system-status">

          <div>
            <span className="status-dot"></span>
            Lost & Found
          </div>

          <strong>Active</strong>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;