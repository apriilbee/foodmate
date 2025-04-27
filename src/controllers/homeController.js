export const getIndex = (req, res) => {
    res.render("index", { title: "Login" });
};

export const getHome = (req, res) => {
    if (!req.session.user) {
        return res.redirect("/auth/login");
    }
    res.render("home", { title: "Dashboard", user: req.session.user });
};

export const healthCheck = (req, res) => {
    res.status(200).json({ status: "ok" });
};
