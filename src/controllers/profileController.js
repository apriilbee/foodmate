export const getProfile = (req, res) => {
    res.render("profile", {
        title: "Profile",
        user: {
            name : "John Doe",
            email: "johndoe@email.com",
            message: ""
        },
    });
};       
 