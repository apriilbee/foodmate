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
    get MAILTRAP_HOST() {
        return process.env.MAILTRAP_HOST;
    },
    get MAILTRAP_PORT() {
        return process.env.MAILTRAP_PORT;
    },
    get MAILTRAP_USER() {
        return process.env.MAILTRAP_USER;
    },
    get MAILTRAP_PASS() {
        return process.env.MAILTRAP_PASS;
    },
    get BASE_URL() {
        return process.env.BASE_URL || "http://localhost:3000";
    },
};
