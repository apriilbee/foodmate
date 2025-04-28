document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();

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
                    alert(data.message || "Registration failed.");
                }
            } catch (error) {
                console.error("Registration error:", error);
                alert("Server error. Please try again.");
            }
        });
    }
});
