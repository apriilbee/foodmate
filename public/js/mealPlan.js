document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("meal-container");
    const weekSpan = document.getElementById("week-range");
  
    const today = new Date();
    let currentWeekStart = getStartOfWeek(today);
  
    async function loadMealPlan(startDate) {
      container.innerHTML = `<div class="loading"><div class="spinner"></div><p>Loading meal plan...</p></div>`;
  
      try {
        const res = await fetch(`/mealPlan/api?week=${startDate.toISOString().split("T")[0]}`);
        const { meals } = await res.json();
  
        renderMealGrid(meals, startDate);
      } catch (err) {
        console.error("Failed to load meal plan:", err);
        container.innerHTML = `<p class="error">Failed to load meal plan.</p>`;
      }
    }
  
    function renderMealGrid(meals, startDate) {
      const days = [...Array(7)].map((_, i) => new Date(startDate.getTime() + i * 86400000));
      const mealsByDay = {};
  
      days.forEach(d => {
        mealsByDay[d.toISOString().split("T")[0]] = {
          Breakfast: null,
          Lunch: null,
          Dinner: null
        };
      });
  
      meals.forEach(meal => {
        const key = new Date(meal.date).toISOString().split("T")[0];
        if (mealsByDay[key]) mealsByDay[key][meal.mealType] = meal;
      });
  
      // Set week label
      const start = days[0].toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const end = days[6].toLocaleDateString("en-US", { day: "numeric" });
      weekSpan.textContent = `MEAL PLAN: ${start} - ${end}`;
  
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
      container.innerHTML = `<div class="week-view">${days
        .map((day, index) => {
          const dateStr = day.toISOString().split("T")[0];
          const slots = mealsByDay[dateStr];
          return `
            <div class="day-column">
              <h4>${dayNames[index]}<br>${day.getDate()}</h4>
              ${["Breakfast", "Lunch", "Dinner"]
                .map(type => {
                  const meal = slots[type];
                  return `
                  <div class="meal-slot meal-box">
                    <span class="meal-name">${type}:</span>
                    ${
                      meal && meal.recipeName
                        ? `<div class="meal-recipe">
                            <a href="/recipes/${meal.recipeId}">${meal.recipeName}</a>
                            <button class="delete-meal-btn" data-meal-id="${meal.recipeId}">X</button>
                          </div>`
                        : `<div class="empty">No meal</div>`
                    }
                  </div>`;
                })
                .join("")}
            </div>`;
        })
        .join("")}</div>`;
    }
  
    function getStartOfWeek(date) {
      const d = new Date(date);
      const day = d.getDay();
      d.setDate(d.getDate() - day);
      d.setHours(0, 0, 0, 0);
      return d;
    }
  
    // Navigation
    document.getElementById("prev-week").addEventListener("click", () => {
      currentWeekStart.setDate(currentWeekStart.getDate() - 7);
      loadMealPlan(currentWeekStart);
    });
  
    document.getElementById("next-week").addEventListener("click", () => {
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
      loadMealPlan(currentWeekStart);
    });
  
    // Initial load
    loadMealPlan(currentWeekStart);
  });
  