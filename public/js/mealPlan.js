document.addEventListener("DOMContentLoaded", function () {
    const deleteButtons = document.querySelectorAll(".delete-meal-btn"); // ✅ correct class name

    deleteButtons.forEach(button => {
        button.addEventListener("click", async () => {
            const mealId = button.getAttribute("data-meal-id");

            const confirmed = confirm("Are you sure you want to delete this meal?");
            if (!confirmed) return;

            try {
                const res = await fetch("/meal/delete", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ mealId })
                });

                if (res.ok) {
                    showToast("Meal deleted!");

                    // ✅ Remove the deleted meal only from UI
                    const mealSlot = button.closest(".meal-recipe");
                    if (mealSlot) {
                        mealSlot.innerHTML = `<div class="empty">No meal</div>`;
                    }
                } else {
                    alert("Failed to delete meal.");
                }
            } catch (error) {
                console.error("Error deleting meal:", error);
                alert("Failed to delete meal.");
            }
        });
    });

    function showToast(message) {
        const toast = document.getElementById("toast");
        toast.textContent = message;
        toast.style.display = "block";
        setTimeout(() => {
            toast.style.display = "none";
        }, 2000);
    }
});
