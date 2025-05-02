export const getIndex = (req, res) => {
    res.render("index", { title: "Login", error: null });
};

export const getHome = (req, res) => {
    res.render("home", {
        title: "Home",
        user: req.user,
    });
};

export const getRecipe = (req, res) => {
    res.render("recipe", {
        title: "Recipe",
        user: req.user
    })
}

export const healthCheck = (req, res) => {
    res.status(200).json({ status: "ok" });
};
