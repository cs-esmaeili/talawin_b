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
    visible: {
        type: Boolean,
        default: true,
    },
    apiBox_id: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'ApiBox',
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
    discount: {
        type: Number,
        min: 0,
    },
}), 'Product');