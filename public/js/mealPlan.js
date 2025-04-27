document.addEventListener("DOMContentLoaded", () => {
    const deleteButtons = document.querySelectorAll(".delete-meal");

    deleteButtons.forEach(button => {
        button.addEventListener("click", async () => {
            const mealId = button.getAttribute("data-meal-id");

            const confirmed = confirm("Are you sure you want to delete this meal?");
            if (!confirmed) return;

            const res = await fetch("/meal/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ mealId })
            });

            if (res.ok) {
                location.reload(); // Refresh the calendar
            } else {
                alert("Failed to delete meal");
            }
        });
    });
});
