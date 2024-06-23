const History = require('../models/History');
const Product = require('../models/Product');
const User = require('../models/User');
const { green, red } = require('colors');
const { utcToJalali, utcToMiladi } = require("../../utils/TimeConverter");

const seqNumber = 8;
const userMiladiTime = encodeURIComponent(process.env.USE_MILADI_TIME);

const converTime = (time) => {
    if (userMiladiTime === 'true') {
        return utcToMiladi(time);
    } else {
        return utcToJalali(time);
    }
}

const seed = async (app) => {

    const productList = await Product.find({});
    const user = (await User.find({}))[0];

    const currentDate = converTime(new Date());

    let products = [];
    productList.forEach(async product => {
        let pHistory = {
            product_id: product._id,
            price: 200000000,
            count: 1,
        };
        products.push(pHistory);
    });

    await History.create({
        title: "خرید انجام شد",
        disc: "خرید طلا 18 عیار",
        price: 300000000,
        user_id: user._id,
        type: 1,
        products,
        targetTime: currentDate,
    });

    await History.create({
        title: "خرید انجام شد",
        disc: "خرید طلا 18 عیار",
        price: 300000000,
        user_id: user._id,
        products,
        targetTime: currentDate,
    });

    await console.log(`${red(seqNumber)} : ${green('History seed done')}`);
}

module.exports = {
    seqNumber,
    seed
}