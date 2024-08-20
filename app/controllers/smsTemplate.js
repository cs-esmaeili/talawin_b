const SmsTemplate = require("../database/models/SmsTemplate")
const { createSmsTemplate, deleteSmsTemplate } = require('../static/response.json');

exports.createSmsTemplate = async (req, res, next) => {
    try {
        const { name, text } = req.body;
        const result = await SmsTemplate.create({ name, text });
        if (result) {
            res.send({ message: createSmsTemplate.ok });
            return;
        }
        throw { message: createSmsTemplate.fail, statusCode: 401 };
    } catch (err) {
        res.status(err.statusCode || 422).json(err);
    }
}
exports.deleteSmsTemplate = async (req, res, next) => {
    try {
        const { _id } = req.body;
        const result = await SmsTemplate.deleteOne({ _id });
        if (result.deletedCount == 0) {
            throw { message: deleteSmsTemplate.fail, statusCode: 401 };
        }
        res.send({ message: deleteSmsTemplate.ok });
    } catch (err) {
        res.status(err.statusCode || 422).json(err);
    }
}
exports.SmsTemplateList = async (req, res, next) => {
    try {
        const { page, perPage } = req.body;
        let templates = await SmsTemplate.find({}).select('_id name image updatedAt').skip((page - 1) * perPage).limit(perPage).lean();
        const templatesCount = await Category.countDocuments({});
        res.send({ templatesCount, templates });
    } catch (err) {
        res.status(err.statusCode || 500).json(err);
    }
}