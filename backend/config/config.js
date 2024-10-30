require('dotenv').config();

const config = {
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI,
    SECRET_KEY: process.env.SECRET_KEY,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
};

module.exports = config;