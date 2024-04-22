const VerifyCode = require('../database/models/VerifyCode');
const { checkDelayTime } = require('./checkTime');
const Token = require('../database/models/Token');
const { mCreateVerifyCode } = require('../messages/response.json');
const bcrypt = require('bcryptjs');

exports.createToken = async (unicData, token_id = null) => {
    try {
        const hash = await bcrypt.hash(unicData, 10);
        let result = await Token.find({ _id: token_id });
        if (result.length > 0) {
            result = await Token.updateOne({ _id: token_id }, { token: hash });
            result = await Token.find({ _id: token_id });
            result = result[0];
        } else {
            result = await Token.create({ token: hash });
        }
        return result;
    } catch (error) {
        console.error('Error updating or creating document:', error);
        return false;
    }
}

exports.createVerifyCode = async (user_id) => {
    const smsCode = await VerifyCode.findOne({ user_id });

    const min = 1000;
    const max = 9999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min + "";
    const hashRandomNumber = await bcrypt.hash(randomNumber, 10);

    if (smsCode) {
        const checkTime = checkDelayTime(smsCode.updatedAt, process.env.SMS_RESEND_DELAY, false);
        if (!checkTime) {
            throw { message: mCreateVerifyCode.fail, statusCode: 404 };
        }
        const result = await VerifyCode.updateOne({ user_id }, { code: hashRandomNumber }, { timestamps: true });
        return { result, code: randomNumber };
    } else {
        const result = await VerifyCode.create({ user_id, code: hashRandomNumber });
        return { result, code: randomNumber };
    }
}