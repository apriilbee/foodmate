document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");
    const errorMessage = document.getElementById("registerErrorMessage");

    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            if (errorMessage) errorMessage.textContent = "";

            const formData = new FormData(registerForm);
            const formObject = Object.fromEntries(formData.entries());

            try {
                const response = await fetch("/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(formObject),
                });

                const data = await response.json();

                if (response.ok && data.redirectUrl) {
                    console.log(data.redirectUrl);
                    window.location.href = data.redirectUrl;
                } else {
                    if (errorMessage) {
                        errorMessage.textContent = data.message || "Registration failed.";
                    }
                }
            } catch (error) {
                console.error("Registration error:", error);
                if (errorMessage) {
                    errorMessage.textContent = "Server error. Please try again.";
                }
            }
        });
    }
});
