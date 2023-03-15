const axios = require('axios');

async function getDateProducts(id) {
  const response = await axios.get(`https://api.escuelajs.co/api/v1/products/${id}`);
  return {
    id: response.data.id,
    productName: response.data.title,
    productPrice: response.data.price,
  };
}

  

module.exports = { getDateProducts };
