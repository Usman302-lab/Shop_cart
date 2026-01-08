async function fetchCategories() {
    showLoader();
    try {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        const data = await response.json();
        return data;
    } finally {
        hideLoader();
    }
}

async function populateCategories() {
    const categories = await fetchCategories();
    console.log("categories", categories)
    const categoryList = document.getElementById("cateogryList");
    categories.forEach((category) => {
        const categoryHolder = document.createElement("div");
        const categoryLink = document.createElement("a");
        categoryLink.href = `productList.html?category=${category}`;
        categoryLink.textContent = category;
        categoryHolder.classList.add("cateogry-item", "d-flex", "align-items-center", "justify-content-center");
        categoryHolder.appendChild(categoryLink);
        categoryList.appendChild(categoryHolder);
    })
}

populateCategories();