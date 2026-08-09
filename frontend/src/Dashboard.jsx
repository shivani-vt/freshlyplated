import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {

  const [recipes, setRecipes] = useState([]);
  const [contentItems, setContentItems] = useState([]);


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
 