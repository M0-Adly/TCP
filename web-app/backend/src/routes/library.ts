import { Router } from 'express'
import Translation from '../models/Translation'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { createObjectCsvWriter } from 'csv-writer'
import PDFDocument from 'pdfkit'

const router = Router()

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId
  const rows = await Translation.find({ userId }).sort({ createdAt: -1 }).limit(100)
  res.json(rows)
})

// router.post('/', requireAuth, async (req: AuthRequest, res)=>{
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const { text, translation, sourceLang, targetLang } = req.body

  // Check for duplicates
  const exists = await Translation.findOne({
    userId: req.userId,
    text: text,
    translation: translation,
    targetLang: targetLang
  })

  if (exists) {
    return res.status(409).json({ error: 'Already saved' })
  }

  const rec = await Translation.create({ userId: req.userId, text, translation, sourceLang, targetLang })
  res.json(rec)
})

router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params
  await Translation.deleteOne({ _id: id, userId: req.userId })
  res.json({ ok: true })
})

router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params
  const { text, translation } = req.body
  const updated = await Translation.findOneAndUpdate(
    { _id: id, userId: req.userId },
    { text, translation },
    { new: true }
  )
  if (!updated) return res.status(404).json({ error: 'Not found' })

  res.json(updated)
})

router.get('/export', requireAuth, async (req: AuthRequest, res) => {
  const { format = 'csv' } = req.query
  const rows = await Translation.find({ userId: req.userId }).sort({ createdAt: -1 })
  if (format === 'pdf') {
    const doc = new PDFDocument()
    res.setHeader('Content-Type', 'application/pdf')
    doc.pipe(res)
    doc.fontSize(14).text('Translation Library', { align: 'center' })
    doc.moveDown()
    rows.forEach(r => doc.text(`${r.text} -> ${r.translation}  [${r.createdAt.toISOString()}]`))
    doc.end()
    return
  }
  // CSV
  const csv = rows.map(r => `${r.text.replace(/,/g, '')},${r.translation.replace(/,/g, '')},${r.createdAt.toISOString()}`).join('\n')
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="library.csv"')
  res.send('word,translation,date\n' + csv)
})

export default router
