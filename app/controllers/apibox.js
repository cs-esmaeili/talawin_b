const ApiBox = require('../database/models/ApiBox');
const { calculatePrice } = require('../utils/price');
const { addApiBox } = require('../static/response.json');

exports.apiBoxList = async (req, res, next) => {
    try {
        const { page, perPage } = req.body;
        let apiboxs = await ApiBox.find({}).skip((page - 1) * perPage).limit(perPage).lean();
        const apiboxCount = await ApiBox.countDocuments({});
        res.send({ apiboxCount, apiboxs });
    } catch (err) {
        res.status(err.statusCode || 500).json(err);
    }
}

exports.addApiBox = async (req, res, next) => {
    try {
        const { name, apiPath, cBuyPrice, cSellPrice, formulaBuy, formulaSell } = req.body;
   
        const { buyPrice, sellPrice } = calculatePrice(apiPath, formulaBuy, formulaSell, cBuyPrice, cSellPrice);

        let result = await ApiBox.create({
            name,
            apiPath,
            buyPrice,
            sellPrice,
            cBuyPrice,
            cSellPrice,
            formulaBuy,
            formulaSell
        });


        if (result) {
            res.send({ message: addApiBox.ok });
            return;
        }
        throw { message: addApiBox.fail_1, statusCode: 401 };
    } catch (err) {

        if (err.code == 11000) {
            res.status(406).json({ message: addApiBox.fail_2, statusCode: 406 });
        } else {
            res.status(err.statusCode || 500).json(err);
        }
    }
}

exports.updateAllBoxApi = async () => {
    const boxs = await ApiBox.find({});
    const updatedBoxs = [];

    for (let i = 0; i < boxs.length; i++) {
        const box = boxs[i];

        if (box.apiPath == null || box.apiPath == "") {
            continue;
        }

        const apiPrice = getObjectByKey(global.apiData, "key", Number(box.apiPath)).price;
        const price = performCalculations(box, apiPrice);

        box.price = price;
        updatedBoxs.push(box);
    }
    try {
        if (updatedBoxs.length > 0) {
            await Promise.all(updatedBoxs.map(updatedPrice => ApiBox.findByIdAndUpdate(updatedPrice._id, { price: updatedPrice.price })));
        }
    } catch (error) {
        console.error("Error updating boxs:", error);
    }
}
