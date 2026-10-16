import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, getStoredUser } from "../../services/api";

function SubmitComplaint() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const [form, setForm] = useState({
    title: "",
    category: "",
    department: "",
    location: "",
    priority: "Medium",
    description: ""
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadDepts() {
      try {
        const data = await api.departments.getAll();
        if (Array.isArray(data) && data.length > 0) {
          setDepartments(data);
        }
      } catch (err) {
        console.warn("Could not load departments from API, using defaults:", err.message);
      }
    }
    loadDepts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.complaints.create({
        ...form,
        student: user?.name || "Swathi"
      });

      alert("Complaint submitted successfully!");
      navigate("/student/complaints");
    } catch (error) {
      alert(error.message || "Failed to submit complaint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const defaultDepartmentList = [
    "CSE",
    "ECE",
    "EEE",
    "Mechanical",
    "Civil",
    "Maintenance",
    "IT",
    "Hostel"
  ];

  return (
    <div>

      <div className="page-heading">
        <div>
          <h1>Submit Complaint</h1>
          <p>Report a problem on campus</p>
        </div>
      </div>

      <div className="form-card">

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-group">
              <label>Complaint Title</label>

              <input
                type="text"
                name="title"
                placeholder="Example: Broken classroom fan"
                value={form.title}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>


            <div className="form-group">
              <label>Category</label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select Category</option>
                <option>Infrastructure</option>
                <option>WiFi</option>
                <option>Electrical</option>
                <option>Cleanliness</option>
                <option>Hostel</option>
                <option>Academic</option>
                <option>Transport</option>
                <option>Other</option>
              </select>
            </div>


            <div className="form-group">
              <label>Department</label>

              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select Department</option>
                {departments.length > 0
                  ? departments.map((d) => (
                      <option key={d.id || d._id} value={d.name}>
                        {d.name}
                      </option>
                    ))
                  : defaultDepartmentList.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
              </select>
            </div>


            <div className="form-group">
              <label>Location</label>

              <input
                type="text"
                name="location"
                placeholder="Example: Block A - Room 204"
                value={form.location}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>


            <div className="form-group">
              <label>Priority</label>

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                disabled={loading}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

          </div>


          <div className="form-group">

            <label>Description</label>

            <textarea
              name="description"
              rows="6"
              placeholder="Describe the problem in detail..."
              value={form.description}
              onChange={handleChange}
              required
              disabled={loading}
            />

          </div>


          <div className="form-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/student/dashboard")}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default SubmitComplaint;