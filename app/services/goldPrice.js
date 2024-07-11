const { getGoldPriceFromAPI, updateAllProductPrices, getProductPrices } = require('../controllers/product');
const { updateAllBoxApi } = require('../controllers/apibox');

const schedule = require('node-schedule');

exports.goldPriceService = async () => {
    console.log('GoldPriceService started');

    const delay = Number(process.env.GOLD_PRICE_SERVICE_DELAY);

    await getGoldPriceFromAPI();

    schedule.scheduleJob(`*/${delay} * * * * *`, async () => {
        // try {
        //     await getGoldPriceFromAPI();
        //     await updateAllBoxApi();
        //     await updateAllProductPrices();

        //     const productPrices = await getProductPrices();
        //     global.io.emit("apiData", global.apiData);
        //     global.io.emit("productPrices", productPrices);
        // } catch (error) {
        //     console.error('Error in GoldPriceService: ', error);
        // }
    });
};