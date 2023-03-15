const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const { getCategories } = require('./api/get-categories')
const { getCategoryProducts } = require('./api/get-products-shoes')
const { getCategoryProductsElectronics } = require('./api/get-products-electronics')
const { getDateProducts } = require('./api/get-date-products')
const axios = require('axios');
const express = require('express')
const app = express()


const flowBooks = addKeyword('Electronics')
  .addAnswer('Estos son los Libros que tenemos para ti: ')
  .addAction(async(ctx, {provider}) => {
    const id = ctx.key.remoteJid;
    const products = await getCategoryProductsElectronics();
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const buttons = [
        { buttonId: `${product.id}`, buttonText: {displayText: 'Quiero Comprarlo'}, type: 1 },
      ];

      const buttonMessage = {
        image: {url: product.imageUrl},
        caption: product.productName,
        footer: `$${product.productPrice}`,
        buttons: buttons,
        headerType: 4,
      };
      
      const a = await provider.getInstance();
      await a.sendMessage(id, buttonMessage);
    }
    return
  })
  .addAnswer('Por Favor Elige una de Estas Opciones: ', {capture:true}, async (ctx) => {
    Telefono = ctx.from;
    const id  = ctx.message.buttonsResponseMessage.selectedButtonId;
    const products = await getDateProducts(id);
    const response = await axios.post('http://localhost:4000/send-text', {
        message: `El Numero de Telefono: *${Telefono}*
        \nId del Producto: *${products.id}*
        \nNombre del Producto: *${products.productName}*
        \nPrecio del Producto: *${products.productPrice}*`
    })
    console.log(response.data);
  })
  .addAnswer('Vale Tengo Tu Pedido Luego Se Contactara Un Asesor')


const flowShoes = addKeyword('Shoes')
  .addAnswer('Estos son los Zapatos que tenemos para ti: ')
  .addAction(async(ctx, {provider}) => {
    console.log(ctx)
    const id = ctx.key.remoteJid;
    const products = await getCategoryProducts();
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const buttons = [
        { buttonId: `${product.id}`, buttonText: {displayText: 'Quiero Comprarlo'}, type: 1 },
      ];

      const buttonMessage = {
        image: {url: product.imageUrl},
        caption: product.productName,
        footer: `$${product.productPrice}`,
        buttons: buttons,
        headerType: 4,
      };
      
      const a = await provider.getInstance();
      await a.sendMessage(id, buttonMessage);
    }
    return
  })
  .addAnswer('Por Favor Elige una de Estas Opciones: ', {capture:true}, async (ctx) => {
    Telefono = ctx.from;
    const id  = ctx.message.buttonsResponseMessage.selectedButtonId;
    const products = await getDateProducts(id);
    const response = await axios.post('http://localhost:4000/send-text', {
        message: `El Numero de Telefono: *${Telefono}*
        \nId del Producto: *${products.id}*
        \nNombre del Producto: *${products.productName}*
        \nPrecio del Producto: *${products.productPrice}*`
    })
    console.log(response.data);
  })
  .addAnswer('Vale Tengo Tu Pedido Luego Se Contactara Un Asesor')

const flowPrincipal = addKeyword(EVENTS.WELCOME)
.addAction(async(ctx, {provider}) => {
    const id = ctx.key.remoteJid;

    const buttons = await getCategories();
    if (!buttons) {
      // Si hubo un error al obtener las categorías, no enviamos el mensaje con botones
      return;
    }

    const buttonMessage = {
      image: { url: 'https://i.imgur.com/4UpcxyL.jpg' },
      caption: "Hola somos el mejor e-commerce del Pais\n\n*Estas Son las Opciones que tenemos para ti:*",
      footer: 'E-commerce Fake',
      buttons: buttons,
      headerType: 4
    };

    const a = await provider.getInstance()    
    await a.sendMessage(id, buttonMessage)
    console.log('->', a)
    return 
})


const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal, flowShoes, flowBooks])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    app.use(express.urlencoded({extended: false}));
    app.use(express.json());

    app.post('/send-text', async (req,res) => {
        var message = req.body.message;
        await adapterProvider.sendText(`Numero@c.us`,message)
        res.send({ data: 'Mensaje Enviado!' })
    })

    const PORT = 4000
    app.listen(PORT, () => console.log(`http://localhost:${PORT}`))  

    QRPortalWeb()
}

main()
