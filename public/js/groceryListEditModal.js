function openEditModal(btn) {
        const label = btn.closest('.checkbox-item');
        const itemName = label.querySelector('span').textContent;
        currentItemElement = label;
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

document.getElementById('decreaseModalQty').addEventListener('click', decreaseModalQty);

document.getElementById('increaseModalQty').addEventListener('click', increaseModalQty);

document.getElementById('saveChanges').addEventListener('click', saveChanges);

document.getElementById('closeModal').addEventListener('click', closeModal);

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

window.groceryList_openEditModal = openEditModal;