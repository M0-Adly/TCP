import React from 'react'
import { Box, Text } from '@chakra-ui/react'

export default function Logo(){
  return (
    <Box display="flex" alignItems="center">
      <Box w={8} h={8} bgGradient="linear(to-br, brand.500, brand.700)" borderRadius="md" mr={3} />
      <Text fontWeight="bold">Translator</Text>
    </Box>
  )
}
