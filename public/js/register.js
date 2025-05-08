document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const errorMessage = document.getElementById("registerErrorMessage");

    registerForm?.addEventListener("submit", async (event) => {
        event.preventDefault();
        errorMessage.textContent = "";

        const formData = new FormData(registerForm);
        const formObject = Object.fromEntries(formData.entries());

        try {
            const response = await fetch("/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(formObject),
            });

            const data = await response.json();
            if (response.ok && data.redirectUrl) {
                window.location.href = data.redirectUrl;
            } else {
                errorMessage.textContent = data.message || "Registration failed.";
            }
        } catch (error) {
            errorMessage.textContent = "Server error. Please try again.";
        }
    });
});
