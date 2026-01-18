import express from 'express'
import path from 'path'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import User from './models/User'
import Translation from './models/Translation'
import bcrypt from 'bcrypt'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 4000

app.get('/api/health', (req, res) => res.json({ ok: true }))

const startServer = async () => {
    let mongoUri = process.env.MONGO_URI;

    try {
        if (!mongoUri || mongoUri.includes('cluster0.mongodb.net') || mongoUri === '') {
            console.log('Starting In-Memory MongoDB...');
            const mongod = await MongoMemoryServer.create();
            mongoUri = mongod.getUri();
            console.log('In-Memory MongoDB started at:', mongoUri);
        }

        await mongoose.connect(mongoUri!);
        console.log('MongoDB connected');

        // Automatic Seeding
        const count = await User.countDocuments();
        if (count === 0) {
            console.log('Seeding database...');
            const email = 'demo@example.com'
            const hash = await bcrypt.hash('password', 10)
            const u = await User.create({ email, passwordHash: hash })
            console.log('Created user', u.email)

            await Translation.create({ userId: u._id, text: 'hello', translation: 'مرحبا', sourceLang: 'en', targetLang: 'ar' })
            await Translation.create({ userId: u._id, text: 'world', translation: 'عالم', sourceLang: 'en', targetLang: 'ar' })
            console.log('Created sample translations');
        }

    } catch (err) {
        console.error('Mongo connect err', err);
    }

    const authRoutes = require('./routes/auth').default
    const translateRoutes = require('./routes/translate').default
    const libraryRoutes = require('./routes/library').default
    const statsRoutes = require('./routes/stats').default

    app.use('/api/auth', authRoutes)
    app.use('/api/translate', translateRoutes)
    app.use('/api/library', libraryRoutes)
    app.use('/api/stats', statsRoutes)

    // Serve Frontend (Static)
    // Assuming 'public' is one level up from the compiled 'dist' folder (or in root for ts-node)
    // We try to locate it robustly
    const publicPath = process.env.NODE_ENV === 'production'
        ? path.join(__dirname, '../public')
        : path.join(__dirname, '../public');

    app.use(express.static(publicPath));

    // Handle React Routing (SPA) - Return index.html for any unknown route
    app.get('*', (req, res) => {
        res.sendFile(path.join(publicPath, 'index.html'));
    });

    app.listen(PORT, () => console.log('Server running on', PORT))
};

startServer();
