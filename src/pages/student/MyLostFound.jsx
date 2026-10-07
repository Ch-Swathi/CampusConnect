import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MyLostFound() {

  const [items, setItems] = useState([]);

  useEffect(() => {

    const saved =
      JSON.parse(localStorage.getItem("lostFoundItems")) || [];

    setItems(
      saved.filter(
        (item) => item.student === "Swathi"
      )
    );

  }, []);


  const deleteItem = (id) => {

    const allItems =
      JSON.parse(localStorage.getItem("lostFoundItems")) || [];

    const updated =
      allItems.filter(
        (item) => item.id !== id
      );

    localStorage.setItem(
      "lostFoundItems",
      JSON.stringify(updated)
    );

    setItems(
      updated.filter(
        (item) => item.student === "Swathi"
      )
    );

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

        {items.length === 0 ? (

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

            {items.map((item) => (

              <div
                className="my-post-row"
                key={item.id}
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
                    Posted on {item.datePosted}
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
                    deleteItem(item.id)
                  }
                >
                  Delete
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default MyLostFound;