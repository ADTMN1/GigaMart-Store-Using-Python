document.addEventListener("DOMContentLoaded", function () {
    fetchProducts(); // Load products when the page loads
});

// Function to fetch products from Flask API
function fetchProducts() {
    fetch("http://localhost:5000/getProducts")
        .then(response => response.json()) // Convert response to JSON
        .then(data => {
            displayProducts(data); // Call function to display products
        })
        .catch(error => console.error("Error fetching products:", error));
}

// Function to display products in the UI
function displayProducts(products) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ""; // Clear previous content

    products.forEach(product => {
        const productRow = document.createElement("div");
        productRow.classList.add("product-row");
        productRow.id = `product-${product.id}`; // Assign unique ID

        productRow.innerHTML = `
            <p>${product.name}</p>
            <p>${product.unit}</p>
            <p>${product.price_per_unit} USD</p>
            <button class="delete-btn" data-id="${product.id}">Delete</button>
        `;

        productList.appendChild(productRow);
    });

    // Attach event listeners to DELETE buttons
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", function () {
            const productId = this.getAttribute("data-id");
            if (productId) {
                deleteProduct(productId);
            } else {
                console.error("Product ID is undefined:", productId);
            }
        });
    });
}

// Function to delete a product
function deleteProduct(productId) {
    console.log("Attempting to delete product with ID:", productId);

    fetch(`http://localhost:5000/deleteProduct/${productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to delete product");
            }
            return response.json();
        })
        .then(data => {
            alert(data.message); // Show success message
            document.getElementById(`product-${productId}`).remove(); // Remove from UI
        })
        .catch(error => console.error("Error deleting product:", error));
}
