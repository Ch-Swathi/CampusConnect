import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ReportLost() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    itemName: "",
    category: "",
    location: "",
    date: "",
    description: "",
    contact: ""
  });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };


  const handleSubmit = (e) => {

    e.preventDefault();

    const oldItems =
      JSON.parse(localStorage.getItem("lostFoundItems")) || [];

    const newItem = {

      id: Date.now(),

      type: "Lost",

      ...form,

      student: "Swathi",

      status: "Active",

      datePosted: new Date().toLocaleDateString()

    };


    localStorage.setItem(
      "lostFoundItems",
      JSON.stringify([
        newItem,
        ...oldItems
      ])
    );


    alert("Lost item reported successfully!");

    navigate("/student/lost-found");

  };


  return (
    <div>

      <div className="page-heading">

        <div>

          <h1>Report Lost Item</h1>

          <p>
            Tell the campus community about your lost item.
          </p>

        </div>

      </div>


      <div className="form-card">

        <form onSubmit={handleSubmit}>

          <div className="form-grid">


            <div className="form-group">

              <label>Item Name</label>

              <input
                type="text"
                name="itemName"
                placeholder="Example: Black Wallet"
                value={form.itemName}
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

                <option value="">
                  Select Category
                </option>

                <option>Electronics</option>
                <option>Books</option>
                <option>Documents</option>
                <option>Accessories</option>
                <option>Clothing</option>
                <option>Keys</option>
                <option>Wallet</option>
                <option>Other</option>

              </select>

            </div>


            <div className="form-group">

              <label>Last Seen Location</label>

              <input
                type="text"
                name="location"
                placeholder="Example: Library"
                value={form.location}
                onChange={handleChange}
                required
              />

            </div>


            <div className="form-group">

              <label>Date Lost</label>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />

            </div>


            <div className="form-group">

              <label>Contact Information</label>

              <input
                type="text"
                name="contact"
                placeholder="Email or phone number"
                value={form.contact}
                onChange={handleChange}
                required
              />

            </div>

          </div>


          <div className="form-group">

            <label>Description</label>

            <textarea
              name="description"
              rows="6"
              placeholder="Describe the item..."
              value={form.description}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                navigate("/student/lost-found")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
            >
              Report Lost Item
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default ReportLost;