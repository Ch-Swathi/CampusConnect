import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle,
  Search,
  Plus
} from "lucide-react";
import { api, getStoredUser } from "../../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const firstName = user?.name ? user.name.split(" ")[0] : "Swathi";

  const [stats, setStats] = useState({
    totalComplaints: 0,
    pending: 0,
    resolved: 0,
    lostFoundCount: 0
  });

  const [recentComplaints, setRecentComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        // Load stats, complaints, and notifications in parallel
        const [complaintsData, lostFoundData, notifsData] = await Promise.all([
          api.complaints.getMy().catch(() => api.complaints.getAll({ my: "true" })),
          api.lostFound.getMy().catch(() => api.lostFound.getAll({ my: "true" })),
          api.notifications.getAll().catch(() => [])
        ]);

        const myComplaints = Array.isArray(complaintsData) ? complaintsData : [];
        const myLostFound = Array.isArray(lostFoundData) ? lostFoundData : [];

        const pendingCount = myComplaints.filter(
          (c) => c.status === "Pending" || !c.status
        ).length;
        const resolvedCount = myComplaints.filter(
          (c) => c.status === "Resolved"
        ).length;

        setStats({
          totalComplaints: myComplaints.length,
          pending: pendingCount,
          resolved: resolvedCount,
          lostFoundCount: myLostFound.length
        });

        setRecentComplaints(myComplaints.slice(0, 3));
        setNotifications(Array.isArray(notifsData) ? notifsData.slice(0, 3) : []);
      } catch (error) {
        console.error("Error loading student dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div>

      <div className="page-heading">

        <div>
          <h1>Welcome back, {firstName} 👋</h1>

          <p>
            Here's what's happening with your campus activities.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => navigate("/student/submit-complaint")}
        >
          <Plus size={18} />
          New Complaint
        </button>

      </div>


      {/* Statistics */}

      <div className="stats-grid">

        <div className="stat-card">

          <div className="stat-icon">
            <FileText />
          </div>

          <div>
            <p>Total Complaints</p>
            <h2>{loading ? "-" : stats.totalComplaints}</h2>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            <Clock />
          </div>

          <div>
            <p>Pending</p>
            <h2>{loading ? "-" : stats.pending}</h2>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            <CheckCircle />
          </div>

          <div>
            <p>Resolved</p>
            <h2>{loading ? "-" : stats.resolved}</h2>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            <Search />
          </div>

          <div>
            <p>Lost & Found Posts</p>
            <h2>{loading ? "-" : stats.lostFoundCount}</h2>
          </div>

        </div>

      </div>


      {/* Recent Complaints */}

      <div className="dashboard-grid">

        <div className="dashboard-card">

          <div className="card-header">

            <div>
              <h2>Recent Complaints</h2>
              <p>Your latest submitted complaints</p>
            </div>

            <button
              className="text-button"
              onClick={() => navigate("/student/complaints")}
            >
              View All
            </button>

          </div>


          <div className="complaint-list">

            {recentComplaints.length === 0 ? (
              <div style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>
                {loading ? "Loading complaints..." : "No complaints submitted yet."}
              </div>
            ) : (
              recentComplaints.map((complaint) => (
                <div
                  className="complaint-row"
                  key={complaint.id || complaint._id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/student/complaint/${complaint.id || complaint._id}`)}
                >

                  <div>
                    <h3>{complaint.title}</h3>
                    <p>{complaint.department} • {complaint.location}</p>
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
              ))
            )}

          </div>

        </div>


        {/* Notifications */}

        <div className="dashboard-card">

          <div className="card-header">

            <div>
              <h2>Notifications</h2>
              <p>Recent updates</p>
            </div>

            <button
              className="text-button"
              onClick={() => navigate("/student/notifications")}
            >
              View All
            </button>

          </div>


          <div className="notification-list">

            {notifications.length === 0 ? (
              <div style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>
                {loading ? "Loading notifications..." : "No notifications right now."}
              </div>
            ) : (
              notifications.map((notif, index) => (
                <div className="notification-item" key={notif.id || index}>
                  <span>{notif.type === "Announcement" ? "📢" : notif.type === "LostFound" ? "🔎" : "🔔"}</span>
                  <div>
                    <strong>{notif.title}</strong>
                    <p>{notif.message}</p>
                    <small>{notif.date || "Just now"}</small>
                  </div>
                </div>
              ))
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;