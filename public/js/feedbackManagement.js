document.addEventListener("DOMContentLoaded", async () => {
  const feedbackList = document.getElementById("feedbackList");

  try {
    const res = await fetch("/api/feedback");
    const data = await res.json();

    if (data.success && data.data.length > 0) {
      feedbackList.innerHTML = ""; 

      data.data.forEach(feedback => {
        const listItem = document.createElement("div");
        listItem.className = "feedback-item";
        listItem.innerHTML = `
          <div class="stars">${"★".repeat(feedback.rating)}${"☆".repeat(5 - feedback.rating)}</div>
          <div class="message">${feedback.message ? feedback.message : "<span class='no-comment'>No comment provided.</span>"}</div>
        `;
        feedbackList.appendChild(listItem);
      });
    } else {
      feedbackList.innerHTML = '<div class="no-feedback">No feedback found.</div>';
    }
  } catch (err) {
    feedbackList.innerHTML = '<div class="no-feedback">Error loading feedback. Please try again.</div>';
  }
});
