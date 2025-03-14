import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connection = mongoose.connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB: blogAppdb');
}).catch(err => {
    console.error('MongoDB Connection Error:', err);
});

export { connection };