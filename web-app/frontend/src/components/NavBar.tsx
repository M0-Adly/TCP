import React, { useState, useEffect } from 'react'
import { Box, Flex, HStack, Link, Spacer, IconButton, useColorMode, Button, useColorModeValue } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import { Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import Logo from './Logo'

const MotionBox = motion(Box)

export default function NavBar() {
  const { colorMode, toggleColorMode } = useColorMode()
  const [signed, setSigned] = useState(false)
  const bg = useColorModeValue('whiteAlpha.800', 'rgba(23, 25, 35, 0.8)')
  const color = useColorModeValue('gray.800', 'white')

  useEffect(() => setSigned(!!localStorage.getItem('token')), [])
  const doSignOut = () => { localStorage.removeItem('token'); window.location.href = '/' }

  return (
    <MotionBox
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      position="sticky"
      top={0}
      zIndex={100}
      bg={bg}
      backdropFilter="blur(16px)"
      borderBottom="1px solid"
      borderColor={useColorModeValue('gray.200', 'whiteAlpha.100')}
      px={6}
      py={3}
      color={color}
    >
      <Flex alignItems="center" maxW="1200px" mx="auto">
        <Box><Logo /></Box>
        <HStack spacing={8} ml={10} display={{ base: 'none', md: 'flex' }}>
          <Link as={RouterLink} to="/" fontWeight="medium" _hover={{ textDecor: 'none', color: 'brand.400' }}>Home</Link>
          <Link as={RouterLink} to="/translator" fontWeight="medium" _hover={{ textDecor: 'none', color: 'brand.400' }}>Translator</Link>
          <Link as={RouterLink} to="/library" fontWeight="medium" _hover={{ textDecor: 'none', color: 'brand.400' }}>Library</Link>
        </HStack>
        <Spacer />

        <HStack spacing={4}>
          {!signed && <Button as={RouterLink} to="/signin" size="sm" colorScheme="brand" variant="solid">Sign In</Button>}
          {signed && (
            <>
              <Link as={RouterLink} to="/profile" display={{ base: 'none', sm: 'block' }} fontWeight="medium">My Profile</Link>
              <Button size="sm" variant="outline" onClick={doSignOut}>Sign Out</Button>
            </>
          )}
          <IconButton
            size="sm"
            aria-label="Toggle color mode"
            onClick={toggleColorMode}
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            variant="ghost"
            borderRadius="full"
          />
        </HStack>
      </Flex>
    </MotionBox>
  )
}
