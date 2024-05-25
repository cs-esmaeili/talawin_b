const mongoose = require("mongoose");
const { buildSchema } = require("./builder");


const ProductHistory = new mongoose.Schema({
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
    },
    disc: {
        type: String,
        required: true,
    },
    type: {
        type: Number,
        required: true,
        default : 0,
    },
    user_id: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'User',
    },
    products: [ProductHistory],
    price: {
        type: Number,
        required: true,
        min: 0,
    },
}), 'History');
