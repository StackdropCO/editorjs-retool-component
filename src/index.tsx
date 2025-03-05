import React, { useEffect, useRef } from 'react'
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Quote from '@editorjs/quote'
import CodeTool from '@editorjs/code'
import Marker from '@editorjs/marker'
import Checklist from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code'
import type { FC } from 'react'
import '@fontsource/lexend';

import { Retool } from '@tryretool/custom-component-support'

export const EditorComponent: FC = () => {
  const editorRef = useRef<HTMLDivElement>(null)
  const editorInstance = useRef<EditorJS | null>(null)

  const [name, _setName] = Retool.useStateString({
    name: 'name'
  })

  useEffect(() => {
    if (editorRef.current && !editorInstance.current) {
      editorInstance.current = new EditorJS({
        holder: editorRef.current,
        placeholder: 'Start typing here...',

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
        }
      })
    }

    // Cleanup function to destroy the editor instance on unmount.
    return () => {
      if (editorInstance.current) {
        editorInstance.current
          .destroy()
          .catch((error) => console.error('Error destroying editor instance', error))
      }
    }
  }, [])

  return (
    <div style={{ fontFamily: 'Lexend, sans-serif' }}>
      <div>Hello {name}!</div>
      <div
        id="editorjs"
        ref={editorRef}
        style={{ padding: '10px' }}
      ></div>
    </div>
  )
};