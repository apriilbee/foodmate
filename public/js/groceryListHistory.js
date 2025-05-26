/* global io */

let socket = io();
let currentListId = null;

document.querySelectorAll('.gh-list-item').forEach(item => {
  item.addEventListener('click', async () => {
    document.querySelectorAll('.gh-list-item').forEach(i => i.classList.remove('active-list'));
    item.classList.add('active-list');

    const startDate = item.dataset.startdate;
    const endDate = item.dataset.enddate;
    const id = item.dataset.groceryListId;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/groceryList/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch grocery list');
      const data = await response.json();
      document.getElementById('grocery-details-dates').innerHTML = `
        <h6>${startDate} - ${endDate}</h6>
        <p>Grocery List Owner: ${data.owner}</p>
      `;
      console.log(data);
      renderGroceryList(data.list, data.owned);

      document.getElementById('log-details').textContent = `Logs for list: ${startDate} - ${endDate}`;

      if (currentListId) {
        socket.emit("leaveGroceryRoom", currentListId);
      }

      socket.emit("joinGroceryRoom", id);
      currentListId = id;

      const logContainer = document.getElementById("log-container");
      logContainer.innerHTML = "";
      renderPreviousLogs(data.list.logs);

    } catch (err) {
      console.error(err);
    }
  });
});

socket.on("logMessage", async (log) => {
  const logContainer = document.getElementById("log-container");
  createLogElement(log.logEntry, logContainer);
  try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/groceryList/${log.groceryId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch grocery list');
      const data = await response.json();
      renderGroceryList(data.list, data.owned);
  }
  catch (err) {
    console.error(err);
  }
});

function renderGroceryList(groceryList, owned) {
  const container = document.getElementById('grocery-details');
  container.innerHTML = '';

  if (owned) {
      const shareBtnContainer = document.getElementById('share-btn-container');
      shareBtnContainer.innerHTML = "";
      const shareBtn = document.createElement('button');
      shareBtn.textContent = 'Share';
      shareBtn.classList.add('share-btn');
      shareBtn.addEventListener('click', () => openShareModal(groceryList._id));
      shareBtnContainer.appendChild(shareBtn);
  }
  
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
        <input type="checkbox"
               class="purchase-checkbox"
               data-item-id="${item._id}"
               data-aisle="${aisle.aisle}"
               data-grocery-list-id="${groceryList._id}"
               ${item.purchased ? 'checked' : ''}
        />
        <span>${item.name}</span>
        <span class="quantity-display">${item.amount} ${item.unit}</span>
        <span class="btn-display"><button class="edit-btn" onclick="openEditModal(this)">Edit</button></span>
      `;
      categoryDiv.appendChild(label);
    });

    container.appendChild(categoryDiv);
  });
}

function renderPreviousLogs(logs) {
  const logContainer = document.getElementById("log-container");
  logs.forEach(log => {
    createLogElement(log, logContainer);
  })
}

function createLogElement (log, logContainer) {
  const logEl = document.createElement("div");
  logEl.classList.add("log-entry");
  const ts = new Date(log.timestamp);
  const day = String(ts.getDate()).padStart(2, '0');
  const month = String(ts.getMonth() + 1).padStart(2, '0');
  const year = ts.getFullYear();
  const time = ts.toLocaleTimeString();

  logEl.textContent = `[${day}/${month}/${year} ${time}] ${log.message}`;
  logContainer.appendChild(logEl); 
}

function openShareModal(groceryListId) {
  document.getElementById('share-modal').style.display = 'block';
  document.getElementById('share-grocery-list-id').value = groceryListId;
}