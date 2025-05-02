
const modal = document.getElementById("passwordModal");
const openBtn = document.getElementById("openPasswordModal");
const closeBtn = document.getElementById("closePasswordModal");

openBtn.onclick = () => modal.style.display = "block";
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };



document.getElementById("passwordchange").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const currentPassword = form.currentPassword.value;
  const newPassword = form.newPassword.value;
  const confirmPassword = form.confirmPassword.value;
  const messageEl = document.getElementById("passwordMessage");

  if (newPassword.length < 6) {
    messageEl.innerText = 'Password must be at least 6 characters';
    messageEl.style.color = 'red';
    return;
  } else if (newPassword !== confirmPassword) {
    messageEl.innerText = 'Passwords do not match';
    messageEl.style.color = 'red';
    return;
  }

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
        modal.style.display = "none";
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

const deleteModal = document.getElementById("deleteAccountModal");
  const openDeleteBtn = document.getElementById("openDeleteModal");
  const closeDeleteBtn = document.getElementById("closeDeleteModal");
  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  const deleteMessage = document.getElementById("deleteMessage");

  openDeleteBtn.onclick = () => deleteModal.style.display = "block";
  closeDeleteBtn.onclick = () => deleteModal.style.display = "none";
  cancelDeleteBtn.onclick = () => deleteModal.style.display = "none";
  window.onclick = (e) => { if (e.target === deleteModal) deleteModal.style.display = "none"; };

  confirmDeleteBtn.onclick = async () => {
    try {
      const res = await fetch("/profile/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.success) {
        deleteMessage.style.color = "green";
        deleteMessage.textContent = data.message;

        setTimeout(() => {
          window.location.href = "/"; // or homepage
        }, 1500);
      } else {
        deleteMessage.style.color = "red";
        deleteMessage.textContent = data.message;
      }
    } catch (err) {
      deleteMessage.style.color = "red";
      deleteMessage.textContent = "An error occurred. Please try again.";
      console.error(err);
    }
  };

  document.getElementById("dietary-form").addEventListener("submit", async function (e) {
    const dietary = Array.from(form.querySelectorAll('input[name="dietary"]:checked')).map(el => el.value);
    const allergies = Array.from(form.querySelectorAll('input[name="allergies"]:checked')).map(el => el.value);
    const dietaryOther = form.querySelector('input[name="dietaryOther"]').value;
    const allergyOther = form.querySelector('input[name="allergyOther"]').value;
    
    const payload = { dietary, allergies, dietaryOther, allergyOther };

    try {
      const response = await fetch("/profile/dietpreferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      document.getElementById("preferenceresponse").innerHTML = `
        <div class="${data.success ? 'success-msg' : 'error-msg'}">
          ${data.message}
        </div>
      `;
    } catch (err) {
      document.getElementById("preferenceresponse").innerHTML = `
        <div class="error-msg">Something went wrong. Please try again.</div>
      `;
    }
  });
