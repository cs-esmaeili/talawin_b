const colors = require('colors');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const models = [];

const migration = async () => {
  await fs
    .readdirSync(__dirname)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
      const model = require(path.join(__dirname, file));
      models.push(model);
    });
  if (process.env.NODE_ENV === "development" && process.argv.includes('fresh')) {
    models.map(async (model) => {
      try {
        await model.collection.drop();
      } catch (error) {
        
      }
    });
    console.log(colors.red(`Models deleted`));
  }
}


module.exports = migration;