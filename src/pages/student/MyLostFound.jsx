import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

function MyLostFound() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyItems = async () => {
    try {
      setLoading(true);
      const data = await api.lostFound.getMy();
      if (Array.isArray(data)) {
        setItems(data);
      }
    } catch (error) {
      console.error("Error fetching my lost & found items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, []);

  const deleteItem = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      await api.lostFound.delete(id);
      setItems((prev) => prev.filter((item) => (item.id || item._id) !== id));
      alert("Post deleted successfully!");
    } catch (error) {
      alert(error.message || "Failed to delete post");
    }
  };

  return (
    <div>

      <div className="page-heading">

        <div>

          <h1>My Lost & Found Posts</h1>

          <p>
            Manage items you have reported.
          </p>

        </div>

      </div>


      <div className="dashboard-card">

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
            Loading your posts...
          </div>
        ) : items.length === 0 ? (

          <div className="empty-state">

            <div>📦</div>

            <h2>No posts yet</h2>

            <p>
              You haven't reported any lost or found items.
            </p>

            <Link
              to="/student/report-lost"
              className="primary-button"
            >
              Report an Item
            </Link>

          </div>

        ) : (

          <div className="my-post-list">

            {items.map((item) => {
              const itemId = item.id || item._id;
              return (
                <div
                  className="my-post-row"
                  key={itemId}
                >

                  <div className="my-post-icon">
                    {item.type === "Lost" ? "🔴" : "🟢"}
                  </div>


                  <div className="my-post-info">

                    <h3>{item.itemName}</h3>

                    <p>
                      {item.type} • {item.location}
                    </p>

                    <small>
                      Posted on {item.datePosted || item.date}
                    </small>

                  </div>


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


                  <button
                    className="delete-button"
                    onClick={() =>
                      deleteItem(itemId)
                    }
                  >
                    Delete
                  </button>

                </div>
              );
            })}

          </div>

        )}

      </div>

    </div>
  );
}

export default MyLostFound;