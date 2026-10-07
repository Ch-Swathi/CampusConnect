import { Link, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  MessageSquareText,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Users,
  Building2,
  RefreshCw,
  Megaphone,
  BarChart3
} from "lucide-react";


function Layout({ children }) {

  const location = useLocation();


  // Check whether current page is an ADMIN page

  const isAdmin =
    location.pathname.startsWith("/admin");


  // =========================
  // STUDENT MENU
  // =========================

  const studentMenuItems = [

    {
      name: "Dashboard",
      path: "/student/dashboard",
      icon: <LayoutDashboard size={20} />
    },

    {
      name: "Submit Complaint",
      path: "/student/submit-complaint",
      icon: <MessageSquareText size={20} />
    },

    {
      name: "My Complaints",
      path: "/student/complaints",
      icon: <MessageSquareText size={20} />
    },

    {
      name: "All Complaints",
      path: "/student/all-complaints",
      icon: <Search size={20} />
    },

    {
      name: "Lost & Found",
      path: "/student/lost-found",
      icon: <Search size={20} />
    },

    {
      name: "My Lost/Found Posts",
      path: "/student/my-lost-found",
      icon: <Search size={20} />
    },

    {
      name: "Notifications",
      path: "/student/notifications",
      icon: <Bell size={20} />
    },

    {
      name: "Profile",
      path: "/student/profile",
      icon: <User size={20} />
    },

    {
      name: "Settings",
      path: "/student/settings",
      icon: <Settings size={20} />
    }

  ];


  // =========================
  // ADMIN MENU
  // =========================

  const adminMenuItems = [

    {
      name: "Admin Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />
    },

    {
      name: "All Complaints",
      path: "/admin/complaints",
      icon: <MessageSquareText size={20} />
    },

    {
      name: "Complaint Management",
      path: "/admin/complaints",
      icon: <RefreshCw size={20} />
    },

    {
      name: "Students",
      path: "/admin/students",
      icon: <Users size={20} />
    },

    {
      name: "Departments",
      path: "/admin/departments",
      icon: <Building2 size={20} />
    },

    {
      name: "Lost & Found Management",
      path: "/admin/lost-found",
      icon: <Search size={20} />
    },

    {
      name: "Announcements",
      path: "/admin/announcements",
      icon: <Megaphone size={20} />
    },

    {
      name: "Reports & Analytics",
      path: "/admin/reports",
      icon: <BarChart3 size={20} />
    },

    {
      name: "Settings",
      path: "/admin/settings",
      icon: <Settings size={20} />
    }

  ];


  // Select menu based on current URL

  const menuItems =
    isAdmin
      ? adminMenuItems
      : studentMenuItems;


  return (

    <div className="app-layout">


      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="sidebar">


        {/* LOGO */}

        <div className="sidebar-logo">

          <span>🏫</span>

          <h2>
            CampusConnect
          </h2>

        </div>


        {/* MENU */}

        <nav>

          {menuItems.map((item) => (

            <Link

              key={item.name}

              to={item.path}

              className={

                location.pathname === item.path

                  ? "menu-item active"

                  : "menu-item"

              }

            >

              {item.icon}

              <span>
                {item.name}
              </span>

            </Link>

          ))}

        </nav>


        {/* LOGOUT */}

        <Link
          to="/login"
          className="logout-button"
        >

          <LogOut size={20} />

          <span>
            Logout
          </span>

        </Link>


      </aside>


      {/* =========================
          MAIN AREA
      ========================= */}

      <main className="main-area">


        {/* TOP BAR */}

        <header className="topbar">


          <div>

            <h3>

              {isAdmin
                ? "Admin Portal"
                : "Student Portal"}

            </h3>


            <p>

              {isAdmin
                ? "Manage campus activities and services"
                : "Manage your campus activities"}

            </p>

          </div>


          <div className="topbar-user">


            <Bell size={22} />


            <div className="user-avatar">

              {isAdmin
                ? "A"
                : "S"}

            </div>


          </div>


        </header>


        {/* PAGE CONTENT */}

        <section className="page-content">

          {children}

        </section>


      </main>


    </div>

  );

}


export default Layout;