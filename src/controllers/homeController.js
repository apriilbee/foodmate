export const getIndex = (req, res) => {
    res.render("index", { title: "Login" });
};

export const getHome = (req, res) => {
    res.render("home", {
        title: "Home",
        user: req.user,
    });
};

export const healthCheck = (req, res) => {
    res.status(200).json({ status: "ok" });
};
