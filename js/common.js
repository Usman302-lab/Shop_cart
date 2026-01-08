// Loader logic for use across the app
function showLoader() {
  const customLoader = document.getElementById("customLoader");
  if (customLoader) {
    customLoader.style.display = "flex";
  }
}

function hideLoader() {
  const customLoader = document.getElementById("customLoader");
  if (customLoader) {
    customLoader.style.display = "none";
  }
}

// Optionally, expose globally
window.showLoader = showLoader;
window.hideLoader = hideLoader;

function getQueyParams() {
  const queryParams = new URLSearchParams(window.location.search);
  const queryParamsObject = Object.fromEntries(queryParams.entries());
  return queryParamsObject;
}

async function fetchProductById(id) {
  const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
  return response.data;
}

async function fetchCartById(id) {
  const response = await axios.get(`https://fakestoreapi.com/carts/${id}`);
  return response.data;
}
