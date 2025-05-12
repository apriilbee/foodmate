/* global M */

window.openModal = function (button) {
    const recipeId = button.getAttribute("data-recipe-id");
    document.getElementById("recipeIdInput").value = recipeId;

    const modal = document.getElementById("addMealModal");

    if (modal) {
        modal.style.display = "block";
    }
};

window.closeModal = function () {
    const modal = document.getElementById("addMealModal");
    if (modal) {
        modal.style.display = "none";
    }

    document.getElementById("addMealForm").reset();
    document.getElementById("recipeIdInput").value = "";
};

document.addEventListener("DOMContentLoaded", function () {
    const addMealForm = document.getElementById("addMealForm");

    if (addMealForm) {
        addMealForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const recipeId = document.getElementById("recipeIdInput").value;
            const date = document.getElementById("mealDate").value;
            const mealType = document.getElementById("mealType").value;

            console.log(recipeId, date, mealType);
            
            if (!recipeId || !date || !mealType) {
                M.toast({ html: "Please fill out all fields.", classes: "red" });
                return;
            }

            try {
                const response = await fetch("/mealPlan", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ recipeId, date, mealType }),
                });

                const data = await response.json();

                if (response.ok) {
                    M.toast({ html: "✅ Meal added to plan!", classes: "green" });
                    closeModal();
                } else {
                    M.toast({ html: data.message || "⚠️ Failed to add meal.", classes: "red" });
                }
            } catch (err) {
                console.error("Add Meal Error:", err);
                M.toast({ html: "❌ Server error. Try again later.", classes: "red" });
            }
        });
    }
});

