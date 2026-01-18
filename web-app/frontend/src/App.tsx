import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import Home from './pages/Home'
import Translator from './pages/Translator'
import Library from './pages/Library'
import SignIn from './pages/SignIn'
import Profile from './pages/Profile'
import NavBar from './components/NavBar'

export default function App(){
  return (
    <BrowserRouter>
      <NavBar />
      <Box p={6}>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/translator' element={<Translator/>} />
          <Route path='/library' element={<Library/>} />
          <Route path='/signin' element={<SignIn/>} />
          <Route path='/profile' element={<Profile/>} />
        </Routes>
      </Box>
    </BrowserRouter>
  )
}
