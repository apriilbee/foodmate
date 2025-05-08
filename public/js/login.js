/* global M */
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const verified = urlParams.get("verified");
    const email = urlParams.get("email");

    const justRegistered = urlParams.get("registered");

    if (justRegistered === "true") {
        M.toast({
            html: "Verification email sent. Please check your inbox.",
            classes: "blue darken-2",
            displayLength: 6000,
        });
    }

    if (verified === "true") {
        M.toast({
            html: `${email} verified! You can now log in.`,
            classes: "green darken-1",
            displayLength: 5000,
        });
    }

    const loginForm = document.getElementById("loginForm");
    const errorMessage = document.getElementById("errorMessage");

    loginForm?.addEventListener("submit", async (event) => {
        event.preventDefault();
        errorMessage.textContent = "";

        const formData = new FormData(loginForm);
        const formObject = Object.fromEntries(formData.entries());

        try {
            const response = await fetch("/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
            console.error("Registration error:", error);
            errorMessage.textContent = "Server error. Please try again.";
        }
    });
});
