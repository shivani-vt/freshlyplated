import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditContentItem() {
  const { id } = useParams();
  const navigate = useNavigate();

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
      .then((response) => response.json())
      .then((data) => {
        setRecipes(data);
      })
      .catch((error) => {
        console.error("Failed to fetch recipes:", error);
      });
  }, []);

  useEffect(() => {
    fetch(`http://localhost:3001/content-items/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setRecipeId(data.recipe_id);
        setStatus(data.status);
        setPlatform(data.platform);
        setCookDate(data.cook_date?.split("T")[0] || "");
        setEditDeadline(
          data.edit_deadline?.split("T")[0] || ""
        );
        setUploadDate(
          data.upload_date?.split("T")[0] || ""
        );
        setHook(data.hook || "");
        setCaption(data.caption || "");
        setHashtags(data.hashtags || "");
      })
      .catch((error) => {
        console.error(
          "Failed to fetch content item:",
          error
        );
      });
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!recipeId) {
      alert("Please select a recipe.");
      return;
    }

    if (!cookDate || !editDeadline || !uploadDate) {
      alert("Please select all dates.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/content-items/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
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
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update content item"
        );
      }

      alert("Content item updated!");

      navigate("/content-tracker");
    } catch (error) {
      console.error(
        "Failed to update content item:",
        error
      );

      alert("Failed to update content item.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Edit Content Item</h1>

        <label>Recipe</label>

        <select
          value={recipeId}
          onChange={(event) =>
            setRecipeId(event.target.value)
          }
        >
          <option value="">Select a recipe</option>

          {recipes.map((recipe) => (
            <option key={recipe.id} value={recipe.id}>
              {recipe.name}
            </option>
          ))}
        </select>

        <label>Status</label>

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
        >
          <option value="planning">Planning</option>

          <option value="ready_to_cook">
            Ready to Cook
          </option>

          <option value="editing">
            Editing
          </option>

          <option value="ready_to_upload">
            Ready to Upload
          </option>

          <option value="published">
            Published
          </option>
        </select>

        <label>Platform</label>

        <select
          value={platform}
          onChange={(event) =>
            setPlatform(event.target.value)
          }
        >
          <option value="TikTok">TikTok</option>

          <option value="Instagram">
            Instagram
          </option>

          <option value="YouTube Shorts">
            YouTube Shorts
          </option>
        </select>

        <label>Cook Date</label>

        <input
          type="date"
          value={cookDate}
          onChange={(event) =>
            setCookDate(event.target.value)
          }
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
          onChange={(event) =>
            setHook(event.target.value)
          }
          placeholder="The easiest recipe you'll ever make"
        />

        <label>Caption</label>

        <textarea
          value={caption}
          onChange={(event) =>
            setCaption(event.target.value)
          }
          placeholder="Easy homemade recipe"
        />

        <label>Hashtags</label>

        <textarea
          value={hashtags}
          onChange={(event) =>
            setHashtags(event.target.value)
          }
          placeholder="#foodtok #easyrecipes"
        />

        <button type="submit">
          Save Changes
        </button>

        <button
          type="button"
          onClick={() =>
            navigate("/content-tracker")
          }
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditContentItem;