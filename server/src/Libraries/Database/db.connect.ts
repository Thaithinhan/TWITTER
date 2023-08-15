import mongoose from 'mongoose';

import dbConfig from '../../Configs/db.config';

const connectDB = async () => {
    try {
        const uri = `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`
        await mongoose.connect(uri, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true
        });
        console.log('Connected to MongoDB successfully!');
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error connecting to MongoDB:', error.message);
        } else {
            console.error('Error connecting to MongoDB:', error);
        }
    }
}

export default connectDB;