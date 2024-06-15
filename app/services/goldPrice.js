const { getGoldPriceFromAPI, updateAllProductPrices , getProductPrices } = require('../controllers/product');

exports.goldPriceService = async () => {
    console.log('GoldPriceService started');

    const delay = 1000 * Number(process.env.GOLD_PRICE_SERVICE_DELAY);

    await getGoldPriceFromAPI();

    setInterval(async () => {
        await getGoldPriceFromAPI();
        await updateAllProductPrices();

        const productPrices = await getProductPrices();
        global.io.emit("apiData", global.apiData);
        global.io.emit("productPrices", productPrices);
    }, delay);
};