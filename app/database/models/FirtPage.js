const mongoose = require("mongoose");
const { buildSchema } = require("./builder");

module.exports = mongoose.model("FirtPage", buildSchema(  {
    location: {
        type: Number,
        required: true,
        unique: true,
    },
    data: [
        {
            type: mongoose.ObjectId,
            ref: 'Post' // Assuming you're storing references to the Post model initially
        },
        {
            type: mongoose.ObjectId,
            ref: 'Category' // Assuming you're storing references to the Category model initially
        },
    ],
    customData: {
        type: mongoose.Schema.Types.Mixed,
    },
}), 'FirtPage');