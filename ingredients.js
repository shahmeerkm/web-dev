//ingredient file(models folder)
const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
    ingredientid: Number,
    name: String,
    description: String
});

const ingredients = mongoose.model('ingredients', IngredientSchema);
module.exports = ingredients;
