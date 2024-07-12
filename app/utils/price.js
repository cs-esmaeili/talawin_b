exports.getObjectByKey = (array, key, value) => {
    return array.find(item => item[key] === value);
}


const calculateFormula = (formula, price) => {
    if (formula == "" || formula == null) {
        formula = 'p';
    }
    const replacedFormula = formula.replace(/p/g, price);
    try {
        const result = eval(replacedFormula);
        return result;
    } catch (error) {
        console.error('Error evaluating formula:', error);
        return null;
    }
}


exports.calculateBoxPrice = (box) => {
    try {

        const { apiPath, cBuyPrice, cSellPrice, formulaBuy, formulaSell } = box;

        if (cBuyPrice != 0 && cSellPrice != 0) {
            return { buyPrice: cBuyPrice, sellPrice: cSellPrice }
        }

        let buyPrice = 0;
        let sellPrice = 0;

        if (!global.apiData || global.apiData == undefined || global.apiData == null || global.apiData.length == 0) {
            return { buyPrice: cBuyPrice, sellPrice: cSellPrice }
        }
        const apiPrice = (this.getObjectByKey(global.apiData, 'key', Number(apiPath))).price;

        buyPrice = calculateFormula(formulaBuy, apiPrice);
        sellPrice = calculateFormula(formulaSell, apiPrice);


        if (cBuyPrice != 0) {
            buyPrice = cBuyPrice;
        }
        if (cSellPrice != 0) {
            sellPrice = cSellPrice;
        }
        return { buyPrice, sellPrice }
    } catch (error) {
        console.log(error);
    }
}

exports.calculateProductPrice = (product, apiBox) => {
    try {
        const { cBuyPrice, cSellPrice, formulaBuy, formulaSell, discount } = product;

        if (cBuyPrice != 0 && cSellPrice != 0) {
            return { buyPrice: (cBuyPrice - discount), sellPrice: (cSellPrice - discount) }
        }

        let buyPrice = 0;
        let sellPrice = 0;

        if (!global.apiData || global.apiData == undefined || global.apiData == null || global.apiData.length == 0) {
            return { buyPrice: (cBuyPrice - discount), sellPrice: (cSellPrice - discount) }
        }


        buyPrice = calculateFormula(formulaBuy, apiBox.buyPrice) - discount;
        sellPrice = calculateFormula(formulaSell, apiBox.sellPrice) - discount;


        if (cBuyPrice != 0) {
            buyPrice = (cBuyPrice - discount);
        }
        if (cSellPrice != 0) {
            sellPrice = (cSellPrice - discount);
        }
        return { buyPrice, sellPrice }
    } catch (error) {
        console.log(error);
    }
}