import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, getStoredUser } from "../../services/api";

function ReportFound() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const [form, setForm] = useState({
    itemName: "",
    category: "",
    location: "",
    date: "",
    description: "",
    contact: ""
  });

  const [loading, setLoading] = useState(false);

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
      await api.lostFound.create({
        ...form,
        type: "Found",
        student: user?.name || "Swathi"
      });

      alert("Found item reported successfully!");
      navigate("/student/lost-found");
    } catch (error) {
      alert(error.message || "Failed to report found item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <div className="page-heading">

        <div>

          <h1>Report Found Item</h1>

          <p>
            Help someone find their lost belongings.
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
                placeholder="Example: Blue Water Bottle"
                value={form.itemName}
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

              <label>Found Location</label>

              <input
                type="text"
                name="location"
                placeholder="Example: Canteen"
                value={form.location}
                onChange={handleChange}
                required
                disabled={loading}
              />

            </div>


            <div className="form-group">

              <label>Date Found</label>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                disabled={loading}
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
                disabled={loading}
              />

            </div>

          </div>


          <div className="form-group">

            <label>Description</label>

            <textarea
              name="description"
              rows="6"
              placeholder="Describe the found item..."
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
              onClick={() =>
                navigate("/student/lost-found")
              }
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Report Found Item"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default ReportFound;