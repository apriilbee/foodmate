let pendingGeneration = null;
const groceryListContainer = document.getElementById('grocery-list-container');

const today = new Date();
const endDate = new Date();
endDate.setDate(today.getDate() + 7);

function getLocalDate (today) {
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const localDateString = `${year}-${month}-${day}`;

  return localDateString
}

document.getElementById('startDate').value = getLocalDate(today);
document.getElementById('endDate').value = getLocalDate(endDate);

async function generateGroceryList() {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  try {
    const token = localStorage.getItem("token");
    const res = await fetch('/api/groceryList/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({ start: startDate, end: endDate })
    });

    if (res.status === 400) {
      const data = await res.json();
      if (data.error === "A grocery list for this date range already exists.") {
        pendingGeneration = { start: startDate,  end: endDate };
        document.getElementById('overwriteModalText').innerHTML =  
        `A grocery list already exists for <strong>${startDate}</strong> to <strong>${endDate}</strong>.<br>Do you want to overwrite it?`;
        showOverwriteModal();
        return;
      }
      else throw new Error(data.error || 'Failed to generate list');
    }

    const data = await res.json()
    renderGroceryList(data.groceryList, groceryListContainer);
  } catch (err) {
        showError(err.message);
  }
}

function renderGroceryList(groceryList, container) {
  container.innerHTML = '';
  groceryList.aisles.forEach(aisle => {
    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('grocery-category');
    const title = document.createElement('h3');
    title.classList.add('category-title');
    title.textContent = aisle.aisle;
    categoryDiv.appendChild(title);
    const headerRow = document.createElement('div');
    headerRow.classList.add('item-header-row');
    headerRow.innerHTML = `
      <span class="item-header">Item</span>
      <span class="quantity-header">Quantity</span>
      <span class="edit-header">Action</span>
    `;
    categoryDiv.appendChild(headerRow);
    aisle.items.forEach(item => {
      const label = document.createElement('label');
      label.classList.add('checkbox-item');
      label.setAttribute('data-qty', item.amount);
      label.setAttribute('data-unit', item.unit);
      label.setAttribute('data-default-unit', item.amount);
      label.setAttribute('data-aisle', aisle.aisle);
      label.innerHTML = `
        <input  type="checkbox"
                class="purchase-checkbox"
                data-item-id="${item._id}"
                data-aisle="${aisle.aisle}"
                data-grocery-list-id="${groceryList._id}"
                ${item.purchased ? 'checked' : ''}
        />
        <span>${item.name}</span>
        <span class="quantity-display">${item.amount} ${item.unit}</span>
        <button class="edit-btn" onclick="openEditModal(this)">Edit</button>
      `;
      categoryDiv.appendChild(label);
    });
    container.appendChild(categoryDiv);
  });
}

function showError(message) {
  const errorBox = document.getElementById("error-alert");
  const errorText = document.getElementById("error-message");
  errorText.textContent = message;
  errorBox.classList.remove("hidden");
}

function dismissError() {
  document.getElementById("error-alert").classList.add("hidden");
}

function showOverwriteModal() {
  document.getElementById('overwriteModal').classList.add('show');
  document.getElementById('overwriteModal').classList.remove('hidden');
}

function closeOverwriteModal () {
  document.getElementById('overwriteModal').classList.remove('show');
  document.getElementById('overwriteModal').classList.add('hidden');
  pendingGeneration = null;
}

document.getElementById('generate-list-btn').addEventListener('click', generateGroceryList);

document.getElementById('dismissError').addEventListener('click', dismissError);

document.getElementById('confirmOverwriteBtn').addEventListener('click', async ()=>{
  if (!pendingGeneration) return;

  try {
    const token = localStorage.getItem("token");
    const res = await fetch('/api/groceryList/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({ ...pendingGeneration, force: true })
    });
    const data = await res.json()
    renderGroceryList(data.groceryList, groceryListContainer);
  } catch (err) {
    showError(err.message);
  } finally {
    closeOverwriteModal();
  }
})
