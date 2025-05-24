import { renderRecipes } from "./recipe-card.js";

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("recipe-search-input");
  const mealList = document.getElementById("meal-list");

  if (!searchInput || !mealList) return;

  searchInput.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      const query = searchInput.value.trim();
      if (!query) return;

      mealList.innerHTML = `<p class="center-align">Searching recipes for "<strong>${query}</strong>"...</p>`;

      try {
        const res = await fetch(`/api/recipes/search?query=${encodeURIComponent(query)}`);
        const data = await res.json();

        const results = data.recipes?.recipes || [];

        if (!res.ok || !Array.isArray(results)) {
          console.error("[Search Error] Invalid response:", data);
          mealList.innerHTML = `<p class="center-align red-text">${data.message || "Search failed."}</p>`;
          return;
        }

        if (results.length > 0) {
          renderRecipes(results);
        } else {
          mealList.innerHTML = `<p class="center-align" style="margin-top: 2rem;">No recipes found for "<strong>${query}</strong>".</p>`;
        }
      } catch (err) {
        console.error("[Search Request Failed]", err);
        mealList.innerHTML = `<p class="center-align red-text">Server error. Please try again later.</p>`;
      }
    }
  });
});
