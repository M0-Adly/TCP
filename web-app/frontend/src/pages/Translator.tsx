import React, { useState, useRef, useEffect } from 'react'
import { Box, Button, Select, HStack, VStack, Textarea, IconButton, useToast, Switch, Badge, Heading, Flex, useBreakpointValue, Stack, useColorModeValue, Text, Tooltip } from '@chakra-ui/react'
import { CopyIcon, DownloadIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import { motion } from 'framer-motion'
import { apiFetch } from '../lib/api'
import ReactCountryFlag from 'react-country-flag'
import { speak } from '../lib/tts'

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

  // Styling
  const glassBg = useColorModeValue('whiteAlpha.800', 'whiteAlpha.100')
  const glassBorder = useColorModeValue('gray.200', 'whiteAlpha.200')

  useEffect(() => {
    // Preload voices
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices()
      if (v.length > 0) console.log('Voices loaded:', v.length)
    }
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
  }, [])

  const doTranslate = async () => {
    if (!input) return
    setLoading(true)
    try {
      const res = await apiFetch('/translate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: input, target: targetLang }) })
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
    speak(result, targetLang === 'ar' ? 'ar' : 'en')
  }

  const doShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'Translation', text: result }) } catch (e) { }
    } else {
      toast({ title: 'Share not supported' })
    }
  }

  return (
    <Box maxW="1000px" mx="auto" p={4}>
      <VStack spacing={8} align="stretch">

        <Box
          bgGradient="linear(to-r, brand.600, brand.500)"
          p={{ base: 6, md: 10 }}
          color="white"
          borderRadius="xl"
          boxShadow="xl"
          position="relative"
          overflow="hidden"
        >
          <Box position="relative" zIndex={1}>
            <Heading size="xl" mb={2}>Instant Translator</Heading>
            <Text opacity={0.9} fontSize="lg">Breaking language barriers with AI-powered precision.</Text>
          </Box>
          {/* Decorative Circle */}
          <Box position="absolute" top={-10} right={-10} w="200px" h="200px" borderRadius="full" bg="whiteAlpha.200" filter="blur(2xl)" />
        </Box>

        <Stack direction={{ base: 'column', lg: 'row' }} spacing={6} align="stretch">

          {/* Input Section */}
          <Box
            flex={1}
            bg={glassBg}
            p={6}
            borderRadius="xl"
            border="1px solid"
            borderColor={glassBorder}
            backdropFilter="blur(12px)"
            boxShadow="lg"
          >
            <Textarea
              ref={el => areaRef.current = el}
              placeholder="Enter text to translate..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={(e: any) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doTranslate() } }}
              minH="200px"
              p={4}
              fontSize="lg"
              variant="filled"
              bg="whiteAlpha.200"
              _focus={{ bg: 'whiteAlpha.300', borderColor: 'brand.400' }}
              resize="none"
            />

            <HStack mt={5} spacing={4} wrap="wrap" justifyContent="space-between">

              <HStack spacing={4}>
                <Select
                  w="140px"
                  value={sourceLang}
                  onChange={e => setSourceLang(e.target.value)}
                  isDisabled={autoDetect}
                  variant="filled"
                >
                  <option value="auto">Auto</option>
                  {LANGS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                </Select>

                <Text color="gray.400">→</Text>

                <Select
                  w="140px"
                  value={targetLang}
                  onChange={e => setTargetLang(e.target.value)}
                  variant="filled"
                >
                  {LANGS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                </Select>

                <HStack>
                  <Switch id="auto-mode" colorScheme="brand" isChecked={autoDetect} onChange={(e) => setAutoDetect(e.target.checked)} />
                  <Text fontSize="sm" color="gray.500">Auto-detect</Text>
                </HStack>
              </HStack>

              <MotionButton
                colorScheme="brand"
                size="lg"
                onClick={doTranslate}
                isLoading={loading}
                whileTap={{ scale: 0.95 }}
                w={{ base: 'full', md: 'auto' }}
                px={8}
                boxShadow="md"
              >
                Translate
              </MotionButton>

            </HStack>
          </Box>

          {/* Result Section */}
          <Box
            flexBasis={{ base: 'auto', lg: '450px' }}
            bg="gray.800"
            color="white"
            p={6}
            borderRadius="xl"
            boxShadow="xl"
            display="flex"
            flexDirection="column"
          >
            <Flex justifyContent="space-between" alignItems="center" mb={4}>
              <Heading size="md" color="brand.200">Translation</Heading>
              <Badge colorScheme={detected ? 'green' : 'gray'}>
                {detected ? langLabel(detected) : 'Waiting...'}
              </Badge>
            </Flex>

            <Box flex={1} minH="140px" fontSize="xl" mb={4}>
              {result ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Text whiteSpace="pre-wrap" lineHeight="tall">{result}</Text>
                </motion.div>
              ) : (
                <Text color="gray.500" fontStyle="italic">Translation will appear here...</Text>
              )}
            </Box>

            <HStack spacing={2} justifyContent="flex-end">
              <Tooltip label="Copy">
                <IconButton aria-label="Copy" icon={<CopyIcon />} onClick={() => { navigator.clipboard.writeText(result); toast({ title: 'Copied', status: 'success' }) }} variant="ghost" colorScheme="whiteAlpha" />
              </Tooltip>
              <Tooltip label="Speak">
                <IconButton aria-label="Speak" icon={<Text>🔊</Text>} onClick={doSpeak} variant="ghost" colorScheme="whiteAlpha" isDisabled={!result} />
              </Tooltip>
              <Tooltip label="Save to Library">
                <IconButton aria-label="Save" icon={<DownloadIcon />} onClick={doSave} variant="ghost" colorScheme="whiteAlpha" isDisabled={!result} />
              </Tooltip>
              <Tooltip label="Share">
                <IconButton aria-label="Share" icon={<ExternalLinkIcon />} onClick={doShare} variant="ghost" colorScheme="whiteAlpha" isDisabled={!result} />
              </Tooltip>
            </HStack>
          </Box>

        </Stack>
      </VStack>
    </Box>
  )
}
