const mongoose = require("mongoose");
const { buildSchema } = require("./builder");



module.exports = mongoose.model("Product", buildSchema({
    apiBox_id: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'ApiBox',
    },
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
        default: "p"
    },
    formulaSell: {
        type: String,
        default: "p"
    },
    discount: {
        type: Number,
        min: 0,
        required: true,
        default: 0,
    },
}), 'Product');