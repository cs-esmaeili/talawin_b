const mongoose = require("mongoose");
const { buildSchema } = require("./builder");


module.exports = mongoose.model("SmsHistory", buildSchema({
    phoneNumber: {
        type: Number,
        required: true,
    },
    templateName: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    }
}), 'SmsHistory');