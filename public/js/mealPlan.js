/* global M */

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDateLocal(date) {
  return date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0');
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("meal-container");
  const weekSpan = document.getElementById("week-range");

  const today = new Date();
  let currentWeekStart = getStartOfWeek(today);

  async function loadMealPlan(startDate) {
    container.innerHTML = `<div class="loading"><div class="spinner"></div><p>Loading meal plan...</p></div>`;

    try {
      const res = await fetch(`/mealPlan/api?week=${formatDateLocal(startDate)}`);
      const { meals } = await res.json();
      renderMealGrid(meals, startDate);
    } catch (err) {
      console.error("Failed to load meal plan:", err);
      container.innerHTML = `<p class="error">Failed to load meal plan.</p>`;
    }
  }
/* global loadMealPlan */

  window.loadMealPlan = loadMealPlan;

  function renderMealGrid(meals, startDate) {
    const days = [...Array(7)].map((_, i) => new Date(startDate.getTime() + i * 86400000));
    const mealsByDay = {};

    days.forEach(d => {
      mealsByDay[formatDateLocal(d)] = {
        Breakfast: null,
        Lunch: null,
        Dinner: null
      };
    });

    meals.forEach(meal => {
      const key = formatDateLocal(new Date(meal.date));
      if (mealsByDay[key]) mealsByDay[key][meal.mealType] = meal;
    });

    const start = days[0].toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const end = days[6].toLocaleDateString("en-US", { day: "numeric" });
    weekSpan.textContent = `MEAL PLAN: ${start} - ${end}`;

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    container.innerHTML = `<div class="week-view">${days
      .map((day, index) => {
        const dateStr = formatDateLocal(day);
        const slots = mealsByDay[dateStr] || { Breakfast: null, Lunch: null, Dinner: null };

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
                        </div>`
                      : `<div class="empty">No meal</div>`
                  }
                </div>`;
              }).join("")}
            <button class="delete-meal-btn" onclick="deleteMealsByDate('${dateStr}')">
              Delete
            </button>
          </div>`;
      }).join("")}</div>`;
  }

  document.getElementById("prev-week").addEventListener("click", () => {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    loadMealPlan(currentWeekStart);
  });

  document.getElementById("next-week").addEventListener("click", () => {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    loadMealPlan(currentWeekStart);
  });

  loadMealPlan(currentWeekStart);
});

let deleteDate = null;

window.deleteMealsByDate = function (date) {
  deleteDate = date;
  document.getElementById("delete-modal-text").textContent = `Delete all meals for ${date}?`;

  const modal = M.Modal.getInstance(document.getElementById("confirmDeleteModal"));
  modal.open();
};

document.addEventListener("DOMContentLoaded", function () {
  const modalEl = document.getElementById("confirmDeleteModal");
  M.Modal.init(modalEl);

  document.getElementById("confirm-delete-btn").addEventListener("click", async function () {
    if (!deleteDate) return;

    try {
      const res = await fetch("/mealPlan", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: deleteDate }),
      });

      const result = await res.json();
      if (res.ok) {
        M.toast({ html: result.message, classes: "green" });
        const startDate = new Date(deleteDate);
        const startOfWeek = getStartOfWeek(startDate);
        loadMealPlan(startOfWeek);
      } else {
        M.toast({ html: "❌ " + result.message, classes: "red" });
      }
    } catch (err) {
      console.error("Failed to delete meals:", err);
      M.toast({ html: "⚠️ Something went wrong.", classes: "red" });
    }
    deleteDate = null;
  });
});
