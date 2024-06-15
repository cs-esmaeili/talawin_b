const mongoose = require("mongoose");
const { buildSchema } = require("./builder");

module.exports = mongoose.model("Product", buildSchema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    disc: {
        type: String,
    },
    image: {
        url: String,
        blurHash: String
    },
    price: {
        type: Number,
        min: 0,
        required: true,
        default: 0,
    },
    discount: {
        type: Number,
        min: 0,
    },
    visible: {
        type: Boolean,
        default: true,
    },
    apiPath: {
        type: String,
    },
    formula: {
        type: String,
    },
}), 'Product');