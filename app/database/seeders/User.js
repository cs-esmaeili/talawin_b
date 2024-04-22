const User = require('../models/User');
const Role = require('../models/Role');
const { createToken } = require('../../utils/token');
const { green, red } = require('colors');
const bcrypt = require('bcryptjs');

const seqNumber = 3;
const seed = async (app) => {
    const role = await Role.find({ name: "admin" });
    const result = await createToken(process.env.ADMIN_USERNAME);
    await User.create({
        token_id: result._id,
        userName: process.env.ADMIN_USERNAME,
        role_id: role[0]._id
    });

    // for (let index = 0; index < 60; index++) {
    //     await User.create({
    //         userName: "091373786" + index,
    //         role_id: role[0]._id
    //     });
    // }
    await console.log(`${red(seqNumber)} : ${green('User seed done')}`);
}

module.exports = {
    seqNumber,
    seed
}