import React, {useEffect, useState} from 'react'
import { Box, Heading, Text, Button } from '@chakra-ui/react'
import { apiFetch } from '../lib/api'

export default function Profile(){
  const [rows, setRows] = useState<any[]>([])
  useEffect(()=>{ (async()=>{ const res = await apiFetch('/library'); if(res.ok){ setRows(await res.json()) } })() },[])
  return (
    <Box maxW="700px" mx="auto">
      <Heading mb={4}>Profile</Heading>
      <Text mb={4}>Personal info, settings, translation history will appear here.</Text>
      <Heading size="md" mb={2}>Recent Translations</Heading>
      {rows.map((r:any) => (
        <Box key={r._id} p={2} bg="gray.700" mb={2} borderRadius="md">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>{r.text} → {r.translation}</Box>
            <Box fontSize="sm" color="gray.400">{new Date(r.createdAt).toLocaleString()}</Box>
          </Box>
        </Box>
      ))}
      <Button mt={4} onClick={()=>{ localStorage.removeItem('token'); window.location.href='/' }}>Sign Out</Button>
    </Box>
  )
}
