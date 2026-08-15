import { useState } from "react";

function parseRecipeText(rawText) {
  if (!rawText || !rawText.trim()) return null;

  const lines = rawText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  let name = "";
  let prep_time_minutes = "";
  let cook_time_minutes = "";
  let tags = [];
  const ingredients = [];
  const methodLines = [];

  let currentSection = "header";

  // Match tags (#pasta, #healthy)
  const hashtagMatches = rawText.match(/#([a-zA-Z0-9_]+)/g);
  if (hashtagMatches) {
    tags = hashtagMatches.map((t) => t.replace("#", "").toLowerCase());
  }

  const prepMatch = rawText.match(/prep(?:aration)?(?:\s*time)?[:\s]*(\d+)\s*(?:mins?|m|minutes?)/i);
  const cookMatch = rawText.match(/cook(?:ing)?(?:\s*time)?[:\s]*(\d+)\s*(?:mins?|m|minutes?)/i);

  if (prepMatch) prep_time_minutes = prepMatch[1];
  if (cookMatch) cook_time_minutes = cookMatch[1];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!name && !line.startsWith("#") && !line.match(/prep|cook|servings|ingredients|method|instructions/i)) {
      name = line.replace(/^[🍳🥗🥘🍲🥪🌮🌯🍗🍝🥩🍕•\-\*]\s*/u, "").trim();
      continue;
    }

    if (/^(ingredients|what you need|shopping list)[:\s]*$/i.test(line)) {
      currentSection = "ingredients";
      continue;
    }

    if (/^(method|instructions|steps|directions|how to make)[:\s]*$/i.test(line)) {
      currentSection = "method";
      continue;
    }

    if (currentSection === "ingredients") {
      const cleaned = line.replace(/^[•\-\*\d\.\)]\s*/, "");
      if (cleaned) ingredients.push(cleaned);
    } else if (currentSection === "method") {
      methodLines.push(line);
    }
  }

  return {
    name: name || "New Recipe",
    prep_time_minutes: prep_time_minutes || "",
    cook_time_minutes: cook_time_minutes || "",
    tags: tags.slice(0, 5).join(", "),
    ingredients: ingredients.join("\n"),
    method: methodLines.join("\n"),
    original_recipe_text: rawText,
  };
}

function AddRecipeForm({ fetchRecipes }) {
  const [isQuickPaste, setIsQuickPaste] = useState(false);
  const [pastedText, setPastedText] = useState("");

  const [name, setName] = useState("");
  const [status, setStatus] = useState("planning");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [tags, setTags] = useState("");
  const [originalLink, setOriginalLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [method, setMethod] = useState("");
  const [originalRecipeText, setOriginalRecipeText] = useState("");
  const [adjustedRecipeText, setAdjustedRecipeText] = useState("");

  const handleAutoFill = () => {
    const parsed = parseRecipeText(pastedText);
    if (!parsed) return;

    setName(parsed.name);
    if (parsed.prep_time_minutes) setPrepTime(parsed.prep_time_minutes);
    if (parsed.cook_time_minutes) setCookTime(parsed.cook_time_minutes);
    if (parsed.tags) setTags(parsed.tags);
    if (parsed.ingredients) setIngredients(parsed.ingredients);
    if (parsed.method) setMethod(parsed.method);
    setOriginalRecipeText(parsed.original_recipe_text);

    setIsQuickPaste(false);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) return alert("Recipe name is required.");

    fetch("http://localhost:3001/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        status,
        prep_time_minutes: Number(prepTime) || 0,
        cook_time_minutes: Number(cookTime) || 0,
        image_url: imageUrl,
        tags,
        original_recipe_link: originalLink,
        original_recipe_text: originalRecipeText,
        adjusted_recipe_text: adjustedRecipeText,
        ingredients,
        method,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Saved recipe:", data);
        fetchRecipes();

        // Reset form
        setName("");
        setPrepTime("");
        setCookTime("");
        setTags("");
        setOriginalLink("");
        setImageUrl("");
        setIngredients("");
        setMethod("");
        setOriginalRecipeText("");
        setAdjustedRecipeText("");
        setPastedText("");
        setStatus("planning");
      })
      .catch((err) => {
        console.error("Error saving recipe:", err);
        alert("Error saving recipe.");
      });
  };

  return (
    <div style={{ background: "white", padding: "24px", borderRadius: "16px", marginBottom: "30px", textAlign: "left", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
        <h2 style={{ margin: 0, fontSize: "1.4rem" }}>Add Recipe</h2>
        <button
          type="button"
          onClick={() => setIsQuickPaste(!isQuickPaste)}
          style={{
            background: "#f3e8ff",
            color: "#9333ea",
            border: "1px solid #d8b4fe",
            padding: "8px 14px",
            borderRadius: "20px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          {isQuickPaste ? "Switch to Manual Mode" : "✨ Quick Paste from Social Media"}
        </button>
      </div>

      {isQuickPaste ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <p style={{ color: "#666", fontSize: "0.9rem", margin: 0 }}>
            Paste the raw caption from Instagram, TikTok, or your notes app:
          </p>
          <textarea
            rows="8"
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box", fontFamily: "inherit" }}
            placeholder={`Creamy Garlic Butter Pasta\nPrep: 10 mins | Cook: 15 mins\n\nIngredients:\n- 300g fettuccine\n- 4 cloves garlic\n- 50g butter\n\nMethod:\n1. Boil pasta\n2. Melt butter and sauté garlic\n\n#pasta #dinner`}
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
          />
          <button
            type="button"
            onClick={handleAutoFill}
            style={{
              background: "#9333ea",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
              alignSelf: "flex-start",
            }}
          >
            ✨ Auto-Fill Recipe Fields
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: "600" }}>Recipe Name</label>
            <input
              type="text"
              placeholder="e.g. Creamy Garlic Butter Pasta"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc" }}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600" }}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
              >
                <option value="planning">Planning</option>
                <option value="ready_to_cook">Ready to Cook</option>
                <option value="editing">Editing</option>
                <option value="ready_to_upload">Ready to Upload</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600" }}>Prep Time (mins)</label>
              <input
                type="number"
                placeholder="15"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600" }}>Cook Time (mins)</label>
              <input
                type="number"
                placeholder="20"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600" }}>Tags</label>
              <input
                type="text"
                placeholder="pasta, dinner, quick"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600" }}>Image URL</label>
              <input
                type="text"
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: "600" }}>Ingredients (1 per line)</label>
            <textarea
              rows="3"
              placeholder="300g fettuccine&#10;4 cloves garlic&#10;50g butter"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc", fontFamily: "inherit" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: "600" }}>Method / Steps</label>
            <textarea
              rows="3"
              placeholder="Step 1: Boil pasta...&#10;Step 2: Sauté garlic..."
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc", fontFamily: "inherit" }}
            />
          </div>

          <button
            type="submit"
            style={{
              background: "#222",
              color: "white",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              fontWeight: "600",
              cursor: "pointer",
              marginTop: "6px",
            }}
          >
            Add Recipe
          </button>
        </form>
      )}
    </div>
  );
}

export default AddRecipeForm;