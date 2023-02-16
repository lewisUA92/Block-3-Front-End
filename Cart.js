// Class for cart items
class Item{
    // Contructor to make new item object
    constructor(id,count,price,imgPath){
        // Set the properties of the item
        this.id = id;
        this.price=price;
        this.count = count;
        this.imgPath=imgPath;
    }
}

// Cart object
let cart = {
    // List of items in the cart
    items: [], 
    // Function to create the html for a single item
    createHtmlForItem: function (item){
        let html = `<div class="row">
            <div class="card mb-3" style="max-width: 540px; background-color:darkgray;">
                <div class="row no-gutters">
                    <div class="col-md-4">
                        <img src="${item.imgPath}" class="card-img" alt="${item.id}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${item.id}</h5>
                            <p class="card-text">£${item.price}</p>
                        </div>
                        <input id="${item.id}-quantity" min="0" name="quantity" value="${item.count}" type="number" class="form-control form-control-sm" style="background-color: darkgrey;"/>
                    </div>
                </div>
            </div>
        </div>`
        return html;
    },
    // Function to add event listeners to the quantity inputs
    updateListeners: function(){
        // Go through each item of the cart using a for loop
        for (let i=0;i<cart.items.length;i++){
            let id=cart.items[i].id;
            let fourmId=id+"-quantity";
            // Add event listener to the item
            document.getElementById(fourmId).addEventListener('click', function(e) {
                // Call the update count function to update the count of the item
                updateCount(id,fourmId);
            });
        }
    },
    // Function to update the html of the cart
    updateHtml: function() {
        // Clear the html of the cart
        document.getElementById('cart-container').innerHTML = "";
        // Go through each item of the cart using a for loop
        for (let i=0;i<cart.items.length;i++){
            let item = cart.items[i];
            let html = this.createHtmlForItem(item);
            // Add generated html to the cart page
            document.getElementById('cart-container').innerHTML += html;
            
        }
    },
    // Function to change the count of an item
    changeCount: function(id,count){
        // Go through each item of the cart using a for loop
        for (let i = 0; i < this.items.length; i++) {
            // Check if the item id matches the id of the item to be updated
            if (this.items[i].id === id) {
                // Update the count of the item
                this.items[i].count = count;
                // Remove the item from the cart if the count is 0
                if (count==0){
                    this.removeItem(this.items[i]);
                    cart.updateHtml();
                    cart.updateListeners();
                };
                break;
            }
        }
        // Update the cart storage and total
        this.updateStorage();
        this.updateTotal();
    },
    // Function to update the total price of the cart
    updateTotal: function(){
        // Set the total to 0
        let total = 0;
        // Go through each item of the cart using a for loop
        for (let i = 0; i < this.items.length; i++) {
            // Add the price of the item * the amount of the item to the total
            total += this.items[i].price * this.items[i].count;
        }
        // Update the html of the total price
        document.getElementById('cart-total').innerHTML = "Total: £" + total.toFixed(2);
    },
    // Function to add an item to the cart
    addItem: function(item) {
        // Check if the item is already in the cart
        let found = false;
        // Go through each item of the cart using a for loop
        for (let i = 0; i < this.items.length; i++) {
            // Check if the item id matches the id of the item to be added and set found to true
            if (this.items[i].id === item.id) {
                found = true;
                break;
            }
        }
        // Add the item to the cart if it is not already in the cart
        if (!found){
            // Add the item to the items list
            this.items.push(item);
            // Update the cart storage and total
            this.updateStorage();
        }
    },
    // Function to remove an item from the cart
    removeItem: function(item) {
        // Remove the item from the items list
        this.items.splice(this.items.indexOf(item), 1);
        // Update the session storage
        this.updateStorage();
    },
    // Function to update the session storage
    updateStorage: function() {
        // Convert item to json and save to session storage
        sessionStorage.setItem('items', JSON.stringify(this.items));
    },
    // Function to load the cart from session storage
    loadCart: function() {
        // Load the items from session storage
        let items = JSON.parse(sessionStorage.getItem('items'));
        if (items) {
            this.items = items;
        }
    }
};

// Function to update count function of an item by the form value
function updateCount(id,fourmId){
    let count = document.getElementById(fourmId).value;
    cart.changeCount(id,count);
}

// Function to add an item to the cart
function addItem(id,price,imgPath){
    let item = new Item(id,1,price,imgPath);
    cart.addItem(item);
}   

// Function that is run when the page is loaded 
onload = function() {
    // Load the cart from session storage
    cart.loadCart();
    // Save the cart to session storage
    cart.updateStorage();
    // Update the html of the cart
    cart.updateHtml();
    // Update the event listeners of the cart
    cart.updateListeners();
    // Update the total price of the cart
    cart.updateTotal();
};