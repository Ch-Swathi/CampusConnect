import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

function LostFound() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      try {
        setLoading(true);
        const data = await api.lostFound.getAll();
        if (Array.isArray(data)) {
          setItems(data);
        }
      } catch (error) {
        console.error("Error fetching lost and found items:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  const filteredItems = items.filter((item) => {
    const itemName = item.itemName || "";
    const location = item.location || "";
    const description = item.description || "";

    const matchesSearch =
      itemName.toLowerCase().includes(search.toLowerCase()) ||
      location.toLowerCase().includes(search.toLowerCase()) ||
      description.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || item.type === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div>

      <div className="page-heading">

        <div>
          <h1>Lost & Found 🔎</h1>

          <p>
            Find lost items or report items found on campus.
          </p>
        </div>

        <div className="lost-found-actions">

          <Link
            to="/student/report-lost"
            className="primary-button"
          >
            + Report Lost
          </Link>

          <Link
            to="/student/report-found"
            className="secondary-button"
          >
            + Report Found
          </Link>

        </div>

      </div>


      {/* Search and Filter */}

      <div className="lost-found-toolbar">

        <div className="search-box">

          🔍

          <input
            type="text"
            placeholder="Search item or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>


        <select
          className="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Items</option>
          <option value="Lost">Lost Items</option>
          <option value="Found">Found Items</option>
        </select>

      </div>


      {/* Items */}

      {loading ? (
        <div className="dashboard-card" style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
          Loading lost & found items...
        </div>
      ) : filteredItems.length === 0 ? (

        <div className="dashboard-card empty-state">

          <div>🔎</div>

          <h2>No items found</h2>

          <p>
            There are no lost or found items matching your search.
          </p>

        </div>

      ) : (

        <div className="lost-found-grid">

          {filteredItems.map((item) => (

            <div
              className="lost-found-card"
              key={item.id || item._id}
            >

              <div className="item-image">

                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.itemName}
                  />
                ) : (
                  <span>📦</span>
                )}

              </div>


              <div className="item-content">

                <div className="item-top">

                  <span
                    className={
                      item.type === "Lost"
                        ? "item-badge lost"
                        : "item-badge found"
                    }
                  >
                    {item.type}
                  </span>

                  <span className="item-status">
                    {item.status}
                  </span>

                </div>


                <h2>{item.itemName}</h2>

                <p className="item-description">
                  {item.description}
                </p>


                <div className="item-info">

                  <p>
                    📍 {item.location}
                  </p>

                  <p>
                    📅 {item.date}
                  </p>

                </div>


                <div className="item-footer">

                  <span>
                    Posted by {item.student}
                  </span>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default LostFound;