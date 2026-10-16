import { useEffect, useState } from "react";
import { api } from "../../services/api";

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    rollNumber: "",
    email: "",
    phone: "",
    department: "Computer Science & Engineering",
    year: "3rd Year",
    section: "A"
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await api.students.getAll();
      if (Array.isArray(data)) {
        setStudents(data);
      }
    } catch (error) {
      console.error("Error loading students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const openAddForm = () => {
    setEditingStudent(null);
    setForm({
      name: "",
      rollNumber: "",
      email: "",
      phone: "",
      department: "Computer Science & Engineering",
      year: "3rd Year",
      section: "A"
    });
    setShowForm(true);
  };

  const openEditForm = (student) => {
    setEditingStudent(student);
    setForm({
      name: student.name || "",
      rollNumber: student.rollNumber || student.studentId || "",
      email: student.email || "",
      phone: student.phone || "",
      department: student.department || "Computer Science & Engineering",
      year: student.year || "3rd Year",
      section: student.section || "A"
    });
    setShowForm(true);
  };

  const saveStudent = async () => {
    if (!form.name || !form.rollNumber || !form.email) {
      alert("Please enter Name, Roll Number and Email.");
      return;
    }

    try {
      setSaving(true);
      if (editingStudent) {
        const studentId = editingStudent.id || editingStudent._id;
        await api.students.update(studentId, form);
        alert("Student updated successfully!");
      } else {
        await api.students.create(form);
        alert("Student added successfully!");
      }

      await loadStudents();
      setShowForm(false);
    } catch (error) {
      alert(error.message || "Failed to save student.");
    } finally {
      setSaving(false);
    }
  };

  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) return;

    try {
      await api.students.delete(id);
      alert("Student deleted successfully!");
      setStudents((prev) => prev.filter((s) => (s.id || s._id) !== id));
    } catch (error) {
      alert(error.message || "Failed to delete student.");
    }
  };

  const filteredStudents = students.filter((student) => {
    const text = `${student.name || ""} ${student.rollNumber || ""} ${student.email || ""} ${student.department || ""}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div>

      {/* PAGE HEADER */}

      <div className="page-heading">

        <div>

          <h1>Students 👥</h1>

          <p>
            Manage registered students and their information.
          </p>

        </div>

        <button
          className="primary-button"
          onClick={openAddForm}
        >
          + Add Student
        </button>

      </div>


      {/* SEARCH */}

      <div className="student-toolbar">

        <input
          type="text"
          placeholder="🔍 Search by name, roll number, email..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <span>
          {filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""}
        </span>

      </div>


      {/* STUDENT TABLE */}

      <div className="admin-table-card">

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
            Loading students...
          </div>
        ) : filteredStudents.length === 0 ? (

          <div className="empty-state">

            <div>👥</div>

            <h2>No students found</h2>

            <p>
              Add a student to get started.
            </p>

          </div>

        ) : (

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>Student</th>

                  <th>Roll Number</th>

                  <th>Email</th>

                  <th>Department</th>

                  <th>Year</th>

                  <th>Section</th>

                  <th>Actions</th>

                </tr>

              </thead>


              <tbody>

                {filteredStudents.map((student) => {
                  const studentId = student.id || student._id;
                  return (
                    <tr key={studentId}>

                      <td>

                        <div className="student-table-name">

                          <div className="student-mini-avatar">
                            {student.name?.charAt(0)?.toUpperCase() || "S"}
                          </div>

                          <strong>
                            {student.name}
                          </strong>

                        </div>

                      </td>

                      <td>
                        {student.rollNumber || student.studentId}
                      </td>

                      <td>
                        {student.email}
                      </td>

                      <td>
                        {student.department}
                      </td>

                      <td>
                        {student.year}
                      </td>

                      <td>
                        {student.section}
                      </td>

                      <td>

                        <div className="student-actions">

                          <button
                            className="edit-button"
                            onClick={() =>
                              openEditForm(student)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-button"
                            onClick={() =>
                              deleteStudent(studentId)
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* ADD / EDIT MODAL */}

      {showForm && (

        <div className="modal-overlay">

          <div className="student-modal">

            <div className="modal-header">

              <div>

                <h2>
                  {editingStudent
                    ? "Edit Student"
                    : "Add Student"}
                </h2>

                <p>
                  Enter student information below.
                </p>

              </div>

              <button
                className="close-button"
                onClick={() =>
                  setShowForm(false)
                }
              >
                ✕
              </button>

            </div>


            <div className="student-form-grid">

              {/* NAME */}

              <div className="form-group">

                <label>
                  Full Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />

              </div>


              {/* ROLL NUMBER */}

              <div className="form-group">

                <label>
                  Roll Number *
                </label>

                <input
                  type="text"
                  name="rollNumber"
                  value={form.rollNumber}
                  onChange={handleChange}
                  placeholder="Enter roll number"
                  required
                />

              </div>


              {/* EMAIL */}

              <div className="form-group">

                <label>
                  Email *
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="student@example.com"
                  required
                />

              </div>


              {/* PHONE */}

              <div className="form-group">

                <label>
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />

              </div>


              {/* DEPARTMENT */}

              <div className="form-group">

                <label>
                  Department
                </label>

                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                >

                  <option>
                    Computer Science & Engineering
                  </option>

                  <option>
                    Electronics & Communication
                  </option>

                  <option>
                    Electrical & Electronics
                  </option>

                  <option>
                    Mechanical Engineering
                  </option>

                  <option>
                    Civil Engineering
                  </option>

                  <option>
                    Information Technology
                  </option>

                </select>

              </div>


              {/* YEAR */}

              <div className="form-group">

                <label>
                  Year
                </label>

                <select
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                >

                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>

                </select>

              </div>


              {/* SECTION */}

              <div className="form-group">

                <label>
                  Section
                </label>

                <select
                  name="section"
                  value={form.section}
                  onChange={handleChange}
                >

                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                  <option>D</option>

                </select>

              </div>

            </div>


            <div className="modal-actions">

              <button
                className="secondary-button"
                onClick={() =>
                  setShowForm(false)
                }
                disabled={saving}
              >
                Cancel
              </button>

              <button
                className="primary-button"
                onClick={saveStudent}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingStudent
                  ? "Update Student"
                  : "Add Student"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Students;