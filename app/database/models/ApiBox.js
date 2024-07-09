const mongoose = require("mongoose");
const { buildSchema } = require("./builder");

module.exports = mongoose.model("ApiBox", buildSchema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        min: 0,
        required: true,
        default: 0,
    },
    apiPath: {
        type: String,
    },
    formula: {
        type: String,
    },
}), 'ApiBox');