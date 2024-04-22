const mongoose = require("mongoose");
const { buildSchema } = require("./builder");

module.exports = mongoose.model("Permission", buildSchema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    route: {
        type: String,
        required: true,
    },
    disc: {
        type: String,
    }
}), 'Permission');