import React, {useEffect, useState} from 'react'
import { Box, Heading, Text, HStack, Stat, StatLabel, StatNumber } from '@chakra-ui/react'

export default function Home(){
  const [words, setWords] = useState<number | null>(null)
  const [users, setUsers] = useState<number | null>(null)

  useEffect(()=>{
    fetch('/api/stats').then(r=>r.json()).then(j=>{ setWords(j.wordsTranslated); setUsers(j.users) }).catch(()=>{})
  },[])

  return (
    <Box maxW="900px" mx="auto">
      <Heading mb={4}>Welcome to the Translator</Heading>
      <Text mb={6}>Fast, clean translation with live stats and library.</Text>
      <HStack spacing={6}>
        <Stat>
          <StatLabel>Words Translated</StatLabel>
          <StatNumber>{words === null ? '—' : words}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Active Users</StatLabel>
          <StatNumber>{users === null ? '—' : users}</StatNumber>
        </Stat>
      </HStack>
    </Box>
  )
}
