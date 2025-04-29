import { renderRecipes } from './recipe-card.js';

document.addEventListener("DOMContentLoaded", () => {
    const categories = document.querySelectorAll(".category-item");
    const dietTags = document.querySelectorAll(".tag");

    let activeIndex = [...categories].findIndex((el) => el.classList.contains("active"));

    function setActiveCategory(index) {
        categories.forEach((el) => el.classList.remove("active"));
        categories[index].classList.add("active");
        categories[index].scrollIntoView({ behavior: "smooth", inline: "center" });
        activeIndex = index;
        logSelection();
    }

    function logSelection() {
        const selectedCategory = categories[activeIndex]?.querySelector("p")?.innerText;
        const selectedDiets = [...dietTags]
            .filter((tag) => tag.classList.contains("active"))
            .map((tag) => tag.textContent.trim());
        const selectedAllergies = Array.from(document.querySelectorAll('#allergy-dropdown input[type="checkbox"]:checked'))
            .map((cb) => cb.value);
    
        const params = new URLSearchParams();
    
        if (selectedCategory) params.append('category', selectedCategory);
        if (selectedDiets.length) params.append('tags', selectedDiets.join(','));
        if (selectedAllergies.length) params.append('allergies', selectedAllergies.join(','));
    
        fetch(`/api/recipes?${params.toString()}`)
            .then((res) => res.json())
            .then((data) => {
                renderRecipes(data.recipes.slice(0, 9)); 
            })
            .catch((err) => console.error("Failed to fetch recipes:", err));
    }
    
    categories.forEach((item, index) => {
        item.addEventListener("click", () => setActiveCategory(index));
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight" && activeIndex < categories.length - 1) {
            setActiveCategory(activeIndex + 1);
        } else if (e.key === "ArrowLeft" && activeIndex > 0) {
            setActiveCategory(activeIndex - 1);
        }
    });

    dietTags.forEach((tag) => {
        tag.addEventListener("click", () => {
            tag.classList.toggle("active");
            logSelection();
        });
    });

    logSelection();
});
