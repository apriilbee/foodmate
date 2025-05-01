const modal = document.getElementById("passwordModal");
const openBtn = document.getElementById("openPasswordModal");
const closeBtn = document.getElementById("closePasswordModal");

openBtn.onclick = () => modal.style.display = "block";
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; }

document.getElementById("passwordchange").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const currentPassword = form.currentPassword.value;
  const newPassword = form.newPassword.value;
  const confirmPassword = form.confirmPassword.value;
  const messageEl = document.getElementById("passwordMessage");

  try {
    const res = await fetch("/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
    });

    const data = await res.json();
    if (data.success) {
      messageEl.style.color = "green";
      messageEl.textContent = data.message;
      form.reset();

      setTimeout(() => {
        document.getElementById("passwordModal").style.display = "none";
        messageEl.textContent = "";
      }, 2000);
    } else {
      messageEl.style.color = "red";
      messageEl.textContent = data.message;
    }

  } catch (err) {
    messageEl.style.color = "red";
    messageEl.textContent = "Something went wrong. Please try again.";
    console.error(err);
  }
});
