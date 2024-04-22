const Category = require('../models/Category');
const { green, red } = require('colors');
const { getImageBlurHash } = require('../../utils/file');

const seqNumber = 4;
const seed = async (app) => {
    for (let i = 0; i < 25; i++) {
        const blurHash = await getImageBlurHash("1.jpg");
        await Category.create({
            name: "category" + i,
            image: {
                url: process.env.BASE_URL + JSON.parse(process.env.STORAGE_LOCATION)[2] + "/1.jpg",
                blurHash
            }
        });
    }
    await console.log(`${red(seqNumber)} : ${green('Permission seed done')}`);
}

module.exports = {
    seqNumber,
    seed
}