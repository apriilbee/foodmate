document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const errorMessage = document.getElementById("registerErrorMessage");

    registerForm?.addEventListener("submit", async (event) => {
        event.preventDefault();
        errorMessage.textContent = "";

        const formData = new FormData(registerForm);
        const formObject = Object.fromEntries(formData.entries());

        // ✅ Check if passwords match
        if (formObject.password !== formObject.confirmPassword) {
            errorMessage.textContent = "Passwords do not match.";
            return;
        }

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
            console.error("Registration error:", error);
            errorMessage.textContent = "Server error. Please try again.";
        }
    });
});

document.querySelectorAll(".toggle-password").forEach((icon) => {
    icon.addEventListener("click", () => {
        const selector = icon.getAttribute("toggle");
        const inputs = document.querySelectorAll(selector);

        inputs.forEach((input) => {
            const isHidden = input.type === "password";
            input.type = isHidden ? "text" : "password";
        });

        icon.textContent = inputs[0]?.type === "password" ? "visibility" : "visibility_off";
    });
});
