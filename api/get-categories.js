const axios = require('axios');

async function getCategories() {
  try {
    const response = await axios.get('https://api.escuelajs.co/api/v1/categories');

    const buttons = response.data.filter(category => {
      const name = category.name.toLowerCase();
      return name.includes('shoes') || name.includes('electronics');
    }).map(category => {
      return {
        buttonId: category.id,
        buttonText: { displayText: category.name },
        type: 1
      }
    });
    
    return buttons;
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = { getCategories };
