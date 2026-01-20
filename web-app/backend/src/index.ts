import express from 'express'
import path from 'path'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import User from './models/User'
import Translation from './models/Translation'
import bcrypt from 'bcryptjs'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 4000

app.get('/api/health', (req, res) => res.json({ ok: true }))

const connectDB = async () => {
    let mongoUri = process.env.MONGO_URI;

    // Use In-Memory MongoDB only if NOT in production/Vercel and no URI provided
    if (!process.env.VERCEL && (!mongoUri || mongoUri.trim() === '')) {
        try {
            console.log('Starting In-Memory MongoDB...');
            const mongod = await MongoMemoryServer.create();
            mongoUri = mongod.getUri();
            console.log('In-Memory MongoDB started at:', mongoUri);
        } catch (err) {
            console.error('Failed to start In-Memory Mongo', err);
        }
    }

    if (mongoUri) {
        try {
            await mongoose.connect(mongoUri);
            console.log('MongoDB connected');

            // Seeding (Only run if we have a connection)
            const count = await User.countDocuments();
            if (count === 0) {
                console.log('Seeding database...');
                const email = 'demo@example.com'
                const hash = await bcrypt.hash('password', 10)
                const u = await User.create({ email, passwordHash: hash })

                await Translation.create({ userId: u._id, text: 'hello', translation: 'مرحبا', sourceLang: 'en', targetLang: 'ar' })
                await Translation.create({ userId: u._id, text: 'world', translation: 'عالم', sourceLang: 'en', targetLang: 'ar' })
                console.log('Created sample translations');
            }
        } catch (err) {
            console.error('Mongo connect err', err);
        }
    } else {
        console.warn('No MongoDB URI provided. Database features will fail.');
    }
};

// Routes
const authRoutes = require('./routes/auth').default
const translateRoutes = require('./routes/translate').default
const libraryRoutes = require('./routes/library').default
const statsRoutes = require('./routes/stats').default

app.use('/api/auth', authRoutes)
app.use('/api/translate', translateRoutes)
app.use('/api/library', libraryRoutes)
app.use('/api/stats', statsRoutes)

// Serve Static Files (Frontend) - primarily for local/VPS usage
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// Catch-all for React (Local/VPS)
app.get('*', (req, res) => {
    // If request is for API, don't serve HTML
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'Not found' });
    }
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Connect DB immediately if we are in a serverless context (Vercel)
if (process.env.VERCEL) {
    connectDB();
}

// Only listen if not creating a Vercel build (Vercel handles listening)
if (require.main === module) {
    connectDB().then(() => {
        app.listen(PORT, () => console.log('Server running on', PORT))
    });
}

// Export app for Vercel
export default app;
