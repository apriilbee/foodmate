export const getIngredientDetails = (extededIngredients) => {
    return extededIngredients.map( ingredient => {
        if (ingredient.unit) return `${ingredient.amount} ${ingredient.unit.toLowerCase()} ${ingredient.nameClean}`
        return `${ingredient.amount} ${ingredient.nameClean}`;
    })
}

export const getInstructionDetails = (analyzedInstructions) => {
    return analyzedInstructions.map ( instruction => {
        return instruction.step;
    })
}