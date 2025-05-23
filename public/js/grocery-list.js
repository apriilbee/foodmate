const token = localStorage.getItem("token");

document.getElementById('generate-list-btn').addEventListener('click', async () => {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  try {
    const response = await fetch('/api/groceryList/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({ start: startDate, end: endDate })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to generate list');
    renderGroceryList(data.groceryList);
  } catch (err) {
        showError(err.message);
  }
});

document.addEventListener("change", async (e) => {
  if (e.target.classList.contains("purchase-checkbox")) {
    const checkbox = e.target;
    const itemId = checkbox.dataset.itemId;
    const aisle = checkbox.dataset.aisle;
    const groceryListId = checkbox.dataset.groceryListId;
    const purchased = checkbox.checked;

    try {
      const response = await fetch(`/api/groceryList/${groceryListId}`, {
        method: 'PATCH',
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          updates: [{ aisle, item: { _id: itemId, purchased } }]
        })
      });

      if (!response.ok) {
        throw new Error("Failed to update item.");
      }

    } catch (err) {
      console.error("Error updating item:", err);
      document.getElementById('error-message').textContent = err.message;
      document.getElementById('error-alert').classList.remove('hidden');
    }
  }
});
      let currentItemElement = null;

function openEditModal(btn) {
        const label = btn.closest('.checkbox-item');
        const itemName = label.querySelector('span').textContent;
        currentItemElement = label;
        console.log(label)
        document.getElementById('modalItemName').textContent = `Edit "${itemName}"`;
        document.getElementById('unitDisplayText').textContent =
          label.getAttribute('data-unit') || label.getAttribute('data-default-unit') || '';
        document.getElementById('modalQtyInput').value = label.getAttribute('data-qty') || '1';

        document.getElementById('editModal').classList.remove('hidden');
}

function closeModal() {
        document.getElementById('editModal').classList.add('hidden');
        currentItemElement = null;
}

function increaseModalQty() {
        const input = document.getElementById('modalQtyInput');
        input.value = parseInt(input.value) + 1;
}

function decreaseModalQty() {
        const input = document.getElementById('modalQtyInput');
        if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
}

async function saveChanges() {
  const qty = document.getElementById('modalQtyInput').value;
  const unit = document.getElementById('unitDisplayText').textContent.trim();

  if (currentItemElement) {
    const itemId = currentItemElement.querySelector('input').dataset.itemId;
    const aisle = currentItemElement.querySelector('input').dataset.aisle;
    const groceryListId = currentItemElement.querySelector('input').dataset.groceryListId;
  
    currentItemElement.setAttribute('data-qty', qty);
    currentItemElement.setAttribute('data-unit', unit);
    currentItemElement.querySelector('.quantity-display').textContent = `${qty} ${unit}`;
  
    try {
      const response = await fetch(`/api/groceryList/${groceryListId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          updates: [{
            aisle,
            item: {
              _id: itemId,
              amount: qty,
              unit: unit
            }
          }]
        })
      });
    
      if (!response.ok) {
        throw new Error('Failed to save changes');
      }
    
    } catch (err) {
      console.error(err);
    }
  }
  closeModal();
}

function renderGroceryList(groceryList) {
  const container = document.getElementById('grocery-list-container');
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