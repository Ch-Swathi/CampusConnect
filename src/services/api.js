const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export function getToken() {
  return localStorage.getItem("token") || "";
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setAuth(token, user) {
  if (token) localStorage.setItem("token", token);
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    // Keep backwards compatibility with studentProfile
    localStorage.setItem("studentProfile", JSON.stringify(user));
  }
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get("content-type");
    let data = null;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMsg =
        (data && data.message) ||
        (typeof data === "string" ? data : `Request failed with status ${response.status}`);
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || "GET"} ${endpoint}]:`, error.message);
    throw error;
  }
}

export const api = {
  // Auth & Profile
  auth: {
    login: (credentials) =>
      request("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials)
      }),
    register: (userData) =>
      request("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData)
      }),
    getMe: () => request("/auth/me"),
    updateProfile: (profileData) =>
      request("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(profileData)
      }),
    updateSettings: (settings) =>
      request("/auth/settings", {
        method: "PUT",
        body: JSON.stringify(settings)
      }),
    changePassword: (passwords) =>
      request("/auth/change-password", {
        method: "PUT",
        body: JSON.stringify(passwords)
      })
  },

  // Complaints
  complaints: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/complaints${query ? `?${query}` : ""}`);
    },
    getMy: () => request("/complaints/my"),
    getById: (id) => request(`/complaints/${id}`),
    create: (complaintData) =>
      request("/complaints", {
        method: "POST",
        body: JSON.stringify(complaintData)
      }),
    update: (id, updateData) =>
      request(`/complaints/${id}`, {
        method: "PUT",
        body: JSON.stringify(updateData)
      }),
    delete: (id) =>
      request(`/complaints/${id}`, {
        method: "DELETE"
      })
  },

  // Lost & Found
  lostFound: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/lost-found${query ? `?${query}` : ""}`);
    },
    getMy: () => request("/lost-found/my"),
    getById: (id) => request(`/lost-found/${id}`),
    create: (itemData) =>
      request("/lost-found", {
        method: "POST",
        body: JSON.stringify(itemData)
      }),
    update: (id, updateData) =>
      request(`/lost-found/${id}`, {
        method: "PUT",
        body: JSON.stringify(updateData)
      }),
    updateStatus: (id, status) =>
      request(`/lost-found/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      }),
    delete: (id) =>
      request(`/lost-found/${id}`, {
        method: "DELETE"
      })
  },

  // Departments
  departments: {
    getAll: () => request("/departments"),
    create: (deptData) =>
      request("/departments", {
        method: "POST",
        body: JSON.stringify(deptData)
      }),
    update: (id, deptData) =>
      request(`/departments/${id}`, {
        method: "PUT",
        body: JSON.stringify(deptData)
      }),
    delete: (id) =>
      request(`/departments/${id}`, {
        method: "DELETE"
      })
  },

  // Announcements
  announcements: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/announcements${query ? `?${query}` : ""}`);
    },
    create: (data) =>
      request("/announcements", {
        method: "POST",
        body: JSON.stringify(data)
      }),
    update: (id, data) =>
      request(`/announcements/${id}`, {
        method: "PUT",
        body: JSON.stringify(data)
      }),
    delete: (id) =>
      request(`/announcements/${id}`, {
        method: "DELETE"
      }),
    deleteAll: () =>
      request("/announcements/all", {
        method: "DELETE"
      })
  },

  // Notifications
  notifications: {
    getAll: () => request("/notifications"),
    clear: () =>
      request("/notifications", {
        method: "DELETE"
      }),
    create: (data) =>
      request("/notifications", {
        method: "POST",
        body: JSON.stringify(data)
      })
  },

  // Students
  students: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/students${query ? `?${query}` : ""}`);
    },
    create: (data) =>
      request("/students", {
        method: "POST",
        body: JSON.stringify(data)
      }),
    update: (id, data) =>
      request(`/students/${id}`, {
        method: "PUT",
        body: JSON.stringify(data)
      }),
    delete: (id) =>
      request(`/students/${id}`, {
        method: "DELETE"
      })
  },

  // Stats / Reports
  stats: {
    getDashboard: () => request("/stats/dashboard"),
    getReports: () => request("/stats/reports")
  },

  // Health
  health: () => request("/health")
};

export default api;
