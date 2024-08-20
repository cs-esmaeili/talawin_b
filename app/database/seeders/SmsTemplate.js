const SmsTemplate = require('../models/SmsTemplate');
const { green, red } = require('colors');

const seqNumber = 9;
const seed = async (app) => {
    await SmsTemplate.create({
        name: "کد ورود",
        text: "کد ورود شما #code#"
    });
    await console.log(`${red(seqNumber)} : ${green('SmsTemplate seed done')}`);
}

module.exports = {
    seqNumber,
    seed
}