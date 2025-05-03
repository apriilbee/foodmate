export const getProfile = (req, res) => {
    const data = {
        title: "Profile",
        user: {
            name : "John Doe",
            email: "johndoe@email.com",
            message: ""
        }
    };

    res.render("profile", data);
};
