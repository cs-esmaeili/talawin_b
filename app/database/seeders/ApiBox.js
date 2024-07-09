const ApiBox = require('../models/ApiBox');
const { green, red, blue } = require('colors');
const permissions = require('../../static/permissions.json');

const seqNumber = 1;
const seed = async (app) => {
    try {
        ApiBox.create({
            name:"طلا 18 خرید",
            // price : 0,
            apiPath: 3425,
            formula : "p"
        })
        ApiBox.create({
            name:"طلا 18 فروش",
            // price : 0,
            apiPath: 23432,
            formula : "p"
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