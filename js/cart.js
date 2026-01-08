document.addEventListener("DOMContentLoaded", () => {

    async function populateCart() {
        // Clear cart wrapper before rendering
        const wrapper = document.getElementById("order-details-products-wrapper");
        if (wrapper) wrapper.innerHTML = "";

        const cart = await fetchCartById(1);
        const cartProducts = cart.products;
        const productQuantityMapping = {};
        const cartProductDownloadPromise = cartProducts.map((product) => {
            productQuantityMapping[product.productId] = product.quantity;
            return fetchProductById(product.productId);
        });
        // Wait for all products to be fetched
        const products = await Promise.all(cartProductDownloadPromise);

        let totalPrice = 0;
        products.forEach((product) => {
            totalPrice += product.price * productQuantityMapping[product.id];
        });
        document.getElementById("total-price").textContent = totalPrice;
        document.getElementById("net-price").textContent = totalPrice - 10; //assuming some discount

        products.forEach((product) => {
            prepareWrapperDivForCartItems(product, productQuantityMapping, cartProducts);
        });
    }
    populateCart();
})

// async function updateCartAPI(cartId, products) {
//     // PATCH the cart with new products array
//     try {
//         await axios.patch(`https://fakestoreapi.com/carts/${cartId}`, {
//             products: products
//         });
//     } catch (error) {
//         alert("Failed to update cart!");
//     }
// }

function prepareWrapperDivForCartItems(product, productQuantityMapping, cartProducts) {
    // Build cart item markup using the same structure and classes as cart.html
    const wrapper = document.getElementById("order-details-products-wrapper");
    if (!wrapper) return;

    // Create main product container
    const orderDetailsProduct = document.createElement("div");
    orderDetailsProduct.className = "order-details-product d-flex flex-row";

    // Product image
    const orderDetailsProductImg = document.createElement("div");
    orderDetailsProductImg.className = "order-details-product-img d-flex";
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.title;
    orderDetailsProductImg.appendChild(image);

    // Product data
    const orderDetailsProductData = document.createElement("div");
    orderDetailsProductData.className = "order-details-product-data d-flex flex-column justify-content-center";
    const name = document.createElement("div");
    name.textContent = product.title;
    const price = document.createElement("div");
    price.textContent = `$${product.price}`;
    orderDetailsProductData.appendChild(name);
    orderDetailsProductData.appendChild(price);

    // Product actions
    const orderDetailsProductAction = document.createElement("div");
    orderDetailsProductAction.className = "order-details-product-action d-flex flex-column";

    // Quantity selector
    const orderDetailsProductQuantity = document.createElement("div");
    orderDetailsProductQuantity.className = "order-details-product-quantity";
    const quantityLabel = document.createElement("div");
    quantityLabel.textContent = "Quantity";
    quantityLabel.className = "fw-bold";
    const formGroup = document.createElement("div");
    formGroup.className = "form-group";
    const select = document.createElement("select");
    select.className = "form-select";
    for (let i = 1; i <= 10; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        if (i === productQuantityMapping[product.id]) {
            option.selected = true;
        }
        select.appendChild(option);
    }
    formGroup.appendChild(select);
    orderDetailsProductQuantity.appendChild(quantityLabel);
    orderDetailsProductQuantity.appendChild(formGroup);
    orderDetailsProductAction.appendChild(orderDetailsProductQuantity);

    // Remove button
    const removeButton = document.createElement("div");
    removeButton.className = "order-details-product-remove btn btn-danger";
    removeButton.textContent = "Remove";
    orderDetailsProductAction.appendChild(removeButton);

    // Assemble product item
    orderDetailsProduct.appendChild(orderDetailsProductImg);
    orderDetailsProduct.appendChild(orderDetailsProductData);
    orderDetailsProduct.appendChild(orderDetailsProductAction);
    wrapper.appendChild(orderDetailsProduct);

    // Add horizontal rule after each item except last
    // (You may want to handle this in populateCart for better control)

    // Quantity change event
    // select.addEventListener("change", async (e) => {
    //     const newQuantity = Number(e.target.value);
    //     const cartProduct = cartProducts.find(p => p.productId === product.id);
    //     if (cartProduct) {
    //         cartProduct.quantity = newQuantity;
    //         await updateCartAPI(1, cartProducts);
    //         await populateCart();
    //     }
    // });

    // // Remove button event
    // removeButton.addEventListener("click", async () => {
    //     const newCartProducts = cartProducts.filter(p => p.productId !== product.id);
    //     await updateCartAPI(1, newCartProducts);
    //     await populateCart();
    // });
}