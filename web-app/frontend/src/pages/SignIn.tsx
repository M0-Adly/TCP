import React, { useState } from 'react'
import { Box, Input, Button, VStack, Heading, useToast, Text, Container, FormControl, FormLabel, InputGroup, InputLeftElement, useColorModeValue } from '@chakra-ui/react'
import { EmailIcon, LockIcon } from '@chakra-ui/icons'
import { motion, AnimatePresence } from 'framer-motion'
import { apiFetch } from '../lib/api'

const MotionBox = motion(Box)

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const bg = useColorModeValue('white', 'gray.800')
  const glassBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(23, 25, 35, 0.8)')

  const doSubmit = async () => {
    if (!email || !password) return toast({ title: 'Please fill all fields', status: 'warning' })
    setLoading(true)
    try {
      const path = mode === 'signin' ? '/auth/signin' : '/auth/signup'
      const res = await fetch('/api' + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
      const j = await res.json()
      if (res.ok && j.token) {
        localStorage.setItem('token', j.token)
        toast({ title: `Welcome ${mode === 'signup' ? 'aboard' : 'back'}!`, status: 'success' })
        setTimeout(() => window.location.href = '/profile', 500)
      }
      else toast({ title: j.error || 'Failed', status: 'error' })
    } catch (e: any) { toast({ title: 'Error', status: 'error' }) }
    finally { setLoading(false) }
  }

  return (
    <Box
      minH="80vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(to-br, brand.900, brand.700)"
      position="relative"
      overflow="hidden"
    >
      {/* Background Decoration */}
      <Box position="absolute" top="-10%" left="-10%" w="50%" h="50%" bg="brand.400" filter="blur(150px)" opacity={0.4} borderRadius="full" />
      <Box position="absolute" bottom="-10%" right="-10%" w="50%" h="50%" bg="purple.500" filter="blur(150px)" opacity={0.4} borderRadius="full" />

      <Container maxW="md" position="relative" zIndex={1}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          bg={glassBg}
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor={useColorModeValue('whiteAlpha.400', 'whiteAlpha.100')}
          p={8}
          borderRadius="2xl"
          boxShadow="2xl"
        >
          <VStack spacing={6}>
            <Heading size="lg" color="brand.500">{mode === 'signin' ? 'Welcome Back' : 'Create Account'}</Heading>
            <Text color="gray.500" fontSize="sm">
              {mode === 'signin' ? 'Enter your credentials to access your account.' : 'Join us to start building your personal dictionary.'}
            </Text>

            <FormControl>
              <FormLabel>Email Address</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none" children={<EmailIcon color="gray.300" />} />
                <Input placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} bg={useColorModeValue('white', 'whiteAlpha.100')} />
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none" children={<LockIcon color="gray.300" />} />
                <Input placeholder="••••••••" type="password" value={password} onChange={e => setPassword(e.target.value)} bg={useColorModeValue('white', 'whiteAlpha.100')} />
              </InputGroup>
            </FormControl>

            <Button
              colorScheme="brand"
              w="full"
              size="lg"
              onClick={doSubmit}
              isLoading={loading}
              boxShadow="lg"
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
            >
              {mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </Button>

            <Text fontSize="sm" color="gray.500">
              {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <Button variant="link" colorScheme="brand" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setEmail(''); setPassword('') }}>
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </Button>
            </Text>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  )
}
