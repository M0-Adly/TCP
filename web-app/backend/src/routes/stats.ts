import { Router } from 'express'
import Translation from '../models/Translation'
import User from '../models/User'

const router = Router()

router.get('/', async (req,res)=>{
  const wordsCount = await Translation.countDocuments()
  const users = await User.countDocuments()
  res.json({ wordsTranslated: wordsCount, users })
})

export default router
