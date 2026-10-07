import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SubmitComplaint() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "",
    department: "",
    location: "",
    priority: "Medium",
    description: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const oldComplaints =
      JSON.parse(localStorage.getItem("complaints")) || [];

    const newComplaint = {
      id: Date.now(),
      ...form,
      student: "Swathi",
      status: "Pending",
      date: new Date().toLocaleDateString()
    };

    const updatedComplaints = [
      newComplaint,
      ...oldComplaints
    ];

    localStorage.setItem(
      "complaints",
      JSON.stringify(updatedComplaints)
    );

    alert("Complaint submitted successfully!");

    navigate("/student/complaints");
  };

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
              />
            </div>


            <div className="form-group">
              <label>Category</label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
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
              >
                <option value="">Select Department</option>
                <option>CSE</option>
                <option>ECE</option>
                <option>EEE</option>
                <option>Mechanical</option>
                <option>Civil</option>
                <option>Maintenance</option>
                <option>IT</option>
                <option>Hostel</option>
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
              />
            </div>


            <div className="form-group">
              <label>Priority</label>

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
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
            />

          </div>


          <div className="form-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/student/dashboard")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
            >
              Submit Complaint
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default SubmitComplaint;