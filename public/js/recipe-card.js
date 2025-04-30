export function renderRecipes(recipes) {
    const mealList = document.getElementById('meal-list');
    mealList.innerHTML = ''; // Clear old results

    if (!recipes || recipes.length === 0) {
        const mealList = document.getElementById('meal-list');
        mealList.innerHTML = `
            <div class="col s12 center-align" style="margin-top: 40px;">
                <img src="/img/icons/empty-plate.svg" alt="No results" style="width: 100px; margin-bottom: 16px;" />
                <p style="color: #777; font-size: 18px;">😕 No recipes found.</p>
                <p style="color: #aaa; font-size: 14px;">Try adjusting your filters or search term.</p>
            </div>
        `;
        return;
    }
    

    recipes.slice(0, 9).forEach(recipe => {
        const cardHTML = `
            <div class="col s12 m6 l4">
                <div class="card hoverable" style="border-radius: 16px; overflow: hidden;">
                    <div class="card-image">
                        <img src="${recipe.image}" alt="${recipe.title}" style="height: 200px; object-fit: cover;">
                        <span class="card-title" style="
                            background: rgba(0, 0, 0, 0.5);
                            font-size: 18px;
                            height: 48px;
                            width: 100%;
                            line-height: 48px;
                            padding: 0 12px;
                            display: block;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        ">${recipe.title}</span>

                    </div>
                    <div class="card-content" style="display: flex; justify-content: space-between; align-items: center;">
                        <p style="font-size: 14px; color: #777; margin: 0;">
                            🍽️ <a href="#" class="show-more-link" style="text-decoration: none; color: #FE8641;">Show more...</a>
                        </p>
                        <!--button-->
                 <button class="add-to-meal-btn" onclick="openModal(this)" data-recipe-id="12345">+</button>
                    </div>
                </div>
            </div>
        `;
        
        mealList.insertAdjacentHTML('beforeend', cardHTML);
    });
}
