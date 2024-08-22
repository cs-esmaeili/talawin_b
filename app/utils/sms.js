const { Smsir } = require('smsir-js');

let phoneLine = "30007732906702";
const smsir = new Smsir(process.env.SMS_API_KEY, phoneLine);

exports.config = async () => {
    try {
        const result = await smsir.getLineNumbers();
        phoneLine = result.data.data[0];
    } catch (error) {
        console.log(error);
    }
}
exports.sendFastSms = async (phoneNumber, template, params) => {
    try {
        const result = await smsir.SendVerifyCode(phoneNumber, template, params);
        return result;
    } catch (error) {
        console.log(error);
        return false;
    }
}

exports.SendVerifyCodeSms = async (phoneNumber, code) => {
    try {
        const result = await this.sendFastSms(phoneNumber, "179494",
            [{
                "name": "CODE",
                "value": code
            }]);
        return result;
    } catch (error) {
        console.log(error);
        return false;
    }
}