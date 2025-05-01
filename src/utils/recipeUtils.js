export const getIngredientDetails = (extededIngredients) => {
    const FRACTIONS = {
        0.33333334 : "1/3",
        0.5 : "1/2",
        0.75 : "3/4"
    }
    
    return extededIngredients.map( ingredient => {
        if (ingredient.amount === 0.33333334 || ingredient.amount === 0.5 || ingredient.amount === 0.75) {
            ingredient.amount = FRACTIONS[ingredient.amount];
        } 
        if (ingredient.unit) return `${ingredient.amount} ${ingredient.unit.toLowerCase()} ${ingredient.nameClean}`
        return `${ingredient.amount} ${ingredient.nameClean}`;
    })
}

export const getInstructionDetails = (analyzedInstructions) => {
    return analyzedInstructions.map ( instruction => {
        return instruction.step;
    })
}

function capitalizeWords(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}

export const getDietTags = (ingredients, nutrition, dishTypes, diets) => {
    const tags = [];
  
    const ingredientNames = ingredients.map(ingredient => ingredient.name.toLowerCase());
  
    // Allergens and Meats
    const nutAllergens = ['peanut', 'peanuts', 'almond', 'almonds', 'cashew', 'cashews', 'walnut', 'walnuts', 'pecan', 'pecans', 'hazelnut', 'hazelnuts', 'pistachio', 'pistachios', 'macadamia', 'macadamias', 'brazil nut', 'brazil nuts', 'pine nut', 'pine nuts', 'tree nut'];
    const soyAllergens = ['soy', 'soybean', 'soybeans', 'edamame', 'tofu', 'tempeh', 'miso', 'soya', 'soy lecithin', 'soy flour', 'soy protein'];
    const redMeats = ['beef', 'pork', 'lamb']
    
    // Check for Nut-Free
    const containsNuts = ingredientNames.some(name => nutAllergens.some(nut => name.includes(nut)));
    if (!containsNuts) {
      tags.push('Nut-Free');
    }
  
    // Check for Soy-Free
    const containsSoy = ingredientNames.some(name => soyAllergens.some(soy => name.includes(soy)));
    if (!containsSoy) {
      tags.push('Soy-Free');
    }

    //Check for No Red Meat
    const containsRedMeat = ingredientNames.some(name => redMeats.some(meat => name.includes(meat)));
    if (!containsRedMeat) {
        tags.push('No Red Meat');
    }
  
    // Check for Sugar-Free and Low Sugar
    const sugarContent = nutrition[5].amount || 0;
    if (sugarContent === 0) {
      tags.push('Sugar-Free');
    } else if (sugarContent <= 5) {
      tags.push('Low Sugar');
    }
  
    // Check for Low-Sodium
    const sodiumContent = nutrition[7].amount || 0;
    if (sodiumContent <= 140) {
      tags.push('Low-Sodium');
    }
  
    // Check for Low Calorie
    const calorieContent = nutrition[0].amount || 0;
    if (calorieContent <= 400) {
      tags.push('Low Calorie');
    }

    const formattedDishTypes = dishTypes.map(capitalizeWords);
    const formattedDiets = diets.map(capitalizeWords);
  
    return [...tags, ...formattedDiets, ...formattedDishTypes]
}
