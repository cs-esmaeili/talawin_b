const { getImageBlurHash } = require('../../utils/file');
const Product = require('../models/Product');
const { green, red } = require('colors');

const seqNumber = 7;
const seed = async (app) => {
    const blurHash = await getImageBlurHash("1.jpg");
    for (let i = 1; i <= 12; i++) {
        await Product.create({
            name: "Product Name " + i,
            disc: "Product disc " + i,
            image: {
                blurHash,
                url: process.env.BASE_URL + JSON.parse(process.env.STORAGE_LOCATION)[2] + "/1.jpg",
            },
            price: 10000,
            discount: 2000,
        });
    }
    await console.log(`${red(seqNumber)} : ${green('Product seed done')}`);
}

module.exports = {
    seqNumber,
    seed
}