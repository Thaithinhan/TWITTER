import dotenv from 'dotenv';

dotenv.config()
const dbConfig = {
    host: process.env.MONGODB_HOST || 'localhost',
    port: process.env.MONGODB_PORT || '27017',
    database: process.env.MONGODB_DATABASE || 'test'
}

export default dbConfig