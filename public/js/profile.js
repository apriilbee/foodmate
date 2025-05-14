
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

  if (newPassword.length < 8) {
    messageEl.innerText = 'Password must be at least 8 characters';
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
          window.location.href = "/"; 
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

/*
  document.getElementById("dietary-form").addEventListener("submit", async function (e) {
    e.preventDefault();  // Prevent the default form submission
  
    const form = e.target;
    
    const dietary = Array.from(form.querySelectorAll('input[name="dietary"]:checked')).map(el => el.value);
    const allergies = Array.from(form.querySelectorAll('input[name="allergies"]:checked')).map(el => el.value);
    const dietaryOther = form.querySelector('input[name="dietaryOther"]').value;
    const allergyOther = form.querySelector('input[name="allergyOther"]').value;
  
    // Payload
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
      console.error(err);
    }
  });
  */

  const createCheckbox = (name, value) => {
    const wrapper = document.createElement("p");
    wrapper.innerHTML = `
      <label>
        <input type="checkbox" class="filled-in" name="${name}" value="${value}" checked />
        <span>${value}</span>
      </label>
    `;
    return wrapper;
  };
  
  document.getElementById("dietary-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const form = e.target;
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
  
      // ✅ Insert new checkbox if dietaryOther was added and is not already in form
      if (dietaryOther.trim()) {
        const exists = [...form.querySelectorAll('input[name="dietary"]')].some(cb => cb.value === dietaryOther.trim());
        if (!exists) {
          const checkboxWrapper = form.querySelector('.checkbox-wrapper'); 
          checkboxWrapper.appendChild(createCheckbox("dietary", dietaryOther.trim()));
        }
      }
  
      if (allergyOther.trim()) {
        const allergyBoxes = form.querySelectorAll('input[name="allergies"]');
        const exists = [...allergyBoxes].some(cb => cb.value === allergyOther.trim());
        if (!exists) {
          const wrappers = form.querySelectorAll('.checkbox-wrapper');
          const allergyWrapper = wrappers[1]; 
          allergyWrapper.appendChild(createCheckbox("allergies", allergyOther.trim()));
        }
      }
  
      document.getElementById("preferenceresponse").innerHTML = `
        <div class="${data.success ? 'success-msg' : 'error-msg'}">
          ${data.message}
        </div>
      `;
  
      // clear inputs after adding
      form.querySelector('input[name="dietaryOther"]').value = '';
      form.querySelector('input[name="allergyOther"]').value = '';
    } catch (err) {
      document.getElementById("preferenceresponse").innerHTML = `
        <div class="error-msg">Something went wrong. Please try again.</div>
      `;
      console.error(err);
    }
  });

  document.querySelector(".edit-pic-btn").addEventListener("click", () => {
    document.getElementById("profilePicInput").click(); // Trigger file input on button click
  });
  
  document.getElementById("profilePicInput").addEventListener("change", async function () {
    const file = this.files[0]; 
    if (!file) return;
  
    const formData = new FormData();
    formData.append("profilePic", file); 
  
    try {
      // Send the image to the server for uploading
      const response = await fetch("/profile/uploadpicture", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      const msgContainer = document.getElementById("imageresponse");
  
      // On success, update the profile picture on the webpage
      if (data.success) {
        document.getElementById("profilePic").src = data.profilePic;  
        msgContainer.innerHTML = `<div class="success-msg">${data.message}</div>`;
      } else {
        msgContainer.innerHTML = `<div class="error-msg">${data.message}</div>`;
      }
    } catch (err) {
      console.error("Upload error:", err);
      document.getElementById("imageresponse").innerHTML = `
        <div class="error-msg">Something went wrong while uploading.</div>
      `;
    }
  });  

  const emailModal = document.getElementById("emailModal");
  const openEmailBtn = document.getElementById("openEmailModal");
  const closeEmailBtn = document.getElementById("closeEmailModal");
  const emailForm = document.getElementById("emailChangeForm");
  const emailMessage = document.getElementById("emailMessage");

  // Open modal
  openEmailBtn.onclick = () => emailModal.style.display = "block";

  // Close modal
  closeEmailBtn.onclick = () => {
    emailModal.style.display = "none";
    emailForm.reset();
    emailMessage.textContent = "";
  };

  // Close modal when clicking outside of it
  window.onclick = (e) => {
    if (e.target === emailModal) {
      emailModal.style.display = "none";
      emailForm.reset();
      emailMessage.textContent = "";
    }
  };

  // Handle form submit
  emailForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newEmail = document.getElementById("newEmail").value.trim();
    const currentPassword = document.getElementById("currentPasswordForEmail").value;

    if (!newEmail || !currentPassword) {
      emailMessage.style.color = "red";
      emailMessage.textContent = "Please fill out all fields.";
      return;
    }

    try {
      const response = await fetch("/profile/updateemail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail, currentPassword })
      });

      const data = await response.json();

      if (data.success) {
        emailMessage.style.color = "green";
        emailMessage.textContent = data.message;
        emailForm.reset();

        setTimeout(() => {
          emailModal.style.display = "none";
          emailMessage.textContent = "";
        }, 2000);
      } else {
        emailMessage.style.color = "red";
        emailMessage.textContent = data.message;
      }

    } catch (err) {
      console.error("Error updating email:", err);
      emailMessage.style.color = "red";
      emailMessage.textContent = "Something went wrong. Please try again.";
    }
  });