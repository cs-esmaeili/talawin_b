exports.getObjectByKey = (array, key, value) => {
    return array.find(item => item[key] === value);
}

exports.calculateFormula = (formula, price) => {
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

exports.performCalculations = (product, apiPrice) => {
    try {
        const { formula, discount } = product;
        let price = apiPrice;
        price = this.calculateFormula(formula, price);
        price = Number(price) - Number(discount);
        return price;
    } catch (error) {
        console.log(error);
    }
}