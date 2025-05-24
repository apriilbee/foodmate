document.querySelectorAll('.gh-list-item').forEach(item => {
  item.addEventListener('click', async () => {
    document.querySelectorAll('.gh-list-item').forEach(i => i.classList.remove('active-list'));
    item.classList.add('active-list')
    const startDate = item.dataset.startdate;
    const endDate = item.dataset.enddate;
    const id = item.dataset.groceryListId
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/groceryList/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if(!response.ok) throw new Error('Failed to fetch grocery list');
      const data = await response.json()
      document.getElementById('grocery-details-dates').innerHTML = 
      `
        <h6>${startDate} - ${endDate}</h6>
      `;
      renderGroceryList(data.list)
      document.getElementById('log-details').textContent = `Logs for list ID: ${id}`
    } catch (err) {
      console.error(err);
    }
  });
});

function renderGroceryList(groceryList) {
  const container = document.getElementById('grocery-details');
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