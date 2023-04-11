const itemForm = document.querySelector("#item-form");
const formBtn = itemForm.querySelector("button");
const itemInput = document.querySelector("#item-input");
const itemList = document.querySelector("#item-list");
const clearBtn = document.querySelector("#clear");
const itemFilter = document.querySelector("#filter");
isEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemFromStorage();
  itemsFromStorage.forEach((item) => addItemToDom(item));
  checkUI();
}

function onSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  // Validate the input
  if (newItem === "") {
    alert("Please type in a new item");
    return;
  }

  // Check if edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert("That item already exists!");
    }
  }

  // Create item DOM element
  addItemToDom(newItem);

  // Add item to local storage
  addItemToStorage(newItem);
  checkUI();
}

function addItemToDom(item) {
  // Create list item
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));

  const button = creatButton("remove-item btn-link text-red");
  li.appendChild(button);

  // Add li items to the DOM
  itemList.appendChild(li);
  itemInput.value = "";
}

function creatButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  button.innerHTML = `
  <svg class="icon">
  <use href="sprite.svg#delete"></use>
  </svg>
  `;
  return button;
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemFromStorage();
  itemsFromStorage.push(item);

  // Convert to JSON string and save to local storage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function getItemFromStorage() {
  let itemsFromStorage;
  let storedItems = localStorage.getItem("items");
  if (storedItems === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(storedItems);
  }

  return itemsFromStorage;
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemFromStorage();
  return itemsFromStorage.includes(item);
}

function onItemClick(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function setItemToEdit(item) {
  isEditMode = true;

  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));

  item.classList.add("edit-mode");
  formBtn.innerHTML = `
  <svg class="icon edit-icon">
  <use href="sprite.svg#edit"></use>
  </svg>
  Update Item
  `;
  formBtn.style.background = "#ff6b6b";
  itemInput.value = item.textContent.trim();
}

function removeItem(item) {
  if (confirm("Are you sure?")) {
    // Remove item from DOM
    item.remove();

    // Remove item from storage
    removeItemFromStorage(item.textContent);

    checkUI();
  }
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemFromStorage();

  // Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i.trim() !== item.trim());

  // Re-set the new array to local storage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function clearItems() {
  // Clear from DOM
  if (confirm("This action is irreversible. Are you sure?")) {
    while (itemList.firstChild) {
      itemList.removeChild(itemList.firstChild);
    }

    // Clear from storage
    localStorage.removeItem("items");
  }

  checkUI();
}

function filterItems(e) {
  const items = itemList.querySelectorAll("li");
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

function checkUI() {
  const items = itemList.querySelectorAll("li");

  if (items.length === 0) {
    clearBtn.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    itemFilter.style.display = "block";
  }

  formBtn.innerHTML = `<svg class="icon"><use href="sprite.svg#plus"></use></svg>Add Item`;
  formBtn.style.background = "#333";
  isEditMode = false;
}

// Initialize app

function init() {
  // Event Listeners
  itemForm.addEventListener("submit", onSubmit);
  itemList.addEventListener("click", onItemClick);
  clearBtn.addEventListener("click", clearItems);
  itemFilter.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);

  checkUI();
}

init();
