import React, { useEffect, useState, useRef } from 'react'
import {
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, Input, HStack, useToast,
  AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, FormControl, FormLabel,
  IconButton, Tooltip, useColorModeValue, Text
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon, EditIcon, DownloadIcon } from '@chakra-ui/icons'
import { apiFetch } from '../lib/api'

import { speak } from '../lib/tts'

export default function Library() {
  const [rows, setRows] = useState<any[]>([])
  const [filter, setFilter] = useState('')
  const [confirmId, setConfirmId] = useState<string | null>(null)

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRow, setEditingRow] = useState<any | null>(null)
  const [wordInput, setWordInput] = useState('')
  const [translationInput, setTranslationInput] = useState('')

  const cancelRef = useRef(null)
  const toast = useToast()

  // Styling
  const glassBg = useColorModeValue('whiteAlpha.800', 'whiteAlpha.100')
  const glassBorder = useColorModeValue('gray.200', 'whiteAlpha.200')

  const load = async () => {
    const res = await apiFetch('/library')
    if (res.ok) { const j = await res.json(); setRows(j) }
    else if (res.status === 401) { /* handled by redirect usually or toast */ }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    await apiFetch('/library/' + id, { method: 'DELETE' })
    toast({ title: 'Deleted', status: 'success' })
    setConfirmId(null)
    load()
  }

  const openAdd = () => {
    setEditingRow(null)
    setWordInput('')
    setTranslationInput('')
    setIsModalOpen(true)
  }

  const openEdit = (row: any) => {
    setEditingRow(row)
    setWordInput(row.text)
    setTranslationInput(row.translation)
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!wordInput || !translationInput) return

    try {
      if (editingRow) {
        // Edit Mode
        const res = await apiFetch('/library/' + editingRow._id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: wordInput, translation: translationInput })
        })
        if (res.ok) toast({ title: 'Updated', status: 'success' })
        else toast({ title: 'Update failed', status: 'error' })
      } else {
        // Add Mode
        const res = await apiFetch('/library', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: wordInput,
            translation: translationInput,
            sourceLang: 'auto', // defaulting
            targetLang: 'auto'
          })
        })
        if (res.ok) toast({ title: 'Added', status: 'success' })
        else toast({ title: 'Failed to add', status: 'error' })
      }
      setIsModalOpen(false)
      load()
    } catch (e) { toast({ title: 'Error', status: 'error' }) }
  }

  const exportCsv = () => { window.location.href = '/api/library/export?format=csv' }
  const exportPdf = () => { window.location.href = '/api/library/export?format=pdf' }

  const rowsFiltered = rows.filter(r => (r.text + ' ' + r.translation).toLowerCase().includes(filter.toLowerCase()))

  return (
    <Box maxW="1000px" mx="auto" px={4} py={8}>
      <HStack justifyContent="space-between" mb={8}>
        <Box>
          <Heading size="lg" mb={2}>My Dictionary</Heading>
          <Text color="gray.500">Manage your saved words and study them.</Text>
        </Box>
        <Button leftIcon={<AddIcon />} colorScheme="brand" onClick={openAdd}>Add Word</Button>
      </HStack>

      <Box
        p={6}
        bg={glassBg}
        borderRadius="xl"
        border="1px solid"
        borderColor={glassBorder}
        backdropFilter="blur(12px)"
        boxShadow="xl"
      >
        <HStack mb={6} spacing={4}>
          <Input
            placeholder="Search your dictionary..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            bg="whiteAlpha.100"
            border="1px solid"
            borderColor="whiteAlpha.300"
            _focus={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)' }}
          />
          <Button leftIcon={<DownloadIcon />} variant="outline" onClick={exportCsv}>CSV</Button>
          <Button leftIcon={<DownloadIcon />} variant="outline" onClick={exportPdf}>PDF</Button>
        </HStack>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Word</Th>
                <Th>Translation</Th>
                <Th>Listen</Th>
                <Th>Date</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rowsFiltered.map((r: any) => (
                <Tr key={r._id} _hover={{ bg: 'whiteAlpha.50' }}>
                  <Td fontWeight="bold" fontSize="lg">{r.text}</Td>
                  <Td fontSize="lg" color="brand.200">{r.translation}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <Tooltip label="Pronounce Word">
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => speak(r.text, /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(r.text) ? 'ar' : 'en')}
                        >
                          🔊
                        </Button>
                      </Tooltip>
                      <Tooltip label="Pronounce Translation">
                        <Button
                          size="xs"
                          variant="ghost"
                          colorScheme="brand"
                          onClick={() => speak(r.translation, /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(r.translation) ? 'ar' : 'en')}
                        >
                          🔊
                        </Button>
                      </Tooltip>
                    </HStack>
                  </Td>
                  <Td fontSize="sm" color="gray.500">{new Date(r.createdAt).toLocaleDateString()}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Edit"
                        icon={<EditIcon />}
                        size="sm"
                        onClick={() => openEdit(r)}
                      />
                      <IconButton
                        aria-label="Delete"
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => setConfirmId(r._id)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
              {rowsFiltered.length === 0 && (
                <Tr>
                  <Td colSpan={5} textAlign="center" py={8} color="gray.500">
                    No words found. Add some or change your search!
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent>
          <ModalHeader>{editingRow ? 'Edit Word' : 'Add New Word'}</ModalHeader>
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Word / Phrase</FormLabel>
              <Input value={wordInput} onChange={e => setWordInput(e.target.value)} placeholder="e.g. Hello" />
            </FormControl>
            <FormControl>
              <FormLabel>Translation</FormLabel>
              <Input value={translationInput} onChange={e => setTranslationInput(e.target.value)} placeholder="e.g. Arabic translation" />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button colorScheme="brand" onClick={handleSave}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation */}
      <AlertDialog isOpen={!!confirmId} leastDestructiveRef={cancelRef} onClose={() => setConfirmId(null)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">Delete Word</AlertDialogHeader>
            <AlertDialogBody>Are you sure? This cannot be undone.</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setConfirmId(null)}>Cancel</Button>
              <Button colorScheme="red" onClick={() => confirmId && handleDelete(confirmId)} ml={3}>Delete</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

    </Box>
  )
}
