const SmsTemplate = require("../database/models/SmsTemplate")
const { createSmsTemplate, deleteSmsTemplate, sendSmsToUser } = require('../static/response.json');
const { sendFastSms } = require('../utils/sms');

exports.createSmsTemplate = async (req, res, next) => {
    try {
        const { code, name, text } = req.body;
        const result = await SmsTemplate.create({ code, name, text });
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
        let templates = await SmsTemplate.find({}).skip((page - 1) * perPage).limit(perPage).lean();
        const templatesCount = await SmsTemplate.countDocuments({});
        res.send({ templatesCount, templates });
    } catch (err) {
        console.log(err);

        res.status(err.statusCode || 500).json(err);
    }
}

exports.sendSmsToUser = async (req, res, next) => {
    try {
        const { phoneNumber, code, params } = req.body;

        const result = await sendFastSms(phoneNumber, code, params);
        if (result == false) {
            throw { message: sendSmsToUser.fail, statusCode: 401 };
        }
        res.send({ message: sendSmsToUser.ok });
    } catch (err) {
        console.log(err);
        res.status(err.statusCode || 500).json(err);
    }
}