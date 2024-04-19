//recipe file(models folder)
const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    recipeid: Number,
    name: String,
    description: String,
    ingredient: {type: mongoose.SchemaTypes.ObjectId, ref: 'ingredient'}
});

const recipes = mongoose.model('recipes', RecipeSchema);
module.exports = recipes;
