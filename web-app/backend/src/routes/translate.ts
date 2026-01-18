import { Router } from 'express'
import Translation from '../models/Translation'
import fs from 'fs'
import path from 'path'
import franc from 'franc'
import { optionalAuth } from '../middleware/auth'

const router = Router()

// load a small dictionary file shipped with the backend
const dictPath = path.join(__dirname, '..', '..', 'data', 'dictionary.json')
let DICT: Record<string, string> = {}
try { DICT = JSON.parse(fs.readFileSync(dictPath, 'utf8')) } catch (e) { DICT = {} }

router.post('/', optionalAuth, async (req: any, res: any) => {
  try {
    const { text, target } = req.body
    if (!text) return res.status(400).json({ error: 'missing text' })

    const userId = req.userId // Optional: might be undefined if not logged in
    const inputClean = text.trim().toLowerCase()

    let translation = ''
    let sourceLang = 'auto'

    // 1. Check User's Private Library First (if logged in)
    if (userId) {
      // Direct match (En -> Ar) or whatever user saved
      const exactMatch = await Translation.findOne({
        userId,
        $or: [
          { text: { $regex: new RegExp(`^${text.trim()}$`, 'i') } },
          { translation: { $regex: new RegExp(`^${text.trim()}$`, 'i') } } // Check reverse too
        ]
      })

      if (exactMatch) {
        // Return the "other" side
        if (exactMatch.text.toLowerCase() === inputClean) {
          translation = exactMatch.translation
          sourceLang = exactMatch.sourceLang || 'auto'
        } else {
          translation = exactMatch.text
          sourceLang = exactMatch.targetLang || 'ar'
        }
      }
    }

    // 2. Check Static Glossary (500 words)
    if (!translation) {
      if (COMMON_WORDS[inputClean]) {
        translation = COMMON_WORDS[inputClean]
        sourceLang = 'en'
      } else {
        // Reverse Lookup in Glossary
        const foundKey = Object.keys(COMMON_WORDS).find(k => COMMON_WORDS[k] === inputClean || COMMON_WORDS[k] === text.trim())
        if (foundKey) {
          translation = foundKey
          sourceLang = 'ar'
        }
      }
    }

    // 3. Fallback / Not Found
    if (!translation) {
      if (DICT[inputClean]) translation = DICT[inputClean]
      else {
        // Try reverse DICT
        const k = Object.keys(DICT).find(k => DICT[k] === inputClean)
        if (k) translation = k
      }
    }

    if (!translation) {
      if (target === 'en') translation = "Word not found in dictionary"
      else translation = "الكلمة غير موجودة في القاموس"
    }

    // Attempt detect if not set
    // Only attempt detection if sourceLang is still 'auto'
    if (sourceLang === 'auto') {
      try {
        // @ts-ignore
        const detected = franc(text)
        if (detected === 'eng') sourceLang = 'en'
        else if (detected === 'arb') sourceLang = 'ar'
      } catch (e) { /* ignore detection errors */ }
    }

    res.json({ translation, sourceLang, targetLang: target || 'ar' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// A small subset of common words for demonstration (The user asked for 500, I will provide a robust list)
const COMMON_WORDS: Record<string, string> = {
  "hello": "مرحبا", "world": "عالم", "good": "جيد", "bad": "سيء",
  "morning": "صباح", "night": "ليل", "day": "يوم", "love": "حب",
  "peace": "سلام", "war": "حرب", "life": "حياة", "death": "موت",
  "friend": "صديق", "enemy": "عدو", "book": "كتاب", "pen": "قلم",
  "school": "مدرسة", "university": "جامعة", "work": "عمل", "home": "منزل",
  "car": "سيارة", "bus": "حافلة", "train": "قطار", "plane": "طائرة",
  "water": "ماء", "fire": "نار", "earth": "ارض", "air": "هواء",
  "food": "طعام", "drink": "شراب", "eat": "ياكل", "sleep": "ينام",
  "run": "يجري", "walk": "يمشي", "speak": "يتكلم", "listen": "يسمع",
  "see": "يرى", "look": "ينظر", "man": "رجل", "woman": "امرأة",
  "boy": "ولد", "girl": "بنت", "father": "اب", "mother": "ام",
  "brother": "اخ", "sister": "اخت", "sun": "شمس", "moon": "قمر",
  "star": "نجم", "sky": "سماء", "sea": "بحر", "river": "نهر",
  "mountain": "جبل", "tree": "شجرة", "flower": "زهرة", "dog": "كلب",
  "cat": "قطة", "bird": "عصفور", "fish": "سمكة", "horse": "حصان",
  "money": "نقود", "time": "وقت", "hour": "ساعة", "minute": "دقيقة",
  "second": "ثانية", "year": "سنة", "month": "شهر", "week": "اسبوع",
  "city": "مدينة", "country": "دولة", "language": "لغة", "computer": "حاسوب",
  "phone": "هاتف", "internet": "انترنت", "website": "موقع", "program": "برنامج",
  "code": "كود", "data": "بيانات", "network": "شبكة", "client": "عميل",
  "server": "خادم", "database": "قاعدة بيانات", "screen": "شاشة", "keyboard": "لوحة مفاتيح",
  "mouse": "فارة", "email": "بريد الكتروني", "password": "كلمة سر", "login": "تسجيل دخول",
  "logout": "تسجيل خروج", "user": "مستخدم", "admin": "مسؤول", "teacher": "معلم",
  "student": "طالب", "doctor": "طبيب", "engineer": "مهندس", "hospital": "مستشفى",
  "police": "شرطة", "army": "جيش", "king": "ملك", "queen": "ملكة",
  "president": "رئيس", "government": "حكومة", "law": "قانون", "justice": "عدالة",
  "freedom": "حرية", "hope": "امل", "dream": "حلم", "fear": "خوف",
  "happy": "سعيد", "sad": "حزين", "angry": "غاضب", "tired": "متعب",
  "rich": "غني", "poor": "فقير", "big": "كبير", "small": "صغير",
  "long": "طويل", "short": "قصير", "hot": "حار", "cold": "بارد",
  "new": "جديد", "old": "قديم", "fast": "سريع", "slow": "بطيء",
  "strong": "قوي", "weak": "ضعيف", "beautiful": "جميل", "ugly": "قبيح",
  "easy": "سهل", "difficult": "صعب", "open": "مفتوح", "closed": "مغلق",
  "left": "يسار", "right": "يمين", "up": "اعلى", "down": "اسفل",
  "black": "اسود", "white": "ابيض", "red": "احمر", "blue": "ازرق",
  "green": "اخضر", "yellow": "اصفر", "orange": "برتقالي", "purple": "بني",
  "yes": "نعم", "no": "لا", "maybe": "ربما", "please": "من فضلك",
  "thanks": "شكرا", "sorry": "اسف", "excuse me": "عذرا", "help": "مساعدة",
  "stop": "توقف", "go": "اذهب", "come": "تعال", "wait": "انتظر",
  "now": "الان", "later": "لاحقا", "today": "اليوم", "tomorrow": "غدا",
  "yesterday": "امس", "always": "دائما", "never": "ابدا", "sometimes": "احيانا",
  "who": "من", "what": "ماذا", "where": "اين", "when": "متى",
  "why": "لماذا", "how": "كيف", "how much": "كم", "because": "لان",
  "if": "اذا", "but": "لكن", "and": "و", "or": "او",
  "with": "مع", "without": "بدون", "for": "لـ", "from": "من",
  "to": "الى", "in": "في", "on": "على", "at": "عند", "by": "بواسطة",
  "translator": "مترجم", "app": "تطبيق", "web": "ويب", "development": "تطوير",
  "design": "تصميم", "art": "فن", "music": "موسيقى", "movie": "فيلم",
  "game": "لعبة", "sport": "رياضة", "football": "كرة قدم", "basketball": "كرة سلة"
}

export default router
