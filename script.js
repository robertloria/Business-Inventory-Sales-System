
let products = JSON.parse(
    localStorage.getItem("products")
) || [];

let sales = JSON.parse(
    localStorage.getItem("sales")
) || [];


// Switch Pages
function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.add("hidden");
    });

    document.getElementById(pageId).classList.remove("hidden");

    updateDashboard();
    displayProducts();
    displayInventory();
    populateSaleProducts();
    displaySales();
}


// Add Product
function addProduct() {

    let name = document.getElementById("productName").value.trim();
    let price = Number(document.getElementById("productPrice").value);
    let stock = Number(document.getElementById("productStock").value);

    if (name === "" ||
        document.getElementById("productPrice").value === "" ||
        document.getElementById("productStock").value === "" ||
        !Number.isFinite(price) ||
        !Number.isInteger(stock) ||
        price < 0 || stock < 0) {

        alert("Please enter valid product information!");
        return;
    }

    let product = {
        id: Date.now(),
        name: name,
        price: price,
        stock: stock
    };

    products.push(product);

    saveProducts();

    displayProducts();
    displayInventory();
    populateSaleProducts();
    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productStock").value = "";

    alert("Product added successfully!");
}


// Display Products
function displayProducts() {
    const productList = document.getElementById("productList");

    productList.innerHTML = "";

    products.forEach(product => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${product.name}</td>
            <td>₱${Number(product.price).toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>
                <button onclick="editProduct(${product.id})">Edit</button>
                <button onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        `;

        productList.appendChild(row);
    });
}
    
function displayInventory() {

    let inventoryList =
        document.getElementById("inventoryList");

    let inventoryCount =
        document.getElementById("inventoryCount");

    inventoryList.innerHTML = "";

    inventoryCount.textContent = products.length;

    products.forEach(product => {

        let row = document.createElement("tr");

        let status = product.stock <= 5
            ? "Low Stock"
            : "Available";

        row.innerHTML = `
            <td>${product.name}</td>
            <td>₱${Number(product.price).toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>${status}</td>
        `;

        inventoryList.appendChild(row);
    });
}



// Delete Product
function deleteProduct(id) {

    if (!confirm("Are you sure you want to delete this product?")) {
        return;
    }

    products = products.filter(product => product.id !== id);

    saveProducts();
    displayProducts();
    populateSaleProducts();
}


// Save Products
function saveProducts() {

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

    updateDashboard();
}


// Save Sales
function saveSales() {

    localStorage.setItem(
        "sales",
        JSON.stringify(sales)
    );

    updateDashboard();
}


// Update Dashboard
function updateDashboard() {

    document.getElementById("totalProducts").textContent =
        products.length;

    let total = sales.reduce((sum, sale) => {
        return sum + Number(sale.total);
    }, 0);

    document.getElementById("totalSales").textContent =
        "₱" + total.toFixed(2);

    let lowStockCount = products.filter(product => {
        return Number(product.stock) <= 5;
    }).length;

    document.getElementById("lowStock").textContent =
        lowStockCount;
}



// Populate Product Selection
function populateSaleProducts() {

    let select = document.getElementById("saleProduct");

    select.innerHTML = '<option value="">Choose a product</option>';

    products.forEach(product => {

        let option = document.createElement("option");

        option.value = product.id;
        option.textContent =
            product.name + " (Stock: " + product.stock + ")";

        select.appendChild(option);
    });

    calculateTotal();
}


// Calculate Sale Total
function calculateTotal() {

    let productId =
        Number(document.getElementById("saleProduct").value);

    let quantity =
        Number(document.getElementById("saleQuantity").value);

    let product = products.find(p => p.id === productId);

    let total = 0;

    if (
        product &&
        Number.isInteger(quantity) &&
        quantity > 0 &&
        quantity <= product.stock
    ) {
        total = product.price * quantity;
    }

    document.getElementById("saleTotal").textContent =
        "₱" + total.toFixed(2);
}


// Complete Sale
function completeSale() {

    let productId =
        Number(document.getElementById("saleProduct").value);

    let quantity =
        Number(document.getElementById("saleQuantity").value);

    let product = products.find(p => p.id === productId);

    if (!product) {
        alert("Please select a product!");
        return;
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
        alert("Please enter a valid quantity!");
        return;
    }

    if (quantity > product.stock) {
        alert("Not enough stock available!");
        return;
    }

    let total = product.price * quantity;

    let confirmSale = confirm(
        "Product: " + product.name +
        "\nQuantity: " + quantity +
        "\nTotal: ₱" + total.toFixed(2) +
        "\n\nConfirm this sale?"
    );

    if (!confirmSale) {
        return;
    }

    // Deduct sold quantity
    product.stock -= quantity;

    // Record transaction
    let sale = {
        id: Date.now(),
        productName: product.name,
        quantity: quantity,
        total: total,
        date: new Date().toLocaleString()
    };

    sales.push(sale);

    // Save updated information
    saveProducts();
    saveSales();

    // Refresh displays
    populateSaleProducts();
    displayProducts();
    displayInventory();
    displaySales();
    updateDashboard();

    document.getElementById("saleQuantity").value = "";

    alert("Sale completed successfully!");
}


// Display Sales History
function displaySales() {
    const lists = [
        document.getElementById("salesList"),
        document.getElementById("historyList")
    ];

    lists.forEach(list => {
        if (!list) return;

        list.innerHTML = "";

        sales.slice().reverse().forEach(sale => {
            const row = document.createElement("tr");

            const values = [
                sale.productName,
                sale.quantity,
                "₱" + Number(sale.total).toFixed(2),
                sale.date
            ];

            values.forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            list.appendChild(row);
        });
    });
}


// Initialize Program
document.addEventListener("DOMContentLoaded", function() {

    updateDashboard();
    displayProducts();
    populateSaleProducts();
    displaySales();

});

// Display Inventory
function displayInventory() {
    const inventoryList = document.getElementById("inventoryList");
    const inventoryCount = document.getElementById("inventoryCount");

    inventoryList.innerHTML = "";

    inventoryCount.textContent = products.length;

    products.forEach(product => {
        const row = document.createElement("tr");

        const status = product.stock <= 5
            ? "Low Stock!"
            : "In Stock";

        row.innerHTML = `
            <td>${product.name}</td>
            <td>₱${Number(product.price).toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>${status}</td>
        `;

        inventoryList.appendChild(row);
    });
}
function editProduct(id) {
    const product = products.find(p => p.id === id);

    if (!product) return;

    const newName = prompt("Enter new product name:", product.name);
    if (newName === null) return;

    const newPrice = prompt("Enter new price:", product.price);
    if (newPrice === null) return;

    const newStock = prompt("Enter new stock:", product.stock);
    if (newStock === null) return;

    if (
        newName.trim() === "" ||
        !Number.isFinite(Number(newPrice)) ||
        Number(newPrice) <= 0 ||
        !Number.isInteger(Number(newStock)) ||
        Number(newStock) < 0
    ) {
        alert("Please enter valid product details.");
        return;
    }

    product.name = newName.trim();
    product.price = Number(newPrice);
    product.stock = Number(newStock);

    saveProducts();
    displayProducts();
    displayInventory();
    updateDashboard();

    alert("Product updated successfully!");
}
function searchProducts() {
    const searchValue = document
        .getElementById("searchProduct")
        .value.toLowerCase();

    const productList = document.getElementById("productList");

    productList.innerHTML = "";

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchValue)
    );

    filteredProducts.forEach(product => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${product.name}</td>
            <td>₱${Number(product.price).toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>
                <button onclick="editProduct(${product.id})">Edit</button>
                <button onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        `;

        productList.appendChild(row);
    });
}
