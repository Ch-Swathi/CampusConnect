import { useEffect, useState } from "react";
import { api } from "../../services/api";

function LostFoundManagement() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await api.lostFound.getAll();
      if (Array.isArray(data)) {
        setPosts(data);
      }
    } catch (error) {
      console.error("Error loading lost and found posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.lostFound.updateStatus(id, status);
      setPosts((prev) =>
        prev.map((post) =>
          (post.id || post._id) === id ? { ...post, status } : post
        )
      );
      setSelectedPost(null);
      alert(`Post marked as ${status}.`);
    } catch (error) {
      alert(error.message || "Failed to update status");
    }
  };

  const deletePost = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      await api.lostFound.delete(id);
      setPosts((prev) => prev.filter((post) => (post.id || post._id) !== id));
      setSelectedPost(null);
      alert("Post deleted successfully!");
    } catch (error) {
      alert(error.message || "Failed to delete post");
    }
  };

  const filteredPosts = posts.filter((post) => {
    const text = `${post.itemName || ""} ${post.description || ""} ${post.location || ""} ${post.student || ""}`.toLowerCase();
    const matchesSearch = text.includes(search.toLowerCase());
    const matchesFilter = filter === "All" || post.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>

      <div className="page-heading">

        <div>

          <h1>
            Lost & Found Management 🔎
          </h1>

          <p>
            Manage student lost and found item reports.
          </p>

        </div>

      </div>


      <div className="admin-toolbar">

        <input
          type="text"
          placeholder="🔍 Search items..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />


        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
        >

          <option value="All">
            All Posts
          </option>

          <option value="Lost">
            Lost Items
          </option>

          <option value="Found">
            Found Items
          </option>

        </select>


        <span>
          {filteredPosts.length} posts
        </span>

      </div>


      {loading ? (
        <div className="dashboard-card" style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
          Loading lost & found reports...
        </div>
      ) : filteredPosts.length === 0 ? (

        <div className="empty-state">

          <div>🔎</div>

          <h2>
            No Lost & Found Posts
          </h2>

          <p>
            There are no matching lost or found posts.
          </p>

        </div>

      ) : (

        <div className="lost-found-admin-grid">

          {filteredPosts.map((post) => {
            const postId = post.id || post._id;
            return (
              <div
                className="lost-found-admin-card"
                key={postId}
              >

                <div className="lost-found-card-top">

                  <span
                    className={
                      post.type === "Lost"
                        ? "lost-badge"
                        : "found-badge"
                    }
                  >
                    {post.type}
                  </span>

                  <span
                    className={
                      post.status === "Resolved"
                        ? "status-resolved"
                        : "status-pending"
                    }
                  >
                    {post.status || "Pending"}
                  </span>

                </div>

                <h2>
                  {post.itemName}
                </h2>

                <p>
                  {post.description}
                </p>

                <div className="lost-found-info">

                  <div>
                    📍 <strong>Location:</strong>{" "}
                    {post.location || "Not provided"}
                  </div>

                  <div>
                    👤 <strong>Student:</strong>{" "}
                    {post.student || "Unknown"}
                  </div>

                  <div>
                    📅 <strong>Date:</strong>{" "}
                    {post.date || "Not provided"}
                  </div>

                </div>

                <div className="lost-found-card-actions">

                  <button
                    className="manage-button"
                    onClick={() =>
                      setSelectedPost(post)
                    }
                  >
                    View Details
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      deletePost(postId)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>
            );
          })}

        </div>

      )}


      {selectedPost && (

        <div className="modal-overlay">

          <div className="management-modal">

            <div className="modal-header">

              <div>

                <h2>
                  {selectedPost.itemName}
                </h2>

                <p>
                  {selectedPost.type} Item
                </p>

              </div>

              <button
                className="close-button"
                onClick={() =>
                  setSelectedPost(null)
                }
              >
                ✕
              </button>

            </div>


            <div className="complaint-preview">

              <h3>
                Description
              </h3>

              <p>
                {selectedPost.description ||
                  "No description available."}
              </p>

            </div>


            <div className="lost-found-modal-info">

              <p>
                <strong>Type:</strong>{" "}
                {selectedPost.type}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {selectedPost.location ||
                  "Not provided"}
              </p>

              <p>
                <strong>Student:</strong>{" "}
                {selectedPost.student ||
                  "Unknown"}
              </p>

              <p>
                <strong>Contact:</strong>{" "}
                {selectedPost.contact ||
                  "Not provided"}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {selectedPost.date ||
                  "Not provided"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {selectedPost.status ||
                  "Pending"}
              </p>

            </div>


            <div className="modal-actions">

              <button
                className="secondary-button"
                onClick={() =>
                  setSelectedPost(null)
                }
              >
                Close
              </button>

              {selectedPost.status !== "Resolved" && (
                <button
                  className="primary-button"
                  onClick={() =>
                    updateStatus(
                      selectedPost.id || selectedPost._id,
                      "Resolved"
                    )
                  }
                >
                  Mark as Resolved
                </button>
              )}

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default LostFoundManagement;