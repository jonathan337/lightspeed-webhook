require('dotenv').config();

module.exports = {
    LIGHTSPEED: {
        PERSONAL_ACCESS_TOKEN: process.env.LIGHTSPEED_ACCESS_TOKEN,
        DOMAIN_PREFIX: process.env.LIGHTSPEED_DOMAIN_PREFIX,
        BASE_URL: `https://${process.env.LIGHTSPEED_DOMAIN_PREFIX}.vendhq.com/api/2.0`
    },
    GOOGLE: {
        SPREADSHEET_ID: process.env.GOOGLE_SPREADSHEET_ID,
        CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
        PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY
    },
    PORT: process.env.PORT || 3000,
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET
}; 