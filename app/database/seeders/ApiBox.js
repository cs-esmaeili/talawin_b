const ApiBox = require('../models/ApiBox');
const { green, red, blue } = require('colors');
const permissions = require('../../static/permissions.json');

const seqNumber = 7;
const seed = async (app) => {
    try {
        ApiBox.create({
            name:"طلا 18 خرید",
            apiPath: 391298,
        })
        await console.log(`${red(seqNumber)} : ${green('ApiBox seed done')}`);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    seqNumber,
    seed
}