const mongoose = require("mongoose");
const { buildSchema } = require("./builder");


const product = new mongoose.Schema({
    product_id: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'Product',
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
});

module.exports = mongoose.model("History", buildSchema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    disc: {
        type: String,
        required: true,
        unique: true
    },
    products: [product],
    price: {
        type: Number,
        required: true,
        min: 0,
    },
}), 'History');
