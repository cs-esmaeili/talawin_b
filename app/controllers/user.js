const { createToken, createVerifyCode } = require("../utils/token");
const User = require("../database/models/User");
const Role = require("../database/models/Role");
const VerifyCode = require("../database/models/VerifyCode");
const { SendVerifyCodeSms } = require("../utils/sms");
const { checkDelayTime } = require("../utils/checkTime");
const bcrypt = require('bcryptjs');
const { mlogInStepOne, mlogInStepTwo, mRegister, registerPure, updateRegisterPure } = require('../messages/response.json');

exports.logInStepOne = async (req, res, next) => {
    try {
        const { userName } = await req.body;
        let user = await User.findOne({ userName });
        let test = await User.userPermissions(user._id);

        if (!user) {
            user = await User.createNormalUser(userName);
        }
        const result = await createVerifyCode(user._id);
        // const sms = await SendVerifyCodeSms(userName, result.code);
        // if (sms.data.status != 1) {
        //     throw { message: mlogInStepOne.fail_1, statusCode: 422 };
        // }
        console.log(result.code);
        res.json({ message: mlogInStepOne.ok, expireTime: process.env.SMS_RESEND_DELAY });
    } catch (err) {
        console.log(err);
        res.status(err.statusCode || 422).json(err);
    }

}

exports.logInStepTwo = async (req, res, next) => {
    try {
        const { userName, code } = await req.body;
        const user = await User.findOne({ userName }).populate("role_id").lean();
        if (!user) {
            throw { message: mlogInStepTwo.fail_1, statusCode: 404 };
        }
        const verifycode = await VerifyCode.findOne({ user_id: user._id }).lean();
        if (!verifycode) {
            throw { message: mlogInStepTwo.fail_2, statusCode: 404 };
        }
        const codeCheck = await bcrypt.compare(code, verifycode.code);
        if (!codeCheck) {
            throw { message: mlogInStepTwo.fail_3, statusCode: 404 };
        }
        const checkTime = checkDelayTime(verifycode.updatedAt, process.env.SMS_RESEND_DELAY, true);
        if (!checkTime) {
            throw { message: mlogInStepTwo.fail_2, statusCode: 404 };
        }
        const { _id, token } = await createToken(userName, user.token_id);
        const userUpdate = await User.updateOne({ _id: user._id }, { token_id: _id });
        const verifyCodeDelete = await VerifyCode.deleteOne({ user_id: user._id }).lean();


        res.json({ message: mlogInStepTwo.ok, token, sessionTime: process.env.USERS_SESSIONS_TIME });
    } catch (err) {
        res.status(err.statusCode || 422).json(err);
    }

}
exports.userPermissions = async (req, res, next) => {
    try {
        if (req.body.user) {
            const userPermission = await User.userPermissions(req.body.user._id);
            res.json(userPermission);
        } else {
            throw { message: "Log In First !", statusCode: 403 };
        }
    } catch (err) {
        res.status(err.statusCode || 422).json(err);
    }
}

exports.registerPure = async (req, res, next) => {
    try {
        const { userName, role_id, data } = await req.body;
        let user = await User.findOne({ userName });
        if (user) {
            throw { message: registerPure.fail_1, statusCode: 422 };
        }
        let role = await Role.findOne({ _id: role_id });
        if (!role) {
            throw { message: registerPure.fail_2, statusCode: 422 };
        }
        await User.create({
            userName,
            role_id,
            data
        });
        res.json({ message: registerPure.ok });
    } catch (err) {
        res.status(err.statusCode || 422).json(err);
    }
}

exports.userList = async (req, res, next) => {
    try {
        const { page, perPage } = req.body;
        let users = await User.find({}).populate('role_id', '-permissions').skip((page - 1) * perPage).limit(perPage).lean();
        const usersCount = await User.countDocuments({});
        res.send({ usersCount, users });
    } catch (err) {
        res.status(err.statusCode || 422).json(err.errors || err.message);
    }
}

exports.updateRegisterPure = async (req, res, next) => {
    try {
        const { user_id, userName, role_id, data } = await req.body;
        let user = await User.findOne({ _id: user_id });
        if (!user) {
            throw { message: updateRegisterPure.fail_1, statusCode: 422 };
        }
        let newUserName = await User.findOne({ userName, _id: { $ne: user_id } });
        if (newUserName) {
            throw { message: updateRegisterPure.fail_2, statusCode: 422 };
        }
        let role = await Role.findOne({ _id: role_id });
        if (!role) {
            throw { message: updateRegisterPure.fail_3, statusCode: 422 };
        }
        await User.updateOne({ _id: user_id }, {
            userName,
            role_id,
            data
        });
        res.json({ message: updateRegisterPure.ok });
    } catch (err) {
        res.status(err.statusCode || 422).json(err);
    }
}