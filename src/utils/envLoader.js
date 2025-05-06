export const ENV = {
    get SPOONACULAR_KEY() {
        return process.env.SPOONACULAR_KEY;
    },
    get MONGO_URI() {
        return process.env.MONGO_URI;
    },
    get PORT() {
        return process.env.PORT || 3000;
    },
    get JWT_SECRET() {
        return process.env.JWT_SECRET;
    },
    get GEMINI_API_KEY() {
        return process.env.GEMINI_API_KEY;
    },
};
