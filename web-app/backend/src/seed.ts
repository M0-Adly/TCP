import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/User'
import Translation from './models/Translation'
import bcrypt from 'bcrypt'

dotenv.config()
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/translator'
async function seed(){
  await mongoose.connect(MONGO)
  console.log('Connected to Mongo')

  // create demo user
  const email = 'demo@example.com'
  const existing = await User.findOne({email})
  if(!existing){
    const hash = await bcrypt.hash('password', 10)
    const u = await User.create({ email, passwordHash: hash })
    console.log('Created user', u.email)

    // create sample translations
    await Translation.create({ userId: u._id, text: 'hello', translation: 'مرحبا', sourceLang: 'en', targetLang: 'ar' })
    await Translation.create({ userId: u._id, text: 'world', translation: 'عالم', sourceLang: 'en', targetLang: 'ar' })
    console.log('Created sample translations')
  } else {
    console.log('Demo user already exists')
  }

  process.exit(0)
}

seed().catch(err=>{ console.error(err); process.exit(1) })
