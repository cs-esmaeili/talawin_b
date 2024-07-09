const ApiBox = require('../database/models/ApiBox');

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
