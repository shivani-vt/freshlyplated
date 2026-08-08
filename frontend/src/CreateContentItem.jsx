import { useEffect, useState } from "react";

function CreateContentItem() {
  const [recipes, setRecipes] = useState([]);

  const [recipeId, setRecipeId] = useState("");
  const [status, setStatus] = useState("planning");
  const [platform, setPlatform] = useState("TikTok");
  const [cookDate, setCookDate] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [uploadDate, setUploadDate] = useState("");
  const [hook, setHook] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/recipes")
      .then(response => response.json())
      .then(data => {
        setRecipes(data);
      });
  }, []);

  const handleSubmit = (event) => {
  event.preventDefault();

  fetch("http://localhost:3001/content-items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      recipe_id: recipeId,
      status: status,
      platform: platform,
      cook_date: cookDate,
      edit_deadline: editDeadline,
      upload_date: uploadDate,
      hook: hook,
      caption: caption,
      hashtags: hashtags,
      views: 0,
      likes: 0
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log("Created content item:", data);
    });
};

  return (
    <div> 
        <form onSubmit={handleSubmit}>

      <h1>Create Content Item</h1>

      <label>Recipe</label>

      <select
        value={recipeId}
        onChange={(event) => setRecipeId(event.target.value)}
      >
        <option value="">Select a recipe</option>

        {recipes.map(recipe => (
          <option key={recipe.id} value={recipe.id}>
            {recipe.name}
          </option>
        ))}

      </select>


      <label>Status</label>

      <select
        value={status}
        onChange={(event) => setStatus(event.target.value)}
      >
        <option value="planning">Planning</option>
        <option value="ready_to_cook">Ready to Cook</option>
        <option value="editing">Editing</option>
        <option value="ready_to_upload">
          Ready to Upload
        </option>
        <option value="published">Published</option>
      </select>


      <label>Platform</label>

      <select
        value={platform}
        onChange={(event) => setPlatform(event.target.value)}
      >
        <option value="TikTok">TikTok</option>
        <option value="Instagram">Instagram</option>
        <option value="YouTube Shorts">
          YouTube Shorts
        </option>
      </select>


      <label>Cook Date</label>

      <input
        type="date"
        value={cookDate}
        onChange={(event) => setCookDate(event.target.value)}
      />


      <label>Edit Deadline</label>

      <input
        type="date"
        value={editDeadline}
        onChange={(event) =>
          setEditDeadline(event.target.value)
        }
      />


      <label>Upload Date</label>

      <input
        type="date"
        value={uploadDate}
        onChange={(event) =>
          setUploadDate(event.target.value)
        }
      />


      <label>Hook</label>

      <textarea
        value={hook}
        onChange={(event) => setHook(event.target.value)}
        placeholder="The easiest enchiladas you will ever make"
      />


      <label>Caption</label>

      <textarea
        value={caption}
        onChange={(event) =>
          setCaption(event.target.value)
        }
        placeholder="Easy homemade enchiladas 🌯"
      />


      <label>Hashtags</label>

      <textarea
        value={hashtags}
        onChange={(event) =>
          setHashtags(event.target.value)
        }
        placeholder="#foodtok #enchiladas #easyrecipes"
      />


      <button type="submit">
        Create Content
      </button>
      </form>

    </div>
  );
}

export default CreateContentItem;
