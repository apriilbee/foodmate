let alertTimeout = null;

function closeShareModal() {
  document.getElementById('share-modal').style.display = 'none';
}

document.getElementById('share-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById("collaborator-email").value;
  const groceryListId = document.getElementById("share-grocery-list-id").value;

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/groceryList/${groceryListId}/collaborators`, {
      method: 'POST',
      headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify( {email} )
    })
    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    showAlert('success', 'Grocery list shared successfully!', 3000);
    closeShareModal();
  }
  catch (err) {
    showAlert('error', err.message, 1500);
    closeShareModal();
  }
})

function showAlert(type, message, duration = 3000) {
  const alertBox = document.getElementById('alertBox');
  const alertMessage = document.getElementById('alertMessage');

  if (alertTimeout) {
    clearTimeout(alertTimeout);
  }

  alertBox.classList.remove('hidden', 'error', 'success');
  alertBox.classList.add(type);
  alertMessage.textContent = message;

  alertTimeout = setTimeout(() => {
    alertBox.classList.add('hidden');
  }, duration);
}

function closeAlert() {
  const alertBox = document.getElementById('alertBox');
  alertBox.classList.add('hidden');

  if (alertTimeout) {
    clearTimeout(alertTimeout);
    alertTimeout = null;
  }
}

document.getElementById('btn-close-alert').addEventListener('click', closeAlert);