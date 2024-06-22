const mongoose = require("mongoose");
const { buildSchema } = require("./builder");


module.exports = mongoose.model("Box", buildSchema({
    user_id: {
        type: String,
        required: true,
        unique: true
    },
    products: [{ type: mongoose.ObjectId, ref: 'Product' }]
}), 'Box');