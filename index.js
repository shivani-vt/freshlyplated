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
  const { name, status } = req.body;

  const result = await pool.query(
    `
    INSERT INTO recipes (name, status)
    VALUES ($1, $2)
    RETURNING *
    `,
    [name, status]
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
  //use patch to update a recipe 
  try {

    const { id } = req.params; //finds the ID of specific recipe
    const { status } = req.body; //infromation from frontend stored in req.body

    const result = await pool.query(
      `
      UPDATE recipes
      SET status = $1
      WHERE id = $2
      RETURNING * 
      `, //RETURNING * returns the updated data back to frontend 
      [status, id]
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

// Create a shopping list from one or more recipes
app.post("/shopping-lists/from-recipes", async (req, res) => {
  try {
    const { recipe_ids } = req.body;

    if (!recipe_ids || recipe_ids.length === 0) {
      return res.status(400).json({
        error: "No recipe IDs provided"
      });
    }

    // Get ingredients from selected recipes
    const ingredientResult = await pool.query(
      `
      SELECT
        ingredient_name,
        quantity,
        unit
      FROM recipe_ingredients
      WHERE recipe_id = ANY($1::int[])
      `,
      [recipe_ids]
    );

    // Get ingredients currently in pantry
    const pantryResult = await pool.query(
      `
      SELECT
        ingredient_name,
        quantity,
        unit
      FROM pantry_items
      `
    );

    // Normalise ingredient names
    function normaliseIngredientName(name) {
      const ingredient = name.toLowerCase().trim();

      const aliases = {
        onion: "onions",
        onions: "onions",

        garlic: "garlic",
        "garlic cloves": "garlic",

        tomato: "tomatoes",
        tomatoes: "tomatoes",

        potato: "potatoes",
        potatoes: "potatoes",

        pepper: "peppers",
        peppers: "peppers"
      };

      return aliases[ingredient] || ingredient;
    }

    // Combine duplicate ingredients
    const combinedIngredients = {};

    ingredientResult.rows.forEach((ingredient) => {
      const normalisedName = normaliseIngredientName(
        ingredient.ingredient_name
      );

      const key = `${normalisedName}_${ingredient.unit}`;

      if (!combinedIngredients[key]) {
        combinedIngredients[key] = {
          ingredient_name: normalisedName,
          quantity: Number(ingredient.quantity),
          unit: ingredient.unit
        };
      } else {
        combinedIngredients[key].quantity += Number(
          ingredient.quantity
        );
      }
    });

    

    // Subtract pantry quantities
    pantryResult.rows.forEach((pantryItem) => {
      const normalisedName = normaliseIngredientName(
        pantryItem.ingredient_name
      );

      const key = `${normalisedName}_${pantryItem.unit}`;

      if (combinedIngredients[key]) {
        combinedIngredients[key].quantity -= Number(
          pantryItem.quantity
        );
      }
    });

    // Remove ingredients that are already fully covered by pantry
    const shoppingItems = Object.values(combinedIngredients)
      .filter(item => item.quantity > 0);

    // Create shopping list
    const listResult = await pool.query(
      `
      INSERT INTO shopping_lists (name, status)
      VALUES ($1, 'active')
      RETURNING *
      `,
      ["Recipe Shopping List"]
    );

    const shoppingList = listResult.rows[0];

    // Add ingredients to shopping list
    for (const item of shoppingItems) {
      await pool.query(
        `
        INSERT INTO shopping_list_items
          (shopping_list_id, ingredient_name, quantity, unit)
        VALUES ($1, $2, $3, $4)
        `,
        [
          shoppingList.id,
          item.ingredient_name,
          item.quantity,
          item.unit
        ]
      );
    }

    // Get shopping list items
    const itemsResult = await pool.query(
      `
      SELECT *
      FROM shopping_list_items
      WHERE shopping_list_id = $1
      ORDER BY ingredient_name
      `,
      [shoppingList.id]
    );

    res.json({
      shopping_list: shoppingList,
      items: itemsResult.rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create shopping list"
    });
  }
});

// Get the latest shopping list
app.get("/shopping-lists/latest", async (req, res) => {
  try {
    const listResult = await pool.query(
      `
      SELECT *
      FROM shopping_lists
      ORDER BY created_at DESC
      LIMIT 1
      `
    );

    if (listResult.rows.length === 0) {
      return res.status(404).json({
        error: "No shopping list found"
      });
    }

    const shoppingList = listResult.rows[0];

    const itemsResult = await pool.query(
      `
      SELECT *
      FROM shopping_list_items
      WHERE shopping_list_id = $1
      ORDER BY ingredient_name
      `,
      [shoppingList.id]
    );

    res.json({
      shopping_list: shoppingList,
      items: itemsResult.rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch shopping list"
    });
  }
});


// Check or uncheck a shopping list item
app.patch("/shopping-list-items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { checked } = req.body;

    const result = await pool.query(
      `
      UPDATE shopping_list_items
      SET checked = $1
      WHERE id = $2
      RETURNING *
      `,
      [checked, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Shopping list item not found"
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update shopping list item"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
