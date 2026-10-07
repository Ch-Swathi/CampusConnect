import { useEffect, useState } from "react";

function LostFoundManagement() {

  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedPost, setSelectedPost] = useState(null);


  useEffect(() => {
    loadPosts();
  }, []);


  const loadPosts = () => {

    const saved =
      JSON.parse(
        localStorage.getItem("lostFoundItems")
      ) || [];

    setPosts(saved);

  };


  const updateStatus = (id, status) => {

    const updated = posts.map((post) => {

      if (post.id === id) {

        return {
          ...post,
          status: status
        };

      }

      return post;

    });


    localStorage.setItem(
      "lostFoundItems",
      JSON.stringify(updated)
    );

    setPosts(updated);

    setSelectedPost(null);

    alert(
      `Post marked as ${status}.`
    );

  };


  const deletePost = (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this post?"
      );

    if (!confirmDelete) {
      return;
    }


    const updated =
      posts.filter(
        (post) => post.id !== id
      );


    localStorage.setItem(
      "lostFoundItems",
      JSON.stringify(updated)
    );

    setPosts(updated);

    setSelectedPost(null);

    alert(
      "Post deleted successfully!"
    );

  };


  const filteredPosts =
    posts.filter((post) => {

      const text =
        `${post.itemName || ""}
         ${post.description || ""}
         ${post.location || ""}
         ${post.student || ""}`
          .toLowerCase();


      const matchesSearch =
        text.includes(
          search.toLowerCase()
        );


      const matchesFilter =
        filter === "All" ||
        post.type === filter;


      return (
        matchesSearch &&
        matchesFilter
      );

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


      {filteredPosts.length === 0 ? (

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

          {filteredPosts.map((post) => (

            <div
              className="lost-found-admin-card"
              key={post.id}
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
                    deletePost(post.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

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


              {selectedPost.status !==
                "Resolved" && (

                <button
                  className="primary-button"
                  onClick={() =>
                    updateStatus(
                      selectedPost.id,
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