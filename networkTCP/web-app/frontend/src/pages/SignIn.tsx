import React, { useState } from 'react'
import { Box, Input, Button, VStack, Heading, useToast } from '@chakra-ui/react'
import { apiFetch } from '../lib/api'

export default function SignIn() {
  const [email, setEmail] = useState('demo@example.com')
  const [password, setPassword] = useState('password')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const toast = useToast()

  const doSubmit = async () => {
    try {
      const path = mode === 'signin' ? '/auth/signin' : '/auth/signup'
      const res = await fetch('/api' + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
      const j = await res.json()
      if (res.ok && j.token) { localStorage.setItem('token', j.token); window.location.href = '/profile' }
      else toast({ title: j.error || 'Failed', status: 'error' })
    } catch (e: any) { toast({ title: 'Error', status: 'error' }) }
  }

  return (
    <Box maxW="420px" mx="auto">
      <Heading mb={4}>{mode === 'signin' ? 'Sign In' : 'Sign Up'}</Heading>
      <VStack spacing={3}>
        <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <Button colorScheme="brand" onClick={doSubmit}>{mode === 'signin' ? 'Sign In' : 'Create Account'}</Button>
        <Button variant="ghost" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>{mode === 'signin' ? 'Create an account' : 'Have an account? Sign in'}</Button>
      </VStack>
    </Box>
  )
}
