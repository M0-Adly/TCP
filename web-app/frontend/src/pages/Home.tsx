import React, { useEffect, useState } from 'react'
import { Box, Heading, Text, HStack, Stat, StatLabel, StatNumber, Button, VStack, Stack, Container, SimpleGrid, Icon, useColorModeValue } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { Link as RouterLink } from 'react-router-dom'
import { FaLanguage, FaBook, FaUserFriends, FaGlobeAmericas } from 'react-icons/fa'

const MotionBox = motion(Box)

export default function Home() {
  const [words, setWords] = useState<number | null>(null)
  const [users, setUsers] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(j => { setWords(j.wordsTranslated); setUsers(j.users) }).catch(() => { })
  }, [])

  const cardBg = useColorModeValue('white', 'gray.800')

  return (
    <Box overflow="hidden">
      {/* Hero Section */}
      <Container maxW="1200px" py={20} position="relative">
        <Stack direction={{ base: 'column', md: 'row' }} spacing={10} align="center">
          <VStack align="flex-start" spacing={6} flex={1}>
            <MotionBox initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
              <Heading size="3xl" lineHeight="shorter" bgGradient="linear(to-r, brand.400, brand.600)" bgClip="text">
                Master Any Language <br /> In Seconds.
              </Heading>
            </MotionBox>
            <Text fontSize="xl" color="gray.500" maxW="lg">
              Experience the power of AI translation combined with your own personal dictionary. Learn, save, and grow your vocabulary effortlessly.
            </Text>
            <HStack spacing={4}>
              <Button as={RouterLink} to="/translator" size="lg" colorScheme="brand" px={8} fontSize="md">Start Translating</Button>
              <Button as={RouterLink} to="/signin" size="lg" variant="outline" fontSize="md">Join Now</Button>
            </HStack>
          </VStack>

          <Box flex={1} position="relative">
            <MotionBox
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              bgGradient="linear(to-br, brand.200, brand.500)"
              borderRadius="full"
              w="400px" h="400px"
              filter="blur(80px)"
              opacity={0.4}
              position="absolute"
              zIndex={-1}
            />
            <Icon as={FaGlobeAmericas} w="100%" h="auto" color="brand.500" opacity={0.8} />
          </Box>
        </Stack>
      </Container>

      {/* Stats Section */}
      <Box bg={useColorModeValue('gray.50', 'gray.900')} py={16}>
        <Container maxW="1000px">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <StatBox icon={FaLanguage} label="Words Translated" number={words} />
            <StatBox icon={FaUserFriends} label="Active Users" number={users} />
            <StatBox icon={FaBook} label="Library Entries" number={words ? Math.floor(words * 0.4) : 0} />
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  )
}

function StatBox({ icon, label, number }: { icon: any, label: string, number: number | null }) {
  return (
    <Box p={6} borderRadius="lg" bg={useColorModeValue('white', 'whiteAlpha.100')} boxShadow="lg" textAlign="center">
      <Icon as={icon} w={10} h={10} color="brand.500" mb={4} />
      <Heading size="lg" mb={2}>{number === null ? '...' : number.toLocaleString()}</Heading>
      <Text color="gray.500">{label}</Text>
    </Box>
  )
}
