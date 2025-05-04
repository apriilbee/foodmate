document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("recipe-search-input");
    console.log(searchInput);

    searchInput.addEventListener("keydown", async (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            const query = searchInput.value.trim();
            if (!query) return;

            try {
                const res = await fetch(`/api/recipes/search?query=${encodeURIComponent(query)}`, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });

                const data = await res.json();
                console.log("Search result:", data);

                if (!res.ok) {
                    console.error("Search error:", data.message);
                }
            } catch (err) {
                console.error("Fetch failed:", err);
            }
        }
    });
});
