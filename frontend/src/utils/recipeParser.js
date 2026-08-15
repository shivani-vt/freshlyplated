/**
 * Autoparses raw unstructured recipe text copied from Instagram/TikTok/Notes
 */
export function parseRawRecipe(rawText) {
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

  // Extract hashtags anywhere in text
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

    // Detect first clean line as name if not set
    if (!name && !line.startsWith("#") && !line.match(/prep|cook|servings|ingredients|method|instructions/i)) {
      name = line.replace(/^[🍳🥗🥘🍲🥪🌮🌯🍗🍝🥩🍕•\-\*]\s*/u, "").trim();
      continue;
    }

    // Section detection
    if (/^(ingredients|what you need|shopping list)[:\s]*$/i.test(line)) {
      currentSection = "ingredients";
      continue;
    }

    if (/^(method|instructions|steps|directions|how to make)[:\s]*$/i.test(line)) {
      currentSection = "method";
      continue;
    }

    // Collect section lines
    if (currentSection === "ingredients") {
      // Clean leading bullet points or dashes
      const cleaned = line.replace(/^[•\-\*\d\.\)]\s*/, "");
      if (cleaned) ingredients.push(cleaned);
    } else if (currentSection === "method") {
      methodLines.push(line);
    }
  }

  // If explicit sections weren't found, fallback heuristic
  if (ingredients.length === 0 && methodLines.length === 0) {
    lines.forEach((l) => {
      if (l.match(/^\d+[\s\w]*(g|kg|ml|l|tbsp|tsp|cup|cups|can|cans|pinch|cloves?|slices?)/i)) {
        ingredients.push(l.replace(/^[•\-\*]\s*/, ""));
      }
    });
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