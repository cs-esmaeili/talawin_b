const mongoose = require("mongoose");
const { buildSchema } = require("./builder");




module.exports = mongoose.model("ApiBox", buildSchema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    apiPath: {
        type: String,
    },
    buyPrice: {
        type: Number,
        min: 0,
        required: true,
        default: 0,
    },
    sellPrice: {
        type: Number,
        min: 0,
        required: true,
        default: 0,
    },
    cBuyPrice: {
        type: Number,
        min: 0,
        required: true,
        default: 0,
    },
    cSellPrice: {
        type: Number,
        min: 0,
        required: true,
        default: 0,
    },
    formulaBuy: {
        type: String,
    },
    formulaSell: {
        type: String,
    },
}), 'ApiBox');