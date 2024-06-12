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
const getObjectByKey = (array, key, value) => {
    return array.find(item => item[key] === value);
}

function calculateFormula(formula, price) {
    if (formula == "" || formula == null) {
        formula = 'p';
    }
    // Replace every occurrence of 'p' with the price
    const replacedFormula = formula.replace(/p/g, price);

    try {
        // Evaluate the formula
        const result = eval(replacedFormula);
        return result;
    } catch (error) {
        console.error('Error evaluating formula:', error);
        return null;
    }
}


function performCalculations(doc) {
    try {
        if ('price' in doc && global.apiData) {
            let price = 0;
            price = getObjectByKey(global.apiData, "key", Number(doc.apiPath)).price;
            price = calculateFormula(doc.formula, price);
            if (doc.discount == "" || doc.discount == null) {
                doc.discount = 0;
            }
            price = Number(price) - Number(doc.discount);
            doc.price = price;
        }
    } catch (error) {
        console.log(error);
    }
}

exports.buildSchema = (schemaObject) => {
    addTimestampsToObject(schemaObject);
    const schema = new mongoose.Schema(schemaObject, { timestamps: true });

    schema.pre('save', function (next) {
        const currentDate = utcToMiladi(new Date());

        this.createdAt = currentDate;
        this.updatedAt = currentDate;

        performCalculations(this);

        next();
    });

    return schema;
}