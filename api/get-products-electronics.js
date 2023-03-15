const axios = require('axios');

async function getCategoryProductsElectronics() {
    const productsResponse = await axios.get('https://api.escuelajs.co/api/v1/products/?categoryId=2');
    const products = productsResponse.data.slice(1, 4); // Obtener solo los primeros 4 productos
    return products.map((product) => ({
      id: product.id,
      imageUrl: product.images[0],
      productName: product.title,
      productPrice: product.price,
    }));
    
  }
  

module.exports = { getCategoryProductsElectronics };
