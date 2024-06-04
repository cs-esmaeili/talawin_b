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
    },
    visible: {
        type: Boolean,
    },
    apiPath: {
        type: String,
    },
    formula: {
        type: String,
    },
    discount: {
        type: Number,
        min: 0,
    }
}), 'Product');

a = {
    a: {
        b: "",
        c: "",
        f: {
            b: "javad"
        }
    }
}