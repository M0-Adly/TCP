import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User'

const router = Router()

router.post('/signup', async (req,res)=>{
  const { email, password } = req.body
  if(!email || !password) return res.status(400).json({error:'missing'})
  const existing = await User.findOne({email})
  if(existing) return res.status(409).json({error:'exists'})
  const hash = await bcrypt.hash(password, 10)
  const u = await User.create({email, passwordHash: hash})
  const token = jwt.sign({id:u._id}, process.env.JWT_SECRET || 'dev', {expiresIn:'7d'})
  res.json({token})
})

router.post('/signin', async (req,res)=>{
  const { email, password } = req.body
  const u = await User.findOne({email})
  if(!u) return res.status(401).json({error:'invalid'})
  const ok = await bcrypt.compare(password, u.get('passwordHash'))
  if(!ok) return res.status(401).json({error:'invalid'})
  const token = jwt.sign({id:u._id}, process.env.JWT_SECRET || 'dev', {expiresIn:'7d'})
  res.json({token})
})

export default router
