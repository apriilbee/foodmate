import MealPlan from "../models/MealPlan.js";
import { GroceryList } from "../models/GroceryList.js";
import { getRecipeDetails } from "../services/recipeService.js";
import pluralize from "pluralize";
import { addGroceryLog } from "./groceryLogService.js";
import User from "../models/User.js";

export const generateGroceryList = async (userId, start, end, force) => {
    
    if (!start || !end) throw new Error ('Start and end dates are required');
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (endDate < startDate) throw new Error ('End date cannot be earlier than start date');
    
    const existingList = await GroceryList.findOne({
        userId,
        startDate,
        endDate
    });

    if(existingList && !force) throw new Error('A grocery list for this date range already exists.');
    
    const mealPlans = await MealPlan.find( {userId : userId} )

    const filteredMealPlans = mealPlans.flatMap(plan => 
        plan.meals.filter(meal => {
            const mealDate = new Date(meal.date);
            return !isNaN(mealDate) && mealDate >= startDate && mealDate <= endDate;
        })
    )

    if (filteredMealPlans.length < 1) throw new Error ('There must be at least one meal to generate grocery list')

    const recipeIds = filteredMealPlans.map(meal => meal.recipeId);
    const recipes = await Promise.all(
      recipeIds.map(id => getRecipeDetails(id))
    );
    const ingredients = getIngredientList(recipes)
    const groupedIngredients = groupIngredientByAisle(ingredients);
    
    //edits existing grocery list if exists, creates a new one if grocery list has not been generated
    const updatedList = await GroceryList.findOneAndUpdate(
        {
            userId,
            startDate,
            endDate
        },
        {
            userId,
            startDate,
            endDate,
            aisles: groupedIngredients,
            meals: recipeIds,
            logs: [],
            collaborators: [],
        },
        {
            new: true,
            upsert : true,
            setDefaultsOnInsert: true
        }
    )
    return updatedList;
}

export const getAllGroceryLists = async (userId) => {
    if (!userId) throw new Error ('Not Authorized');
    
    
    const formatDate = date => {
        const dateToBeFormatted = new Date(date);
        const day = String(dateToBeFormatted.getDate()).padStart(2, '0');
        const month = String(dateToBeFormatted.getMonth() + 1).padStart(2,'0');
        const year = dateToBeFormatted.getFullYear();
        return `${day}/${month}/${year}`;
    }
    const ownGroceryLists = await GroceryList.find( {userId: userId} );
    const ownGroceryListIds = ownGroceryLists.map(list => {
        return {
            id : list._id,
            startDate : formatDate(list.startDate),
            endDate : formatDate(list.endDate)
        }
    });

    const collaboratorLists = await GroceryList.find({ collaborators: userId }); 
    const collaboratorListIds = collaboratorLists.map(list => {
        return {
            id : list._id,
            startDate : formatDate(list.startDate),
            endDate : formatDate(list.endDate)
        }
    });
    return {ownGroceryListIds, collaboratorListIds}; 
}

export const getGroceryList = async (userId, groceryListId) => {
    const groceryList = await GroceryList.findById(groceryListId);

    if (!groceryListId) throw new Error ("Miissing required field");

    if (groceryList.userId.toString() !== userId && !groceryList.collaborators.map(id =>id.toString()).includes(userId)) throw new Error ("Not Authorized");

    if (!groceryList) throw new Error ("Grocery list does not exist");

    const owned = groceryList.userId.toString() == userId

    return {
        list : groceryList,
        owned : owned
    };
}

/**
 * Updates items in a grocery list.
 *
 * @param {String} groceryListId - The ID of the grocery list to update.
 * @param {Array} updates - An array of updates, each formatted as:
 * [
 *   {
 *     aisle: "produce",
 *     item: {
 *       _id: "itemObjectId",
 *       amount: Number,        // optional
 *       unit: String,          // optional
 *       purchased: Boolean     // optional
 *     }
 *   },
 *   ...
 * ]
 *
 * Each update must specify the aisle and an item with a valid _id.
 * Only the provided fields (amount, unit, purchased) will be updated.
 *
 * @param {String} userId - The ID of the user making the update (for authorization).
 * @returns {Object} - The updated grocery list.
 */

export const updateGroceryList = async (groceryListId, updates, userId) => {
    const list = await GroceryList.findById(groceryListId);

    if(!list) throw new Error ("Grocery list not found");
    if(list.userId.toString() !== userId && !list.collaborators.map(id => id.toString()).includes(userId)) throw new Error ("Not authorized to edit this list");

    const user = await User.findById(userId);

    updates.forEach(async ({aisle, item: updateItem}) => {
        const aisleGroup = list.aisles.find(group => group.aisle === aisle);
        if (!aisleGroup) return;

        const item = aisleGroup.items.id(updateItem._id);
        if (!item) return;

        if (updateItem.amount) {
            item.amount = updateItem.amount
            const log = `${user.username} edited ${item.name} value to ${updateItem.amount} ${updateItem.unit}`;
            await addGroceryLog(groceryListId, log)
        }
        if (updateItem.unit) item.unit = updateItem.unit;
        if (updateItem.purchased === true) {
            item.purchased = true;
            const log = `${user.username} marked ${item.name} as purchased`;
            await addGroceryLog(groceryListId, log)           
        }
        else if (updateItem.purchased === false) {
            item.purchased = false;
            const log = `${user.username} marked ${item.name} as not purchased`;
            await addGroceryLog(groceryListId, log)
        }
    });

    await list.save();
    return list;
}

export const addCollaboratorToGroceryList = async (groceryListId, email) => {
    const list = await GroceryList.findById(groceryListId);
    const user = await User.findOne({ email: email });

    if(!list) throw new Error ("Grocery list not found.");
    if(!user) throw new Error ("User does not exist.");

    const userId = user._id

    if (list.userId.toString() === userId.toString()) throw new Error ("User is already the owner of this list.");
    if (list.collaborators.some(id => id.toString() === userId.toString())) throw new Error ("User is already a collaborator on this list.");

    list.collaborators.push(userId);
    await list.save();

    return { message: "Successfully added user as a collaborator." };
}

const getIngredientList = recipes => {
    const ingredientMap = {};

    recipes.forEach( recipe => {
        recipe.extendedIngredients.forEach(ingredient=>{
            const pluralizedName =  pluralize(ingredient.name.toLowerCase()); 
            const name = ingredient.name.toLowerCase();
            const aisle = ingredient.aisle.toLowerCase();
            const amount = ingredient.measures.metric.amount || 0;
            const unit = ingredient.measures.metric.unitLong.toLowerCase() || "";

            //maps the items in pluralized form but stores item using original name
            if (!ingredientMap[pluralizedName]) {
                ingredientMap[pluralizedName] = {
                    name,
                    aisle,
                    amount,
                    unit
                }
            } else {
                ingredientMap[pluralizedName].amount += amount;
            }
        })
    })

    
    return Object.values(ingredientMap);
}

const groupIngredientByAisle = (ingredients) => {
    const grouped = {};

    ingredients.forEach(ingredient => {
        const aisle = ingredient.aisle || 'Other';
        if (!grouped[aisle]) {
            grouped[aisle] = [];
        }
        grouped[aisle].push({
            name: ingredient.name,
            amount: roundIfMoreThanTwoDecimals(ingredient.amount),
            unit: ingredient.unit,
            purchased: false
        })
    })

    return Object.entries(grouped).map(([aisle, items])=> ({
        aisle,
        items
    }));
};
 
function roundIfMoreThanTwoDecimals(amount) {
  const decimalPart = amount.toString().split('.')[1];
  if (decimalPart && decimalPart.length > 2) {
    return Math.ceil(amount);
  }
  return amount;
}