const fs = require('fs');

const cuisines = ['Greek', 'Indian', 'Italian', 'Mexican', 'Chinese', 'Japanese', 'American', 'Thai', 'French', 'Mediterranean'];
const categories = ['Main Course', 'Dessert', 'Appetizer', 'Salad', 'Breakfast', 'Snack', 'Soup', 'Beverage'];
const dietaryTags = ['Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Vegetarian', 'Keto', 'Low-Carb', 'Healthy'];
const allIngredients = [
    'tomato', 'onion', 'garlic', 'spinach', 'chicken', 'beef', 'tofu', 'rice', 'pasta', 'cheese',
    'olive oil', 'lemon', 'basil', 'oregano', 'cumin', 'turmeric', 'ginger', 'soy sauce', 'coconut milk',
    'flour', 'sugar', 'egg', 'milk', 'almond', 'walnut', 'honey', 'maple syrup', 'avocado', 'beans', 'corn'
];

// Each tag excludes certain ingredients to prevent data contradictions
const dietaryExclusions = {
    'Vegan': ['chicken', 'beef', 'cheese', 'egg', 'milk', 'honey'],
    'Vegetarian': ['chicken', 'beef'],
    'Gluten-Free': ['pasta', 'flour'],
    'Dairy-Free': ['cheese', 'milk'],
    'Nut-Free': ['almond', 'walnut'],
    'Keto': ['pasta', 'flour', 'rice', 'sugar', 'honey', 'maple syrup', 'corn'],
    'Low-Carb': ['pasta', 'flour', 'rice', 'sugar', 'honey', 'maple syrup'],
    'Healthy': []
};

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getAllowedIngredients(tag) {
    const exclusions = dietaryExclusions[tag] || [];
    return allIngredients.filter(ing => !exclusions.includes(ing));
}

function generateFoodItems(count) {
    const items = [];
    for (let i = 1; i <= count; i++) {
        const cuisine = getRandom(cuisines);
        const category = getRandom(categories);
        const tag = getRandom(dietaryTags);
        const name = `${tag} ${cuisine} ${category} #${i}`;

        // Pick only ingredients allowed for this dietary tag
        const allowed = getAllowedIngredients(tag);
        const ingredientCount = 3 + Math.floor(Math.random() * 3);
        const ingredients = Array.from({ length: ingredientCount }, () => getRandom(allowed));

        const description = `A delicious ${tag.toLowerCase()} ${cuisine.toLowerCase()} style ${category.toLowerCase()} that is perfect for any occasion.`;

        items.push({
            id: i.toString(),
            name: name,
            cuisine: cuisine,
            category: category,
            tag: tag,
            description: description,
            ingredients: ingredients.join(', ')
        });
    }
    return items;
}

const foodData = generateFoodItems(5000);
fs.writeFileSync('food_data.json', JSON.stringify(foodData, null, 2));
console.log('Successfully generated food_data.json with 5,000 items.');
