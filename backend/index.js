const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./database/db");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3001;

app.get("/", (req, res) => {
  res.json({
    message: "FreshlyPlated backend is running",
  });
});

// GET all recipes
app.get("/recipes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM recipes ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

// POST new recipe
app.post("/recipes", async (req, res) => {
  try {
    const {
      name,
      status,
      prep_time_minutes,
      cook_time_minutes,
      image_url,
      tags,
      original_recipe_link,
      original_recipe_text,
      adjusted_recipe_text,
      ingredients,
      method,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO recipes (
        name,
        status,
        prep_time_minutes,
        cook_time_minutes,
        image_url,
        tags,
        original_recipe_link,
        original_recipe_text,
        adjusted_recipe_text,
        ingredients,
        method
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
      `,
      [
        name,
        status || "planning",
        prep_time_minutes || 0,
        cook_time_minutes || 0,
        image_url,
        tags,
        original_recipe_link,
        original_recipe_text,
        adjusted_recipe_text,
        ingredients,
        method,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to create recipe:", error);
    res.status(500).json({ error: "Failed to create recipe" });
  }
});

// GET single recipe
app.get("/recipes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM recipes WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});

// PATCH recipe
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
      method,
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
        ingredients = $10,
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
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update recipe" });
  }
});

// DELETE recipe
app.delete("/recipes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM recipes WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete recipe" });
  }
});

// POST Shopping list from recipes
app.post("/shopping-lists/from-recipes", async (req, res) => {
  try {
    const { recipe_ids } = req.body;

    if (!recipe_ids || recipe_ids.length === 0) {
      return res.status(400).json({ error: "No recipe IDs provided" });
    }

    // 1. Fetch recipes to get text ingredients
    const recipesResult = await pool.query(
      "SELECT id, name, ingredients FROM recipes WHERE id = ANY($1::int[])",
      [recipe_ids]
    );

    // 2. Fetch structured ingredients if table exists
    let structuredIngredients = [];
    try {
      const ingResult = await pool.query(
        "SELECT ingredient_name, quantity, unit FROM recipe_ingredients WHERE recipe_id = ANY($1::int[])",
        [recipe_ids]
      );
      structuredIngredients = ingResult.rows;
    } catch {
      // Table doesn't exist; continue with recipes.ingredients text
    }

    // 3. Create the active shopping list record
    const listResult = await pool.query(
      `
      INSERT INTO shopping_lists (name, status)
      VALUES ($1, 'active')
      RETURNING *
      `,
      [`Recipe Shopping List (${recipesResult.rows.length} recipes)`]
    );

    const shoppingList = listResult.rows[0];
    const itemsToInsert = [];

    // Parse structured ingredients
    structuredIngredients.forEach((item) => {
      itemsToInsert.push({
        name: item.ingredient_name,
        quantity: item.quantity || null,
        unit: item.unit || "",
      });
    });

    // Parse text-based ingredients from recipe cards
    recipesResult.rows.forEach((recipe) => {
      if (!recipe.ingredients) return;
      const lines = recipe.ingredients.split("\n").map((l) => l.trim()).filter(Boolean);
      lines.forEach((line) => {
        itemsToInsert.push({
          name: line,
          quantity: null,
          unit: null,
        });
      });
    });

    // 4. Insert all items into shopping_list_items
    for (const item of itemsToInsert) {
      await pool.query(
        `
        INSERT INTO shopping_list_items (shopping_list_id, ingredient_name, quantity, unit, checked)
        VALUES ($1, $2, $3, $4, false)
        `,
        [shoppingList.id, item.name, item.quantity, item.unit]
      );
    }

    const itemsResult = await pool.query(
      "SELECT * FROM shopping_list_items WHERE shopping_list_id = $1 ORDER BY id ASC",
      [shoppingList.id]
    );

    res.json({
      shopping_list: shoppingList,
      items: itemsResult.rows,
    });
  } catch (error) {
    console.error("Failed to create shopping list:", error);
    res.status(500).json({ error: "Failed to create shopping list" });
  }
});

// GET Latest shopping list
app.get("/shopping-lists/latest", async (req, res) => {
  try {
    const listResult = await pool.query(
      "SELECT * FROM shopping_lists ORDER BY created_at DESC LIMIT 1"
    );

    if (listResult.rows.length === 0) {
      return res.status(404).json({ error: "No shopping lists found" });
    }

    const shoppingList = listResult.rows[0];
    const itemsResult = await pool.query(
      "SELECT * FROM shopping_list_items WHERE shopping_list_id = $1 ORDER BY id ASC",
      [shoppingList.id]
    );

    res.json({
      shopping_list: shoppingList,
      items: itemsResult.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch shopping list" });
  }
});

// PATCH shopping list item check state
app.patch("/shopping-list-items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { checked } = req.body;

    const result = await pool.query(
      "UPDATE shopping_list_items SET checked = $1 WHERE id = $2 RETURNING *",
      [checked, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Shopping list item not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update shopping list item" });
  }
});

// Pantry Endpoints
app.get("/pantry-items", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pantry_items ORDER BY ingredient_name");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch pantry items" });
  }
});

app.post("/pantry-items", async (req, res) => {
  try {
    const { ingredient_name, quantity, unit } = req.body;
    if (!ingredient_name || !quantity || !unit) {
      return res.status(400).json({ error: "Ingredient name, quantity and unit are required" });
    }

    const result = await pool.query(
      "INSERT INTO pantry_items (ingredient_name, quantity, unit) VALUES ($1, $2, $3) RETURNING *",
      [ingredient_name, quantity, unit]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add pantry item" });
  }
});

app.patch("/pantry-items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { ingredient_name, quantity, unit } = req.body;

    const result = await pool.query(
      "UPDATE pantry_items SET ingredient_name = $1, quantity = $2, unit = $3 WHERE id = $4 RETURNING *",
      [ingredient_name, quantity, unit, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pantry item not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update pantry item" });
  }
});

app.delete("/pantry-items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM pantry_items WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pantry item not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete pantry item" });
  }
});

// Content Items Endpoints
app.post("/content-items", async (req, res) => {
  try {
    const {
      recipe_id, status, platform, cook_date, edit_deadline,
      upload_date, hook, caption, hashtags, views, likes
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO content_items (
        recipe_id, status, platform, cook_date, edit_deadline,
        upload_date, hook, caption, hashtags, views, likes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
      `,
      [
        recipe_id, status, platform, cook_date, edit_deadline,
        upload_date, hook, caption, hashtags, views || 0, likes || 0
      ]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create content item" });
  }
});

app.get("/content-items", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT content_items.*, recipes.name AS recipe_name
      FROM content_items
      JOIN recipes ON content_items.recipe_id = recipes.id
      ORDER BY content_items.created_at DESC
      `
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch content items" });
  }
});

app.get("/content-items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM content_items WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Content item not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch content item" });
  }
});

app.patch("/content-items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      recipe_id, status, platform, cook_date,
      edit_deadline, upload_date, hook, caption, hashtags
    } = req.body;

    const result = await pool.query(
      `
      UPDATE content_items
      SET recipe_id = $1, status = $2, platform = $3, cook_date = $4,
          edit_deadline = $5, upload_date = $6, hook = $7, caption = $8,
          hashtags = $9, updated_at = NOW()
      WHERE id = $10
      RETURNING *
      `,
      [recipe_id, status, platform, cook_date, edit_deadline, upload_date, hook, caption, hashtags, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Content item not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update content item" });
  }
});

app.delete("/content-items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM content_items WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Content item not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete content item" });
  }
});

// Dashboard Metrics
app.get("/dashboard", async (req, res) => {
  try {
    const countsResult = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM recipes) AS total_recipes,
        (SELECT COUNT(*) FROM pantry_items) AS total_pantry_items,
        (SELECT COUNT(*) FROM content_items) AS total_content_items,
        (SELECT COUNT(*) FROM content_items WHERE status != 'published') AS pending_content
    `);

    const stagesResult = await pool.query(`
      SELECT status, COUNT(*)::int AS count
      FROM content_items
      GROUP BY status
    `);

    // Today's tasks
    const todaysTasksResult = await pool.query(`
      SELECT 
        c.*, 
        r.name AS recipe_name,
        CASE 
          WHEN c.cook_date::date = CURRENT_DATE THEN 'cook'
          WHEN c.edit_deadline::date = CURRENT_DATE THEN 'edit'
          WHEN c.upload_date::date = CURRENT_DATE THEN 'upload'
        END AS task_type
      FROM content_items c
      JOIN recipes r ON c.recipe_id = r.id
      WHERE 
        c.cook_date::date = CURRENT_DATE OR
        c.edit_deadline::date = CURRENT_DATE OR
        c.upload_date::date = CURRENT_DATE
      ORDER BY c.created_at DESC
    `);

    // Upcoming schedule (Next 7 days)
    const upcomingResult = await pool.query(`
      SELECT 
        c.*, 
        r.name AS recipe_name
      FROM content_items c
      JOIN recipes r ON c.recipe_id = r.id
      WHERE 
        (c.cook_date > CURRENT_DATE AND c.cook_date <= CURRENT_DATE + INTERVAL '7 days') OR
        (c.edit_deadline > CURRENT_DATE AND c.edit_deadline <= CURRENT_DATE + INTERVAL '7 days') OR
        (c.upload_date > CURRENT_DATE AND c.upload_date <= CURRENT_DATE + INTERVAL '7 days')
      ORDER BY LEAST(c.cook_date, c.edit_deadline, c.upload_date) ASC
    `);

    const stageCounts = {
      planning: 0,
      ready_to_cook: 0,
      editing: 0,
      ready_to_upload: 0,
      published: 0,
    };

    stagesResult.rows.forEach((row) => {
      if (stageCounts[row.status] !== undefined) {
        stageCounts[row.status] = row.count;
      }
    });

    const todaysCooking = todaysTasksResult.rows.filter(
      (item) => item.cook_date && new Date(item.cook_date).toDateString() === new Date().toDateString()
    );
    const todaysEditing = todaysTasksResult.rows.filter(
      (item) => item.edit_deadline && new Date(item.edit_deadline).toDateString() === new Date().toDateString()
    );
    const todaysUploads = todaysTasksResult.rows.filter(
      (item) => item.upload_date && new Date(item.upload_date).toDateString() === new Date().toDateString()
    );

    res.json({
      metrics: {
        recipes: Number(countsResult.rows[0]?.total_recipes || 0),
        pantryItems: Number(countsResult.rows[0]?.total_pantry_items || 0),
        contentItems: Number(countsResult.rows[0]?.total_content_items || 0),
        pendingContent: Number(countsResult.rows[0]?.pending_content || 0),
      },
      stageCounts,
      todaysTasks: {
        cooking: todaysCooking,
        editing: todaysEditing,
        uploads: todaysUploads,
        all: todaysTasksResult.rows,
      },
      upcomingContent: upcomingResult.rows || [],
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});