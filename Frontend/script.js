document.addEventListener("DOMContentLoaded", function () {
    fetchProducts();

    document.getElementById("product-form").addEventListener("submit", function (event) {
        event.preventDefault();

        let productName = document.getElementById("product-name").value.trim();
        let unitId = document.getElementById("unit-id").value.trim();
        let pricePerUnit = document.getElementById("price-per-unit").value.trim();

        if (!productName || !unitId || !pricePerUnit) {
            alert(" Please fill in all fields!");
            return;
        }

        let productData = {
            name: productName,
            uom_id: parseInt(unitId),
            price_per_unit: parseFloat(pricePerUnit)
        };

        console.log(" Sending Product Data:", productData);

        fetch("http://localhost:5000/addProduct", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(" Error: " + data.error);
                } else {
                    alert(data.message);
                    addProductToUI(data.product);
                    document.getElementById("product-form").reset();
                }
            })
            .catch(error => console.error(" Error adding product:", error));
    });
});

function addProductToUI(product) {
    const productList = document.getElementById("product-list");
    const productRow = document.createElement("div");
    productRow.classList.add("product-row");
    productRow.id = `product-${product.product_id}`;

    productRow.innerHTML = `
        <p>${product.name}</p>
        <p>${product.uom_id}</p>
        <p>${product.price_per_unit} USD</p>
        <button class="delete-btn" data-id="${product.product_id}">Delete</button>
    `;

    productList.appendChild(productRow);

    productRow.querySelector(".delete-btn").addEventListener("click", function () {
        deleteProduct(product.product_id);
    });
}

function fetchProducts() {
    fetch("http://localhost:5000/getProducts")
        .then(response => response.json())
        .then(data => {
            displayProducts(data);
        })
        .catch(error => console.error(" Error fetching products:", error));
}

function displayProducts(products) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

    products.forEach(product => {
        addProductToUI(product);
    });
}

function deleteProduct(productId) {
    console.log("Attempting to delete product with ID:", productId);

    fetch(`http://localhost:5000/deleteProduct/${productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to delete product. Server responded with status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            document.getElementById(`product-${productId}`).remove();
        })
        .catch(error => console.error(" Error deleting product:", error));
}
