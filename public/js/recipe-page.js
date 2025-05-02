const recipeId = window.location.pathname.split("/").pop();
const token = localStorage.getItem("token");

const container = document.getElementById("recipe-container");

container.innerHTML = `
  <div class="loading">
    <div class="spinner"></div>
    <p>Loading recipe...</p>
  </div>
`;

async function loadRecipe() {
  try {
    const res = await fetch(`/api/recipes/${recipeId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch recipe: ${res.status}`);
    }

    const { recipe } = await res.json();
    const capitalizeWords = str => str.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    document.title = `${capitalizeWords(recipe.title)} | Foodmate`;

    const container = document.getElementById("recipe-container");
    container.innerHTML = `
      <div class="col s12 m7 left-content">
        <h4>${capitalizeWords(recipe.title)}</h4>
        <div>
          ${recipe.tags.map(tag => `<div class="chip tag-chip">${tag}</div>`).join("")}
        </div>
        <div class="info-icons">
          <p><i class="material-icons">schedule</i> ${recipe.readyInMinutes} minutes</p>
          <p><i class="material-icons">restaurant</i> Serves ${recipe.servings}</p>
          ${
            recipe.nutrition?.nutrients
              .map(n => {
                if (n.name === "Calories")
                  return `<p><i class="material-icons">local_fire_department</i> ${n.amount} kcal</p>`;
                if (n.name === "Protein")
                  return `<p><i class="material-icons">fitness_center</i> ${n.amount} g Protein</p>`;
                if (n.name === "Sugar")
                  return `<p><i class="material-icons">icecream</i> ${n.amount} g Sugar</p>`;
                if (n.name === "Carbohydrates")
                  return `<p><i class="material-icons">bakery_dining</i> ${n.amount} g Carbs</p>`;
                return "";
              })
              .join("") || ""
          }
        </div>
        <button style="background-color: orange; color: white; padding: 10px 16px; border: none; border-radius: 8px;">
          Add to Meal Plan
        </button>
        <a href="/home" style="background-color: orange; color: white; padding: 8.5px 16px; border: none; border-radius: 8px; text-decoration: none; display: inline-block;">
          Back to Recipes
        </a>
        <h5>Ingredients</h5>
        <ul class="collection">
          ${recipe.formattedIngredients.map(i => `<li class="collection-item">${i}</li>`).join("")}
        </ul>
        ${
          recipe.instructionDetails?.length
            ? `<h5>Instructions</h5><div>${recipe.instructionDetails.map((step, i) => `<div class="step"><strong>Step ${i + 1}:</strong> ${step}</div>`).join("")}</div>`
            : ""
        }
      </div>
      <div class="col s12 m5 right-image">
        <div class="row">
          <img src="${recipe.image}" alt="Recipe Image" class="recipe-image">
        </div>
      </div>
    `;
  } catch {
    const recipeSection = document.getElementById("recipe-container");
    if (recipeSection) recipeSection.style.display = "none";
    
    const errorContainer = document.createElement("div");
    errorContainer.id = "error-container";
    errorContainer.innerHTML = `
      <div class="error-wrapper">
        <div class="error-card">
          <h4>⚠️ Something went wrong</h4>
          <p>We couldn't load the recipe. Please check your connection or try again later.</p>
          <a href="/home" class="btn orange darken-2">Back to Recipes</a>
        </div>
      </div>
    `;
    document.body.appendChild(errorContainer);
  }
}

loadRecipe();