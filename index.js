const itemForm = document.querySelector("#item-form");
const itemInput = document.querySelector("#item-input");
const itemList = document.querySelector("#item-list");

function addItem(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  // Validate the input
  if (newItem === "") {
    alert("Please type in a new item");
    return;
  }

  // Create list item
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(newItem));

  const button = creatButton("remove-item btn-link text-red");

  li.appendChild(button);

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

// Event Listeners
itemForm.addEventListener("submit", addItem);
