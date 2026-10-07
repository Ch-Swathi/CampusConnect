import {
  FileText,
  Clock,
  CheckCircle,
  Search,
  Plus
} from "lucide-react";

function Dashboard() {

  return (
    <div>

      <div className="page-heading">

        <div>
          <h1>Welcome back, Swathi 👋</h1>

          <p>
            Here's what's happening with your campus activities.
          </p>
        </div>

        <button className="primary-button">
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
            <h2>8</h2>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            <Clock />
          </div>

          <div>
            <p>Pending</p>
            <h2>3</h2>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            <CheckCircle />
          </div>

          <div>
            <p>Resolved</p>
            <h2>5</h2>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            <Search />
          </div>

          <div>
            <p>Lost & Found Posts</p>
            <h2>4</h2>
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

            <button className="text-button">
              View All
            </button>

          </div>


          <div className="complaint-list">

            <div className="complaint-row">

              <div>
                <h3>Broken Classroom Fan</h3>
                <p>Maintenance • Block A</p>
              </div>

              <span className="status pending">
                Pending
              </span>

            </div>


            <div className="complaint-row">

              <div>
                <h3>WiFi Connection Issue</h3>
                <p>IT Department • Block B</p>
              </div>

              <span className="status progress">
                In Progress
              </span>

            </div>


            <div className="complaint-row">

              <div>
                <h3>Water Problem</h3>
                <p>Maintenance • Hostel</p>
              </div>

              <span className="status resolved">
                Resolved
              </span>

            </div>

          </div>

        </div>


        {/* Notifications */}

        <div className="dashboard-card">

          <div className="card-header">

            <div>
              <h2>Notifications</h2>
              <p>Recent updates</p>
            </div>

          </div>


          <div className="notification-list">

            <div className="notification-item">
              <span>🔔</span>
              <div>
                <strong>Complaint Updated</strong>
                <p>Your WiFi complaint is in progress.</p>
                <small>10 minutes ago</small>
              </div>
            </div>


            <div className="notification-item">
              <span>🔎</span>
              <div>
                <strong>Possible Lost Item Match</strong>
                <p>Someone reported a similar item.</p>
                <small>1 hour ago</small>
              </div>
            </div>


            <div className="notification-item">
              <span>📢</span>
              <div>
                <strong>New Announcement</strong>
                <p>Campus event announced.</p>
                <small>Yesterday</small>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;