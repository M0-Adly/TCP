import React, {useState, useEffect} from 'react'
import { Box, Flex, HStack, Link, Spacer, IconButton, useColorMode, Button } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import { Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import Logo from './Logo'

const MotionBox = motion(Box)

export default function NavBar(){
  const { colorMode, toggleColorMode } = useColorMode()
  const [signed, setSigned] = useState(false)
  useEffect(()=> setSigned(!!localStorage.getItem('token')), [])
  const doSignOut = ()=>{ localStorage.removeItem('token'); window.location.href = '/' }
  return (
    <MotionBox initial={{y:-10, opacity:0}} animate={{y:0, opacity:1}} transition={{duration:0.4}} bg="brand.800" px={4} py={2} color="white">
      <Flex alignItems="center">
        <Box><Logo/></Box>
        <HStack spacing={6} ml={6}>
          <Link as={RouterLink} to="/">Home</Link>
          <Link as={RouterLink} to="/translator">Translator</Link>
          <Link as={RouterLink} to="/library">Library</Link>
          {!signed && <Link as={RouterLink} to="/signin">Sign In</Link>}
          {signed && <Link as={RouterLink} to="/profile">Profile</Link>}
        </HStack>
        <Spacer />
        {signed ? <Button size="sm" mr={3} onClick={doSignOut}>Sign Out</Button> : null}
        <IconButton aria-label="Toggle color mode" onClick={toggleColorMode} icon={colorMode === 'light' ? <MoonIcon/> : <SunIcon/>} />
      </Flex>
    </MotionBox>
  )
}
