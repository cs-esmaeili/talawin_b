const Role = require('../models/Role');
const Permission = require('../models/Permission');
const { green, red } = require('colors');

const seqNumber = 2;
const seed = async () => {

    const permissions = await Permission.find({});

    let permissionIds = [];
    for (const key in permissions) {
        const id = permissions[key]._id;
        permissionIds.push(id);
    }

    await Role.create({ name: 'user', permissions: permissionIds });
    await Role.create({ name: 'admin', permissions: permissionIds });

    await console.log(`${red(seqNumber)} : ${green('Role seed done')}`);
}

module.exports = {
    seqNumber,
    seed
}