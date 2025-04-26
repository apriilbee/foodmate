export const ENV = {
    get SPOONACULAR_KEY() {
        return process.env.SPOONACULAR_KEY;
    },
    get MONGO_URI() {
        return process.env.MONGO_URI;
    },
    get SESSION_SECRET() {
        return process.env.SESSION_SECRET || "default-session-secret";
    },
    get PORT() {
        return process.env.PORT || 3000;
    },
};
