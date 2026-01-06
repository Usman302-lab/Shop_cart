document.addEventListener("DOMContentLoaded", () => {
  async function populateProduct() {
    const queryParams = getQueyParams();
    if (queryParams["id"]) {
      const productId = queryParams["id"];
      const product = await fetchProductById(productId);
        const productImg=document.getElementById("product-img");
        const productName=document.getElementById("product-name");
        const productPrice=document.getElementById("product-price");
        const productDescriptionData=document.getElementById("product-description-data");

        productImg.src=product.image;
        productImg.alt=product.title;
        productName.textContent=product.title;
        productPrice.textContent=`$${product.price.toFixed(2)}`;
        productDescriptionData.textContent=product.description;


    }
  }
  populateProduct();
});
