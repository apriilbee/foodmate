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

        console.log("📦 Selected category:", selectedCategory);
        console.log("🥗 Selected diets:", selectedDiets);
    }

    // Click to select category
    categories.forEach((item, index) => {
        item.addEventListener("click", () => setActiveCategory(index));
    });

    // Keyboard arrow nav
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight" && activeIndex < categories.length - 1) {
            setActiveCategory(activeIndex + 1);
        } else if (e.key === "ArrowLeft" && activeIndex > 0) {
            setActiveCategory(activeIndex - 1);
        }
    });

    // Click to toggle diet tags
    dietTags.forEach((tag) => {
        tag.addEventListener("click", () => {
            tag.classList.toggle("active");
            logSelection();
        });
    });
});
