import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {

  const [recipes, setRecipes] = useState([]);
  const [contentItems, setContentItems] = useState([]);
  const [pantryItems, setPantryItems] = useState([]);


  useEffect(() => {

    fetch("http://localhost:3001/recipes")
      .then(response => response.json())
      .then(data => {
        setRecipes(data);
      });


    fetch("http://localhost:3001/content-items")
      .then(response => response.json())
      .then(data => {
        setContentItems(data);
      });
    fetch("http://localhost:3001/pantry-items")
      .then(response => response.json())
      .then(data => {
       setPantryItems(data);
      });

  }, []);


  // Today's date
  const today = new Date().toISOString().split("T")[0];


  // Today's cooking tasks
  const todaysCooking = contentItems.filter(item =>
    item.cook_date &&
    item.cook_date.startsWith(today)
  );


  // Today's editing tasks
  const todaysEditing = contentItems.filter(item =>
    item.edit_deadline &&
    item.edit_deadline.startsWith(today)
  );


  // Today's upload tasks
  const todaysUploads = contentItems.filter(item =>
    item.upload_date &&
    item.upload_date.startsWith(today)
  );


  // Next 7 days
  const now = new Date();

  const nextWeek = new Date();

  nextWeek.setDate(nextWeek.getDate() + 7);


  const upcomingItems = contentItems.filter(item => {

    const dates = [
      item.cook_date,
      item.edit_deadline,
      item.upload_date
    ];


    return dates.some(date => {

      if (!date) {
        return false;
      }


      const taskDate = new Date(date);


      return taskDate > now && taskDate <= nextWeek;

    });

  });

  const planningCount = contentItems.filter(
  item => item.status === "planning"
).length;

const readyToCookCount = contentItems.filter(
  item => item.status === "ready_to_cook"
).length;

const editingCount = contentItems.filter(
  item => item.status === "editing"
).length;

const readyToUploadCount = contentItems.filter(
  item => item.status === "ready_to_upload"
).length;

const publishedCount = contentItems.filter(
  item => item.status === "published"
).length;


  return (

    <div className="dashboard">


      <h1>FreshlyPlatedOS</h1>

      <p>
        Welcome back 👋
      </p>


      {/* STATS */}

      <section className="dashboard-section">

        <h2>Quick Stats</h2>


        <div className="stats-grid">


          <div className="stat-card">

            <p>Recipes</p>

            <h3>
              {recipes.length}
            </h3>

          </div>


          <div className="stat-card">

            <p>Content Items</p>

            <h3>
              {contentItems.length}
            </h3>

          </div>

          <div className="stat-card">

            <p>Pantry Items</p>

            <h3>
              {pantryItems.length}
            </h3>

          </div>


        </div>

      </section>

      <section className="dashboard-section">

  <h2>Content Progress</h2>

  <div className="progress-grid">

    <div className="progress-card">
      <p>Planning</p>
      <h3>{planningCount}</h3>
    </div>

    <div className="progress-card">
      <p>Ready to Cook</p>
      <h3>{readyToCookCount}</h3>
    </div>

    <div className="progress-card">
      <p>Editing</p>
      <h3>{editingCount}</h3>
    </div>

    <div className="progress-card">
      <p>Ready to Upload</p>
      <h3>{readyToUploadCount}</h3>
    </div>

    <div className="progress-card">
      <p>Published</p>
      <h3>{publishedCount}</h3>
    </div>

  </div>

</section>




      {/* TODAY'S TASKS */}

      <section className="dashboard-section">

        <h2>Today's Tasks</h2>


        <div className="tasks-grid">


          <div className="task-card">

            <h3>
              🍳 Cook Today
            </h3>


            {todaysCooking.length === 0 ? (

              <p>
                Nothing scheduled.
              </p>

            ) : (

              todaysCooking.map(item => (

                <div
                  key={item.id}
                  className="task-item"
                >

                  <strong>
                    {item.recipe_name}
                  </strong>


                  <p>
                    {item.platform}
                  </p>

                </div>

              ))

            )}

          </div>


          {/* EDIT TODAY */}

          <div className="task-card">

            <h3>
              🎬 Edit Today
            </h3>


            {todaysEditing.length === 0 ? (

              <p>
                Nothing scheduled.
              </p>

            ) : (

              todaysEditing.map(item => (

                <div
                  key={item.id}
                  className="task-item"
                >

                  <strong>
                    {item.recipe_name}
                  </strong>


                  <p>
                    {item.platform}
                  </p>

                </div>

              ))

            )}

          </div>

          <div className="task-card">

            <h3>
              📤 Upload Today
            </h3>


            {todaysUploads.length === 0 ? (

              <p>
                Nothing scheduled.
              </p>

            ) : (

              todaysUploads.map(item => (

                <div
                  key={item.id}
                  className="task-item"
                >

                  <strong>
                    {item.recipe_name}
                  </strong>


                  <p>
                    {item.platform}
                  </p>

                </div>

              ))

            )}

          </div>


        </div>

      </section>



      <section className="dashboard-section">

        <h2>
          Upcoming — Next 7 Days
        </h2>


        <div className="upcoming-list">


          {upcomingItems.length === 0 ? (

            <p>
              No upcoming tasks.
            </p>

          ) : (

            upcomingItems.map(item => (

              <div
                key={item.id}
                className="upcoming-card"
              >


                <div>

                  <h3>
                    {item.recipe_name}
                  </h3>


                  <p>
                    {item.platform}
                  </p>

                </div>


                <div className="upcoming-dates">


                  {item.cook_date && (

                    <p>
                      🍳 Cook:{" "}

                      {new Date(
                        item.cook_date
                      ).toLocaleDateString()}
                    </p>

                  )}


                  {item.edit_deadline && (

                    <p>
                      🎬 Edit:{" "}

                      {new Date(
                        item.edit_deadline
                      ).toLocaleDateString()}
                    </p>

                  )}


                  {item.upload_date && (

                    <p>
                      📤 Upload:{" "}

                      {new Date(
                        item.upload_date
                      ).toLocaleDateString()}
                    </p>

                  )}


                </div>


              </div>

            ))

          )}


        </div>

      </section>


    </div>

  );

}


export default Dashboard;
 