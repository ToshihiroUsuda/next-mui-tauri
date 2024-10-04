import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Input } from '@mui/material'
import { open } from '@tauri-apps/api/dialog'
import { exists, removeFile, writeTextFile } from '@tauri-apps/api/fs'
import { emit, listen } from '@tauri-apps/api/event'

type WatcherEvent = {
  eventType: string
  path: string
}

export const TauriFunctions = () => {
  const [directory, setDirectory] = useState('')
  const [textContent, setTextContent] = useState('')
  const [eventLog, setEventLog] = useState(new Array<string>())

  const onClicked = async () => {
    const selected = await open({
      directory: true,
    })

    if (typeof selected === 'string') {
      setDirectory(selected)
    }
  }

  useEffect(() => {
    ;(async () => {
      if (directory !== '') {
        await emit('watch', directory)
      }
    })()

    return () => {
      ;(async () => {
        if (directory !== '') {
          await emit('unwatch', directory)
        }
      })()
    }
  }, [directory])

  useEffect(() => {
    const unlisten = (async () => {
      return await listen('watcher_emit', (event) => {
        setEventLog((prev) => [...prev, JSON.stringify(event.payload)])
      })
    })()
    return () => {
      ;(async () => {
        ;(await unlisten)()
      })()
    }
  }, [])

  return (
    <Box m={2}>
      <Button variant='contained' onClick={onClicked}>
        Select Folder
      </Button>
      <Typography variant='h6'>{directory || 'not selected'}</Typography>
      <Box flexDirection='row'>
        <Input
          multiline
          onChange={(e) => {
            setTextContent(e.target.value)
          }}
        />
        <Button
          variant='contained'
          sx={{ ml: 1 }}
          onClick={async () => {
            if (directory !== '') {
              writeTextFile([directory, 'test.txt'].join('/'), textContent)
            }
          }}
        >
          write
        </Button>
        <Button
          variant='contained'
          color='secondary'
          sx={{ ml: 1 }}
          onClick={async () => {
            const filePath = [directory, 'test.txt'].join('/')
            if (directory !== '' && (await exists(filePath))) {
              removeFile(filePath)
            }
          }}
        >
          delete
        </Button>
      </Box>
      <Typography variant='h6'>{textContent || 'not input'}</Typography>

      <Box p={2} bgcolor={'gray'} borderRadius={1} height={200} overflow={'scroll'}>
        {eventLog.map((log, index) => (
          <Typography color='white' key={index}>
            {log}
          </Typography>
        ))}
      </Box>
    </Box>
  )
}
