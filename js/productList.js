document.addEventListener("DOMContentLoaded", async () => {
  // Loader logic is now in common.js

  // Fetch all products
  async function fetchProducts() {
    showLoader();
    try {
      const response = await axios.get("https://fakestoreapi.com/products");
      console.log("Fetched products:", response.data.length);
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to load products. Please try again.");
      return [];
    } finally {
      hideLoader();
    }
  }

  // Fetch all categories
  async function fetchCategories() {
    showLoader();
    try {
      const response = await axios.get(
        "https://fakestoreapi.com/products/categories"
      );
      console.log("Fetched categories:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    } finally {
      hideLoader();
    }
  }

  // Filter products by category
  const filterProductsByCategory = async (category) => {
    showLoader();
    try {
      const response = await axios.get(
        `https://fakestoreapi.com/products/category/${category}`
      );
      return response.data;
    } catch (error) {
      console.error("Error filtering by category:", error);
      alert("Failed to filter by category. Please try again.");
      return [];
    } finally {
      hideLoader();
    }
  };

  // Global variable to store downloaded products
  let downloadedProducts = [];

  // Populate products in the UI
  async function populateProducts(products) {
    try {
      const productList = document.getElementById("productList");
      productList.innerHTML = "";

      if (products.length === 0) {
        productList.innerHTML = `
          <div class="col-12 text-center py-5">
            <h4>No products found</h4>
            <p>Try adjusting your search or filters</p>
          </div>
        `;
        return;
      }

      products.forEach((product) => {
        const productItem = document.createElement("a");
        productItem.target = "_blank";
        productItem.classList.add(
          "product-item",
          "text-decoration-none",
          "d-inline-block"
        );
        productItem.href = `productDetails.html?id=${product.id}`;

        // Product image
        const productImage = document.createElement("div");
        productImage.classList.add("product-img");

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.title;
        image.style.width = "100%";
        image.style.height = "200px";
        image.style.objectFit = "contain";
        image.style.backgroundColor = "#f8f9fa";
        image.style.padding = "10px";
        image.style.borderRadius = "8px";
        productImage.appendChild(image);

        // Product name
        const productName = document.createElement("div");
        productName.classList.add(
          "product-name",
          "text-center",
          "mt-2",
          "fw-bold"
        );
        productName.textContent =
          product.title.length > 20
            ? product.title.substring(0, 20) + "..."
            : product.title;

        // Product price
        const productPrice = document.createElement("div");
        productPrice.classList.add(
          "product-price",
          "text-center",
          "text-success",
          "fw-bold"
        );
        productPrice.textContent = `$${product.price.toFixed(2)}`;

        // Product category badge
        const productCategory = document.createElement("div");
        productCategory.classList.add(
          "product-category",
          "text-center",
          "text-muted",
          "small"
        );
        productCategory.textContent = product.category;

        // Assemble product card
        productItem.appendChild(productImage);
        productItem.appendChild(productName);
        productItem.appendChild(productPrice);
        productItem.appendChild(productCategory);

        // Add hover effect
        productItem.style.cssText = `
          margin: 10px;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 10px;
          transition: all 0.3s ease;
          width: 220px;
        `;
        productItem.onmouseover = () => {
          productItem.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
          productItem.style.transform = "translateY(-5px)";
        };
        productItem.onmouseout = () => {
          productItem.style.boxShadow = "none";
          productItem.style.transform = "translateY(0)";
        };

        productList.appendChild(productItem);
      });
    } catch (error) {
      console.error("Error populating products:", error);
      const productList = document.getElementById("productList");
      productList.innerHTML = `
        <div class="col-12 text-center py-5">
          <h4 class="text-danger">Error loading products</h4>
          <p>Please refresh the page or try again later</p>
        </div>
      `;
    }
  }

  // Initialize the page
  async function initializePage() {
    try {
      // Fetch products and categories simultaneously
      showLoader();
      const [products, categories] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ]);

      downloadedProducts = products;

      // Populate products
      await populateProducts(products);

      // Populate categories
      populateCategories(categories);

      // Setup event listeners
      setupEventListeners();
    } catch (error) {
      console.error("Error initializing page:", error);
    } finally {
      hideLoader();
    }
  }

  // Populate categories in sidebar
  function populateCategories(categories) {
    const categoryList = document.getElementById("categoryList");
    categoryList.innerHTML = "";

    // Add "All Categories" option
    const allCategoriesLink = document.createElement("a");
    allCategoriesLink.href = "productList.html";
    allCategoriesLink.textContent = "All Categories";
    allCategoriesLink.classList.add(
      "d-flex",
      "text-decoration-none",
      "mb-2",
      "p-2",
      "bg-primary",
      "text-white",
      "rounded",
      "category-link"
    );
    allCategoriesLink.onclick = (e) => {
      e.preventDefault();
      populateProducts(downloadedProducts);
    };
    categoryList.appendChild(allCategoriesLink);

    // Add each category
    categories.forEach((category) => {
      const categoryLink = document.createElement("a");
      categoryLink.href = "#";
      categoryLink.textContent =
        category.charAt(0).toUpperCase() + category.slice(1);
      categoryLink.classList.add(
        "d-flex",
        "text-decoration-none",
        "mb-2",
        "p-2",
        "bg-light",
        "rounded",
        "category-link"
      );
      categoryLink.onclick = async (e) => {
        e.preventDefault();
        const filteredProducts = await filterProductsByCategory(category);
        await populateProducts(filteredProducts);
      };
      categoryList.appendChild(categoryLink);
    });
  }

  // Setup all event listeners
  function setupEventListeners() {
    // Price filter search button
    const filterSearch = document.getElementById("search");
    filterSearch.addEventListener("click", async () => {
      const minPrice = Number(document.getElementById("minPrice").value);
      const maxPrice = Number(document.getElementById("maxPrice").value);

      if (minPrice > maxPrice) {
        alert("Minimum price cannot be greater than maximum price!");
        return;
      }

      const filteredProducts = downloadedProducts.filter(
        (product) => product.price >= minPrice && product.price <= maxPrice
      );

      await populateProducts(filteredProducts);
    });

    // Clear filters button
    const resetFilter = document.getElementById("clear");
    resetFilter.addEventListener("click", () => {
      // Reset price filters
      document.getElementById("minPrice").value = "0";
      document.getElementById("maxPrice").value = "1000";

      // Reset search input
      document.getElementById("searchInput").value = "";

      // Show all products
      populateProducts(downloadedProducts);
    });

    // Search input functionality
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();

      if (searchTerm === "") {
        populateProducts(downloadedProducts);
        return;
      }

      const filteredProducts = downloadedProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
      );

      populateProducts(filteredProducts);
    });
  }

  // Start the application
  await initializePage();
});
