/* global M */

function openModal(button) {
    console.log("Clicked + button");
    const recipeId = button.getAttribute("data-recipe-id");
    document.getElementById("recipeIdInput").value = recipeId;

    const modalElem = document.getElementById("addMealModal");

    let modalInstance = M.Modal.getInstance(modalElem);
    if (!modalInstance) {
        modalInstance = M.Modal.init(modalElem);
    }

    modalInstance.open();
}

function closeModal() {
    const modalElem = document.getElementById("addMealModal");
    let modalInstance = M.Modal.getInstance(modalElem);
    if (!modalInstance) {
        modalInstance = M.Modal.init(modalElem);
    }
    modalInstance.close();
}

document.addEventListener("DOMContentLoaded", function () {
    const elems = document.querySelectorAll(".modal");
    M.Modal.init(elems);

    const form = document.getElementById("addMealForm");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        console.log("Static form data (not submitted):", data);

        M.toast({ html: "Meal added!" });

        closeModal();
    });

    const selects = document.querySelectorAll("select");
    M.FormSelect.init(selects);
});
