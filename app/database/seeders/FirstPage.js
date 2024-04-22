const FirtPage = require('../models/FirtPage');
const Category = require('../models/Category');
const Post = require('../models/Post');
const { green, red } = require('colors');
const { getImageBlurHash } = require('../../utils/file');

const seqNumber = 6;
const seed = async (app) => {

    const categorys = await Category.find({}).select("_id");
    const posts = await Post.find({}).select("_id");

    
    await FirtPage.create({
        location: 0,
        data: categorys
    });
    
    const blurHash = await getImageBlurHash("big.png");
    await FirtPage.create({
        location: 1,
        customData: {
            textArea: { title: "haha", disc: "haha disc" },
            image: { url: process.env.BASE_URL + JSON.parse(process.env.STORAGE_LOCATION)[2] + "/big.png", blurHash }
        }
    });

    await FirtPage.create({
        location: 2,
        data: posts.slice(0, 5)
    });

    await FirtPage.create({
        location: 3,
        data: posts.slice(0, 5)
    });

    await FirtPage.create({
        location: 4,
        data: posts.slice(0, 5)
    });

    await FirtPage.create({
        location: 5,
        data: posts.slice(0, 4)
    });
    await FirtPage.create({
        location: 6,
        data: posts.slice(0, 4)
    });

    await console.log(`${red(seqNumber)} : ${green('FirtPage seed done')}`);
}

module.exports = {
    seqNumber,
    seed
}