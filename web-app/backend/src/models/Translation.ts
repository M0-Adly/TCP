import mongoose from 'mongoose'

const TranslationSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false},
  text: {type: String, required: true},
  translation: {type: String, required: true},
  sourceLang: {type: String},
  targetLang: {type: String},
  createdAt: {type: Date, default: Date.now}
})

export default mongoose.model('Translation', TranslationSchema)
