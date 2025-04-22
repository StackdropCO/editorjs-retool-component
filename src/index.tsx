import './editorOverrides.css'

import React, { useEffect, useRef } from 'react'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Quote from '@editorjs/quote'
import CodeTool from '@editorjs/code'
import Marker from '@editorjs/marker'
import Checklist from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code'
import type { FC } from 'react'
import { Retool } from '@tryretool/custom-component-support'

export const EditorComponent: FC = () => {
  const editorRef = useRef<HTMLDivElement>(null)
  const editorInstance = useRef<EditorJS | null>(null)
  const hasInitialized = useRef(false)

  const [editorContent, setEditorContent] = Retool.useStateString({
    name: 'editorContent'
  })
  const [savedData, setSavedData] = Retool.useStateString({ name: 'savedData' })

  const [backgroundColor, setBackgroundColor] = Retool.useStateString({
    name: 'backgroundColor'
  })

  const [textColor, setTextColor] = Retool.useStateString({
    name: 'textColor'
  })

  useEffect(() => {
    if (!editorRef.current || hasInitialized.current) return

    let parsedData = {}
    if (savedData) {
      try {
        parsedData = JSON.parse(savedData)
      } catch (error) {
        console.error('Error parsing savedData:', error)
      }
    }

    editorInstance.current = new EditorJS({
      holder: editorRef.current,
      placeholder: 'Start typing here...',
      data: parsedData,
      tools: {
        header: {
          class: Header,
          inlineToolbar: ['marker', 'link']
        },
        list: {
          class: List,
          inlineToolbar: true
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: "Quote's author"
          }
        },
        code: CodeTool,
        marker: {
          class: Marker,
          shortcut: 'CMD+SHIFT+M'
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true
        },
        delimiter: Delimiter,
        inlineCode: InlineCode
      },
      onChange: async () => {
        if (!editorInstance.current) return
        try {
          const data = await editorInstance.current.save()
          const jsonData = JSON.stringify(data)
          setEditorContent(jsonData)
        } catch (error) {
          console.error('Error saving editor data:', error)
        }
      }
    })

    hasInitialized.current = true

    return () => {
      if (editorInstance.current) {
        try {
          editorInstance.current.destroy()
        } catch (err) {
          console.error('Error destroying editor instance', err)
        }
      }
    }
  }, [savedData, setEditorContent])

  return (
    <div style={{ fontFamily: 'Lexend, sans-serif' }}>
      <div
        id="editorjs"
        ref={editorRef}
        style={{
          padding: '16px',
          height: '100%',
          backgroundColor: backgroundColor || '#f8fafc',
          color: textColor || '#000',
          borderRadius: '8px'
        }}
      ></div>
    </div>
  )
}
