import { useEffect, useState } from "react";

function Departments() {

  const [departments, setDepartments] = useState([]);

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingDepartment, setEditingDepartment] = useState(null);

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");


  // =========================
  // LOAD DEPARTMENTS
  // =========================

  useEffect(() => {

    loadDepartments();

  }, []);


  const loadDepartments = () => {

    const saved =
      JSON.parse(localStorage.getItem("departments"));

    if (saved && saved.length > 0) {

      setDepartments(saved);

    } else {

      const defaultDepartments = [

        {
          id: 1,
          name: "Computer Science & Engineering",
          description: "Computer Science and software related complaints"
        },

        {
          id: 2,
          name: "Electronics & Communication",
          description: "Electronics and communication related complaints"
        },

        {
          id: 3,
          name: "Electrical & Electronics",
          description: "Electrical and power related complaints"
        },

        {
          id: 4,
          name: "Mechanical Engineering",
          description: "Mechanical and laboratory related complaints"
        },

        {
          id: 5,
          name: "Civil Engineering",
          description: "Civil infrastructure and building related complaints"
        },

        {
          id: 6,
          name: "Information Technology",
          description: "IT infrastructure and computer related complaints"
        },

        {
          id: 7,
          name: "Hostel",
          description: "Hostel and accommodation related complaints"
        },

        {
          id: 8,
          name: "Library",
          description: "Library related complaints"
        },

        {
          id: 9,
          name: "Transport",
          description: "College transport related complaints"
        },

        {
          id: 10,
          name: "Administration",
          description: "General administration related complaints"
        }

      ];


      localStorage.setItem(
        "departments",
        JSON.stringify(defaultDepartments)
      );

      setDepartments(defaultDepartments);

    }

  };


  // =========================
  // OPEN ADD FORM
  // =========================

  const openAddForm = () => {

    setEditingDepartment(null);

    setName("");

    setDescription("");

    setShowForm(true);

  };


  // =========================
  // OPEN EDIT FORM
  // =========================

  const openEditForm = (department) => {

    setEditingDepartment(department);

    setName(department.name);

    setDescription(
      department.description || ""
    );

    setShowForm(true);

  };


  // =========================
  // SAVE DEPARTMENT
  // =========================

  const saveDepartment = () => {

    if (!name.trim()) {

      alert("Please enter department name.");

      return;

    }


    const saved =
      JSON.parse(localStorage.getItem("departments")) || [];


    if (editingDepartment) {

      const updated = saved.map(
        (department) => {

          if (
            department.id ===
            editingDepartment.id
          ) {

            return {

              ...department,

              name: name.trim(),

              description:
                description.trim()

            };

          }

          return department;

        }
      );


      localStorage.setItem(
        "departments",
        JSON.stringify(updated)
      );

      setDepartments(updated);

      alert(
        "Department updated successfully!"
      );

    } else {

      // Check duplicate

      const exists = saved.some(
        (department) =>
          department.name.toLowerCase() ===
          name.trim().toLowerCase()
      );


      if (exists) {

        alert(
          "This department already exists."
        );

        return;

      }


      const newDepartment = {

        id: Date.now(),

        name: name.trim(),

        description:
          description.trim()

      };


      const updated = [
        ...saved,
        newDepartment
      ];


      localStorage.setItem(
        "departments",
        JSON.stringify(updated)
      );

      setDepartments(updated);

      alert(
        "Department added successfully!"
      );

    }


    setShowForm(false);

  };


  // =========================
  // DELETE DEPARTMENT
  // =========================

  const deleteDepartment = (id) => {

    const department =
      departments.find(
        (item) => item.id === id
      );


    const complaints =
      JSON.parse(
        localStorage.getItem("complaints")
      ) || [];


    const complaintCount =
      complaints.filter(
        (complaint) =>
          complaint.department ===
          department.name
      ).length;


    if (complaintCount > 0) {

      alert(
        `This department has ${complaintCount} complaint(s). Reassign the complaints before deleting the department.`
      );

      return;

    }


    const confirmDelete =
      window.confirm(
        `Delete ${department.name}?`
      );


    if (!confirmDelete) {

      return;

    }


    const updated =
      departments.filter(
        (item) => item.id !== id
      );


    localStorage.setItem(
      "departments",
      JSON.stringify(updated)
    );


    setDepartments(updated);

    alert(
      "Department deleted successfully!"
    );

  };


  // =========================
  // SEARCH
  // =========================

  const filteredDepartments =
    departments.filter(
      (department) => {

        const text =
          `${department.name}
           ${department.description}`
            .toLowerCase();

        return text.includes(
          search.toLowerCase()
        );

      }
    );


  // =========================
  // COMPLAINT COUNT
  // =========================

  const getComplaintCount = (
    departmentName
  ) => {

    const complaints =
      JSON.parse(
        localStorage.getItem("complaints")
      ) || [];


    return complaints.filter(
      (complaint) =>
        complaint.department ===
        departmentName
    ).length;

  };


  return (

    <div>


      {/* PAGE HEADER */}

      <div className="page-heading">

        <div>

          <h1>
            Departments 🏢
          </h1>

          <p>
            Manage campus departments and complaint assignments.
          </p>

        </div>


        <button
          className="primary-button"
          onClick={openAddForm}
        >
          + Add Department
        </button>

      </div>


      {/* SEARCH */}

      <div className="department-toolbar">

        <input
          type="text"
          placeholder="🔍 Search departments..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <span>
          {filteredDepartments.length} departments
        </span>

      </div>


      {/* DEPARTMENT GRID */}

      {filteredDepartments.length === 0 ? (

        <div className="empty-state">

          <div>🏢</div>

          <h2>
            No departments found
          </h2>

          <p>
            Add a department to get started.
          </p>

        </div>

      ) : (

        <div className="department-grid">

          {filteredDepartments.map(
            (department) => (

              <div
                className="department-card"
                key={department.id}
              >


                <div className="department-card-top">

                  <div className="department-icon">
                    🏢
                  </div>


                  <div className="department-actions">

                    <button
                      className="edit-button"
                      onClick={() =>
                        openEditForm(
                          department
                        )
                      }
                    >
                      Edit
                    </button>


                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteDepartment(
                          department.id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>


                <h2>
                  {department.name}
                </h2>


                <p>
                  {department.description ||
                    "No description available."}
                </p>


                <div className="department-footer">

                  <span>
                    📋 Complaints
                  </span>

                  <strong>
                    {getComplaintCount(
                      department.name
                    )}
                  </strong>

                </div>


              </div>

            )
          )}

        </div>

      )}


      {/* ADD / EDIT MODAL */}

      {showForm && (

        <div className="modal-overlay">

          <div className="department-modal">


            <div className="modal-header">

              <div>

                <h2>

                  {editingDepartment
                    ? "Edit Department"
                    : "Add Department"}

                </h2>

                <p>
                  Enter department information.
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


            {/* DEPARTMENT NAME */}

            <div className="form-group">

              <label>
                Department Name *
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter department name"
              />

            </div>


            {/* DESCRIPTION */}

            <div className="form-group">

              <label>
                Description
              </label>

              <textarea
                rows="4"
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                placeholder="Enter department description"
              />

            </div>


            {/* BUTTONS */}

            <div className="modal-actions">

              <button
                className="secondary-button"
                onClick={() =>
                  setShowForm(false)
                }
              >
                Cancel
              </button>


              <button
                className="primary-button"
                onClick={saveDepartment}
              >
                {editingDepartment
                  ? "Update Department"
                  : "Add Department"}
              </button>

            </div>


          </div>

        </div>

      )}

    </div>

  );

}

export default Departments;