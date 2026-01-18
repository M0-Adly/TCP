import React, {useEffect, useState, useRef} from 'react'
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, Input, HStack, useToast, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from '@chakra-ui/react'
import { apiFetch } from '../lib/api'

export default function Library(){
  const [rows, setRows] = useState<any[]>([])
  const [filter, setFilter] = useState('')
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const cancelRef = useRef(null)
  const toast = useToast()
  const load = async ()=>{
    const res = await apiFetch('/library')
    if(res.ok){ const j = await res.json(); setRows(j) }
    else toast({title:'Please sign in', status:'warning'})
  }
  useEffect(()=>{ load() },[])

  const remove = async (id:string)=>{
    await apiFetch('/library/' + id, {method:'DELETE'})
    toast({title:'Deleted', status:'success'})
    setConfirmId(null)
    load()
  }

  const exportCsv = ()=> { window.location.href = '/api/library/export?format=csv' }
  const exportPdf = ()=> { window.location.href = '/api/library/export?format=pdf' }

  const rowsFiltered = rows.filter(r => (r.text + ' ' + r.translation).toLowerCase().includes(filter.toLowerCase()))

  return (
    <Box maxW="900px" mx="auto">
      <Heading mb={4}>Library</Heading>
      <HStack mb={4}><Input placeholder="Search" value={filter} onChange={e=>setFilter(e.target.value)}/><Button onClick={exportCsv}>Export CSV</Button><Button onClick={exportPdf}>Export PDF</Button></HStack>
      <Table>
        <Thead><Tr><Th>Word</Th><Th>Translation</Th><Th>Date</Th><Th></Th></Tr></Thead>
        <Tbody>
          {rowsFiltered.map((r:any)=> <Tr key={r._id}><Td>{r.text}</Td><Td>{r.translation}</Td><Td>{new Date(r.createdAt).toLocaleString()}</Td><Td><Button size="sm" colorScheme="red" onClick={()=>setConfirmId(r._id)}>Delete</Button></Td></Tr>)}
        </Tbody>
      </Table>

      <AlertDialog isOpen={!!confirmId} leastDestructiveRef={cancelRef} onClose={()=>setConfirmId(null)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">Delete translation</AlertDialogHeader>
            <AlertDialogBody>Are you sure you want to delete this translation? This action cannot be undone.</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={()=>setConfirmId(null)}>Cancel</Button>
              <Button colorScheme="red" onClick={()=>confirmId && remove(confirmId)} ml={3}>Delete</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

    </Box>
  )
}
