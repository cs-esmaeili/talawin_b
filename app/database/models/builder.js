const mongoose = require("mongoose");
const { utcToMiladi } = require("../../utils/TimeConverter");


function addTimestampsToObject(obj) {
    obj.createdAt = {
        type: mongoose.Schema.Types.Mixed
    };
    obj.updatedAt = {
        type: mongoose.Schema.Types.Mixed,
        set: function () {
            return utcToMiladi(new Date());
        }
    };
}

exports.buildSchema = (schemaObject) => {
    addTimestampsToObject(schemaObject);
    const schema = new mongoose.Schema(schemaObject, { timestamps: true });

    schema.pre('save', function (next) {
        const currentDate = utcToMiladi(new Date());

        this.createdAt = currentDate;
        this.updatedAt = currentDate;

        next();
    });

    return schema;
}