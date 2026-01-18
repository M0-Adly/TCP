import React, { useState, useRef } from 'react'
import { Box, Input, Button, Select, HStack, VStack, Textarea, Spinner, IconButton, useToast, Switch, Badge, Heading, Flex, useBreakpointValue, Stack } from '@chakra-ui/react'
import { CopyIcon, DownloadIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import { motion } from 'framer-motion'
import { apiFetch } from '../lib/api'

import ReactCountryFlag from 'react-country-flag'

const LANGS: { code: string, label: string, countryCode: string }[] = [
  { code: 'en', label: 'English', countryCode: 'US' },
  { code: 'ar', label: 'Arabic', countryCode: 'SA' },
]

function FlagLabel({ code }: { code: string }) {
  const found = LANGS.find(l => l.code === code)
  if (!found) return <span>—</span>
  return <span><ReactCountryFlag svg countryCode={found.countryCode} style={{ width: '1.3em', height: '1.3em', marginRight: 8 }} /> {found.label}</span>
}

function langLabel(code?: string) {
  if (!code) return 'Unknown'
  const found = LANGS.find(l => l.code === code)
  return found ? `${found.label}` : code
}

const MotionButton = motion(Button)

export default function Translator() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [detected, setDetected] = useState<string | null>(null)
  const [autoDetect, setAutoDetect] = useState(true)
  const [sourceLang, setSourceLang] = useState('auto')
  const [targetLang, setTargetLang] = useState('ar')
  const toast = useToast()
  const areaRef = useRef<HTMLTextAreaElement | null>(null)
  const isMobile = useBreakpointValue({ base: true, md: false })

  const doTranslate = async () => {
    if (!input) return
    setLoading(true)
    try {
      const res = await fetch('/api/translate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: input, target: targetLang }) })
      const j = await res.json()
      setResult(j.translation)
      setDetected(j.sourceLang || null)
      if (autoDetect && j.sourceLang) {
        setSourceLang(j.sourceLang)
        // Auto switch target based on source
        if (j.sourceLang === 'ar') setTargetLang('en')
        else if (j.sourceLang === 'en') setTargetLang('ar')
      }
    } catch (e: any) {
      toast({ title: 'Translation failed', status: 'error' })
    } finally { setLoading(false) }
  }

  const doSave = async () => {
    if (!result) return toast({ title: 'Nothing to save', status: 'warning' })
    try {
      const res = await apiFetch('/library', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: input, translation: result, sourceLang: sourceLang, targetLang: targetLang }) })
      if (res.ok) {
        toast({ title: 'Saved to library', status: 'success' })
      } else if (res.status === 409) {
        toast({ title: 'Already saved', status: 'info' })
      } else {
        toast({ title: 'Save failed', status: 'error' })
      }
    } catch (e: any) { toast({ title: 'Save failed', status: 'error' }) }
  }

  const doSpeak = () => {
    if (!result) return
    const u = new SpeechSynthesisUtterance(result)
    // Fix TTS codes
    u.lang = targetLang === 'ar' ? 'ar-SA' : 'en-US'
    window.speechSynthesis.speak(u)
  }

  const doShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'Translation', text: result }) } catch (e) { }
    } else {
      toast({ title: 'Share not supported' })
    }
  }

  return (
    <Box maxW="920px" mx="auto">
      <VStack spacing={6} align="stretch">

        <Box bgGradient="linear(to-r, brand.600, brand.700)" p={{ base: 6, md: 8 }} color="white" borderRadius="md">
          <Flex direction={{ base: 'column', md: 'row' }} alignItems="center" justifyContent="space-between">
            <Box>
              <Heading size="lg">Instant Translator</Heading>
              <Box mt={2} opacity={0.9}>Fast translations with live detection, library, and TTS.</Box>
            </Box>
            <Box mt={{ base: 4, md: 0 }}>
              <Button colorScheme="blackAlpha" variant="solid" size="sm">Get Pro</Button>
            </Box>
          </Flex>
        </Box>

        <Stack direction={{ base: 'column', md: 'row' }} spacing={6} align="stretch">
          <Box flex={1}>
            <Textarea
              ref={el => areaRef.current = el}
              placeholder="Enter text to translate (press Enter + Shift for newline, Enter to translate)"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={(e: any) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doTranslate() } }}
              minH="180px"
              p={4}
              fontSize={{ base: 'md', md: 'lg' }}
              aria-label="Text to translate"
            />

            <HStack mt={4} spacing={3} wrap="wrap">
              <HStack>
                <Badge>Auto-detect</Badge>
                <Switch isChecked={autoDetect} onChange={(e) => setAutoDetect(e.target.checked)} />
              </HStack>

              <Select w="160px" value={sourceLang} onChange={e => setSourceLang(e.target.value)} isDisabled={autoDetect}>
                <option value="auto">Auto</option>
                {LANGS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
              </Select>

              <Select w="160px" value={targetLang} onChange={e => setTargetLang(e.target.value)}>
                {LANGS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
              </Select>

              <Box>
                <FlagLabel code={sourceLang} /> → <FlagLabel code={targetLang} />
              </Box>

            </HStack>

            <HStack mt={4} spacing={3}>
              <MotionButton
                colorScheme="brand"
                size={isMobile ? 'lg' : 'lg'}
                onClick={doTranslate}
                isLoading={loading}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Translating...' : 'Translate'}
              </MotionButton>

              <Button leftIcon={<CopyIcon />} onClick={() => { navigator.clipboard.writeText(result); toast({ title: 'Copied', status: 'success' }) }}>Copy</Button>
              <Button leftIcon={<DownloadIcon />} onClick={doSave}>Save</Button>
              <Button leftIcon={<ExternalLinkIcon />} onClick={doShare}>Share</Button>
              <Button onClick={doSpeak}>🔊</Button>
            </HStack>
          </Box>

          <Box flexBasis={{ base: 'auto', md: '420px' }} bg="gray.700" p={4} borderRadius="md">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Heading size="sm">Result</Heading>
                <Box fontSize="sm" color="gray.300">Detected: {detected ? langLabel(detected) : '—'}</Box>
              </Box>
            </Box>

            <Box mt={3} minH="140px" fontSize={{ base: 'md', md: 'lg' }}>
              {result ? <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}><Box whiteSpace="pre-wrap">{result}</Box></motion.div> : <Box color="gray.400">Translation will appear here.</Box>}
            </Box>

          </Box>
        </Stack>

      </VStack>
    </Box>
  )
}
