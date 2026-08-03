const express = require("express");
const cors = require("cors");
require("dotenv").config(); //calls data from the .env fileokay


const pool = require("./database/db");
//gets information from database 

const app = express();
//gets information from the frontend 

app.use(cors());
app.use(express.json());
//takes incoming JSON and converts it into a JavaScript object.

const PORT = 3001;

app.get("/", (req, res) => {
    // When someone makes a GET request to /, run this function. eg http://localhost:3001/ req = request, res = response 
  res.json({
    message: "FreshlyPlated backend is running",
  });
});

//get data from recipes table 
app.get("/recipes", async (req, res) => {
    try {
        //code might fail
        const result = await pool.query(
            "SELECT * FROM recipes"
        //await means run database query, wait for PostgreSQL to respond then continue
        //query means run this SQL command 
    // SELECT -> gets data 
    //FROM recipes-> recipes table 
    );
    res.json(result.rows);
} catch (error) {
//presents error if the code fails. Try and catch work together 
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch recipes"
    });

  }
});

//creates a new recipe 
app.post("/recipes", async (req, res) => {
    try {
//information from frontend is stored in req.body
  const { name, status, prep_time_minutes, cook_time_minutes } = req.body;

  const result = await pool.query(
    `
    INSERT INTO recipes (name, status, prep_time_minutes, cook_time_minutes)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [name, status, prep_time_minutes, cook_time_minutes]
  );

  res.json(result.rows[0]);
} catch (error) {
console.error(error);

res.status(500).json({
    error: "Failed to create recipe"
});

}
});
//to retrieve a recipe with a specific ID 
app.get("/recipes/:id", async (req, res) => {
  try {

    const { id } = req.params; //the data with the ID is stored in req.params

    const result = await pool.query(
      `
      SELECT * FROM recipes
      WHERE id = $1 
      `,
      [id]
      //Find where the id meets the placeholder value ($1) in URL from req.params
    );

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to fetch recipe"
    });

  }
});

//updating status of recipe and sending back to frontend 
app.patch("/recipes/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const {
      name,
      status,
      prep_time_minutes,
      cook_time_minutes
    } = req.body;


    const result = await pool.query(
      `
      UPDATE recipes
      SET 
        name = $1,
        status = $2,
        prep_time_minutes = $3,
        cook_time_minutes = $4
      WHERE id = $5
      RETURNING *
      `,
      [
        name,
        status,
        prep_time_minutes,
        cook_time_minutes,
        id
      ]
    );


    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Recipe not found"
      });
    }


    res.json(result.rows[0]);


  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to update recipe"
    });

  }

});

//to delete a recipe 
app.delete("/recipes/:id", async (req, res) => {
  try {
    // Get the recipe ID from the URL
    const { id } = req.params;

    // Delete the recipe from the database
    const result = await pool.query(
      `
      DELETE FROM recipes
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    // If no recipe was found with that ID
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Recipe not found"
      });
    }

    // Send the deleted recipe back to the frontend
    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete recipe"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
