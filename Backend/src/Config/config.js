import dotenv from 'dotenv';
dotenv.config();

export default {
    port: process.env.PORT || 3000,
    mongo_uri: process.env.DB_URI,
    jwt_secret: process.env.JWT_SECRET,
    node_env: process.env.NODE_ENV || 'development',
};
