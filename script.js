// Function to add a new product to the database
function addProduct() {
    const name = document.getElementById("productName").value.trim();
    const unit = document.getElementById("productUnit").value.trim();
    const price = document.getElementById("productPrice").value.trim();

    // Ensure fields are not empty
    if (!name || !unit || !price) {
        alert("Please fill all fields!");
        return;
    }

    // Create product object
    const productData = {
        name: name,
        unit: unit,
        price_per_unit: parseFloat(price) // Convert to number
    };

    // Send a POST request to Flask backend
    fetch("http://localhost:5000/addProduct", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(productData)
    })
        .then(response => response.json())
        .then(data => {
            console.log("Product added:", data);
            alert("Product added successfully!");
            fetchProducts(); // Refresh the product list
        })
        .catch(error => console.error("Error adding product:", error));
}

// Fetch data from Flask backend and display it
function fetchProducts() {
    fetch("http://localhost:5000/getProducts")
        .then(response => response.json())
        .then(data => {
            console.log("Fetched products:", data);
            displayProducts(data);
        })
        .catch(error => console.error("Error fetching products:", error));
}

// Function to display products properly aligned
function displayProducts(products) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ""; // Clear previous data

    products.forEach(product => {
        const row = document.createElement("div");
        row.classList.add("row");

        row.innerHTML = `
            <p>${product.name}</p>
            <p>${product.unit || "N/A"}</p>
            <p>${product.price_per_unit} USD</p>
            <p><button onclick="deleteProduct(${product.id})">Delete</button></p>
        `;

        productList.appendChild(row);
    });
}

// Function to delete a product
function deleteProduct(productId) {
    fetch(`http://localhost:5000/deleteProduct/${productId}`, { method: "DELETE" })
        .then(response => response.json())
        .then(data => {
            console.log("Deleted:", data);
            fetchProducts(); // Refresh product list
        })
        .catch(error => console.error("Error deleting product:", error));
}

// Load products when the page loads
window.onload = fetchProducts;
