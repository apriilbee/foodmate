function openModal(button) {
    const recipeId = button.getAttribute("data-recipe-id");
    console.log("Clicked + button with recipeId:", recipeId);

    const input = document.getElementById("recipeIdInput");
    if (!input) {
        console.error("Hidden input #recipeIdInput not found!");
        return;
    }

    input.value = recipeId;

    const modalElem = document.getElementById("addMealModal");
    let modalInstance = M.Modal.getInstance(modalElem) || M.Modal.init(modalElem);
    modalInstance.open();
}

function closeModal() {
    const modalElem = document.getElementById("addMealModal");
    let modalInstance = M.Modal.getInstance(modalElem) || M.Modal.init(modalElem);
    modalInstance.close();
}

document.addEventListener("DOMContentLoaded", function () {
    M.Modal.init(document.querySelectorAll(".modal"));
    M.FormSelect.init(document.querySelectorAll("select"));

    const form = document.getElementById("addMealForm");
    if (!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        console.log("Form Data Submitted:", data);

        if (!data.recipeId || !data.mealType || !data.date || !data.userId) {
            M.toast({ html: "Please fill in all fields." });
            return;
        }

        try {
            const response = await fetch("/api/mealPlan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(data)
            });

            const result = await response.json();
            console.log("Server response:", result);

            if (response.ok) {
                M.toast({ html: "Meal added!" });
                closeModal();
            } else {
                M.toast({ html: result.message || "Failed to add meal." });
            }
        } catch (err) {
            console.error("Submission error:", err);
            M.toast({ html: "Server error. Please try again." });
        }
    });
});
