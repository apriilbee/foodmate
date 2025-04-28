document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const errorMessage = document.getElementById("errorMessage");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const formObject = Object.fromEntries(formData.entries());

        try {
            const response = await fetch("/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formObject),
            });

            const data = await response.json();

            if (response.ok && data.redirectUrl) {
                window.location.href = data.redirectUrl;
            } else {
                errorMessage.textContent = data.message || "Login failed.";
            }
        } catch (error) {
            console.error("Login error:", error);
            errorMessage.textContent = "Server error. Please try again.";
        }
    });
});
