function openModal(button) {
    console.log("Clicked + button"); // ✅ Debug log to confirm click
    const recipeId = button.getAttribute("data-recipe-id");
    document.getElementById("recipeIdInput").value = recipeId;

    const modalElem = document.getElementById("addMealModal");
    const modalInstance = M.Modal.getInstance(modalElem);
    if (modalInstance) {
        modalInstance.open();
    }
}

function closeModal() {
    const modalElem = document.getElementById("addMealModal");
    const modalInstance = M.Modal.getInstance(modalElem);
    if (modalInstance) {
        modalInstance.close();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // ✅ Initialize all modals (required for Materialize to work)
    const elems = document.querySelectorAll(".modal");
    M.Modal.init(elems);

    // ✅ Handle form submission
    const form = document.getElementById("addMealForm");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch("/meal/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const text = await response.text();

            if (response.ok && text.includes("successfully")) {
                M.toast({ html: "Meal added!" });

                const weekStart = new Date(data.date);
                weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
                const weekStr = weekStart.toISOString().split("T")[0];

                const myPlansLink = document.getElementById("myPlansLink");
                if (myPlansLink) {
                    myPlansLink.href = `/mealplan?week=${weekStr}`;
                }

                closeModal();
            } else {
                M.toast({ html: "Something went wrong!" });
            }
        } catch (error) {
            console.error("Add meal error:", error);
            M.toast({ html: "Something went wrong!" });
        }
    });
});
