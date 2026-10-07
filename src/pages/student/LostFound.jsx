import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function LostFound() {

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const savedItems =
      JSON.parse(localStorage.getItem("lostFoundItems")) || [];

    setItems(savedItems);
  }, []);

  const filteredItems = items.filter((item) => {

    const matchesSearch =
      item.itemName.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());

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

      {filteredItems.length === 0 ? (

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
              key={item.id}
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