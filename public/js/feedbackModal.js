// Floating Button Actions
document.getElementById("feedback-toggle").addEventListener("click", () => {
    document.getElementById("feedbackModal").style.display = "block";
});

// View Feedback Button
document.getElementById("view-feedback-toggle").addEventListener("click", () => {
    window.location.href = "/feedback-management";
});

// Close Feedback Modal
function closeFeedback() {
    document.getElementById("feedbackModal").style.display = "none";
    document.getElementById("ratingInput").value = "";
    document.querySelector("textarea[name='message']").value = "";
    document.querySelectorAll(".star").forEach((star) => star.classList.remove("selected"));
}

// Star Rating Logic
document.querySelectorAll(".star").forEach((star, index) => {
    star.addEventListener("click", function () {
        const rating = index + 1;
        document.getElementById("ratingInput").value = rating;
        updateStars(rating);
    });
});

// Update Stars Function
function updateStars(rating) {
    const stars = document.querySelectorAll(".star");
    stars.forEach((star, index) => {
        star.classList.toggle("selected", index < rating);
    });
}

// Submit Feedback Form
document.getElementById("feedbackForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const rating = document.getElementById("ratingInput").value;
    const message = document.querySelector("textarea[name='message']").value;

    if (!rating) {
        showToast("Please provide a rating!");
        return;
    }

    try {
        const res = await fetch("/api/feedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ rating, message }),
        });

        const data = await res.json();
        if (res.ok) {
            showToast("Thanks for the feedback!");
            closeFeedback();
        } else {
            console.error("Submission Error:", data);
            showToast(`Failed to submit feedback: ${data.message || "Try again."}`);
        }
    } catch (err) {
        console.error("Submission Error:", err);
        showToast("Error submitting feedback. Please try again.");
    }
});

function showToast(message) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.className = "toast-message";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
