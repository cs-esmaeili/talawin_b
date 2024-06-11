const { getGoldPriceFromAPI } = require('../controllers/product');
const Product = require('../database/models/Product');

exports.getProductPrices = async () => {
    const products = await Product.find({}).select(["_id", "price", "discount", "visible"]).lean();
    return products;
}

exports.goldPriceService = async () => {
    console.log('goldPriceService started');

    const delay = 1000 * Number(process.env.GOLD_PRICE_SERVICE_DELAY);

    const fetchGoldPrice = async () => {
        const success = await getGoldPriceFromAPI();
        if (success) {
            // console.log('Gold price updated successfully');
        } else {
            console.log('Failed to update Gold price');
        }
    };

    await fetchGoldPrice();

    setInterval(async () => {
        await fetchGoldPrice();
        const productPrices = await getProductPrices();
        const finalObject = {
            apiData: global.apiData,
            productPrices
        }
        global.io.emit("data", finalObject);
    }, delay);
};