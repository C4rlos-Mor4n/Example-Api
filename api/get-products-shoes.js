const axios = require('axios');

async function getCategoryProducts() {
    const productsResponse = await axios.get('https://api.escuelajs.co/api/v1/products/?categoryId=4');
    const products = productsResponse.data.slice(0, 4); // Obtener solo los primeros 4 productos
    return products.map((product) => ({
      id: product.id,
      imageUrl: product.images[0],
      productName: product.title,
      productPrice: product.price,
    }));
    
  }
  

module.exports = { getCategoryProducts };
