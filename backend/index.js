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
  const { name, status, prep_time_minutes, cook_time_minutes, image_url } = req.body;

  const result = await pool.query(
    `
    INSERT INTO recipes (name, status, prep_time_minutes, cook_time_minutes, image_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [name, status, prep_time_minutes, cook_time_minutes, image_url]
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
      cook_time_minutes,
      tags,
      original_recipe_link,
      original_recipe_text,
      adjusted_recipe_text,
      image_url,
      ingredients,
      method
    } = req.body;


    const result = await pool.query(
      `
      UPDATE recipes
      SET 
        name = $1,
        status = $2,
        prep_time_minutes = $3,
        cook_time_minutes = $4,
        tags = $5,
        original_recipe_link = $6,
        original_recipe_text = $7,
        adjusted_recipe_text = $8,
        image_url = $9,
        ingredients =$10,
        method = $11
        WHERE id = $12
        RETURNING *
      `,
      [
        name,
        status,
        prep_time_minutes,
        cook_time_minutes,
        tags,
        original_recipe_link,
        original_recipe_text,
        adjusted_recipe_text,
        image_url,
        ingredients,
        method,
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

// Create a new content item
app.post("/content-items", async (req, res) => {
  try {

    const {
      recipe_id,
      status,
      platform,
      cook_date,
      edit_deadline,
      upload_date,
      hook,
      caption,
      hashtags,
      views,
      likes
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO content_items (
        recipe_id,
        status,
        platform,
        cook_date,
        edit_deadline,
        upload_date,
        hook,
        caption,
        hashtags,
        views,
        likes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
      `,
      [
        recipe_id,
        status,
        platform,
        cook_date,
        edit_deadline,
        upload_date,
        hook,
        caption,
        hashtags,
        views || 0,
        likes || 0
      ]
    );

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to create content item"
    });

  }
});
// Get all content items
app.get("/content-items", async (req, res) => {
  try {

    const result = await pool.query(
      `
      SELECT
        content_items.*,
        recipes.name AS recipe_name
      FROM content_items
      JOIN recipes
        ON content_items.recipe_id = recipes.id
      ORDER BY content_items.created_at DESC
      `
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to fetch content items"
    });

  }
});
app.get("/content-items/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM content_items
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Content item not found"
      });
    }

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to fetch content item"
    });

  }
});

app.patch("/content-items/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      recipe_id,
      status,
      platform,
      cook_date,
      edit_deadline,
      upload_date,
      hook,
      caption,
      hashtags
    } = req.body;

    const result = await pool.query(
      `
      UPDATE content_items
      SET
        recipe_id = $1,
        status = $2,
        platform = $3,
        cook_date = $4,
        edit_deadline = $5,
        upload_date = $6,
        hook = $7,
        caption = $8,
        hashtags = $9,
        updated_at = NOW()
      WHERE id = $10
      RETURNING *
      `,
      [
        recipe_id,
        status,
        platform,
        cook_date,
        edit_deadline,
        upload_date,
        hook,
        caption,
        hashtags,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Content item not found"
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update content item"
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

    // Get all ingredients for the selected recipes
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

    // Get everything currently in the pantry
    const pantryResult = await pool.query(
      `
      SELECT
        ingredient_name,
        quantity,
        unit
      FROM pantry_items
      `
    );

    // Combine duplicate ingredients from multiple recipes
    const combinedIngredients = {};

    ingredientResult.rows.forEach((ingredient) => {
      const key = `${ingredient.ingredient_name.toLowerCase()}_${ingredient.unit}`;

      if (!combinedIngredients[key]) {
        combinedIngredients[key] = {
          ingredient_name: ingredient.ingredient_name,
          quantity: Number(ingredient.quantity),
          unit: ingredient.unit
        };
      } else {
        combinedIngredients[key].quantity += Number(ingredient.quantity);
      }
    });

    // Subtract pantry quantities
    pantryResult.rows.forEach((pantryItem) => {
      const key = `${pantryItem.ingredient_name.toLowerCase()}_${pantryItem.unit}`;

      if (combinedIngredients[key]) {
        combinedIngredients[key].quantity -= Number(pantryItem.quantity);
      }
    });

    // Only keep ingredients that are actually needed
    const shoppingItems = Object.values(combinedIngredients)
      .filter(item => item.quantity > 0);

    // Create the shopping list
    const listResult = await pool.query(
      `
      INSERT INTO shopping_lists (name, status)
      VALUES ($1, 'active')
      RETURNING *
      `,
      ["Recipe Shopping List"]
    );

    const shoppingList = listResult.rows[0];

    // Add each required ingredient to the shopping list
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

    // Get the shopping list items
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
        error: "No shopping lists found"
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

// Update whether a shopping list item has been checked
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
// Get all pantry items
app.get("/pantry-items", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM pantry_items
      ORDER BY ingredient_name
      `
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch pantry items"
    });
  }
});


// Add a new pantry item
app.post("/pantry-items", async (req, res) => {
  try {
    const {
      ingredient_name,
      quantity,
      unit
    } = req.body;

    if (!ingredient_name || !quantity || !unit) {
      return res.status(400).json({
        error: "Ingredient name, quantity and unit are required"
      });
    }

    const result = await pool.query(
      `
      INSERT INTO pantry_items
        (ingredient_name, quantity, unit)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [
        ingredient_name,
        quantity,
        unit
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to add pantry item"
    });
  }
});

// Update a pantry item
app.patch("/pantry-items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { ingredient_name, quantity, unit } = req.body;

    const result = await pool.query(
      `
      UPDATE pantry_items
      SET ingredient_name = $1,
          quantity = $2,
          unit = $3
      WHERE id = $4
      RETURNING *
      `,
      [ingredient_name, quantity, unit, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Pantry item not found"
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update pantry item"
    });
  }
});


// Delete a pantry item
app.delete("/pantry-items/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM pantry_items
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Pantry item not found"
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete pantry item"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
