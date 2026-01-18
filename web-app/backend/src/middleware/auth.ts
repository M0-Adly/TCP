import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  userId?: string
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const h = req.headers.authorization
  if (!h) return res.status(401).json({ error: 'unauth' })
  const token = h.split(' ')[1]
  try {
    const p: any = jwt.verify(token, process.env.JWT_SECRET || 'dev')
    req.userId = p.id
    next()
  } catch (e) {
    return res.status(401).json({ error: 'unauth' })
  }
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const h = req.headers.authorization
  if (!h) {
    next() // No token, just proceed as guest
    return
  }
  const token = h.split(' ')[1]
  try {
    const p: any = jwt.verify(token, process.env.JWT_SECRET || 'dev')
    req.userId = p.id
  } catch (e) {
    // Invalid token, just ignore it and proceed as guest
  }
  next()
}
